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
    if (projectModal && projectModal.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeProjectModal();
      } else if (e.key === 'ArrowLeft') {
        navigateProjectSlide(-1);
      } else if (e.key === 'ArrowRight') {
        navigateProjectSlide(1);
      }
    } else if (modal && modal.classList.contains('open')) {
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

  // 5. Featured Projects Data & Almost Full-Screen Modal
  const projectRows = document.querySelectorAll('.project-row');
  const projectModal = document.getElementById('projectModal');
  const projectModalClose = document.getElementById('projectModalClose');
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalContent = document.getElementById('projectModalContent');

  const projectsData = {
    '1': {
      pill: 'Project 01',
      title: 'Before I Rest',
      subtitle: 'Solo-Developed 2D Cinematic Adventure &bull; Environmental Storytelling',
      specs: [
        { label: 'Role', val: 'Solo Developer (All Disciplines)' },
        { label: 'Engine & Tools', val: 'Unity &bull; Photoshop / Clip Studio Paint' },
        { label: 'Genre', val: '2D Cinematic Platformer' },
        { label: 'Timeline', val: '2026' },
        { label: 'Status', val: 'In Active Development' }
      ],
      slides: [
        {
          title: 'Before I Rest — Atmospheric World Reel',
          tag: 'Cinematic Platformer &bull; Solo Project',
          type: 'placeholder',
          src: '',
          phText: '[ Before I Rest — Gameplay & Audiovisual Atmosphere Reel ]'
        },
        {
          title: 'Gopher Locomotion & Survival Cycles',
          tag: 'Hand-Drawn &bull; Traditional Frame-by-Frame',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 01 — Run, Scurry, Hide & Tremble Cycles ]'
        },
        {
          title: 'Environmental Storytelling & World Scale',
          tag: 'Background Art &bull; Mood & Lighting',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 02 — Outside World Seen Through a Tiny Creature ]'
        },
        {
          title: 'Audiovisual Mood Moments & Cutscenes',
          tag: 'Hand-Drawn 2D &bull; Emotional Keyframes',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 03 — Story Cutscene & Tone Vignettes ]'
        },
        {
          title: 'Character Design & Model Sheets',
          tag: 'Visual Development &bull; Model Sheets',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 04 — Domestic Gopher Turnaround & Expressions ]'
        }
      ],
      storyTitle: 'About the Project',
      storyText: 'Before I Rest is a personal solo-developed 2D cinematic platformer following a domesticated gopher thrust into the unforgiving urban outside world. The game centers on deep environmental storytelling, using expressive audiovisual worldbuilding, lighting, and ambient tone shifts to portray the vulnerable emotional journey of survival without relying on conventional dialogue.',
      roleTitle: 'My Role & Development Scope',
      roleText: 'As the sole creator, I am responsible for every discipline across production: traditional hand-drawn frame-by-frame character animation, background illustration, game design, narrative pacing, atmospheric audiovisual direction, and full Unity implementation.'
    },
    '2': {
      pill: 'Project 02',
      title: 'Haunt the Hunt',
      subtitle: 'Solo-Developed 2D Multiplayer Prop Hunt &bull; Frame-by-Frame Pixel Art',
      specs: [
        { label: 'Role', val: 'Solo Developer (All Disciplines)' },
        { label: 'Engine & Tools', val: 'Unity &bull; Aseprite' },
        { label: 'Genre', val: '2D Multiplayer Prop Hunt / Hide-and-Seek' },
        { label: 'Timeline', val: '2026' },
        { label: 'Status', val: 'In Active Development' }
      ],
      slides: [
        {
          title: 'Haunt the Hunt — Multiplayer Match Gameplay Reel',
          tag: 'Prop Hunt &bull; Solo Project',
          type: 'placeholder',
          src: '',
          phText: '[ Haunt the Hunt — Match Gameplay & Mechanics Reel ]'
        },
        {
          title: 'Ghost Possession & Transformation Loops',
          tag: 'Aseprite &bull; Frame-by-Frame Pixel',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 01 — Ghost Idle, Float, Possess & Disguise Loops ]'
        },
        {
          title: 'Hunter Search, Scan & Capture Animations',
          tag: 'Pixel Combat &bull; Smear Frames',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 02 — Hunter Patrol, Sweep, Tag & Catch VFX ]'
        },
        {
          title: 'Interactive Map Props & Disguise Targets',
          tag: 'Pixel Environment &bull; Interactive Sprites',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 03 — Possessable Furniture, Props & Shiver States ]'
        },
        {
          title: 'Pixel VFX: Smoke Poofs, Possession Sparkles & UI',
          tag: 'Pixel VFX &bull; Action Feedback',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 04 — Reveal Poofs, Possession Magic & Timer UI ]'
        }
      ],
      storyTitle: 'About the Project',
      storyText: 'Haunt the Hunt is a solo-developed 2D asymmetrical multiplayer prop hunt game designed around charming, accessible party gameplay. One hunter explores the arena seeking out mischievous ghosts, who must possess, mimic, and blend into everyday furniture and props to stay hidden until time expires.',
      roleTitle: 'My Role & Development Scope',
      roleText: 'As the sole creator, I designed and built every layer of the game: traditional frame-by-frame pixel art spritesheets in Aseprite, possession VFX transitions, environment props and map design, core party game rules, and full Unity multiplayer implementation.'
    },
    '3': {
      pill: 'Project 03',
      title: 'Dead of Night',
      subtitle: 'Cemetery Sim & Action RPG &bull; Frame-by-Frame Pixel Art',
      specs: [
        { label: 'Role', val: '2D Artist' },
        { label: 'Engine & Tools', val: 'Aseprite / Photoshop &bull; Unity' },
        { label: 'Genre', val: '2D Cemetery Simulation &bull; Action RPG' },
        { label: 'Timeline', val: '2025' },
        { label: 'Status', val: 'Completed Prototype (Vertical Slice)' }
      ],
      slides: [
        {
          title: 'Gameplay Reel',
          tag: '2D Pixel Art',
          type: 'video',
          src: 'images/deadofnightpreview.mov',
          phText: ''
        },
        {
          title: 'Key Art & Cemetery Title Scene',
          tag: 'Key Art &bull; 2D Pixel Art',
          type: 'image',
          src: 'images/dead_of_night_cover.png',
          phText: ''
        },
        {
          title: 'Keeper Daytime Duties: Shoveling & Grave Digging',
          tag: 'Aseprite &bull; Frame-by-Frame Pixel',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 01 — Shovel Digging, Dirt Throw & Walking Loops ]'
        },
        {
          title: 'Nighttime Combat & Monster Banishment',
          tag: 'Pixel Combat &bull; Attack Smears',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 02 — Holy Cross Spells, Smears & Monster Banishment ]'
        },
        {
          title: 'Cemetery Architecture & Church Interiors',
          tag: 'Pixel Environment &bull; Tilemaps',
          type: 'placeholder',
          src: '',
          phText: '[ Asset 03 — Church Cathedral, Crypts & Tilemaps ]'
        }
      ],
      storyTitle: 'About the Project',
      storyText: 'Dead of Night is a 2D cemetery simulation and survival action RPG created in a collaborative team setting. Players step into the worn boots of a graveyard watchman facing two contrasting realities: tending to grieving visitors and digging fresh graves under the pale daylight, then defending the consecrated grounds and banishing restless monsters once night falls.',
      roleTitle: 'My Role: 2D Art & Animation',
      roleText: 'As the 2D artist on the team, my focus was entirely on the visual art and animation pipeline — creating all frame-by-frame pixel character sprites (the graveyard keeper, daytime clients, and nocturnal monsters), atmospheric cemetery tilemaps, and key art, with UI handled separately by the team.'
    }
  };

  let currentProjectData = null;
  let currentProjectSlideIndex = 0;

  function renderProjectSlide(index) {
    if (!currentProjectData || !currentProjectData.slides || currentProjectData.slides.length === 0) return;
    const slides = currentProjectData.slides;
    currentProjectSlideIndex = (index + slides.length) % slides.length;
    const slide = slides[currentProjectSlideIndex];

    const mediaArea = document.getElementById('projectStageMedia');
    const slideTitle = document.getElementById('projectStageTitle');
    const slideTag = document.getElementById('projectStageTag');
    const dots = document.querySelectorAll('.stage-dot');

    if (mediaArea) {
      mediaArea.classList.add('fade-out');
      setTimeout(() => {
        mediaArea.innerHTML = '';
        if (slide.src && slide.src.trim() !== '') {
          if (slide.type === 'video') {
            const video = document.createElement('video');
            video.src = slide.src;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.controls = true;
            video.playsInline = true;
            mediaArea.appendChild(video);
            video.play().catch(() => {});
          } else {
            const img = document.createElement('img');
            img.src = slide.src;
            img.alt = slide.title;
            mediaArea.appendChild(img);
          }
        } else {
          mediaArea.innerHTML = `
            <div class="stage-ph-content">
              <span class="stage-ph-title">${slide.phText || slide.title}</span>
              <span class="stage-ph-desc">Work ${currentProjectSlideIndex + 1} of ${slides.length} &bull; Image or video reel placeholder</span>
            </div>
          `;
        }
        mediaArea.classList.remove('fade-out');
      }, 120);
    }

    if (slideTitle) slideTitle.textContent = slide.title;
    if (slideTag) {
      const numStr = `${String(currentProjectSlideIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      slideTag.innerHTML = slide.tag ? `${numStr} &bull; ${slide.tag}` : numStr;
    }

    dots.forEach((dot, i) => {
      if (i === currentProjectSlideIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  function navigateProjectSlide(direction) {
    if (!currentProjectData || !currentProjectData.slides) return;
    renderProjectSlide(currentProjectSlideIndex + direction);
  }

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal || !projectModalContent) return;

    currentProjectData = data;
    currentProjectSlideIndex = 0;

    let specsHtml = '';
    data.specs.forEach(spec => {
      specsHtml += `
        <div class="spec-item">
          <span class="spec-label">${spec.label}</span>
          <span class="spec-val">${spec.val}</span>
        </div>
      `;
    });

    let dotsHtml = '';
    data.slides.forEach((_, i) => {
      dotsHtml += `<button class="stage-dot ${i === 0 ? 'active' : ''}" data-slide-index="${i}" aria-label="Go to slide ${i + 1}"></button>`;
    });

    projectModalContent.innerHTML = `
      <div class="modal-project-header">
        <span class="modal-project-pill">${data.pill}</span>
        <h3 class="modal-project-title" id="modalProjectTitle">${data.title}</h3>
        <p style="color: var(--text-gray); font-size: 1.02rem; margin-bottom: 18px;">${data.subtitle}</p>
        
        <div class="modal-project-specs">
          ${specsHtml}
        </div>
      </div>

      <!-- Main Interactive Works Stage (Carousel) -->
      <div class="modal-showcase-stage" id="projectShowcaseStage">
        <button class="stage-nav-btn stage-nav-prev" id="projectStagePrev" aria-label="Previous work">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button class="stage-nav-btn stage-nav-next" id="projectStageNext" aria-label="Next work">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div class="stage-media-area" id="projectStageMedia"></div>

        <div class="stage-bottom-bar">
          <div class="stage-info-group">
            <span class="stage-meta-tag" id="projectStageTag">01 / 05</span>
            <h4 class="stage-slide-title" id="projectStageTitle">Loading...</h4>
          </div>
          <div class="stage-controls" id="projectStageDots">
            ${dotsHtml}
          </div>
        </div>
      </div>

      <!-- Story & Role Columns -->
      <div class="modal-project-story-grid">
        <div class="story-block">
          <h4>${data.storyTitle}</h4>
          <p>${data.storyText}</p>
        </div>
        <div class="story-block">
          <h4>${data.roleTitle}</h4>
          <p>${data.roleText}</p>
        </div>
      </div>
    `;

    // Connect stage buttons
    const prevBtn = document.getElementById('projectStagePrev');
    const nextBtn = document.getElementById('projectStageNext');
    if (prevBtn) prevBtn.addEventListener('click', () => navigateProjectSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateProjectSlide(1));

    const dots = document.querySelectorAll('.stage-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-slide-index'), 10);
        renderProjectSlide(idx);
      });
    });

    renderProjectSlide(0);

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    const activeVideo = projectModal.querySelector('video');
    if (activeVideo) {
      activeVideo.pause();
      activeVideo.src = '';
    }
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectRows.forEach(row => {
    row.addEventListener('click', () => {
      const pid = row.getAttribute('data-project-id');
      openProjectModal(pid);
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', closeProjectModal);
  }
});
