---
title: "Feature Specification: Memory Deep Quality Investigation"
description: "Deep audit uncovered 562 systemic quality findings across 16 categories in the memory corpus, pointing to generator-level bugs (broken provenance, empty causal links, noisy trigger phrases, title corruption). This phase investigates root causes and plans generator fixes."
trigger_phrases:
  - "memory generator bugs"
  - "memory deep quality investigation"
  - "causal links broken"
  - "trigger phrases n-gram noise"
  - "provenance empty memory"
  - "title path suffix corruption"
  - "generate context bugs"
importance_tier: "important"
contextType: "research"
---
# Feature Specification: Memory Deep Quality Investigation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Predecessor** | `004-memory-retroactive-alignment` (surface pass) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004 confirmed the memory corpus is structurally v2.2 compliant (frontmatter fields present, `/100` patterns removed, `retroactive_reviewed` flags applied). But a deeper audit of the 153 memory files found **562 systemic quality findings across 16 categories**, pointing to generator-level bugs rather than one-off content problems:

- **123 files** have empty `causal_links` despite body text referencing 3+ other spec folders — the causal graph is disconnected
- **113 files** have overlapping n-gram `trigger_phrases` (e.g., `"kit 022"`, `"022 hybrid"`, `"hybrid rag"`) instead of semantic retrieval phrases
- **109 files** have empty `_sourceTranscriptPath` and `_sourceSessionId` — provenance tracking is broken
- **44 files** have `captured_file_count >= 5` but `git_changed_file_count = 0` — git tracking disagrees with captured state
- **37 files** have titles ending with `[full/spec/path/here]` — the generator embeds path context in titles
- **34 files** have `key_topics` arrays with overlapping n-gram duplicates

These defects degrade retrieval quality (MCP search returns noisy n-gram matches), break the causal graph (no cross-spec navigation), and corrupt session provenance (can't trace back to original transcripts).

### Purpose
Investigate the root causes in `generate-context.js` and related generator code, document what needs to change, and produce an actionable fix plan. This phase is **investigation-only** — implementation happens in a follow-up phase once the root causes are understood.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `scratch/deep-findings.json` (562 findings) as the audit baseline
- Read `.opencode/skill/system-spec-kit/scripts/src/memory/` to understand the current generator code
- For each finding category, trace back to the generator code path that produced it
- Document root causes (generator bug, upstream data bug, template bug, or content bug)
- Classify fixes: (a) generator fixes, (b) bulk retroactive patches, (c) accept as historical baseline
- Produce a detailed findings-to-root-causes map
- Recommend follow-up phase for generator fixes

### Out of Scope
- Modifying `generate-context.js` or any generator code (fix phase is separate)
- Patching memory files (done in phase 004)
- Changing the MCP server or memory database schema
- Investigating memory retrieval / search quality (separate workstream)

### Files to Read (investigation inputs)

| File Path | Purpose |
|-----------|---------|
| `scratch/deep-findings.json` | 562 findings from deep-audit.mjs |
| `scratch/deep-audit.mjs` | The audit script itself (for methodology reference) |
| `.opencode/skill/system-spec-kit/scripts/src/memory/generate-context.ts` | Main generator entry |
| `.opencode/skill/system-spec-kit/scripts/src/memory/extractors/` | Trigger phrase, key topic, causal link extractors |
| `.opencode/skill/system-spec-kit/scripts/src/memory/templates/` | Memory markdown template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the 16 finding categories mapped to a root cause (code path or upstream data source) | root-causes.md documents 16/16 categories |
| REQ-002 | Root causes classified into: generator bug, template bug, upstream data bug, or historical accept | Every category has exactly one classification |
| REQ-003 | Follow-up phase proposed with prioritized fix list | phase-006 proposal drafted with P0/P1/P2 priorities |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Retroactive patch feasibility assessed for each bug category | Each category marked: patchable in-place, needs regeneration, or accept |
| REQ-005 | Impact on downstream systems documented (MCP search, causal graph, session resume) | downstream-impact.md written |
| REQ-006 | Test strategy proposed for generator fixes | test-strategy.md section added to follow-up plan |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 16 finding categories have documented root causes
- **SC-002**: Follow-up phase-006 proposal is approvable and actionable
- **SC-003**: No generator code is modified in this phase (investigation-only)
- **SC-004**: Downstream impact is quantified (how many files affected per category)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Root cause may be ambiguous | Med | Document multiple hypotheses with evidence |
| Risk | Fixing generator may require regenerating old memories | High | Phase 006 proposal must cover regeneration strategy |
| Dependency | `scratch/deep-findings.json` from phase 004 | Green | File is committed, stable baseline |
| Dependency | Access to `generate-context.js` source | Green | Code is local and readable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Investigation Rigor
- **NFR-I01**: Each root cause claim must cite specific line numbers in the generator code
- **NFR-I02**: Hypotheses must be distinguished from confirmed findings

### Reliability
- **NFR-R01**: This investigation must not alter any memory file, generator code, or MCP state
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Cross-category overlap
Some files appear in multiple categories (e.g., both `trigger_phrases_overlapping` and `key_topics_duplicated`) — likely the same root cause. Group categories by shared root cause before proposing fixes.

### Historical baseline
Some findings may be acceptable historical artifacts (e.g., old memories that predate current generator version). Classify these explicitly instead of proposing fixes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Investigation-only, clear inputs |
| Risk | 10/25 | Read-only; no destructive operations |
| Research | 18/20 | Requires deep code archaeology of generator |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Q1: Are some findings (especially trigger_phrases n-gram noise) acceptable for older memories generated before retrieval quality was a priority?
- Q2: Should `causal_links` be populated retroactively from body text references, or only from the live session at save-time?
- Q3: What's the acceptable threshold for a "good" memory quality_score given actual content richness?
<!-- /ANCHOR:questions -->
