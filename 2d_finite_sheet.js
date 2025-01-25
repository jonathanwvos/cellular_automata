// Get references to our DOM elements
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const fpsRange = document.getElementById("fpsRange");
const fpsValue = document.getElementById("fpsValue");
const playButton = document.getElementById("playButton");
const ruleLabel = document.getElementById("ruleLabel");
const initButton = document.getElementById("init");

// Default frames per second
let fps = parseInt(fpsRange.value);
// Holds the setInterval reference
let animationInterval = null;

// CELLULAR AUTOMATA
const WIDTH = 1000;
const HEIGHT = 1000;
const ORDER = 2;
const LENGTH = Math.pow(ORDER, 5);
let rule = null;
let prev_frame = null;
// let rule = probabilisticNaryCounter(LENGTH, ORDER);

// prev_frame = new Array(WIDTH * HEIGHT).fill(1);
// prev_frame[HEIGHT / 2 + WIDTH / 2] = ORDER - 1;

function initSim() {
  rule = probabilisticNaryCounter(LENGTH, ORDER);
  prev_frame = new Array(WIDTH * HEIGHT).fill(1);
  ruleLabel.textContent = rule.toString();
}

function probabilisticNaryCounter(length, num) {
  return Array.from({ length }, () => Math.floor(Math.random() * num));
}

function ca_index(a, b, c, d, e) {
  return a + b * ORDER + c * ORDER ** 2 + d * ORDER ** 3 + e * ORDER ** 4;
}

function flat_index(h, w) {
  return h * HEIGHT + w;
}

function a_index(h, w) {
  return (h - 1) * HEIGHT + w;
}

function b_index(h, w) {
  return h * HEIGHT + w - 1;
}

function c_index(h, w) {
  return h * HEIGHT + w;
}

function d_index(h, w) {
  return h * HEIGHT + w + 1;
}

function e_index(h, w) {
  return (h + 1) * HEIGHT + w;
}

// This function updates the scene (e.g., positions of shapes, game logic, etc.)
function update() {
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;
  next_frame = Array.from(prev_frame);

  // h=0
  // w=0
  // |c|d|
  // |e|x|
  c = prev_frame[c_index(0, 0)];
  d = prev_frame[d_index(0, 0)];
  e = prev_frame[e_index(0, 0)];
  // next_frame[flat_index(0, 0)] = rule[ca_index(0, 0, c, d, e)];
  next_frame[flat_index(0, 0)] = rule[ca_index(c, d, e, 0, 0)];

  // CASE H0:
  // h=0
  // 0<w<WIDTH-1
  // |b|c|d|
  // |x|e|x|
  //
  // CASE H1:
  // h=HEIGHT-1
  // 0<w<WIDTH-1
  // |x|a|x|
  // |b|c|d|
  for (let w = 1; w < WIDTH - 1; w++) {
    b_h0 = prev_frame[b_index(0, w)];
    c_h0 = prev_frame[c_index(0, w)];
    d_h0 = prev_frame[d_index(0, w)];
    e_h0 = prev_frame[e_index(0, w)];
    a_h1 = prev_frame[a_index(HEIGHT - 1, w)];
    b_h1 = prev_frame[b_index(HEIGHT - 1, w)];
    c_h1 = prev_frame[c_index(HEIGHT - 1, w)];
    d_h1 = prev_frame[d_index(HEIGHT - 1, w)];
    next_frame[flat_index(0, w)] = rule[ca_index(0, b_h0, c_h0, d_h0, e_h0)];
    next_frame[flat_index(HEIGHT - 1, w)] =
      rule[ca_index(a_h1, b_h1, c_h1, d_h1, 0)];
  }

  // h=0
  // w=WIDTH-1
  // |b|c|
  // |x|e|
  b = prev_frame[b_index(0, WIDTH - 1)];
  c = prev_frame[c_index(0, WIDTH - 1)];
  e = prev_frame[e_index(0, WIDTH - 1)];
  next_frame[flat_index(0, WIDTH - 1)] = rule[ca_index(0, b, c, 0, e)];

  // CASE W0:
  // 0<h<HEIGHT-1
  // w=0
  // |a|x|
  // |c|d|
  // |e|x|
  //
  // CASE W1:
  // 0<h<HEIGHT-1
  // w=WIDTH-1
  // |x|a|
  // |b|c|
  // |x|e|
  for (let h = 1; h < HEIGHT - 1; h++) {
    a_w0 = prev_frame[a_index(h, 0)];
    c_w0 = prev_frame[c_index(h, 0)];
    d_w0 = prev_frame[d_index(h, 0)];
    e_w0 = prev_frame[e_index(h, 0)];
    a_w1 = prev_frame[a_index(h, WIDTH - 1)];
    b_w1 = prev_frame[b_index(h, WIDTH - 1)];
    c_w1 = prev_frame[c_index(h, WIDTH - 1)];
    e_w1 = prev_frame[e_index(h, WIDTH - 1)];
    next_frame[flat_index(h, 0)] = rule[ca_index(a_w0, 0, c_w0, d_w0, e_w0)];
    next_frame[flat_index(h, WIDTH - 1)] =
      rule[ca_index(a_w1, b_w1, c_w1, 0, e_w1)];
  }

  // 0<h<HEIGHT-1
  // 0<w<WIDTH-1
  // |x|a|x|
  // |b|c|d|
  // |x|e|x|
  for (let h = 1; h < HEIGHT - 1; h++) {
    for (let w = 1; w < WIDTH - 1; w++) {
      // |   x   |(h-1,w)|   x   |
      // |(h,w-1)| (h,w) |(h,w+1)|
      // |   x   |(h+1,w)|   x   |

      a = prev_frame[a_index(h, w)];
      b = prev_frame[b_index(h, w)];
      c = prev_frame[c_index(h, w)];
      d = prev_frame[d_index(h, w)];
      e = prev_frame[e_index(h, w)];
      next_frame[flat_index(h, w)] = rule[ca_index(a, b, c, d, e)];
    }
  }

  // h=HEIGHT-1
  // w=0
  // |a|x|
  // |c|d|
  a = prev_frame[a_index(HEIGHT - 1, 0)];
  c = prev_frame[c_index(HEIGHT - 1, 0)];
  d = prev_frame[d_index(HEIGHT - 1, 0)];
  next_frame[flat_index(HEIGHT - 1, 0)] = rule[ca_index(a, 0, c, d, 0)];

  // h=HEIGHT-1
  // w=WIDTH-1
  // |x|a|
  // |b|c|
  a = prev_frame[a_index(HEIGHT - 1, WIDTH - 1)];
  b = prev_frame[b_index(HEIGHT - 1, WIDTH - 1)];
  c = prev_frame[c_index(HEIGHT - 1, WIDTH - 1)];
  next_frame[flat_index(HEIGHT - 1, WIDTH - 1)] = rule[ca_index(a, b, c, 0, 0)];

  prev_frame = next_frame;
}

