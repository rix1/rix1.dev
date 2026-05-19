const sharedStyles = `
  <style>
    lifetime-timeline,
    year-size-explorer,
    relative-time-explorer {
      display: block;
      margin: 2rem 0;
    }

    .time-x {
      --ink: #111827;
      --muted: #4b5563;
      --paper: rgba(255, 255, 255, 0.86);
      --line: rgba(219, 39, 119, 0.14);
      --hot: #db2777;
      --warm: #ea5634;
      --cool: #2563eb;
      color: var(--ink);
      font-size: 0.9375rem;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--paper);
      box-shadow: 0 18px 50px rgba(17, 24, 39, 0.08);
      overflow: hidden;
    }

    .time-x * {
      box-sizing: border-box;
    }

    .time-x button,
    .time-x input,
    .time-x select {
      font: inherit;
    }

    .time-x__head {
      padding: 1rem;
      border-bottom: 1px solid var(--line);
      background:
        linear-gradient(135deg, rgba(234, 86, 52, 0.1), transparent 38%),
        linear-gradient(315deg, rgba(219, 39, 119, 0.1), transparent 42%);
    }

    .time-x__eyebrow {
      margin: 0 0 0.25rem;
      color: var(--hot);
      font-size: 0.8125rem;
      font-weight: 850;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .time-x__title {
      margin: 0;
      font-size: 1.125rem;
      line-height: 1.2;
    }

    .time-x__lede,
    .time-x__note,
    .time-x__summary {
      color: var(--muted);
      line-height: 1.55;
    }

    .time-x__lede {
      margin: 0.55rem 0 0;
      max-width: 40rem;
    }

    .time-x__body {
      display: grid;
      gap: 1rem;
      padding: 1rem;
    }

    .time-x__body--split {
      grid-template-columns: 1fr;
    }

    @media (min-width: 720px) {
      .time-x__body--split {
        grid-template-columns: minmax(15rem, 0.8fr) minmax(0, 1.2fr);
        align-items: start;
      }
    }

    .time-x__controls {
      display: grid;
      gap: 0.85rem;
    }

    .time-x__control {
      display: grid;
      gap: 0.38rem;
    }

    .time-x__label {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      color: var(--muted);
      font-size: 0.8125rem;
      font-weight: 750;
    }

    .time-x__value {
      color: var(--ink);
      font-variant-numeric: tabular-nums;
    }

    .time-x input[type="range"] {
      width: 100%;
      accent-color: var(--hot);
    }

    .time-x select {
      width: 100%;
      border: 1px solid rgba(17, 24, 39, 0.16);
      border-radius: 6px;
      background: white;
      padding: 0.45rem;
    }

    .time-x__timeline {
      position: relative;
      height: 5.5rem;
      margin-top: 0.25rem;
      border-radius: 8px;
      background:
        linear-gradient(90deg, rgba(234, 86, 52, 0.12), rgba(219, 39, 119, 0.08)),
        repeating-linear-gradient(
          90deg,
          rgba(17, 24, 39, 0.08) 0 1px,
          transparent 1px 10%
        ),
        white;
      border: 1px solid rgba(17, 24, 39, 0.12);
      overflow: hidden;
    }

    .time-x__lived,
    .time-x__assumed,
    .time-x__slice {
      position: absolute;
      inset: 0 auto 0 0;
      transition: width 160ms ease, left 160ms ease;
    }

    .time-x__lived {
      background: linear-gradient(90deg, var(--warm), var(--hot));
    }

    .time-x__assumed {
      background: rgba(37, 99, 235, 0.1);
      border-left: 2px dashed rgba(37, 99, 235, 0.55);
    }

    .time-x__marker {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--ink);
      transition: left 160ms ease;
    }

    .time-x__marker span {
      position: absolute;
      top: 0.5rem;
      left: 0.45rem;
      white-space: nowrap;
      border-radius: 999px;
      background: white;
      padding: 0.18rem 0.5rem;
      color: var(--ink);
      font-size: 0.8125rem;
      font-weight: 800;
      box-shadow: 0 4px 20px rgba(17, 24, 39, 0.12);
    }

    .time-x__readout {
      display: grid;
      gap: 0.55rem;
    }

    .time-x__big {
      margin: 0;
      color: var(--hot);
      font-size: 2.25rem;
      font-weight: 900;
      letter-spacing: 0;
      line-height: 0.96;
      font-variant-numeric: tabular-nums;
    }

    .time-x__summary,
    .time-x__note {
      margin: 0;
    }

    .time-x__bars {
      display: grid;
      gap: 0.72rem;
    }

    .time-x__bar-label {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      color: var(--muted);
      font-size: 0.8125rem;
      font-weight: 800;
    }

    .time-x__track {
      position: relative;
      height: 1.75rem;
      border: 1px solid rgba(17, 24, 39, 0.12);
      border-radius: 999px;
      background:
        repeating-linear-gradient(
          90deg,
          rgba(17, 24, 39, 0.06) 0 1px,
          transparent 1px 10%
        ),
        white;
      overflow: hidden;
    }

    .time-x__slice {
      border-radius: 999px;
      background: linear-gradient(90deg, var(--warm), var(--hot));
    }

    .time-x__slice--cool {
      background: linear-gradient(90deg, var(--cool), var(--hot));
    }

    .time-x__presets {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.45rem;
    }

    .time-x__preset,
    .time-x__swap {
      border: 1px solid rgba(219, 39, 119, 0.16);
      border-radius: 999px;
      background: white;
      color: var(--ink);
      cursor: pointer;
      padding: 0.46rem 0.65rem;
      font-size: 0.8125rem;
      font-weight: 780;
    }

    .time-x__preset[aria-pressed="true"] {
      background: linear-gradient(90deg, var(--warm), var(--hot));
      color: white;
      border-color: transparent;
    }

    .time-x__duration {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 7rem;
      gap: 0.55rem;
      align-items: center;
    }

    .time-x__spark {
      display: grid;
      grid-template-columns: repeat(28, minmax(0, 1fr));
      gap: 0.18rem;
    }

    .time-x__spark span {
      height: 0.44rem;
      border-radius: 999px;
      background: rgba(17, 24, 39, 0.1);
      transform: scaleY(0.55);
      transform-origin: bottom;
    }

    .time-x__spark span.is-hot {
      background: linear-gradient(180deg, var(--warm), var(--hot));
      transform: scaleY(1);
    }
  </style>
`;

