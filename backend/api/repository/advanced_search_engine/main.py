import os
from dotenv import load_dotenv
import csv
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
from openai import AzureOpenAI

# Load environment variables
load_dotenv()

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("API_VERSION_MINI"),
    azure_endpoint=os.getenv("ENDPOINT_URL")
)

def precompute_and_store_embeddings(options, csv_file, deployment_name="text-embedding-3-small"):
    """
    Precompute embeddings for each option and store them in a CSV file.
    """
    with open(csv_file, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["id", "display_name", "only_id", "embedding"])

        # Compute embeddings in batches
        batch_size = 50
        for i in range(0, len(options), batch_size):
            batch = options[i:i + batch_size]
            texts = [option["display_name"] for option in batch]
            
            # Get embeddings using Azure OpenAI
            embeddings = []
            for text in texts:
                response = client.embeddings.create(
                    model=deployment_name,
                    input=text
                )
                embeddings.append(response.data[0].embedding)

            for option, embedding in zip(batch, embeddings):
                writer.writerow([
                    option["id"],
                    option["display_name"],
                    option["only_id"],
                    json.dumps(embedding)
                ])
    
    print(f"Embeddings stored in {csv_file}")

def load_embeddings_from_csv(csv_file):
    """
    Load options and their embeddings from the CSV file.
    """
    options = []
    embeddings = []
    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            options.append({
                "id": row["id"],
                "display_name": row["display_name"],
                "only_id": row["only_id"]
            })
            embeddings.append(json.loads(row["embedding"]))
    return options, np.array(embeddings)

def get_embeddings(texts, deployment_name="text-embedding-3-small"):
    """
    Generate embeddings for a list of texts using Azure OpenAI embeddings API.
    """
    embeddings = []
    for text in texts:
        response = client.embeddings.create(
            model=deployment_name,
            input=text
        )
        embeddings.append(response.data[0].embedding)
    return embeddings

def filter_with_semantic_search(query, options, embeddings, top_k=10):
    """
    Perform semantic search to narrow down options based on a query.
    """
    query_embedding = get_embeddings([query])[0]
    similarities = cosine_similarity([query_embedding], embeddings)[0]
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    return [options[i] for i in top_indices]

def fine_tune_with_llm(query, options, deployment_name="gpt-4o"):
    """
    Use Azure OpenAI to fine-tune the selection from the filtered options.
    """
    options_str = "\n".join([
        f"{option['display_name']} (ID: {option['only_id']})" 
        for option in options
    ])

    messages = [
        {"role": "system", "content": "You are an assistant that selects the most relevant options from a list based on a user query."},
        {"role": "user", "content": f"Here is the query: '{query}'. From the following options, choose the most relevant ones:\n\n{options_str}"}
    ]

    response = client.chat.completions.create(
        model=deployment_name,
        messages=messages
    )

    # Parse the response
    chosen_lines = response.choices[0].message.content.strip().split("\n")
    
    # Convert to structured output
    chosen_options = []
    for line in chosen_lines:
        if " (ID: " in line:
            try:
                display_name, only_id = line.split(" (ID: ")
                display_name = display_name.lstrip("0123456789. ").strip()
                display_name = display_name.lstrip("- **").strip()
                chosen_options.append({
                    "display_name": display_name,
                    "only_id": only_id.strip().replace(")**", "")
                })
            except ValueError:
                print(f"Skipping malformed line: {line}")
        else:
            print(f"Skipping malformed line: {line}")

    return chosen_options

# Example usage
if __name__ == "__main__":
    csv_file = "options_with_embeddings.csv"
    
    # Load embeddings and options
    loaded_options, loaded_embeddings = load_embeddings_from_csv(csv_file)
    
    # Example query
    query = "How can machine learning algorithms improve the accuracy of software bug detection?"
    
    # Use semantic search to pre-filter options
    top_options = filter_with_semantic_search(
        query, 
        loaded_options, 
        loaded_embeddings, 
        top_k=20
    )
    
    # Use LLM for final selection
    final_options = fine_tune_with_llm(
        query, 
        top_options, 
        deployment_name=os.getenv("DEPLOYMENT_NAME")
    )
    
    print("Final Relevant Options:", final_options)