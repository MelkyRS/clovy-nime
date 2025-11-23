// Genie Tetris - vanilla JS implementation using canvas

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const BOARD_PIXEL_WIDTH = COLS * BLOCK_SIZE;
const BOARD_PIXEL_HEIGHT = ROWS * BLOCK_SIZE;

// Gravity timings per level (approx. frames/seconds per row)
const LEVEL_SPEEDS = [
  1000, // level 1
  800,
  650,
  520,
  430,
  360,
  300,
  260,
  225,
  200,
  180,
  165,
  150,
  135,
  120
];

// Tetromino definitions: 4 rotation states each (0–3)
const TETROMINOES = {
  I: [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 0], [1, 1], [1, 2], [1, 3]]
  ],
  J: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [0, 2], [1, 2]]
  ],
  L: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2]]
  ],
  O: [
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
  ],
  S: [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[1, 1], [2, 1], [0, 2], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2]]
  ],
  T: [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [1, 2]],
    [[1, 0], [0, 1], [1, 1], [1, 2]]
  ],
  Z: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[2, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 0], [0, 1], [1, 1], [0, 2]]
  ]
};

const COLORS = {
  I: '#22d3ee',
  J: '#3b82f6',
  L: '#f97316',
  O: '#eab308',
  S: '#22c55e',
  T: '#a855f7',
  Z: '#ef4444'
};

const GHOST_COLOR = 'rgba(148, 163, 184, 0.45)';

// Utility
function createEmptyBoard() {
  const board = [];
  for (let y = 0; y < ROWS; y++) {
    const row = new Array(COLS).fill(null);
    board.push(row);
  }
  return board;
}

function randomPieceType() {
  const keys = Object.keys(TETROMINOES);
  return keys[Math.floor(Math.random() * keys.length)];
}

// Game state
let board = createEmptyBoard();

let currentPiece = null;
let nextQueue = [];
let holdPieceType = null;
let canHoldThisTurn = true;

let score = 0;
let lines = 0;
let level = 1;

let isRunning = false;
let isPaused = false;
let isGameOver = false;

let lastDropTime = 0;
let lastFrameTime = 0;
let softDropActive = false;

// DOM
const boardCanvas = document.getElementById('board');
const nextCanvas = document.getElementById('next');
const holdCanvas = document.getElementById('hold');

const boardCtx = boardCanvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');
const holdCtx = holdCanvas.getContext('2d');

const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');

const statusText = document.getElementById('status-text');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalPrimary = document.getElementById('modal-primary');

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');

const touchButtons = document.querySelectorAll('.btn.touch');

// Ensure canvas sizes match board constants
boardCanvas.width = BOARD_PIXEL_WIDTH;
boardCanvas.height = BOARD_PIXEL_HEIGHT;

// Core piece helpers
function spawnPiece(type) {
  const rotations = TETROMINOES[type];
  const rotation = 0;
  const cells = rotations[rotation];

  // Spawn near top center
  const minX = Math.min(...cells.map(c => c[0]));
  const maxX = Math.max(...cells.map(c => c[0]));
  const spawnX = Math.floor((COLS - (maxX - minX + 1)) / 2) - minX;

  return {
    type,
    rotation,
    x: spawnX,
    y: -2, // start slightly above the visible board
  };
}

function getCells(piece = currentPiece) {
  const shape = TETROMINOES[piece.type][piece.rotation];
  return shape.map(([dx, dy]) => ({
    x: piece.x + dx,
    y: piece.y + dy
  }));
}

function isValidPosition(piece) {
  const cells = getCells(piece);
  for (const { x, y } of cells) {
    if (x < 0 || x >= COLS || y >= ROWS) return false;
    if (y >= 0 && board[y][x]) return false;
  }
  return true;
}

function lockPiece() {
  const cells = getCells(currentPiece);
  for (const { x, y } of cells) {
    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
      board[y][x] = currentPiece.type;
    }
  }
}

function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== null)) {
      board.splice(y, 1);
      board.unshift(new Array(COLS).fill(null));
      cleared++;
      y++;
    }
  }
  if (cleared > 0) {
    lines += cleared;
    const lineScores = [0, 100, 300, 500, 800];
    score += lineScores[cleared] * level;
    level = 1 + Math.floor(lines / 10);
    if (level > LEVEL_SPEEDS.length) level = LEVEL_SPEEDS.length;
    updateStats();
    flashStatus(cleared === 4 ? 'Tetris!' : `Cleared ${cleared} line${cleared > 1 ? 's' : ''}`);
  }
}

