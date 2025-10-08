const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());

const AUTOCOMPLETE_URL = "https://oapaiqtgkr6wfbum252tswprwa0ausnb.lambda-url.eu-central-1.on.aws/";

const ads = [];


const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}
function cacheSet(key, data) {
  cache.set(key, { ts: Date.now(), data });
  if (cache.size > 200) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

app.locals.__clearAutocompleteCache = () => cache.clear();

// POST /api/ads
app.post('/api/ads', (req, res) => {
  const { title, type, area, price, description } = req.body || {};
  if (!title || title.length > 255) return res.status(400).json({ error: 'Invalid title' });
  if (!type) return res.status(400).json({ error: 'Invalid type' });
  if (!area || !area.placeId) return res.status(400).json({ error: 'Invalid area' });
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) return res.status(400).json({ error: 'Invalid price' });

  const ad = {
    id: crypto.randomUUID(),
    title,
    type,
    area,
    price: priceNum,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  ads.push(ad);
  res.status(201).json(ad);
});

// GET /api/ads
app.get('/api/ads', (_req, res) => res.json(ads));

// GET /api/autocomplete
app.get('/api/autocomplete', async (req, res) => {
  const userInput = (req.query.input || '').trim();
  if (userInput.length < 3) return res.json([]);

  const key = userInput.toLowerCase();
  const hit = cacheGet(key);
  if (hit) {
    return res.json(hit);
  }

  try {
    const response = await axios.get(AUTOCOMPLETE_URL, {
      params: { input: userInput },
      headers: { Accept: "application/json" },
      timeout: 4000,
      validateStatus: s => s >= 200 && s < 500,
    });

    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data)) {
      // store to cache
      cacheSet(key, response.data);
      return res.json(response.data);
    }

    return res.status(502).json({ error: 'Bad response from provider' });
  } catch (err) {
    return res.status(502).json({ error: 'Upstream provider failure' });
  }
});

module.exports = app;
