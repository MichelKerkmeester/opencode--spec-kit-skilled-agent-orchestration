# Strategy: Independent Review of Phase 010 + 010/007 + 011

**Session:** 008-deep-research-review-pt-01
**Mode:** AUTONOMOUS (10 iterations, convergence threshold 0.05)
**Executor:** cli-codex gpt-5.5 high fast (per-iteration fresh context)

---

## Research Charter

### What is being audited

| Packet | Scope | What "shipped" means |
|---|---|---|
| 010/001 | Clean-room license audit | LICENSE quote no longer needed (external project name scrubbed); ADR-012-001 |
| 010/002 | Phase-DAG runner + detect_changes | `runPhases` wraps scan; `detect_changes` MCP tool with diff-parser + readiness probe |
| 010/003 | Code-graph edge explanation + impact uplift | `reason`/`step` on edges; `blast_radius` enrichment (depthGroups, riskLevel, minConfidence, ambiguityCandidates, failureFallback) |
| 010/004 | Skill-advisor affordance evidence | Affordance evidence in `derived_generated` + `graph-causal` lanes; sanitizer + denylist; debug counters |
| 010/005 | Memory causal trust display | `trustBadges` on `MemoryResultEnvelope`; merge-per-field; age allowlist; trace flag; DI seam |
| 010/006 | Docs and catalogs rollup | Umbrella docs + 5 baseline manual_testing_playbook scenarios (014/026/199/203 + 271) + feature_catalog entries |
| 010/007 | Review remediation T-A..T-F | 33 findings closed: 1 P0 (scrub) + 21 P1 + 11 P2 |
| 011 | Playbook coverage + run | 4 playbook scenarios extended (11 new step-blocks), runner pass executed (4/4 UNAUTOMATABLE-by-design), 17 new vitest cases |

### Key research questions

1. **RQ1** — P0/P1 regressions in 010/001-006 the 010/007 remediation missed?
2. **RQ2** — Are the 33 closed findings genuinely closed, or doc-edit-only papering?
3. **RQ3** — Are the 010/007 hardenings tight at adversarial boundaries?
4. **RQ4** — Do umbrella docs match code reality?
5. **RQ5** — Are 011 tests sufficient to detect regressions?

### Severity ladder

- **P0** — security/correctness regression that would land in production undetected
- **P1** — required correctness/observability gap, surfaced by an adversarial input or scenario
- **P2** — nice-to-have polish (better error messages, additional test coverage, doc consistency)

### Remediation type axis (orthogonal to severity)

- **code-fix** — change code under `mcp_server/`
- **doc-fix** — change README/SKILL.md/INSTALL_GUIDE/spec.md/etc.
- **test-add** — new vitest/pytest case to detect a gap
- **scope-defer** — legitimately deferrable to a future packet

### Non-goals (do not do)

- Do NOT implement code changes during iterations 1–9; iteration 10 may propose remediation packets but not implement them
- Do NOT modify 010/001-006 implementation-summary or checklist files (010/007/T-B's territory; already synced)
- Do NOT re-run 010/007 deep-review iterations (already complete)
- Do NOT treat README claims as sufficient evidence without code or test confirmation

### Stop conditions

- Stop after 10 iterations (fixed run, user-requested)
- Stop earlier if every RQ has source-backed answers AND no new P0/P1 findings for 2 consecutive iterations
- Escalate rather than continue if state becomes invalid

---

## Per-iteration focus rotation

To avoid revisiting the same surface twice, iterations rotate by sub-phase × dimension:

| Iter | Primary focus | Dimension |
|---|---|---|
| 1 | 010/001 + 010/002 — license posture, phase runner, detect_changes preflight | correctness + security |
| 2 | 010/002 — diff-parser multi-file boundary, path canonicalization | adversarial input handling |
| 3 | 010/003 — edge reason/step round-trip, blast_radius enrichment | correctness |
| 4 | 010/003 — minConfidence, ambiguity, failureFallback.code (5 codes) | observability |
| 5 | 010/004 — affordance normalizer denylist, conflicts_with reject, debug counters | security + observability |
| 6 | 010/005 — trust-badge merge-per-field, age allowlist, dbGetter DI, cache invalidation | correctness |
| 7 | 010/006 — umbrella docs (root README, SKILL.md, mcp_server README/INSTALL_GUIDE) | doc/code drift |
| 8 | 010/007 T-A..T-F — verify 33 closures across code (not docs) | correctness + closure-integrity |
| 9 | 011 playbook scenarios + 17 new vitest cases — completeness vs adversarial input space | test rig integrity |
| 10 | Cross-cutting synthesis — Adopt/Adapt/Reject/Defer matrix; iteration-10 may compare findings against prior 010/007 iter outputs | meta + synthesis |

Each iteration produces:
- `iterations/iteration-NNN.md` — full findings + evidence + citations
- `deltas/iteration-NNN.jsonl` — append-only state delta (severity, theme, RQ, status)
- `logs/iteration-NNN.log` — raw cli-codex output

---

## Known Context

(Loaded from `memory_context` at workflow start — populated in iteration 1.)

- **Prior 010/007 deep-review** completed 2026-04-25 with 1 P0 + 21 P1 + 22 P2 findings, all closed in 6 batches.
- **Prior 011 playbook coverage** completed 2026-04-25 with 4 scenarios extended + 17 new vitest cases (all PASS) + runner verdict UNAUTOMATABLE-by-design 4/4.

---

## Convergence Detection

- **Hard stop:** iteration count == 10
- **Soft converge:** delta of new-finding-count between iterations N and N-1 ≤ 5% of total findings AND no new P0/P1 in past 2 iterations
- **Quality guards:** every RQ has at least 1 source-cited finding; every P0/P1 has remediation-type assigned

Convergence value tracked per iteration in `deltas/iteration-NNN.jsonl` (`convergence_score` field).

---

## Iteration Output Contract

Each iteration must:
1. Open with a 1-sentence focus reminder (matches strategy.md row)
2. Produce 3-10 source-cited findings (file:line)
3. Classify each finding by P0/P1/P2 and remediation-type
4. Map each finding to one of RQ1-RQ5
5. Set `convergence_score` in the delta line
6. Update `next_safe_action` in continuity frontmatter (in iteration's md)

Iteration 10 additionally:
7. Synthesizes across all 9 prior iterations
8. Produces final Adopt/Adapt/Reject/Defer matrix
9. Compares against (does not duplicate) the 010/007 deep-review findings

---

## Output Artifacts (final)

- `research.md` — 17-section synthesized findings document
- `resource-map.md` — file/symbol provenance ledger
- `iterations/iteration-{001..010}.md` — per-iteration findings
- `deltas/iteration-{001..010}.jsonl` — append-only state log
- `logs/iteration-{001..010}.log` — raw codex outputs
- `deep-research-state.jsonl` — orchestrator state log
- `deep-research-config.json` — frozen config (this folder)
