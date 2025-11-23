(function () {
  "use strict";

  var STORAGE_KEY = "anime-cms-data-v1";

  function $(selector) {
    return document.querySelector(selector);
  }

  function getFields() {
    return document.querySelectorAll("[data-admin-field]");
  }

  function getListContainer() {
    return document.querySelector("[data-admin-list]");
  }

  function readForm() {
    var data = {};
    var fields = getFields();
    for (var i = 0; i &lt; fields.length; i++) {
      var el = fields[i];
      var key = el.getAttribute("data-admin-field");
      if (!key) continue;
      if (el.type === "checkbox") {
        data[key] = !!el.checked;
      } else {
        data[key] = el.value;
      }
    }

    // Normalisasi tipe
    if (data.id) data.id = String(data.id).trim();
    if (data.title) data.title = String(data.title).trim();
    if (data.altTitle) data.altTitle = String(data.altTitle).trim();
    if (data.type) data.type = String(data.type).trim();
    if (data.quality) data.quality = String(data.quality).trim();
    if (data.section) data.section = String(data.section).trim();
    if (data.status) data.status = String(data.status).trim();

    if (data.score !== "" &amp;&amp; data.score != null) {
      data.score = parseFloat(data.score);
      if (isNaN(data.score)) data.score = null;
    } else {
      data.score = null;
    }

    if (data.episodesAired !== "" &amp;&amp; data.episodesAired != null) {
      data.episodesAired = parseInt(data.episodesAired, 10);
      if (isNaN(data.episodesAired)) data.episodesAired = null;
    } else {
      data.episodesAired = null;
    }

    if (data.episodesTotal !== "" &amp;&amp; data.episodesTotal != null) {
      data.episodesTotal = parseInt(data.episodesTotal, 10);
      if (isNaN(data.episodesTotal)) data.episodesTotal = null;
    } else {
      data.episodesTotal = null;
    }

    if (data.viewsSeason !== "" &amp;&amp; data.viewsSeason != null) {
      data.viewsSeason = parseInt(data.viewsSeason, 10);
      if (isNaN(data.viewsSeason)) data.viewsSeason = null;
    } else {
      data.viewsSeason = null;
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
    for (var i = 0; i &lt; fields.length; i++) {
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
    var status = $("#admin-status");
    if (status) status.textContent = "Mode: tambah baru";
  }

  function loadStorage() {
    try {
      if (!("localStorage" in window)) return [];
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      return [];
    }
  }

  function saveStorage(list) {
    try {
      if (!("localStorage" in window)) return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore quota errors
    }
  }

  function upsertAnime(list, anime) {
    var idx = -1;
    for (var i = 0; i &lt; list.length; i++) {
      if (list[i].id === anime.id) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      list.push(anime);
    } else {
      list[idx] = anime;
    }
    return list;
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

  function renderList() {
    var container = getListContainer();
    if (!container) return;
    var list = loadStorage();
    container.innerHTML = "";

    var countLabel = $("#admin-count");
    if (countLabel) {
      countLabel.textContent = list.length ? list.length + " judul" : "Belum ada data custom";
    }

    if (!list.length) {
      var empty = document.createElement("p");
      empty.className = "admin-small";
      empty.textContent = "Belum ada anime di localStorage. Simpan dari form untuk mengganti data default.";
      container.appendChild(empty);
      return;
    }

    // urutkan by title
    list.sort(function (a, b) {
      var ta = (a.title || "").toLowerCase();
      var tb = (b.title || "").toLowerCase();
      if (ta &lt; tb) return -1;
      if (ta &gt; tb) return 1;
      return 0;
    });

    for (var i = 0; i &lt; list.length; i++) {
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
          var status = $("#admin-status");
          if (status) status.textContent = "Mode: edit — " + (anime.title || anime.id);
        });

        var deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "button button--ghost";
        deleteBtn.textContent = "Hapus";
        deleteBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          if (!window.confirm("Yakin ingin menghapus \"" + (anime.title || anime.id) + "\" dari data lokal?")) {
            return;
          }
          var current = loadStorage();
          var filtered = [];
          for (var j = 0; j &lt; current.length; j++) {
            if (current[j].id !== anime.id) filtered.push(current[j]);
          }
          saveStorage(filtered);
          renderList();
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        row.appendChild(main);
        row.appendChild(actions);
        row.addEventListener("click", function () {
          writeForm(anime);
          var status = $("#admin-status");
          if (status) status.textContent = "Mode: edit — " + (anime.title || anime.id);
        });

        container.appendChild(row);
      })(list[i]);
    }
  }

  function initEvents() {
    var saveBtn = document.querySelector("[data-admin-action='save']");
    var resetFormBtn = document.querySelector("[data-admin-action='reset-form']");
    var resetStorageBtn = document.querySelector("[data-admin-action='reset-storage']");

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var anime = readForm();
        var error = validateAnime(anime);
        if (error) {
          window.alert(error);
          return;
        }

        // jika featured, pastikan yang lain tidak featured
        var list = loadStorage();
        if (anime.featured) {
          for (var i = 0; i &lt; list.length; i++) {
            list[i].featured = list[i].id === anime.id;
          }
        }

        list = upsertAnime(list, anime);
        saveStorage(list);
        renderList();
        var status = $("#admin-status");
        if (status) status.textContent = "Mode: edit — " + (anime.title || anime.id);
        window.alert("Data anime tersimpan ke localStorage. Buka / refresh halaman utama untuk melihat perubahan.");
      });
    }

    if (resetFormBtn) {
      resetFormBtn.addEventListener("click", function () {
        clearForm();
      });
    }

    if (resetStorageBtn) {
      resetStorageBtn.addEventListener("click", function () {
        if (
          !window.confirm(
            "Ini akan menghapus seluruh data anime yang tersimpan di localStorage dan kembali ke data default kode.\nLanjutkan?"
          )
        ) {
          return;
        }
        try {
          if ("localStorage" in window) {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          // ignore
        }
        clearForm();
        renderList();
        window.alert("Data lokal dihapus. Beranda akan kembali menggunakan data bawaan.");
      });
    }
  }

  function init() {
    clearForm();
    renderList();
    initEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();