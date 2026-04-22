const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const contactSubmitButton = document.getElementById("contactSubmitButton");

const teamModal = document.getElementById("teamModal");
const teamModalOverlay = document.getElementById("teamModalOverlay");
const teamModalClose = document.getElementById("teamModalClose");
const teamModalTitle = document.getElementById("teamModalTitle");
const teamModalDescription = document.getElementById("teamModalDescription");
const teamModalList = document.getElementById("teamModalList");
const teamButtons = document.querySelectorAll(".open-team-modal");

const alertModal = document.getElementById("alertModal");
const alertModalOverlay = document.getElementById("alertModalOverlay");
const alertModalClose = document.getElementById("alertModalClose");
const alertModalButton = document.getElementById("alertModalButton");

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");
const heroSlider = document.querySelector(".hero-slider");

const HERO_INTERVAL = 5500;
let currentHeroSlide = 0;
let heroAutoplay = null;

const CONTACTS = {
  comercial: {
    title: "Bom dia, seja bem-vindo!",
    description: "Escolha com quem deseja falar no Comercial.",
    message: "Olá, vim pelo site da Araguaya e quero falar sobre operações.",
    people: [
      { name: "Isabel", phone: "5511998287519" },
      { name: "Vitor", phone: "551136668140" },
      { name: "Juliana", phone: "5511973554220" },
      { name: "Henrique", phone: "551136662143" },
      { name: "Julia", phone: "5511997225969" },
      { name: "Mikael", phone: "551136665328" },
      { name: "Joel", phone: "5511965766207" }
    ]
  },
  atendimento: {
    title: "Bom dia, seja bem-vindo!",
    description: "Escolha com quem deseja falar no Atendimento.",
    message: "Olá, vim pelo site da Araguaya e preciso de atendimento.",
    people: [
      { name: "Isabel", phone: "5511998287519" },
      { name: "Vitor", phone: "551136668140" },
      { name: "Juliana", phone: "5511973554220" },
      { name: "Henrique", phone: "551136662143" },
      { name: "Julia", phone: "5511997225969" },
      { name: "Mikael", phone: "551136665328" },
      { name: "Joel", phone: "5511965766207" }
    ]
  }
};

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 13) {
    const ddd = digits.slice(2, 4);
    const first = digits.slice(4, 9);
    const second = digits.slice(9);
    return `(${ddd}) ${first}-${second}`;
  }

  if (digits.length === 12) {
    const ddd = digits.slice(2, 4);
    const first = digits.slice(4, 8);
    const second = digits.slice(8);
    return `(${ddd}) ${first}-${second}`;
  }

  return digits;
}

