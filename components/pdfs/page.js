import React from "react";
import { Page } from "react-pdf";

const PDFPage = ({
  pageNumber,
  height,
  onRenderSuccess,
  width,
  isLoading,
  renderedPageNumber,
  renderedWidth,
}) => {
  console.log("Width", width);
  return (
    <>
      {/* {isLoading && renderedPageNumber && renderedWidth ? (
        <Page
          pageNumber={renderedPageNumber}
          height={height}
          width={renderedWidth}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      ) : null} */}
      <Page
        pageNumber={pageNumber}
        height={height}
        width={width}
        onRenderSuccess={onRenderSuccess}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </>
  );
};

export default PDFPage;
