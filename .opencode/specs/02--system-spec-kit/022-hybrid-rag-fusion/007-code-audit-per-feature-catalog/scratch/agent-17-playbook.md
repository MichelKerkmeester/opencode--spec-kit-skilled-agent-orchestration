# Agent 17 - Manual playbook and review protocol alignment

## Scope

- Updated `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` only where audit findings showed drift.
- Updated `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/review_protocol.md` so the coverage command matches the canonical underscore path and current scenario set.
- Preserved the existing document structure and section ordering.

## Changes made

- Fixed the New Features section heading in `MANUAL_TESTING_PLAYBOOK.md` from `NEW-001..NEW-122` to `NEW-001..NEW-124` so it matches the actual scenario rows and cross-reference coverage.
- Rewrote `NEW-034` to stop requiring runtime shadow-score trace evidence. The updated wording now matches the current system expectation: RRF stays live, RSF must not affect returned rankings, and any RSF comparison is evaluation-only.
- Rewrote `NEW-041` to describe the shipped save-time preflight guard in `preflight.ts` instead of a retrieval-time truncation/summarization behavior. The row now points reviewers at `PF020`, `PF021`, `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`.
- Updated the matching cross-reference rows for `NEW-034` and `NEW-041` so the index does not drift from the main scenario table.
- Replaced the old `rg`-only coverage command in `review_protocol.md` with a deterministic `python3` one-liner that reads the canonical underscore-path playbook and counts only scenario rows before the cross-reference index. This avoids double-counting catalog rows and includes `EX-*`, `NEW-*`, `PHASE-*`, and `F-*` entries.

## Copilot

- Verified `copilot` is installed and `~/.copilot/config.json` already sets `reasoning_effort` to `xhigh`.
- Ran `copilot -p ... --model gpt-5.4 --allow-all-tools 2>&1` for a doc-audit pass. The command completed exploratory repo reads but timed out before final bullet output; I used the confirmed findings plus direct file inspection to finish locally.

## Validation

- `python3 - <<'PY' ...` against `MANUAL_TESTING_PLAYBOOK.md` now reports `166` scenario rows before the cross-reference index.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` returned warnings only. The remaining warnings are pre-existing ToC/size issues elsewhere in this Level 3+ audit tree, not from these edits.

## Remaining notes

- `manual_testing_playbook/subagent_utilization_ledger.md` still contains legacy `manual-testing-playbook` hyphen-path references, but it was outside the requested playbook/protocol scope.
- The merged playbook still intentionally keeps its existing `TABLE OF CONTENTS` structure because this task required preserving current document structure.
- Follow-up Task #17b: corrected remaining dashboard output-format drift in `MANUAL_TESTING_PLAYBOOK.md` so `eval_reporting_dashboard` and the ablation/dashboard scenario now reference supported `text`/`json` runtime output instead of `markdown`.
