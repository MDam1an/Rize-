/**
 * RIZE® — Drop 001
 * script.js — Main application logic
 *
 * Modules:
 *  1. Products data
 *  2. Cart (localStorage)
 *  3. Nav (scroll + mobile menu)
 *  4. Hero reveal animations
 *  5. Carousel / gallery
 *  6. Products grid render
 *  7. Scroll animations (IntersectionObserver)
 *  8. Checkout & WhatsApp
 *  9. Toast notifications
 * 10. Size picker
 */

'use strict';

/* ============================
   1. PRODUCTS DATA
   ============================ */
const PRODUCTS = [
  {
    id: 'rize-001-eyes-creme',
    name: 'Eyes Tee',
    variant: 'Creme / Oversized',
    desc: 'Heavyweight 340g. Fit oversized. Estampa silk olhos.',
    price: 189.90,
    badge: 'Drop 001',
    // Use lifestyle image for all products (real photo)
    image: 'assets/images/lifestyle.png',
    imageStyle: 'object-position: 25% center',
  },
  {
    id: 'rize-001-eyes-black',
    name: 'Eyes Tee',
    variant: 'Preto / Oversized',
    desc: 'Heavyweight 340g. Fit oversized. Estampa silk olhos.',
    price: 189.90,
    badge: 'Drop 001',
    image: 'assets/images/lifestyle.png',
    imageStyle: 'object-position: 75% center',
  },
  {
    id: 'rize-001-eyes-hoodie',
    name: 'Eyes Hoodie',
    variant: 'Creme / Baggy',
    desc: 'Fleece 400g. Fit baggy. Logo bordado. Estampa frente.',
    price: 299.90,
    badge: '— NOVO',
    image: 'assets/images/lifestyle.png',
    imageStyle: 'object-position: 50% 20%',
  },
];

/* ============================
   2. CART MODULE
   ============================ */
const Cart = (() => {
  const STORAGE_KEY = 'rize_cart_v1';
  let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  const add = (product) => {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    save();
    UI.renderCart();
    UI.updateCartCount();
    UI.renderCheckoutSummary();
    Toast.show(`${product.name} adicionado ✓`);
  };

  const remove = (productId) => {
    items = items.filter(i => i.id !== productId);
    save();
    UI.renderCart();
    UI.updateCartCount();
    UI.renderCheckoutSummary();
  };

  const getTotal = () =>
    items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const getItems = () => [...items];

  const getCount = () => items.reduce((n, i) => n + i.qty, 0);

  return { add, remove, getTotal, getItems, getCount };
})();

/* ============================
   3. UI MODULE
   ============================ */
