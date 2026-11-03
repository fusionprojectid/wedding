/**
 * Countdown Timer & Calendar Integration
 */

(function () {
  // Ambil tanggal dari config dinamis atau fallback
  let weddingDateIso = '2026-10-26T08:00:00+07:00';
  let brideNick = 'Hanim';
  let groomNick = 'Firman';
  let venueName = 'Gedung Serbaguna LokaLaku';
  let venueAddress = 'Jalan Mawar No. 15, Sukajadi, Kota Bandung, Jawa Barat';

  if (typeof getWeddingConfig === 'function') {
    const cfg = getWeddingConfig();
    if (cfg && cfg.event && cfg.event.dateIso) {
      weddingDateIso = cfg.event.dateIso;
    }
    if (cfg && cfg.couple) {
      if (cfg.couple.bride && cfg.couple.bride.nickname) brideNick = cfg.couple.bride.nickname;
      if (cfg.couple.groom && cfg.couple.groom.nickname) groomNick = cfg.couple.groom.nickname;
    }
    if (cfg && cfg.event && cfg.event.akad) {
      if (cfg.event.akad.venue) venueName = cfg.event.akad.venue;
      if (cfg.event.akad.address) venueAddress = cfg.event.akad.address;
    }
  }

  let startDate = new Date(weddingDateIso);
  if (isNaN(startDate.getTime())) {
    startDate = new Date('2026-10-26T08:00:00+07:00');
  }
  const WEDDING_DATE = startDate.getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  function formatIcsDate(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      'Z'
    );
  }

  const endDate = new Date(startDate.getTime() + 6 * 3600 * 1000); // 6 jam durasi default
  const startUtcStr = formatIcsDate(startDate);
  const endUtcStr = formatIcsDate(endDate);
  const weddingTitle = `The Wedding of ${brideNick} & ${groomNick}`;
  const fullLocation = `${venueName}, ${venueAddress}`;

  // Google Calendar Integration
  const btnGoogleCal = document.getElementById('btn-google-cal');
  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', (e) => {
      e.preventDefault();
      const title = encodeURIComponent(weddingTitle);
      const details = encodeURIComponent(`Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami, ${brideNick} & ${groomNick}.`);
      const location = encodeURIComponent(fullLocation);
      const dates = `${startUtcStr}/${endUtcStr}`;
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
    });
  }

  // iCal (.ics) file download
  const btnIcal = document.getElementById('btn-ical');
  if (btnIcal) {
    btnIcal.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${brideNick} and ${groomNick} Wedding//ID
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${weddingTitle}
DESCRIPTION:Undangan Pernikahan ${brideNick} & ${groomNick}. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir.
LOCATION:${fullLocation}
DTSTART:${startUtcStr}
DTEND:${endUtcStr}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const cleanFileName = `The-Wedding-${brideNick}-${groomNick}.ics`.replace(/[^a-zA-Z0-9.\-_]/g, '');
      link.setAttribute('download', cleanFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (window.showToast) {
        window.showToast('Jadwal kalender (.ics) berhasil diunduh!');
      }
    });
  }
})();
