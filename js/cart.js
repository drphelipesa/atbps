// ─────────────────────────────────────────────
//  Carrinho de prescrição VO
// ─────────────────────────────────────────────

const cartItems = new Map(); // name → drug object

export function addToCart(drug) {
  cartItems.set(drug.n, drug);
  _updateFAB();
}

export function removeFromCart(name) {
  cartItems.delete(name);
  _updateFAB();
}

export function isInCart(name) {
  return cartItems.has(name);
}

function _updateFAB() {
  const fab = document.getElementById('cartFAB');
  if (!fab) return;
  const count = cartItems.size;
  fab.style.display = count > 0 ? 'flex' : 'none';
  document.getElementById('cartCount').textContent = count;
}

function _renderList() {
  const list = document.getElementById('cartList');
  if (!list) return;
  if (cartItems.size === 0) {
    list.innerHTML = '<div class="cart-empty">Nenhum medicamento adicionado</div>';
    return;
  }
  list.innerHTML = [...cartItems.values()].map(d => {
    const safe = d.n.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const rxHtml = (d.rx || d.dose || '').replace(/\n/g, '<br>');
    return `<div class="cart-item">
      <div style="flex:1;min-width:0">
        <div class="cart-item-name">${d.n}</div>
        <div class="cart-item-rx">${rxHtml}</div>
      </div>
      <button class="cart-rm" onclick="window._cartRemove('${safe}')" title="Remover">✕</button>
    </div>`;
  }).join('');
}

window._openCart = function() {
  _renderList();
  document.getElementById('cartModal').style.display = 'flex';
};

window._closeCart = function() {
  document.getElementById('cartModal').style.display = 'none';
};

window._cartRemove = function(name) {
  cartItems.delete(name);
  _updateFAB();
  _renderList();
  // Atualiza botão no grid se ainda visível
  document.querySelectorAll('.cart-add').forEach(btn => {
    if (btn.dataset.name === name) {
      btn.classList.remove('in-cart');
      btn.textContent = '+ Rx';
    }
  });
};

window._clearCart = function() {
  cartItems.clear();
  _updateFAB();
  _renderList();
  document.querySelectorAll('.cart-add.in-cart').forEach(btn => {
    btn.classList.remove('in-cart');
    btn.textContent = '+ Rx';
  });
};

window._copyCart = function(el) {
  if (cartItems.size === 0) return;
  const text = [...cartItems.values()]
    .map(d => d.rx || d.dose || d.n)
    .join('\n\n─────────────────\n\n');
  navigator.clipboard.writeText(text).catch(() => {});
  const orig = el.textContent;
  el.textContent = '✓ Copiado!';
  setTimeout(() => { el.textContent = orig; }, 2000);
};
