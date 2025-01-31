import React from 'react'
import { Tooltip, Whisper } from 'rsuite'
import 'rsuite/dist/rsuite.min.css' // Import rsuite CSS

const ProgressBar = ({ segments }) => {
  // Sort segments by percentage in ascending order
  const sortedSegments = [...segments].sort((a, b) => a.percentage - b.percentage)

  return (
    <div className="w-[990px] h-3 relative">
      <div className="w-full h-3 left-0 top-0 absolute bg-[#e4e4e4] rounded-[33px]" />
      {sortedSegments.map((segment, index) => (
        <Whisper
          key={index}
          placement="top"
          trigger="hover"
          followCursor
          speaker={<Tooltip>{segment.tooltip}</Tooltip>}
        >
          <div
            className={`h-3 left-0 top-0 absolute rounded-[33px] cursor-pointer transition-all duration-[1s]`}
            style={{
              width: `${segment.percentage}%`,
              backgroundColor: segment.color,
              zIndex: index + 1
            }}
          />
        </Whisper>
      ))}
    </div>
  )
}

export default ProgressBar
