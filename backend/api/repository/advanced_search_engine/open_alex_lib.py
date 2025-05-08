import requests
import os
from dotenv import load_dotenv
import json
import pandas as pd
from api.routers.schemas import advanced_search_engine_schema
import time

load_dotenv()

import requests

def fetch_openalex_data_advanced(search_query, filterData:advanced_search_engine_schema.FilterData, per_page=10, page=1):
    """
    Fetch data from the OpenAlex API.

    Parameters:
        search_query (str): The search term or sentence (e.g., 'What is RAG').
        per_page (int): Number of results per page (default is 1).
        page (int): Page number to fetch (default is 1).

    Returns:
        list: Filtered results with significant values for all selected fields.
    """
    # Base URL for the API
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
        "type",
    ]

    filtered_results = []
    # filterObjects = []

    # for topic in filterData.selectedTopics:
    #     print(topic)
    #     for sourceType in filterData.selectedSourceTypes:
    #         print(sourceType.display_name)
    #         # Define the filter parameters
    #         filterObjects.append([
    #             f"primary_topic.id:{topic.only_id}",
    #             f"type:{sourceType.display_name}",
    #             f"from_publication_date:{filterData.publishedSince}-01-01",
    #             f"cited_by_count:>{filterData.citations}"
    #         ])
    #     if len(filterObjects) == 0:
    #         filterObjects.append([
    #             f"open_access.is_oa:{filterData.openAccess}",
    #             f"primary_topic.id:{topic.only_id}",
    #             f"from_publication_date:{filterData.publishedSince}-01-01",
    #             f"cited_by_count:>{filterData.citations}"
    #         ])
    # if len(filterObjects) == 0:
    #     filterObjects.append([
    #             f"open_access.is_oa:{filterData.openAccess}",
    #             f"from_publication_date:{filterData.publishedSince}-01-01",
    #             f"cited_by_count:>{filterData.citations}"
    #     ])

    # for filters in filterObjects:
    #     print("Current filter:  ", filters)

    filters = [
                f"open_access.is_oa:{filterData.openAccess}",
                f"from_publication_date:{filterData.publishedSince}-01-01",
                f"cited_by_count:>{filterData.citations}"
            ]

    params = {
        "search": search_query,
        "filter": ",".join(filters),
        "per-page": per_page,
        "page": page,
        "select": ",".join(select_fields)
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
    else:
        print("Error occured while fetching")
        response.raise_for_status()
        
    print("filtered results num: ",len(filtered_results))
    
    return filtered_results



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
    data = fetch_openalex_data_advanced(search_term, 15, 1)
    converted_result = convert_api_to_first_format(data)
    df = pd.DataFrame(converted_result).dropna()

    print(df)