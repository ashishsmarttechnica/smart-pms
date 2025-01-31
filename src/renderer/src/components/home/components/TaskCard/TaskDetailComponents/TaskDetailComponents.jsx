export const Fullscreen = ({ onClick, isFullscreen, setIsFullscreen }) => (
  <button
    onClick={() => {
      onClick()
      setIsFullscreen(!isFullscreen) // Toggle fullscreen state
    }}
    className="custom-fullscreen-btn mainHover absolute top-2 right-2 text-white bg-darkBlue p-2 rounded-full shadow-md"
    aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
  >
    {isFullscreen ? (
      // SVG for Exit Fullscreen
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H7.5C6.94772 1.5 6.5 1.94772 6.5 2.5V6.5H2.5C1.94772 6.5 1.5 6.94772 1.5 7.5V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H7Z"
          fill="#fff"
        />
        <path
          d="M17 9.5C15.6193 9.5 14.5 8.38071 14.5 7V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H16.5C17.0523 1.5 17.5 1.94772 17.5 2.5V6.5H21.5C22.0523 6.5 22.5 6.94772 22.5 7.5V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H17Z"
          fill="#fff"
        />
        <path
          d="M17 14.5C15.6193 14.5 14.5 15.6193 14.5 17V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H16.5C17.0523 22.5 17.5 22.0523 17.5 21.5V17.5H21.5C22.0523 17.5 22.5 17.0523 22.5 16.5V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H17Z"
          fill="#fff"
        />
        <path
          d="M9.5 17C9.5 15.6193 8.38071 14.5 7 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V16.5C1.5 17.0523 1.94772 17.5 2.5 17.5H6.5V21.5C6.5 22.0523 6.94772 22.5 7.5 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V17Z"
          fill="#fff"
        />
      </svg>
    ) : (
      // SVG for Enter Fullscreen
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H3.5C4.05228 9.5 4.5 9.05228 4.5 8.5V4.5H8.5C9.05228 4.5 9.5 4.05228 9.5 3.5V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H4Z"
          fill="#fff"
        />
        <path
          d="M20 1.5C21.3807 1.5 22.5 2.61929 22.5 4V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H20.5C19.9477 9.5 19.5 9.05228 19.5 8.5V4.5H15.5C14.9477 4.5 14.5 4.05228 14.5 3.5V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H20Z"
          fill="#fff"
        />
        <path
          d="M20 22.5C21.3807 22.5 22.5 21.3807 22.5 20V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H20.5C19.9477 14.5 19.5 14.9477 19.5 15.5V19.5H15.5C14.9477 19.5 14.5 19.9477 14.5 20.5V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H20Z"
          fill="#fff"
        />
        <path
          d="M1.5 20C1.5 21.3807 2.61929 22.5 4 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V20.5C9.5 19.9477 9.05228 19.5 8.5 19.5H4.5V15.5C4.5 14.9477 4.05228 14.5 3.5 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V20Z"
          fill="#fff"
        />
      </svg>
    )}
  </button>
)

export const CustomPrevButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="custom-nav-btn mainHover z-10 prev-btn absolute left-1 top-1/2 transform -translate-y-1/2 text-white bg-darkBlue p-1 rounded-full shadow-md"
    aria-label="Previous"
  >
    {/* SVG for Previous */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
    </svg>
  </button>
)
export const CustomNextButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="custom-nav-btn mainHover z-10 next-btn absolute right-1 top-1/2 transform -translate-y-1/2 text-white bg-darkBlue p-1 rounded-full shadow-md"
    aria-label="Next"
  >
    {/* SVG for Next */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  </button>
)

export const PlayPause = ({ onClick, isPlaying }) => (
  <button
    onClick={() => {
      onClick()
    }}
    className="custom-fullscreen-btn mainHover absolute bottom-2 left-2 text-white bg-darkBlue p-2 rounded-full shadow-md"
    aria-label={isPlaying ? 'Play' : 'Pause'}
  >
    {!isPlaying ? (
      // SVG for Play
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z"
          stroke="#ffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      // SVG for Pause
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        strokeWidth="2"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 5C10 3.34315 8.65686 2 7 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H7C8.65686 22 10 20.6569 10 19V5ZM8 5C8 4.44772 7.55229 4 7 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H7C7.55229 20 8 19.5523 8 19V5Z"
          fill="#ffff"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22 5C22 3.34315 20.6569 2 19 2H17C15.3431 2 14 3.34315 14 5V19C14 20.6569 15.3431 22 17 22H19C20.6569 22 22 20.6569 22 19V5ZM20 5C20 4.44772 19.5523 4 19 4H17C16.4477 4 16 4.44772 16 5V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V5Z"
          fill="#ffff"
        />
      </svg>
    )}
  </button>
)

// Render custom image with cross-origin
export const renderCustomImage = (item) => (
  <img
    src={item.original}
    alt="Image"
    crossOrigin="anonymous"
    className="gallery-image w-full object-cover h-[250px] bg-black rounded-sm"
  />
)
