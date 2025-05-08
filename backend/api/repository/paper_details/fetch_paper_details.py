import requests
import json


def fetch_openalex_work_details(work_id):
    """
    Fetch detailed data for a specific work from the OpenAlex API.

    Parameters:
        work_id (str): The unique ID of the work (e.g., 'W2887980853').

    Returns:
        dict: Filtered results with significant values for all selected fields.
    """
    base_url = f"https://api.openalex.org/works/{work_id}"

    # Constant fields to select
    select_fields = [
        "id",
        "title",
        "abstract_inverted_index",
        "publication_year",
        "authorships",
        "primary_topic",
        "cited_by_count",
        "citation_normalized_percentile",
        "open_access",
        "authorships",
        "primary_location",
        "cited_by_api_url",
        "referenced_works",
        "type",
    ]

    # Construct the query parameters
    params = {"select": ",".join(select_fields)}

    # Make the API request
    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        result = response.json()

        return result
    else:
        response.raise_for_status()


def convert_api_to_first_format(openalex_api_response, citation_response, references_response):
    """
    Convert data from the OpenAlex API format to the Semantic Scholar format.
    """

    if not isinstance(openalex_api_response, dict):
        return {}

    # Safely retrieve OA status
    open_access_info = openalex_api_response.get("open_access") or {}
    oa_status = (open_access_info.get("oa_status") or "CLOSED_ACCESS").upper()
    if oa_status not in ["OPEN_ACCESS", "CLOSED_ACCESS"]:
        oa_status = "CLOSED_ACCESS"

    # Safely retrieve primary topic
    primary_topic = openalex_api_response.get("primary_topic") or {}
    field = (primary_topic.get("field") or {}).get("display_name", "")
    subfield = (primary_topic.get("subfield") or {}).get("display_name", "")

    # Extract paper ID safely
    paper_id = ""
    if isinstance(openalex_api_response.get("id"), str):
        paper_id = openalex_api_response["id"].split("/")[-1]

    # Construct converted response
    converted_openalex_api_response = {
        "paperId": paper_id,
        "url": openalex_api_response.get("id", ""),
        "title": openalex_api_response.get("title", "") or "No Title Available",
        "abstract": " ".join(list((openalex_api_response.get("abstract_inverted_index") or {}).keys())[:150])
        if openalex_api_response.get("abstract_inverted_index") else "",
        "venue": field or "Unknown Venue",
        "year": openalex_api_response.get("publication_year") if isinstance(openalex_api_response.get("publication_year"), int) else None,
        "referenceCount": len(openalex_api_response.get("referenced_works", []) or []),
        "citationCount": openalex_api_response.get("cited_by_count", 0) if isinstance(openalex_api_response.get("cited_by_count"), int) else 0,
        "citation_normalized_percentile": openalex_api_response.get("citation_normalized_percentile", {}) or {},
        "authors": [
            {
                "authorId": (author.get("author", {}) or {}).get("id", "").replace("https://openalex.org/", ""),
                "name": (author.get("author", {}) or {}).get("display_name", ""),
                "url": (author.get("author", {}) or {}).get("id", ""),
            }
            for author in openalex_api_response.get("authorships", []) or []
            if isinstance(author, dict) and "author" in author
        ],
        "isOpenAccess": open_access_info.get("is_oa", False),
        "openAccessPdf": {
            "url": open_access_info.get("oa_url", "") or "",
            "status": oa_status,
        },
        "fieldsOfStudy": [field, subfield],
        "tldr": {
            "model": "tldr@v2.0.0",
            "text": "Generated summary is not available.",
        },
        "type": openalex_api_response.get("type", "unknown type") or "unknown type",
        "citations": citation_response if isinstance(citation_response, list) else [],
        "references": references_response if isinstance(references_response, list) else [],
    }

    return converted_openalex_api_response


