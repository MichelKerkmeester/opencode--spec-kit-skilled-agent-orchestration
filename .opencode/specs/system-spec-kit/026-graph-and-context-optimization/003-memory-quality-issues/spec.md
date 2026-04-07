---
title: "Feature Specification: Memory Quality Backend Improvements"
description: "Spec for the eight defect remediation classes (D1-D8) identified in JSON-mode generate-context.js by the 10-iteration deep research; research phase is complete, code remediation is the work product of this spec."
trigger_phrases:
  - "memory quality"
  - "generate context"
  - "json mode"
  - "remediation matrix"
  - "deep research D1 D8"
  - "memory backend defects"
importance_tier: important
contextType: "planning"
---

# Feature Specification: Memory Quality Backend Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

This feature converts the findings of the 10-iteration deep research in `research/research.md` into a concrete backend remediation plan that fixes eight defect classes observed in JSON-mode `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`. The research is complete and convergence was reached at iteration 9; this spec packages those findings into actionable, prioritized work without expanding scope. [SOURCE: research.md §1, §6]

**Key Decisions**: Adopt the iteration-9-narrowed remediation matrix (D2 precedence-only, D5 immediate-predecessor with continuation gating, D7 provenance-only, D3 keep `ensureMinTriggerPhrases()`); ship in priority groups P0 → P3 to limit blast radius; verify each fix with targeted unit tests or fixture replays rather than full pipeline runs. [SOURCE: research.md §6, §10, §11]

**Critical Dependencies**: D1, D8 are independent and ship-first. D4 must land before adding the post-save reviewer drift assertion. D2 must land before disabling the lexical fallback for any payload class. D5 should only land with a regression fixture proving the continuation-signal gate works on a 3+ memory folder. [SOURCE: research.md §10]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Research Complete · Implementation Deferred |
| **Created** | 2026-04-06 |
| **Branch** | `026-graph-and-context-optimization/003-memory-quality-issues` |
| **Research** | Complete (10 iterations, convergence at iter 9) |
| **Implementation** | Deferred to follow-up `/spec_kit:plan` invocation |
| **Estimated LOC** | 250-400 across 7 files |

---

## 2. PROBLEM STATEMENT

Seven memory files saved across `026-graph-and-context-optimization/001-research-graph-context-systems/{001..005}/memory/` exhibited eight distinct defect classes when generated through JSON mode of `generate-context.js`:

- **D1 — Truncated overview**: OVERVIEW sections cut mid-sentence at ~500 chars.
- **D2 — Generic decision placeholders**: authored decisions replaced by `observation decision N` / `user decision N` lexical fallbacks.
- **D3 — Garbage trigger phrases**: path fragments (`kit/026`, `optimization/003`), single stopwords (`and`, `graph`, `issues`), and synthetic bigrams (`tiers full`, `level spec`).
- **D4 — Importance tier mismatch**: frontmatter `important` vs YAML metadata block `normal`.
- **D5 — Missing causal supersedes**: continuation runs (e.g., 8→13 iteration extension) do not auto-link their predecessor.
- **D6 — Duplicate trigger phrases**: same term appearing twice (historical, not currently reproducible at the inspected merge site).
- **D7 — Empty git provenance**: `head_ref`, `commit_ref` empty; `repository_state="unavailable"`.
- **D8 — Anchor ID mismatch**: `<!-- ANCHOR:summary -->` paired with `<a id="overview">`.

[SOURCE: research.md §4]

---

## 3. USER STORIES

**Story 1**: As a deep-research operator, I want every JSON-mode memory file to capture authored decisions accurately so that downstream causal-link extraction does not surface placeholder labels.
- **Given** a JSON payload with a non-empty `keyDecisions` array
- **When** `generate-context.js` runs
- **Then** the saved memory file's DECISIONS section reflects each authored decision verbatim and never emits `observation decision N`. [SOURCE: research.md §7 D2]

**Story 2**: As a memory indexer consumer, I want trigger phrases to be free of path fragments, stopwords, and stopword-collapsed bigrams so that semantic retrieval produces relevant matches.
- **Given** a JSON payload that mentions `system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues`
- **When** trigger phrases are extracted
- **Then** the saved frontmatter excludes `kit/026`, `optimization/003`, `and`, `graph`, `issues`, and any synthetic adjacency bigrams. [SOURCE: research.md §7 D3]

