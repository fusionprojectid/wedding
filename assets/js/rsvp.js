/**
 * RSVP & Interactive Wishes / Guestbook
 * Stores data in localStorage + Confetti effect on submit
 */

(function () {
  const STORAGE_KEY = 'wedding_wishes_fusion';

  const defaultWishes = [
    {
      id: 1,
      name: 'Rangga & Cinta',
      attendance: 'hadir',
      guests: '2',
      message: 'Selamat berbahagia untuk kedua mempelai! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.',
      date: '2 jam yang lalu'
    },
    {
      id: 2,
      name: 'Dimas Prasetyo, S.Kom',
      attendance: 'hadir',
      guests: '1',
      message: 'Happy wedding brother! Akhirnya berlabuh juga di pelaminan yang megah. Lancar sampai hari H ya kawan!',
      date: '5 jam yang lalu'
    },
    {
      id: 3,
      name: 'Nadia Rahmawati',
      attendance: 'hadir',
      guests: '2',
      message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khair. Anggun dan serasi sekali!',
      date: '1 hari yang lalu'
    },
    {
      id: 4,
      name: 'Keluarga Besar Bpk. Hendra',
      attendance: 'ragu',
      guests: '1',
      message: 'Selamat menempuh hidup baru untuk kedua mempelai. Semoga senantiasa diberkahi kelimpahan dan kebahagiaan.',
      date: '2 hari yang lalu'
    }
  ];

  // Load wishes
  function getWishes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.error(e);
    }
  }

  const form = document.getElementById('rsvp-form');
  const wishesContainer = document.getElementById('wishes-container');
  const wishesCountEl = document.getElementById('wishes-count');

  function escapeHtml(text) {
    if (typeof text !== 'string') text = String(text || '');
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderWishes() {
    if (!wishesContainer) return;
    const wishes = getWishes();

    if (wishesCountEl) {
      wishesCountEl.textContent = `${wishes.length} Ucapan`;
    }

    wishesContainer.innerHTML = '';

    wishes.forEach(wish => {
      const item = document.createElement('div');
      item.className = 'wish-item';

      let statusBadge = '';
      if (wish.attendance === 'hadir') {
        statusBadge = '<span class="wish-status-badge status-attending"><i class="fas fa-check-circle"></i> Hadir</span>';
      } else if (wish.attendance === 'tidak_hadir') {
        statusBadge = '<span class="wish-status-badge status-not-attending"><i class="fas fa-times-circle"></i> Berhalangan</span>';
      } else {
        statusBadge = '<span class="wish-status-badge status-maybe"><i class="fas fa-question-circle"></i> Ragu-ragu</span>';
      }

      const initial = wish.name ? wish.name.trim().charAt(0).toUpperCase() : 'T';

      item.innerHTML = `
        <div class="wish-header">
          <div class="wish-user">
            <div class="wish-avatar">${escapeHtml(initial)}</div>
            <div>
              <div class="wish-name">${escapeHtml(wish.name)}</div>
              <div class="wish-time">${escapeHtml(wish.date)}</div>
            </div>
          </div>
          <div>${statusBadge}</div>
        </div>
        <div class="wish-message">${escapeHtml(wish.message)}</div>
      `;

      wishesContainer.appendChild(item);
    });
  }

  // Handle Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('rsvp-name');
      const attendanceInput = document.querySelector('input[name="attendance"]:checked');
      const guestsInput = document.getElementById('rsvp-guests');
      const messageInput = document.getElementById('rsvp-message');

      if (!nameInput || !nameInput.value.trim()) {
        alert('Mohon masukkan nama Anda');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!attendanceInput) {
        alert('Mohon pilih konfirmasi kehadiran');
        return;
      }

      if (!messageInput || !messageInput.value.trim()) {
        alert('Mohon tuliskan ucapan atau doa restu');
        if (messageInput) messageInput.focus();
        return;
      }

      const newWish = {
        id: Date.now(),
        name: nameInput.value.trim(),
        attendance: attendanceInput.value,
        guests: guestsInput ? guestsInput.value : '1',
        message: messageInput.value.trim(),
        date: 'Baru saja'
      };

      const wishes = getWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);

      renderWishes();
      fireConfetti();

      if (window.showToast) {
        window.showToast('Terima kasih! Konfirmasi & ucapan Anda telah terkirim.');
      }

      form.reset();
      // Keep name if from URL
      const urlParams = new URLSearchParams(window.location.search);
      const toParam = urlParams.get('to');
      if (toParam && nameInput) {
        try {
          nameInput.value = decodeURIComponent(toParam.replace(/\+/g, ' '));
        } catch (err) {}
      }
    });
  }

  // Lightweight embedded confetti
  function fireConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100vw';
    confettiContainer.style.height = '100vh';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '10005';
    document.body.appendChild(confettiContainer);

    const colors = ['#d4af37', '#e6ca65', '#b68b40', '#d88373', '#586b62', '#ffffff'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.width = `${Math.random() * 8 + 6}px`;
      piece.style.height = `${Math.random() * 8 + 6}px`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = '-20px';
      piece.style.opacity = '1';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.transition = `all ${Math.random() * 2 + 1.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      confettiContainer.appendChild(piece);

      setTimeout(() => {
        piece.style.top = `${Math.random() * 60 + 40}vh`;
        piece.style.transform = `rotate(${Math.random() * 720}deg) scale(0.6)`;
        piece.style.opacity = '0';
      }, 50);
    }

    setTimeout(() => {
      confettiContainer.remove();
    }, 3500);
  }

  // Initial render
  renderWishes();
})();
