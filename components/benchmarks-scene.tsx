import type { ReactNode } from "react";

export function BenchmarksScene({ children }: { children: ReactNode }) {
  return <section className="benchmarks" id="benchmarks" aria-labelledby="benchmarks-title">
    <div className="benchmarks-layout">{children}</div>
  </section>;
}
