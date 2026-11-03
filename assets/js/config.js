/**
 * CONFIG & DYNAMIC DATA HANDLER
 * Manages wedding configuration stored in localStorage or default fallback.
 * Includes deep merge, theme switching, and live DOM hydration.
 */

const DEFAULT_WEDDING_CONFIG = {
  theme: 'template-1',
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
      time: 'Pukul 08.00 - 10.00 WIB',
      venue: 'Gedung Serbaguna LokaLaku',
      address: 'Jalan Mawar No. 15, Sukajadi, Kota Bandung, Jawa Barat'
    },
    resepsi: {
      time: 'Pukul 11.00 - 14.00 WIB',
      venue: 'Gedung Serbaguna LokaLaku - Grand Ballroom',
      address: 'Jalan Mawar No. 15, Sukajadi, Kota Bandung, Jawa Barat'
    },
    mapsIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126915.04842761742!2d107.5618092578358!3d-6.903947822945393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e66e2619dc71%3A0x5027a76e3521ec20!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1691828030000!5m2!1sen!2sid',
    mapsUrl: 'https://maps.google.com/?q=Bandung,West+Java'
  },
  gift: {
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
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_bebd139b3f.mp3?filename=romantic-piano-112191.mp3'
};

const WEDDING_STORAGE_KEY = 'fusion_wedding_custom_config';

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
  try {
    const raw = localStorage.getItem(WEDDING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULT_WEDDING_CONFIG, parsed);
    }
  } catch (e) {
    console.error('Error reading wedding config:', e);
  }
  return DEFAULT_WEDDING_CONFIG;
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

  // 1. Title & Meta
  document.title = `The Wedding of ${bNick} & ${gNick}`;

  // 2. Monograms
  const mono = `${bNick.charAt(0)}&amp;${gNick.charAt(0)}`;
  document.querySelectorAll('.welcome-monogram, .footer-monogram').forEach(el => {
    el.innerHTML = mono;
  });

  // 3. Welcome Screen Title
  const welcomeTitle = document.querySelector('.welcome-title');
  if (welcomeTitle) {
    welcomeTitle.innerHTML = `${bNick} <span>&amp;</span> ${gNick}`;
  }

  // 4. Hero Section
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.innerHTML = `${bNick} <span class="amp">&amp;</span> ${gNick}`;
  }
  const heroDate = document.querySelector('.hero-date');
  if (heroDate && e.dateFormatted) {
    heroDate.innerHTML = `<i class="far fa-calendar-check"></i> ${e.dateFormatted}`;
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
    if (parents) parents.innerHTML = `${c.groom.father || ''} &amp; ${c.groom.mother || ''}<br><small>${c.groom.origin || ''}</small>`;
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
    if (parents) parents.innerHTML = `${c.bride.father || ''} &amp; ${c.bride.mother || ''}<br><small>${c.bride.origin || ''}</small>`;
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
    const items = akadCard.querySelectorAll('.event-info-item');
    if (items[0]) {
      items[0].innerHTML = `<i class="far fa-calendar-alt"></i><div><strong>${e.dateFormatted || ''}</strong><div>${e.akad.time || ''}</div></div>`;
    }
    if (items[1]) {
      items[1].innerHTML = `<i class="fas fa-map-marker-alt"></i><div><strong>${e.akad.venue || ''}</strong><div>${e.akad.address || ''}</div></div>`;
    }
  }

  // 8. Event Section - Resepsi
  const resepsiCard = document.querySelector('.events-wrapper .event-card:last-child');
  if (resepsiCard && e.resepsi) {
    const items = resepsiCard.querySelectorAll('.event-info-item');
    if (items[0]) {
      items[0].innerHTML = `<i class="far fa-calendar-alt"></i><div><strong>${e.dateFormatted || ''}</strong><div>${e.resepsi.time || ''}</div></div>`;
    }
    if (items[1]) {
      items[1].innerHTML = `<i class="fas fa-map-marker-alt"></i><div><strong>${e.resepsi.venue || ''}</strong><div>${e.resepsi.address || ''}</div></div>`;
    }
    const iframe = resepsiCard.querySelector('iframe');
    if (iframe && e.mapsIframe) iframe.src = e.mapsIframe;
    const btnMaps = resepsiCard.querySelector('.btn-maps');
    if (btnMaps && e.mapsUrl) btnMaps.href = e.mapsUrl;
  }

  // 9. Wedding Gift / Bank
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
      p.innerHTML = `Bagi yang ingin mengirimkan kado pernikahan langsung ke alamat mempelai:<br><strong>${g.physicalAddress}</strong>`;
    }
    const btnPhys = physBox.querySelector('.btn-copy');
    if (btnPhys) {
      btnPhys.setAttribute('data-copy', g.physicalAddress);
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

  // 11. Footer Family
  const footerFamily = document.querySelector('.footer-family');
  if (footerFamily) {
    const fBride = (c.bride && c.bride.father) ? c.bride.father : 'Bpk. Ahmad Hidayat';
    const fGroom = (c.groom && c.groom.father) ? c.groom.father : 'Bpk. Budi Santoso';
    footerFamily.textContent = `Keluarga Besar ${fBride} & ${fGroom}`;
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
