---
title: "Skill Advisor Native-First Manual Testing Playbook"
description: "Operator-facing validation package for the Phase 027 native skill advisor, Python compatibility shim, OpenCode plugin bridge, runtime hooks, and H5 operator states."
---

# Skill Advisor Native-First Manual Testing Playbook

This playbook validates the post-Phase-027 Skill Advisor surface as shipped at remediation SHA `97a318d83`, with the Phase 028 code-graph migration treated as complete. The source of truth is the native TypeScript advisor package under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`; the Python script in `.opencode/skill/skill-advisor/scripts/skill_advisor.py` is now a compatibility shim.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. COMMAND NOTATION](#4--command-notation)
- [5. REVIEW AND RELEASE RULES](#5--review-and-release-rules)
- [6. NATIVE MCP TOOL SCENARIOS (`NC-001..NC-005`)](#6--native-mcp-tool-scenarios-nc-001nc-005)
- [7. CLI HOOK AND PLUGIN SCENARIOS (`CL-001..CL-005`)](#7--cli-hook-and-plugin-scenarios-cl-001cl-005)
- [8. COMPAT AND DISABLE SCENARIOS (`CP-001..CP-004`)](#8--compat-and-disable-scenarios-cp-001cp-004)
- [9. OPERATOR H5 SCENARIOS (`OP-001..OP-003`)](#9--operator-h5-scenarios-op-001op-003)
- [10. AUTOMATED TEST CROSS-REFERENCE](#10--automated-test-cross-reference)
- [11. SOURCE CROSS-REFERENCE](#11--source-cross-reference)

---

## 1. OVERVIEW

The playbook contains 17 deterministic manual scenarios across four groups:

| Group | Scope | Scenario Files |
| --- | --- | --- |
| Native MCP tools | `advisor_recommend`, `advisor_status`, `advisor_validate`, ambiguity, lifecycle redirects | [01--native-mcp-tools](01--native-mcp-tools/) |
| CLI hooks and plugin | Claude Code, Copilot CLI, Gemini CLI, Codex CLI, OpenCode plugin bridge | [02--cli-hooks-and-plugin](02--cli-hooks-and-plugin/) |
| Compat and disable | Python shim stdin, force toggles, disable flag, fallback behavior | [03--compat-and-disable](03--compat-and-disable/) |
| Operator H5 | degraded, quarantined, unavailable recovery playbooks | [04--operator-h5](04--operator-h5/) |

Coverage note (2026-04-20): the scenarios target the current native-first runtime: 5-lane fusion, prompt-safe attribution, fail-open freshness states, the stable `compat/index.ts` entrypoint, and the OpenCode plugin bridge. They intentionally do not test the separate Phase 028 `mcp_server/code-graph/` package.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Node.js and Python 3 are available.
3. The MCP server has been built:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

4. The active runtime can call Spec Kit Memory MCP tools, or the operator can run the documented Node/Python commands from the repo root.
5. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless the scenario explicitly sets it.
6. Terminal capture is enabled so stdout, stderr, exit code, and MCP responses are recorded.
7. Destructive or malformed-file checks must run against a temporary copy of the repo unless the scenario explicitly says it is read-only.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

Capture the following for every scenario:

- Scenario ID and file path.
- Exact command or MCP call used.
- Full JSON output or a focused excerpt containing the asserted fields.
- Exit code for shell commands.
- Runtime name for hook/plugin checks.
- Final verdict: `PASS`, `FAIL`, or `SKIP`.
- Triage note for each `FAIL` or `SKIP`.

---

## 4. COMMAND NOTATION

- Shell commands are shown as fenced `bash`.
- MCP calls are shown as text, for example `advisor_status({"workspaceRoot":"$PWD"})`.
- Hook stdin payloads are JSON strings piped into the compiled hook script.
- `jq` checks are optional helpers; when `jq` is unavailable, inspect the same fields manually.

---

## 5. REVIEW AND RELEASE RULES

Release readiness is `READY` only when all 17 scenarios are `PASS` or have an approved `SKIP` with a real sandbox or runtime blocker. A failed native MCP tool scenario, disable-control scenario, or operator recovery scenario makes the package `NOT READY`.

Scenario acceptance:

1. Preconditions are satisfied.
2. The exact steps were executed without undocumented substitutions.
3. Expected output shape appears.
4. Prompt text is not written to diagnostics, status output, cache metadata, or attribution fields.
5. Failure modes were checked when the scenario did not pass immediately.

---

## 6. NATIVE MCP TOOL SCENARIOS (`NC-001..NC-005`)

| ID | Scenario | File |
| --- | --- | --- |
| NC-001 | Native `advisor_recommend` happy path | [001-native-recommend-happy-path.md](01--native-mcp-tools/001-native-recommend-happy-path.md) |
| NC-002 | `advisor_status` live, stale, absent transitions | [002-native-status-transitions.md](01--native-mcp-tools/002-native-status-transitions.md) |
| NC-003 | `advisor_validate` slice bundle output | [003-native-validate-slices.md](01--native-mcp-tools/003-native-validate-slices.md) |
| NC-004 | Ambiguous brief rendering | [004-ambiguous-brief-rendering.md](01--native-mcp-tools/004-ambiguous-brief-rendering.md) |
| NC-005 | Lifecycle redirect metadata | [005-lifecycle-redirect-metadata.md](01--native-mcp-tools/005-lifecycle-redirect-metadata.md) |

---

## 7. CLI HOOK AND PLUGIN SCENARIOS (`CL-001..CL-005`)

| ID | Scenario | File |
| --- | --- | --- |
| CL-001 | Claude Code `user-prompt-submit` hook | [001-claude-user-prompt-submit.md](02--cli-hooks-and-plugin/001-claude-user-prompt-submit.md) |
| CL-002 | Copilot CLI `user-prompt-submit` hook | [002-copilot-user-prompt-submit.md](02--cli-hooks-and-plugin/002-copilot-user-prompt-submit.md) |
| CL-003 | Gemini CLI `user-prompt-submit` hook | [003-gemini-user-prompt-submit.md](02--cli-hooks-and-plugin/003-gemini-user-prompt-submit.md) |
| CL-004 | Codex CLI hook and prompt wrapper | [004-codex-hook-and-wrapper.md](02--cli-hooks-and-plugin/004-codex-hook-and-wrapper.md) |
| CL-005 | OpenCode plugin bridge | [005-opencode-plugin-bridge.md](02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md) |

---

## 8. COMPAT AND DISABLE SCENARIOS (`CP-001..CP-004`)

| ID | Scenario | File |
| --- | --- | --- |
| CP-001 | Python shim `--stdin` mode | [001-python-shim-stdin.md](03--compat-and-disable/001-python-shim-stdin.md) |
| CP-002 | `--force-local` and `--force-native` toggles | [002-force-local-force-native.md](03--compat-and-disable/002-force-local-force-native.md) |
| CP-003 | Global disable flag | [003-global-disable-flag.md](03--compat-and-disable/003-global-disable-flag.md) |
| CP-004 | Daemon absent and fail-open fallback | [004-daemon-absent-fallback.md](03--compat-and-disable/004-daemon-absent-fallback.md) |

---

## 9. OPERATOR H5 SCENARIOS (`OP-001..OP-003`)

| ID | Scenario | File |
| --- | --- | --- |
| OP-001 | Degraded daemon detection and remediation | [001-degraded-daemon.md](04--operator-h5/001-degraded-daemon.md) |
| OP-002 | Quarantined daemon malformed skill flow | [002-quarantined-daemon.md](04--operator-h5/002-quarantined-daemon.md) |
| OP-003 | Unavailable daemon rebuild-from-source flow | [003-unavailable-daemon.md](04--operator-h5/003-unavailable-daemon.md) |

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Surface | Automated Anchor |
| --- | --- |
| Native MCP handlers | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/` |
| Python compatibility parity | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/` and `tests/compat/shim.vitest.ts` |
| Plugin bridge | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` |
| Lifecycle redirect metadata | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts` |
| Promotion gates | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/` |

---

## 11. SOURCE CROSS-REFERENCE

Primary sources:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/compat/index.ts`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
