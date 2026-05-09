document.addEventListener('DOMContentLoaded', () => {
  initAnimations();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Dark Mode Toggle
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      themeToggles.forEach(btn => btn.textContent = '☀️');
    } else {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
      themeToggles.forEach(btn => btn.textContent = '🌙');
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  themeToggles.forEach(btn => btn.addEventListener('click', toggleTheme));

  // Initialize theme
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light'); // Ensure icon is set
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      // handled via basic CSS, could toggle a class if we want
    });
  }

  // Gallery Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const applyGalleryFilter = (filter) => {
    let visibleIndex = 0;
    galleryItems.forEach((item) => {
      // Reset animation
      item.style.animation = 'none';
      item.offsetHeight; // trigger reflow
      
      if (filter === 'All' || item.dataset.category === filter) {
        item.style.display = 'block';
        item.style.animation = `galleryEntrance 0.6s ease forwards ${visibleIndex * 0.05}s`;
        visibleIndex++;
      } else {
        item.style.display = 'none';
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyGalleryFilter(btn.dataset.filter);
    });
  });

  // Initial stagger for gallery
  applyGalleryFilter('All');

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.getElementById('close-lightbox');

  const menuImages = document.querySelectorAll('.menu-card-img');

  if (lightbox && lightboxImg) {
    const handleLightboxOpen = (item) => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
        lightbox.style.display = 'flex';
      }
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => handleLightboxOpen(item));
    });

    menuImages.forEach(item => {
      item.addEventListener('click', () => handleLightboxOpen(item));
    });

    closeLightbox.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    });
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        lightbox.style.display = 'none';
      }
    });
  }

  // Inquiry Modal Logic
  const inquiryModal = document.getElementById('inquiry-modal');
  const closeInquiryBtn = document.getElementById('close-inquiry');
  const inquiryLinks = document.querySelectorAll('a[href="#inquiry"]');

  if (inquiryModal) {
    const openInquiryModal = (e) => {
      e.preventDefault();
      inquiryModal.classList.remove('hidden');
      inquiryModal.style.display = 'flex';
    };

    const closeInquiryModal = () => {
      inquiryModal.classList.add('hidden');
      inquiryModal.style.display = 'none';
    };

    inquiryLinks.forEach(link => {
      link.addEventListener('click', openInquiryModal);
    });

    if (closeInquiryBtn) {
      closeInquiryBtn.addEventListener('click', closeInquiryModal);
    }

    inquiryModal.addEventListener('click', (e) => {
      if (e.target === inquiryModal) {
        closeInquiryModal();
      }
    });
  }

  // Handle Order Form Submission to Facebook Messenger
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Check honeypot
      const honeypot = document.getElementById('fax_number');
      if (honeypot && honeypot.value !== '') {
        // Spam detected, just act normally but do nothing
        console.log('Spam blocked');
        return;
      }
      
      // Collect values
      const name = document.getElementById('order-name')?.value || '';
      const address = document.getElementById('order-address')?.value || '';
      const contact = document.getElementById('order-contact')?.value || '';
      const celebration = document.getElementById('order-celebration')?.value || '';
      
      const design = document.getElementById('order-design')?.value || '';
      const base = document.getElementById('order-base')?.value || '';
      const dedication = document.getElementById('order-dedication')?.value || '';
      const size = document.getElementById('order-size')?.value || '';
      const color = document.getElementById('order-color')?.value || '';
      const date = document.getElementById('order-date')?.value || '';
      const delivery = document.getElementById('order-delivery')?.value || '';
      
      // Format message
      const message = `UPCOMING ORDER FROM OUR WEBSITE!
CUSTOMER DETAILS
Name: ${name}
Address: ${address}
Contact number: ${contact}
Celebration: ${celebration}

ORDER DETAILS
Design/themed: ${design}
Base cake: ${base}
Dedication: ${dedication}
size: ${size}
color: ${color}
Date and pick up time: ${date}
delivery or pick-up: ${delivery}`;

      const encodedMessage = encodeURIComponent(message);
      
      // Copy to clipboard as a reliable backup
      navigator.clipboard.writeText(message).then(() => {
        // Open Messenger with the text parameter for auto-filling
        // username 'iocheOfficial' is used as placeholder
        // my client canceled the production so I used my old fb page to showcase the function of this block of code
        window.open(`https://m.me/iocheOfficial?text=${encodedMessage}`, '_blank');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        window.open(`https://m.me/iocheOfficial?text=${encodedMessage}`, '_blank');
      });
      
      if (inquiryModal) {
        inquiryModal.classList.add('hidden');
        inquiryModal.style.display = 'none';
      }
      orderForm.reset();
    });
  }

  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Menu Slider Logic
  const initMenuSliders = () => {
    const sliderWrappers = document.querySelectorAll('.menu-slider-wrapper');
    
    sliderWrappers.forEach(wrapper => {
      const slider = wrapper.querySelector('.menu-grid');
      const originalCards = Array.from(slider.querySelectorAll('.menu-card'));
      const category = wrapper.closest('.menu-category');
      const controls = category.querySelector('.slider-controls');
      if (!controls || originalCards.length === 0) return;
      
      const prevBtn = controls.querySelector('.prev-btn');
      const nextBtn = controls.querySelector('.next-btn');
      
      // Clone 3 cards at each end for infinite effect
      const cloneCount = 3;
      for (let i = 0; i < cloneCount; i++) {
        const firstClone = originalCards[i].cloneNode(true);
        const lastClone = originalCards[originalCards.length - 1 - i].cloneNode(true);
        slider.appendChild(firstClone);
        slider.insertBefore(lastClone, slider.firstChild);
      }
      
      const allCards = slider.querySelectorAll('.menu-card');
      let currentIndex = cloneCount; 
      let isTransitioning = false;

      const updateSlider = (animate = true) => {
        const cardWidth = allCards[0]?.offsetWidth || 0;
        const style = window.getComputedStyle(slider);
        const gap = parseFloat(style.gap) || 0;
        
        slider.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        slider.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
      };

      slider.addEventListener('transitionend', () => {
        isTransitioning = false;
        const totalRealCards = originalCards.length;
        
        if (currentIndex >= totalRealCards + cloneCount) {
          currentIndex = currentIndex - totalRealCards;
          updateSlider(false);
        } else if (currentIndex < cloneCount) {
          currentIndex = currentIndex + totalRealCards;
          updateSlider(false);
        }
      });

      const getStep = () => window.innerWidth >= 768 ? 3 : 1;

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (isTransitioning) return;
          isTransitioning = true;
          currentIndex -= getStep();
          updateSlider(true);
        });
        prevBtn.disabled = false;
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (isTransitioning) return;
          isTransitioning = true;
          currentIndex += getStep();
          updateSlider(true);
        });
        nextBtn.disabled = false;
      }

      window.addEventListener('resize', () => {
        updateSlider(false);
      });
      
      // Initial state
      setTimeout(() => updateSlider(false), 50);
    });
  };

  initMenuSliders();

  // FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