// Draw a grid across the entire canvas
function drawGrid() {
  const gridSize = 10; // adjust this to make bigger or smaller cells

  ctx.save();
  ctx.strokeStyle = "#888"; // change the color if you like
  ctx.lineWidth = 1;

  // Draw vertical grid lines
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal grid lines
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.restore();
}

// This function draws the content on the canvas
function draw() {
  // Clear the canvas for each new frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Now draw the grid so that it overlays everything
  // drawGrid();

  // Draw Cellular Automata
  const normalized_frame = prev_frame.map(
    (value) => (value / (ORDER - 1)) * 255,
  );

  const imageDataArray = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
  for (let i = 0; i < prev_frame.length; i++) {
    const normalizedValue = normalized_frame[i];
    const pixelIndex = i * 4; // RGBA indices
    imageDataArray[pixelIndex] = normalizedValue; // R
    imageDataArray[pixelIndex + 1] = normalizedValue; // G
    imageDataArray[pixelIndex + 2] = normalizedValue; // B
    imageDataArray[pixelIndex + 3] = 255; // A (fully opaque)
  }

  const imageData = new ImageData(imageDataArray, WIDTH, HEIGHT);
  ctx.putImageData(imageData, 0, 0);
  // ctx.scale(10, 10);
}

// The main animation function which gets called each "frame"
function animate() {
  if (playButton.value == "play") {
    update();
    draw();
  }
}

// Start or restart the animation interval with the specified FPS
function restartAnimation() {
  // Clear any existing interval
  if (animationInterval) {
    clearInterval(animationInterval);
  }

  // Start the new animation loop at the desired FPS
  animationInterval = setInterval(() => {
    animate();
  }, 1000 / fps);
}

// Listen for changes on the range input to update FPS
fpsRange.addEventListener("input", () => {
  fps = parseInt(fpsRange.value);
  fpsValue.textContent = fps;

  restartAnimation(); // Restart animation at new FPS
});

playButton.addEventListener("click", () => {
  if (playButton.value === "play") {
    playButton.textContent = "Play";
    playButton.value = "pause";
  } else {
    playButton.textContent = "Pause";
    playButton.value = "play";
  }
});

initButton.addEventListener("click", () => {
  initSim();
});

initSim();
// Kick off the initial animation
restartAnimation();
