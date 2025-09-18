
"use client";
import React, { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

const CodeEditor = ({ language, fileName, starterCode, value, onChange }) => {
  const monaco = useMonaco();
  const [isThemeReady, setIsThemeReady] = useState(false);

  // Initialize editor content with starter code if value is empty
  useEffect(() => {
    if (!value) {
      onChange(starterCode);
    }
  }, [starterCode, value, onChange]);

  // Define custom theme once monaco is available
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955" },
          { token: "keyword", foreground: "00ffff", fontStyle: "bold" },
          { token: "string", foreground: "ff7eb6" },
          { token: "number", foreground: "facc15" },
          { token: "function", foreground: "22c55e" },
        ],
        colors: {
          "editor.background": "#0f172a",
          "editor.foreground": "#ffffff",
          "editorCursor.foreground": "#facc15",
          "editor.lineHighlightBackground": "#1e293b",
          "editorLineNumber.foreground": "#64748b",
          "editor.selectionBackground": "#334155",
          "editor.inactiveSelectionBackground": "#1e293b",
        },
      });
      setIsThemeReady(true);
    }
  }, [monaco]);

  return (
    <div className="mt-[48px]">
      {/* File name header */}
      <div className="text-white px-4 font-mono text-xl w-fit relative bottom-[12px]">
        {fileName}
      </div>

      {/* Conditionally render the Editor */}
      {isThemeReady ? (
        <Editor
          className="border border-t-0 border-gray-800"
          height="59vh"
          width="72vw"
          value={value}
          language={language}
          theme="myCustomTheme" // <-- apply custom theme
          onChange={(val) => onChange(val || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            fontFamily: "Fira Code, monospace",
          }}
        />
      ) : (
        // Optional: show a loading indicator or placeholder
        <div style={{ height: "55vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a", color: "white" }}>
          Loading Editor...
        </div>
      )}
    </div>
  );
};

export default CodeEditor;