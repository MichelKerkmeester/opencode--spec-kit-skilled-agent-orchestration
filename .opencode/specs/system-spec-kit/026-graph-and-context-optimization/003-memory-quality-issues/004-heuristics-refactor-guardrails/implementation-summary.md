---
title: "Implementation Summary: Phase 4 — Heuristics, Refactor & Guardrails"
description: "Phase 4 completed the largest packet slice: conservative predecessor discovery, explicit SaveMode branching, and reviewer checks that detect the repaired defect classes without false positives on the clean baseline."
trigger_phrases:
  - "phase 4 implementation summary"
  - "heuristics refactor guardrails summary"
  - "d5 savemode reviewer closeout"
importance_tier: important
contextType: "implementation"
---
# Implementation Summary: Phase 4 — Heuristics, Refactor & Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-heuristics-refactor-guardrails |
| **Completed** | 2026-04-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 4 turned the packet from a set of isolated fixes into a guarded pipeline that later operational work can trust. Continuation saves can now auto-link a predecessor only when the title and sibling history support it, mode branching now depends on an explicit `SaveMode` contract instead of overloading `_source`, and the post-save reviewer can prove both failure and cleanliness across the repaired defect classes.

### Conservative predecessor discovery

You can now recover `causal_links.supersedes` on the intended continuation path without guessing across noisy folders. The Phase 4 helper scans sibling headers once, looks for the narrow continuation signals approved by the research packet, and refuses to fabricate lineage when the candidate set is ambiguous.

### Explicit SaveMode control flow

The save pipeline no longer uses raw `_source === 'file'` checks as the main behavior switch. `SaveMode` now carries the branch intent, while `_sourceTranscriptPath` and `_sourceSessionId` stay in the file as metadata rather than acting as hidden control inputs.

### Reviewer guardrails that prove both sides

The reviewer now exercises CHECK-D1 through CHECK-D8 on the relevant broken fixtures and also stays silent on clean `F-AC8`. That gives Phase 5 a measurable baseline instead of asking operators to trust that earlier fixes stayed intact after the refactor.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts` | Created | Encapsulates bounded predecessor discovery for PR-7. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modified | Wires PR-7 discovery, SaveMode branching, and reviewer/telemetry coordination. |
| `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | Modified | Passes through the resolved supersedes lineage. |
| `.opencode/skill/system-spec-kit/scripts/types/save-mode.ts` | Created | Defines the explicit save-mode contract used by the refactor. |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modified | Uses the SaveMode contract while preserving metadata passthrough. |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modified | Adds the Phase 4 defect checks and blocking review behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts` | Created/Modified | Proves F-AC5 hit, miss, and ambiguity outcomes. |
| `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts` | Created/Modified | Proves broken fixtures fail correctly and clean F-AC8 stays quiet. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase followed the planned order strictly: PR-7 first, PR-8 second, PR-9 last. That sequencing mattered because Phase 4 needed the behavior change settled before the SaveMode refactor could normalize branching, and the reviewer upgrade only made sense once the earlier fixes were already real enough to assert on. Verification then replayed the clean and broken fixtures across the refactored path so the guardrails proved both sides of the contract.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep predecessor discovery conservative and ambiguity-safe | The research packet preferred omission over fabricated lineage in crowded folders. |
| Introduce a dedicated `SaveMode` type instead of more `_source` checks | Phase 4 needed to reduce control-flow coupling, not move it around. |
| Make the reviewer deterministic and payload-driven | The guardrail had to be reliable in tests and on real saves, which ruled out reviewer-time git probes or sibling scans. |
| Reuse earlier fixtures after the refactor | Phase 4 needed to prove that the refactor preserved D1, D2, and D7 repairs, not just its own new behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/memory-quality-phase4-pr7.test.ts` | PASS |
| `npx vitest run tests/memory-quality-phase4-pr9.test.ts` | PASS |
| `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts` | PASS |
| `F-AC5` lineage fixture | PASS, hit/miss/ambiguity behavior validated on 3+ sibling histories |
| `F-AC8` clean reviewer fixture | PASS, zero false positives |
| `checklist.md` | Phase-local evidence recorded under CHK-010 through CHK-062 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 4 does not perform historical migration or save-lock hardening.** Those remain optional Phase 5 tail decisions.
2. **Performance-envelope evidence remains a separate checklist item.** The lineage helper is bounded, but the recorded sibling-envelope check stays tracked explicitly.
3. **This summary closes Phase 4, not the whole packet.** Parent closure still depends on the operational tail.
<!-- /ANCHOR:limitations -->
