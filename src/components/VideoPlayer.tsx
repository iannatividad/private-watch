"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import getVideoURL from "../utils/getVideoURL";
import formatDuration from "format-duration";

interface VideoPlayerProps {
  fileName: string;
}

const VideoPlayer = ({ fileName }: VideoPlayerProps) => {
  const [url, setUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [hasSeeked, setHasSeeked] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    const fetchVideoURL = async () => {
      const videoURL = await getVideoURL(fileName);
      setUrl(videoURL);
    };

    fetchVideoURL();
    const savedProgress = localStorage.getItem(`video-progress-${fileName}`);
    if (savedProgress) {
      setProgress(+savedProgress);
    }
  }, [fileName]);

  const handleProgress = (state: { playedSeconds: number }) => {
    const roundedProgress = Math.round(state.playedSeconds);

    setProgress(roundedProgress);

    console.log("roundedProgress: ", roundedProgress);
    localStorage.setItem(
      `video-progress-${fileName}`,
      roundedProgress.toString(),
    );
  };

  const handleReady = () => {
    if (playerRef.current && !hasSeeked) {
      playerRef.current.seekTo(progress, "seconds");
      setHasSeeked(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Fragment>
      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={url}
          className="react-player"
          width="100%"
          height="100%"
          controls
          playing
          onProgress={handleProgress}
          progressInterval={1000}
          config={{ file: { attributes: { controlsList: "nodownload" } } }}
          onReady={handleReady}
        />
      </div>
      <div className="w-full flex items-center justify-center mt-8">
        <p className="text-white text-sm">{formatTime(progress)}</p>
      </div>
    </Fragment>
  );
};

export default VideoPlayer;
