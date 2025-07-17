'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fileNames, starterCodes } from '../../utils/languageData';
import LanguageSelector from '../../components/LanguageSelector'; // Dropdown 
import { useRouter } from 'next/navigation';

const MonacoEditor = dynamic(() => import('../../components/CodeEditor'), { ssr: false });
let socket;

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

export default function RoomEditorPage() {
  const router = useRouter();
  const { language, roomId } = useParams();
  console.log("params", { language, roomId });


  // const [editorLanguage, setEditorLanguage] = useState(languageMap[language] || 'javascript');
  const editorLanguage = languageMap[language] || 'javascript';



  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {

    setCode(starterCodes[editorLanguage] || '// Start coding here...');

  }, [editorLanguage]);

  useEffect(() => {
    socket = io('http://localhost:3000');
    socket.emit('join-room', roomId);
    socket.on('code-change', (newCode) => setCode(newCode));

    return () => socket.disconnect();
  }, [roomId]);

  const handleEditorChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', { roomId, code: newCode });
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    const languageId = languageIdMap[language];

    if (!languageId) {
      setOutput('❌ Unsupported language.');
      setIsRunning(false);
      return;
    }

    const encodedCode = btoa(code);

    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '3d7f474beamsh8d37fc893c0d6cdp11ce22jsn808e66c48d0f',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: encodedCode,
          stdin: ''
        }),
      });

      const result = await response.json();

      if (result.stdout) {
        setOutput(atob(result.stdout));
      } else if (result.stderr) {
        setOutput(atob(result.stderr));
      } else if (result.compile_output) {
        setOutput(atob(result.compile_output));
      } else {
        setOutput('Unknown error.');
      }
    } catch (err) {
      setOutput('❌ Failed to run code.');
    }

    setIsRunning(false);
  };

  return (
    <div>
      {/* Header Title and Room ID */}
      <div className="text-xl font-semibold capitalize relative top-[10px] ml-[9px] flex justify-between pr-4">
        <div>Online {editorLanguage} Compiler</div>
        <div className="text-sm text-gray-600">Room ID: {roomId}</div>
      </div>

      {/* Navbar */}
      <div className="fileName box-border absolute top-[49px] w-[100%] h-[8%] " style={{ backgroundColor: '#3c4042' }}>  </div>

      {/* RUN BUTTON */}
      <button onClick={runCode} className=" p-1.5 text-gray-800 rounded absolute top-[60px] left-[44%] cursor-pointer w-[70px] font-medium" style={{ backgroundColor: '#6741d9' }}>
        {isRunning ?    // if isRunning then ( loading... ) else ( Run )
          (<FontAwesomeIcon icon={faSpinner} />) :
          (
            <> Run <FontAwesomeIcon icon={faPlay} className="ml-1.5" />   </>
          )}

      </button>

      {/* Dropdown - to switch language */}
      <div className='relative top-[-78px] p-2 bg-white border-white border-1 rounded text-gray-900 cursor-pointer'>
        {/* <LanguageSelector value={editorLanguage} onChange={newLang} />
         router.push(`/${newLang}/${roomId}`);
          */}
        <LanguageSelector
          value={editorLanguage}
          onChange={(newLang) => {
            if (!roomId) return; // prevents undefined issue
            router.push(`/${newLang}/${roomId}`);
          }}
        />

      </div>

      {/* Code Editor */}

      <div  >
        <MonacoEditor
          language={editorLanguage}
          fileName={fileNames[editorLanguage] || 'index.js'}
          value={code}
          onChange={handleEditorChange}
        />
      </div>

      {/* Output */}
      <pre className=" bg-black text-white absolute  top-[104px] right-[0px] h-[85vh] w-[50vw]">
        {output}
      </pre>
    </div>
  );
}
