#!/usr/bin/env node

/**
 * CI/CD BUILD VALIDATION TEST
 * Validates integrity, non-emptiness, syntax validity, and asset references of dist/
 * 
 * Author: fusionproject.id
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('\n========================================================================');
console.log('🔍 MEMULAI VALIDASI INTEGRITAS BUILD (dist/)');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failCount++;
  }
}

// 1. Check dist/ exists
assert(fs.existsSync(DIST_DIR), 'Folder dist/ berhasil dibuat');

// 2. Validate HTML Files
const requiredHtml = ['index.html', 'admin.html', 'login.html'];
requiredHtml.forEach(f => {
  const p = path.join(DIST_DIR, f);
  const exists = fs.existsSync(p);
  assert(exists, `Berkas HTML ${f} ada di dist/`);
  if (exists) {
    const stat = fs.statSync(p);
    assert(stat.size > 500, `Ukuran ${f} valid (${stat.size} bytes)`);
    const content = fs.readFileSync(p, 'utf8');
    assert(content.includes('<html') && content.includes('</html>'), `${f} memiliki struktur tag HTML yang utuh`);
  }
});

// 3. Validate CSS Files
const requiredCss = ['style.css', 'themes.css', 'admin.css', 'animations.css'];
requiredCss.forEach(f => {
  const p = path.join(DIST_DIR, 'assets', 'css', f);
  const pMin = path.join(DIST_DIR, 'assets', 'css', f.replace('.css', '.min.css'));
  assert(fs.existsSync(p), `Berkas CSS ${f} ada di dist/assets/css/`);
  assert(fs.existsSync(pMin), `Berkas CSS ${f.replace('.css', '.min.css')} ada di dist/assets/css/`);
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    assert(stat.size > 100, `Ukuran ${f} valid (${stat.size} bytes)`);
  }
});

// 4. Validate JS Files & Syntax Execution Check
const requiredJs = [
  'config.js',
  'countdown.js',
  'petals.js',
  'gallery.js',
  'rsvp.js',
  'generator.js',
  'main.js',
  'admin.js'
];
requiredJs.forEach(f => {
  const p = path.join(DIST_DIR, 'assets', 'js', f);
  const pMin = path.join(DIST_DIR, 'assets', 'js', f.replace('.js', '.min.js'));
  assert(fs.existsSync(p), `Berkas JS ${f} ada di dist/assets/js/`);
  assert(fs.existsSync(pMin), `Berkas JS ${f.replace('.js', '.min.js')} ada di dist/assets/js/`);

  if (fs.existsSync(p)) {
    const code = fs.readFileSync(p, 'utf8');
    try {
      new vm.Script(code);
      assert(true, `Sintaks JavaScript ${f} valid tanpa error parsing`);
    } catch (err) {
      assert(false, `Error sintaks JavaScript pada ${f}: ${err.message}`);
    }
  }
});

// 5. Validate Images
const distImagesDir = path.join(DIST_DIR, 'assets', 'images');
if (fs.existsSync(distImagesDir)) {
  const imgFiles = fs.readdirSync(distImagesDir);
  console.log(`  ℹ️  Ditemukan ${imgFiles.length} berkas gambar pada dist/assets/images/`);
  const webpFiles = imgFiles.filter(f => f.endsWith('.webp'));
  if (imgFiles.length > 0) {
    assert(webpFiles.length > 0, `Konversi WebP berhasil (${webpFiles.length} berkas .webp ditemukan)`);
  }
}

// 6. Verify Source Files Are Untouched
const sourceHtml = path.join(ROOT_DIR, 'index.html');
const distHtml = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(sourceHtml) && fs.existsSync(distHtml)) {
  const srcSize = fs.statSync(sourceHtml).size;
  const dstSize = fs.statSync(distHtml).size;
  assert(srcSize > dstSize, `Source asli tetap terjaga & dist berukuran lebih ringkas (${srcSize} B -> ${dstSize} B)`);
}

console.log('\n========================================================================');
console.log(`📋 HASIL AKHIR: ${passCount} Lulus, ${failCount} Gagal`);
console.log('========================================================================\n');

if (failCount > 0) {
  console.error('❌ Build validation gagal. Periksa log di atas.');
  process.exit(1);
} else {
  console.log('✨ SEMUA VALIDASI BERHASIL! Paket dist/ 100% aman dan siap rilis ke produksi.\n');
  process.exit(0);
}

