// Get references to DOM elements
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const fpsRange = document.getElementById("fpsRange");
const fpsValue = document.getElementById("fpsValue");
const playButton = document.getElementById("playButton");
const ruleStr = document.getElementById("ruleStr");
const initButton = document.getElementById("init");
const changeRuleButton = document.getElementById("ruleChange");
const kernelInputGrid = document.getElementById('kernelInputGrid');

// Default frames per second
let fps = parseInt(fpsRange.value);
// Holds the setInterval reference
let animationInterval = null;

// CELLULAR AUTOMATA
const WIDTH = 100;
const HEIGHT = 100;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;
const ORDER = 2;
const LENGTH = Math.pow(ORDER, 5);
let rule = null;
let prev_frame = null;
let kernel = [];

function initSim() {
  rule = probabilisticNaryCounter(LENGTH, ORDER);
  prev_frame = new Array(WIDTH * HEIGHT).fill(1);
  // ruleLabel.textContent = rule.toString();
  ruleStr.value = rule.toString();

  kernelInputGrid.innerHTML = '';

  // Number of rows and columns
  const rows = 5;
  const cols = 5;

  // Create the grid buttons
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const button = document.createElement('div');
      button.classList.add('kernel-grid-button');
      button.dataset.row = row;
      button.dataset.col = col;

      // Add a click event listener to each button
      button.addEventListener('click', () => {
        // Toggle the active class
        button.classList.toggle('active');
      });

      // Add the button to the grid container
      kernelInputGrid.appendChild(button);
    }
  }
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

function kernel_index(h, w) {
    h = ((h % HEIGHT) + HEIGHT) % HEIGHT;
    w = ((w % WIDTH) + WIDTH) % WIDTH;
    return h * HEIGHT + w;
}


// This function updates the scene (e.g., positions of shapes, game logic, etc.)
function update() {
  next_frame = Array.from(prev_frame);

  console.log(kernel);
  for (let h = 0; h < HEIGHT; h++) {
    for (let w = 0; w < WIDTH; w++) {
      let cell_values = [];
      for (let k = 0; k < kernel.length; k++) {
        let k_index = kernel_index(h + kernel[k][0] - 2, w + kernel[k][1] - 2);

        cell_values.push(prev_frame[k_index]);
      }

      next_frame[flat_index(h, w)] = rule[ca_index(...cell_values)];
    }
  }


  // let a = 0;
  // let b = 0;
  // let c = 0;
  // let d = 0;
  // let e = 0;
  // next_frame = Array.from(prev_frame);

  // for (let h = 0; h < HEIGHT; h++) {
  //   for (let w = 0; w < WIDTH; w++) {
  //     // |   x   |(h-1,w)|   x   |
  //     // |(h,w-1)| (h,w) |(h,w+1)|
  //     // |   x   |(h+1,w)|   x   |

  //     a = prev_frame[kernel_index(h-1, w)];
  //     b = prev_frame[kernel_index(h, w-1)];
  //     c = prev_frame[kernel_index(h, w)];
  //     d = prev_frame[kernel_index(h, w+1)];
  //     e = prev_frame[kernel_index(h+1, w)];
  //     next_frame[flat_index(h, w)] = rule[ca_index(a, b, c, d, e)];
  //   }
  // }

  prev_frame = next_frame;
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

////////////////////
// EVENT HANDLERS //
////////////////////
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

changeRuleButton.addEventListener("click", () => {
    let newRule = ruleStr.value;
    rule = newRule.split(',').map(Number);
    kernel = [];

    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 5; row++) {
        const button = document.querySelector(`.kernel-grid-button[data-row="${row}"][data-col="${col}"]`);
        
        if (button.classList.contains('active'))
          kernel.push([row, col]);
      }
    }
});

canvas.addEventListener("click", (event) => {
  // Get the bounding rectangle of the canvas
  const rect = canvas.getBoundingClientRect();

  // Calculate mouse coordinates relative to the canvas
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Scale the coordinates based on the canvas's intrinsic vs. rendered size
  const scaleX = canvas.width / rect.width; // Intrinsic width / Rendered width
  const scaleY = canvas.height / rect.height; // Intrinsic height / Rendered height

  // Adjust the coordinates to match the canvas's intrinsic size
  const mapped_x = Math.floor(x * scaleX);
  const mapped_y = Math.floor(y * scaleY);

  prev_frame[flat_index(mapped_y, mapped_x)] = 0;
  draw();
});

//////////////////////////////
// INITIATE MAIN EVENT LOOP //
//////////////////////////////
initSim();
// Kick off the initial animation
restartAnimation();
