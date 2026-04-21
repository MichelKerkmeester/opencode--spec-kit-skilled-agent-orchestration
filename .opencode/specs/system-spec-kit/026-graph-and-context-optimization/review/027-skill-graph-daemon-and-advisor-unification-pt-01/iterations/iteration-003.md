# Iteration 3 — traceability

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/checklist.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

#### R3-P1-001 — Canonical phase packet still points at research-state artifacts instead of shipped implementation state

- **Claim:** The parent Phase 027 packet is not traceably aligned to the shipped implementation state: its canonical `spec.md` still declares the phase as `Research (Draft)` and its top-level `checklist.md` is still the research-convergence checklist, while the phase implementation summary declares all seven children complete. A reviewer following the parent packet cannot reconstruct implementation acceptance from the canonical phase surfaces.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md:49-59`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/checklist.md:10-33`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:42-43`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:71-81`
- **Counterevidence sought:** I looked for a superseding top-level implementation checklist or an explicit note that the parent packet should remain research-only while child packets carry all implementation verification. The packet root only exposes the research checklist, and the implementation summary itself is written as the canonical phase-complete surface.
- **Alternative explanation:** The team may have intended the parent packet to preserve the original research scaffold and rely on child checklists for implementation acceptance. That still leaves the canonical phase-level packet internally inconsistent during release-readiness review.
- **Final severity:** P1
- **Confidence:** 0.98
- **Downgrade trigger:** Downgrade if the parent packet contract explicitly says top-level `spec.md` and `checklist.md` remain research-only after implementation and another canonical implementation-verification surface is mandated at the phase root.

#### R3-P1-002 — Multiple shipped checklist claims are marked complete without file:line evidence

- **Claim:** The traceability contract requiring checklist `[x]` items to carry file:line evidence is not met across the shipped implementation packet. Child 004 and 005 checklists mark many acceptance items complete using bare filenames, test-count summaries, or prose labels instead of file:line citations, which weakens auditability for the MCP and compat surfaces.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:54-59`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:65-79`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:84-95`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:49-65`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:71-84`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/checklist.md:39-90`
- **Counterevidence sought:** I checked whether this packet was uniformly using coarse checklist evidence or whether line-precise evidence existed elsewhere. The 003 checklist does use file:line evidence extensively, which shows the packet already has a concrete pattern for precise traceability.
- **Alternative explanation:** Some checklist authors may have treated these as lightweight verification summaries rather than audit-grade evidence records. That interpretation conflicts with the review criterion for checklist-backed traceability and with the stronger evidence style already used in 003.
- **Final severity:** P1
- **Confidence:** 0.95
- **Downgrade trigger:** Downgrade if the governing checklist standard for this phase explicitly permits filename-only evidence for implementation packets and reserves file:line citations for review artifacts only.

### P2

#### R3-P2-001 — ADR-007 is referenced as load-bearing parity guidance but is not canonicalized in the parent decision record

- **Claim:** ADR-007 is present as a parity-semantics decision in the 003 implementation summary and is referenced from the parent implementation summary, but the parent `decision-record.md` still publishes only ADR-001 through ADR-006. The decision is captured, but its canonical cross-reference chain is incomplete.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:36-37`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:83-91`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/decision-record.md:8-10`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/plan.md:93`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/implementation-summary.md:85-88`

## Traceability Checks

- **Spec-to-code alignment:** parent implementation summary does track the seven shipped children, but the parent `spec.md` and `checklist.md` do not align with that shipped state.
- **Checklist evidence:** 003 satisfies line-precise checklist evidence; 004 and 005 do not, so the packet is inconsistent on the exact review requirement this iteration was meant to validate.
- **ADR chain:** ADR-007 exists as an implementation-level decision, but the parent ADR ledger and summary tables still stop at ADR-006.
- **Cross-refs:** code-to-spec references for status/validation surfaces remain intact enough to audit the earlier correctness/security findings (`advisor-status.ts`, `advisor-validate.ts`, `gate-bundle.ts`), but the documentation surfaces above do not provide a clean phase-level audit trail.

## Verdict

**CONDITIONAL.** No new P0 surfaced, but two new P1 traceability gaps remain: the canonical phase packet is internally inconsistent about whether Phase 027 is still research or fully shipped, and multiple accepted checklist items are not backed by file:line evidence.

## Next Dimension

**maintainability** — focus on package-boundary cleanliness, import-path consistency, dead-code risk, and whether the migrated tests remain coherently colocated under `mcp_server/skill-advisor/`.
