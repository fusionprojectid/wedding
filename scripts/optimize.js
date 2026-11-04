#!/usr/bin/env node

/**
 * PRODUCTION ASSET OPTIMIZER (CSS, JS, IMAGES, HTML)
 * Strictly preserves original source files and outputs optimized artifacts to dist/
 * 
 * Features:
 * - CSS Minification: Clean-CSS (Level 2)
 * - JS Minification: Terser
 * - Image Optimization: Sharp (JPG/PNG compression + WebP conversion 80-85% with transparency)
 * - HTML Minification: html-minifier-terser
 * - Validation & Reporting: Before/after size comparison, savings %, Gzip estimation
 * 
 * Author: fusionproject.id
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Load stable dependencies
let CleanCSS;
let terser;
let htmlMinifier;
let sharp;

try {
  CleanCSS = require('clean-css');
} catch (e) {
  CleanCSS = null;
}

try {
  terser = require('terser');
} catch (e) {
  terser = null;
}

try {
  htmlMinifier = require('html-minifier-terser');
} catch (e) {
  htmlMinifier = null;
}

try {
  sharp = require('sharp');
} catch (e) {
  sharp = null;
}

// Directory configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_ASSETS_DIR = path.join(DIST_DIR, 'assets');

// Helper to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getGzipSize(buf) {
  return zlib.gzipSync(buf).length;
}

// Helper to ensure directories exist
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Collect files recursively
function getFilesRecursively(dir, extensions = []) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, extensions));
    } else {
      const ext = path.extname(item.name).toLowerCase();
      if (extensions.length === 0 || extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// Core Minifiers with robust fallbacks
async function minifyCss(cssContent) {
  if (CleanCSS) {
    const result = new CleanCSS({
      level: {
        1: { specialComments: 0 },
        2: { mergeMedia: true, removeEmpty: true, removeDuplicateRules: true }
      }
    }).minify(cssContent);
    if (result.styles) return result.styles;
  }
  // Safe regex fallback
  return cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

async function minifyJs(jsContent) {
  if (terser) {
    try {
      const result = await terser.minify(jsContent, {
        compress: {
          drop_console: false, // Keep user warning messages
          passes: 2
        },
        mangle: {
          reserved: [
            'DEFAULT_WEDDING_CONFIG',
            'getWeddingConfig',
            'saveWeddingConfig',
            'applyConfigToPage',
            'initAudioPlayer',
            'initCountdown',
            '__EMBEDDED_WEDDING_CONFIG__'
          ]
        },
        format: {
          comments: false
        }
      });
      if (result.code) return result.code;
    } catch (err) {
      console.warn('Terser warning, using fallback:', err.message);
    }
  }
  // Safe regex fallback
  return jsContent
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,=()<>+*\/!&|?])\s*/g, '$1')
    .trim();
}

async function minifyHtml(htmlContent) {
  if (htmlMinifier) {
    try {
      return await htmlMinifier.minify(htmlContent, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        decodeEntities: true,
        collapseBooleanAttributes: true
      });
    } catch (err) {
      console.warn('HTML Minifier warning, using fallback:', err.message);
    }
  }
  return htmlContent
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

