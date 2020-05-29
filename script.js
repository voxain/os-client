let requiredToLoad = 3;

let programsInstalled = ["html", "calculator", "filesystem"];
requiredToLoad += programsInstalled.length;
programsInstalled.forEach((p) => {
  $.getScript("/programs/" + p + ".js", function () {
    loaded++;
  });
  $("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "/programs/" + p + ".css",
  }).appendTo("head");
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
  clearInterval(ONLOADINT);
  let ver = "0.0.1";
  document.getElementsByTagName("title")[0].innerHTML = "MeowOS v" + ver;

  document.oncontextmenu = function (e) {
    e.preventDefault();
    let target = e.target;
  };

  Object.keys(ProgramList)
    .sort()
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

  LoadWindows();
  setInterval(SaveWindows, 500);

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
