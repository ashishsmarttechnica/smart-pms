import React from 'react'

const StopSvg = ({ isDark }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="5" width="14" height="14" rx="2" fill={isDark ? '#292929' : 'white'} />
    </svg>
  )
}

export default StopSvg
