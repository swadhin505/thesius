'use client'

import React, { useState } from "react";
import PageNumberInput from "./PageNumberInput";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PageControlsProps = {
  currentPage: number;
  numPages: number | undefined;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleURLChange: (url: string) => void; // Changed to accept a URL string
};

export default function PageControls({
  currentPage,
  numPages,
  setCurrentPage,
  onFileChange,
  handleURLChange,
}: PageControlsProps) {
  const [pdfUrl, setPdfUrl] = useState(""); // Local state to store the entered URL
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  function goToPreviousPage() {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  function goToNextPage() {
    setCurrentPage((prevPage) =>
      numPages ? Math.min(prevPage + 1, numPages) : prevPage
    );
  }

  function handleLoadPdf() {
    if (pdfUrl.trim() !== "") {
      handleURLChange(pdfUrl); // Pass the URL to the parent component
    }
  }

  return (
    <div className="fixed sm:absolute bottom-8 md:bottom-4 left-1/2 md:left-1/4 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-2 md:bg-green-600 rounded-lg md:rounded-full px-2 shadow-lg text-[12px] w-[95vw] md:w-fit">
        <label htmlFor="file-upload" className="cursor-pointer">
          <input
            id="file-upload"
            className="hidden"
            onChange={onFileChange}
            type="file"
            accept=".pdf"
          />
          <span className="bg-green-700 text-white p-3 rounded-full hover:bg-green-800 transition-colors">
            Upload
          </span>
        </label>

        {/* <div className="border p-2 rounded-full">
          <input
            type="text"
            placeholder="PDF URL"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)} // Update local state
            className="bg-green-700 text-[10px] text-white placeholder-green-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleLoadPdf}
            className="mx-2 bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-colors"
          >
            Load
          </button>
        </div> */}

        {windowWidth > 768 && <div className="flex justify-center items-center">
          <button
            className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-white font-medium rounded-full mx-2">
            {currentPage} / {numPages || "-"}
          </p>
          <button
            className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToNextPage}
            disabled={currentPage === numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>}

        {windowWidth > 768 && <PageNumberInput
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={setCurrentPage}
        />}
      </div>
    </div>
  );
}
