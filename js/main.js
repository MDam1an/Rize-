/**
 * RIZE® — Drop 001
 * main.js — Landing page logic
 *
 * Modules:
 *  1. Header scroll + mobile menu
 *  2. Products render
 *  3. Auto-play carousel
 *  4. Cart drawer
 *  5. Hero + scroll reveal animations
 */

'use strict';

/* ========================
   1. HEADER
   ======================== */
const Header = (() => {
  let menuOpen = false;

  function init() {
    const header  = document.getElementById('header');
    const menuBtn = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    // Scroll: add .scrolled class
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });

    // Mobile menu toggle
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        menuBtn.classList.toggle('open', menuOpen);
        mobileNav.classList.toggle('open', menuOpen);
        menuBtn.setAttribute('aria-expanded', menuOpen);
        mobileNav.setAttribute('aria-hidden', !menuOpen);
      });
    }

    // Close menu on nav link click
    document.querySelectorAll('.header__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        if (menuBtn) { menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
        if (mobileNav) { mobileNav.classList.remove('open'); mobileNav.setAttribute('aria-hidden', 'true'); }
      });
    });
  }

  return { init };
})();

/* ========================
   2. PRODUCTS RENDER
   ======================== */
const Products = (() => {
  /** Build a product card HTML */
  function _cardHTML(p) {
    const sizeChips = SIZES.map((s, i) =>
      `<button class="size-chip${i===2?' active':''}" data-size="${s}" aria-label="Tamanho ${s}">${s}</button>`
    ).join('');

    return `
      <article class="product-card scroll-reveal" style="--sr-delay:${Math.random()*0.15}s" data-product-id="${p.id}">
        <div class="product-card__img-wrap">
          <img
            src="${p.image}"
            alt="${p.name} — ${p.variant}"
            class="product-card__img"
            loading="lazy"
          />
          <span class="product-card__badge">${p.badge}</span>
        </div>
        <div class="product-card__body">
          <p class="product-card__name">${p.name}</p>
          <p class="product-card__variant">${p.variant}</p>
          <p class="product-card__desc">${p.desc}</p>

          <div class="product-card__sizes" role="group" aria-label="Escolha o tamanho">
            ${sizeChips}
          </div>

          <div class="product-card__footer">
            <span class="product-card__price">${formatPrice(p.price)}</span>

            <div class="qty-control" aria-label="Quantidade">
              <button class="qty-btn qty-minus" aria-label="Diminuir quantidade">−</button>
              <span class="qty-value" aria-live="polite">1</span>
              <button class="qty-btn qty-plus" aria-label="Aumentar quantidade">+</button>
            </div>

            <button class="product-card__add" aria-label="Adicionar ao carrinho">
              Add
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /** Wire up interactions for a rendered card */
  function _bindCard(card, product) {
    // Size chips
    card.querySelectorAll('.size-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        card.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Qty controls
    const qtyEl  = card.querySelector('.qty-value');
    const minusBtn = card.querySelector('.qty-minus');
    const plusBtn  = card.querySelector('.qty-plus');
    let qty = 1;

    minusBtn.addEventListener('click', () => {
      if (qty > 1) { qty--; qtyEl.textContent = qty; }
    });
    plusBtn.addEventListener('click', () => {
      if (qty < 10) { qty++; qtyEl.textContent = qty; }
    });

    // Add to cart
    const addBtn = card.querySelector('.product-card__add');
    addBtn.addEventListener('click', () => {
      const activeSize = card.querySelector('.size-chip.active')?.dataset.size || 'G';
      Cart.add(product, activeSize, qty);
      Toast.show(`${product.name} (${activeSize}) adicionado ✓`);

      // Visual feedback
      addBtn.textContent = '✓ Adicionado';
      addBtn.classList.add('done');
      setTimeout(() => {
        addBtn.textContent = 'Add';
        addBtn.classList.remove('done');
      }, 2000);
    });
  }

  function render() {
    const eyesGrid = document.getElementById('eyesGrid');
    const logoGrid = document.getElementById('logoGrid');
    if (!eyesGrid || !logoGrid) return;

    const eyesProducts = RIZE_PRODUCTS.filter(p => p.collection === 'eyes');
    const logoProducts = RIZE_PRODUCTS.filter(p => p.collection === 'logo');

    function renderGrid(grid, products) {
      grid.innerHTML = products.map(p => _cardHTML(p)).join('');
      grid.querySelectorAll('.product-card').forEach(card => {
        const productId = card.dataset.productId;
        const product = RIZE_PRODUCTS.find(p => p.id === productId);
        if (product) _bindCard(card, product);
      });
    }

    renderGrid(eyesGrid, eyesProducts);
    renderGrid(logoGrid, logoProducts);
  }

  return { render };
})();

/* ========================
   3. AUTO-PLAY CAROUSEL
   ======================== */
const AutoCarousel = (() => {
  // All 4 product photos as carousel slides
  const slides = [
    { src: 'assets/images/product-eyes-white.jpg',  label: 'Eyes Tee — Off-White' },
    { src: 'assets/images/product-eyes-black.jpg',  label: 'Eyes Tee — Preto' },
    { src: 'assets/images/product-logo-white.jpg',  label: 'Logo Tee — Off-White' },
    { src: 'assets/images/product-logo-black.jpg',  label: 'Logo Tee — Preto' },
    { src: 'assets/images/black-eye.png',           label: 'Rize® — The Eyes' },
    { src: 'assets/images/product-eyes-white.jpg',  label: 'Drop 001 — Lookbook' },
    { src: 'assets/images/product-logo-black.jpg',  label: 'Drop 001 — Lookbook' },
    { src: 'assets/images/product-eyes-black.jpg',  label: 'Drop 001 — Lookbook' },
  ];

  function init() {
    const track = document.getElementById('autoCarouselTrack');
    if (!track) return;

    // Duplicate slides 3x for seamless infinite loop
    const allSlides = [...slides, ...slides, ...slides];

    track.innerHTML = allSlides.map(s => `
      <div class="carousel-card">
        <img src="${s.src}" alt="${s.label}" loading="lazy" />
        <span class="carousel-card__label">${s.label}</span>
      </div>
    `).join('');

    // Calculate single set width and animate
    const cardW = 300 + 16; // width + gap
    const singleSetW = slides.length * cardW;

    // CSS animation approach — smooth, no JS loop needed
    track.style.animation = `none`;
    track.style.cssText = `
      display: flex;
      gap: 16px;
      will-change: transform;
      animation: carouselAutoplay ${slides.length * 3}s linear infinite;
    `;

    // Inject keyframes dynamically
    if (!document.getElementById('carousel-kf')) {
      const style = document.createElement('style');
      style.id = 'carousel-kf';
      style.textContent = `
        @keyframes carouselAutoplay {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${singleSetW}px); }
        }
      `;
      document.head.appendChild(style);
    }

    // Pause on hover
    const wrapper = document.querySelector('.autoplay-carousel');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
      wrapper.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }
  }

  return { init };
})();

/* ========================
   4. CART DRAWER
   ======================== */
const CartDrawer = (() => {
  function _renderItems() {
    const container = document.getElementById('drawerItems');
    const footer    = document.getElementById('drawerFooter');
    const items     = Cart.getItems();

    if (!container) return;

    if (!items.length) {
      container.innerHTML = '<p class="cart-drawer__empty">Seu carrinho está vazio.</p>';
      if (footer) footer.style.display = 'none';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="drawer-item">
        <img src="${item.image}" alt="${item.name}" class="drawer-item__img" />
        <div class="drawer-item__info">
          <p class="drawer-item__name">${item.name}</p>
          <p class="drawer-item__meta">${item.variant} · ${item.size} · Qtd: ${item.qty}</p>
          <div class="drawer-item__controls">
            <button class="drawer-item__remove" data-line="${item.lineId}">Remover</button>
          </div>
        </div>
        <span class="drawer-item__price">${formatPrice(item.price * item.qty)}</span>
      </div>
    `).join('');

    // Bind remove buttons
    container.querySelectorAll('.drawer-item__remove').forEach(btn => {
      btn.addEventListener('click', () => Cart.remove(btn.dataset.line));
    });

    if (footer) {
      footer.style.display = 'flex';
      footer.style.flexDirection = 'column';
      footer.style.gap = '12px';
    }

    const subtotalEl = document.getElementById('drawerSubtotal');
    if (subtotalEl) subtotalEl.textContent = formatPrice(Cart.getTotal());
  }

  function _updateBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const count = Cart.getCount();
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  }

  function open() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('drawerOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    _renderItems();
  }

  function close() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('drawerOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    document.getElementById('cartToggle')?.addEventListener('click', open);
    document.getElementById('cartClose')?.addEventListener('click', close);
    document.getElementById('drawerOverlay')?.addEventListener('click', close);

    window.addEventListener('cart:update', () => {
      _updateBadge();
      _renderItems();
    });

    _updateBadge();
  }

  return { init };
})();

/* ========================
   5. HERO + SCROLL REVEAL
   ======================== */
const Animations = (() => {
  function _heroReveal() {
    // Stagger hero headline lines
    requestAnimationFrame(() => {
      document.querySelectorAll('.reveal-line').forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), 100 + i * 120);
      });
      document.querySelectorAll('.reveal-fade').forEach(el => {
        const delay = parseFloat(el.style.getPropertyValue('--delay') || '0.4') * 1000;
        setTimeout(() => el.classList.add('in'), delay);
      });
      document.querySelectorAll('.reveal-slide').forEach(el => {
        setTimeout(() => el.classList.add('in'), 200);
      });
    });
  }

  function _scrollReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  }

  function init() {
    _heroReveal();
    // Delay scroll observer so Products.render() has time to inject cards
    setTimeout(_scrollReveal, 100);
  }

  return { init };
})();

/* ========================
   INIT
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Header.init();
  Products.render();
  AutoCarousel.init();
  CartDrawer.init();
  Animations.init();
});
