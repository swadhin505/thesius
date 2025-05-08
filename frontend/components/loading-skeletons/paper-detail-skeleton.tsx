import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react";

export default function PaperDetailSkeleton() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  return (
      <div className="w-full mx-auto">
        <Skeleton className="h-[300px] w-full m-2" />
        <div className="flex">
          <Skeleton className={`${windowWidth > 900 ? "w-3/4" : "w-full" } h-[600px] m-2`}/>
          {windowWidth > 900 && <Skeleton className="w-1/4 h-[600px] m-2 mr-0"/>}
        </div>
      </div>
  )
}

