/**
 * RIZE® — Drop 001
 * ui.js — Shared UI utilities (Toast, Theme, Format)
 */

'use strict';

/* ========================
   FORMAT HELPERS
   ======================== */
function formatPrice(val) {
  return 'R$ ' + val.toFixed(2).replace('.', ',');
}

function formatCPF(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9) v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6,9)+'-'+v.slice(9);
  else if (v.length > 6) v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6);
  else if (v.length > 3) v = v.slice(0,3)+'.'+v.slice(3);
  return v;
}

function formatCEP(v) {
  v = v.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.slice(0,5)+'-'+v.slice(5);
  return v;
}

function formatPhone(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) v = '('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7);
  else if (v.length > 2) v = '('+v.slice(0,2)+') '+v.slice(2);
  return v;
}

/* ========================
   TOAST
   ======================== */
const Toast = (() => {
  let timer;

  function show(msg, type = 'default') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type === 'error' ? ' error' : '');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  return { show };
})();

/* ========================
   THEME
   ======================== */
const Theme = (() => {
  const KEY = 'rize_theme';

  function get() {
    return localStorage.getItem(KEY) || 'dark';
  }

  function set(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
  }

  function toggle() {
    set(get() === 'dark' ? 'light' : 'dark');
  }

  function init() {
    set(get()); // apply persisted theme immediately
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init, get, set, toggle };
})();
