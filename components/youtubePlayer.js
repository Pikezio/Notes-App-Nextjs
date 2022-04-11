import React, { useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ReactPlayer from "react-player";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";

const YoutubePlayer = ({ videoUrl }) => {
  const player = useRef();
  const [playing, setPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(0);

  const checkProgress = (progress) => {
    const time = progress.playedSeconds;
    setCurrentTime(time);
    // If start and end times are set, loop the video
    if (startTime != 0 && endTime > startTime && time > endTime) {
      // Set player time to the loop start time
      player.current.seekTo(startTime);
      setPlaying(true);
    }
  };

  return (
    <div>
      <h1>Video</h1>
      <ReactPlayer
        ref={player}
        url={videoUrl}
        playing={playing}
        volume={volume}
        controls={true}
        width="100%"
        height={600}
        onProgress={checkProgress}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="py-2">
        <Button onClick={() => setStartTime(currentTime)}>
          Pradžia {startTime / 60}
        </Button>
        <Button className="mx-2" onClick={() => setEndTime(currentTime)}>
          Pabaiga {endTime / 60}
        </Button>
        <Form.Group as={Row}>
          <Form.Label column sm="4">
            <span>Garsas </span>
          </Form.Label>
          <Col sm="8">
            <RangeSlider
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={(e) => setVolume(e.target.value)}
            />
          </Col>
        </Form.Group>
      </div>
    </div>
  );
};

export default YoutubePlayer;
