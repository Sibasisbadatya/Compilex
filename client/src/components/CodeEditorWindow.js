import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme, logout, handleCompile }) => {
  const [value, setValue] = useState(code || "");
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };
  const checkKey = (e) => {
    if (e.key == "F9")
      handleCompile();
  }
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl" style={{ boxSizing: "border-box", paddingTop: "1rem" }} onKeyPress={(e) => checkKey(e)} >
      <Editor
        height="60vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        logout={logout}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;