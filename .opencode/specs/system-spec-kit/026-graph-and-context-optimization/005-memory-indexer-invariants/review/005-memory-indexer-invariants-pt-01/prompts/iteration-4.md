# Deep-Review Iteration Prompt Pack — Iteration 4

You are dispatched as a LEAF deep-review agent. Iter-1 (correctness, P1=1/P2=2), iter-2 (security, P2=3 new), iter-3 (traceability, P2=4 new) complete. This is the maintainability pass — the LAST dimension. After this iteration, dimension coverage hits 4/4 and the loop manager will evaluate STOP gates.

## STATE SUMMARY

```
Iteration: 4 of 7
Mode: review
Dimension: maintainability (priority 4 — final)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants
Review Target Type: spec-folder
Prior Findings (cumulative): P0=0 P1=1 P2=9
Dimension Coverage: 3 / 4 (correctness, security, traceability)
Coverage Age: 1
Last 3 ratios: 0.07 -> 0.05 -> 0.04
Stuck count: 2 (entering stuck-recovery territory; iter-4 doubles as the recovery pivot to the least-covered dimension)
Provisional Verdict: CONDITIONAL (hasAdvisories=true)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Last claim_adjudication_passed: true
```

## ITERATION 1+2+3 RECAP (do not re-flag)

- **P1-001** (correctness): Constitutional README storage-boundary gap.
- **P2-001** (correctness/inventory): Strategy artifact map stale paths.
- **P2-002** (correctness/inventory): Checklist evidence not resolvable as `file:line`.
- **P2-003** (security): Walker DoS caps log-only.
- **P2-004** (security): Save-time excluded-path rejection lacks stable error code.
- **P2-005** (security): Chunking helper fallback bypasses post-insert guard.
- **P2-006** (traceability): Root packet docs carry post-merge identity drift.
- **P2-007** (traceability): Feature catalog entry stale packet/ADR identifiers.
- **P2-008** (traceability): Manual playbook missing adversarial scenarios.
- **P2-009** (traceability): Runtime trace comments point ADR readers at wrong packet.

## ITERATION 4 FOCUS — D4 MAINTAINABILITY

Audit code clarity, pattern consistency, and safe-follow-on-change cost. **Do NOT re-flag prior findings.** Maintainability findings should focus on patterns that future-you would have to fix even after the current P0/P1 are resolved.

### M1. SSOT import shape consistency
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` — does every consumer import the SAME predicate? Or are there local re-implementations that drift over time?
- Grep for `shouldIndexForMemory`, `shouldIndexForCodeGraph`, `EXCLUDED_FOR_MEMORY`, `isConstitutionalPath` callers. Any callers using inline string-match instead of the helper?

### M2. Cleanup CLI testability under future schema changes
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
- If a future migration adds a new column to `memory_index`, what does the cleanup script need to learn about? Is the schema-touch surface explicit, or does the script silently SELECT * and break on schema drift?
- The apply path runs `database.transaction(...)`. Are there mock-ability seams for testing without a real DB? What does the test fixture look like?

### M3. Governance audit helper extensibility
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (`GOVERNANCE_AUDIT_ACTIONS`, `recordTierDowngradeAudit`)
- If a future invariant adds a new action string (e.g., `tier_downgrade_z_archive_path`), is the addition local or does it require touching every emitter? Look for the registry pattern shape.

### M4. README operator coverage of stable action strings
- `.opencode/skill/system-spec-kit/mcp_server/README.md` "Index Scope Invariants" section
- Does it document the action strings, the cleanup CLI flow, and the rollback story for an operator with no packet context? Or does it assume packet familiarity?

### M5. Defensive error-handling clarity
- Across reviewed files: are catch-blocks distinguishing "expected validation failure" from "unexpected runtime error"? Are error messages actionable (path + reason + recovery), or generic?
- Specifically the audit-insert-fail-but-preserve-invariant pattern (CHK-S03): is the swallowing pattern documented inline so future reviewers don't mistakenly tighten it to fail-closed?

### M6. ADR coverage of ALTERNATIVES NOT TAKEN
- `decision-record.md` ADR-001 through ADR-012
- For each ADR, does the alternatives table have a CONCRETE rejection rationale, or vague "not chosen because"? An ADR with thin alternatives is a maintenance burden because future devs will re-litigate.

### M7. Test fixture / shape consistency
- 11 vitest files: do they share common fixtures, or each set up their own DB? Is there a `tests/setup/` helper for the memory-index DB shape, or duplicated test scaffolding across files?
- Patterns drift: does any test file use `it.skip` or `it.todo` markers indicating planned-but-not-shipped coverage?

### M8. Phase-merge artifact hygiene
- Check whether the post-2026-04-24 root merge left any orphaned imports, unused symbols, or redundant `re-export` files behind from the legacy phase folders. Was the cleanup surgical or did it leave debris?

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.
- Do NOT re-flag iter-1+2+3 findings.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-004.md`

Required headings:
- `# Iteration 4 — Maintainability`
- `## Dimension`
- `## Files Reviewed`
- `## Findings — P0 (Blockers)`
- `## Findings — P1 (Required)`
- `## Findings — P2 (Suggestions)`
- `## Traceability Checks`
- `## Claim Adjudication Packets`
- `## Verdict`
- `## Next Dimension` (state "STOP candidate — all 4 dimensions covered" if no new P0/P1 surface)

### 2. Canonical JSONL iteration record (APPEND)

Append to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-state.jsonl`

```json
{"type":"iteration","iteration":4,"mode":"review","status":"complete","focus":"maintainability","dimensions":["maintainability"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T13:57:00.000Z","generation":1}
```

### 3. Per-iteration delta file

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deltas/iter-004.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to indicate STOP candidate (or stuck-recovery if findings ratio still elevated).

GO.
