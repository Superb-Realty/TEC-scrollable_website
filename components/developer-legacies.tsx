"use client";

import Image from "next/image";

interface PastProject {
  id: string;
  name: string;
  location: string;
  category: "COMMERCIAL" | "RESIDENTIAL";
  area: string;
  image: string;
}

const PAST_PROJECTS: PastProject[] = [
  {
    id: "altura",
    name: "Superb Altura",
    location: "Chembur West",
    category: "COMMERCIAL",
    area: "1 lakh sq.ft.",
    image: "/projects/superb-altura.webp",
  },
  {
    id: "skyline-icon",
    name: "Skyline Icon, Phase I & II",
    location: "Andheri",
    category: "COMMERCIAL",
    area: "10 lakh sq.ft.",
    image: "/projects/skyline-icon.webp",
  },
  {
    id: "skyline-oasis",
    name: "Skyline Oasis",
    location: "Vidyavihar West",
    category: "RESIDENTIAL",
    area: "6 lakh sq.ft.",
    image: "/projects/skyline-oasis.webp",
  },
  {
    id: "suncity",
    name: "Suncity",
    location: "Powai",
    category: "RESIDENTIAL",
    area: "15 lakh sq.ft.",
    image: "/projects/suncity-powai.webp",
  },
  {
    id: "isle-of-calm",
    name: "Isle of Calm",
    location: "Vihar Lake",
    category: "RESIDENTIAL",
    area: "5 lakh sq.ft.",
    image: "/projects/isle-of-calm.webp",
  },
  {
    id: "trinity",
    name: "Trinity",
    location: "Powai",
    category: "RESIDENTIAL",
    area: "2 lakh sq.ft.",
    image: "/projects/trinity-powai.webp",
  },
];

