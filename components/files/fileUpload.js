import { useEffect, useRef, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { toBase64 } from "../../util/toBase64";

export default function FileUpload({
  instrumentList,
  returnParts,
  buttonText,
}) {
  const [files, setFiles] = useState([]);
  const [parts, setParts] = useState([]);

  const inputRef = useRef();

  useEffect(() => {
    // Matches file name to intrument list
    const matchInstrumentListToFilename = (filename) => {
      for (var i = 0; i < instrumentList.length; i++) {
        if (filename.match(new RegExp(instrumentList[i], "i"))) {
          return instrumentList[i];
        }
        if (instrumentList[i].match(new RegExp(filename, "i"))) {
          return instrumentList[i];
        }
      }
    };

    const detectedInstrumentParts = files.map((file) => ({
      ...file,
      instrument: matchInstrumentListToFilename(file.filename) || "---",
    }));

    setParts(detectedInstrumentParts);
  }, [files, instrumentList]);

  const dropDownList =
    instrumentList &&
    instrumentList.map((i, idx) => (
      <option key={idx} value={i}>
        {i}
      </option>
    ));

  // Updates state, when files change
  function handleFileChange(e) {
    const newState = Array.from(e.target.files).map((file) => {
      return {
        file: file,
        filename: file.name,
        instrument: "undefined",
      };
    });
    setFiles(newState);
  }

  function handleDropDownChange(value, partId) {
    const selectedInstrument = value;
    let newParts = [...parts];
    newParts[partId].instrument = selectedInstrument;
    setParts(newParts);
  }

  const base64parts = async () => {
    return await Promise.all(
      parts.map(async (item) => {
        const base64 = await toBase64(item.file);
        item.file = base64;
        return item;
      })
    );
  };

  // Constructs a list of files with dropdown menus.
  const selectedParts = parts
    ? parts.map((part, partId) => {
        return (
          <ListGroup.Item
            key={partId}
            className="d-flex justify-content-between align-items-center"
          >
            {part.filename}
            <Form.Select
              onChange={(e) => handleDropDownChange(e.target.value, partId)}
              style={{ width: "200px" }}
              value={part.instrument}
            >
              {dropDownList}
            </Form.Select>
          </ListGroup.Item>
        );
      })
    : "Nepasirinkta jokių failų.";

  return (
    <div>
      <Form.Group controlId="formFileMultiple" className="my-3">
        <Form.Label>
          <h4>Pasirinkti failai</h4>
        </Form.Label>
        <Form.Control
          type="file"
          multiple
          onChange={handleFileChange}
          ref={inputRef}
        />
      </Form.Group>
      <ListGroup>{selectedParts}</ListGroup>
      <Button
        disabled={!files.length}
        className="my-3"
        onClick={async () => {
          await returnParts(await base64parts());
          setFiles([]);
          inputRef.current.value = "";
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
}
