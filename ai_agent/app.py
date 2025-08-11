import os
import hashlib
import json
from threading import Thread, Lock
from typing import List
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    AIMessage,
    ToolMessage,
    BaseMessage,
)
from langchain_core.tools import Tool
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings  # noqa: F401
from langchain_community.tools.tavily_search import TavilySearchResults
from langfuse.langchain import CallbackHandler
from langgraph.graph import StateGraph
from typing_extensions import TypedDict
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, UnstructuredPDFLoader
from werkzeug.utils import secure_filename


# === Load environment variables ===
load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
GEMINIAI_API_KEY = os.environ.get("GEMINIAI_API_KEY")

# === Flask setup ===
app = Flask(__name__)
CORS(app)

# === LangChain callbacks ===
langfuse_handler = CallbackHandler()

# === LLM Configuration (Choose one) ===
llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0.2,
    # streaming=True,
    openai_api_key=OPENAI_API_KEY,
    # callbacks=[langfuse_handler],
)
# 🔁 Option 2: Gemini (uncomment to use)
# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash",
#     temperature=0.2,
#     streaming=True,
#     google_api_key=GEMINIAI_API_KEY,
#     callbacks=[langfuse_handler],
# )

# === Paths / Globals ===
UPLOAD_FOLDER = "uploads"
INDEX_DIR = "faiss_index"
INDEX_META_FILE = "faiss_index/meta.json"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(INDEX_DIR, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB

# In-memory storage for uploaded filenames (for demonstration purposes)
# In a real application, this would be a database
uploaded_files_metadata = []

ALLOWED_EXTENSIONS = {
    "txt",
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "docx",
    "pptx",
    "xlsx",
    "md",
}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


retriever = None
retriever_lock = Lock()


# === 1. Document Loading / Indexing ===
def compute_file_hash(path: str) -> str:
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def load_index_metadata():
    if os.path.exists(INDEX_META_FILE):
        with open(INDEX_META_FILE, "r") as f:
            return json.load(f)
    return {}


def save_index_metadata(meta):
    os.makedirs(os.path.dirname(INDEX_META_FILE), exist_ok=True)
    with open(INDEX_META_FILE, "w") as f:
        json.dump(meta, f)


def get_or_create_faiss_index(
    folder_path: str, index_path: str = "faiss_index"
) -> FAISS:
    embedding = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    # embedding = GoogleGenerativeAIEmbeddings(
    #     model="models/embedding-001",
    #     google_api_key=GEMINIAI_API_KEY,
    # )
    index_exists = os.path.exists(index_path)
    existing_meta = load_index_metadata()
    new_meta = {}
    updated_docs = []

    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext not in {".txt", ".md", ".pdf"}:
                continue
            file_path = os.path.join(dirpath, filename)
            try:
                file_hash = compute_file_hash(file_path)
                new_meta[file_path] = file_hash
                if existing_meta.get(file_path) != file_hash or not index_exists:
                    if ext in [".txt", ".md"]:
                        loader = TextLoader(file_path, encoding="utf-8")
                    elif ext == ".pdf":
                        loader = UnstructuredPDFLoader(file_path)
                    else:
                        continue
                    docs = loader.load()
                    for doc in docs:
                        doc.metadata["source"] = file_path
                        doc.metadata["hash"] = file_hash
                    updated_docs.extend(docs)
            except Exception as e:
                print(f"❌ Error loading {file_path}: {e}")

    if not index_exists:
        print("🆕 Creating new FAISS index...")
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(updated_docs)
        vectorstore = FAISS.from_documents(chunks, embedding)
    elif updated_docs:
        print("🔄 Updating FAISS index with changed or new documents...")
        vectorstore = FAISS.load_local(
            index_path, embedding, allow_dangerous_deserialization=True
        )
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        new_chunks = splitter.split_documents(updated_docs)
        vectorstore.add_documents(new_chunks)
    else:
        print("✅ FAISS index is already up to date.")
        vectorstore = FAISS.load_local(
            index_path, embedding, allow_dangerous_deserialization=True
        )
    vectorstore.save_local(index_path)
    save_index_metadata(new_meta)
    return vectorstore


# === 3. Tool Definition ===
def retrieve_documents(query: str) -> str:
    global retriever
    docs = retriever.invoke(query)
    if not docs:
        return "No relevant documents found."
    return "\n\n".join([doc.page_content for doc in docs])


tavily_tool = TavilySearchResults()
tools = [
    Tool.from_function(
        func=retrieve_documents,
        name="retrieve_documents",
        description="Retrieve document chunks relevant to a query.",
    ),
    Tool.from_function(
        func=tavily_tool.run,
        name="tavily_web_search",
        description="Search the web using Tavily. Useful for current events or factual updates.",
    ),
]
llm_with_tools = llm.bind_tools(tools)


# === LangGraph Agent State and Graph Setup ===
# Define the structure of the agent's state
class AgentState(TypedDict):
    messages: List[BaseMessage]


# System prompt for the agent
SYS_PROMPT = (
    "You are an assistant that must ALWAYS use the 'retrieve_documents' tool first "
    "to answer any user question, regardless of the topic. Your primary knowledge "
    "source is the internal document collection indexed in Chroma.\n\n"
    "Rules:\n"
    "1. For EVERY question, call 'retrieve_documents' first.\n"
    "2. If 'retrieve_documents' returns no relevant information, then decide whether to:\n"
    "   - Use 'tavily_web_search' if the question is about external, current, or public facts.\n"
    "   - Or answer from your own general model knowledge if it’s a conceptual or reasoning question.\n"
    "3. Never answer from your own knowledge without first calling 'retrieve_documents'.\n"
    "4. When answering, clearly state when information comes from internal documents versus external search."
)


# Agent node (LLM inference step)
def llm_node(state: AgentState) -> AgentState:
    messages = [SystemMessage(content=SYS_PROMPT)] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": state["messages"] + [response]}


# Tool node (handles tool invocations from AI)
def tool_node(state: AgentState) -> AgentState:
    ai_msg = state["messages"][-1]
    tool_messages = []
    for call in ai_msg.tool_calls:
        tool_name = call["name"]
        tool_args = call.get("args", {})
        for tool in tools:
            if tool.name == tool_name:
                try:
                    result = tool.invoke(tool_args)
                    tool_messages.append(
                        ToolMessage(tool_call_id=call["id"], content=str(result))
                    )
                except Exception as e:
                    tool_messages.append(
                        ToolMessage(
                            tool_call_id=call["id"],
                            content=f"Error while calling tool: {e}",
                        )
                    )
                break
            else:
                tool_messages.append(
                    ToolMessage(
                        tool_call_id=call["id"],
                        content=f"No tool named '{tool_name}' was found.",
                    )
                )
    return {"messages": state["messages"] + tool_messages}


# Decide if a tool should be used after the AI responds
def should_use_tool(state: AgentState) -> str:
    last = state["messages"][-1]
    if isinstance(last, AIMessage) and last.tool_calls:
        return "tools"
    return "__end__"


# Build LangGraph
graph = StateGraph(AgentState)
graph.add_node("agent", llm_node)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_use_tool)
graph.add_edge("tools", "agent")

