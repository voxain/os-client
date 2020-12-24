let requiredToLoad = 3;

let programsInstalled = [
  "html",
  "calculator",
  "filesystem",
  "codemirror",
  "test",
];
requiredToLoad += programsInstalled.length;
programsInstalled.forEach((p) => {
  $.get(`${APIURL}programs/${p}`, function (program) {
    let css = program.style || "";
    if (css) {
      let style = document.createElement("style");
      style.innerHTML = css;
      style.setAttribute("os-for-program", p);
      document.head.appendChild(style);
    }

    let html = program.html || "";
    window[`program-html-${p}`] = html;

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
}, 3000);

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
  let ver = "0.1.0";
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
  };

  SetPrograms();
  LoadWindows();
  setInterval(SaveWindows, 5000);

  _("taskbar-button").onclick = function () {
    if (_("taskbar-menu").style.display == "block") {
      _("taskbar-menu").style.display = "none";
    } else {
      _("taskbar-menu").style.display = "block";
    }
  };

  setInterval(function () {
    let date = new Date();
    let clockTime =
      date.toLocaleTimeString() + "<br>" + date.toLocaleDateString();
    _("taskbar-clock").innerHTML = clockTime;
  }, 500);

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
