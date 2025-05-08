from api.repository.abstract_rag import rag_setup
from api.repository.abstract_rag.utils.Chatbot import MultiTenantRetrievalChainManager
from api.repository.abstract_rag.utils.test_data import dummy_papers
from api.repository.abstract_rag.utils.markdown_generator import organize_papers_to_markdown
from api.repository.abstract_rag.utils.markdown_splitter import split_markdown_by_headers
from api.repository.abstract_rag.utils.vectorstore_operations import upload_to_pinecone_vectorstore

chain_manager = MultiTenantRetrievalChainManager()

user_id = "1"

# data processing
markdown_document = organize_papers_to_markdown(dummy_papers)
md_header_splits = split_markdown_by_headers(markdown_document)

# vectorstore upload
docsearch = upload_to_pinecone_vectorstore(documents=md_header_splits ,index_name=rag_setup.index_name, embeddings=rag_setup.embeddings, namespace=user_id)

# get docsearch
# docsearch = get_docsearch(index_name=rag_setup.index_name, embeddings=rag_setup.embeddings, namespace=user_id)

# prepare the chatbot chain
chain_manager.get_or_create_chain(user_id=user_id, docsearch=docsearch, create_new_chain=True)

# get chain
retriever = chain_manager.user_chains[user_id]

# ask 
answer = retriever.invoke({"input": "what is RAG ? and give relevant sources of your answers, just the paper title"})
print(answer['answer'])