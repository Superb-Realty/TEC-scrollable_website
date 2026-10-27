import { Navigation } from "@/components/navigation";
import { SequenceStory } from "@/components/sequence-story";
import { WormViewStory } from "@/components/worm-view-story";
import { BenchmarksScene } from "@/components/benchmarks-scene";
import { BuildingBreakdown } from "@/components/building-breakdown";
import { EnquiryModal } from "@/components/enquiry-modal";
import { ProjectPillars } from "@/components/project-pillars";
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
      <section className="address-note blend-in blend-sm blend-out blend-out-sm" aria-label="The Eastern Chambers at a glance">
        <p className="eyebrow">A considered address.<br />An uncommon perspective.</p>
        <p>A new perspective<br />on the <em>working day.</em></p>
        <div><span>Grade A+</span><span>Commercial workspace</span></div>
      </section>
      <WormViewStory />
      <BenchmarksScene />
      <BuildingBreakdown />
      <section className="architecture blend-in blend-out blend-out-sm" id="architecture" aria-labelledby="architecture-title">
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
      <ProjectPillars />
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
          <span className="eyebrow light">The Eastern Chambers</span>
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
          <div className="closing-image"><Image src="/pillars/pillar-03.webp" alt="A landscaped outdoor terrace at The Eastern Chambers" fill sizes="(max-width: 600px) 240vw, 120vw" /><span>Space to see further.</span></div>
        </div>
        <div className="closing-bottom">
          <span>Eastern Chamber</span>
          <a href="#top">Back to top ↑</a>
          <span>© {new Date().getFullYear()} {site.name}</span>
        </div>
      </footer>
      <EnquiryModal />
      <SectionReveal />
    </>
  );
}
