new Program(
  "html",
  (win) => {
    win.querySelector(".window-content").innerHTML = "No File Chosen";
  },
  {
    formattedName: "HTML Viewer",
    icon: "https://img.icons8.com/color/48/000000/html-5.png",
    defaultTitle: "Untitled - HTML Viewer",
  }
);
