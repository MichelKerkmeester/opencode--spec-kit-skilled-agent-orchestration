---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: Graph Impact and Affordance Uplift (012)"
description: "Sub-phase task IDs for 010-graph-impact-and-affordance-uplift."
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Graph Impact and Affordance Uplift (012)

<!-- SPECKIT_LEVEL: 3 -->

---

## Sub-phase Task Summary

Each sub-phase carries its own detailed `tasks.md`. This file is the phase-level index.

| ID | Sub-phase | Owner | Effort | Status |
|----|-----------|-------|--------|--------|
| T-012-001 | 001-clean-room-license-audit | governance | S | pending |
| T-012-002 | 002-code-graph-phase-runner-and-detect-changes | Code Graph | L | pending |
| T-012-003 | 003-code-graph-edge-explanation-and-impact-uplift | Code Graph | M | pending |
| T-012-004 | 004-skill-advisor-affordance-evidence | Skill Advisor | M | pending |
| T-012-005 | 005-memory-causal-trust-display | Memory | S-M | pending |
| T-012-006 | 006-docs-and-catalogs-rollup | docs | M | pending |

---

## Cross-cutting tasks (phase-level)

- [ ] **T-012-X1** — Run `validate.sh --strict` after each sub-phase scaffold completes
- [ ] **T-012-X2** — Run `backfill-research-metadata.js --apply` after sub-phase scaffolds land
- [ ] **T-012-X3** — Refresh `026/graph-metadata.json` to include `012` in `children_ids` (via `generate-context.js` on 026 root)
- [ ] **T-012-X4** — Update `merged-phase-map.md` to record 012 as the GitNexus adoption phase
- [ ] **T-012-X5** — Phase-completion deep-review pass via `/spec_kit:deep-review:auto` after all sub-phases ship

---

## Dependencies

```
T-012-001 → T-012-002 → { T-012-003, T-012-004, T-012-005 } → T-012-006
                                                               ↓
                                                          T-012-X3, T-012-X4
                                                               ↓
                                                          T-012-X5
```

---

## References

- See per-sub-phase `tasks.md` for detailed task IDs (e.g., `001/tasks.md`)
- spec.md §3 (scope), §4 (requirements)
- plan.md §2 (sub-phase plan)
