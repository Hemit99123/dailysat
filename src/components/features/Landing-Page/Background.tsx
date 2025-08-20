'use client';

import React, { useEffect, useState } from 'react';

const shapeTypes = ['circle', 'square', 'triangle'] as const;
const colors = ['bg-blue-300', 'bg-indigo-300', 'bg-pink-300', 'bg-purple-300'];

type ShapeType = typeof shapeTypes[number];

interface Shape {
  type: ShapeType;
  size: number;      // px
  color: string;
  x1: number; y1: number; x2: number; y2: number;
  duration: number; delay: number;
  topPx: number; leftPx: number; // absolute pixel placement for the wrapper
}

const PAD = 64;   // extra space inside the wrapper for the blur halo
const GAP = 16;   // viewport padding so blobs don’t kiss the edges

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const dist = (a: {x:number;y:number}, b:{x:number;y:number}) => Math.hypot(a.x - b.x, a.y - b.y);

function generateShapes(count: number, vw: number, vh: number): Shape[] {
  // size range responsive to the viewport (keeps things from overwhelming height on laptops/phones)
  const base = Math.min(vw, vh);
  let minSize = Math.max(240, base * 0.32);
  let maxSize = Math.max(minSize + 40, base * 0.48);

  // Make sure a wrapper of max size can actually fit inside the viewport with padding
  const maxSizeByW = Math.max(80, vw - 2 * (PAD + GAP));
  const maxSizeByH = Math.max(80, vh - 2 * (PAD + GAP));
  maxSize = Math.min(maxSize, maxSizeByW, maxSizeByH);
  minSize = Math.min(minSize, maxSize - 20);

  const shapes: Shape[] = [];
  const centers: { x: number; y: number; r: number }[] = [];

  for (let i = 0; i < count; i++) {
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const size = rand(minSize, maxSize);
    const wrapperW = size + PAD * 2;
    const wrapperH = size + PAD * 2;

    // Travel per axis that *fits* given this wrapper and viewport
    const maxTravelX = Math.max(24, Math.min(220, (vw - wrapperW) / 2 - GAP));
    const maxTravelY = Math.max(24, Math.min(220, (vh - wrapperH) / 2 - GAP));

    // Placement ranges that won’t collapse (so animation never pushes outside viewport)
    const minLeft = GAP + maxTravelX;
    const maxLeft = Math.max(minLeft, vw - wrapperW - GAP - maxTravelX);
    const minTop  = GAP + maxTravelY;
    const maxTop  = Math.max(minTop, vh - wrapperH - GAP - maxTravelY);

    // Pick a spot; gently avoid big overlaps
    let left = rand(minLeft, maxLeft);
    let top  = rand(minTop,  maxTop);
    const cx = () => left + wrapperW / 2;
    const cy = () => top + wrapperH / 2;

    let tries = 0;
    const MIN_SEP = size * 0.55; // soft separation
    while (
      tries < 80 &&
      centers.some(c => dist({ x: cx(), y: cy() }, c) < Math.max(MIN_SEP, (c.r + size / 2) * 0.6))
    ) {
      left = rand(minLeft, maxLeft);
      top  = rand(minTop,  maxTop);
      tries++;
    }
    centers.push({ x: cx(), y: cy(), r: size / 2 });

    shapes.push({
      type,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      x1: rand(-maxTravelX * 1.4, maxTravelX * 1.4),
      y1: rand(-maxTravelY * 1.4, maxTravelY * 1.4),
      x2: rand(-maxTravelX * 1.4, maxTravelX * 1.4),
      y2: rand(-maxTravelY * 1.4, maxTravelY * 1.4),
      duration: rand(3, 7),
      delay: 0,
      topPx: top,
      leftPx: left,
    });
  }
  return shapes;
}

const Background = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const place = () => setShapes(generateShapes(4, window.innerWidth, window.innerHeight));
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      {shapes.map((shape, idx) => {
        const wrapperStyle: React.CSSProperties & {
          ['--x1']?: string; ['--y1']?: string; ['--x2']?: string; ['--y2']?: string;
        } = {
          top: `${shape.topPx}px`,
          left: `${shape.leftPx}px`,
          width: `${shape.size + PAD * 2}px`,
          height: `${shape.size + PAD * 2}px`,
          animationDuration: `${shape.duration}s`,
          animationDelay: `${shape.delay}s`,
          ['--x1']: `${shape.x1}px`,
          ['--y1']: `${shape.y1}px`,
          ['--x2']: `${shape.x2}px`,
          ['--y2']: `${shape.y2}px`,
        };

        return (
          <div
            key={idx}
            className="absolute animate-wander transform-gpu will-change-transform opacity-30 filter blur-3xl"
            style={wrapperStyle}
          >
            <div
              className={[
                'absolute',
                shape.color,
                shape.type === 'circle' ? 'rounded-full' : '',
                shape.type === 'triangle' ? 'triangle' : '',
              ].join(' ')}
              style={{
                top: `${PAD}px`,
                left: `${PAD}px`,
                width: `${shape.size}px`,
                height: `${shape.size}px`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Background;
