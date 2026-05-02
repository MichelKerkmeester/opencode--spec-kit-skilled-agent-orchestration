---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Copilot Target-Authority Helper"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "T001-T303 task ledger covering setup (Phase 1), implementation (Phase 2), and verification (Phase 3) for the buildCopilotPromptArg helper + 2 YAML wire-ins + vitest."
trigger_phrases:
  - "012 tasks"
  - "copilot authority helper tasks"
importance_tier: "important"
contextType: "tasks-ledger"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/012-copilot-target-authority-helper"
    last_updated_at: "2026-04-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md after shipping helper + YAML + tests"
    next_safe_action: "Operator review; commit packet alongside code"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Copilot Target-Authority Helper

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

- [x] **T001** Read research.md §3 in full and verify file:line targets exist on disk.
  - **Files**: `../011-post-stress-followup-research/research/research.md`, `mcp_server/lib/deep-loop/executor-config.ts:66-70`, `spec_kit_deep-research_auto.yaml:601-625`, `spec_kit_deep-review_auto.yaml:669-683`, runs/I1/cli-copilot-1/score.md
  - **Acceptance**: All cited paths resolve; line numbers match the recommended insertion points.
- [x] **T002** [P] Read existing `resolveCopilotPromptArg` and the YAML cli-copilot dispatch shapes; understand prior 16KB threshold + `@PROMPT_PATH` wrapper behavior.
  - **Acceptance**: Behavior matrix documented in plan.md §3 reflects the prior contract.
- [x] **T003** [P] Read 004-memory-save-rewrite/spec.md to confirm the planner-first contract this layer enforces upstream.
  - **Acceptance**: Cross-reference line cited in spec.md §2 Problem.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T101** Append `CopilotTargetAuthority` type + `buildCopilotPromptArg` + `buildTargetAuthorityPreamble` + `buildMissingAuthorityGate3Prompt` to `executor-config.ts`. Existing `resolveCopilotPromptArg` body is byte-stable.
  - **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
  - **Acceptance**: `grep -n "export function buildCopilotPromptArg" mcp_server/lib/deep-loop/executor-config.ts` returns 1 hit.
- [x] **T102** Replace `if_cli_copilot.command` in `spec_kit_deep-research_auto.yaml` with the helper-routed Node script. Resolves `targetAuthority` from `{spec_folder}` template; falls back to Gate-3 enforcement when absent. Adds 2 explanatory `notes` entries.
  - **File**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - **Acceptance**: `grep -n "buildCopilotPromptArg" spec_kit_deep-research_auto.yaml` returns ≥2 hits (import + call).
- [x] **T103** Replace `if_cli_copilot.command` in `spec_kit_deep-review_auto.yaml` with the helper-routed Node script. Unifies on Node-based dispatch (away from prior bash/`wc -c` shape). Adds 2 explanatory `notes` entries.
  - **File**: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
  - **Acceptance**: `grep -n "buildCopilotPromptArg" spec_kit_deep-review_auto.yaml` returns ≥2 hits.
- [x] **T104** Author vitest at `mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` covering 3 behavior-matrix branches + override resistance + large-prompt fallback + exported helpers. 13 cases across 6 describe blocks.
  - **File**: `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`
  - **Acceptance**: File compiles (vitest discovery picks it up via `mcp_server/tests/**/*.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T201** Run new vitest. Expect 13/13 pass.
  - **Command**: `node_modules/.bin/vitest run tests/executor-config-copilot-target-authority.vitest.ts` (from `mcp_server/`)
  - **Acceptance**: `Tests 13 passed (13)`; exit 0.
- [x] **T202** Run existing executor-config vitest. Expect 24/24 pass (no regression in sibling helper).
  - **Command**: `node_modules/.bin/vitest run tests/deep-loop/executor-config.vitest.ts`
  - **Acceptance**: `Tests 24 passed (24)`; exit 0.
- [x] **T203** Run combined executor-config test surface (37 total).
  - **Acceptance**: `Tests 37 passed (37)`; exit 0.
- [x] **T204** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict`. Expect 0 structural errors; SPEC_DOC_INTEGRITY false-positives accepted as known noise (matching 010 + 011 baseline).
  - **Acceptance**: same accepted-noise pattern as predecessor packets.
- [x] **T205** Author `implementation-summary.md` with verification table, decisions, known limitations, next steps.
  - **File**: `implementation-summary.md`
  - **Acceptance**: All 5 anchors populated; not a placeholder.
- [x] **T206** Author `description.json` and `graph-metadata.json` with `specId="012"`, `folderSlug="copilot-target-authority-helper"`, `parentChain` to 011, `depends_on=[011-post-stress-followup-research, 010-stress-test-rerun-v1-0-2, 003-continuity-memory-runtime/004-memory-save-rewrite]`, `related_to=[009-memory-search-response-policy]`.
  - **Files**: `description.json`, `graph-metadata.json`
  - **Acceptance**: schema_version=1; `derived.status="complete"` once impl-summary is in place.

- [ ] **T301** Operator review of helper, YAML wiring, tests, and packet docs.
  - **Acceptance**: operator approves merge.
- [ ] **T302** Commit packet + code changes (parent session handles git).
  - **Acceptance**: `git status` clean post-commit.
- [ ] **T303** Live cli-copilot dispatch verification on the next deep-research or deep-review run that exercises cli-copilot. Confirm `## TARGET AUTHORITY` preamble is present in the rendered prompt and ZERO unauthorized folder mutations occur.
  - **Acceptance**: deferred follow-up; logged in implementation-summary.md Next Steps.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-2 tasks marked `[x]`
- [x] All Phase 3 tasks T201-T206 marked `[x]` (T301-T303 are downstream operator/commit/live work)
- [x] No `[B]` blocked tasks remaining
- [x] Vitest 37/37 pass (13 new + 24 regression)
- [x] `validate.sh --strict` returns 0 structural errors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation summary**: See `implementation-summary.md`
- **Source of recommendations**: `../011-post-stress-followup-research/research/research.md` §3
- **Failing cell**: `../010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md`
- **Planner-first contract**: `../../003-continuity-memory-runtime/004-memory-save-rewrite/spec.md`
<!-- /ANCHOR:cross-refs -->
