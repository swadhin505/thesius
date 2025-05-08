"use client";

import { createContext, ReactNode, useState, useContext } from "react";
import { QueryResult } from "@/lib/tools/searchengine/fetchResponse";

export interface SearchPaperPage {
  query: string;
  queryResult: QueryResult;
  library: QueryResult[] | null;
}

interface SearchPaperContextType {
  searchPaperPage: SearchPaperPage | null;
  setSearchPaperPage: (searchPaperPage: SearchPaperPage | null) => void;
  paperRetrievalLoading: boolean;
  setPaperRetrievalLoading: (paperRetrievalLoading:boolean) => void;
  paperRetrievalQuery: string;
  setPaperRetrievalQuery: (paperRetrievalQuery:string) => void;
  isAtComplexMode: boolean;
  setIsAtComplexMode: (isAtComplexMode:boolean) => void;
  currentPage: number;
  setCurrentPage: (currentPage:number) => void;
  fetchOnlyAnswerLoading: boolean;
  setFetchOnlyAnswerLoading: (fetchOnlyAnswerLoading:boolean) => void;
}

const SearchPaperContext = createContext<SearchPaperContextType | undefined>(undefined);

interface SearchPaperProviderProps {
  children: ReactNode;
}

export const SearchPaperProvider: React.FC<SearchPaperProviderProps> = ({ children }) => {
  const [searchPaperPage, setSearchPaperPage] = useState<SearchPaperPage | null>(null);
  const [paperRetrievalLoading, setPaperRetrievalLoading] = useState(false)
  const [isAtComplexMode, setIsAtComplexMode] = useState(false)
  const [paperRetrievalQuery, setPaperRetrievalQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchOnlyAnswerLoading, setFetchOnlyAnswerLoading] = useState(false);

  return (
    <SearchPaperContext.Provider value={{ searchPaperPage, setSearchPaperPage, paperRetrievalLoading, setPaperRetrievalLoading, paperRetrievalQuery, setPaperRetrievalQuery, isAtComplexMode, setIsAtComplexMode, setCurrentPage, currentPage, fetchOnlyAnswerLoading, setFetchOnlyAnswerLoading }}>
      {children}
    </SearchPaperContext.Provider>
  );
};

export const useSearchPaper = () => {
  const context = useContext(SearchPaperContext);
  if (!context) {
    throw new Error("useSearchPaper must be used within a SearchPaperProvider");
  }
  return context;
};

export default SearchPaperContext;