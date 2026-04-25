---
title: "...aph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/implementation-summary]"
description: "Shipped-state summary for the merged CLI executor arc. Both child packets complete and pushed to main before packet consolidation."
trigger_phrases:
  - "cli runtime executors summary"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution"
    last_updated_at: "2026-04-18T16:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Packet consolidation from ex-018 and ex-019"
    next_safe_action: "R1-R12 remediation in downstream 018-cli-executor-remediation packet"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: CLI Runtime Executors (merged)

## Status
**Shipped** — both child packets merged to `main` 2026-04-18.

## What Shipped

### 001-executor-feature (ex-018)
- `executor-config.ts` — Zod schema, `parseExecutorConfig`, discriminated-union validation
- 4 YAMLs patched with `branch_on: "config.executor.kind"` dispatch (research auto+confirm, review auto+confirm)
- Prompt-pack templates: `sk-deep-research/assets/prompt_pack_iteration.md.tmpl`, `sk-deep-review/assets/prompt_pack_iteration.md.tmpl`
- Setup flag parsing: `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`
- JSONL audit field `executor: {kind, model, reasoningEffort, serviceTier}` per iteration
- SKILL.md CONTRACT sections for both iterative skills
- 62 new tests across executor-audit, post-dispatch-validate, dispatch-failure, prompt-pack render

### 002-runtime-matrix (ex-019)
- Three more executor kinds wired: `cli-copilot`, `cli-gemini`, `cli-claude-code`
- `EXECUTOR_KIND_FLAG_SUPPORT` per-kind compatibility map
- Copilot 3-concurrent cap preserved
- Per-kind YAML dispatch branches in all 4 YAMLs
- Cross-CLI delegation documented

## Test Metrics (combined)
- Tests passing: 116 (up from 54 pre-feature)
- Test files: 13 (up from 5)
- TypeScript errors: 0
- Regression: native path byte-for-byte identical to pre-feature baseline

## Downstream Remediation

30-iter deep-research via `cli-codex gpt-5.4 high fast` dogfood produced 12 R-IDs (R1-R12) in `research/017-sk-deep-cli-runtime-execution-pt-01/research.md`. Those closed in `../002-cli-executor-remediation/`.

## Changelogs

- `.opencode/changelog/12--sk-deep-research/v1.10.0.0.md`
- `.opencode/changelog/13--sk-deep-review/v1.7.0.0.md`
- `.opencode/changelog/01--system-spec-kit/v3.4.0.2.md` (executor wiring)

## Consolidation Provenance

This top-level packet is a post-ship consolidation of the ex-`017-sk-deep-cli-runtime-execution/001-executor-feature` and ex-`017-sk-deep-cli-runtime-execution/002-runtime-matrix` packets into a single thematic arc. No source code changed during consolidation. Only folder structure and cross-references were updated.

---

## Sub-phase summaries

### 001-executor-feature

**Status:** PASS — shipped 2026-04-18. Verdict: PASS. Effort: ~2h wall-clock via `cli-codex gpt-5.4 high fast` dogfooding (feature built itself with the executor it was shipping). Tests: 40/40 vitest. `tsc --noEmit` clean. 22 files touched.

**What shipped:** Executor selection for `sk-deep-research` + `sk-deep-review` as a branch INSIDE the existing YAML `step_dispatch_iteration` (not a loop replacement). Preserves all skill-owned invariants (state ownership, reducer exclusivity, convergence detection, lifecycle events) while enabling `codex exec` dispatch with `gpt-5.4 + reasoning-effort=high + service-tier=fast`.

Key artifacts: `executor-config.ts` (Zod schema + `parseExecutorConfig` + discriminated-union validation), 4 YAMLs patched with `branch_on: "config.executor.kind"` dispatch, prompt-pack templates for both iterative skills, setup flag parsing (`--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`), JSONL audit field `executor: {kind, model, reasoningEffort, serviceTier}` per iteration, SKILL.md CONTRACT sections, 62 new tests.

---

### 002-runtime-matrix

**Status:** PASS — shipped 2026-04-18 (2026-04-24 CF-026 remediation also shipped). Effort: ~1.5h wall-clock (same cli-codex dogfooding pattern). Tests: 54/54 vitest across 5 suites. `tsc --noEmit` clean.

**What shipped:** Three additional executor kinds wired beyond Phase 018's `cli-codex`: `cli-copilot`, `cli-gemini`, `cli-claude-code`. Each CLI has different invocation surface — shared config schema gained per-kind flag-compatibility validation via `EXECUTOR_KIND_FLAG_SUPPORT`. Copilot 3-concurrent cap preserved. Per-kind YAML dispatch branches added to all 4 YAMLs.

**CF-026 remediation (2026-04-24):** codex/gemini/claude permission controls made executable; subprocess smoke coverage added for Copilot wrapper; audited failure paths documented.

**Known blocker:** cli-copilot still requires `--allow-all-tools`; no narrower CLI permission surface available.
