import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, Brain, Search } from 'lucide-react'
import { useState } from "react";

export default function LoadingSkeleton() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  return (
      <div className="w-full flex flex-row-reverse gap-4">
        {windowWidth > 900 && <div className="w-full max-w-3xl">
          <div className="mb-6">
            <div className="text-3xl my-2 font-bold text-gray-900 flex items-center">
              <span className="mr-2">AI Summary</span>
              <Sparkles className="h-6 w-6" />
            </div>
            <Skeleton className="w-full mb-4 h-[300px]" />
            <div className="space-y-2 mb-4 flex flex-col justify-center items-center">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
          <div>
            <div className="text-3xl my-2 font-bold text-gray-900 flex items-center">
              <span className="mr-2">Dive Deeper</span>
              <Brain className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>}
        <div className="flex-grow">
          <div className="text-3xl px-4 md:px-0 my-2 font-bold text-gray-900 flex items-center">
            <span className="mx-2 md:mr-2">Results</span>
            <Search className="h-6 w-6" />
          </div>
          <div className="space-y-4 px-4 md:px-0">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[250px] px-2 md:px-0 md:h-[336px] w-full" />
            ))}
          </div>
        </div>
      </div>
  )
}

