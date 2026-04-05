/**
 * RIZE® — Drop 001
 * cart-page.js — Dedicated cart/checkout page logic
 *
 * Features:
 *  - Render cart items with qty controls
 *  - Order summary (sticky)
 *  - Form with real-time masking + CEP auto-lookup (ViaCEP)
 *  - Full validation before checkout
 *  - WhatsApp message generation
 */

'use strict';

/* =====================
   CONFIG
   ===================== */
const WHATSAPP_NUMBER = '5548999999999'; // 🔧 Substitua pelo número real: 55 + DDD + número

/* =====================
   CART PAGE RENDER
   ===================== */
const CartPageUI = (() => {
  function renderItems() {
    const container   = document.getElementById('cartPageItems');
    const emptyEl     = document.getElementById('cartEmpty');
    const layoutEl    = document.getElementById('cartLayout');
    const items       = Cart.getItems();

    if (!container) return;

    if (!items.length) {
      if (emptyEl)  emptyEl.style.display = 'flex';
      if (layoutEl) layoutEl.style.display = 'none';
      return;
    }

    if (emptyEl)  emptyEl.style.display = 'none';
    if (layoutEl) layoutEl.style.display = 'grid';

    container.innerHTML = items.map(item => `
      <div class="cart-page-item" data-line="${item.lineId}">
        <img
          src="../${item.image}"
          alt="${item.name}"
          class="cart-page-item__img"
        />
        <div class="cart-page-item__info">
          <p class="cart-page-item__name">${item.name}</p>
          <p class="cart-page-item__meta">${item.variant} · Tamanho ${item.size}</p>
          <div class="cart-page-item__controls">
            <div class="qty-control" aria-label="Quantidade">
              <button class="qty-btn qty-minus" data-line="${item.lineId}" aria-label="Diminuir">−</button>
              <span class="qty-value" aria-live="polite">${item.qty}</span>
              <button class="qty-btn qty-plus" data-line="${item.lineId}" aria-label="Aumentar">+</button>
            </div>
            <button class="cart-page-item__remove" data-line="${item.lineId}">Remover</button>
          </div>
        </div>
        <span class="cart-page-item__price">${formatPrice(item.price * item.qty)}</span>
      </div>
    `).join('');

    // Bind qty + remove
    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = Cart.getItems().find(i => i.lineId === btn.dataset.line);
        if (item) Cart.setQty(btn.dataset.line, item.qty - 1);
      });
    });
    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = Cart.getItems().find(i => i.lineId === btn.dataset.line);
        if (item) Cart.setQty(btn.dataset.line, item.qty + 1);
      });
    });
    container.querySelectorAll('.cart-page-item__remove').forEach(btn => {
      btn.addEventListener('click', () => Cart.remove(btn.dataset.line));
    });
  }

  function renderSummary() {
    const summaryEl    = document.getElementById('summaryItems');
    const subtotalEl   = document.getElementById('summarySubtotal');
    const totalEl      = document.getElementById('summaryTotal');
    const items        = Cart.getItems();
    const total        = Cart.getTotal();

    if (summaryEl) {
      summaryEl.innerHTML = items.map(item => `
        <div class="summary-item">
          <img
            src="../${item.image}"
            alt="${item.name}"
            class="summary-item__img"
          />
          <div class="summary-item__info">
            <p class="summary-item__name">${item.name}</p>
            <p class="summary-item__meta">${item.variant} · ${item.size} · ×${item.qty}</p>
          </div>
          <span class="summary-item__price">${formatPrice(item.price * item.qty)}</span>
        </div>
      `).join('') || '<p style="font-size:12px;color:var(--c-text-faint);text-align:center;padding:8px">Nenhum item</p>';
    }

    if (subtotalEl) subtotalEl.textContent = formatPrice(total);
    if (totalEl)    totalEl.textContent    = formatPrice(total);
  }

  return { renderItems, renderSummary };
})();

/* =====================
   FORM MASKS
   ===================== */
const FormMasks = (() => {
  function init() {
    const cpf  = document.getElementById('f-cpf');
    const tel  = document.getElementById('f-tel');
    const cep  = document.getElementById('f-cep');

    if (cpf) {
      cpf.addEventListener('input', () => { cpf.value = formatCPF(cpf.value); });
    }
    if (tel) {
      tel.addEventListener('input', () => { tel.value = formatPhone(tel.value); });
    }
    if (cep) {
      cep.addEventListener('input', () => { cep.value = formatCEP(cep.value); });
    }
  }

  return { init };
})();

/* =====================
   CEP LOOKUP (ViaCEP)
   ===================== */
