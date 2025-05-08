import React from 'react'

export default function CommonLoader() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">
          Analysing and finding the topics of the query
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <span className="inline-block animate-pulse">.</span>
          <span className="inline-block animate-pulse animation-delay-200">.</span>
          <span className="inline-block animate-pulse animation-delay-400">.</span>
        </div>
      </div>
    </div>
  )
}

