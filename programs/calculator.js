let calculator = new Program(
  "calculator",
  (win) => {
    let calcHTML = `
<div class="calc">
  <input class="calc-output" type="textbox">
  <br>
  <button class="calc-button" value="7">7</button>
  <button class="calc-button" value="8">8</button>
  <button class="calc-button" value="9">9</button>
  <button class="calc-button" value="+">+</button>
  <br>
  <button class="calc-button" value="4">4</button>
  <button class="calc-button" value="5">5</button>
  <button class="calc-button" value="6">6</button>
  <button class="calc-button" value="-">-</button>
  <br>
  <button class="calc-button" value="1">1</button>
  <button class="calc-button" value="2">2</button>
  <button class="calc-button" value="3">3</button>
  <button class="calc-button" value="*">×</button>
  <br>
  <button class="calc-button" value="0">0</button>
  <button class="calc-button" value="00">00</button>
  <button class="calc-button" value="000">000</button>
  <button class="calc-button" value="/">÷</button>
  <br>
  <button class="calc-button" value=".">.</button>
  <button class="calc-button" value="c">C</button>
  <button class="calc-button large" value="=">=</button>
</div>`;

    let calcE = new DOMParser().parseFromString(calcHTML, "text/html");

    calcE.querySelectorAll(".calc-button").forEach((b) => {
      b.onclick = function () {
        let result = b.parentElement.parentElement.parentElement.querySelector(
          ".calc-output"
        );
        switch (b.value) {
          case "=":
            let x = result.value;
            let y = eval(x);
            result.value = y;
            break;
          case "c":
            result.value = "";
            break;
          default:
            result.value += b.value;
            break;
        }
      };
    });

    win.querySelector(".window-content").appendChild(calcE.body.firstChild);
  },
  {
    formattedName: "Calculator",
    icon: "https://img.icons8.com/fluent/48/000000/calculator.png",
    defaultTitle: "Calculator",
    defaultWidth: "265px",
    defaultHeight: "390px",
    noResize: true,
  }
);
