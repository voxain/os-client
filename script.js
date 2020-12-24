let requiredToLoad = 3; // set initial load requirement

let programsInstalled = [
  // set initial programs installed
  "html",
  "calculator",
  "filesystem",
  "codemirror",
  "test",
]; //TODO: make this dynamic based on installed.syscfg
requiredToLoad += programsInstalled.length;
programsInstalled.forEach((p) => {
  $.get(`${APIURL}programs/${p}`, function (program) {
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

    loaded++;
  });
  console.log(`Loading ${p}...`);
});

window.onload = function () {
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
  let ver = "0.1.0"; //TODO: include proper versioning
  document.getElementsByTagName("title")[0].innerHTML = "LeafletOS v" + ver;

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
    let date = new Date();
    let clockTime =
      date.toLocaleTimeString() + "<br>" + date.toLocaleDateString();
    _("taskbar-clock").innerHTML = clockTime;
  }, 500);

  // Detect if windows are off-screen and move them into the screen.
  setInterval(function () {
    WINDOWS.forEach((W) => {
      if (W.offscreen()) {
        W.window.style.top = "0px";
        W.window.style.left = "0px";
      }
    });
  }, 1000);
};

let ONLOADINT = setInterval(ONLOAD);
