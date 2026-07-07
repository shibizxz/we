// Mobile navigation
const topbar = document.querySelector(".topbar");
const navToggle = document.querySelector(".nav-toggle");

if (navToggle && topbar) {
  navToggle.addEventListener("click", () => {
    const open = topbar.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      topbar.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Header border on scroll
if (topbar) {
  const onScroll = () => topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReduced && "IntersectionObserver" in window && reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

// Mobile auto-sliders
const mobileSliderSelector = ".grid-2, .grid-3, .steps, .steps-vertical, .pricing-grid, .work-grid, .domain-strip, .contact-methods";
const mobileSliders = document.querySelectorAll(mobileSliderSelector);
const mobileSliderMedia = window.matchMedia("(max-width: 620px)");
const mobileSliderTimers = new WeakMap();
const mobileSliderListeners = new WeakSet();

const startMobileSlider = (slider) => {
  if (mobileSliderTimers.has(slider)) return;

  const slides = Array.from(slider.children);
  if (slides.length < 2) return;

  let pausedUntil = 0;

  const centerSlide = (slide) => {
    const left = slide.offsetLeft - (slider.clientWidth - slide.clientWidth) / 2;
    slider.scrollTo({ left, behavior: "smooth" });
  };

  const getCurrentIndex = () => {
    const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;

    return slides.reduce((closestIndex, slide, slideIndex) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const closestCenter = slides[closestIndex].offsetLeft + slides[closestIndex].clientWidth / 2;

      return Math.abs(slideCenter - sliderCenter) < Math.abs(closestCenter - sliderCenter)
        ? slideIndex
        : closestIndex;
    }, 0);
  };

  if (!mobileSliderListeners.has(slider)) {
    const pause = () => {
      pausedUntil = Date.now() + 5000;
    };

    slider.addEventListener("pointerdown", pause, { passive: true });
    slider.addEventListener("touchstart", pause, { passive: true });
    slider.addEventListener("wheel", pause, { passive: true });
    mobileSliderListeners.add(slider);
  }

  centerSlide(slides[getCurrentIndex()]);

  const timer = window.setInterval(() => {
    if (Date.now() < pausedUntil) return;

    const nextIndex = (getCurrentIndex() + 1) % slides.length;
    centerSlide(slides[nextIndex]);
  }, 2800);

  mobileSliderTimers.set(slider, timer);
};

const stopMobileSlider = (slider) => {
  const timer = mobileSliderTimers.get(slider);
  if (!timer) return;

  window.clearInterval(timer);
  mobileSliderTimers.delete(slider);
};

const syncMobileSliders = () => {
  mobileSliders.forEach((slider) => {
    if (!prefersReduced && mobileSliderMedia.matches) {
      startMobileSlider(slider);
    } else {
      stopMobileSlider(slider);
    }
  });
};

syncMobileSliders();

if (mobileSliderMedia.addEventListener) {
  mobileSliderMedia.addEventListener("change", syncMobileSliders);
} else {
  mobileSliderMedia.addListener(syncMobileSliders);
}

// Contact form opens WhatsApp with a prefilled message
const projectForm = document.querySelector("#project-form");

if (projectForm) {
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(projectForm);
    const name = (data.get("name") || "").toString().trim();
    const business = (data.get("business") || "").toString().trim();
    const details = (data.get("details") || "").toString().trim();

    let message = `Hi WEBAPPZZ TECHNOLOGIES, I'm ${name}`;
    if (business) message += ` from ${business}`;
    message += `. ${details}`;

    window.open(
      `https://wa.me/918089872334?text=${encodeURIComponent(message)}`,
      "_blank",
      "noreferrer"
    );
  });
}
