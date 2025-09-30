import React, { useRef, useState, useEffect } from "react";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // Example TURN (COTURN):
    // { urls: "turn:your.coturn.server:3478", username: "user", credential: "pass" }
  ],
};

export default function VideoWindow({ onClose }) {
  const videoRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [stream, setStream] = useState(null);

  // Get user media on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    });
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Drag logic
  const dragRef = useRef();
  const onPointerDown = (e) => {
    setIsDragging(true);
    dragRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const onPointerMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragRef.current.x,
        y: e.clientY - dragRef.current.y,
      });
    }
  };
  const onPointerUp = () => setIsDragging(false);

  // Video/Audio close
  const closeVideo = () => {
    if (stream) stream.getVideoTracks().forEach(track => track.stop());
  };
  const closeAudio = () => {
    if (stream) stream.getAudioTracks().forEach(track => track.stop());
  };

  // Styles
  const windowStyle = {
    position: "fixed",
    left: position.x,
    top: position.y,
    width: isMinimized ? "313px" : "100vw",
    height: isMinimized ? "120px" : "100vh",
    zIndex: 9999,
    background: "#222",
    borderRadius: "10px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
    overflow: "hidden",
    transition: "width 0.2s, height 0.2s",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    height: "32px",
    background: "#333",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    cursor: "move",
    padding: "0 8px",
  };

  return (
    <div
      style={windowStyle}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        style={headerStyle}
        onPointerDown={onPointerDown}
      >
        {isMinimized ? (
          <button onClick={() => setIsMinimized(false)} title="Maximize" style={{ marginRight: 8 }}>⛶</button>
        ) : (
          <button onClick={() => setIsMinimized(true)} title="Minimize" style={{ marginRight: 8 }}>🗕</button>
        )}
        <button onClick={onClose} title="Close" style={{ marginRight: 8 }}>✖</button>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            width: isMinimized ? "300px" : "80vw",
            height: isMinimized ? "80px" : "80vh",
            background: "#000",
            borderRadius: "8px",
          }}
        />
        <div style={{
          position: "absolute",
          top: "10px",
          right: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <button onClick={closeVideo}>Close Video</button>
          <button onClick={closeAudio}>Close Audio</button>
        </div>
      </div>
    </div>
  );
}