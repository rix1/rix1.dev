export const title = "Rikard Eide - CV";
export const description = "Rikard Eide's 2022 CV as an editable HTML page.";
export const url = "/cv/";

type Role = {
  title: string;
  meta: string;
  description: string;
};

type Section = {
  title: string;
  meta?: string;
  roles: Role[];
};

type Education = {
  title: string;
  place: string;
  years: string;
};

const sections: Section[] = [
  {
    title: "Otovo",
    meta: "2016 - Present",
    roles: [
      {
        title: "Software Engineer",
        meta: "Jan 2025 - Present",
        description:
          "Returned to hands-on product engineering after years in product and engineering leadership. Building across the platform where product judgment, technical depth, and speed matter.",
      },
      {
        title: "Engineering Manager",
        meta: "Jan 2023 - Dec 2024",
        description:
          "Led product engineering teams across partnerships and marketplace. Responsible for core platform mechanics, team delivery, and translating business-critical operational complexity into reliable product systems.",
      },
      {
        title: "Product Manager",
        meta: "May 2020 - Jan 2023",
        description:
          "Owned product direction for platform expansion and partnerships. Combined product management with hands-on technical contribution, helping launch Brazil, Poland, Italy, and Germany.",
      },
      {
        title: "Software Engineer",
        meta: "Feb 2016 - May 2020",
        description:
          "Joined Otovo early and helped build much of the original product surface across customer experience, internal tools, and market launches. Worked across front-end, back-end, UX, visual design, and product development.",
      },
    ],
  },
  {
    title: "Other experiences",
    roles: [
      {
        title: "Filtvet Feriekoloni",
        meta: "Chef - July 2019 - Present (3 years 1 month)",
        description:
          "Working as a chef at Filtvet Feriekoloni every summer, serving 60 kids and grown ups three meals a day for 10 days at a time. Siri Holtnæs and I also build and maintain feriekolonien.no.",
      },
      {
        title: "Norwegian Armed Forces",
        meta: "CBRN specialist -> Corporal - 2012 - Present (10 years)",
        description:
          'Initially hired to build up a CBRN team at HV-12 "Innsatsstyrke Rype" at Vaernes, Trondheim. After finishing my 4 year contract, I moved to Oslo where I\'m currently serving as corporal in my squad at HV-02.',
      },
      {
        title: "CosyTech AS",
        meta: "Software Engineer",
        description:
          "Nov 2014 - Nov 2015 (1 year 1 month)\nFull stack web development and product design. Planning, designing, implementing, testing and deploying software spanning multiple projects and technologies.",
      },
    ],
  },
];

const education: Education[] = [
  {
    title: "Informatics (BSc) at NTNU",
    place: "Trondheim, Norway",
    years: "2011 - 2014",
  },
  {
    title: "Comp. Sci at UCT",
    place: "Cape Town, South Africa",
    years: "2014 - 2015",
  },
  {
    title: "Informatics (MSc) at NTNU",
    place: "Trondheim, Norway",
    years: "2015 - 2016",
  },
];

