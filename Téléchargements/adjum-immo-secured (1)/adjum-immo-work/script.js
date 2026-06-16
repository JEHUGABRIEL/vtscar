// ===== Hero Carousel =====
(function() {
  var heroCarousel = document.getElementById('heroCarousel');
  if (!heroCarousel) return; // Guard: page without hero

  var heroIdx = 0;
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDots = document.querySelectorAll('.hero-dot');
  var heroTitles = [
    "Trouvez le bien immobilier qu'il vous faut à Bangui",
    "Des logements de qualité pour vous et votre famille",
    "Investissez dans l'immobilier en toute sécurité à Bangui"
  ];
  var heroSubs = [
    "Achat, vente, location et gestion de biens résidentiels et commerciaux en République Centrafricaine.",
    "Des appartements, villas et bureaux disponibles dans les meilleurs quartiers de Bangui.",
    "Notre équipe vous accompagne à chaque étape de votre projet immobilier."
  ];
  var heroTimer;

  window.goHero = function(n) {
    heroSlides[heroIdx].classList.remove('active');
    heroDots[heroIdx].classList.remove('active');
    heroIdx = (n + heroSlides.length) % heroSlides.length;
    heroSlides[heroIdx].classList.add('active');
    heroDots[heroIdx].classList.add('active');
    document.getElementById('heroTitle').textContent = heroTitles[heroIdx];
    document.getElementById('heroSub').textContent = heroSubs[heroIdx];
  };

  function startHeroTimer() {
    heroTimer = setInterval(function() { window.goHero(heroIdx + 1); }, 5500);
  }
  startHeroTimer();

  heroCarousel.addEventListener('mouseenter', function() { clearInterval(heroTimer); });
  heroCarousel.addEventListener('mouseleave', startHeroTimer);

  // ===== Parallax effect on scroll =====
  function updateHeroParallax() {
    var rect = heroCarousel.getBoundingClientRect();
    var winH = window.innerHeight;
    // Progress: 0 when hero bottom touches viewport bottom, 1 when hero top touches viewport top
    var progress = (winH - rect.top) / (winH + rect.height);
    progress = Math.max(0, Math.min(1, progress));
    // Map to offset: -15px (scroll up) to +15px (scroll down)
    var offset = (progress - 0.5) * 30;

    heroSlides.forEach(function(slide) {
      slide.style.backgroundPositionY = 'calc(50% - ' + offset + 'px)';
    });
  }

  var parallaxTicking = false;
  window.addEventListener('scroll', function() {
    if (!parallaxTicking) {
      requestAnimationFrame(function() {
        updateHeroParallax();
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  });

  // Throttled resize handler to recalculate
  var parallaxResizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(parallaxResizeTimer);
    parallaxResizeTimer = setTimeout(updateHeroParallax, 150);
  });

  // Initial position
  updateHeroParallax();
})();

// ===== Testimonials Carousel =====
(function() {
  var temoTrack = document.getElementById('temoTrack');
  if (!temoTrack) return; // Guard: page without testimonials

  var temoIdx = 0;
  var temoTotal = 4;
  var temoTimer;
  var temoDots = document.querySelectorAll('#temoDots .temo-dot');

  function getTemoSlidePct() {
    if (window.innerWidth >= 1024) return 33.333;
    if (window.innerWidth >= 640) return 50;
    return 100;
  }

  function updateTemoPosition() {
    temoTrack.style.transform = 'translateX(-' + (temoIdx * getTemoSlidePct()) + '%)';
  }

  window.goTemo = function(n) {
    temoIdx = (n + temoTotal) % temoTotal;
    updateTemoPosition();
    temoDots.forEach(function(d, i) { d.classList.toggle('active', i === temoIdx); });
  };

  // Recalculate on resize
  var temoResizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(temoResizeTimer);
    temoResizeTimer = setTimeout(function() {
      updateTemoPosition();
    }, 200);
  });

  document.getElementById('temoNext').addEventListener('click', function() { window.goTemo(temoIdx + 1); });
  document.getElementById('temoPrev').addEventListener('click', function() { window.goTemo(temoIdx - 1); });

  function startTemoTimer() {
    temoTimer = setInterval(function() { window.goTemo(temoIdx + 1); }, 4500);
  }
  startTemoTimer();

  temoTrack.addEventListener('mouseenter', function() { clearInterval(temoTimer); });
  temoTrack.addEventListener('mouseleave', startTemoTimer);
})();

