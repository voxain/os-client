/*
 * functions.js
 * Author: Meow Developers
 * Copyright Meow Developers
 */

const MeowOS = {
  error: false, // probably will fix this later, idk its 1 am in the morning, help
  system: {
    loggingcolors: {
      Reset: "\x1b[37m",

      FgBlack: "\x1b[30m",
      FgRed: "\x1b[31m",
      FgGreen: "\x1b[32m",
      FgYellow: "\x1b[33m",
      FgBlue: "\x1b[34m",
      FgMagenta: "\x1b[35m",
      FgCyan: "\x1b[36m",
      FgWhite: "\x1b[37m",

      BgBlack: "\x1b[40m",
      BgRed: "\x1b[41m",
      BgGreen: "\x1b[42m",
      BgYellow: "\x1b[43m",
      BgBlue: "\x1b[44m",
      BgMagenta: "\x1b[45m",
      BgCyan: "\x1b[46m",
      BgWhite: "\x1b[47m",
    },
    version: "0.1.0", //TODO: include proper versioning
  },
};

function AjaxErrorMsg(request, status, error) {
  var message = "NO_ERROR";
  if (request.status === 0 && !window.navigator.onLine) {
    message = "INTERNET_DISCONNECTED";
  } else if (request.status == 404) {
    message = "RESOURCE_NOT_FOUND";
  } else if (request.status == 500) {
    message = "INTERNAL_API_ERROR";
  } else if (status == "timeout") {
    message = `TIMEOUT_REACHED_LOADING_${p.toUpperCase()}`;
  } else if (status == "error") {
    message = "CONNECTION_TO_API_FAILED";
  } else {
    message = status || response.status;
  }
  return message;
}

loaded++;
var _ = function (id) {
  return document.getElementById(id);
}; // "Mini jQuery" function for IDs.
var rand = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
window.WINDOWS = [];
window.APIURL = "https://service-2308.something.gg/"; // set API URL, will need to be changed when official release is out

let MakeWindowsInteractive = function () {
  if (MeowOS.error) return;
  $("window").draggable({
    handle: ".window-title",
    containment: "document",
    stack: "window",
  });
  $("window:not([noresize])").resizable({
    // Makes the proper windows resizeable.
    containment: "document",
    handles: "all",
    minHeight: 50,
    minWidth: 100,
  });
  document.querySelectorAll("window:not([noresize])").forEach((win) => {
    let title = win.querySelector(".window-title");
    title.ondblclick = function () {
      if (MeowOS.error) return;
      // fullscreen on double-click of title bar
      //TODO: make window return to previous size if double-clicked again
      $(title.parentElement).animate({
        height: _("active-area").offsetHeight,
        width: _("active-area").offsetWidth,
        left: "0px",
        top: "0px",
      });
    };
  });
  // Init minimize buttons.
  document.querySelectorAll(".window-minimize").forEach((minimize) => {
    minimize.onclick = function () {
      if (MeowOS.error) return;
      $(minimize.parentElement).fadeOut({
        start: function () {
          $(this).css("transform", "scale(0.3)");
        },
        complete: function () {
          this.style.display = "none";
        },
        duration: 300,
      });
      let icon = document.querySelector(
        `[for-window="${minimize.parentElement.getAttribute("os-id")}"]`
      );
      icon.onclick = function () {
        minimize.parentElement.style.transform = "";
        minimize.parentElement.style.display = "block";
        icon.onclick = function () {
          minimize.click();
        };
      };
    };
  });
  // Init close buttons.
  document.querySelectorAll(".window-close").forEach((close) => {
    close.onclick = function () {
      let newWINDOWS = [];
      WINDOWS.forEach((w) => {
        if (close.parentElement !== w.window) newWINDOWS.push(w);
      });
      WINDOWS = newWINDOWS;
      $(close.parentElement).fadeOut({
        start: function () {
          $(this).css("transform", "scale(0.3)");
        },
        complete: function () {
          $(this).remove();
        },
        duration: 300,
      });
      let icon = document.querySelector(
        `[for-window="${close.parentElement.getAttribute("os-id")}"]`
      );
      icon.remove();
    };
  });
};

