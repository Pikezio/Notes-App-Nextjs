import React from "react";
import { Page } from "react-pdf";

const PDFPage = ({ pageNumber, height, scale, onRenderSuccess }) => {
  return (
    <Page
      pageNumber={pageNumber}
      renderAnnotationLayer={false}
      renderTextLayer={false}
      height={height}
      scale={scale}
      onRenderSuccess={onRenderSuccess}
    ></Page>
  );
};

export default PDFPage;
