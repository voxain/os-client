new Program(
  "filesystem",
  (win) => {
    let content = win.querySelector(".window-content");
    content.style.overflow = "auto";
    content.style.position = "relative";

    let fileList = document.createElement("div");
    fileList.className = "file-list";

    fileList.oncontextmenu = function (e) {
      e.preventDefault();
      if (
        e.target.className !== "file" &&
        e.target.className !== "file-icon" &&
        e.target.className !== "file-path"
      ) {
        let menu = fileList.parentElement.querySelector(".file-contextmenu");
        menu.style.display = "block";
        menu.style.top = e.offsetY + "px";
        menu.style.left = e.offsetX + "px";
        menu.innerHTML = "";

        let menu1 = document.createElement("div");
        menu1.className = "file-contextmenu-button";
        menu1.innerHTML = "New File";
        menu1.onclick = function () {};
        menu.appendChild(menu1);
      } else {
        console.log("ON FILE");
      }
      console.log(e);
    };

    content.appendChild(fileList);

    let menu = document.createElement("div");
    menu.className = "file-contextmenu";
    content.appendChild(menu);

    let files = [
      {
        path: "/err.txt",
        content: "An error occured loading the files!",
      },
    ];

    let receiveFiles = function (f) {
      console.log(f);
      if (f.error) return;
      setFiles(f.files, f.files[0].path.replace("/", "").includes("/"));
    };

    // https://icons8.com/icon/pack/files/material--black

    function setFiles(fs, backButton) {
      document.querySelectorAll(".file-list").forEach((list) => {
        let grey = false;
        list.innerHTML = "";
        list.id = "";

        if (backButton) {
          grey = true;
          let back = document.createElement("div");
          back.className = "file";
          back.style.cursor = "pointer";

          let icon = document.createElement("img");
          icon.src = "./icon/folder.png";
          icon.className = "file-icon";
          back.appendChild(icon);

          let data = document.createElement("span");
          data.className = "file-path";
          data.innerHTML = "←";
          back.appendChild(data);

          back.onclick = function () {
            $.post(
              APIURL + "fetchFiles",
              {
                username: "dev",
                password: "MeowOS",
                path: fs[0].path
                  .split("/")
                  .slice(0, fs[0].path.split("/").length - 2)
                  .join("/"),
              },
              receiveFiles
            );
          };
          list.appendChild(back);
        }

        fs.sort();
        fs.sort(function (a, b) {
          return a.path.includes(".") * 1 - b.path.includes(".") * 1;
        });
        fs.forEach((f) => {
          let info = document.createElement("div");
          info.className = "file";
          if (grey) info.style["background-color"] = "#f1f1f1";
          info.style.cursor = "pointer";

          info.oncontextmenu = function (e) {
            e.preventDefault();
          };

          info.onclick = function () {
            if (!f.path.includes(".")) {
              list.id = "FETCHING";
              $.post(
                APIURL + "fetchFiles",
                {
                  username: "dev",
                  password: "MeowOS",
                  path: f.path.substring(1),
                },
                receiveFiles
              );
              console.log(f.path.substring(1));
              list.innerHTML = "Loading...";
            } else {
              let fContentWindow = new Window(
                f.path + " - CodeMirror",
                "codemirror",
                {
                  value: f.content,
                  fileExt: f.path.split(".").pop(),
                }
              );
            }
          };

          let icon = document.createElement("img");
          if (f.path == "/.credentials") {
            icon.src = "./icon/file-policy.png";
          } else if (!f.path.includes(".")) {
            icon.src = "./icon/folder.png";
          } else {
            icon.src = "./icon/EXT." + f.path.split(".").pop() + ".png";
          }
          icon.className = "file-icon";

          let data = document.createElement("span");
          data.className = "file-path";
          data.innerHTML = f.path;

          info.appendChild(icon);
          info.appendChild(data);
          list.appendChild(info);

          grey = !grey;
        });
      });
    }
    setFiles(files);

    $.post(
      APIURL + "fetchFiles",
      { username: "dev", password: "MeowOS" },
      receiveFiles
    );

    /*
      socket.emit("writeFile", {
        auth: { username: "dev", password: "MeowOS" },
        path: "/file.txt",
        content: "Test: " + Date.now()
      });
    */
  },
  {
    formattedName: "Files",
    icon: "https://img.icons8.com/fluent/48/000000/program.png",
    defaultTitle: "dev - Files",
  }
);
