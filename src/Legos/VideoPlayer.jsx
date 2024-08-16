import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId, height = '390', width = '640' }) => {
  const opts = {
    height,
    width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return <YouTube videoId={videoId} opts={opts} onReady={onReady} />;
};

export default VideoPlayer;


//  Usage:
//
//      <YouTubePlayer videoId="dQw4w9WgXcQ" />
//
