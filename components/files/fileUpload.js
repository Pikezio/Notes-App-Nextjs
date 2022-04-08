import { Form, ListGroup, Row, Col } from "react-bootstrap";

export default function FileUpload({
  handleFileChange,
  handleDropDownChange,
  parts,
  instrumentList,
}) {
  const dropDownList = (
    <>
      {instrumentList &&
        instrumentList.map((i, idx) => (
          <option key={idx} value={i}>
            {i}
          </option>
        ))}
    </>
  );

  // Constructs a list of files with dropdown menus.
  const selectedParts = parts
    ? parts.map((part, partId) => (
        <ListGroup.Item
          key={partId}
          className="d-flex justify-content-between align-items-center"
        >
          {part.filename}
          <Form.Select
            onChange={(e) => handleDropDownChange(e, partId)}
            style={{ width: "100px" }}
          >
            {dropDownList}
          </Form.Select>
        </ListGroup.Item>
      ))
    : "Nepasirinkta jokių failų.";

  return (
    <div>
      {/* Input */}
      <Form.Group controlId="formFileMultiple" className="my-3">
        <Form.Label>
          <h4>Pasirinkti failai</h4>
        </Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} />
      </Form.Group>
      {/* List selected files */}

      <ListGroup>{selectedParts}</ListGroup>
    </div>
  );
}
