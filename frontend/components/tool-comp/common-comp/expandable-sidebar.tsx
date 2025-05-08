"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronLeft, Home, Settings, Users, HelpCircle, Menu, User, Library, Book, File, PanelTopClose, PanelBottomClose, HistoryIcon } from "lucide-react"
import Link from "next/link"
import { CollapsibleMenu } from "./collapsible-menu"
import { FaTools } from "react-icons/fa"
import HistorySearches from "./HistorySearches"

export function ExpandableSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCompletelyHidden, setIsCompletelyHidden] = useState(false)

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleFullSidebar = () => {
    setIsCompletelyHidden(!isCompletelyHidden)
  }

  return (
    <>
      <div
        className={`fixed z-10 left-0 top-0 m-[1vh] h-[98vh] bg-green-300/50 backdrop-blur-lg transition-all duration-300 ease-in-out rounded-lg shadow-lg ${
          isCompletelyHidden ? '-translate-x-full' : isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            {isExpanded && <span className="text-lg font-semibold">Menu</span>}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
              {isExpanded ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <nav className="flex flex-col space-y-2 p-2">
              <div>
                <SidebarItem route="/" icon={<Home className="font-bold h-4 w-4" />} text="Home" isExpanded={isExpanded} />
                <SidebarItem route="/dashboard/library" icon={<File className="font-bold h-4 w-4" />} text="Library" isExpanded={isExpanded} />
                {isExpanded ? <CollapsibleMenu /> : <div onClick={()=>{setIsExpanded(!isExpanded)}}><SidebarItem route="" icon={<PanelBottomClose className="font-bold h-4 w-4" />} text="Library" isExpanded={isExpanded} /></div>}
                {isExpanded ? <HistorySearches /> : <div onClick={()=>{setIsExpanded(!isExpanded)}}><SidebarItem route="" icon={<HistoryIcon className="font-bold h-4 w-4" />} text="Library" isExpanded={isExpanded} /></div>}
              </div>
            </nav>
          </ScrollArea>
          <div className="m-2">
            <SidebarItem route="/dashboard" icon={<User className="font-bold h-4 w-4" />} text="Dashboard" isExpanded={isExpanded} />
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullSidebar}
        className={`z-10 fixed top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out p-2 m-4 bg-green-300 hover:bg-green-600 rounded-full ${
          isCompletelyHidden ? 'left-0' : isExpanded ? 'left-64' : 'left-16'
        }`}
      >
        {isCompletelyHidden ? <ChevronRight className="font-bold h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>
    </>
  )
}

function SidebarItem({
  icon,
  text,
  isExpanded,
  route
}: {
  icon: React.ReactNode
  text: string
  isExpanded: boolean
  route: string
}) {
  return (
    route.length > 0 ? <Link
      href={route}
      className={`flex items-center w-full font-bold ${isExpanded ? 'px-4 justify-start' : 'px-2 justify-center'}  hover:bg-green-500/50 rounded-xl p-2`}
    >
      <div className="font-bold">{icon}</div>
      {isExpanded && <span className="ml-2">{text}</span>}
    </Link> : <div
      className={`flex items-center w-full font-bold ${isExpanded ? 'px-4 justify-start' : 'px-2 justify-center'}  hover:bg-green-500/50 rounded-xl p-2`}
    >
      <div className="font-bold">{icon}</div>
      {isExpanded && <span className="ml-2">{text}</span>}
    </div>
  )
}
