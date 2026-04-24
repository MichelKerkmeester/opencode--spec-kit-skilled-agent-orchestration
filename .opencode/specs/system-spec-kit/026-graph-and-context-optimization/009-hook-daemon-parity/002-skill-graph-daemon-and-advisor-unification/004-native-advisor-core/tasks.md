<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "...ext-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core/tasks]"
description: "Task breakdown for native advisor core + parity harness."
trigger_phrases:
  - "027/003 tasks"
  - "native advisor core tasks"
  - "regression-protection parity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core"
    last_updated_at: "2026-04-20T18:30:00Z"
    last_updated_by: "codex-gpt-5-4"
    recent_action: "Marked native advisor core tasks complete with verification evidence."
    next_safe_action: "Commit locally; do not push."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:027004-native-advisor-core-tasks"
      session_id: "027-003-native-core-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity is regression protection per orchestrator clarification."
---
# Tasks: 027/003 Native Advisor Core

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:tasks -->

## T001 — Scaffold
- [x] Packet files written

## T002 — Read research + predecessor outputs
- [x] research.md §6 + §11 + §13.4 + Y2/Y3 + §13.6 delta
- [x] 027/001 + 027/002 implementation-summaries
- [x] predecessor `blocker.md` and corpus path clarification

## T003 — File migration (P0)
- [x] Move 11 files from `mcp_server/lib/skill-advisor/` → `mcp_server/skill-advisor/lib/` (completed in prep commit `1146faeec`)
- [x] Update all imports
- [x] Existing 55-test baseline still green; targeted suite now 64 tests green

## T004 — Weights config (P0)
- [x] `lib/scorer/weights-config.ts` with Zod schema
- [x] Named constants: 0.45 / 0.30 / 0.15 / 0.10 / 0.00

## T005 — Per-lane scorers (P0)
- [x] `lib/scorer/lanes/explicit.ts`
- [x] `lib/scorer/lanes/lexical.ts`
- [x] `lib/scorer/lanes/graph-causal.ts`
- [x] `lib/scorer/lanes/derived.ts`
- [x] `lib/scorer/lanes/semantic-shadow.ts`

## T006 — Projection + fusion (P0)
- [x] `lib/scorer/projection.ts`
- [x] `lib/scorer/fusion.ts` (analytical, capped, attributed)

## T007 — Ambiguity + attribution (P1)
- [x] `lib/scorer/ambiguity.ts`
- [x] `lib/scorer/attribution.ts`

## T008 — Ablation protocol (P0)
- [x] `lib/scorer/ablation.ts`
- [x] Callable per-lane disable protocol

## T009 — Parity harness (P0)
- [x] `tests/parity/python-ts-parity.vitest.ts`
- [x] 200-prompt corpus loaded from `019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- [x] Regression-protection parity per orchestrator clarification

## T010 — Bench (P1)
- [x] `bench/scorer-bench.ts`
- [x] Cache-hit ≤50ms, uncached ≤60ms

## T011 — Integration with 002 fixtures (P0)
- [x] Lifecycle fixtures consumed in scorer tests

## T012 — Verify
- [x] Targeted advisor suite green: 64 tests
- [x] Regression-protection parity green: 120/120 Python-correct preserved
- [x] Bench meets gates
- [x] Mark checklist.md [x]

## T013 — Commit
- [ ] Commit locally; do not push - [blocked: sandbox cannot create `.git/index.lock`; orchestrator must commit]

<!-- /ANCHOR:tasks -->
