# ROLE: World-Class Creative Developer & Digital Experience Director

Act as an elite Creative Developer, Creative Technologist, and Digital Art Director specializing in:

- Next.js (App Router)
- React, TypeScript, Tailwind CSS
- Framer Motion / Motion for React
- Scroll-linked HTML5 Canvas animations
- GSAP ScrollTrigger (only if technically justified)
- High-performance image sequence rendering
- Cinematic scrollytelling and immersive architectural storytelling
- Award-winning luxury brand websites

Your standard of execution should rival websites featured on Awwwards, CSS Design Awards, and leading premium architectural and hospitality brand experiences.

Do not deliver a generic React template, ordinary real estate website, conventional hero with a background video, or basic scrolling parallax effect.

Build an immersive, sophisticated, production-quality website where architecture, nature, typography, and motion feel like one cohesive experience.

---

# PROJECT

**Brand:** Eastern Chamber

**Experience:** A premium architectural and commercial real estate destination.

**Central Creative Concept:**

"Where Nature Reveals Architecture."

The digital experience begins inside a dense mangrove forest. As visitors scroll, the camera appears to travel through the vegetation, gradually revealing a striking modern architectural elevation.

The reveal must feel cinematic, deliberate, spatially continuous, and premium.

This is a narrative about discovery. Initially, nature conceals the architecture. As the user scrolls, the building slowly emerges, ultimately becoming the central visual focus.

The transition itself is the hero experience.

---

# CRITICAL INPUT: PROVIDED IMAGE SEQUENCE

I have provided a ZIP containing 232 sequential JPG frames:

ezgif-frame-001.jpg  
...  
ezgif-frame-232.jpg

These frames represent the progression between the mangrove forest opening and the architectural elevation reveal.

The sequence must be used directly as the primary animation asset.

Do not regenerate, replace, or approximate the frames with AI-generated imagery or CSS transformations.

Extract and inspect the supplied images before implementation.

Determine their resolution, aspect ratio, sequence order, color characteristics, and visual continuity.

If the sequence has any imperfections, optimize rendering and transitions without altering the architectural identity.

---

# CORE EXPERIENCE: SCROLL-CONTROLLED IMAGE SEQUENCE

This is the most important technical and creative requirement.

Build a full-viewport cinematic hero section using an HTML5 Canvas.

The Canvas displays the provided image frames, with the currently rendered frame directly determined by scroll progress.

The sequence must behave like a video being physically scrubbed by scrolling.

**Required behavior:**

1. When the page loads, display frame 001.
2. As the user scrolls downward, advance continuously through the 232 frames.
3. As the user scrolls upward, reverse through the frames with equivalent precision.
4. If the user stops scrolling, the animation stops at the corresponding position.
5. Scrolling must never trigger independent autoplay.
6. No looping, restarting, jumping, or snapping between frames.
7. The final scroll position must display frame 232.
8. The animation must remain synchronized with scroll position during rapid scrolls, trackpad gestures, and reverse scrolling.

Use an image-sequence rendering architecture rather than a video element.

Technical implementation requirements:

- Use `canvas.drawImage()` for frame rendering.
- Use Motion's `useScroll` and `useTransform` where appropriate.
- Use a pinned or sticky full-viewport Canvas.
- Implement requestAnimationFrame-based rendering.
- Map normalized scroll progress to frame indices from 0 to 231.
- Ensure all frame transitions are deterministic.
- Draw only when the required frame changes.
- Handle devicePixelRatio for sharp rendering.
- Use aspect-ratio-aware image drawing.
- Clean up animation frames, observers, and listeners.
- Avoid unnecessary React state updates for every frame.
- Support resize and orientation changes.

The animation must feel fluid and precisely tied to user input.

## Scroll Duration

The cinematic reveal should occupy approximately 350vh–450vh of scroll distance on desktop.

The Canvas itself remains sticky at 100vh during the animation.

