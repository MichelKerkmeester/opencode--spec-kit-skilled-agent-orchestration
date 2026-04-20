# Iteration 7 — traceability

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-003.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/implementation-summary.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/decision-record.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/plan.md`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/tasks.md`
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/checklist.md`
10. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/implementation-summary.md`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- **R7-P1-001 — 027/006 is marked shipped at the phase level, but the child packet still sits in scaffold state and points at stale implementation paths.**
  - **Claim:** Phase-level traceability for `006-promotion-gates` is broken. The parent implementation summary records 006 as converged and shipped, but the child packet's own `implementation-summary.md` still says `Draft. Blocked on 027/003 + 027/004`, its checklist remains entirely unchecked, and its spec/plan/tasks still point auditors to `lib/promotion/gates.ts` and `lib/promotion/weight-delta.ts` even though the shipped code/tests live under `gate-bundle.ts`, `weight-delta-cap.js`, `semantic-lock.ts`, and `tests/promotion/promotion-gates.vitest.ts`. A reviewer following the canonical child packet cannot reconstruct what actually shipped.  
  - **evidenceRefs:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/implementation-summary.md:75-81`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/implementation-summary.md:23-35`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/checklist.md:9-50`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md:59-80`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md:120-135`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/plan.md:11-18`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/tasks.md:17-50`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:13-145`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts:21-200`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts:13-39`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:50-234`]
  - **counterevidenceSought:** I looked for a superseding 006 implementation summary, a filled review/checklist artifact inside the child packet, or compatibility aliases preserving the documented `gates.ts`/`weight-delta.ts` filenames. I found none: the packet-local docs remain scaffold placeholders, and the shipped promotion surface is the renamed bundle/lock/shadow-cycle test set above.
  - **alternativeExplanation:** The implementation may have landed under renamed files during late-cycle cleanup while the packet docs were intentionally left as scaffolding because the parent phase summary was treated as the authoritative convergence surface.
  - **finalSeverity:** P1
  - **confidence:** 0.99
  - **downgradeTrigger:** Downgrade if there is another canonical 006 packet artifact that explicitly supersedes the stale child docs and maps the final renamed modules and verification evidence back into the packet.

### P2

- None new this iteration. Prior ADR/checklist traceability advisories from iteration 3 remain relevant.

## Traceability Checks

- **Spec ↔ code alignment:** `027/006/spec.md`, `plan.md`, and `tasks.md` still reference pre-ship module names (`gates.ts`, `weight-delta.ts`) while the implementation/test surface now centers on `gate-bundle.ts`, `shadow-cycle.ts`, `semantic-lock.ts`, and `promotion-gates.vitest.ts`.
- **Checklist evidence:** Parent/child checklist precision issues from iteration 3 remain unresolved, and 027/006 is worse: its checklist is still fully unchecked despite phase-level shipped status.
- **ADR-007 parity decision:** Still not canonicalized in the parent decision ledger; no new evidence this iteration changed that prior conclusion.
- **Cross-refs intact:** Not fully. The parent phase summary says 006 converged, but the child packet cross-references still describe a blocked draft, so packet-local traceability fails closed.

## Verdict

**CONDITIONAL.** No new P0 surfaced, but one new P1 traceability failure remains: the shipped `027/006` child is not self-describing or audit-ready from its own canonical packet surfaces.

## Next Dimension

**maintainability** — inspect whether the promotion/compat/native-advisor package boundaries, renamed modules, and retained tests are coherently organized after the migration.
