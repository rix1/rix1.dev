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

    counter.textContent = `${formatter.format(humans)} humans / ${
      formatter.format(bots)
    } crawlers`;
    counter.setAttribute("aria-label", "Open visitor status");
    counter.removeAttribute("hidden");
  } catch {
    counter.setAttribute("hidden", "");
  }
}

updateVisitorCounter();