**Story 3**: As a continuation-run author, I want the new memory file to automatically declare `causal_links.supersedes` referencing the immediate predecessor so that the causal graph captures lineage without manual linking.
- **Given** a spec folder with one prior memory file and a JSON payload whose title contains `extended` or `continuation`
- **When** `generate-context.js` runs
- **Then** the saved memory's `causal_links.supersedes` array contains the predecessor `session_id`, and is empty when ambiguity blocks gating. [SOURCE: research.md §7 D5]

---

## 4. ACCEPTANCE CRITERIA

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | OVERVIEW never cuts mid-word and adds `…` only when truncated | Helper-level fixture for 450/520/900-char inputs |
| AC-2 | DECISIONS section never emits `observation decision N` for JSON-mode payloads with `keyDecisions` | Decision-extractor unit test with raw `keyDecisions` fixture |
| AC-3 | trigger_phrases excludes path fragments and English stopwords | F1/F6 replay assertion for absent strings |
| AC-4 | Frontmatter `importance_tier` and bottom YAML block agree | Frontmatter-migration test with divergent fixture |
| AC-5 | `causal_links.supersedes` populated when gating signal present | Temp-folder lineage fixture |
| AC-6 | `head_ref`, `commit_ref`, `repository_state` populated for JSON mode | Stubbed `extractGitContext()` workflow test |
| AC-7 | TOC, HTML id, and comment anchor names agree in template | Template anchor consistency assertion |
| AC-8 | All eight defect symptoms absent from a fresh end-to-end JSON save | Full pipeline replay with `/tmp/save-context-data.json` |

---

## 5. SCOPE

**In Scope**:
- Backend code edits to `collect-session-data.ts`, `decision-extractor.ts`, `workflow.ts`, `semantic-signal-extractor.ts`, `frontmatter-migration.ts`, `post-save-review.ts`, `context_template.md`.
- Targeted unit tests + fixture replays per defect.
- Single end-to-end JSON save verification before/after.

**Out of Scope**:
- Manual repair of the seven historical broken memory files in 001-research-graph-context-systems/.
- Capture-mode enrichment changes outside JSON mode.
- Embedding-model upgrades.
- V8 contamination gate redesign.
- `/memory:save` UX or CLI surface changes.

---

## 6. RISKS

| Risk | Severity | Mitigation |
|------|----------|------------|
| D2 fix regresses degraded JSON payloads currently rescued by lexical fallback | High | Precedence hardening only — never blanket-disable lexical fallback |
| D5 auto-link picks the wrong predecessor in 3+ folder histories | High | Require continuation signal + ambiguity skip |
| D7 over-reach contaminates JSON-mode summary content | Medium | Provenance-only injection, never reuse full enrichment branch |
| D3 over-filter removes valid short product names | Medium | Validate against known-good fixtures alongside broken ones |

[SOURCE: research.md §12]

---

## 7. RESEARCH BACKING

This spec is a 1:1 derivative of `research/research.md`. Iteration index:

| Iter | Focus | Outcome |
|------|-------|---------|
| 1 | Pipeline architecture map | 10 findings |
| 2 | D1 root cause | `collect-session-data.ts:875-881` |
| 3 | D2 root cause | `decision-extractor.ts:182-185, 367-388` |
| 4 | D3 root cause | `workflow.ts:1271-1295` + `semantic-signal-extractor.ts:260-284` |
| 5 | D4 root cause | `frontmatter-migration.ts:1112-1183` |
| 6 | D5 root cause | `workflow.ts` no predecessor discovery |
| 7 | D6/D7/D8 root causes | Template + isCapturedSessionMode gate |
| 8 | Initial remediation matrix | 8 defect proposals |
| 9 | Skeptical pass | 4 narrowings adopted |
| 10 | Final synthesis | research.md compiled, convergence declared |

[SOURCE: research/iterations/iteration-001.md through iteration-010.md]

---

## 8. STATUS

- **Research**: ✅ COMPLETE (10 iterations, 7 of 7 questions resolved, D6 reclassified as historical)
- **Spec Documentation**: ✅ COMPLETE (this file + plan.md + tasks.md + checklist.md + implementation-summary.md)
- **Implementation**: ⏸ DEFERRED (next step: `/spec_kit:plan` against this folder to convert remediation matrix into P0/P1/P2/P3 phases)
- **Memory Save**: ✅ COMPLETE (memory file saved + post-save review patched + reindexed)

