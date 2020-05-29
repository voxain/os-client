new Program(
  "codemirror",
  (win, passed) => {
    let textarea = document.createElement("textarea");
    textarea.className = "codemirror-textarea";
    win.querySelector(".win-content").appendChild(textarea);

    let editorMode;
    if (Object.getOwnPropertyNames(CodeMirrorModes).includes(passed.fileExt))
      editorMode = fileExt;

    let editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      theme: "liquibyte",
      tabSize: 2,
      mode: editorMode,
      value: passed.value || "",
    });
    editor.display.wrapper.id = "code-box";
    editor.mode = "javascript";
  },
  {
    formattedName: "CodeMirror",
    icon: "https://codemirror.net/doc/logo.png",
    defaultTitle: "Untitled - CodeMirror",
  }
);
