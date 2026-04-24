# Review Report - Fix Handover vs Drop Routing Confusion

## 1. Executive summary

**Verdict:** CONDITIONAL  
**Stop reason:** `maxIterationsReached`  
**Active findings:** P0 = 0, P1 = 5, P2 = 1  
**hasAdvisories:** true

The shipped router change stayed behaviorally clean in the scoped correctness and security passes, but the packet that documents the fix has accumulated enough migration and evidence drift to miss its own traceability standard. The review found no blocker-grade defect in `content-router.ts`; the issues are concentrated in stale completion/evidence surfaces inside the packet.

## 2. Scope

This review covered:

- Packet docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- Packet metadata: `description.json`, `graph-metadata.json`
- Referenced implementation/tests: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`
- Migrated research evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/research/010-search-and-routing-tuning-pt-02/research.md`

## 3. Method

The loop rotated across four dimensions for 10 iterations:

1. Correctness
2. Security
3. Traceability
4. Maintainability

Then it repeated the same order for revalidation and stabilization. The review compared packet claims against live code, tests, migrated metadata, and the surviving research artifact after the phase renumbering. A focused TypeScript + Vitest replay confirmed the scoped implementation still behaves as intended.

## 4. Findings by severity

### P0

| Finding | Dimension | Evidence | Notes |
|---------|-----------|----------|-------|
| None | — | — | No P0 issue surfaced in the reviewed seam. |

### P1

| Finding | Dimension | Evidence | Impact |
|---------|-----------|----------|--------|
| **F001** Packet completion surfaces overstate closure while checklist work remains open | Traceability | `checklist.md:13-16`, `spec.md:3`, `implementation-summary.md:26-29` | Review and resume surfaces can treat the packet as finished even though a P1 verification requirement is still open. |
| **F002** Renumbered packet still cites a dead sibling research path | Traceability | `plan.md:13-14`, `tasks.md:6-9`, `decision-record.md:7` | The packet's research basis is no longer reproducible from the cited path. |
| **F003** `description.json.parentChain` still carries the obsolete `010-search-and-routing-tuning` slug | Traceability | `description.json:14-19`, `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-88` | Packet lineage metadata disagrees with the packet's actual location after renumbering. |
| **F004** Packet evidence anchors still point at pre-growth code line ranges | Maintainability | `plan.md:13-16`, `checklist.md:7-12`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409-411`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001-1014`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1039-1049` | Follow-on reviewers cannot land on the intended evidence without manually rediscovering the live lines. |
| **F005** Continuity metadata hides the packet's remaining verification follow-up | Maintainability | `implementation-summary.md:15-17`, `implementation-summary.md:26-29`, `implementation-summary.md:108-110`, `checklist.md:13-16` | Resume surfaces advertise zero blockers/open questions even though the packet still records unresolved follow-up. |

### P2

| Finding | Dimension | Evidence | Impact |
|---------|-----------|----------|--------|
| **F006** Decision record frontmatter still says `planned` after the packet completed | Maintainability | `decision-record.md:1-3`, `spec.md:1-3` | Minor but persistent status ambiguity for future packet readers. |

## 5. Findings by dimension

| Dimension | Result | Notes |
|-----------|--------|-------|
| Correctness | Clean | The live router split between hard wrappers and soft operational cues matches the packet intent and the mixed-signal regression still passes. |
| Security | Clean | No new trust-boundary or data-exposure defect surfaced in the scoped routing change. |
| Traceability | 3 x P1 | Completion state, research evidence references, and packet lineage metadata drifted after migration. |
| Maintainability | 2 x P1, 1 x P2 | Packet anchors and continuity/status surfaces are stale enough to slow safe follow-on work. |

## 6. Adversarial self-check for P0

No P0 finding was recorded. The final correctness/security passes rechecked the scoped router implementation and the focused regression and did not uncover a blocker-grade runtime defect. The review therefore kept the outcome at documentation/metadata drift rather than escalating the packet to FAIL.

## 7. Remediation order

1. **Repair the broken research trail** — update `plan.md`, `tasks.md`, `decision-record.md`, and `checklist.md` so they cite the surviving research artifact instead of `../research/research.md`. This closes **F002** and removes part of **F001/F005**.
2. **Stop overstating packet completion** — reconcile `spec.md`, `checklist.md`, and the continuity block in `implementation-summary.md` so unresolved verification work is visible in all completion surfaces. This addresses **F001** and **F005**.
3. **Fix packet lineage metadata** — regenerate `description.json` so `parentChain` matches the current `001-search-and-routing-tuning` path. This resolves **F003**.
4. **Re-anchor live evidence** — replace the stale `content-router.ts` line references with the current implementation anchors. This resolves **F004**.
5. **Clean minor status drift** — change `decision-record.md` frontmatter from `planned` to the packet's real state. This resolves **F006**.

## 8. Verification suggestions

1. Re-run the packet review after the metadata/doc repairs and confirm the hard traceability gates (`spec_code`, `checklist_evidence`) flip to PASS.
2. Re-run:
   - `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
   - `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`
3. Resolve every packet doc reference that still points at `content-router.ts:369-378`, `868-877`, or `904-920`.
4. Verify `description.json.parentChain` matches the generator contract from `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`.
5. Confirm the continuity block no longer reports `completion_pct: 100` with empty blockers/open questions while checklist work remains open.

## 9. Appendix

### Iteration list and delta churn

| Iteration | Dimension | Ratio | New findings | Notes |
|-----------|-----------|------:|--------------|-------|
| 001 | correctness | 0.00 | 0 | Baseline runtime pass; no functional defect found. |
| 002 | security | 0.00 | 0 | Scoped security pass stayed clean. |
| 003 | traceability | 1.00 | 3 | Surfaced completion, research-link, and parentChain drift. |
| 004 | maintainability | 1.00 | 3 | Surfaced stale anchors, optimistic continuity, ADR status drift. |
| 005 | correctness | 0.00 | 0 | Revalidated live router behavior. |
| 006 | security | 0.00 | 0 | Revalidated the scoped security posture. |
| 007 | traceability | 0.14 | 0 new / 3 refined | Located surviving research under the root research archive. |
| 008 | maintainability | 0.08 | 0 new / 3 refined | Reconfirmed anchor and continuity decay across packet surfaces. |
| 009 | correctness | 0.03 | 0 | Stabilization pass. |
| 010 | security | 0.02 | 0 | Final stabilization pass before synthesis. |

### Artifact set

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-findings-registry.json`
- `review/deep-review-strategy.md`
- `review/deep-review-dashboard.md`
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
