"use client";
import { useCallback, useState, useEffect } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { Document, Page, pdfjs } from "react-pdf";
import { experimental_useObject as useObject } from "ai/react";
import { textFilterSchema } from "@/app/api/use-object/textFilterSchema";
import { extractTextFromPage } from "@/lib/tools/paper-chat/pdfUtils";
import {
  options,
  maxWidth,
  resizeObserverOptions,
} from "@/lib/tools/paper-chat/config";
import { PDFFile, PDFDocumentProxy } from "@/types/pdfTypes";
import TextSelectionPopup from "./SubComponents/TextSelectionPopup";
import PageControls from "./SubComponents/PageControls";
import { isValidUrl } from "@/lib/tools/paper-chat/validateUrl"; // Utility function for URL validation

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./Sample.css";
import ChatInterface from "./SubComponents/ChatInterface";
import { useSearchParams } from "next/navigation";
import BackButton from "@/components/global-comp/back-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// export default function MainViewer() {
//   const LOCAL_STORAGE_KEY = "currentPage";
//   const [isClient, setIsClient] = useState(false);
//   const [file, setFile] = useState<PDFFile>("./sample.pdf");
//   const [numPages, setNumPages] = useState<number>();
//   const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
//   const [containerWidth, setContainerWidth] = useState<number>();
//   const [selectedText, setSelectedText] = useState<string | null>(null);
//   const [popUpPosition, setPopUpPosition] = useState<{
//     top: number;
//     left: number;
//   } | null>(null);
//   const [extractedText, setExtractedText] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(() => {
//     if (typeof window !== "undefined") {
//       const savedPage = window.localStorage.getItem(LOCAL_STORAGE_KEY);
//       return savedPage ? parseInt(savedPage, 10) : 1;
//     }
//     return 1;
//   });
//   const [imageURL, setimageURL] = useState<string | null>(null);

//   const onResize = useCallback<ResizeObserverCallback>((entries) => {
//     const [entry] = entries;
//     if (entry) setContainerWidth(entry.contentRect.width);
//   }, []);

//   useResizeObserver(containerRef, resizeObserverOptions, onResize);

//   function onDocumentLoadSuccess({
//     numPages: nextNumPages,
//   }: PDFDocumentProxy): void {
//     setNumPages(nextNumPages);
//     extractTextFromPage(file, 1, setExtractedText);
//   }

//   function handleTextSelection(event: React.MouseEvent) {
//     const selection = window.getSelection();
//     if (selection && selection.toString()) {
//       setPopUpPosition({ top: event.clientY + 10, left: event.clientX + 10 });
//       setSelectedText(selection.toString());
//     } else {
//       setSelectedText(null);
//       setPopUpPosition(null);
//     }
//   }

//   function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
//     const { files } = event.target;
//     const nextFile = files?.[0];
//     if (nextFile) setFile(nextFile);
//   }

//   const { object, submit } = useObject({
//     api: "/api/use-object/",
//     schema: textFilterSchema,
//   });

//   const { object: visionObject, submit: visionSubmit } = useObject({
//     api: "/api/convert/",
//     schema: z.object({
//       prompt: z
//         .string()
//         .describe("instruction sentence for vision language model"),
//     }),
//   });

//   const Visualize = (input: string) => {
//     setimageURL(null)
//     visionSubmit(input);
//     if (visionObject?.prompt) {
//       input = visionObject?.prompt
//         .toLowerCase()
//         .trim()
//         .replace(/\s+/g, "-")
//         .replace(/[^\w\-]+/g, "")
//         .replace(/--+/g, "-")
//         .replace(/^-+|-+$/g, "");
//     }
//     console.log(input)
//     setimageURL(`https://image.pollinations.ai/prompt/${input}`)
//   };

//   useEffect(() => {
//     extractTextFromPage(file, currentPage, setExtractedText);
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem(LOCAL_STORAGE_KEY, currentPage.toString());
//     }
//     setIsClient(true);
//   }, [currentPage, file]);

//   if (!isClient) {
//     return null;
//   }
//   return (
//     <div className="flex">
//       <div
//         className="Example bg-[#525659] h-screen overflow-y-scroll"
//         onMouseUp={handleTextSelection}
//       >
//         <PageControls
//           currentPage={currentPage}
//           numPages={numPages}
//           onFileChange={onFileChange}
//           setCurrentPage={setCurrentPage}
//         />
//         <div className="Example__container">
//           <div className="Example__container__document" ref={setContainerRef}>
//             <Document
//               file={file}
//               onLoadSuccess={onDocumentLoadSuccess}
//               options={options}
//             >
//               <Page
//                 key={`page_${currentPage}`}
//                 pageNumber={currentPage}
//                 width={
//                   containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
//                 }
//               />
//             </Document>
//           </div>
//         </div>
//       </div>

//       <TextSelectionPopup
//         selectedText={selectedText}
//         popUpPosition={popUpPosition}
//       />
//     </div>
//   );
// }

