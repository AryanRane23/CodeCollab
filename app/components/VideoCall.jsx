"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import VideoStream from './VideoStream';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

// We'll create a socket connection on mount so it uses the same origin and the Next.js server path
// Socket is stored in a ref and accessed as socketRef.current

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function VideoCall({ roomId, userId, onClose }) {
  const localStreamRef = useRef();
  const peersRef = useRef(new Map());
  const socketRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | ready | connecting | connected | error
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true); // true = video enabled
  const [videoDisabledMap, setVideoDisabledMap] = useState({}); // socketId -> boolean
  const [pinnedId, setPinnedId] = useState(null);

  // Floating window state (copied from VideoWindow)
  const videoRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const addRemote = (id, stream) => setRemoteStreams(p => ({ ...p, [id]: stream }));
  const removeRemote = (id) => setRemoteStreams(p => { const copy = { ...p }; delete copy[id]; return copy; });

  const createPC = useCallback((id) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // attach local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
    }

    const remoteStream = new MediaStream();
    pc.ontrack = (e) => {
      e.streams?.forEach(s => s.getTracks().forEach(t => remoteStream.addTrack(t)));
      addRemote(id, remoteStream);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socketRef.current?.emit('ice-candidate', { to: id, candidate: e.candidate });
    };

    peersRef.current.set(id, pc);
    return pc;
  }, []);

  const callRemote = async (id) => {
    const pc = createPC(id);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit('offer', { to: id, sdp: offer });
  };

  // join session with roomId
  const joinSession = async () => {
    if (!roomId) return alert('Missing room id');

    // get user media
    try {
      setStatus('connecting');
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = s;
      setLocalStream(s);
      setError('');
    } catch (err) {
      console.error('Could not get user media', err);
      setError('Camera / Microphone permission denied or not available');
      setStatus('error');
      return;
    }

    socketRef.current?.emit('join-room', { roomId, userId });
    setJoined(true);
    setStatus('ready');
  };

  // hang up
  const hangUp = (auto = false) => {
    for (const [id, pc] of peersRef.current.entries()) {
      try { pc.close(); } catch (e) {}
    }
    peersRef.current.clear();
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
    socketRef.current?.emit('leave-room', { roomId });
    setJoined(false);
    setRemoteStreams({});
    if (onClose && !auto) onClose();
  };

  const toggleMute = () => {
    if (localStreamRef.current) localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !muted);
    setMuted(!muted);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) localStreamRef.current.getVideoTracks().forEach(t => t.enabled = !videoOn);
    const newState = !videoOn;
    setVideoOn(newState);
    // inform other participants so they can show placeholder too
    try {
      socketRef.current?.emit('video-toggle', { roomId, socketId: socketRef.current?.id, videoOn: newState });
      // also update local map for immediate UI
      setVideoDisabledMap(m => ({ ...m, [socketRef.current?.id]: !newState }));
    } catch (e) { console.error('Failed to emit video-toggle', e); }
  };

  // socket listeners
  useEffect(() => {
    // create socket connection to same origin using Next.js server socket path
    socketRef.current = io(undefined, { path: '/api/socket' });

    const s = socketRef.current;

  s.on('connect_error', (err) => { console.error('Socket connect error', err); setError('Signaling server connection failed'); setStatus('error'); });
  s.on('connect', () => { setStatus(prev => prev === 'connecting' || prev === 'ready' ? 'connected' : prev); setError(''); });

    s.on('existing-users', (list) => {
      // call each existing user
      list.forEach(({ socketId }) => callRemote(socketId));
    });

    s.on('video-toggle', ({ socketId, videoOn }) => {
      setVideoDisabledMap(m => ({ ...m, [socketId]: !videoOn }));
    });

    s.on('user-joined', ({ socketId }) => {
      // when a new user joins, create a peer and wait for their offer/answer flow
      // we do not immediately call here - the new user will call existing peers
    });
    s.on('offer', async ({ from, sdp }) => {
      const pc = createPC(from);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      s.emit('answer', { to: from, sdp: answer });
    });

    s.on('answer', async ({ from, sdp }) => {
      const pc = peersRef.current.get(from);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    s.on('ice-candidate', ({ from, candidate }) => {
      const pc = peersRef.current.get(from);
      if (pc && candidate) pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
    });

    s.on('user-left', ({ socketId }) => {
      const pc = peersRef.current.get(socketId);
      if (pc) { try { pc.close(); } catch (e) {} peersRef.current.delete(socketId); }
      removeRemote(socketId);
    });

    return () => {
      s.disconnect();
      peersRef.current.forEach(pc => { try { pc.close(); } catch {} });
      peersRef.current.clear();
    };
  }, [createPC]);

  // attach local stream to preview videoRef (keeps UI consistent)
  useEffect(() => {
    if (videoRef.current && localStreamRef.current) videoRef.current.srcObject = localStreamRef.current;
  }, [localStreamRef.current]);

  // update localStream state for rendering participants grid
  useEffect(() => {
    setLocalStream(localStreamRef.current || null);
  }, [localStreamRef.current]);

  const streamHasEnabledVideo = (s) => {
    try {
      if (!s) return false;
      const tracks = s.getVideoTracks();
      return tracks.some(t => t.enabled === true);
    } catch (e) { return false; }
  };

  // Drag handlers (copied from VideoWindow)
  const dragRef = useRef();
  const onPointerDown = (e) => { setIsDragging(true); dragRef.current = { x: e.clientX - position.x, y: e.clientY - position.y }; };
  const onPointerMove = (e) => { if (isDragging) setPosition({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y }); };
  const onPointerUp = () => setIsDragging(false);

  // Styles (same as VideoWindow to keep UI)
  const windowStyle = {

    position: 'fixed', left: position.x, top: position.y, width: '347px', height: '220px', zIndex: 9999,
    background: '#222', borderRadius: '10px', boxShadow: '0 2px 16px rgba(0,0,0,0.3)', overflow: 'hidden', transition: 'width 0.2s, height: 0.2s', display: 'flex', flexDirection: 'column'
  };
  const headerStyle = { height: '32px', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'move', padding: '0 8px' };

  return (
    <div style={windowStyle} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div style={headerStyle} onPointerDown={onPointerDown}>
        {isMinimized ? (
          <button onClick={() => setIsMinimized(false)} title="Maximize" style={{ marginRight: 8 }}>⛶</button>
        ) : (
          <button onClick={() => setIsMinimized(true)} title="Minimize" style={{ marginRight: 8 }}>🗕</button>
        )}
        <button onClick={() => { hangUp(false); }} title="Hang Up" style={{ marginRight: 8, backgroundColor: '#ef4444', color: 'black', border: 'none', padding: '4px 8px', borderRadius: 6, position:'absolute', left:'0',  fontSize: 'x-small',  marginLeft: '10px', marginBottom:'6px', marginTop:'6px', cursor:'pointer'}}>Hang Up</button>
        <button onClick={() => { if (onClose) onClose(); }} title="Close" style={{ marginLeft: 8, background: 'transparent', color: '#fff', border: 'none', cursor:'pointer' }}>✖</button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Pinned large view (if any) */}
        {pinnedId && (pinnedId === socketRef.current?.id ? (
          <div style={{ marginBottom: 8 }}>
            <VideoStream stream={localStream} muted={true} isLocal={true} showFallback={!streamHasEnabledVideo(localStream) || videoDisabledMap[socketRef.current?.id]} width={660} height={360} onClick={() => setPinnedId(null)} />
          </div>
        ) : (
          remoteStreams[pinnedId] && (
            <div style={{ marginBottom: 8 }}>
              <VideoStream stream={remoteStreams[pinnedId]} muted={false} showFallback={!streamHasEnabledVideo(remoteStreams[pinnedId]) || videoDisabledMap[pinnedId]} width={660} height={360} onClick={() => setPinnedId(null)} />
            </div>
          )
        ))}

        {/* Participant list (scrollable vertical) */}
        <style>{`
          .vc-scroll::-webkit-scrollbar { display: none; }
          .vc-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="vc-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: pinnedId ? 120 : 160, overflowY: 'auto', paddingRight: 6 }}>
          {/* Local (click to pin) */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <VideoStream stream={localStream} muted={true} isLocal={true} showFallback={!streamHasEnabledVideo(localStream) || videoDisabledMap[socketRef.current?.id]} width={pinnedId ? 220 : 342} height={pinnedId ? 120 : 188} onClick={() => setPinnedId(prev => prev === socketRef.current?.id ? null : socketRef.current?.id)} />
          </div>

          {/* Remotes */}
          {Object.entries(remoteStreams).map(([id, st]) => (
            <div key={id} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <VideoStream stream={st} muted={false} showFallback={!streamHasEnabledVideo(st) || videoDisabledMap[id]} width={pinnedId ? 220 : 342} height={pinnedId ? 120 : 188} onClick={() => setPinnedId(prev => prev === id ? null : id)} />
            </div>
          ))}
        </div>

        {/* Small status / error overlay */}
        <div style={{ position: 'absolute', left: 12, top: 12, background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: 6, color: 'white', fontSize: 12 }}>
          <div>Status: {status}</div>
          {error && <div style={{ color: '#ffdddd', marginTop: 4 }}>{error}</div>}
        </div>

        {/* Controls */}
        <div style={{ position: 'absolute', top: '104px', right: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!joined ? (  
            <button onClick={joinSession} style={{position:'absolute',right: '9px', top: '38px', backgroundColor: '#10b981', color: 'black', borderRadius: '8px', padding: '3px', border: 'none',width: '56px', fontSize:'13px', cursor:'pointer'  }}>Join</button>
          ) : (
            <>
              <button onClick={toggleVideo} style={{ backgroundColor: !videoOn? '#e53e3e' : 'white', color: 'black', borderRadius: '27%', padding: '10px', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px' }} title={!videoOn ? 'Turn on video' : 'Turn off video'}>
                <FontAwesomeIcon icon={!videoOn ? faVideoSlash : faVideo} />
              </button>
              <button onClick={toggleMute} style={{ backgroundColor: muted ? '#e53e3e' : 'white', color: 'black', borderRadius: '27%', padding: '10px', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px' }} title={muted ? 'Unmute' : 'Mute'}>
                <FontAwesomeIcon icon={muted ? faMicrophoneSlash : faMicrophone} />
              </button>
              {/* <button onClick={() => hangUp(false)} style={{ backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', padding: '8px', border: 'none', position:'absolute', left:'0',  }}>Hang Up</button> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
