---
title: "Skill Advisor Native-First Manual Testing Playbook"
description: "Operator-facing validation package for the Phase 027 native skill advisor, covering native MCP tools, runtime hooks, compatibility shim, operator recovery, daemon auto-update, auto-indexing, lifecycle routing, 5-lane scorer fusion, promotion gates, and Python compatibility."
trigger_phrases:
  - "skill advisor playbook"
  - "native first manual testing"
  - "advisor release readiness"
  - "skill advisor validation"
---

# Skill Advisor Native-First Manual Testing Playbook

This playbook validates the post-Phase-027 Skill Advisor surface as shipped at remediation SHA `97a318d83`. The source of truth is the native TypeScript advisor package under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`; the Python script at `scripts/skill_advisor.py` is a compatibility shim.

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
- [10. AUTO-UPDATE DAEMON SCENARIOS (`AU-001..AU-005`)](#10--auto-update-daemon-scenarios-au-001au-005)
- [11. AUTO-INDEXING SCENARIOS (`AI-001..AI-005`)](#11--auto-indexing-scenarios-ai-001ai-005)
- [12. LIFECYCLE ROUTING SCENARIOS (`LC-001..LC-005`)](#12--lifecycle-routing-scenarios-lc-001lc-005)
- [13. SCORER FUSION SCENARIOS (`SC-001..SC-005`)](#13--scorer-fusion-scenarios-sc-001sc-005)
- [14. PROMOTION GATE SCENARIOS (`PG-001..PG-005`)](#14--promotion-gate-scenarios-pg-001pg-005)
- [15. PYTHON COMPAT SCENARIOS (`PC-001..PC-005`)](#15--python-compat-scenarios-pc-001pc-005)
- [16. AUTOMATED TEST CROSS-REFERENCE](#16--automated-test-cross-reference)
- [17. SOURCE CROSS-REFERENCE](#17--source-cross-reference)
- [18. SCENARIO RUN HISTORY](#18--scenario-run-history)

---

## 1. OVERVIEW

The playbook contains 47 deterministic manual scenarios across ten groups. The first four groups carry the original Phase 027 release-gate surface; the six new groups extend coverage to every shipped sub-feature.

| Group | Scope | Scenario Files |
| --- | --- | --- |
| Native MCP tools | `advisor_recommend`, `advisor_status`, `advisor_validate`, ambiguity, lifecycle redirects | [01--native-mcp-tools](01--native-mcp-tools/) |
| CLI hooks and plugin | Claude Code, Copilot CLI, Gemini CLI, Codex CLI, OpenCode plugin bridge | [02--cli-hooks-and-plugin](02--cli-hooks-and-plugin/) |
| Compat and disable | Python shim stdin, force toggles, disable flag, fallback behavior | [03--compat-and-disable](03--compat-and-disable/) |
| Operator H5 | degraded, quarantined, unavailable recovery playbooks | [04--operator-h5](04--operator-h5/) |
| Auto-update daemon | watcher scope, lease, lifecycle, generation, rebuild-from-source | [05--auto-update-daemon](05--auto-update-daemon/) |
| Auto-indexing | derived extraction, sanitizer, provenance, DF/IDF, anti-stuffing | [06--auto-indexing](06--auto-indexing/) |
| Lifecycle routing | age haircut, supersession, archive, schema migration, rollback | [07--lifecycle-routing](07--lifecycle-routing/) |
| Scorer fusion | 5-lane fusion, projection, ambiguity, attribution, ablation | [08--scorer-fusion](08--scorer-fusion/) |
| Promotion gates | shadow cycle, delta cap, 7-gate bundle, two-cycle, semantic lock and rollback | [09--promotion-gates](09--promotion-gates/) |
| Python compat | stdin mode, force toggles, threshold flag, regression suite, bench | [10--python-compat](10--python-compat/) |

Coverage note (2026-04-20): scenarios target the current native-first runtime with 5-lane fusion, prompt-safe attribution, fail-open freshness states, the stable `compat/index.ts` entrypoint, the OpenCode plugin bridge, the auto-update daemon, the lifecycle routing surface, and the promotion gate bundle. They intentionally do not test the separate Phase 028 `mcp_server/code-graph/` package.

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

Release readiness is `READY` only when all 47 scenarios are `PASS` or have an approved `SKIP` with a real sandbox or runtime blocker. A failed native MCP tool scenario, disable-control scenario, operator recovery scenario, or any promotion-gate scenario makes the package `NOT READY`.

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

## 10. AUTO-UPDATE DAEMON SCENARIOS (`AU-001..AU-005`)

| ID | Scenario | File |
| --- | --- | --- |
| AU-001 | Chokidar watcher narrow scope | [001-watcher-narrow-scope.md](05--auto-update-daemon/001-watcher-narrow-scope.md) |
| AU-002 | Workspace single-writer lease | [002-lease-single-writer.md](05--auto-update-daemon/002-lease-single-writer.md) |
| AU-003 | Daemon lifecycle and SIGTERM | [003-daemon-lifecycle-shutdown.md](05--auto-update-daemon/003-daemon-lifecycle-shutdown.md) |
| AU-004 | Generation-tagged snapshot publication | [004-generation-publication.md](05--auto-update-daemon/004-generation-publication.md) |
| AU-005 | Rebuild from source on corrupt SQLite | [005-rebuild-from-source.md](05--auto-update-daemon/005-rebuild-from-source.md) |

---

## 11. AUTO-INDEXING SCENARIOS (`AI-001..AI-005`)

| ID | Scenario | File |
| --- | --- | --- |
| AI-001 | Deterministic derived extraction | [001-derived-extraction.md](06--auto-indexing/001-derived-extraction.md) |
| AI-002 | A7 sanitizer at every write boundary | [002-sanitizer-boundaries.md](06--auto-indexing/002-sanitizer-boundaries.md) |
| AI-003 | Provenance fingerprints and trust lanes | [003-provenance-and-trust-lanes.md](06--auto-indexing/003-provenance-and-trust-lanes.md) |
| AI-004 | DF/IDF corpus stats active-only | [004-corpus-df-idf.md](06--auto-indexing/004-corpus-df-idf.md) |
| AI-005 | Anti-stuffing and cardinality caps | [005-anti-stuffing.md](06--auto-indexing/005-anti-stuffing.md) |

---

## 12. LIFECYCLE ROUTING SCENARIOS (`LC-001..LC-005`)

| ID | Scenario | File |
| --- | --- | --- |
| LC-001 | Derived-lane-only age haircut | [001-age-haircut.md](07--lifecycle-routing/001-age-haircut.md) |
| LC-002 | Asymmetric supersession redirects | [002-supersession.md](07--lifecycle-routing/002-supersession.md) |
| LC-003 | Archive and future skills indexed but not routed | [003-archive-handling.md](07--lifecycle-routing/003-archive-handling.md) |
| LC-004 | Schema v1 to v2 additive backfill | [004-schema-migration.md](07--lifecycle-routing/004-schema-migration.md) |
| LC-005 | Lifecycle-level rollback | [005-rollback-lifecycle.md](07--lifecycle-routing/005-rollback-lifecycle.md) |

---

## 13. SCORER FUSION SCENARIOS (`SC-001..SC-005`)

| ID | Scenario | File |
| --- | --- | --- |
| SC-001 | Five-lane analytical fusion | [001-five-lane-fusion.md](08--scorer-fusion/001-five-lane-fusion.md) |
| SC-002 | Projection of skill nodes and edges | [002-projection.md](08--scorer-fusion/002-projection.md) |
| SC-003 | Top-2 ambiguity window | [003-ambiguity.md](08--scorer-fusion/003-ambiguity.md) |
| SC-004 | Lane contribution attribution | [004-lane-attribution.md](08--scorer-fusion/004-lane-attribution.md) |
| SC-005 | Lane-by-lane ablation protocol | [005-ablation.md](08--scorer-fusion/005-ablation.md) |

---

## 14. PROMOTION GATE SCENARIOS (`PG-001..PG-005`)

| ID | Scenario | File |
| --- | --- | --- |
| PG-001 | Shadow cycle no-mutation | [001-shadow-cycle-no-mutation.md](09--promotion-gates/001-shadow-cycle-no-mutation.md) |
| PG-002 | Weight delta cap (max 0.05 per promotion) | [002-weight-delta-cap.md](09--promotion-gates/002-weight-delta-cap.md) |
| PG-003 | Seven-gate bundle | [003-gate-bundle-safety.md](09--promotion-gates/003-gate-bundle-safety.md) |
| PG-004 | Two consecutive passing cycles | [004-two-cycle-requirement.md](09--promotion-gates/004-two-cycle-requirement.md) |
| PG-005 | Semantic lock and atomic rollback | [005-semantic-lock-and-rollback.md](09--promotion-gates/005-semantic-lock-and-rollback.md) |

---

## 15. PYTHON COMPAT SCENARIOS (`PC-001..PC-005`)

| ID | Scenario | File |
| --- | --- | --- |
| PC-001 | Python shim `--stdin` round-trip | [001-stdin-mode.md](10--python-compat/001-stdin-mode.md) |
| PC-002 | `--force-native` and `--force-local` toggles | [002-force-native-force-local.md](10--python-compat/002-force-native-force-local.md) |
| PC-003 | `--threshold` confidence flag | [003-threshold-flag.md](10--python-compat/003-threshold-flag.md) |
| PC-004 | Python regression suite 52/52 | [004-regression-suite.md](10--python-compat/004-regression-suite.md) |
| PC-005 | Python bench runner | [005-bench-runner.md](10--python-compat/005-bench-runner.md) |

---

## 16. AUTOMATED TEST CROSS-REFERENCE

| Surface | Automated Anchor |
| --- | --- |
| Native MCP handlers | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/` |
| Python compatibility parity | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/` and `tests/compat/shim.vitest.ts` |
| Plugin bridge | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` |
| Lifecycle redirect metadata | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts` |
| Daemon freshness foundation | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts` |
| Scorer (native) | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts` |
| Promotion gates | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` |
| Legacy advisor suites | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/` |

---

## 17. SOURCE CROSS-REFERENCE

Primary sources:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/compat/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_bench.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`

---

<!-- ANCHOR:scenario-run-history -->
## 18. SCENARIO RUN HISTORY

Archived scenario-execution reports. Each report captures a dated end-to-end pass across all 47 scenarios with PASS/FAIL evidence, test counts, and known gaps.

| Date | Report | Result |
| --- | --- | --- |
| 2026-04-21 | [SCENARIO_RUN_2026-04-21.md](./SCENARIO_RUN_2026-04-21.md) | 47/47 PASS; 167 advisor vitest + 52/52 Python regression + 52 code-graph vitest green |

Add a new row whenever a full scenario-execution pass is archived.

<!-- /ANCHOR:scenario-run-history -->
