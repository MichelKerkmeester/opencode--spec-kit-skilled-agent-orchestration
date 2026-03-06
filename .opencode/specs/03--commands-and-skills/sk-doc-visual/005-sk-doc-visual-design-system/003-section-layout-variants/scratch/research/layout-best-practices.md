# Technical Documentation Section Layout Design: Best Practices Brief

Based on industry layout, typography, readability, and accessibility standards (WCAG 2.1/2.2) reconciled with the CSS variables in `.opencode/skill/sk-doc-visual/assets/variables/` and SpecKit documentation contracts, here are the best practices for technical documentation design.

### 1. Core Layout Principles
*   **Progressive Disclosure & Hierarchy:** Group content by user task. Use a fixed sidebar (`--sidebar-w: 240px`) for high-level navigation and on-page TOCs with active-dot tracking (`.toc-link.active`) so users know exactly where they are. 
*   **Responsive Containment:** Cap maximum content width (`--container-max: 96rem`) to maintain readability on ultra-wide monitors. Ensure no content overflows by applying `min-width: 0` to flex/grid children and `overflow-x: auto` to `<pre>` blocks.
*   **Semantic Information Architecture:** Strictly order headings (`<h1>` to `<h6>`) for screen readers. Use `.glass-card` wrappers and `.ledger-line` dividers to visually group logical concepts.
*   **Dual-Theme Intentionality:** Treat dark and light modes as equal citizens. Map all colors strictly to CSS variables (e.g., `--bg`, `--surface`, `--text`) and verify contrast ratios in both contexts.

### 2. Typography and Spacing Heuristics
*   **Font Selection:** Use `Helvetica` (or `Inter`) for clean, legible body text. Reserve `JetBrains Mono` for code blocks, ensuring distinct legibility for characters like `l`, `1`, `O`, and `0`.
*   **Readability Constraints:** 
    *   **Width:** Constrain body paragraphs to 60–80 characters (roughly `max-width: 65ch` or 700px) to prevent reading fatigue.
    *   **Height:** Use a relaxed line-height of `1.75` (`--lh-base`) for body copy to help eyes track lines, and a tighter `1.1` (`--lh-tight`) for large headings.
*   **Vertical Rhythm:** Use fluid spacing like `clamp(3rem, 7.5vh, 6rem)` (`--section-y`) between major sections. This guarantees a page passes the "Squint Test," where structural bands remain visible even when blurred.

### 3. Anti-Flashy Guardrails
*   **Subdued Aesthetics:** Rely on subtle depth (`--glass-shadow`, `--border-faint: rgba(255,255,255,0.02)`) rather than heavy drop shadows or generic marketing gradients. The design must pass the "Swap Test" (it should feel strictly built for technical data).
*   **Strict Accessibility over Style:** Never use color as the sole indicator of status. A success badge must have a readable text label, not just a `--success` green dot. Maintain a **4.5:1** contrast ratio for body text against its background (`--surface-l2`).
*   **Motion Restraint:** Animations should be minimal (CSS-first stagger). You **must** provide a reduced-motion fallback (`@media (prefers-reduced-motion: reduce)`) that forces `opacity: 1` and instantly reveals content without transitions.

### 4. Section-Specific Guidance
*   **Hero / Overview:** Start with a "Bottom Line Up Front" approach. Frame the header using the `.terminal-header` shell with a visible `#clock` UTC element. Keep the `h1` massive but concise.
*   **Quick Start:** Prioritize action. Use copy-pasteable `.code-window` components immediately. Avoid long explanatory paragraphs here; focus strictly on execution and expected verification output.
*   **Feature Grid:** Utilize a bento-box grid layout. Apply `--radius-bento` (1rem) to `.glass-card` elements. Keep feature descriptions under 3 lines and use muted accent borders (`--accent-border`) to guide the eye.
*   **Operations Overview:** Use visual timelines (`.flow-step`) and metric bands (`.viz-bar` / `.viz-fill`). If using Mermaid diagrams, you must implement interactive zoom controls (+ / - / reset) and drag-to-pan capabilities.
*   **Setup and Usage:** Use numbered, progressive steps. Highlight critical caveats using semantic `callout` or warning blocks (`--warning` colored borders) rather than burying them in standard text.
*   **Support:** Display support matrices or status checks in a clear, horizontally-scrollable `.data-table`. Keep it highly scannable.
*   **Extensibility:** Hide niche or advanced configuration details behind `<details class="collapsible">` tags. Do not pollute the primary reading path with deep-dive edge cases.
*   **Related Documents:** Use a dedicated footer or `.ledger-line` separated section to provide explicit cross-doc references (e.g., linking `README.md` to `INSTALL_GUIDE.md`). Ensure cross-doc links are logically verified.

### 5. QA Checklist
Before marking any HTML layout delivery as complete, verify:
- [ ] **Squint Test:** Does the page maintain clear visual hierarchy (headings vs. content blocks) when blurred?
- [ ] **Accessibility (WCAG AA):** Does all standard text hit a 4.5:1 contrast ratio? Do all icons/buttons have `aria-label`s? Are status badges color + text?
- [ ] **Overflow Check:** Does the layout stay clean from 320px up to 2560px without a horizontal `<body>` scrollbar? (Check flex-children and `<pre>` tags).
- [ ] **Reduced Motion:** Do all elements render instantly and remain fully usable when `prefers-reduced-motion: reduce` is toggled in DevTools?
- [ ] **Mermaid Interaction:** Do all `.mermaid-wrap` elements have functioning zoom, reset, and pan controls?
- [ ] **SpecKit Metadata:** Are the four required `<meta name="ve-*">` tags (artifact-type, source-doc, speckit-level, view-mode) present in the `<head>`?
- [ ] **Placeholder Leakage:** Have all `[YOUR_VALUE_HERE` and `[PLACEHOLDER]` tokens been successfully removed and resolved?
