# Rize® — Drop 001 v2
### Landing Page — The Eyes & Logo Collection

---

## 🚀 Como usar

1. Extraia o ZIP em qualquer pasta
2. Abra `index.html` no navegador
   - Para melhor experiência, use Live Server no VS Code
3. A página do carrinho fica em `pages/cart.html`

---

## ⚙️ Configuração obrigatória

Abra `js/cart-page.js` e atualize o número do WhatsApp:

```js
const WHATSAPP_NUMBER = '5548999999999';
// Formato: 55 (Brasil) + DDD + número
// Exemplo: '5548991234567'
```

---

## 📁 Estrutura

```
rize-v2/
├── index.html              — Landing page principal
├── pages/
│   └── cart.html           — Página dedicada de checkout
├── css/
│   ├── style.css           — Design system completo (dark/light)
│   └── cart-page.css       — Estilos exclusivos da página de carrinho
├── js/
│   ├── data.js             — Catálogo de produtos (2 coleções)
│   ├── cart.js             — Módulo de carrinho (localStorage)
│   ├── ui.js               — Toast, Theme, formatadores
│   ├── main.js             — Landing page: carousel, produtos, drawer
│   └── cart-page.js        — Checkout: form, validação, WhatsApp
├── assets/
│   └── images/             — Todos os assets da marca
└── README.md
```

---

## ✨ Funcionalidades

**Landing Page:**
- ✅ Dark/Light mode persistente
- ✅ Header com scroll blur + menu mobile
- ✅ Hero com animações staggeradas
- ✅ Carrossel automático (sem interação, infinite loop)
- ✅ Duas coleções no Drop 001 (Eyes + Logo)
- ✅ Seletor de tamanho (P/M/G/GG) por card
- ✅ Seletor de quantidade por card
- ✅ Carrinho lateral (drawer) com resumo
- ✅ Toast notifications
- ✅ Scroll reveal animations

**Página de Checkout (`pages/cart.html`):**
- ✅ Lista de itens com qty controls
- ✅ Formulário completo: nome, CPF, WhatsApp, e-mail, endereço
- ✅ Auto-busca de endereço por CEP (ViaCEP API)
- ✅ Máscaras de CPF, telefone, CEP em tempo real
- ✅ Validação de todos os campos obrigatórios
- ✅ Order summary sticky com badges de confiança
- ✅ Mensagem completa gerada automaticamente para WhatsApp

---

## 🎨 Tema

O tema escuro/claro é persistido via `localStorage`.  
Key: `rize_theme` — valores: `"dark"` | `"light"`.

---

© 2025 Rize® — Drop 001. Todos os direitos reservados.