const UI = {
  /* --- Cart sidebar --- */
  renderCart() {
    const container = document.getElementById('cartItems');
    const footer    = document.getElementById('cartFooter');
    const items     = Cart.getItems();

    if (!items.length) {
      container.innerHTML = '<p class="cart__empty">Nenhum item adicionado.</p>';
      footer.style.display = 'none';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="cart-item">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="cart-item__img"
          style="${item.imageStyle || ''}"
        />
        <div class="cart-item__info">
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__meta">${item.variant} × ${item.qty}</p>
        </div>
        <span class="cart-item__price">
          R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}
        </span>
        <button
          class="cart-item__remove"
          onclick="Cart.remove('${item.id}')"
          aria-label="Remover ${item.name}"
        >✕</button>
      </div>
    `).join('');

    const total = Cart.getTotal();
    document.getElementById('cartTotal').textContent =
      `R$ ${total.toFixed(2).replace('.', ',')}`;
    footer.style.display = 'block';
  },

  updateCartCount() {
    const count = Cart.getCount();
    const el    = document.getElementById('cartCount');
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  },

  renderCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    const items     = Cart.getItems();

    if (!items.length) {
      container.innerHTML = '<p class="checkout__empty-cart">Adicione produtos ao carrinho para continuar.</p>';
      return;
    }

    const rows = items.map(item => `
      <div class="checkout__summary-item">
        <span class="checkout__summary-name">
          ${item.name} <small style="opacity:.5">${item.variant}</small> × ${item.qty}
        </span>
        <span class="checkout__summary-price">
          R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}
        </span>
      </div>
    `).join('');

    const total = Cart.getTotal();

    container.innerHTML = `
      ${rows}
      <div class="checkout__summary-total">
        <span>Total</span>
        <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong>
      </div>
    `;
  },

  /* --- Products grid --- */
  renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = PRODUCTS.map(p => `
      <div class="product-card" data-animate>
        <div class="product-card__img-wrap">
          <img
            src="${p.image}"
            alt="${p.name} — ${p.variant}"
            class="product-card__img"
            loading="lazy"
            style="${p.imageStyle || ''}"
          />
          <span class="product-card__badge">${p.badge}</span>
        </div>
        <div class="product-card__body">
          <p class="product-card__name">${p.name}</p>
          <p class="product-card__desc">${p.variant} — ${p.desc}</p>
          <div class="product-card__footer">
            <span class="product-card__price">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
            <button
              class="product-card__add"
              id="btn-${p.id}"
              onclick="UI.addToCart('${p.id}')"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    Cart.add(product);

    // Visual feedback on button
    const btn = document.getElementById(`btn-${productId}`);
    if (btn) {
      btn.textContent = 'Adicionado ✓';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Adicionar';
        btn.classList.remove('added');
      }, 2000);
    }
  },

  /* --- Carousel --- */
  renderCarousel() {
    const track  = document.getElementById('carouselTrack');
    const labels = [
      'Drop 001 — Eyes Tee',
      'Rize® — Lookbook',
      'The Eyes Collection',
      'Drop 001 — Street',
      'Rize® — 2025',
    ];

    // Use the lifestyle image split into "virtual slides" with different object positions
    const positions = ['25% 20%', '50% 30%', '75% 20%', '50% 70%', '25% 60%'];

    track.innerHTML = positions.map((pos, i) => `
      <div class="carousel__card">
        <img
          src="assets/images/lifestyle.png"
          alt="${labels[i]}"
          loading="lazy"
          style="object-position: ${pos}"
        />
        <span class="carousel__card-label">${labels[i]}</span>
      </div>
    `).join('');
  },
};

/* ============================
   4. NAV MODULE
   ============================ */
const Nav = (() => {
  const nav        = document.getElementById('nav');
  const menuBtn    = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const cartBtn    = document.getElementById('cartToggle');
  const cartClose  = document.getElementById('cartClose');
  const cartSidebar= document.getElementById('cartSidebar');
  const cartOverlay= document.getElementById('cartOverlay');
  const cartCheckout = document.getElementById('cartCheckoutBtn');

  const openCart = () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  const init = () => {
    // Scroll effect
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Mobile menu
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    // Cart open/close
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Cart checkout btn closes cart and scrolls
    if (cartCheckout) {
      cartCheckout.addEventListener('click', () => {
        closeCart();
      });
    }
  };

  return { init };
})();

/* ============================
   5. HERO REVEAL
   ============================ */
const HeroReveal = (() => {
  const init = () => {
    // Stagger reveal lines
    const lines = document.querySelectorAll('[data-reveal]');
    requestAnimationFrame(() => {
      lines.forEach(el => {
        setTimeout(() => el.classList.add('revealed'), 80);
      });
    });
  };
  return { init };
})();

/* ============================
   6. CAROUSEL DRAG
   ============================ */
const Carousel = (() => {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  const init = () => {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    // Auto scroll (CSS animation alternative — JS for infinite loop)
    // Simple drag-to-scroll
    carousel.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
    });
    carousel.addEventListener('mouseleave', () => {
      isDragging = false;
      carousel.style.cursor = 'grab';
    });
    carousel.addEventListener('mouseup', () => {
      isDragging = false;
      carousel.style.cursor = 'grab';
    });
    carousel.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    carousel.addEventListener('touchstart', e => {
      startX = e.touches[0].pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    }, { passive: true });
    carousel.addEventListener('touchmove', e => {
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  };

  return { init };
})();

/* ============================
   7. SCROLL ANIMATIONS
   ============================ */
