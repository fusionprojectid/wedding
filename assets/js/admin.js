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

  // 4. Load Form Data
  function loadFormData() {
    const config = getWeddingConfig();
    const c = config.couple;
    const e = config.event;
    const g = config.gift;

    // Active Theme
    const activeTheme = config.theme || 'template-1';
    updateTemplateUI(activeTheme);

    // Groom
    setVal('groom-nickname', c.groom.nickname);
    setVal('groom-fullname', c.groom.fullname);
    setVal('groom-child-order', c.groom.childOrder);
    setVal('groom-father', c.groom.father);
    setVal('groom-mother', c.groom.mother);
    setVal('groom-origin', c.groom.origin);
    setVal('groom-instagram', c.groom.instagram);
    setVal('groom-photo', c.groom.photo);

    // Bride
    setVal('bride-nickname', c.bride.nickname);
    setVal('bride-fullname', c.bride.fullname);
    setVal('bride-child-order', c.bride.childOrder);
    setVal('bride-father', c.bride.father);
    setVal('bride-mother', c.bride.mother);
    setVal('bride-origin', c.bride.origin);
    setVal('bride-instagram', c.bride.instagram);
    setVal('bride-photo', c.bride.photo);

    // Event
    setVal('event-date-iso', (e && e.dateIso) ? e.dateIso.substring(0, 16) : '2026-10-26T08:00');
    setVal('event-date-formatted', e.dateFormatted);
    setVal('event-akad-time', e.akad ? e.akad.time : '');
    setVal('event-akad-venue', e.akad ? e.akad.venue : '');
    setVal('event-akad-address', e.akad ? e.akad.address : '');
    setVal('event-resepsi-time', e.resepsi ? e.resepsi.time : '');
    setVal('event-resepsi-venue', e.resepsi ? e.resepsi.venue : '');
    setVal('event-resepsi-address', e.resepsi ? e.resepsi.address : '');
    setVal('event-maps-iframe', e.mapsIframe);
    setVal('event-maps-url', e.mapsUrl);

    // Gift & Bank
    setVal('bank1-name', g.bank1 ? g.bank1.bankName : '');
    setVal('bank1-number', g.bank1 ? g.bank1.accountNumber : '');
    setVal('bank1-holder', g.bank1 ? g.bank1.accountHolder : '');
    setVal('bank2-name', g.bank2 ? g.bank2.bankName : '');
    setVal('bank2-number', g.bank2 ? g.bank2.accountNumber : '');
    setVal('bank2-holder', g.bank2 ? g.bank2.accountHolder : '');
    setVal('gift-physical-address', g.physicalAddress);

    // Music
    setVal('audio-url', config.audioUrl);

    // Share & Metadata Preview
    const s = config.share || DEFAULT_WEDDING_CONFIG.share || {};
    setVal('share-image', s.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');
    setVal('share-title', s.title || `The Wedding of ${c.bride.nickname || 'Hanim'} & ${c.groom.nickname || 'Firman'}`);
    setVal('share-desc', s.description || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.');
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

  // 5. Save Form Data
  function collectFormData() {
    let isoDate = getVal('event-date-iso');
    if (!isoDate) {
      isoDate = '2026-10-26T08:00';
    }
    if (isoDate && !isoDate.includes('+') && !isoDate.endsWith('Z')) {
      isoDate = `${isoDate}:00+07:00`;
    }

    return {
      theme: getVal('selected-theme') || 'template-1',
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
          time: getVal('event-akad-time'),
          venue: getVal('event-akad-venue'),
          address: getVal('event-akad-address')
        },
        resepsi: {
          time: getVal('event-resepsi-time'),
          venue: getVal('event-resepsi-venue'),
          address: getVal('event-resepsi-address')
        },
        mapsIframe: getVal('event-maps-iframe'),
        mapsUrl: getVal('event-maps-url')
      },
      gift: {
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
      audioUrl: getVal('audio-url'),
      share: {
        image: getVal('share-image') || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        title: getVal('share-title') || `The Wedding of ${getVal('bride-nickname') || 'Hanim'} & ${getVal('groom-nickname') || 'Firman'}`,
        description: getVal('share-desc') || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.'
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

  // 11. WhatsApp Preview Sync & GitHub Pages Meta Exporter
  function updateWaPreview() {
    const imgEl = document.getElementById('wa-preview-thumb');
    const titleEl = document.getElementById('wa-preview-title');
    const descEl = document.getElementById('wa-preview-desc');
    const urlEl = document.getElementById('wa-preview-url');

    const shareImg = getVal('share-image') || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
    const bName = getVal('bride-nickname') || 'Hanim';
    const gName = getVal('groom-nickname') || 'Firman';
    const shareTitle = getVal('share-title') || `The Wedding of ${bName} & ${gName}`;
    const shareDesc = getVal('share-desc') || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.';

    if (imgEl) imgEl.src = shareImg;
    if (titleEl) titleEl.textContent = shareTitle;
    if (descEl) descEl.textContent = shareDesc;
    if (urlEl) {
      const cur = window.location.href.split('?')[0].split('#')[0];
      const base = cur.replace(/admin\.html.*$/, 'index.html');
      urlEl.textContent = base;
    }
  }

  ['share-image', 'share-title', 'share-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateWaPreview);
  });

  // Quick Photo Buttons
  const btnBridePhoto = document.getElementById('btn-use-bride-photo');
  if (btnBridePhoto) {
    btnBridePhoto.addEventListener('click', () => {
      const p = getVal('bride-photo');
      if (p) {
        setVal('share-image', p);
        updateWaPreview();
        showAdminToast('Foto mempelai wanita diterapkan ke thumbnail!');
      } else {
        alert('URL foto pengantin wanita di tab Data Mempelai masih kosong!');
      }
    });
  }

  const btnGroomPhoto = document.getElementById('btn-use-groom-photo');
  if (btnGroomPhoto) {
    btnGroomPhoto.addEventListener('click', () => {
      const p = getVal('groom-photo');
      if (p) {
        setVal('share-image', p);
        updateWaPreview();
        showAdminToast('Foto mempelai pria diterapkan ke thumbnail!');
      } else {
        alert('URL foto pengantin pria di tab Data Mempelai masih kosong!');
      }
    });
  }

  const btnDefaultPhoto = document.getElementById('btn-use-default-photo');
  if (btnDefaultPhoto) {
    btnDefaultPhoto.addEventListener('click', () => {
      setVal('share-image', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');
      updateWaPreview();
      showAdminToast('Foto thumbnail direset ke foto bawaan!');
    });
  }

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
