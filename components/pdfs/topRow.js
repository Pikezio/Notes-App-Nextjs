import {
  faMagnifyingGlass,
  faMaximize,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const TopRow = ({
  pageNumber,
  numPages,
  showTwoPages,
  zoom,
  setZoom,
  fullscreen,
  setFullscreen,
  topMenu,
}) => {
  return (
    <Row
      className="d-flex align-items-center justify-content-between"
      ref={topMenu}
    >
      <Col>
        <p className="lead">
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
      </Col>
      {/* <Col lg={7}>
        <div>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <RangeSlider
            value={zoom}
            min={0.5}
            max={1.5}
            step={0.01}
            onChange={(e) => setZoom(e.target.value)}
          />
        </div>
      </Col>
      <Col>
        <div className="d-flex align-items-center">
          <Button onClick={() => setZoom(1)}>Nustatyti iš naujo</Button>
          {fullscreen ? (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => setFullscreen(false)}
            >
              Išeiti
            </Button>
          ) : (
            <Button
              variant="light"
              className="mx-2"
              onClick={() => setFullscreen(true)}
            >
              <FontAwesomeIcon icon={faMaximize} />
            </Button>
          )}
        </div>
      </Col> */}
    </Row>
  );
};

export default TopRow;
