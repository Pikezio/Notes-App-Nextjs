import {useState} from "react";
import {Draggable} from "react-beautiful-dnd";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {Button, Container, Form, ListGroup} from "react-bootstrap";
import {resetServerContext} from "react-beautiful-dnd";
import {server} from "../../../../util/urlConfig";
import {useRouter} from "next/router";
import {getInstruments} from "../../../../controllers/instrumentController";
import {getSession} from "next-auth/react";
import axios from "axios";

resetServerContext();

export default function EditInstrumentList({instruments}) {
    let initialState;
    instruments.instruments
        ? (initialState = instruments.instruments)
        : (initialState = []);

    const [list, setList] = useState(initialState);
    const [newInstrument, setNewInstrument] = useState("");

    const router = useRouter();
    const {collectiveId} = router.query;

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
        axios.post(url, list).then(router.push("/")).catch(err => console.log(err));
    };

    return (
        <Container>
            <Form>
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
                <Button variant="success" onClick={submitForm}>
                    Išsaugoti
                </Button>
            </Form>
        </Container>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const response = await getInstruments(context.query.collectiveId);
    const instruments = await JSON.parse(response);

    return {
        props: {
            instruments,
        },
    };
}
