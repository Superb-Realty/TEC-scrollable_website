import { Navigation } from "@/components/navigation";
import { SequenceStory } from "@/components/sequence-story";
import { WormViewStory } from "@/components/worm-view-story";
import { BenchmarksScene } from "@/components/benchmarks-scene";
import { BuildingBreakdown } from "@/components/building-breakdown";
import { LocalityMapSection } from "@/components/locality-map-section";
import { ProjectPillars } from "@/components/project-pillars";
import { AmenityMarquee } from "@/components/amenity-marquee";
import { DeveloperLegacies } from "@/components/developer-legacies";
import { EnquiryModal } from "@/components/enquiry-modal";
import { SectionReveal } from "@/components/section-reveal";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <link rel="preload" as="image" href="/sequence/frame-001.webp?v=video1" />
        <SequenceStory />
        
        <WormViewStory />
        <BenchmarksScene />
        <BuildingBreakdown />

        {/* 3. Strategic Locality & Multimodal Connectivity Map */}
        <LocalityMapSection />

        {/* 4. Project Pillars */}
        <ProjectPillars />

        {/* 4. Interactive Amenity Marquee & Cinematic Slide Flow */}
        <AmenityMarquee />

        {/* 5. Two Legacies • One Progressive Vision (Developer Pedigree & Landmark Portfolio) */}
        <DeveloperLegacies />

      </main>

      <footer className="closing" id="enquire">
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
            <p className="closing-contact-label">VISIT &amp; CONNECT</p>
            <address className="closing-contact-address">
              Amber Compound, Plot No. 11A, LBS Marg,<br />
              Vikhroli West, Mumbai – 400079
            </address>
            <div className="closing-contact-links">
              <a href="tel:+919090263264"><span>CALL US</span>9090 263 264</a>
              <a href="mailto:info@superbrealty.in"><span>EMAIL US</span>info@superbrealty.in</a>
            </div>
            <p className="closing-developer-credit">A development by <strong>Superb Realty &amp; GHP Group</strong></p>
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
