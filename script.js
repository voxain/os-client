// script.js
// Author: Meow Developers
// Copyright Meow Developers

const meowos = {
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

// Cool Error Handler Script
// Provided by Yours Truly, TCG
// Version 1.0.0.0
// Modified 12/24/2020

meowos.ErrorHandler = function (
  location = "SYSTEM",
  error,
  reportToDevs = false
) {
  var errorData = error.message ? error.message : error;
  if (error.stack) errorData += `\nStacktrace: ${error.stack}`;
  document.body.innerHTML =
    "<style>" +
    "html, body { width: 100%; height: 100%; }" +
    "#errorDiv {  position: absolute; width: 100%; height: 100%; font-family: Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif; font-size: 20px; color: #23272A; /* color: #2C2F33; */ background-color: #FF9100; top: 0; left: 0; }" +
    "#errorDiv span { font-size: 26px; /* color: #E91E63; */ }" +
    "#errorDiv span#stop { font-size: 22px; }" +
    "#errorDiv p#reported { display: none; }" +
    "</style>" +
    "<div id='errorDiv'>" +
    "<span>A fatal error has occurred and MeowOS has stopped execution.</span>" +
    "<p><span id='stop'>STOP Code: </span><span>" +
    errorData.split("\n")[0] +
    '</span><br><br>In order to continue using MeowOS, you will need to <a href="javascript:window.location.reload()">reload the page</a>. Any progress on or within programs may have been lost.</p>' +
    "<br><p id='reported'>This incident has been reported to the MeowOS Developers.</p>" +
    "</div>";
  meowos.log("X", location, errorData);

  if (reportToDevs) {
    // TODO: Report to the damn developers or something...
    // ~ TCG 12/24/2020

    document.getElementById("reported").style.display = "show";
  }
  meowos.error = true;
};

// Cool Logging Script
// Also provided by Yours Truly, TCG
// Version 1.0.0.0
// Modified 12/23/2020

meowos.log = function (type, location, message) {
  // This is crappy code
  var loggingcolors = meowos.system.loggingcolors,
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
  else if (location == "PROGRAM LOADER")
    locationcolor = loggingcolors.FgMagenta;

  console.log(
    `(${typecolor}${type}${loggingcolors.Reset}) [${locationcolor}${location}${loggingcolors.Reset}] ${message}`
  );
};

let requiredToLoad = 3; // set initial load requirement

window.onload = function () {
  meowos.log(
    "i",
    "SYSTEM",
    `MeowOS v${meowos.system.version} is now loading...`
  );
  loaded++;
};
setTimeout(function () {
  loaded++;
}, 3000); //TODO: remove this + decrement requiredToLoad

let storedUsername = localStorage.getItem("usernameStore");
if (storedUsername) _("overlay-login-username").value = storedUsername;
let storedPassword = localStorage.getItem("passwordStore");
if (storedPassword) {
  _("overlay-login-password").value = storedPassword;
  _("remember-password").click();
}
_("overlay-login-username").select();

let ONLOAD = function () {
  if (loaded !== requiredToLoad) return;
  if (!Auth.token) return;

  clearInterval(ONLOADINT);

  if (meowos.error) return;

  meowos.log("S", "SYSTEM", `MeowOS v${meowos.system.version} has loaded!`);

  document.getElementsByTagName("title")[0].innerHTML =
    "MeowOS | v" + meowos.system.version;

  document.onclick = function (e) {
    if (e.target.id !== "context-menu")
      _("context-menu").style.display = "none";
  };
  document.oncontextmenu = function (e) {
    if (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") return;
    e.preventDefault();
    let menu = _("context-menu");
    menu.style.top = e.clientY + "px";
    menu.style.left = e.clientX + "px";
  }; //TODO: API for this

  SetPrograms();
  LoadWindows();
  setInterval(SaveWindows, 3000); //TODO: make this save when windows are moved (prevents API spam)

  _("taskbar-button").onclick = function () {
    if (_("taskbar-menu").style.display == "block") {
      _("taskbar-menu").style.display = "none";
    } else {
      _("taskbar-menu").style.display = "block";
    }
  }; //TODO: hide menu when clicked outside of it

  setInterval(function () {
    if (meowos.error) return;

    let date = new Date();
    let clockTime =
      date.toLocaleTimeString() + "<br>" + date.toLocaleDateString();
    _("taskbar-clock").innerHTML = clockTime;
  }, 500);

  // Detect if windows are off-screen and move them into the screen.
  setInterval(function () {
    if (meowos.error) return;

    WINDOWS.forEach((W) => {
      if (W.offscreen()) {
        W.window.style.top = "0px";
        W.window.style.left = "0px";
      }
    });
  }, 1000);
};

let ONLOADINT = setInterval(ONLOAD);
