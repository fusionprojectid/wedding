/**
 * Countdown Timer & Calendar Integration
 */

(function () {
  // Tanggal Pernikahan: 26 Oktober 2026, 08:00:00 WIB (UTC+7)
  // Bisa disesuaikan dengan mudah
  const WEDDING_DATE = new Date('2026-10-26T08:00:00+07:00').getTime();

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

  // Google Calendar Integration
  const btnGoogleCal = document.getElementById('btn-google-cal');
  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', (e) => {
      e.preventDefault();
      const title = encodeURIComponent('The Wedding of Hanim & Firman');
      const details = encodeURIComponent('Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami.');
      const location = encodeURIComponent('Gedung Serbaguna LokaLaku, Jalan Mawar No. 15, Bandung');
      // 2026-10-26 08:00 - 14:00 WIB (01:00 - 07:00 UTC)
      const dates = '20261026T010000Z/20261026T070000Z';
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
PRODID:-//Hanim and Firman Wedding//ID
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:The Wedding of Hanim & Firman
DESCRIPTION:Undangan Pernikahan Hanim & Firman. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir.
LOCATION:Gedung Serbaguna LokaLaku, Jalan Mawar No. 15, Bandung
DTSTART:20261026T010000Z
DTEND:20261026T070000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'The-Wedding-Hanim-Firman.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (window.showToast) {
        window.showToast('Jadwal kalender (.ics) berhasil diunduh!');
      }
    });
  }
})();

