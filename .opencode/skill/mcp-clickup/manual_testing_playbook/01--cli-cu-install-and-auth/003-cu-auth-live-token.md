---
title: "CU-003 -- cu auth verify token works against live API"
description: "This scenario validates `cu auth` for `CU-003`. It focuses on confirming the configured ClickUp token is accepted by the live ClickUp API."
---

# CU-003 -- cu auth verify token works against live API

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-003`.

---

## 1. OVERVIEW

This scenario validates `cu auth` for `CU-003`. It focuses on confirming the ClickUp token configured by `cu init` (or supplied via env / config) is valid against the live ClickUp API.

### Why This Matters

`cu auth` is the operator's first signal that the configured token works. Every later scenario in this playbook depends on a valid auth context: read-only discovery (Wave 2), CLI mutation (Wave 3), and even MCP scenarios that use the prefixed `clickup_CLICKUP_API_KEY` env var. A FAIL here blocks the rest of the playbook and routes the operator to CU-024 (missing-token recovery) or to `cu init` (per CU-004).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu auth 2>&1` exits 0 against the live ClickUp API and reports an authenticated identity.
- Real user request: `"Is my ClickUp token actually working?"`
- Prompt: `As a manual-testing orchestrator, verify the configured ClickUp token works through the cu CLI against the live ClickUp API. Verify cu auth exits 0 and reports authenticated identity. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke `cu auth 2>&1`; do not delegate; do not pre-trust prior auth state.
- Expected signals: exit code 0; stdout names the authenticated user or workspace; no "401" / "invalid token" string.
- Desired user-visible outcome: A short report quoting the authenticated identity (REDACTED if it includes PII) and a PASS verdict.
- Pass/fail: PASS if exit 0 and identity reported; FAIL if non-zero exit, "401" error, or "invalid token" string in output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, verify the configured ClickUp token works through the cu CLI against the live ClickUp API. Verify cu auth exits 0 and reports authenticated identity. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu auth 2>&1` — invoke the auth check
2. `bash: echo $?` immediately after — capture the exit code
3. Inspect stdout for identity (user name, email, workspace) and absence of error tokens (`401`, `invalid token`, `unauthorized`)

### Expected

- Step 1: produces non-empty output
- Step 2: exit code is 0
- Step 3: output includes a user / workspace identity AND does not contain `401`, `invalid token`, or `unauthorized`

### Evidence

Capture the verbatim output of `cu auth 2>&1` (REDACT any PII like email or full name) and the exit code from step 2.

### Pass / Fail

- **Pass**: Exit 0, identity present in output, no error tokens.
- **Fail**: Non-zero exit, OR output contains `401` / `invalid token` / `unauthorized`, OR no identity in output.

### Failure Triage

1. If exit non-zero with auth error: route to CU-024 (missing token → 401). Re-run `cu init` per CU-004 to reconfigure; verify the token from ClickUp Settings > Apps > API Token (must start with `pk_`).
2. If `cu auth` is not a known subcommand on the installed CLI version: check `cu --help` to identify the equivalent (e.g., `cu whoami` or `cu identity`); use the equivalent and update evidence.
3. If output contains "Taylor UUCP" rather than a ClickUp response: route to CU-001 + CU-002 — the wrong binary is resolving.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI primary auth flow |
| `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md` | Token acquisition and `cu init` walk-through |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Setup / preflight) |

---

## 5. SOURCE METADATA

- Group: CLI CU INSTALL AND AUTH
- Playbook ID: CU-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-cu-install-and-auth/003-cu-auth-live-token.md`
