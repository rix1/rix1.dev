const DATA_URL = "/command-palette.json";
const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
const shortcut = isApple ? "⌘K" : "Ctrl K";

let entries = [];
let currentMatches = [];
let isOpen = false;
let activeIndex = 0;
let loaded = false;

const style = document.createElement("style");
style.textContent = `
  .cmdk-trigger {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 50;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border: 1px solid rgba(219, 39, 119, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.84);
    color: #111827;
    box-shadow: 0 16px 40px rgba(17, 24, 39, 0.12);
    backdrop-filter: blur(12px);
    cursor: pointer;
    padding: 0.42rem 0.55rem 0.42rem 0.72rem;
    font: 700 0.8125rem/1.2 system-ui, sans-serif;
  }

  .cmdk-trigger kbd,
  .cmdk-shortcut {
    border: 1px solid rgba(17, 24, 39, 0.12);
    border-radius: 6px;
    background: white;
    color: #4b5563;
    padding: 0.16rem 0.34rem;
    font: 700 0.75rem/1 system-ui, sans-serif;
  }

  .cmdk {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: start center;
    padding: min(10vh, 5rem) 1rem 1rem;
    background: rgba(17, 24, 39, 0.34);
    backdrop-filter: blur(8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms ease;
  }

  .cmdk[aria-hidden="false"] {
    opacity: 1;
    pointer-events: auto;
  }

  .cmdk-panel {
    width: min(100%, 43rem);
    overflow: hidden;
    border: 1px solid rgba(219, 39, 119, 0.16);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 30px 80px rgba(17, 24, 39, 0.28);
    transform: translateY(-0.45rem) scale(0.985);
    transition: transform 170ms ease;
  }

  .cmdk[aria-hidden="false"] .cmdk-panel {
    transform: translateY(0) scale(1);
  }

  .cmdk-search {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    align-items: center;
    border-bottom: 1px solid rgba(219, 39, 119, 0.12);
    padding: 0.85rem 0.95rem;
  }

  .cmdk-input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #111827;
    font: 600 1rem/1.4 system-ui, sans-serif;
  }

  .cmdk-results {
    max-height: min(28rem, 60vh);
    overflow: auto;
    padding: 0.5rem;
  }

  .cmdk-group + .cmdk-group {
    margin-top: 0.6rem;
  }

  .cmdk-heading {
    padding: 0.4rem 0.55rem 0.25rem;
    color: #db2777;
    font: 800 0.75rem/1.2 system-ui, sans-serif;
  }

  .cmdk-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.8rem;
    align-items: center;
    width: 100%;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: #111827;
    cursor: pointer;
    padding: 0.62rem 0.55rem;
    text-align: left;
  }

  .cmdk-item[aria-selected="true"] {
    background: linear-gradient(90deg, rgba(234, 86, 52, 0.12), rgba(219, 39, 119, 0.1));
  }

  .cmdk-title {
    margin: 0;
    font: 800 0.95rem/1.25 system-ui, sans-serif;
  }

  .cmdk-desc {
    margin: 0.18rem 0 0;
    color: #4b5563;
    font: 500 0.8125rem/1.35 system-ui, sans-serif;
  }

  .cmdk-meta {
    color: #6b7280;
    white-space: nowrap;
    font: 700 0.75rem/1 system-ui, sans-serif;
  }

  .cmdk-empty {
    margin: 0;
    padding: 1.5rem;
    color: #4b5563;
    text-align: center;
    font: 600 0.9rem/1.4 system-ui, sans-serif;
  }

  @media (prefers-reduced-motion: reduce) {
    .cmdk,
    .cmdk-panel {
      transition: none;
    }
  }
`;

document.head.append(style);

const trigger = document.createElement("button");
trigger.type = "button";
trigger.className = "cmdk-trigger";
trigger.innerHTML = `Search <kbd>${shortcut}</kbd>`;
trigger.setAttribute("aria-label", `Search posts and projects (${shortcut})`);

const overlay = document.createElement("div");
overlay.className = "cmdk";
overlay.setAttribute("aria-hidden", "true");
overlay.innerHTML = `
  <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Search">
    <div class="cmdk-search">
      <input class="cmdk-input" type="search" placeholder="Search posts and projects" autocomplete="off" spellcheck="false">
      <span class="cmdk-shortcut">${shortcut}</span>
    </div>
    <div class="cmdk-results" role="listbox"></div>
  </div>
`;

