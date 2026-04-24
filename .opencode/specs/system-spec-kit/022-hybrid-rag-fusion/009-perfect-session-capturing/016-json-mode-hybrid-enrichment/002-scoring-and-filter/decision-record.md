---
title: "...brid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/002-scoring-and-filter/decision-record]"
description: "Three architecture decisions: bonus system removal from quality scorer, contamination filter scope expansion to 4 additional text fields, and post-save review penalty integration into quality_score."
trigger_phrases:
  - "scoring filter decisions"
  - "quality scorer bonus removal decision"
  - "contamination filter scope decision"
  - "post-save penalty integration"
  - "adr-001 adr-002 adr-003 scoring filter"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/002-scoring-and-filter"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Scoring and Filter

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Remove Bonus System from Quality Scorer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | Implementation author |

---

<!-- ANCHOR:adr-001-context -->
### Context

The extractors quality scorer (extractors/quality-scorer.ts:113-205) applies bonuses of +0.05 for message count, +0.05 for tool usage, and +0.10 for decisions present — a combined maximum of +0.20. HIGH-severity findings block writes upstream and never reach the scorer. The maximum reachable penalty at the scorer level is MEDIUM severity at -0.15. This means five simultaneous soft failures (5 * -0.03) = -0.15, combined with all three bonuses (+0.20), produces a final score of 1.05 — clamped to 1.00. Even a session with no bonuses but five soft failures scores 0.85. The score provides no useful discrimination between good and bad saves. This was confirmed by Round 2 research (Domain C, finding #2, research/research.md).

### Constraints

- The scorer is imported at workflow.ts:39 from `extractors/quality-scorer.ts`; core/quality-scorer.ts is dead code and must not be confused with the live scorer
- Calibration tests in quality-scorer-calibration.vitest.ts currently test the wrong (dead) scorer — they must be fixed before recalibration results are meaningful
- Changing scores only affects new saves; historical quality_score values in existing memories are not updated
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Remove all three bonus additions from extractors/quality-scorer.ts and base the final score solely on penalty accumulation from a 1.0 starting point.

**How it works**: A clean session with no detectable issues scores 1.0. Each penalty reduces the score by its configured weight. The scorer no longer grants bonus points for the presence of normal session content (messages, tools, decisions) — those are baseline expectations, not exceptional qualities.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove bonuses entirely** | Simple, honest, no arbitrary constants remain | Score distribution shifts for new saves | 9/10 |
| Rebalance (halve bonuses, double penalties) | Preserves bonus concept while reducing overcompensation | Still arbitrary, still allows compensation masking | 5/10 |
| Add HIGH penalties that reach the scorer | Would require architecture change to write-block flow | Significant refactoring, out of scope for this phase | 4/10 |

**Why this one**: Removal is simpler and more honest. Bonuses for normal session properties (having messages, having tool calls) reward the minimum expected bar, not quality. A penalty-only system directly maps to: "this save has no detected problems."
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- quality_score becomes a meaningful signal: lower scores reliably indicate problematic saves
- Calibration tests can now produce readable, verifiable thresholds (e.g., "5 medium issues scores 0.85")
- Post-save review penalties (ADR-003) have room to operate without the bonus floor neutralizing them

**What it costs**:
- New saves will score lower than identical sessions saved before this change. Mitigation: document the change; existing scores are grandfathered

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Recalibration breaks existing passing calibration tests | Medium | Fix the test import first (T002); run tests before recalibration |
| Score drop surprises developers who saw "0.98" scores routinely | Low | Document the change in implementation-summary.md |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | research/research.md Domain C finding #2: "quality_score has zero discriminative power" |
| 2 | **Beyond Local Maxima?** | PASS | Rebalancing alternative considered and rejected |
| 3 | **Sufficient?** | PASS | Removing bonuses is the minimal change that restores discrimination |
| 4 | **Fits Goal?** | PASS | Goal is discriminative quality_score; this directly achieves it |
| 5 | **Open Horizons?** | PASS | Penalty-only model is extensible; add penalty types freely without bonus interactions |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- extractors/quality-scorer.ts: Remove the three bonus addition expressions (lines approximately 113-205)
- quality-scorer-calibration.vitest.ts: Fix import on line 5 before recalibration

**How to roll back**: Revert extractors/quality-scorer.ts to the pre-change commit; existing tests will re-pass (they test the wrong scorer anyway until the import is also reverted)
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Extend filterContamination to All Uncleaned Text Fields

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | Implementation author |

---

### Context

The `filterContamination` function is called in workflow.ts at lines 548-602 but only against observation strings and the SUMMARY block. Round 2 research (Domain E, finding #1) identified four text field locations that bypass cleaning entirely:

1. `_JSON_SESSION_SUMMARY` — the raw sessionSummary string, used as a title candidate. AI hedging in this field propagates directly to the memory title.
2. `_manualDecisions` — preserves the original uncleaned AI-generated decision strings.
3. `recentContext` — an array of strings, entirely uncleaned.
4. `technicalContext` — KEY and VALUE strings, entirely uncleaned.

Additionally, the contamination-filter.ts pattern list covers 29 actual patterns despite documentation claiming 74, and is missing 7 whole categories: hedging phrases, conversational acknowledgment, meta-commentary, instruction echoing, markdown artifacts, safety disclaimers, and redundant certainty markers.

### Constraints

- filterContamination is a pure string-transformation function; extending its call sites does not require changing its signature
- Array fields (recentContext, manualDecisions) require looped application
- undefined-safety is required for optional fields (_JSON_SESSION_SUMMARY may be absent)

---

### Decision

**We chose**: Extend filterContamination call sites in workflow.ts to cover all four uncleaned field locations, and add the 7 missing pattern categories to contamination-filter.ts.

**How it works**: Each new call site applies the existing filterContamination function to the field's string value(s) before they reach template assembly. The function signature is unchanged. Pattern additions follow the existing array-of-strings structure in contamination-filter.ts.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend existing call sites** | Minimal change; reuses proven function | Requires identifying correct insertion points in workflow.ts | 9/10 |
| Apply filter at normalization time (input-normalizer.ts) | Earlier in pipeline; single choke point | Normalization is not the right layer for content cleaning; mixes concerns | 4/10 |
| Add a pre-assembly cleaning pass that covers all fields | Comprehensive | Significant refactoring; new component with its own bugs | 5/10 |

**Why this one**: Targeted call-site extension is the safest, most reviewable change. Each field gets one explicit call, making the coverage auditable by reading workflow.ts.

---

### Consequences

**What improves**:
- All AI-generated text in the save pipeline passes through contamination cleaning before being written to memory
- Hedging, boilerplate, and meta-commentary are removed from title candidates, decision lists, context strings, and technical notes
- Pattern count grows from 29 to 36+ with 7 new categories covering common AI output artifacts

**What it costs**:
- Minor per-save latency increase from 4 additional string-scan passes. Mitigation: each call is O(n) where n is string length; at typical field sizes (<5000 chars), this is negligible

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Safety disclaimer pattern strips "I cannot reproduce the bug" | High (data loss) | Test pattern against representative phrases; use anchored start-of-sentence matching |
| Hedging pattern strips "it seems the build is broken" (valid diagnosis) | Medium | Use precise pattern matching, not substring match for short words |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four text fields confirmed uncleaned in research/research.md Domain E |
| 2 | **Beyond Local Maxima?** | PASS | Three approaches evaluated; targeted extension is best fit |
| 3 | **Sufficient?** | PASS | Covers all identified uncleaned fields; 7 new pattern categories address known gaps |
| 4 | **Fits Goal?** | PASS | Direct path to clean output for all text fields |
| 5 | **Open Horizons?** | PASS | Future fields can be added by extending call sites using the same pattern |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- core/workflow.ts: 4 new filterContamination call sites at lines ~548-602 area; ~20-30 LOC total
- extractors/contamination-filter.ts: 7 new pattern category additions to the existing array

**How to roll back**: Revert the two files; contamination cleaning returns to observations + SUMMARY only

---

### ADR-003: Post-Save Review Findings Feed Back into quality_score

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | Implementation author |

---

### Context

The post-save review module (post-save-review.ts) runs after a memory is saved and compares the saved frontmatter against the original JSON payload. It produces findings at HIGH, MEDIUM, and LOW severity. Currently these findings are surfaced as console output only — they have no effect on the numeric quality_score written to the memory frontmatter. This means a save that produces a HIGH post-save finding (e.g., importance_tier was silently overridden) retains the same quality_score as a clean save. Research Round 2, Domain C, finding #20 identified this as a P2 improvement.

### Constraints

- post-save-review.ts runs after the memory file is written; a score adjustment would require either re-writing the file or storing the delta separately
- The adjustment must not re-trigger the full save pipeline
- Penalty values must be defined as named constants, not inline magic numbers

---

### Decision

**We chose**: Apply a fixed penalty to quality_score based on the highest-severity post-save finding: HIGH = -0.10, MEDIUM = -0.05, LOW = no penalty. The adjusted score is written back to the frontmatter of the already-saved file as a lightweight patch operation.

**How it works**: post-save-review.ts collects findings, computes the maximum severity, applies the corresponding penalty to the quality_score extracted from the saved frontmatter, and patches the frontmatter in-place. The patch is a single YAML key replacement — no full re-parse or re-write.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fixed penalty per max severity** | Simple, predictable, testable | Does not scale with number of findings | 8/10 |
| Scaled penalty (multiply by finding count) | More sensitive to multiple issues | Complex to calibrate; HIGH with 3 findings vs 1 is different | 6/10 |
| No score change; only console output | Zero risk of file corruption | Post-save review findings remain invisible in the stored record | 2/10 |

**Why this one**: Fixed penalty per severity level is simple, immediately understandable when reading a memory file, and testable with a single case per severity level. Scaling by count adds complexity without clear benefit for the typical case.

---

### Consequences

**What improves**:
- quality_score in the saved memory file reflects post-save review findings, not just pre-save scoring
- A HIGH finding (e.g., silent field override) is now visible in the score, making quality audits more informative

**What it costs**:
- The file is written twice: once by the main pipeline, once by the post-save review patch. Mitigation: the patch is a targeted frontmatter key replacement, not a full re-write; risk of corruption is low

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Frontmatter patch corrupts the YAML | High | Unit test the patch operation; include a parse-verify step after patching |
| Penalty values need recalibration after production use | Low | Constants are named and documented; easy to adjust |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Post-save findings currently invisible in stored quality_score |
| 2 | **Beyond Local Maxima?** | PASS | Three approaches evaluated; fixed-penalty is best fit for simplicity |
| 3 | **Sufficient?** | PASS | A HIGH-penalized save will score measurably lower; meets SC-005 |
| 4 | **Fits Goal?** | PASS | Closes the feedback loop between post-save review and the stored quality signal |
| 5 | **Open Horizons?** | PASS | Penalty constants are named; easy to evolve the model |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- core/post-save-review.ts: compute severity penalty, call a frontmatter patch utility
- extractors/quality-scorer.ts or a new utility: expose named penalty constants (HIGH_FINDING_PENALTY = -0.10, MEDIUM_FINDING_PENALTY = -0.05)

**How to roll back**: Remove the patch call from post-save-review.ts; quality_score returns to pre-review value as before

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
