"use client";
import React, { useState, useEffect } from "react";
import {
  fetchAllSavedResults,
  deleteSearchResultById,
  deleteAllSearchResults,
} from "@/lib/Savings/fetchSavedSearchResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Trash } from "lucide-react";
import { SavedSearchResult } from "@/lib/Savings/schema";
import ProtectedRoute from "@/components/global-comp/protected-route";
import { ExpandableSidebar } from "@/components/tool-comp/common-comp/expandable-sidebar";
import { SearchPaperProvider } from "@/context/SearchPapersContext";
import { useRouter } from "next/navigation";

export interface SavedResultProp {
  resultId: string;
}

const SavedResultsPage: React.FC = () => {
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

  // Handler to delete a single result
  const handleDeleteResult = async (itemId: string) => {
    try {
      await deleteSearchResultById(itemId);
      setSavedResults((prev) => prev.filter((result) => result._id !== itemId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handler to delete all results
  const handleDeleteAllResults = async () => {
    try {
      await deleteAllSearchResults();
      setSavedResults([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCardClick = (result: SavedSearchResult) => {
    // Encode the paper data
    router.push(`/tool/search-papers?resultId=${result._id}`); // Navigate with query parameter
  };

  return (
    <div className="h-fit">
      <div className="mx-auto p-8 md:p-16 max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-2xl font-bold">Saved Search Results</h1>
          {savedResults.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteAllResults}
              className="flex items-center gap-2 rounded-xl text-xs md:text-sm"
            >
              <Trash size={16} /> Delete All
            </Button>
          )}
        </div>

        {savedResults.length === 0 ? (
          <p className="text-center text-gray-500">No saved results found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedResults.map((result) => (
              <Card key={result._id} className="flex flex-col">
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle className="truncate text-sm sm:text-md">
                    {result.data.query}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteResult(result._id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </CardHeader>
                <CardContent className="text-gray-800 text-sm flex justify-between flex-wrap items-center">
                  <Button
                    onClick={() => {
                      handleCardClick(result);
                    }}
                    className="p-3 rounded-xl bg-green-500 hover:bg-green-600 w-fit my-1"
                  >
                    Open result
                  </Button>
                  <p>{result.time.replace("T0", "  ").slice(0, -7)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedResultsPage;
