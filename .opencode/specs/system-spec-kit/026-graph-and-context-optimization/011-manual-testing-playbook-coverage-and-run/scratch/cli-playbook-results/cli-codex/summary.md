# cli-codex Manual Testing Playbook — Run Summary

## Overall Verdict

| Metric | Count |
|---|---|
| Total scenarios | 25 |
| PASS | 14 |
| FAIL | 10 |
| SKIP | 1 |

## Synthesis Source Breakdown

| Source | Count | Scenarios |
|---|---|---|
| Synthesized from existing evidence | 24 | CX-001..CX-022, CX-024, CX-025 |
| Fresh re-run | 1 | CX-023 (TUI fallback executed during this synthesis pass) |

## Critical-Path Status

Per the master playbook (`MANUAL_TESTING_PLAYBOOK.md` §6), CX-001, CX-005, CX-006 are critical:

| Scenario | Verdict |
|---|---|
| CX-001 (default invocation) | PASS |
| CX-005 (read-only sandbox) | PASS |
| CX-006 (workspace-write sandbox) | PASS |

All three critical scenarios PASS. The 10 FAILs are all playbook authoring bugs (Gate-3 contamination, flag positioning, session-id capture, stdin handling) — not failures of the cli-codex skill's own command surface.

## Top 3 Failure Modes

### 1. Codex agent paused on Gate-3 spec-folder prompt (5 scenarios)

Affected: **CX-008** (variants 1+3), **CX-016**, **CX-018** (after step 1), **CX-021**, **CX-022**.

Symptom: exit 0, stdout = literal Gate-3 menu, no file artifacts.

Root cause: dispatched prompts omit the `Spec folder: <path> (pre-approved, skip Gate 3)` preamble required by SKILL.md ALWAYS rule 8. Codex inherits the project's CLAUDE.md / AGENTS.md gate definitions and pauses non-interactively. The cli-codex skill itself documents this exact failure mode in its Error Handling table.

Fix: add `(pre-approved, skip Gate 3)` preamble to scenario prompts.

### 2. CLI flag-positioning rejection (3 scenarios + several CX-008 sub-steps)

Affected: **CX-019**, **CX-024**, **CX-008** (step-3/4/5 originals).

Symptom: exit 2 with `error: unexpected argument '--search' found`. Same for `--ask-for-approval`.

Root cause: Codex CLI 0.125.0 `exec` subcommand requires every flag BEFORE any positional `[PROMPT]` argument. Original commands placed flags after the prompt.

Fix: reorder flags before positional prompt in CX-019 and CX-024 command sequences.

### 3. Session resume / fork (CX-017)

Symptom: step-1 emitted literal `SESSION_ID: cx017` placeholder; step-2 resume failed with `Error: stdin is not a terminal`; step-2 v2 with `--sandbox` rejected (not accepted by `exec resume`); step-3 fork printed help text.

Root cause: prompt asked the model to "announce SESSION_ID:" → model treated as literal label rather than capturing the actual UUID. Subsequent commands ran against an invalid session ID, with the wrong subcommand flag set, and without stdin redirection.

Fix: capture session ID via verbose-header regex (`session id: [a-f0-9-]+`); remove `--sandbox` from `exec resume` invocations; add `< /dev/null` per SKILL.md ALWAYS rule 5.

## SKIP

**CX-023** (`/review` TUI command) — TUI environment unavailable in agent runtime. Documented triage fallback `codex exec review --uncommitted` executed: first attempt rejected for combining `--uncommitted` with `[PROMPT]`, retry without prompt exited 0; pre/post snapshots match. Fallback verifies CX-003-style surface but does not verify the `/review` slash command itself, so SKIP rather than PASS.

## Notable PASS Caveats

- **CX-003** (`codex exec review --uncommitted`): exit 0; stdout names category words (correctness, security, performance, maintainability) but as a negation ("no actionable ... issue to flag"). Recorded PASS, borderline.
- **CX-004**: Intentional negative control. PASS validates the negative-control framing.
- **CX-014**: stdout has only "Reading additional input from stdin..." (1 line), no meta.txt; broken.ts unchanged. Recorded **FAIL** (incomplete evidence; bug not fixed). Likely missing `< /dev/null` stdin redirect.

## Wall Time

CX-023 fresh re-run: ~21 seconds (step 1: 79 ms; step 2: 48 ms; step 3 fallback first attempt: 40 ms; step 3 retry: 20.5 s; step 5: 37 ms). Synthesis pass over 24 existing-evidence scenarios completed without external dispatch.

## Files

- `results.jsonl` — one JSONL line per scenario with verdict, exit codes, duration, evidence dir, pass/fail reason, synthesis source
- `evidence/CX-001..CX-025/` — per-scenario step artifacts (cmd, meta, stdout)
- `evidence/CX-023/` — newly created via fresh re-run

## Recommended Bug Fixes

1. **Add Gate-3 preamble** to prompts in CX-008, CX-016, CX-018, CX-021, CX-022
2. **Reorder flags before prompt** in CX-019, CX-024
3. **Rewrite CX-017** session-id capture + drop `--sandbox` on `exec resume` + add `< /dev/null`
4. **Add `< /dev/null`** to CX-014 step that's reading stdin
