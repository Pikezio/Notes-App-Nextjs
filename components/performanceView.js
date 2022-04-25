import axios from "axios";
import moment from "moment";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, ListGroup, Modal, Row } from "react-bootstrap";
import PDFViewer from "./pdfs/pdfViewer";

const PerformanceView = ({ concert }) => {
  const [part, setPart] = useState(null);
  const [selectedSong, setSelectedSong] = useState(concert.songs[0]._id);
  const [time, setTime] = useState(new Date());

  const initialState = concert.songs.map((song) => ({
    _id: song._id,
    part: song.instruments[0],
  }));
  const [songsAndParts, setSongsAndParts] = useState(initialState);

  // Update the time every second
  useEffect(() => {
    var timer = setInterval(() => setTime(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  // Get the current song
  useEffect(() => {
    const currentPart = songsAndParts.find(
      (song) => song._id === selectedSong
    ).part;
    axios
      .get(
        `/api/collectives/${concert.collectiveId}/songs/${selectedSong}?part=${currentPart}`
      )
      .then((res) => setPart(res.data))
      .catch(console.error);
  }, [concert.collectiveId, selectedSong, songsAndParts]);

  // Handle real time features
  useEffect(() => {
    // Initialize Channels client
    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channelName = `song-changer-${concert._id}`;

    // Subscribe to the appropriate channel
    let channel = pusher.subscribe(channelName);

    // Bind a callback function to an event within the subscribed channel
    channel.bind("change-event", function (data) {
      setSelectedSong(data.songId);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [concert._id]);

  async function pushData(songId) {
    axios
      .post("/api/pusher/change-song-event", { songId, concertId: concert._id })
      .catch(() => console.error("failed to push data"));
  }

  return (
    <Modal show={true} fullscreen={true}>
      <Modal.Header>
        <h1>Koncertas: {concert.title}</h1>
        <p>Pradžia: {moment(concert.date).format("hh:mm")}</p>
        <p className="lead">{time.toLocaleTimeString()}</p>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={3}>
            <Row>
              <ListGroup>
                {concert.songs &&
                  concert.songs.map((song, index) => {
                    return (
                      <ListGroup.Item
                        action
                        key={song._id}
                        {...(song._id === selectedSong && { active: true })}
                        onClick={() => pushData(song._id)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="lead">
                            {index + 1}. {song.title}
                          </div>
                          <Form.Select
                            className="mb-3"
                            size="sm"
                            style={{ width: "150px" }}
                          >
                            {song.instruments.map((instrument, idx) => (
                              <option
                                key={idx}
                                value={instrument}
                                defaultValue={instrument}
                                onChange={(e) =>
                                  setSongsAndParts({
                                    ...songsAndParts,
                                    [song._id]: e.target.value,
                                  })
                                }
                              >
                                {instrument}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Row>
          </Col>
          <Col>
            <PDFViewer file={part && part.parts[0].file} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default PerformanceView;
