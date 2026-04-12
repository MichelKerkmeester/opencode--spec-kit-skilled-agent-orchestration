---
title: "Decision Record: Phase 001 - Claude Optimization Settings (Reddit field-report audit)"
description: "Four key decisions made during the 13-iteration deep-research run: source framing, discrepancy handling, prioritization framework, and implementation deferral."
trigger_phrases:
  - "claude optimization decisions"
  - "reddit post framing decision"
  - "denominator discrepancy decision"
  - "phase 005 deferral"
importance_tier: "important"
contextType: "research"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]

---
# Decision Record: Phase 001 - Claude Optimization Settings (Reddit field-report audit)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat the Reddit post as a primary-source field report, not an implementation spec

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **First stated** | Iteration 001 (phase-research-prompt.md §3 Task framing; iteration-001.md Finding F1 context) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The primary research target for this phase is `external/reddit_post.md`, a narrative document where a single author reports auditing 858-926 Claude Code sessions (the header and body use different totals) and proposes configuration changes, hooks, and a token auditor. The document mixes quantitative findings, product commentary, operational heuristics, and implementation proposals in one stream. We needed to decide how to treat it: as a spec to follow, as anecdotal opinion to discount, or as field evidence to analyze.

### Constraints

- The post is authored by one person; the dataset is one user's 33-day run, not a controlled study.
- The audit methodology is described in enough detail to analyze (session counts, idle-gap percentages, cliff events, tool-call breakdown), but the raw data is not available for independent verification.
- Some post claims have unresolved internal inconsistencies (see ADR-002).
- phase-research-prompt §§3, 8 explicitly say "treat the post as a primary-source field report" and "Do not treat the Reddit post as an implementation spec."
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

We chose to treat the Reddit post as a primary-source field report: a document of real observed patterns, analyzed with appropriate skepticism about exact numbers but respected for the structural claims and waste taxonomy it describes.

How it works: each finding anchors to a specific paragraph in the post ("Source passage anchor" + "Source quote"), separates what the post documents from what it implies for this repo, and labels each recommendation as `adopt now`, `prototype later`, or `reject` based on evidence quality and repo fit rather than on blind application of the post's prescriptions.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Primary-source field report** (chosen) | Preserves nuance; allows critique; produces actionable but honest labels | Requires more analytical work than "just follow the post" | 9/10 |
| Implementation spec to follow | Simple; fast to execute | Would bypass repo cross-check; would adopt latency/discoverability claims that lack evidence; would ignore scope boundary with phase 005 | 3/10 |
| Anecdotal opinion to discard | Avoids risk of acting on one user's data | Loses genuine waste taxonomy, hook design concepts, and audit methodology that have independent value regardless of exact numbers | 2/10 |

**Why this one**: The post uses large session counts and provides explicit waste categories with quantitative framing. That makes it analyzable as evidence. Treating it as a pure implementation spec would suppress legitimate uncertainty about exact numbers; treating it as anecdote would discard valid structural findings.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every finding is grounded in an exact passage, which makes it reviewable and debatable.
- Recommendation labels reflect actual evidence quality, not assumed validity.
- The repo avoids adopting unvalidated latency claims or importing implementation scope that belongs to phase 005.

**What it costs**:
- More analytical overhead per finding than a direct "copy this config" pass. Mitigation: the iteration model with externalized state handles this incrementally across 13 loops, including the skeptical extension.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future summaries quote findings as if they were replicated results rather than sourced claims | Med | `research/research.md` §2 opens with source-framing language; ADR-001 is explicit about the distinction |
| Post's methodology is internally inconsistent enough to undermine architectural conclusions | Low | `research/research.md` §2 argues discrepancies weaken exact prevalence but not structural conclusions; ADR-002 handles this separately |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a source-framing decision, findings would vary in analytical rigor across iterations |
| 2 | **Beyond Local Maxima?** | PASS | Three treatment options considered; reasons for rejection of each are documented |
| 3 | **Sufficient?** | PASS | Passage-anchored finding schema is the simplest approach that produces verifiable evidence |
| 4 | **Fits Goal?** | PASS | Goal is an evidence-anchored recommendation set; this framing delivers exactly that |
| 5 | **Open Horizons?** | PASS | Future phases (005, later research) can cite findings from this phase without re-reading the source |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `research/research.md` opens with a source-framing section (§2) that defines the post's status before any findings appear
- Every finding in `research/research.md` §4 uses the compact schema: source passage anchor, source quote, what it documents, why it matters for this repo, recommendation label
- phase-research-prompt §3 Task framing is preserved in deep-research-strategy.md §2 Topic