function movePiece(dx, dy) {
  if (!currentPiece) return false;
  const candidate = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
  if (isValidPosition(candidate)) {
    currentPiece = candidate;
    return true;
  }
  return false;
}

function rotatePiece(dir = 1) {
  if (!currentPiece) return;
  const originalRotation = currentPiece.rotation;
  const newRotation = (currentPiece.rotation + dir + 4) % 4;
  const candidate = { ...currentPiece, rotation: newRotation };

  const kicks = [0, -1, 1, -2, 2];
  for (const dx of kicks) {
    const shifted = { ...candidate, x: candidate.x + dx };
    if (isValidPosition(shifted)) {
      currentPiece = shifted;
      return;
    }
  }

  currentPiece.rotation = originalRotation;
}

function hardDrop() {
  if (!currentPiece) return;
  let y = currentPiece.y;
  while (true) {
    const candidate = { ...currentPiece, y: y + 1 };
    if (isValidPosition(candidate)) {
      y++;
    } else {
      break;
    }
  }
  const droppedRows = Math.max(0, y - currentPiece.y);
  if (droppedRows > 0) {
    score += droppedRows * 2;
    currentPiece.y = y;
    updateStats();
  }
  stepDown();
}

function getDropDistance() {
  if (!currentPiece) return 0;
  let distance = 0;
  let testPiece = { ...currentPiece };
  while (true) {
    const candidate = { ...testPiece, y: testPiece.y + 1 };
    if (isValidPosition(candidate)) {
      distance++;
      testPiece = candidate;
    } else {
      break;
    }
  }
  return distance;
}

function stepDown() {
  if (!currentPiece) return;
  const moved = movePiece(0, 1);
  if (!moved) {
    lockPiece();
    clearLines();
    canHoldThisTurn = true;
    spawnNextFromQueue();
    if (currentPiece && !isValidPosition(currentPiece)) {
      onGameOver();
    }
  }
}

function ensureQueueFilled() {
  while (nextQueue.length < 5) {
    const bag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    nextQueue.push(...bag);
  }
}

function spawnNextFromQueue() {
  ensureQueueFilled();
  const type = nextQueue.shift();
  currentPiece = spawnPiece(type);
  ensureQueueFilled();
  drawPreview(nextCtx, nextQueue[0]);
}

function holdCurrent() {
  if (!currentPiece || !canHoldThisTurn) return;
  const currentType = currentPiece.type;
  if (holdPieceType === null) {
    holdPieceType = currentType;
    drawPreview(holdCtx, holdPieceType);
    spawnNextFromQueue();
  } else {
    const temp = holdPieceType;
    holdPieceType = currentType;
    drawPreview(holdCtx, holdPieceType);
    currentPiece = spawnPiece(temp);
  }
  canHoldThisTurn = false;
}

// Drawing
function clearCanvas(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
}

function drawBoard() {
  clearCanvas(boardCtx, boardCanvas.width, boardCanvas.height);

  // Board background
  const gradient = boardCtx.createLinearGradient(0, 0, 0, BOARD_PIXEL_HEIGHT);
  gradient.addColorStop(0, '#020617');
  gradient.addColorStop(0.4, '#020617');
  gradient.addColorStop(1, '#020617');

  boardCtx.fillStyle = gradient;
  boardCtx.fillRect(0, 0, BOARD_PIXEL_WIDTH, BOARD_PIXEL_HEIGHT);

  // Subtle grid
  boardCtx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
  boardCtx.lineWidth = 1;
  for (let x = 0; x <= COLS; x++) {
    boardCtx.beginPath();
    boardCtx.moveTo(x * BLOCK_SIZE + 0.5, 0);
    boardCtx.lineTo(x * BLOCK_SIZE + 0.5, BOARD_PIXEL_HEIGHT);
    boardCtx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    boardCtx.beginPath();
    boardCtx.moveTo(0, y * BLOCK_SIZE + 0.5);
    boardCtx.lineTo(BOARD_PIXEL_WIDTH, y * BLOCK_SIZE + 0.5);
    boardCtx.stroke();
  }

  // Locked cells
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const type = board[y][x];
      if (type) {
        drawBlock(boardCtx, x, y, COLORS[type], false);
      }
    }
  }

  // Ghost piece
  if (currentPiece) {
    const drop = getDropDistance();
    if (drop > 0) {
      const ghost = { ...currentPiece, y: currentPiece.y + drop };
      const ghostCells = getCells(ghost);
      for (const { x, y } of ghostCells) {
        if (y < 0) continue;
        drawBlock(boardCtx, x, y, GHOST_COLOR, true);
      }
    }
  }

  // Active piece
  if (currentPiece) {
    const cells = getCells();
    for (const { x, y } of cells) {
      if (y < 0) continue;
      drawBlock(boardCtx, x, y, COLORS[currentPiece.type], false);
    }
  }
}

