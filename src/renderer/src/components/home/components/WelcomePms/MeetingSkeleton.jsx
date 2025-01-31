import React from 'react'

const MeetingSkeleton = () => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-400  animate-pulse">
      <div className="bg-dark p-2 flex justify-between items-center">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-full w-12 h-12 bg-gray-300"></div>
          ))}
        </div>
        <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
      </div>
      <div className="p-1 mt-2">
        <div className="grid grid-cols-3 gap-2 text-base items-center space-y-0">
          <div className="h-6 bg-gray-300 rounded"></div>
          <div className="h-6 bg-gray-300 rounded"></div>
          <div className="h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="p-1">
        <div className="h-6 bg-gray-300 rounded"></div>
      </div>
      <div className="p-1">
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
      <div className="p-1">
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

export default MeetingSkeleton
