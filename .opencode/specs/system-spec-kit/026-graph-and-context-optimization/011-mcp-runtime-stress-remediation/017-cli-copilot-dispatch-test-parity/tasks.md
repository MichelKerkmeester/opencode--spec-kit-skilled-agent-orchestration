---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: cli-copilot Dispatch Test Parity"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "T001-T206 task ledger covering setup (Phase 1), test rewrite (Phase 2), and verification (Phase 3) for the cli-matrix.vitest.ts cli-copilot section refresh."
trigger_phrases:
  - "017 tasks"
  - "cli-copilot dispatch test parity tasks"
importance_tier: "important"
contextType: "tasks-ledger"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity"
    last_updated_at: "2026-04-27T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md after the test rewrite + packet docs landed"
    next_safe_action: "Operator review; commit packet alongside the test rewrite"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: cli-copilot Dispatch Test Parity

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Read 011 deep-review report §4 F-004 + §7 Packet B PASS gate.
  - **Files**: `../011-post-stress-followup-research/review/review-report.md` (lines 91-99 + 170-174)
  - **Acceptance**: F-004's evidence (line numbers in `cli-matrix.vitest.ts:17-20` and `40-56`) and Packet B's PASS gate ("models built.argv, promptFileBody, and @PROMPT_PATH behavior, not the legacy command string") are both quoted in spec.md §2.
