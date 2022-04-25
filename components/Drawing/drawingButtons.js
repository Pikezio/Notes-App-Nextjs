import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  faArrowPointer,
  faEraser,
  faPencil,
  faSlash,
  faSquare,
  faT,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Buttons.module.css";

const DrawingButtons = ({
  cursor,
  line,
  square,
  pencil,
  text,
  eraser,
  selected,
}) => {
  return (
    <div>
      <FontAwesomeIcon
        cursor="pointer"
        icon={faArrowPointer}
        border
        fontSize={20}
        width={25}
        height={25}
        onClick={cursor}
        className={selected === "selection" ? styles.selected : ""}
      />
      <FontAwesomeIcon
        cursor="pointer"
        icon={faSlash}
        border
        fontSize={20}
        width={25}
        height={25}
        onClick={line}
        className={selected === "line" ? styles.selected : ""}
      />
      <FontAwesomeIcon
        cursor="pointer"
        icon={faSquare}
        border
        fontSize={20}
        width={25}
        height={25}
        onClick={square}
        className={selected === "rectangle" ? styles.selected : ""}
      />
      <FontAwesomeIcon
        cursor="pointer"
        icon={faPencil}
        border
        fontSize={20}
        width={25}
        height={25}
        onClick={pencil}
      />
      <FontAwesomeIcon
        cursor="pointer"
        icon={faT}
        border
        fontSize={20}
        width={25}
        height={25}
        onClick={text}
      />
      <FontAwesomeIcon
        cursor="pointer"
        icon={faEraser}
        border
        fontSize={20}
        width={25}
        height={25}
        onClick={eraser}
      />
    </div>
  );
};

export default DrawingButtons;