export function DeveloperLegacies() {
  return (
    <section className="legacies-section" id="developer-pedigree" aria-labelledby="legacies-title">
      <div className="legacies-container">
        {/* Top Header Row with Title + Collective Metrics */}
        <div className="legacies-header-row">
          <div className="legacies-title-block">
            <h2 id="legacies-title" className="legacies-main-title">
              TWO LEGACIES.<br />
              <span>ONE PROGRESSIVE VISION.</span>
            </h2>
            <p className="legacies-intro-copy">
              The Eastern Chambers brings together the experience of Superb Realty and GHP Group, two established
              Mumbai developers with decades of experience in development, delivery and value creation across
              residential and commercial real estate.
            </p>
          </div>

          <div className="legacies-metrics-row">
            <div className="legacies-metric-card">
              <div className="metric-icon-wrap" aria-hidden="true">
                <svg width="72" height="72" viewBox="0 0 72 68" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 62V51h13l12-9h12l9-6 2-5-7-1-8 4-9-2 3-4h12M4 39h12l9-5h9l6 3M17 51V37M68 3v12H55v17h13M55 17H32l-13 8-4 6 5 2 10-7h14M55 31H43" /></svg>
              </div>
              <div className="metric-text-group">
                <strong className="metric-num font-mono">80+ YEARS OF</strong>
                <span className="metric-label font-mono">COLLECTIVE LEGACY</span>
              </div>
            </div>

            <div className="legacies-metric-card">
              <div className="metric-icon-wrap" aria-hidden="true">
                <svg width="72" height="72" viewBox="0 0 72 68" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 63h64M6 62V17h18M9 17V9h15M15 9V5M24 63V3l20 8v52M36 8v55M44 16l10 4v43M54 26h10v37M6 24h18M6 33h18M6 42h18M6 51h18M6 59h13V27h10v36M59 31h5M59 37h5M59 43h5M59 49h5M59 55h5M23 32v3M23 40v3M23 48v3M23 56v3" /></svg>
              </div>
              <div className="metric-text-group">
                <strong className="metric-num font-mono">8.5 MILLION+ SQ.FT.</strong>
                <span className="metric-label font-mono">DELIVERED</span>
              </div>
            </div>

            <div className="legacies-metric-card">
              <div className="metric-icon-wrap" aria-hidden="true">
                <svg width="72" height="72" viewBox="0 0 72 68" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 63h59M9 63V20l18-5 35 11v37M27 15v48M14 18V5l16-3 22 5v16M30 2v14M36 10l10 3M10 27l17-5 35 10M10 35l17-5 35 10M10 43l17-5 35 10M10 51l17-5 35 10" /></svg>
              </div>
              <div className="metric-text-group">
                <strong className="metric-num font-mono">50+ PROJECTS</strong>
                <span className="metric-label font-mono">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid: 2 Developer Profiles on Left, 6 Past Projects Showcase on Right */}
        <div className="legacies-main-grid">
          {/* Left Column: Developer Profile Cards */}
          <div className="legacies-profiles-col">
            {/* Developer 1: Superb Realty */}
            <article className="legacy-profile-card">
              <div className="profile-logo-zone" aria-label="Superb Realty logo area">
                {/* Dedicated logo space with pre-configured logo image & fallback */}
                <div className="profile-logo-wrapper">
                  <Image
                    src="/logo-superb-realty.png"
                    alt="Superb Realty — The Future Is Superb Realty"
                    width={180}
                    height={85}
                    className="profile-logo-img"
                    priority
                  />
                </div>
              </div>
              <div className="profile-content-zone">
                <span className="profile-eyebrow font-mono">THE LEGACY THAT POWERS THE FUTURE</span>
                <p className="profile-body">
                  Superb Realty builds on the legacy of Skyline Group, bringing 30+ years of experience and 5M+ sq.ft.
                  delivered across landmark commercial and residential developments. Decades of proven expertise, quality
                  and timely delivery, now shape the spaces of tomorrow.
                </p>
              </div>
            </article>

            {/* Developer 2: GHP Group */}
            <article className="legacy-profile-card">
              <div className="profile-logo-zone" aria-label="GHP Group logo area">
                {/* Dedicated logo space with pre-configured logo image & fallback */}
                <div className="profile-logo-wrapper">
                  <Image
                    src="/logo-ghp-group.png"
                    alt="GHP Group — Vision to Reality"
                    width={180}
                    height={85}
                    className="profile-logo-img"
                  />
                </div>
              </div>
              <div className="profile-content-zone">
                <span className="profile-eyebrow font-mono">TRANSFORMING VISION INTO TOMORROW’S REALITY</span>
                <p className="profile-body">
                  With 50+ years of experience shaping Mumbai’s built environment and 3.5M+ sq.ft. delivered, GHP Group
                  brings multi-generational expertise and established relationships across the city’s residential and
                  commercial ecosystem.
                </p>
              </div>
            </article>
          </div>

          {/* Right Column: 6 Past Landmark Projects Showcase (2x3 Grid) */}
          <div className="legacies-portfolio-col">
            <div className="portfolio-grid">
              {PAST_PROJECTS.map((proj) => (
                <div key={proj.id} className="portfolio-card">
                  <div className="portfolio-title-wrap">
                    <h4 className="portfolio-title">{proj.name}, <span>{proj.location}</span></h4>
                  </div>
                  
                  {/* Dedicated image space with pre-configured image and fallback */}
                  <div className="portfolio-image-zone">
                    <div className="portfolio-image-frame">
                      <Image
                        src={proj.image}
                        alt={`${proj.name}, ${proj.location} — ${proj.category}`}
                        fill
                        sizes="(max-width: 600px) 44vw, (max-width: 1100px) 28vw, 13vw"
                        className="portfolio-img"
                      />
                    </div>
                  </div>

                  <div className="portfolio-meta-wrap">
                    <span className="portfolio-meta font-mono">
                      <strong>{proj.category}</strong> | {proj.area}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="portfolio-disclaimer font-mono">* Artistic Impressions</p>
          </div>
        </div>
      </div>
    </section>
  );
}

