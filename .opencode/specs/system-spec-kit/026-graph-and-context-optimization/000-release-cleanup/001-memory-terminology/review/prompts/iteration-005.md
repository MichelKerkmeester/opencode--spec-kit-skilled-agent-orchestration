# Deep-Review Iteration 5 — Final Closure + Convergence

## STATE

Iteration: 5 of 5 (FINAL)
Dimension: closure verification + convergence summary
Prior:
  - iter-1 correctness: P0=0, P1=2 → both closed
  - iter-2 security: PASS
  - iter-3 traceability: P0=0, P1=1 (P1-003), P2=1 (P2-001) → both closed
  - iter-4 maintainability: P0=1 (P0-004 was P2-001 regression), P2=1 (P2-002 advisory) → P0-004 closed, P2-002 still open as advisory
Coverage: correctness ✓, security ✓, traceability ✓, maintainability ✓ — all 4 dimensions covered

## ITERATION 5 FOCUS — Final Closure Verification

A. **REQ-004 grep** (most critical):
```bash
find .opencode/skill/system-spec-kit -name '*.md' -not -path '*/cognitive/*' | xargs grep -ciE "(your|the|a|an|each|every)\s+memor(y|ies)" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}'
```
Expect: 0.

B. **REQ-005 Note: callouts** present in both READMEs:
```bash
grep -nE '^> Note:.*Anthropic.*MCP' .opencode/skill/system-spec-kit/README.md .opencode/skill/system-spec-kit/mcp_server/README.md
```
Expect: 2 hits (one per file).

C. **REQ-008 anchor integrity** — TOC anchors:
```bash
grep -rE '\(#[0-9]+--[a-z0-9-]+\)' .opencode/skill/system-spec-kit/ 2>/dev/null | wc -l
```
Expect: 0.

D. **Identifier preservation** (REQ-001):
- 21 `memory_*` MCP tools in tool-schemas.ts
- 17 `memory-*.ts` handlers
- 4 `/memory:*` slash commands (across all 3 runtime mirrors)
- `_memory:` frontmatter in spec.md
- references/memory/ + scripts/dist/memory/ folders intact
- working_memory in cognitive subsystem

E. **Cross-runtime mirror parity** (REQ-006):
```bash
for f in .opencode/agent/context.md .claude/agents/context.md .gemini/agents/context.md .codex/agents/context.toml; do
  grep -c 'spec-doc record' "$f"   # all == 5
done
```

F. **Cognitive carve-out** (REQ-007):
- FSRS, Free Spaced Repetition Scheduler in fsrs-scheduler.ts
- Miller's Law in working-memory.ts
- Collins-Loftus, spreading activation, working_memory preserved

G. **Spec.md ↔ phrasing-audit.md consistency** — re-verify REQ-001..REQ-008 align with vocabulary key + grid.

## CONVERGENCE CRITERIA

For STOP_ALLOWED:
- All 4 dimensions covered with coverage_age ≥ 1 ✓
- Active P0 = 0 (P0-004 closed)
- Active P1 = 0 (P1-001/002/003 closed)
- newFindingsRatio rolling avg ≤ 0.08
- All P0/P1 findings have file:line evidence ✓
- claim adjudication gate: PASS (no active P0/P1 to adjudicate)

## SHARED DOCTRINE

If accessible, load `.opencode/skill/sk-code-review/references/review_core.md` before final severity calls.

## VERDICT GUIDANCE

Expected verdict: PASS with hasAdvisories=true (P2-002 advisory only).

If any new P0/P1 emerges in this final pass, raise as a regression with full claim adjudication packet.

## CLAIM ADJUDICATION

Every new P0/P1: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/iterations/iteration-005.md`
- Delta file: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deltas/iter-005.jsonl`

## CONSTRAINTS

LEAF agent. NO sub-agents. Target 9 / soft 12 / hard 13 tool calls. Files READ-ONLY. Single-line JSONL append.

## OUTPUT CONTRACT

3 artifacts:

1. **iteration-005.md** — sections: Dimension (closure verification), Closure Matrix (REQ-001..REQ-008 with verifier output), Findings by Severity, **Final Verdict**, Convergence Summary.

2. **JSONL iteration record**:
```json
{"type":"iteration","iteration":5,"dimensions":["closure"],"filesReviewed":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{"all_reqs_pass":<bool>},"newFindingsRatio":<0..1>,"graphEvents":[]}
```

3. **iter-005.jsonl** — iteration record + per-finding/closure-verification.

## NEW-FINDINGS-RATIO

`(P0×10 + P1×5 + P2×1) / 100`. Cap at 1.0. Any P0 → max(calc, 0.50). Clean → 0.0.

## PROCEED

Run all closure scans (10 min), verify each REQ acceptance criterion individually, emit final verdict. Be evidence-driven.
