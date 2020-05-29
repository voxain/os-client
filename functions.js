loaded++;
var _ = function (id) {
  return document.getElementById(id);
};
var rand = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
window.WINDOWS = [];
window.APIURL = "/.netlify/functions/server/";

let MakeWindowsInteractive = function () {
  $("window").draggable({
    handle: ".window-title",
    containment: "document",
    stack: "window",
  });
  $("window:not([noresize])").resizable({
    containment: "document",
    handles: "all",
    minHeight: 50,
    minWidth: 100,
  });
  document.querySelectorAll(".window-close").forEach((close) => {
    close.onclick = function () {
      let newWINDOWS = [];
      WINDOWS.forEach((w) => {
        if (close.parentElement !== w.window) newWINDOWS.push(w);
      });
      WINDOWS = newWINDOWS;
      close.parentElement.remove();
    };
  });
};

let SaveWindows = function () {
  let windows = [];
  WINDOWS.forEach((w) => {
    windows.push({
      left: w.window.style.left,
      top: w.window.style.top,
      width: w.window.style.width || w.window.offsetWidth,
      height: w.window.style.height || w.window.offsetWidth,
      zIndex: w.window.style["z-index"],
      title: w.title,
      program: w.program.name,
      content: w.content.innerHTML,
    });
  });

  localStorage.setItem("windowStore", JSON.stringify(windows));
};
let LoadWindows = function () {
  let windows = JSON.parse(localStorage.getItem("windowStore")) || [];
  windows.forEach((w) => {
    let win = new Window(w.title, w.program);
    win.window.style.top = w.top;
    win.window.style.left = w.left;
    win.window.style.height = w.height;
    win.window.style.width = w.width;
    if (w.zIndex) win.window.style["z-index"] = w.zIndex;
    //win.content.innerHTML = w.content;
  });
};

let ProgramList = {};
let GetProgram = function (program) {
  return ProgramList[(program || "").toLowerCase()] || {};
};
let Program = function (name, func, options) {
  this.program = {
    eval: func,
    name: name.toLowerCase(),
    icon: options.icon,
    formattedName: options.formattedName,
    defaultTitle: options.defaultTitle,
    defaultWidth: options.defaultWidth || "",
    defaultHeight: options.defaultHeight || "",
    minWidth: options.minWidth || "",
    minHeight: options.minHeight || "",
    noResize: options.noResize || false,
  };
  ProgramList[name.toLowerCase()] = this.program;
};

let Window = function (title, program) {
  this.title = title;
  this.program = GetProgram(program);

  let win = document.createElement("window");
  win.style.position = "absolute";
  win.style.top = "0px";
  win.style.left = "0px";
  if (this.program.defaultWidth) win.style.width = this.program.defaultWidth;
  if (this.program.defaultHeight) win.style.height = this.program.defaultHeight;
  if (this.program.minWidth) win.style["min-width"] = this.program.minWidth;
  if (this.program.minHeight) win.style["min-height"] = this.program.minHeight;
  if (this.program.noResize) win.setAttribute("noresize", "");

  let winTitle = document.createElement("div");
  winTitle.className = "window-title";
  winTitle.setAttribute("noselect", "");
  winTitle.innerHTML = title;
  win.appendChild(winTitle);

  let winContent = document.createElement("div");
  winContent.className = "window-content";
  win.appendChild(winContent);

  let winClose = document.createElement("button");
  winClose.className = "window-close";
  win.appendChild(winClose);

  _("active-area").appendChild(win);
  MakeWindowsInteractive();
  this.window = win;
  this.titleElement = winTitle;
  this.content = winContent;
  this.closeButton = winClose;

  this.offscreen = function () {
    var rect = this.window.getBoundingClientRect();
    return (
      rect.x + rect.width < 0 ||
      rect.y + rect.height < 0 ||
      rect.x > window.innerWidth ||
      rect.y > window.innerHeight
    );
  };

  try {
    this.program.eval(this.window);
  } catch (e) {
    this.content.innerHTML = "Error.";
  }

  WINDOWS.push(this);
};

let LoginErrors = {
  DIR_NOT_EXIST: "Invalid username.",
  NO_CREDENTIALS:
    "There is no password associated with this account. Please contact PHLAME Development to have it reset.",
  ERR_WHEN_READING_CREDENTIALS:
    "An unexpected error getting your password occurred.",
  INCORRECT_PASSWORD: "Incorrect password.",
};
let Login = function () {
  let username = _("overlay-login-username").value || "";
  let password = _("overlay-login-password").value || "";
  let rememberUsername = _("remember-username").checked;
  let rememberPassword = _("remember-password").checked;

  if (!username)
    return (_("overlay-login-error").innerHTML = "Please enter a username.");
  if (!password)
    return (_("overlay-login-error").innerHTML = "Please enter a password.");

  $.post(
    APIURL + "login",
    { username: username, password: password },
    function (data) {
      if (data.error)
        return (_("overlay-login-error").innerHTML = LoginErrors[data.error]);

      console.log(data.token);
      _("overlay").remove();
      if (rememberUsername) localStorage.setItem("usernameStore");
      else localStorage.removeItem("usernameStore");
      if (rememberPassword) localStorage.setItem("passwordStore");
      else localStorage.removeItem("passwordStore");
    }
  );
};

_("overlay-login-enter").onclick = Login;
_("overlay-login-username").onkeyup = function (e) {
  if (e.key == "Enter") Login();
};
_("overlay-login-password").onkeyup = function (e) {
  if (e.key == "Enter") Login();
};
