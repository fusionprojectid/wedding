/**
 * ADMIN DASHBOARD CONTROLLER
 * Manages form state, saving, exporting, importing, template switching, account settings, and resetting configuration.
 */

document.addEventListener('DOMContentLoaded', () => {
  const AUTH_STORAGE_KEY = 'fusion_admin_credentials';
  const LOGIN_STATUS_KEY = 'fusion_admin_logged_in';

  // 1. Logout Handler
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin keluar dari dashboard?')) {
        sessionStorage.removeItem(LOGIN_STATUS_KEY);
        localStorage.removeItem(LOGIN_STATUS_KEY);
        window.location.href = 'login.html';
      }
    });
  }

  // 2. Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // 3. Template Selection Engine
  const selectedThemeInput = document.getElementById('selected-theme');
  const templateButtons = document.querySelectorAll('.btn-apply-template');

  function updateTemplateUI(activeTheme) {
    if (selectedThemeInput) selectedThemeInput.value = activeTheme;

    [
      'template-1', 'template-2', 'template-3', 'template-4',
      'template-5', 'template-6', 'template-7', 'template-8'
    ].forEach(t => {
      const card = document.getElementById(`card-${t}`);
      const badge = document.getElementById(`badge-${t}`);
      if (card && badge) {
        if (t === activeTheme) {
          card.classList.add('active-template');
          badge.textContent = 'Aktif Digunakan';
        } else {
          card.classList.remove('active-template');
          badge.textContent = 'Pilih Template';
        }
      }
    });
  }

  templateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = btn.getAttribute('data-theme');
      updateTemplateUI(chosen);

      // Save directly
      const currentConfig = collectFormData();
      currentConfig.theme = chosen;
      saveWeddingConfig(currentConfig);

      const templateNames = {
        'template-1': 'Template 1: Royal Classic Gold',
        'template-2': 'Template 2: Modern Arch Minimalist',
        'template-3': 'Template 3: Nusantara Heritage Keraton',
        'template-4': 'Template 4: Botanical Greenhouse & Wildflower',
        'template-5': 'Template 5: The Wedding Chronicle Newspaper',
        'template-6': 'Template 6: Midnight Celestial Starlight',
        'template-7': 'Template 7: Islamic Emerald Arabesque',
        'template-8': 'Template 8: Korean Pastel Coquette'
      };

      showAdminToast(`🎨 ${templateNames[chosen] || chosen} berhasil diaktifkan!`);
    });
  });

  // 3.5. Stories Management (Perjalanan Kami)
  let currentStories = [];

  function escapeAdminHtml(text) {
    if (typeof text !== 'string') text = String(text || '');
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderStoriesForm(stories) {
    const container = document.getElementById('stories-container');
    if (!container) return;
    currentStories = Array.isArray(stories) ? [...stories] : [];
    container.innerHTML = '';

    if (currentStories.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px; background: #ffffff; border: 1px dashed var(--admin-border); border-radius: 12px; color: #6c757d;">
          <i class="fas fa-heart-broken" style="font-size: 2rem; color: #adb5bd; margin-bottom: 10px;"></i>
          <p style="font-size: 0.9rem; margin-bottom: 12px;">Belum ada momen cerita perjalanan cinta.</p>
          <button type="button" class="btn btn-secondary" id="btn-empty-add-story" style="font-size: 0.85rem;">
            <i class="fas fa-plus"></i> Tambah Momen Pertama
          </button>
        </div>`;
      const emptyBtn = document.getElementById('btn-empty-add-story');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => {
          currentStories.push({ year: '', title: '', desc: '' });
          renderStoriesForm(currentStories);
        });
      }
      return;
    }

    currentStories.forEach((st, idx) => {
      const card = document.createElement('div');
      card.className = 'story-item-card';
      card.setAttribute('data-index', idx);
      card.style.cssText = 'background: #ffffff; border: 1px solid var(--admin-border); border-radius: 12px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); position: relative;';

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #343a40;">
            <i class="fas fa-feather-alt" style="color: var(--admin-primary);"></i> Momen Cerita #${idx + 1}
          </h4>
          <button type="button" class="btn-remove-story" data-index="${idx}" style="background: transparent; border: none; color: #e03131; cursor: pointer; font-size: 0.85rem; padding: 4px 8px; border-radius: 6px;" title="Hapus momen ini">
            <i class="fas fa-trash-alt"></i> Hapus
          </button>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Waktu / Bulan &amp; Tahun:</label>
            <input type="text" class="form-input story-year" placeholder="Contoh: Maret 2021" value="${escapeAdminHtml(st.year || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Judul Momen:</label>
            <input type="text" class="form-input story-title" placeholder="Contoh: Pertama Bertemu" value="${escapeAdminHtml(st.title || '')}" />
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Cerita / Keterangan Singkat:</label>
          <textarea class="form-textarea story-desc" rows="3" placeholder="Ceritakan kisah manis pada momen ini...">${escapeAdminHtml(st.desc || '')}</textarea>
        </div>
      `;

      container.appendChild(card);
    });

    // Bind remove buttons
    container.querySelectorAll('.btn-remove-story').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCurrentStoriesState();
        const removeIdx = parseInt(btn.getAttribute('data-index'), 10);
        if (!isNaN(removeIdx)) {
          currentStories.splice(removeIdx, 1);
          renderStoriesForm(currentStories);
        }
      });
    });
  }

  function saveCurrentStoriesState() {
    const cards = document.querySelectorAll('#stories-container .story-item-card');
    currentStories = [];
    cards.forEach(card => {
      const y = card.querySelector('.story-year');
      const t = card.querySelector('.story-title');
      const d = card.querySelector('.story-desc');
      currentStories.push({
        year: y ? y.value.trim() : '',
        title: t ? t.value.trim() : '',
        desc: d ? d.value.trim() : ''
      });
    });
  }

  const btnAddStory = document.getElementById('btn-add-story');
  if (btnAddStory) {
    btnAddStory.addEventListener('click', () => {
      saveCurrentStoriesState();
      currentStories.push({
        year: '',
        title: '',
        desc: ''
      });
      renderStoriesForm(currentStories);
      setTimeout(() => {
        const cards = document.querySelectorAll('#stories-container .story-item-card');
        if (cards.length > 0) {
          cards[cards.length - 1].scrollIntoView({ behavior: 'smooth' });
          const firstInput = cards[cards.length - 1].querySelector('.story-year');
          if (firstInput) firstInput.focus();
        }
      }, 50);
    });
  }

  // =========================================================================
  // 3.6. IMAGE COMPRESSION & UPLOAD ENGINE
  // =========================================================================
  function compressAndConvertImage(file, maxDimension = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Berkas yang dipilih bukan gambar valid.'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const isPng = file.type === 'image/png';
          // Preserve PNG if small, otherwise output optimized JPEG
          const out = isPng && file.size < 400000
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', quality);
          resolve(out);
        };
        img.onerror = () => reject(new Error('Gagal memproses gambar.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Gagal membaca berkas.'));
      reader.readAsDataURL(file);
    });
  }

  // Profile Photo Uploader Helpers
  function updateProfilePreview(imgId, textId, url) {
    const imgEl = document.getElementById(imgId);
    const textEl = document.getElementById(textId);
    if (!imgEl) return;
    if (url && url.trim()) {
      imgEl.src = url;
      imgEl.style.display = 'block';
      if (textEl) textEl.textContent = 'Foto siap digunakan';
    } else {
      imgEl.style.display = 'none';
      if (textEl) textEl.textContent = 'Belum ada foto yang dipilih';
    }
  }

  const fileGroom = document.getElementById('file-groom-photo');
  if (fileGroom) {
    fileGroom.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        showAdminToast('Mengompres dan memproses foto pria...');
        const base64 = await compressAndConvertImage(file, 800, 0.85);
        setVal('groom-photo', base64);
        updateProfilePreview('preview-groom-img', 'preview-groom-text', base64);
        updateWaPreview();
        showAdminToast('✅ Foto mempelai pria berhasil diunggah!');
      } catch (err) {
        alert(err.message || 'Gagal mengunggah foto.');
      }
    });
  }

  const fileBride = document.getElementById('file-bride-photo');
  if (fileBride) {
    fileBride.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        showAdminToast('Mengompres dan memproses foto wanita...');
        const base64 = await compressAndConvertImage(file, 800, 0.85);
        setVal('bride-photo', base64);
        updateProfilePreview('preview-bride-img', 'preview-bride-text', base64);
        updateWaPreview();
        showAdminToast('✅ Foto mempelai wanita berhasil diunggah!');
      } catch (err) {
        alert(err.message || 'Gagal mengunggah foto.');
      }
    });
  }

  const inputGroom = document.getElementById('groom-photo');
  if (inputGroom) {
    inputGroom.addEventListener('input', () => {
      updateProfilePreview('preview-groom-img', 'preview-groom-text', inputGroom.value);
    });
  }

  const inputBride = document.getElementById('bride-photo');
  if (inputBride) {
    inputBride.addEventListener('input', () => {
      updateProfilePreview('preview-bride-img', 'preview-bride-text', inputBride.value);
    });
  }

  // =========================================================================
  // 3.7. GALLERY & BATCH PHOTO UPLOADER
  // =========================================================================
  let currentGallery = [];

  function renderGalleryForm(galleryList) {
    const container = document.getElementById('gallery-container');
    const totalCountEl = document.getElementById('gallery-total-count');
    if (!container) return;

    currentGallery = Array.isArray(galleryList) ? [...galleryList] : [];
    if (totalCountEl) totalCountEl.textContent = currentGallery.length;
    container.innerHTML = '';

    if (currentGallery.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #ffffff; border: 1px dashed var(--admin-border); border-radius: 12px; color: #6c757d;">
          <i class="fas fa-images" style="font-size: 2.2rem; color: #adb5bd; margin-bottom: 12px; display: block;"></i>
          <p style="font-size: 0.95rem; font-weight: 600; margin-bottom: 6px;">Belum ada foto di galeri pernikahan.</p>
          <p style="font-size: 0.82rem; margin-bottom: 16px;">Unggah foto prewedding atau kebersamaan Anda untuk mempercantik undangan.</p>
          <label for="batch-upload-gallery" class="btn btn-primary" style="cursor: pointer; display: inline-flex;">
            <i class="fas fa-upload"></i> Unggah Foto Sekarang
          </label>
        </div>`;
      return;
    }

    currentGallery.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-admin-card';
      card.setAttribute('data-index', idx);

      const categoryOptions = [
        { val: 'prewed', label: 'Prewedding' },
        { val: 'casual', label: 'Casual' },
        { val: 'akad', label: 'Akad Nikah' },
        { val: 'resepsi', label: 'Resepsi' }
      ].map(opt => `<option value="${opt.val}" ${item.category === opt.val ? 'selected' : ''}>${opt.label}</option>`).join('');

      card.innerHTML = `
        <div class="gallery-card-thumb-wrap">
          <img src="${escapeAdminHtml(item.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80')}" alt="Foto ${idx + 1}" />
          <span class="gallery-card-badge">${escapeAdminHtml(item.category || 'prewed')}</span>
          <div class="gallery-card-actions">
            ${idx > 0 ? `<button type="button" class="gallery-btn-action btn-move-up" data-index="${idx}" title="Geser ke kiri / sebelumnya"><i class="fas fa-arrow-left"></i></button>` : ''}
            ${idx < currentGallery.length - 1 ? `<button type="button" class="gallery-btn-action btn-move-down" data-index="${idx}" title="Geser ke kanan / selanjutnya"><i class="fas fa-arrow-right"></i></button>` : ''}
            <button type="button" class="gallery-btn-action gallery-btn-delete btn-remove-photo" data-index="${idx}" title="Hapus foto ini"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        <div class="gallery-card-body">
          <div>
            <label class="form-label" style="font-size: 0.78rem;">Kategori Filter:</label>
            <select class="form-select gallery-category" style="padding: 6px 10px; font-size: 0.82rem;">
              ${categoryOptions}
            </select>
          </div>
          <div>
            <label class="form-label" style="font-size: 0.78rem;">Keterangan / Caption:</label>
            <input type="text" class="form-input gallery-caption" placeholder="Contoh: Momen Sunset di Pantai" value="${escapeAdminHtml(item.caption || '')}" style="padding: 6px 10px; font-size: 0.82rem;" />
          </div>
          <div>
            <label class="form-label" style="font-size: 0.78rem;">Ukuran Tampilan di Undangan:</label>
            <select class="form-select gallery-span" style="padding: 6px 10px; font-size: 0.82rem;">
              <option value="1" ${item.span !== 2 ? 'selected' : ''}>Standar (1 Kolom)</option>
              <option value="2" ${item.span === 2 ? 'selected' : ''}>Lebar Menonjol (2 Kolom)</option>
            </select>
          </div>
          <div>
            <label class="form-label" style="font-size: 0.78rem;">Ganti Foto (File / URL):</label>
            <div style="display: flex; gap: 6px;">
              <input type="text" class="form-input gallery-url" placeholder="https://... atau assets/images/..." value="${escapeAdminHtml(item.url || '')}" style="padding: 6px 10px; font-size: 0.82rem;" />
              <label class="btn btn-secondary" style="margin: 0; padding: 6px 10px; font-size: 0.78rem; cursor: pointer; white-space: nowrap;" title="Pilih foto pengganti">
                <i class="fas fa-camera"></i>
                <input type="file" class="single-replace-photo" data-index="${idx}" accept="image/*" style="display: none;" />
              </label>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Bind delete buttons
    container.querySelectorAll('.btn-remove-photo').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCurrentGalleryState();
        const removeIdx = parseInt(btn.getAttribute('data-index'), 10);
        if (!isNaN(removeIdx)) {
          currentGallery.splice(removeIdx, 1);
          renderGalleryForm(currentGallery);
          showAdminToast('🗑️ Foto berhasil dihapus dari galeri.');
        }
      });
    });

    // Bind move up
    container.querySelectorAll('.btn-move-up').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCurrentGalleryState();
        const moveIdx = parseInt(btn.getAttribute('data-index'), 10);
        if (!isNaN(moveIdx) && moveIdx > 0) {
          const temp = currentGallery[moveIdx];
          currentGallery[moveIdx] = currentGallery[moveIdx - 1];
          currentGallery[moveIdx - 1] = temp;
          renderGalleryForm(currentGallery);
        }
      });
    });

    // Bind move down
    container.querySelectorAll('.btn-move-down').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCurrentGalleryState();
        const moveIdx = parseInt(btn.getAttribute('data-index'), 10);
        if (!isNaN(moveIdx) && moveIdx < currentGallery.length - 1) {
          const temp = currentGallery[moveIdx];
          currentGallery[moveIdx] = currentGallery[moveIdx + 1];
          currentGallery[moveIdx + 1] = temp;
          renderGalleryForm(currentGallery);
        }
      });
    });

    // Bind single photo replacement file input
    container.querySelectorAll('.single-replace-photo').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const cardIdx = parseInt(input.getAttribute('data-index'), 10);
        if (!file || isNaN(cardIdx)) return;
        try {
          showAdminToast('Mengompresi foto baru...');
          const compressed = await compressAndConvertImage(file, 1200, 0.82);
          saveCurrentGalleryState();
          if (currentGallery[cardIdx]) {
            currentGallery[cardIdx].url = compressed;
            renderGalleryForm(currentGallery);
            showAdminToast('✅ Foto berhasil diperbarui!');
          }
        } catch (err) {
          alert('Gagal mengunggah foto pengganti: ' + err.message);
        }
      });
    });

    // Bind URL input live preview
    container.querySelectorAll('.gallery-url').forEach(urlInp => {
      urlInp.addEventListener('change', () => {
        const card = urlInp.closest('.gallery-admin-card');
        const img = card ? card.querySelector('img') : null;
        if (img && urlInp.value.trim()) {
          img.src = urlInp.value.trim();
        }
      });
    });
  }

  function saveCurrentGalleryState() {
    const cards = document.querySelectorAll('#gallery-container .gallery-admin-card');
    currentGallery = [];
    cards.forEach(card => {
      const u = card.querySelector('.gallery-url');
      const cat = card.querySelector('.gallery-category');
      const cap = card.querySelector('.gallery-caption');
      const span = card.querySelector('.gallery-span');
      currentGallery.push({
        url: u ? u.value.trim() : '',
        category: cat ? cat.value : 'prewed',
        caption: cap ? cap.value.trim() : '',
        span: span ? parseInt(span.value, 10) : 1
      });
    });
  }

  // Batch Upload Listener
  const batchUpload = document.getElementById('batch-upload-gallery');
  if (batchUpload) {
    batchUpload.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      saveCurrentGalleryState();
      showAdminToast(`Memproses ${files.length} foto sekaligus...`);

      let successCount = 0;
      for (const file of files) {
        try {
          const compressed = await compressAndConvertImage(file, 1200, 0.82);
          currentGallery.push({
            url: compressed,
            category: 'prewed',
            caption: file.name.replace(/\.[^/.]+$/, ''),
            span: currentGallery.length % 5 === 0 ? 2 : 1
          });
          successCount++;
        } catch (err) {
          console.warn('Gagal memproses file:', file.name, err);
        }
      }

      renderGalleryForm(currentGallery);
      batchUpload.value = '';
      showAdminToast(`✨ Berhasil menambahkan ${successCount} foto ke galeri!`);
    });
  }

  // Dropzone click & drag-and-drop
  const dropzone = document.getElementById('gallery-dropzone');
  if (dropzone && batchUpload) {
    dropzone.addEventListener('click', () => {
      batchUpload.click();
    });

    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--admin-primary)';
        dropzone.style.background = '#f5edd8';
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#b68b40';
        dropzone.style.background = '#fdfaf5';
      });
    });

    dropzone.addEventListener('drop', async (e) => {
      const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
      if (files.length === 0) return;

      saveCurrentGalleryState();
      showAdminToast(`Memproses ${files.length} foto drag & drop...`);

      let successCount = 0;
      for (const file of files) {
        try {
          const compressed = await compressAndConvertImage(file, 1200, 0.82);
          currentGallery.push({
            url: compressed,
            category: 'prewed',
            caption: file.name.replace(/\.[^/.]+$/, ''),
            span: currentGallery.length % 5 === 0 ? 2 : 1
          });
          successCount++;
        } catch (err) {
          console.warn('Gagal memproses file:', file.name, err);
        }
      }

      renderGalleryForm(currentGallery);
      showAdminToast(`✨ Berhasil menambahkan ${successCount} foto!`);
    });
  }

  // Add Manual Gallery Item Button
  const btnAddGallery = document.getElementById('btn-add-gallery-item');
  if (btnAddGallery) {
    btnAddGallery.addEventListener('click', () => {
      saveCurrentGalleryState();
      currentGallery.push({
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        category: 'prewed',
        caption: 'Momen Baru',
        span: 1
      });
      renderGalleryForm(currentGallery);
      setTimeout(() => {
        const cards = document.querySelectorAll('#gallery-container .gallery-admin-card');
        if (cards.length > 0) {
          cards[cards.length - 1].scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    });
  }

  // 4. Load Form Data
  function loadFormData() {
    const config = getWeddingConfig();
    const c = config.couple || DEFAULT_WEDDING_CONFIG.couple;
    const e = config.event || DEFAULT_WEDDING_CONFIG.event;
    const g = config.gift || DEFAULT_WEDDING_CONFIG.gift;
    const cov = config.cover || DEFAULT_WEDDING_CONFIG.cover;
    const q = config.quote || DEFAULT_WEDDING_CONFIG.quote;
    const dc = config.dresscode || DEFAULT_WEDDING_CONFIG.dresscode;
    const ft = config.footer || DEFAULT_WEDDING_CONFIG.footer;

    // Active Theme
    const activeTheme = config.theme || 'template-1';
    updateTemplateUI(activeTheme);

    // Groom
    setVal('groom-nickname', c.groom ? c.groom.nickname : '');
    setVal('groom-fullname', c.groom ? c.groom.fullname : '');
    setVal('groom-child-order', c.groom ? c.groom.childOrder : '');
    setVal('groom-father', c.groom ? c.groom.father : '');
    setVal('groom-mother', c.groom ? c.groom.mother : '');
    setVal('groom-origin', c.groom ? c.groom.origin : '');
    setVal('groom-instagram', c.groom ? c.groom.instagram : '');
    setVal('groom-photo', c.groom ? c.groom.photo : '');

    // Bride
    setVal('bride-nickname', c.bride ? c.bride.nickname : '');
    setVal('bride-fullname', c.bride ? c.bride.fullname : '');
    setVal('bride-child-order', c.bride ? c.bride.childOrder : '');
    setVal('bride-father', c.bride ? c.bride.father : '');
    setVal('bride-mother', c.bride ? c.bride.mother : '');
    setVal('bride-origin', c.bride ? c.bride.origin : '');
    setVal('bride-instagram', c.bride ? c.bride.instagram : '');
    setVal('bride-photo', c.bride ? c.bride.photo : '');

    // Cover / Welcome Texts
    setVal('cover-subtitle', cov.subtitle || '');
    setVal('cover-btn-text', cov.btnText || '');
    setVal('cover-greeting-text', cov.greetingText || '');
    setVal('cover-badge-text', cov.badgeText || '');

    // Quote / Ayat Suci
    setCheck('quote-enabled', typeof q.enabled === 'boolean' ? q.enabled : true);
    setVal('quote-arabic', q.arabic || '');
    setVal('quote-translation', q.translation || '');
    setVal('quote-source', q.source || '');

    // Event
    setVal('event-date-iso', (e && e.dateIso) ? e.dateIso.substring(0, 16) : '2026-10-26T08:00');
    setVal('event-date-formatted', e.dateFormatted || '');
    setVal('event-akad-title', e.akad ? (e.akad.title || 'Akad Nikah') : 'Akad Nikah');
    setVal('event-akad-badge', e.akad ? (e.akad.badge || 'Sakral') : 'Sakral');
    setVal('event-akad-time', e.akad ? e.akad.time : '');
    setVal('event-akad-venue', e.akad ? e.akad.venue : '');
    setVal('event-akad-address', e.akad ? e.akad.address : '');
    setVal('event-resepsi-title', e.resepsi ? (e.resepsi.title || 'Resepsi Pernikahan') : 'Resepsi Pernikahan');
    setVal('event-resepsi-badge', e.resepsi ? (e.resepsi.badge || 'Perayaan') : 'Perayaan');
    setVal('event-resepsi-time', e.resepsi ? e.resepsi.time : '');
    setVal('event-resepsi-venue', e.resepsi ? e.resepsi.venue : '');
    setVal('event-resepsi-address', e.resepsi ? e.resepsi.address : '');
    setVal('event-maps-iframe', e.mapsIframe || '');
    setVal('event-maps-url', e.mapsUrl || '');

    // Dress Code
    setCheck('dresscode-enabled', typeof dc.enabled === 'boolean' ? dc.enabled : true);
    setVal('dresscode-tag', dc.tag || '');
    setVal('dresscode-title', dc.title || '');
    setVal('dresscode-desc', dc.description || '');
    const dcColors = (dc.colors && Array.isArray(dc.colors)) ? dc.colors : (DEFAULT_WEDDING_CONFIG.dresscode.colors || []);
    for (let i = 1; i <= 4; i++) {
      const col = dcColors[i - 1] || { hex: '#ffffff', name: '' };
      setVal(`dc-color-${i}-hex`, col.hex || '#ffffff');
      setVal(`dc-color-${i}-name`, col.name || '');
    }

    // Gift & Bank
    setCheck('gift-enabled', typeof g.enabled === 'boolean' ? g.enabled : true);
    setVal('gift-intro', g.intro || '');
    setVal('bank1-name', g.bank1 ? g.bank1.bankName : '');
    setVal('bank1-number', g.bank1 ? g.bank1.accountNumber : '');
    setVal('bank1-holder', g.bank1 ? g.bank1.accountHolder : '');
    setVal('bank2-name', g.bank2 ? g.bank2.bankName : '');
    setVal('bank2-number', g.bank2 ? g.bank2.accountNumber : '');
    setVal('bank2-holder', g.bank2 ? g.bank2.accountHolder : '');
    setVal('gift-physical-address', g.physicalAddress || '');

    // Footer
    setVal('footer-thanks-text', ft.thanksText || '');
    setVal('footer-family-text', ft.familyText || '');

    // Music
    setVal('audio-url', config.audioUrl || '');

    // Update Profile Photo Previews
    updateProfilePreview('preview-groom-img', 'preview-groom-text', c.groom ? c.groom.photo : '');
    updateProfilePreview('preview-bride-img', 'preview-bride-text', c.bride ? c.bride.photo : '');

    // Stories (Love Story)
    const stories = (config.stories && Array.isArray(config.stories) && config.stories.length > 0)
      ? config.stories
      : (DEFAULT_WEDDING_CONFIG.stories || []);
    renderStoriesForm(stories);

    // Gallery (Album Foto Kenangan)
    const gallery = (config.gallery && Array.isArray(config.gallery) && config.gallery.length > 0)
      ? config.gallery
      : (DEFAULT_WEDDING_CONFIG.gallery || []);
    renderGalleryForm(gallery);

    // Share & Metadata Preview (Otomatis dari Mempelai)
    if (config.share && config.share.source) {
      const radio = document.querySelector(`input[name="share-thumb-source"][value="${config.share.source}"]`);
      if (radio) radio.checked = true;
    }
    updateWaPreview();

    // Account
    try {
      const creds = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{"username":"admin"}');
      setVal('account-username', creds.username || 'admin');
    } catch (err) {}
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setCheck(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(val);
  }

  function getCheck(id) {
    const el = document.getElementById(id);
    return el ? Boolean(el.checked) : false;
  }

  // 5. Save Form Data
  function collectFormData() {
    saveCurrentStoriesState();
    saveCurrentGalleryState();
    let isoDate = getVal('event-date-iso');
    if (!isoDate) {
      isoDate = '2026-10-26T08:00';
    }
    if (isoDate && !isoDate.includes('+') && !isoDate.endsWith('Z')) {
      isoDate = `${isoDate}:00+07:00`;
    }

    const dcColors = [];
    for (let i = 1; i <= 4; i++) {
      const hex = getVal(`dc-color-${i}-hex`) || '#ffffff';
      const name = getVal(`dc-color-${i}-name`) || `Warna ${i}`;
      dcColors.push({ name, hex });
    }

    return {
      theme: getVal('selected-theme') || 'template-1',
      cover: {
        subtitle: getVal('cover-subtitle') || 'The Wedding Celebration Of',
        greetingText: getVal('cover-greeting-text') || 'Kepada Yth. Bapak/Ibu/Saudara/i:',
        badgeText: getVal('cover-badge-text') || 'Tamu Kehormatan',
        btnText: getVal('cover-btn-text') || 'Buka Undangan'
      },
      quote: {
        enabled: getCheck('quote-enabled'),
        arabic: getVal('quote-arabic'),
        translation: getVal('quote-translation'),
        source: getVal('quote-source')
      },
      couple: {
        groom: {
          nickname: getVal('groom-nickname'),
          fullname: getVal('groom-fullname'),
          childOrder: getVal('groom-child-order'),
          father: getVal('groom-father'),
          mother: getVal('groom-mother'),
          origin: getVal('groom-origin'),
          instagram: getVal('groom-instagram'),
          photo: getVal('groom-photo')
        },
        bride: {
          nickname: getVal('bride-nickname'),
          fullname: getVal('bride-fullname'),
          childOrder: getVal('bride-child-order'),
          father: getVal('bride-father'),
          mother: getVal('bride-mother'),
          origin: getVal('bride-origin'),
          instagram: getVal('bride-instagram'),
          photo: getVal('bride-photo')
        }
      },
      event: {
        dateIso: isoDate,
        dateFormatted: getVal('event-date-formatted'),
        akad: {
          title: getVal('event-akad-title') || 'Akad Nikah',
          badge: getVal('event-akad-badge') || 'Sakral',
          time: getVal('event-akad-time'),
          venue: getVal('event-akad-venue'),
          address: getVal('event-akad-address')
        },
        resepsi: {
          title: getVal('event-resepsi-title') || 'Resepsi Pernikahan',
          badge: getVal('event-resepsi-badge') || 'Perayaan',
          time: getVal('event-resepsi-time'),
          venue: getVal('event-resepsi-venue'),
          address: getVal('event-resepsi-address')
        },
        mapsIframe: getVal('event-maps-iframe'),
        mapsUrl: getVal('event-maps-url')
      },
      stories: currentStories,
      dresscode: {
        enabled: getCheck('dresscode-enabled'),
        tag: getVal('dresscode-tag') || 'Petunjuk Pakaian',
        title: getVal('dresscode-title') || 'Dress Code',
        description: getVal('dresscode-desc'),
        colors: dcColors
      },
      gallery: currentGallery,
      gift: {
        enabled: getCheck('gift-enabled'),
        intro: getVal('gift-intro'),
        bank1: {
          bankName: getVal('bank1-name'),
          accountNumber: getVal('bank1-number'),
          accountHolder: getVal('bank1-holder')
        },
        bank2: {
          bankName: getVal('bank2-name'),
          accountNumber: getVal('bank2-number'),
          accountHolder: getVal('bank2-holder')
        },
        physicalAddress: getVal('gift-physical-address')
      },
      footer: {
        thanksText: getVal('footer-thanks-text'),
        familyText: getVal('footer-family-text'),
        copyrightText: (DEFAULT_WEDDING_CONFIG.footer && DEFAULT_WEDDING_CONFIG.footer.copyrightText) || '© 2026 fusionproject.id. All rights reserved.'
      },
      audioUrl: getVal('audio-url'),
      share: {
        source: (document.querySelector('input[name="share-thumb-source"]:checked') || {}).value || 'bride',
        image: getSharePhoto(),
        title: `The Wedding of ${getVal('bride-nickname') || 'Hanim'} & ${getVal('groom-nickname') || 'Firman'}`,
        description: `Undangan Pernikahan ${getVal('bride-nickname') || 'Hanim'} & ${getVal('groom-nickname') || 'Firman'}. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`
      }
    };
  }

  const form = document.getElementById('wedding-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedConfig = collectFormData();
      const success = saveWeddingConfig(updatedConfig);
      if (success) {
        showAdminToast('✅ Data & template undangan berhasil disimpan!');
      } else {
        alert('Gagal menyimpan data.');
      }
    });
  }

  // 6. Export JSON
  const btnExport = document.getElementById('btn-export-json');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const config = collectFormData();
      const jsonStr = JSON.stringify(config, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const bNick = (config.couple && config.couple.bride && config.couple.bride.nickname) ? config.couple.bride.nickname : 'Bride';
      const gNick = (config.couple && config.couple.groom && config.couple.groom.nickname) ? config.couple.groom.nickname : 'Groom';
      a.download = `wedding-data-${bNick}-${gNick}.json`;
      a.click();
      showAdminToast('📥 Konfigurasi JSON berhasil diunduh!');
    });
  }

  // 7. Import JSON
  const fileImport = document.getElementById('file-import-json');
  if (fileImport) {
    fileImport.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          saveWeddingConfig(imported);
          loadFormData();
          showAdminToast('📤 Data JSON berhasil diimpor!');
        } catch (err) {
          alert('Format file JSON tidak valid!');
        }
      };
      reader.readAsText(file);
    });
  }

  // 8. Reset to Default
  const btnReset = document.getElementById('btn-reset-default');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mengembalikan semua data ke data bawaan awal (Hanim & Firman)?')) {
        resetWeddingConfig();
        loadFormData();
        showAdminToast('🔄 Data berhasil direset ke bawaan awal.');
      }
    });
  }

  // 9. Admin Guest Link Generator Handler
  const adminGuestName = document.getElementById('admin-guest-name');
  const adminGenResult = document.getElementById('admin-gen-result');
  const adminGuestLink = document.getElementById('admin-guest-link');
  const btnAdminCopy = document.getElementById('btn-admin-copy-link');
  const btnAdminShareWA = document.getElementById('btn-admin-share-wa');

  function updateAdminGuestLink() {
    if (!adminGuestName) return;
    const raw = adminGuestName.value.trim();
    if (!raw) {
      if (adminGenResult) adminGenResult.style.display = 'none';
      return;
    }

    const currentUrl = window.location.href.split('?')[0].split('#')[0];
    let baseInviteUrl;
    if (currentUrl.includes('admin.html')) {
      baseInviteUrl = currentUrl.replace('admin.html', 'index.html');
    } else {
      baseInviteUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + 'index.html';
    }
    const fullInviteLink = `${baseInviteUrl}?to=${encodeURIComponent(raw)}`;

    if (adminGuestLink) adminGuestLink.value = fullInviteLink;
    if (adminGenResult) adminGenResult.style.display = 'block';

    if (btnAdminShareWA) {
      btnAdminShareWA.onclick = () => {
        const config = getWeddingConfig();
        const b = (config.couple && config.couple.bride && config.couple.bride.nickname) ? config.couple.bride.nickname : 'Hanim';
        const g = (config.couple && config.couple.groom && config.couple.groom.nickname) ? config.couple.groom.nickname : 'Firman';
        const msg = 
`Kepada Yth.
Bapak/Ibu/Saudara/i: *${raw}*

_Assalamu'alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${b} & ${g}*

Berikut tautan undangan kami untuk info lengkap acara:
${fullInviteLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.

Terima kasih.
_Wassalamu'alaikum Warahmatullahi Wabarakatuh_`;

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
      };
    }
  }

  if (adminGuestName) {
    adminGuestName.addEventListener('input', updateAdminGuestLink);
  }

  if (btnAdminCopy && adminGuestLink) {
    btnAdminCopy.addEventListener('click', () => {
      adminGuestLink.select();
      navigator.clipboard.writeText(adminGuestLink.value).then(() => {
        showAdminToast('📋 Tautan khusus tamu berhasil disalin!');
      });
    });
  }

  // 10. Save Account Credentials (Change Password)
  const btnSaveCreds = document.getElementById('btn-save-credentials');
  if (btnSaveCreds) {
    btnSaveCreds.addEventListener('click', () => {
      const newU = getVal('account-username');
      const newP = getVal('account-password');

      if (!newU || newU.length < 3) {
        alert('Username minimal harus 3 karakter.');
        return;
      }
      if (!newP || newP.length < 4) {
        alert('Password baru minimal harus 4 karakter.');
        return;
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        username: newU,
        password: newP
      }));

      setVal('account-password', '');
      showAdminToast('🔐 Username & Password baru berhasil diperbarui!');
    });
  }

  // 11. WhatsApp Preview Sync & GitHub Pages Meta Exporter (Otomatis dari Data Mempelai)
  function getSharePhoto() {
    const sourceEl = document.querySelector('input[name="share-thumb-source"]:checked');
    const source = sourceEl ? sourceEl.value : 'bride';
    const bPhoto = getVal('bride-photo');
    const gPhoto = getVal('groom-photo');
    const defCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

    if (source === 'bride') {
      return bPhoto || gPhoto || defCover;
    } else if (source === 'groom') {
      return gPhoto || bPhoto || defCover;
    } else {
      return defCover;
    }
  }

  function updateWaPreview() {
    const imgEl = document.getElementById('wa-preview-thumb');
    const titleEl = document.getElementById('wa-preview-title');
    const descEl = document.getElementById('wa-preview-desc');
    const urlEl = document.getElementById('wa-preview-url');

    const bName = getVal('bride-nickname') || 'Hanim';
    const gName = getVal('groom-nickname') || 'Firman';
    const shareTitle = `The Wedding of ${bName} & ${gName}`;
    const shareDesc = `Undangan Pernikahan ${bName} & ${gName}. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`;
    const shareImg = getSharePhoto();

    if (imgEl) imgEl.src = shareImg;
    if (titleEl) titleEl.textContent = shareTitle;
    if (descEl) descEl.textContent = shareDesc;
    if (urlEl) {
      const cur = window.location.href.split('?')[0].split('#')[0];
      const base = cur.replace(/admin\.html.*$/, 'index.html');
      urlEl.textContent = base;
    }
  }

  // Auto-update preview saat data mempelai diubah
  ['bride-nickname', 'groom-nickname', 'bride-photo', 'groom-photo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateWaPreview);
  });

  document.querySelectorAll('input[name="share-thumb-source"]').forEach(radio => {
    radio.addEventListener('change', updateWaPreview);
  });

  // Copy Meta Tags to Clipboard
  const btnCopyMeta = document.getElementById('btn-copy-meta-tags');
  if (btnCopyMeta) {
    btnCopyMeta.addEventListener('click', () => {
      const config = collectFormData();
      const metaCode = 
`<!-- SEO & Social Media Metadata (Open Graph / WhatsApp Preview) -->
<title>${config.share.title}</title>
<meta name="description" content="${config.share.description}" />
<meta property="og:title" content="${config.share.title}" />
<meta property="og:description" content="${config.share.description}" />
<meta property="og:image" content="${config.share.image}" />
<meta property="og:type" content="website" />`;

      navigator.clipboard.writeText(metaCode).then(() => {
        showAdminToast('📋 Kode Meta Tag berhasil disalin!');
      }).catch(() => {
        prompt('Salin kode meta berikut:', metaCode);
      });
    });
  }

  // Download Updated index.html
  const btnDownloadHtml = document.getElementById('btn-download-html');
  if (btnDownloadHtml) {
    btnDownloadHtml.addEventListener('click', async () => {
      try {
        const config = collectFormData();
        showAdminToast('Menyiapkan file index.html terbaru...');
        
        let htmlText = '';
        try {
          const resp = await fetch('index.html');
          if (resp.ok) {
            htmlText = await resp.text();
          }
        } catch (fetchErr) {
          console.warn('Fetch local index.html failed:', fetchErr);
        }

        if (!htmlText) {
          alert('Tidak dapat membaca file index.html secara langsung. Silakan gunakan tombol "Salin Kode Tag Meta HTML" untuk menempelkannya ke index.html Anda.');
          return;
        }

        const sTitle = config.share.title;
        const sDesc = config.share.description;
        const sImg = config.share.image;
        const b = config.couple.bride.nickname;
        const g = config.couple.groom.nickname;

        // Replace metadata
        htmlText = htmlText.replace(/<title>.*?<\/title>/i, `<title>${sTitle}</title>`);
        htmlText = htmlText.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${sTitle}" />`);
        htmlText = htmlText.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${sDesc}" />`);
        htmlText = htmlText.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${sImg}" />`);
        htmlText = htmlText.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${sDesc}" />`);

        // Replace timeline stories in static HTML
        if (config.stories && Array.isArray(config.stories) && config.stories.length > 0) {
          const storiesHtml = config.stories.map((st, idx) => `
        <div class="timeline-item reveal-item reveal-delay-${(idx % 4) + 1}">
          <div class="timeline-dot"><i class="fas fa-heart" style="font-size: 8px; color: var(--primary);"></i></div>
          <div class="timeline-card">
            <span class="timeline-year">${escapeAdminHtml(st.year || '')}</span>
            <h4 class="timeline-title">${escapeAdminHtml(st.title || '')}</h4>
            <p class="timeline-desc">
              ${escapeAdminHtml(st.desc || '')}
            </p>
          </div>
        </div>`).join('\n');

          htmlText = htmlText.replace(/<div class="timeline">[\s\S]*?<\/div>(\s*<\/section>)/i, `<div class="timeline">\n${storiesHtml}\n      </div>$1`);
        }

        // Replace gallery items in static HTML
        if (config.gallery && Array.isArray(config.gallery) && config.gallery.length > 0) {
          const galleryHtml = config.gallery.map((item, idx) => {
            const spanClass = item.span === 2 ? ' span-2' : '';
            const cat = escapeAdminHtml(item.category || 'all');
            const cap = escapeAdminHtml(item.caption || `Momen ${idx + 1}`);
            const url = escapeAdminHtml(item.url || '');
            return `
        <div class="gallery-item${spanClass} reveal-item" data-category="${cat}">
          <img src="${url}" alt="${cap}" loading="lazy" />
          <div class="gallery-item-overlay"><i class="fas fa-search-plus"></i></div>
        </div>`;
          }).join('\n');

          htmlText = htmlText.replace(/<div class="gallery-grid reveal-item">[\s\S]*?<\/div>(\s*<\/section>)/i, `<div class="gallery-grid reveal-item">\n${galleryHtml}\n      </div>$1`);
        }

        // Embed configuration data directly for static hosts like GitHub Pages
        const embeddedConfigScript = `<script>window.__EMBEDDED_WEDDING_CONFIG__ = ${JSON.stringify(config, null, 2)};<\/script>`;
        if (htmlText.includes('window.__EMBEDDED_WEDDING_CONFIG__')) {
          htmlText = htmlText.replace(/<script>window\.__EMBEDDED_WEDDING_CONFIG__[\s\S]*?<\/script>/i, embeddedConfigScript);
        } else {
          htmlText = htmlText.replace(/<script src="assets\/js\/config\.js/i, `${embeddedConfigScript}\n  <script src="assets/js/config.js`);
        }

        const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showAdminToast('📥 File index.html terbaru berhasil diunduh!');
      } catch (err) {
        console.error(err);
        alert('Gagal membuat file index.html.');
      }
    });
  }

  function showAdminToast(msg) {
    let toast = document.querySelector('.admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'admin-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'flex';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  }

  // Initial load
  loadFormData();
});
