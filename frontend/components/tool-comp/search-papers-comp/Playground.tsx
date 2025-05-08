"use client";

import React, { useContext, useEffect, useState } from "react";
import { InputBox } from "./SubComponents/input-box";
import SearchPaperContext, {
  SearchPaperPage,
} from "@/context/SearchPapersContext";
import { useSearchPaper } from "@/context/SearchPapersContext";
import { PaperCard } from "../common-comp/paper-card";
import {
  fetchQueryResultCache,
  PaperData,
} from "@/lib/tools/searchengine/fetchResponse";
import FollowUpQuestionsCard from "../common-comp/follow-ups";
import DiveDeeper from "./SubComponents/DiveDeeper";
import { Sparkles, Search, Brain } from "lucide-react";
import SearchResultSkeleton from "@/components/loading-skeletons/search-result-skeleton";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // Import Katex CSS
import "./styles.css";
import AnimatedProgressBar from "./SubComponents/progress-bar";
import { PaginatedPaperResults } from "./SubComponents/paginated-paper-results";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  addSearchResult,
  fetchSavedResultById,
} from "@/lib/Savings/fetchSavedSearchResults";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Success</DialogTitle>
          <DialogDescription>Result saved successfully!</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Button className="rounded-xl bg-green-300 hover:bg-green-400 text-gray-800" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Playground() {
  const {
    searchPaperPage,
    setSearchPaperPage,
    paperRetrievalLoading,
    setPaperRetrievalLoading,
    paperRetrievalQuery,
    setPaperRetrievalQuery,
    isAtComplexMode,
    setIsAtComplexMode,
    currentPage,
    fetchOnlyAnswerLoading,
    setFetchOnlyAnswerLoading,
  } = useSearchPaper(); // Use the hook

  const [activeTab, setActiveTab] = useState("results");
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId");
  const [isFromDatabase, setIsFromDatabase] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const HandleSave = async () => {
    if (searchPaperPage) {
      setIsSaving(true); // Disable the button
      await addSearchResult(searchPaperPage.queryResult); // Save the result
      setIsSaving(false); // Re-enable if needed, though it's saved
      setIsSaved(true)
      openModal(); // Open modal to show the message
    }
  };

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    const get_cache_or_saved = async () => {
      if (resultId) {
        setIsFromDatabase(true);
        const data = await fetchSavedResultById(resultId);
        if (data) {
          const newSearchPaperPage: SearchPaperPage = {
            query: data.data.query,
            queryResult: data.data,
            library: [],
          };
          setSearchPaperPage(newSearchPaperPage);
          setPaperRetrievalQuery(data.data.query);
        }
      }
      if (searchPaperPage) return; // Prevent fetching if data already exists
      try {
        const data = await fetchQueryResultCache();
        console.log("Response data:", data);
        if (data) {
          const newSearchPaperPage: SearchPaperPage = {
            query: data.query,
            queryResult: data,
            library: [],
          };
          setSearchPaperPage(newSearchPaperPage);
          setPaperRetrievalQuery(data.query);
        }
      } catch (error) {
        console.error("Error fetching response:", error);
      }
    };

    get_cache_or_saved();
  }, [paperRetrievalQuery, setSearchPaperPage, resultId]); // Remove `searchPaperPage` from the dependency array

  if (!searchPaperPage) {
    if (paperRetrievalLoading) {
      return (
        <div className="mx-auto max-w-7xl w-full">
          <InputBox />
          <AnimatedProgressBar />
          <SearchResultSkeleton />
        </div>
      );
    } else if (isAtComplexMode) {
      return (
        <div className="mx-auto max-w-7xl w-full">
          <InputBox />
        </div>
      );
    } else {
      return (
        <div className="max-w-3xl mx-auto w-full h-[100vh] flex justify-center items-center">
          <InputBox />
        </div>
      );
    }
  }
  if (paperRetrievalLoading) {
    return (
      <div className="mx-auto max-w-7xl w-full h-[100vh]">
        <InputBox />
        <AnimatedProgressBar />
        <SearchResultSkeleton />
      </div>
    );
  }

  const query = searchPaperPage.query;
  const queryResult = searchPaperPage.queryResult;

  const resultsComponent = () => {
    return (
      <div
        className={`${
          windowWidth < 1200 && windowWidth > 900 && "ml-4 w-1/2"
        } ${windowWidth < 900 && "w-full mx-auto"} my-1 rounded-xl`}
      >
        <div className="text-3xl my-2 font-bold text-gray-900 flex items-center">
          <span className="mr-2">Results</span>
          <span>
            <Search />
          </span>
          {/* <span>
            {!isFromDatabase && !isSaved && (
              <>
                <Button
                  className="mx-2 rounded-xl bg-green-500/50 hover:bg-green-600/50 text-gray-800 font-bold"
                  onClick={HandleSave}
                >
                  Save Result
                </Button>
              </>
            )}
          </span> */}
        </div>
        <PaginatedPaperResults query={query} queryResult={queryResult} />
      </div>
    );
  };
  const AnalysisComponent = () => {
    return (
      <div
        className={`${windowWidth < 1200 && windowWidth > 900 && "w-1/2"} ${
          windowWidth < 900 && "w-full mx-auto"
        } ${windowWidth > 900 && "max-w-3xl"} p-3 h-fit rounded-xl`}
      >
        <div className="text-3xl my-2 font-bold text-gray-900 flex items-center">
          <span className="mr-2">AI Summary</span>
          <span>
            <Sparkles />
          </span>
        </div>
        <div className="bg-gray-200 p-3 my-1 mb-3 rounded-xl font-semibold h-[300px] overflow-y-scroll max-w-3xl mx-auto">
          {!fetchOnlyAnswerLoading ? (
            <ReactMarkdown
              className={`${windowWidth < 500 && "text-xs"} markdown text-sm`}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {queryResult.final_answer}
            </ReactMarkdown>
          ) : (
            <Skeleton className="h-full w-full mb-4" />
          )}
        </div>
        <div className="text-gray-700 rounded-xl font-semibold">
          {!fetchOnlyAnswerLoading ? (
            <FollowUpQuestionsCard questions={queryResult.followup_questions} />
          ) : (
            <div className="space-y-2 mb-4 flex flex-col justify-center items-center">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl mt-5">
          <div className="text-3xl my-2 font-bold text-gray-900 flex items-center">
            <span className="mr-2">Dive Deeper</span>
            <span>
              <Brain />
            </span>
          </div>
          <div className="pr-2 rounded-xl">
            <DiveDeeper renderedPapers={queryResult.data[currentPage - 1]} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-2">
      {!isFromDatabase ? (
        <InputBox />
      ) : (
        <div className="mt-4 mb-2 h-[60px] overflow-y-scroll rounded-xl border-8 border-green-500/50 p-3 max-w-7xl w-full text-gray-800 font-bold">
          {query}
        </div>
      )}
      {windowWidth < 900 && (
        <Tabs
          className="mx-auto w-[90%]"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="font-bold" value="results">
              Result section
            </TabsTrigger>
            <TabsTrigger className="font-bold" value="analysis-section">
              Analysis section
            </TabsTrigger>
          </TabsList>
          <TabsContent value="results">{resultsComponent()}</TabsContent>
          <TabsContent value="analysis-section">
            {AnalysisComponent()}
          </TabsContent>
        </Tabs>
      )}
      {windowWidth > 900 && (
        <div className="mx-auto max-w-7xl w-fit flex flex-row-reverse">
          {AnalysisComponent()}
          {resultsComponent()}
        </div>
      )}
      <SuccessModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Playground;
