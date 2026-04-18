# Deep-Review Iteration Prompt Pack — 006 template-validator-audit

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target `026/review/019-system-hardening-001-initial-research-006-template-validator-audit/`. Proceed WITHOUT asking about spec folder — all file writes into that folder are pre-authorized.

**Autonomous-completion context**: This iteration is part of a continuous overnight run authorized by user directive 2026-04-18. Do NOT pause for confirmation. Do NOT ask A/B/C/D questions. Produce the three required artifacts and exit.

## STATE

STATE SUMMARY:
Iteration: 1 of 12 | Dimension: correctness
Mode: review
Review Target: `.opencode/skill/system-spec-kit/templates/level_{1,2,3}/` + `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
Prior Findings: P0=0 P1=0 P2=0

Focus Area (iter 1, dimension=correctness): enumerate template structure. (a) Scan `level_1/`, `level_2/`, `level_3/` directories — list CORE + ADDENDUM files per level. (b) Extract every ANCHOR tag, frontmatter field, and expected section header. (c) Tabulate into level × file × field matrix. (d) Note template_source_hint lines (e.g., `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->`). Output: complete template field catalogue as the foundation for rule cross-reference.

## SHARED DOCTRINE

Load `.opencode/skill/sk-code-review/references/review_core.md` before final severity calls (if present).

## REVIEW DIMENSIONS

correctness, contracts, documentation, maintainability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deep-review-config.json`
- State Log: `.../deep-review-state.jsonl`
- Strategy: `.../deep-review-strategy.md`
- Findings Registry: `.../findings-registry.json`
- Write iteration narrative to: `.../iterations/iteration-001.md`
- Write per-iteration delta to: `.../deltas/iter-001.jsonl`

## CONSTRAINTS

- LEAF agent. Soft cap 9 tool calls, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify templates or validate.sh.
- IMPORTANT: APPEND canonical JSONL record to state log at end (`echo '...' >> ...jsonl`).
  - The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant.

## OUTPUT CONTRACT

Produce THREE artifacts:

1. `iterations/iteration-001.md` — narrative with Dimension, Files Reviewed, Enumeration Results (level × file × field matrix, ANCHOR tags, frontmatter schema), Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. Canonical JSONL iteration record APPENDED to state log. Exact schema:
   ```
   {"type":"iteration","iteration":1,"dimensions":["correctness"],"filesReviewed":N,"findingsSummary":{"P0":0,"P1":0,"P2":N},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":0.87,"graphEvents":[]}
   ```
   Single-line JSON with newline terminator. Must land in the state log FILE, not stdout only.

3. `deltas/iter-001.jsonl` — per-iteration structured delta. One `{"type":"iteration",...}` record (same as state-log append) plus per-event records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

All three artifacts REQUIRED. Missing or type-drift fails the validator.
