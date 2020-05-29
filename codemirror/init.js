let CodeMirrorThemes = [
  "3024-",
  "3024-night",
  "abcdef",
  "ambiance-mobile",
  "ambiance",
  "ayu-dark",
  "ayu-mirage",
  "base16-dark",
  "base16-light",
  "bespin",
  "blackboard",
  "cobalt",
  "colorforth",
  "darcula",
  "dracula",
  "duotone-dark",
  "duotone-light",
  "eclipse",
  "elegant",
  "erlang-dark",
  "gruvbox-dark",
  "hopscotch",
  "icecoder",
  "idea",
  "isotope",
  "lesser-dark",
  "liquibyte",
  "lucario",
  "material-darker",
  "material-ocean",
  "material-palenight",
  "material",
  "mbo",
  "mdn-like",
  "midnight",
  "monokai",
  "moxer",
  "neat",
  "neo",
  "night",
  "nord",
  "oceanic-next",
  "panda-syntax",
  "paraiso-dark",
  "paraiso-light",
  "pastel-on-dark",
  "railscasts",
  "rubyblue",
  "seti",
  "shadowfox",
  "solarized",
  "ssms",
  "the-matrix",
  "tomorrow-night-bright",
  "tomorrow-night-eighties",
  "ttcn",
  "twilight",
  "vibrant-ink",
  "xq-dark",
  "xq-light",
  "yeti",
  "yonce",
  "zenburn",
];
CodeMirrorThemes.forEach((t) => {
  $("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "/codemirror/themes/" + t + ".css",
  }).appendTo("head");
  console.log(`Loading ${t}...`);
});
let CodeMirrorModes = {
  css: "css",
  go: "go",
  htmlmixed: "html",
  javascript: "js",
  lua: "lua",
  markdown: "md",
  php: "php",
  python: "py",
  sql: "sql",
  xml: "xml",
  yaml: "yaml",
};
requiredToLoad += Object.keys(CodeMirrorModes).length;
Object.keys(CodeMirrorModes).forEach((t) => {
  $.getScript("/codemirror/lang/" + t + ".js");
  console.log(`Loading ${t}...`);
});
