import { useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button, Container, Form, ListGroup } from "react-bootstrap";
import { resetServerContext } from "react-beautiful-dnd";
import { server } from "../../../../util/urlConfig";
import { useRouter } from "next/router";

resetServerContext();

export default function EditInstrumentList({ instruments }) {
  let initialState;
  instruments.instruments
    ? (initialState = instruments.instruments)
    : (initialState = []);

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
    setList([...list, newInstrument]);
    setNewInstrument("");
  };

  const deleteInstrument = (id) => {
    const newList = list.filter((item, index) => index !== id);
    setList(newList);
  };

  const url = `${server}/api/collectives/${collectiveId}/instruments`;
  const submitForm = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(list),
      });
      if (!res.ok) throw new Error(res.status);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Form>
        {constructedList}
        <Form.Group className="my-3">
          <Form.Label>Instrumentas</Form.Label>
          <Form.Control
            type="text"
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
        <Button variant="success" onClick={submitForm}>
          Išsaugoti
        </Button>
      </Form>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const data = await fetch(
    `${server}/api/collectives/${context.query.collectiveId}/instruments`
  );
  const instruments = await data.json();

  return {
    props: {
      instruments,
    },
  };
}