// Image Optimizer
async function processImage(srcPath, destDir, statsList) {
  const ext = path.extname(srcPath).toLowerCase();
  const baseName = path.basename(srcPath, ext);
  const origBuffer = fs.readFileSync(srcPath);
  const origBytes = origBuffer.length;

  ensureDirSync(destDir);
  const targetOrigPath = path.join(destDir, path.basename(srcPath));
  const targetWebpPath = path.join(destDir, `${baseName}.webp`);

  if (!sharp) {
    // If sharp is not available, copy original
    fs.copyFileSync(srcPath, targetOrigPath);
    statsList.push({
      type: 'IMG (Copy)',
      file: path.relative(ROOT_DIR, srcPath),
      dest: path.relative(ROOT_DIR, targetOrigPath),
      origBytes,
      optBytes: origBytes,
      gzipBytes: getGzipSize(origBuffer)
    });
    return;
  }

  try {
    let optBuffer;
    let webpBuffer;

    if (ext === '.jpg' || ext === '.jpeg') {
      // 1. Optimize JPEG (Quality 82, MozJPEG)
      optBuffer = await sharp(origBuffer)
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toBuffer();

      // 2. Convert to WebP (Quality 82)
      webpBuffer = await sharp(origBuffer)
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
    } else if (ext === '.png') {
      // 1. Optimize PNG (Quality 85, preserve transparency)
      optBuffer = await sharp(origBuffer)
        .png({ quality: 85, compressionLevel: 9, effort: 7 })
        .toBuffer();

      // 2. Convert to WebP (Quality 85, preserve alpha channel transparency)
      webpBuffer = await sharp(origBuffer)
        .webp({ quality: 85, alphaQuality: 100, lossless: false, effort: 4 })
        .toBuffer();
    } else {
      // Other image types (SVG, GIF, ICO) - copy as is
      optBuffer = origBuffer;
    }

    // Write optimized original format
    fs.writeFileSync(targetOrigPath, optBuffer);
    statsList.push({
      type: `IMG (${ext.replace('.', '').toUpperCase()})`,
      file: path.relative(ROOT_DIR, srcPath),
      dest: path.relative(ROOT_DIR, targetOrigPath),
      origBytes,
      optBytes: optBuffer.length,
      gzipBytes: getGzipSize(optBuffer)
    });

    // Write WebP counterpart
    if (webpBuffer) {
      fs.writeFileSync(targetWebpPath, webpBuffer);
      statsList.push({
        type: 'IMG (WebP)',
        file: `${path.relative(ROOT_DIR, srcPath)} -> .webp`,
        dest: path.relative(ROOT_DIR, targetWebpPath),
        origBytes,
        optBytes: webpBuffer.length,
        gzipBytes: getGzipSize(webpBuffer)
      });
    }
  } catch (err) {
    console.warn(`Gagal memproses gambar ${srcPath}, menyalin file asli:`, err.message);
    fs.copyFileSync(srcPath, targetOrigPath);
    statsList.push({
      type: 'IMG (Fallback)',
      file: path.relative(ROOT_DIR, srcPath),
      dest: path.relative(ROOT_DIR, targetOrigPath),
      origBytes,
      optBytes: origBytes,
      gzipBytes: getGzipSize(origBuffer)
    });
  }
}

