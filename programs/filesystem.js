new Program(
  "filesystem",
  (win) => {
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
          data.innerHTML = "..";
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
              let fContentWindow = new Window(f.path, "html");
              fContentWindow.content.innerHTML = f.content;
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
