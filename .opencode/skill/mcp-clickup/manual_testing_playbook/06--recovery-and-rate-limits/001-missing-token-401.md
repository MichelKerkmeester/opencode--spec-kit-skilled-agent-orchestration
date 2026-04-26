---
title: "CU-024 -- missing token 401 auth error path"
description: "This scenario validates `cu` behavior on missing/invalid token for `CU-024`. It focuses on confirming an unset or invalid token produces a clear 401 auth error from the CLI."
---

# CU-024 -- missing token 401 auth error path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-024`.

---

## 1. OVERVIEW

This scenario validates the missing-token failure path for `CU-024`. It focuses on confirming `cu` produces a clear 401 / auth error when the configured token is unset or invalid, and that restoring the valid token recovers normal operation.

### Why This Matters

Operators encounter expired or rotated tokens regularly. The CLI must surface a clear, actionable error — not a generic crash — so operators know to re-run `cu init`. This scenario also doubles as the recovery rehearsal for CU-003 failures.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-024` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu spaces` returns an auth error when the token is invalidated AND succeeds again after the valid token is restored.
- Real user request: `"What happens when my ClickUp token expires?"`
- Prompt: `As a manual-testing orchestrator, deliberately invalidate the configured ClickUp token then call cu spaces through the cu CLI against the live ClickUp API. Verify the error names auth or 401. Restore the token after. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: back up current config, replace token with `pk_invalid_for_test`, run `cu spaces`, observe error, restore.
- Expected signals: `cu spaces` after invalidation exits non-zero with a "401" / "auth" / "invalid token" message; after restore, `cu spaces` exits 0.
- Desired user-visible outcome: A short report capturing the error message verbatim and the post-restore success.
- Pass/fail: PASS if invalid case errors clearly AND restore succeeds; FAIL if error message is ambiguous, restore fails, or original config is not recovered.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, deliberately invalidate the configured ClickUp token then call cu spaces through the cu CLI against the live ClickUp API. Verify the error names auth or 401. Restore the token after. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cp ~/.cu_config ~/.cu_config.bak` — back up current config (adjust filename to actual config path; consult `cu init --help`)
2. Replace token in `~/.cu_config` with `pk_invalid_for_test` (use Edit tool or `sed`)
3. `bash: cu spaces 2>&1` — invoke against the bad token
4. `bash: echo $?` — capture exit code
5. `bash: mv ~/.cu_config.bak ~/.cu_config` — restore
6. `bash: cu spaces 2>&1 | head -5` — confirm normal operation resumes

### Expected

- Step 1: backup created
- Step 3: produces error output naming `401` / `auth` / `invalid token`
- Step 4: exit code is non-zero
- Step 5: restore succeeds
- Step 6: post-restore call exits 0 with normal output

### Evidence

Capture the verbatim invalid-case output, exit code, the restore confirmation, and the post-restore success output.

### Pass / Fail

- **Pass**: Invalid case errors clearly with auth-related message AND post-restore call succeeds.
- **Fail**: Error message ambiguous (e.g., generic "request failed" without auth hint), restore fails, OR post-restore call still errors.

### Failure Triage

1. If error is generic without auth hint: this is a CLI UX bug — capture verbatim and document; the upstream `@krodak/clickup-cli` should surface the upstream HTTP 401 clearly.
2. If `cu_config` filename is different on the installed CLI version: consult `cu init --help` for the canonical config path; adjust commands accordingly.
3. If post-restore call still errors: confirm the restore succeeded (`diff` against backup); if config is intact, route to CU-003 to validate the token is still active in ClickUp Settings.
4. If the test runs on a shared `.cu_config`: do NOT run this scenario; coordinate with other operators or use an isolated config dir per-run.

### Optional Supplemental Checks

- Try the same with an unset token (delete the field instead of replacing) — both paths should produce a similarly clear error.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog and recovery flow |
| `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md` | `cu init` recovery walkthrough |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Recovery / failure modes) |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND RATE LIMITS
- Playbook ID: CU-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-rate-limits/001-missing-token-401.md`
