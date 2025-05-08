import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { useRouter } from "next/navigation";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // Import Katex CSS
import "./styles.css";

interface QueryAnswerCardProps {
  query: string;
  answer: string;
}

export default function PaperRelevance({
  query = "What is the capital of France ?",
  answer = "The capital of France is Paris. Paris is not only the political center of France but also its cultural and economic heart. Known for its iconic landmarks like the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral, Paris attracts millions of visitors each year. The city is divided into 20 arrondissements (districts) and is crossed by the River Seine. Paris has been a center of art, fashion, gastronomy, and intellectual thought for centuries, earning it the nickname 'City of Light'.",
}: QueryAnswerCardProps) {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const router = useRouter(); // initialize the router
  const onBack = () => router.push(`/tool/search-papers`);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  
  if (answer.length > 0) {
    return (
      <Card className="w-full mx-auto shadow-lg rounded-xl my-2 p-2">
        <CardHeader className="bg-gray-700 text-primary-foreground relative p-6 rounded-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="absolute top-4 left-4 text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
            <span className="sr-only">Go back</span>
          </Button>
          <div className="ml-12">
            <h2 className="text-xl font-semibold mb-2">Query</h2>
            <p className="text-sm sm:text-lg">{query}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquare className="mr-2" />
            Answer
          </h2>
          <ReactMarkdown
            className={`markdown ${windowWidth < 500 ? "h-[200px] text-xs": "h-[200px] text-sm"} overflow-y-scroll px-4`}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {answer}
          </ReactMarkdown>
        </CardContent>
        <CardFooter className="bg-muted p-6 flex justify-between items-center">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Was this answer helpful?
          </div>
          <div className="space-x-2">
            <Button
              variant={feedback === "like" ? "default" : "outline"}
              size="sm"
              onClick={() => setFeedback("like")}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Yes
            </Button>
            <Button
              variant={feedback === "dislike" ? "default" : "outline"}
              size="sm"
              onClick={() => setFeedback("dislike")}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              No
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
  return <></>;
}
