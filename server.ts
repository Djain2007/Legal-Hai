import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { handleUploadAndAnalyze, getHistory, getSettings, upsertSettings } from './src/server/api.js';
import { appConfig, getEffectiveModel } from './src/server/config.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// ---------------------------------------------------------------------------
// Security & Middleware
// ---------------------------------------------------------------------------
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'blob:'],
            connectSrc: ["'self'", 'https://*.supabase.co'],
          },
        }
      : false, // Disable CSP in dev to allow Vite HMR
  })
);

// CORS — restrict to APP_URL in production
app.use(
  cors({
    origin: isProduction
      ? process.env.APP_URL || '*'
      : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Global rate limiter — only applied to /api routes, not static assets
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000, // Relaxed in dev so Vite module requests aren't blocked
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skip: (req) => !req.path.startsWith('/api'), // Only limit API calls
});
app.use(globalLimiter);

// Stricter limiter for the analysis endpoint (expensive AI call)
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Analysis rate limit exceeded. Please wait before uploading another document.' },
});

// ---------------------------------------------------------------------------
// File Upload
// ---------------------------------------------------------------------------
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB for images
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload a JPG, PNG, or WebP image.'));
    }
  },
});

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

// Health check endpoint for monitoring
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    provider: appConfig.provider,
    model: getEffectiveModel(),
    timestamp: new Date().toISOString(),
  });
});

// Primary document upload + analysis
app.post('/api/upload-and-analyze', analysisLimiter, upload.single('file'), handleUploadAndAnalyze);

// Analysis history (per-user)
app.get('/api/history', getHistory);

// User settings
app.get('/api/settings', getSettings);
app.post('/api/settings', upsertSettings);

// ---------------------------------------------------------------------------
// Global Error Handler — always returns JSON, never HTML error pages
// ---------------------------------------------------------------------------
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] Unhandled error:', err?.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// ---------------------------------------------------------------------------
// Static / Vite Dev Server
// ---------------------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { 
      setHeaders: (res, path) => {
        if (path.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
      }
    }));
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Legal Hai! server running on http://localhost:${PORT}`);
    console.log(`   NODE_ENV  : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Provider  : ${appConfig.provider}`);
    console.log(`   Model     : ${getEffectiveModel()}`);
    console.log(`   Supabase  : ${process.env.SUPABASE_URL ? 'configured' : 'not configured (in-memory mode)'}\n`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
