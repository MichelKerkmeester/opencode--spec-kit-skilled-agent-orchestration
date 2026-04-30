---
title: "Skill Advisor: Manual Testing Playbook"
description: "Canonical sk-doc manual testing playbook for the Skill Advisor user-facing recommendation, hook-integration, and explicit rebuild workflows."
---

# Skill Advisor: Manual Testing Playbook

This document combines the canonical manual-validation contract for the `skill_advisor` package into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while the per-feature files carry scenario-specific execution truth.

---

This playbook package follows the structural template used by `cli-claude-code/manual_testing_playbook/manual_testing_playbook.md`, but the scenarios are Skill Advisor specific and use the `SAD-NNN` ID series.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--recommendation/`
- `02--hook-integration/`
- `03--advisor-rebuild/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. RECOMMENDATION (`SAD-001..SAD-002`)](#7--recommendation-sad-001sad-002)
- [8. HOOK INTEGRATION (`SAD-003`)](#8--hook-integration-sad-003)
- [9. ADVISOR REBUILD (`SAD-004`)](#9--advisor-rebuild-sad-004)
- [10. AUTOMATED TEST CROSS-REFERENCE](#10--automated-test-cross-reference)
- [11. FEATURE CATALOG CROSS-REFERENCE INDEX](#11--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 4 deterministic scenarios across 3 categories validating the most important user-facing Skill Advisor operations: native recommendation, ambiguity handling, prompt-time hook integration, and explicit advisor rebuild.

Coverage note (2026-04-30): this is the initial canonical sk-doc scenario set created after the previous operator-runbook material moved to `../operator_runbook/`. It intentionally covers a small critical path rather than the full legacy runbook inventory.

### Realistic Test Model

1. A realistic user request is given to an operator or runtime.
2. The operator decides whether to call the native MCP tool, run a prompt-time hook, or execute the explicit rebuild path.
3. The operator captures command transcripts, MCP envelopes, hook stdout/stderr, and final verdicts.
4. The scenario passes only when the observed output is prompt-safe, user-visible, and consistent with the documented feature contract.

### What Each Feature File Should Explain

- The realistic user request that should trigger the Skill Advisor behavior.
- The RCAF prompt that drives the manual test.
- The expected execution process, including MCP calls, hook scripts, or rebuild steps.
- The desired user-visible outcome.
- The implementation, automated test, and feature-catalog anchors that justify the scenario.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Node.js and Python 3 are available.
3. The MCP server build is current:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

4. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless a scenario explicitly sets it.
5. Operators can call Skill Advisor MCP tools or run the documented Node/Python commands from the repo root.
6. Rebuild scenarios run against a disposable workspace copy unless the operator intentionally validates the live checkout.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Scenario ID and per-feature file path.
- User request used.
- RCAF prompt used.
- Exact command transcript or MCP call payload.
- Full JSON output or a focused excerpt containing asserted fields.
- Exit code for shell commands.
- Hook stdout and stderr captured separately when hook scripts are involved.
- Final user-facing verdict with rationale.
- Triage notes for every `FAIL`, `PARTIAL`, or `SKIP`.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `bash: <command>`.
- MCP tool calls shown as `advisor_recommend({ key: value })`.
- Hook stdin payloads shown as JSON piped into the compiled hook script.
- `->` separates sequential steps.
- File references use repo-root-relative paths unless otherwise stated.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`.
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`.
3. Scenario execution evidence.
4. Feature-to-scenario coverage map.
5. Triage notes for all non-pass outcomes.

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present in the captured output.
4. Evidence is complete and readable.
5. Raw prompt text is not leaked into diagnostics, attribution, cache metadata, or trust-state fields.
6. Outcome rationale is explicit and references the user-visible behavior.

Scenario verdict:
- `PASS`: all acceptance checks true.
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete.
- `FAIL`: expected behavior missing, contradictory output appears, prompt text leaks, or a critical check failed.
- `SKIP`: a real sandbox, dependency, or runtime blocker prevents execution and is documented.

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`.
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`.
- `FAIL`: any mapped scenario is `FAIL`.

### Release Readiness Rule

Release is `READY` only when all four `SAD-NNN` scenarios are `PASS` or have an approved `SKIP` with a real blocker, and no prompt-safety failure remains unresolved.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning for the canonical Skill Advisor manual test package. The initial scenario set is small enough for one operator, but the structure supports delegation when release validation expands.

### Operational Rules

1. Probe build state first with the MCP server build command.
2. Run recommendation scenarios before hook scenarios so hook failures can be separated from scorer failures.
3. Run rebuild scenarios in a disposable workspace when validating repair behavior.
4. Assign explicit scenario IDs before parallel execution.
5. Keep stdout, stderr, and MCP JSON evidence in scenario-specific files under `/tmp/skill-advisor-playbook/`.
6. After each wave, record verdicts and blockers before starting the next wave.

### Recommended Wave Plan

- **Wave 1**: `SAD-001` and `SAD-002` recommendation behavior.
- **Wave 2**: `SAD-003` hook integration after recommendation behavior is known-good.
- **Wave 3**: `SAD-004` rebuild behavior in a disposable workspace.

---

## 7. RECOMMENDATION (`SAD-001..SAD-002`)

This category validates the native `advisor_recommend` tool surface and its user-visible recommendation behavior.

| ID | Scenario | File |
|---|---|---|
| SAD-001 | Native recommendation happy path | [001-native-recommendation-happy-path.md](01--recommendation/001-native-recommendation-happy-path.md) |
| SAD-002 | Ambiguous recommendation rendering | [002-ambiguous-recommendation-rendering.md](01--recommendation/002-ambiguous-recommendation-rendering.md) |

---

## 8. HOOK INTEGRATION (`SAD-003`)

This category validates prompt-time hook integration for runtime users who expect advisor context without calling the MCP tools manually.

| ID | Scenario | File |
|---|---|---|
| SAD-003 | Claude user-prompt-submit additional context | [001-claude-user-prompt-submit-additional-context.md](02--hook-integration/001-claude-user-prompt-submit-additional-context.md) |

---

## 9. ADVISOR REBUILD (`SAD-004`)

This category validates the explicit rebuild path that repairs stale, absent, or unavailable advisor state.

| ID | Scenario | File |
|---|---|---|
| SAD-004 | Explicit advisor_rebuild repair path | [001-explicit-advisor-rebuild-repair-path.md](03--advisor-rebuild/001-explicit-advisor-rebuild-repair-path.md) |

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Scenario | Automated test anchors |
|---|---|
| SAD-001 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-privacy.vitest.ts` |
| SAD-002 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts` |
| SAD-003 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-runtime-parity.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` |
| SAD-004 | `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` |

Validator limitation: `validate_document.py` validates this root document, but it does not recurse into category folders or prove local links. Operators must spot-check per-feature files and links during review.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

| Scenario | Feature catalog reference |
|---|---|
| SAD-001 | `../feature_catalog/06--mcp-surface/01-advisor-recommend.md` |
| SAD-002 | `../feature_catalog/06--mcp-surface/01-advisor-recommend.md`; `../feature_catalog/04--scorer-fusion/03-ambiguity.md` |
| SAD-003 | `../feature_catalog/07--hooks-and-plugin/01-claude-hook.md`; `../feature_catalog/06--mcp-surface/04-compat-entrypoint.md` |
| SAD-004 | `../feature_catalog/06--mcp-surface/05-advisor-rebuild.md`; `../feature_catalog/01--daemon-and-freshness/06-rebuild-from-source.md` |
