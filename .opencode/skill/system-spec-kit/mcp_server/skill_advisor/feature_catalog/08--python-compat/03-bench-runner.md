---
title: "Python Bench Runner (skill_advisor_bench.py)"
description: "Performance bench runner that measures shim and native latency against the documented envelope (cache-hit p95 <= 50 ms, uncached p95 <= 60 ms)."
trigger_phrases:
  - "python bench runner"
  - "skill_advisor_bench.py"
  - "advisor latency bench"
  - "cache-hit uncached p95"
---

# Python Bench Runner (skill_advisor_bench.py)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Keep latency visible from the Python surface so routing performance regressions are caught quickly without needing a TypeScript test harness.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`scripts/skill_advisor_bench.py` drives the bench measurements. The design envelope is `cache-hit p95 <= 50 ms` and `uncached p95 <= 60 ms` — design ceilings rather than enforceable CI gates, since p95 timing varies with sandbox load. Current stable-workstation measurements are 6.989 ms (cache-hit p95) and 11.45 ms (uncached p95), well within the envelope. Daemon-side idle measurements are 0.031% CPU and 5.516 MB RSS. The CI wrapper at `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` verifies the subprocess surface and JSON envelope shape; tightened p95 gating belongs in a stable benchmark environment, not the stress suite.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_bench.py` | Script | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/bench/` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [PC-005](../../manual_testing_playbook/10--python-compat/005-bench-runner.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Python compat
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--python-compat/03-bench-runner.md`

Related references:

- [01-cli-shim.md](./01-cli-shim.md).
- [02-regression-suite.md](./02-regression-suite.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
<!-- /ANCHOR:source-metadata -->