function buildWhatsAppUrl(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function renderTeamModal(teamKey) {
  const team = CONTACTS[teamKey];
  if (!team || !teamModalTitle || !teamModalDescription || !teamModalList) return;

  teamModalTitle.textContent = team.title;
  teamModalDescription.textContent = team.description;
  teamModalList.innerHTML = "";

  team.people.forEach((person) => {
    const link = document.createElement("a");
    link.className = "team-person";
    link.href = buildWhatsAppUrl(person.phone, team.message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const initials = person.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    link.innerHTML = `
      <div class="team-person-avatar">${initials}</div>
      <div class="team-person-content">
        <small>Clique e converse conosco!</small>
        <strong>${person.name} | ${formatPhone(person.phone)}</strong>
        <span>ONLINE</span>
      </div>
    `;

    teamModalList.appendChild(link);
  });
}

function openTeamModal(teamKey) {
  if (!teamModal) return;
  renderTeamModal(teamKey);
  teamModal.classList.add("open");
  teamModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeTeamModal() {
  if (!teamModal) return;
  teamModal.classList.remove("open");
  teamModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openAlertModal() {
  if (!alertModal) return;
  alertModal.classList.add("open");
  alertModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeAlertModal() {
  if (!alertModal) return;
  alertModal.classList.remove("open");
  alertModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function updateHeaderState() {
  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function goToHeroSlide(index) {
  if (!heroSlides.length) return;

  const total = heroSlides.length;
  currentHeroSlide = (index + total) % total;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentHeroSlide);
  });

  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentHeroSlide);
  });
}

function nextHeroSlide() {
  goToHeroSlide(currentHeroSlide + 1);
}

function prevHeroSlideFn() {
  goToHeroSlide(currentHeroSlide - 1);
}

function startHeroAutoplay() {
  if (!heroSlides.length || heroSlides.length < 2) return;
  stopHeroAutoplay();
  heroAutoplay = window.setInterval(nextHeroSlide, HERO_INTERVAL);
}

function stopHeroAutoplay() {
  if (heroAutoplay) {
    window.clearInterval(heroAutoplay);
    heroAutoplay = null;
  }
}

function setFeedback(message, type = "default") {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.classList.remove("success", "error", "loading");
  if (type !== "default") {
    formFeedback.classList.add(type);
  }
}

function validateFormFields(form) {
  const nome = form.nome.value.trim();
  const empresa = form.empresa.value.trim();
  const telefone = form.telefone.value.trim();
  const email = form.email.value.trim();
  const mensagem = form.mensagem.value.trim();

  if (!nome || !empresa || !telefone || !email || !mensagem) {
    return "Preencha todos os campos antes de enviar.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Informe um e-mail válido.";
  }

  return "";
}

async function handleContactSubmit(event) {
  event.preventDefault();

  if (!contactForm) return;

  const validationError = validateFormFields(contactForm);
  if (validationError) {
    setFeedback(validationError, "error");
    return;
  }

  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  if (contactSubmitButton) {
    contactSubmitButton.disabled = true;
    contactSubmitButton.textContent = "Enviando...";
  }

  setFeedback("Enviando mensagem...", "loading");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Não foi possível enviar sua mensagem.");
    }

    contactForm.reset();
    setFeedback(result.message || "Mensagem enviada com sucesso.", "success");
  } catch (error) {
    setFeedback(error.message || "Ocorreu um erro ao enviar a mensagem.", "error");
  } finally {
    if (contactSubmitButton) {
      contactSubmitButton.disabled = false;
      contactSubmitButton.textContent = "Enviar mensagem";
    }
  }
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState);

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (nav) {
      nav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (sections.length && navLinks.length) {
  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (href === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
}

teamButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const teamKey = button.dataset.team;
    openTeamModal(teamKey);
  });
});

if (teamModalOverlay) {
  teamModalOverlay.addEventListener("click", closeTeamModal);
}

if (teamModalClose) {
  teamModalClose.addEventListener("click", closeTeamModal);
}

if (alertModalOverlay) {
  alertModalOverlay.addEventListener("click", closeAlertModal);
}

if (alertModalClose) {
  alertModalClose.addEventListener("click", closeAlertModal);
}

if (alertModalButton) {
  alertModalButton.addEventListener("click", closeAlertModal);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && teamModal && teamModal.classList.contains("open")) {
    closeTeamModal();
  }

  if (event.key === "Escape" && alertModal && alertModal.classList.contains("open")) {
    closeAlertModal();
  }

  if (event.key === "ArrowRight") {
    nextHeroSlide();
    startHeroAutoplay();
  }

  if (event.key === "ArrowLeft") {
    prevHeroSlideFn();
    startHeroAutoplay();
  }
});

if (heroPrev) {
  heroPrev.addEventListener("click", () => {
    prevHeroSlideFn();
    startHeroAutoplay();
  });
}

if (heroNext) {
  heroNext.addEventListener("click", () => {
    nextHeroSlide();
    startHeroAutoplay();
  });
}

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slideIndex = Number(dot.dataset.slide);
    goToHeroSlide(slideIndex);
    startHeroAutoplay();
  });
});

if (heroSlider) {
  heroSlider.addEventListener("mouseenter", stopHeroAutoplay);
  heroSlider.addEventListener("mouseleave", startHeroAutoplay);
  heroSlider.addEventListener("touchstart", stopHeroAutoplay, { passive: true });
  heroSlider.addEventListener("touchend", startHeroAutoplay);
}

if (heroSlides.length) {
  goToHeroSlide(0);
  startHeroAutoplay();
}

window.addEventListener("load", () => {
  if (alertModal) {
    setTimeout(() => {
      openAlertModal();
    }, 600);
  }
});

if (contactForm) {
  contactForm.addEventListener("submit", handleContactSubmit);
}