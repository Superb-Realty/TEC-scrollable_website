/**
 * Sticky scroll stories share their edges with feathered section seams (see "Section seams" in globals.css).
 * - lead: the story's own transparent top border, during which the previous section is still dissolving away.
 * - exit: the next section's negative top margin, during which it mists in over the pinned final frame.
 * Progress is measured only across the clean pinned range, so the film reaches its last frame
 * just as the next section begins to rise over it.
 */
export type Seams = { lead: number; exit: number };

export function measureSeams(section: HTMLElement): Seams {
  const lead = parseFloat(getComputedStyle(section).borderTopWidth) || 0;
  const next = section.nextElementSibling as HTMLElement | null;
  const exit = next ? Math.max(0, -(parseFloat(getComputedStyle(next).marginTop) || 0)) : 0;
  return { lead, exit };
}

export function pinnedProgress(section: HTMLElement, seams: Seams): number {
  const travel = section.offsetHeight - window.innerHeight - seams.lead - seams.exit;
  if (travel <= 0) return 0;
  const scrolled = -section.getBoundingClientRect().top - seams.lead;
  return Math.max(0, Math.min(1, scrolled / travel));
}