let SaveWindows = function () {
  if (MeowOS.error) return;

  let windows = [];
  WINDOWS.forEach((w) => {
    windows.push({
      left: w.window.style.left,
      top: w.window.style.top,
      width: w.window.style.width || w.window.offsetWidth + "px",
      height: w.window.style.height || w.window.offsetHeight + "px",
      zIndex: w.window.style["z-index"],
      title: w.title,
      program: w.program.name,
      content: w.content.innerHTML,
    });
  });

  // Formats the window JSON. (for easier reading/editing)
  let formattedWindowContent = js_beautify(JSON.stringify(windows)) || JSON.stringify(windows);

  $.ajax({
    type: "POST",
    url: `${APIURL}fs/writeFile`,
    data: {
      path: "/system/windowStore.syscfg",
      token: Auth.token,
      content: formattedWindowContent,
    },
    error: function (request, status, error) {
      if (MeowOS.error) return;

      MeowOS.ErrorHandler(
        "SYSTEM",
        `Failed to save window data due to: ${AjaxErrorMsg(request, status, error)}`,
        true
      );
    },
  });
};
let LoadWindows = function () {
  if (MeowOS.error) return;

  $.ajax({
    type: "POST",
    url: `${APIURL}fs/fetchFiles`,
    data: {
      token: Auth.token,
      path: "/system",
    },
    success: function (f, text) {
      let syscfg = f.files.filter((p) => p.path == "/system/windowStore.syscfg")[0].content;

      let windowStore = JSON.parse(syscfg) || [];
      windowStore.forEach((w) => {
        let waitInterval = setInterval(function () {
          if (!ProgramList[w.program]) return;
          clearInterval(waitInterval);
          let win = new Window(w.title, w.program);
          win.window.style.top = w.top;
          win.window.style.left = w.left;
          win.window.style.height = w.height;
          win.window.style.width = w.width;
          if (w.zIndex) win.window.style["z-index"] = w.zIndex;
        }, 500);
      });
    },
    error: function (request, status, error) {
      if (MeowOS.error) return;

      MeowOS.ErrorHandler(
        "SYSTEM",
        `Failed to load window data due to: ${AjaxErrorMsg(request, status, error)}`,
        true
      );
    },
  });
};

let ProgramList = {};
let GetProgram = function (program) {
  if (MeowOS.error) return;
  return ProgramList[(program || "").toLowerCase()] || {};
};
let InstallProgram = function (p) {
  if (MeowOS.error) return;

  MeowOS.log("i", "PROGRAM LOADER", `Loading '${p}'...`);

  $.ajax({
    type: "GET",
    url: `${APIURL}programs/${p}`,
    success: function (program, text) {
      if (MeowOS.error) return;

      let css = program.style || "";
      if (css) {
        // set CSS for each program in the head tag
        let style = document.createElement("style");
        style.innerHTML = css;
        style.setAttribute("os-for-program", p);
        document.head.appendChild(style);
      }

      let html = program.html || "";
      window[`program-html-${p}`] = html; // temporary until a better solution is found (possibly adding into the script)

      let js = program.script;
      eval(js);

      MeowOS.log("S", "PROGRAM LOADER", `Loaded '${p}'`);
    },
    error: function (request, status, error) {
      if (MeowOS.error) return;

      MeowOS.ErrorHandler(
        "PROGRAM LOADER",
        `Failed to load ${p} due to: ${AjaxErrorMsg(request, status, error)}`,
        true
      );
    },
  });
};
let UninstallProgram = function (prog) {
  let newPrograms = [];
  Object.keys(ProgramList).forEach((p) => {
    if (p !== prog) newPrograms.push(p); //TODO: find a better way to do this
  });

  $.ajax({
    type: "POST",
    url: `${APIURL}fs/writeFile`,
    data: {
      path: "/system/installed.syscfg",
      token: Auth.token,
      content: JSON.stringify(newPrograms),
    },
    success: function (data, text) {
      window.location.reload();
    },
    error: function (request, status, error) {
      if (MeowOS.error) return;

      MeowOS.ErrorHandler(
        "SYSTEM",
        `Failed to uninstall ${prog} due to: ${AjaxErrorMsg(request, status, error)}`,
        true
      );
    },
  });
};

