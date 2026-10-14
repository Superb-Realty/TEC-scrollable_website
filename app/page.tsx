import { Navigation } from "@/components/navigation";
import { SequenceStory } from "@/components/sequence-story";
import { BenchmarksScene } from "@/components/benchmarks-scene";
import { BuildingBreakdown } from "@/components/building-breakdown";
import { site } from "@/content/site";
import Image from "next/image";
import benchmarksImage from "@/assets/three_global_benchmarks/3_global_benchmarks.png";
import leedLogo from "@/assets/three_global_benchmarks/Leed.png";
import wiredScoreLogo from "@/assets/three_global_benchmarks/Wired Score Certified.webp";
import smartScoreLogo from "@/assets/three_global_benchmarks/smart-score.webp";

const benchmarks = [
  { name: "LEED*", logo: leedLogo, description: "A benchmark for environmental performance across energy efficiency, water conservation, indoor environmental quality, materials and site considerations." },
  { name: "WIREDSCORE*", logo: wiredScoreLogo, description: "A benchmark for digital connectivity, resilience and technology infrastructure helping buildings stay connected as business requirements evolve." },
  { name: "SMARTSCORE*", logo: smartScoreLogo, description: "A benchmark for smart building technology, automation, IoT integration and data-enabled operations." },
];

export default function Home() {
  return <main>
    <link rel="preload" as="image" href="/sequence/ezgif-frame-001.jpg" />
    <Navigation />
    <SequenceStory />
    <BenchmarksScene>
      <div className="benchmarks-content">
        <h2 id="benchmarks-title">Three global benchmarks.<br />One future-ready workspace.</h2>
        <p className="benchmarks-intro">From sustainable infrastructure and resilient connectivity to intelligent building performance, The Eastern Chambers brings together three global benchmarks to create a workplace equipped for how businesses will work tomorrow.</p>
        <div className="benchmarks-grid">
          {benchmarks.map(({ name, logo, description }) => <article className="benchmark-card" key={name}>
            <Image src={logo} alt="" />
            <h3>{name}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </div>
      <div className="benchmarks-visual">
        <Image src={benchmarksImage} alt="Artistic impression of The Eastern Chambers beside an elevated transit line" fill sizes="100vw" quality={82} />
        <span>Artistic impression</span>
      </div>
    </BenchmarksScene>
    <BuildingBreakdown />
    <section className="architecture" id="architecture" aria-labelledby="architecture-title">
      <div className="architecture-heading"><p className="eyebrow light">03 / ARCHITECTURE</p><h2 id="architecture-title">A presence with<br /><em>purpose.</em></h2><p>Defined by a clear architectural silhouette and framed by its landscape, Eastern Chamber is conceived as an address with a lasting identity.</p></div>
      <div className="architecture-image" role="img" aria-label="Eastern Chamber rising above a green landscape"><span>Artist&apos;s impression</span></div>
      <p className="architecture-caption">An architecture that makes its mark with clarity, proportion and restraint.</p>
    </section>
    <section className="vision" id="vision" aria-labelledby="vision-title">
      <div className="vision-top"><p className="eyebrow">04 / THE VISION</p><p>Eastern Chamber<br />A commercial address</p></div>
      <h2 id="vision-title">Designed to matter<br /><em>well beyond today.</em></h2>
      <div className="vision-bottom"><p className="vision-lead">A distinctive building is only the beginning.</p><div><p>The ambition is to bring architectural character and considered performance into the same conversation—creating a workplace proposition with relevance for the years ahead.</p><a className="text-link" href="#enquire">Request project information <span aria-hidden="true">↗</span></a></div></div>
    </section>
    <footer className="closing" id="enquire"><div className="closing-top"><p className="eyebrow light">EASTERN CHAMBER</p><p>{site.location}</p></div><div className="closing-main"><p className="eyebrow light">THE NEXT CONVERSATION</p><h2>See the vision<br /><em>in full.</em></h2><p>For project information and investment enquiries, start a conversation with the Eastern Chamber team.</p><a className="closing-cta" href={`mailto:${site.email}?subject=Eastern%20Chamber%20enquiry`}>Request project information <span aria-hidden="true">↗</span></a></div><div className="closing-bottom"><span>{site.contactNote}</span><a href="#top">Back to top ↑</a><span>© {new Date().getFullYear()} {site.name}</span></div></footer>
  </main>;
}