def fetch_cites_reference_cards(work_id, data_type="citation"):
    """
    Fetch data for works that the specific work references or vice versa.

    Parameters:
        work_id (str): The unique ID of the specific work (e.g., 'W2887980853').

    Parameters:
        data_type (str): citation or reference.

    Returns:
        list: List of works cited by the given work or citations of the work, filtered by significant values.
    """
    base_url = "https://api.openalex.org/works"

    # Constant fields to select
    select_fields = [
        "id",
        "title",
        "publication_year",
        "primary_topic",
        "referenced_works",
        "cited_by_count",
        "citation_normalized_percentile",
        "open_access",
        "type",
    ]

    # Construct the query parameters
    if data_type == "citation":
        params = {"filter": f"cites:{work_id}", "select": ",".join(select_fields)}
    else:
        params = {"filter": f"cited_by:{work_id}", "select": ",".join(select_fields)}

    # Make the API request
    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        results = response.json().get("results", [])
        # Filter results to include only those with significant values for all fields
        filtered_results = [
            result
            for result in results
            if all(
                field in result and result[field] not in [None, "", [], {}]
                for field in select_fields
            )
        ]
        return filtered_results
    else:
        response.raise_for_status()


def convert_cited_reference_data(data):
    """
    Convert data from the OpenAlex API format to the Semantic Scholar format.
    """
    if not isinstance(data, list):
        return []

    results = []

    for item in data:
        if not isinstance(item, dict):
            continue

        # Safely retrieve Open Access status
        open_access_info = item.get("open_access") or {}
        oa_status = (open_access_info.get("oa_status") or "CLOSED_ACCESS").upper()
        if oa_status not in ["OPEN_ACCESS", "CLOSED_ACCESS"]:
            oa_status = "CLOSED_ACCESS"

        # Safely retrieve primary topic
        primary_topic = item.get("primary_topic") or {}
        field = (primary_topic.get("field") or {}).get("display_name", "")
        subfield = (primary_topic.get("subfield") or {}).get("display_name", "")

        # Extract paper ID safely
        paper_id = ""
        if isinstance(item.get("id"), str):
            paper_id = item["id"].split("/")[-1]

        converted_item = {
            "paperId": paper_id,
            "url": item.get("id", ""),
            "title": item.get("title", "") or "No Title Available",
            "abstract": " ",
            "venue": field or "Unknown Venue",
            "year": item.get("publication_year") if isinstance(item.get("publication_year"), int) else None,
            "referenceCount": len(item.get("referenced_works", []) or []),
            "citationCount": item.get("cited_by_count", 0) if isinstance(item.get("cited_by_count"), int) else 0,
            "citation_normalized_percentile": item.get("citation_normalized_percentile", {}) or {},
            "isOpenAccess": open_access_info.get("is_oa", False),
            "openAccessPdf": {
                "url": open_access_info.get("oa_url", "") or "",
                "status": oa_status,
            },
            "fieldsOfStudy": [field, subfield],
            "tldr": {
                "model": "tldr@v2.0.0",
                "text": "Generated summary is not available.",
            },
            "type": item.get("type", "unknown type") or "unknown type",
        }

        results.append(converted_item)

    return results

if __name__ == "__main__":
    work_id = "W3099527960"
    try:
        # Open a file to write output
        with open("output.txt", "w") as output_file:
            # output_file.write("Work Details:\n")
            data = fetch_openalex_work_details(work_id)
            # Uncomment below to write the raw data
            # output_file.write(json.dumps(data, indent=4) + "\n")

            # output_file.write("\nCites Cards:\n")
            cites_data = fetch_cites_reference_cards(work_id)
            cites_data = convert_cited_reference_data(cites_data)
            # Uncomment below to write the raw cites data
            # output_file.write(json.dumps(cites_data, indent=4) + "\n")

            # output_file.write("\nReference Cards:\n")
            reference_data = fetch_cites_reference_cards(
                work_id, data_type="references"
            )
            reference_data = convert_cited_reference_data(reference_data)
            # Uncomment below to write the raw reference data
            # output_file.write(json.dumps(reference_data, indent=4) + "\n")

            output_file.write("\nConverted API Data:\n")
            output_file.write(
                json.dumps(
                    convert_api_to_first_format(
                        data, cites_data[:2], reference_data[:2]
                    ),
                    indent=4,
                )
                + "\n"
            )

    except Exception as e:
        # Log the error to the file
        with open("output.txt", "a") as output_file:
            output_file.write(f"Error fetching data: {e}\n")
