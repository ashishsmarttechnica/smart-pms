import React, { useContext } from 'react'

const AfkUser = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen rounded-lg bg-black/60">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 w-[650px] h-[350px] rounded-md  shadow-lg  text-center flex items-center justify-center flex-col">
        <div className="text-white text-3xl font-bold mb-4">User is Away</div>

        <div className="text-white text-xl mb-4">
          The user has been inactive for a while and is now marked as AFK (Away From Keyboard).
        </div>
      </div>
    </div>
  )
}
export default AfkUser
