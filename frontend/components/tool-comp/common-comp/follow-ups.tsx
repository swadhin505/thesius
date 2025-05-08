import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import SearchPaperContext, { SearchPaperPage, useSearchPaper } from "@/context/SearchPapersContext"
import { Search } from "lucide-react"
import { useContext, useState } from "react"
import { fetchQueryResult } from "@/lib/tools/searchengine/fetchResponse";


interface FollowUpQuestionsProps {
  questions: string[]
}

export default function FollowUpQuestionsCard({ questions = [
  "What are the potential implications?",
  "How does this compare to previous findings?",
  "What further research is needed?"
] }: FollowUpQuestionsProps) {

  const searchpapercontext = useContext(SearchPaperContext);
  const { searchPaperPage, setSearchPaperPage, paperRetrievalLoading, setPaperRetrievalLoading, paperRetrievalQuery, setPaperRetrievalQuery } = useSearchPaper();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const handleClick = async (question: string) => {
    setPaperRetrievalQuery(question);
    if (paperRetrievalQuery.trim().length > 0) {
        setPaperRetrievalLoading(true);
        try {
            const data = await fetchQueryResult(question); // Call fetchQueryResult with the question
            console.log("Response data:", data); // Handle the returned data as needed
            if (data) {
                const newSearchPaperPage: SearchPaperPage = {
                    query: question,
                    queryResult: data,
                    library: []
                };
                setSearchPaperPage(newSearchPaperPage);
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
        setPaperRetrievalLoading(false);

        // Remove all parameters from the URL
        window.history.replaceState(null, "", window.location.pathname);

        // Reload the page
        window.location.reload();
    }
};


  return (
    <Card className="w-full md:max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Related questions:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {questions.slice(0, 3).map((question, index) => (
            <Button 
              key={index} 
              onClick={() => handleClick(question)}
              value={question}
              variant="outline" 
              className={`${windowWidth < 500 ? "text-xs": "text-sm"} w-full h-auto py-2 px-4 text-left justify-start items-center font-normal whitespace-normal`}
            >
              <Search className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{question}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}