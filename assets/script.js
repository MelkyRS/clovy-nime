(function () {
  "use strict";

  // ------------------------------------------------------------
  // Data model
  // ------------------------------------------------------------

  /**
   * Static example data. Replace with your own API/data layer as needed.
   * Names are used as examples only; no external streaming is wired in.
   */
  var animeList = [
    {
      id: "koutetsujou-no-kabaneri",
      title: "Koutetsujou no Kabaneri",
      altTitle: "Kabaneri of the Iron Fortress",
      type: "TV",
      quality: "HD",
      section: "ongoing",
      status: "ongoing",
      score: 7.2,
      episodesAired: 7,
      episodesTotal: 12,
      seasonLabel: "Musim Semi 2025",
      seasonKey: "spring-2025",
      viewsSeason: 120000,
      genres: ["Action", "Fantasy", "Horror", "Survival"],
      description:
        "Di dunia yang dilanda makhluk mirip zombie, umat manusia bertahan di dalam stasiun dan kereta lapis baja.",
      colorKey: "orange",
      featured: true
    },
    {
      id: "ao-no-orchestra-season-2",
      title: "Ao no Orchestra Season 2",
      altTitle: "Blue Orchestra Season 2",
      type: "TV",
      quality: "HD",
      section: "ongoing",
      status: "ongoing",
      score: 7.8,
      episodesAired: 8,
      episodesTotal: 21,
      seasonLabel: "Musim Gugur 2025",
      seasonKey: "fall-2025",
      viewsSeason: 90000,
      genres: ["Drama", "Music", "School"],
      description:
        "Orkestra sekolah kembali dengan persaingan baru, lagu yang lebih sulit, dan konflik di antara para pemainnya.",
      colorKey: "purple"
    },
    {
      id: "uma-musume-cinderella-gray-part-2",
      title: "Uma Musume: Cinderella Gray Part 2",
      type: "TV",
      quality: "HD",
      section: "ongoing",
      status: "ongoing",
      score: 7.1,
      episodesAired: 6,
      episodesTotal: 10,
      seasonLabel: "Musim Gugur 2025",
      seasonKey: "fall-2025",
      viewsSeason: 65000,
      genres: ["Sports", "Drama"],
      description:
        "Para horse girl berlatih lebih keras untuk mengejar kemenangan besar berikutnya di lintasan balap.",
      colorKey: "blue"
    },
    {
      id: "digimon-beatbreak",
      title: "Digimon Beatbreak",
      type: "TV",
      quality: "HD",
      section: "ongoing",
      status: "ongoing",
      score: 7.0,
      episodesAired: 8,
      episodesTotal: null,
      seasonLabel: "Musim Gugur 2025",
      seasonKey: "fall-2025",
      viewsSeason: 30000,
      genres: ["Action", "Adventure"],
      description:
        "Pertarungan digital baru dimulai ketika para Digimon muncul mengikuti irama musik yang menggetarkan dunia.",
      colorKey: "teal"
    },
    {
      id: "henjin-no-salad-bowl",
      title: "Henjin no Salad Bowl",
      type: "TV",
      quality: "BD",
      section: "finished",
      status: "finished",
      score: 7.16,
      episodesAired: 12,
      episodesTotal: 12,
      seasonLabel: "Musim Semi",
      seasonKey: "spring-2024",
      viewsSeason: 86749,
      genres: ["Comedy", "Fantasy"],
      description:
        "Seorang pemuda biasa tiba-tiba hidup serumah dengan para penghuni dunia lain yang eksentrik.",
      colorKey: "green"
    },
    {
      id: "maou-no-ore-ga-dorei-elf",
      title: "Maou no Ore ga Dorei Elf wo Yome ni Shitanda ga, Dou Medereba Ii?",
      type: "TV",
      quality: "BD",
      section: "finished",
      status: "finished",
      score: 7.29,
      episodesAired: 12,
      episodesTotal: 12,
      seasonLabel: "Musim Panas",
      seasonKey: "summer-2024",
      viewsSeason: 235199,
      genres: ["Fantasy", "Romance", "Comedy"],
      description:
        "Seorang pria yang dijuluki raja iblis berusaha menjalani kehidupan tenang bersama elf yang ia jadikan istrinya.",
      colorKey: "rose"
    },
    {
      id: "bang-dream-its-mygo-movie",
      title: "BanG Dream! It's MyGO!!!!! Movie",
      type: "Movie",
      quality: "BD",
      section: "movie",
      status: "finished",
      score: 6.91,
      episodesAired: 1,
      episodesTotal: 1,
      seasonLabel: "Movie",
      seasonKey: "movie-2025",
      viewsSeason: 5000,
      genres: ["Music", "Drama"],
      description:
        "Grup MyGO!!!!! naik ke panggung layar lebar dengan penampilan yang menggabungkan luka lama dan harapan baru.",
      colorKey: "gold"
    },
    {
      id: "higurashi-outbreak",
      title: "Higurashi no Naku Koro ni Kaku: Outbreak",
      type: "Movie",
      quality: "DVD",
      section: "movie",
      status: "finished",
      score: 7.2,
      episodesAired: 1,
      episodesTotal: 1,
      seasonLabel: "Movie",
      seasonKey: "movie-2013",
      viewsSeason: 15000,
      genres: ["Horror", "Mystery", "Supernatural"],
      description:
        "Sebuah wabah misterius membuat desa terpencil kembali dipenuhi kecurigaan dan teror tanpa akhir.",
      colorKey: "blue"
    }
  ];

  var episodeComments = [
    {
      id: "c-ep-1",
      animeId: "koutetsujou-no-kabaneri",
      episode: 7,
      user: "Edward Elric",
      timeAgo: "45 menit yang lalu",
      text: "Tegang dari awal sampai akhir. Pace episodenya pas banget."
    },
    {
      id: "c-ep-2",
      animeId: "ao-no-orchestra-season-2",
      episode: 8,
      user: "Kurumi",
      timeAgo: "1 jam yang lalu",
      text: "Latihan orkestra di episode ini bikin merinding."
    },
    {
      id: "c-ep-3",
      animeId: "digimon-beatbreak",
      episode: 8,
      user: "Uzumaki Naruto",
      timeAgo: "2 jam yang lalu",
      text: "Suka banget sama konsep battle yang sinkron sama musik."
    }
  ];

  var animeComments = [
    {
      id: "c-anime-1",
      animeId: "henjin-no-salad-bowl",
      user: "Izz Naufal",
      timeAgo: "6 jam yang lalu",
      score: 7.3,
      text: "Komedinya ringan tapi karakternya surprisingly hangat."
    },
    {
      id: "c-anime-2",
      animeId: "maou-no-ore-ga-dorei-elf",
      user: "Sora",
      timeAgo: "20 jam yang lalu",
      score: 7.4,
      text: "Dinamikanya lucu, tapi ada beberapa momen yang cukup menyentuh."
    },
    {
      id: "c-anime-3",
      animeId: "bang-dream-its-mygo-movie",
      user: "Liscia",
      timeAgo: "1 hari yang lalu",
      score: 7.0,
      text: "Konser klimaksnya keren, apalagi dengan visual layar lebar."
    }
  ];

  var chatSeed = [
    {
      id: "sys-1",
      author: "Sistem",
      role: "system",
      timeAgo: "",
      text: "Selamat datang di ruang ngobrol contoh. Jaga sopan santun dan hindari spoiler berlebihan."
    },
    {
      id: "chat-1",
      author: "Kurama",
      role: "user",
      timeAgo: "2 menit lalu",
      text: "Baru selesai nonton episode terbaru, opening-nya nempel di kepala."
    },
    {
      id: "chat-2",
      author: "Miko",
      role: "user",
      timeAgo: "1 menit lalu",
      text: "Ada rekomendasi anime isekai yang santai?"
    }
  ];

  // Map for quick lookup and optional override from backend API
  var animeById = {};

  function rebuildAnimeIndex() {
    animeById = {};
    for (var i = 0; i < animeList.length; i++) {
      var item = animeList[i];
      if (item && item.id) {
        animeById[item.id] = item;
      }
    }
  }

  rebuildAnimeIndex();

  var API_BASE = "/api";

  function applyAnimeListFromApi(list) {
    if (!Array.isArray(list) || !list.length) return;
    animeList = list;
    rebuildAnimeIndex();
  }

  function fetchAnimeFromApi() {
    if (!("fetch" in window)) {
      return Promise.resolve();
    }
    return fetch(API_BASE + "/anime.php")
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Gagal memuat data anime dari API");
        }
        return res.json();
      })
      .then(function (data) {
        if (Array.isArray(data) && data.length) {
          applyAnimeListFromApi(data);
        }
      });
  }

  // ------------------------------------------------------------
  // DOM helpers
  // ------------------------------------------------------------

  function $(selector) {
    return document.querySelector(selector);
  }

  function formatNumber(n) {
    if (typeof n !== "number") return "";
    return n.toLocaleString("id-ID");
  }

  function buildBadgeHtml(text, extraClass) {
    if (!text) return "";
    var cls = "badge";
    if (extraClass) cls += " " + extraClass;
    return '<span class="' + cls + '">' + text + "</span>";
  }

  function formatEpisodeLabel(anime) {
    if (!anime) return "";
    var epLabel = "";
    if (anime.episodesAired && anime.episodesTotal) {
      epLabel = "Ep " + anime.episodesAired + " / " + anime.episodesTotal;
    } else if (anime.episodesAired) {
      epLabel = "Ep " + anime.episodesAired;
    }
    var statusLabel = "";
    if (anime.status === "finished") statusLabel = "SELESAI";
    else if (anime.status === "ongoing") statusLabel = "SEDANG TAYANG";

    if (epLabel && statusLabel) return epLabel + " \u2022 " + statusLabel;
    return epLabel || statusLabel;
  }

  function createAnimeCard(anime) {
    var card = document.createElement("article");
    card.className = "anime-card";
    card.setAttribute("data-id", anime.id);

    var badges = [];
    if (anime.type) badges.push(buildBadgeHtml(anime.type, "badge-type"));
    if (anime.quality) badges.push(buildBadgeHtml(anime.quality, "badge-quality"));
    if (typeof anime.score === "number") badges.push(buildBadgeHtml(anime.score.toFixed(2), "badge-score"));

    var subtitleParts = [];
    var epLabel = formatEpisodeLabel(anime);
    if (epLabel) subtitleParts.push(epLabel);
    if (typeof anime.viewsSeason === "number") {
      subtitleParts.push(formatNumber(anime.viewsSeason) + " penayangan");
    }
    var subtitle = subtitleParts.join(" \u2022 ");

    var genres = anime.genres || [];
    var genreChips = [];
    for (var i = 0; i < genres.length && i < 3; i++) {
      genreChips.push('<span class="chip chip--small">' + genres[i] + "</span>");
    }

    var colorKey = anime.colorKey || "orange";

    card.innerHTML =
      '<div class="anime-card-cover cover-' +
      colorKey +
      '">' +
      '<div class="anime-card-cover-overlay">' +
      '<span class="anime-card-pill">Tonton</span>' +
      "</div>" +
      "</div>" +
      '<div class="anime-card-body">' +
      '<div class="anime-card-meta">' +
      badges.join("") +
      "</div>" +
      '<h3 class="anime-card-title">' +
      anime.title +
      "</h3>" +
      '<p class="anime-card-subtitle">' +
      (subtitle || "") +
      "</p>" +
      '<div class="anime-card-genres">' +
      genreChips.join("") +
      "</div>" +
      "</div>";

    card.addEventListener("click", function () {
      openDetailModal(anime.id);
    });

    return card;
  }

  // ------------------------------------------------------------
  // Hero section
  // ------------------------------------------------------------

  var heroTitleEl = $('[data-role="hero-title"]');
  var heroDescriptionEl = $('[data-role="hero-description"]');
  var heroTagsEl = $('[data-role="hero-tags"]');
  var heroCoverEl = $('[data-role="hero-cover"]');
  var heroCoverTitleEl = $('[data-role="hero-cover-title"]');
  var heroCoverMetaEl = $('[data-role="hero-cover-meta"]');
  var heroScoreEl = $('[data-role="hero-score"]');
  var heroEpisodesEl = $('[data-role="hero-episodes"]');
  var heroSeasonEl = $('[data-role="hero-season"]');
  var heroWatchBtn = $('[data-role="hero-watch"]');
  var heroDetailsBtn = $('[data-role="hero-details"]');

  function initHero() {
    var featured = null;
    for (var i = 0; i < animeList.length; i++) {
      if (animeList[i].featured) {
        featured = animeList[i];
        break;
      }
    }
    if (!featured && animeList.length) {
      featured = animeList[0];
    }
    if (!featured) return;

    if (heroTitleEl) heroTitleEl.textContent = featured.title;
    if (heroDescriptionEl) heroDescriptionEl.textContent = featured.description || "";

    if (heroTagsEl) {
      var tags = [];
      tags.push(buildBadgeHtml(featured.type, "badge-type"));
      tags.push(buildBadgeHtml(featured.quality, "badge-quality"));
      if (typeof featured.score === "number") {
        tags.push(buildBadgeHtml(featured.score.toFixed(2), "badge-score"));
      }
      heroTagsEl.innerHTML = tags.join("");
    }

    if (heroCoverEl && featured.colorKey) {
      heroCoverEl.classList.add("cover-" + featured.colorKey);
    }
    if (heroCoverTitleEl) heroCoverTitleEl.textContent = featured.title;
    if (heroCoverMetaEl) heroCoverMetaEl.textContent = formatEpisodeLabel(featured);

    if (heroScoreEl) heroScoreEl.textContent = typeof featured.score === "number" ? featured.score.toFixed(2) : "-";
    if (heroEpisodesEl) {
      var totalEp = featured.episodesTotal || featured.episodesAired || 0;
      heroEpisodesEl.textContent = totalEp ? totalEp + " eps" : "-";
    }
    if (heroSeasonEl) heroSeasonEl.textContent = featured.seasonLabel || "-";

    if (heroWatchBtn) {
      heroWatchBtn.addEventListener("click", function () {
        var ep = featured.episodesAired || featured.episodesTotal || 1;
        openPlayerModal(featured, ep);
      });
    }
    if (heroDetailsBtn) {
      heroDetailsBtn.addEventListener("click", function () {
        openDetailModal(featured.id);
      });
    }
  }

  // ------------------------------------------------------------
  // Sections (ongoing, finished, movies, most viewed)
  // ------------------------------------------------------------

  function renderSection(sectionKey, slotSelector) {
    var slot = $('[data-slot="' + slotSelector + '"]');
    if (!slot) return;
    slot.innerHTML = "";
    for (var i = 0; i < animeList.length; i++) {
      if (animeList[i].section === sectionKey) {
        slot.appendChild(createAnimeCard(animeList[i]));
      }
    }
  }

  function computeMostViewedThisSeason() {
    var arr = [];
    for (var i = 0; i < animeList.length; i++) {
      if (animeList[i].seasonKey === "fall-2025") {
        arr.push(animeList[i]);
      }
    }
    arr.sort(function (a, b) {
      var va = typeof a.viewsSeason === "number" ? a.viewsSeason : 0;
      var vb = typeof b.viewsSeason === "number" ? b.viewsSeason : 0;
      return vb - va;
    });
    return arr;
  }

  function renderMostViewedGrid() {
    var slot = $('[data-slot="most-viewed"]');
    if (!slot) return;
    slot.innerHTML = "";
    var list = computeMostViewedThisSeason();
    for (var i = 0; i < list.length; i++) {
      slot.appendChild(createAnimeCard(list[i]));
    }
  }

  // ------------------------------------------------------------
  // Comments
  // ------------------------------------------------------------

  function renderEpisodeComments() {
    var slot = $('[data-slot="episode-comments"]');
    if (!slot) return;
    slot.innerHTML = "";
    for (var i = 0; i < episodeComments.length; i++) {
      var c = episodeComments[i];
      var anime = animeById[c.animeId];

      var card = document.createElement("article");
      card.className = "comment-card";

      var badgeType = anime ? anime.type : "";
      var badgeQuality = anime ? anime.quality : "";

      var html = "";
      html += '<div class="comment-pill-row">';
      html += buildBadgeHtml(badgeType, "badge-type");
      html += buildBadgeHtml(badgeQuality, "badge-quality");
      html += "</div>";

      html += '<h3 class="comment-title">';
      html += anime ? anime.title : "Anime";
      html += ' <span class="comment-episode">Episode ' + c.episode + "</span>";
      html += "</h3>";

      html += '<p class="comment-text">' + (c.text || "") + "</p>";
      html += '<p class="comment-meta">';
      html += '<span class="comment-user">' + c.user + "</span>";
      html += " \u2022 ";
      html += '<span class="comment-time">' + c.timeAgo + "</span>";
      html += "</p>";

      card.innerHTML = html;
      slot.appendChild(card);
    }
  }

  function renderAnimeComments() {
    var slot = $('[data-slot="anime-comments"]');
    if (!slot) return;
    slot.innerHTML = "";
    for (var i = 0; i < animeComments.length; i++) {
      var c = animeComments[i];
      var anime = animeById[c.animeId];

      var card = document.createElement("article");
      card.className = "comment-card";

      var badgeType = anime ? anime.type : "";
      var badgeQuality = anime ? anime.quality : "";

      var html = "";
      html += '<div class="comment-pill-row">';
      html += buildBadgeHtml(badgeType, "badge-type");
      html += buildBadgeHtml(badgeQuality, "badge-quality");
      if (typeof c.score === "number") {
        html += buildBadgeHtml(c.score.toFixed(2), "badge-score");
      }
      html += "</div>";

      html += '<h3 class="comment-title">';
      html += anime ? anime.title : "Anime";
      html += "</h3>";

      html += '<p class="comment-text">' + (c.text || "") + "</p>";
      html += '<p class="comment-meta">';
      html += '<span class="comment-user">' + c.user + "</span>";
      html += " \u2022 ";
      html += '<span class="comment-time">' + c.timeAgo + "</span>";
      html += "</p>";

      card.innerHTML = html;
      slot.appendChild(card);
    }
  }

  // ------------------------------------------------------------
  // Search + filters + genres
  // ------------------------------------------------------------

  var searchApi = null;

  function initSearch() {
    var input = $('[data-role="search-input"]');
    var section = $('[data-role="search-section"]');
    var heading = $('[data-role="search-heading"]');
    var results = $('[data-role="search-results"]');
    var empty = $('[data-role="search-empty"]');
    var clearBtn = $('[data-role="clear-search"]');

    if (!input || !section || !heading || !results || !empty || !clearBtn) {
      return;
    }

    function showSection() {
      section.classList.remove("is-hidden");
    }

    function hideSection() {
      section.classList.add("is-hidden");
      results.innerHTML = "";
      empty.classList.add("is-hidden");
    }

    function renderList(list, headingText) {
      heading.textContent = headingText;
      results.innerHTML = "";
      if (!list.length) {
        empty.classList.remove("is-hidden");
      } else {
        empty.classList.add("is-hidden");
        for (var i = 0; i < list.length; i++) {
          results.appendChild(createAnimeCard(list[i]));
        }
      }
      showSection();
      try {
        var top = section.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: "smooth" });
      } catch (_) {
        // ignore
      }
    }

    function searchText(query) {
      var q = (query || "").toLowerCase().trim();
      if (!q) {
        hideSection();
        return;
      }
      var matches = [];
      for (var i = 0; i < animeList.length; i++) {
        var a = animeList[i];
        var combined = (a.title + " " + (a.altTitle || "")).toLowerCase();
        if (combined.indexOf(q) !== -1) {
          matches.push(a);
        }
      }
      renderList(matches, 'Hasil untuk "' + query + '"');
    }

    function showSectionFilter(key, label) {
      var list;
      if (key === "season") {
        list = computeMostViewedThisSeason();
      } else {
        list = [];
        for (var i = 0; i < animeList.length; i++) {
          if (animeList[i].section === key) {
            list.push(animeList[i]);
          }
        }
      }
      renderList(list, label);
    }

    function showGenreFilter(genre, label) {
      var g = (genre || "").toLowerCase();
      var matches = [];
      for (var i = 0; i < animeList.length; i++) {
        var a = animeList[i];
        var gs = a.genres || [];
        for (var j = 0; j < gs.length; j++) {
          if (gs[j].toLowerCase() === g) {
            matches.push(a);
            break;
          }
        }
      }
      renderList(matches, label || "Genre: " + genre);
    }

    input.addEventListener("input", function (e) {
      searchText(e.target.value || "");
    });

    clearBtn.addEventListener("click", function () {
      input.value = "";
      hideSection();
    });

    searchApi = {
      searchText: searchText,
      showSection: showSectionFilter,
      showGenre: showGenreFilter
    };
  }

  function initFilterButtons() {
    var buttons = document.querySelectorAll("[data-filter]");
    if (!buttons.length) return;

    function handleClick(e) {
      e.preventDefault();
      if (!searchApi) return;
      var key = this.getAttribute("data-filter");
      if (!key) return;
      var label = "Filter";
      var sectionTitle = this.closest(".section");
      if (sectionTitle) {
        var titleEl = sectionTitle.querySelector(".section-title");
        if (titleEl) label = titleEl.textContent + " - Semua";
      }
      if (key === "season") {
        label = "Dilihat Terbanyak Musim Ini";
        searchApi.showSection("season", label);
      } else {
        searchApi.showSection(key, label);
      }
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", handleClick);
    }
  }

  function initGenreMenu() {
    var menu = $('[data-role="genre-menu"]');
    var toggle = $('[data-nav-toggle="genres"]');
    if (!menu || !toggle) return;

    // collect unique genres
    var seen = {};
    var list = [];
    for (var i = 0; i < animeList.length; i++) {
      var gs = animeList[i].genres || [];
      for (var j = 0; j < gs.length; j++) {
        var g = gs[j];
        if (!seen[g]) {
          seen[g] = true;
          list.push(g);
        }
      }
    }
    list.sort();

    for (var k = 0; k < list.length; k++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = list[k];
      btn.addEventListener("click", (function (genre) {
        return function () {
          if (searchApi) {
            searchApi.showGenre(genre, "Genre: " + genre);
          }
          menu.classList.remove("is-open");
        };
      })(list[k]));
      menu.appendChild(btn);
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("is-open");
    });

    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && e.target !== toggle) {
        menu.classList.remove("is-open");
      }
    });
  }

  // ------------------------------------------------------------
  // Navigation scroll
  // ------------------------------------------------------------

  function initNavScroll() {
    var buttons = document.querySelectorAll("[data-nav-target]");
    if (!buttons.length) return;

    function scrollToSection(target) {
      if (target === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      var id;
      if (target === "ongoing") id = "ongoing-section";
      else if (target === "finished") id = "finished-section";
      else if (target === "movie") id = "movie-section";
      else id = target;

      var el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function handleClick() {
      var target = this.getAttribute("data-nav-target");
      if (!target) return;
      scrollToSection(target);
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle("is-active", buttons[i] === this);
      }
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", handleClick);
    }
  }

  // ------------------------------------------------------------
  // Detail modal + player modal
  // ------------------------------------------------------------

  var detailModal = $('[data-role="detail-modal"]');
  var detailTitleEl = $('[data-role="detail-title"]');
  var detailSubtitleEl = $('[data-role="detail-subtitle"]');
  var detailTagsEl = $('[data-role="detail-tags"]');
  var detailDescriptionEl = $('[data-role="detail-description"]');
  var detailEpisodesEl = $('[data-role="detail-episodes"]');
  var detailCoverEl = $('[data-role="detail-cover"]');
  var detailDownloadEl = $('[data-role="detail-download"]');

  var playerModal = $('[data-role="player-modal"]');
  var playerTitleEl = $('[data-role="player-title"]');

  function openDetailModal(id) {
    if (!detailModal) return;
    var anime = animeById[id];
    if (!anime) return;

    if (detailTitleEl) detailTitleEl.textContent = anime.title;
    var subParts = [];
    if (anime.type) subParts.push(anime.type);
    if (anime.quality) subParts.push(anime.quality);
    if (anime.seasonLabel) subParts.push(anime.seasonLabel);
    if (detailSubtitleEl) detailSubtitleEl.textContent = subParts.join(" \u2022 ");
    if (detailTagsEl) {
      var tags = [];
      if (typeof anime.score === "number") tags.push(buildBadgeHtml("Skor " + anime.score.toFixed(2), "badge-score"));
      var gs = anime.genres || [];
      for (var i = 0; i < gs.length && i < 5; i++) {
        tags.push('<span class="chip chip--small">' + gs[i] + "</span>");
      }
      detailTagsEl.innerHTML = tags.join("");
    }
    if (detailDescriptionEl) {
      detailDescriptionEl.textContent = anime.description || "Belum ada deskripsi.";
    }

    if (detailCoverEl) {
      detailCoverEl.className = "modal-cover";
      if (anime.colorKey) {
        detailCoverEl.classList.add("cover-" + anime.colorKey);
      }
    }

    if (detailEpisodesEl) {
      detailEpisodesEl.innerHTML = "";
      var total = anime.episodesTotal || anime.episodesAired || 1;
      for (var ep = 1; ep &lt;= total; ep++) {
        var li = document.createElement("li");
        li.className = "episode-item";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "episode-button";

        var isReleased = !anime.episodesAired || ep &lt;= anime.episodesAired;
        if (!isReleased) {
          btn.classList.add("episode-button--disabled");
          btn.disabled = true;
        } else {
          (function (a, num) {
            btn.addEventListener("click", function () {
              openPlayerModal(a, num);
            });
          })(anime, ep);
        }

        btn.textContent = "Episode " + ep + (isReleased ? "" : " (Segera)");
        li.appendChild(btn);
        detailEpisodesEl.appendChild(li);
      }
    }

    if (detailDownloadEl) {
      detailDownloadEl.innerHTML = "";
      var links = [
        { key: "download240", label: "240p" },
        { key: "download360", label: "360p" },
        { key: "download480", label: "480p" },
        { key: "download720", label: "720p" }
      ];
      var hasAny = false;
      for (var i = 0; i &lt; links.length; i++) {
        var info = links[i];
        var url = anime[info.key];
        if (!url) continue;
        hasAny = true;
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "button button--primary";
        a.textContent = "Download " + info.label;
        detailDownloadEl.appendChild(a);
      }
      if (!hasAny) {
        detailDownloadEl.textContent = "";
      }
    }

    detailModal.classList.remove("is-hidden");
    detailModal.setAttribute("aria-hidden", "false");
  }

  function closeDetailModal() {
    if (!detailModal) return;
    detailModal.classList.add("is-hidden");
    detailModal.setAttribute("aria-hidden", "true");
  }

  function openPlayerModal(anime, episodeNumber) {
    if (!playerModal || !playerTitleEl) return;
    playerTitleEl.textContent = anime.title + " — Episode " + episodeNumber;
    playerModal.classList.remove("is-hidden");
    playerModal.setAttribute("aria-hidden", "false");
  }

  function closePlayerModal() {
    if (!playerModal) return;
    playerModal.classList.add("is-hidden");
    playerModal.setAttribute("aria-hidden", "true");
  }

  function initModals() {
    if (detailModal) {
      var detailCloseEls = detailModal.querySelectorAll("[data-action='close-detail']");
      for (var i = 0; i < detailCloseEls.length; i++) {
        detailCloseEls[i].addEventListener("click", function () {
          closeDetailModal();
        });
      }
    }
    if (playerModal) {
      var playerCloseEls = playerModal.querySelectorAll("[data-action='close-player']");
      for (var j = 0; j < playerCloseEls.length; j++) {
        playerCloseEls[j].addEventListener("click", function () {
          closePlayerModal();
        });
      }
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDetailModal();
        closePlayerModal();
      }
    });
  }

  // ------------------------------------------------------------
  // Chat
  // ------------------------------------------------------------

  var chatMessagesEl = $('[data-role="chat-messages"]');
  var chatFormEl = $('[data-role="chat-form"]');
  var chatInputEl = $('[data-role="chat-input"]');

  function appendChatMessage(msg) {
    if (!chatMessagesEl) return;
    var wrapper = document.createElement("div");
    var roleClass = msg.role || "user";
    wrapper.className = "chat-message chat-message--" + roleClass;

    var bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = msg.text || "";

    var meta = document.createElement("div");
    meta.className = "chat-meta";

    if (roleClass === "system") {
      bubble.classList.add("chat-bubble--system");
      meta.innerHTML = "";
      wrapper.appendChild(bubble);
    } else {
      var authorSpan = document.createElement("span");
      authorSpan.className = "chat-author";
      authorSpan.textContent = msg.author || "User";

      var timeSpan = document.createElement("span");
      timeSpan.className = "chat-time";
      timeSpan.textContent = msg.timeAgo || "Baru saja";

      meta.appendChild(authorSpan);
      meta.appendChild(document.createTextNode(" • "));
      meta.appendChild(timeSpan);

      wrapper.appendChild(bubble);
      wrapper.appendChild(meta);
    }

    chatMessagesEl.appendChild(wrapper);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function initChat() {
    if (!chatMessagesEl || !chatFormEl || !chatInputEl) return;

    for (var i = 0; i < chatSeed.length; i++) {
      appendChatMessage(chatSeed[i]);
    }

    chatFormEl.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (chatInputEl.value || "").trim();
      if (!value) return;
      appendChatMessage({
        id: "self-" + Date.now(),
        author: "Kamu",
        role: "self",
        timeAgo: "Baru saja",
        text: value
      });
      chatInputEl.value = "";
    });
  }

  // ------------------------------------------------------------
  // Init
  // ------------------------------------------------------------

  function init() {
    fetchAnimeFromApi()
      .catch(function () {
        // Jika API gagal, gunakan data bawaan di script.
      })
      .finally(function () {
        rebuildAnimeIndex();

        initHero();

        renderSection("ongoing", "ongoing");
        renderSection("finished", "finished");
        renderSection("movie", "movie");
        renderMostViewedGrid();

        renderEpisodeComments();
        renderAnimeComments();

        initSearch();
        initFilterButtons();
        initGenreMenu();
        initNavScroll();
        initModals();
        initChat();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();