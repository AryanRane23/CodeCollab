// MULTI EDITOR
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fileNames, starterCodes } from '../../utils/languageData';

const MonacoEditor = dynamic(() => import('../../components/CodeEditor'), { ssr: false });

/* ---------------- language helpers ---------------- */
const languageMap = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  go: 'go',
  php: 'php',
  ruby: 'ruby',
};

const languageIdMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  cs: 51,
  go: 60,
  php: 68,
  ruby: 72,
};
/*                   COMPONENT                         */
export default function RoomEditorPage() {
  const { language, roomId } = useParams();
  const router = useRouter();

  /* ───────────────── state ───────────────── */
  const editorLanguage = languageMap[language] || 'javascript';
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  /* ───────────────── socket setup ───────────────── */
  const socketRef = useRef(null);

  /* 1. Load starter code when language changes */
  useEffect(() => {
    setCode(starterCodes[editorLanguage] || '// Start coding here...');
  }, [editorLanguage]);

  /* 2. Init socket & join room */
  useEffect(() => {
    socketRef.current = io(undefined, { path: '/api/socket' });

    socketRef.current.emit('join-room', { roomId });

    socketRef.current.on('code-change', ({ code }) => {
      console.log('📥 incoming', code.slice(0, 15)); // ✅ logs incoming socket updates
      setCode(code);
    });

    socketRef.current.on('run-output', ({ output }) => {
      setOutput(output);
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });
    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => socketRef.current.disconnect();
  }, [roomId]);

  /* 3. Editor change handler */
  const handleEditorChange = (newCode) => {
    setCode(newCode);
    socketRef.current.emit('code-change', { roomId, code: newCode });
  };

  /* ───────────────── run‑code with Judge0 ───────────────── */
  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    const languageId = languageIdMap[language];
    if (!languageId) {
      const errorMessage = '❌ Unsupported language.';
      setOutput(errorMessage);
      socketRef.current.emit('run-output', { roomId, output: errorMessage });
      setIsRunning(false);
      return;
    }

    try {
  const res = await fetch(
    'https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // 'X-RapidAPI-Key': '3d7f474beamsh8d37fc893c0d6cdp11ce22jsn808e66c48d0f',
        'X-RapidAPI-Key': '066dad0df3mshb9c05a142c2758cp12ec0ejsn749d06b1348e',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: btoa(code),
        stdin: '',
      }),
    }
  );

  const result = await res.json();
  let outputText = 'Unknown error.';
  if (result.stdout)          outputText = atob(result.stdout);
  else if (result.stderr)     outputText = atob(result.stderr);
  else if (result.compile_output) outputText = atob(result.compile_output);

  // 🔸 only ONE setOutput, after outputText is final
  setOutput(outputText);
  socketRef.current.emit('run-output', { roomId, output: outputText });
} catch (err) {
  const errorText = '❌ Failed to run code.';
  setOutput(errorText);
  socketRef.current.emit('run-output', { roomId, output: errorText });
}

    setIsRunning(false);
  };

  /* ───────────────── render ───────────────── */
  return (
    <div>
      {/* Header */}
      <div className="text-xl font-semibold capitalize relative top-[10px] ml-[9px] flex justify-between pr-4">
        <div>Online {editorLanguage} Compiler</div>
        <div className="text-sm text-gray-600">Room ID: {roomId}</div>
      </div>

      {/* Top bar */}
      <div
        className="fileName box-border absolute top-[49px] w-full h-[8%]"
        style={{ backgroundColor: '#3c4042' }}
      />

      {/* RUN button */}
      <button
        onClick={runCode}
        className="p-1.5 text-gray-800 rounded absolute top-[60px] left-[44%] cursor-pointer w-[70px] font-medium"
        style={{ backgroundColor: '#6741d9' }}
      >
        {isRunning ? (
          <FontAwesomeIcon icon={faSpinner} />
        ) : (
          <>
            Run <FontAwesomeIcon icon={faPlay} className="ml-1.5" />
          </>
        )}
      </button>

      {/* Code editor */}
      <MonacoEditor
        language={editorLanguage}
        fileName={fileNames[editorLanguage] || 'index.js'}
        starterCode={starterCodes[editorLanguage] || ''}
        value={code}
        onChange={handleEditorChange}
      />

      {/* Output */}
      <pre className="bg-black text-white absolute top-[104px] right-0 h-[85vh] w-[50vw] ">
        {output}
      </pre>
    </div>
  );
}