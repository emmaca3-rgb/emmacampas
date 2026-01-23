import { stagger, inView } from "motion";
import { animate } from "motion/mini";

const NAV_SCROLL_THRESHOLD = 150;
const INITIAL_DELAY = 500;
const SMALL_VIEWPORT_THRESHOLD = 820;

async function animateHero() {
  const { innerWidth: width } = window;
  await Promise.all([
    animate(
      ".soundhole",
      { width: 0, opacity: 0, rotate: "90deg" },
      { duration: 0.8, ease: [0.39, 0.24, 0.3, 1] },
    ),
    animate(".hero", { background: "#EDE7E7" }, { delay: 0.7, duration: 0.7 }),
    animate(
      ".strings span",
      { opacity: 0 },
      { delay: stagger(0.1), ease: [0, 0.71, 0.2, 1.01] },
    ),
    animate(
      ".bridge",
      width < SMALL_VIEWPORT_THRESHOLD
        ? {
            width: "100%",
          }
        : {
            scale: 1.2,
            left: "85vw",
          },
      { delay: 0.4, duration: width < SMALL_VIEWPORT_THRESHOLD ? 0.3 : 0.7 },
    ),
    animate(
      ".image",
      {
        opacity: 1,
      },
      { delay: 1.2, duration: 0.6 },
    ),
    animate(
      ".nav, .navToggler",
      {
        opacity: 1,
      },
      { delay: 1, duration: 0.7 },
    ),
  ]);
}

window.addEventListener("DOMContentLoaded", async () => {
  loadCover();
  setupAnimations();
  setupLightbox();
  const navToggler = document.querySelector(".navToggler");
  navToggler.addEventListener("click", () =>
    document.body.classList.toggle("isNavOpen"),
  );

  const nav = document.querySelector(".nav");
  const coverImage = document.querySelector(".cover .image");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > NAV_SCROLL_THRESHOLD);
    document.body.classList.remove("isNavOpen");
    if (!coverImage) {
      return;
    }

    document.body.classList.toggle(
      "isBelowFold",
      window.scrollY >
        coverImage.getBoundingClientRect().height -
          navToggler.getBoundingClientRect().height,
    );
  });

  if (!document.querySelector(".hero")) {
    animate(".nav, .navToggler", {
      opacity: 1,
    });
    return;
  }

  document.body.classList.add("loading");

  await wait(INITIAL_DELAY);
  await Promise.allSettled(
    [...document.querySelectorAll('link[rel="preload"][as="image"]')].map(
      (node) => preload(node.href),
    ),
  );
  await animateHero();

  document.body.classList.remove("loading");
  document.body.classList.add("loaded");
});

function preload(imgSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = imgSrc;
  });
}

const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

function setupAnimations() {
  inView("[data-animate-in] > *", (element) => {
    const index = [...element.parentElement.children].indexOf(element);
    const animation = animate(
      element,
      {
        opacity: 1,
        translate: 0,
      },
      {
        opacity: {
          duration: 0.5,
          delay: 0.1 * Math.min(index + 1, 3),
        },
        translate: {
          duration: 0.5,
          delay: 0.1 * Math.min(index + 1, 3),
        },
      },
    );
    return () => animation.stop();
  });
}

async function loadCover() {
  const coverLink = document.querySelector("link[data-cover]");
  if (!coverLink) {
    return;
  }
  await preload(coverLink.href);
  const cover = document.querySelector(".cover");

  cover.querySelector(".image").style.backgroundImage =
    `url(${coverLink.href})`;

  cover.classList.toggle("loaded");
}

function setupLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const content = lightbox?.querySelector(".lightbox-content");
  const closeButton = lightbox?.querySelector(".lightbox-close");

  if (!lightbox) {
    console.warn("No lightbox element found.");
    return;
  }

  function closeLightbox() {
    lightbox.classList.remove("visible", "ready");
    content.innerHTML = "";
    document.removeEventListener("keydown", onKeyDown);
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target.classList.contains("lightbox")) {
      closeLightbox();
    }
  });

  closeButton.addEventListener("click", closeLightbox);

  document.querySelectorAll("[data-preview]").forEach((el) => {
    el.addEventListener("click", () => {
      document.addEventListener("keydown", onKeyDown);
      lightbox.classList.toggle("visible");
      if (el.dataset.preview === "video") {
        content.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${el.dataset.id}"
            title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
          </iframe>
        `;
      } else if (el.dataset.preview === "image") {
        content.innerHTML = `
          <img src="${el.dataset.src}"/>
        `;
      }
      setTimeout(() => lightbox.classList.toggle("ready"), 500);
    });
  });

  function onKeyDown(event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  }
}