---
title: "phase parent section [template:addendum/phase/phase-parent-section.md]"
description: "Template document for addendum/phase/phase-parent-section.md."
trigger_phrases:
  - "phase"
  - "parent"
  - "section"
  - "template"
  - "phase parent section"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->
<!-- Append to parent spec.md after SCOPE section -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Priority | Folder | Focus | PRs / Defects | Depends On | Status |
|-------|----------|--------|-------|---------------|------------|--------|
| 1 | P0 | `001-foundation-templates-truncation/` | Anchor-template fix + shared truncation helper + OVERVIEW fix. Independent foundation that enables all later phases. | PR-1 (D8 anchor IDs), PR-2 (D1 truncation) | — | Pending |
| 2 | P1 | `002-single-owner-metadata/` | Importance-tier SSOT consolidation + capture-mode-only ≤10-LOC provenance injection. Independent of P0/P2. | PR-3 (D4 importance tier), PR-4 (D7 git provenance) | — | Pending |
| 3 | P2 | `003-sanitization-precedence/` | Trigger-phrase sanitizer extraction + decision precedence-only gate (block lexical fallback when payload has authored decisions). | PR-5 (D3 trigger phrases), PR-6 (D2 decision placeholders) | Phase 1 (PR-2 helper used by sanitizer) | Pending |
| 4 | P3 | `004-heuristics-refactor-guardrails/` | Auto-supersedes with continuation gate + SaveMode enum refactor + post-save reviewer CHECK-D1..D8 upgrade. | PR-7 (D5 supersedes), PR-8 (SaveMode refactor), PR-9 (post-save reviewer) | Phase 1, 2, 3 (PR-8 refactors helpers from earlier phases; PR-9 asserts on D1/D4/D7/D8 fixes) | Pending |
| 5 | P4 | `005-operations-tail-prs/` | Optional safe-subset migration of 82 historical files + optional cross-process save lock for D9 candidate + telemetry M1-M9 alerts + release notes update. | PR-10 (migration), PR-11 (D9 save lock), PR-9 telemetry add-on | Phase 4 (PR-10 runs after PR-9 reviewer is live; PR-11 standalone) | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Packet-local changelog files live under `changelog/`; root uses `changelog-<packet>-root.md` and phases use `changelog-<packet>-<phase-folder>.md`

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-foundation-templates-truncation | 002-single-owner-metadata | PR-1 + PR-2 merged. Anchor IDs match (`<!-- ANCHOR:overview -->` ↔ `<a id="overview">`). OVERVIEW preserved verbatim with `…` ellipsis pinning when truncated. Shared `lib/truncate-on-word-boundary.ts` exported and unit-tested. | F-AC1 (D1 truncation) and F-AC7 (D8 anchor) fixtures green. `validate.sh` exit 0. |
| 002-single-owner-metadata | 003-sanitization-precedence | PR-3 + PR-4 merged. Frontmatter ↔ YAML metadata block agree on `importance_tier` for all save modes. Capture-mode `head_ref`/`commit_ref` populated via ≤10-LOC enrichment branch. | F-AC4 (D4 importance tier) and F-AC6 (D7 git provenance, with stubbed git seam) fixtures green. Post-save reviewer drift assertion installed. |
| 003-sanitization-precedence | 004-heuristics-refactor-guardrails | PR-5 + PR-6 merged. Trigger phrases free of path fragments, stopwords, and synthetic bigrams. Decision extraction never emits `observation decision N` placeholders when `keyDecisions` array is non-empty. Lexical fallback gated behind precedence predicate. | F-AC2 (D2 decisions) and F-AC3 (D3 triggers) fixtures green. Degraded-payload regression fixture green. |
| 004-heuristics-refactor-guardrails | 005-operations-tail-prs | PR-7 + PR-8 + PR-9 merged. Continuation runs auto-link predecessor via `causal_links.supersedes`. `_source === 'file'` overload replaced by `SaveMode` enum across pipeline. Post-save reviewer asserts CHECK-D1..D8. | F-AC5 (D5 supersedes, with 3+ memory folder lineage fixture) and F-AC8 (clean baseline) fixtures green. Reviewer drift report shows 0 high-severity findings on clean fixture. |
<!-- /ANCHOR:phase-map -->