function drawBlock(ctx, x, y, color, isGhost) {
  const px = x * BLOCK_SIZE;
  const py = y * BLOCK_SIZE;

  const size = BLOCK_SIZE - 2;
  const offset = 1;

  const r = 6;

  ctx.save();
  ctx.translate(px + offset, py + offset);

  // Base
  const baseColor = isGhost ? color : shadeColor(color, -0.35);
  roundRect(ctx, 0, 0, size, size, r);
  ctx.fillStyle = baseColor;
  ctx.fill();

  // Inner
  if (!isGhost) {
    roundRect(ctx, 3, 3, size - 6, size - 6, r - 2);
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, shadeColor(color, 0.32));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, shadeColor(color, -0.15));
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Rim
  ctx.lineWidth = isGhost ? 1 : 1.2;
  ctx.strokeStyle = isGhost ? 'rgba(148, 163, 184, 0.9)' : 'rgba(15, 23, 42, 0.95)';
  roundRect(ctx, 0.5, 0.5, size - 1, size - 1, r);
  ctx.stroke();

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function shadeColor(col, percent) {
  const num = parseInt(col.slice(1), 16);
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * percent);
  let b = (num & 0x0000ff) + Math.round(255 * percent);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawPreview(ctx, type) {
  clearCanvas(ctx, ctx.canvas.width, ctx.canvas.height);

  if (!type) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return;
  }

  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const shape = TETROMINOES[type][0];

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of shape) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  const cellSize = Math.min(
    (ctx.canvas.width - 16) / width,
    (ctx.canvas.height - 16) / height
  );

  const offsetX = (ctx.canvas.width - width * cellSize) / 2;
  const offsetY = (ctx.canvas.height - height * cellSize) / 2;

  for (const [x, y] of shape) {
    const px = offsetX + (x - minX) * cellSize;
    const py = offsetY + (y - minY) * cellSize;

    const size = cellSize - 2;
    const r = 4;

    ctx.save();
    ctx.translate(px + 1, py + 1);

    const color = COLORS[type];
    const baseColor = shadeColor(color, -0.35);

    roundRect(ctx, 0, 0, size, size, r);
    ctx.fillStyle = baseColor;
    ctx.fill();

    roundRect(ctx, 2, 2, size - 4, size - 4, r - 1);
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, shadeColor(color, 0.32));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, shadeColor(color, -0.15));
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.95)';
    roundRect(ctx, 0.5, 0.5, size - 1, size - 1, r);
    ctx.stroke();

    ctx.restore();
  }
}

// Status / UI
let statusTimeoutId = null;
function flashStatus(text) {
  if (!statusText) return;
  statusText.textContent = text;
  statusText.classList.add('status-visible');
  if (statusTimeoutId) window.clearTimeout(statusTimeoutId);
  statusTimeoutId = window.setTimeout(() => {
    statusText.classList.remove('status-visible');
  }, 900);
}

function updateStats() {
  scoreEl.textContent = score.toString();
  linesEl.textContent = lines.toString();
  levelEl.textContent = level.toString();
}

// Game lifecycle
function resetGameState() {
  board = createEmptyBoard();
  currentPiece = null;
  nextQueue = [];
  holdPieceType = null;
  canHoldThisTurn = true;

  score = 0;
  lines = 0;
  level = 1;

  isRunning = false;
  isPaused = false;
  isGameOver = false;

  lastDropTime = 0;
  lastFrameTime = 0;
  softDropActive = false;

  updateStats();
  clearCanvas(nextCtx, nextCanvas.width, nextCanvas.height);
  clearCanvas(holdCtx, holdCanvas.width, holdCanvas.height);
  drawBoard();
}

