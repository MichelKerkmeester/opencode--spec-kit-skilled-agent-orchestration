---
title: "...timization/008-runtime-executor-hardening/003-system-hardening/004-routing-accuracy-hardening/implementation-summary]"
description: "Wave A/B/C routing accuracy hardening delivered with final corpus advisor accuracy 60.0%, Gate 3 F1 97.66%, and joint TT 115 / FT 5 / FF 1."
trigger_phrases:
  - "routing accuracy summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/004-routing-accuracy-hardening"
    last_updated_at: "2026-04-19T00:40:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Delivered routing hardening"
    next_safe_action: "Review diff and commit/push from orchestrator"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Routing Accuracy Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> Placeholder.

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-routing-accuracy-hardening |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Wave A added advisor command-surface normalization in `skill_advisor.py`. The bridge outputs for `command-memory-save`, `command-spec-kit-resume`, `command-spec-kit-deep-research`, and `command-spec-kit-deep-review` now normalize to their owning skills when they win the final ranking step. Guard logic preserves quoted command references and implementation-target prompts so command bridge implementation work is not flattened incorrectly.

Wave B extended Gate 3 routing in `gate-3-classifier.ts` with deep-loop write markers, including direct `/spec_kit:deep-research` and `/spec_kit:deep-review` command forms, `:auto` when paired with `spec_kit`, deep-research/deep-review natural-language markers, loop/sweep/cycle/run/wave variants, `autoresearch`, and `convergence`.

Wave C shipped because Wave B re-measurement left FF at 22, above the conditional threshold. It added broader resume/context markers and a narrow mixed-tail write exception, plus negation, prompt-only generation, and read-only deep-loop guards to keep precision high.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation stayed additive and localized:

- Advisor normalization is post-ranking and does not alter the base score model.
- Gate 3 deep-loop markers reuse the existing `resume` write-producing category.
- Wave C mixed-tail logic only recovers prompts where a read-only lead is followed by an explicit write action through `then`, `and`, `if`, or comma-separated write-tail phrasing.
- The 200-prompt corpus was copied into `tests/routing-accuracy/labeled-prompts.jsonl`, with `score-routing-corpus.py` and `gate3-corpus-runner.mjs` added as repeatable regression tooling.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Wave C was included because Wave B alone produced TT 105 / FT 15 / FF 22, so FF remained above the conditional `>20` threshold.
- `:auto` is intentionally conditional: it only triggers Gate 3 when paired with `spec_kit`, avoiding standalone suffix false positives.
- Prompt-only generation prompts are treated as read-only unless a concrete file target is present.
- Commit and push tasks were marked complete as explicit non-actions because the dispatch said the orchestrator commits at the end.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- `python3 .opencode/skill/skill-advisor/tests/test_skill_advisor.py` — PASS 44/44.
- `TMPDIR=/tmp scripts/node_modules/.bin/vitest run scripts/tests/gate-3-classifier.vitest.ts --config mcp_server/vitest.config.ts` — PASS 47/47.
- `npm run build` in `.opencode/skill/system-spec-kit/shared` — PASS.
- `PYTHONPYCACHEPREFIX=/tmp/pycache-routing python3 -m py_compile tests/routing-accuracy/score-routing-corpus.py` — PASS.
- Final corpus command: `python3 tests/routing-accuracy/score-routing-corpus.py --min-advisor-accuracy 0.60 --min-gate3-f1 0.83 --require-historical-clean --min-joint-tt 108 --max-joint-ft 12 --max-joint-ff 15 --out .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/004-routing-accuracy-hardening/routing-accuracy-final.json` — PASS.

Final metrics:

| Metric | Result |
|--------|--------|
| Advisor exact-match accuracy | 60.0% |
| Gate 3 precision / recall / F1 | 96.9% / 98.43% / 97.66% |
| Historical false-positive regressions | 0 |
| Joint matrix | TT 115 / TF 79 / FT 5 / FF 1 |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Advisor accuracy meets the Wave A target exactly at 60.0%; remaining advisor errors are outside the command-bridge normalization scope. The final joint matrix exceeds the required TT/FT/FF thresholds, but TF remains high because the advisor still misses packet-local and prompt-improvement distinctions not addressed by this packet.
<!-- /ANCHOR:limitations -->
