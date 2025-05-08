"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaperCard } from "../../common-comp/paper-card";
import { PaperData, QueryResult } from "@/lib/tools/searchengine/fetchResponse";
import { SearchPaperPage, useSearchPaper } from "@/context/SearchPapersContext";
import getOnlyAnswer from "@/lib/tools/searchengine/fetchOnlyAnswer";

interface PaginatedPaperResultsProps {
  queryResult: QueryResult;
  query: string;
}

export function PaginatedPaperResults({
  queryResult,
  query,
}: PaginatedPaperResultsProps) {
  const { currentPage, setCurrentPage, paperRetrievalQuery, searchPaperPage, setSearchPaperPage, fetchOnlyAnswerLoading, setFetchOnlyAnswerLoading } = useSearchPaper();
  const itemsPerPage = 1;
  const totalPages = Math.ceil(queryResult.data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = queryResult.data.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to handle form submission or any logic
  const handleSubmit = async (pageNumber: number) => {
    console.log(`Handling submission for page ${pageNumber}`);
    // Add your custom logic here
    setFetchOnlyAnswerLoading(true)
    const response = await getOnlyAnswer({query: paperRetrievalQuery, paper_data: searchPaperPage?.queryResult.data[pageNumber-1]})
    if (searchPaperPage){
        const newSearchPaperPage: SearchPaperPage = {
            query: response.query,
            queryResult: {
                query: response.query,
                final_answer: response.final_answer,
                followup_questions: response.followup_questions,
                data: searchPaperPage.queryResult.data
            },
            library: []
        }
        setSearchPaperPage(newSearchPaperPage)
    }
    setFetchOnlyAnswerLoading(false)
  };

  // Function to handle page change and execute handleSubmit
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    handleSubmit(pageNumber); // Trigger handleSubmit on page change
    window.scrollTo({ top: 0, behavior: "smooth" }); // Move to top of the page
  };

  return (
    <div className="pr-2 rounded-xl mx-auto">
      <div className="my-2 py-1 flex justify-center bg-gray-200 rounded-xl">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) paginate(currentPage - 1);
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <PaginationEllipsis key={pageNumber} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) paginate(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {currentItems.map((paperList: PaperData[], index: number) =>
        paperList.map((paper: PaperData, paperIndex: number) => (
          <PaperCard
            key={paperIndex}
            query={query}
            query_answer={queryResult.final_answer}
            paper={paper}
          />
        ))
      )}
    </div>
  );
}
