/* ========================================================
   Sofiia Prokuratova (lithium144hz) — Scripts
   Smooth Floating Nav & Gliding Category Indicator
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Left Floating Navigation Dot & Accurate ScrollSpy
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const navDot = document.getElementById('navGlowDot');
  const sidebarNav = document.getElementById('sidebarNav');

  function moveDotToItem(activeItem) {
    if (!activeItem || !navDot || !sidebarNav) return;
    
    if (window.innerWidth > 900) {
      const navRect = sidebarNav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetY = (itemRect.top - navRect.top) + (itemRect.height / 2) - (navDot.offsetHeight / 2);
      
      navDot.style.transform = `translateY(${targetY}px)`;
      navDot.style.opacity = '1';
    } else {
      navDot.style.opacity = '0';
    }
  }

  function updateActiveNav() {
    let currentSectionId = '';
    const scrollY = window.scrollY;
    const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);

    // Guaranteed boundaries:
    if (scrollY < 180) {
      // 1. At the very top -> Always 'intro'
      currentSectionId = 'intro';
    } else if (isAtBottom) {
      // 2. At the very bottom -> Always 'contact'
      currentSectionId = 'contact';
    } else {
      // 3. Middle sections: test which section is in focus line
      const focusPoint = scrollY + (window.innerHeight * 0.35);
      
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (focusPoint >= top && focusPoint < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });
    }

    if (currentSectionId) {
      navItems.forEach(item => {
        if (item.getAttribute('data-section') === currentSectionId) {
          if (!item.classList.contains('active')) {
            item.classList.add('active');
            moveDotToItem(item);
          }
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  // Click on nav item for smooth glide
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      moveDotToItem(item);
    });
  });

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) moveDotToItem(activeItem);
    
    const activeTab = document.querySelector('.filter-tab.active');
    if (activeTab) moveTabSlider(activeTab);
  });

  // Initial placement of dot
  const initialActive = document.querySelector('.nav-item.active') || navItems[0];
  if (initialActive) {
    setTimeout(() => moveDotToItem(initialActive), 120);
  }

  // 2. Horizontal Gliding Indicator & Smooth Card Transitions for Work Categories
  const filterTabs = document.querySelectorAll('.filter-tab');
  const workItems = document.querySelectorAll('.work-item');
  const tabSlider = document.getElementById('tabSlider');
  const workFilters = document.getElementById('workFilters');
  const workGrid = document.getElementById('workGrid');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');

  let isAnimatingCards = false;

  function moveTabSlider(activeTab) {
    if (!activeTab || !tabSlider || !workFilters) return;
    
    const tabRect = activeTab.getBoundingClientRect();
    const contRect = workFilters.getBoundingClientRect();
    const targetX = tabRect.left - contRect.left;
    const targetWidth = tabRect.width;

    tabSlider.style.transform = `translateX(${targetX}px)`;
    tabSlider.style.width = `${targetWidth}px`;
    tabSlider.style.opacity = '1';
  }

  function applyCategoryFilter(tab, direction = 0) {
    if (!tab) return;
    const tabsArr = Array.from(filterTabs);
    const currentIndex = tabsArr.findIndex(t => t.classList.contains('active'));
    const targetIndex = tabsArr.indexOf(tab);

    if (direction === 0 && currentIndex !== -1 && targetIndex !== currentIndex) {
      direction = targetIndex > currentIndex ? 1 : -1;
    }

    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    moveTabSlider(tab);

    const filterVal = tab.getAttribute('data-filter');

    if (direction !== 0 && workGrid) {
      isAnimatingCards = true;
      const slideOutClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
      const slideInClass = direction > 0 ? 'slide-in-right' : 'slide-in-left';

      workGrid.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-right', 'slide-in-left');
      workGrid.classList.add(slideOutClass);

      setTimeout(() => {
        workItems.forEach(item => {
          const cat = item.getAttribute('data-category');
          if (filterVal === 'all' || cat === filterVal) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });

        workGrid.classList.remove(slideOutClass);
        workGrid.classList.add(slideInClass);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            workGrid.classList.remove(slideInClass);
            setTimeout(() => {
              isAnimatingCards = false;
            }, 240);
          });
        });
      }, 150);
    } else {
      workItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => applyCategoryFilter(tab));
  });

  function cycleCategory(direction) {
    if (isAnimatingCards) return;
    const tabsArr = Array.from(filterTabs);
    const currentIndex = tabsArr.findIndex(tab => tab.classList.contains('active'));
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = tabsArr.length - 1;
    if (newIndex >= tabsArr.length) newIndex = 0;

    applyCategoryFilter(tabsArr[newIndex], direction);
  }

  if (galleryPrevBtn) galleryPrevBtn.addEventListener('click', () => cycleCategory(-1));
  if (galleryNextBtn) galleryNextBtn.addEventListener('click', () => cycleCategory(1));

  // Touch swipe support on cards gallery
  let touchStartX = 0;
  let touchEndX = 0;
  if (workGrid) {
    workGrid.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    workGrid.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDiff = touchEndX - touchStartX;
      if (Math.abs(swipeDiff) > 50) {
        if (swipeDiff < 0) {
          cycleCategory(1); // Swiped left -> next
        } else {
          cycleCategory(-1); // Swiped right -> prev
        }
      }
    }, { passive: true });
  }

  // Initial tab slider placement
  const initialTab = document.querySelector('.filter-tab.active') || filterTabs[0];
  if (initialTab) {
    setTimeout(() => moveTabSlider(initialTab), 150);
  }

  // 3. Lightbox Modal with Next / Prev Navigation
  const modal = document.getElementById('portfolioModal');
  const modalClose = document.getElementById('modalClose');
  const modalMedia = document.getElementById('modalMedia');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  let currentWorkIndex = 0;

  function getVisibleWorkItems() {
    return Array.from(workItems).filter(item => !item.classList.contains('hidden'));
  }

  function openModal(item) {
    const visibleItems = getVisibleWorkItems();
    currentWorkIndex = visibleItems.indexOf(item);
    if (currentWorkIndex === -1) currentWorkIndex = 0;

    renderModalContent(item);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderModalContent(item) {
    const title = item.getAttribute('data-title') || 'Placeholder';
    const desc = item.getAttribute('data-desc') || 'Placeholder';
    const type = item.getAttribute('data-type') || 'image';
    const src = item.getAttribute('data-src') || '';

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalMedia.innerHTML = '';

    if (!src || src.trim() === '') {
      const ph = document.createElement('div');
      ph.className = 'showcase-content';
      ph.style.minHeight = '320px';
      ph.innerHTML = `
        <span class="showcase-title">[ Media Preview Placeholder ]</span>
        <span class="showcase-desc">Attach image or video into data-src to display preview here</span>
      `;
      modalMedia.appendChild(ph);
    } else if (type === 'video') {
      const videoEl = document.createElement('video');
      videoEl.src = src;
      videoEl.autoplay = true;
      videoEl.loop = true;
      videoEl.controls = true;
      videoEl.playsInline = true;
      modalMedia.appendChild(videoEl);
    } else {
      const imgEl = document.createElement('img');
      imgEl.src = src;
      imgEl.alt = title;
      modalMedia.appendChild(imgEl);
    }
  }

  function navigateModal(direction) {
    const visibleItems = getVisibleWorkItems();
    if (visibleItems.length <= 1) return;

    currentWorkIndex += direction;
    if (currentWorkIndex < 0) currentWorkIndex = visibleItems.length - 1;
    if (currentWorkIndex >= visibleItems.length) currentWorkIndex = 0;

    renderModalContent(visibleItems[currentWorkIndex]);
  }

  if (modalPrev) modalPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(-1); });
  if (modalNext) modalNext.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(1); });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalMedia.innerHTML = '';
  }

  workItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        navigateModal(-1);
      } else if (e.key === 'ArrowRight') {
        navigateModal(1);
      }
    } else {
      const workSection = document.getElementById('work');
      if (workSection) {
        const rect = workSection.getBoundingClientRect();
        const isInWorkView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
        if (isInWorkView) {
          if (e.key === 'ArrowLeft') {
            cycleCategory(-1);
          } else if (e.key === 'ArrowRight') {
            cycleCategory(1);
          }
        }
      }
    }
  });

  // 4. Discord copy-to-clipboard feedback
  const discordLink = document.getElementById('discordLink');
  const discordHandle = document.getElementById('discordHandle');
  if (discordLink && discordHandle) {
    discordLink.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('kllrqsn').catch(() => {});
      }
      const originalText = discordHandle.textContent;
      discordHandle.textContent = 'Copied! ✓';
      discordHandle.style.color = 'var(--accent-blue)';
      setTimeout(() => {
        discordHandle.textContent = originalText;
        discordHandle.style.color = '';
      }, 1800);
    });
  }
});
