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
    icon: "https://img.icons8.com/fluent/48/000000/calculator.png",
    defaultTitle: "Untitled - CodeMirror",
  }
);