// ===== Navigation Direction for View Transitions =====
(function() {
  // Intercept clicks on internal links to store direction in sessionStorage
  // before the browser navigates. The new page reads it to pick the right animation.
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a || !a.href) return;
    var url = new URL(a.href);
    var cur = new URL(window.location.href);
    if (url.origin !== cur.origin) return;

    var toBiens = url.pathname.endsWith('biens.html');
    var toIndex = url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname.endsWith('/');
    var fromBiens = cur.pathname.endsWith('biens.html');

    if (toBiens) {
      sessionStorage.setItem('vtDir', 'f'); // forward
    } else if (toIndex && fromBiens) {
      sessionStorage.setItem('vtDir', 'b'); // back
    } else {
      sessionStorage.removeItem('vtDir');
    }
  });
})();

// ===== Mobile Menu =====
(function() {
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('navMenu');
  var overlay = document.getElementById('menuOverlay');
  if (!toggle || !menu) return;

  // Save original body paddingRight so we can restore it
  var _origBodyPad = '';

  function openMenu() {
    menu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    // Compensate for disappearing scrollbar to prevent layout shift
    _origBodyPad = document.body.style.paddingRight || '';
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
    document.body.style.overflow = 'hidden';
    // Set stagger index on each link for progressive appearance
    menu.querySelectorAll('a').forEach(function(a, i) {
      a.style.setProperty('--stagger', i);
    });
    var icon = toggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-xmark';
  }

  function closeMenu() {
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.paddingRight = _origBodyPad;
    document.body.style.overflow = '';
    // Remove stagger so all links disappear simultaneously
    menu.querySelectorAll('a').forEach(function(a) {
      a.style.removeProperty('--stagger');
    });
    var icon = toggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  }

  toggle.addEventListener('click', function() {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('#navMenu a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });

  // Close menu when user scrolls outside the menu (mobile touch)
  document.addEventListener('touchmove', function(e) {
    if (!menu.classList.contains('open')) return;
    // Don't close if scrolling inside the menu (e.g. long link list)
    if (menu.contains(e.target)) return;
    closeMenu();
  }, { passive: true });
})();

// ===== Firebase Init =====
var firebaseConfig = {
  apiKey: "AIzaSyDMU1VU_3W50EwLCwzs6-ElbfCye6LE3mc",
  authDomain: "project-1871f7bb-347b-4f86-a85.firebaseapp.com",
  projectId: "project-1871f7bb-347b-4f86-a85",
  storageBucket: "project-1871f7bb-347b-4f86-a85.firebasestorage.app",
  messagingSenderId: "971306126898",
  appId: "1:971306126898:web:67bcf424798776373f362b"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// ===== Biens Data — chargée depuis Firestore =====
var biensDataFull = [];

function mapBienData(b) {
  var badge = b.transaction === 'vente' ? 'À vendre' : 'À louer';
  var badgeColor = b.transaction === 'vente' ? 'gold' : 'navy';
  return {
    id: b.id,
    title: b.title,
    quartier: b.quartier,
    prix: b.prix,
    unite: b.unite,
    transaction: b.transaction,
    type: b.type,
    description: b.description || '',
    badge: badge,
    badgeColor: badgeColor,
    tag: b.tag || '',
    img: b.img,
    alt: b.title + ', ' + b.quartier + ', Bangui',
    cols: (b.cols || []).map(function(c) { return {icon: c.icon, label: c.label}; }),
    gallery: b.gallery || [],
    features: b.features || []
  };
}

function loadBiensData(callback) {
  if (typeof db === 'undefined' || !db) {
    console.error('Firebase non initialisé');
    if (callback) callback([]);
    return;
  }
  db.collection('biens').orderBy('id', 'asc').get()
    .then(function(querySnapshot) {
      biensDataFull = [];
      querySnapshot.forEach(function(doc) {
        biensDataFull.push(mapBienData(doc.data()));
      });
      if (callback) callback(biensDataFull);
    })
    .catch(function(error) {
      console.error('Erreur chargement Firestore:', error);
      if (callback) callback([]);
    });
}

// Chargement immédiat
loadBiensData();

// ===== Modal =====
var modalOverlay = document.getElementById('modalOverlay');

window.openModal = function(id) {
  var d = biensDataFull.find(function(b) { return b.id === id; });
  if (!d) return;

  // Nettoyer tout cross-fade en cours
  if (window._crossfadeTimer) {
    clearTimeout(window._crossfadeTimer);
    window._crossfadeTimer = null;
  }
  document.getElementById('modalImg').classList.remove('fading-out');
  document.getElementById('modalImgNext').classList.remove('active');
  document.getElementById('modalImgNext').src = '';

  var badgeBg = d.badgeColor === 'gold' ? 'bg-gold text-navy-fonce' : 'bg-navy text-white';
  var colsHtml = (d.cols || []).map(function(c) {
    return '<div class="flex items-center gap-2.5 text-[0.9rem] text-[#555] py-1.5"><i class="fa-solid fa-' + c.icon + ' w-5 text-gold text-center"></i> ' + c.label + '</div>';
  }).join('');

  var featuresHtml = d.features.map(function(f) {
    return '<span class="text-[0.85rem] bg-gris text-navy px-3.5 py-1.5 rounded-full border border-gris-moyen inline-flex items-center gap-1.5"><i class="fa-solid fa-check text-gold text-[0.7rem]"></i> ' + f + '</span>';
  }).join(' ');

  // Set gallery
  var modalImg = document.getElementById('modalImg');
  var modalGallery = document.getElementById('modalGallery');
  var skeleton = document.querySelector('.modal-skeleton');

  // Reset skeleton (show it while image loads)
  if (skeleton) skeleton.classList.remove('loaded');
  modalImg.style.opacity = '0';

  // Hide skeleton once image is loaded (set handler BEFORE src for cached images)
  modalImg.onload = function() {
    modalImg.style.opacity = '';
    if (skeleton) skeleton.classList.add('loaded');
    modalImg.onload = null;
    modalImg.onerror = null;
  };
  modalImg.onerror = function() {
    modalImg.style.opacity = '0.7';
    if (skeleton) skeleton.classList.add('loaded');
    modalImg.onload = null;
    modalImg.onerror = null;
  };

  modalImg.src = d.gallery[0];
  modalImg.alt = d.title;

  modalGallery.innerHTML = d.gallery.map(function(url, i) {
    return '<img src="' + url.replace('w=800', 'w=120') + '" class="' + (i === 0 ? 'active' : '') + '" onclick="switchGallery(' + d.id + ', ' + i + ')" alt="Photo ' + (i + 1) + '">';
  }).join('');

  // Set gallery counter
  document.getElementById('galleryCounter').textContent = '1 / ' + d.gallery.length;

  // Store current state for gallery navigation
  window._currentGalleryId = d.id;
  window._currentGalleryIdx = 0;

  // Show gallery nav arrows
  var navPrev = document.getElementById('galleryPrev');
  var navNext = document.getElementById('galleryNext');
  if (navPrev && navNext) {
    navPrev.style.display = d.gallery.length > 1 ? 'flex' : 'none';
    navNext.style.display = d.gallery.length > 1 ? 'flex' : 'none';
  }

  document.getElementById('modalBadge').className = 'inline-block ' + badgeBg + ' text-[0.75rem] font-bold px-3 py-1 rounded-sm tracking-[1px] uppercase mb-4';
  document.getElementById('modalBadge').textContent = d.badge;
  document.getElementById('modalTitle').textContent = d.title;
  document.getElementById('modalLocation').innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + d.quartier + ', Bangui';
  document.getElementById('modalPrice').innerHTML = d.prix + ' <span class="text-[1rem] font-normal text-[#888]">' + d.unite + '</span>';
  document.getElementById('modalCols').innerHTML = colsHtml;
  document.getElementById('modalDesc').textContent = d.description;
  document.getElementById('modalFeatures').innerHTML = featuresHtml;
  document.getElementById('modalContactBtn').href = 'index.html#contact';

  // Set WhatsApp share link
  var whatsappMsg = encodeURIComponent(
    '🏠 *' + d.title + '*\n' +
    '📍 ' + d.quartier + ', Bangui\n' +
    '💰 ' + d.prix + ' ' + d.unite + '\n\n' +
    '🔗 Voir sur adjunimmo.com : https://adjunimmo.com/biens.html'
  );
  document.getElementById('modalWhatsAppBtn').href = 'https://wa.me/?text=' + whatsappMsg;

  // ===== Biens similaires =====
  var similar = biensDataFull.filter(function(b) {
    if (b.id === d.id) return false;
    return b.quartier === d.quartier || b.transaction === d.transaction;
  });
  // Shuffle and take up to 4
  for (var i = similar.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = similar[i]; similar[i] = similar[j]; similar[j] = tmp;
  }
  similar = similar.slice(0, 4);

  var similarSection = document.getElementById('modalSimilarSection');
  var similarList = document.getElementById('modalSimilarList');
  if (similarSection && similarList) {
    if (similar.length === 0) {
      similarSection.style.display = 'none';
    } else {
      similarSection.style.display = '';
      similarList.innerHTML = similar.map(function(b) {
        var badgeBg = b.badgeColor === 'gold' ? 'bg-gold text-navy-fonce' : 'bg-navy text-white';
        var similTagHtml = b.tag ? '<div class="tag-badge tag-badge--' + (b.tag === 'Nouveau' ? 'nouveau' : 'exclusivite') + '">' + b.tag + '</div>' : '';
        return '<div class="similar-card flex-shrink-0 w-[180px] rounded-lg overflow-hidden border border-gris-moyen bg-white cursor-pointer hover:shadow-[0_4px_12px_rgba(13,45,90,0.1)] hover:-translate-y-1 transition-all duration-200" onclick="openModal(' + b.id + ')">' +
          '<div class="relative h-[110px] overflow-hidden">' +
            '<img src="' + b.gallery[0].replace('w=800', 'w=300') + '" alt="' + b.title + '" class="w-full h-full object-cover">' +
            '<div class="absolute top-1.5 left-1.5 ' + badgeBg + ' text-[0.65rem] font-bold px-2 py-0.5 rounded-sm uppercase">' + b.badge + '</div>' +
            similTagHtml +
          '</div>' +
          '<div class="p-2.5">' +
            '<h5 class="text-[0.82rem] font-bold text-navy leading-tight mb-0.5 truncate">' + b.title + '</h5>' +
            '<p class="text-[0.7rem] text-[#888] truncate">' + b.quartier + '</p>' +
            '<p class="text-[0.85rem] font-extrabold text-navy mt-1">' + b.prix + ' <span class="text-[0.65rem] font-normal text-[#888]">' + b.unite + '</span></p>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.switchGallery = function(id, idx) {
  var d = biensDataFull.find(function(b) { return b.id === id; });
  if (!d) return;

  // Clear any pending cross-fade timeout
  if (window._crossfadeTimer) {
    clearTimeout(window._crossfadeTimer);
    // Reset both images to clean state
    document.getElementById('modalImg').classList.remove('fading-out');
    document.getElementById('modalImgNext').classList.remove('active');
  }

  var currentImg = document.getElementById('modalImg');
  var nextImg = document.getElementById('modalImgNext');

  // Set the new image on the overlay element
  nextImg.src = d.gallery[idx];

  // Trigger cross-fade: current fades out, next fades in
  currentImg.classList.add('fading-out');
  nextImg.classList.add('active');

  // After transition completes, swap src and reset
  window._crossfadeTimer = setTimeout(function() {
    currentImg.src = d.gallery[idx];
    currentImg.classList.remove('fading-out');
    nextImg.classList.remove('active');
    nextImg.src = '';
    window._crossfadeTimer = null;
  }, 380);

  var thumbs = document.querySelectorAll('#modalGallery img');
  thumbs.forEach(function(t, i) {
    t.classList.toggle('active', i === idx);
  });

  // Update gallery counter
  document.getElementById('galleryCounter').textContent = (idx + 1) + ' / ' + d.gallery.length;

  window._currentGalleryId = id;
  window._currentGalleryIdx = idx;
};

window.navigateGallery = function(dir) {
  var id = window._currentGalleryId;
  var idx = window._currentGalleryIdx + dir;
  var d = biensDataFull.find(function(b) { return b.id === id; });
  if (!d) return;

  // Loop around
  if (idx < 0) idx = d.gallery.length - 1;
  if (idx >= d.gallery.length) idx = 0;

  switchGallery(id, idx);
};

window.closeModal = function() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
};

// Close on overlay click
if (modalOverlay) {
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      window.closeModal();
    }
  });
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
    window.closeModal();
  }
});

// ===== Modal Swipe to Close (mobile touch) =====
(function() {
  var content = document.querySelector('.modal-content');
  if (!content || !modalOverlay) return;

  var startY = 0, dragY = 0, dragging = false;
  var THRESHOLD = 100;
  var MAX_DRAG = 200;

  content.addEventListener('touchstart', function(e) {
    if (!modalOverlay.classList.contains('active')) return;
    if (content.scrollTop > 0) return;
    if (e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    dragging = false;
  }, { passive: true });

  content.addEventListener('touchmove', function(e) {
    if (!modalOverlay.classList.contains('active')) return;
    if (e.touches.length !== 1) return;

    var dy = e.touches[0].clientY - startY;
    if (dy <= 0) return;
    if (content.scrollTop > 0) return;

    e.preventDefault();

    if (!dragging) {
      dragging = true;
      content.style.transition = 'none';
      modalOverlay.style.transition = 'none';
    }

    dragY = Math.min(dy, MAX_DRAG);
    content.style.transform = 'translateY(' + dragY + 'px)';
    modalOverlay.style.backdropFilter = 'none';
    modalOverlay.style.WebkitBackdropFilter = 'none';
    modalOverlay.style.opacity = 1 - (dragY / MAX_DRAG) * 0.5;
  }, { passive: false });

  function resetSwipeStyles(animateBack) {
    if (animateBack) {
      content.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      content.style.transform = '';
      modalOverlay.style.transition = 'opacity 0.25s ease';
      modalOverlay.style.opacity = '';
      modalOverlay.style.backdropFilter = '';
      modalOverlay.style.WebkitBackdropFilter = '';
      setTimeout(function() {
        content.style.transition = '';
        modalOverlay.style.transition = '';
      }, 400);
    } else {
      content.style.transition = '';
      content.style.transform = '';
      content.style.opacity = '';
      modalOverlay.style.transition = '';
      modalOverlay.style.opacity = '';
      modalOverlay.style.backdropFilter = '';
      modalOverlay.style.WebkitBackdropFilter = '';
    }
  }

  content.addEventListener('touchend', function() {
    if (!dragging) return;
    dragging = false;

    if (dragY >= THRESHOLD) {
      // Swipe down to close
      content.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      content.style.transform = 'translateY(500px)';
      content.style.opacity = '0';
      modalOverlay.style.transition = 'opacity 0.3s ease';
      modalOverlay.style.opacity = '0';

      setTimeout(function() {
        resetSwipeStyles(false);
        closeModal();
      }, 300);
    } else {
      resetSwipeStyles(true);
    }

    startY = 0;
    dragY = 0;
  }, { passive: true });

  content.addEventListener('touchcancel', function() {
    if (!dragging) return;
    dragging = false;
    resetSwipeStyles(true);
    startY = 0;
    dragY = 0;
  }, { passive: true });
})();

// ===== Page Loader / Spinner =====
(function() {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;

  function hideLoader() {
    loader.style.opacity = '0';
    setTimeout(function() { loader.style.display = 'none'; }, 300);
  }

  // If page already fully loaded (bfcache / direct navigation), hide immediately
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', function() {
      // Small delay so the VT enter animation can show the spinner briefly
      setTimeout(hideLoader, 250);
    });
  }
})();

