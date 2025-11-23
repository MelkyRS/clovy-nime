const axios = require("axios");
const cheerio = require("cheerio");
const { google } = require("googleapis");

/**
 * Konfigurasi via environment variable:
 *
 * - BLOGGER_BLOG_ID        : ID blog Blogger kamu
 * - GOOGLE_CLIENT_ID       : OAuth2 client id
 * - GOOGLE_CLIENT_SECRET   : OAuth2 client secret
 * - GOOGLE_REFRESH_TOKEN   : OAuth2 refresh token dengan akses Blogger API
 *
 * Cara pakai (contoh):
 *   node server/malPoster.js "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood"
 */

async function getBloggerClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN belum di-set di environment."
    );
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  return google.blogger({ version: "v3", auth });
}

// ------------------------------------------------------------
// Scraper MyAnimeList (sederhana)
// ------------------------------------------------------------

async function scrapeMalAnime(url) {
  console.log("Mengambil data dari MAL:", url);
  const res = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36"
    }
  });

  const $ = cheerio.load(res.data);

  // Judul
  const title =
    $("h1 span[itemprop='name']").first().text().trim() ||
    $("h1").first().text().trim();

  // Sinopsis
  const synopsis =
    $("p[itemprop='description']").first().text().trim() ||
    $("p:contains('Synopsis')")
      .parent()
      .next("p")
      .text()
      .trim();

  // Genres
  const genres = [];
  $("span[itemprop='genre']").each((_, el) => {
    const g = $(el).text().trim();
    if (g) genres.push(g);
  });

  // Status
  let statusText = "";
  $("span:contains('Status:')")
    .parent()
    .each((_, el) => {
      const txt = $(el).text();
      if (txt && txt.toLowerCase().includes("status:")) {
        statusText = txt.replace(/Status:\s*/i, "").trim();
      }
    });

  let statusLabel = "Ongoing";
  if (statusText.toLowerCase().includes("finished")) {
    statusLabel = "Completed";
  }

  if (!title) {
    throw new Error("Gagal mengambil judul dari halaman MAL. Struktur HTML mungkin berubah.");
  }

  return {
    title,
    synopsis: synopsis || "Sinopsis belum tersedia.",
    genres,
    statusLabel,
    sourceUrl: url
  };
}

// ------------------------------------------------------------
// Posting ke Blogger
// ------------------------------------------------------------

async function postToBlogger(blogId, animeData) {
  if (!blogId) {
    throw new Error("BLOGGER_BLOG_ID belum di-set di environment.");
  }

  const blogger = await getBloggerClient();

  // Label dari status + genres
  const labels = [];
  if (animeData.statusLabel) labels.push(animeData.statusLabel);
  if (Array.isArray(animeData.genres)) {
    animeData.genres.forEach((g) => {
      if (g && !labels.includes(g)) labels.push(g);
    });
  }

  // Konten HTML posting
  const htmlContent = `
<h2>Sinopsis</h2>
<p>
  ${animeData.synopsis}
</p>

<h3>Informasi</h3>
<ul>
  <li>Judul: ${animeData.title}</li>
  <li>Status: ${animeData.statusLabel}</li>
  <li>Genre: ${animeData.genres && animeData.genres.length ? animeData.genres.join(", ") : "-"}</li>
  <li>Sumber: <a href="${animeData.sourceUrl}" target="_blank" rel="noopener noreferrer">MyAnimeList</a></li>
</ul>

<div class="download-box">
  <h3>Download Episode</h3>
  <div class="download-quality-list">
    <!-- Ganti # dengan link download sebenarnya setelah post terpublish -->
    <a href="#">240p</a>
    <a href="#">360p</a>
    <a href="#">480p</a>
    <a href="#">720p</a>
  </div>
</div>
`;

  console.log("Mengirim posting ke Blogger...");

  const res = await blogger.posts.insert({
    blogId,
    requestBody: {
      title: animeData.title,
      labels,
      content: htmlContent
    }
  });

  return res.data;
}

// ------------------------------------------------------------
// Main / CLI
// ------------------------------------------------------------

async function main() {
  const malUrl = process.argv[2];
  if (!malUrl) {
    console.error(
      "Usage: node server/malPoster.js \"https://myanimelist.net/anime/XXXX/Nama_Anime\""
    );
    process.exit(1);
  }

  const blogId = process.env.BLOGGER_BLOG_ID;

  try {
    const animeData = await scrapeMalAnime(malUrl);
    console.log("Data anime dari MAL:", animeData);

    const posted = await postToBlogger(blogId, animeData);
    console.log("Berhasil membuat posting di Blogger:");
    console.log("URL:", posted.url);
    console.log("ID :", posted.id);
  } catch (err) {
    console.error("Gagal membuat posting otomatis:", err.message || err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}