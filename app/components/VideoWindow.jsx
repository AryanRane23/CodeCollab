// import React, { useRef, useState, useEffect } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

// const ICE_SERVERS = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     // Example TURN (COTURN):
//     // { urls: "turn:your.coturn.server:3478", username: "user", credential: "pass" }
//   ],
// };

// export default function VideoWindow({ onClose }) {
//   const videoRef = useRef(null);
//   const [isMinimized, setIsMinimized] = useState(true);
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 100, y: 100 });
//   const [stream, setStream] = useState(null);

//   // Toggle states
//   const [videoOn, setVideoOn] = useState(true);
//   const [audioOn, setAudioOn] = useState(true);

//   // Get user media on mount
//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
//       setStream(mediaStream);
//       if (videoRef.current) videoRef.current.srcObject = mediaStream;
//     });
//     return () => {
//       if (stream) stream.getTracks().forEach(track => track.stop());
//     };
//   }, []);

//   // Drag logic
//   const dragRef = useRef();
//   const onPointerDown = (e) => {
//     setIsDragging(true);
//     dragRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
//   };
//   const onPointerMove = (e) => {
//     if (isDragging) {
//       setPosition({
//         x: e.clientX - dragRef.current.x,
//         y: e.clientY - dragRef.current.y,
//       });
//     }
//   };
//   const onPointerUp = () => setIsDragging(false);

//   // Video/Audio toggle functions
//   const toggleVideo = () => {
//     if (stream) {
//       stream.getVideoTracks().forEach(track => (track.enabled = !videoOn));
//     }
//     setVideoOn(!videoOn);
//   };

//   const toggleAudio = () => {
//     if (stream) {
//       stream.getAudioTracks().forEach(track => (track.enabled = !audioOn));
//     }
//     setAudioOn(!audioOn);
//   };

//   // Styles
//   const windowStyle = {
//     position: "fixed",
//     left: position.x,
//     top: position.y,
//     width: "347px",
//     height: "220px",
//     zIndex: 9999,
//     background: "#222",
//     borderRadius: "10px",
//     boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
//     overflow: "hidden",
//     transition: "width 0.2s, height 0.2s",
//     display: "flex",
//     flexDirection: "column",
//   };

//   const headerStyle = {
//     height: "32px",
//     background: "#333",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     cursor: "move",
//     padding: "0 8px",
//   };

//   return (
//     <div
//       style={windowStyle}
//       onPointerMove={onPointerMove}
//       onPointerUp={onPointerUp}
//     >
//       <div
//         style={headerStyle}
//         onPointerDown={onPointerDown}
//       >
//         {isMinimized ? (
//           <button onClick={() => setIsMinimized(false)} title="Maximize" style={{ marginRight: 8 }}>⛶</button>
//         ) : (
//           <button onClick={() => setIsMinimized(true)} title="Minimize" style={{ marginRight: 8 }}>🗕</button>
//         )}
//         <button onClick={onClose} title="Close" style={{ marginRight: 8 }}>✖</button>
//       </div>

//       <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           style={{
//             width: "342px",
//             height: "188px",
//             background: "#000",
//             borderRadius: "8px",
//           }}
//         />

//         {/* Video/Audio Controls */}
//         <div style={{
//           position: "absolute",
//           top: "104px",
//           right: "8px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "8px"
//         }}>
//           <button onClick={toggleVideo} style={{
//             backgroundColor: videoOn ? "#ef4444" : "white",
//             color: "black",
//             borderRadius: "27%",
//             padding: "10px",
//             border: "none",
//             cursor: "pointer",
//             fontSize: "18px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width:"34px",
//             height:"34px"
//           }} title={videoOn ? "Turn off video" : "Turn on video"}>
//             <FontAwesomeIcon icon={videoOn ? faVideoSlash : faVideo} />
//           </button>

//           <button onClick={toggleAudio} style={{
//             backgroundColor: audioOn ? "#ef4444" : "white",
//             color: "black",
//             borderRadius: "27%",
//             padding: "10px",
//             border: "none",
//             cursor: "pointer",
//             fontSize: "18px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width:"34px",
//             height:"34px"
//           }} title={audioOn ? "Mute" : "Unmute"}>
//             <FontAwesomeIcon icon={audioOn ? faMicrophoneSlash : faMicrophone} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

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

  // Toggle states
  const [videoOn, setVideoOn] = useState(true); // Initially video is ON
  const [audioOn, setAudioOn] = useState(true); // Initially audio is ON

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

  // Video/Audio toggle functions
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !videoOn));
    }
    setVideoOn(!videoOn);
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !audioOn));
    }
    setAudioOn(!audioOn);
  };

  // Styles
  const windowStyle = {
    position: "fixed",
    left: position.x,
    top: position.y,
    width: "347px",
    height: "220px",
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
            width: "342px",
            height: "188px",
            background: "#000",
            borderRadius: "8px",
          }}
        />

        {/* Video/Audio Controls */}
        <div style={{
          position: "absolute",
          top: "104px",
          right: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <button onClick={toggleVideo} style={{
            backgroundColor: videoOn ? "white" : "#e53e3e", // Red when ON, white when OFF
            color: "black",
            borderRadius: "27%",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px"
          }} title={videoOn ? "Turn off video" : "Turn on video"}>
            <FontAwesomeIcon icon={videoOn ? faVideo : faVideoSlash} />
          </button>

          <button onClick={toggleAudio} style={{
            backgroundColor: audioOn ? "white" : "#e53e3e", // Darker red when ON, white when OFF
            color: "black",
            borderRadius: "27%",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px"
          }} title={audioOn ? "Mute" : "Unmute"}>
            <FontAwesomeIcon icon={audioOn ? faMicrophone : faMicrophoneSlash} />
          </button>
        </div>
      </div>
    </div>
  );
}
