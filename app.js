// Get references to our DOM elements
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const fpsRange = document.getElementById("fpsRange");
const fpsValue = document.getElementById("fpsValue");
// Default frames per second
let fps = parseInt(fpsRange.value);
// Holds the setInterval reference
let animationInterval = null;

// CELLULAR AUTOMATA
const WIDTH = 100;
const HEIGHT = 100;
const ORDER = 3;
const LENGTH = Math.pow(ORDER, 5);
const rule = probabilisticNaryCounter(LENGTH, ORDER);
prev_frame = new Array(WIDTH * HEIGHT).fill(0);
prev_frame[HEIGHT / 2 + WIDTH / 2] = ORDER - 1;

function probabilisticNaryCounter(length, num) {
  return Array.from({ length }, () => Math.floor(Math.random() * num));
}

// This function updates the scene (e.g., positions of shapes, game logic, etc.)
function update() {
  next_frame = Array.from(prev_frame);

  for (let h = 1; h <= HEIGHT - 1; h++) {
    for (let w = 1; w <= WIDTH - 1; w++) {
      let a = prev_frame[(h - 1) * HEIGHT + w];
      let b = prev_frame[h * HEIGHT + w - 1];
      let c = prev_frame[h * HEIGHT + w];
      let d = prev_frame[h * HEIGHT + w + 1];
      let e = prev_frame[(h + 1) * HEIGHT + w];

      let index =
        a + b * ORDER + c * ORDER ** 2 + d * ORDER ** 3 + e * ORDER ** 4;
      next_frame[h * HEIGHT + w] = rule[index];
    }
  }
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
  drawGrid();

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

  // // Draw the random square
  // ctx.fillStyle = "blue";
  // const x = Math.round(Math.random() * (canvas.width - 10));
  // const y = Math.round(Math.random() * (canvas.height - 10));
  // console.log(x, y);
  // ctx.fillRect(x, y, 10, 10);
}

// The main animation function which gets called each "frame"
function animate() {
  update();
  draw();
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

// Kick off the initial animation
restartAnimation();
