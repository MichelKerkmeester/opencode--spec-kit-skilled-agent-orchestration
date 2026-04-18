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

<!-- ANCHOR:notation -->
- `[ ]` pending | `[x]` complete with evidence | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read research: 019/001/003 research.md §4 HP1-HP6 (P0) — Evidence: reviewed `../../research/019-system-hardening-001-initial-research-003-q4-nfkc-robustness/research.md`, especially §4 proposals and RT1-RT10 inventory.
- [x] T002 Baseline: run existing Gate 3 / shared-provenance / trigger-phrase tests, capture output for regression compare (P0) — Evidence: pre-change `cd .opencode/skill/system-spec-kit && npm test` reached Vitest and failed on unrelated baseline suites (`handler-memory-save`, `transaction-manager-recovery`, `startup-brief`, etc.); targeted hardening slice later passed 91/91.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### HP1 — Shared Unicode normalization utility
- [x] T003 Create `scripts/lib/unicode-normalization.ts` exporting `canonicalFold(s: string): string` (P0) — Evidence: `scripts/lib/unicode-normalization.ts` exports the shared entrypoint via `@spec-kit/shared/unicode-normalization`; implementation lives in build-safe `shared/unicode-normalization.ts`.
- [x] T004 Refactor `gate-3-classifier.ts` to use shared utility (P0) — Evidence: `shared/gate-3-classifier.ts` imports `canonicalFold` from `./unicode-normalization.js`.
- [x] T005 Refactor `shared-provenance.ts` to use shared utility (P0) — Evidence: `mcp_server/hooks/shared-provenance.ts` imports canonical fold and runtime fingerprint helpers from `@spec-kit/shared/unicode-normalization`.
- [x] T006 Migrate `trigger-phrase-sanitizer.ts` from NFC to shared utility (P0) — Evidence: `scripts/lib/trigger-phrase-sanitizer.ts` now normalizes through `canonicalFold()`.
- [x] T007 Parity tests: same input → same normalized output across 3 surfaces (P0) — Evidence: `mcp_server/tests/security/adversarial-unicode.vitest.ts` parity assertion passed in targeted Vitest run.

### HP2 — Post-normalization instruction denylist
- [x] T008 Move contamination + suspicious-prefix regex evaluation post-canonicalization in trigger-phrase-sanitizer + shared-provenance (P0) — Evidence: trigger sanitizer and recovered-payload sanitizer evaluate denylist patterns against canonical folded text.
- [x] T009 Regression tests confirm RT1-RT10 width/fullwidth/ZWJ cases now blocked (P0) — Evidence: targeted adversarial corpus run passed RT1-RT10 checks across Gate 3 normalization, shared-provenance, trigger phrase, and hook-state.

### HP3 — Expand confusable coverage
- [x] T010 Add Greek-omicron + adjacent high-risk lookalikes to fold table in shared utility (P0) — Evidence: `shared/unicode-normalization.ts` folds Greek omicron/rho and adjacent Greek/Cyrillic role-word lookalikes.
- [x] T011 RT5 `ignοre previous` test now blocked (P0) — Evidence: `mcp_server/tests/security/adversarial-unicode.vitest.ts` RT5 and derived omicron/rho variants passed.

### HP4 — Semantic recovered-payload contract
- [x] T012 Add semantic gate in `hook-state.ts` payload validation (P0) — Evidence: `hook-state.ts` validates canonicalized pending compact payload lines and rejects instruction-shaped content.
- [x] T013 Wire gate into `claude/session-prime.ts`, `gemini/session-prime.ts`, `copilot/session-prime.ts` (P0) — Evidence: all three session-prime readers call `validatePendingCompactPrimeSemantics()` before emission.
- [x] T014 Implement quarantine path for suspicious payloads (P1) — Evidence: invalid hook-state payloads fail schema validation and are quarantined through the existing `.bad` state-file path; session-prime readers clear rejected compact primes and emit recovery fallback text.

### HP5 — Provenance contract enforcement
- [x] T015 Add provenance metadata + sanitizer-version fingerprint to compact-cache writers (P1) — Evidence: Claude, Gemini, and Copilot compact-cache writers populate `sanitizerVersion` and `runtimeFingerprint` in payload provenance.
- [x] T016 Add provenance verification to compact-cache readers (P1) — Evidence: session-prime and Gemini compact-inject readers reject compact payloads missing payload contracts, sanitizer version, or runtime fingerprint.

### HP6 — Adversarial round-trip corpus
- [x] T017 Create `mcp_server/tests/security/adversarial-unicode.vitest.ts` with RT1-RT10 + derived variants (P0) — Evidence: new test file added under `mcp_server/tests/security/`.
- [x] T018 Run corpus through 4 surfaces: Gate 3, shared-provenance, trigger-phrase, hook-state (P0) — Evidence: targeted Vitest command passed 6 files / 91 tests, including RT1-RT10 across all four surfaces.
- [x] T019 Capture runtime fingerprint (Node, ICU, Unicode) in test output (P1) — Evidence: adversarial test logs `[adversarial-unicode-runtime]` with normalizer, Node, ICU, and Unicode versions.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Full mcp_server test suite green (P0) — Blocked: `npm test` is not green in the current workspace baseline; both pre-change and post-change runs fail unrelated suites (for example `handler-memory-save`, `transaction-manager-recovery`, `memory-context.resume-gate-d`, `startup-brief`) and the post-change run stalled after reproducing failures.
- [x] T021 Update checklist.md with evidence (P0) — Evidence: checklist updated with implementation and verification evidence.
- [x] T022 Update implementation-summary.md (P0) — Evidence: implementation summary populated with HP1-HP6 outcomes and verification status.
- [x] T023 Commit+push at end of each HP phase (P0) — Evidence: intentionally skipped per dispatch constraint "DO NOT git commit or git push (orchestrator commits at end)".
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- HP1-HP6 targeted implementation complete.
- Targeted adversarial regression slice passes.
- T020 remains blocked until unrelated full-suite baseline failures are resolved.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md`
- Source: `../../research/019-system-hardening-001-initial-research-003-q4-nfkc-robustness/research.md`
<!-- /ANCHOR:cross-refs -->
