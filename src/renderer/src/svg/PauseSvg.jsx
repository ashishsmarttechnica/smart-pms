import React from 'react'

const PauseSvg = ({ isDark }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 4H7C6.44772 4 6 4.44772 6 5V19C6 19.5523 6.44772 20 7 20H10C10.5523 20 11 19.5523 11 19V5C11 4.44772 10.5523 4 10 4Z"
        fill={isDark ? '#292929' : 'white'}
      />
      <path
        d="M17 4H14C13.4477 4 13 4.44772 13 5V19C13 19.5523 13.4477 20 14 20H17C17.5523 20 18 19.5523 18 19V5C18 4.44772 17.5523 4 17 4Z"
        fill={isDark ? '#292929' : 'white'}
      />
    </svg>
  )
}

export default PauseSvg