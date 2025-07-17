"use client";
import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, fileName, value, onChange }) => {
  return (
    <div className="mt-[31px]">
      <div className="text-white px-4 font-mono text-xl w-[8%] relative bottom-[12px]">
        {fileName}
      </div>
      <Editor
        height="85vh"
        width="50vw"
        value={value}
        language={language}
        theme="vs-dark"
        onChange={(value) => onChange(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default CodeEditor;