// Main Pipeline
async function main() {
  console.log('\n========================================================================');
  console.log('🚀 FUSION PROJECT - CI/CD ASSET OPTIMIZER & WEBP CONVERTER');
  console.log('========================================================================');
  console.log(`Node: ${process.version} | Architecture: ${process.arch} | Platform: ${process.platform}`);
  console.log(`Engines: CSS: ${CleanCSS ? 'Clean-CSS' : 'Native'} | JS: ${terser ? 'Terser' : 'Native'} | IMG: ${sharp ? 'Sharp (v' + sharp.versions.sharp + ')' : 'Native'} | HTML: ${htmlMinifier ? 'HTML-Minifier' : 'Native'}`);
  console.log(`Output Directory: ${path.relative(ROOT_DIR, DIST_DIR)}/ (Source files untouched)\n`);

  // Reset dist/
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  ensureDirSync(DIST_DIR);
  ensureDirSync(DIST_ASSETS_DIR);

  const stats = [];

  // 1. Process CSS
  console.log('📦 Mengoptimasi berkas CSS dengan Clean-CSS...');
  const cssSrcDir = path.join(ASSETS_DIR, 'css');
  const cssDestDir = path.join(DIST_ASSETS_DIR, 'css');
  ensureDirSync(cssDestDir);

  const cssFiles = fs.existsSync(cssSrcDir) ? fs.readdirSync(cssSrcDir).filter(f => f.endsWith('.css') && !f.endsWith('.min.css')) : [];
  for (const f of cssFiles) {
    const src = path.join(cssSrcDir, f);
    const raw = fs.readFileSync(src, 'utf8');
    const minified = await minifyCss(raw);

    // Save as standard name and .min.css in dist/ to guarantee no link can ever break
    fs.writeFileSync(path.join(cssDestDir, f), minified, 'utf8');
    const minName = f.replace('.css', '.min.css');
    fs.writeFileSync(path.join(cssDestDir, minName), minified, 'utf8');

    const origBytes = Buffer.byteLength(raw, 'utf8');
    const optBytes = Buffer.byteLength(minified, 'utf8');
    stats.push({
      type: 'CSS',
      file: path.relative(ROOT_DIR, src),
      dest: `dist/assets/css/${f} (+.min.css)`,
      origBytes,
      optBytes,
      gzipBytes: getGzipSize(Buffer.from(minified, 'utf8'))
    });
  }

  // 2. Process JS
  console.log('📦 Mengoptimasi berkas JavaScript dengan Terser...');
  const jsSrcDir = path.join(ASSETS_DIR, 'js');
  const jsDestDir = path.join(DIST_ASSETS_DIR, 'js');
  ensureDirSync(jsDestDir);

  const jsFiles = fs.existsSync(jsSrcDir) ? fs.readdirSync(jsSrcDir).filter(f => f.endsWith('.js') && !f.endsWith('.min.js')) : [];
  for (const f of jsFiles) {
    const src = path.join(jsSrcDir, f);
    const raw = fs.readFileSync(src, 'utf8');
    const minified = await minifyJs(raw);

    // Save as standard name and .min.js in dist/
    fs.writeFileSync(path.join(jsDestDir, f), minified, 'utf8');
    const minName = f.replace('.js', '.min.js');
    fs.writeFileSync(path.join(jsDestDir, minName), minified, 'utf8');

    const origBytes = Buffer.byteLength(raw, 'utf8');
    const optBytes = Buffer.byteLength(minified, 'utf8');
    stats.push({
      type: 'JS',
      file: path.relative(ROOT_DIR, src),
      dest: `dist/assets/js/${f} (+.min.js)`,
      origBytes,
      optBytes,
      gzipBytes: getGzipSize(Buffer.from(minified, 'utf8'))
    });
  }

  // 3. Process Images (JPG/JPEG/PNG optimization + WebP conversion)
  console.log('🖼️ Mengoptimasi gambar & konversi ke WebP (Kualitas 80-85%)...');
  const imgExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ico'];
  const allImages = getFilesRecursively(ASSETS_DIR, imgExtensions);

  if (allImages.length === 0) {
    console.log('   ℹ️  Tidak ada gambar lokal di folder assets (menggunakan gambar online CDN / Unsplash).');
  } else {
    for (const imgPath of allImages) {
      const relToAssets = path.relative(ASSETS_DIR, imgPath);
      const destDir = path.join(DIST_ASSETS_DIR, path.dirname(relToAssets));
      await processImage(imgPath, destDir, stats);
    }
  }

  // 4. Process HTML (Root HTML files)
  console.log('📄 Mengoptimasi berkas HTML...');
  const htmlFiles = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));
  for (const f of htmlFiles) {
    const src = path.join(ROOT_DIR, f);
    const raw = fs.readFileSync(src, 'utf8');
    const minified = await minifyHtml(raw);

    fs.writeFileSync(path.join(DIST_DIR, f), minified, 'utf8');

    const origBytes = Buffer.byteLength(raw, 'utf8');
    const optBytes = Buffer.byteLength(minified, 'utf8');
    stats.push({
      type: 'HTML',
      file: f,
      dest: `dist/${f}`,
      origBytes,
      optBytes,
      gzipBytes: getGzipSize(Buffer.from(minified, 'utf8'))
    });
  }

  // 5. Copy miscellaneous files (LICENSE, fonts, audio, etc.)
  ['LICENSE.txt', 'robots.txt', 'sitemap.xml'].forEach(extra => {
    const p = path.join(ROOT_DIR, extra);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, path.join(DIST_DIR, extra));
    }
  });

  // Print Terminal Report
  console.log('\n📊 LAPORAN HASIL OPTIMASI ASET:');
  console.log('--------------------------------------------------------------------------------------------------------');
  console.log(
    'TIPE'.padEnd(14) +
    'BERKAS SUMBER'.padEnd(30) +
    'UKURAN ASLI'.padStart(14) +
    'OPTIMAL'.padStart(14) +
    'PENGHEMATAN'.padStart(14) +
    'GZIP EST.'.padStart(14)
  );
  console.log('--------------------------------------------------------------------------------------------------------');

  let sumOrig = 0;
  let sumOpt = 0;
  let sumGzip = 0;

  stats.forEach(r => {
    sumOrig += r.origBytes;
    sumOpt += r.optBytes;
    sumGzip += r.gzipBytes;

    const savedPercent = r.origBytes > 0
      ? (((r.origBytes - r.optBytes) / r.origBytes) * 100).toFixed(1) + '%'
      : '0.0%';

    console.log(
      r.type.padEnd(14) +
      r.file.substring(0, 28).padEnd(30) +
      formatBytes(r.origBytes).padStart(14) +
      formatBytes(r.optBytes).padStart(14) +
      savedPercent.padStart(14) +
      formatBytes(r.gzipBytes).padStart(14)
    );
  });

  const totalSavings = sumOrig > 0 ? (((sumOrig - sumOpt) / sumOrig) * 100).toFixed(1) + '%' : '0.0%';
  console.log('--------------------------------------------------------------------------------------------------------');
  console.log(
    'TOTAL'.padEnd(44) +
    formatBytes(sumOrig).padStart(14) +
    formatBytes(sumOpt).padStart(14) +
    totalSavings.padStart(14) +
    formatBytes(sumGzip).padStart(14)
  );
  console.log('--------------------------------------------------------------------------------------------------------\n');

  console.log(`✅ Berhasil menghemat ${formatBytes(sumOrig - sumOpt)} (${totalSavings})!`);
  console.log(`📦 Paket produksi mandiri tersedia di: ${path.relative(ROOT_DIR, DIST_DIR)}/\n`);

  // Write GitHub Step Summary markdown
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    let md = '### 🚀 Ringkasan Optimasi Performa Website\n\n';
    md += '| Tipe Aset | Berkas | Ukuran Asli | Setelah Optimasi | Penghematan | Estimasi Gzip |\n';
    md += '| :--- | :--- | :---: | :---: | :---: | :---: |\n';
    stats.forEach(r => {
      const saved = r.origBytes > 0
        ? (((r.origBytes - r.optBytes) / r.origBytes) * 100).toFixed(1) + '%'
        : '0.0%';
      md += `| **${r.type}** | \`${r.file}\` | ${formatBytes(r.origBytes)} | ${formatBytes(r.optBytes)} | **-${saved}** | ${formatBytes(r.gzipBytes)} |\n`;
    });
    md += `| **TOTAL** | **Semua Aset** | **${formatBytes(sumOrig)}** | **${formatBytes(sumOpt)}** | **-${totalSavings}** | **${formatBytes(sumGzip)}** |\n\n`;
    md += `> ✨ **Total Penghematan:** **${formatBytes(sumOrig - sumOpt)} (${totalSavings})** dari ukuran asli!\n\n`;
    md += `> 🛡️ **Integritas:** Source asli tetap terjaga 100%. Folder \`dist/\` siap dipublikasikan.\n`;

    try {
      fs.appendFileSync(summaryPath, md, 'utf8');
    } catch (e) {
      console.warn('Gagal menulis GITHUB_STEP_SUMMARY:', e.message);
    }
  }
}

main().catch(err => {
  console.error('❌ Terjadi kesalahan fatal selama proses optimasi:', err);
  process.exit(1);
});
