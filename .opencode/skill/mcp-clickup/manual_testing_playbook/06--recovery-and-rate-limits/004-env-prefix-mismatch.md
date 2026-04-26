---
title: "CU-027 -- env-prefix mismatch (CLICKUP_API_KEY vs clickup_CLICKUP_API_KEY)"
description: "This scenario validates the env-var prefix contract for `CU-027`. It focuses on confirming unprefixed `CLICKUP_API_KEY` is invisible to the wrapped MCP server while prefixed `clickup_CLICKUP_API_KEY` works."
---

# CU-027 -- env-prefix mismatch (CLICKUP_API_KEY vs clickup_CLICKUP_API_KEY)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-027`.

---

## 1. OVERVIEW

This scenario validates the env-var prefix contract for `CU-027`. It focuses on confirming an unprefixed `CLICKUP_API_KEY` is NOT visible to the wrapped MCP server, while the prefixed `clickup_CLICKUP_API_KEY` is. Cross-references CM-008 (prefixed env load), CM-009 (unprefixed env not found), and CM-010 (validate_config script) for the foundational env-var contract.

### Why This Matters

The most common ClickUp MCP failure in practice is operators copying their `CLICKUP_API_KEY` straight into `.env` without the `clickup_` prefix. The Code Mode env-var prefixing contract (CM-008..CM-010) requires `{manual_name}_` on every variable. This scenario locks the contract from the ClickUp side: prefixed works, unprefixed fails clearly, and the validator script flags the missing key. It is also a critical-path scenario for the playbook (release-blocking per Section 5 of the root).

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-027` and confirm the expected signals without contradictory evidence.

- Objective: Verify only-`CLICKUP_API_KEY` produces an MCP auth error AND adding `clickup_CLICKUP_API_KEY` recovers AND `validate_config.py` flags the missing prefixed key in the failing run.
- Real user request: `"Why does ClickUp MCP fail when I have CLICKUP_API_KEY set?"`
- Prompt: `As a manual-testing orchestrator, set only the unprefixed CLICKUP_API_KEY in .env, restart Code Mode, and call clickup.clickup_get_teams({}) through Code Mode against the live ClickUp API. Verify the call fails with a missing-credential error. Then add the prefixed clickup_CLICKUP_API_KEY and verify it succeeds. Cross-reference: CM-008 (prefixed env load), CM-009 (unprefixed env not found), CM-010 (validate_config script). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: back up `.env`, set only `CLICKUP_API_KEY`, restart Code Mode, observe failure; add `clickup_CLICKUP_API_KEY`, restart, observe success; run `validate_config.py` in the failing window.
- Expected signals: only-unprefixed call fails with auth/missing-key error; after adding prefixed, call succeeds; `validate_config.py` flags `clickup_CLICKUP_API_KEY` missing in the failing window.
- Desired user-visible outcome: A short report quoting the failing-window error, the recovery, and the validator output.
- Pass/fail: PASS if all three signals hold; FAIL if unprefixed silently works (which would invalidate the entire env-var prefix contract), prefixed fails, or validator does not flag the missing key.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, set only the unprefixed CLICKUP_API_KEY in .env, restart Code Mode, and call clickup.clickup_get_teams({}) through Code Mode against the live ClickUp API. Verify the call fails with a missing-credential error. Then add the prefixed clickup_CLICKUP_API_KEY and verify it succeeds. Cross-reference: CM-008 (prefixed env load), CM-009 (unprefixed env not found), CM-010 (validate_config script). Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cp .env .env.bak` — back up
2. Edit `.env`: keep only `CLICKUP_API_KEY=<valid pk_xxx>`; remove or comment out `clickup_CLICKUP_API_KEY`
3. Restart Code Mode (per the runtime's documented restart procedure)
4. `call_tool_chain({ code: "return clickup.clickup_get_teams({});" })` — expect failure
5. `bash: python3 .opencode/skill/mcp-code-mode/scripts/validate_config.py .utcp_config.json --check-env .env 2>&1` — expect non-zero exit naming `clickup_CLICKUP_API_KEY` (per CM-010)
6. Edit `.env`: add `clickup_CLICKUP_API_KEY=<same valid pk_xxx>`
7. Restart Code Mode
8. `call_tool_chain({ code: "return clickup.clickup_get_teams({});" })` — expect success returning team objects
9. `bash: mv .env.bak .env` — restore
10. Restart Code Mode

### Expected

- Step 4: returns auth / missing-credential error (not success)
- Step 5: validator exits non-zero AND mentions `clickup_CLICKUP_API_KEY`
- Step 8: returns array of team objects with `id` and `name`
- Step 10: original `.env` restored and Code Mode operating normally

### Evidence

Capture the verbatim failing-window tool-call response, the verbatim validator output, the verbatim recovered-window tool-call response, and the restore confirmation.

### Pass / Fail

- **Pass**: Unprefixed-only fails clearly, validator flags missing prefixed key, prefixed succeeds, original `.env` restored.
- **Fail**: Unprefixed-only silently succeeded (CRITICAL — invalidates env-var prefix contract), validator did not flag the missing key, prefixed still failed, OR `.env` not restored.

### Failure Triage

1. **CRITICAL**: If unprefixed-only silently succeeds: the Code Mode env-var prefixing contract is broken — capture the verbatim flow and escalate immediately; cross-route to CM-008 + CM-009.
2. If validator does not flag the missing key: route to CM-010 to confirm the validator script's contract; the script may need the `--check-env` flag explicitly.
3. If prefixed-add still fails: the new `.env` may not have been picked up — confirm Code Mode was actually restarted and the `.env` is on the path Code Mode reads (`pwd` = project root with `.env`).
4. If "tool not found" naming `clickup.clickup_get_teams`: route to CM-005 (correct manual.tool form); the underscore-form may be wrong.
5. If `.env.bak` was not restored: manually copy the backup back; verify with `diff .env .env.bak` before considering the scenario closed.

### Optional Supplemental Checks

- Repeat the test with a multi-tool `.env` (e.g., `clickup_CLICKUP_API_KEY` + `figma_FIGMA_TOKEN`) to confirm the prefixing isolation per-manual: removing one prefix should NOT affect the other manual.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP env-var contract (`clickup_CLICKUP_API_KEY`) |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/03--env-var-prefixing/001-prefixed-env-load.md` | CM-008 prefixed env load |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/03--env-var-prefixing/002-unprefixed-env-not-found.md` | CM-009 unprefixed env not found |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/03--env-var-prefixing/003-validate-config-script.md` | CM-010 validate_config script |
| `.opencode/skill/mcp-code-mode/scripts/validate_config.py` | Validator script |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Setup / preflight, Recovery: env-var prefixing) |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND RATE LIMITS
- Playbook ID: CU-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-rate-limits/004-env-prefix-mismatch.md`
