const formatter = new Intl.NumberFormat("en");

async function updateVisitorCounter() {
  const counter = document.querySelector("[data-visitor-counter]");

  if (!counter) {
    return;
  }

  try {
    const params = new URLSearchParams({ path: window.location.pathname });
    const response = await fetch(`/api/visitor-count?${params}`, {
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      return;
    }

    const counts = await response.json();
    const humans = Number(counts.humans ?? 0);
    const bots = Number(counts.bots ?? 0);
    const hits = Number(counts.hits ?? humans + bots);

    const plural = (count, noun) =>
      `${formatter.format(count)} ${noun}${count === 1 ? "" : "s"}`;

    counter.textContent = `${plural(hits, "page hit")} (${
      plural(humans, "human")
    }, ${plural(bots, "bot")})`;
    counter.setAttribute("aria-label", "Open site status");
    counter.removeAttribute("hidden");
  } catch {
    counter.setAttribute("hidden", "");
  }
}

updateVisitorCounter();
