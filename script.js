/*
 * script.js
 * Author: Meow Developers
 * Copyright Meow Developers
 */

let requiredToLoad = 3; // set initial load requirement

window.onload = function () {
  MeowOS.log("i", "SYSTEM", `MeowOS v${MeowOS.system.version} is now loading...`);
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

  if (MeowOS.error) return;

  MeowOS.log("S", "SYSTEM", `MeowOS v${MeowOS.system.version} has loaded!`);

  document.getElementsByTagName("title")[0].innerHTML = "MeowOS | v" + MeowOS.system.version;

  document.onclick = function (e) {
    if (MeowOS.error) return;

    if (e.target.id !== "context-menu") _("context-menu").style.display = "none";
    if (e.target.id !== "taskbar-menu" && e.target.parentElement.id !== "taskbar-button")
      _("taskbar-menu").style.display = "none";
  };
  document.oncontextmenu = function (e) {
    if (MeowOS.error) return;

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
    if (MeowOS.error) return;

    if (_("taskbar-menu").style.display == "block") {
      _("taskbar-menu").style.display = "none";
    } else {
      _("taskbar-menu").style.display = "block";
    }
  }; //TODO: hide menu when clicked outside of it

  setInterval(function () {
    if (MeowOS.error) return;

    let date = new Date();
    let clockTime = date.toLocaleTimeString() + "<br>" + date.toLocaleDateString();
    _("taskbar-clock").innerHTML = clockTime;
  }, 500);

  // Detect if windows are off-screen and move them into the screen.
  setInterval(function () {
    if (MeowOS.error) return;

    WINDOWS.forEach((W) => {
      if (W.offscreen()) {
        W.window.style.top = "0px";
        W.window.style.left = "0px";
      }
    });
  }, 1000);
};

let ONLOADINT = setInterval(ONLOAD);
