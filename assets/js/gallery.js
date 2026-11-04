/**
 * Gallery Filter & Lightbox Viewer
 * Supports dynamic gallery hydration and filtering
 */

(function () {
  function initGallery() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    if (!modal || !modalImg) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const btnClose = document.getElementById('modal-close');
    const btnPrev = document.getElementById('modal-prev');
    const btnNext = document.getElementById('modal-next');

    let currentIndex = 0;
    let activeList = [];

    // Populate active list
    function updateActiveList() {
      activeList = Array.from(document.querySelectorAll('.gallery-item')).filter(
        item => item.style.display !== 'none'
      );
    }

    // Filter items
    filterBtns.forEach(btn => {
      // Remove prior listener by replacing node clone
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        newBtn.classList.add('active');

        const filter = newBtn.getAttribute('data-filter');
        const allItems = document.querySelectorAll('.gallery-item');

        allItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });

        updateActiveList();
      });
    });

    updateActiveList();

    // Open Lightbox
    const allItems = document.querySelectorAll('.gallery-item');
    allItems.forEach(item => {
      // Prevent duplicate listeners
      item.onclick = () => {
        updateActiveList();
        currentIndex = activeList.indexOf(item);
        if (currentIndex === -1) currentIndex = 0;
        openModal(currentIndex);
      };
    });

    function openModal(idx) {
      if (!activeList || activeList.length === 0 || !activeList[idx]) return;
      const img = activeList[idx].querySelector('img');
      if (!img) return;

      modalImg.src = img.src;
      modalImg.alt = img.alt || 'Foto Galeri';
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('show');
      if (!document.body.classList.contains('locked')) {
        document.body.style.overflow = '';
      }
    }

    function nextImage() {
      if (!activeList || activeList.length === 0) return;
      currentIndex = (currentIndex + 1) % activeList.length;
      openModal(currentIndex);
    }

    function prevImage() {
      if (!activeList || activeList.length === 0) return;
      currentIndex = (currentIndex - 1 + activeList.length) % activeList.length;
      openModal(currentIndex);
    }

    if (btnClose) btnClose.onclick = closeModal;
    if (btnNext) btnNext.onclick = (e) => { e.stopPropagation(); nextImage(); };
    if (btnPrev) btnPrev.onclick = (e) => { e.stopPropagation(); prevImage(); };

    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    // Keyboard navigation (registered once)
    if (!window.__galleryKeyBound) {
      document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      });
      window.__galleryKeyBound = true;
    }
  }

  // Expose globally
  window.initGallery = initGallery;

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
