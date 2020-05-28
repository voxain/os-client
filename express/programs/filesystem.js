let filesystem = new Program(
  "filesystem",
  win => {
    let content = win.querySelector(".window-content");
    content.style["padding-top"] = "1px";
    content.style.overflow = "auto";

    let fileList = document.createElement("div");
    fileList.className = "file-list";
    content.appendChild(fileList);

    let fileContent = document.createElement("div");
    fileContent.className = "file-content";
    fileContent.innerHTML = `Error`;
    content.appendChild(fileContent);

    let files = [
      {
        path: "/err.txt",
        content: "An error occured loading the files!"
      }
    ];

    // https://icons8.com/icon/pack/files/material--black

    function setFiles(fs, backButton) {
      document.querySelectorAll(".file-list").forEach(list => {
        let grey = false;
        list.innerHTML = "";
        list.id = "";

        if (backButton) {
          let back = document.createElement("button");
          back.innerHTML = "Back";
          back.onclick = function() {
            socket.emit("fetchFiles", {
              username: "dev",
              password: "MeowOS",
              path: fs[0].path
                .split("/")
                .slice(0, fs[0].path.split("/").length - 2)
                .join("/")
            });
          };
          list.appendChild(back);
        }

        fs.sort();
        fs.sort(function(a, b) {
          return a.path.includes(".") * 1 - b.path.includes(".") * 1;
        });
        fs.forEach(f => {
          let info = document.createElement("div");
          info.className = "file";
          if (grey) info.style["background-color"] = "#f9f9f9";
          info.style.cursor = "pointer";

          info.onclick = function() {
            if (!f.path.includes(".")) {
              list.id = "FETCHING";
              socket.emit("fetchFiles", {
                username: "dev",
                password: "MeowOS",
                path: f.path.substring(1)
              });
              console.log(f.path.substring(1));
              list.innerHTML = "Loading...";
            } else {
              let fContentWindow = new Window(f.path, "html");
              fContentWindow.content.innerHTML = f.content;
            }
          };

          let icon = document.createElement("img");
          if (f.path == "/.credentials") {
            icon.src = "./file-policy.png";
          } else if (!f.path.includes(".")) {
            icon.src = "./folder.png";
          } else {
            icon.src = "./EXT." + f.path.split(".").pop() + ".png";
          }
          icon.className = "file-icon";

          let data = document.createElement("span");
          data.innerHTML = f.path;

          info.appendChild(icon);
          info.appendChild(data);
          list.appendChild(info);

          grey = !grey;
        });
      });
    }
    setFiles(files);

    socket.emit("fetchFiles", { username: "dev", password: "MeowOS" });
    /*socket.emit("writeFile", {
    auth: { username: "dev", password: "MeowOS" },
    path: "/file.txt",
    content: "Test: " + Date.now()
  });*/

    socket.on("receiveFiles", f => {
      console.log(f);
      if (f.error) return;
      setFiles(f.files, f.files[0].path.replace("/", "").includes("/"));
    });
  },
  {
    formattedName: "Files",
    icon: "https://img.icons8.com/fluent/48/000000/program.png",
    defaultTitle: "dev - Files"
  }
);