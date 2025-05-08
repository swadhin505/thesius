from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import os

load_dotenv()

BING_API_KEY = os.getenv("BING_API_KEY")

async def search_bing_for_pdf(query):
    headers = {"Ocp-Apim-Subscription-Key": BING_API_KEY}
    params = {
        "q": f"{query} filetype:pdf",
        "count": 5,
        "responseFilter": "webpages",
        "textDecorations": True,
        "textFormat": "HTML"
    }
    search_url = "https://api.bing.microsoft.com/v7.0/search"
    
    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    
    pdf_metadata = []
    for result in search_results.get("webPages", {}).get("value", []):

        title = BeautifulSoup(result.get("name"), "html.parser").get_text()
        description = BeautifulSoup(result.get("snippet"), "html.parser").get_text()
        
        metadata = {
            "title": title,
            "description": description,
            "url": result.get("url")
        }
        pdf_metadata.append(metadata)
    
    return pdf_metadata

if __name__ == "__main__":
    title = "Ketogenic Diets and Chronic Disease: Weighing the Benefits Against the Risks"
    pdf_results = search_bing_for_pdf(title)
    print(pdf_results)