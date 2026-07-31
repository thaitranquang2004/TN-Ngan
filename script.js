/**
 * Graduation Invitation – Interactive Script
 * Premium scroll-to-load reveal system
 */

(function() {
  'use strict';

  // ============================================================
  // Scroll-triggered Reveal (Lazy Load) System
  // Elements start hidden, only appear with animation when scrolled into view
  // ============================================================
  const REVEAL_CLASSES = [
    'reveal', 'reveal-scale', 'reveal-slide',
    'reveal-slide-left', 'reveal-slide-right',
    'reveal-fade', 'reveal-rotate', 'reveal-clip'
  ];
  const revealSelector = REVEAL_CLASSES.map(c => '.' + c).join(', ');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -80px 0px'   // trigger 80px before element hits bottom of viewport
    }
  );

  // Assign stagger delays per-section, then observe
  document.querySelectorAll('section').forEach(section => {
    const els = section.querySelectorAll(revealSelector);
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 6) * 130}ms`;
      revealObserver.observe(el);
    });
  });

  // Catch any reveal elements outside sections
  document.querySelectorAll(revealSelector).forEach(el => {
    if (!el.closest('section')) {
      revealObserver.observe(el);
    }
  });

  // Letter paragraphs – individual staggered reveal
  document.querySelectorAll('.letter-body p').forEach((p, i) => {
    if (!p.classList.contains('reveal-fade')) {
      p.classList.add('reveal-fade');
      p.style.transitionDelay = `${400 + i * 280}ms`;
      revealObserver.observe(p);
    }
  });

  // ============================================================
  // Scroll Progress Bar
  // ============================================================
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ============================================================
  // Parallax for Hero Background
  // ============================================================
  const heroBg = document.querySelector('.hero-bg-image img');
  const heroSection = document.querySelector('.hero');

  if (heroBg && heroSection) {
    window.addEventListener('scroll', () => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom < 0) return;
      const scrolled = Math.max(0, -rect.top);
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
    }, { passive: true });
  }

  // ============================================================
  // Fade scroll hint on scroll
  // ============================================================
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      const opacity = Math.max(0, 1 - window.scrollY / 250);
      scrollHint.style.opacity = opacity;
    }, { passive: true });
  }

  // ============================================================
  // Music Toggle – Autoplay + Play/Pause Background Music
  // ============================================================
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');

  if (musicToggle && bgMusic) {
    bgMusic.volume = 0;

    function fadeAudioIn(duration) {
      const step = 0.05;
      const interval = duration / (1 / step);
      const fade = setInterval(() => {
        if (bgMusic.volume < 0.95) {
          bgMusic.volume = Math.min(bgMusic.volume + step, 1);
        } else {
          bgMusic.volume = 1;
          clearInterval(fade);
        }
      }, interval);
    }

    function fadeAudioOut(duration) {
      const step = 0.05;
      const interval = duration / (1 / step);
      const fade = setInterval(() => {
        if (bgMusic.volume > 0.05) {
          bgMusic.volume = Math.max(bgMusic.volume - step, 0);
        } else {
          bgMusic.volume = 0;
          bgMusic.pause();
          clearInterval(fade);
        }
      }, interval);
    }

    function startMusic() {
      if (!bgMusic.paused) return; // already playing
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        fadeAudioIn(1200);
      }).catch(() => {});
    }

    // Try autoplay immediately
    startMusic();

    // If browser blocks autoplay, start on first user interaction
    function onFirstInteraction() {
      startMusic();
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
      document.removeEventListener('scroll', onFirstInteraction);
    }
    document.addEventListener('click', onFirstInteraction, { once: false });
    document.addEventListener('touchstart', onFirstInteraction, { once: false });
    document.addEventListener('scroll', onFirstInteraction, { once: false, passive: true });

    // Toggle button: play/pause
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // don't trigger onFirstInteraction
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicToggle.classList.add('playing');
          fadeAudioIn(800);
        }).catch(err => {
          console.warn('Audio play blocked:', err);
        });
      } else {
        musicToggle.classList.remove('playing');
        fadeAudioOut(600);
      }
    });
  }

  // ============================================================
  // Smooth Anchor Links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // Collage 3D Tilt on Hover
  // ============================================================
  document.querySelectorAll('.collage-item').forEach((item, i) => {
    // Extra stagger for collage items
    item.style.transitionDelay = `${i * 110}ms`;

    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) scale(1.02)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.transition = 'transform 0.5s ease';
      setTimeout(() => { item.style.transition = ''; }, 500);
    });
  });

  // NOTE: Sash animation is pure CSS (sashSway keyframes).
  // No JS interference – the CSS animation runs continuously.

  // ============================================================
  // Image Lightbox (Modal)
  // ============================================================
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.querySelector('.modal-close');

  if (modal && modalImg && closeBtn) {
    // Select all images we want to be clickable
    const galleryImages = document.querySelectorAll('.hero-photo-card img, .film-frame img, .closing-card img, .invitation-photo img');

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'flex';
        // Small timeout allows display: flex to apply before transitioning opacity
        setTimeout(() => {
          modal.classList.add('show');
        }, 10);
        modalImg.src = img.src;
        document.body.style.overflow = 'hidden'; // prevent scrolling background
      });
    });

    // Close modal function
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        modalImg.src = '';
      }, 300); // match CSS transition duration
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      // Close if clicked outside the image
      if (e.target !== modalImg) {
        closeModal();
      }
    });
  }

  console.log('✨ Graduation Invitation loaded');
})();
