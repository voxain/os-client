loaded++;
var _ = function (id) {
  return document.getElementById(id);
};
var rand = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
window.WINDOWS = [];
window.APIURL = "http://localhost:6969/";

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
  document.querySelectorAll("window:not([noresize])").forEach((win) => {
    let title = win.querySelector(".window-title");
    title.ondblclick = function () {
      $(title.parentElement).animate({
        height: _("active-area").offsetHeight,
        width: _("active-area").offsetWidth,
        left: "0px",
        top: "0px",
      });
    };
  });
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
      if (err.error) console.error(err);
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
let Program = function (name, func) {
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
    };
    ProgramList[name.toLowerCase()] = this.program;
  });
};
let SetPrograms = function () {
  _("taskbar-menu").innerHTML = "";
  Object.keys(ProgramList)
    .sort((a, b) => {
      a = ProgramList[a].formattedName;
      b = ProgramList[b].formattedName;
      return a > b ? 1 : -1;
    })
    .forEach((prog) => {
      prog = ProgramList[prog];
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
};

let Window = function (title, program, pass) {
  this.title = title;
  this.program = GetProgram(program);
  this.passedData = pass;
  this.id = Date.now();

  let win = document.createElement("window");
  win.style.position = "absolute";
  win.style.display = "none";
  win.style["z-index"] = 1000;
  if (this.program.defaultWidth) win.style.width = this.program.defaultWidth;
  if (this.program.defaultHeight) win.style.height = this.program.defaultHeight;
  if (this.program.minWidth) win.style["min-width"] = this.program.minWidth;
  if (this.program.minHeight) win.style["min-height"] = this.program.minHeight;
  if (this.program.noResize) win.setAttribute("noresize", "");
  win.setAttribute("os-id", this.id);

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

  win.style.top =
    _("active-area").offsetHeight / 2 - win.offsetHeight / 2 + "px";
  win.style.left =
    _("active-area").offsetWidth / 2 - win.offsetWidth / 2 + "px";

  this.offscreen = function () {
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
    _this.content.style.height = _this.window.offsetHeight - 20 + "px";
  });

  try {
    this.program.eval(this.window, pass);
  } catch (e) {
    this.content.innerHTML = "Error.";
  }

  WINDOWS.push(this);
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
