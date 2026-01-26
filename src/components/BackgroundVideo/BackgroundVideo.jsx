import React from 'react'
import './BackgroundVideo.css'

/**
 * BackgroundVideo - A GIF-like background video component
 * 
 * Renders a native HTML5 <video> that autoplays, loops infinitely,
 * and behaves like a background element (not a media player).
 * 
 * @param {string} src - Path to the video file (required)
 * @param {string} poster - Fallback image shown before video loads (optional)
 * @param {string} className - Additional classes for the container (optional)
 * @param {string} videoClassName - Additional classes for the video element (optional)
 * @param {React.ReactNode} children - Overlay content rendered above the video (optional)
 */
const BackgroundVideo = ({ 
  src, 
  poster, 
  className = '', 
  videoClassName = '',
  children 
}) => {
  return (
    <div className={`background-video-container ${className}`}>
      <video
        className={`background-video ${videoClassName}`}
        // autoPlay: Starts playback automatically when the page loads
        autoPlay
        // loop: Restarts the video from the beginning when it ends (infinite playback)
        loop
        // muted: Required for autoplay to work on modern browsers (Chrome, Safari, etc.)
        muted
        // playsInline: Prevents iOS Safari from forcing fullscreen mode on play
        playsInline
        // disablePictureInPicture: Prevents the Picture-in-Picture button from appearing
        disablePictureInPicture
        // disableRemotePlayback: Prevents casting/AirPlay controls from appearing
        disableRemotePlayback
        // poster: Fallback image displayed before video loads or if video fails
        poster={poster}
        // preload: Hint to browser to load video metadata and some frames
        preload="auto"
      >
        {/* Primary video source */}
        <source src={src} type="video/mp4" />
        {/* Fallback message for browsers that don't support HTML5 video */}
        <p className="background-video-fallback">
          Your browser does not support HTML5 video.
        </p>
      </video>
      {/* Optional overlay content (gradients, text, etc.) rendered above video */}
      {children}
    </div>
  )
}

export default BackgroundVideo
