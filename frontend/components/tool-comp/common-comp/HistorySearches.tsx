"use client";
import React, { useState, useEffect } from "react";
import { fetchAllSavedResults } from "@/lib/Savings/fetchSavedSearchResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Trash } from "lucide-react";
import { SavedSearchResult } from "@/lib/Savings/schema";
import { useRouter } from "next/navigation";

export interface SavedResultProp {
  resultId: string;
}

const HistorySearches: React.FC = () => {
  const [savedResults, setSavedResults] = useState<SavedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // initialize the router

  // Fetch saved results on component mount
  useEffect(() => {
    const loadSavedResults = async () => {
      try {
        setIsLoading(true);
        const results = await fetchAllSavedResults();
        console.log(results);
        setSavedResults(results);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedResults();
  }, []);

  const handleCardClick = (result: SavedSearchResult) => {
    // Encode the paper data
    router.push(`/tool/search-papers?resultId=${result._id}`); // Navigate with query parameter
  };

  return (
    <div className="h-fit bg-green-100 rounded-xl my-2">
      <div className="mx-auto p-1 max-w-7xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-md font-bold mx-2">History</h1>
        </div>

        {savedResults.length === 0 ? (
          <p className="text-center text-gray-500">No History.</p>
        ) : (
          <div className="flex flex-col">
            {savedResults.map((result) => (
              <div
                onClick={() => {
                  handleCardClick(result);
                }}
                key={result._id}
                className="flex flex-col bg-green-200 hover:bg-green-300 rounded-xl mb-1 hover:cursor-pointer"
              >
                <div className="truncate text-xs font-semibold p-2">{result.data.query}</div>
                {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteResult(result._id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySearches;