const unitsToYears = {
  hours: 1 / (24 * 365),
  days: 1 / 365,
  weeks: 7 / 365,
  years: 1,
};

const presets = {
  trip: { youngMonths: 10, oldMonths: 456, duration: 3, unit: "hours" },
  summer: { youngAge: 8, oldAge: 38, duration: 8, unit: "weeks" },
  wait: { youngMonths: 10, oldMonths: 456, duration: 1, unit: "days" },
  year: { youngAge: 10, oldAge: 40, duration: 1, unit: "years" },
};

const numberFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
});

const percentFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
  style: "percent",
});

function html(strings, ...values) {
  return strings.reduce((result, string, index) => {
    return result + string + (values[index] ?? "");
  }, "");
}

function formatNumber(value) {
  return numberFormat.format(value);
}

function pluralize(value, unit) {
  const singular = unit.replace(/s$/, "");
  return `${formatNumber(value)} ${value === 1 ? singular : unit}`;
}

function monthsToYears(months) {
  return months / 12;
}

function yearsToMonths(years) {
  return Math.round(years * 12);
}

function getPresetMonths(preset, ageKey, monthsKey) {
  return preset[monthsKey] ?? yearsToMonths(preset[ageKey]);
}

function formatAgeFromMonths(months) {
  if (months < 24) {
    return `${months} mo`;
  }

  const years = Math.floor(months / 12);
  const rest = months % 12;

  if (!rest) {
    return `${years}`;
  }

  return `${years}y ${rest}m`;
}

