MeowOS.ErrorHandler = function (location = "SYSTEM", error, reportToDevs = false) {
  var errorData = error.message ? error.message : error;
  if (error.stack || error.stacktrace)
    errorData += `\nStacktrace: ${error.stack ? error.stack : error.stacktrace}`;
  document.body.innerHTML = `
    <style>
      html, body { width: 100%; height: 100%; }
      #errorDiv {  position: absolute; width: 100%; height: 100%; font-family: Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif; font-size: 20px; color: #23272A; /* color: #2C2F33; */ background-color: #FF9100; top: 0; left: 0; }
      #errorDiv span { font-size: 26px; /* color: #E91E63; */ }
      #errorDiv span#stop { font-size: 22px; }
      #errorDiv p#reported { display: none; }
    </style>
    <div id="errorDiv">
      <span>A fatal error has occurred and MeowOS has stopped execution.</span>
      <p>
        <span id="stop">STOP Error: </span>
        <span>${errorData.split("\n")[0]}</span>
        <br><br>
        In order to continue using MeowOS, you will need to <a href="javascript:window.location.reload()">reload the page</a>. Any progress on or within programs may be lost.
      </p>
      <br>
      <p id="reported">This incident has been reported to the MeowOS Developers.</p>
    </div>
  `;
  MeowOS.log("X", location, errorData);

  if (reportToDevs) {
    // TODO: Report to the damn developers or something...
    // ~ TCG 12/24/2020

    document.getElementById("reported").style.display = "show";
  }
  MeowOS.error = true;
};
