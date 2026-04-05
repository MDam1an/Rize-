/**
 * RIZE® — Drop 001
 * cart.js — Cart state & localStorage
 */

'use strict';

const Cart = (() => {
  const KEY = 'rize_cart_v2';

  /* ---- State ---- */
  let items = _load();

  function _load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }

  function _save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); }
    catch (e) { console.warn('Cart save failed:', e); }
  }

  /* ---- Public API ---- */

  /**
   * Add product to cart.
   * @param {object} product  - from RIZE_PRODUCTS
   * @param {string} size     - selected size
   * @param {number} qty      - quantity (>=1)
   */
  function add(product, size, qty = 1) {
    qty = Math.max(1, parseInt(qty) || 1);
    const lineId = `${product.id}--${size}`;
    const existing = items.find(i => i.lineId === lineId);

    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
    } else {
      items.push({
        lineId,
        productId: product.id,
        name:    product.name,
        variant: product.variant,
        size,
        price:   product.price,
        image:   product.image,
        qty,
      });
    }

    _save();
    _dispatch();
  }

  /**
   * Remove a line item.
   * @param {string} lineId
   */
  function remove(lineId) {
    items = items.filter(i => i.lineId !== lineId);
    _save();
    _dispatch();
  }

  /**
   * Update qty of a line item.
   * @param {string} lineId
   * @param {number} qty
   */
  function setQty(lineId, qty) {
    qty = parseInt(qty);
    if (qty < 1) { remove(lineId); return; }
    const item = items.find(i => i.lineId === lineId);
    if (item) { item.qty = Math.min(qty, 10); }
    _save();
    _dispatch();
  }

  /** Clear all items. */
  function clear() { items = []; _save(); _dispatch(); }

  /** Get items copy. */
  function getItems() { return [...items]; }

  /** Total item count. */
  function getCount() { return items.reduce((n, i) => n + i.qty, 0); }

  /** Total price. */
  function getTotal() { return items.reduce((s, i) => s + i.price * i.qty, 0); }

  /* ---- Event bus ---- */
  function _dispatch() {
    window.dispatchEvent(new CustomEvent('cart:update'));
  }

  return { add, remove, setQty, clear, getItems, getCount, getTotal };
})();
