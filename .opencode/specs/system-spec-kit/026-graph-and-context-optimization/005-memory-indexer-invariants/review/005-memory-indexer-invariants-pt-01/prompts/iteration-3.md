# Deep-Review Iteration Prompt Pack — Iteration 3

You are dispatched as a LEAF deep-review agent. Iter-1 (correctness) and iter-2 (security) closed CONDITIONAL with one P1 and five P2. Now perform the traceability pass.

## STATE SUMMARY

```
Iteration: 3 of 7
Mode: review
Dimension: traceability (priority 3)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants
Review Target Type: spec-folder
Prior Findings (cumulative): P0=0 P1=1 P2=5
Dimension Coverage: 2 / 4 (correctness, security covered)
Coverage Age: 1
Last 2 ratios: 0.07 -> 0.05
Stuck count: 1 (iter-2 ratio at no-progress threshold)
Provisional Verdict: CONDITIONAL (hasAdvisories=true)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Last claim_adjudication_passed: true
```

## ITERATION 1+2 RECAP (do not re-flag)

- **P1-001**: Constitutional README storage-boundary gap (correctness).
- **P2-001**: Strategy artifact map stale paths (`code-graph` → `code_graph`, `handlers/memory-parser.ts` → `lib/parsing/memory-parser.ts`).
- **P2-002**: Checklist evidence not resolvable as `file:line` citations.
- **P2-003**: Walker DoS caps log-only (no MCP response surface).
- **P2-004**: Save-time excluded-path rejection lacks stable error code.
- **P2-005**: Chunking helper fallback bypasses post-insert guard.

Iter-2 also flagged in passing: `implementation-summary.md` has stale Spec Folder metadata referencing legacy `010-memory-indexer-invariants` — pick this up under traceability properly.

## ITERATION 3 FOCUS — D3 TRACEABILITY

Audit cross-reference integrity across the FOUR core + overlay protocols defined in YAML:

### CORE: spec_code (REQ → implementation)
Open `spec.md` and enumerate REQ-001 through REQ-016. For each REQ, identify which file:line in the runtime code implements it. Flag any REQ that:
- Has no implementation
- Has implementation that doesn't match the requirement text
- Has implementation but no test coverage citation in checklist.md
- Refers to a deprecated path (post root-merge legacy reference)

### CORE: checklist_evidence (CHK-* → cited file:line)
Open `checklist.md`. Enumerate every `[x]` CHK-* item. For each, evaluate evidence quality:
- Cites concrete file:line → PASS
- Cites file but no line → PARTIAL
- Cites a command output or narrative description → FAIL (already covered by P2-002, but quantify how many)
- Claims pending (e.g., CHK-T15) → BLOCKED, note rationale

For CHK-T15 specifically (the live MCP rescan P0 blocker): does the rationale accurately describe what's needed, or is it understating the gap?

### OVERLAY: feature_catalog_code
Find the global feature catalog (likely under `.opencode/skill/sk-doc/` or similar). Search for entries that reference memory-indexer / index-scope / constitutional-tier capabilities. Are catalog claims consistent with the post-Wave-2 implementation? Are NEW capabilities (cleanup CLI, walker DoS caps, governance audit helpers) mentioned?

### OVERLAY: playbook_capability
Find the global testing playbook. Are scenarios for cleanup CLI execution, checkpoint restore validation, walker DoS adversarial inputs, or constitutional-tier promotion bypasses present? If missing, this is a P2.

### Inventory drift cleanup (carry-over)
Already covered as P2-001: stale paths in deep-review-strategy.md. Verify whether spec.md/plan.md/decision-record.md/implementation-summary.md ALSO have stale path drift after the 2026-04-24 root merge. Iter-2 mentioned `implementation-summary.md` Spec Folder field still says `010-memory-indexer-invariants`. Audit this and similar metadata staleness packet-wide.

### ADR ↔ implementation mapping
For each ADR-001 through ADR-012 in `decision-record.md`, find the file:line where the chosen alternative was implemented. Flag any ADR that:
- Has no implementation evidence
- Has implementation that contradicts the ADR's "Chosen" rationale
- Has been silently superseded by a later ADR without explicit supersession note

### Test ↔ invariant mapping
For each of the 11 vitest files listed in checklist.md, map test cases to invariant being enforced. Identify any invariant that has NO test coverage. Especially:
- Constitutional README at storage layer (per P1-001) — confirm there's no test
- Chunking helper fallback path (per P2-005) — confirm there's no test
- Walker cap warnings observable to operators (per P2-003) — confirm there's no test

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 finding with concrete `file:line` evidence.
- New P0/P1 require claim-adjudication packet.
- Do NOT re-flag iter-1+2 findings.
- Use ACTUAL on-disk paths (`mcp_server/code_graph/`, `mcp_server/lib/parsing/memory-parser.ts`); do not propagate strategy stale paths.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-003.md`

Required headings:
- `# Iteration 3 — Traceability`
- `## Dimension`
- `## Files Reviewed`
- `## Findings — P0 (Blockers)`
- `## Findings — P1 (Required)`
- `## Findings — P2 (Suggestions)`
- `## Traceability Checks` (with explicit core + overlay protocol breakdown)
- `## Claim Adjudication Packets`
- `## Verdict`
- `## Next Dimension`

### 2. Canonical JSONL iteration record (APPEND)

Append to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-state.jsonl`

```json
{"type":"iteration","iteration":3,"mode":"review","status":"complete","focus":"traceability","dimensions":["traceability"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T13:57:00.000Z","generation":1}
```

### 3. Per-iteration delta file

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deltas/iter-003.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to point iter-4 at maintainability.

GO.