**How to roll back**: If the source framing is found to be overly charitable or insufficiently charitable, edit `research/research.md` §2 to adjust the framing statement; findings do not need to change because they are already passage-anchored.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Preserve the 926-vs-858 sessions and 18,903-vs-11,357 turns denominator discrepancies explicitly

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **First stated** | phase-research-prompt §5 instruction 4; confirmed in iteration-001.md source map; formalized in iteration-004.md F3 (discrepancy preservation finding) |

---

### Context

The Reddit post contains two unresolved numeric mismatches that cannot be resolved from within the document:

1. **Session-count mismatch**: The post header says "i did audit of 926 sessions"; the body uses "858 sessions" and "18,903 turns" as the working dataset throughout.
2. **Turns-denominator mismatch**: The headline total is "My stats: 858 sessions. 18,903 turns." but the cache-expiry claim uses "54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes." The post never explains why 11,357 rather than 18,903 is the relevant denominator.

We had to decide whether to smooth these into a single normalized total or preserve them.

### Constraints

- phase-research-prompt §5 instruction 4 explicitly says "preserve the discrepancy explicitly instead of normalizing the numbers silently."
- Smoothing would introduce artificial precision that the source itself does not support.
- Later planning documents could inherit the smoothed total and make incorrect extrapolations.

---

### Decision

We chose to preserve both discrepancies explicitly in every document that references the session or turn counts.

How it works: `research/research.md` §2 contains a discrepancy table with both mismatches, their anchor sentences, and an explanation of why they weaken exact prevalence claims but not architectural conclusions. spec.md §6 carries both as risk items. decision-record.md (this document) and implementation-summary.md both note the discrepancies. No document in this spec set contains a normalized total.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve both discrepancies** (chosen) | Honest; downstream planning can bound precision correctly; future reviewers can verify the source | Slightly less clean than a single number | 9/10 |
| Use the body dataset (858/18,903) and note 926 as a typo | Practical; aligns with what the body actually uses | Invents an explanation ("typo") not in the source; suppresses legitimate uncertainty | 4/10 |
| Use the headline figure (926) throughout | Consistent with the post's title claim | Contradicts the body analysis which uses 858; creates an even larger inconsistency | 2/10 |
| Average or weighted combine | Mathematically tidy | Produces a number that appears nowhere in the source; fabricates precision | 1/10 |

**Why this one**: The source explicitly uses different numbers in different places. The right response is to show both, explain the gap, and let the reader decide how much precision to draw from the prevalence claims.

---

### Consequences

**What improves**:
- Planning documents built on this research cannot accidentally inherit artificial precision.
- Structural conclusions (cache expiry is dominant waste, hook design is worth prototyping, JSONL auditing is fragile) stand independently of the exact percentages.

**What it costs**:
- Slightly more verbose source citations. Mitigation: the discrepancy table in `research/research.md` §2 is the canonical reference; other documents can point there rather than re-explain.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future summaries smooth the discrepancy for convenience | Med | NFR-D01 in spec.md makes preservation a non-functional requirement; this ADR formalizes the rationale |
| Post author clarifies in a comment; this phase cannot update | Low | The post is treated as a static primary source; if new authoritative information appears, a follow-up note can be added to `research/research.md` §2 without changing the finding structure |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without this decision, different documents might independently choose different totals |
| 2 | **Beyond Local Maxima?** | PASS | Four options considered; the others all require inventing an explanation the source does not provide |
| 3 | **Sufficient?** | PASS | A two-row discrepancy table in `research/research.md` §2 is the simplest complete solution |
| 4 | **Fits Goal?** | PASS | The goal is an evidence-anchored recommendation set; this preserves the evidence integrity |
| 5 | **Open Horizons?** | PASS | Future phases can cite the discrepancy table rather than re-deriving it |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `research/research.md` §2 discrepancy table: two rows, each with the anchor sentence and a "Why it matters" explanation
- spec.md §6 risk table: R-001 and side-note covering both discrepancies
- decision-record.md ADR-002 (this document): formal rationale
- implementation-summary.md limitations section: notes both discrepancies as preserved intentionally

**How to roll back**: If a future authoritative clarification from the post author resolves the mismatch, update `research/research.md` §2 discrepancy table with the resolution, remove or supersede this ADR, and add a note in any document that previously cited the preserved discrepancy.

---

### ADR-003: Apply the four-tier prioritization framework from phase-research-prompt §10.3

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **First stated** | phase-research-prompt §10.3; applied in iteration-001.md; formalized in iteration-006.md tier table |