/**
 * Initializes ("installs") a program
 * @constructor
 * @param {String} name - The UNIQUE name of the program.
 * @param {Function} func - The function to evaluate when the program is run.
 */
let Program = function (name, func) {
  // Currently only "official" programs are supported.
  $.get(`${APIURL}programs/${name}`, function (program) {
    let options = program.meta;

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
      hidden: options.hidden || false,
      fullOptions: options,
    };
    ProgramList[name.toLowerCase()] = this.program;
    SetPrograms();
  });
};
let SetPrograms = function () {
  _("taskbar-menu").innerHTML = "";
  Object.keys(ProgramList)
    .sort((a, b) => {
      // Sorts programs by formattedName in programs list.
      a = ProgramList[a].formattedName;
      b = ProgramList[b].formattedName;
      return a > b ? 1 : -1;
    })
    .forEach((prog) => {
      // Creates program in start menu.
      prog = ProgramList[prog];
      if (prog.hidden) return;

      let progBox = document.createElement("div");
      progBox.className = "taskbar-program";
      progBox.setAttribute("noselect", "");
      progBox.onclick = function () {
        new Window(prog.defaultTitle, prog.name);
        _("taskbar-menu").style.display = "none";
      };

      let progIcon = document.createElement("img");
      progIcon.className = "taskbar-program-icon";
      progIcon.src = prog.icon || "";
      progIcon.alt = prog.name;
      progIcon.setAttribute("noselect", "");
      progBox.appendChild(progIcon);

      let progTitle = document.createElement("div");
      progTitle.className = "taskbar-program-title";
      progTitle.innerHTML = prog.formattedName;
      progBox.appendChild(progTitle);

      _("taskbar-menu").appendChild(progBox);
    });

  $.ajax({
    type: "POST",
    url: `${APIURL}fs/writeFile`,
    data: {
      path: "/system/installed.syscfg",
      token: Auth.token,
      content: JSON.stringify(Object.keys(ProgramList)),
    },
    error: function (request, status, error) {
      if (MeowOS.error) return;

      MeowOS.ErrorHandler(
        "PROGRAM LOADER",
        `Failed to load ${prog} due to: ${AjaxErrorMsg(request, status, error)}`,
        true
      );
    },
  });
};

/**
 * Creates a new window.
 * @constructor
 * @param {String} title - The title to initialize the window with.
 * @param {String} program - The name of the program to run with the window.
 * @param {any} pass - Data to pass to the program when run.
 */
