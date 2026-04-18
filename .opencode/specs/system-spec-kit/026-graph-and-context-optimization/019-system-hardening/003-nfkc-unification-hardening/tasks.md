---
title: "Tasks: NFKC Unification Hardening"
description: "Task list for HP1-HP6 implementation."
trigger_phrases: ["nfkc hardening tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/003-nfkc-unification-hardening"
    last_updated_at: "2026-04-18T23:42:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"
---
# Tasks: NFKC Unification Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Task Notation

- `[ ]` pending | `[x]` complete with evidence | P0/P1/P2 severity

## Phase 1: Setup

- [ ] T001 Read research: 019/001/003 research.md §4 HP1-HP6 (P0)
- [ ] T002 Baseline: run existing Gate 3 / shared-provenance / trigger-phrase tests, capture output for regression compare (P0)

## Phase 2: Implementation

### HP1 — Shared Unicode normalization utility
- [ ] T003 Create `scripts/lib/unicode-normalization.ts` exporting `canonicalFold(s: string): string` (P0)
- [ ] T004 Refactor `gate-3-classifier.ts` to use shared utility (P0)
- [ ] T005 Refactor `shared-provenance.ts` to use shared utility (P0)
- [ ] T006 Migrate `trigger-phrase-sanitizer.ts` from NFC to shared utility (P0)
- [ ] T007 Parity tests: same input → same normalized output across 3 surfaces (P0)

### HP2 — Post-normalization instruction denylist
- [ ] T008 Move contamination + suspicious-prefix regex evaluation post-canonicalization in trigger-phrase-sanitizer + shared-provenance (P0)
- [ ] T009 Regression tests confirm RT1-RT10 width/fullwidth/ZWJ cases now blocked (P0)

### HP3 — Expand confusable coverage
- [ ] T010 Add Greek-omicron + adjacent high-risk lookalikes to fold table in shared utility (P0)
- [ ] T011 RT5 `ignοre previous` test now blocked (P0)

### HP4 — Semantic recovered-payload contract
- [ ] T012 Add semantic gate in `hook-state.ts` payload validation (P0)
- [ ] T013 Wire gate into `claude/session-prime.ts`, `gemini/session-prime.ts`, `copilot/session-prime.ts` (P0)
- [ ] T014 Implement quarantine path for suspicious payloads (P1)

### HP5 — Provenance contract enforcement
- [ ] T015 Add provenance metadata + sanitizer-version fingerprint to compact-cache writers (P1)
- [ ] T016 Add provenance verification to compact-cache readers (P1)

### HP6 — Adversarial round-trip corpus
- [ ] T017 Create `mcp_server/tests/security/adversarial-unicode.vitest.ts` with RT1-RT10 + derived variants (P0)
- [ ] T018 Run corpus through 4 surfaces: Gate 3, shared-provenance, trigger-phrase, hook-state (P0)
- [ ] T019 Capture runtime fingerprint (Node, ICU, Unicode) in test output (P1)

## Phase 3: Verification

- [ ] T020 Full mcp_server test suite green (P0)
- [ ] T021 Update checklist.md with evidence (P0)
- [ ] T022 Update implementation-summary.md (P0)
- [ ] T023 Commit+push at end of each HP phase (P0)

## Cross-References

- Parent: `../spec.md`
- Source: `../001-initial-research/003-q4-nfkc-robustness/research.md`
