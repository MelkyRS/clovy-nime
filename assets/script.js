(function () {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  if (!canvas || !ctx) {
    console.error('Canvas utama tidak ditemukan.');
    return;
  }

  const startScreen = document.getElementById('start-screen');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnShowLeaderboard = document.getElementById('btn-show-leaderboard');

  const quizOverlay = document.getElementById('quiz-overlay');
  const quizTitleEl = document.getElementById('quiz-title');
  const quizQuestionEl = document.getElementById('quiz-question');
  const quizChoicesEl = document.getElementById('quiz-choices');
  const quizFeedbackEl = document.getElementById('quiz-feedback');
  const quizCloseBtn = document.getElementById('quiz-close-btn');

  const finishOverlay = document.getElementById('finish-overlay');
  const finishScoreEl = document.getElementById('finish-score');
  const finishTimeEl = document.getElementById('finish-time');
  const finishNameInput = document.getElementById('finish-name-input');
  const finishSaveBtn = document.getElementById('finish-save-btn');
  const finishRestartBtn = document.getElementById('finish-restart-btn');
  const finishViewLeaderboardBtn = document.getElementById('finish-view-leaderboard-btn');

  const leaderboardOverlay = document.getElementById('leaderboard-overlay');
  const leaderboardListEl = document.getElementById('leaderboard-list');
  const leaderboardCloseBtn = document.getElementById('leaderboard-close-btn');

  const hudScoreEl = document.getElementById('hud-score');
  const hudTimeEl = document.getElementById('hud-time');
  const hudLivesEl = document.getElementById('hud-lives');
  const hudItemsEl = document.getElementById('hud-items');
  const hudMessageEl = document.getElementById('hud-message');

  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnJump = document.getElementById('btn-jump');
  const btnInteract = document.getElementById('btn-interact');

  const BASE_WIDTH = 320;
  const BASE_HEIGHT = 180;

  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;
  ctx.imageSmoothingEnabled = false;

  const WORLD_WIDTH = 2000;
  const GROUND_Y = 144;
  const GRAVITY = 650;
  const FRICTION = 8;
  const MAX_FALL_SPEED = 520;

  const player = {
    x: 40,
    y: GROUND_Y - 20,
    w: 12,
    h: 20,
    vx: 0,
    vy: 0,
    speed: 110,
    jumpSpeed: 260,
    onGround: false,
    facing: 1,
    lives: 3,
    maxLives: 3,
    score: 0,
    inventory: []
  };

  const START_POSITION = { x: player.x, y: player.y };

  const groundSegments = [
    { x: 0, y: GROUND_Y, w: WORLD_WIDTH, h: BASE_HEIGHT - GROUND_Y }
  ];

  const finishArea = {
    x: WORLD_WIDTH - 60,
    y: GROUND_Y - 40,
    w: 20,
    h: 40
  };

  const QUIZ_DATA = {
    rock_math: {
      id: 'rock_math',
      title: 'Batu Besar Menghalangi Jalan',
      intro: 'Untuk memecahkan batu, kamu butuh kristal energi. Kristal itu aktif jika kamu menjawab soal ini dengan benar.',
      question: '12 × 3 + 6 = ?',
      options: ['36', '42', '30', '48'],
      correctIndex: 1,
      explanation: '12 × 3 = 36, lalu 36 + 6 = 42.',
      rewardItem: 'Kristal Pemecah Batu',
      points: 150
    },
    rock_math2: {
      id: 'rock_math2',
      title: 'Batu Energi Kedua',
      intro: 'Batu berikutnya butuh energi tambahan. Hitung hasil operasi berikut.',
      question: '18 ÷ 3 + 4 = ?',
      options: ['8', '9', '10', '14'],
      correctIndex: 2,
      explanation: '18 ÷ 3 = 6, lalu 6 + 4 = 10.',
      rewardItem: 'Kristal Energi Tambahan',
      points: 150
    },
    rock_math3: {
      id: 'rock_math3',
      title: 'Batu Penjaga Gerbang',
      intro: 'Gerbang batu akan terbuka jika kamu menjawab soal ini dengan benar.',
      question: '7 × 4 − 5 = ?',
      options: ['23', '24', '28', '21'],
      correctIndex: 0,
      explanation: '7 × 4 = 28, lalu 28 − 5 = 23.',
      rewardItem: 'Kunci Gerbang Batu',
      points: 180
    },
    thieves_fraction: {
      id: 'thieves_fraction',
      title: 'Perundingan dengan Kelompok Pencuri',
      intro: 'Ketua pencuri akan membiarkanmu lewat jika kamu bisa menghitung bagian yang akan ia terima.',
      question: 'Ada 1 pizza dibagi untuk 4 orang. Berapa bagian pizza yang diterima setiap orang?',
      options: ['1/2', '1/3', '1/4', '2/4'],
      correctIndex: 2,
      explanation: 'Satu pizza dibagi menjadi 4 bagian sama besar, jadi tiap orang mendapat 1/4.',
      rewardItem: 'Perjanjian Damai',
      points: 150
    },
    thieves_fraction2: {
      id: 'thieves_fraction2',
      title: 'Membagi Harta Rampasan',
      intro: 'Pencuri ingin membagi 2 kantong koin sama rata untuk 5 orang.',
      question: 'Berapa bagian kantong koin yang diterima setiap orang?',
      options: ['1/5', '2/5', '2/10', '4/5'],
      correctIndex: 1,
      explanation: '2 kantong dibagi 5 orang berarti setiap orang mendapat 2/5 kantong.',
      rewardItem: 'Persetujuan Pembagian Adil',
      points: 170
    },
    logic_path: {
      id: 'logic_path',
      title: 'Memilih Jalur yang Aman',
      intro: 'Ada tiga jalur di depan: satu penuh jebakan, satu buntu, satu aman.',
      question: 'Jika jalur merah selalu berbahaya dan jalur biru selalu buntu, jalur mana yang paling aman?',
      options: ['Merah', 'Biru', 'Hijau', 'Semua sama saja'],
      correctIndex: 2,
      explanation: 'Jika merah berbahaya dan biru buntu, berarti hijau adalah jalur aman.',
      rewardItem: 'Peta Jalur Aman',
      points: 160
    },
    bridge_science: {
      id: 'bridge_science',
      title: 'Membangun Jembatan Darurat',
      intro: 'Di depanku ada sungai deras. Aku harus memilih bahan terbaik untuk jembatan sementara.',
      question: 'Bahan manakah yang paling cocok untuk membuat jembatan sederhana yang kuat dan cukup ringan?',
      options: ['Kertas', 'Kayu', 'Kaca', 'Tanah liat'],
      correctIndex: 1,
      explanation: 'Kayu cukup kuat dan lebih ringan dibanding banyak bahan lain sehingga cocok untuk jembatan sederhana.',
      rewardItem: 'Kit Jembatan',
      points: 200
    },
    bridge_science2: {
      id: 'bridge_science2',
      title: 'Struktur Jembatan',
      intro: 'Kamu ingin membuat jembatan yang tidak mudah roboh.',
      question: 'Bentuk struktur manakah yang paling kuat untuk menahan beban?',
      options: ['Lingkaran', 'Segitiga', 'Persegi panjang', 'Garis lurus'],
      correctIndex: 1,
      explanation: 'Segitiga adalah bentuk dasar struktur yang kuat dan stabil, banyak dipakai pada jembatan.',
      rewardItem: 'Rangka Segitiga',
      points: 190
    }
  };

  const obstacles = [
    {
      id: 'rock1',
      type: 'rock',
      x: 260,
      y: GROUND_Y - 22,
      w: 42,
      h: 22,
      solved: false,
      quizId: 'rock_math'
    },
    {
      id: 'thieves1',
      type: 'thieves',
      x: 520,
      y: GROUND_Y - 26,
      w: 40,
      h: 26,
      solved: false,
      quizId: 'thieves_fraction'
    },
    {
      id: 'rock2',
      type: 'rock',
      x: 780,
      y: GROUND_Y - 22,
      w: 42,
      h: 22,
      solved: false,
      quizId: 'rock_math2'
    },
    {
      id: 'thieves2',
      type: 'thieves',
      x: 1040,
      y: GROUND_Y - 26,
      w: 40,
      h: 26,
      solved: false,
      quizId: 'thieves_fraction2'
    },
    {
      id: 'gap_river',
      type: 'gap',
      x: 1280,
      y: GROUND_Y - 3,
      w: 90,
      h: 6,
      solved: false,
      quizId: 'bridge_science'
    },
    {
      id: 'rock3',
      type: 'rock',
      x: 1580,
      y: GROUND_Y - 22,
      w: 42,
      h: 22,
      solved: false,
      quizId: 'rock_math3'
    },
    {
      id: 'logic_gate',
      type: 'thieves',
      x: 1800,
      y: GROUND_Y - 26,
      w: 40,
      h: 26,
      solved: false,
      quizId: 'logic_path'
    }
  ];

  const LEADERBOARD_KEY = 'pixel_quest_quiz_leaderboard_v1';

  const keyboardInput = {
    left: false,
    right: false,
    jump: false,
    interact: false
  };

  const touchInput = {
    left: false,
    right: false,
    jump: false,
    interact: false
  };

  let gameState = 'menu';
  let cameraX = 0;
  let lastTimestamp = performance.now();
  let gameTime = 0;
  let nearbyObstacle = null;
  let currentQuiz = null;
  let lastInteractDown = false;

  setupKeyboardInput();
  setupTouchInput();
  setupUI();

  resetWorldState();
  updateHud();

  requestAnimationFrame(loop);

  function loop(timestamp) {
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.04);
    lastTimestamp = timestamp;

    if (gameState === 'playing') {
      updateGame(dt);
      gameTime += dt;
    }

    render();
    updateHud();

    requestAnimationFrame(loop);
  }

  function updateGame(dt) {
    const left = isLeftPressed();
    const right = isRightPressed();
    const jump = isJumpPressed();
    const interact = isInteractPressed();

    const accel = player.speed * 6;
    if (left && !right) {
      player.vx -= accel * dt;
      player.facing = -1;
    } else if (right && !left) {
      player.vx += accel * dt;
      player.facing = 1;
    } else {
      if (player.vx > 0) {
        player.vx = Math.max(0, player.vx - FRICTION * player.speed * dt);
      } else if (player.vx < 0) {
        player.vx = Math.min(0, player.vx + FRICTION * player.speed * dt);
      }
    }

    const maxSpeed = player.speed;
    if (player.vx > maxSpeed) player.vx = maxSpeed;
    if (player.vx < -maxSpeed) player.vx = -maxSpeed;

    if (jump && player.onGround) {
      player.vy = -player.jumpSpeed;
      player.onGround = false;
    }

    player.vy += GRAVITY * dt;
    if (player.vy > MAX_FALL_SPEED) player.vy = MAX_FALL_SPEED;

    const solids = getSolids();

    player.y += player.vy * dt;
    player.onGround = false;
    for (let i = 0; i < solids.length; i++) {
      const s = solids[i];
      if (rectsOverlap(player, s)) {
        if (player.vy > 0) {
          player.y = s.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          player.y = s.y + s.h;
          player.vy = 0;
        }
      }
    }

    player.x += player.vx * dt;
    for (let i = 0; i < solids.length; i++) {
      const s = solids[i];
      if (rectsOverlap(player, s)) {
        if (player.vx > 0) {
          player.x = s.x - player.w;
        } else if (player.vx < 0) {
          player.x = s.x + s.w;
        }
        player.vx = 0;
      }
    }

    if (player.y > BASE_HEIGHT + 40) {
      loseLifeAndRespawn();
      return;
    }

    if (player.x < 0) player.x = 0;
    if (player.x > WORLD_WIDTH - player.w) player.x = WORLD_WIDTH - player.w;

    const river = getObstacleByType('gap');
    if (river && !river.solved && rectsOverlap(player, river)) {
      loseLifeAndRespawn();
      return;
    }

    if (rectsOverlap(player, finishArea)) {
      finishGame();
      return;
    }

    updateCamera();
    updateInteractionTarget();

    const justPressedInteract = interact && !lastInteractDown;
    if (justPressedInteract && nearbyObstacle) {
      triggerQuiz(nearbyObstacle);
    }
    lastInteractDown = interact;
  }

  function render() {
    ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    const grad = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
    grad.addColorStop(0, '#0b1120');
    grad.addColorStop(0.45, '#020617');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    drawParallaxHills();

    ctx.fillStyle = '#111827';
    for (let i = 0; i < groundSegments.length; i++) {
      const g = groundSegments[i];
      const sx = Math.floor(g.x - cameraX);
      if (sx > BASE_WIDTH || sx + g.w < 0) continue;
      ctx.fillRect(sx, g.y, g.w, g.h);
    }

    ctx.fillStyle = '#1f2937';
    for (let i = 0; i < groundSegments.length; i++) {
      const g = groundSegments[i];
      const sx = Math.floor(g.x - cameraX);
      if (sx > BASE_WIDTH || sx + g.w < 0) continue;
      ctx.fillRect(sx, g.y - 3, g.w, 3);
    }

    for (let i = 0; i < obstacles.length; i++) {
      drawObstacle(obstacles[i]);
    }

    drawFinishFlag(finishArea);

    drawPlayer();
  }

  function drawParallaxHills() {
    const t = cameraX / (WORLD_WIDTH || 1);

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    let offset = -40 - cameraX * 0.15;
    ctx.moveTo(offset, GROUND_Y + 10);
    ctx.lineTo(offset + 90, 60);
    ctx.lineTo(offset + 190, GROUND_Y + 10);
    ctx.closePath();
    ctx.fill();

    offset = 80 - cameraX * 0.2;
    ctx.beginPath();
    ctx.moveTo(offset, GROUND_Y + 10);
    ctx.lineTo(offset + 120, 45);
    ctx.lineTo(offset + 260, GROUND_Y + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0b1220';
    offset = -60 - cameraX * 0.1;
    ctx.beginPath();
    ctx.moveTo(offset, GROUND_Y + 20);
    ctx.lineTo(offset + 110, 80);
    ctx.lineTo(offset + 260, GROUND_Y + 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#020617';
    const starCount = 12;
    for (let i = 0; i < starCount; i++) {
      const x = ((i * 40 + t * 200) % (BASE_WIDTH + 40)) - 20;
      const y = 10 + (i * 13) % 40;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function drawPlayer() {
    const sx = Math.floor(player.x - cameraX);
    const sy = Math.floor(player.y);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(sx, sy, player.w, player.h);

    ctx.fillStyle = '#0f172a';
    const eyeY = sy + 6;
    const eyeX = player.facing === 1 ? sx + player.w - 4 : sx + 2;
    ctx.fillRect(eyeX, eyeY, 2, 2);

    ctx.fillStyle = '#15803d';
    ctx.fillRect(sx, sy + player.h - 6, player.w, 3);
  }

  function drawObstacle(ob) {
    const sx = Math.floor(ob.x - cameraX);
    const sy = Math.floor(ob.y);

    if (sx > BASE_WIDTH || sx + ob.w < 0) return;

    if (ob.type === 'rock') {
      if (ob.solved) {
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(sx, sy + ob.h - 6, ob.w, 6);
        return;
      }
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(sx, sy, ob.w, ob.h);
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(sx + 2, sy + 4, ob.w - 4, ob.h - 6);
    } else if (ob.type === 'thieves') {
      if (ob.solved) {
        ctx.fillStyle = 'rgba(248, 250, 252, 0.4)';
        ctx.fillRect(sx, sy + ob.h - 10, ob.w, 6);
        return;
      }
      const baseY = sy + ob.h - 16;
      for (let i = 0; i < 3; i++) {
        const ox = sx + 4 + i * 10;
        ctx.fillStyle = '#f97316';
        ctx.fillRect(ox, baseY, 8, 10);
        ctx.fillStyle = '#111827';
        ctx.fillRect(ox, baseY - 6, 8, 6);
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(ox + 2, baseY - 4, 2, 2);
      }
    } else if (ob.type === 'gap') {
      if (!ob.solved) {
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(sx, sy, ob.w, 8);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sx, sy + 8, ob.w, BASE_HEIGHT - (sy + 8));
      } else {
        ctx.fillStyle = '#78716c';
        ctx.fillRect(sx, sy, ob.w, 6);
        ctx.fillStyle = '#a8a29e';
        for (let i = 0; i < ob.w; i += 10) {
          ctx.fillRect(sx + i, sy - 2, 6, 2);
        }
      }
    }
  }

  function drawFinishFlag(flag) {
    const sx = Math.floor(flag.x - cameraX);
    const sy = Math.floor(flag.y);
    if (sx > BASE_WIDTH || sx + flag.w < 0) return;

    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(sx + flag.w - 3, sy - 20, 2, flag.h + 20);

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(sx + flag.w - 2, sy - 18);
    ctx.lineTo(sx + flag.w - 2, sy - 6);
    ctx.lineTo(sx + flag.w - 10, sy - 12);
    ctx.closePath();
    ctx.fill();
  }

  function updateCamera() {
    const target = player.x - BASE_WIDTH / 2;
    const maxCam = Math.max(0, WORLD_WIDTH - BASE_WIDTH);
    cameraX = Math.max(0, Math.min(maxCam, target));
  }

  function getSolids() {
    const result = [];
    for (let i = 0; i &lt; groundSegments.length; i++) {
      result.push(groundSegments[i]);
    }
    for (let i = 0; i &lt; obstacles.length; i++) {
      const ob = obstacles[i];
      if (ob.type === 'gap') {
        if (ob.solved) {
          result.push({
            x: ob.x,
            y: ob.y - 4,
            w: ob.w,
            h: 10
          });
        }
        continue;
      }
      if (ob.solved) continue;
      if (ob.type === 'rock' || ob.type === 'thieves') {
        result.push({
          x: ob.x,
          y: ob.y - 64,
          w: ob.w,
          h: ob.h + 64
        });
      } else {
        result.push(ob);
      }
    }
    return result;
  }

  function rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function getObstacleByType(type) {
    for (let i = 0; i < obstacles.length; i++) {
      if (obstacles[i].type === type) return obstacles[i];
    }
    return null;
  }

  function updateInteractionTarget() {
    nearbyObstacle = null;
    for (let i = 0; i < obstacles.length; i++) {
      const ob = obstacles[i];
      if (ob.solved) continue;
      const pxCenter = player.x + player.w / 2;
      const obCenterX = ob.x + ob.w / 2;
      const dx = Math.abs(pxCenter - obCenterX);
      const dy = Math.abs(player.y + player.h - ob.y);
      if (dx < 40 && dy < 40) {
        nearbyObstacle = ob;
        break;
      }
    }

    if (hudMessageEl && gameState === 'playing') {
      if (nearbyObstacle) {
        if (nearbyObstacle.type === 'rock') {
          hudMessageEl.textContent = 'Batu besar menghalangi jalan. Tekan E untuk mencari cara melewatinya.';
        } else if (nearbyObstacle.type === 'thieves') {
          hudMessageEl.textContent = 'Sekelompok pencuri menghadang. Tekan E untuk bernegosiasi.';
        } else if (nearbyObstacle.type === 'gap') {
          hudMessageEl.textContent = 'Ada sungai deras. Tekan E untuk membangun jembatan.';
        } else {
          hudMessageEl.textContent = 'Tekan E untuk berinteraksi.';
        }
      } else {
        hudMessageEl.textContent = '';
      }
    }
  }

  function triggerQuiz(obstacle) {
    if (!obstacle || obstacle.solved) return;
    if (gameState !== 'playing') return;
    const quiz = QUIZ_DATA[obstacle.quizId];
    if (!quiz) return;

    currentQuiz = { quiz, obstacle };
    openQuiz(quiz);
  }

  function openQuiz(quiz) {
    if (!quizOverlay) return;
    gameState = 'quiz';

    if (quizTitleEl) quizTitleEl.textContent = quiz.title;
    if (quizQuestionEl) quizQuestionEl.textContent = quiz.question;
    if (quizFeedbackEl) {
      quizFeedbackEl.textContent = quiz.intro || '';
    }

    if (quizChoicesEl) {
      quizChoicesEl.innerHTML = '';
      quiz.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-choice';
        btn.textContent = opt;
        btn.addEventListener('click', function () {
          handleQuizAnswer(index);
        });
        quizChoicesEl.appendChild(btn);
      });
    }

    if (quizCloseBtn) {
      quizCloseBtn.classList.add('hidden');
    }

    quizOverlay.classList.remove('hidden');
    quizOverlay.setAttribute('aria-hidden', 'false');
  }

  function handleQuizAnswer(index) {
    if (!currentQuiz) return;
    const quiz = currentQuiz.quiz;
    const obstacle = currentQuiz.obstacle;
    if (!quizChoicesEl) return;

    const buttons = Array.from(quizChoicesEl.querySelectorAll('button.quiz-choice'));
    if (index < 0 || index >= buttons.length) return;

    const isCorrect = index === quiz.correctIndex;

    if (isCorrect) {
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === quiz.correctIndex) {
          b.classList.add('correct');
        }
      });

      player.score += quiz.points;
      const itemName = quiz.rewardItem;
      if (itemName && !player.inventory.includes(itemName)) {
        player.inventory.push(itemName);
      }
      if (obstacle) {
        obstacle.solved = true;
      }
      if (quizFeedbackEl) {
        quizFeedbackEl.textContent = 'Benar! ' + quiz.explanation + ' Kamu mendapatkan item: ' + itemName + '.';
      }
      if (quizCloseBtn) {
        quizCloseBtn.classList.remove('hidden');
        quizCloseBtn.focus();
      }
    } else {
      const clicked = buttons[index];
      if (clicked) clicked.classList.add('wrong');

      const penalty = Math.round(quiz.points * 0.3);
      player.score = Math.max(0, player.score - penalty);
      if (quizFeedbackEl) {
        quizFeedbackEl.textContent = 'Belum tepat. ' + quiz.explanation + ' Coba lagi dengan jawaban yang berbeda.';
      }
      buttons.forEach((b) => {
        b.disabled = false;
      });
    }

    updateHud();
  }

  function closeQuiz() {
    if (!quizOverlay) return;
    quizOverlay.classList.add('hidden');
    quizOverlay.setAttribute('aria-hidden', 'true');
    currentQuiz = null;
    if (gameState === 'quiz') {
      gameState = 'playing';
    }
  }

  function resetWorldState() {
    player.x = START_POSITION.x;
    player.y = START_POSITION.y;
    player.vx = 0;
    player.vy = 0;
    player.lives = player.maxLives;
    player.score = 0;
    player.inventory = [];
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].solved = false;
    }
    gameTime = 0;
    cameraX = 0;
    nearbyObstacle = null;
  }

  function startNewGame() {
    resetWorldState();
    gameState = 'playing';
    if (startScreen) {
      startScreen.classList.add('hidden');
    }
    if (finishOverlay) {
      finishOverlay.classList.add('hidden');
      finishOverlay.setAttribute('aria-hidden', 'true');
    }
    if (leaderboardOverlay) {
      leaderboardOverlay.classList.add('hidden');
      leaderboardOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  function loseLifeAndRespawn() {
    player.lives -= 1;
    if (player.lives <= 0) {
      player.lives = 0;
      updateHud();
      gameOverToMenu();
    } else {
      player.x = START_POSITION.x;
      player.y = START_POSITION.y;
      player.vx = 0;
      player.vy = 0;
    }
  }

  function gameOverToMenu() {
    resetWorldState();
    gameState = 'menu';
    if (startScreen) {
      startScreen.classList.remove('hidden');
    }
  }

  function finishGame() {
    if (gameState !== 'playing') return;
    gameState = 'finished';
    if (finishScoreEl) finishScoreEl.textContent = String(player.score);
    if (finishTimeEl) finishTimeEl.textContent = gameTime.toFixed(1);
    if (finishOverlay) {
      finishOverlay.classList.remove('hidden');
      finishOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  function updateHud() {
    if (hudScoreEl) hudScoreEl.textContent = String(player.score);
    if (hudTimeEl) hudTimeEl.textContent = gameTime.toFixed(1) + 's';

    if (hudLivesEl) {
      const hearts = player.lives > 0 ? '♥'.repeat(player.lives) : '×';
      hudLivesEl.textContent = hearts;
    }

    if (hudItemsEl) {
      hudItemsEl.textContent = player.inventory.length ? player.inventory.join(', ') : '-';
    }
  }

  function setupKeyboardInput() {
    document.addEventListener('keydown', function (e) {
      const code = e.code;
      if (code === 'ArrowLeft' || code === 'KeyA') {
        keyboardInput.left = true;
        e.preventDefault();
      } else if (code === 'ArrowRight' || code === 'KeyD') {
        keyboardInput.right = true;
        e.preventDefault();
      } else if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') {
        keyboardInput.jump = true;
        e.preventDefault();
      } else if (code === 'KeyE' || code === 'Enter') {
        keyboardInput.interact = true;
        e.preventDefault();
      }
    });

    document.addEventListener('keyup', function (e) {
      const code = e.code;
      if (code === 'ArrowLeft' || code === 'KeyA') {
        keyboardInput.left = false;
        e.preventDefault();
      } else if (code === 'ArrowRight' || code === 'KeyD') {
        keyboardInput.right = false;
        e.preventDefault();
      } else if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') {
        keyboardInput.jump = false;
        e.preventDefault();
      } else if (code === 'KeyE' || code === 'Enter') {
        keyboardInput.interact = false;
        e.preventDefault();
      }
    });

    window.addEventListener('blur', function () {
      keyboardInput.left = false;
      keyboardInput.right = false;
      keyboardInput.jump = false;
      keyboardInput.interact = false;
      touchInput.left = false;
      touchInput.right = false;
      touchInput.jump = false;
      touchInput.interact = false;
    });
  }

  function bindTouchButton(button, key) {
    if (!button) return;
    const start = function (e) {
      e.preventDefault();
      touchInput[key] = true;
    };
    const end = function (e) {
      e.preventDefault();
      touchInput[key] = false;
    };
    button.addEventListener('touchstart', start);
    button.addEventListener('touchend', end);
    button.addEventListener('touchcancel', end);
    button.addEventListener('mousedown', start);
    button.addEventListener('mouseup', end);
    button.addEventListener('mouseleave', end);
  }

  function setupTouchInput() {
    bindTouchButton(btnLeft, 'left');
    bindTouchButton(btnRight, 'right');
    bindTouchButton(btnJump, 'jump');
    bindTouchButton(btnInteract, 'interact');
  }

  function isLeftPressed() {
    return keyboardInput.left || touchInput.left;
  }

  function isRightPressed() {
    return keyboardInput.right || touchInput.right;
  }

  function isJumpPressed() {
    return keyboardInput.jump || touchInput.jump;
  }

  function isInteractPressed() {
    return keyboardInput.interact || touchInput.interact;
  }

  function setupUI() {
    if (btnStartGame) {
      btnStartGame.addEventListener('click', function () {
        startNewGame();
        canvas.focus();
      });
    }

    if (btnShowLeaderboard) {
      btnShowLeaderboard.addEventListener('click', function () {
        openLeaderboard();
      });
    }

    if (quizCloseBtn) {
      quizCloseBtn.addEventListener('click', function () {
        closeQuiz();
      });
    }

    if (finishRestartBtn) {
      finishRestartBtn.addEventListener('click', function () {
        startNewGame();
      });
    }

    if (finishSaveBtn) {
      finishSaveBtn.addEventListener('click', function () {
        saveCurrentScoreToLeaderboard();
      });
    }

    if (finishViewLeaderboardBtn) {
      finishViewLeaderboardBtn.addEventListener('click', function () {
        openLeaderboard();
      });
    }

    if (leaderboardCloseBtn) {
      leaderboardCloseBtn.addEventListener('click', function () {
        closeLeaderboard();
      });
    }
  }

  function loadLeaderboard() {
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.warn('Gagal memuat leaderboard:', err);
      return [];
    }
  }

  function saveLeaderboard(list) {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn('Gagal menyimpan leaderboard:', err);
    }
  }

  function recordScore(name, score, timeSeconds) {
    const list = loadLeaderboard();
    list.push({ name, score, timeSeconds });
    list.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSeconds - b.timeSeconds;
    });
    if (list.length > 10) list.length = 10;
    saveLeaderboard(list);
    return list;
  }

  function renderLeaderboard() {
    if (!leaderboardListEl) return;
    const list = loadLeaderboard();
    leaderboardListEl.innerHTML = '';
    if (!list.length) {
      const li = document.createElement('li');
      li.textContent = 'Belum ada skor. Jadilah yang pertama!';
      leaderboardListEl.appendChild(li);
      return;
    }
    list.forEach(function (entry, idx) {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = (idx + 1) + '. ' + entry.name;

      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'score';
      scoreSpan.textContent = entry.score + ' pts';

      const timeSpan = document.createElement('span');
      timeSpan.className = 'time';
      timeSpan.textContent = entry.timeSeconds.toFixed(1) + 's';

      li.appendChild(nameSpan);
      li.appendChild(scoreSpan);
      li.appendChild(timeSpan);
      leaderboardListEl.appendChild(li);
    });
  }

  function saveCurrentScoreToLeaderboard() {
    if (!finishNameInput) return;
    const rawName = finishNameInput.value.trim();
    const name = rawName || 'Pemain';
    const list = recordScore(name, player.score, gameTime);
    renderLeaderboard();
    if (leaderboardOverlay) {
      leaderboardOverlay.classList.remove('hidden');
      leaderboardOverlay.setAttribute('aria-hidden', 'false');
    }
    return list;
  }

  function openLeaderboard() {
    renderLeaderboard();
    if (leaderboardOverlay) {
      leaderboardOverlay.classList.remove('hidden');
      leaderboardOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLeaderboard() {
    if (leaderboardOverlay) {
      leaderboardOverlay.classList.add('hidden');
      leaderboardOverlay.setAttribute('aria-hidden', 'true');
    }
  }
})();