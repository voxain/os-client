MeowOS.log = function (type, location, message) {
  var loggingcolors = MeowOS.system.loggingcolors,
    typecolor = loggingcolors.FgWhite;

  // X = Error
  if (type == "X") typecolor = loggingcolors.FgRed;
  // i = Information
  else if (type == "i") typecolor = loggingcolors.FgBlue;
  // ! = Warning
  else if (type == "!") typecolor = loggingcolors.FgYellow;
  // S = Success
  else if (type == "S") typecolor = loggingcolors.FgGreen;

  var locationcolor = loggingcolors.FgWhite;

  if (location == "SYSTEM") locationcolor = loggingcolors.FgGreen;
  else if (location == "PROGRAM MANAGER") locationcolor = loggingcolors.FgMagenta;

  console.log(
    `(${typecolor}${type}${loggingcolors.Reset}) [${locationcolor}${location}${loggingcolors.Reset}] ${message}`
  );
};