Avoid an excessively long or unnecessarily slow interaction.

Tune the scrolling distance based on visual pacing and the actual 232 frames.

---

# SEAMLESS IMAGE-TO-WEBSITE BLENDING

**NON-NEGOTIABLE DESIGN REQUIREMENT.**

The website must never appear as though a rectangular image or video has been placed onto an unrelated webpage.

The image sequence and surrounding page must feel like one seamless visual environment.

Implement the following:

1. Analyze the dominant visual colors of the image sequence.
2. Build a coordinated environmental color system using forest greens, muted charcoal, champagne gold, warm ivory, and architectural neutrals.
3. Use matching background tones and layered gradients around the Canvas.
4. Ensure no white flashes, black edges, image letterboxing, or abrupt background changes.
5. Create subtle, carefully positioned environmental overlays where useful.
6. Use controlled gradient transitions at the end of the animation into the following content section.
7. Any gradient must complement the actual frame colors rather than obscure the architecture.
8. Maintain consistent visual identity between the forest reveal and the architectural content.

Prefer full-viewport image coverage using object-fit-cover equivalent Canvas logic, while preserving the correct architectural proportions and visually important regions.

On mobile, use intelligent cropping or an alternative layout when necessary. Do not distort the imagery.

The transition from the final image frame into the next content section should feel physically continuous.

---

# ART DIRECTION

The aesthetic should communicate:

**Quiet Luxury. Architectural Precision. Nature. Exclusivity. Timeless Elegance.**

Reference the sophistication of premium architectural studios, luxury hospitality websites, and high-end editorial publications.

Avoid the visual language of mass-market real estate websites.

No excessive gradients, glassmorphism, glowing borders, neon colors, heavy shadows, stock UI components, or generic SaaS-style cards.

Use meaningful negative space, deliberate composition, understated animation, and excellent typography.

## Color Palette

Initial design tokens:

- Deep Forest: #142820
- Dark Moss: #243B2E
- Warm Ivory: #F2EEE5
- Champagne Gold: #C8B27F
- Charcoal: #171B19
- Muted Stone: #A9A69C

These are starting points, not rigid requirements.

Adjust environmental backgrounds to the actual image colors to achieve seamless blending.

Gold should be an accent, not a dominant background color.

---

# TYPOGRAPHY

Typography should feel rich, classic, timeless, and editorial.

Use a sophisticated serif display typeface paired with a restrained modern sans-serif.

Suggested pairings:

- Cormorant Garamond + Manrope
- Bodoni Moda + Inter
- DM Serif Display + DM Sans

Choose the combination that best complements the architectural imagery.

Typography rules:

- Large expressive editorial headlines.
- Refined serif typography for primary statements.
- Clean sans-serif for navigation and supporting copy.
- Excellent kerning and line-height.
- Carefully managed desktop and mobile line breaks.
- Subtle uppercase tracking for labels.
- No heavy bold typography everywhere.
- No exaggerated text effects.

Typography must feel integrated with the visuals, never randomly floating above them.

---

# WEBSITE EXPERIENCE & STRUCTURE

## SECTION 1 — Cinematic Opening

Full-viewport forest image.

The first frame appears immediately.

Use restrained typography with a sophisticated entrance animation.

Suggested copy:

EASTERN CHAMBER

"A WORLD-CLASS
EPICENTRE UNFOLDS"

Supporting text:

"An architectural expression of ambition, elegance, and timeless design."

Include a subtle vertical scroll indicator.

The headline must not obstruct the important opening view of the building.

As the user starts scrolling, text gently fades away and the image sequence takes visual priority.

## SECTION 2 — The Architectural Reveal

This is the signature scrollytelling experience.

The entire viewport is occupied by the scroll-controlled sequence.

The camera gradually moves from dense mangrove vegetation toward the building and ultimately reveals the elevation.

Use the 232 supplied frames directly.

Do not introduce distracting UI elements during the reveal.

