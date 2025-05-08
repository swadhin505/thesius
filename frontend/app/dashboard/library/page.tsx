"use client";
import React from "react";
import ProtectedRoute from "@/components/global-comp/protected-route";
import { SearchPaperProvider } from "@/context/SearchPapersContext";
import SavedResultsPage from "@/components/saving-comp/save-search-results-comp/Playground";
import SavedPapersPage from "@/components/saving-comp/save-paper-details-comp/Playground";
import { ExpandableSidebar } from "@/components/tool-comp/common-comp/expandable-sidebar";

const LibrayPage: React.FC = () => {
  return (
    <ProtectedRoute route={true}>
      <SearchPaperProvider>
        <div className="bg-gray-100 min-h-[100vh]">
          <h1 className="text-gray-800 text-xl sm:text-3xl md:text-5xl font-semibold pt-10 px-8 md:px-16 max-w-7xl mx-auto">Library</h1>
          <ExpandableSidebar />
          <SavedResultsPage />
          <SavedPapersPage />
        </div>
      </SearchPaperProvider>
    </ProtectedRoute>
  );
};

export default LibrayPage;
