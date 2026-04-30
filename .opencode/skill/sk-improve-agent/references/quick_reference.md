---
title: Quick Reference
description: Short operational reference for running the sk-improve-agent workflow.
---

# Quick Reference

Quick reminder for running `sk-improve-agent` without re-reading the full protocol. Use it when you already know the workflow and only need the command shape, runtime layout, and core guards.

---

## 1. OVERVIEW

### Purpose

Provides a compact reminder of the improve-agent workflow, the canonical command shape, and the packet-local runtime layout.

### When to Use

Use this reference when:
- You need the shortest possible command reminder
- You want to confirm the expected runtime folder layout
- You need a quick safety check before running the loop

### Core Principle

Proposal-first evidence is the default. Canonical mutation is a later guarded step, not the starting point.

The workflow copies `improvement_*` assets into the runtime, but the packet-local runtime files currently use the `agent-improvement-*` naming family shown below.

---

## 2. COMMANDS

```text
# Dynamic mode (the only evaluation path; works for any agent)
/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder={spec_folder}
```

### Standalone Scripts

```text
# Scan integration surfaces
node scripts/scan-integration.cjs --agent=debug

# Generate dynamic profile
node scripts/generate-profile.cjs --agent=.opencode/agent/debug.md

# 5-dimension scoring (dynamic mode, the only supported path)
node scripts/score-candidate.cjs --candidate=.opencode/agent/debug.md
```

### Dimension Weights (Dynamic Mode)

| Dimension | Weight |
| --- | --- |
| Structural Integrity | 0.20 |
| Rule Coherence | 0.25 |
| Integration Consistency | 0.25 |
| Output Quality | 0.15 |
| System Fitness | 0.15 |

---

## 3. RUNTIME LAYOUT

```text
{spec_folder}/improvement/
  agent-improvement-config.json
  agent-improvement-state.jsonl
  agent-improvement-strategy.md
  agent-improvement-dashboard.md
  experiment-registry.json
  candidates/
  benchmark-runs/
```

---

## 4. KEY GUARDS

- proposal-only by default
- promotion is a per-target decision under dynamic mode
- dynamic profiles drive scoring and benchmarks
- append-only ledger
- scorer independent from mutator
- benchmark evidence separate from mirror-sync packaging

---

## 5. RELATED RESOURCES

- `loop_protocol.md`
- `evaluator_contract.md`
- `integration_scanning.md`
- `benchmark_operator_guide.md`
- `promotion_rules.md`
- `../README.md`

