---
title: "Feature Specification: CLI Runtime Executors for Iterative Skills (merged)"
description: "Merged packet covering the CLI executor arc: 001-executor-feature (ex-018, native + cli-codex) plus 002-runtime-matrix (ex-019, cli-copilot + cli-gemini + cli-claude-code). Shared executor-config.ts, dispatch YAML branching, per-kind flag validation."
trigger_phrases: ["cli runtime executors", "cli executor selection", "cli-codex deep research", "cli-copilot executor", "cli-gemini executor", "cli-claude-code executor", "executor kind config"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-cli-runtime-executors"
    last_updated_at: "2026-04-18T16:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Packet consolidation: ex-018 executor feature + ex-019 runtime matrix merged"
    next_safe_action: "Cross-reference updates swept across repo"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: CLI Runtime Executors for Iterative Skills (merged)

> **Consolidation note (2026-04-18).** This packet merges the former Phase 018 (native plus cli-codex) with the former Phase 019 (cli-copilot plus cli-gemini plus cli-claude-code) into a single CLI runtime executor arc. Both ship the same executor-selection surface for `sk-deep-research` and `sk-deep-review` workflow YAMLs. Historical detail lives in the child packets under `001-executor-feature/` and `002-runtime-matrix/`.

---

## 1. PROBLEM STATEMENT

`sk-deep-research` and `sk-deep-review` originally hardcoded `model: opus` at YAML dispatch and forbade direct CLI-in-a-loop (SKILL.md:46-50). The CLI executor is a tool inside the command's workflow, not a replacement. This packet makes executor selection a first-class, YAML-owned dispatch branch.

---

## 2. SCOPE

### 001-executor-feature (ex-018)
- Config schema: `config.executor.{kind, model, reasoningEffort, serviceTier, timeoutSeconds}` on both skills
- Dispatch branching in 4 YAMLs (research auto+confirm, review auto+confirm) via `branch_on: "config.executor.kind"`
- Two kinds: `native` (default, preserves current Task + @deep-research agent behavior) and `cli-codex` (codex exec + reasoning-effort + service-tier)
- Prompt-pack template extraction (executor-agnostic markdown)
- Setup phase flag parsing (`--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`)
- JSONL audit field: `executor: {kind, model, reasoningEffort, serviceTier}` per iteration
- Zod validator `parseExecutorConfig` with fail-fast on invalid combinations

### 002-runtime-matrix (ex-019)
- Adds three more executor kinds: `cli-copilot`, `cli-gemini`, `cli-claude-code`
- Per-kind flag-compatibility map `EXECUTOR_KIND_FLAG_SUPPORT` rejecting invalid combinations (e.g., service-tier on non-codex kinds)
- YAML dispatch branches for the three new kinds in all 4 YAMLs
- Copilot: 3-concurrent dispatch cap preserved (respects user memory `feedback_copilot_concurrency_override.md`)
- Documentation of cross-CLI delegation patterns

---

## 3. SUCCESS CRITERIA

1. Native path regression: identical byte-for-byte iteration output to pre-feature
2. All 4 CLI executors produce valid iteration-NNN.md + JSONL delta with `executor` audit field
3. Symmetric implementation across `sk-deep-research` and `sk-deep-review` (no asymmetric handler drift)
4. Config validator rejects invalid kind/flag combinations at config-write time
5. YAML-owned state, convergence, and dispatch invariants preserved across all executors

---

## 4. CHILD PACKET MAPPING

| Child | Ex-Phase | Deliverable |
|-------|----------|-------------|
| `001-executor-feature/` | 017-cli-runtime-executors/001-executor-feature | native + cli-codex ship |
| `002-runtime-matrix/` | 017-cli-runtime-executors/002-runtime-matrix | cli-copilot + cli-gemini + cli-claude-code ship |

---

## 5. DOWNSTREAM

- `018-cli-executor-remediation/` (ex-020) remediates R1-R12 findings from the 30-iter deep-research dogfood pass against this packet's research root (`research/017-cli-runtime-executors-001-executor-feature/`)
