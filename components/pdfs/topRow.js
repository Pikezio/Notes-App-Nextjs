import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const TopRow = ({ zoom, setZoom, topMenu }) => {
  return (
    <Row
      className="d-flex align-items-center justify-content-between"
      ref={topMenu}
    >
      <Col lg={7}>
        <div className="d-flex">
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
        <Button onClick={() => setZoom(1)}>Nustatyti iš naujo</Button>
      </Col>
    </Row>
  );
};

export default TopRow;