// ===== Scroll Reveal (Intersection Observer) =====
(function() {
  var revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  revealElements.forEach(function(el) {
    observer.observe(el);
  });
})();

// ===== Contact Form (Web3Forms) =====
(function() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var successEl = document.getElementById('formSuccess');
  var errorEl = document.getElementById('formError');
  var submitBtn = document.getElementById('formSubmitBtn');
  var btnIcon = document.getElementById('btnIcon');
  var btnText = document.getElementById('btnText');
  var btnSpinner = document.getElementById('btnSpinner');

  function showLoading(state) {
    if (state) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
      btnIcon.classList.add('hidden');
      btnText.classList.add('hidden');
      btnSpinner.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
      btnIcon.classList.remove('hidden');
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Cache les messages précédents
    if (successEl) successEl.classList.add('hidden');
    if (errorEl) errorEl.classList.add('hidden');

    showLoading(true);

    var formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      showLoading(false);
      if (data.success) {
        // Redirection vers la page Merci (replace pour éviter re-soumission avec le bouton Précédent)
        window.location.replace('merci.html');
      } else {
        if (errorEl) errorEl.classList.remove('hidden');
      }
    })
    .catch(function() {
      showLoading(false);
      if (errorEl) errorEl.classList.remove('hidden');
    });
  });
})();
