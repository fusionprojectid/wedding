/**
 * CONFIG & DYNAMIC DATA HANDLER
 * Manages wedding configuration stored in localStorage or default fallback.
 * Includes deep merge, theme switching, and live DOM hydration.
 */

const DEFAULT_WEDDING_CONFIG = {
  theme: 'template-1',
  share: {
    source: 'bride',
    title: 'The Wedding of Hanim & Firman',
    description: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
  },
  cover: {
    subtitle: 'The Wedding Celebration Of',
    greetingText: 'Kepada Yth. Bapak/Ibu/Saudara/i:',
    badgeText: 'Tamu Kehormatan',
    btnText: 'Buka Undangan'
  },
  quote: {
    enabled: true,
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    translation: '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."',
    source: '~ QS. Ar-Rum: 21 ~'
  },
  couple: {
    groom: {
      nickname: 'Firman',
      fullname: 'Firman Pratama, S.Kom',
      father: 'Bapak Budi Santoso',
      mother: 'Ibu Rina Marlina',
      origin: 'Bandung, Jawa Barat',
      childOrder: 'Putra Pertama dari',
      instagram: 'firmanpratama',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80'
    },
    bride: {
      nickname: 'Hanim',
      fullname: 'Hanim Lathifah, S.Ds',
      father: 'Bapak Ahmad Hidayat',
      mother: 'Ibu Siti Aminah',
      origin: 'Bandung, Jawa Barat',
      childOrder: 'Putri Kedua dari',
      instagram: 'hanimlathifah',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
    }
  },
  event: {
    dateIso: '2026-10-26T08:00:00+07:00',
    dateFormatted: 'Sabtu, 26 Oktober 2026',
    akad: {
      title: 'Akad Nikah',
      badge: 'Sakral',
      time: 'Pukul 08.00 - 10.00 WIB',
      venue: 'Gedung Serbaguna LokaLaku',
      address: 'Jalan Mawar No. 15, Sukajadi, Kota Bandung, Jawa Barat'
    },
    resepsi: {
      title: 'Resepsi Pernikahan',
      badge: 'Perayaan',
      time: 'Pukul 11.00 - 14.00 WIB',
      venue: 'Gedung Serbaguna LokaLaku - Grand Ballroom',
      address: 'Jalan Mawar No. 15, Sukajadi, Kota Bandung, Jawa Barat'
    },
    mapsIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126915.04842761742!2d107.5618092578358!3d-6.903947822945393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e66e2619dc71%3A0x5027a76e3521ec20!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1691828030000!5m2!1sen!2sid',
    mapsUrl: 'https://maps.google.com/?q=Bandung,West+Java'
  },
  stories: [
    {
      year: 'Maret 2021',
      title: 'Pertama Bertemu',
      desc: 'Takdir mempertemukan kami dalam sebuah proyek kolaborasi kampus di Bandung. Dari percakapan singkat mengenai tugas, berlanjut menjadi diskusi hangat yang tak pernah usai.'
    },
    {
      year: 'Agustus 2023',
      title: 'Menjalin Komitmen',
      desc: 'Setelah saling mengenal karakter, nilai kehidupan, dan impian masa depan, kami sepakat untuk mengarungi bahtera kehidupan bersama dengan komitmen yang tulus.'
    },
    {
      year: 'Desember 2025',
      title: 'Hari Lamaran',
      desc: 'Di hadapan keluarga besar kedua belah pihak, Firman mengutarakan niat sucinya untuk meminang Hanim sebagai pendamping hidup dunia dan akhirat.'
    },
    {
      year: 'Oktober 2026',
      title: 'Menuju Pelaminan',
      desc: 'Hari yang dinantikan tiba. Mengikat janji suci pernikahan untuk saling melengkapi dan menyayangi selamanya.'
    }
  ],
  dresscode: {
    enabled: true,
    tag: 'Petunjuk Pakaian',
    title: 'Dress Code',
    description: 'Para tamu undangan disarankan mengenakan busana bernuansa warna berikut:',
    colors: [
      { name: 'Sage Green', hex: '#586b62' },
      { name: 'Champagne', hex: '#d4af37' },
      { name: 'Mocca', hex: '#cbb89d' },
      { name: 'Ivory White', hex: '#f7f5f0' }
    ]
  },
  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      category: 'prewed',
      caption: 'Momen Prewedding 1',
      span: 2
    },
    {
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
      category: 'prewed',
      caption: 'Momen Prewedding 2',
      span: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      category: 'casual',
      caption: 'Momen Santai Bersama',
      span: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      category: 'casual',
      caption: 'Momen Ceria',
      span: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
      category: 'prewed',
      caption: 'Momen Menuju Pelaminan',
      span: 1
    }
  ],
  gift: {
    enabled: true,
    intro: 'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda hendak memberikan tanda kasih, Anda dapat menyalurkannya melalui dompet digital / transfer bank berikut:',
    bank1: {
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'Firman Pratama'
    },
    bank2: {
      bankName: 'MANDIRI',
      accountNumber: '9876543210',
      accountHolder: 'Hanim Lathifah'
    },
    physicalAddress: 'Jl. Mawar No. 15 RT 02/RW 04, Sukajadi, Kota Bandung, Jawa Barat (Kode Pos 40161) - Penerima: Firman & Hanim (0812-3456-7890)'
  },
  footer: {
    thanksText: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.',
    familyText: 'Keluarga Besar Bpk. Ahmad Hidayat & Bpk. Budi Santoso',
    copyrightText: '© 2026 <a href="https://fusionproject.id" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 600; text-decoration: none;">fusionproject.id</a>. All rights reserved.'
  },
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_bebd139b3f.mp3?filename=romantic-piano-112191.mp3'
};

