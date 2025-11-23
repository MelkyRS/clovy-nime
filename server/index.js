const path = require("path");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";

const dbFile = path.join(__dirname, "anime.db");
const db = new sqlite3.Database(dbFile);

// ------------------------------------------------------------
// Database init + seeding
// ------------------------------------------------------------

function initDb() {
  db.serialize(function () {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS anime (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        alt_title TEXT,
        type TEXT,
        quality TEXT,
        section TEXT,
        status TEXT,
        score REAL,
        episodes_aired INTEGER,
        episodes_total INTEGER,
        season_label TEXT,
        season_key TEXT,
        views_season INTEGER DEFAULT 0,
        genres TEXT,
        description TEXT,
        color_key TEXT,
        featured INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`
    );

    // Seed admin user jika belum ada
    db.get(
      "SELECT id FROM users WHERE username = ?",
      ["admin"],
      function (err, row) {
        if (err) {
          console.error("Error checking admin user", err);
          return;
        }
        if (!row) {
          const hash = bcrypt.hashSync("admin123", 10);
          const now = new Date().toISOString();
          db.run(
            "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
            ["admin", hash, now],
            function (err2) {
              if (err2) {
                console.error("Error seeding admin user", err2);
              } else {
                console.log('Seeded default admin user: username="admin", password="admin123"');
              }
            }
          );
        }
      }
    );

    // Seed anime bawaan jika tabel masih kosong
    db.get("SELECT COUNT(*) AS count FROM anime", function (err, row) {
      if (err) {
        console.error("Error counting anime", err);
        return;
      }
      if (row && row.count === 0) {
        seedAnime();
      }
    });
  });
}

function seedAnime() {
  const seed = [
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
      altTitle: null,
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
      altTitle: null,
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
      altTitle: null,
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
      altTitle: null,
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
      altTitle: null,
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
      altTitle: null,
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

  const now = new Date().toISOString();

  const stmt = db.prepare(
    `INSERT OR IGNORE INTO anime
      (id, title, alt_title, type, quality, section, status, score,
       episodes_aired, episodes_total, season_label, season_key,
       views_season, genres, description, color_key, featured, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  seed.forEach(function (a) {
    const genresJson = JSON.stringify(a.genres || []);
    const featured = a.featured ? 1 : 0;

    stmt.run(
      a.id,
      a.title,
      a.altTitle || null,
      a.type || null,
      a.quality || null,
      a.section || null,
      a.status || null,
      typeof a.score === "number" ? a.score : null,
      a.episodesAired != null ? a.episodesAired : null,
      a.episodesTotal != null ? a.episodesTotal : null,
      a.seasonLabel || null,
      a.seasonKey || null,
      a.viewsSeason != null ? a.viewsSeason : 0,
      genresJson,
      a.description || "",
      a.colorKey || "orange",
      featured,
      now,
      now
    );
  });

  stmt.finalize(function (err) {
    if (err) {
      console.error("Error seeding anime", err);
    } else {
      console.log("Seeded initial anime data");
    }
  });
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function mapAnimeRow(row) {
  if (!row) return null;
  var genres = [];
  if (row.genres) {
    try {
      genres = JSON.parse(row.genres);
      if (!Array.isArray(genres)) genres = [];
    } catch (e) {
      genres = [];
    }
  }
  return {
    id: row.id,
    title: row.title,
    altTitle: row.alt_title || null,
    type: row.type || null,
    quality: row.quality || null,
    section: row.section || null,
    status: row.status || null,
    score: row.score != null ? Number(row.score) : null,
    episodesAired: row.episodes_aired != null ? Number(row.episodes_aired) : null,
    episodesTotal: row.episodes_total != null ? Number(row.episodes_total) : null,
    seasonLabel: row.season_label || null,
    seasonKey: row.season_key || null,
    viewsSeason: row.views_season != null ? Number(row.views_season) : 0,
    genres: genres,
    description: row.description || "",
    colorKey: row.color_key || "orange",
    featured: !!row.featured
  };
}

function parseBool(value) {
  if (value === true || value === false) return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    var v = value.toLowerCase();
    if (v === "true" || v === "1") return true;
    if (v === "false" || v === "0") return false;
  }
  return false;
}

function toNumberOrNull(value) {
  if (value === "" || value == null) return null;
  var n = Number(value);
  if (isNaN(n)) return null;
  return n;
}

function normalizeAnimePayload(body) {
  var a = body || {};
  var genres = a.genres;

  if (typeof genres === "string") {
    genres = genres
      .split(",")
      .map(function (g) {
        return g.trim();
      })
      .filter(Boolean);
  } else if (!Array.isArray(genres)) {
    genres = [];
  }

  return {
    id: a.id ? String(a.id).trim() : "",
    title: a.title ? String(a.title).trim() : "",
    altTitle: a.altTitle ? String(a.altTitle).trim() : null,
    type: a.type ? String(a.type).trim() : null,
    quality: a.quality ? String(a.quality).trim() : null,
    section: a.section ? String(a.section).trim() : "",
    status: a.status ? String(a.status).trim() : null,
    score: toNumberOrNull(a.score),
    episodesAired: toNumberOrNull(a.episodesAired),
    episodesTotal: toNumberOrNull(a.episodesTotal),
    seasonLabel: a.seasonLabel ? String(a.seasonLabel).trim() : null,
    seasonKey: a.seasonKey ? String(a.seasonKey).trim() : null,
    viewsSeason: toNumberOrNull(a.viewsSeason) || 0,
    genres: genres,
    description: a.description ? String(a.description).trim() : "",
    colorKey: a.colorKey ? String(a.colorKey).trim() : "orange",
    featured: parseBool(a.featured)
  };
}

function validateAnimePayload(a) {
  if (!a.id) return "ID wajib diisi.";
  if (!a.title) return "Judul wajib diisi.";
  if (!a.section) return "Section wajib diisi (ongoing/finished/movie).";
  return null;
}

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------

app.use(cors());
app.use(express.json());

function authMiddleware(req, res, next) {
  var header = req.headers["authorization"] || "";
  var parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  var token = parts[1];
  jwt.verify(token, JWT_SECRET, function (err, payload) {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = { id: payload.id, username: payload.username };
    next();
  });
}

// ------------------------------------------------------------
// Routes: Auth
// ------------------------------------------------------------

app.post("/api/auth/login", function (req, res) {
  var body = req.body || {};
  var username = body.username ? String(body.username).trim() : "";
  var password = body.password ? String(body.password) : "";

  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password wajib diisi." });
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    function (err, user) {
      if (err) {
        console.error("Error loading user", err);
        return res.status(500).json({ error: "Kesalahan server." });
      }
      if (!user) {
        return res.status(401).json({ error: "Username atau password salah." });
      }

      bcrypt.compare(password, user.password_hash, function (err2, same) {
        if (err2) {
          console.error("Error comparing password", err2);
          return res.status(500).json({ error: "Kesalahan server." });
        }
        if (!same) {
          return res.status(401).json({ error: "Username atau password salah." });
        }

        var token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: "7d" }
        );
        res.json({ token: token });
      });
    }
  );
});

// ------------------------------------------------------------
// Routes: Admin (protected)
// ------------------------------------------------------------

const adminRouter = express.Router();
adminRouter.use(authMiddleware);

adminRouter.get("/anime", function (req, res) {
  db.all("SELECT * FROM anime", [], function (err, rows) {
    if (err) {
      console.error("Error loading anime list", err);
      return res.status(500).json({ error: "Kesalahan server." });
    }
    var list = (rows || []).map(mapAnimeRow);
    res.json(list);
  });
});

adminRouter.get("/anime/:id", function (req, res) {
  var id = req.params.id;
  db.get("SELECT * FROM anime WHERE id = ?", [id], function (err, row) {
    if (err) {
      console.error("Error loading anime", err);
      return res.status(500).json({ error: "Kesalahan server." });
    }
    if (!row) {
      return res.status(404).json({ error: "Anime tidak ditemukan." });
    }
    res.json(mapAnimeRow(row));
  });
});

adminRouter.post("/anime", function (req, res) {
  var payload = normalizeAnimePayload(req.body);
  var error = validateAnimePayload(payload);
  if (error) {
    return res.status(400).json({ error: error });
  }

  var now = new Date().toISOString();
  var genresJson = JSON.stringify(payload.genres || []);
  var featured = payload.featured ? 1 : 0;

  db.serialize(function () {
    function insertAnime() {
      db.run(
        `INSERT INTO anime
          (id, title, alt_title, type, quality, section, status, score,
           episodes_aired, episodes_total, season_label, season_key,
           views_season, genres, description, color_key, featured, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.id,
          payload.title,
          payload.altTitle || null,
          payload.type || null,
          payload.quality || null,
          payload.section || null,
          payload.status || null,
          payload.score,
          payload.episodesAired,
          payload.episodesTotal,
          payload.seasonLabel || null,
          payload.seasonKey || null,
          payload.viewsSeason || 0,
          genresJson,
          payload.description || "",
          payload.colorKey || "orange",
          featured,
          now,
          now
        ],
        function (err) {
          if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
              return res.status(409).json({ error: "ID anime sudah digunakan." });
            }
            console.error("Error inserting anime", err);
            return res.status(500).json({ error: "Kesalahan server." });
          }
          res.status(201).json({ ok: true });
        }
      );
    }

    if (featured) {
      db.run("UPDATE anime SET featured = 0 WHERE featured = 1", [], function (err) {
        if (err) {
          console.error("Error clearing featured flag", err);
          return res.status(500).json({ error: "Kesalahan server." });
        }
        insertAnime();
      });
    } else {
      insertAnime();
    }
  });
});

adminRouter.put("/anime/:id", function (req, res) {
  var idParam = req.params.id;
  var payload = normalizeAnimePayload(req.body);
  var error = validateAnimePayload(payload);
  if (error) {
    return res.status(400).json({ error: error });
  }

  var now = new Date().toISOString();
  var genresJson = JSON.stringify(payload.genres || []);
  var featured = payload.featured ? 1 : 0;

  db.serialize(function () {
    function updateAnime() {
      db.run(
        `UPDATE anime SET
          id = ?,
          title = ?,
          alt_title = ?,
          type = ?,
          quality = ?,
          section = ?,
          status = ?,
          score = ?,
          episodes_aired = ?,
          episodes_total = ?,
          season_label = ?,
          season_key = ?,
          views_season = ?,
          genres = ?,
          description = ?,
          color_key = ?,
          featured = ?,
          updated_at = ?
        WHERE id = ?`,
        [
          payload.id,
          payload.title,
          payload.altTitle || null,
          payload.type || null,
          payload.quality || null,
          payload.section || null,
          payload.status || null,
          payload.score,
          payload.episodesAired,
          payload.episodesTotal,
          payload.seasonLabel || null,
          payload.seasonKey || null,
          payload.viewsSeason || 0,
          genresJson,
          payload.description || "",
          payload.colorKey || "orange",
          featured,
          now,
          idParam
        ],
        function (err) {
          if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
              return res.status(409).json({ error: "ID anime bentrok dengan yang lain." });
            }
            console.error("Error updating anime", err);
            return res.status(500).json({ error: "Kesalahan server." });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: "Anime tidak ditemukan." });
          }
          res.json({ ok: true });
        }
      );
    }

    if (featured) {
      db.run("UPDATE anime SET featured = 0 WHERE featured = 1", [], function (err) {
        if (err) {
          console.error("Error clearing featured flag", err);
          return res.status(500).json({ error: "Kesalahan server." });
        }
        updateAnime();
      });
    } else {
      updateAnime();
    }
  });
});

adminRouter.delete("/anime/:id", function (req, res) {
  var id = req.params.id;
  db.run("DELETE FROM anime WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Error deleting anime", err);
      return res.status(500).json({ error: "Kesalahan server." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Anime tidak ditemukan." });
    }
    res.status(204).end();
  });
});

app.use("/api/admin", adminRouter);

// ------------------------------------------------------------
// Routes: Public API
// ------------------------------------------------------------

const publicRouter = express.Router();

publicRouter.get("/anime", function (req, res) {
  db.all("SELECT * FROM anime", [], function (err, rows) {
    if (err) {
      console.error("Error loading anime list", err);
      return res.status(500).json({ error: "Kesalahan server." });
    }
    var list = (rows || []).map(mapAnimeRow);
    res.json(list);
  });
});

publicRouter.get("/anime/:id", function (req, res) {
  var id = req.params.id;
  db.get("SELECT * FROM anime WHERE id = ?", [id], function (err, row) {
    if (err) {
      console.error("Error loading anime", err);
      return res.status(500).json({ error: "Kesalahan server." });
    }
    if (!row) {
      return res.status(404).json({ error: "Anime tidak ditemukan." });
    }
    res.json(mapAnimeRow(row));
  });
});

app.use("/api", publicRouter);

// ------------------------------------------------------------
// Static files
// ------------------------------------------------------------

const publicDir = path.join(__dirname, "..");
app.use(express.static(publicDir));

app.get("/", function (req, res) {
  res.sendFile(path.join(publicDir, "index.html"));
});

// ------------------------------------------------------------
// Start
// ------------------------------------------------------------

initDb();

app.listen(PORT, function () {
  console.log("Anime Portal API listening on port " + PORT);
});