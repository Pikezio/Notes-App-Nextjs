import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import rough from "roughjs/bundled/rough.cjs";
import { useSession } from "next-auth/react";
import getStroke from "perfect-freehand";

const generator = rough.generator();

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

const Drawing = ({ width, height, tool }) => {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [action, setAction] = useState("none");

  const { data: session } = useSession();
  const { songId } = useRouter().query;

  useEffect(() => {
    axios
      .get(`/api/notes?songId=${songId}&userId=${session.userId}`)
      .then((res) => {
        let parsedElements;
        try {
          parsedElements = JSON.parse(res.data.elements);
          setElements(parsedElements);
        } catch (e) {
          console.error("Parsing error.");
        }
      })
      .catch(console.error);
  }, [songId, session.userId]);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, width, height);
    elements.forEach((element) => drawElement(roughCanvas, context, element));
  }, [elements, width, height]);

  // Undo, redo event listener
  useEffect(() => {
    const undoRedoFunction = (e) => {
      if (e.key === "z" && e.ctrlKey) {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  });

  const createElement = (id, x1, y1, x2, y2, type) => {
    let roughElement;
    switch (type) {
      case "line":
        roughElement = generator.line(x1, y1, x2, y2);
        return { id, x1, y1, x2, y2, type, roughElement };
      case "rectangle":
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
        return { id, x1, y1, x2, y2, type, roughElement };
      case "pencil":
        return { id, type, points: [{ x: x1, y: y1 }] };
    }
  };

  function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  }

  // TODO: make some options for the pencil tool
  const drawElement = (roughCanvas, context, element) => {
    switch (element.type) {
      case "line":
        roughCanvas.draw(element.roughElement);
        break;
      case "rectangle":
        roughCanvas.draw(element.roughElement);
        break;
      case "pencil":
        const pathData = getSvgPathFromStroke(
          getStroke(element.points, {
            size: 10,
          })
        );
        context.fill(new Path2D(pathData));
        break;
    }
  };

  const updateElement = (id, x1, y1, x2, y2, type) => {
    const elementsCopy = [...elements];

    switch (type) {
      case "line":
      case "rectangle":
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case "pencil":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
    }
    setElements(elementsCopy, true);
  };

  // TODO: activate this
  const submitToDatabase = () => {
    const data = {
      songId,
      userId: session.userId,
      elements: JSON.stringify(elements),
    };
    axios.post(`/api/notes/`, data).catch(console.error);
  };

  const getRelativeMousePosition = (e) => {
    const rect = e.target.getBoundingClientRect();
    return {
      clientX: e.clientX - rect.left,
      clientY: e.clientY - rect.top,
    };
  };

  const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 10 && Math.abs(y - y1) < 10 ? name : null;
  };

  const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
  };

  const positionWithinElement = (x, y, element) => {
    const { x1, y1, x2, y2, type } = element;
    switch (type) {
      case "line": {
        const onLn = onLine(x1, y1, x2, y2, x, y);
        const start = nearPoint(x, y, x1, y1, "start");
        const end = nearPoint(x, y, x2, y2, "end");
        return start || end || onLn;
      }
      case "rectangle": {
        const topLeft = nearPoint(x, y, x1, y1, "tl");
        const topRight = nearPoint(x, y, x2, y1, "tr");
        const bottomLeft = nearPoint(x, y, x1, y2, "bl");
        const bottomRight = nearPoint(x, y, x2, y2, "br");
        const inside =
          x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      }
      case "pencil": {
        const betweenAnyPoints = element.points.some((point, index) => {
          const nextPoint = element.points[index + 1];
          if (!nextPoint) return false;
          return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5);
        });
        return betweenAnyPoints ? "inside" : null;
      }
    }
  };

  function getElementAtPosition(x, y, elements) {
    const element = elements
      .map((element) => ({
        ...element,
        position: positionWithinElement(x, y, element),
      }))
      .find((element) => element.position !== null);
    return element;
  }

  const distance = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  const handleMouseDown = (e) => {
    const { clientX, clientY } = getRelativeMousePosition(e);
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const elementId = elements.length;
      const element = createElement(
        elementId,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setSelectedElement(element);
      setElements((elements) => [...elements, element]);
      setAction("drawing");
    }
  };

  const cursorForPosition = (position) => {
    switch (position) {
      case "tl":
      case "br":
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      default:
        return "move";
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = getRelativeMousePosition(e);
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    switch (action) {
      case "drawing": {
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        updateElement(index, x1, y1, clientX, clientY, tool);
        break;
      }
      case "moving": {
        if (selectedElement.type === "pencil") {
          const newPoints = selectedElement.points.map((_, index) => {
            return {
              x: clientX - selectedElement.xOffsets[index],
              y: clientY - selectedElement.yOffsets[index],
            };
          });
          const elementsCopy = [...elements];
          elementsCopy[selectedElement.id] = {
            ...elementsCopy[selectedElement.id],
            points: newPoints,
          };
          setElements(elementsCopy, true);
        } else {
          const { id, x1, y1, x2, y2, type, offsetX, offsetY } =
            selectedElement;
          const elementWidth = x2 - x1;
          const elementHeight = y2 - y1;
          const newX1 = clientX - offsetX;
          const newY1 = clientY - offsetY;

          updateElement(
            id,
            newX1,
            newY1,
            newX1 + elementWidth,
            newY1 + elementHeight,
            type
          );
        }
        break;
      }
      case "resizing": {
        const { id, type, position, ...coordinates } = selectedElement;
        const { x1, x2, y1, y2 } = resizedCoordinates(
          clientX,
          clientY,
          position,
          coordinates
        );
        updateElement(id, x1, y1, x2, y2, type);
        break;
      }
      default:
        break;
    }
  };

  const resizedCoordinates = (clientX, clientY, position, coordinates) => {
    const { x1, x2, y1, y2 } = coordinates;
    switch (position) {
      case "tl":
      case "start":
        return { x1: clientX, y1: clientY, x2, y2 };
      case "tr":
        return { x1, y1: clientY, x2: clientX, y2 };
      case "bl":
        return { x1: clientX, y1, x2, y2: clientY };
      case "br":
      case "end":
        return { x1, y1, x2: clientX, y2: clientY };
    }
  };

  const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };

  const adjustmentRequired = (type) => {
    return ["line", "rectangle"].includes(type);
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }

    setAction("none");
    setSelectedElement(null);
    // submitToDatabase();
  };

  return (
    <>
      <canvas
        style={{
          position: "absolute",
          zIndex: 1,
        }}
        id="canvas"
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};

export default Drawing;