Optional minimal editorial text moments can appear at carefully selected scroll positions:

"Rooted in Nature."

"Defined by Vision."

"Designed to Inspire."

These should fade in and out delicately, remaining subordinate to the architectural imagery.

Never display all three simultaneously.

Avoid blocking the central building.

The reveal must remain the primary visual focus.

## SECTION 3 — The Grand Reveal

At frame 232, hold the final full-building composition briefly through additional scroll distance.

The user should have enough visual breathing room to appreciate the entire architectural elevation.

Introduce the primary statement:

"An Address Beyond the Ordinary."

Animate the typography with subtle opacity and vertical movement.

Avoid aggressive scaling or dramatic bouncing.

Ensure the text is placed over an area that does not obstruct key architectural details.

## SECTION 4 — Architecture as an Experience

Transition seamlessly from the final elevation into an elegant editorial content section.

Suggested headline:

"Designed to Leave an Impression."

Supporting copy:

"A thoughtful convergence of contemporary architecture, refined spaces, and a setting that celebrates the extraordinary."

Use large typography, disciplined grids, generous whitespace, and subtle section transitions.

If additional architectural images are not provided, do not invent project renders. Use sophisticated typography, restrained layout, and the available real assets.

## SECTION 5 — The Essence of Eastern Chamber

Create an elegant, minimal introduction to the project's design philosophy.

Focus on nature, architectural clarity, and distinction.

Use editorial layouts rather than generic feature cards.

Do not invent factual claims about building amenities, certifications, location benefits, floor area, leasing availability, or specifications.

Use editable placeholders wherever verified project information is required.

## SECTION 6 — Closing Experience

A refined full-width closing section with elegant typography.

Suggested statement:

"Discover a Different Perspective."

Include a restrained call to action:

"Enquire Now"

The navigation and CTA should be functional and accessible, with contact details configured through editable site content.

---

# NAVIGATION

Build a premium minimalist navigation system.

Desktop:

- Eastern Chamber wordmark on the left.
- Architecture / Vision / Experience navigation.
- Enquire CTA on the right.

Navigation should remain discreet and responsive to background contrast.

The navigation may begin transparent over the forest scene and transition into an appropriate style as the user moves beyond the hero.

Mobile:

Use a clean accessible navigation menu with refined motion.

Avoid bulky mobile navigation or overcrowded controls.

---

# MICROINTERACTIONS

Create premium, restrained interactions.

Examples:

- Smooth headline reveals.
- Subtle text clipping and opacity transitions.
- Elegant hover underlines.
- Minimal CTA motion.
- Gentle scroll indicator animation.
- Carefully timed section transitions.

Animations must have a purpose.

Avoid unnecessary motion, exaggerated scaling, floating elements, magnetic gimmicks, or distracting cursors.

The website should feel directed, not decorated.

---

# PERFORMANCE ENGINEERING

Image sequence performance is critical.

The provided ZIP contains 232 JPG frames.

Do not import all images directly into the React component as bundled modules.

Extract assets into a predictable public directory, for example:

`/public/sequence/frame-001.jpg`

Maintain zero-padded numbering.

Implement an intelligent image-loading strategy:

1. Load frame 001 immediately.
2. Prioritize the first few frames for immediate interaction.
3. Progressively preload the remaining frames.
4. Prioritize images surrounding the current scroll position.
5. Decode images before drawing whenever possible.
6. Prevent blank Canvas states during loading.
7. Use a bounded decoded-frame cache appropriate for device memory.
8. Avoid repeatedly fetching or decoding already available frames.
9. Prevent long main-thread blocking.
10. Preserve scroll responsiveness under normal CPU and network conditions.

Evaluate whether `createImageBitmap()` or predecoded `HTMLImageElement` caching is most appropriate.

Use browser-supported features and implement reliable fallbacks.

Where beneficial, provide a build-time image optimization script to produce appropriately sized desktop and mobile assets.