const cvStyles = `
  :root {
    --cv-ink: #182033;
    --cv-text: #2b3447;
    --cv-muted: #7f8ba1;
    --cv-faint: #e3e8f1;
    --cv-paper: #fffefc;
    --cv-accent: #db2777;
    --cv-space-1: 4px;
    --cv-space-2: 8px;
    --cv-space-3: 12px;
    --cv-space-4: 16px;
    --cv-space-5: 20px;
    --cv-space-6: 24px;
    --cv-space-7: 28px;
    --cv-space-8: 32px;
    --cv-space-9: 36px;
  }

  body.cv-body {
    margin: 0;
    min-height: 100vh;
    background: linear-gradient(180deg, #f7f8fb 0%, #eef1f6 100%);
    color: var(--cv-ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  .cv-shell {
    width: min(100%, 1040px);
    margin: 0 auto;
    padding: var(--cv-space-6) 20px 52px;
  }

  .cv-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin: 0 auto var(--cv-space-4);
    max-width: 860px;
  }

  .cv-home {
    color: #647084;
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
  }

  .cv-print-button {
    appearance: none;
    border: 1px solid rgba(23, 32, 51, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--cv-ink);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font: inherit;
    font-size: 13px;
    font-weight: 800;
    line-height: 1;
    padding: 9px 12px;
    box-shadow: 0 10px 24px rgba(23, 32, 51, 0.08);
  }

  .cv-print-button:hover {
    border-color: rgba(219, 39, 119, 0.32);
    color: var(--color-primary);
  }

  .cv-page {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(100%, 860px);
    min-height: 1216px;
    margin: 0 auto;
    padding: 72px 68px 60px;
    background: var(--cv-paper);
    border: 1px solid rgba(24, 32, 51, 0.1);
    box-shadow: 0 26px 80px rgba(24, 32, 51, 0.15);
  }

  .cv-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 196px;
    gap: 44px;
    align-items: start;
    margin-bottom: var(--cv-space-8);
  }

  .cv-title {
    margin: 0;
    color: var(--cv-ink);
    font-family: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 55px;
    font-weight: 800;
    font-optical-sizing: auto;
    letter-spacing: 0;
    line-height: 0.88;
  }

  .cv-role {
    margin: var(--cv-space-2) 0;
    color: var(--cv-ink);
    font-size: 20px;
    line-height: 1.15;
    font-weight: 500;
  }

  .cv-contact-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px;
    margin-bottom: var(--cv-space-5);
    color: var(--cv-muted);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
  }

  .cv-contact-row a {
    color: inherit !important;
    text-decoration: none;
    background-image: none !important;
  }

  .cv-contact-link {
    display: inline-flex;
    color: inherit;
    transition: color 140ms ease;
  }

  .cv-contact-link:hover,
  .cv-contact-row a:hover {
    color: var(--cv-accent) !important;
  }

  .cv-contact-icon {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: currentColor;
    flex: 0 0 auto;
  }

  .cv-contact-icon-solid {
    fill: currentColor;
    stroke: none;
  }

  .cv-contact-icon-bluesky {
    width: 17px;
    height: 17px;
  }

  .cv-intro {
    max-width: 522px;
    margin: 0;
    color: var(--cv-text);
    font-size: 15px;
    line-height: 1.34;
  }

  .cv-intro + .cv-intro {
    margin-top: var(--cv-space-4);
  }

  .cv-photo {
    width: 196px;
    height: 196px;
    border-radius: 8px;
    object-fit: cover;
    object-position: center;
    box-shadow:
      0 1px 0 rgba(24, 32, 51, 0.08),
      0 14px 30px rgba(24, 32, 51, 0.08);
  }

  .cv-section {
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr);
    column-gap: 0;
    margin-top: var(--cv-space-8);
  }

  .cv-hero + .cv-section {
    margin-top: 0;
  }

  .cv-section-mark {
    width: 3px;
    height: 23px;
    margin-top: 0;
    background: var(--cv-ink);
    border-radius: 999px;
  }

  .cv-section-title {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 0 0 var(--cv-space-2);
    font-family: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 21px;
    font-weight: 800;
    font-optical-sizing: auto;
    line-height: 1;
  }

  .cv-section-meta,
  .cv-role-meta {
    color: var(--cv-muted);
    font-weight: 500;
  }

  .cv-section-meta {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
  }

  .cv-role-block {
    margin-top: var(--cv-space-4);
    color: var(--cv-text);
    font-size: 14.5px;
    line-height: 1.28;
  }

  .cv-role-block:first-of-type {
    margin-top: 0;
  }

  .cv-role-heading {
    margin: 0;
    color: var(--cv-ink);
    font-size: 14.5px;
    line-height: 1.2;
    font-weight: 850;
  }

  .cv-role-description {
    margin: var(--cv-space-1) 0 0;
    white-space: pre-line;
  }

  .cv-education-row {
    display: grid;
    grid-template-columns: 1fr 24px 1fr 24px 1fr;
    gap: 16px;
    align-items: start;
  }

  .cv-education-item {
    color: var(--cv-text);
    font-size: 14px;
    line-height: 1.24;
  }

  .cv-education-title {
    display: block;
    color: var(--cv-ink);
    font-weight: 900;
  }

  .cv-education-arrow {
    color: var(--cv-muted);
    font-size: 20px;
    font-weight: 300;
    line-height: 1;
    padding-top: 17px;
    text-align: center;
  }

  .cv-footer {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: auto;
    padding-top: var(--cv-space-8);
    color: var(--cv-muted);
    font-size: 13px;
    line-height: 1.2;
    border-top: 1px solid var(--cv-faint);
  }

  @media (max-width: 760px) {
    .cv-shell {
      padding: var(--cv-space-5) 12px 40px;
    }

    .cv-toolbar {
      max-width: none;
    }

    .cv-page {
      min-height: 0;
      padding: var(--cv-space-8) var(--cv-space-6) var(--cv-space-9);
    }

    .cv-hero {
      grid-template-columns: 1fr;
      gap: var(--cv-space-6);
      margin-bottom: var(--cv-space-7);
    }

    .cv-title {
      font-size: 42px;
    }

    .cv-photo {
      width: min(100%, 240px);
      height: auto;
      aspect-ratio: 1;
    }

    .cv-section {
      grid-template-columns: 12px minmax(0, 1fr);
      column-gap: 0;
    }

    .cv-section-title {
      display: block;
    }

    .cv-section-meta {
      display: block;
      margin-top: var(--cv-space-1);
      font-size: 15px;
    }

    .cv-education-row {
      grid-template-columns: 1fr;
      gap: var(--cv-space-3);
    }

    .cv-education-arrow {
      display: none;
    }

    .cv-footer {
      display: block;
    }

    .cv-footer span {
      display: block;
      margin-top: var(--cv-space-2);
    }
  }

  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    html,
    body.cv-body {
      width: 210mm;
      min-height: 297mm;
      background: #fff;
    }

    .cv-shell {
      width: 210mm;
      padding: 0;
    }

    .cv-toolbar,
    .cv-no-print {
      display: none !important;
    }

    .cv-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      padding: 18mm 18mm 16mm;
      border: 0;
      box-shadow: none;
    }

    .cv-title {
      font-size: 43px;
    }

    .cv-role {
      font-size: 19px;
    }

    .cv-hero {
      grid-template-columns: minmax(0, 1fr) 50mm;
      gap: 14mm;
      margin-bottom: 9mm;
    }

    .cv-photo {
      width: 50mm;
      height: 50mm;
    }

    .cv-intro,
    .cv-role-block {
      font-size: 13px;
    }

    .cv-section {
      grid-template-columns: 1fr;
      margin-top: 7mm;
    }

    .cv-section-mark {
      display: none;
    }

    .cv-section-title {
      display: flex;
      align-items: baseline;
      gap: 4px;
      font-size: 18px;
      white-space: nowrap;
    }

    .cv-section-meta {
      display: inline;
      margin-top: 0;
      font-size: 12px;
    }

    .cv-role-heading {
      font-size: 13px;
    }

    .cv-role-block {
      margin-top: 4mm;
    }

    .cv-education-item,
    .cv-footer,
    .cv-contact-row {
      font-size: 12px;
    }

    .cv-education-row {
      grid-template-columns: 1fr 18px 1fr 18px 1fr;
      gap: 10px;
    }

    .cv-education-arrow {
      display: block;
      padding-top: 15px;
    }

    .cv-footer {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      border-top: 0;
    }

    .cv-footer span {
      display: inline;
      margin-top: 0;
    }
  }
`;

