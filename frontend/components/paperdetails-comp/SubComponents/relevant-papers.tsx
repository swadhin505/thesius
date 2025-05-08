import { Button } from "@/components/ui/button"
import { RelatedPapersLink } from "@/lib/paperdetails/schema"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Paper {
  title: string
  tldr: string
  year: number
  author: string
}

interface RelatedPapersLinkProps {
  results: RelatedPapersLink[]
}

export default function RelavantPapers({results} : RelatedPapersLinkProps) {
  const relatedPdfs: RelatedPapersLink[] = results
  const router = useRouter(); // initialize the router

  const handleButtonClick = (title: string, url: string) => {
    const parcel = {
      title: title,
      url: url
    }
    const paperData = encodeURIComponent(JSON.stringify(parcel)); // Encode the paper data
    router.push(`/tool/paper-chat?paperData=${paperData}`); // Navigate with query parameter
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h2 className="text-lg sm:text-2xl font-bold mb-6">Papers from the web which are similar to this paper for chat: </h2>
      <ul className="space-y-4">
        {relatedPdfs.map((paper, index) => (
          <>
            <li key={index} className="p-4 bg-card rounded-lg shadow">
              <div className="flex-grow mr-4">
                <h3 className="text-sm sm:text-lg font-semibold">{paper.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground overflow-y-scroll max-h-16 p-2 bg-gray-100 rounded-xl my-3">{paper.description}</p>
              </div>
              <Button onClick={() => handleButtonClick(paper.title, paper.url)} className="whitespace-nowrap font-semibold bg-black mt-1 mr-2 p-2 rounded-md text-white text-xs sm:text-sm">
                Chat with the paper
              </Button>
              <Link href={`${paper.url}`} className="whitespace-nowrap font-semibold bg-black mt-1 p-2 py-[10px] rounded-md text-white text-xs sm:text-sm">
                Download
              </Link>
            </li>
          </>
        ))}
      </ul>
    </div>
  )
}