# Compile LangGraph with streaming support
rag_app = graph.compile()


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")
    history = data.get("history", [])

    # Build message state
    messages: List[BaseMessage] = []
    for msg in history:
        role = msg.get("role")
        content = msg.get("content")
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))

    messages.append(HumanMessage(content=user_input))
    state = {"messages": messages}

    # 🔁 Use blocking .invoke instead of async .stream
    result = rag_app.invoke(state)
    last_msg = result["messages"][-1]

    # Return the assistant reply
    return jsonify({"response": last_msg.content})


# Error handlers
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled exception: {e}", exc_info=True)  # Fixed typo here
    return jsonify(
        {"error": "An unexpected server error occurred", "details": str(e)}
    ), 500


@app.errorhandler(413)
def payload_too_large(e):
    app.logger.warning(f"Payload too large: {e}")
    return jsonify({"error": "File too large. Maximum allowed size is 16MB."}), 413


def rebuild_retriever():
    global retriever
    vs = get_or_create_faiss_index(UPLOAD_FOLDER, INDEX_DIR)
    with retriever_lock:
        retriever = vs.as_retriever(search_kwargs={"k": 4})
    print("🔁 Retriever refreshed.")


# First boot build
rebuild_retriever()


@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        app.logger.info("Received file upload request.")
        if "file" not in request.files:
            app.logger.warning("No 'file' part in request.files. Returning 400.")
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]
        app.logger.info(f"File received: {file.filename}")

        if file.filename == "":
            app.logger.warning("No selected file (filename is empty). Returning 400.")
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

            # Check if file already exists to avoid overwriting or duplicate entries
            if os.path.exists(filepath):
                app.logger.info(
                    f"File '{filename}' already exists at {filepath}, skipping save."
                )
            else:
                file.save(filepath)
                app.logger.info(f"File '{filename}' saved to {filepath}")

            # Add to in-memory list if not already present
            # This list is now primarily for the Flask app's internal tracking,
            # as the frontend lists files directly from the UPLOAD_FOLDER.
            if {"id": filename, "name": filename} not in uploaded_files_metadata:
                uploaded_files_metadata.append({"id": filename, "name": filename})
                app.logger.info(
                    f"Added '{filename}' to uploaded_files_metadata. Current files: {uploaded_files_metadata}"
                )
            else:
                app.logger.info(f"'{filename}' already in metadata, skipping add.")

            # Refresh retriever in background
            Thread(target=rebuild_retriever, daemon=True).start()
            return jsonify(
                {"message": "File uploaded successfully", "filename": filename}
            ), 200
        else:
            app.logger.warning(
                f"File type not allowed for '{file.filename}'. Returning 400."
            )
            return jsonify({"error": "File type not allowed"}), 400
    except Exception as e:
        app.logger.error(f"Error during file upload: {e}", exc_info=True)
        return jsonify(
            {"error": "An error occurred during file upload", "details": str(e)}
        ), 500


