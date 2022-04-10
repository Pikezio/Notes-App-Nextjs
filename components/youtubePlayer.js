import React from "react";
import ReactPlayer from "react-player";

const YoutubePlayer = ({ videoUrl }) => {
  return (
    <div>
      <h1>Video</h1>
      <ReactPlayer url={videoUrl} controls={true} width="100%" height={600} />
    </div>
  );
};

export default YoutubePlayer;