function formatAgeSentence(months) {
  if (months < 12) {
    return `${months} months old`;
  }

  const years = Math.floor(months / 12);
  const rest = months % 12;

  if (!rest) {
    return `${years} years old`;
  }

  return `${years} years and ${rest} months old`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function mount(element, markup) {
  const template = document.createElement("template");
  template.innerHTML = sharedStyles + markup;
  element.replaceChildren(template.content.cloneNode(true));
}

class LifetimeTimeline extends HTMLElement {
  connectedCallback() {
    mount(
      this,
      html`
        <section class="time-x" aria-labelledby="timeline-title">
          <div class="time-x__head">
            <p class="time-x__eyebrow">Mental model</p>
            <h2 class="time-x__title" id="timeline-title">A life as a line</h2>
            <p class="time-x__lede">This is the familiar picture: birth behind you, a projected end somewhere ahead, and now moving along the line.</p>
          </div>
          <div class="time-x__body">
            <div class="time-x__controls">
              <label class="time-x__control">
                <span class="time-x__label">Age now <strong class="time-x__value" data-value="age"></strong></span>
                <input name="age" type="range" min="1" max="95" value="38">
              </label>
              <label class="time-x__control">
                <span class="time-x__label">Assumed lifespan <strong class="time-x__value" data-value="lifespan"></strong></span>
                <input name="lifespan" type="range" min="40" max="110" value="85">
              </label>
            </div>
            <div class="time-x__timeline">
              <span class="time-x__lived" data-output="lived"></span>
              <span class="time-x__assumed" data-output="assumed"></span>
              <span class="time-x__marker" data-output="now"><span>now</span></span>
            </div>
            <p class="time-x__summary" data-output="summary"></p>
          </div>
        </section>
      `,
    );

    this.age = this.querySelector("[name='age']");
    this.lifespan = this.querySelector("[name='lifespan']");
    this.values = {
      age: this.querySelector("[data-value='age']"),
      lifespan: this.querySelector("[data-value='lifespan']"),
    };
    this.outputs = {
      lived: this.querySelector("[data-output='lived']"),
      assumed: this.querySelector("[data-output='assumed']"),
      now: this.querySelector("[data-output='now']"),
      summary: this.querySelector("[data-output='summary']"),
    };

    this.addEventListener("input", () => this.render());
    this.render();
  }

  render() {
    const age = Number(this.age.value);
    const lifespan = Math.max(Number(this.lifespan.value), age + 1);
    const lived = clamp((age / lifespan) * 100, 0, 100);

    if (Number(this.lifespan.value) !== lifespan) {
      this.lifespan.value = String(lifespan);
    }

    this.values.age.textContent = `${age}`;
    this.values.lifespan.textContent = `${lifespan}`;
    this.outputs.lived.style.width = `${lived}%`;
    this.outputs.assumed.style.left = `${lived}%`;
    this.outputs.assumed.style.width = `${100 - lived}%`;
    this.outputs.now.style.left = `${lived}%`;
    this.outputs.summary.textContent =
      `The line says ${formatNumber(lived)}% lived and ${formatNumber(100 - lived)}% still ahead. Useful, but also a trick: the blue part is an assumption, not an experience.`;
  }
}

class YearSizeExplorer extends HTMLElement {
  connectedCallback() {
    mount(
      this,
      html`
        <section class="time-x" aria-labelledby="year-size-title">
          <div class="time-x__head">
            <p class="time-x__eyebrow">Shrinking years</p>
            <h2 class="time-x__title" id="year-size-title">A year gets smaller as the denominator grows</h2>
            <p class="time-x__lede">Drag the age. The year itself is constant, but its share of remembered life keeps changing.</p>
          </div>
          <div class="time-x__body time-x__body--split">
            <label class="time-x__control">
              <span class="time-x__label">Age <strong class="time-x__value" data-value="age"></strong></span>
              <input name="ageMonths" type="range" min="1" max="1080" value="10">
            </label>
            <div class="time-x__readout">
              <p class="time-x__big" data-output="percent"></p>
              <p class="time-x__summary" data-output="summary"></p>
              <div class="time-x__spark" aria-hidden="true"></div>
            </div>
          </div>
        </section>
      `,
    );

    this.age = this.querySelector("[name='ageMonths']");
    this.value = this.querySelector("[data-value='age']");
    this.percent = this.querySelector("[data-output='percent']");
    this.summary = this.querySelector("[data-output='summary']");
    this.spark = this.querySelector(".time-x__spark");
    this.spark.replaceChildren(
      ...Array.from({ length: 28 }, () => document.createElement("span")),
    );

    this.addEventListener("input", () => this.render());
    this.render();
  }

  render() {
    const ageMonths = Number(this.age.value);
    const ageYears = monthsToYears(ageMonths);
    const share = 1 / ageYears;
    const comparedToAdult = 38 / ageYears;
    const activeCells = clamp(Math.round(share * 28), 1, 28);

    this.value.textContent = formatAgeFromMonths(ageMonths);
    this.percent.textContent = percentFormat.format(share);
    this.summary.textContent =
      `At ${formatAgeSentence(ageMonths)}, one year is ${percentFormat.format(share)} of lived life. Compared with a 38-year-old, that same year is about ${formatNumber(comparedToAdult)}x as large.`;

    [...this.spark.children].forEach((cell, index) => {
      cell.classList.toggle("is-hot", index < activeCells);
    });
  }
}

class RelativeTimeExplorer extends HTMLElement {
  connectedCallback() {
    mount(
      this,
      html`
        <section class="time-x" aria-labelledby="relative-title">
          <div class="time-x__head">
            <p class="time-x__eyebrow">Relative translation</p>
            <h2 class="time-x__title" id="relative-title">How big is the same wait?</h2>
            <p class="time-x__lede">Pick a situation. The bars show the same duration as a magnified slice of each person's lived time.</p>
          </div>
          <div class="time-x__body time-x__body--split">
            <form class="time-x__controls">
              <div class="time-x__presets" aria-label="Example situations">
                <button class="time-x__preset" type="button" data-preset="trip">Road trip</button>
                <button class="time-x__preset" type="button" data-preset="summer">Summer</button>
                <button class="time-x__preset" type="button" data-preset="wait">Waiting</button>
                <button class="time-x__preset" type="button" data-preset="year">One year</button>
              </div>
              <label class="time-x__control">
                <span class="time-x__label">Younger person <strong class="time-x__value" data-value="youngAge"></strong></span>
                <input name="youngMonths" type="range" min="1" max="360" value="10">
              </label>
              <label class="time-x__control">
                <span class="time-x__label">Older person <strong class="time-x__value" data-value="oldAge"></strong></span>
                <input name="oldMonths" type="range" min="240" max="1080" value="456">
              </label>
              <label class="time-x__control">
                <span class="time-x__label">Shared clock time <strong class="time-x__value" data-value="duration"></strong></span>
                <span class="time-x__duration">
                  <input name="duration" type="range" min="1" max="120" value="3">
                  <select name="unit">
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="years">years</option>
                  </select>
                </span>
              </label>
            </form>

            <div class="time-x__readout">
              <p class="time-x__big" data-output="equivalent"></p>
              <p class="time-x__summary" data-output="summary"></p>
              <button class="time-x__swap" type="button" data-action="swap"></button>
              <div class="time-x__bars">
                <div>
                  <div class="time-x__bar-label">
                    <span data-output="youngLabel"></span>
                    <span data-output="youngFraction"></span>
                  </div>
                  <div class="time-x__track">
                    <span class="time-x__slice" data-output="youngBar"></span>
                  </div>
                </div>
                <div>
                  <div class="time-x__bar-label">
                    <span data-output="oldLabel"></span>
                    <span data-output="oldFraction"></span>
                  </div>
                  <div class="time-x__track">
                    <span class="time-x__slice time-x__slice--cool" data-output="oldBar"></span>
                  </div>
                </div>
              </div>
              <p class="time-x__note" data-output="note"></p>
            </div>
          </div>
        </section>
      `,
    );

    this.form = this.querySelector("form");
    this.direction = "young-to-old";
    this.outputs = Object.fromEntries(
      [...this.querySelectorAll("[data-output]")].map((node) => [
        node.dataset.output,
        node,
      ]),
    );
    this.values = Object.fromEntries(
      [...this.querySelectorAll("[data-value]")].map((node) => [
        node.dataset.value,
        node,
      ]),
    );
    this.presetButtons = [...this.querySelectorAll("[data-preset]")];

    this.form.addEventListener("input", () => {
      this.markPreset();
      this.render();
    });
    this.querySelector("[data-action='swap']").addEventListener("click", () => {
      this.direction = this.direction === "young-to-old"
        ? "old-to-young"
        : "young-to-old";
      this.render();
    });

    for (const button of this.presetButtons) {
      button.addEventListener("click", () => this.applyPreset(button.dataset.preset));
    }

    this.applyPreset("trip");
  }

  applyPreset(name) {
    const preset = presets[name];
    this.form.elements.youngMonths.value = getPresetMonths(
      preset,
      "youngAge",
      "youngMonths",
    );
    this.form.elements.oldMonths.value = getPresetMonths(
      preset,
      "oldAge",
      "oldMonths",
    );
    this.form.elements.duration.value = preset.duration;
    this.form.elements.unit.value = preset.unit;
    this.markPreset(name);
    this.render();
  }

  getState() {
    return {
      youngMonths: Number(this.form.elements.youngMonths.value),
      oldMonths: Number(this.form.elements.oldMonths.value),
      duration: Number(this.form.elements.duration.value),
      unit: this.form.elements.unit.value,
    };
  }

  markPreset(activeName = null) {
    const current = this.getState();
    for (const button of this.presetButtons) {
      const preset = presets[button.dataset.preset];
      const isActive = activeName
        ? button.dataset.preset === activeName
        : getPresetMonths(preset, "youngAge", "youngMonths") ===
            current.youngMonths &&
          getPresetMonths(preset, "oldAge", "oldMonths") ===
            current.oldMonths &&
          preset.duration === current.duration &&
          preset.unit === current.unit;
      button.setAttribute("aria-pressed", String(isActive));
    }
  }

  render() {
    const { youngMonths, oldMonths, duration, unit } = this.getState();
    const youngAge = monthsToYears(youngMonths);
    const oldAge = monthsToYears(oldMonths);
    const youngLabel = formatAgeSentence(youngMonths);
    const oldLabel = formatAgeSentence(oldMonths);
    const durationInYears = duration * unitsToYears[unit];
    const youngFraction = durationInYears / youngAge;
    const oldFraction = durationInYears / oldAge;
    const youngEquivalent = duration * (oldAge / youngAge);
    const oldEquivalent = duration * (youngAge / oldAge);
    const translatingYoung = this.direction === "young-to-old";
    const equivalent = translatingYoung ? youngEquivalent : oldEquivalent;
    const fromAge = translatingYoung ? youngLabel : oldLabel;
    const toAge = translatingYoung ? oldLabel : youngLabel;
    const reverseLabel = translatingYoung ? "older to younger" : "younger to older";
    const ratio = oldAge / youngAge;

    this.values.youngAge.textContent = formatAgeFromMonths(youngMonths);
    this.values.oldAge.textContent = formatAgeFromMonths(oldMonths);
    this.values.duration.textContent = pluralize(duration, unit);
    this.outputs.equivalent.textContent = pluralize(equivalent, unit);
    this.outputs.summary.textContent =
      `For someone ${fromAge}, ${pluralize(duration, unit)} occupies the same share of life as ${pluralize(equivalent, unit)} does for someone ${toAge}.`;
    this.outputs.swap.textContent = `Translate ${reverseLabel}`;
    this.outputs.youngLabel.textContent = formatAgeSentence(youngMonths);
    this.outputs.oldLabel.textContent = formatAgeSentence(oldMonths);
    this.outputs.youngFraction.textContent = percentFormat.format(youngFraction);
    this.outputs.oldFraction.textContent = percentFormat.format(oldFraction);
    this.outputs.note.textContent =
      `The bars are magnified so small slices are visible. The younger slice is ${formatNumber(ratio)}x larger than the older slice.`;

    const magnifier = 1800;
    this.outputs.youngBar.style.width = `${
      clamp(youngFraction * magnifier * 100, 0.8, 100)
    }%`;
    this.outputs.oldBar.style.width = `${
      clamp(oldFraction * magnifier * 100, 0.8, 100)
    }%`;
  }
}

customElements.define("lifetime-timeline", LifetimeTimeline);
customElements.define("year-size-explorer", YearSizeExplorer);
customElements.define("relative-time-explorer", RelativeTimeExplorer);