let Window = function (title, program, pass) {
  this.title = title;
  this.program = GetProgram(program);
  this.passedData = pass;
  this.id = Date.now(); //TODO: add actual IDs

  let win = document.createElement("window");
  win.style.position = "absolute";
  win.style.display = "none";
  if (this.program.defaultWidth) win.style.width = this.program.defaultWidth;
  if (this.program.defaultHeight) win.style.height = this.program.defaultHeight;
  if (this.program.minWidth) win.style["min-width"] = this.program.minWidth;
  if (this.program.minHeight) win.style["min-height"] = this.program.minHeight;
  if (this.program.noResize) win.setAttribute("noresize", "");
  win.setAttribute("os-id", this.id);

  let winMaxZ = 1;

  document.querySelectorAll("window").forEach((w) => {
    if (winMaxZ < (Number(w.style["z-index"]) || 1)) winMaxZ = Number(w.style["z-index"]);
  });

  win.style["z-index"] = winMaxZ + 1;

  let winTitle = document.createElement("div");
  winTitle.className = "window-title";
  winTitle.setAttribute("noselect", "");
  winTitle.innerHTML = title;
  win.appendChild(winTitle);

  let winContent = document.createElement("div");
  winContent.className = "window-content";
  win.appendChild(winContent);

  let winMinimize = document.createElement("button");
  winMinimize.className = "window-minimize";
  win.appendChild(winMinimize);

  let winClose = document.createElement("button");
  winClose.className = "window-close";
  win.appendChild(winClose);

  let taskbarIcon = document.createElement("div");
  taskbarIcon.className = "taskbar-item";
  taskbarIcon.setAttribute("for-window", this.id);
  let taskbarIconImage = document.createElement("img");
  taskbarIconImage.className = "taskbar-item-image";
  taskbarIconImage.src = this.program.icon || "";
  taskbarIcon.appendChild(taskbarIconImage);
  taskbarIcon.onclick = function () {
    winMinimize.click();
  };
  _("taskbar-items").appendChild(taskbarIcon);

  _("active-area").appendChild(win);
  // kind of hacky, but it works
  win.style.transform = "scale(0.7)";
  $(win).fadeIn({
    start: function () {
      $(this).css("transform", "scale(1)");
    },
    complete: function () {
      this.style.transform = "";
    },
    duration: 350,
  });

  MakeWindowsInteractive();
  this.window = win;
  this.titleElement = winTitle;
  this.content = winContent;
  this.minimizeButton = winMinimize;
  this.closeButton = winClose;

  // Puts the new window in the middle of the screen.
  win.style.top = _("active-area").offsetHeight / 2 - win.offsetHeight / 2 + "px";
  win.style.left = _("active-area").offsetWidth / 2 - win.offsetWidth / 2 + "px";

  this.offscreen = function () {
    //TODO: find better way of doing this (detect when any part of the window is offscreen)
    var rect = this.window.getBoundingClientRect();
    return (
      rect.x + rect.width < 0 ||
      rect.y + rect.height < 0 ||
      rect.x > window.innerWidth ||
      rect.y > window.innerHeight
    );
  };

  let _this = this;
  this.sizeInterval = setInterval(function () {
    // Sets the height of the window content to the size of the window (minus title bar)
    _this.content.style.height = _this.window.offsetHeight - 20 + "px";
  });

  try {
    this.program.eval(this.window, pass);
  } catch (e) {
    console.error(e);
    this.content.innerHTML = "Error."; //TODO: pass actual error, and maybe more info
  }

  WINDOWS.push(this);
};

let OnLogin = function () {
  $.ajax({
    type: "POST",
    url: `${APIURL}fs/fetchFiles`,
    data: {
      token: Auth.token,
      path: "/system",
    },
    success: function (f, text) {
      let syscfg = f.files.filter((p) => p.path == "/system/installed.syscfg")[0].content; //TODO: add orangescreen if no file
      if (!syscfg) return;

      (JSON.parse(syscfg) || []).forEach((p) => {
        InstallProgram(p);
      });
    },
    error: function (request, status, error) {
      if (MeowOS.error) return;

      MeowOS.ErrorHandler(
        "SYSTEM",
        `Failed to load data due to: ${AjaxErrorMsg(request, status, error)}`,
        true
      );
    },
  });
};

window.Auth = {};

let LoginErrors = {
  DIR_NOT_EXIST: "Invalid username.",
  NO_CREDENTIALS:
    "There is no password associated with this account. Please contact to have it reset.",
  ERR_WHEN_READING_CREDENTIALS: "An unexpected error getting your password occurred.",
  INCORRECT_PASSWORD: "Incorrect password.",
};
let Login = function () {
  let username = _("overlay-login-username").value || "";
  let password = _("overlay-login-password").value || "";
  let rememberUsername = _("remember-username").checked;
  let rememberPassword = _("remember-password").checked;

  if (!username) return (_("overlay-login-error").innerHTML = "Please enter a username.");
  if (!password) return (_("overlay-login-error").innerHTML = "Please enter a password.");

  let oldHTML = _("overlay-login-enter").innerHTML;
  _("overlay-login-enter").innerHTML = "...";
  let loadingInt = setInterval(function () {
    _("overlay-login-enter").innerHTML += ".";
  }, 400);

  $.ajax({
    type: "POST",
    url: `${APIURL}account/login`,
    data: {
      username: username,
      password: password,
    },
    success: function (data, text) {
      _("overlay-login-enter").innerHTML = oldHTML;
      clearInterval(loadingInt);

      if (data.error) return (_("overlay-login-error").innerHTML = LoginErrors[data.error]);

      Auth = {
        username: username,
        password: password,
        token: data.token,
      };

      $("#overlay").fadeOut(500, function () {
        $("#overlay").remove();
      });
      if (rememberUsername) localStorage.setItem("usernameStore", username);
      else localStorage.removeItem("usernameStore");

      if (rememberPassword) localStorage.setItem("passwordStore", password);
      else localStorage.removeItem("passwordStore");

      OnLogin();
    },
    error: function (request, status, error) {
      if (MeowOS.error) return;

      MeowOS.ErrorHandler(
        "SYSTEM",
        `Failed to login to MeowOS due to: ${AjaxErrorMsg(request, status, error)}`,
        true
      );
    },
  });
};

