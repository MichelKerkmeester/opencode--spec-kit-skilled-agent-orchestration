# cli-gemini Manual Testing Playbook — Execution Summary

**Run date**: 2026-04-26
**Runtime**: Claude Code (CLAUDECODE=1)
**gemini binary**: `/Users/michelkerkmeester/.superset/bin/gemini` (v0.37.1)
**Mode**: Sequential / single gemini CLI at a time (operator constraint)
**Wall time**: re-runs only ~158s (4 fresh CLI calls); full agent session ~12 min

## Verdict counts

| Verdict | Count | % |
| --- | --- | --- |
| PASS | 15 | 83.3% |
| FAIL | 1 | 5.6% |
| SKIP | 2 | 11.1% |
| **Total** | **18** | **100%** |

## Synthesis source breakdown

| Source | Count | Note |
| --- | --- | --- |
| Existing evidence (from prior rate-limited run) | 14 | Walk + verdict-derive only |
| Fresh re-run (this session, serial) | 4 | CG-004, CG-008, CG-014, CG-016 |

## Top failure modes

### 1. CG-005 — FAIL — playbook scenario uses deprecated CLI flag
- **Symptom**: `--approval-mode never` returns "Invalid values"; valid choices in Gemini CLI 0.37.1 are `default | auto_edit | yolo | plan`.
- **Root cause**: scenario contract authored against an older CLI version; default-mode call exits 0 with READY response, but the never-mode call exits 1 before any API call.
- **Fix**: switch the second call in CG-005 to `--approval-mode plan` (the modern read-only equivalent).

### 2. CG-008 — SKIP — sandbox HOME breaks OAuth auth
- **Symptom**: Save call exits 41 in 0s. Stderr: "Please set an Auth method... or specify GEMINI_API_KEY / GOOGLE_GENAI_USE_VERTEXAI / GOOGLE_GENAI_USE_GCA".
- **Root cause**: scenario sandboxes HOME to `/tmp/cg-008-sandbox`; gemini CLI looks up credentials in real `~/.gemini/`, which the sandbox HOME bypasses, and `GEMINI_API_KEY` env var is not set as fallback.
- **Fix**: either set `GEMINI_API_KEY` env var as the auth fallback, or symlink `~/.gemini/` into the sandbox HOME.

### 3. CG-016 — SKIP — operator serial constraint contradicts scenario contract
- **Symptom**: scenario requires parallel `&` + `wait` dispatch; current run is under "ONE gemini CLI at a time".
- **Validation**: re-running serially confirmed each individual call exits 0 with non-empty output (skill summary 850B, cli_reference summary 876B). The parallelism elapsed-time assertion cannot be validated under serial mode.
- **Fix**: re-run CG-016 specifically when parallel dispatch is permitted by the operator.

## Cross-cutting observations (non-blocking)

- **Agent-loading warnings**: `.gemini/agents/*.md` files use OpenCode-flavored frontmatter that gemini CLI rejects. Stderr surfaces "Agent loading error" on nearly every run. Doesn't block scenarios but should be addressed for clean stderr capture.
- **Deprecated `--allowed-tools` flag**: surfaces deprecation warning on CG-005, CG-010, CG-013, CG-016. Still functional in 0.37.1.
- **429 rate-limit retries**: observed in CG-011 and CG-015; resolved via gemini's internal backoff, did not block PASS.
- **Workspace-path sandbox correctly enforced**: CG-011, CG-015, CG-017 all blocked `/tmp/cg-NNN-snippet.py` direct reads (security feature working as designed); model recovered via `run_shell_command cat`.
- **CG-014 quirk**: fix-call required an explicit "Use write_file" directive — initial generate returned text only. Orchestrator materialized v1 from model text, then re-prompted with tool-use language. Final v1→v2 diff = 3 lines, empty-list-handling grep matches = 2.

## SKIP reasons summary

| Scenario | Reason |
| --- | --- |
| CG-008 | Auth precondition unmet (sandbox HOME blocks OAuth, no API-key fallback) |
| CG-016 | Operator serial-only constraint contradicts scenario's parallel-dispatch contract |

## Outputs

- Per-scenario JSONL: `results.jsonl` (18 lines, JSON-validated)
- Per-scenario evidence: `evidence/CG-001/` through `evidence/CG-018/`. CG-004, CG-008, CG-014, CG-016 are fresh from this session; the rest preserved from prior executor's evidence.

## Recommended next actions

1. **Patch CG-005 scenario** to use `--approval-mode plan` instead of `--approval-mode never` (the deprecated-flag fix).
2. **Patch CG-008 scenario** to either set `GEMINI_API_KEY` or symlink `.gemini/` into the sandbox HOME.
3. **Re-run CG-016 once** when parallel dispatch is operator-permitted (the serial decomposition already confirmed both individual calls work).
4. **Clean up `.gemini/agents/*.md` frontmatter** for clean stderr capture across all gemini playbook runs.
