"""
Flask RAG Server with LangChain, FAISS, and Tool-augmented LLM
--------------------------------------------------------------
Features:
1. File upload, listing, and deletion.
2. Document indexing with FAISS (incremental updates).
3. Retrieval-Augmented Generation pipeline using LangGraph.
4. Tools: Document retriever + Tavily Web Search.
5. API endpoints: /chat, /upload, /files, /files/<filename>.
"""

# =========================================================
# 1. Imports & Environment Setup
# =========================================================
import os
import json
import hashlib
from threading import Thread, Lock
from typing import List
from typing_extensions import TypedDict

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
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
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader, UnstructuredPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langfuse.langchain import CallbackHandler
from langgraph.graph import StateGraph
from tavily import TavilyClient

# =========================================================
# 2. Load Environment Variables
# =========================================================
load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
GEMINIAI_API_KEY = os.environ.get("GEMINIAI_API_KEY")

# =========================================================
# 3. Flask App & Config
# =========================================================
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
INDEX_DIR = "faiss_index"
INDEX_META_FILE = "faiss_index/meta.json"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(INDEX_DIR, exist_ok=True)

app.config.update(
    {
        "UPLOAD_FOLDER": UPLOAD_FOLDER,
        "MAX_CONTENT_LENGTH": 16 * 1024 * 1024,  # 16 MB
    }
)

# Allowed file types
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
uploaded_files_metadata = []  # in-memory file metadata

# =========================================================
# 4. LLM Configuration
# =========================================================
langfuse_handler = CallbackHandler()

llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0.2,
    # callbacks= CallbackHandler,
    openai_api_key=OPENAI_API_KEY,
)

# Alternative: Gemini
# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash",
#     temperature=0.2,
#     google_api_key=GEMINIAI_API_KEY,
# )


# =========================================================
# 5. Utility Functions
# =========================================================
def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


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


# =========================================================
# 6. FAISS Index Management
# =========================================================
retriever = None
retriever_lock = Lock()


def get_or_create_faiss_index(folder_path: str, index_path: str = INDEX_DIR) -> FAISS:
    embedding = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    index_exists = os.path.exists(index_path)
    existing_meta = load_index_metadata()
    new_meta, updated_docs = {}, []

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
                    loader = (
                        TextLoader(file_path, encoding="utf-8")
                        if ext in [".txt", ".md"]
                        else UnstructuredPDFLoader(file_path)
                    )
                    docs = loader.load()
                    for doc in docs:
                        doc.metadata.update({"source": file_path, "hash": file_hash})
                    updated_docs.extend(docs)
            except Exception as e:
                print(f"❌ Error loading {file_path}: {e}")

    if not index_exists:
        print("🆕 Creating new FAISS index...")
        chunks = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=50
        ).split_documents(updated_docs)
        vectorstore = FAISS.from_documents(chunks, embedding)
    elif updated_docs:
        print("🔄 Updating FAISS index...")
        vectorstore = FAISS.load_local(
            index_path, embedding, allow_dangerous_deserialization=True
        )
        new_chunks = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=50
        ).split_documents(updated_docs)
        vectorstore.add_documents(new_chunks)
    else:
        print("✅ FAISS index is up to date.")
        vectorstore = FAISS.load_local(
            index_path, embedding, allow_dangerous_deserialization=True
        )

    vectorstore.save_local(index_path)
    save_index_metadata(new_meta)
    return vectorstore


def rebuild_retriever():
    global retriever
    vs = get_or_create_faiss_index(UPLOAD_FOLDER, INDEX_DIR)
    with retriever_lock:
        retriever = vs.as_retriever(search_kwargs={"k": 4})
    print("🔁 Retriever refreshed.")


# Initial build
rebuild_retriever()


# =========================================================
# 7. Tools
# =========================================================
def retrieve_documents(query: str) -> str:
    global retriever
    docs = retriever.invoke(query)
    return (
        "\n\n".join([doc.page_content for doc in docs])
        if docs
        else "No relevant documents found."
    )


tavily_client = TavilyClient(api_key=TAVILY_API_KEY)


