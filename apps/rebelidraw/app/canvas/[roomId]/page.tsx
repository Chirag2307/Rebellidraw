'use client';

import { initDraw } from '@/draw';
import { useEffect, useRef, useState } from 'react';
import { use } from 'react';

export default function Canvas({ params }: { params: Promise<{ roomId: string }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { roomId } = use(params);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initDraw(canvasRef.current, roomId);
      
      return cleanup;
    }
  }, [roomId]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-screen h-screen bg-gray-100"
        width={2000} 
        height={1000}
      />
      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded">
          Room: {roomId}
        </div>
                 <button
           onClick={copyShareLink}
           className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-1 rounded flex items-center gap-2 transition-colors border border-white/20"
         >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
           </svg>
           {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
