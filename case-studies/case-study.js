const body = document.body;
const toggle = document.querySelector("[data-theme-toggle]");
const primaryNav = document.querySelector("nav");
const sidebar = document.querySelector(".left");
const savedTheme = localStorage.getItem("theme");

const responsiveThemePlacement = window.matchMedia("(max-width: 760px)");

function placeThemeToggle({ matches }) {
  if (!toggle || !primaryNav || !sidebar) return;
  (matches ? primaryNav : sidebar).append(toggle);
}

placeThemeToggle(responsiveThemePlacement);
responsiveThemePlacement.addEventListener("change", placeThemeToggle);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) window.location.reload();
});

const scrollPanel = document.querySelector(".right");

window.addEventListener(
  "wheel",
  (event) => {
    if (
      window.innerWidth <= 760 ||
      !scrollPanel ||
      event.target.closest(".right")
    )
      return;
    scrollPanel.scrollTop += event.deltaY;
  },
  { passive: true },
);

if (savedTheme === "light") {
  body.classList.add("light");
}

if (toggle) {
  toggle.addEventListener("click", () => {
    body.classList.toggle("light");
    localStorage.setItem(
      "theme",
      body.classList.contains("light") ? "light" : "dark",
    );
  });
}

const nextProjectPreviews = {
  "/case-studies/events-os/": {
    image: "/public/case-studies/events-os/actual/dashboard.jpg",
    alt: "Events OS preview",
    category: "Product design · 2024 – Present",
    name: "Events OS",
    description:
      "A planning deck for hotels and venues, bringing layout, RSVP, menus, sequencing, and team collaboration into one shared system.",
  },
  "/case-studies/proofpage/": {
    image: "/public/case-studies/proofpage/actual/hero.jpg",
    alt: "ProofPage preview",
    category: "Marketplace UX · Trust and safety",
    name: "ProofPage",
    description:
      "A marketplace trust experience designed to help buyers assess vendor credibility, verification, and protection.",
  },
  "/case-studies/klone/": {
    image: "/public/case-studies/klone/actual/customer-hero.jpg",
    alt: "Klone preview",
    category: "Brand and product · Web and mobile",
    name: "Klone",
    description:
      "A brand and product experience with a stronger visual system.",
  },
  "/case-studies/copylint/": {
    image: "/public/case-studies/copylint/actual/found-issues.jpg",
    alt: "CopyLint preview",
    category: "Figma plugin · AI-assisted copy QA",
    name: "CopyLint",
    description: "An AI-assisted copy review tool for Figma.",
  },
  "/case-studies/design-engineering-lab/": {
    image: "/public/case-studies/design-engineering-lab/music-player.png",
    alt: "Design engineering lab preview",
    category: "Design engineering · Interactive experiments",
    name: "Design engineering lab",
    description: "Games, interaction experiments, and coded prototypes.",
  },
};

const nextProject = document.querySelector(".next-project");

if (nextProject) {
  const targetPath = new URL(nextProject.href).pathname;
  const preview = nextProjectPreviews[targetPath];

  if (preview) {
    nextProject.classList.add("next-preview");
    nextProject.innerHTML = `
      <img src="${preview.image}" alt="${preview.alt}">
      <div>
        <span>${preview.category}</span>
        <strong>${preview.name}</strong>
        <p>${preview.description}</p>
      </div>
    `;
  }
}

document.querySelectorAll("img[data-src]").forEach((image) => {
  const target = image.dataset.src;

  fetch(target, { method: "HEAD" })
    .then((response) => {
      if (response.ok) {
        image.src = target;
      } else {
        image.classList.add("is-missing");
      }
    })
    .catch(() => image.classList.add("is-missing"));
});

document.querySelectorAll("img[src]").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("is-missing");
  });
});

const liveExperiences = {
  "https://github.com/kemsdesigns/crane-flight":
    "https://kemsdesigns.github.io/crane-flight/",
  "https://github.com/kemsdesigns/mood-drum": "https://mood-drum.vercel.app",
  "https://github.com/kemsdesigns/music-player":
    "https://music-player-khaki-nu-87.vercel.app",
  "https://github.com/kemsdesigns/whack-a-mole":
    "https://whack-a-mole-bay.vercel.app",
  "https://github.com/kemsdesigns/typerift": "https://typerift-six.vercel.app",
};

document.querySelectorAll("a.source-link").forEach((sourceLink) => {
  if (sourceLink.href === "https://github.com/kemsdesigns/music-player") {
    sourceLink.remove();
    return;
  }
  const liveUrl = liveExperiences[sourceLink.href];
  if (!liveUrl) return;
  const liveLink = document.createElement("a");
  liveLink.className = "live-link";
  liveLink.href = liveUrl;
  liveLink.target = "_blank";
  liveLink.rel = "noreferrer";
  liveLink.textContent = "Play live →";
  sourceLink.textContent = "View source →";
  sourceLink.before(liveLink);
});

if (window.location.pathname.includes("design-engineering-lab")) {
  const moodLabel = [...document.querySelectorAll(".story-label")].find(
    (label) => label.textContent.trim() === "Mood Drum",
  );
  const moodSection = moodLabel?.closest(".story-section");

  if (moodSection && !document.body.innerText.includes("Iso Keys")) {
    const isoMedia = document.createElement("figure");
    isoMedia.className = "story-media";
    isoMedia.innerHTML =
      '<video autoplay muted loop playsinline preload="metadata"><source src="https://res.cloudinary.com/dgyadttyg/video/upload/f_auto,q_auto/v1777741567/isokeys_yvuohv.mp4" type="video/mp4"></video><figcaption>Iso Keys</figcaption>';
    const isoSection = document.createElement("section");
    isoSection.className = "story-section";
    isoSection.innerHTML =
      '<p class="story-label">Iso Keys</p><h2>Music interaction with a deliberately simple surface.</h2><p>Iso Keys explores how much character can come from a small interaction model. The work is in the response: the layout, the visual rhythm, and the relationship between a press and a sound.</p>';
    moodSection.after(isoMedia, isoSection);
  }
}

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}
