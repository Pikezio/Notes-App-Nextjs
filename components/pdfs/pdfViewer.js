import { useState } from "react";
import { Button } from "react-bootstrap";
import { Document, pdfjs } from "react-pdf";
import useWindowDimensions from "../../util/useWindowDimensions";
import PDFPage from "./page";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ file }) {
  const NOTE_SCREEN_PERCENTAGE = 100;
  const LARGE_SCREEN_BREAKPOINT = 1750;

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

  return (
    <div>
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
      <div>
        <Button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
          ⬅️ Praeitas
        </Button>
        <Button
          type="button"
          disabled={
            showTwoPages ? pageNumber + 1 >= numPages : pageNumber >= numPages
          }
          onClick={nextPage}
          className="mx-2"
        >
          Kitas ➡️
        </Button>
      </div>
      <div>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="mt-2 d-flex justify-content-center"
        >
          {showTwoPages ? (
            <div className="d-flex flex-row border rounded">
              <PDFPage
                height={noteHeight}
                scale={1.0}
                pageNumber={pageNumber}
              />

              {pageNumber + 1 <= numPages && (
                <PDFPage
                  height={noteHeight}
                  scale={1.0}
                  pageNumber={pageNumber + 1}
                />
              )}
            </div>
          ) : (
            <div className="border rounded">
              <PDFPage
                height={noteHeight}
                scale={1.0}
                pageNumber={pageNumber}
              />
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}