Do not load 232 full-resolution images into memory simultaneously on mobile devices.

Ensure the actual scroll position remains authoritative even while assets load. If the exact frame is not ready, temporarily retain the closest decoded frame rather than flashing an empty canvas.

---

# RESPONSIVE EXPERIENCE

Desktop is the primary cinematic canvas, but mobile must feel intentional.

Build and test:

- Desktop widescreen.
- Laptop.
- Tablet.
- Mobile portrait.

On mobile:

- Preserve architectural framing.
- Adjust text sizes and positioning.
- Use adaptive scroll distance.
- Avoid horizontal overflow.
- Support touch scrolling.
- Reduce unnecessary performance overhead.
- Prevent heavy memory usage.

Respect `prefers-reduced-motion`.

For reduced-motion users, provide a simplified experience using meaningful static frames and accessible content, without forcing scroll-scrubbing animation.

---

# TECHNICAL ARCHITECTURE

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Motion for React / Framer Motion
- HTML5 Canvas
- Browser-native APIs where appropriate

Use GSAP ScrollTrigger only if the implementation genuinely benefits from it. Do not add competing scroll controllers without a reason.

Suggested architecture:

`app/page.tsx`

`app/layout.tsx`

`app/globals.css`

`components/navigation.tsx`

`components/sequence-canvas.tsx`

`components/scroll-story.tsx`

`components/editorial-section.tsx`

`components/closing-section.tsx`

`hooks/use-image-sequence.ts`

`lib/sequence.ts`

`public/sequence/`

`public/fonts/` (only where properly licensed assets are available)

`content/site.ts`

Structure components for maintainability rather than creating one enormous page component.

---

# QUALITY CONTROL & ACCEPTANCE CRITERIA

The implementation is not complete until these are satisfied:

1. Frame 001 displays correctly at page load.
2. Frame 232 displays correctly at the final reveal.
3. All 232 frames are used in the correct order.
4. Scrolling backward correctly reverses the sequence.
5. Stopping the scroll stops the animation.
6. Rapid scrolling does not break synchronization.
7. The hero has no visible background seams.
8. There are no blank Canvas flashes.
9. Images are not stretched or distorted.
10. The building retains its original visual identity.
11. Typography feels genuinely premium and editorial.
12. The overall website has a consistent luxury design system.
13. Desktop and mobile layouts work correctly.
14. The page has no unnecessary horizontal scrolling.
15. Motion remains responsive and reasonably smooth.
16. The website does not rely on autoplay video.
17. The page is accessible and respects reduced-motion preferences.
18. The project builds successfully without TypeScript errors.
19. Missing project facts remain editable placeholders rather than invented claims.
20. The final result is visually compelling, not merely technically functional.

---

# EXECUTION INSTRUCTIONS

Do not simply explain how to build this website.

**Actually implement the complete working project.**

First inspect the repository and supplied sequence assets.

If the repository is empty, initialize a new Next.js project.

Extract, verify, and organize all 232 images.

Then build the scroll-linked animation engine, followed by the visual layout, responsive styles, and microinteractions.

Make sensible creative decisions autonomously.

Focus your engineering effort first on the scroll-scrubbed Canvas and seamless visual integration. These are significantly more important than adding extra landing page features.

Run the application, check for runtime and compilation errors, and fix issues before declaring completion.

If browser automation or screenshot testing tools are available, inspect the actual rendered desktop and mobile experience. Refine spacing, typography, cropping, and visual continuity based on the rendered output.

At the end, provide:

- A concise summary of what was implemented.
- The files and components created.
- Installation and local development instructions.
- Any technical trade-offs.
- Anything still requiring verified project content.

**Creative benchmark:** The finished experience should feel like a luxury architectural film that visitors control through scrolling, not like a traditional website with images and animations added afterward.

Prioritize cinematic continuity, performance, visual restraint, and exceptional execution.