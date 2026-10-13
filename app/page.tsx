import { Navigation } from "@/components/navigation";
import { SequenceStory } from "@/components/sequence-story";
import { site } from "@/content/site";

export default function Home() {
  return <main>
    <link rel="preload" as="image" href="/sequence/ezgif-frame-001.jpg" />
    <Navigation />
    <SequenceStory />
    <section className="architecture" id="architecture" aria-labelledby="architecture-title">
      <div className="architecture-image" role="img" aria-label="Eastern Chamber building above a green landscape" />
      <div className="architecture-intro"><p className="eyebrow">01 / ARCHITECTURE</p><h2 id="architecture-title">Designed to leave<br /><em>an impression.</em></h2><p>A thoughtful convergence of contemporary architecture, refined spaces, and a setting that celebrates the extraordinary.</p></div>
    </section>
    <section className="vision" id="vision" aria-labelledby="vision-title">
      <div className="section-heading"><p className="eyebrow">02 / OUR VISION</p><h2 id="vision-title">A dialogue between<br /><em>form and nature.</em></h2></div>
      <div className="vision-content"><p>Rooted in nature. Defined by vision.</p><p>Eastern Chamber is an invitation to experience architecture with a different perspective. A composed meeting of light, landscape, and structure.</p><a className="text-link" href="#experience">Explore the experience <span aria-hidden="true">?</span></a></div>
    </section>
    <section className="experience" id="experience" aria-labelledby="experience-title"><div className="experience-image" role="img" aria-label="Architectural facade framed by mangrove trees" /><div className="experience-copy"><p className="eyebrow light">03 / THE EXPERIENCE</p><h2 id="experience-title">The moment<br /><em>everything opens.</em></h2><p>From a quiet glimpse through the mangroves to a full architectural presence, the journey is part of the experience.</p></div></section>
    <footer className="closing" id="enquire"><div className="closing-top"><p className="eyebrow">EASTERN CHAMBER</p><p>{site.location}</p></div><h2>Discover a<br /><em>different perspective.</em></h2><a className="closing-cta" href={`mailto:${site.email}?subject=Eastern%20Chamber%20enquiry`}>Enquire now <span aria-hidden="true">?</span></a><div className="closing-bottom"><span>{site.contactNote}</span><a href="#top">Back to top ?</a><span>© {new Date().getFullYear()} {site.name}</span></div></footer>
  </main>;
}

