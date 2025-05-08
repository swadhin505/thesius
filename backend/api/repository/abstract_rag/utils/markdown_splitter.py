from typing import List, Tuple

def split_markdown_by_headers(markdown_document: str, headers_to_split_on: List[Tuple[str, str]] = [("##", "Header 2")], strip_headers: bool = False) -> List[str]:
    """
    Splits a Markdown document into sections based on specified headers.

    Args:
        markdown_document (str): The Markdown content to split.
        headers_to_split_on (List[Tuple[str, str]]): A list of header patterns and their descriptions.
        strip_headers (bool): If True, removes headers from the split sections.

    Returns:
        List[str]: A list of sections split by the specified headers.
    """
    from langchain.text_splitter import MarkdownHeaderTextSplitter

    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on, 
        strip_headers=strip_headers
    )
    return markdown_splitter.split_text(markdown_document)

# # Example usage
# markdown_document = """
# ## Header 2
# Content under header 2

# ## Another Header 2
# Content under another header 2
# """

# # Call the reusable function
# md_header_splits = split_markdown_by_headers(markdown_document)

# # Display the results
# print(md_header_splits)
