import { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Document, pdfjs } from "react-pdf";
import { useContainerDimensions } from "../../util/useContainerDimensions";
import useWindowDimensions from "../../util/useWindowDimensions";
import Drawing from "../drawing";
import DrawingButtons from "../Drawing/drawingButtons";
import PDFPage from "./page";
import styles from "../pdfs/TopRow.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize, faX } from "@fortawesome/free-solid-svg-icons";

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

  const [renderedPageNumber, setRenderedPageNumber] = useState(null);
  const [renderedWidth, setRenderedWidth] = useState(null);

  const isLoading =
    renderedPageNumber !== pageNumber || renderedWidth !== noteWidth;
  console.log(isLoading);

  function onRenderSuccess() {
    window.dispatchEvent(new Event("resize"));
    setRenderedPageNumber(pageNumber);
    setRenderedWidth(noteWidth);
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

  const toolClick = (tool) => {
    if (action === tool) {
      setAction("none");
    } else {
      setAction(tool);
    }
  };

  const viewer = (
    <div>
      {/* <div className="mb-2">
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
      </div> */}
      <div
        className={`d-flex align-items-center justify-content-center ${styles.sticky}`}
      >
        <p className="h5">
          {showTwoPages ? (
            <>
              Lapai ({pageNumber || (numPages ? 1 : "--")} - {pageNumber + 1})
              iš {numPages || "--"}
            </>
          ) : (
            <>
              Lapas {pageNumber || (numPages ? 1 : "--")} iš {numPages || "--"}
            </>
          )}
        </p>
        <Button
          className="mx-2"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          ⬅️
        </Button>

        <DrawingButtons
          line={() => toolClick("line")}
          square={() => toolClick("rectangle")}
          cursor={() => toolClick("selection")}
          pencil={() => toolClick("pencil")}
          text={() => toolClick("text")}
          erase={() => toolClick("eraser")}
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
        <div className="d-flex align-items-center">
          {fullscreen ? (
            <Button variant="danger" onClick={() => setFullscreen(false)}>
              <FontAwesomeIcon icon={faX} />
            </Button>
          ) : (
            <Button variant="light" onClick={() => setFullscreen(true)}>
              <FontAwesomeIcon icon={faMaximize} />
            </Button>
          )}
        </div>
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
                    pageNumber={pageNumber}
                    onRenderSuccess={onRenderSuccess}
                    isLoading={isLoading}
                    renderedPageNumber={renderedPageNumber}
                    renderedWidth={renderedWidth}
                  />
                  {pageNumber + 1 <= numPages && (
                    <PDFPage
                      height={noteHeight}
                      {...(dynamicWidth && { width })}
                      pageNumber={pageNumber + 1}
                      onRenderSuccess={onRenderSuccess}
                      isLoading={isLoading}
                      renderedPageNumber={renderedPageNumber}
                      renderedWidth={renderedWidth}
                    />
                  )}
                </div>
              ) : (
                <div className="border rounded">
                  <PDFPage
                    height={noteHeight}
                    {...(dynamicWidth && { width })}
                    pageNumber={pageNumber}
                    onRenderSuccess={onRenderSuccess}
                    isLoading={isLoading}
                    renderedPageNumber={renderedPageNumber}
                    renderedWidth={renderedWidth}
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
        <Modal.Body className="p-0">{viewer}</Modal.Body>
      </Modal>
    );
  } else {
    return viewer;
  }
}
