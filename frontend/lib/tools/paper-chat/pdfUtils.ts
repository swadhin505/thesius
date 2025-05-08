import { pdfjs } from "react-pdf";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import { PDFFile } from "@/types/pdfTypes";

export async function extractTextFromPage(file: PDFFile, pageNumber: number, setExtractedText: (text: string) => void) {
    if (file && file instanceof File) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const pdf = await pdfjs.getDocument(arrayBuffer).promise;
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const textItems = textContent.items;
            const text = textItems.filter((item): item is TextItem => "str" in item).map((item) => item.str).join(" ");
            setExtractedText(text);
        };
        reader.readAsArrayBuffer(file);
    } else if (typeof file === "string") {
        const pdf = await pdfjs.getDocument(file).promise;
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const textItems = textContent.items;
        const text = textItems.filter((item): item is TextItem => "str" in item).map((item) => item.str).join(" ");
        setExtractedText(text);
    }
}
