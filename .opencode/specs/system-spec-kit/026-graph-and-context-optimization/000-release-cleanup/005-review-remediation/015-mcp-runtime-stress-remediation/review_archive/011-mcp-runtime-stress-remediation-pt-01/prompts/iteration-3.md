# Deep-Review Iteration Prompt Pack — 011 Iteration 3

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/015-mcp-runtime-stress-remediation`. The loop manager has authorized this folder for the entire deep-review session. DO NOT re-ask Gate 3. Proceed directly to review work.

You are dispatched as a LEAF deep-review agent. Iter-1 (correctness, 2 P2) and iter-2 (security, 0 new) closed clean. P0 cli-copilot Gate 3 fix validated (5 sub-checks PASS). Now perform the traceability pass.

## STATE SUMMARY

```
Iteration: 3 of 7
Mode: review
Dimension: traceability (priority 3)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation
Prior Findings (cumulative): P0=0 P1=0 P2=2
Dimension Coverage: 2 / 4 (correctness, security covered)
Coverage Age: 1
Last 2 ratios: 1.0 -> 0.0
Stuck count: 1 (iter-2 ratio at zero)
Provisional Verdict: PASS (hasAdvisories=true if P2 stay)
Resource Map Coverage: resource-map.md present; coverage gate active.
Last claim_adjudication_passed: true (no new P0/P1)
```

## PRIOR FINDINGS (do not re-flag)

- **F-001** (correctness/inventory): Parent `resource-map.md` is stale relative to the 18-child phase parent.
- **F-002** (correctness): Post-stress research convergence wording overclaims monotonic decay (the actual data may show non-monotonic decay).

## ITERATION 3 FOCUS — D3 TRACEABILITY

### T1. HANDOVER-deferred.md ↔ child packet status
- Open `HANDOVER-deferred.md`.
- Identify each deferred item (P0/P1/P2 or by category).
- For each, find the corresponding child packet (012-018) that owns the implementation.
- Verify: does the child packet's `description.json`/`graph-metadata.json`/`spec.md` accurately reflect the deferred status?
- Flag mismatches (HANDOVER says deferred but child claims complete, or vice versa).

### T2. v1.0.2 findings.md ↔ remediation packet evidence
- Open `010-stress-test-rerun-v1-0-2/findings.md`.
- For each of the 6 PROVEN packets (003-008), trace: did the packet ACTUALLY ship the remediation it was supposed to? Is the live probe evidence cited at file:line, or just narrated?
- The 1 NOT-PROVEN packet — does the failure mode trace back to a known root cause in `002-mcp-runtime-improvement-research/` Q1-Q8 diagnoses?

### T3. feature-catalog-impact-audit.md ↔ feature catalog
- Open `feature-catalog-impact-audit.md` (29 KB at 011 root).
- Verify: do the audit's claims about feature catalog entries actually match the current state of `.opencode/skill/sk-doc/feature_catalog/` (or wherever the catalog lives)?
- Flag any claim in the audit that's contradicted by the live catalog.

### T4. testing-playbook-impact-audit.md ↔ manual playbook
- Open `testing-playbook-impact-audit.md` (33 KB at 011 root).
- Verify: do the audit's claims about playbook entries match the current state of the manual testing playbook?
- Flag any audit claim that's contradicted by the live playbook.

### T5. context-index.md ↔ child packets
- Open `context-index.md`.
- Verify each child entry maps to a real folder with the documented status.
- Flag any orphaned entries or missing children.

### T6. Resource map coverage gate (REQUIRED — resource-map present)
- Open `resource-map.md`.
- For each of the 18 child phases, confirm the path is in the resource-map OR has a documented exclusion rationale.
- Cross-check against any `applied/T-*.md` reports if present in the 011 tree (likely under children).
- Classify each entry: `touched` (referenced by applied report), `expected-by-scope` (in scope but not yet applied), `gap` (in scope, not in map), `absent-from-map` (implementation exists but not catalogued).
- Iter-1 F-001 already flagged the parent resource-map as stale; this iteration should QUANTIFY the gap.

### T7. ADR / decision references across packets
- The 011 phases reference ADRs (e.g., the iter-2 evidence cited ADR-005 in 003-memory-context-truncation-contract). Are ADRs consistently numbered across phases, or do they conflict (two ADR-005s with different content)?

### T8. Cross-runtime references (cli-codex, cli-copilot, opencode plugin)
- Each remediation packet may reference cli-* implementations. Are the cited file paths still live (post-2026-04-25 reorg)?

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.
- Do NOT re-flag F-001 (stale parent resource-map) or F-002 (post-stress research wording overclaim) — quantify under T6 if expanding F-001.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown
Write to: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/iterations/iteration-003.md`

Headings: `# Iteration 3 — Traceability`, `## Dimension`, `## Files Reviewed`, `## Findings — P0`, `## Findings — P1`, `## Findings — P2`, `## Traceability Checks`, `## Resource Map Coverage` (REQUIRED with quantification), `## Claim Adjudication Packets`, `## Verdict`, `## Next Dimension`.

### 2. JSONL state log APPEND
```json
{"type":"iteration","iteration":3,"mode":"review","status":"complete","focus":"traceability","dimensions":["traceability"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T14:30:00.000Z","generation":1}
```

### 3. Per-iteration delta
Write to: `.../deltas/iter-003.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to point iter-4 at maintainability.

GO.
