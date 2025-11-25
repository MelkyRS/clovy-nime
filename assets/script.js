(function () {
  "use strict";

  // ------------------------------------------------------------
  // Data quiz
  // ------------------------------------------------------------

  // Tiap level berisi campuran soal mudah/menengah/sulit.
  var quizLevels = [
    {
      id: "level-1",
      title: "Level 1 · Pemula",
      description: "5 soal dasar untuk pemanasan. Cocok untuk mulai mencoba.",
      difficulty: "Mudah",
      questionCount: 5,
      colorKey: "orange",
      questions: [
        {
          text: "Ibu kota Indonesia adalah…",
          options: ["Surabaya", "Jakarta", "Bandung", "Medan"],
          correctIndex: 1,
          difficulty: "Mudah"
        },
        {
          text: "Hasil dari 7 + 5 adalah…",
          options: ["10", "11", "12", "13"],
          correctIndex: 2,
          difficulty: "Mudah"
        },
        {
          text: "Bahasa pemrograman yang berjalan di browser adalah…",
          options: ["Python", "C++", "JavaScript", "Go"],
          correctIndex: 2,
          difficulty: "Mudah"
        },
        {
          text: "Warna utama bendera Indonesia adalah…",
          options: ["Merah dan Putih", "Merah dan Biru", "Hijau dan Kuning", "Hitam dan Putih"],
          correctIndex: 0,
          difficulty: "Mudah"
        },
        {
          text: "Tahun kabisat memiliki berapa hari?",
          options: ["364", "365", "366", "367"],
          correctIndex: 2,
          difficulty: "Mudah"
        }
      ]
    },
    {
      id: "level-2",
      title: "Level 2 · Menengah",
      description: "7 soal dengan kombinasi konsep umum dan logika.",
      difficulty: "Menengah",
      questionCount: 7,
      colorKey: "purple",
      questions: [
        {
          text: "Manakah yang BUKAN termasuk planet dalam tata surya?",
          options: ["Mars", "Venus", "Pluto", "Jupiter"],
          correctIndex: 2,
          difficulty: "Menengah"
        },
        {
          text: "Bilangan prima adalah bilangan yang…",
          options: [
            "Hanya habis dibagi 1 dan dirinya sendiri",
            "Hanya habis dibagi 2",
            "Selalu genap",
            "Selalu ganjil"
          ],
          correctIndex: 0,
          difficulty: "Menengah"
        },
        {
          text: "Dalam HTML, elemen untuk membuat tautan adalah…",
          options: ["<link>", "<href>", "<a>", "<url>"],
          correctIndex: 2,
          difficulty: "Menengah"
        },
        {
          text: "Jika 3x = 27, maka x adalah…",
          options: ["3", "6", "9", "12"],
          correctIndex: 2,
          difficulty: "Menengah"
        },
        {
          text: "Proses mengubah air menjadi uap disebut…",
          options: ["Kondensasi", "Evaporasi", "Sublimasi", "Presipitasi"],
          correctIndex: 1,
          difficulty: "Menengah"
        },
        {
          text: "Di JavaScript, operator perbandingan yang disarankan untuk cek nilai dan tipe adalah…",
          options: ["==", "!=", "===", "!=="],
          correctIndex: 2,
          difficulty: "Menengah"
        },
        {
          text: "Struktur data yang mengikuti prinsip FIFO adalah…",
          options: ["Stack", "Queue", "Tree", "Graph"],
          correctIndex: 1,
          difficulty: "Menengah"
        }
      ]
    },
    {
      id: "level-3",
      title: "Level 3 · Expert",
      description: "10 soal dengan tingkat kesulitan lebih tinggi dan butuh penalaran.",
      difficulty: "Sulit",
      questionCount: 10,
      colorKey: "blue",
      questions: [
        {
          text: "Algoritma pengurutan dengan kompleksitas rata-rata O(n log n) adalah…",
          options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
          correctIndex: 2,
          difficulty: "Sulit"
        },
        {
          text: "Dalam basis data relasional, operasi JOIN digunakan untuk…",
          options: [
            "Menghapus tabel",
            "Menggabungkan baris dari dua tabel berdasarkan kondisi terkait",
            "Menambah kolom baru",
            "Mengurutkan hasil"
          ],
          correctIndex: 1,
          difficulty: "Sulit"
        },
        {
          text: "Jika sebuah fungsi f adalah O(n²) dan fungsi g adalah O(n log n), maka untuk n yang sangat besar…",
          options: [
            "f lebih cepat dari g",
            "g lebih cepat dari f",
            "keduanya sama cepat",
            "tidak dapat ditentukan"
          ],
          correctIndex: 1,
          difficulty: "Sulit"
        },
        {
          text: "Git command yang digunakan untuk membuat branch baru dan langsung berpindah ke branch tersebut adalah…",
          options: [
            "git branch new-branch",
            "git checkout new-branch",
            "git checkout -b new-branch",
            "git switch new-branch"
          ],
          correctIndex: 2,
          difficulty: "Sulit"
        },
        {
          text: "HTTP status code 201 menandakan…",
          options: [
            "Permintaan berhasil tanpa konten",
            "Sumber daya berhasil dibuat",
            "Permintaan dialihkan permanen",
            "Terjadi kesalahan di server"
          ],
          correctIndex: 1,
          difficulty: "Sulit"
        },
        {
          text: "Konsep di mana fungsi bisa menerima fungsi lain sebagai argumen disebut…",
          options: [
            "Closure",
            "Higher-order function",
            "Recursion",
            "Encapsulation"
          ],
          correctIndex: 1,
          difficulty: "Sulit"
        },
        {
          text: "Dalam React, hook yang digunakan untuk efek samping (side effects) adalah…",
          options: ["useState", "useEffect", "useMemo", "useRef"],
          correctIndex: 1,
          difficulty: "Sulit"
        },
        {
          text: "Struktur data yang optimal untuk pencarian kunci unik dengan rata-rata O(1) adalah…",
          options: ["Array", "Linked List", "Hash Map", "Binary Tree"],
          correctIndex: 2,
          difficulty: "Sulit"
        },
        {
          text: "Dalam konteks keamanan web, XSS adalah singkatan dari…",
          options: [
            "Cross-Site Scripting",
            "Cross-Site Security",
            "Cross-Server Scripting",
            "Cross-Site Session"
          ],
          correctIndex: 0,
          difficulty: "Sulit"
        },
        {
          text: "Istilah untuk pola desain yang memisahkan logika bisnis dari tampilan (UI) seperti pada MVC adalah…",
          options: [
            "Inversion of Control",
            "Dependency Injection",
            "Separation of Concerns",
            "Observer Pattern"
          ],
          correctIndex: 2,
          difficulty: "Sulit"
        }
      ]
    },
    {
      id: "level-4",
      title: "Level 4 · Tantangan Campuran",
      description: "8 soal campuran logika, sains, dan pemrograman untuk menguji konsistensi kamu.",
      difficulty: "Campuran",
      questionCount: 8,
      colorKey: "teal",
      questions: [
        {
          text: "Jika sebuah array memiliki 10 elemen dan indeks mulai dari 0, indeks elemen terakhir adalah…",
          options: ["9", "10", "8", "11"],
          correctIndex: 0,
          difficulty: "Menengah"
        },
        {
          text: "Kecepatan cahaya di ruang hampa sekitar…",
          options: [
            "3.000 km/s",
            "30.000 km/s",
            "300.000 km/s",
            "3.000.000 km/s"
          ],
          correctIndex: 2,
          difficulty: "Sulit"
        },
        {
          text: "Di JavaScript, keyword yang digunakan untuk mendeklarasikan variabel dengan cakupan blok adalah…",
          options: ["var", "let", "function", "const"],
          correctIndex: 1,
          difficulty: "Menengah"
        },
        {
          text: "Konsep \"responsive design\" pada web bertujuan untuk…",
          options: [
            "Mempercepat server",
            "Membuat tampilan menyesuaikan berbagai ukuran layar",
            "Mengurangi ukuran file gambar",
            "Meningkatkan ranking SEO"
          ],
          correctIndex: 1,
          difficulty: "Mudah"
        },
        {
          text: "Dalam machine learning, overfitting terjadi ketika…",
          options: [
            "Model terlalu sederhana sehingga tidak bisa belajar pola",
            "Model belajar terlalu spesifik pada data latih dan sulit generalisasi",
            "Data latih sangat sedikit",
            "Data latih sangat besar"
          ],
          correctIndex: 1,
          difficulty: "Sulit"
        },
        {
          text: "Struktur kontrol yang mengulang blok kode selama kondisi bernilai true adalah…",
          options: ["if", "switch", "while", "return"],
          correctIndex: 2,
          difficulty: "Mudah"
        },
        {
          text: "Satuan untuk mengukur frekuensi adalah…",
          options: ["Newton", "Joule", "Hertz", "Pascal"],
          correctIndex: 2,
          difficulty: "Menengah"
        },
        {
          text: "Istilah untuk gaya desain antarmuka yang menekankan kesederhanaan dan ruang kosong adalah…",
          options: ["Skeuomorphic", "Flat design", "Neumorphic", "Retro UI"],
          correctIndex: 1,
          difficulty: "Menengah"
        }
      ]
    }
  ];

  // ------------------------------------------------------------
  // State & penyimpanan lokal
  // ------------------------------------------------------------

  var STORAGE_KEY_USER = "quizplay-username";
  var STORAGE_KEY_STATS = "quizplay-leaderboard";

  var currentLevel = null;
  var currentQuestionIndex = 0;
  var currentScore = 0;
  var currentCorrectCount = 0;
  var hasAnsweredCurrent = false;

  // Stats global per user (di perangkat ini)
  // { username, totalQuizzes, totalCorrect, totalQuestions }
  var leaderboard = [];

  // ------------------------------------------------------------
  // Helper DOM & util
  // ------------------------------------------------------------

  function $(selector) {
    return document.querySelector(selector);
  }

  function createElement(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function clampPercentage(v) {
    if (isNaN(v)) return 0;
    if (v < 0) return 0;
    if (v > 100) return 100;
    return v;
  }

  function formatPercent(correct, total) {
    if (!total) return "0%";
    var value = Math.round((correct / total) * 100);
    return clampPercentage(value) + "%";
  }

  function loadUsername() {
    try {
      if (!("localStorage" in window)) return "";
      return window.localStorage.getItem(STORAGE_KEY_USER) || "";
    } catch (e) {
      return "";
    }
  }

  function saveUsername(name) {
    try {
      if (!("localStorage" in window)) return;
      if (name) {
        window.localStorage.setItem(STORAGE_KEY_USER, name);
      } else {
        window.localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      // abaikan
    }
  }

  function loadLeaderboard() {
    try {
      if (!("localStorage" in window)) {
        leaderboard = [];
        return;
      }
      var raw = window.localStorage.getItem(STORAGE_KEY_STATS);
      if (!raw) {
        leaderboard = [];
        return;
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        leaderboard = [];
        return;
      }
      leaderboard = parsed;
    } catch (e) {
      leaderboard = [];
    }
  }

  function saveLeaderboard() {
    try {
      if (!("localStorage" in window)) return;
      window.localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(leaderboard));
    } catch (e) {
      // abaikan
    }
  }

  function getUserStat(username) {
    if (!username) return null;
    for (var i = 0; i < leaderboard.length; i++) {
      if (leaderboard[i].username === username) return leaderboard[i];
    }
    return null;
  }

  function upsertUserStat(username, correctAdded, questionsAdded) {
    if (!username) return;
    var stat = getUserStat(username);
    if (!stat) {
      stat = {
        username: username,
        totalQuizzes: 0,
        totalCorrect: 0,
        totalQuestions: 0
      };
      leaderboard.push(stat);
    }
    stat.totalQuizzes += 1;
    stat.totalCorrect += correctAdded;
    stat.totalQuestions += questionsAdded;
  }

  function sortLeaderboard() {
    leaderboard.sort(function (a, b) {
      if (b.totalQuizzes !== a.totalQuizzes) {
        return b.totalQuizzes - a.totalQuizzes;
      }
      var accA = a.totalQuestions ? a.totalCorrect / a.totalQuestions : 0;
      var accB = b.totalQuestions ? b.totalCorrect / b.totalQuestions : 0;
      if (accB !== accA) {
        return accB - accA;
      }
      return a.username.localeCompare(b.username);
    });
  }

  // ------------------------------------------------------------
  // Render level
  // ------------------------------------------------------------

  function renderLevels() {
    var grid = $("#quiz-level-grid");
    if (!grid) return;
    grid.innerHTML = "";

    quizLevels.forEach(function (level) {
      var card = createElement("article", "quiz-level-card");
      card.setAttribute("data-level-id", level.id);
      if (level.colorKey) {
        card.classList.add("quiz-level-card--" + level.colorKey);
      }

      var header = createElement("div", "quiz-level-header");
      var title = createElement("h3", "quiz-level-title", level.title);
      var diff = createElement("span", "quiz-level-diff", level.difficulty);
      header.appendChild(title);
      header.appendChild(diff);

      var meta = createElement(
        "p",
        "quiz-level-meta",
        level.questionCount + " soal · Kesulitan: " + level.difficulty
      );

      var desc = createElement("p", "quiz-level-desc", level.description);

      var footer = createElement("div", "quiz-level-footer");
      var btn = createElement("button", "button button--primary", "Mulai Level Ini");
      btn.type = "button";
      btn.addEventListener("click", function () {
        startLevel(level.id);
      });

      footer.appendChild(btn);

      card.appendChild(header);
      card.appendChild(meta);
      card.appendChild(desc);
      card.appendChild(footer);

      grid.appendChild(card);
    });
  }

  // ------------------------------------------------------------
  // Quiz flow
  // ------------------------------------------------------------

  var quizSectionTitleEl = $("#quiz-section-title");
  var quizCurrentLevelLabelEl = $("#quiz-current-level-label");
  var quizProgressTextEl = $("#quiz-progress-text");
  var quizProgressFillEl = $("#quiz-progress-fill");
  var quizScoreEl = $("#quiz-score");
  var quizCardEl = $("#quiz-card");
  var statTotalQuizzesEl = $("#stat-total-quizzes");
  var statTotalCorrectEl = $("#stat-total-correct");
  var statAccuracyEl = $("#stat-accuracy");

  function resetQuizState(level) {
    currentLevel = level;
    currentQuestionIndex = 0;
    currentScore = 0;
    currentCorrectCount = 0;
    hasAnsweredCurrent = false;
  }

  function updateProgress() {
    if (!currentLevel) {
      if (quizProgressTextEl) quizProgressTextEl.textContent = "0 / 0 soal";
      if (quizProgressFillEl) quizProgressFillEl.style.width = "0%";
      return;
    }
    var total = currentLevel.questions.length;
    var current = Math.min(currentQuestionIndex + 1, total);
    if (quizProgressTextEl) {
      quizProgressTextEl.textContent = current + " / " + total + " soal";
    }
    if (quizProgressFillEl) {
      var percent = (current / total) * 100;
      quizProgressFillEl.style.width = clampPercentage(percent) + "%";
    }
  }

  function updateScoreDisplay() {
    if (quizScoreEl) {
      quizScoreEl.textContent = currentScore;
    }
  }

  function showQuestion() {
    if (!quizCardEl || !currentLevel) return;

    var total = currentLevel.questions.length;
    if (currentQuestionIndex >= total) {
      showQuizSummary();
      return;
    }

    var q = currentLevel.questions[currentQuestionIndex];
    hasAnsweredCurrent = false;

    quizCardEl.className = "quiz-card";
    quizCardEl.innerHTML = "";

    var header = createElement("div", "quiz-question-header");
    var label = createElement(
      "span",
      "quiz-question-badge",
      "Soal " + (currentQuestionIndex + 1) + " dari " + total
    );
    var diff = createElement("span", "quiz-question-diff", q.difficulty || currentLevel.difficulty);
    header.appendChild(label);
    header.appendChild(diff);

    var text = createElement("p", "quiz-question-text", q.text);

    var optionsWrapper = createElement("div", "quiz-options");
    q.options.forEach(function (opt, index) {
      var btn = createElement("button", "quiz-option-button", opt);
      btn.type = "button";
      btn.setAttribute("data-option-index", String(index));
      btn.addEventListener("click", function () {
        handleAnswer(index);
      });
      optionsWrapper.appendChild(btn);
    });

    var footer = createElement("div", "quiz-question-footer");
    var nextBtn = createElement("button", "button button--ghost quiz-next-button", "Lewati / Berikutnya");
    nextBtn.type = "button";
    nextBtn.addEventListener("click", function () {
      goToNextQuestion();
    });
    footer.appendChild(nextBtn);

    quizCardEl.appendChild(header);
    quizCardEl.appendChild(text);
    quizCardEl.appendChild(optionsWrapper);
    quizCardEl.appendChild(footer);

    updateProgress();
    updateScoreDisplay();
  }

  function handleAnswer(selectedIndex) {
    if (!currentLevel || hasAnsweredCurrent) return;
    var q = currentLevel.questions[currentQuestionIndex];
    if (!q) return;
    hasAnsweredCurrent = true;

    var buttons = quizCardEl ? quizCardEl.querySelectorAll(".quiz-option-button") : [];
    var isCorrect = selectedIndex === q.correctIndex;

    buttons.forEach(function (btn) {
      var idx = parseInt(btn.getAttribute("data-option-index") || "0", 10);
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add("quiz-option-button--correct");
      }
      if (idx === selectedIndex && !isCorrect) {
        btn.classList.add("quiz-option-button--wrong");
      }
    });

    if (isCorrect) {
      currentCorrectCount += 1;
      currentScore += 10;
    }

    updateScoreDisplay();
  }

  function goToNextQuestion() {
    if (!currentLevel) return;
    currentQuestionIndex += 1;
    if (currentQuestionIndex >= currentLevel.questions.length) {
      showQuizSummary();
    } else {
      showQuestion();
    }
  }

  function showQuizSummary() {
    if (!quizCardEl || !currentLevel) return;

    quizCardEl.className = "quiz-card quiz-card--summary";
    quizCardEl.innerHTML = "";

    var total = currentLevel.questions.length;
    var accuracy = formatPercent(currentCorrectCount, total);

    var title = createElement(
      "h3",
      "quiz-summary-title",
      "Level selesai: " + (currentLevel.title || "Level")
    );
    var info = createElement(
      "p",
      "quiz-summary-text",
      "Kamu menjawab benar " +
        currentCorrectCount +
        " dari " +
        total +
        " soal. Skor: " +
        currentScore +
        " · Akurasi: " +
        accuracy
    );

    var username = loadUsername().trim();
    if (username) {
      upsertUserStat(username, currentCorrectCount, total);
      sortLeaderboard();
      saveLeaderboard();
      renderLeaderboard();
      renderHeroStats();
    }

    var actions = createElement("div", "quiz-summary-actions");
    var btnReplay = createElement("button", "button button--primary", "Ulangi level ini");
    btnReplay.type = "button";
    btnReplay.addEventListener("click", function () {
      startLevel(currentLevel.id);
    });

    var btnNext = createElement("button", "button button--ghost", "Pilih level lain");
    btnNext.type = "button";
    btnNext.addEventListener("click", function () {
      scrollToSection("levels-section");
    });

    actions.appendChild(btnReplay);
    actions.appendChild(btnNext);

    quizCardEl.appendChild(title);
    quizCardEl.appendChild(info);

    if (!username) {
      var note = createElement(
        "p",
        "quiz-summary-note",
        "Masukkan nama di pojok kanan atas lalu kerjakan lagi agar progres kamu muncul di leaderboard."
      );
      quizCardEl.appendChild(note);
    }

    quizCardEl.appendChild(actions);

    updateProgress();
    updateScoreDisplay();
  }

  function startLevel(levelId) {
    var level = null;
    for (var i = 0; i < quizLevels.length; i++) {
      if (quizLevels[i].id === levelId) {
        level = quizLevels[i];
        break;
      }
    }
    if (!level) return;

    resetQuizState(level);

    if (quizSectionTitleEl) {
      quizSectionTitleEl.textContent = "Area Quiz · " + level.title;
    }
    if (quizCurrentLevelLabelEl) {
      quizCurrentLevelLabelEl.textContent =
        "Level: " + level.title + " (" + (level.difficulty || "Campuran") + ")";
    }

    showQuestion();
    scrollToSection("quiz-section");
  }

  // ------------------------------------------------------------
  // Leaderboard
  // ------------------------------------------------------------

  var leaderboardBodyEl = $("#leaderboard-body");
  var leaderboardUserLabelEl = $("#leaderboard-user-label");

  function renderLeaderboard() {
    if (!leaderboardBodyEl) return;
    sortLeaderboard();
    leaderboardBodyEl.innerHTML = "";

    if (!leaderboard.length) {
      var emptyRow = createElement("tr", "leaderboard-row-empty");
      var td = createElement(
        "td",
        null,
        "Belum ada data. Selesaikan minimal satu level quiz untuk masuk ke leaderboard."
      );
      td.colSpan = 5;
      emptyRow.appendChild(td);
      leaderboardBodyEl.appendChild(emptyRow);
      return;
    }

    leaderboard.forEach(function (item, index) {
      var tr = createElement("tr", "leaderboard-row");
      var rank = createElement("td", "leaderboard-rank", String(index + 1));
      var name = createElement("td", "leaderboard-name", item.username);
      var qCount = createElement("td", "leaderboard-quizzes", String(item.totalQuizzes));
      var correct = createElement("td", "leaderboard-correct", String(item.totalCorrect));
      var acc = createElement(
        "td",
        "leaderboard-accuracy",
        formatPercent(item.totalCorrect, item.totalQuestions)
      );

      tr.appendChild(rank);
      tr.appendChild(name);
      tr.appendChild(qCount);
      tr.appendChild(correct);
      tr.appendChild(acc);
      leaderboardBodyEl.appendChild(tr);
    });

    var username = loadUsername().trim();
    if (leaderboardUserLabelEl) {
      if (!username) {
        leaderboardUserLabelEl.textContent = "Ketik nama kamu di kanan atas untuk mulai tercatat di leaderboard.";
      } else {
        var stat = getUserStat(username);
        if (!stat) {
          leaderboardUserLabelEl.textContent =
            "Halo, " +
            username +
            ". Kerjakan satu level quiz agar namamu muncul di leaderboard.";
        } else {
          leaderboardUserLabelEl.textContent =
            "Kamu: " +
            username +
            " · Quiz selesai: " +
            stat.totalQuizzes +
            " · Benar: " +
            stat.totalCorrect +
            " · Akurasi: " +
            formatPercent(stat.totalCorrect, stat.totalQuestions);
        }
      }
    }
  }

  function renderHeroStats() {
    if (!statTotalQuizzesEl || !statTotalCorrectEl || !statAccuracyEl) return;
    var username = loadUsername().trim();
    if (!username) {
      statTotalQuizzesEl.textContent = "0";
      statTotalCorrectEl.textContent = "0";
      statAccuracyEl.textContent = "0%";
      return;
    }
    var stat = getUserStat(username);
    if (!stat) {
      statTotalQuizzesEl.textContent = "0";
      statTotalCorrectEl.textContent = "0";
      statAccuracyEl.textContent = "0%";
      return;
    }
    statTotalQuizzesEl.textContent = String(stat.totalQuizzes);
    statTotalCorrectEl.textContent = String(stat.totalCorrect);
    statAccuracyEl.textContent = formatPercent(stat.totalCorrect, stat.totalQuestions);
  }

  function resetAllData() {
    try {
      if ("localStorage" in window) {
        window.localStorage.removeItem(STORAGE_KEY_STATS);
      }
    } catch (e) {
      // abaikan
    }
    leaderboard = [];
    renderLeaderboard();
    renderHeroStats();
  }

  // ------------------------------------------------------------
  // Username box
  // ------------------------------------------------------------

  function initUsernameBox() {
    var input = $("#quiz-username");
    var saveBtn = $("#quiz-save-name");
    var stored = loadUsername();
    if (input) {
      input.value = stored;
    }
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        if (!input) return;
        var name = (input.value || "").trim();
        if (!name) {
          saveUsername("");
          renderLeaderboard();
          renderHeroStats();
          return;
        }
        saveUsername(name);
        renderLeaderboard();
        renderHeroStats();
      });
    }
  }

  // ------------------------------------------------------------
  // Navigasi scroll sederhana
  // ------------------------------------------------------------

  function scrollToSection(target) {
    if (target === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    var id = target;
    if (target === "levels") id = "levels-section";
    if (target === "leaderboard") id = "leaderboard-section";

    var el = document.getElementById(id);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function initNavButtons() {
    var buttons = document.querySelectorAll("[data-nav-target]");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-nav-target");
        if (!target) return;
        scrollToSection(target);
        buttons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      });
    });
  }

  // ------------------------------------------------------------
  // Tombol mulai utama
  // ------------------------------------------------------------

  function initPrimaryStartButton() {
    var btn = $("#quiz-start-primary");
    if (!btn) return;
    btn.addEventListener("click", function () {
      startLevel("level-1");
    });
  }

  // ------------------------------------------------------------
  // Tombol reset leaderboard
  // ------------------------------------------------------------

  function initLeaderboardResetButton() {
    var btn = $("#leaderboard-reset");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (window.confirm("Yakin ingin menghapus semua data leaderboard di perangkat ini?")) {
        resetAllData();
      }
    });
  }

  // ------------------------------------------------------------
  // Init utama
  // ------------------------------------------------------------

  function init() {
    loadLeaderboard();
    renderLevels();
    initUsernameBox();
    initNavButtons();
    initPrimaryStartButton();
    initLeaderboardResetButton();
    renderLeaderboard();
    renderHeroStats();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();