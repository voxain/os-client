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
