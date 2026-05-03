const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const currentYear = document.querySelector("#currentYear");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

currentYear.textContent = new Date().getFullYear();
document.body.classList.add("animations-ready");

menuToggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") {
    return;
  }

  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();
  const submitButton = contactForm.querySelector("button[type='submit']");

  if (!name || !email || !message) {
    formStatus.textContent = "Preencha todos os campos antes de enviar.";
    return;
  }

  submitButton.disabled = true;
  formStatus.textContent = `Obrigado, ${name}! Enviando seu pedido para a Wild Group...`;

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    contactForm.reset();
    formStatus.textContent =
      "Mensagem enviada com sucesso. Em breve a Wild Group entra em contato.";
  } catch (error) {
    formStatus.textContent =
      "Nao foi possivel enviar agora. Verifique se o Netlify Forms esta ativo e tente novamente.";
  } finally {
    submitButton.disabled = false;
  }
});

const animatedElements = document.querySelectorAll(
  ".reveal, .card, .timeline article",
);

if (!("IntersectionObserver" in window)) {
  animatedElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
    },
  );

  animatedElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
    revealObserver.observe(element);
  });
}
