const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartDeliveryEl = document.getElementById("cartDelivery");
const cartTotalEl = document.getElementById("cartTotal");
const cartCheckout = document.getElementById("cartCheckout");
const cartCount = document.getElementById("cartCount");
const backToProductsBtn = document.getElementById("backToProducts");
const produtosSection = document.getElementById("produtos");
const carrinhoSection = document.getElementById("carrinho");
const productModal = document.getElementById("productModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalAddBtn = document.getElementById("modalAddBtn");
const toast = document.getElementById("toast");
const cursorGlow = document.querySelector("[data-cursor-glow]");
const hero = document.querySelector(".hero");
const filterButtons = document.querySelectorAll("[data-filter]");
const productCards = document.querySelectorAll(".product-card");

const DELIVERY_FEE = 8;
const CHECKOUT_ENDPOINT = "/api/create-checkout-session";
const cart = {};
let currentProductData = null;
let toastTimer;

const formatPrice = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const getProductData = (productCard) => ({
  id: productCard.dataset.productId,
  title: productCard.dataset.productTitle,
  category: productCard.dataset.productCategory,
  description: productCard.dataset.productDescription,
  price: Number(productCard.dataset.productPrice),
  image: productCard.querySelector(".product-image").src,
});

const showToast = (message = "Item no carrinho") => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1400);
};

const showModal = (productCard) => {
  currentProductData = getProductData(productCard);
  document.getElementById("modalImage").src = currentProductData.image;
  document.getElementById("modalTitle").textContent = currentProductData.title;
  document.getElementById("modalCategory").textContent = currentProductData.category;
  document.getElementById("modalDescription").textContent = currentProductData.description;
  document.getElementById("modalPrice").textContent = formatPrice(currentProductData.price);
  productModal.classList.remove("hidden");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const closeModal = () => {
  productModal.classList.add("hidden");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  currentProductData = null;
};

const visibleSections = [produtosSection, document.querySelector(".feature-grid"), document.querySelector(".section.intro"), document.querySelector(".experience")];

const showCartPage = () => {
  visibleSections.forEach((section) => {
    section.style.display = "none";
  });
  carrinhoSection.classList.remove("hidden");
  carrinhoSection.classList.add("visible");
  window.scrollTo({ top: carrinhoSection.offsetTop - 76, behavior: "smooth" });
};

const showProductsPage = () => {
  visibleSections.forEach((section) => {
    section.style.display = "";
  });
  carrinhoSection.classList.add("hidden");
  carrinhoSection.classList.remove("visible");
  window.scrollTo({ top: produtosSection.offsetTop - 72, behavior: "smooth" });
};

const updateCheckoutState = (items) => {
  if (!items.length) {
    cartCheckout.href = "#";
    cartCheckout.classList.add("disabled");
    return;
  }

  cartCheckout.href = "#checkout";
  cartCheckout.classList.remove("disabled");
};

const renderCart = () => {
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  cartItemsEl.innerHTML = "";

  if (!items.length) {
    cartItemsEl.textContent = "Carrinho vazio.";
  } else {
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <strong>${item.quantity}x</strong>
          <span>${item.title}</span>
        </div>
        <div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
          <button class="remove-item" type="button" data-product-id="${item.id}">-</button>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });
  }

  cartCount.textContent = quantity;
  cartSubtotalEl.textContent = formatPrice(subtotal);
  cartDeliveryEl.textContent = items.length ? formatPrice(DELIVERY_FEE) : formatPrice(0);
  cartTotalEl.textContent = items.length ? formatPrice(subtotal + DELIVERY_FEE) : formatPrice(0);
  updateCheckoutState(items);
};

const addProductToCart = (product, sourceCard) => {
  const existing = cart[product.id];
  cart[product.id] = existing ? { ...existing, quantity: existing.quantity + 1 } : { ...product, quantity: 1 };

  if (sourceCard) {
    sourceCard.classList.remove("fly-to-cart");
    void sourceCard.offsetWidth;
    sourceCard.classList.add("fly-to-cart");
  }

  renderCart();
  showToast(`${product.title} adicionado`);
};

const removeProductFromCart = (productId) => {
  const item = cart[productId];
  if (!item) return;

  if (item.quantity > 1) {
    cart[productId].quantity -= 1;
  } else {
    delete cart[productId];
  }

  renderCart();
};

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const syncHeroMotion = () => {
  if (!hero || window.matchMedia("(max-width: 760px)").matches) return;
  const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
  hero.style.setProperty("--hero-shift", `${progress * 26}px`);
};

const closeNav = () => {
  nav.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  header.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-label", "Abrir menu");
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  header.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav.addEventListener("click", (event) => {
  const cartLink = event.target.closest('a[href="#carrinho"]');
  if (cartLink) {
    event.preventDefault();
    closeNav();
    showCartPage();
    return;
  }

  if (event.target.matches("a")) closeNav();
});

document.addEventListener("click", (event) => {
  const quickAdd = event.target.closest(".quick-add");
  if (quickAdd) {
    const productCard = quickAdd.closest(".product-card");
    event.stopPropagation();
    addProductToCart(getProductData(productCard), productCard);
    return;
  }

  const productCard = event.target.closest(".product-card");
  if (productCard) showModal(productCard);

  const removeButton = event.target.closest(".remove-item");
  if (removeButton) removeProductFromCart(removeButton.dataset.productId);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    productCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.productFilter === filter;
      card.classList.toggle("is-filtered-out", !shouldShow);
      card.classList.remove("filter-enter");

      if (shouldShow) {
        void card.offsetWidth;
        card.classList.add("filter-enter");
      }
    });
  });
});

modalAddBtn.addEventListener("click", () => {
  if (!currentProductData) return;
  addProductToCart(currentProductData);
  closeModal();
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
backToProductsBtn.addEventListener("click", showProductsPage);

cartCheckout.addEventListener("click", async (event) => {
  event.preventDefault();

  if (cartCheckout.classList.contains("disabled")) return;

  const items = Object.values(cart).map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  const originalText = cartCheckout.textContent;
  cartCheckout.textContent = "Abrindo checkout...";
  cartCheckout.classList.add("disabled");

  try {
    const response = await fetch(CHECKOUT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Nao foi possivel iniciar o pagamento.");
    }

    window.location.href = data.url;
  } catch (error) {
    console.error(error);
    showToast(error.message || "Erro no pagamento");
    cartCheckout.textContent = originalText;
    cartCheckout.classList.remove("disabled");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !productModal.classList.contains("hidden")) closeModal();
});

document.addEventListener("mousemove", (event) => {
  if (!cursorGlow || window.matchMedia("(max-width: 760px)").matches) return;
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

document.addEventListener("mouseleave", () => {
  if (cursorGlow) cursorGlow.style.opacity = "0";
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  revealObserver.observe(element);
});

syncHeader();
syncHeroMotion();
window.addEventListener(
  "scroll",
  () => {
    syncHeader();
    syncHeroMotion();
  },
  { passive: true }
);
renderCart();
