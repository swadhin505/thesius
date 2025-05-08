import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, BookOpenIcon, UsersIcon, LinkIcon, FileTextIcon, GraduationCapIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import RelavantPapers from "./SubComponents/relevant-papers"
import PaperRelevance from "./SubComponents/query-answer"

export default function Component() {
  const [activeTab, setActiveTab] = useState("references")

  // Main paper details
  const mainPaper = {
    title: "Construction of the Literature Graph in Semantic Scholar",
    abstract: "We describe a deployed scalable system for organizing published scientific literature into a heterogeneous graph to facilitate algorithmic manipulation and discovery.",
    publicationDate: "April 29, 2024",
    venue: "Annual Meeting of the Association for Computational Linguistics",
    authors: "Oren Etzioni, et al.",
    doi: "10.18653/V1/2020.ACL-MAIN.447",
    citations: 453,
    influentialCitations: 90,
    references: 59,
    publicationTypes: ["Journal Article", "Review"],
    journal: {
      name: "IETE Technical Review",
      volume: "40",
      pages: "116-135"
    },
    url: "https://www.semanticscholar.org/paper/5c5751d45e298cea054f32b392c12c61027d2fe7",
    openAccessPdf: "https://www.aclweb.org/anthology/2020.acl-main.447.pdf",
    fieldsOfStudy: ["Computer Science", "Mathematics"]
  }

  // Sample reference papers and citations (for demonstration purposes)
  const referencePapers = [
    {
      url: "https://example.com/paper1",
      title: "Advances in Natural Language Processing",
      tldr: "This paper presents recent advancements in NLP techniques, focusing on transformer models and their applications.",
      year: 2023,
      citationCount: 150,
      influentialCitationCount: 30,
      isOpenAccess: true,
      openAccessPdf: { url: "https://example.com/paper1.pdf" },
      fieldsOfStudy: ["Computer Science", "Artificial Intelligence"]
    },
    {
      url: "https://example.com/paper2",
      title: "Graph-based Approaches in Computational Linguistics",
      tldr: "This study explores various graph-based methods for solving complex problems in computational linguistics.",
      year: 2022,
      citationCount: 85,
      influentialCitationCount: 15,
      isOpenAccess: false,
      openAccessPdf: { url: null },
      fieldsOfStudy: ["Computer Science", "Linguistics"]
    },
  ]

  const citations = [
    {
      url: "https://example.com/citation1",
      title: "Improving Literature Graph Analysis with Advanced NLP Techniques",
      tldr: "This paper builds upon the Literature Graph in Semantic Scholar, proposing enhancements using state-of-the-art NLP models.",
      year: 2025,
      citationCount: 30,
      influentialCitationCount: 5,
      isOpenAccess: true,
      openAccessPdf: { url: "https://example.com/citation1.pdf" },
      fieldsOfStudy: ["Computer Science", "Natural Language Processing"]
    },
    {
      url: "https://example.com/citation2",
      title: "Applications of Literature Graphs in Bibliometric Analysis",
      tldr: "This study demonstrates how literature graphs can be leveraged for comprehensive bibliometric analysis across various scientific domains.",
      year: 2024,
      citationCount: 45,
      influentialCitationCount: 8,
      isOpenAccess: false,
      openAccessPdf: { url: null },
      fieldsOfStudy: ["Information Science", "Bibliometrics"]
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <PaperRelevance />
      <div className="flex">
        <div>
            <Card className="w-full mx-auto mb-2">
                <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                    {mainPaper.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                    {mainPaper.fieldsOfStudy.map((field) => (
                    <Badge key={field} variant="secondary">{field}</Badge>
                    ))}
                </div>
                </CardHeader>
                <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground">
                    {mainPaper.abstract}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={<CalendarIcon className="h-5 w-5" />} label="Publication Date" value={mainPaper.publicationDate} />
                    <InfoItem icon={<BookOpenIcon className="h-5 w-5" />} label="Venue" value={mainPaper.venue} />
                    <InfoItem icon={<UsersIcon className="h-5 w-5" />} label="Authors" value={mainPaper.authors} />
                    <InfoItem icon={<LinkIcon className="h-5 w-5" />} label="DOI" value={mainPaper.doi} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Citations" value={mainPaper.citations} />
                    <StatCard title="Influential Citations" value={mainPaper.influentialCitations} />
                    <StatCard title="References" value={mainPaper.references} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Publication Types</h3>
                    <div className="flex flex-wrap gap-2">
                    {mainPaper.publicationTypes.map((type) => (
                        <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Journal Information</h3>
                    <p>{mainPaper.journal.name}, Volume {mainPaper.journal.volume}, Pages {mainPaper.journal.pages}</p>
                </div>

                <div className="flex items-center justify-between">
                    <a 
                    href={mainPaper.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                    >
                    <FileTextIcon className="h-5 w-5 mr-2" />
                    View on Semantic Scholar
                    </a>
                    <a 
                    href={mainPaper.openAccessPdf}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                    >
                    <GraduationCapIcon className="h-5 w-5 mr-2" />
                    Open Access PDF
                    </a>
                </div>
                </CardContent>
            </Card>

            <Card className="w-full mx-auto">
                <CardHeader>
                <CardTitle className="text-2xl font-bold">Related Papers</CardTitle>
                </CardHeader>
                <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="references">References ({referencePapers.length})</TabsTrigger>
                    <TabsTrigger value="citations">Citations ({citations.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="references">
                    <PaperList papers={referencePapers} />
                    </TabsContent>
                    <TabsContent value="citations">
                    <PaperList papers={citations} />
                    </TabsContent>
                </Tabs>
                </CardContent>
            </Card>
        </div>
        <div className="bg-background rounded-xl ml-2">
            <RelavantPapers />
        </div>
      </div>
    </div>
  )
}

function PaperList({ papers }) {
  return (
    <div className="space-y-6 mt-6">
      {papers.map((paper, index) => (
        <Card key={index} className="bg-muted">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-xl font-semibold">{paper.title}</h3>
            <p className="text-sm text-muted-foreground">{paper.tldr}</p>
            <div className="flex flex-wrap gap-2">
              {paper.fieldsOfStudy.map((field) => (
                <Badge key={field} variant="secondary">{field}</Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <InfoItem icon={<CalendarIcon className="h-4 w-4" />} label="Year" value={paper.year} />
              <InfoItem icon={<FileTextIcon className="h-4 w-4" />} label="Citations" value={paper.citationCount} />
              <InfoItem icon={<GraduationCapIcon className="h-4 w-4" />} label="Influential Citations" value={paper.influentialCitationCount} />
              <InfoItem icon={<BookOpenIcon className="h-4 w-4" />} label="Open Access" value={paper.isOpenAccess ? "Yes" : "No"} />
            </div>
            <div className="flex justify-between items-center">
              <a 
                href={paper.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                <ExternalLinkIcon className="h-4 w-4 mr-1" />
                View Paper
              </a>
              {paper.isOpenAccess && paper.openAccessPdf.url && (
                <Button asChild variant="outline" size="sm">
                  <a 
                    href={paper.openAccessPdf.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open Access PDF
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  )
}