import React from "react";
import { Page } from "react-pdf";

const PDFPage = ({ pageNumber, height, scale, onRenderSuccess, width }) => {
  return (
    <Page
      pageNumber={pageNumber}
      renderAnnotationLayer={false}
      renderTextLayer={false}
      height={height}
      width={width}
      scale={scale}
      onRenderSuccess={onRenderSuccess}
    ></Page>
  );
};

export default PDFPage;
