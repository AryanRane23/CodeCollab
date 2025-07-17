// app/[language]/page.js - Solo Editor Page 
'use client'; // This tells Next.js we're using client-side hooks like useState, useEffect

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

import { useParams } from 'next/navigation'; // To read /java, /cpp etc from URL
import dynamic from 'next/dynamic'; // To load Monaco Editor without SSR (server-side rendering)
import { useState, useEffect } from 'react';
import LanguageSelector from '../components/LanguageSelector'; // Dropdown 
import { fileNames, starterCodes } from '../utils/languageData'; /// Main.java, index.js...


// Load Monaco editor only on client (not on server)
const MonacoEditor = dynamic(() => import('../components/CodeEditor'), { ssr: false });

export default function LanguagePage() {
  const { language } = useParams(); // Get the current language from the URL (like /java)

  //This is the map that tells the Monaco Editor what language mode to use when the user selects a language from the URL like /python, /cpp, etc.
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
    swift: 'swift',
    kotlin: 'kotlin',
    rust: 'rust',
    r: 'r',
    perl: 'perl',
    bash: 'shell',
    dart: 'dart',
    scala: 'scala',
    sql: 'sql',
    html: 'html',
    css: 'css',
    json: 'json',
    xml: 'xml',
    markdown: 'markdown',
    yaml: 'yaml',
  };


  // Map editor language to Judge0 language ID
  const languageIdMap = {
    javascript: 63,
    typescript: 74,
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
    cs: 51,
    csharp: 51,
    go: 60,
    php: 68,
    ruby: 72,
    swift: 83,
    kotlin: 78,
    rust: 73,
    r: 80,
    perl: 85,
    bash: 46,
    dart: 81,
    scala: 82,
    sql: 86,
    html: 92, // Judge0 supports HTML via a custom runner
    xml: 95,
    markdown: 96,
  };

  // Set initial language state (default to javascript if URL is invalid)
  const [editorLanguage, setEditorLanguage] = useState(languageMap[language] || 'javascript');
  const [code, setCode] = useState(''); // Code from editor
  const [output, setOutput] = useState(''); // Output from Judge0
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    const languageId = languageIdMap[editorLanguage];

    if (!languageId) {
      setOutput('❌ This language is not supported.');
      setIsRunning(false);
      return;
    }

    const encodedCode = btoa(code); // Base64 encode the code

    try {
      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true", {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // 'X-RapidAPI-Key': '066dad0df3mshb9c05a142c2758cp12ec0ejsn749d06b1348e',
          'X-RapidAPI-Key': '3d7f474beamsh8d37fc893c0d6cdp11ce22jsn808e66c48d0f',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: languageId, // ✅ Correct usage
          source_code: encodedCode,
          stdin: ''
        })
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
      console.error(err);
      setOutput('❌ Failed to fetch result.');
    }

    setIsRunning(false);
  };



  // When URL changes, update the editor language accordingly
  useEffect(() => {
    setEditorLanguage(languageMap[language] || 'javascript');
  }, [language]);

  // useEffect(() => {
  //   setCode(starterCodes[editorLanguage] || '// Start coding here...');
  // }, [editorLanguage]);
useEffect(() => {
  if (!code) {
    setCode(starterCodes[editorLanguage] || '// Start coding here...');
  }
}, [editorLanguage]);


  return (
    <div className="">
      {/* Title */}
      <div className="text-xl font-semibold capitalize relative top-[10px] ml-[9px] ">Online {editorLanguage} Compiler </div>   {/* Online Python Compiler... */}

      {/* Navbar */}
      <div className="fileName box-border absolute top-[49px] w-[100%] h-[8%] " style={{ backgroundColor: '#3c4042' }}>  </div>

      {/* Dropdown - to switch language */}
      <div className='relative top-[-78px] p-2 bg-white border-white border-1 rounded text-gray-900 cursor-pointer'> <LanguageSelector value={editorLanguage} onChange={setEditorLanguage} /> </div>

      {/* Monaco code editor with the selected language */}
      <MonacoEditor
        language={editorLanguage}
        fileName={fileNames[editorLanguage] || 'index.js'}
        value={code}
        onChange={(newCode) => setCode(newCode)}
      />

      {/* RUN BUTTON */}
      <button onClick={runCode} className=" p-1.5 text-gray-800 rounded absolute top-[60px] left-[44%] cursor-pointer w-[70px] font-medium" style={{ backgroundColor: '#6741d9' }}>
        {isRunning ?    // if isRunning then ( loading... ) else ( Run )
          (<FontAwesomeIcon icon={faSpinner}  />) :
          (
            <> Run <FontAwesomeIcon icon={faPlay} className="ml-1.5" />   </>
          )}

      </button>

      <pre className=" bg-black text-white absolute top-[104px] right-[0px] h-[85vh] w-[50vw]">
        {output}
      </pre>

    </div>
  );
}

