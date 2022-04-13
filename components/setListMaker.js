import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";

const SetListMaker = ({
  songs,
  addSong,
  concertSongs,
  removeSong,
  handleOnDragEnd,
}) => {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const filterList = () => {
    if (filter === "") {
      return songs;
    }
    return songs.filter((song) => {
      return song.title.toLowerCase().includes(filter.toLowerCase());
    });
  };

  return (
    <div className="mt-3">
      <h4>Koncerto Programa</h4>
      <Button onClick={handleShow}>Pridėti dainą</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pridėti dainą</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder="Paieška..."
              onChange={(e) => setFilter(e.target.value)}
            />
          </Form.Group>
          <ListGroup>
            {songs &&
              filterList().map(
                (song) =>
                  !concertSongs.includes(song) && (
                    <ListGroup.Item
                      action
                      key={song._id}
                      onClick={() => addSong(song)}
                    >
                      <div className="d-flex justify-content-between">
                        {song.title}
                        <div>
                          <small>
                            <strong>Ar. </strong>
                            {song.composer}
                          </small>
                          <br />
                          <small>
                            <strong>Komp. </strong>
                            {song.arranger}
                          </small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  )
              )}
          </ListGroup>
        </Modal.Body>
      </Modal>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="songs">
          {(provided) => (
            <ListGroup
              className="mt-2"
              as="ol"
              numbered
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {concertSongs &&
                concertSongs.map((song, idx) => (
                  <Draggable key={song._id} draggableId={song._id} index={idx}>
                    {(provided) => (
                      <ListGroup.Item
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="d-flex justify-content-between"
                      >
                        <div className="lead">
                          {idx + 1}. {song.title}
                        </div>
                        <Button
                          variant="danger"
                          onClick={() => removeSong(song)}
                        >
                          Ištrinti
                        </Button>
                      </ListGroup.Item>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </ListGroup>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SetListMaker;
