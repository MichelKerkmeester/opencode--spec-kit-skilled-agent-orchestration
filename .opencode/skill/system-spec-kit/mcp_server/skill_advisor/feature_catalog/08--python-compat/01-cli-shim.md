---
title: "Python CLI Shim (skill_advisor.py)"
description: "Native-first Python CLI shim that delegates to the native advisor, falls back to the local scorer, and exposes --stdin, --force-native, --force-local, --threshold controls."
trigger_phrases:
  - "python cli shim"
  - "skill_advisor.py"
  - "compat shim advisor"
  - "native first shim"
---

# Python CLI Shim (skill_advisor.py)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Keep pre-Phase-027 Python consumers working while moving routing to the native advisor. The shim probes the native daemon first, translates native output into the legacy JSON-array shape, and falls back to the local Python scorer when native routing is unavailable or explicitly bypassed.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`scripts/skill_advisor.py` is the CLI surface. `scripts/skill_advisor_runtime.py` implements the local Python scorer used by `--force-local` and the fallback path. Control flags:

| Flag / env | Effect |
| --- | --- |
| `--stdin` | Read one prompt from stdin instead of argv. |
| `--force-native` | Require native advisor; exit with error if unavailable. |
| `--force-local` | Bypass native and use local Python scorer. |
| `--threshold <value>` | Override dual-threshold confidence cutoff (default 0.8). |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disable advisor invocation entirely. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Env-level force-local toggle for plugin/script diagnostics. |

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Script | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_runtime.py` | Script | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/shim.vitest.ts` | Automated test | Validation reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/daemon-probe.vitest.ts` | Automated test | Validation reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/` | Automated test | Python unit test |
| `Playbook scenarios [PC-001](../../manual_testing_playbook/10--python-compat/001-stdin-mode.md), [PC-002](../../manual_testing_playbook/10--python-compat/002-force-native-force-local.md), [PC-003](../../manual_testing_playbook/10--python-compat/003-threshold-flag.md), and [CP-001..CP-004](../../manual_testing_playbook/03--compat-and-disable/).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Python compat
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--python-compat/01-cli-shim.md`

Related references:

- [02-regression-suite.md](./02-regression-suite.md).
- [03-bench-runner.md](./03-bench-runner.md).
- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).
<!-- /ANCHOR:source-metadata -->
