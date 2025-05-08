import time
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone 
import os
from dotenv import load_dotenv
# from .markdown_splitter import md_header_splits

load_dotenv()
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def upload_to_pinecone_vectorstore(documents, index_name, embeddings, namespace):
    """
    Uploads documents to a Pinecone Vector Store.

    Args:
        documents (list): The list of documents to upload.
        index_name (str): The name of the Pinecone index.
        embeddings: The embedding model used for vectorization.
        namespace (str): The namespace to organize vectors in Pinecone.

    Returns:
        dict: Index statistics after upload.
    """
    # Initialize the Pinecone Vector Store
    docsearch = PineconeVectorStore.from_documents(
        documents=documents,
        index_name=index_name,
        embedding=embeddings,
        namespace=namespace,
    )


    # Retrieve and return index statistics
    return docsearch


def delete_namespace_from_index(index_name, namespace):
    """
    Deletes Pinecone Vector Store objects under a namespace.

    Args:
        namespace (str): The namespace where vectors are organized in Pinecone.
        index_name (str): The name of the Pinecone index.

    Returns:
        None
    """
    pc.Index(index_name).delete(delete_all=True, namespace=namespace)


def get_docsearch(index_name, embeddings, namespace):
    """
    Retrieves the Pinecone Vector Store object for querying.

    Args:
        index_name (str): The name of the Pinecone index.
        embeddings: The embedding model used for vectorization.
        namespace (str): The namespace where vectors are organized in Pinecone.

    Returns:
        PineconeVectorStore: The Pinecone vector store for querying or other operations.
    """
    # Ensure Pinecone is initialized
    # if not pc.active():
    #     raise RuntimeError(
    #         "Pinecone client is not initialized. Please initialize before calling this function."
    #     )

    # Retrieve the Pinecone Vector Store object
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name, embedding=embeddings, namespace=namespace
    )

    return docsearch


# Example usage
# namespace = "user_unique_id"
# index_name = "your_pinecone_index"
# embeddings = "your_embedding_model"  # Replace with actual embeddings instance
# documents = md_header_splits  # This is a test split doc

# Call the reusable function
# index_stats = upload_to_pinecone_vectorstore(documents, index_name, embeddings, namespace=namespace)

# Display the index statistics
# print(index_stats)

# Example Usage
# Initialize Pinecone before calling this function
# pinecone.init(api_key="your_api_key", environment="your_environment")
# docsearch = get_docsearch(index_name="your_index", embeddings=your_embedding_model, namespace="your_namespace")
