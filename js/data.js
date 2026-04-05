/**
 * RIZE® — Drop 001
 * data.js — Products catalogue
 *
 * Two collections:
 *  - "eyes"  → estampa dos olhos
 *  - "logo"  → nome Rize
 */

'use strict';

const RIZE_PRODUCTS = [
  /* -------- EYES COLLECTION -------- */
  {
    id:         'drop001-eyes-white',
    collection: 'eyes',
    name:       'Eyes Tee',
    variant:    'Off-White',
    desc:       'Heavyweight 340g. Fit oversized. Silk screen eyes front.',
    price:      189.90,
    badge:      'Drop 001',
    image:      'assets/images/product-eyes-white.jpg',
  },
  {
    id:         'drop001-eyes-black',
    collection: 'eyes',
    name:       'Eyes Tee',
    variant:    'Preto',
    desc:       'Heavyweight 340g. Fit oversized. Silk screen eyes front.',
    price:      189.90,
    badge:      'Drop 001',
    image:      'assets/images/product-eyes-black.jpg',
  },

  /* -------- LOGO COLLECTION -------- */
  {
    id:         'drop001-logo-white',
    collection: 'logo',
    name:       'Rize Logo Tee',
    variant:    'Off-White',
    desc:       'Heavyweight 340g. Fit oversized. Logo Rize® silk front.',
    price:      179.90,
    badge:      'Drop 001',
    image:      'assets/images/product-logo-white.jpg',
  },
  {
    id:         'drop001-logo-black',
    collection: 'logo',
    name:       'Rize Logo Tee',
    variant:    'Preto',
    desc:       'Heavyweight 340g. Fit oversized. Logo Rize® silk front.',
    price:      179.90,
    badge:      'Drop 001',
    image:      'assets/images/product-logo-black.jpg',
  },
];

const SIZES = ['P', 'M', 'G', 'GG'];