export default function MainViewer() {
  const LOCAL_STORAGE_KEY = "currentPage";
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState<PDFFile>("./sample.pdf");
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [popUpPosition, setPopUpPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedPage = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedPage ? parseInt(savedPage, 10) : 1;
    }
    return 1;
  });
  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) setContainerWidth(entry.contentRect.width);
  }, []);
  const [error, setError] = useState<string | null>(null); // Error state
  const searchParams = useSearchParams();
  const paperData = searchParams.get("paperData");
  const [responseUrl, setResponseUrl] = useState<string | null>(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages);
    extractTextFromPage(fileURL || file, 1, setExtractedText);
  }

  function onDocumentLoadError() {
    setError("Failed to load the PDF. Please check the URL or file.");
  }

  function handleTextSelection(event: React.MouseEvent) {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setPopUpPosition({ top: event.clientY + 10, left: event.clientX + 10 });
      setSelectedText(selection.toString());
    } else {
      setSelectedText(null);
      setPopUpPosition(null);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    const nextFile = files?.[0];
    if (nextFile) {
      setFile(nextFile);
      setFileURL(null); // Reset URL if a local file is selected
    }
  }

  function handleURLChange(url: string) {
    if (isValidUrl(url)) {
      // Validate the URL
      setFileURL(url);
      setError(null); // Clear error if valid URL
    } else {
      setError("Invalid URL format. Please enter a valid URL."); // Set error if invalid
    }
  }
  
  useEffect(() => {
    // Fetch and parse paper data
    const getPaperDetails = async () => {
      if (paperData) {
        const parsed = JSON.parse(decodeURIComponent(paperData));
        console.log("Parsed paper data:", parsed);
        if (parsed.url && parsed.url !== responseUrl) {
          setResponseUrl(parsed.url); // Only update if URL has changed
        }
      }
    };
  
    getPaperDetails();
  }, [paperData]); // Only depends on `paperData`
  
  useEffect(() => {
    // Fetch PDF blob
    const fetchPDF = async () => {
      if (responseUrl) {
        try {
          const response = await fetch(`/api/helpers/fetch-pdf?url=${encodeURIComponent(responseUrl)}`);
          const blob = await response.blob();
          setFileURL(URL.createObjectURL(blob)); // Set file URL
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      }
    };
  
    fetchPDF();
  }, [responseUrl]); // Only depends on `responseUrl`
  
  useEffect(() => {
    // Extract text and handle localStorage
    if (fileURL || file) {
      extractTextFromPage(fileURL || file, currentPage, setExtractedText);
    }
  
    // if (typeof window !== "undefined") {
    //   window.localStorage.setItem(LOCAL_STORAGE_KEY, currentPage.toString());
    // }
  
    setIsClient(true); // Set client-side flag
  }, [currentPage, file, fileURL]); // Only depends on these values
  
  if (!isClient) {
    return null;
  }
  

  if (!isClient) {
    return null;
  }

  // return (
  //   <div className="flex">
  //     <BackButton />
  //     {error && (
  //       <div className="z-50 absolute left-[10px] font-bold text-red-500">
  //         {error}
  //       </div>
  //     )}
  //     <div
  //       className="Example bg-[#525659] h-screen overflow-y-scroll"
  //       onMouseUp={handleTextSelection}
  //     >
  //       <PageControls
  //         currentPage={currentPage}
  //         numPages={numPages}
  //         onFileChange={handleFileChange}
  //         setCurrentPage={setCurrentPage}
  //         handleURLChange={handleURLChange}
  //       />
  //       <div className="Example__container">
  //         <div className="Example__container__document" ref={setContainerRef}>
  //           <Document
  //             file={fileURL || file}
  //             onLoadSuccess={onDocumentLoadSuccess} // Success handler
  //             onLoadError={onDocumentLoadError} // Error handler
  //             options={options}
  //           >
  //             <Page
  //               key={`page_${currentPage}`}
  //               pageNumber={currentPage}
  //               width={
  //                 containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
  //               }
  //             />
  //           </Document>
  //         </div>
  //       </div>
  //     </div>
  //     <ChatInterface />
  //     <TextSelectionPopup
  //       selectedText={selectedText}
  //       popUpPosition={popUpPosition}
  //     />
  //   </div>
  // );
  return (
    <div className="flex relative">
      {/* Main Content */}
      <div className="flex-1 w-1/2">
        <BackButton />
        {error && (
          <div className="z-50 absolute left-[10px] font-bold text-red-500">
            {error}
          </div>
        )}
        <div
          className="bg-[#525659] h-screen overflow-y-scroll"
          onMouseUp={handleTextSelection}
        >
          <PageControls
            currentPage={currentPage}
            numPages={numPages}
            onFileChange={handleFileChange}
            setCurrentPage={setCurrentPage}
            handleURLChange={handleURLChange}
          />
          <div className="Example__container">
            <div className="Example__container__document" ref={setContainerRef}>
              <Document
                file={fileURL || file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={options}
              >
                {windowWidth > 768 ? <Page
                  key={`page_${currentPage}`}
                  pageNumber={currentPage}
                  width={
                    containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                  }
                /> : (Array.from(new Array(numPages), (_el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                  />
                )))}
              </Document>
            </div>
          </div>
        </div>
        <TextSelectionPopup
          selectedText={selectedText}
          popUpPosition={popUpPosition}
        />
      </div>

      {/* Chat Sidebar */}
      <div className="hidden w-1/2 md:block border-l">
        <ChatInterface />
      </div>

      {/* Mobile Sliding Overlay Sidebar */}
      <div 
        className={`md:hidden fixed right-0 top-0 h-fit rounded-xl sm:rounded-none sm:h-screen w-80 bg-white shadow-lg 
          transition-transform duration-300 ease-in-out transform z-50
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="relative h-full">
          <button
            onClick={toggleSidebar}
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l shadow-md md:hidden"
          >
            {isSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <ChatInterface />
        </div>
      </div>

      {/* Overlay Background */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
