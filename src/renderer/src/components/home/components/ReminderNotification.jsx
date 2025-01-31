import React from 'react'

const ReminderNotification = () => {
  const dynamicSpans = [
    'Tomorrow holiday Let’s enjoy',
    'Tomorrow holiday Let’s enjoy',
    'Tomorrow holiday Let’s enjoy',
    'Tomorrow holiday Let’s enjoy',


  ] // Dynamic content 

  return (
    <div className="marquee-wrapper  overflow-hidden whitespace-nowrap bg-danger text-white py-2.5">
      <div
        className="marquee-content inline-block animate-marquee "
        // style={{ animation: `marquee 10s linear infinite` }}
      >
        {dynamicSpans.map((text, index) => (
          <span
            key={index}
            className="mx-4 relative after:content-[''] after:w-[1px] after:h-full after:absolute after:-right-4 after:top-0 after:bg-white/40 "
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ReminderNotification
