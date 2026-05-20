import { useState, useRef } from "react";

export function useSheetDrag() {
  const [sheetHidden, setSheetHidden] = useState(false);
  const [dragY,       setDragY]       = useState(0);
  const [isDragging,  setIsDragging]  = useState(false);
  const dragRef = useRef({ startY: 0, dy: 0 });

  function onTouchStart(e) {
    dragRef.current.startY = e.touches[0].clientY;
    dragRef.current.dy = 0;
    setIsDragging(true);
  }
  function onTouchMove(e) {
    const dy = Math.max(0, e.touches[0].clientY - dragRef.current.startY);
    dragRef.current.dy = dy;
    setDragY(dy);
  }
  function onTouchEnd() {
    setIsDragging(false);
    setDragY(0);
    if (dragRef.current.dy > 100) setSheetHidden(true);
  }

  const sheetStyle = isDragging
    ? { transform: `translateY(${dragY}px)`, transition: "none" }
    : sheetHidden
      ? { transform: "translateY(110%)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)", pointerEvents: "none" }
      : {};

  const dragHandleProps = { onTouchStart, onTouchMove, onTouchEnd };

  return { sheetHidden, setSheetHidden, sheetStyle, dragHandleProps };
}
