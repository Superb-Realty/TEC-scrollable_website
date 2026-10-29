import { Navigation } from "@/components/navigation";
import { SequenceStory } from "@/components/sequence-story";
import { WormViewStory } from "@/components/worm-view-story";
import { BenchmarksScene } from "@/components/benchmarks-scene";
import { BuildingBreakdown } from "@/components/building-breakdown";
import { ProjectPillars } from "@/components/project-pillars";
import { AmenityMarquee } from "@/components/amenity-marquee";
import { EnquiryModal } from "@/components/enquiry-modal";
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
          <p className="eyebrow">NEXT-GEN CHAMBERS</p>
          <p>Grade A+ Commercial Workspaces<br />Designed for the <em>Businesses of Tomorrow.</em></p>
          <div>
            <span className="font-mono">Grade A+</span>
            <span className="font-mono">Commercial Workspaces</span>
          </div>
        </section>

        <WormViewStory />
        <BenchmarksScene />
        <BuildingBreakdown />

        <section className="architecture blend-in" id="architecture" aria-labelledby="architecture-title">
          <div className="architecture-heading">
            <p className="eyebrow light">INNOVATION SHAPING THE FUTURE OF BUSINESS</p>
            <h2 id="architecture-title">INNOVATION SHAPING<br />THE <em>FUTURE OF BUSINESS.</em></h2>
            <div className="architecture-copy">
              <p>The Eastern Chambers reimagines the modern workplace for businesses that expect their address to work as hard as they do.</p>
              <p>A Grade A+ workplace should do more than accommodate business. It should enable what comes next, driven by Technology, Design, Sustainability and Wellness.</p>
            </div>
          </div>
          <div className="architecture-image" role="img" aria-label="Representative Image">
            <span>Representative Image</span>
          </div>
          <p className="architecture-caption">Representative Image</p>
        </section>

        {/* 4. Project Pillars */}
        <ProjectPillars />

        {/* 4. Interactive Amenity Marquee & Cinematic Slide Flow */}
        <AmenityMarquee />

        <section className="vision blend-in blend-sm blend-out" id="vision" aria-labelledby="vision-title">
          <div className="vision-top">
            <p className="eyebrow">OWN THE FUTURE, BEFORE THE MARKET PRICES IT IN</p>
            <p>The Eastern Chambers<br />Grade A+ Commercial Workspaces</p>
          </div>
          <h2 id="vision-title">POWAI BRINGS THE DEMAND,<br /><em>VIKHROLI HOLDS THE VALUE.</em></h2>
          <div className="vision-bottom">
            <p className="vision-lead">Less than 2 km from Powai, Vikhroli has an established ecosystem of businesses, enterprises and communities.</p>
            <div>
              <p>Its seamless connectivity and proximity to Mumbai’s strategic business and employment nodes are accelerating its evolution from a well-connected business location into a high-potential commercial node. Vikhroli is transforming into a preferred CBD because of its multi-level connectivity to MMR’s established &amp; emerging business districts.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="closing blend-in" id="enquire">
        <div className="closing-top">
          <p className="eyebrow light">THE FUTURE WORKS HERE</p>
          <span className="eyebrow light font-mono">The Eastern Chambers</span>
        </div>
        <div className="closing-main">
          <div className="closing-copy">
            <p className="eyebrow light">TWO LEGACIES. ONE PROGRESSIVE VISION.</p>
            <h2>A WORLD-CLASS EPICENTRE<br /><em>UNFOLDS AT VIKHROLI.</em></h2>
            <p>Strategically positioned on LBS Marg, The Eastern Chambers brings together Grade A+ commercial assets with intelligent design, integrated infrastructure and high-speed connectivity access in one future-ready address.</p>
            <div className="closing-cta-wrap">
              <a href="#enquire" className="btn-closing-enquire">
                Begin a conversation <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="closing-image">
            <Image
              src="/pillars/pillar-03.webp"
              alt="Artistic Impression"
              fill
              sizes="(max-width: 600px) 240vw, 120vw"
            />
            <span>Artistic Impression</span>
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
      <EnquiryModal />
      <SectionReveal />
    </>
  );
}
