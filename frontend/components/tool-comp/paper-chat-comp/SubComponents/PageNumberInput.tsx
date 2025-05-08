"use client"
import React, { useState } from "react";

type PageNumberInputProps = {
  currentPage: number;
  numPages: number | undefined;
  setCurrentPage: (page: number) => void;
};

export default function PageNumberInput({ currentPage, numPages, setCurrentPage }: PageNumberInputProps) {
  const [inputPage, setInputPage] = useState<number | string>(currentPage);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setInputPage(""); // Empty input case
    } else {
      const pageNumber = parseInt(value, 10);
      setInputPage(isNaN(pageNumber) ? currentPage : pageNumber); // Validating number input
    }
  };

  const goToPage = () => {
    if (typeof inputPage === "number" && inputPage >= 1 && numPages && inputPage <= numPages) {
      setCurrentPage(inputPage);
    } else {
      alert(`Please enter a number between 1 and ${numPages}`);
    }
  };

  return (
    <div className="page-number-input my-3 text-center text-white">
      <label htmlFor="page-input" className="mr-2">
        Go to page:
      </label>
      <input
        id="page-input"
        type="number"
        value={inputPage}
        onChange={handlePageChange}
        className="bg-green-700 p-2 rounded-md text-white w-16 text-center"
        min={1}
        max={numPages}
      />
      <button className="bg-green-700 text-white mx-2 p-2 rounded-full hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={goToPage}>
        Go
      </button>
    </div>
  );
}