document.body.append(trigger, overlay);
overlay.inert = true;

const input = overlay.querySelector(".cmdk-input");
const results = overlay.querySelector(".cmdk-results");

function normalize(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}

function score(entry, query) {
  if (!query) return 1;

  const haystack = normalize(
    `${entry.title} ${entry.description ?? ""} ${entry.meta ?? ""}`,
  );

  if (normalize(entry.title).startsWith(query)) return 4;
  if (normalize(entry.title).includes(query)) return 3;
  if (haystack.includes(query)) return 2;

  return 0;
}

async function loadEntries() {
  if (loaded) return;

  const response = await fetch(DATA_URL);
  const data = await response.json();

  entries = [
    ...data.posts.map((entry) => ({ ...entry, kind: "post" })),
    ...data.projects.map((entry) => ({ ...entry, kind: "project" })),
  ];
  loaded = true;
}

function getMatches() {
  const query = normalize(input.value);

  return entries
    .map((entry) => ({ ...entry, score: score(entry, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

function grouped(matches) {
  return [
    ["Posts", matches.filter((entry) => entry.category === "Posts")],
    ["Projects", matches.filter((entry) => entry.category === "Projects")],
  ].filter(([, group]) => group.length);
}

function render({ scrollSelected = false } = {}) {
  const matches = getMatches();
  const groups = grouped(matches);
  currentMatches = groups.flatMap(([, group]) => group);
  activeIndex = Math.min(activeIndex, Math.max(currentMatches.length - 1, 0));

  if (!currentMatches.length) {
    results.innerHTML =
      `<p class="cmdk-empty">No matching posts or projects.</p>`;
    return;
  }

  let flatIndex = 0;

  results.innerHTML = groups.map(([category, group]) => {
    const items = group.map((entry) => {
      const index = flatIndex++;
      return `
        <button class="cmdk-item" type="button" role="option" data-index="${index}" aria-selected="${
        index === activeIndex
      }">
          <span>
            <p class="cmdk-title">${escapeHtml(entry.title)}</p>
            <p class="cmdk-desc">${escapeHtml(entry.description)}</p>
          </span>
          <span class="cmdk-meta">${escapeHtml(entry.meta)}</span>
        </button>
      `;
    }).join("");

    return `
      <section class="cmdk-group">
        <div class="cmdk-heading">${escapeHtml(category)}</div>
        ${items}
      </section>
    `;
  }).join("");

  if (scrollSelected) {
    results.querySelector('[aria-selected="true"]')?.scrollIntoView({
      block: "nearest",
    });
  }
}

async function openPalette() {
  await loadEntries();
  isOpen = true;
  activeIndex = 0;
  overlay.inert = false;
  overlay.setAttribute("aria-hidden", "false");
  input.value = "";
  render();
  requestAnimationFrame(() => input.focus());
}

function closePalette() {
  isOpen = false;
  overlay.setAttribute("aria-hidden", "true");
  input.blur();
  overlay.inert = true;
}

function goToActive() {
  const entry = currentMatches[activeIndex];

  if (entry) {
    globalThis.location.href = entry.url;
  }
}

trigger.addEventListener("click", openPalette);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closePalette();
  }
});

results.addEventListener("mousemove", (event) => {
  const item = event.target.closest(".cmdk-item");
  if (!item) return;

  activeIndex = Number(item.dataset.index);
  render();
});

results.addEventListener("click", (event) => {
  const item = event.target.closest(".cmdk-item");
  if (!item) return;

  activeIndex = Number(item.dataset.index);
  goToActive();
});

input.addEventListener("input", () => {
  activeIndex = 0;
  render();
});

document.addEventListener("keydown", (event) => {
  const isShortcut = (event.metaKey || event.ctrlKey) &&
    event.key.toLowerCase() === "k";

  if (isShortcut) {
    event.preventDefault();
    isOpen ? closePalette() : openPalette();
    return;
  }

  if (!isOpen) return;

  if (event.key === "Escape") {
    closePalette();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex = Math.min(
      activeIndex + 1,
      Math.max(currentMatches.length - 1, 0),
    );
    render({ scrollSelected: true });
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    render({ scrollSelected: true });
  } else if (event.key === "Enter") {
    event.preventDefault();
    goToActive();
  }
});
