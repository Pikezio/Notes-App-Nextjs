import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button, Container, Form, ListGroup } from "react-bootstrap";
import { resetServerContext } from "react-beautiful-dnd";
import { server } from "../../../../util/urlConfig";
import { useRouter } from "next/router";
import { getInstruments } from "../../../../controllers/instrumentController";
import { getSession } from "next-auth/react";
import axios from "axios";
import { checkSession } from "../../../../middleware/checkSession";

resetServerContext();

export default function EditInstrumentList({ instruments }) {
  const initialState = instruments ? instruments : [];

  const [list, setList] = useState(initialState);
  const [newInstrument, setNewInstrument] = useState("");

  const router = useRouter();
  const { collectiveId } = router.query;

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItems);

    setList(items);
  };

  const addInstrument = () => {
    setList([...list, newInstrument]);
    setNewInstrument("");
  };

  useEffect(() => {
    // Listen for enter key press
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        setList([...list, newInstrument]);
        setNewInstrument("");
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [newInstrument, list]);

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
                    className="d-flex justify-content-between align-items-center"
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

  const deleteInstrument = (id) => {
    const newList = list.filter((item, index) => index !== id);
    setList(newList);
  };

  const url = `${server}/api/collectives/${collectiveId}/instruments`;
  const submitForm = (e) => {
    e.preventDefault();
    if (confirm("Ar tikrai norite išsaugoti pakeitimus?")) {
      axios
        .post(url, list)
        .then(() => router.push("/"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container>
      {constructedList}
      <Form.Group className="my-3">
        <Form.Label>Instrumentas</Form.Label>
        <Form.Control
          type="text"
          value={newInstrument}
          onChange={(e) => setNewInstrument(e.target.value)}
        />
      </Form.Group>
      <Button
        type="button"
        onClick={addInstrument}
        disabled={newInstrument === ""}
      >
        Pridėti instrumentą
      </Button>
      <Button
        type="button"
        className="mx-2"
        variant="success"
        onClick={(e) => submitForm(e)}
      >
        Išsaugoti
      </Button>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const response = await getInstruments(context.query.collectiveId);
  const instruments = await JSON.parse(response);

  return {
    props: {
      instruments,
    },
  };
}
