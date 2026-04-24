---
title: "Verification Checklist: 027/003 Native Advisor Core"
description: "This verification checklist captures 027/003 Native Advisor Core."
trigger_phrases:
  - "native advisor core"
  - "skill graph daemon and advisor unification"
  - "027/003 native advisor core"
  - "native advisor core checklist"
  - "system spec kit"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
---
title: "...optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core/checklist]"
description: "Acceptance verification for native advisor core."
trigger_phrases:
  - "027/003 checklist"
  - "native advisor core verification"
  - "regression-protection parity checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core"
    last_updated_at: "2026-04-20T18:30:00Z"
    last_updated_by: "codex-gpt-5-4"
    recent_action: "Marked native advisor core acceptance gates with evidence."
    next_safe_action: "Commit locally; do not push."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts"
    session_dedup:
      fingerprint: "sha256:027004-native-advisor-core-checklist"
      session_id: "027-003-native-core-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All P0/P1 deterministic gates passed."
level: 2
---
# Verification Checklist: 027/003 Native Advisor Core

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:verification -->

## P0 (HARD BLOCKER)
- [x] 5-lane fusion with initial weights 0.45/0.30/0.15/0.10/0.00 (named constants + Zod config) - [evidence: `weights-config.ts:8-36`, `fusion.ts:114-126`]
- [x] Semantic-shadow lane scored but contributes 0.00 live - [evidence: `semantic-shadow.ts:8-24`, `fusion.ts:223-232`, `native-scorer.vitest.ts:67-83`]
- [x] Lifecycle-normalized inputs from 027/002 consumed (Y3 prerequisite) - [evidence: `projection.ts:131-174`, `derived.ts:25-33`, `native-scorer.vitest.ts:85-106`]
- [x] Python↔TS regression-protection parity harness exists; Python-correct top-1/pass-threshold is preserved - [evidence: `python-ts-parity.vitest.ts:100-163`; report `pythonCorrect=120`, `tsAlsoCorrect=120`, `regressions=0`, `tsAbstainsOnPythonCorrect=0`]
- [x] Ablation protocol callable + documents per-lane impact - [evidence: `ablation.ts:54-75`, `python-ts-parity.vitest.ts:165-175`]
- [x] All new code under `mcp_server/skill-advisor/lib/` (NOT `mcp_server/lib/skill-advisor/`) - [evidence: added scorer modules under `skill-advisor/lib/scorer/`]
- [x] 11 lib/skill-advisor/*.ts files migrated; existing 55-test baseline still green; targeted suite now 64 tests green - [evidence: targeted vitest `6 passed / 64 passed`]

## P0 Deterministic acceptance gates (research.md §11)
- [x] Full-corpus exact top-1 ≥ 70% (≥140/200) - [evidence: parity report `tsCorrect=161`, `tsAccuracy=0.805`]
- [x] Stratified holdout top-1 ≥ 70% (≥28/40) - [evidence: parity report `holdoutCorrect=31`, `holdoutAccuracy=0.775`]
- [x] UNKNOWN fallback count ≤ 10 on full corpus - [evidence: parity report `tsUnknown=10`]
- [x] Gold-`none` false-fire count: no increase from clarified gate ceiling - [evidence: parity report `goldNoneFalseFire=8` (≤10)]
- [x] Explicit-skill top-1 / no-abstain: no regression; derived lane does not displace - [evidence: parity report `tsAbstainsOnPythonCorrect=0`, `native-scorer.vitest.ts:108-119`]
- [x] Ambiguity slice stable: top-2-within-0.05 renders ambiguous brief - [evidence: `ambiguity.ts:5-23`, `native-scorer.vitest.ts:48-65`]
- [x] Derived-lane attribution required for derived-dominant matches - [evidence: `attribution.ts`, `fusion.ts:256-267`]
- [x] Adversarial-stuffing fixture cannot pass default routing - [evidence: `native-scorer.vitest.ts:121-133`]
- [x] Regression safety: P0 pass 1.0 / failed 0 / command-bridge FP ≤ 0.05 - [evidence: parity report `regressions=0`, `tsAbstainsOnPythonCorrect=0`]

## P1 (Required)
- [x] Skill projection layer (project-not-copy memory fields) - [evidence: `projection.ts:177-207`, `projection.ts:209-257`]
- [x] Bounded skill_edges traversal (depth + breadth caps) - [evidence: `graph-causal.ts:20-78`]
- [x] Ambiguity via top-2-within-0.05 - [evidence: `ambiguity.ts:5-23`]
- [x] Attribution in brief metadata (which lanes contributed) - [evidence: `fusion.ts:223-267`, `attribution.ts`]
- [x] Cache-hit p95 ≤50ms; uncached deterministic p95 ≤60ms - [evidence: standalone bench `cacheHitP95Ms=6.989`, `uncachedP95Ms=11.45`]

## P2 (Suggestion)
- [ ] Lane-specific tracing (debug)
- [ ] `--lane-ablation` CLI flag

## Integration / Regression
- [x] Targeted advisor vitest suite green. Evidence: `6 passed / 64 passed`.
- [x] 200-prompt corpus regression-protection parity green. Evidence: `pythonCorrect=120`, `tsAlsoCorrect=120`, `regressions=0`.
- [x] TS typecheck clean. Evidence: `npm run typecheck` exit 0.
- [x] TS build clean. Evidence: `npm run build` exit 0.
- [x] No regressions in migrated advisor/freshness/brief targeted suite. Evidence: daemon freshness, lifecycle derived, advisor freshness, advisor brief producer all green.
- [x] Advisor brief render unchanged from post-025 baseline. Evidence: `advisor-brief-producer.vitest.ts` green in targeted suite.

## Research conformance
- [x] C1 reuses existing graph/lifecycle primitives; no scorer data store reinvention.
- [x] C2 project skill metadata; no memory lifecycle leakage. Evidence: `projection.ts:137-174`.
- [x] C3 causal traversal over skill_edges (not memory_causal_link storage). Evidence: `graph-causal.ts:27-31`, `graph-causal.ts:46-65`.
- [x] C4 analytical fusion with caps + attribution + ablation. Evidence: `fusion.ts:207-294`, `ablation.ts:54-75`.
- [x] C5 ambiguity + causal tiebreaker. Evidence: `ambiguity.ts:5-23`, `fusion.ts:172-204`.
- [x] C7 200-prompt corpus frozen benchmark. Evidence: `python-ts-parity.vitest.ts:35-45`.
- [x] G1 initial weights 0.45/0.30/0.15/0.10/0.00. Evidence: `weights-config.ts:8-20`.
- [x] G2 ablation protocol with corpus/holdout/parity/safety/latency slices. Evidence: parity + scorer tests green; standalone bench green.
- [x] G3 parity definition: regression-protection top-1 + pass-threshold/abstain per orchestrator clarification. Evidence: `python-ts-parity.vitest.ts:124-162`.
- [x] G4 parity harness owned here. Evidence: `tests/parity/python-ts-parity.vitest.ts`.
- [x] Y2 compatible with 027/001 single-writer freshness. Evidence: existing freshness suites green.
- [x] Y3 consumes 027/002 lifecycle-normalized inputs. Evidence: lifecycle fixture test green.

<!-- /ANCHOR:verification -->
