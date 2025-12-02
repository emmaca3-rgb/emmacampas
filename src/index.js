import { stagger } from "motion";
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
      { duration: 0.8, ease: [0.39, 0.24, 0.3, 1] }
    ),
    animate(".hero", { background: "#EDE7E7" }, { delay: 0.7, duration: 0.7 }),
    animate(
      ".strings span",
      { opacity: 0 },
      { delay: stagger(0.1), ease: [0, 0.71, 0.2, 1.01] }
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
      { delay: 0.4, duration: width < SMALL_VIEWPORT_THRESHOLD ? 0.3 : 0.7 }
    ),
    animate(
      ".image",
      {
        opacity: 1,
      },
      { delay: 1.2, duration: 0.6 }
    ),
    animate(
      ".nav, .navToggler",
      {
        opacity: 1,
      },
      { delay: 1, duration: 0.7 }
    ),
  ]);
}

window.addEventListener("DOMContentLoaded", async () => {
  document
    .querySelector(".navToggler")
    .addEventListener("click", () =>
      document.body.classList.toggle("isNavOpen")
    );

  const nav = document.querySelector(".nav");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > NAV_SCROLL_THRESHOLD);
    document.body.classList.remove("isNavOpen");
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
      (node) => preload(node.href)
    )
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
