from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB credentials
MONGO_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")
MONGO_DB = os.getenv("MONGO_DB")

# Connection URI
MONGO_URI = f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}?authSource=admin"

# Initialize MongoDB client
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

collection_name = "search-results"
search_results_collection = db[collection_name]
collection_name = "paper_details"
paper_details_collection = db[collection_name]

"""
# Insert sample data
sample_data = {
    "title": "AI Research Guide",
    "description": "A comprehensive guide for AI research and development.",
    "tags": ["AI", "Machine Learning", "Research"],
    "created_at": "2025-01-24"
}

# Insert into collection
insert_result = collection.insert_one(sample_data)
print(f"Inserted document ID: {insert_result.inserted_id}")

# Fetch and display all documents
for doc in collection.find():
    print(doc)
"""