def tavily_web_search(query: str) -> str:
    resp = tavily_client.search(query, include_answer=True, max_results=5)
    # Customize how you extract useful info from resp
    answer = resp.get("answer")
    results = resp.get("results", [])
    summary = answer or "\n".join(
        f"- {r['title']}: {r.get('content', '')}" for r in results
    )
    return summary or "No results found."


tools = [
    Tool.from_function(
        func=retrieve_documents,
        name="retrieve_documents",
        description="Retrieve document chunks relevant to a query.",
    ),
    Tool.from_function(
        func=tavily_web_search,
        name="tavily_web_search",
        description="Search the web using Tavily via direct Python SDK.",
    ),
]
llm_with_tools = llm.bind_tools(tools)


# =========================================================
# 8. LangGraph Agent Setup
# =========================================================
class AgentState(TypedDict):
    messages: List[BaseMessage]


SYS_PROMPT = (
    "You must ALWAYS use 'retrieve_documents' first before answering any user question.\n"
    "If no relevant documents are found, decide whether to use 'tavily_web_search' or general reasoning.\n"
    "Clearly state when information comes from internal docs vs external search."
)


def llm_node(state: AgentState) -> AgentState:
    messages = [SystemMessage(content=SYS_PROMPT)] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": state["messages"] + [response]}


def tool_node(state: AgentState) -> AgentState:
    ai_msg = state["messages"][-1]
    tool_messages = []
    for call in ai_msg.tool_calls:
        for tool in tools:
            if tool.name == call["name"]:
                try:
                    result = tool.invoke(call.get("args", {}))
                    tool_messages.append(
                        ToolMessage(tool_call_id=call["id"], content=str(result))
                    )
                except Exception as e:
                    tool_messages.append(
                        ToolMessage(tool_call_id=call["id"], content=f"Error: {e}")
                    )
                break
        else:
            tool_messages.append(
                ToolMessage(
                    tool_call_id=call["id"], content=f"No tool named '{call['name']}'"
                )
            )
    return {"messages": state["messages"] + tool_messages}


def should_use_tool(state: AgentState) -> str:
    last = state["messages"][-1]
    return "tools" if isinstance(last, AIMessage) and last.tool_calls else "__end__"


graph = StateGraph(AgentState)
graph.add_node("agent", llm_node)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_use_tool)
graph.add_edge("tools", "agent")

rag_app = graph.compile()


# =========================================================
# 9. API Endpoints
# =========================================================
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")
    history = data.get("history", [])

    messages = [
        HumanMessage(content=msg["content"])
        if msg["role"] == "user"
        else AIMessage(content=msg["content"])
        for msg in history
    ]
    messages.append(HumanMessage(content=user_input))

    result = rag_app.invoke({"messages": messages})
    return jsonify({"response": result["messages"][-1].content})


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed or empty"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    if not os.path.exists(filepath):
        file.save(filepath)
        uploaded_files_metadata.append({"id": filename, "name": filename})

    Thread(target=rebuild_retriever, daemon=True).start()
    return jsonify({"message": "File uploaded successfully", "filename": filename})


@app.route("/files", methods=["GET"])
def list_files():
    items = [
        {"id": fn, "name": fn}
        for fn in os.listdir(UPLOAD_FOLDER)
        if os.path.isfile(os.path.join(UPLOAD_FOLDER, fn))
    ]
    return jsonify(items)


@app.route("/files/<filename>", methods=["DELETE"])
def delete_file(filename):
    global uploaded_files_metadata
    uploaded_files_metadata = [
        f for f in uploaded_files_metadata if f["id"] != filename
    ]

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        Thread(target=rebuild_retriever, daemon=True).start()
        return jsonify({"message": f"File '{filename}' deleted successfully"})
    return jsonify({"error": "File not found"}), 404


# =========================================================
# 10. Error Handlers
# =========================================================
@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": "Server error", "details": str(e)}), 500


@app.errorhandler(413)
def payload_too_large(e):
    return jsonify({"error": "File too large. Max size: 16MB."}), 413


# =========================================================
# 11. Main Entry
# =========================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
