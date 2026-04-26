# Deep-Review Iteration 3 — Traceability

## STATE

Iteration: 3 of 5
Dimension: traceability
Prior: iter-1 (correctness) → 2 P1 found, both closed by orchestrator. iter-2 (security) → PASS, no new findings.
Coverage: correctness ✓, security ✓ — coverage_age=2 for correctness, =0 for security
Provisional Verdict: PASS pending traceability + maintainability passes

## ITERATION 3 FOCUS — Traceability

A. **spec_code traceability** — verify each acceptance criterion in spec.md REQ-001..REQ-008 maps to verifiable evidence:
   - REQ-001 (zero identifier renames): 21 tools / 17 handlers / 4 commands / `_memory:` / SQL tables / folder names — all confirmed in iter-1 + iter-2
   - REQ-002 (vocabulary substitutions per phrasing-audit.md key): spot-check 3 files for substitution accuracy
   - REQ-003 (skill prose modernized): SKILL.md, README.md, references/, constitutional/ all use modernized vocabulary
   - REQ-004 (grep zero-out): orchestrator confirmed 0 hits — re-verify
   - REQ-005 (Anthropic/MCP `Note:` callout): both READMEs — re-verify
   - REQ-006 (mirror parity): 4 context agents + 12 commands — re-verify
   - REQ-007 (cognitive carve-out preserved): FSRS, Miller, Collins-Loftus — re-verify
   - REQ-008 (no broken anchors/links): scan for `<!-- ANCHOR:...` / `[text](#anchor)` integrity

B. **checklist_evidence** — N/A for this packet (no checklist.md per Level 2 spec); flag as `not-applicable` with reason in JSONL.

C. **agent_cross_runtime overlay** — already PASS in iter-2. Quick re-check that no edits regressed it.

D. **feature_catalog_code overlay** — after the bulk-substitution wave (~396 substitutions), verify feature_catalog/feature_catalog.md and the 4 sister mirrors are still internally consistent. Specifically:
   - Tool descriptions still reference correct MCP tool names
   - "spec-doc record" usage doesn't conflict with type names like `MemoryResultEnvelope`
   - Code blocks (TypeScript fenced blocks) untouched

E. **playbook_capability overlay** — verify manual_testing_playbook.md scenario preconditions still describe achievable runtime states:
   - 187-quick-search-memory-quick-search.md (modified by orchestrator) — scenario should still validate `memory_quick_search` (frozen tool)
   - other playbook files modified by bulk substitution — sample 3-4 to ensure scenarios remain executable

F. **Anchor + cross-doc link integrity** — verify no broken anchors after edits:
```bash
# Find anchors defined
grep -rE '<!-- ANCHOR:[a-z0-9-]+ -->' .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/README.md | wc -l
# Find anchor references via [text](#anchor) syntax
grep -rE '\]\(#[a-z0-9-]+\)' .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/README.md | wc -l
# Find anchor references via [text](file.md#anchor) syntax
grep -rE '\.md#[a-z0-9-]+' .opencode/skill/system-spec-kit/ 2>/dev/null | head -10
```
Note any `[text](#missing-anchor)` references where the target anchor doesn't exist.

## SHARED DOCTRINE

If accessible, load `.opencode/skill/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness ✓, security ✓, traceability (this iteration), maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code (full), checklist_evidence (n/a)
- **Overlay**: feature_catalog_code (post-bulk-edit consistency), playbook_capability (post-bulk-edit consistency), anchor+link integrity

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/iterations/iteration-003.md`
- Delta file: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-memory-terminology/review/002-memory-terminology-pt-01/deltas/iter-003.jsonl`

## CONSTRAINTS

LEAF agent. NO sub-agents. Target 9 / soft 12 / hard 13 tool calls. Files READ-ONLY. Single-line JSONL append.

## OUTPUT CONTRACT

3 artifacts:

1. **iteration-003.md** — sections: Dimension, REQ-001..REQ-008 traceability matrix (each with PASS/FAIL/N/A + evidence), Anchor Integrity, Findings by Severity, Verdict, Next Dimension.

2. **JSONL iteration record**:
```json
{"type":"iteration","iteration":3,"dimensions":["traceability"],"filesReviewed":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{"spec_code":"PASS","checklist_evidence":"N/A","agent_cross_runtime":"PASS","feature_catalog_code":"<P/F>","playbook_capability":"<P/F>"},"newFindingsRatio":<0..1>,"graphEvents":[]}
```

3. **iter-003.jsonl** — iteration record + per-finding/classification.

## NEW-FINDINGS-RATIO

`(P0×10 + P1×5 + P2×1) / 100`. Cap at 1.0. Any P0 → max(calc, 0.50). Clean → 0.0.

## PROCEED

Execute REQ-001..REQ-008 traceability matrix first, then anchor integrity, then sample post-bulk-edit consistency.