const WEDDING_STORAGE_KEY = 'fusion_wedding_custom_config';

function escapeText(str) {
  if (typeof str !== 'string') str = String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      output[key] = source[key];
    }
  }
  return output;
}

function getWeddingConfig() {
  let baseConfig = DEFAULT_WEDDING_CONFIG;
  if (typeof window !== 'undefined' && window.__EMBEDDED_WEDDING_CONFIG__) {
    baseConfig = deepMerge(DEFAULT_WEDDING_CONFIG, window.__EMBEDDED_WEDDING_CONFIG__);
  }
  try {
    const raw = localStorage.getItem(WEDDING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(baseConfig, parsed);
    }
  } catch (e) {
    console.error('Error reading wedding config:', e);
  }
  return baseConfig;
}

function saveWeddingConfig(config) {
  try {
    localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error saving wedding config:', e);
    return false;
  }
}

function resetWeddingConfig() {
  localStorage.removeItem(WEDDING_STORAGE_KEY);
}

// Dynamically apply config to the active invitation page (index.html)
function applyConfigToPage() {
  const config = getWeddingConfig();
  const c = config.couple || DEFAULT_WEDDING_CONFIG.couple;
  const e = config.event || DEFAULT_WEDDING_CONFIG.event;
  const g = config.gift || DEFAULT_WEDDING_CONFIG.gift;
  const cov = config.cover || DEFAULT_WEDDING_CONFIG.cover;
  const q = config.quote || DEFAULT_WEDDING_CONFIG.quote;
  const dc = config.dresscode || DEFAULT_WEDDING_CONFIG.dresscode;
  const ft = config.footer || DEFAULT_WEDDING_CONFIG.footer;

  const bNick = (c.bride && c.bride.nickname) ? c.bride.nickname : 'Hanim';
  const gNick = (c.groom && c.groom.nickname) ? c.groom.nickname : 'Firman';

  // 0. Theme Application (Checks URL param ?template=X first, then config)
  const urlParams = new URLSearchParams(window.location.search);
  let activeTheme = config.theme || 'template-1';
  const paramTheme = urlParams.get('template') || urlParams.get('theme');

  if (paramTheme) {
    if (paramTheme === '1' || paramTheme === 'template-1') activeTheme = 'theme-template-1';
    else if (paramTheme === '2' || paramTheme === 'template-2') activeTheme = 'theme-template-2';
    else if (paramTheme === '3' || paramTheme === 'template-3') activeTheme = 'theme-template-3';
    else if (paramTheme === '4' || paramTheme === 'template-4') activeTheme = 'theme-template-4';
    else if (paramTheme === '5' || paramTheme === 'template-5') activeTheme = 'theme-template-5';
    else if (paramTheme === '6' || paramTheme === 'template-6') activeTheme = 'theme-template-6';
    else if (paramTheme === '7' || paramTheme === 'template-7') activeTheme = 'theme-template-7';
    else if (paramTheme === '8' || paramTheme === 'template-8') activeTheme = 'theme-template-8';
    else activeTheme = `theme-${paramTheme}`;
  } else {
    activeTheme = activeTheme.startsWith('theme-') ? activeTheme : `theme-${activeTheme}`;
  }

  const allThemes = [
    'theme-template-1', 'theme-template-2', 'theme-template-3', 'theme-template-4',
    'theme-template-5', 'theme-template-6', 'theme-template-7', 'theme-template-8'
  ];
  allThemes.forEach(t => {
    document.body.classList.remove(t);
    document.documentElement.classList.remove(t);
  });
  document.body.classList.add(activeTheme);
  document.documentElement.classList.add(activeTheme);

  // 1. Title & Meta (Open Graph & SEO Otomatis dari Data Mempelai)
  const shareTitle = `The Wedding of ${bNick} & ${gNick}`;
  const shareDesc = `Undangan Pernikahan ${bNick} & ${gNick}${e.dateFormatted ? ' - ' + e.dateFormatted : ''}. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`;
  
  let shareImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
  if (config.share && config.share.image) {
    shareImage = config.share.image;
  } else if (c.bride && c.bride.photo) {
    shareImage = c.bride.photo;
  } else if (c.groom && c.groom.photo) {
    shareImage = c.groom.photo;
  }

  document.title = shareTitle;

  const setMeta = (selector, attr, val) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (selector.includes('property=')) {
        const prop = selector.match(/property="([^"]+)"/);
        if (prop) el.setAttribute('property', prop[1]);
      } else if (selector.includes('name=')) {
        const nm = selector.match(/name="([^"]+)"/);
        if (nm) el.setAttribute('name', nm[1]);
      }
      document.head.appendChild(el);
    }
    el.setAttribute(attr, val);
  };

  setMeta('meta[property="og:title"]', 'content', shareTitle);
  setMeta('meta[property="og:description"]', 'content', shareDesc);
  setMeta('meta[property="og:image"]', 'content', shareImage);
  setMeta('meta[name="description"]', 'content', shareDesc);
  setMeta('meta[name="twitter:title"]', 'content', shareTitle);
  setMeta('meta[name="twitter:description"]', 'content', shareDesc);
  setMeta('meta[name="twitter:image"]', 'content', shareImage);

  // 2. Monograms
  const mono = `${bNick.charAt(0)}&amp;${gNick.charAt(0)}`;
  document.querySelectorAll('.welcome-monogram, .footer-monogram').forEach(el => {
    el.innerHTML = mono;
  });

  // 3. Welcome Screen & Cover
  const welcomeSubtitle = document.querySelector('.welcome-subtitle');
  if (welcomeSubtitle && cov.subtitle) welcomeSubtitle.textContent = cov.subtitle;

  const welcomeTitle = document.querySelector('.welcome-title');
  if (welcomeTitle) welcomeTitle.innerHTML = `${bNick} <span>&amp;</span> ${gNick}`;

  const guestCardP = document.querySelector('.guest-card p');
  if (guestCardP && cov.greetingText) {
    guestCardP.innerHTML = `<i class="fas fa-envelope-open-text"></i> ${escapeText(cov.greetingText)}`;
  }

  const guestBadge = document.querySelector('.guest-badge');
  if (guestBadge && cov.badgeText) {
    guestBadge.innerHTML = `<i class="fas fa-sparkles"></i> ${escapeText(cov.badgeText)}`;
  }

  const openBtn = document.getElementById('open-btn');
  if (openBtn && cov.btnText) {
    openBtn.innerHTML = `<i class="fas fa-envelope"></i> ${escapeText(cov.btnText)}`;
  }

  // 4. Hero Section
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle && cov.subtitle) heroSubtitle.textContent = cov.subtitle;

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.innerHTML = `${bNick} <span class="amp">&amp;</span> ${gNick}`;

  const heroDate = document.querySelector('.hero-date');
  if (heroDate && e.dateFormatted) {
    heroDate.innerHTML = `<i class="far fa-calendar-check"></i> ${escapeText(e.dateFormatted)}`;
  }

  // 4.5. Quote / Ayat Suci Section
  const quoteSec = document.getElementById('quote');
  if (quoteSec && q) {
    if (q.enabled === false) {
      quoteSec.style.display = 'none';
    } else {
      quoteSec.style.display = '';
      const qArabic = quoteSec.querySelector('.quote-arabic');
      if (qArabic && q.arabic !== undefined) qArabic.textContent = q.arabic;
      const qTrans = quoteSec.querySelector('.quote-translation');
      if (qTrans && q.translation !== undefined) qTrans.textContent = q.translation;
      const qSource = quoteSec.querySelector('.quote-source');
      if (qSource && q.source !== undefined) qSource.textContent = q.source;
    }
  }

  // 5. Groom Section
  const groomCard = document.querySelector('.couple-wrapper .couple-card:first-child');
  if (groomCard && c.groom) {
    const img = groomCard.querySelector('.couple-photo');
    if (img && c.groom.photo) img.src = c.groom.photo;
    const name = groomCard.querySelector('.couple-name');
    if (name) name.textContent = c.groom.fullname || '';
    const order = groomCard.querySelector('.couple-fullname');
    if (order) order.textContent = c.groom.childOrder || '';
    const parents = groomCard.querySelector('.couple-parents');
    if (parents) parents.innerHTML = `${escapeText(c.groom.father || '')} &amp; ${escapeText(c.groom.mother || '')}<br><small>${escapeText(c.groom.origin || '')}</small>`;
    const social = groomCard.querySelector('.couple-social');
    if (social && c.groom.instagram) {
      const cleanIg = c.groom.instagram.replace('@', '');
      social.href = `https://instagram.com/${cleanIg}`;
      social.innerHTML = `<i class="fab fa-instagram"></i> @${cleanIg}`;
    }
  }

  // 6. Bride Section
  const brideCard = document.querySelector('.couple-wrapper .couple-card:last-child');
  if (brideCard && c.bride) {
    const img = brideCard.querySelector('.couple-photo');
    if (img && c.bride.photo) img.src = c.bride.photo;
    const name = brideCard.querySelector('.couple-name');
    if (name) name.textContent = c.bride.fullname || '';
    const order = brideCard.querySelector('.couple-fullname');
    if (order) order.textContent = c.bride.childOrder || '';
    const parents = brideCard.querySelector('.couple-parents');
    if (parents) parents.innerHTML = `${escapeText(c.bride.father || '')} &amp; ${escapeText(c.bride.mother || '')}<br><small>${escapeText(c.bride.origin || '')}</small>`;
    const social = brideCard.querySelector('.couple-social');
    if (social && c.bride.instagram) {
      const cleanIg = c.bride.instagram.replace('@', '');
      social.href = `https://instagram.com/${cleanIg}`;
      social.innerHTML = `<i class="fab fa-instagram"></i> @${cleanIg}`;
    }
  }

  // 7. Event Section - Akad
  const akadCard = document.querySelector('.events-wrapper .event-card:first-child');
  if (akadCard && e.akad) {
    const badge = akadCard.querySelector('.event-badge');
    if (badge && e.akad.badge) badge.innerHTML = `<i class="fas fa-gem"></i> ${escapeText(e.akad.badge)}`;
    const name = akadCard.querySelector('.event-name');
    if (name && e.akad.title) name.textContent = e.akad.title;
    const items = akadCard.querySelectorAll('.event-info-item');
    if (items[0]) {
      items[0].innerHTML = `<i class="far fa-calendar-alt"></i><div><strong>${escapeText(e.dateFormatted || '')}</strong><div>${escapeText(e.akad.time || '')}</div></div>`;
    }
    if (items[1]) {
      items[1].innerHTML = `<i class="fas fa-map-marker-alt"></i><div><strong>${escapeText(e.akad.venue || '')}</strong><div>${escapeText(e.akad.address || '')}</div></div>`;
    }
  }

  // 8. Event Section - Resepsi
  const resepsiCard = document.querySelector('.events-wrapper .event-card:last-child');
  if (resepsiCard && e.resepsi) {
    const badge = resepsiCard.querySelector('.event-badge');
    if (badge && e.resepsi.badge) badge.innerHTML = `<i class="fas fa-glass-cheers"></i> ${escapeText(e.resepsi.badge)}`;
    const name = resepsiCard.querySelector('.event-name');
    if (name && e.resepsi.title) name.textContent = e.resepsi.title;
    const items = resepsiCard.querySelectorAll('.event-info-item');
    if (items[0]) {
      items[0].innerHTML = `<i class="far fa-calendar-alt"></i><div><strong>${escapeText(e.dateFormatted || '')}</strong><div>${escapeText(e.resepsi.time || '')}</div></div>`;
    }
    if (items[1]) {
      items[1].innerHTML = `<i class="fas fa-map-marker-alt"></i><div><strong>${escapeText(e.resepsi.venue || '')}</strong><div>${escapeText(e.resepsi.address || '')}</div></div>`;
    }
    const iframe = resepsiCard.querySelector('iframe');
    if (iframe && e.mapsIframe) iframe.src = e.mapsIframe;
    const btnMaps = resepsiCard.querySelector('.btn-maps');
    if (btnMaps && e.mapsUrl) btnMaps.href = e.mapsUrl;
  }

  // 8.5. Love Story Section (Perjalanan Kami)
  const timelineEl = document.querySelector('#story .timeline');
  const storiesList = (config.stories && Array.isArray(config.stories) && config.stories.length > 0)
    ? config.stories
    : DEFAULT_WEDDING_CONFIG.stories;

  if (timelineEl && storiesList && storiesList.length > 0) {
    timelineEl.innerHTML = storiesList.map((st, idx) => `
      <div class="timeline-item reveal-item revealed reveal-delay-${(idx % 4) + 1}">
        <div class="timeline-dot"><i class="fas fa-heart" style="font-size: 8px; color: var(--primary);"></i></div>
        <div class="timeline-card">
          <span class="timeline-year">${escapeText(st.year || '')}</span>
          <h4 class="timeline-title">${escapeText(st.title || '')}</h4>
          <p class="timeline-desc">${escapeText(st.desc || '')}</p>
        </div>
      </div>
    `).join('');
  }

  // 8.7. Dress Code Section
  const dressSec = document.getElementById('dresscode');
  if (dressSec && dc) {
    if (dc.enabled === false) {
      dressSec.style.display = 'none';
    } else {
      dressSec.style.display = '';
      const tagEl = dressSec.querySelector('.section-tag');
      if (tagEl && dc.tag) tagEl.textContent = dc.tag;
      const titleEl = dressSec.querySelector('.section-title');
      if (titleEl && dc.title) titleEl.textContent = dc.title;
      const descEl = dressSec.querySelector('p');
      if (descEl && dc.description) descEl.textContent = dc.description;
      const paletteEl = dressSec.querySelector('.dresscode-palette');
      if (paletteEl && dc.colors && Array.isArray(dc.colors) && dc.colors.length > 0) {
        paletteEl.innerHTML = dc.colors.map(col => `
          <div class="color-swatch">
            <div class="swatch-circle" style="background-color: ${escapeText(col.hex)}; border: 1px solid rgba(0,0,0,0.1);"></div>
            <span class="swatch-name">${escapeText(col.name)}</span>
          </div>
        `).join('');
      }
    }
  }

  // 8.8. Photo Gallery Section (Kenangan Indah)
  const galleryGrid = document.querySelector('#gallery .gallery-grid');
  const galleryList = (config.gallery && Array.isArray(config.gallery) && config.gallery.length > 0)
    ? config.gallery
    : DEFAULT_WEDDING_CONFIG.gallery;

  if (galleryGrid && galleryList && galleryList.length > 0) {
    galleryGrid.innerHTML = galleryList.map((item, idx) => {
      const spanClass = item.span === 2 ? ' span-2' : '';
      const cat = escapeText(item.category || 'all');
      const cap = escapeText(item.caption || `Momen ${idx + 1}`);
      const url = escapeText(item.url || '');
      return `
        <div class="gallery-item${spanClass} reveal-item revealed" data-category="${cat}">
          <img src="${url}" alt="${cap}" loading="lazy" />
          <div class="gallery-item-overlay"><i class="fas fa-search-plus"></i></div>
        </div>
      `;
    }).join('');

    if (typeof window.initGallery === 'function') {
      window.initGallery();
    }
  }

  // 9. Wedding Gift / Bank
  const giftSec = document.getElementById('gift');
  const giftNav = document.querySelector('nav#bottom-nav a[href="#gift"]');
  if (giftSec && g) {
    if (g.enabled === false) {
      giftSec.style.display = 'none';
      if (giftNav) giftNav.style.display = 'none';
    } else {
      giftSec.style.display = '';
      if (giftNav) giftNav.style.display = '';
      const introP = giftSec.querySelector('.gift-intro');
      if (introP && g.intro) introP.textContent = g.intro;

      const bankCards = document.querySelectorAll('.bank-card');
      if (bankCards[0] && g.bank1) {
        const logo = bankCards[0].querySelector('.bank-logo');
        if (logo) logo.innerHTML = `<i class="fas fa-university"></i> ${g.bank1.bankName || 'BANK'}`;
        const num = bankCards[0].querySelector('.bank-number');
        if (num && g.bank1.accountNumber) num.textContent = g.bank1.accountNumber.replace(/(\d{4})/g, '$1 ').trim();
        const holder = bankCards[0].querySelector('.bank-holder');
        if (holder) holder.textContent = `a.n. ${g.bank1.accountHolder || ''}`;
        const btn = bankCards[0].querySelector('.btn-copy');
        if (btn && g.bank1.accountNumber) {
          btn.setAttribute('data-copy', g.bank1.accountNumber);
          btn.setAttribute('data-label', `Nomor rekening ${g.bank1.bankName || ''}`);
        }
      }

      if (bankCards[1] && g.bank2) {
        const logo = bankCards[1].querySelector('.bank-logo');
        if (logo) logo.innerHTML = `<i class="fas fa-university"></i> ${g.bank2.bankName || 'BANK'}`;
        const num = bankCards[1].querySelector('.bank-number');
        if (num && g.bank2.accountNumber) num.textContent = g.bank2.accountNumber.replace(/(\d{4})/g, '$1 ').trim();
        const holder = bankCards[1].querySelector('.bank-holder');
        if (holder) holder.textContent = `a.n. ${g.bank2.accountHolder || ''}`;
        const btn = bankCards[1].querySelector('.btn-copy');
        if (btn && g.bank2.accountNumber) {
          btn.setAttribute('data-copy', g.bank2.accountNumber);
          btn.setAttribute('data-label', `Nomor rekening ${g.bank2.bankName || ''}`);
        }
      }

      // Physical Gift Address
      const physBox = document.querySelector('.gift-physical-box');
      if (physBox && g.physicalAddress) {
        const p = physBox.querySelector('p');
        if (p) {
          p.innerHTML = `Bagi yang ingin mengirimkan kado pernikahan langsung ke alamat mempelai:<br><strong>${escapeText(g.physicalAddress)}</strong>`;
        }
        const btnPhys = physBox.querySelector('.btn-copy');
        if (btnPhys) {
          btnPhys.setAttribute('data-copy', g.physicalAddress);
        }
      }
    }
  }

  // 10. Background Music
  const audioEl = document.getElementById('bg-music');
  if (audioEl && config.audioUrl) {
    const srcEl = audioEl.querySelector('source');
    if (srcEl && srcEl.src !== config.audioUrl) {
      srcEl.src = config.audioUrl;
      audioEl.load();
    }
  }

  // 11. Footer
  const footerThanks = document.querySelector('.footer-thanks');
  if (footerThanks && ft.thanksText) footerThanks.textContent = ft.thanksText;

  const footerFamily = document.querySelector('.footer-family');
  if (footerFamily) {
    if (ft.familyText) {
      footerFamily.textContent = ft.familyText;
    } else {
      const fBride = (c.bride && c.bride.father) ? c.bride.father : 'Bpk. Ahmad Hidayat';
      const fGroom = (c.groom && c.groom.father) ? c.groom.father : 'Bpk. Budi Santoso';
      footerFamily.textContent = `Keluarga Besar ${fBride} & ${fGroom}`;
    }
  }

  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy && ft.copyrightText) {
    footerCopy.innerHTML = ft.copyrightText;
  }
}

// Auto-run if on invitation page
if (typeof document !== 'undefined' && document.readyState !== 'loading') {
  if (document.querySelector('.site-wrapper')) {
    applyConfigToPage();
  }
} else if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.site-wrapper')) {
      applyConfigToPage();
    }
  });
}
