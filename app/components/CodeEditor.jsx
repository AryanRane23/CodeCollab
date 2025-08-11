"use client";
import React,{ useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, fileName, starterCode, value, onChange }) => {

   // If value is empty, initialize it with starterCode
  useEffect(() => {
    if (!value) {
      onChange(starterCode);
    }
  }, [starterCode, value, onChange]);

  return (
    <div className="mt-[48px]">
      {/* File - index.js , main.py , main.cpp */}
      <div className="text-white px-4 font-mono text-xl w-[8%] relative bottom-[12px]">
        {fileName}
      </div>
     
      <Editor
        height="85vh"
        width="50vw"
        value={value}
        language={language}
        theme="vs-dark"
        onChange={(val) => onChange(val || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />
    </div>
    
  );
};

export default CodeEditor;

