(function () {
  "use strict";

  var API_BASE = "/api";
  var currentEditingId = null;
  var currentList = [];

  function $(selector) {
    return document.querySelector(selector);
  }

  function getFields() {
    return document.querySelectorAll("[data-admin-field]");
  }

  function getListContainer() {
    return document.querySelector("[data-admin-list]");
  }

  function getLoginField(name) {
    return document.querySelector('[data-admin-login="' + name + '"]');
  }

  function readForm() {
    var data = {};
    var fields = getFields();
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      var key = el.getAttribute("data-admin-field");
      if (!key) continue;
      if (el.type === "checkbox") {
        data[key] = !!el.checked;
      } else {
        data[key] = el.value;
      }
    }

    if (data.id) data.id = String(data.id).trim();
    if (data.title) data.title = String(data.title).trim();
    if (data.altTitle) data.altTitle = String(data.altTitle).trim();
    if (data.type) data.type = String(data.type).trim();
    if (data.quality) data.quality = String(data.quality).trim();
    if (data.section) data.section = String(data.section).trim();
    if (data.status) data.status = String(data.status).trim();

    if (data.score !== "" && data.score != null) {
      data.score = parseFloat(data.score);
      if (isNaN(data.score)) data.score = null;
    } else {
      data.score = null;
    }

    if (data.episodesAired !== "" && data.episodesAired != null) {
      data.episodesAired = parseInt(data.episodesAired, 10);
      if (isNaN(data.episodesAired)) data.episodesAired = null;
    } else {
      data.episodesAired = null;
    }

    if (data.episodesTotal !== "" && data.episodesTotal != null) {
      data.episodesTotal = parseInt(data.episodesTotal, 10);
      if (isNaN(data.episodesTotal)) data.episodesTotal = null;
    } else {
      data.episodesTotal = null;
    }

    if (data.viewsSeason !== "" && data.viewsSeason != null) {
      data.viewsSeason = parseInt(data.viewsSeason, 10);
      if (isNaN(data.viewsSeason)) data.viewsSeason = 0;
    } else {
      data.viewsSeason = 0;
    }

    if (data.genres) {
      var rawGenres = String(data.genres)
        .split(",")
        .map(function (g) {
          return g.trim();
        })
        .filter(Boolean);
      data.genres = rawGenres;
    } else {
      data.genres = [];
    }

    if (data.seasonLabel) data.seasonLabel = String(data.seasonLabel).trim();
    if (data.seasonKey) data.seasonKey = String(data.seasonKey).trim();
    if (data.description) data.description = String(data.description).trim();
    if (data.colorKey) data.colorKey = String(data.colorKey).trim() || "orange";

    return data;
  }

  function writeForm(anime) {
    var fields = getFields();
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      var key = el.getAttribute("data-admin-field");
      if (!key) continue;
      var value = anime[key];

      if (el.type === "checkbox") {
        el.checked = !!value;
      } else if (key === "genres") {
        el.value = Array.isArray(anime.genres) ? anime.genres.join(", ") : "";
      } else if (
        key === "score" ||
        key === "episodesAired" ||
        key === "episodesTotal" ||
        key === "viewsSeason"
      ) {
        el.value = value != null ? value : "";
      } else {
        el.value = value != null ? value : "";
      }
    }
  }

  function clearForm() {
    writeForm({
      id: "",
      title: "",
      altTitle: "",
      type: "TV",
      quality: "HD",
      section: "ongoing",
      status: "ongoing",
      score: "",
      episodesAired: "",
      episodesTotal: "",
      seasonLabel: "",
      seasonKey: "",
      viewsSeason: "",
      genres: [],
      description: "",
      featured: false,
      colorKey: ""
    });
    currentEditingId = null;
    var status = $("#admin-status");
    if (status) status.textContent = "Mode: tambah baru";
  }

  function validateAnime(anime) {
    if (!anime.id) {
      return "ID wajib diisi.";
    }
    if (!anime.title) {
      return "Judul wajib diisi.";
    }
    if (!anime.section) {
      return "Section wajib diisi (ongoing/finished/movie).";
    }
    return null;
  }

  function renderListFromState(loggedIn) {
    var container = getListContainer();
    if (!container) return;
    container.innerHTML = "";

    var countLabel = $("#admin-count");

    if (!loggedIn) {
      if (countLabel) countLabel.textContent = "Harus login";
      var info = document.createElement("p");
      info.className = "admin-small";
      info.textContent = "Masuk sebagai admin untuk melihat dan mengubah daftar anime.";
      container.appendChild(info);
      return;
    }

    var list = currentList || [];
    if (countLabel) {
      countLabel.textContent = list.length ? list.length + " judul" : "Belum ada data";
    }

    if (!list.length) {
      var empty = document.createElement("p");
      empty.className = "admin-small";
      empty.textContent = "Belum ada anime di database. Tambah dari form di sebelah kiri.";
      container.appendChild(empty);
      return;
    }

    list.sort(function (a, b) {
      var ta = (a.title || "").toLowerCase();
      var tb = (b.title || "").toLowerCase();
      if (ta < tb) return -1;
      if (ta > tb) return 1;
      return 0;
    });

    for (var i = 0; i < list.length; i++) {
      (function (anime) {
        var row = document.createElement("div");
        row.className = "admin-list-item";

        var main = document.createElement("div");
        main.className = "admin-list-item-main";

        var title = document.createElement("p");
        title.className = "admin-list-item-title";
        title.textContent = anime.title || anime.id;

        var meta = document.createElement("p");
        meta.className = "admin-list-item-meta";
        var parts = [];
        if (anime.section) parts.push(anime.section);
        if (anime.type) parts.push(anime.type);
        if (typeof anime.score === "number") parts.push("Skor " + anime.score.toFixed(2));
        meta.textContent = parts.join(" • ");

        main.appendChild(title);
        main.appendChild(meta);

        var actions = document.createElement("div");

        if (anime.featured) {
          var badge = document.createElement("span");
          badge.className = "admin-pill";
          badge.textContent = "Unggulan";
          actions.appendChild(badge);
        }

        var editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "button button--ghost";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          writeForm(anime);
          currentEditingId = anime.id;
          var status = $("#admin-status");
          if (status) status.textContent = "Mode: edit — " + (anime.title || anime.id);
        });

        var deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "button button--ghost";
        deleteBtn.textContent = "Hapus";
        deleteBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          if (!window.confirm('Yakin ingin menghapus "' + (anime.title || anime.id) + '" dari database?')) {
            return;
          }
          fetch(API_BASE + "/anime.php?id=" + encodeURIComponent(anime.id), {
            method: "DELETE"
          })
            .then(function (res) {
              if (res.status === 401) {
                throw new Error("Sesi login berakhir. Silakan login lagi.");
              }
              if (!res.ok) {
                return res
                  .json()
                  .catch(function () {
                    return { error: "Gagal menghapus data." };
                  })
                  .then(function (body) {
                    throw new Error(body.error || "Gagal menghapus data.");
                  });
              }
              currentList = currentList.filter(function (item) {
                return item.id !== anime.id;
              });
              renderListFromState(true);
            })
            .catch(function (err) {
              window.alert(err.message || "Gagal menghapus data.");
            });
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        row.appendChild(main);
        row.appendChild(actions);
        row.addEventListener("click", function () {
          writeForm(anime);
          currentEditingId = anime.id;
          var status = $("#admin-status");
          if (status) status.textContent = "Mode: edit — " + (anime.title || anime.id);
        });

        container.appendChild(row);
      })(list[i]);
    }
  }

  function loadAnimeList() {
    var container = getListContainer();
    var countLabel = $("#admin-count");
    if (!container) return Promise.resolve();

    if (countLabel) countLabel.textContent = "Memuat...";
    container.innerHTML = "";

    return fetch(API_BASE + "/anime.php")
      .then(function (res) {
        if (res.status === 401) {
          throw new Error("Sesi login berakhir. Silakan login lagi.");
        }
        if (!res.ok) {
          throw new Error("Gagal memuat data (status " + res.status + ")");
        }
        return res.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) data = [];
        currentList = data;
        renderListFromState(true);
      })
      .catch(function (err) {
        if (countLabel) countLabel.textContent = "Gagal memuat data: " + err.message;
      });
  }

  function checkLoginAndInitList() {
    return fetch(API_BASE + "/auth.php")
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Gagal mengecek sesi login.");
        }
        return res.json();
      })
      .then(function (data) {
        var loggedIn = !!data.logged_in;
        if (loggedIn) {
          var loginCard = document.getElementById("admin-login-card");
          if (loginCard) {
            loginCard.style.display = "none";
          }
          return loadAnimeList();
        } else {
          renderListFromState(false);
        }
      })
      .catch(function () {
        renderListFromState(false);
      });
  }

  function handleLogin() {
    var usernameInput = getLoginField("username");
    var passwordInput = getLoginField("password");
    var statusEl = $("#admin-login-status");

    var username = usernameInput ? String(usernameInput.value || "").trim() : "";
    var password = passwordInput ? String(passwordInput.value || "") : "";

    if (!username || !password) {
      window.alert("Username dan password wajib diisi.");
      return;
    }

    if (statusEl) statusEl.textContent = "Mengirim...";

    fetch(API_BASE + "/auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(function (res) {
        if (!res.ok) {
          return res
            .json()
            .catch(function () {
              return { error: "Login gagal" };
            })
            .then(function (body) {
              throw new Error(body.error || "Login gagal");
            });
        }
        return res.json();
      })
      .then(function () {
        if (statusEl) statusEl.textContent = "Login berhasil";
        var loginCard = document.getElementById("admin-login-card");
        if (loginCard) {
          loginCard.style.display = "none";
        }
        return loadAnimeList();
      })
      .catch(function (err) {
        if (statusEl) statusEl.textContent = err.message || "Login gagal";
      });
  }

  function initEvents() {
    var saveBtn = document.querySelector("[data-admin-action='save']");
    var resetFormBtn = document.querySelector("[data-admin-action='reset-form']");
    var reloadBtn = document.querySelector("[data-admin-action='reload']");
    var loginBtn = document.querySelector("[data-admin-action='login']");

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var anime = readForm();
        var error = validateAnime(anime);
        if (error) {
          window.alert(error);
          return;
        }

        var isEditing = !!currentEditingId;
        var method = isEditing ? "PUT" : "POST";
        var url = API_BASE + "/anime.php" + (isEditing ? "?id=" + encodeURIComponent(currentEditingId) : "");

        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(anime)
        })
          .then(function (res) {
            if (res.status === 401) {
              throw new Error("Sesi login berakhir. Silakan login lagi.");
            }
            if (!res.ok) {
              return res
                .json()
                .catch(function () {
                  return { error: "Gagal menyimpan data." };
                })
                .then(function (body) {
                  throw new Error(body.error || "Gagal menyimpan data.");
                });
            }
            return res.json().catch(function () {
              return {};
            });
          })
          .then(function () {
            currentEditingId = anime.id;
            var status = $("#admin-status");
            if (status) status.textContent = "Mode: edit — " + (anime.title || anime.id);
            window.alert("Data anime tersimpan di database.");
            return loadAnimeList();
          })
          .catch(function (err) {
            window.alert(err.message || "Gagal menyimpan data.");
          });
      });
    }

    if (resetFormBtn) {
      resetFormBtn.addEventListener("click", function () {
        clearForm();
      });
    }

    if (reloadBtn) {
      reloadBtn.addEventListener("click", function () {
        loadAnimeList();
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        handleLogin();
      });
    }
  }

  function init() {
    clearForm();
    initEvents();
    checkLoginAndInitList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();