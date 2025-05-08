def convert_paper_data_to_dict(paper_data_list):
    """
    Converts a list of PaperData objects into a list of dictionaries compatible
    with the organize_papers_to_markdown function.

    Args:
        paper_data_list (list): List of PaperData-like objects.

    Returns:
        list: List of dictionaries containing paper information.
    """
    converted_papers = []

    for paper in paper_data_list:
        converted_papers.append({
            'title': paper.title,
            'abstract': paper.abstract,
            'year': paper.year,
            'fieldsOfStudy': paper.fieldsOfStudy,
            'citationCount': paper.citationCount,
            # not correctly converted, need to be resolved later
            'citation_normalized_percentile': paper.citation_normalized_percentile,
            # ////////////////////////
            'isOpenAccess': paper.isOpenAccess,
            'openAccessPdf': paper.openAccessPdf.url if paper.isOpenAccess else None
        })

    return converted_papers