const GithubIcon = () => (
  <svg
    class="cv-contact-icon"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    shape-rendering="geometricPrecision"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path>
  </svg>
);

const BlueskyIcon = () => (
  <svg
    class="cv-contact-icon cv-contact-icon-bluesky"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.7"
    shape-rendering="geometricPrecision"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 11.5c-1.6-3.3-4.4-6-6.8-6-1.6 0-2.2 1.1-2.2 2.5 0 2.5 2.9 5.1 6 6.4-2.9.3-5.2 1.7-5.2 3.7 0 1.2 1 2.2 2.5 2.2 2.1 0 4.4-2.1 5.7-4.8 1.3 2.7 3.6 4.8 5.7 4.8 1.5 0 2.5-1 2.5-2.2 0-2-2.3-3.4-5.2-3.7 3.1-1.3 6-3.9 6-6.4 0-1.4-.6-2.5-2.2-2.5-2.4 0-5.2 2.7-6.8 6Z"></path>
  </svg>
);

const PinIcon = () => (
  <svg
    class="cv-contact-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    stroke-width="2"
  >
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" />
  </svg>
);

const PrintIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
);

function RoleBlock({ role }: { role: Role }) {
  return (
    <div class="cv-role-block">
      <h3 class="cv-role-heading">
        {role.title} <span class="cv-role-meta">· {role.meta}</span>
      </h3>
      <p class="cv-role-description">{role.description}</p>
    </div>
  );
}

