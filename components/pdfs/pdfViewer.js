import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Document, pdfjs } from "react-pdf";
import { useContainerDimensions } from "../../util/useContainerDimensions";
import useWindowDimensions from "../../util/useWindowDimensions";
import Drawing from "../drawing";
import DrawingButtons from "../Drawing/drawingButtons";
import PDFPage from "./page";
import TopRow from "./topRow";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ file, partId, defaultNoteHeight }) {
  const LARGE_SCREEN_BREAKPOINT = 1950;

  // Zoom slider value
  const [zoom, setZoom] = useState(1);

  // Page number for pdf viewer
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Fullscreen switch
  const [fullscreen, setFullscreen] = useState(false);

  // Note taking editor action
  const [action, setAction] = useState("none");

  const topMenu = useRef();
  const noteDimensions = useRef();

  // Browser size
  const { height, width } = useWindowDimensions();

  // Note view size
  const { width: noteWidth, height: actualNoteHeight } =
    useContainerDimensions(noteDimensions);

  const noteHeight = 1200;
  let dynamicWidth = false;

  const scaleDrawing = actualNoteHeight / defaultNoteHeight;
  if (width < noteWidth) {
    dynamicWidth = true;
  }

  // Variables for two page/one page view
  const showTwoPages = width > LARGE_SCREEN_BREAKPOINT && numPages > 1;
  if (showTwoPages && pageNumber % 2 === 0) {
    setPageNumber(pageNumber - 1);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
    setPageNumber(pageNumber);
  }

  function onRenderSuccess() {
    window.dispatchEvent(new Event("resize"));
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

  const lineClick = () => {
    setAction("line");
  };

  const squareClick = () => {
    setAction("rectangle");
  };

  const cursorClick = () => {
    setAction("selection");
  };

  const pencilClick = () => {
    setAction("pencil");
  };

  const textClick = () => {
    setAction("text");
  };

  const deleteClick = () => {
    setAction("eraser");
  };

  const viewer = (
    <div>
      <div className="mb-2">
        <TopRow
          numPages={numPages}
          showTwoPages={showTwoPages}
          pageNumber={pageNumber}
          zoom={zoom}
          setZoom={setZoom}
          fullscreen={fullscreen}
          setFullscreen={setFullscreen}
          topMenu={topMenu}
        />
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <Button
          className="mx-2"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          ⬅️
        </Button>
        <DrawingButtons
          line={lineClick}
          square={squareClick}
          cursor={cursorClick}
          pencil={pencilClick}
          text={textClick}
          erase={deleteClick}
          selected={action}
        />
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
      <div className="d-flex justify-content-center">
        <div style={{ position: "relative", zIndex: 0 }}>
          {typeof window !== "undefined" && (
            <Document
              inputRef={noteDimensions}
              noData="Nėra duomenų"
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="d-flex justify-content-center"
            >
              <Drawing
                height={actualNoteHeight}
                width={noteWidth}
                tool={action}
                scale={scaleDrawing}
                showTwoPages={showTwoPages}
                pageNumber={pageNumber}
                partId={partId}
              />

              {showTwoPages ? (
                <div className="d-flex flex-row border rounded">
                  <PDFPage
                    height={noteHeight}
                    {...(dynamicWidth && { width })}
                    scale={zoom}
                    pageNumber={pageNumber}
                    onRenderSuccess={onRenderSuccess}
                  />
                  {pageNumber + 1 <= numPages && (
                    <PDFPage
                      height={noteHeight}
                      {...(dynamicWidth && { width })}
                      scale={zoom}
                      pageNumber={pageNumber + 1}
                      onRenderSuccess={onRenderSuccess}
                    />
                  )}
                </div>
              ) : (
                <div className="border rounded">
                  <PDFPage
                    height={noteHeight}
                    {...(dynamicWidth && { width })}
                    scale={zoom}
                    pageNumber={pageNumber}
                    onRenderSuccess={onRenderSuccess}
                  />
                </div>
              )}
            </Document>
          )}
        </div>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <Modal
        show={fullscreen}
        fullscreen={true}
        onHide={() => setFullscreen(false)}
      >
        <Modal.Body>{viewer}</Modal.Body>
      </Modal>
    );
  } else {
    return viewer;
  }
}
