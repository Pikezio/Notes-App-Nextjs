import { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { Document, pdfjs } from "react-pdf";
import useWindowDimensions from "../../util/useWindowDimensions";
import PDFPage from "./page";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ file }) {
  const NOTE_SCREEN_PERCENTAGE = 100;
  const LARGE_SCREEN_BREAKPOINT = 1950;

  const [zoom, setZoom] = useState(1);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const { height, width } = useWindowDimensions();
  const noteHeight = (height / 100) * NOTE_SCREEN_PERCENTAGE;

  const showTwoPages = width > LARGE_SCREEN_BREAKPOINT && numPages > 1;
  if (showTwoPages && pageNumber % 2 === 0) {
    setPageNumber(pageNumber - 1);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    showTwoPages ? changePage(-2) : changePage(-1);
  }

  function nextPage() {
    showTwoPages ? changePage(2) : changePage(1);
  }

  // zoom icon svg
  const zoomIcon = (
    <svg
      className="zoom-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );

  console.log("hello");

  return (
    <div>
      <Row className="align-items-center">
        <Col>{zoomIcon}</Col>
        <Col lg={8}>
          <RangeSlider
            value={zoom}
            min={0.5}
            max={1.5}
            step={0.01}
            onChange={(e) => setZoom(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={() => setZoom(1)}>Nustatyti iš naujo</Button>
        </Col>
      </Row>
      <p className="lead">
        {showTwoPages ? (
          <>
            Lapai ({pageNumber || (numPages ? 1 : "--")} - {pageNumber + 1}) iš{" "}
            {numPages || "--"}
          </>
        ) : (
          <>
            Lapas {pageNumber || (numPages ? 1 : "--")} iš {numPages || "--"}
          </>
        )}
      </p>
      <div className="d-flex justify-content-center">
        <Button
          className="mx-2"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          ⬅️
        </Button>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="d-flex justify-content-center"
        >
          {showTwoPages ? (
            <div className="d-flex flex-row border rounded">
              <PDFPage
                height={noteHeight}
                scale={zoom}
                pageNumber={pageNumber}
              />

              {pageNumber + 1 <= numPages && (
                <PDFPage
                  height={noteHeight}
                  scale={zoom}
                  pageNumber={pageNumber + 1}
                />
              )}
            </div>
          ) : (
            <div className="border rounded">
              <PDFPage
                height={noteHeight}
                scale={zoom}
                pageNumber={pageNumber}
              />
            </div>
          )}
        </Document>
        <Button
          disabled={
            showTwoPages ? pageNumber + 1 >= numPages : pageNumber >= numPages
          }
          onClick={nextPage}
          className="mx-2"
        >
          ➡️
        </Button>
      </div>
    </div>
  );
}
