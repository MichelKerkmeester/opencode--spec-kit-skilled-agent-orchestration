# Deep-Review Iteration 2 — Security + Verify P1 Closures

## STATE

STATE SUMMARY:
Iteration: 2 of 5
Dimension: security (primary) + verify P1-001 + P1-002 closures from iteration 1
Review Target: PR1-PR5 phrasing-audit + PR3-extra runtime mirrors + REQ-004/REQ-005 closures
Prior Findings: P0=0 P1=2 (both newly closed by orchestrator: P1-001 REQ-004 grep zero-out + P1-002 Note: callout)
Resource Map Coverage: resource-map.md not present
Coverage Age: 1 (correctness covered in iter-1)
Provisional Verdict: PENDING hasAdvisories=false

## CLOSURE VERIFICATION (P1 from iteration 1)

**P1-001 (REQ-004 headline-pattern zero-out)** — orchestrator applied a bulk substitution wave (~396 substitutions across 148 files) followed by 8 targeted residual edits. Re-run the exact spec.md REQ-004 grep:

```bash
grep -niE "(your|the|a|an|each|every)\s+memor(y|ies)" .opencode/skill/system-spec-kit/**/*.md CLAUDE.md AGENTS.md
```

Expect: zero hits outside `cognitive/` (REQ-007 carve-out).

**P1-002 (REQ-005 Anthropic/MCP `Note:` disambiguation)** — orchestrator added `Note:` callouts to:
- `.opencode/skill/system-spec-kit/README.md` after section 1 overview paragraph
- `.opencode/skill/system-spec-kit/mcp_server/README.md` after section 1 overview paragraph

Each callout begins with `Note:` and names both Anthropic Claude Memory and the MCP reference `memory` server. Verify presence.

If P1-001 or P1-002 is still failing after the orchestrator's fixes, raise as P0 (regression).

## ITERATION 2 FOCUS — Security Dimension

A. **Frontmatter identifier audit (security boundary)** — confirm `_memory:` frontmatter wasn't accidentally renamed in any spec.md across the entire repo:
```bash
grep -rln '^_memory:' .opencode/specs/ | head -20
grep -rl '^_spec_doc_record:\|^_indexed_continuity:' .opencode/specs/ 2>/dev/null
```
Expect first command returns many hits; second returns zero.

B. **MCP tool name security audit** — runtime callers of frozen tool names must remain wired:
```bash
grep -rE 'memory_(search|save|context|update|delete|list|index_scan|validate|health|stats|bulk_delete|quick_search|match_triggers|get_learning_history|drift_why|causal_link|causal_unlink|causal_stats|ingest_start|ingest_status|ingest_cancel)' .opencode/skill/system-spec-kit/mcp_server/handlers/*.ts | wc -l
```
Confirm 21 tool names appear in handler dispatch routing (no rename leaks).

C. **SQL table name preservation** — schema files reference `memory_*` tables verbatim:
```bash
grep -rnE 'CREATE TABLE.*memory_|FROM memory_|JOIN memory_|INSERT INTO memory_' .opencode/skill/system-spec-kit/mcp_server/lib/storage/ 2>/dev/null | head
grep -rn 'working_memory\b' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | head -3
```
No SQL DDL/DML referenced any renamed table.

D. **Runtime output string audit** — vitest snapshot tests still pass with current strings. The known carve-out: `causal-graph.ts:586-587` uses `'Memory ID that is the cause/source'` and `'Memory ID that is the effect/target'`. These are runtime emissions and the operator docs cite them via `(runtime string preserved verbatim)` parenthetical. Verify:
```bash
grep -rn "'Memory ID" .opencode/skill/system-spec-kit/mcp_server/handlers/*.ts | grep -v 'dist/'
```
If non-causal-graph handlers emit `'Memory'` strings that we modernized in operator docs, that's a doc/runtime drift to flag (P2 advisory).

E. **Cross-runtime mirror parity (post-PR3-extra)** — re-confirm parity:
```bash
for f in .opencode/agent/context.md .claude/agents/context.md .gemini/agents/context.md .codex/agents/context.toml; do
  echo "$f"
  grep -c 'spec-doc record' "$f"          # all == 5
done
md5 .opencode/command/memory/save.md .claude/commands/memory/save.md
md5 .opencode/command/memory/manage.md .claude/commands/memory/manage.md
```

## SHARED DOCTRINE

If accessible, load `.opencode/skill/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness (covered iter-1), security (this iteration), traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: agent_cross_runtime (re-verify), feature_catalog_code (post-bulk-substitution check)

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION (mandatory for new P0/P1)

Every new P0/P1 finding MUST include: `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger`.

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/iterations/iteration-002.md`
- Delta file: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deltas/iter-002.jsonl`

## CONSTRAINTS

- LEAF agent. NO sub-agent dispatch.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Don't hold in context.
- Reviewed files are READ-ONLY.
- Single-line JSONL append to state log.

## OUTPUT CONTRACT (REQUIRED)

3 artifacts:

1. **iteration-002.md** at the iteration narrative path — sections: Dimension, Closure Verification (P1-001/P1-002 status), Files Reviewed, Findings by Severity (P0/P1/P2 with file:line evidence), Traceability Checks, Verdict, Next Dimension.

2. **JSONL iteration record** appended to state log:
```json
{"type":"iteration","iteration":2,"dimensions":["security"],"filesReviewed":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"graphEvents":[]}
```

3. **iter-002.jsonl** at the delta file path — iteration record + per-finding/classification/closure-verification records.

## NEW-FINDINGS-RATIO

`newFindingsRatio = (P0_new × 10 + P1_new × 5 + P2_new × 1) / 100`. Cap at 1.0. Any new P0 → max(calculated, 0.50). Clean → 0.0.

If both P1s from iter-1 verify as CLOSED and no new findings emerge, this iteration's ratio should be near 0.0 (clean).

## PROCEED

Execute closure verification first (5 minutes), then security dimension audit (10 minutes). Be evidence-driven, file:line precision required.
