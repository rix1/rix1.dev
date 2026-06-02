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
      --muted: #6b7280;
      --subtle: #9ca3af;
      --paper: #ffffff;
      --line: rgba(17, 24, 39, 0.1);
      --line-strong: rgba(17, 24, 39, 0.16);
      --accent: #111827;
      --dot-empty: rgba(17, 24, 39, 0.08);
      --dot-lived: rgba(17, 24, 39, 0.72);
      color: var(--ink);
      font-size: 0.9375rem;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--paper);
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
      padding: 1rem 1.125rem;
      border-bottom: 1px solid var(--line);
      background: var(--paper);
    }

    .time-x__head--with-input {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.85rem;
      align-items: start;
    }

    @media (min-width: 560px) {
      .time-x__head--with-input {
        grid-template-columns: minmax(0, 1fr) auto;
      }
    }

    .time-x__eyebrow {
      margin: 0 0 0.35rem;
      color: var(--subtle);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .time-x__title {
      margin: 0;
      font-size: 1.0625rem;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.01em;
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
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      color: var(--muted);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .time-x__value {
      flex: 0 0 5.5rem;
      color: var(--ink);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    .time-x input[type="range"] {
      width: 100%;
      accent-color: var(--accent);
    }

    .time-x select {
      width: 100%;
      border: 1px solid var(--line-strong);
      border-radius: 4px;
      background: white;
      padding: 0.45rem;
    }

    .time-x__age-input {
      display: inline-grid;
      grid-template-columns: 1fr auto auto;
      gap: 0.35rem;
      align-items: center;
      justify-self: start;
      color: var(--muted);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .time-x__age-input input {
      width: 4.5rem;
      border: 1px solid var(--line-strong);
      border-radius: 4px;
      background: white;
      padding: 0.38rem 0.45rem;
      color: var(--ink);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    .time-x__age-unit {
      color: var(--subtle);
      font-weight: 500;
    }

    @media (min-width: 560px) {
      .time-x__age-input {
        justify-self: end;
      }
    }

    .time-x__timeline {
      display: grid;
      gap: 0.85rem;
      margin-top: 0.25rem;
      padding: 1rem;
      border-radius: 4px;
      background: #fafafa;
      border: 1px solid var(--line);
    }

    .time-x__dot-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem 0.85rem;
      color: var(--muted);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .time-x__dot-key {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .time-x__year-dots {
      --dot-columns: 10;
      display: grid;
      grid-template-columns: repeat(var(--dot-columns), minmax(0, 1fr));
      gap: 0.38rem 0.32rem;
      align-items: center;
    }

    @media (min-width: 520px) {
      .time-x__year-dots {
        --dot-columns: 16;
      }
    }

    @media (min-width: 760px) {
      .time-x__year-dots {
        --dot-columns: 22;
      }
    }

    .time-x__year-dot {
      width: min(100%, 0.5rem);
      aspect-ratio: 1;
      justify-self: center;
      border-radius: 999px;
      background: var(--dot-empty);
    }

    .time-x__year-dot.is-lived {
      background: var(--dot-lived);
    }

    .time-x__year-dot.is-current {
      background: var(--ink);
      box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.12);
    }

    .time-x__dot-key .time-x__year-dot {
      width: 0.5rem;
    }

    .time-x__readout {
      display: grid;
      gap: 0.55rem;
    }

    .time-x__readout--stable {
      grid-template-rows: minmax(2.25rem, auto) minmax(6rem, auto);
      align-content: start;
    }

    .time-x__big {
      margin: 0;
      color: var(--ink);
      font-size: 2rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    .time-x__readout--stable .time-x__big {
      min-width: 7ch;
      min-height: 2.25rem;
    }

    .time-x__readout--stable .time-x__summary {
      min-height: 6rem;
    }

    @media (min-width: 720px) {
      .time-x__readout--stable {
        grid-template-rows: minmax(2.25rem, auto) minmax(4.75rem, auto);
      }

      .time-x__readout--stable .time-x__summary {
        min-height: 4.75rem;
      }
    }

    .time-x__summary,
    .time-x__note {
      margin: 0;
    }

    .time-x--plain {
      background: var(--paper);
    }

    .time-x__calculator {
      display: grid;
      gap: 0.9rem;
    }

    .time-x__field-grid {
      display: grid;
      gap: 0.75rem;
    }

    @media (min-width: 720px) {
      .time-x__field-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .time-x__field {
      display: grid;
      gap: 0.35rem;
      color: var(--muted);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .time-x__field-pair {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 7rem;
      gap: 0.45rem;
    }

    .time-x__field input,
    .time-x__field select {
      width: 100%;
      border: 1px solid var(--line-strong);
      border-radius: 4px;
      background: white;
      padding: 0.5rem 0.55rem;
      color: var(--ink);
      font-variant-numeric: tabular-nums;
    }

    .time-x__field input {
      text-align: right;
    }

    .time-x__result {
      border: 1px solid var(--line);
      border-radius: 4px;
      background: #fafafa;
      padding: 1rem;
    }

    .time-x__result-label {
      margin: 0 0 0.35rem;
      color: var(--subtle);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .time-x__result-value {
      margin: 0 0 0.5rem;
      color: var(--ink);
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
  </style>
`;

const unitsToYears = {
  hours: 1 / (24 * 365),
  days: 1 / 365,
  weeks: 7 / 365,
  months: 1 / 12,
  years: 1,
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

const yearSizeSlider = {
  minMonths: 1,
  maxMonths: 1080,
  steps: 1000,
  curve: 2.2,
};

function yearSizeSliderToMonths(value) {
  const position = clamp(Number(value) / yearSizeSlider.steps, 0, 1);
  const span = yearSizeSlider.maxMonths - yearSizeSlider.minMonths;

  return Math.round(
    yearSizeSlider.minMonths + span * position ** yearSizeSlider.curve,
  );
}

function monthsToYearSizeSlider(months) {
  const boundedMonths = clamp(
    months,
    yearSizeSlider.minMonths,
    yearSizeSlider.maxMonths,
  );
  const span = yearSizeSlider.maxMonths - yearSizeSlider.minMonths;
  const position = ((boundedMonths - yearSizeSlider.minMonths) / span) **
    (1 / yearSizeSlider.curve);

  return Math.round(position * yearSizeSlider.steps);
}

function normalizeExplorerAgeMonths(months) {
  if (months < 60) {
    return months;
  }

  return yearsToMonths(Math.round(monthsToYears(months)));
}

function formatExplorerAge(months) {
  if (months < 60) {
    return formatAgeFromMonths(months);
  }

  return `${Math.round(monthsToYears(months))}`;
}

function formatExplorerAgeSentence(months) {
  if (months < 60) {
    return formatAgeSentence(months);
  }

  return `${Math.round(monthsToYears(months))} years old`;
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

function ageInputToYears(value, unit) {
  const amount = Math.max(Number(value || 1), 1);
  return unit === "months" ? amount / 12 : amount;
}

function formatDurationFromYears(years) {
  const hours = years * 365 * 24;

  if (hours < 48) {
    return pluralize(hours, "hours");
  }

  const days = years * 365;

  if (days < 60) {
    return pluralize(days, "days");
  }

  const weeks = days / 7;

  if (weeks < 18) {
    return pluralize(weeks, "weeks");
  }

  const months = years * 12;

  if (months < 24) {
    return pluralize(months, "months");
  }

  return pluralize(years, "years");
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
          <div class="time-x__head time-x__head--with-input">
            <div>
              <p class="time-x__eyebrow">Mental model</p>
              <h2 class="time-x__title" id="timeline-title">
                A life as dots
              </h2>
              <p class="time-x__lede">
                This is the familiar picture: birth behind you, a projected end
                somewhere ahead, and now moving along the dots.
              </p>
            </div>
            <label class="time-x__age-input">
              <span>Age now</span>
              <input
                name="age"
                type="number"
                min="1"
                max="95"
                step="1"
                value="38"
              />
              <span class="time-x__age-unit">years</span>
            </label>
          </div>
          <div class="time-x__body">
            <div class="time-x__controls">
              <label class="time-x__control">
                <span class="time-x__label"
                  >Assumed lifespan
                  <strong class="time-x__value" data-value="lifespan"></strong
                ></span>
                <input
                  name="lifespan"
                  type="range"
                  min="40"
                  max="110"
                  value="85"
                />
              </label>
            </div>
            <div class="time-x__timeline">
              <div class="time-x__dot-legend" aria-hidden="true">
                <span class="time-x__dot-key">
                  <span class="time-x__year-dot is-lived"></span>
                  lived
                </span>
                <span class="time-x__dot-key">
                  <span class="time-x__year-dot is-current"></span>
                  now
                </span>
                <span class="time-x__dot-key">
                  <span class="time-x__year-dot"></span>
                  assumed
                </span>
              </div>
              <div
                class="time-x__year-dots"
                data-output="years"
                aria-label="Lifetime shown as one dot per year"
              ></div>
            </div>
            <p class="time-x__summary" data-output="summary"></p>
          </div>
        </section>
      `,
    );

    this.age = this.querySelector("[name='age']");
    this.lifespan = this.querySelector("[name='lifespan']");
    this.values = {
      lifespan: this.querySelector("[data-value='lifespan']"),
    };
    this.outputs = {
      years: this.querySelector("[data-output='years']"),
      summary: this.querySelector("[data-output='summary']"),
    };
    this.renderedYears = 0;

    this.addEventListener("input", () => this.render());
    this.render();
  }

  render() {
    const age = clamp(Math.round(Number(this.age.value || 38)), 1, 95);
    const lifespan = Math.max(Number(this.lifespan.value), age + 1);
    const lived = clamp((age / lifespan) * 100, 0, 100);

    if (Number(this.age.value) !== age) {
      this.age.value = String(age);
    }

    if (Number(this.lifespan.value) !== lifespan) {
      this.lifespan.value = String(lifespan);
    }

    this.values.lifespan.textContent = `${lifespan}`;

    if (this.renderedYears !== lifespan) {
      this.outputs.years.replaceChildren(
        ...Array.from({ length: lifespan }, () => {
          const dot = document.createElement("span");
          dot.className = "time-x__year-dot";
          return dot;
        }),
      );
      this.renderedYears = lifespan;
    }

    [...this.outputs.years.children].forEach((dot, index) => {
      dot.classList.toggle("is-lived", index < age);
      dot.classList.toggle("is-current", index === age && age < lifespan);
    });

    this.outputs.summary.textContent = `The dots say ${formatNumber(lived)}% lived and ${formatNumber(100 - lived)}% still ahead. Useful, but also a trick: the blue dots are an assumption, not an experience.`;
  }
}

class YearSizeExplorer extends HTMLElement {
  connectedCallback() {
    mount(
      this,
      html`
        <section class="time-x" aria-labelledby="year-size-title">
          <div class="time-x__head time-x__head--with-input">
            <div>
              <p class="time-x__eyebrow">Time speeding up</p>
              <h2 class="time-x__title" id="year-size-title">
                A year gets smaller as the denominator grows
              </h2>
              <p class="time-x__lede">
                Drag the age. The year itself is constant, but its share of
                remembered life keeps changing.
              </p>
            </div>
            <label class="time-x__age-input">
              <span>Your age</span>
              <input
                name="referenceAgeYears"
                type="number"
                min="1"
                max="120"
                step="1"
                value="30"
              />
              <span class="time-x__age-unit">years</span>
            </label>
          </div>
          <div class="time-x__body time-x__body--split">
            <label class="time-x__control">
              <span class="time-x__label"
                >Age <strong class="time-x__value" data-value="age"></strong
              ></span>
              <input
                name="agePosition"
                type="range"
                min="0"
                max="1000"
                value="0"
              />
            </label>
            <div class="time-x__readout time-x__readout--stable">
              <p class="time-x__big" data-output="percent"></p>
              <p class="time-x__summary" data-output="summary"></p>
            </div>
          </div>
        </section>
      `,
    );

    this.age = this.querySelector("[name='agePosition']");
    this.referenceAge = this.querySelector("[name='referenceAgeYears']");
    this.value = this.querySelector("[data-value='age']");
    this.percent = this.querySelector("[data-output='percent']");
    this.summary = this.querySelector("[data-output='summary']");

    this.age.value = String(monthsToYearSizeSlider(10));
    this.addEventListener("input", () => this.render());
    this.render();
  }

  render() {
    const ageMonths = normalizeExplorerAgeMonths(
      yearSizeSliderToMonths(this.age.value),
    );
    const ageYears = monthsToYears(ageMonths);
    const share = 1 / ageYears;
    const referenceAgeYears = clamp(Number(this.referenceAge.value || 30), 1, 120);
    const referenceShare = 1 / referenceAgeYears;
    const relativeToReference = referenceAgeYears / ageYears;
    const comparison = Math.abs(relativeToReference - 1) < 0.01
      ? "A year would feel about the same for you and for them."
      : `A year would feel about ${
        formatNumber(Math.max(relativeToReference, 1 / relativeToReference))
      }x ${relativeToReference > 1 ? "faster" : "slower"} for you than for them.`;

    this.value.textContent = formatExplorerAge(ageMonths);
    this.percent.textContent = percentFormat.format(share);
    this.summary.textContent = `At ${formatExplorerAgeSentence(ageMonths)}, one year is ${percentFormat.format(share)} of lived life. For you, a ${formatNumber(referenceAgeYears)}-year-old, it's ${percentFormat.format(referenceShare)}. ${comparison}`;
  }
}

class RelativeTimeExplorer extends HTMLElement {
  connectedCallback() {
    mount(
      this,
      html`
        <section class="time-x time-x--plain" aria-labelledby="relative-title">
          <div class="time-x__head">
            <p class="time-x__eyebrow">Shared time calculator</p>
            <h2 class="time-x__title" id="relative-title">
              How much does time together count?
            </h2>
            <p class="time-x__lede">
              Enter two ages and an amount of shared time. The calculator
              translates that time into the same share of lived life.
            </p>
          </div>
          <div class="time-x__body">
            <form class="time-x__calculator">
              <div class="time-x__field-grid">
                <label class="time-x__field">
                  <span>Their age</span>
                  <span class="time-x__field-pair">
                    <input
                      name="theirAge"
                      type="number"
                      min="1"
                      step="1"
                      value="10"
                    />
                    <select name="theirAgeUnit">
                      <option value="months">months</option>
                      <option value="years">years</option>
                    </select>
                  </span>
                </label>
                <label class="time-x__field">
                  <span>Your age</span>
                  <span class="time-x__field-pair">
                    <input
                      name="yourAge"
                      type="number"
                      min="1"
                      step="1"
                      value="38"
                    />
                    <select name="yourAgeUnit">
                      <option value="years">years</option>
                      <option value="months">months</option>
                    </select>
                  </span>
                </label>
                <label class="time-x__field">
                  <span>Time together</span>
                  <span class="time-x__field-pair">
                    <input
                      name="duration"
                      type="number"
                      min="0.1"
                      step="0.5"
                      value="3"
                    />
                    <select name="unit">
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                      <option value="weeks">weeks</option>
                      <option value="months">months</option>
                      <option value="years">years</option>
                    </select>
                  </span>
                </label>
              </div>
              <div class="time-x__result">
                <p class="time-x__result-label">Equivalent for you</p>
                <p class="time-x__result-value" data-output="equivalent"></p>
                <p class="time-x__summary" data-output="summary"></p>
                <p class="time-x__note" data-output="note"></p>
              </div>
            </form>
          </div>
        </section>
      `,
    );

    this.form = this.querySelector("form");
    this.outputs = Object.fromEntries(
      [...this.querySelectorAll("[data-output]")].map((node) => [
        node.dataset.output,
        node,
      ]),
    );

    this.form.addEventListener("input", () => this.render());
    this.render();
  }

  getState() {
    const elements = this.form.elements;

    return {
      theirAge: ageInputToYears(
        elements.theirAge.value,
        elements.theirAgeUnit.value,
      ),
      theirAgeLabel: pluralize(
        Number(elements.theirAge.value || 1),
        elements.theirAgeUnit.value,
      ),
      yourAge: ageInputToYears(
        elements.yourAge.value,
        elements.yourAgeUnit.value,
      ),
      yourAgeLabel: pluralize(
        Number(elements.yourAge.value || 1),
        elements.yourAgeUnit.value,
      ),
      duration: Math.max(Number(elements.duration.value || 0.1), 0.1),
      unit: elements.unit.value,
    };
  }

  render() {
    const {
      theirAge,
      theirAgeLabel,
      yourAge,
      yourAgeLabel,
      duration,
      unit,
    } = this.getState();
    const durationInYears = duration * unitsToYears[unit];
    const theirFraction = durationInYears / theirAge;
    const yourEquivalentYears = theirFraction * yourAge;
    const yourFraction = durationInYears / yourAge;
    const ratio = theirFraction / yourFraction;
    const direction = ratio >= 1 ? "larger" : "smaller";

    this.outputs.equivalent.textContent = formatDurationFromYears(
      yourEquivalentYears,
    );
    this.outputs.summary.textContent =
      `${pluralize(duration, unit)} together with someone ${theirAgeLabel} occupies ${percentFormat.format(theirFraction)} of their lived life.`;
    this.outputs.note.textContent =
      `For you, at ${yourAgeLabel}, that same clock time is ${percentFormat.format(yourFraction)} of lived life. Their slice is ${formatNumber(Math.max(ratio, 1 / ratio))}x ${direction} than yours.`;
  }
}

customElements.define("lifetime-timeline", LifetimeTimeline);
customElements.define("year-size-explorer", YearSizeExplorer);
customElements.define("relative-time-explorer", RelativeTimeExplorer);
