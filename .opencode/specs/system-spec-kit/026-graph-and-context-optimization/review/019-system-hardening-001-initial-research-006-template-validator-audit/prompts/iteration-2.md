# Deep-Review Iteration Prompt Pack — 006 template-validator-audit iter 2

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. All writes to `026/review/019-system-hardening-001-initial-research-006-template-validator-audit/` pre-authorized.

**Autonomous context**: Overnight run, no confirmation gates, produce artifacts and exit.

## STATE

STATE SUMMARY:
Iteration: 2 of 12 | Dimension: contracts
Mode: review
Review Target: templates (level_1/2/3 CORE + ADDENDUM) × `scripts/spec/validate.sh` strict-mode rules
Prior Findings: P0=0 P1=0 P2=1 (P2-001: decision-record.md malformed description placeholder)
newFindingsRatio: 1.0 (iter 1)

Focus Area (iter 2, dimension=contracts): Enumerate actual validator rules from `scripts/spec/validate.sh` + supporting rule-engine scripts. (a) For each of the 21 rule names listed in validate.sh help, identify the implementing function/script. (b) Extract rule semantics: what pattern it matches, what files it scopes to, what error/warning it emits, what severity class. (c) Tabulate into rule × (semantics, file-scope, severity, dependencies). (d) Compare rule-level targets against the template field catalogue from iter 1. (e) Identify obvious orphans (rule has no template match) and orphan fields (template field has no rule).

## REVIEW DIMENSIONS

correctness, contracts, documentation, maintainability

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deep-review-config.json`
- State Log: `.../deep-review-state.jsonl` (APPEND to, use `"type":"iteration"` EXACTLY)
- Strategy: `.../deep-review-strategy.md`
- Registry: `.../findings-registry.json`
- Iter narrative: `.../iterations/iteration-002.md`
- Per-iter delta: `.../deltas/iter-002.jsonl`

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify validate.sh or templates.
- REQUIRED canonical JSONL iteration record + delta file with `type="iteration"` records.

## OUTPUT CONTRACT

1. `iterations/iteration-002.md` — narrative: Dimension, Files Reviewed (validate.sh + rule-engine scripts), Rule Catalogue (name × semantics × file-scope × severity × dependencies), Initial Coverage Matrix (rules vs template fields), Findings By Severity (P0/P1/P2 — new findings this iter), Traceability Checks, Verdict (FAIL/CONDITIONAL/PASS), Next Dimension.

2. Canonical JSONL record APPENDED to state log:
   ```
   {"type":"iteration","iteration":2,"dimensions":["contracts"],"filesReviewed":N,"findingsSummary":{"P0":0,"P1":N,"P2":N},"findingsNew":[...],"traceabilityChecks":{...},"newFindingsRatio":0.75,"graphEvents":[]}
   ```

3. `deltas/iter-002.jsonl` — structured delta (iteration record + finding records + classification records).

All three required.
