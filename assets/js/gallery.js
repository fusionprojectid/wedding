/**
 * Gallery Filter & Lightbox Viewer
 */

(function () {
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
    activeList = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  // Filter items
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      updateActiveList();
    });
  });

  updateActiveList();

  // Open Lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateActiveList();
      currentIndex = activeList.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;
      openModal(currentIndex);
    });
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

  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
})();
