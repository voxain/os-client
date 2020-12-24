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
  let formattedWindowContent =
    js_beautify(JSON.stringify(windows)) || JSON.stringify(windows);
  $.post(
    APIURL + "fs/writeFile",
    {
      path: "/system/windowStore.syscfg",
      token: Auth.token,
      content: formattedWindowContent,
    },
    (err) => {
      if (err.error) console.error(err); //TODO: add orangescreen
    }
  );
};
let LoadWindows = function () {
  $.post(
    APIURL + "fs/fetchFiles",
    { token: Auth.token, path: "/system" },
    (f) => {
      if (f.error) return;
      let syscfg = f.files.filter(
        (p) => p.path == "/system/windowStore.syscfg"
      )[0].content;

      let windowStore = JSON.parse(syscfg) || [];
      windowStore.forEach((w) => {
        let win = new Window(w.title, w.program);
        win.window.style.top = w.top;
        win.window.style.left = w.left;
        win.window.style.height = w.height;
        win.window.style.width = w.width;
        if (w.zIndex) win.window.style["z-index"] = w.zIndex;
      });
    }
  );
};

let ProgramList = {};
let GetProgram = function (program) {
  return ProgramList[(program || "").toLowerCase()] || {};
};
let InstallProgram = function (p) {
  if (meowos.error) return;
  meowos.log("i", "PROGRAM LOADER", `Loading '${p}'...`);

  $.ajax({
    type: "get",
    url: `${APIURL}programs/${p}`,
    success: function (program, text) {
      if (meowos.error) return;

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

      meowos.log("S", "PROGRAM LOADER", `Loaded '${p}'`);
    },
    error: function (request, status, error) {
      if (meowos.error) return;

      var message = "NO_ERROR";
      if (request.status === 0 && !window.navigator.onLine) {
        message = "INTERNET_DISCONNECTED";
      } else if (request.status == 404) {
        message = "RESOURCE_NOT_FOUND"; // Hopefully to never see this
      } else if (request.status == 500) {
        message = "INTERNAL_API_ERROR";
      } else if (status == "timeout") {
        message = `TIMEOUT_REACHED_LOADING_${p.toUpperCase()}`;
      } else if (status == "error") {
        message = "CONNECTION_TO_API_FAILED";
      }

      meowos.ErrorHandler(
        "PROGRAM LOADER",
        `Failed to load '${p}' due to: ${message}`,
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
  $.post(
    APIURL + "fs/writeFile",
    {
      path: "/system/installed.syscfg",
      token: Auth.token,
      content: JSON.stringify(newPrograms),
    },
    (err) => {
      if (err.error) console.error(err); //TODO: add orangescreen
      window.location.reload();
    }
  );
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

  $.post(
    APIURL + "fs/writeFile",
    {
      path: "/system/installed.syscfg",
      token: Auth.token,
      content: JSON.stringify(Object.keys(ProgramList)),
    },
    (err) => {
      if (err.error) console.error(err); //TODO: add orangescreen
    }
  );
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
    if (winMaxZ < (Number(w.style["z-index"]) || 1))
      winMaxZ = Number(w.style["z-index"]);
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
  taskbarIconImage.src = this.program.icon;
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
  win.style.top =
    _("active-area").offsetHeight / 2 - win.offsetHeight / 2 + "px";
  win.style.left =
    _("active-area").offsetWidth / 2 - win.offsetWidth / 2 + "px";

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
    this.content.innerHTML = "Error."; //TODO: pass actual error, and maybe more info
  }

  WINDOWS.push(this);
};

let OnLogin = function () {
  $.post(
    `${APIURL}fs/fetchFiles`,
    { token: Auth.token, path: "/system" },
    (f) => {
      if (f.error) return; //TODO: add orangescreen here
      let syscfg = f.files.filter(
        (p) => p.path == "/system/installed.syscfg"
      )[0].content; //TODO: add orangescreen if no file
      if (!syscfg) return;

      (JSON.parse(syscfg) || []).forEach((p) => {
        InstallProgram(p);
      });
    }
  );
};

window.Auth = {};

let LoginErrors = {
  DIR_NOT_EXIST: "Invalid username.",
  NO_CREDENTIALS:
    "There is no password associated with this account. Please contact to have it reset.",
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

  let oldHTML = _("overlay-login-enter").innerHTML;
  _("overlay-login-enter").innerHTML = "...";

  $.post(
    APIURL + "account/login",
    { username: username, password: password },
    function (data) {
      _("overlay-login-enter").innerHTML = oldHTML;

      if (data.error)
        return (_("overlay-login-error").innerHTML = LoginErrors[data.error]);

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

_("overlay-login-create").onclick = function () {
  $("#overlay-login").fadeOut(400);
  $("#overlay-create").fadeIn(400);
};
_("overlay-create-login").onclick = function () {
  $("#overlay-create").fadeOut(400);
  $("#overlay-login").fadeIn(400);
};
