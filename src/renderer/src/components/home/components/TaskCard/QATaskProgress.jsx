

import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

// TaskProgress component
const QATaskProgress = ({ val, defaultColor = '#E4E4E4' }) => {
    
  // Helper function to calculate percentage
  const calculatePercentage = (time, totalTime) => {
    return (time / totalTime) * 100
  }

  // Generate progress data based on the task
  const getProgressData = () => {
    const totalTime = Math.max(val.testTotal_time, val.total_time_spent_by_user)
    const timeValues = [
      { time: val.testEst_time, name: 'Estimation Time' },
      { time: val.testCritical_time, name: 'Critical Time' },
      { time: totalTime, name: 'Total Time' }
    ]

    // Sort the timeValues array based on time (descending order)
    timeValues.sort((a, b) => b.time - a.time)

    // Assign colors based on the sorted order
    const colors = ['#000', '#FF0000', '#0E7C26']
    timeValues.forEach((item, index) => {
      item.color = colors[index]
    })

    // Create the progressData object, storing both percentage and name
    const progressData = {}
    timeValues.forEach(({ color, time, name }) => {
      progressData[color] = {
        percentage: Math.min(
          calculatePercentage(val.total_time_spent_by_user, totalTime),
          calculatePercentage(time, totalTime)
        ),
        name: name
      }
    })

    return progressData
  }

  const progressData = getProgressData()
  const colors = Object.keys(progressData)
  const segments = colors
    .map((color) => Math.max(0, Math.min(progressData[color].percentage, 100)))
    .sort((a, b) => b - a)

  // Calculate the total percentage from the provided colors
  const totalUsedPercentage = segments.reduce((acc, val) => acc + val, 0)
  const remainingPercentage = Math.max(0, 100 - totalUsedPercentage) // Remaining space for default color

  // Calculate the widths of each segment
  const totalWidth = 991 // Total width of the progress bar
  const segmentWidths = segments.map((p) => (p / 100) * totalWidth)
  const defaultWidth = (remainingPercentage / 100) * totalWidth // Width for the default color

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="991"
      height="12"
      viewBox="0 0 991 12"
      fill="none"
      className="w-full"
    >
      <rect width="991" height="12" rx="6" fill={defaultColor} />
      {segmentWidths.map((width, index) => {
        const color = colors[index]
        const { percentage, name } = progressData[color]

        if (color === '#000') {
          return (
            <rect
              key={index}
              width={width ? width : 0}
              height="12"
              rx="6"
              fill={color}
              className="transition-all duration-[1s] ease-in-out"
            />
          )
        }

        return (
          <Whisper
            key={index}
            trigger="hover"
            placement="auto"
            preventOverflow
            followCursor
            speaker={<Tooltip   >{`${percentage.toFixed(2)}% ${name}`}</Tooltip>}
          >
            <rect
              width={width || 0}
              height="12"
              rx="6"
              fill={color}
              className="transition-all duration-[1s] ease-in-out"
            />
          </Whisper>
        )
      })}
    </svg>
  )
}

export default QATaskProgress
