# Deep-Review Iteration Prompt Pack — Iteration 2

You are dispatched as a LEAF deep-review agent (`@deep-review`). Iteration 1 closed correctness with `CONDITIONAL` verdict (P0=0, P1=1 constitutional README storage-boundary gap, P2=2 inventory items). Now perform the security pass.

## STATE SUMMARY

```
Iteration: 2 of 7
Mode: review
Dimension: security (priority 2)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants
Review Target Type: spec-folder
Prior Findings: P0=0 P1=1 P2=2
Dimension Coverage: 1 / 4 (correctness covered)
Coverage Age: 1
Last 2 ratios: N/A -> 0.07
Stuck count: 0
Provisional Verdict: CONDITIONAL (hasAdvisories=true)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Last claim_adjudication_passed: true
```

## ITERATION 1 RECAP (do not re-flag)

- **P1-001**: Constitutional README can survive storage-layer restore/update as constitutional. Already opened. Iteration 2 may surface SECURITY-flavored related findings (e.g. attacker-injected README via poisoned checkpoint), but should NOT re-emit P1-001; instead append a note to the iteration narrative if security angle reinforces the existing finding.
- **P2-001**: Strategy artifact map has stale paths (`code-graph` → `code_graph`, `handlers/memory-parser.ts` → `lib/parsing/memory-parser.ts`). Inventory drift. Do not re-flag.
- **P2-002**: Checklist evidence not resolvable as `file:line` citations. Inventory drift. Do not re-flag.

## ITERATION 2 FOCUS — D2 SECURITY

Audit the security boundaries surfaced by Track A + Track B + Wave-1 + Wave-2:

### S1. Cleanup CLI transaction safety + audit durability
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
- Confirm apply path runs ALL mutations inside a single `database.transaction(...)`.
- Confirm TOCTOU closure: plan rebuild happens INSIDE the transaction snapshot at lines 429–435 (per implementation-summary §Wave-2).
- Audit failure modes: what happens if `governance_audit` insert fails mid-transaction? Does the cleanup commit anyway (durability vs atomicity tradeoff)?
- Verify idempotency: second `--apply` reports 0 planned + 0 applied changes (matches CHK-S04).
- Test the action-string contract (`tier_downgrade_non_constitutional_path`, `tier_downgrade_non_constitutional_path_cleanup`) is consistent across emitters.

### S2. Symlink / realpath bypass surface
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts`
- Verify `resolveCanonicalPath()` uses `fs.realpathSync` with fail-open fallback. Does the fail-open path leak any unexpected behavior under adversarial inputs (broken symlinks, recursive loops)?
- Check every consumer: `memory-save.ts`, `code-graph/lib/structural-indexer.ts`. Are realpath results used for the invariant check, or is the original string-normalized path still used in any branch?
- Adversarial test: a symlink at `safe/path` → `/z_future/poisoned.md`. Does the SSOT predicate correctly reject it via realpath?

### S3. Walker DoS caps under adversarial trees
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` (`.gitignore` 1MB cap, depth 20, 50,000 nodes)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` (same caps)
- Adversarial inputs: deeply nested directories (depth > 20), directory bombs (>50K nodes), giant `.gitignore` files (>1MB). Confirm the walker stops gracefully and emits warnings rather than crashing or silently truncating.
- Check the warning emission path: is it actually observable to operators, or just logged to stderr?

### S4. Constitutional tier promotion / downgrade bypass paths
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` — constitutional → critical transition audit
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` — post-insert metadata guard
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` — SQL-layer downgrade
- Is there any code path where a row can be promoted TO constitutional without going through the SSOT predicate? Look for raw SQL UPDATE or INSERT statements that bypass the helper.
- Does `memory_update` audit downgrade attempts even when the downgrade is silently applied at the SQL layer? Verify governance_audit emission path.
- Cross-check `tests/memory-crud-update-constitutional-guard.vitest.ts` for promotion-bypass coverage.

### S5. Governance audit durability under failure
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (recordTierDowngradeAudit)
- Per CHK-S03: audit insert errors are caught, logged, and the invariant outcome is preserved. Confirm this. What happens if the database is read-only or the audit table is missing? Does the system fail-open (preserve invariant, lose audit) or fail-closed (block mutation)?
- Race conditions: can two concurrent saves race the audit insert? Does the action_string + path uniqueness handle dedup?

### S6. Save-time invariant guard (rejection path)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` save-time guard
- Confirm rejected paths return a stable error code (not a vague exception). Any path where the rejection is logged-but-saved-anyway?
- Check that the rejection happens BEFORE any DB write, not after a partial commit.

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 finding with concrete `file:line` evidence.
- Every new P0/P1 MUST include claim-adjudication packet: `{claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger}`.
- Do NOT re-flag iteration 1 findings (P1-001, P2-001, P2-002). Cross-reference if related.
- Resolve any inventory drift YOU encounter against the actual on-disk paths (`mcp_server/code_graph/`, `mcp_server/lib/parsing/memory-parser.ts`); do not re-cite the strategy stale paths.

## OUTPUT CONTRACT (THREE REQUIRED ARTIFACTS)

### 1. Iteration narrative markdown

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-002.md`

Required headings:
- `# Iteration 2 — Security`
- `## Dimension`
- `## Files Reviewed`
- `## Findings — P0 (Blockers)`
- `## Findings — P1 (Required)`
- `## Findings — P2 (Suggestions)`
- `## Traceability Checks`
- `## Claim Adjudication Packets`
- `## Verdict`
- `## Next Dimension`

### 2. Canonical JSONL iteration record (APPEND)

Append a SINGLE-LINE JSON record to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-state.jsonl`

```json
{"type":"iteration","iteration":2,"mode":"review","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":{"P0":<n>,"P1":<n>,"P2":<n>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T13:57:00.000Z","generation":1}
```

NOTE: `findingsSummary` is the cumulative count (carry P1=1, P2=2 from iter-1 + new findings); `findingsNew` is ONLY new findings this iteration.

### 3. Per-iteration delta file

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deltas/iter-002.jsonl`

One `{"type":"iteration",...}` record matching the state log append, plus one record per finding/classification/ruled_out/traceability-check.

After completing the review, also update the strategy file's `<!-- ANCHOR:next-focus -->` section to point iteration 3 at traceability.

GO.
