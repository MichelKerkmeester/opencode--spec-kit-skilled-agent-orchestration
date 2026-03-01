---
title: "Decision Record: Human Voice Rules — Template Integration [137-readme-and-summary-with-hvr/decision-record]"
description: "The Human Voice Rules exist in a single file at context/Rules - Human Voice - v0.101.md, written for the Barter project. Multiple documentation templates across two separate ski..."
trigger_phrases:
  - "decision"
  - "record"
  - "human"
  - "voice"
  - "rules"
  - "decision record"
  - "137"
  - "readme"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Human Voice Rules — Template Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Standalone Skill Asset vs. Inline Rules

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-19 |
| **Deciders** | Project owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The Human Voice Rules exist in a single file at `context/Rules - Human Voice - v0.101.md`, written for the Barter project. Multiple documentation templates across two separate skills (SpecKit and sk-doc) need access to these rules. The question is how to make them available: copy them into every template, reference the original file, or create a new canonical home.

The original file is Barter-specific in its framing. Its loading condition reads "Always active for any content generation, editing or review task across all Barter AI systems." Its scope section names six Barter content systems. If templates reference it directly, they inherit that framing, which breaks the system-agnostic intent.

### Constraints

- The rules themselves are already well-written and system-agnostic in their actual content; only the framing is project-specific
- The sk-doc skill already has an `assets/documentation/` directory for exactly this kind of reference material
- Templates get copied when writers use them; any referenced file must live at a stable, predictable path
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Create a standalone `hvr_rules.md` at `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md`, extracted from the source document with Barter-specific framing replaced by system-agnostic language.

**Details**: The source content (all 10 sections, all rules) transfers intact. Only the introductory framing, loading condition, and scope statement change. The resulting file lives in the sk-doc skill's assets directory, which is the most logical home for a cross-skill writing standard. Template annotation blocks reference this canonical path.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Standalone hvr_rules.md in workflows-doc** | Single source of truth, stable path, correct abstraction layer, system-agnostic | Requires writers to know the path to reference it | 9/10 |
| Inline rules in every template | Writers see everything without leaving the file | Massive duplication (~750 lines per template), becomes stale as HVR evolves, unmanageable | 2/10 |
| Reference original context/ file directly | Zero extraction work | File is Barter-specific, path is spec-folder-specific (fragile), context/ is not a stable skill asset location | 1/10 |
| Separate hvr_rules.md per skill | Each skill owns its copy | Still duplication, still diverges over time | 4/10 |

**Why Chosen**: The sk-doc skill's assets directory is where this kind of foundational reference material belongs. It's stable, discoverable, and already structured for exactly this pattern. The extraction work is minimal (framing changes only). The alternative — inline duplication — creates a maintenance problem that compounds with every HVR update.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Single update point when HVR evolves — one file to change, all templates benefit automatically
- Clean separation: templates contain guidance, the canonical file contains the full rules
- System-agnostic framing means any future skill can reference the same file

**Negative**:
- Writers using templates in contexts without access to the full skill directory cannot follow the reference — Mitigation: annotation blocks include the top hard-blocker words inline, so the most critical guidance is always present regardless of whether the writer opens hvr_rules.md

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| hvr_rules.md path changes | Medium | Document canonical path in all annotation blocks; skill assets directory is stable by convention |
| Source HVR updates not propagated to standalone | Low | hvr_rules.md header notes the source version; update process documented in this ADR |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Templates currently provide zero voice guidance; this is a real gap causing real documentation quality problems |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives evaluated; standalone canonical asset is the clear winner on maintainability |
| 3 | **Sufficient?** | PASS | One file extraction solves the multi-template reference problem without over-engineering |
| 4 | **Fits Goal?** | PASS | Directly enables the goal: templates that guide human-voice writing |
| 5 | **Open Horizons?** | PASS | System-agnostic framing means any future skill can adopt the same reference without modification |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `context/Rules - Human Voice - v0.101.md` (read-only source)
- `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md` (new file)

**Rollback**: Delete `hvr_rules.md`. No other files depend on it until annotation blocks are added to templates.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Annotation-Based Embedding vs. Mandatory Enforcement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-19 |
| **Deciders** | Project owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

