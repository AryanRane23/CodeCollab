"use client";
import React, { useEffect, useRef } from 'react';

export default function VideoStream({ stream, muted, className, showFallback, width = 342, height = 188, isLocal = false, onClick }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream || null;
  }, [stream]);

  return (
    <div style={{ position: 'relative', width: width, height: height }} onClick={onClick}>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={!!muted}
        className={className}
        style={{ width: width, height: height, borderRadius: 8, background: '#000', transform: isLocal ? 'none' : 'none' }}
      />

      {(!stream || showFallback) && (
        <img
          src="/user_img.png"
          alt="user"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: width,
            height: height,
            objectFit: 'cover',
            borderRadius: 8,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