---

### Context

The research produced 56 raw findings across 13 iterations that needed to be ranked for actionability. Without a consistent prioritization framework, different readers might rank the same findings differently depending on their role (config-focused, hook-focused, instrumentation-focused). phase-research-prompt §10.3 provided an explicit four-tier ordering: config changes first (high-impact / low-effort), then hook implementations (high-impact / medium-effort), then behavioral changes (lower effort, documentation-first), then instrumentation-heavy or format-fragile ideas last.

### Constraints

- The repo already has `ENABLE_TOOL_SEARCH=true`, which changes the tier-1 situation: the highest-leverage config recommendation is already adopted, so tier-1 work is validation rather than a new flip.
- Some findings span multiple categories (e.g., discrepancy preservation is both a process change and a research quality rule).

---

### Decision

We chose to apply the four-tier framework as the primary ranking dimension, with the hybrid label allowed for findings that span two categories.

How it works: each finding in `research/research.md` §4 carries a "Tier: 1/2/3/4" label. In the final F1-F24 ledger, Tier 1 contains the config baselines and prerequisite synthesis safeguards (F1, F2, F13, F19, F20, F21, F24); Tier 2 contains the hook and observability-adjacent prototype work (F4, F6, F7, F10, F14, F16, F18, F22); Tier 3 contains the behavioral/documentation changes and planning guardrails (F3, F8, F11, F12, F23); Tier 4 contains the highest-risk or later-phase remedy and portability items (F5, F9, F15, F17). The final tier ordering is recorded in `research/research.md` §12 and iteration-012.md.

#### Amendment 2026-04-07

After iteration 008 reached a synthesis-ready baseline, the loop was extended from 8 to 13 iterations by user request via `cli-codex` `gpt-5.4` high reasoning so the final F1-F24 tier map would incorporate an independent skeptical pass before closeout.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four-tier framework** (chosen) | Directly maps to effort and adoption risk; aligns with phase-research-prompt §10.3; consistent across 24 findings | Tier labels are somewhat coarse; some findings span tiers | 9/10 |
| Impact-effort matrix only (no tier labels) | More granular; per-finding positioning | More subjective; harder to compare across findings without shared tier labels | 6/10 |
| Adopt-now / prototype-later / reject only (no tiers) | Simpler; matches recommendation label granularity | Loses effort differentiation between hook work (medium effort) and config work (low effort) | 5/10 |
| No ranking framework; alphabetical | Zero friction to apply | Useless for planning prioritization | 1/10 |

**Why this one**: The framework was specified in the phase prompt, aligns with the repo's known effort profile (config changes are lower friction than hook engineering), and produces findings that are directly actionable for planning downstream phases.

---

### Consequences

**What improves**:
- Downstream phases can filter `research/research.md` §4 by tier to find the lowest-friction changes first.
- The tier-2 cluster (hook work) maps naturally to a future hook-implementation spec without needing re-ranking.
- The tier-4 cluster (observability work) is clearly separated from the tier-3 behavioral changes that can be shipped as documentation immediately.

**What it costs**:
- Hybrid findings (e.g., F8, F11, F13) need both a primary tier and a category label. Mitigation: both fields are present in the finding schema.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tier labels drift across future documents referencing these findings | Low | `research/research.md` §4 is the canonical tier source; other documents should reference finding IDs rather than re-assign tiers |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 56 raw findings need consistent ranking for planning use |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives considered; the four-tier framework is the only one that maps to effort levels |
| 3 | **Sufficient?** | PASS | Tier 1-4 plus hybrid label covers all 24 findings without forcing artificial categorization |
| 4 | **Fits Goal?** | PASS | Goal is actionable recommendations for downstream planning; tier labels enable that directly |
| 5 | **Open Horizons?** | PASS | Future additions to the finding set can use the same tier labels without restructuring |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `research/research.md` §4: each finding has "Tier: 1/2/3/4" field
- `research/research.md` §12 convergence report: tier distribution T1=7, T2=8, T3=5, T4=4
- iteration-012.md: updated tier table plus recommendation flips across F1-F24
- iteration-013.md: amendment landing pass that applied the updated F1-F24 ordering into `research/research.md`

**How to roll back**: If the phase-research-prompt tier framework is revised in a future phase, re-run the tier assignment across F1-F24 in `research/research.md` §4 and update the iteration-012/013 amendment trail.

---

### ADR-004: Defer the auditor implementation to phase 005-claudest; this phase owns only the recommendation set

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **First stated** | phase-research-prompt §4.1, §4.2 cross-phase table, §8 Don'ts; reinforced in iteration-006.md boundary paragraph; formalized in research.md §9 |

