/**
 * Initializes ("installs") a program
 * @constructor
 * @param {String} name - The UNIQUE name of the program.
 * @param {Function} func - The function to evaluate when the program is run.
 */
let Program = function (name, func) {
  // Currently only "official" programs are supported.
  $.get(`${APIURL}programs/${name}`, function (program) {
    let options = program.meta;

    this.program = {
      eval: func,
      name: name.toLowerCase(),
      icon: options.icon,
      formattedName: options.formattedName,
      defaultTitle: options.defaultTitle,
      defaultWidth: options.defaultWidth || "",
      defaultHeight: options.defaultHeight || "",
      minWidth: options.minWidth || "",
      minHeight: options.minHeight || "",
      noResize: options.noResize || false,
      hidden: options.hidden || false,
      fullOptions: options,
    };
    ProgramList[name.toLowerCase()] = this.program;
    SetPrograms();
  });
};
