/**
 * Invitation Link & WhatsApp Message Generator
 * Makes it effortless for the couple to share personalized invitations.
 */

(function () {
  const modal = document.getElementById('generator-modal');
  const btnOpen = document.getElementById('btn-open-generator');
  const btnClose = document.getElementById('modal-generator-close');
  const inputName = document.getElementById('gen-guest-name');
  const resultContainer = document.getElementById('gen-result-container');
  const resultLinkInput = document.getElementById('gen-result-link');
  const btnCopyLink = document.getElementById('btn-copy-gen-link');
  const btnShareWA = document.getElementById('btn-share-wa');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.classList.add('show');
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  }

  function getBaseUrl() {
    const url = window.location.href.split('?')[0];
    return url;
  }

  function generateLink() {
    const rawName = inputName.value.trim();
    if (!rawName) {
      if (resultContainer) resultContainer.style.display = 'none';
      return;
    }

    const encodedName = encodeURIComponent(rawName);
    const fullLink = `${getBaseUrl()}?to=${encodedName}`;

    if (resultLinkInput) {
      resultLinkInput.value = fullLink;
    }
    if (resultContainer) {
      resultContainer.style.display = 'block';
    }

    // Prepare WhatsApp Share
    if (btnShareWA) {
      btnShareWA.onclick = () => {
        const message = 
`Kepada Yth.
Bapak/Ibu/Saudara/i: *${rawName}*

_Assalamu'alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara resepsi pernikahan kami:

*Hanim & Firman*

Berikut tautan undangan kami untuk info lengkap acara:
${fullLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.

Terima kasih.
_Wassalamu'alaikum Warahmatullahi Wabarakatuh_`;

        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      };
    }
  }

  if (inputName) {
    inputName.addEventListener('input', generateLink);
  }

  if (btnCopyLink && resultLinkInput) {
    btnCopyLink.addEventListener('click', () => {
      resultLinkInput.select();
      navigator.clipboard.writeText(resultLinkInput.value).then(() => {
        if (window.showToast) {
          window.showToast('Tautan undangan berhasil disalin!');
        }
      });
    });
  }
})();

