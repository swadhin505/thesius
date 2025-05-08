def organize_papers_to_markdown(papers):
    """
    Converts a list of paper details into a structured Markdown document.

    Args:
        papers (list): List of dictionaries containing paper information.

    Returns:
        str: A Markdown-formatted string.
    """
    markdown_doc = ""

    for paper in papers:
        markdown_doc += f"## {paper['title']}\n\n"
        # markdown_doc += f"**URL:** [{paper['url']}]({paper['url']})\n\n"
        markdown_doc += f"**Abstract:** {paper['abstract'][:500]}...\n\n"  # Limit abstract length
        # markdown_doc += f"**TL;DR:** {paper['tldr']['text']}\n\n"
        markdown_doc += f"**Year:** {paper['year']}\n"
        # markdown_doc += f"**Venue:** {paper['venue']}\n"
        markdown_doc += f"**Fields of Study:** {', '.join(paper['fieldsOfStudy'])}\n\n"
        # markdown_doc += f"**Reference Count:** {paper['referenceCount']}\n"
        markdown_doc += f"**Citation Count:** {paper['citationCount']}\n"

        markdown_doc += f"**Citation normalized percentitle:** {paper['citation_normalized_percentile'].value}\n\n"
        markdown_doc += f"**is in top 1 percent:** {paper['citation_normalized_percentile'].is_in_top_1_percent}\n\n"
        markdown_doc += f"**is in top 10 percent:** {paper['citation_normalized_percentile'].is_in_top_10_percent}\n\n"


        markdown_doc += f"**Open Access:** {'Yes' if paper['isOpenAccess'] else 'No'}\n"
        # if paper['isOpenAccess']:
        #     markdown_doc += f"**PDF:** [{paper['openAccessPdf']['url']}]({paper['openAccessPdf']['url']})\n\n"
        markdown_doc += "---\n\n"

    return markdown_doc

# # Example usage
# dummy_papers = [
#     {
#         "paperId": "5c5751d45e298cea054f32b392c12c61027d2fe7",
#         "url": "https://www.semanticscholar.org/paper/5c5751d45e298cea054f32b392c12c61027d2fe7",
#         "title": "A Survey of Retrieval-Augmented Generation Models",
#         "abstract": "This survey explores Retrieval-Augmented Generation (RAG) models, which combine information retrieval with generative models, discussing recent advances, architectures, and applications in knowledge-intensive NLP tasks.",
#         "venue": "Conference on Neural Information Processing Systems",
#         "year": 2021,
#         "referenceCount": 112,
#         "citationCount": 203,
#         "influentialCitationCount": 51,
#         "isOpenAccess": True,
#         "openAccessPdf": {
#             "url": "https://arxiv.org/pdf/2308.00479",
#             "status": "OPEN_ACCESS",
#         },
#         "fieldsOfStudy": ["Computer Science", "Artificial Intelligence"],
#         "tldr": {
#             "model": "tldr@v2.0.0",
#             "text": "Discusses advances in Retrieval-Augmented Generation (RAG) models for knowledge-intensive tasks, detailing architectures and performance.",
#         },
#     },
#     # Add more paper dictionaries here...
# ]

# markdown_output = organize_papers_to_markdown(dummy_papers)
# print(markdown_output)
