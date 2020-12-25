const MeowOS = {
  error: false,
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

function AjaxErrorMsg(request, status, error) {
  var message = "NO_ERROR";
  if (request.status === 0 && !window.navigator.onLine) {
    message = "INTERNET_DISCONNECTED";
  } else if (request.status == 404) {
    message = "RESOURCE_NOT_FOUND";
  } else if (request.status == 500) {
    message = "INTERNAL_API_ERROR";
  } else if (status == "timeout") {
    message = `TIMEOUT_REACHED_LOADING_${p.toUpperCase()}`;
  } else if (status == "error") {
    message = "CONNECTION_TO_API_FAILED";
  } else {
    message = status || response.status;
  }
  return message;
}

var _ = function (id) {
  return document.getElementById(id);
}; // "Mini jQuery" function for IDs.
var rand = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
window.WINDOWS = [];
window.APIURL = "https://service-2308.something.gg/"; // set API URL, will need to be changed when official release is out

document.getElementsByTagName("title")[0].innerHTML = "MeowOS v" + MeowOS.system.version;
