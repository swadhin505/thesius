"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // import router to navigate programmatically
import {
  ExternalLink,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
  FileText,
  Building,
  Type,
} from "lucide-react";
import {
  PaperData,
  isOpenAccessPdf,
} from "@/lib/tools/searchengine/fetchResponse";
import { CitationorReference } from "@/lib/paperdetails/schema";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MdScore } from "react-icons/md";

export interface PaperCardProps {
  paper: PaperData | CitationorReference;
  query: string;
  query_answer: string;
}

export interface PaperIdProps {
  paperId: string;
}

export function PaperCard({ paper, query, query_answer }: PaperCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter(); // initialize the router
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const handleCardClick = () => {
    const parcel: PaperIdProps = {
      paperId: paper.paperId,
    };
    const paperIdParcel = encodeURIComponent(JSON.stringify(parcel)); // Encode the paper data
    router.push(`/paperdetails?paperIdParcel=${paperIdParcel}`); // Navigate with query parameter
  };

  return (
    <Card
      className={`mt-2 cursor-pointer hover:bg-gray-100 ${
        paper.abstract && paper.abstract?.trim().length > 0 && "max-w-xl"
      } ${windowWidth < 900 && "max-w-full"}`}
      onClick={handleCardClick}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              {Array.isArray(paper.fieldsOfStudy) &&
                paper.fieldsOfStudy.map((label, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 w-fit"
                  >
                    {label}
                  </Badge>
                ))}
            </div>
            <CardTitle className="text-2xl font-bold leading-tight text-gray-900">
              {paper.title}
            </CardTitle>
            <p className="my-1 font-bold">{paper.venue}</p>
          </div>
        </div>
        <ScrollArea className="h-[100px] w-full rounded-md border p-4 overflow-y-scroll">
          <CardDescription className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-600">
            {paper.abstract}
          </CardDescription>
        </ScrollArea>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg bg-gray-50 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Sparkles className="h-4 w-4" />
              Citations
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-900">{paper.citationCount}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              Year
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-900">{paper.year}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Type className="h-4 w-4" />
              Type
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{paper.type}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MdScore className="h-4 w-4" />
              Relevance
            </div>
            {<p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{paper.similarity}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">
              Citation Percentile
            </p>
            <p className="font-semibold text-emerald-600">
              {paper.citation_normalized_percentile?.is_in_top_1_percent
                ? "is in top 1 percent"
                : paper.citation_normalized_percentile?.is_in_top_10_percent &&
                  "is in top 10 percent"}
            </p>
          </div>
          <Card
            className={`${paper.isOpenAccess ? "bg-green-100" : "bg-red-100"}`}
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen
                  size={16}
                  className={
                    paper.isOpenAccess ? "text-green-600" : "text-red-600"
                  }
                />
                <span className="text-sm font-semibold">
                  {paper.isOpenAccess ? "Open Access" : "Closed Access"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
