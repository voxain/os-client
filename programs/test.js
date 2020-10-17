new Program(
  "html",
  (win) => {
    win.querySelector(".window-content").innerHTML = "This is a test window!";
  },
  {
    formattedName: "Developer Test Window",
    icon: "/logo.png",
    defaultTitle: "Devtest Window",
  }
);
