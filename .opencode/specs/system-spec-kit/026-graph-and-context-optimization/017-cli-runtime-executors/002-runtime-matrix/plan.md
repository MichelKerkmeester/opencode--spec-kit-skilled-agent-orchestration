---
title: "Implementation Plan: CLI Runtime Matrix for Iterative Skills"
description: "5-phase plan wiring cli-copilot, cli-gemini, cli-claude-code as executors alongside cli-codex. Per-kind config validation. Cross-CLI delegation documentation."
trigger_phrases: ["019 plan", "cli runtime matrix plan"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-cli-runtime-executors/002-runtime-matrix"
    last_updated_at: "2026-04-18T11:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Plan scaffolded"
    next_safe_action: "Begin Phase A"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

# Implementation Plan: CLI Runtime Matrix for Iterative Skills

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server lib), YAML (command assets), JSON (config schemas), Markdown (docs) |
| **Framework** | vitest (tests), Zod (schema validation) |
| **Runtime Dependency** | `codex` + `copilot` + `gemini` + `claude` CLIs on PATH for smoke tests |

### Overview

Build on Phase 018. Replace the `ExecutorNotWiredError` rejection for three reserved kinds with actual dispatch branches. Each CLI has distinct invocation semantics, so the shared config schema grows a per-kind flag-compatibility validator. YAML dispatch in both skills gains three new branches per YAML (12 new branches total across 4 YAMLs). Cross-CLI delegation is documented in prose as design intent, not coded as runtime enforcement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 018 shipped and all 40 tests green
- [x] Each CLI's canonical invocation syntax researched (spec.md §12)
- [x] Per-CLI flag-compatibility matrix derived
- [x] Decision records drafted for per-kind vs discriminated-union schema choice

### Definition of Done

- [ ] All 4 CLI executors wired (no ExecutorNotWiredError for any of the 4 kinds)
- [ ] Per-kind validation rejects unsupported flag combinations with clear errors
- [ ] Symmetric YAML structure across 4 YAMLs
- [ ] Cross-CLI delegation documented in both skill docs
- [ ] All tests green: existing 40 plus new per-CLI matrix tests
- [ ] `tsc --noEmit` clean
- [ ] `validate.sh` on 019 exits 0 errors (warnings acceptable)
- [ ] Changelogs shipped per canonical template
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Per-kind validation with a flat config (not discriminated union). Each kind has a declared set of supported flags; setting an unsupported flag rejects at parse time. Rationale in `decision-record.md` ADR-006.

### Key Components

- **`executor-config.ts` (updated)**: Adds a per-kind compatibility map. `parseExecutorConfig` checks that any non-default flag on the config is supported by the selected kind.
- **YAML dispatch branches (new)**: Each CLI's branch emits the CLI's canonical command with its specific flag set. All branches still share the pre_dispatch render, post_dispatch_validate, and record_executor_audit steps from Phase 018.
- **SKILL.md Cross-CLI Delegation subsections (new)**: Documents what's possible, what's forbidden, and auth/env propagation.

### Data Flow (per-kind routing)

```
step_dispatch_iteration:
  branch_on: config.executor.kind
    → if_native: @deep-* agent with Opus  (018)
    → if_cli_codex: codex exec ... - < prompt  (018)
    → if_cli_copilot: copilot -p "prompt" --model X --allow-all-tools --no-ask-user  (019)
    → if_cli_gemini: gemini "prompt" -m X -y -o json  (019)
    → if_cli_claude_code: claude -p "prompt" --model X --effort Y --permission-mode acceptEdits  (019)

All branches funnel through:
  post_dispatch_validate → record_executor_audit → reduce_state → graph_upsert
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Per-kind config validation (5h)

1. Update `executor-config.ts`: remove the `ExecutorNotWiredError` rejection for cli-copilot / cli-gemini / cli-claude-code.
2. Add `EXECUTOR_KIND_FLAG_SUPPORT` map: per-kind list of supported optional flags.
3. Add validator: if config sets a flag not in the kind's support list, throw `ExecutorConfigError` with a clear message naming the unsupported flag + kind.
4. Add cli-gemini model whitelist enforcement.
5. Update `executor-config.vitest.ts`: add cases for all 4 CLI kinds; validate rejections for unsupported flags.
6. Verify: `tsc --noEmit` clean, existing 16 tests + new cases green.

### Phase B — YAML dispatch branches (6h)

1. Add `if_cli_copilot`, `if_cli_gemini`, `if_cli_claude_code` to `spec_kit_deep-research_auto.yaml`.
2. Mirror into `spec_kit_deep-research_confirm.yaml`.
3. Mirror into `spec_kit_deep-review_auto.yaml` + confirm.
4. cli-copilot special handling: prompt-as-positional via shell-escaped string; large-prompt fallback uses `@path` reference to the rendered prompt file.
5. Verify: existing 40 tests still green.

### Phase C — Cross-CLI delegation docs (3h)

1. Add Cross-CLI Delegation subsection to `.opencode/skill/sk-deep-research/SKILL.md` (Executor Selection Contract area).
2. Mirror to `.opencode/skill/sk-deep-review/SKILL.md`.
3. Update the loop-protocol reference at `.opencode/skill/sk-deep-research/references/loop_protocol.md` §3 Executor Resolution and its review counterpart: include the 3 new kinds and note that runtime-level recursion detection is out of scope.

### Phase D — Setup flags + tests (3h)

1. Update `.opencode/command/spec_kit/deep-research.md` setup: flag parsing accepts all 4 CLI kinds (currently already accepts the strings; just need to document new kinds as valid).
2. Update `.opencode/command/spec_kit/deep-review.md` setup: same.
3. Create `tests/deep-loop/cli-matrix.vitest.ts`: per-CLI smoke tests with mocked exec. Each test verifies the expected command string is produced given a config.

### Phase E — Changelogs + ship (3h)

1. Write the sk-deep-research v1.9.0.0 changelog per canonical template (path under `.opencode/changelog/12--sk-deep-research/`).
2. Write the sk-deep-review v1.6.0.0 changelog (path under `.opencode/changelog/13--sk-deep-review/`).
3. Populate the packet implementation-summary document.
4. Refresh `description.json` + `graph-metadata.json`.
5. `validate.sh` on 019 exits 0 errors.
6. Commit + push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | File |
|-----------|-------|------|
| Unit | Per-kind flag compatibility | `tests/deep-loop/executor-config.vitest.ts` (extended) |
| Unit | Per-CLI dispatch command shape | `tests/deep-loop/cli-matrix.vitest.ts` (new) |
| Regression | All existing 40 tests still pass | existing suites |
| Smoke (optional, manual) | Live invocation of each CLI with `--max-iterations=1` | ad-hoc in Phase E |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `copilot` CLI on PATH | External | Installed per user workspace | Smoke test unavailable; unit tests still pass |
| `gemini` CLI on PATH | External | Installed per user workspace | Same |
| `claude` CLI on PATH | External | Installed per user workspace | Same |
| Phase 018 shared modules | Internal | Shipped 2026-04-18 | Blocks this packet; all shared deep-loop modules reused as-is |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-ship regression where native-path or cli-codex iteration produces different output, OR any of the 3 new CLI paths fail for > 5% of invocations.
- **Procedure**: Single-commit revert of the 019 PR restores the 018 state (cli-codex + native only). Per-kind validation changes are additive; removing them has no blast radius on the 018 paths.
- **Blast radius**: Users who adopted cli-copilot / cli-gemini / cli-claude-code have their config rejected post-revert. They fall back to cli-codex or native.
<!-- /ANCHOR:rollback -->
