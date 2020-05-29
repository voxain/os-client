new Program(
  "codemirror",
  (win) => {
    let editor = CodeMirror.fromTextArea(document.getElementById("code"), {
      lineNumbers: true,
      theme: "liquibyte",
      tabSize: 2,
    });
    editor.display.wrapper.id = "code-box";
  },
  {
    formattedName: "CodeMirror",
    icon: "https://codemirror.net/doc/logo.png",
    defaultTitle: "Untitled - CodeMirror",
  }
);
