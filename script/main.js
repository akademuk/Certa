document.addEventListener("DOMContentLoaded", () => {
  initOrderAccordion();
  initClientLogosSwiper();
  initCountersAnimation();
  initFooterAccordion();
  initBurgerMenu();
  initSidebarAccordion();
});

/**
 * Инициализирует аккордеон в разделе заказа.
 * Работает только если на странице есть элементы .order__accordion-item.
 */
function initOrderAccordion() {
  const items = document.querySelectorAll(".order__accordion-item");
  if (!items.length) return;

  items.forEach((item, index) => {
    const header = item.querySelector(".order__accordion-header");
    if (!header) return;

    if (index === 0) item.classList.add("active");

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      items.forEach((i) => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
}

/**
 * Клонирует слайды с логотипами клиентов и инициализирует Swiper-карусель.
 * Работает только если на странице есть контейнер .client-logos-swiper-wrapper.
 */
function initClientLogosSwiper() {
  const wrapper = document.querySelector(".client-logos-swiper-wrapper");
  if (!wrapper) return;

  const originalSlides = Array.from(wrapper.children);
  const neededClones = 10;
  for (let i = 0; i < neededClones; i++) {
    const slide = originalSlides[i % originalSlides.length].cloneNode(true);
    wrapper.appendChild(slide);
  }

  /* global Swiper */
  new Swiper(".client-logos-swiper", {
    loop: true,
    speed: 5000,
    slidesPerView: "auto",
    spaceBetween: 30,
    autoplay: { delay: 0, disableOnInteraction: false },
    allowTouchMove: false,
  });
}

/**
 * Анимирует счётчики при появлении в зоне видимости.
 * Работает только если на странице есть элементы .js-counter.
 */
function initCountersAnimation() {
  const counters = document.querySelectorAll(".js-counter");
  if (!counters.length) return;

  const animate = (counter) => {
    const target = +counter.dataset.target || 0;
    const suffix = counter.dataset.suffix || "";
    const duration = +counter.dataset.duration || 2000;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      counter.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/**
 * Инициализирует аккордеон в футере.
 * Работает только если на странице есть кнопки .footer__accordion-button.
 */
function initFooterAccordion() {
  const buttons = document.querySelectorAll(".footer__accordion-button");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const collapse = button.parentElement.querySelector(".footer-select-sub");
      const isActive = collapse && collapse.classList.contains("active");

      buttons.forEach((btn) => {
        btn.classList.remove("active");
        const sub = btn.parentElement.querySelector(".footer-select-sub");
        if (sub) sub.classList.remove("active");
      });

      if (!isActive && collapse) {
        collapse.classList.add("active");
        button.classList.add("active");
      }
    });
  });
}

/**
 * Управление бургер-меню.
 * Работает только если на странице есть .header__burger, .mobile-menu и .overlay.
 */
function initBurgerMenu() {
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".overlay");
  const header = document.querySelector(".header");
  if (!burger || !menu || !overlay || !header) return;

  const toggleMenu = () => {
    const isOpen = burger.classList.toggle("active");
    menu.classList.toggle("active", isOpen);
    overlay.classList.toggle("active", isOpen);
    document.body.classList.toggle("body-lock", isOpen);
    header.classList.toggle("scrolled", isOpen);
    if (!isOpen) {
      document
        .querySelectorAll(".header__submenu.active, .menu-item.active")
        .forEach((el) => el.classList.remove("active"));
    }
  };

  burger.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);

  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const parentItem = link.closest(".menu-item-has-children");
    const submenu = link.nextElementSibling;
    const isHeaderSubmenu =
      submenu && submenu.classList.contains("header__submenu");
    if (isHeaderSubmenu && parentItem) {
      event.preventDefault();
      parentItem.classList.toggle("active");
      submenu.classList.toggle("active");
    } else {
      if (burger.classList.contains("active")) toggleMenu();
    }
  });
}

function initDeferredVideoPlayback() {
  const videos = document.querySelectorAll("video");
  if (!videos.length) return;

  const firstVideo = videos[0];
  firstVideo.preload = "auto";
  firstVideo.muted = true;
  firstVideo.playsInline = true;
  firstVideo.setAttribute("playsinline", "");
  firstVideo.setAttribute("webkit-playsinline", "");
  firstVideo.load();
  firstVideo
    .play()
    .catch((err) =>
      console.warn("Не удалось запустить первый видео-слайд:", err)
    );

  const deferred = Array.from(videos).slice(1);
  deferred.forEach((video) => {
    video.preload = "none";
  });

  window.addEventListener("load", () => {
    deferred.forEach((video) => {
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.load();
      video.play().catch((err) => console.warn("Video playback failed:", err));
    });
  });
}

function initSidebarAccordion() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  const items = sidebar.querySelectorAll(".sidebar__item");
  if (!items.length) return;

  items.forEach((item) => {
    const header = item.querySelector(".sidebar__header");
    const content = item.querySelector(".sidebar__content");
    if (!header || !content) return;

    const hasSubmenu =
      content.children.length > 0 && content.textContent.trim() !== "";

    if (!hasSubmenu) {
      header.classList.add("sidebar__header--disabled");
      return;
    }

    header.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}


  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
      });
    });
  });
