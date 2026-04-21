---
title: "Implementation Plan: Memory Quality Backend Improvements"
description: "Original pre-decomposition implementation plan retained for traceability; actual execution is recorded in phase folders 001-005."
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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---

# Implementation Plan: Memory Quality Backend Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

> **⚠️ SUPERSEDED BY PHASES 1-5:** This file is retained as the original pre-decomposition plan only. Use `001-foundation-templates-truncation/` through `005-operations-tail-prs/` as the authoritative execution record for this packet.

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript system-spec-kit scripts plus markdown packet docs |
| **Framework** | `generate-context.js` + system-spec-kit remediation workflow |
| **Storage** | Packet-local spec documents and memory artifacts |
| **Testing** | Helper-level fixtures, replay tests, and strict spec validation |

### Overview

> **This plan is the ORIGINAL PRE-DECOMPOSITION PLAN and is now superseded.**
> The 10-iteration deep research still explains the priority bands below, but implementation no longer routes through a fresh `/spec_kit:plan` invocation here. Real execution shipped through phase folders `001-foundation-templates-truncation/` through `005-operations-tail-prs`.

The plan follows the **iteration-9-narrowed remediation matrix** from `research/research.md §6`. Defects are grouped by priority (P0 = ship-first, P3 = investigate-first), and each priority group is intentionally small to keep blast radius bounded. Verification is per-defect with helper-level fixtures or replay tests rather than full pipeline runs.

[SOURCE: research.md §6, §10, §11]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Research deliverables and remediation matrix are complete and available.
- [ ] Priority groups (P0-P3) are agreed and sequenced.
- [ ] Verification approach is defined per defect group before implementation.

### Definition of Done

- [ ] P0 and P1 groups are implemented or explicitly deferred with rationale.
- [ ] Required verification surfaces for each addressed defect group are green.
- [ ] Packet-level rollout gates are documented with current status.

### Rollout Gate Matrix

| Gate | Condition |
|------|-----------|
| G1 | P0 fixes (D1, D8) merged + verification passing |
| G2 | P1 fixes (D4, D7) merged with reviewer drift check live |
| G3 | P2 fixes (D2, D3) merged + replay fixtures green |
| G4 | P3 fixes (D5) merged only after lineage fixture passes; D6 still investigation-only |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Priority-banded remediation sequencing with defect-scoped verification.

### Key Components

- **Research Matrix Authority**: `research/research.md §6` drives all remediation grouping.
- **Priority Bands**: P0 through P3 partition implementation risk and rollout order.
- **Verification Layers**: helper tests, fixtures, snapshots, and lineage checks gate rollout.

### Data Flow

Research findings -> priority grouping -> defect-scoped implementation -> layer-specific verification -> rollout gate advancement.

### Cross-Cutting Refactors (defer to a separate spec)

These were identified as `Refactor Opportunities` in `research.md §13` and are listed here for visibility, but should NOT be bundled into this remediation:

1. **Single source of truth for `importance_tier`** — derive both frontmatter and metadata-block from one resolved value rather than maintaining two mutable representations.
2. **Shared truncation helper** — extract a common boundary-aware trim helper used by `collect-session-data.ts` and `input-normalizer.ts`.
3. **Explicit enrichment-mode flag** — replace the `_source === 'file'` overload with an explicit save-mode contract.

[SOURCE: research.md §13]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

#### P0 — Low-risk consolidation (ship first)

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D8 | `context_template.md:172-183`, `:330-352` | Standardize anchor naming on `overview` for TOC, HTML id, and comment anchor | None — template-only |
| D1 | `collect-session-data.ts:875-881` | Replace `substring(0, 500)` with shared boundary-aware trimming helper modeled on `buildSessionSummaryObservation()` | Low — soft cap preserved |

**Verification**: Helper-level fixture tests (450/520/900 char) + template anchor consistency assertion. No full pipeline runs needed.

### Phase 2: Core Implementation

#### P1 — Structural consistency + provenance

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D4 | `frontmatter-migration.ts:1112-1183`, `post-save-review.ts:279-289` | Extend managed-frontmatter rewrite to also update bottom YAML block; add reviewer drift assertion | Medium — narrow regex risk |
| D7 | `workflow.ts:453-560`, `:877-923` | Split git provenance injection from captured-session enrichment so JSON mode always fills `head_ref`/`commit_ref`/`repository_state` without merging summary content | Medium — must stay provenance-only |

**Verification**: Frontmatter migration fixture with divergent tier; stubbed `extractGitContext()` workflow test asserting authored summary remains unchanged.

#### P2 — Search-quality fixes (behaviorally sensitive)

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D3 | `workflow.ts:1271-1295`, `semantic-signal-extractor.ts:260-284` | Remove unconditional folder-token append (keep `ensureMinTriggerPhrases()` low-count fallback); require source adjacency for topic bigrams | Medium — overfilter risk |
| D2 | `decision-extractor.ts:182-185`, `:367-388` | Add raw `keyDecisions` reader before lexical fallback; precedence hardening only when authoritative arrays exist (do NOT blanket-disable lexical) | High — could regress degraded payloads if scoped wrong |

**Verification**: F1/F6 replay fixtures asserting absent strings; decision-extractor unit tests for valid raw arrays, missing normalized carriers, and degraded decision-less JSON.

### Phase 3: Verification

#### P3 — Investigation-first

| Defect | Owner | Change | Risk |
|--------|-------|--------|------|
| D5 | `memory-metadata.ts:227-236`, `workflow.ts:1305-1372` | Add `discoverPredecessors()` helper; immediate-predecessor only with continuation-signal gating + ambiguity skip | High — false positives harden incorrect lineage |
| D6 | unresolved active owner | Add regression fixture from F1 (not F7) before any code patch | Low — fixture-only |

**Verification**: Temp-folder lineage fixture (one valid + one unrelated sibling); D6 fixture establishes failing reproducer first.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Tool | Use For |
|-------|------|---------|
| Helper unit | Vitest / node:test | D1, D2, D3, D4, D7 |
| Fixture replay | `/tmp/save-context-data.json` against `generate-context.js` | Final acceptance for AC-8 |
| Template snapshot | Anchor consistency assertion | D8 |
| Lineage fixture | Temp-dir with synthetic prior memories | D5 |
| Regression-only | F1 duplicate trigger fixture | D6 |

[SOURCE: research.md §11]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `research/research.md` remediation matrix (`§6`) | Internal | Complete | Priority-group execution cannot be sequenced confidently |
| Defect-scoped fixtures and replay inputs | Internal | Required for execution | Acceptance criteria cannot be verified deterministically |
| Follow-up `/spec_kit:plan` invocation | Process | Pending | Implementation remains deferred and grouped work is not converted to executable tasks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Implementation rollout diverges from scoped priority groups, verification gates fail, or defect fixes introduce regressions.
- **Procedure**: Halt rollout at the current gate, keep unresolved groups deferred, and re-open planning with updated fixture evidence before resuming.

### Next Step

This historical plan is superseded. For the real execution record, use phase folders `001-foundation-templates-truncation/` through `005-operations-tail-prs`, which replaced the fresh-plan workflow described here.
<!-- /ANCHOR:rollback -->
