import { Navigation } from "@/components/navigation";
import { SequenceStory } from "@/components/sequence-story";
import { QuickFactsPlate } from "@/components/quick-facts-plate";
import { WormViewStory } from "@/components/worm-view-story";
import { BenchmarksScene } from "@/components/benchmarks-scene";
import { BuildingBreakdown } from "@/components/building-breakdown";
import { ProjectPillars } from "@/components/project-pillars";
import { AmenityMarquee } from "@/components/amenity-marquee";
import { EnquiryModal } from "@/components/enquiry-modal";
import { PersistentCtaPill } from "@/components/persistent-cta-pill";
import { SectionReveal } from "@/components/section-reveal";
import { site } from "@/content/site";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <link rel="preload" as="image" href="/sequence/frame-001.webp" />
        <SequenceStory />
        
        <section className="address-note blend-in blend-sm" aria-label="The Eastern Chambers at a glance">
          <p className="eyebrow">A considered address.<br />An uncommon perspective.</p>
          <p>A new perspective<br />on the <em>working day.</em></p>
          <div>
            <span className="font-mono">Grade A+</span>
            <span className="font-mono">Commercial workspace</span>
          </div>
        </section>

        {/* 2. Live Data Plates & Rolling Counters (Proof of Scale) */}
        <QuickFactsPlate />

        <WormViewStory />
        <BenchmarksScene />
        <BuildingBreakdown />

        <section className="architecture blend-in" id="architecture" aria-labelledby="architecture-title">
          <div className="architecture-heading">
            <p className="eyebrow light">03 / ARCHITECTURE</p>
            <h2 id="architecture-title">A clear expression<br />of <em>what comes next.</em></h2>
            <div className="architecture-copy">
              <p>The Eastern Chambers reimagines the modern workplace for businesses that expect their address to work as hard as they do.</p>
              <p>A Grade A+ workplace should do more than accommodate business. It should enable what comes next, driven by Technology, Design, Sustainability and Wellness.</p>
            </div>
          </div>
          <div className="architecture-image" role="img" aria-label="Eastern Chamber rising above a green landscape">
            <span>Artist&apos;s impression</span>
          </div>
          <p className="architecture-caption">An architecture that makes its mark with clarity, proportion and restraint.</p>
        </section>

        {/* 4. Project Pillars */}
        <ProjectPillars />

        {/* 4. Interactive Amenity Marquee & Cinematic Slide Flow */}
        <AmenityMarquee />

        <section className="vision blend-in blend-sm blend-out" id="vision" aria-labelledby="vision-title">
          <div className="vision-top">
            <p className="eyebrow">04 / THE VISION</p>
            <p>Eastern Chamber<br />A commercial address</p>
          </div>
          <h2 id="vision-title">Designed to matter<br /><em>well beyond today.</em></h2>
          <div className="vision-bottom">
            <p className="vision-lead">A distinctive building is only the beginning.</p>
            <div>
              <p>The ambition is to bring architectural character and considered performance into the same conversation—creating a workplace proposition with relevance for the years ahead.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="closing blend-in" id="enquire">
        <div className="closing-top">
          <p className="eyebrow light">05 / Your next chapter</p>
          <span className="eyebrow light font-mono">The Eastern Chambers</span>
        </div>
        <div className="closing-main">
          <div className="closing-copy">
            <p className="eyebrow light">A place for your ambition</p>
            <h2>A vision made<br /><em>to endure.</em></h2>
            <p>Architecture, workplace performance and nature in one distinctive commercial address.</p>
            <div className="closing-cta-wrap">
              <a href="#enquire" className="btn-closing-enquire">
                Begin a conversation <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="closing-image">
            <Image
              src="/pillars/pillar-03.webp"
              alt="A landscaped outdoor terrace at The Eastern Chambers"
              fill
              sizes="(max-width: 600px) 240vw, 120vw"
            />
            <span>Space to see further.</span>
          </div>
        </div>

        {/* 5. MahaRERA & Developer Credentials Legal Seal Bar */}
        <div className="closing-legal-bar" aria-label="Legal compliance and developer pedigree">
          <div className="closing-rera-card">
            <div className="closing-qr-wrap" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className="closing-qr-code"
                fill="none"
                stroke="#182d27"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="6" height="6" rx="1" fill="#182d27" />
                <rect x="15" y="3" width="6" height="6" rx="1" fill="#182d27" />
                <rect x="3" y="15" width="6" height="6" rx="1" fill="#182d27" />
                <path d="M14 14h2v2h-2z" fill="#182d27" />
                <path d="M19 14v4" />
                <path d="M14 19h4" />
                <path d="M10 7h1M7 10v1M17 10h1M10 17v1" />
              </svg>
            </div>
            <div className="closing-rera-details">
              <span className="closing-rera-label font-mono">MAHARERA REGISTERED PROJECT</span>
              <strong className="closing-rera-number font-mono">P51800054892</strong>
              <a
                href="https://maharera.mahaonline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="closing-rera-link"
              >
                Verify on MahaRERA Portal ↗
              </a>
            </div>
          </div>

          <div className="closing-pedigree">
            <h3 className="closing-pedigree-title">Superb Realty &amp; GHP Group • Two Legacies</h3>
            <p className="closing-pedigree-copy">
              Two established Mumbai developers with decades of experience in development, delivery and value creation across residential and commercial real estate.
            </p>
            <div className="closing-pedigree-badges font-mono">
              <span className="closing-pedigree-badge">80+ YRS COLLECTIVE LEGACY</span>
              <span className="closing-pedigree-badge">8.5M+ SQ.FT. DELIVERED</span>
              <span className="closing-pedigree-badge">50+ PROJECTS COMPLETED</span>
            </div>
            <p className="closing-pedigree-copy" style={{ marginTop: "8px", fontSize: "11px", color: "#8a9682" }}>
              Amber Compound, Plot No. 11A, LBS Marg, Vikhroli West, Mumbai - 400079 • Phone: <a href="tel:+919090263264" style={{ color: "#d5ddca", textDecoration: "underline" }}>9090 263 264</a> • <a href="mailto:info@superbrealty.in" style={{ color: "#d5ddca", textDecoration: "underline" }}>info@superbrealty.in</a>
            </p>
          </div>
        </div>

        <div className="closing-bottom">
          <span className="font-mono">The Eastern Chambers</span>
          <a href="#top">Back to top ↑</a>
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        </div>
      </footer>

      {/* 5. Persistent Conversion Architecture & Modals */}
      <PersistentCtaPill />
      <EnquiryModal />
      <SectionReveal />
    </>
  );
}
