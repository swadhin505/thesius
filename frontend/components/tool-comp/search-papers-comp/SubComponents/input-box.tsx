"use client";

import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { fetchQueryResult } from "@/lib/tools/searchengine/fetchResponse";
import SearchPaperContext, {
  SearchPaperPage,
  useSearchPaper,
} from "@/context/SearchPapersContext";
import CompelexitySwitch from "./ComplexitySwitch";
import React from "react";
import FilterBox from "./Filtering/FilterBox";
import { fetchTopics, fetchTopicsCache, Topic } from "@/lib/tools/advancedsearchengine/fetchTopics";
import CommonLoader from "@/components/global-comp/loader";
import { addSearchResult } from "@/lib/Savings/fetchSavedSearchResults";

// Define the type for each research question item
interface ResearchQuestion {
  question: string;
  emoji: string;
}

const researchQuestions: ResearchQuestion[] = [
  {
    question:
      "How can machine learning algorithms improve the accuracy of software bug detection?",
    emoji: "🤖",
  },
  {
    question:
      "What is the effect of varying material composition on the thermal conductivity of composite materials?",
    emoji: "🔧",
  },
  {
    question:
      "How does the presence of specific gut microbiota influence the immune response in mammals?",
    emoji: "🦠",
  },
  {
    question:
      "What are the impacts of temperature and pH on the rate of reaction in enzyme catalysis?",
    emoji: "⚗️",
  },
  {
    question:
      "How do urban green spaces contribute to reducing air pollution levels in metropolitan cities?",
    emoji: "🌳",
  },
  {
    question:
      "How can satellite constellations be optimized for global communication?",
    emoji: "🚀",
  },
];

const ExampleQuestion: React.FC<{
  onQuestionClick: (question: string) => void;
}> = ({ onQuestionClick }) => {
  return (
    <div className="w-full md:flex md:justify-between md:flex-wrap md:gap-5 p-5 md:w-fit">
      {researchQuestions.map((item, index) => (
        <div
          key={index}
          className="md:w-[47%] flex items-center p-2 rounded-lg bg-gray-50/20 shadow-md hover:bg-gray-300 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => onQuestionClick(item.question)}
        >
          <span className="text-lg md:text-3xl mr-4">{item.emoji}</span>
          <p className="text-sm md:text-md m-0 text-gray-800">{item.question}</p>
        </div>
      ))}
    </div>
  );
};

export function InputBox() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false); // New state to trigger submit after query update
  const [Complexity, setComplexity] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [TopicsLoading, setTopicsLoading] = useState(false)

  const searchPaperContext = useContext(SearchPaperContext);
  if (!SearchPaperContext) {
    return <div>Some problem occurred, sorry for the inconvenience!</div>;
  }
  const {
    searchPaperPage,
    setSearchPaperPage,
    paperRetrievalLoading,
    setPaperRetrievalLoading,
    paperRetrievalQuery,
    setPaperRetrievalQuery,
    isAtComplexMode,
    setIsAtComplexMode
  } = useSearchPaper();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPaperRetrievalQuery(e.target.value);
    if (e.target.value.length > 0 && !isExpanded) {
      setIsExpanded(true);
    } else if (e.target.value.length === 0 && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleSubmit = async () => {
    if (paperRetrievalQuery.trim().length > 0 && Complexity === false) {
      setPaperRetrievalLoading(true);
      try {
        const data = await fetchQueryResult(paperRetrievalQuery);
        console.log("Response data:", data);
        if (data) {
          const newSearchPaperPage: SearchPaperPage = {
            query: paperRetrievalQuery,
            queryResult: data,
            library: [],
          };
          await addSearchResult(data);
          setSearchPaperPage(newSearchPaperPage);
        }
        setIsExpanded(false);
      } catch (error) {
        console.error("Error fetching response:", error);
      }
      setPaperRetrievalLoading(false);
    } else if (paperRetrievalQuery.trim().length > 0 && Complexity === true) {
      setIsAtComplexMode(true);
      // setTopicsLoading(true)
      // await fetchTopics(paperRetrievalQuery.trim())
      // .then((topics) => {
      //   setSelectedTopics(topics)
      //   console.log('Fetched Topics:', topics);
      // })
      // .catch((error) => {
      //   console.error('Failed to fetch topics:', error);
      // });
      // setTopicsLoading(false)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      paperRetrievalQuery.trim().length > 0
    ) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuestionClick = (question: string) => {
    setPaperRetrievalQuery(question);
    setShouldSubmit(true); // Trigger submission after setting the query
  };

  // Trigger submit after state update
  useEffect(() => {
    if (shouldSubmit) {
      handleSubmit();
      setShouldSubmit(false); // Reset the trigger
    }
  }, [paperRetrievalQuery, shouldSubmit]);

  // useEffect(() => {
  //   const get_cache = async () => {
  //     if (selectedTopics.length > 0) return; // Prevent fetching if data already exists
  //     try {
  //       const data = await fetchTopicsCache();
  //       console.log("Cached topics data:", data);
  //       if (data) {
  //         setSelectedTopics(data)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching response:", error);
  //     }
  //   };
  //   get_cache();
    
  // }, [paperRetrievalQuery]); // Remove `searchPaperPage` from the dependency array

  return (
    <div className="w-full p-4">
      {!paperRetrievalLoading && !searchPaperPage && !isAtComplexMode && (
        <div className="text-gray-600 text-center text-4xl md:text-6xl font-bold mb-2">
          Thesius search
        </div>
      )}
      <div className="mx-auto p-1 md:p-2 relative bg-green-300/50 rounded-xl md:rounded-full overflow-hidden flex flex-row justify-center items-center">
        <Textarea
          value={paperRetrievalQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter your query..."
          className="w-full pr-16 py-2 md:py-4 px-3 md:px-6 text-gray-700 font-semibold text-sm md:text-lg leading-tight focus:outline-none resize-none overflow-hidden rounded-xl md:rounded-full"
          style={{ minHeight: "20px", maxHeight: "60px" }}
        />
        <div className="px-1 md:px-2">
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={
              paperRetrievalQuery?.trim().length === 0 || paperRetrievalLoading
            }
            className="bg-gray-800 text-white rounded-xl md:rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300"
          >
            <Send className="h-6 w-6" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
      {/* <div className="my-3 mx-8">
        <span className="text-lg font-semibold mr-2">Complex mode: </span>
        <CompelexitySwitch enabled={Complexity} setEnabled={setComplexity} />
      </div> */}
      {isAtComplexMode && TopicsLoading && <CommonLoader/>}
      {isAtComplexMode && selectedTopics && !TopicsLoading && <FilterBox selectedTopicsData={selectedTopics} />} 
      {!paperRetrievalLoading && !searchPaperPage && !isAtComplexMode && !TopicsLoading && (
        <ExampleQuestion onQuestionClick={handleQuestionClick} />
      )}
    </div>
  );
}

export default InputBox;
