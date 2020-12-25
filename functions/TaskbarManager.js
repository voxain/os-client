_("taskbar-button").onclick = function () {
  if (MeowOS.error) return;

  if (_("taskbar-menu").style.display == "block") {
    _("taskbar-menu").style.display = "none";
  } else {
    _("taskbar-menu").style.display = "block";
  }
};

setInterval(function () {
  if (MeowOS.error) return;
  if (!Auth.token) return;

  let date = new Date();
  let clockTime = date.toLocaleTimeString() + "<br>" + date.toLocaleDateString();
  _("taskbar-clock").innerHTML = clockTime;
}, 800);
