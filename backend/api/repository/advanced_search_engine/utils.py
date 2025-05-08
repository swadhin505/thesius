from api.repository.advanced_search_engine import open_alex_lib
from api.repository.advanced_search_engine import utils_continued
from api.routers.schemas import advanced_search_engine_schema
import pandas as pd


def get_papers(query, filterData: advanced_search_engine_schema.FilterData):
    try:
        extracted_topics = utils_continued.extract_topics(query)

        print("topic extraction done")

        search_results = []
        for topic in extracted_topics:
            # print(topic)
            search_results += open_alex_lib.fetch_openalex_data_advanced(topic, filterData, 10)
            print(len(search_results))
        
        print("paper extraction done")

        # Deduplicate by unique id
        search_results = list(
            {result["id"]: result for result in search_results}.values()
        )
        
        # filtered_results = []
        # print([sourceType.display_name for sourceType in filterData.selectedSourceTypes])
        # for search_result in search_results:
        #     if (search_result["type"] in [sourceType.display_name for sourceType in filterData.selectedSourceTypes]):
        #         filtered_results.append(search_result)

        search_results = open_alex_lib.convert_api_to_first_format(search_results)
        if len(search_results) == 0:
            print("No results found - Try another query")
        else:
            df = pd.DataFrame(search_results).dropna()
            return df
    except Exception as e:
        print(f"An error occurred while searching papers: {e}")