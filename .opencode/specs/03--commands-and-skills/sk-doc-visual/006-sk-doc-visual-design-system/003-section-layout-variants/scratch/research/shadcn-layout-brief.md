Here is the research report on shadcn-inspired documentation layout patterns adapted for the sk-doc-visual enterprise theme.

# Documentation Layout Patterns: Shadcn-Inspired Enterprise Docs

Based on research into shadcn/ui blocks and documentation patterns, here are reusable layout motifs adapted for enterprise technical documentation using the sk-doc-visual theme, prioritizing information density and clean aesthetics over flashy trends.

## 1. Reusable Layout Motifs

*   **The Inset Dashboard:** A main content area wrapped in a subtle border (`--border-light`) with rounded corners (`--radius-card`), separating the reading pane from a persistent sidebar.
*   **The Bento Feature Grid:** Asymmetric grid layouts for feature highlights, using distinct surface layers (`--surface-l2`, `--surface-l3`) instead of shadows to create depth.
*   **The Stepper List:** Vertical, numbered timelines for setup processes with connected lines (`--border-faint`) to guide the eye through multi-step operations.
*   **The Tabbed Terminal:** Code blocks with integrated tab bars for language switching, wrapped in `--surface` with a unified copy action.
*   **The Split Pane:** Two-column layouts for API references where prose sits on the left (`--text`) and interactive code/JSON responses sit sticky on the right (`--surface-l2`).
*   **The Accordion FAQ:** Collapsible rows for troubleshooting that keep vertical rhythm tight, separated by `--border-faint`.
*   **The File Tree:** A collapsible, nested directory structure for extensibility and architecture sections, mimicking an IDE sidebar.
*   **The Navigation Footer:** "Previous/Next" blocks at the bottom of pages styled as muted, full-width cards (`--surface-l2`) with arrows.

## 2. Motif Mapping to the 8 Standard Sections

1.  **Hero / Introduction:** **Minimalist Header & Breadcrumbs.** High-contrast typography (`--size-h1`, `--weight-semibold`) with a subtle metadata row (author, date, tags) in `--text-muted`.
2.  **Quick Start:** **Tabbed Terminal & Stepper List.** Step-by-step numbered guide alongside unified command-line block components.
3.  **Feature Grids:** **The Bento Feature Grid.** 2x2 or 3x3 asymmetric grids highlighting core capabilities using muted icons and brief `--text-muted` descriptions.
4.  **Operations Overview:** **Inset Dashboard & Status Tables.** Clean data tables with sticky headers, utilizing `--success-alpha` or `--warning` dots for service health indicators.
5.  **Setup / Usage:** **The Split Pane.** Prose explanation on the left, corresponding configuration code blocks on the right.
6.  **Support / Troubleshooting:** **The Accordion FAQ & Alert Callouts.** Collapsible sections for common errors. Callouts use `--surface-l3-alpha` with left borders indicating severity (e.g., `--error`).
7.  **Extensibility / Architecture:** **The File Tree & Reference Tables.** IDE-style navigation for plugin structures and dense property tables for API endpoints.
8.  **Related Docs:** **The Navigation Footer.** Large clickable regions for "Next Steps" formatted as subdued cards.

## 3. Anti-Flashy Adaptation Rules

To ensure these patterns remain suitable for enterprise technical documentation, apply these constraints:

*   **Depth via Surface, Not Shadows:** Eliminate drop shadows. Use layer stacking (`--bg` -> `--surface` -> `--surface-l2` -> `--surface-l3`) to denote elevation and hierarchy.
*   **Subtle Borders over Gradients:** Replace trendy gradient borders with solid, low-opacity strokes (`--border-light` or `--border-faint`).
*   **Restrained Interactive States:** Hover effects should be limited to subtle background shifts (e.g., swapping to `--surface-l2`) or border color changes (using `--transition-card`), avoiding scale/transform animations.
*   **Semantic Color Scarcity:** Reserve the brand accent (`--accent`) strictly for primary actions, active navigation states, and focus rings (`--accent-border`). Do not use it for decorative backgrounds.
*   **Typography over Decoration:** Rely on font weight (`--weight-medium`, `--weight-semibold`) and color contrast (`--text` vs `--text-muted`) to establish hierarchy, rather than colored background chips.

## 4. Uniqueness Levers (Creating Variants)

To prevent sections from looking perfectly uniform while maintaining enterprise consistency, manipulate these implementation-neutral levers:

*   **Radius Tuning:** Toggle between `--radius-card` (12px) for standard content blocks and `--radius-bento` (16px) for high-level feature overviews.
*   **Density Controls:** Alternate between compact spacing (`--lh-tight` with 1rem padding) for data tables/API properties and spacious layouts (`--gap-lg`) for introductory prose and conceptual diagrams.
*   **Border Presence:** Switch between "bordered" variants (1px solid `--border-light`) for distinct interactive elements and "borderless" variants (relying purely on `--surface` contrasts) for a flatter, more modern reading experience.
*   **Alignment Shifts:** Move from standard left-aligned content for dense technical text to center-aligned layouts for high-level summaries or empty states.