Once the standalone HVR asset exists, the question is how it connects to template usage. Two broad approaches exist: annotation (guidance in the template that writers read and choose to follow) or enforcement (automated checks that reject non-compliant output).

The HVR document is detailed and specific — it lists hard-blocker words, phrase blockers, structural patterns, and soft deductions. A linter that checked all of these would be useful. The question is whether to build that now, or defer it in favour of lighter-weight guidance that delivers most of the benefit immediately.

### Constraints

- Building an HVR linter is a separate project, not within this spec's scope
- Templates are used by AI agents (primarily) not just human writers; guidance in templates shapes AI output by appearing in context
- The annotation must be concise enough to be read, not scrolled past
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Use annotation-based embedding — an HTML comment block placed early in each template — rather than mandatory enforcement scripts.

**Details**: Each template gets an HVR annotation block placed immediately after the SPECKIT_TEMPLATE_SOURCE line. The block uses HTML comment syntax (`<!-- ... -->`), which is visible in source but does not render in Markdown previews. It contains: a reference to the canonical `hvr_rules.md`, the top 10 hard-blocker words to avoid, the 4 most common AI structural patterns to eliminate, and one template-specific guidance note. Maximum 30 lines per block. Automated enforcement deferred to a future spec.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Annotation block in template source** | Zero build time, immediate benefit, shapes AI context window, non-breaking | No enforcement, writers can ignore it | 8/10 |
| HVR linter script run as validate step | Catches violations automatically, measurable compliance | Significant build time, false positives on technical terms, out of scope for this spec | 6/10 |
| Mandatory pre-commit hook | Strongest enforcement, catches violations before commit | Requires linter first; blocks workflow on false positives; complex to maintain | 4/10 |
| No template changes (reference HVR separately) | Zero effort | No discoverability improvement; problem remains | 1/10 |

**Why Chosen**: The annotation approach delivers the core benefit (writer sees guidance before filling in sections) with near-zero implementation risk. For AI agents specifically, the annotation content appears in context when the template is read, which shapes the agent's output without requiring a separate enforcement step. The linter is worth building but belongs in its own spec with proper scope and test coverage for edge cases (technical terms, quoted examples, etc.).
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Templates ship with HVR guidance today, without waiting for a linter build
- AI agents that read templates before filling them in will have HVR context in their working memory
- Non-breaking change — writers who ignore the block are no worse off than before
- Future enforcement can layer on top without changing the template structure

**Negative**:
- No measurable compliance metric until enforcement is added — Mitigation: manual review of completed documents serves as the interim quality check; this spec includes style compliance checklist items for that purpose

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Writers scroll past the annotation | Medium | Keep block under 30 lines; lead with the most impactful rules, not preamble |
| AI agents ignore HTML comments in template | Low | Test empirically; if ignored, consider alternative placement in visible section headers |
| Block becomes stale as HVR evolves | Low | Block references canonical hvr_rules.md; readers can always check the source for updates |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Documentation templates currently give no voice guidance; this is a gap with daily impact on output quality |
| 2 | **Beyond Local Maxima?** | PASS | Four options evaluated including enforcement-first; annotation is the right balance for current scope |
| 3 | **Sufficient?** | PASS | Annotation alone, when read, changes writing behavior; AI agents benefit from in-context guidance without enforcement |
| 4 | **Fits Goal?** | PASS | Goal is better documentation; annotation delivers that through guidance rather than restriction |
| 5 | **Open Horizons?** | PASS | Annotation approach does not preclude future enforcement; enforcement can build on top |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- Six SpecKit template files
- Two sk-doc template files

**Rollback**: Remove inserted annotation blocks. Original template content is unchanged. Git revert handles this cleanly — the diff will show only additions, making rollback exact and safe.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

## Future Decisions

The following decisions are deferred and will need their own ADRs when addressed:

- **HVR Linter**: Build an automated checker for HVR compliance. Needs its own spec — the edge-case handling for technical terms and quoted examples is non-trivial.
- **HVR Versioning**: The source document is v0.101. As the rules evolve, a propagation mechanism from `hvr_rules.md` to annotation blocks needs definition.
- **Scope Expansion**: Whether to add HVR guidance to `spec.md`, `plan.md`, `tasks.md` and `checklist.md` templates (currently out of scope because those templates produce structured data rather than prose).
