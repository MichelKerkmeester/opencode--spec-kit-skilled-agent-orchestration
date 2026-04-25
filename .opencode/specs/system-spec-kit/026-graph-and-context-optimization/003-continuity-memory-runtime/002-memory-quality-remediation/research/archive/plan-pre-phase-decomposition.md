---
title: "Implementation Plan: Memory Quality Backend Improvements"
description: "Priority-grouped (P0-P3) implementation plan derived from research.md remediation matrix; this folder ships research + spec only, code execution belongs to a follow-up plan invocation."
trigger_phrases:
  - "memory quality plan"
  - "remediation priority"
  - "P0 D1 D8"
  - "P1 D4 D7"
  - "P2 D2 D3"
  - "P3 D5 D6"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/002-memory-quality-remediation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/archive/plan-pre-phase-decomposition.md"]

---

# Implementation Plan: Memory Quality Backend Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

## 0. STATUS BANNER

> **This plan is RESEARCH-COMPLETE / IMPLEMENTATION-DEFERRED.**
> The 10-iteration deep research is the deliverable for this folder. Code remediation work should be picked up by a fresh `/spec_kit:plan` invocation that targets this folder and converts the priority groups below into a sequenced implementation plan.

---

## 1. APPROACH

The plan follows the **iteration-9-narrowed remediation matrix** from `research/research.md §6`. Defects are grouped by priority (P0 = ship-first, P3 = investigate-first), and each priority group is intentionally small to keep blast radius bounded. Verification is per-defect with helper-level fixtures or replay tests rather than full pipeline runs.

[SOURCE: research.md §6, §10, §11]

---

## 2. PRIORITY GROUPS

### P0 — Low-risk consolidation (ship first)

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D8 | `context_template.md:172-183`, `:330-352` | Standardize anchor naming on `overview` for TOC, HTML id, and comment anchor | None — template-only |
| D1 | `collect-session-data.ts:875-881` | Replace `substring(0, 500)` with shared boundary-aware trimming helper modeled on `buildSessionSummaryObservation()` | Low — soft cap preserved |

**Verification**: Helper-level fixture tests (450/520/900 char) + template anchor consistency assertion. No full pipeline runs needed.

### P1 — Structural consistency + provenance

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D4 | `frontmatter-migration.ts:1112-1183`, `post-save-review.ts:279-289` | Extend managed-frontmatter rewrite to also update bottom YAML block; add reviewer drift assertion | Medium — narrow regex risk |
| D7 | `workflow.ts:453-560`, `:877-923` | Split git provenance injection from captured-session enrichment so JSON mode always fills `head_ref`/`commit_ref`/`repository_state` without merging summary content | Medium — must stay provenance-only |

**Verification**: Frontmatter migration fixture with divergent tier; stubbed `extractGitContext()` workflow test asserting authored summary remains unchanged.

### P2 — Search-quality fixes (behaviorally sensitive)

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D3 | `workflow.ts:1271-1295`, `semantic-signal-extractor.ts:260-284` | Remove unconditional folder-token append (keep `ensureMinTriggerPhrases()` low-count fallback); require source adjacency for topic bigrams | Medium — overfilter risk |
| D2 | `decision-extractor.ts:182-185`, `:367-388` | Add raw `keyDecisions` reader before lexical fallback; precedence hardening only when authoritative arrays exist (do NOT blanket-disable lexical) | High — could regress degraded payloads if scoped wrong |

**Verification**: F1/F6 replay fixtures asserting absent strings; decision-extractor unit tests for valid raw arrays, missing normalized carriers, and degraded decision-less JSON.

### P3 — Investigation-first

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D5 | `memory-metadata.ts:227-236`, `workflow.ts:1305-1372` | Add `discoverPredecessors()` helper; immediate-predecessor only with continuation-signal gating + ambiguity skip | High — false positives harden incorrect lineage |
| D6 | unresolved active owner | Add regression fixture from F1 (not F7) before any code patch | Low — fixture-only |

**Verification**: Temp-folder lineage fixture (one valid + one unrelated sibling); D6 fixture establishes failing reproducer first.

---

## 3. CROSS-CUTTING REFACTORS (defer to a separate spec)

These were identified as `Refactor Opportunities` in `research.md §13` and are listed here for visibility, but should NOT be bundled into this remediation:

1. **Single source of truth for `importance_tier`** — derive both frontmatter and metadata-block from one resolved value rather than maintaining two mutable representations.
2. **Shared truncation helper** — extract a common boundary-aware trim helper used by `collect-session-data.ts` and `input-normalizer.ts`.
3. **Explicit enrichment-mode flag** — replace the `_source === 'file'` overload with an explicit save-mode contract.

[SOURCE: research.md §13]

---

## 4. VERIFICATION STRATEGY

| Layer | Tool | Use For |
|-------|------|---------|
| Helper unit | Vitest / node:test | D1, D2, D3, D4, D7 |
| Fixture replay | `/tmp/save-context-data.json` against `generate-context.js` | Final acceptance for AC-8 |
| Template snapshot | Anchor consistency assertion | D8 |
| Lineage fixture | Temp-dir with synthetic prior memories | D5 |
| Regression-only | F1 duplicate trigger fixture | D6 |

[SOURCE: research.md §11]

---

## 5. ROLLOUT GATES

| Gate | Condition |
|------|-----------|
| G1 | P0 fixes (D1, D8) merged + verification passing |
| G2 | P1 fixes (D4, D7) merged with reviewer drift check live |
| G3 | P2 fixes (D2, D3) merged + replay fixtures green |
| G4 | P3 fixes (D5) merged only after lineage fixture passes; D6 still investigation-only |

---

## 6. NEXT STEP

Run `/spec_kit:plan` against this folder once the team is ready to execute remediation. The new plan should consume `research.md §6` (final remediation matrix) and `plan.md §2` (priority groups) as inputs, then break each priority group into implementation tasks.
