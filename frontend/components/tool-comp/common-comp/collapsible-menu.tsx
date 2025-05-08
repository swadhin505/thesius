'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function CollapsibleMenu() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-sm space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <CollapsibleTrigger asChild>
          <Button 
            size="sm" 
            className="w-full p-2 px-5 bg-transperant hover:bg-green-700/30 text-gray-800 transition-colors duration-200"
          >
            <p className="text-lg font-semibold text-left w-full">
              Tools
            </p>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <AnimatePresence>
        {isOpen && (
          <CollapsibleContent 
            asChild
            forceMount
          >
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1 overflow-hidden"
            >
              <div className="rounded-md border border-green-200 font-mono text-sm pt-1">
                <a href="/tool/search-papers" className="block w-full justify-start p-3 rounded-xl bg-green-100 hover:bg-green-300 text-green-800 font-bold">
                  Thesius search
                </a>
              </div>
              <div className="rounded-md border border-green-200 font-mono text-sm pt-1">
                <Link href="/tool/paper-chat" className="block w-full justify-start p-3 rounded-xl bg-green-100 hover:bg-green-300 text-green-800 font-bold">
                  Chat with paper
                </Link>
              </div>
              <div className="rounded-md border border-green-200 font-mono text-sm py-1">
                <Link href="/tool/search-papers" className="block w-full justify-start p-3 rounded-xl bg-green-100 hover:bg-green-300 text-green-800 font-bold">
                  Project planner <br /> (comming soon)
                </Link>
              </div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  )
}

