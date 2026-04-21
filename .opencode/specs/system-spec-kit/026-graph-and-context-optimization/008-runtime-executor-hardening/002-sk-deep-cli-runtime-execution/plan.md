---
title: "Implementation Plan: CLI Runtime Executors (merged)"
description: "Top-level plan pointer for the merged CLI executor arc. Detail lives in 001-executor-feature/plan.md and 002-runtime-matrix/plan.md."
trigger_phrases: ["cli runtime executors plan", "cli executor plan"]
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution"
    last_updated_at: "2026-04-18T16:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Merged plan pointer created"
    next_safe_action: "Consult child plans for detail"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: CLI Runtime Executors (merged)

> Both child packets have already shipped to `main`. See:
> - `001-executor-feature/plan.md` (ex-018 plan — 5 phases A-E)
> - `002-runtime-matrix/plan.md` (ex-019 plan — 3 phases)

---

## 1. ARC OVERVIEW

| Sequence | Child | Shipped | Key Artifacts |
|----------|-------|---------|---------------|
| 1 | `001-executor-feature/` | 2026-04-18 (commit `77f7bc5ab` area) | `executor-config.ts`, 4 YAMLs patched, prompt-pack templates, 62 new tests |
| 2 | `002-runtime-matrix/` | 2026-04-18 (commit `77f7bc5ab` area) | `EXECUTOR_KIND_FLAG_SUPPORT`, 3 new executor kinds wired, per-kind validation |

---

## 2. CROSS-CUTTING INVARIANTS

1. YAML owns state, convergence, and dispatch — executor is HOW, YAML is WHAT
2. JSONL `executor` audit field present on every iteration across all kinds
3. Native default preserves byte-for-byte behavior
4. Fail-fast config validation at write-time, not at first dispatch
5. Symmetric implementation across `sk-deep-research` and `sk-deep-review`

---

## 3. CROSS-REFERENCES

- Research root: `research/017-sk-deep-cli-runtime-execution-pt-01/` (30-iter deep-research dogfood that seeded the 018-cli-executor-remediation packet)
- Downstream remediation: `../002-cli-executor-remediation/` (closes R1-R12)
- Related changelogs: `.opencode/changelog/12--sk-deep-research/v1.10.0.0.md`, `.opencode/changelog/13--sk-deep-review/v1.7.0.0.md`