_("overlay-login-enter").onclick = Login;
_("overlay-login-username").onkeyup = function (e) {
  if (e.key == "Enter") Login();
};
_("overlay-login-password").onkeyup = function (e) {
  if (e.key == "Enter") Login();
};

_("overlay-login-create").onclick = function () {
  $("#overlay-login").fadeOut(400);
  $("#overlay-create").fadeIn(400);
};
_("overlay-create-login").onclick = function () {
  $("#overlay-create").fadeOut(400);
  $("#overlay-login").fadeIn(400);
};

// Cool Error Handler Script
// Provided by Yours Truly, TCG
// Version 1.0.0.0
// Modified 12/24/2020

MeowOS.ErrorHandler = function (location = "SYSTEM", error, reportToDevs = false) {
  var errorData = error.message ? error.message : error;
  if (error.stack || error.stacktrace)
    errorData += `\nStacktrace: ${error.stack ? error.stack : error.stacktrace}`;
  document.body.innerHTML = `
    <style>
      html, body { width: 100%; height: 100%; }
      #errorDiv {  position: absolute; width: 100%; height: 100%; font-family: Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif; font-size: 20px; color: #23272A; /* color: #2C2F33; */ background-color: #FF9100; top: 0; left: 0; }
      #errorDiv span { font-size: 26px; /* color: #E91E63; */ }
      #errorDiv span#stop { font-size: 22px; }
      #errorDiv p#reported { display: none; }
    </style>
    <div id="errorDiv">
      <span>A fatal error has occurred and MeowOS has stopped execution.</span>
      <p>
        <span id="stop">STOP Error: </span>
        <span>${errorData.split("\n")[0]}</span>
        <br><br>
        In order to continue using MeowOS, you will need to <a href="javascript:window.location.reload()">reload the page</a>. Any progress on or within programs may be lost.
      </p>
      <br>
      <p id="reported">This incident has been reported to the MeowOS Developers.</p>
    </div>
  `;
  MeowOS.log("X", location, errorData);

  if (reportToDevs) {
    // TODO: Report to the damn developers or something...
    // ~ TCG 12/24/2020

    document.getElementById("reported").style.display = "show";
  }
  MeowOS.error = true;
};

// Cool Logging Script
// Also provided by Yours Truly, TCG
// Version 1.0.0.0
// Modified 12/23/2020

MeowOS.log = function (type, location, message) {
  // This is crappy code
  var loggingcolors = MeowOS.system.loggingcolors,
    typecolor = loggingcolors.FgWhite;

  if (type == "X") typecolor = loggingcolors.FgRed;
  // X = Error
  else if (type == "i") typecolor = loggingcolors.FgBlue;
  // i = Information
  else if (type == "!") typecolor = loggingcolors.FgYellow;
  // ! = Warning
  else if (type == "S") typecolor = loggingcolors.FgGreen; // S = Success

  var locationcolor = loggingcolors.FgWhite;

  if (location == "SYSTEM") locationcolor = loggingcolors.FgGreen;
  else if (location == "PROGRAM LOADER") locationcolor = loggingcolors.FgMagenta;

  console.log(
    `(${typecolor}${type}${loggingcolors.Reset}) [${locationcolor}${location}${loggingcolors.Reset}] ${message}`
  );
};
