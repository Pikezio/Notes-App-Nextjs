import React, { useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { toBase64 } from "../../util/toBase64";

export default function CreateCollective() {
  const [validated, setValidated] = useState(false);
  const [logo, setLogo] = useState();
  const router = useRouter();

  // Form field references
  const titleRef = useRef();
  const colorRef = useRef();

  // Submits the form
  const submitEdit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const data = {
      title: titleRef.current.value,
      color: colorRef.current.value,
      logo: logo,
    };

    axios
      .post("/api/collectives", data)
      .then(() => router.replace("/"))
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={submitEdit}>
        <Form.Group className="mb-3">
          <Form.Label>Kolektyvo pavadinimas</Form.Label>
          <Form.Control
            required
            size="lg"
            type="text"
            placeholder="Pavadinimas"
            ref={titleRef}
            onChange={() => setValidated(false)}
          />
          <Form.Control.Feedback type="invalid">
            Pavadinimas negali būti tuščias.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="colorInput">Kolektyvo spalva</Form.Label>
          <Form.Control
            type="color"
            id="colorInput"
            defaultValue="#ffffff"
            title="Pasirinkite kolektyvo spalvą"
            ref={colorRef}
            onChange={() => setValidated(false)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="logo">Kolektyvo logotipas</Form.Label>
          <Form.Control
            type="file"
            id="logo"
            onChange={async (e) => {
              setValidated(false);
              setLogo(await toBase64(e.target.files[0]));
            }}
          />
          {logo != null && (
            <Image alt="logo" width={100} height={100} src={logo} />
          )}
        </Form.Group>
        <Button className="mt-3" type="submit">
          Įrašyti
        </Button>
      </Form>
    </Container>
  );
}

CreateCollective.auth = true;