const ScrollAnimations = (() => {
  const init = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger items in a grid
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('in-view');
            }, parseInt(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Stagger product cards
    document.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.dataset.delay = i * 80;
      observer.observe(el);
    });

    // Observe section elements
    document.querySelectorAll(
      '.identity__inner, .gallery__header, .drop__header, .checkout__left, .checkout__right, .scarcity__inner'
    ).forEach(el => {
      el.setAttribute('data-animate', '');
      observer.observe(el);
    });
  };

  return { init };
})();

/* ============================
   8. CHECKOUT & WHATSAPP
   ============================ */
const Checkout = (() => {
  const WHATSAPP_NUMBER = '5548999999999'; // 🔧 Update with your number

  const formatMessage = (data) => {
    const items = Cart.getItems();
    if (!items.length) return null;

    const selectedSize = document.querySelector('.size-btn.active')?.dataset.size || 'G';

    const productsList = items
      .map(i => `• ${i.name} (${i.variant}) × ${i.qty} — R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}`)
      .join('\n');

    const total = Cart.getTotal();

    return `Olá! Quero finalizar meu pedido na Rize® 👀\n\n` +
           `*Drop 001 — The Eyes Collection*\n\n` +
           `*Produtos:*\n${productsList}\n\n` +
           `*Tamanho:* ${selectedSize}\n` +
           `*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n` +
           `*Dados de entrega:*\n` +
           `Nome: ${data.nome}\n` +
           `CEP: ${data.cep}\n` +
           `Endereço: ${data.endereco}, ${data.cidade} - ${data.estado}`;
  };

  const validate = (data) => {
    if (!data.nome.trim())     return 'Por favor, informe seu nome.';
    if (!data.telefone.trim()) return 'Por favor, informe seu WhatsApp.';
    if (!data.cep.trim())      return 'Por favor, informe seu CEP.';
    if (!data.cidade.trim())   return 'Por favor, informe sua cidade.';
    if (!data.estado.trim())   return 'Por favor, informe seu estado.';
    if (!data.endereco.trim()) return 'Por favor, informe seu endereço.';
    if (!Cart.getCount())      return 'Adicione pelo menos um produto ao carrinho.';
    return null;
  };

  const init = () => {
    const btn = document.getElementById('whatsappBtn');
    if (!btn) return;

    // CEP auto-format
    const cepInput = document.getElementById('cep');
    if (cepInput) {
      cepInput.addEventListener('input', () => {
        let v = cepInput.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
        cepInput.value = v;
      });
    }

    btn.addEventListener('click', () => {
      const data = {
        nome:     document.getElementById('nome')?.value || '',
        telefone: document.getElementById('telefone')?.value || '',
        cep:      document.getElementById('cep')?.value || '',
        cidade:   document.getElementById('cidade')?.value || '',
        estado:   document.getElementById('estado')?.value || '',
        endereco: document.getElementById('endereco')?.value || '',
      };

      const error = validate(data);
      if (error) {
        Toast.show(error, true);
        return;
      }

      const message = formatMessage(data);
      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  };

  return { init };
})();

/* ============================
   9. TOAST
   ============================ */
const Toast = (() => {
  let timer = null;
  let el = null;

  const create = () => {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
    return el;
  };

  const show = (msg, isError = false) => {
    if (!el) create();
    el.textContent = msg;
    el.style.background = isError ? '#ff4444' : 'var(--c-white)';
    el.style.color       = isError ? '#fff' : 'var(--c-black)';
    el.classList.add('show');
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), 2800);
  };

  return { show };
})();

/* ============================
   10. SIZE PICKER
   ============================ */
const SizePicker = (() => {
  const init = () => {
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  };
  return { init };
})();

/* ============================
   INIT — DOMContentLoaded
   ============================ */
document.addEventListener('DOMContentLoaded', () => {
  // Render dynamic content
  UI.renderProducts();
  UI.renderCarousel();
  UI.renderCart();
  UI.updateCartCount();
  UI.renderCheckoutSummary();

  // Init modules
  Nav.init();
  HeroReveal.init();
  Carousel.init();
  SizePicker.init();
  Checkout.init();

  // Init scroll animations after DOM is ready
  requestAnimationFrame(() => {
    ScrollAnimations.init();
  });
});
