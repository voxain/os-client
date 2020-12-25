/*
 * script.js
 * Author: Meow Developers
 * Copyright Meow Developers
 */

window.onload = function () {
  MeowOS.log("i", "SYSTEM", `MeowOS v${MeowOS.system.version} is now loading...`);
};

let ONLOAD = function () {
  if (!Auth.token) return;
  clearInterval(ONLOADINT);
  if (MeowOS.error) return;
  MeowOS.loaded = true;

  MeowOS.log("S", "SYSTEM", `MeowOS v${MeowOS.system.version} has loaded!`);

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
};

let ONLOADINT = setInterval(ONLOAD);