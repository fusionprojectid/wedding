/**
 * Falling Petals Canvas Animation
 * Lightweight, zero-dependency, mobile-optimized.
 */

(function () {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let petals = [];
  const TOTAL_PETALS = window.innerWidth < 768 ? 18 : 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 8; // 8 - 16px
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
      this.opacity = Math.random() * 0.4 + 0.3; // 0.3 - 0.7
      // Dynamic petal colors based on active template theme
      let colors = [
        'rgba(244, 208, 198, ', // soft rose
        'rgba(235, 214, 185, ', // champagne
        'rgba(255, 235, 230, ', // blush
        'rgba(212, 175, 55, '   // gold hint
      ];

      if (document.body.classList.contains('theme-template-2')) {
        // T2: Modern Arch - Terracotta & Warm Sand Flecks
        colors = [
          'rgba(184, 98, 70, ',
          'rgba(200, 111, 83, ',
          'rgba(235, 175, 150, ',
          'rgba(122, 117, 111, '
        ];
      } else if (document.body.classList.contains('theme-template-3')) {
        // T3: Nusantara Heritage - Bunga Melati Putih & Serpihan Emas Kuno
        colors = [
          'rgba(255, 252, 235, ', // Jasmine white
          'rgba(212, 175, 55, ',  // Antique gold
          'rgba(247, 238, 215, ', // Ivory jasmine
          'rgba(197, 155, 39, '   // Imperial gold
        ];
      } else if (document.body.classList.contains('theme-template-4')) {
        // T4: Botanical Greenhouse - Dedaunan Eucalyptus Hijau Segar
        colors = [
          'rgba(61, 99, 80, ',
          'rgba(79, 122, 100, ',
          'rgba(110, 150, 125, ',
          'rgba(140, 126, 109, '
        ];
      } else if (document.body.classList.contains('theme-template-5')) {
        // T5: The Wedding Chronicle - Vintage Autumn Leaves & Sepia Dust
        colors = [
          'rgba(139, 58, 43, ',
          'rgba(180, 110, 60, ',
          'rgba(210, 160, 95, ',
          'rgba(60, 50, 40, '
        ];
      } else if (document.body.classList.contains('theme-template-6')) {
        // T6: Midnight Celestial - Twinkling Stars & Silver Cyan Sparks
        colors = [
          'rgba(56, 189, 248, ',
          'rgba(186, 230, 253, ',
          'rgba(255, 255, 255, ',
          'rgba(14, 165, 233, '
        ];
      } else if (document.body.classList.contains('theme-template-7')) {
        // T7: Islamic Emerald - Moroccan Gold Arabesque & White Jasmine
        colors = [
          'rgba(223, 183, 108, ',
          'rgba(245, 225, 165, ',
          'rgba(255, 255, 240, ',
          'rgba(14, 56, 43, '
        ];
      } else if (document.body.classList.contains('theme-template-8')) {
        // T8: Korean Pastel Coquette - Sweet Sakura Blossoms & Pink Petals
        colors = [
          'rgba(240, 123, 149, ',
          'rgba(247, 141, 167, ',
          'rgba(255, 190, 205, ',
          'rgba(255, 235, 240, '
        ];
      }

      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.6;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fillStyle = this.colorBase + this.opacity + ')';
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  let animationFrameId;
  let isRunning = true;

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  // Handle visibility change to save CPU when tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      animate();
    }
  });

  animate();
})();

