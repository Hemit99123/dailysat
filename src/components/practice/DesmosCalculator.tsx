"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface DesmosCalculatorProps {
  showDesmos: boolean;
  setShowDesmos: (show: boolean) => void;
}

export function DesmosCalculator({
  showDesmos,
  setShowDesmos,
}: DesmosCalculatorProps) {
  const desmosRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 400, height: 300 });
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      type: "drag" | "resize",
    ) => {
      if (!desmosRef.current) return;
      const rect = desmosRef.current.getBoundingClientRect();

      if (type === "drag") {
        isDragging.current = true;
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      } else {
        isResizing.current = true;
        resizeStart.current = { x: e.clientX, y: e.clientY };
        initialSize.current = { width: rect.width, height: rect.height };
      }

      e.preventDefault();
      document.body.style.userSelect = "none";
    },
    [],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) {
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
        setPosition({ 
            x: Math.max(0, Math.min(newX, maxX)), 
            y: Math.max(0, Math.min(newY, maxY)) 
        });
    }
    if (isResizing.current) {
      const newWidth = Math.max(300, initialSize.current.width + (e.clientX - resizeStart.current.x));
      const newHeight = Math.max(200, initialSize.current.height + (e.clientY - resizeStart.current.y));
      setSize({ width: newWidth, height: newHeight });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    isResizing.current = false;
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!showDesmos) return null;

  return (
    <div
      ref={desmosRef}
      className="fixed z-50 flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* Header / drag handle */}
      <div
        className="flex cursor-grab select-none items-center justify-between border-b border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-800"
        onMouseDown={(e) => handleMouseDown(e, "drag")}
        role="button"
        tabIndex={0}
        aria-label="Drag to move calculator"
      >
        Desmos Calculator
        <button
          onClick={() => setShowDesmos(false)}
          className="rounded p-1 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
          aria-label="Close calculator"
        >
          <X size={16} />
        </button>
      </div>

      {/* Desmos iframe */}
      <iframe
        src="https://www.desmos.com/calculator"
        title="Desmos Calculator"
        className="h-full w-full flex-1 border-0"
      />

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize rounded-tl-sm bg-black/10"
        onMouseDown={(e) => handleMouseDown(e, "resize")}
      />
    </div>
  );
}
