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
      // Soft rose & champagne golden petal colors
      const colors = [
        'rgba(244, 208, 198, ', // soft rose
        'rgba(235, 214, 185, ', // champagne
        'rgba(255, 235, 230, ', // blush
        'rgba(212, 175, 55, '   // gold hint
      ];
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

