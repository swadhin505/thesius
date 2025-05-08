"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  BookOpenIcon,
  UsersIcon,
  LinkIcon,
  FileTextIcon,
  GraduationCapIcon,
  ExternalLinkIcon,
  ExternalLink,
  BookOpen,
  GitFork,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RelavantPapers from "./SubComponents/relevant-papers";
import PaperRelevance from "./SubComponents/query-answer";
import {
  AllRelatedPapersLinks,
  CitationorReference,
  PaperResponse,
} from "@/lib/paperdetails/schema";
// import { PaperData } from "@/lib/tools/searchengine/fetchresponse";
import {
  fetchPaperDetails,
  SearchRelatedPaperPdfLinks,
} from "@/lib/paperdetails/fetchResponse";
import Link from "next/link";
import { PaperCard, PaperIdProps } from "../tool-comp/common-comp/paper-card";
import { Footer } from "../global-comp/Footer";
import PaperDetailSkeleton from "../loading-skeletons/paper-detail-skeleton";
import { fetchQueryResultCache } from "@/lib/tools/searchengine/fetchResponse";
import { SearchPaperPage, useSearchPaper } from "@/context/SearchPapersContext";
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { savePaperDetails } from "@/lib/Savings/fetchSavedPaperData";

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

interface CitationorReferenceProps {
  paper: CitationorReference;
}