---

### Context

The Reddit post describes a token-usage auditor (`claude-memory` plugin on `claudest` marketplace, `/get-token-insights` skill) and its implementation: JSONL parsing, SQLite normalization, waste classification, dollar estimation, interactive dashboard. That implementation detail is analytically interesting but belongs to a sibling phase. We needed to decide whether this phase should investigate or partially replicate that implementation work.

Phase `005-claudest` was pre-designated as the implementation-provenance packet for exactly this purpose (per cross-phase awareness table in phase-research-prompt §4.2). Building or deeply analyzing the auditor implementation in phase 001 would duplicate that work and blur the ownership boundary.

### Constraints

- phase-research-prompt §8 explicitly says "Don't conflate this phase with phase 005-claudest; this phase owns the what and why, while phase 005 owns the implementation-oriented how."
- phase-research-prompt §10.2 Out of Scope list includes "full claudest plugin implementation analysis."
- The iteration runner was LEAF-only (no sub-agent dispatch); building implementation artifacts was not possible within the constraint anyway.

---

### Decision

We chose to keep phase 001 as the decision/adoption layer and defer all implementation provenance to phase 005-claudest. The allowed overlap is one-way and narrow: phase 001 may cite phase 005 only to point at the concrete implementation home of the auditor; phase 005 may cite phase 001 only to explain why the implementation matters.

How it works: `research/research.md` §9 contains a single boundary paragraph. This phase's findings that reference the auditor (F14, F16, F17) are labeled "prototype later" and their "Affected area" fields point to the phase 005 folder path rather than prescribing implementation steps.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer to phase 005** (chosen) | Clean scope separation; no duplication; phase 001 deliverable is focused on the recommendation set | Some readers may want implementation detail in the same document | 9/10 |
| Include a partial auditor design in phase 001 | Single-document completeness | Duplicates phase 005 scope; phase 001 runner was LEAF-only and could not safely do deep implementation analysis | 2/10 |
| Merge phases 001 and 005 into one | No boundary overhead | Phases were pre-designated with different targets (post audit vs implementation walkthrough); merging would require re-scoping both | 2/10 |

**Why this one**: The phases were intentionally separated in the cross-phase awareness table. Phase 001's value is in the evidence extraction and recommendation labels, not the implementation. Mixing them would dilute both.

---

### Consequences

**What improves**:
- Phase 001 deliverable is fully self-contained: a recommendation set, not a partial implementation.
- Phase 005 can receive F14/F17 findings as a clean input set rather than having to reconcile partial implementation analysis from this phase.
- The boundary is easy to enforce in future documents: any `claude-memory` or `get-token-insights` implementation detail belongs in 005, not 001.

**What it costs**:
- Prototype-lane findings (F4-F7, F14, F15, F17) cannot be validated until phase 005 ships. Mitigation: those findings are explicitly labeled "prototype later" and their validation cost is noted in `research/research.md` §10 risks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 005 delay blocks the Tier 2/4 findings indefinitely | Low | Phase 001's recommendation set is already complete; phase 005 delay does not change the what/why labels |
| Future authoring accidentally re-introduces implementation content into phase 001 documents | Med | Out of Scope list in spec.md §3, boundary paragraph in `research/research.md` §9, and this ADR all serve as guardrails |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without this decision, every author touching phase 001 would need to independently decide how much implementation detail to include |
| 2 | **Beyond Local Maxima?** | PASS | Three options considered; the partial-implementation option has no benefit that outweighs the duplication cost |
| 3 | **Sufficient?** | PASS | One boundary paragraph in `research/research.md` §9 plus this ADR is the minimum necessary to enforce the separation |
| 4 | **Fits Goal?** | PASS | Phase 001's goal is a recommendation set; this ADR keeps the work focused on that goal |
| 5 | **Open Horizons?** | PASS | Phase 005 retains full freedom to design the implementation without being constrained by partial design choices made in phase 001 |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `research/research.md` §9: boundary paragraph stating one-way narrow overlap rule
- `research/research.md` §4 F14, F16, F17: affected-area fields point to phase 005 folder, not to implementation paths inside this phase
- spec.md §3: Out of Scope includes "Plugin implementation (lives in 005-claudest)"
- implementation-summary.md: next-phase ownership section states boundary

**How to roll back**: If the phases are merged or re-scoped, remove `research/research.md` §9 boundary paragraph and re-assign F14/F16/F17 affected areas to reflect the new ownership.
