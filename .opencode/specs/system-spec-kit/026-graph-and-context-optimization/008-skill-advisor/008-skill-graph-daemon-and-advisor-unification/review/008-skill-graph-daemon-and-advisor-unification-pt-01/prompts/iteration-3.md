# Deep-Review Iteration Prompt Pack — 008/008 Iteration 3

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification`. The orchestrator has authorized this folder for the entire deep-review session. DO NOT re-ask Gate 3. Proceed directly to review work.

You are dispatched as a LEAF deep-review agent. Iter-1 (correctness, P1=1 + P2=3), iter-2 (security, NEW P1=1 + P2=3) closed. Now perform the traceability pass.

## STATE SUMMARY

```
Iteration: 3 of 7
Mode: review
Dimension: traceability (priority 3)
Review Target: 008-skill-graph-daemon-and-advisor-unification
Prior Findings (cumulative): P0=0 P1=2 P2=6
Dimension Coverage: 2 / 4 (correctness, security covered)
Coverage Age: 1
Last 2 ratios: 1.0 -> ~0.4 (estimated; iter-2 had 4 new findings)
Stuck count: 0
Provisional Verdict: CONDITIONAL (2 P1 active; hasAdvisories=true)
Last claim_adjudication_passed: true
```

## PRIOR FINDINGS (do NOT re-flag)

- **DR-008-D1-P1-001** (correctness): `advisor_recommend` doesn't fail-open on `freshness:'unavailable'`.
- **DR-008-D2-P1-001** (security): `skill_graph_scan` public MCP tool has no caller-authority check.
- **DR-008-D1-P2-001**: Checklist evidence not resolvable as `file:line`.
- **DR-008-D1-P2-002**: Spec uses `skill-advisor` (hyphen) vs runtime `skill_advisor` (underscore).
- **DR-008-D1-P2-003**: Strict-validation completion still open.
- **DR-008-D2-P2-001**: SQLite corruption recovery helper not invoked from live DB open paths.
- **DR-008-D2-P2-002**: Corruption rebuild helper not concurrency-safe.
- **DR-008-D2-P2-003**: MCP/plugin diagnostics leak absolute filesystem paths.

## ITERATION 3 FOCUS — D3 TRACEABILITY

### T1. CORE: spec_code (REQ → implementation)
Open `008-skill-graph-daemon-and-advisor-unification/spec.md` and enumerate REQ-* statements. For each, identify file:line implementation evidence. Particular attention:
- The 7 sub-tracks claimed shipped (validator ESM, daemon freshness, derived metadata, native scorer, MCP, compat shims, plus one more) — does each have a clear implementation footprint?
- The newly-found public-scan P1 (DR-008-D2-P1-001): does the spec.md declare any caller-authority requirement that the implementation contradicts? If spec is silent on auth, that's also a finding (under-specified contract).

### T2. CORE: checklist_evidence (CHK-* → cited file:line)
Already-known: P2-001 says checklist evidence is vague. This iteration QUANTIFIES: how many `[x]` CHK-* items lack file:line citations? Enumerate at least 5 specific examples.

### T3. OVERLAY: feature_catalog_code
Find any feature catalog entries for the skill-advisor / skill-graph capability (likely under `.opencode/skill/system-spec-kit/feature_catalog/` or sibling). Are catalog claims (e.g., "advisor returns recommendations within X ms", "scan reindexes the graph") consistent with the actual MCP tool surface?

### T4. OVERLAY: playbook_capability
Find manual testing playbook entries for skill-advisor / skill-graph. Are scenarios for: (a) corrupt DB recovery, (b) daemon restart, (c) advisor unavailable mode, (d) public scan from external caller — present? Iter-2's P2-001 (corruption recovery) and the new P1 should both have playbook coverage; if missing, that's a P2.

### T5. Hyphen-vs-underscore drift quantification
P2-002 (iter-1) said spec docs use `skill-advisor` while runtime is `skill_advisor`. This iteration: count occurrences. Where exactly is the drift (spec.md line numbers, decision-record line numbers, plan.md if relevant)?

### T6. ADR ↔ implementation
Open `decision-record.md`. For each ADR, find the implementation. Does the public-MCP-scan trust model show up in any ADR, or is it implicit?

### T7. Cross-runtime references
The 008/008 packet spans Python advisor + TypeScript daemon + plugin bridge. Are runtime path references consistent across spec.md / decision-record.md / plan.md / implementation-summary.md?

### T8. Test ↔ invariant mapping
For the test files cited in iter-1 + iter-2, do they cover:
- The new `unavailableOutput()` branch needed for DR-008-D1-P1-001? (Expected: NO — that's why it's a P1.)
- The public-scan auth boundary for DR-008-D2-P1-001? (Expected: NO.)
- Corruption rebuild concurrency safety (P2-002)? (Expected: NO.)
- Filesystem path leakage in error envelopes (P2-003)? (Expected: NO.)

If all 4 are missing test coverage, that's a P1 (test-gap that masks the active findings). If 1-2 are missing, P2.

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.
- Do NOT re-flag iter-1+2 findings.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown
Write to: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-003.md`

Headings: `# Iteration 3 — Traceability`, `## Dimension`, `## Files Reviewed`, `## Findings — P0`, `## Findings — P1`, `## Findings — P2`, `## Traceability Checks`, `## Claim Adjudication Packets`, `## Verdict`, `## Next Dimension`.

### 2. JSONL state log APPEND
```json
{"type":"iteration","iteration":3,"mode":"review","status":"complete","focus":"traceability","dimensions":["traceability"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T15:00:00.000Z","generation":1}
```

### 3. Per-iteration delta
Write to: `.../deltas/iter-003.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to point iter-4 at maintainability.

GO.