export default function Component() {
  const [activeTab, setActiveTab] = useState("references");
  const [isOpen, setIsOpen] = useState(false);
  const [parsedPaperIdProps, setParsedPaperIdProps] =
    useState<PaperIdProps | null>(null); // State to store mainPaperDetails
  const [mainPaperDetails, setMainPaper] = useState<PaperResponse | null>(null); // State to store fetched paper details
  const [relatedPapers, setRelatedPapers] =
    useState<AllRelatedPapersLinks | null>(null);
  const [paperDetailsLoading, setpaperDetailsLoading] = useState(true); // Loading state

  const searchParams = useSearchParams();
  const paperIdParcel = searchParams.get("paperIdParcel");
  const savedPaperIdParcel = searchParams.get("savedPaperIdParcel");

  const router = useRouter(); // initialize the router
  const { searchPaperPage, setSearchPaperPage, setPaperRetrievalQuery } =
    useSearchPaper(); // Use the hook
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  
  const [isFromDatabase, setIsFromDatabase] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const HandleSave = async () => {
    if (mainPaperDetails) {
      setIsSaving(true); // Disable the button
      await savePaperDetails(mainPaperDetails); // Save the result
      setIsSaving(false); // Re-enable if needed, though it's saved
      setIsSaved(true)
      openModal(); // Open modal to show the message
    }
  };

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    const getPaperDetails = async () => {
      if (paperIdParcel) {
        const parsed = JSON.parse(decodeURIComponent(paperIdParcel)); // Decode and parse
        setParsedPaperIdProps(parsed); // Store parsedPaper in state
        console.log("Parsed paperId data:", parsed);

        const data = await fetchQueryResultCache();
        if (data) {
          const newSearchPaperPage: SearchPaperPage = {
            query: data.query,
            queryResult: data,
            library: [],
          };
          setSearchPaperPage(newSearchPaperPage);
          setPaperRetrievalQuery(data.query);
        }
        const fetchedPaper = await fetchPaperDetails(parsed.paperId); // Call fetch function
        const relatedPapers = await SearchRelatedPaperPdfLinks(fetchedPaper.title);
        if (fetchedPaper) {
          setMainPaper(fetchedPaper); // Store fetched data in state
          console.log("Fetched paper details:", fetchedPaper);
        }
        if (relatedPapers) {
          setRelatedPapers(relatedPapers);
          console.log("Fetched related papers from links:", relatedPapers);
          setpaperDetailsLoading(false);
        }
      } 
      else if (savedPaperIdParcel) {
        setIsFromDatabase(true)
        const parsed = JSON.parse(decodeURIComponent(savedPaperIdParcel)); // Decode and parse
        setParsedPaperIdProps(parsed); // Store parsedPaper in state
        console.log("Parsed paperId data:", parsed);
        const fetchedPaper = await fetchPaperDetails(parsed.paperId); // Call fetch function
        const relatedPapers = await SearchRelatedPaperPdfLinks(fetchedPaper.title);
        if (fetchedPaper) {
          setMainPaper(fetchedPaper); // Store fetched data in state
          console.log("Fetched paper details:", fetchedPaper);
        }
        if (relatedPapers) {
          setRelatedPapers(relatedPapers);
          console.log("Fetched related papers from links:", relatedPapers);
          setpaperDetailsLoading(false);
        }
      }
      else {
        setpaperDetailsLoading(false);
        notFound();
      }
      
    };
    getPaperDetails();
  }, [paperIdParcel]);

  const handleButtonClick = (title: string, url: any) => {
    const parcel = {
      title: title,
      url: url,
    };
    const paperData = encodeURIComponent(JSON.stringify(parcel)); // Encode the paper data
    router.push(`/tool/paper-chat?paperData=${paperData}`); // Navigate with query parameter
  };

  if (paperDetailsLoading) {
    return (
      <div className="container mx-auto p-6">
        <PaperDetailSkeleton />
      </div>
    );
  }

  if (mainPaperDetails && parsedPaperIdProps) {
    return (
      <div className="container mx-auto p-6">
        {!isFromDatabase && !isSaved && (
              <>
                <Button
                  className="my-2 rounded-xl bg-green-500/50 hover:bg-green-600/50 text-gray-800 font-bold"
                  onClick={HandleSave}
                >
                  Save Paper to library
                </Button>
              </>
        )}
        {searchPaperPage && (
          <PaperRelevance
            query={searchPaperPage?.query}
            answer={searchPaperPage?.queryResult.final_answer}
          />
        )}
        <div className="flex flex-col lg:flex-row">
          <div>
            <div className="container mx-auto p-4 bg-background rounded-xl">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-4xl font-bold">
                    {mainPaperDetails.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 mt-2">
                    <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{mainPaperDetails.citationCount} Citations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GitFork className="w-4 h-4" />
                        <span>
                          {mainPaperDetails.referenceCount} References
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{mainPaperDetails.fieldsOfStudy.join(", ")}</span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground mb-4 rounded-xl border p-3">
                    <p className="text-xl sm:text-3xl font-bold mb-2">
                      Abstract
                    </p>
                    <div className="text-xs sm:text-lg overflow-y-auto h-[300px] sm:h-full pr-1">
                      {mainPaperDetails.abstract}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {mainPaperDetails.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {mainPaperDetails.venue}
                    </Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {mainPaperDetails.type}
                    </Badge>
                  </div>
                </CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <Card
                    className={
                      mainPaperDetails.isOpenAccess
                        ? "bg-green-100 m-4 flex-grow"
                        : "bg-red-100 m-4 flex-grow"
                    }
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen
                          size={16}
                          className={
                            mainPaperDetails.isOpenAccess
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        />
                        <span className="text-xs sm:text-sm font-semibold">
                          {mainPaperDetails.isOpenAccess
                            ? "Research paper is accessible"
                            : "Research paper is not accessible"}
                        </span>
                      </div>
                      {mainPaperDetails.isOpenAccess && (
                        <a
                          href={mainPaperDetails.openAccessPdf?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:underline"
                        >
                          View PDF <ExternalLink size={14} />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                  {mainPaperDetails.isOpenAccess ? (
                    <Button
                      onClick={() => {
                        // Handle arxiv.org URL transformation
                        const pdfUrl: string | undefined =
                          mainPaperDetails.openAccessPdf?.url;
                        const modifiedUrl: string | undefined =
                          pdfUrl && pdfUrl.includes("arxiv.org")
                            ? pdfUrl.replace("/abs/", "/pdf/")
                            : pdfUrl;
                        console.log(modifiedUrl)
                        handleButtonClick(
                          mainPaperDetails.title,
                          modifiedUrl || ""
                        );
                      }}
                      className="mx-4 my-2 w-[80%] md:w-1/3 font-bold rounded-xl p-5"
                    >
                      Chat with this paper
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              </Card>
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-between w-full p-10 mb-2 bg-gray-100 hover:bg-gray-200"
                  >
                    <span className="font-semibold text-3xl">Authors</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="my-2 space-y-2">
                  {mainPaperDetails.authors.map((author) => (
                    <Card
                      key={author.authorId}
                      className="bg-white transition-all hover:shadow-md"
                    >
                      <a
                        href={author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4"
                      >
                        <CardContent className="flex items-center space-x-4 p-0">
                          <User className="h-6 w-6 " />
                          <span className="text-xs sm:text-sm text-gray-700 hover:text-gray-800">
                            {author.name}
                          </span>
                        </CardContent>
                      </a>
                    </Card>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="references">
                    References ({mainPaperDetails.references.length})
                  </TabsTrigger>
                  <TabsTrigger value="citations">
                    {windowWidth > 700 &&
                      ` Citations ( max 20 are displayed ) (${mainPaperDetails.citations.length})`}
                    {windowWidth < 700 && ` Citations( max 20 )`}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="citations">
                  {searchPaperPage ? (
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      {mainPaperDetails.citations.map((citation) => (
                        <PaperCard
                          paper={citation}
                          query={searchPaperPage?.query}
                          query_answer={
                            searchPaperPage.queryResult.final_answer
                          }
                        />
                      ))}
                    </ScrollArea>
                  ):<ScrollArea className="h-[400px] rounded-md border p-4">
                  {mainPaperDetails.references.map((citation) => (
                    <PaperCard
                      paper={citation}
                      query=""
                      query_answer=""
                    />
                  ))}
                </ScrollArea>}
                </TabsContent>
                <TabsContent value="references">
                  {searchPaperPage ? (
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      {mainPaperDetails.references.map((reference) => (
                        <PaperCard
                          paper={reference}
                          query={searchPaperPage?.query}
                          query_answer={
                            searchPaperPage?.queryResult.final_answer
                          }
                        />
                      ))}
                    </ScrollArea>
                  ): <ScrollArea className="h-[400px] rounded-md border p-4">
                  {mainPaperDetails.references.map((reference) => (
                    <PaperCard
                      paper={reference}
                      query=""
                      query_answer=""
                    />
                  ))}
                </ScrollArea>}
                </TabsContent>
              </Tabs>
              <div className="mt-8 text-center">
                <a
                  href={mainPaperDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:underline text-blue-500"
                >
                  <span>View on OpenAlex</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-xl mt-4 lg:mt-0 lg:ml-2">
            {relatedPapers?.results && (
              <RelavantPapers results={relatedPapers?.results} />
            )}
          </div>
        </div>
        <SuccessModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    );
  }
}
