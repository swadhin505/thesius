import requests
import os
from dotenv import load_dotenv
import json
import pandas as pd

load_dotenv()

import requests

import requests

def fetch_openalex_data(search_query, per_page=10, page=1):
    """
    Fetch data from the OpenAlex API.

    Parameters:
        search_query (str): The search term or sentence (e.g., 'What is RAG').
        per_page (int): Number of results per page (default is 1).
        page (int): Page number to fetch (default is 1).

    Returns:
        list: Filtered results with significant values for all selected fields.
    """
    base_url = "https://api.openalex.org/works"
    
    # Constant fields to select
    select_fields = [
        "id",
        "title",
        "abstract_inverted_index",
        "publication_year",
        "primary_topic",
        "referenced_works",
        "cited_by_count",
        "citation_normalized_percentile",
        "open_access",
        "type"
    ]

    # Construct the query parameters
    params = {
        "search": search_query,
        "per-page": per_page,
        "page": page,
        "select": ",".join(select_fields),
        "email": "biswalswaraj88@gmail.com"
    }

    # Make the API request
    response = requests.get(base_url, params=params)
    
    if response.status_code == 200:
        results = response.json().get("results", [])
        # Filter results to include only those with significant values for all fields
        filtered_results = [
            result for result in results
            if all(field in result and result[field] not in [None, "", [], {}] for field in select_fields)
        ]
        return filtered_results
    else:
        response.raise_for_status()



def convert_api_to_first_format(openalex_api_response):
    """
    Convert data from the OpenAlex API format to the Semantic Scholar format.
    """
    results = []

    for item in openalex_api_response:
        oa_status = item.get("open_access", {}).get("oa_status", "CLOSED_ACCESS").upper()
        if oa_status not in ["OPEN_ACCESS", "CLOSED_ACCESS"]:
            oa_status = "CLOSED_ACCESS"

        converted_item = {
            "paperId": item["id"].split("/")[-1],  # Extract ID from URL
            "url": item["id"],
            "title": item.get("title", ""),
            "abstract": " ".join(list(item.get("abstract_inverted_index", {}).keys())[:150]) if item.get("abstract_inverted_index") else "",
            "venue": "",
            "year": item.get("publication_year", None),
            "referenceCount": len(item.get("referenced_works", [])),  # OpenAlex does not provide this directly
            "citationCount": item.get("cited_by_count", 0),
            "citation_normalized_percentile": item.get("citation_normalized_percentile", {}),
            "isOpenAccess": item.get("open_access", {}).get("is_oa", False),
            "openAccessPdf": {
                "url": item.get("open_access", {}).get("oa_url", ""),
                "status": oa_status,
            },
            "fieldsOfStudy": [
                item.get("primary_topic", {}).get("field", {}).get("display_name", ""),
                item.get("primary_topic", {}).get("subfield", {}).get("display_name", ""),
            ],
            "tldr": {
                "model": "tldr@v2.0.0",
                "text": "Generated summary is not available.",  # Placeholder
            },
            "type": item.get("type", "not known")
        }

        results.append(converted_item)

    return results


# Example usage
if __name__ == "__main__":
    search_term = "What is Retrieval augmented generation"
    data = fetch_openalex_data(search_term, 15, 1)
    converted_result = convert_api_to_first_format(data)
    df = pd.DataFrame(converted_result).dropna()

    print(df)

# openalex_api_response = {
#     "meta": {
#         "count": 7030396,
#         "db_response_time_ms": 173,
#         "page": 1,
#         "per_page": 1,
#         "groups_count": None
#     },
#     "results": [
#         {
#             "id": "https://openalex.org/W2138270253",
#             "title": "DNA sequencing with chain-terminating inhibitors",
#             "abstract_inverted_index": {
#                 "A": [0],
#                 "new": [1],
#                 "method": [2, 19],
#                 "for": [3],
#                 "determining": [4],
#                 "nucleotide": [5],
#                 "sequences": [6],
#                 "in": [7],
#                 "DNA": [8, 53, 62],
#                 "is": [9, 12, 67],
#                 "described.": [10],
#             },
#             "publication_year": 1977,
#             "primary_topic": {
#                 "id": "https://openalex.org/T11048",
#                 "display_name": "Bacteriophages and microbial interactions",
#                 "score": 0.9998,
#                 "subfield": {
#                     "id": "https://openalex.org/subfields/2303",
#                     "display_name": "Ecology"
#                 },
#                 "field": {
#                     "id": "https://openalex.org/fields/23",
#                     "display_name": "Environmental Science"
#                 },
#                 "domain": {
#                     "id": "https://openalex.org/domains/3",
#                     "display_name": "Physical Sciences"
#                 }
#             },
#             "cited_by_count": 69181,
#             "citation_normalized_percentile": {
#                 "value": 0.995719,
#                 "is_in_top_1_percent": True,
#                 "is_in_top_10_percent": True
#             },
#             "open_access": {
#                 "is_oa": True,
#                 "oa_status": "green",
#                 "oa_url": "https://europepmc.org/articles/pmc431765?pdf=render",
#                 "any_repository_has_fulltext": True
#             }
#         }
#     ],
#     "group_by": []
# }

# converted_data = convert_api_to_first_format(openalex_api_response)
# print(json.dumps(converted_data, indent=4))