function CvSection({ section }: { section: Section }) {
  return (
    <section class="cv-section">
      <div class="cv-section-mark" aria-hidden="true"></div>
      <div>
        <h2 class="cv-section-title">
          <span>{section.title}</span>
          {section.meta && (
            <span class="cv-section-meta">· {section.meta}</span>
          )}
        </h2>
        {section.roles.map((role) => (
          <RoleBlock role={role} />
        ))}
      </div>
    </section>
  );
}

export default ({ comp, url }: Lume.Data) => {
  const canonicalUrl = new URL(url, "https://rix1.dev").href;

  return (
    <html lang="en">
      <head>
        <comp.MetaTags canonicalUrl={canonicalUrl} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <style>{{ __html: cvStyles }}</style>
      </head>
      <body class="cv-body">
        <main class="cv-shell">
          <div class="cv-toolbar">
            <a class="cv-home" href="/">
              Back home
            </a>
            <button
              class="cv-print-button"
              type="button"
              onclick="window.print()"
            >
              <PrintIcon />
              Print / Save PDF
            </button>
          </div>

          <article class="cv-page" data-pagefind-body>
            <header class="cv-hero">
              <div>
                <h1 class="cv-title">Rikard Eide</h1>
                <p class="cv-role">Product Engineer at Otovo</p>
                <div
                  class="cv-contact-row"
                  aria-label="Social links and location"
                >
                  <a
                    class="cv-contact-link"
                    href="https://bsky.app/profile/rix1.bsky.social"
                    aria-label="Bluesky"
                  >
                    <BlueskyIcon />
                  </a>
                  <a
                    class="cv-contact-link"
                    href="https://github.com/rix1"
                    aria-label="GitHub"
                  >
                    <GithubIcon />
                  </a>
                  @rix1
                  <span aria-hidden="true">·</span>
                  <PinIcon />
                  <span>Oslo, Norway</span>
                </div>
                <p class="cv-intro">
                  I once wrote a masters degree about ambulatory patient
                  monitoring using low-energy Bluetooth at NTNU. After that I
                  accidentally landed a job at Norway's largest bank. I declined
                  their offer and now I want to learn all the fun stuff and
                  build a better tomorrow doing so.
                </p>
              </div>
              <img
                class="cv-photo"
                src="https://s3.eu-north-1.amazonaws.com/rix1.dev/rix1-portrait-26-alt-0.jpg"
                alt="Rikard Eide"
                width="196"
                height="196"
              />
            </header>

            {sections.map((section) => (
              <CvSection section={section} />
            ))}

            <section class="cv-section">
              <div class="cv-section-mark" aria-hidden="true"></div>
              <div>
                <h2 class="cv-section-title">Education</h2>
                <div class="cv-education-row">
                  {education.map((item, index) => (
                    <>
                      <div class="cv-education-item">
                        <strong class="cv-education-title">{item.title}</strong>
                        <span>{item.place}</span>
                        <br />
                        <span>{item.years}</span>
                      </div>
                      {index < education.length - 1 && (
                        <div class="cv-education-arrow" aria-hidden="true">
                          →
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            </section>

            <footer class="cv-footer">
              <span>Born 27th Jun 1990, Norway</span>
              <span>+47 947 96 136 | rikardeide@gmail.com | @rix1</span>
            </footer>
          </article>
        </main>
      </body>
    </html>
  );
};
