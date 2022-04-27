import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const Drawing = ({
  width,
  height,
  tool,
  scale,
  showTwoPages,
  pageNumber,
  partId,
}) => {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [action, setAction] = useState("none");

  const { data: session } = useSession();
  const { songId } = useRouter().query;

  const textAreaRef = useRef();

  // Text input focusing
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      textArea.focus();
      textArea.value = selectedElement.text;
    }
  }, [action, selectedElement]);

  const showingRightPage = pageNumber % 2 === 0;

  // Data fetching
  useEffect(() => {
    const getDataElements = async (pages) => {
      axios
        .get(
          `/api/notes?userId=${session.userId}&songId=${songId}&partId=${partId}&page=${pages}`
        )
        .then((res) => {
          try {
            const parsed = JSON.parse(res.data.elements);
            setElements(parsed, true);
          } catch (e) {
            setElements([]);
          }
        });
    };
    if (pageNumber % 2 === 0 && pageNumber > 0) {
      getDataElements(`${pageNumber - 1}-${pageNumber}`);
    } else {
      getDataElements(`${pageNumber}-${pageNumber + 1}`);
    }
  }, [pageNumber, partId, songId]);

  // Redrawing
  useEffect(() => {
    const canvas = document.getElementById(
      `canvas-${partId}-${session.userId}`
    );
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, width, height);

    context.save();
    context.scale(scale, scale);

    const roughCanvas = rough.canvas(canvas);

    if (showingRightPage) {
      context.translate(-width / scale, 0);
    }

    if (elements && elements.length !== 0) {
      elements.forEach((element) => {
        if (action === "writing" && element.id === selectedElement.id) return;
        drawElement(roughCanvas, context, element);
      });
    }

    context.restore();
  }, [
    elements,
    width,
    height,
    selectedElement,
    action,
    scale,
    showingRightPage,
  ]);

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
      case "text":
        return { id, type, x1, y1, x2, y2, text: "" };
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
            size: 5,
          })
        );
        context.fill(new Path2D(pathData));
        break;
      case "text":
        context.textBaseline = "top";
        context.font = "20px Arial";
        context.fillText(element.text, element.x1, element.y1);
        break;
    }
  };

  const updateElement = (id, x1, y1, x2, y2, type, options) => {
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
      case "text":
        const context = document
          .getElementById(`canvas-${partId}-${session.userId}`)
          .getContext("2d");
        const textWidth = context.measureText(options.text).width * scale;
        const textHeight = 20 * scale;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
        };
        break;
    }
    setElements(elementsCopy, true);
  };

  const submitToDatabase = () => {
    const pages = !showingRightPage
      ? { p1: pageNumber, p2: pageNumber + 1 }
      : { p1: pageNumber - 1, p2: pageNumber };
    const data = {
      userId: session.userId,
      songId,
      partId,
      page: pages.p1 + "-" + pages.p2,
      elements: JSON.stringify(elements),
    };
    axios.post(`/api/notes/`, data).catch(console.error);
  };

  const getRelativeMousePosition = (e) => {
    const rect = e.target.getBoundingClientRect();

    let touches = null;
    if (e) {
      if (e.touches) {
        touches = e.touches[0];
      }
    }

    if (showingRightPage) {
      if (touches) {
        return {
          clientX: (touches.clientX - rect.left + width) / scale,
          clientY: (touches.clientY - rect.top) / scale,
        };
      } else {
        return {
          clientX: (e.clientX - rect.left + width) / scale,
          clientY: (e.clientY - rect.top) / scale,
        };
      }
    } else {
      if (touches) {
        return {
          clientX: (touches.clientX - rect.left) / scale,
          clientY: (touches.clientY - rect.top) / scale,
        };
      } else {
        return {
          clientX: (e.clientX - rect.left) / scale,
          clientY: (e.clientY - rect.top) / scale,
        };
      }
    }
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
      case "text": {
        return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
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

  // Delete element and update all ids
  const deleteElement = (elementId) => {
    const elementsCopy = [...elements];
    const index = elementsCopy.findIndex((element) => element.id === elementId);
    elementsCopy.splice(index, 1);
    elementsCopy.forEach((element, i) => {
      element.id = i;
    });
    setElements(elementsCopy, true);
  };

  const handleMouseDown = (e) => {
    if (action === "writing" || tool === "none") return;

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
    } else if (tool === "eraser") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        deleteElement(element.id);
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
      setAction(tool === "text" ? "writing" : "drawing");
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
    if (tool === "selection" || tool === "eraser") {
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

          const options = type === "text" ? { text: selectedElement.text } : {};

          updateElement(
            id,
            newX1,
            newY1,
            newX1 + elementWidth,
            newY1 + elementHeight,
            type,
            options
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

  const handleMouseUp = (e) => {
    const { clientX, clientY } = getRelativeMousePosition(e);
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }

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

    if (action === "writing") {
      return;
    }

    setAction("none");
    setSelectedElement(null);
    submitToDatabase();
  };

  const handleBlur = (e) => {
    const { id, type, x1, y1 } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, { text: e.target.value });
    submitToDatabase();
  };

  useEffect(() => {
    const canvas = document.getElementById(
      `canvas-${partId}-${session.userId}`
    );
    canvas.addEventListener(
      "touchmove",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );

    return () => {
      canvas.removeEventListener("touchmove", () => {});
    };
  }, [partId, session.userId]);

  return (
    <>
      <canvas
        style={{
          position: "absolute",
          // backgroundColor: "gray",
          zIndex: 1,
        }}
        id={`canvas-${partId}-${session.userId}`}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />

      {action === "writing" && (
        <textarea
          onBlur={handleBlur}
          ref={textAreaRef}
          style={{
            position: "absolute",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            zIndex: 2,
            top: selectedElement.y1 * scale,
            left: !showingRightPage
              ? selectedElement.x1 * scale
              : selectedElement.x1 * scale - width,
          }}
        />
      )}
    </>
  );
};

export default Drawing;
