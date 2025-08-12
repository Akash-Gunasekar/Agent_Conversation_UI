# Conversational AI with RAG

This project combines a Next.js frontend with a Python backend to create a sophisticated conversational AI application. The backend leverages LangChain and a FAISS vector store to implement a Retrieval-Augmented Generation (RAG) pipeline, allowing the AI to answer questions based on a local document collection.

## Features

- **Three-Panel Layout**: A responsive and intuitive UI for chat, history, and contextual data.
- **RAG Pipeline**: The Python backend uses LangChain to orchestrate a RAG pipeline, enabling the AI to pull in relevant information from local documents.
- **FAISS Vector Store**: Documents are indexed in a FAISS vector store for efficient similarity searches.
- **Extensible Tooling**: The LangGraph setup allows for the easy addition of new tools to the AI's capabilities.
- **Choice of LLMs**: The application can be configured to use either OpenAI's GPT-4o or Google's Gemini 1.5 Flash.

## Objective

The goal of this project is to provide a robust and flexible platform for building conversational AI applications that can reason about and answer questions from a specific knowledge base. The combination of a modern frontend and a powerful RAG backend makes it suitable for a wide range of use cases, from customer support bots to internal knowledge base search engines.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js and npm
- Python 3.8+
- An OpenAI API key and/or a Google AI API key

### Installation

1.  **Frontend:**
    - Clone the repository:
      ```sh
      git clone https://github.com/Akash-Gunasekar/Agent_Conversation_UI.git
      ```
    - Install the frontend dependencies:
      ```sh
      npm install
      ```

2.  **Backend:**
    - Navigate to the `ai_agent` directory:
      ```sh
      cd ai_agent
      ```
    - Create and activate a virtual environment:
      ```sh
      python -m venv venv
      source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
      ```
    - Install the required Python packages:
      ```sh
      pip install -r requirements.txt
      ```

### Configuration

1.  Create a `.env` file in the `ai_agent` directory.
2.  Add your API keys to the `.env` file:
    ```
    OPENAI_API_KEY="your_openai_api_key"
    TAVILY_API_KEY="your_tavily_api_key"  # Optional, for web search
    GEMINIAI_API_KEY="your_google_api_key" # Optional, if using Gemini
    ```

### Running the Application

1.  **Run the backend server:**
    - In a terminal, with the virtual environment activated, navigate to the `ai_agent` directory and run:
      ```sh
      python app.py
      ```
    - The backend server will start on `http://localhost:5000`.

2.  **Run the frontend development server:**
    - In a separate terminal, run:
      ```sh
      npm run dev
      ```
    - Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
  
**Made with ❤️ by Akash Gunasekar**

_Star ⭐ this repo if it helped you build something awesome!_
