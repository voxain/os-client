new Program(
  "codemirror",
  (win, passed) => {
    passed = passed || {};

    let textarea = document.createElement("textarea");
    textarea.className = "codemirror-textarea";
    win.querySelector(".window-content").appendChild(textarea);

    let editorMode;
    if (Object.getOwnPropertyNames(CodeMirrorModes).includes(passed.fileExt))
      Object.keys(CodeMirrorModes).forEach((m) => {
        if (CodeMirrorModes[m] == passed.fileExt) editorMode = m;
      });

    let editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      theme: "liquibyte",
      tabSize: 2,
      mode: editorMode,
      value: passed.value || "",
    });
    console.log(
      editor,
      editorMode,
      passed,
      Object.getOwnPropertyNames(CodeMirrorModes)
    );
  },
  {
    formattedName: "CodeMirror",
    icon: "https://codemirror.net/doc/logo.png",
    defaultTitle: "Untitled - CodeMirror",
  }
);
