"use client";
import { useEffect, useState, useRef, useCallback } from "react";

type DesmosCalculatorProps = {
  showDesmos: boolean;
  setShowDesmos: (show: boolean) => void;
};

export function DesmosCalculator({ showDesmos, setShowDesmos }: DesmosCalculatorProps) {
  const desmosRef = useRef<HTMLDivElement>(null);
  const [desmosPosition, setDesmosPosition] = useState({ x: 100, y: 100 });
  const [desmosSize, setDesmosSize] = useState({ width: 400, height: 300 });
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, type: 'drag' | 'resize') => {
    if (desmosRef.current) {
      const rect = desmosRef.current.getBoundingClientRect();
      if (type === 'drag') {
        isDragging.current = true;
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      } else {
        isResizing.current = true;
        resizeStart.current = { x: e.clientX, y: e.clientY };
        initialSize.current = { width: rect.width, height: rect.height };
      }
      e.preventDefault();
      document.body.style.userSelect = 'none';
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) {
      setDesmosPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    } else if (isResizing.current) {
      const newWidth = Math.max(300, initialSize.current.width + (e.clientX - resizeStart.current.x));
      const newHeight = Math.max(200, initialSize.current.height + (e.clientY - resizeStart.current.y));
      setDesmosSize({ width: newWidth, height: newHeight });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    isResizing.current = false;
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!showDesmos) return null;

  return (
    <div
      ref={desmosRef}
      style={{
        position: "fixed", top: desmosPosition.y, left: desmosPosition.x,
        width: desmosSize.width, height: desmosSize.height,
        backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 1000,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      <div
        style={{ cursor: "grab", backgroundColor: "#f1f1f1", padding: "8px 12px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", fontSize: "14px", color: "#333" }}
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
        Desmos Calculator
        <button onClick={() => setShowDesmos(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#666" }}>
          &times;
        </button>
      </div>
      <iframe src="https://www.desmos.com/calculator" width="100%" height="100%" style={{ border: "none" }} title="Desmos Calculator" />
      <div
        style={{ position: "absolute", bottom: 0, right: 0, width: "15px", height: "15px", cursor: "nwse-resize", backgroundColor: "rgba(0,0,0,0.1)", borderTopLeftRadius: "5px" }}
        onMouseDown={(e) => handleMouseDown(e, "resize")}
      />
    </div>
  );
}