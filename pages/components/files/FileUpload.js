import { Form, ListGroup, Row, Col } from "react-bootstrap";

// List of instruments.
// TODO: #1 get from database later
export const instrumentList = ["Flute", "Saxophone", "Trumpet", "Trombone"];

// Constructs a drowndown menu.
export const dropDownList = (
  <>
    <option>Pasirinkite instrumentą</option>
    {instrumentList.map((i, idx) => (
      <option key={idx} value={i}>
        {i}
      </option>
    ))}
  </>
);

export default function FileUpload({
  handleFileChange,
  handleDropDownChange,
  parts,
}) {
  // Constructs a list of files with dropdown menus.
  const selectedParts = parts
    ? parts.map((part, partId) => (
        <ListGroup.Item key={partId}>
          <Row>
            <Col>{part.file.name}</Col>
            <Col md="auto">
              <Form.Select onChange={(e) => handleDropDownChange(e, partId)}>
                {dropDownList}
              </Form.Select>
            </Col>
          </Row>
        </ListGroup.Item>
      ))
    : "Nepasirinkta jokių failų.";

  return (
    <div>
      {/* Input */}
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Partijos</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} />
      </Form.Group>
      {/* List selected files */}
      Pasirinkti failai:
      <ListGroup>{selectedParts}</ListGroup>
    </div>
  );
}
