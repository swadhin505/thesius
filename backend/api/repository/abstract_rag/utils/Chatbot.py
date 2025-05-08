import os
# from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from langchain_openai import ChatOpenAI, AzureChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain import hub
import os

class MultiTenantRetrievalChainManager:
    """
    A class to manage unique retrieval chains for multiple users.
    """
    def __init__(self):
        """
        Initialize the MultiTenantRetrievalChainManager.

        Args:
            shared_api_key (str): The shared OpenAI API key for all users.
            model_name (str): The name of the language model to use.
            temperature (float): The temperature setting for the language model.
        """
        self.shared_api_key = os.getenv("AZURE_OPENAI_API_KEY")
        self.model_name = os.getenv("DEPLOYMENT_NAME_MINI")
        self.endpoint_url = os.getenv("ENDPOINT_URL_MINI")
        self.api_version = os.getenv("API_VERSION_MINI")
        self.temperature = 0.0
        self.retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
        self.user_chains = {}

    def get_or_create_chain(self, user_id, docsearch, create_new_chain=False):
        """
        Retrieve or create a retrieval chain for a specific user.

        Args:
            user_id (str): The unique identifier for the user.
            docsearch: The document search object unique to the user.

        Returns:
            RetrievalChain: The user's retrieval chain instance.
        """
        if (user_id not in self.user_chains) or create_new_chain:

            # if docsearch input is new but the user exists we need to delete the data first:
            if user_id in self.user_chains.keys(): del self.user_chains[user_id]

            # Create a retriever from the document search object
            retriever = docsearch.as_retriever()

            # Initialize the language model with the shared API key
            llm = AzureChatOpenAI(azure_deployment=self.model_name, azure_endpoint=self.endpoint_url, api_version=self.api_version)

            # Create a chain to combine documents
            combine_docs_chain = create_stuff_documents_chain(llm, self.retrieval_qa_chat_prompt)

            # Create the retrieval chain
            retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

            # Store the retrieval chain for the user
            self.user_chains[user_id] = retrieval_chain

        return self.user_chains[user_id]

    def delete_user_chain(self, user_id):
        """
        Delete a retrieval chain for a specific user.

        Args:
            user_id (str): The unique identifier for the user.

        Returns:
            bool: True if the chain was successfully deleted, False if the user_id was not found.
        """
        if user_id in self.user_chains:
            del self.user_chains[user_id]
            return True
        return False

# # FastAPI application
# app = FastAPI()

# # Initialize the chain manager with a shared API key
# shared_api_key = "your-shared-api-key"  # Replace with your OpenAI API key
# chain_manager = MultiTenantRetrievalChainManager(shared_api_key)

# class QueryRequest(BaseModel):
#     user_id: str
#     docsearch_data: dict
#     query: str

# @app.post("/ask")
# def ask_question(request: QueryRequest):
#     """
#     Endpoint for users to ask questions using their unique retrieval chain.

#     Args:
#         request (QueryRequest): Contains user_id, docsearch data, and the query.

#     Returns:
#         dict: The response containing the answer to the query.
#     """
#     try:
#         # Simulate creating a docsearch instance from provided data
#         docsearch = create_docsearch_instance(request.docsearch_data)

#         # Get or create a retrieval chain for the user
#         retrieval_chain = chain_manager.get_or_create_chain(request.user_id, docsearch)

#         # Use the retrieval chain to process the query
#         response = retrieval_chain.run(request.query)

#         return {"answer": response}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# def create_docsearch_instance(docsearch_data):
#     """
#     Simulates creating a docsearch instance from the provided data.

#     Args:
#         docsearch_data (dict): Data to initialize a docsearch instance.

#     Returns:
#         Docsearch: A simulated docsearch instance.
#     """
#     # Replace this with actual docsearch creation logic
#     return docsearch_data  # Placeholder for a real instance
