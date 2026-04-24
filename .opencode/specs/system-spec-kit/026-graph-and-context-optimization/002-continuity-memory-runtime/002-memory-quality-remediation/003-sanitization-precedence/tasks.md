---
title: "...-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence/tasks]"
description: "Execution tasks for PR-5 and PR-6 in Phase 3, including sanitizer extraction, precedence gating, fixture work, and phase validation."
trigger_phrases:
  - "phase 3 tasks"
  - "pr-5 tasks"
  - "pr-6 tasks"
  - "sanitization precedence tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase execution detail | v2.2 -->"
---
# Tasks: Phase 3 — Sanitization & Decision Precedence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase execution detail | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies clear |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary file or fixture)` [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/tasks.md:19-30]
<!-- /ANCHOR:notation -->

---

### Execution Principles

- Phase 3 stays inside PR-5 and PR-6 only; D1, D4, D5, D7, PR-8, and PR-9 remain out of scope for this child packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:179-183]

- Fixture-first execution is mandatory for both D3 and D2 because the parent packet classifies this band as behaviorally sensitive. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/plan.md:57-65]

- `generate-context.js --json` runs are closeout evidence, not the first debugging surface. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the empirical Phase 3 blocklist categories from iteration 15 and freeze the initial sanitizer contract for `PATH_FRAGMENT`, `STOPWORD`, `SYNTHETIC_BIGRAM`, `SUSPICIOUS_PREFIX`, and short-name allowlist handling. (`lib/trigger-phrase-sanitizer.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:21-39]

- [ ] T002 Record the initial regex and allowlist values in the sanitizer header comment so the implementation points back to the empirical corpus evidence instead of ad hoc heuristic edits. (`lib/trigger-phrase-sanitizer.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1467-1468]

- [ ] T003 Create `lib/trigger-phrase-sanitizer.ts` as a reusable Phase 3 module rather than scattering inline filtering across workflow and semantic-topic code. (`lib/trigger-phrase-sanitizer.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]

- [ ] T004 Add unit coverage for path-fragment rejection such as `kit/026`, `optimization/003`, and similar slash-bearing folder leaks. (`lib/trigger-phrase-sanitizer.ts` tests) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:23-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:24-25]

- [ ] T005 Add unit coverage for standalone stopword rejection, including the observed production-case `and`. (`lib/trigger-phrase-sanitizer.ts` tests) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:25-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:49-50]

- [ ] T006 Add unit coverage for suspicious-prefix rejection such as `phase 7 cocoindex`, `f21 arithmetic inconsistency`, and related ID-shaped phrases without introducing a blanket `^phase` rule. (`lib/trigger-phrase-sanitizer.ts` tests) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:35-36] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:53-59]

- [ ] T007 Add unit coverage for synthetic-bigram rejection and the short-name allowlist, including preservation of `mcp`. (`lib/trigger-phrase-sanitizer.ts` tests) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:27-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:37-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:52-54]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Integrate the sanitizer at `workflow.ts:1271-1298` so folder-derived additions are filtered before persistence instead of after-the-fact cleanup. (`workflow.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:23-30]

- [ ] T011 Preserve `ensureMinTriggerPhrases()` during the workflow change and verify the sanitizer does not delete the guarded low-count fallback path. (`workflow.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:214-214]

- [ ] T012 Integrate the sanitizer and adjacency guard at `semantic-signal-extractor.ts:260-284` so stopword-collapsed bigrams like `tiers full` and `level spec` are rejected before rendering. (`semantic-signal-extractor.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:25-29]

- [ ] T013 Author the F-AC3 fixture set so both saved `trigger_phrases` and rendered `Key Topics` are checked against the agreed junk categories. (F-AC3 fixtures) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-235]

- [ ] T014 Verify the sanitizer still yields zero observed false positives across the iteration-15 classes and preserves allowlisted short names. (F-AC3 fixtures / sanitizer tests) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:41-44] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:52-54]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### PR-6 Decision Precedence

- [ ] T020 Add the authored-decision precedence input at `decision-extractor.ts:182-185` so `extractDecisions()` can reason about authoritative raw arrays when normalization missed. (`decision-extractor.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:66-73]

- [ ] T021 Gate the lexical fallback at `decision-extractor.ts:381-384` so placeholders are only emitted when decision observations, processed manual decisions, and authored raw arrays are all absent. (`decision-extractor.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:69-73]

- [ ] T022 Keep the Phase 3 D2 patch precedence-only and explicitly avoid any mode-wide lexical shutdown keyed only on JSON/file mode. (`decision-extractor.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1461-1463]

- [ ] T023 Author the F-AC2 fixture so authored decisions beat the lexical placeholder branch. (F-AC2 fixture) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159]

- [ ] T024 Author the degraded-payload regression fixture where `keyDecisions` is missing but narrative decisions still exist in payload text. (degraded-payload fixture) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

- [ ] T025 Confirm the degraded-payload fixture still yields meaningful decisions after T020-T022, proving the gate did not over-tighten the fallback path. (degraded-payload fixture) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1462-1463] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]
<!-- /ANCHOR:phase-3 -->

---

## Phase 3: Verification

- [ ] T030 Run `generate-context.js --json` against all Phase 3 fixtures after localized tests pass. (`generate-context.js`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:237-237]

- [ ] T031 Run the sibling smoke checks for F-AC1 and F-AC7 so Phase 3 does not accidentally regress the earlier truncation and anchor fixes. (sibling fixtures) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1514-1518]

- [ ] T032 Run `validate.sh` on `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence/`. (phase folder) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]

- [ ] T033 Update the parent PHASE DOCUMENTATION MAP status for Phase 3 only after T010-T032 are green. (`../spec.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:177-200]

- [ ] T034 Sync this child folder's `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` before handoff so the Phase 3 contract matches the parent handoff row. (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]

---

### Parallel Work Notes

- T004-T007 can run in parallel once T001-T003 define the sanitizer contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39]

- T013 and T014 can start after T010-T012 wire the integration seams. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]

- T023 and T024 can be prepared in parallel, but T025 depends on the completed D2 gate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-73]

---

### Dependency Notes

- T001-T007 should land before T010-T014 because PR-5 needs a stable sanitizer contract before workflow integration. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39]

- T010-T014 should finish before T020-T025 because the parent PR train sequences PR-5 before PR-6. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1164-1164]

- T023-T025 depend on T020-T022 because the D2 fixtures only prove the correct behavior after the lexical predicate is hardened. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-73]

- T030-T033 are closeout tasks and should not begin until the Phase 3 acceptance fixtures are green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All PR-5 tasks complete and F-AC3 is green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]

- [ ] All PR-6 tasks complete and F-AC2 plus the degraded-payload regression are green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

- [ ] `validate.sh` exits 0 for this child folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]

- [ ] Phase 3 is ready to satisfy the parent 3 -> 4 handoff row. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md` [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/tasks.md:75-80]
- Plan: `plan.md` [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/tasks.md:75-80]
- Checklist: `checklist.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]
<!-- /ANCHOR:cross-refs -->
