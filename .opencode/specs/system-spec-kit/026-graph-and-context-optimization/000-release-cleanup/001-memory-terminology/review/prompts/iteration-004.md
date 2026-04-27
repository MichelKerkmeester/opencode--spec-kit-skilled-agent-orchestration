# Deep-Review Iteration 4 — Maintainability + Verify P1/P2 Closures

## STATE

Iteration: 4 of 5
Dimension: maintainability
Prior:
  - iter-1 (correctness): P0=0, P1=2 — both closed by orchestrator
  - iter-2 (security): PASS, no findings
  - iter-3 (traceability): P0=0, P1=1 (P1-003), P2=1 (P2-001) — both closed by orchestrator
Coverage: correctness ✓, security ✓, traceability ✓ — only maintainability remaining
Provisional Verdict: PASS pending maintainability pass

## CLOSURE VERIFICATION (iter-3)

**P1-003 (README TOC anchor integrity)** — orchestrator changed double-hyphen `#N--anchor` style to single-hyphen `#N-anchor` GitHub-style across all README/TOC files in `.opencode/skill/system-spec-kit/`. Verify zero remaining double-hyphen TOC patterns:

```bash
grep -rE '\(#[0-9]+--[a-z0-9-]+\)' .opencode/skill/system-spec-kit/ 2>/dev/null | wc -l
```
Expect: 0.

**P2-001 (substitution polish drift)** — orchestrator:
1. Removed all `spec-doc record record` duplicates
2. Applied 144 adjective-prefixed substitutions (existing/new/older/old/similar/stored/aligned/etc.) across 57 files
Verify:

```bash
grep -rE 'spec-doc record record' .opencode/skill/system-spec-kit/ 2>/dev/null | wc -l    # expect 0
grep -rE '\b(existing|new|older|old|similar|stored|aligned|deprecated)\s+memor(y|ies)\b' .opencode/skill/system-spec-kit/ 2>/dev/null | grep -v cognitive/ | head -10    # expect zero hits
```

If any remain, raise as P0 (regression).

## ITERATION 4 FOCUS — Maintainability Dimension

A. **Phrasing consistency across mirrors** — verify the bulk substitution wave didn't introduce inconsistent phrasing between mirror groups:
   - `system-spec-kit/feature_catalog/feature_catalog.md` and the 4 sister mirrors should use consistent vocabulary
   - SKILL.md and README.md should be in sync on top-level concept naming
   - manual_testing_playbook scenarios should be runtime-aligned

B. **Documentation quality** — sample 8-10 modified files at random and verify:
   - Sentences still parse correctly post-substitution
   - No accidental double-spaces or punctuation errors from sed/regex passes
   - Grammar holds up (e.g., "spec-doc record" pluralization correct in all contexts)

C. **Safe follow-on change clarity** — does the modernized vocabulary support future edits clearly? Spot check:
   - Tool descriptions in `mcp_server/tool-schemas.ts` use modernized vocabulary while preserving frozen tool names
   - feature_catalog descriptions explain MCP tool behavior using "spec-doc record" / "indexed continuity" / "constitutional rule" appropriately

D. **Pattern + convention** — confirm the vocabulary key from `phrasing-audit.md` is followed:
   - `memory` → `spec-doc record` / `indexed continuity` / `constitutional rule` / `packet` / `causal-graph node` (by local context)
   - Where multiple terms could apply, the chosen term is contextually appropriate

E. **Spec/phrasing-audit consistency drift** — re-verify spec.md REQ-001..REQ-008 still align with phrasing-audit.md vocabulary key + grid post-bulk-edit.

## SHARED DOCTRINE

If accessible, load `.opencode/skill/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness ✓, security ✓, traceability ✓, maintainability (this iteration)

## TRACEABILITY PROTOCOLS

- **Core**: spec_code (re-verify post-edit), checklist_evidence (n/a)
- **Overlay**: feature_catalog_code (post-bulk-edit consistency), playbook_capability (post-bulk-edit consistency)

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/iterations/iteration-004.md`
- Delta file: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deltas/iter-004.jsonl`

## CONSTRAINTS

LEAF agent. NO sub-agents. Target 9 / soft 12 / hard 13 tool calls. Files READ-ONLY. Single-line JSONL append.

## OUTPUT CONTRACT

3 artifacts:

1. **iteration-004.md** — sections: Dimension, Closure Verification (P1-003 + P2-001), Files Sampled, Findings by Severity, Verdict, Next Dimension (likely "convergence" or "synthesis").

2. **JSONL iteration record**:
```json
{"type":"iteration","iteration":4,"dimensions":["maintainability"],"filesReviewed":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"graphEvents":[]}
```

3. **iter-004.jsonl** — iteration record + per-finding/closure-verification.

## NEW-FINDINGS-RATIO

`(P0×10 + P1×5 + P2×1) / 100`. Cap at 1.0. Any P0 → max(calc, 0.50). Clean → 0.0.

## PROCEED

Closure verification first (5 min), then maintainability sampling (10 min). Be evidence-driven, file:line precision required for any P0/P1.