- [x] **T002** [P] Read existing `cli-matrix.vitest.ts` end-to-end; identify the 3 cli-copilot dispatch tests + smoke test that need updating.
  - **File**: `mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
  - **Acceptance**: Test inventory documented in plan.md §3 architecture diagram + Phase 2 ledger.
- [x] **T003** [P] Read `executor-config.ts` `buildCopilotPromptArg` shape and the existing `executor-config-copilot-target-authority.vitest.ts` for assertion patterns to mirror.
  - **Files**: `mcp_server/lib/deep-loop/executor-config.ts:101-348`, `mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`
  - **Acceptance**: `BuildCopilotPromptArgResult` shape (`argv`, `promptBody`, `promptFileBody?`, `enforcedPlanOnly`) confirmed; sibling test patterns adopted (e.g. `expect(built.argv[0]).toBe('-p')`).
- [x] **T004** [P] Read both `_auto.yaml` files to confirm the actual write-then-dispatch ordering and the literal anchors the static-grep test will key on.
  - **Files**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` (lines ~595-660), `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` (lines ~669-720)
  - **Acceptance**: Both files contain `if (built.promptFileBody !== undefined)` + `writeFileSync(promptPath, built.promptFileBody, 'utf8')` BEFORE `spawnSync('copilot'` (deep-review) or `command: 'copilot'` (deep-research). Confirmed by grep + manual inspection.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T101** Update imports in `cli-matrix.vitest.ts`: add `buildCopilotPromptArg`, drop `resolveCopilotPromptArg`. Add `dirname`, `resolve`, `fileURLToPath` for repo-root anchoring of YAML paths.
  - **File**: `mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
  - **Acceptance**: `grep -n "import.*buildCopilotPromptArg" cli-matrix.vitest.ts` returns 1 hit; `grep -n "resolveCopilotPromptArg" cli-matrix.vitest.ts` returns 0 hits in import lists.
- [x] **T102** Update `buildDispatchCommand`: drop `promptSizeBytes` parameter, replace the cli-copilot branch with a `throw new Error(...)` that points future maintainers at `buildCopilotPromptArg`.
  - **Acceptance**: Calling `buildDispatchCommand(parseExecutorConfig({ kind: 'cli-copilot' }), promptPath)` throws. The function signature loses the third parameter (no longer needed; only cli-copilot consumed it).
- [x] **T103** Add module-level constants: repo-root anchored YAML paths, `COPILOT_BASE_ARGV`, `APPROVED_FOLDER`. Use `fileURLToPath(import.meta.url)` + `dirname` + `resolve('..', ..., '..')` (6 levels up) for repo-root.
  - **Acceptance**: Both `DEEP_RESEARCH_AUTO_YAML` and `DEEP_REVIEW_AUTO_YAML` resolve to absolute paths that the test reads successfully.
- [x] **T104** Drop the 3 cli-copilot tests from the `cli-matrix dispatch command shape` describe block (small prompt, large prompt, threshold boundary).
  - **Acceptance**: Block now covers only native, cli-codex, cli-gemini, and cli-claude-code (5 tests; was 8).
- [x] **T105** Add new describe block `cli-matrix cli-copilot dispatch shape (buildCopilotPromptArg)` with 5 cases:
  - `kind:"approved"` + small prompt: argv carries preamble inline, `promptFileBody` undefined, `--allow-all-tools` retained.
  - `kind:"approved"` + large prompt: `argv[1]` is bare `@PROMPT_PATH`, `promptFileBody` defined with preamble + divider + body.
  - `kind:"missing"+writeIntent:false`: argv prompt slot equals raw prompt, no preamble, no `promptFileBody`, `--allow-all-tools` retained.
  - `kind:"missing"+writeIntent:true`: argv prompt slot is Gate-3 question, `--allow-all-tools` stripped, `enforcedPlanOnly:true`.
  - YAML auto-loop sites write `built.promptFileBody` to disk before invoking copilot: static grep both `_auto.yaml` files for `if (built.promptFileBody !== undefined)` + `writeFileSync(promptPath, built.promptFileBody` AND a copilot dispatch (`spawnSync('copilot'` or `command: 'copilot'`) at a later byte offset.
  - **Acceptance**: All 5 vitest cases pass.
- [x] **T106** Update smoke test (`exercises the large-prompt ... with a real subprocess and artifact writes`) to model approved-authority + large-prompt + `writeFileSync(promptPath, built.promptFileBody)` happy path.
  - **Subprocess change**: regex shifts from `/@(.+) and follow them exactly/` to `/^@(.+)$/`; subprocess additionally asserts the on-disk file contains `## TARGET AUTHORITY` and `Approved spec folder: <APPROVED_FOLDER>`.
  - **Acceptance**: Smoke test passes; outer test reads `iterationPath` and confirms preamble + folder + original body all present in the file the subprocess wrote back.
- [x] **T107** Confirm production code byte-stable: `executor-config.ts`, `spec_kit_deep-research_auto.yaml`, `spec_kit_deep-review_auto.yaml` not modified.
  - **Acceptance**: `git diff --stat` shows only `cli-matrix.vitest.ts` and packet docs; no production files in the diff.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T201** Run cli-matrix vitest. Expect 13/13 pass.
  - **Command**: `npx vitest run tests/deep-loop/cli-matrix.vitest.ts` (from `mcp_server/`)
  - **Acceptance**: `Tests 13 passed (13)`; exit 0.
- [x] **T202** Run full deep-loop test suite. Expect 73/73 pass (no regression in sibling tests).
  - **Command**: `npx vitest run tests/deep-loop/`
  - **Acceptance**: `Tests 73 passed (73)`; exit 0; 6 test files pass.
- [x] **T203** Run executor-config-copilot-target-authority vitest. Expect 29/29 pass (proves the helper contract this packet asserts is unchanged).
  - **Command**: `npx vitest run tests/executor-config-copilot-target-authority.vitest.ts`
  - **Acceptance**: `Tests 29 passed (29)`; exit 0.
- [x] **T204** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict`. Expect 0 structural errors; SPEC_DOC_INTEGRITY false-positives accepted as known noise (matching 010-012 baseline).
  - **Acceptance**: Same accepted-noise pattern as predecessor packets.
- [x] **T205** Author `implementation-summary.md` with verification table, decisions, known limitations, next steps.
  - **File**: `implementation-summary.md`
  - **Acceptance**: All anchors populated; not a placeholder.
- [x] **T206** Author `description.json` and `graph-metadata.json` with `specId="017"`, `folderSlug="cli-copilot-dispatch-test-parity"`, `parentChain` to 011, `depends_on=[011-post-stress-followup-research, 012-copilot-target-authority-helper]`, `related_to=[016-degraded-readiness-envelope-parity]`.
  - **Files**: `description.json`, `graph-metadata.json`
  - **Acceptance**: schema_version=1; `derived.status="complete"` once impl-summary is in place.

- [ ] **T301** Operator review of test rewrite + packet docs.
  - **Acceptance**: operator approves merge.
- [ ] **T302** Commit packet + test changes (parent session handles git).
  - **Acceptance**: `git status` clean for the packet's files post-commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-2 tasks marked `[x]`
- [x] All Phase 3 tasks T201-T206 marked `[x]` (T301-T302 are downstream operator/commit work)
- [x] No `[B]` blocked tasks remaining
- [x] cli-matrix vitest 13/13 pass; full deep-loop 73/73 pass; executor-config helper suite 29/29 pass
- [x] Production code (executor-config.ts + both _auto.yaml) byte-stable
- [x] `validate.sh --strict` returns 0 structural errors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation summary**: See `implementation-summary.md`
- **Source of recommendations**: `../011-post-stress-followup-research/review/review-report.md` §4 F-004 + §7 Packet B
- **Production helper this test pins**: `../012-copilot-target-authority-helper/spec.md` (`buildCopilotPromptArg`)
- **Sibling packet (P1)**: `../016-degraded-readiness-envelope-parity` (Packet A; degraded-readiness envelope work)
- **Sibling packet (P2 docs)**: `../018-catalog-playbook-degraded-alignment` (Packet C; catalog/playbook drift)
<!-- /ANCHOR:cross-refs -->
