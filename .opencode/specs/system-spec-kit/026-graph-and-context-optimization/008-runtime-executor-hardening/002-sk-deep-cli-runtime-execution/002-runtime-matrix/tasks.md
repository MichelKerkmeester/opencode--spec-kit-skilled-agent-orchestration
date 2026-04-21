---
title: "Tasks: CLI Runtime Matrix for Iterative Skills"
description: "5 phases, ~12 tasks. Wire cli-copilot / cli-gemini / cli-claude-code as executors with per-kind validation."
trigger_phrases: ["019 tasks", "cli matrix tasks"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix"
    last_updated_at: "2026-04-18T11:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T-CFG-04 (Phase A)"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: CLI Runtime Matrix for Iterative Skills

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable within the same phase |
| `[A]` | Atomic-ship group member |

**Task ID format**: `T-<CAT>-NN` where CAT ∈ {CFG, YMR, YMV, DOC, TST, FLG, SUM}.

**Numbering continues from Phase 018** (e.g., T-CFG-04 follows Phase 018's T-CFG-01/02/03).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Sub-wave A — Per-kind config validation (REQ-001, REQ-002, REQ-011)

- [ ] **T-CFG-04** [A] Remove ExecutorNotWiredError rejection for 3 kinds.
  - File: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
  - Delete the branch that throws `ExecutorNotWiredError` for `cli-copilot`, `cli-gemini`, `cli-claude-code`.
  - Acceptance: `parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' })` returns a valid config.
- [ ] **T-CFG-05** [A] Add per-kind flag-compatibility map.
  - Same file.
  - Add `EXECUTOR_KIND_FLAG_SUPPORT` constant mapping each kind to its supported optional flags: `['model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'timeoutSeconds']`.
  - cli-codex: all 5
  - cli-copilot: `['model', 'timeoutSeconds']` (no CLI reasoningEffort, no serviceTier, no sandbox)
  - cli-gemini: `['model', 'sandboxMode', 'timeoutSeconds']` (no reasoningEffort, no serviceTier)
  - cli-claude-code: `['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds']` (no serviceTier)
  - native: `[]` (no flags apply)
- [ ] **T-CFG-06** [A] Add per-kind flag compatibility validator in `parseExecutorConfig`.
  - After Zod parse, iterate over the non-null, non-default fields and check each against the kind's support list.
  - On mismatch: throw `ExecutorConfigError` with a message like: *"Field 'serviceTier' is not supported by executor kind 'cli-gemini'. Supported fields for cli-gemini: model, sandboxMode, timeoutSeconds."*
- [ ] **T-CFG-07** [A] Add cli-gemini model whitelist.
  - `GEMINI_SUPPORTED_MODELS = ['gemini-3.1-pro-preview'] as const`
  - In the validator: if `kind === 'cli-gemini'` and `model` is set but not in the whitelist, reject with `ExecutorConfigError` listing the supported models.
- [ ] **T-CFG-08** [A] Update `executor-config.vitest.ts`.
  - Remove assertions that the 3 kinds throw `ExecutorNotWiredError`.
  - Add acceptance cases for each kind with its required fields only.
  - Add rejection cases for each kind's unsupported flags.
  - Add rejection case for invalid gemini model.
  - Expected green count: 16 existing + ~12 new = ~28 tests in this file.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Sub-wave B — YAML dispatch branches (REQ-003, REQ-005, REQ-006)

- [ ] **T-YMR-05** [A] Add 3 new branches to `spec_kit_deep-research_auto.yaml`.
  - `if_cli_copilot`: `command: copilot -p "$(cat {prompt-path})" --model {model} --allow-all-tools --no-ask-user` (or `@{prompt-path}` reference in a wrapper prompt for large prompts).
  - `if_cli_gemini`: `command: gemini "$(cat {prompt-path})" -m {model} -y -o text` (text output to preserve markdown narrative).
  - `if_cli_claude_code`: `command: claude -p "$(cat {prompt-path})" --model {model} --effort {reasoningEffort|high} --permission-mode acceptEdits --output-format text`.
  - All three branches share pre_dispatch render + post_dispatch_validate + record_executor_audit from Phase 018.
- [ ] **T-YMR-06** [A] Mirror T-YMR-05 into `spec_kit_deep-research_confirm.yaml`.
- [ ] **T-YMV-03** [A] Mirror T-YMR-05 into `spec_kit_deep-review_auto.yaml` (substitute review prompt-pack template path).
- [ ] **T-YMV-04** [A] Mirror T-YMV-03 into `spec_kit_deep-review_confirm.yaml`.

### Sub-wave C — Cross-CLI delegation docs (REQ-013)

- [ ] **T-DOC-05** Add Cross-CLI Delegation subsection to `.opencode/skill/sk-deep-research/SKILL.md` Executor Selection Contract.
  - Document: all 4 CLI executors CAN invoke other CLIs via their shell/sandbox.
  - Anti-pattern: self-recursion (same CLI as executor AND dispatched-to).
  - Auth/env propagation: each CLI brings its own credentials.
- [ ] **T-DOC-06** Mirror to `.opencode/skill/sk-deep-review/SKILL.md`.
- [ ] **T-DOC-07** [P] Update `.opencode/skill/sk-deep-research/references/loop_protocol.md` §3 Executor Resolution: list all 4 CLI kinds with dispatch command shapes.
- [ ] **T-DOC-08** [P] Mirror to `.opencode/skill/sk-deep-review/references/loop_protocol.md`.

### Sub-wave D — Setup flags (REQ-011)

- [ ] **T-FLG-03** Update `.opencode/command/spec_kit/deep-research.md` setup: Q-Exec options list now includes all 4 CLI kinds.
- [ ] **T-FLG-04** Mirror to `.opencode/command/spec_kit/deep-review.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Sub-wave E — Tests (REQ-003, REQ-004)

- [ ] **T-TST-06** [A] Create `tests/deep-loop/cli-matrix.vitest.ts`.
  - Per-CLI dispatch command shape tests (mocked exec).
  - Each test verifies the expected command string for a given config.
  - Include at least: cli-copilot with model+prompt, cli-gemini with whitelisted model, cli-claude-code with model+reasoningEffort.
- [ ] **T-TST-07** [A] Native-path regression check: all existing 40 tests still green.

### Sub-wave F — Ship

- [ ] **T-SUM-03** Populate `the packet implementation-summary document`.
- [ ] **T-SUM-04** Refresh `description.json` + `graph-metadata.json`.
- [ ] **T-CLG-01** Write the sk-deep-research v1.9.0.0 changelog under `.opencode/changelog/12--sk-deep-research/` per canonical template.
- [ ] **T-CLG-02** Write the sk-deep-review v1.6.0.0 changelog under `.opencode/changelog/13--sk-deep-review/`.
- [ ] **T-VAL-05** Run `validate.sh` on 019 packet; confirm 0 errors.
- [ ] **T-VAL-06** Commit + push to main.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 20 tasks marked `[x]`
- [ ] Per-kind flag validation works for all 4 CLI kinds
- [ ] No `ExecutorNotWiredError` thrown for any wired kind
- [ ] All 4 YAML dispatch branches present in both skills
- [ ] `tsc --noEmit` clean
- [ ] All vitest green (existing 40 + new)
- [ ] Cross-CLI delegation documented in both SKILL.md files
- [ ] `validate.sh` 0 errors on 019 packet
- [ ] Both changelogs follow canonical template (no frontmatter, summary-first)

### Atomic-Ship Groups

- **Group 1 — Config + YAML**: T-CFG-04/05/06/07 + T-YMR-05/06 + T-YMV-03/04 + T-TST-06
- **Group 2 — Docs**: T-DOC-05/06/07/08 + T-FLG-03/04
- **Group 3 — Ship**: T-SUM-03/04 + T-CLG-01/02 + T-VAL-05/06

Ship Groups 1+2 together; Group 3 after verification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../001-executor-feature/`
- **Per-CLI References**: `.opencode/skill/cli-codex/SKILL.md`, `.opencode/skill/cli-copilot/SKILL.md`, `.opencode/skill/cli-gemini/SKILL.md`, `.opencode/skill/cli-claude-code/SKILL.md`
<!-- /ANCHOR:cross-refs -->