@app.route("/files", methods=["GET"])
def list_files():
    try:
        app.logger.info("Received list files request.")
        items = []
        for fn in os.listdir(UPLOAD_FOLDER):
            path = os.path.join(UPLOAD_FOLDER, fn)
            if os.path.isfile(path):
                items.append({"id": fn, "name": fn})
        app.logger.info(f"List of files: {items}")
        return jsonify(items), 200
    except Exception as e:
        app.logger.error(f"Error listing files: {e}", exc_info=True)
        return jsonify(
            {"error": "Failed to retrieve file list", "details": str(e)}
        ), 500


@app.route("/files/<filename>", methods=["DELETE"])
def delete_file(filename):
    try:
        app.logger.info(f"Received delete request for file: {filename}")
        # Remove from in-memory list (optional, as frontend lists from disk)
        global uploaded_files_metadata
        uploaded_files_metadata = [
            f for f in uploaded_files_metadata if f["id"] != filename
        ]

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            app.logger.info(f"File '{filename}' deleted from disk: {filepath}.")
            # Reindex after deletion too
            Thread(target=rebuild_retriever, daemon=True).start()
            return jsonify({"message": f"File '{filename}' deleted successfully"}), 200
        else:
            app.logger.warning(
                f"File '{filename}' not found on disk for deletion: {filepath}."
            )
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting file '{filename}': {e}", exc_info=True)
        return jsonify(
            {"error": "An error occurred during file deletion", "details": str(e)}
        ), 500


# === Run server ===
if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
