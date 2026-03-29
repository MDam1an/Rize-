# Rize® — Drop 001
### Landing Page — The Eyes Collection

---

## 🚀 Como usar

1. **Extraia** o ZIP em qualquer pasta
2. **Abra** `index.html` no navegador
   - Para melhor experiência, use um servidor local (Live Server no VS Code, por exemplo)
3. Pronto!

---

## 📁 Estrutura

```
rize-landing/
├── index.html              — Página principal
├── css/
│   └── style.css           — Todos os estilos (CSS variables, responsivo)
├── js/
│   └── script.js           — Carrinho, checkout, animações, carousel
├── assets/
│   └── images/
│       ├── logo-black.png  — Logo versão preta
│       ├── logo-white.png  — Logo versão branca
│       ├── eyes.png        — Elemento gráfico olhos
│       └── lifestyle.png   — Foto lifestyle do produto
└── README.md
```

---

## ⚙️ Configuração

### Número do WhatsApp

Abra `js/script.js` e localize a linha:

```js
const WHATSAPP_NUMBER = '5548999999999';
```

Substitua pelo número real no formato: `55` + DDD + número.

Exemplo: `5548999998888`

---

## 🛒 Funcionalidades

- ✅ Carrinho lateral com localStorage
- ✅ Adicionar / remover produtos
- ✅ Total automático
- ✅ Checkout com formulário completo
- ✅ Geração automática de mensagem WhatsApp
- ✅ Seletor de tamanho (P / M / G / GG)
- ✅ Carrossel arrastável (mouse + touch)
- ✅ Animações de scroll com IntersectionObserver
- ✅ Navbar com blur no scroll
- ✅ Menu mobile
- ✅ Totalmente responsivo (mobile-first)

---

## 🎨 Tech Stack

- HTML5 semântico
- CSS3 com Custom Properties (sem framework)
- JavaScript vanilla (sem dependências)
- Google Fonts: Bebas Neue, DM Sans, Space Mono

---

## 📱 Responsividade

- **Mobile** (< 600px) — prioridade máxima
- **Tablet** (600px–900px) — layout 1 coluna
- **Desktop** (> 900px) — layout 2 colunas

---

© 2025 Rize® — Drop 001. Todos os direitos reservados.
