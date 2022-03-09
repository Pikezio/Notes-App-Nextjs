import { useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button, Container, Form, ListGroup } from "react-bootstrap";
import { resetServerContext } from "react-beautiful-dnd";

resetServerContext();

export default function EditInstrumentList() {
  const [list, setList] = useState(["Trombone", "Flute", "Tuba"]);
  const newInstrumentRef = useRef();

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItems);

    setList(items);
  };

  const constructedList = (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="instruments">
        {(provided) => (
          <ListGroup
            as="ol"
            numbered
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {list.map((i, id) => (
              <Draggable key={i} draggableId={i} index={id}>
                {(provided) => (
                  <ListGroup.Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    as="li"
                  >
                    {i}
                    <Button
                      variant="danger"
                      onClick={() => deleteInstrument(id)}
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
  );

  const addInstrument = () => {
    setList([...list, newInstrumentRef.current.value]);
    newInstrumentRef.current.value = "";
  };

  const deleteInstrument = (id) => {
    const newList = list.filter((item, index) => index !== id);
    setList(newList);
  };

  const submitForm = () => {
    console.log("Saving");
  };

  return (
    <Container>
      <Form>
        {constructedList}
        <Form.Group className="my-3">
          <Form.Label>Instrumentas</Form.Label>
          <Form.Control type="text" ref={newInstrumentRef} />
        </Form.Group>
        <Button type="button" onClick={addInstrument}>
          Pridėti instrumentą
        </Button>
        <Button variant="success" onClick={submitForm}>
          Išsaugoti
        </Button>
      </Form>
    </Container>
  );
}
