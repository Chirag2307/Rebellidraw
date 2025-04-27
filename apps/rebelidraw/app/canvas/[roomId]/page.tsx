 'use client';

import { initDraw } from '@/draw';
import { useEffect, useRef, useState } from 'react';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    // const canvas = canvasRef.current;
    if(canvasRef.current){
        // const canvas = canvasRef.current
        initDraw(canvasRef.current);
    }
  }, [canvasRef]);

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!ctx) return;

//     const rect = canvasRef.current?.getBoundingClientRect();
//     if (!rect) return;

//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     if (e.button === 0) {
//       // Left click: Draw Rectangle
//     let startX = x;
//     let startY = y;

//     const handleMouseMove = (moveEvent: MouseEvent) => {
//       if (!ctx || !canvasRef.current) return;

//       const rect = canvasRef.current.getBoundingClientRect();
//     const currentY = moveEvent.clientY - rect.top;

//     // Clear the canvas
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     if (penMode === 'rectangle') {
//       // Draw the rectangle
//       const width = currentX - startX;
//       const height = currentY - startY;
//       ctx.fillStyle = 'rgba(0, 128, 255, 0.5)';
//       ctx.fillRect(startX, startY, width, height);
//     } else if (penMode === 'circle') {
//       // Draw the circle
//       const radius = Math.sqrt(
//         Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
//       );
//       ctx.fillStyle = 'rgba(255, 99, 71, 0.5)';
//       ctx.beginPath();
//       ctx.arc(startX, startY, radius, 0, Math.PI * 2);
//       ctx.fill();
//     }
//       ctx.fillRect(startX, startY, width, height);
//     };

//     const handleMouseUp = () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('mouseup', handleMouseUp);ctx.fillRect(x - 50, y - 25, 100, 50);
//     } else if (e.button === 2) {
//       // Right click: Draw Circle
//       ctx.fillStyle = 'rgba(255, 99, 71, 0.5)';
//       ctx.beginPath();
//       ctx.arc(x, y, 40, 0, Math.PI * 2);
//       ctx.fill();
//     }
//   };

//   const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     e.preventDefault(); // Disable default right-click menu
//   };

  return (
    <canvas
      ref={canvasRef}
      className="w-screen h-screen bg-gray-100"
    //   onMouseDown={handleMouseDown}
    //   onContextMenu={handleContextMenu}
    width={2000} height={1000}
    />
  );
}