function startNewGame() {
  resetGameState();
  ensureQueueFilled();
  spawnNextFromQueue();
  isRunning = true;
  isPaused = false;
  isGameOver = false;
  modalBackdrop.hidden = true;
  flashStatus('Good luck');
  requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (!isRunning || isGameOver) return;
  isPaused = !isPaused;
  btnPause.textContent = isPaused ? 'Resume' : 'Pause';
  if (isPaused) {
    flashStatus('Paused');
  } else {
    flashStatus('Resume');
    requestAnimationFrame(gameLoop);
  }
}

function onGameOver() {
  isGameOver = true;
  isRunning = false;
  isPaused = false;
  showGameOverModal();
}

function showGameOverModal() {
  modalTitle.textContent = 'Game Over';
  modalMessage.textContent = `Score: ${score} • Lines: ${lines} • Level: ${level}`;
  modalPrimary.textContent = 'Play again';
  modalBackdrop.hidden = false;
}

function showStartModal() {
  modalTitle.textContent = 'Genie Tetris';
  modalMessage.textContent = 'Press "New Game" or the button below to start. Use arrow keys or WASD to play.';
  modalPrimary.textContent = 'Start';
  modalBackdrop.hidden = false;
}

// Input handling
function handleKeyDown(e) {
  if (!isRunning && !isGameOver && (e.code === 'Space' || e.code === 'Enter')) {
    e.preventDefault();
    startNewGame();
    return;
  }

  if (e.code === 'KeyP' || e.code === 'Escape') {
    e.preventDefault();
    pauseGame();
    return;
  }

  if (!isRunning || isPaused || isGameOver) return;

  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      e.preventDefault();
      movePiece(-1, 0);
      break;
    case 'ArrowRight':
    case 'KeyD':
      e.preventDefault();
      movePiece(1, 0);
      break;
    case 'ArrowDown':
    case 'KeyS':
      e.preventDefault();
      softDropActive = true;
      break;
    case 'ArrowUp':
    case 'KeyX':
      e.preventDefault();
      rotatePiece(1);
      break;
    case 'KeyZ':
      e.preventDefault();
      rotatePiece(-1);
      break;
    case 'Space':
      e.preventDefault();
      hardDrop();
      break;
    case 'KeyC':
      e.preventDefault();
      holdCurrent();
      break;
    default:
      break;
  }
}

function handleKeyUp(e) {
  if (!isRunning || isPaused || isGameOver) return;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') {
    e.preventDefault();
    softDropActive = false;
  }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Touch controls
function handleTouchAction(action) {
  if (!isRunning || isPaused || isGameOver) return;

  switch (action) {
    case 'left':
      movePiece(-1, 0);
      break;
    case 'right':
      movePiece(1, 0);
      break;
    case 'rotate':
      rotatePiece(1);
      break;
    case 'soft':
      stepDown();
      break;
    case 'hard':
      hardDrop();
      break;
    default:
      break;
  }
}

touchButtons.forEach(btn => {
  const action = btn.getAttribute('data-action');
  btn.addEventListener('click', () => handleTouchAction(action));
});

// Buttons / modal
btnStart.addEventListener('click', () => {
  startNewGame();
});

btnPause.addEventListener('click', () => {
  pauseGame();
});

modalPrimary.addEventListener('click', () => {
  startNewGame();
});

// Game loop
function gameLoop(timestamp) {
  if (!isRunning || isPaused) return;

  if (!lastFrameTime) lastFrameTime = timestamp;
  if (!lastDropTime) lastDropTime = timestamp;

  const delta = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  const dropInterval = softDropActive
    ? Math.max(40, LEVEL_SPEEDS[level - 1] * 0.1)
    : LEVEL_SPEEDS[level - 1];

  if (timestamp - lastDropTime >= dropInterval) {
    lastDropTime = timestamp;
    stepDown();
  }

  drawBoard();

  if (isRunning && !isPaused) {
    requestAnimationFrame(gameLoop);
  }
}

// Initial state
resetGameState();
showStartModal();