import React from "react";
import { Page } from "react-pdf";

const PDFPage = ({ pageNumber, height, scale }) => {
  return (
    <Page
      pageNumber={pageNumber}
      renderAnnotationLayer={false}
      renderTextLayer={false}
      height={height}
      scale={scale}
    />
  );
};

export default PDFPage;
