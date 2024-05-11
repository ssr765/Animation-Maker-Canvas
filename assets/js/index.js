const previousFrameArea = document.getElementById("previous-frame");
const canvasArea = document.querySelector(".canvas-area");
const inputSize = document.getElementById("size");
const colorButton = document.querySelector("#color > div");
const colorInput = document.getElementById("color-input");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const titleNumber = document.getElementById("number");
const turtleButton = document.getElementById("slow");
const catButton = document.getElementById("normal");
const rabbitButton = document.getElementById("fast");
const frames = [];

const cooldown = 2;

let actualFrame = 0;
let actualCanvas = document.querySelector("canvas");
let ctx = actualCanvas.getContext("2d");
let x = 0;
let y = 0;
let color = "black";
let click = false;
let size = 10;
let inCooldown = false;
let playingInterval;
let speed = 200;

const initCanvas = (canvas) => {
  frames.push(canvas);
  canvas.getContext("2d").fillStyle = color;

  canvas.addEventListener("mousemove", (event) => {
    prev_x = x;
    prev_y = y;
    x = event.offsetX;
    y = event.offsetY;

    if (click) {
      if (!inCooldown) {
        drawDot(x, y);
        if (Math.abs(prev_x - x) > size / 3 || Math.abs(prev_y - y) > size / 3) {
          trace(prev_x, prev_y);
        }
        inCooldown = true;
        setTimeout(() => {
          inCooldown = false;
        }, cooldown);
      }
    }
  });

  canvas.addEventListener("mousedown", () => {
    ctx = canvas.getContext("2d");
    drawDot(x, y);
  });
};

initCanvas(actualCanvas);

addEventListener("mousedown", () => {
  click = true;
});

addEventListener("mouseup", () => {
  click = false;
});

inputSize.addEventListener("input", () => {
  if (inputSize.value.match(/^\d*$/)) {
    size = inputSize.value;
  } else {
    inputSize.value = size;
  }
});

colorInput.addEventListener("input", () => {
  color = colorInput.value;
  ctx.fillStyle = color;
  colorButton.style.backgroundColor = color;
});

const trace = (prev_x, prev_y) => {
  for (let i = 1; i <= 1000; i++) {
    dot_x = prev_x + (i * (x - prev_x)) / (1000 + 1);
    dot_y = prev_y + (i * (y - prev_y)) / (1000 + 1);

    drawDot(dot_x, dot_y);
  }
};

const drawDot = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
};

const changeSize = (decrement = false) => {
  const value = decrement ? -5 : 5;
  const result = Number(inputSize.value) + value;

  if (result != NaN) {
    if (result > 0) {
      inputSize.value = result;
      size = result;
    } else {
      inputSize.value = 1;
      size = 1;
    }
  }
};

const addCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  initCanvas(canvas);
  canvasArea.appendChild(canvas);

  actualCanvas.remove();
  actualCanvas = canvas;
  actualFrame++;

  if (previousFrameArea.firstElementChild) previousFrameArea.firstElementChild.remove();
  previousFrameArea.append(frames[actualFrame - 1]);
  titleUpdate();
};

const changeCanvas = (decrement = false) => {
  const value = decrement ? -1 : 1;
  actualFrame += value;

  actualCanvas.remove();
  actualCanvas = frames[actualFrame];
  canvasArea.appendChild(actualCanvas);

  if (actualFrame != 0) {
    if (previousFrameArea.firstElementChild) previousFrameArea.firstElementChild.remove();
    previousFrameArea.append(frames[actualFrame - 1]);
  }

  actualCanvas.getContext("2d").fillStyle = color;
  titleUpdate();
};

const goTo = (mode) => {
  const value = mode == "start" ? 0 : frames.length - 1;
  actualFrame = value;

  actualCanvas.remove();
  actualCanvas = frames[actualFrame];
  canvasArea.appendChild(actualCanvas);
  titleUpdate();
};

const playAnimation = () => {
  playButton.style.display = "none";
  pauseButton.style.display = "block";
  playingInterval = setInterval(() => {
    if (actualFrame + 1 == frames.length) {
      actualFrame = 0;
    } else {
      actualFrame++;
    }

    actualCanvas.remove();
    actualCanvas = frames[actualFrame];
    console.log(actualFrame);
    console.log(actualCanvas);
    canvasArea.appendChild(actualCanvas);
    titleUpdate();
  }, speed);
};

const pauseAnimation = () => {
  pauseButton.style.display = "none";
  playButton.style.display = "block";
  clearInterval(playingInterval);
};

setInterval(() => {
  if (frames.length == 1) {
    leftButton.disabled = true;
    rightButton.disabled = true;
  } else {
    if (actualFrame == 0) {
      rightButton.disabled = false;
      leftButton.disabled = true;
    } else if (actualFrame + 1 == frames.length) {
      leftButton.disabled = false;
      rightButton.disabled = true;
    } else {
      leftButton.disabled = false;
      rightButton.disabled = false;
    }
  }
});

const titleUpdate = () => {
  titleNumber.innerText = `${actualFrame + 1}/${frames.length}`;
};

const download = () => {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: "assets/lib/gif.worker.js",
  });

  frames.forEach((frame) => {
    const exportFrame = document.createElement("canvas");
    const ctx = exportFrame.getContext("2d");
    exportFrame.width = frame.width;
    exportFrame.height = frame.height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, exportFrame.width, exportFrame.height);
    ctx.drawImage(frame, 0, 0);
    gif.addFrame(exportFrame, { delay: speed });
  });

  gif.on("finished", function (blob) {
    window.open(URL.createObjectURL(blob));
  });

  gif.render();
};

const changeSpeed = (newSpeed) => {
  speed = newSpeed;
  if (speed == 50) {
    turtleButton.classList.remove("selected-speed");
    catButton.classList.remove("selected-speed");
    rabbitButton.classList.add("selected-speed");
  }
  if (speed == 200) {
    turtleButton.classList.remove("selected-speed");
    catButton.classList.add("selected-speed");
    rabbitButton.classList.remove("selected-speed");
  }
  if (speed == 500) {
    turtleButton.classList.add("selected-speed");
    catButton.classList.remove("selected-speed");
    rabbitButton.classList.remove("selected-speed");
  }
};