const CepLookup = (() => {
  async function lookup() {
    const cepInput = document.getElementById('f-cep');
    const cep = cepInput?.value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      Toast.show('CEP inválido. Informe 8 dígitos.', 'error');
      return;
    }

    const btn = document.getElementById('cepLookup');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }

    try {
      const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        Toast.show('CEP não encontrado.', 'error');
        return;
      }

      const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      set('f-rua',    data.logradouro || '');
      set('f-bairro', data.bairro     || '');
      set('f-cidade', data.localidade || '');
      set('f-estado', data.uf         || '');
      Toast.show('Endereço preenchido ✓');

    } catch {
      Toast.show('Erro ao buscar CEP. Tente novamente.', 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    }
  }

  function init() {
    const btn = document.getElementById('cepLookup');
    if (btn) btn.addEventListener('click', lookup);

    // Also trigger on CEP input when 8 digits filled
    const cepEl = document.getElementById('f-cep');
    if (cepEl) {
      cepEl.addEventListener('input', () => {
        if (cepEl.value.replace(/\D/g, '').length === 8) lookup();
      });
    }
  }

  return { init };
})();

/* =====================
   FORM VALIDATION
   ===================== */
function validateForm() {
  const fields = [
    { id: 'f-nome',   label: 'Nome completo' },
    { id: 'f-cpf',    label: 'CPF' },
    { id: 'f-tel',    label: 'WhatsApp' },
    { id: 'f-cep',    label: 'CEP' },
    { id: 'f-estado', label: 'Estado' },
    { id: 'f-cidade', label: 'Cidade' },
    { id: 'f-rua',    label: 'Rua' },
    { id: 'f-num',    label: 'Número' },
    { id: 'f-bairro', label: 'Bairro' },
  ];

  let firstError = null;

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    el.classList.remove('error');
    if (!el.value.trim()) {
      el.classList.add('error');
      if (!firstError) firstError = { el, label: f.label };
    }
  });

  if (!Cart.getCount()) {
    Toast.show('Adicione produtos antes de finalizar.', 'error');
    return false;
  }

  if (firstError) {
    Toast.show(`Campo obrigatório: ${firstError.label}`, 'error');
    firstError.el.focus();
    firstError.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  return true;
}

/* =====================
   WHATSAPP CHECKOUT
   ===================== */
function buildWhatsAppMessage() {
  const get = id => document.getElementById(id)?.value?.trim() || '';

  const nome    = get('f-nome');
  const cpf     = get('f-cpf');
  const tel     = get('f-tel');
  const email   = get('f-email');
  const cep     = get('f-cep');
  const rua     = get('f-rua');
  const num     = get('f-num');
  const comp    = get('f-comp');
  const bairro  = get('f-bairro');
  const cidade  = get('f-cidade');
  const estado  = get('f-estado');
  const obs     = get('f-obs');

  const items = Cart.getItems();
  const total = Cart.getTotal();

  const itemsText = items.map(i =>
    `• ${i.name} (${i.variant}) — Tam. ${i.size} × ${i.qty} = ${formatPrice(i.price * i.qty)}`
  ).join('\n');

  const enderecoComp = comp ? `${rua}, ${num}, ${comp} — ${bairro}` : `${rua}, ${num} — ${bairro}`;

  let msg = `🛍️ *PEDIDO RIZE® — DROP 001*\n\n`;
  msg += `*PRODUTOS:*\n${itemsText}\n\n`;
  msg += `*TOTAL: ${formatPrice(total)}*\n`;
  msg += `_(Frete a combinar)_\n\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `*DADOS DO CLIENTE:*\n`;
  msg += `Nome: ${nome}\n`;
  msg += `CPF: ${cpf}\n`;
  msg += `WhatsApp: ${tel}\n`;
  if (email) msg += `E-mail: ${email}\n`;
  msg += `\n*ENDEREÇO DE ENTREGA:*\n`;
  msg += `${enderecoComp}\n`;
  msg += `${cidade} — ${estado}, CEP ${cep}\n`;
  if (obs) msg += `\n*Observações:* ${obs}\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `_Pedido realizado via Rize® Landing Page_`;

  return msg;
}

/* =====================
   INIT
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  // Apply theme
  Theme.init();

  // Header scroll
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  // Render cart
  CartPageUI.renderItems();
  CartPageUI.renderSummary();

  // Listen for cart updates
  window.addEventListener('cart:update', () => {
    CartPageUI.renderItems();
    CartPageUI.renderSummary();
  });

  // Form
  FormMasks.init();
  CepLookup.init();

  // WhatsApp button
  const waBtn = document.getElementById('whatsappBtn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!validateForm()) return;

      const msg     = buildWhatsAppMessage();
      const encoded = encodeURIComponent(msg);
      const url     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
});
