---
title: Skill Advisor Hook Reference
description: Operator contract for the native-first Skill Advisor hooks across Claude Code, Copilot CLI, Gemini CLI, Codex CLI, and the OpenCode plugin bridge.
trigger_phrases:
  - "skill advisor hook reference"
  - "advisor hook setup"
  - "speckit advisor hook"
importance_tier: "important"
---

# Skill Advisor Hook Reference

This reference describes the current prompt-time Skill Advisor integrations. The primary routing implementation is the native TypeScript package at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/`; Python remains as a compatibility fallback through `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. RUNTIME MATRIX](#2-runtime-matrix)
- [3. SHARED BEHAVIOR](#3-shared-behavior)
- [4. SETUP AND SMOKE TESTS](#4-setup-and-smoke-tests)
- [5. CONTROL FLAGS](#5-control-flags)
- [6. OPERATOR STATES](#6-operator-states)
- [7. PRIVACY AND DIAGNOSTICS](#7-privacy-and-diagnostics)
- [8. VALIDATION](#8-validation)

---

## 1. OVERVIEW

The hook layer injects a compact advisor brief before the model responds. It does not replace skill loading; it only surfaces the likely skill route and the freshness state.

Default flow:

1. Runtime receives a prompt.
2. Hook adapter parses the prompt payload.
3. Adapter calls `buildSkillAdvisorBrief(prompt, { runtime, workspaceRoot })`.
4. Native advisor is used when live or stale.
5. Compatibility fallback is used when native routing is unavailable.
6. Renderer returns a short `Advisor: ...` brief or an empty fail-open result.
7. Diagnostics are written without raw prompt text.

When the prompt resumes a phase-parent target and `graph-metadata.json` has a fresh `derived.last_active_child_id` pointer (non-null and `derived.last_active_at` within 24 hours), the brief surfaces that active child as the next-action target instead of the parent's child listing. Missing, null, stale, or invalid pointers fall back to the parent manifest/listing behavior.

Native tool baseline:

| Tool | Purpose |
| --- | --- |
| `advisor_recommend` | Prompt-safe skill recommendations with explicit `workspaceRoot`, lane attribution, lifecycle metadata, and effective thresholds. |
| `advisor_status` | Diagnostic-only freshness, generation, trust state, `skillCount`, `lastScanAt`, and lane weights. It does not rebuild. |
| `advisor_rebuild` | Explicit repair command for stale, absent, or unavailable advisor state; pass `force:true` to rebuild even when status is live. |
| `advisor_validate` | Corpus, holdout, parity, safety, latency, threshold semantics, and prompt-safe telemetry rollups. |

---

## 2. RUNTIME MATRIX

| Runtime | Source Hook | Output Shape | Notes |
| --- | --- | --- | --- |
| Claude Code | `mcp_server/hooks/claude/user-prompt-submit.ts` | `hookSpecificOutput.additionalContext` | Reads `prompt` and `cwd`. |
| Copilot CLI | `mcp_server/hooks/copilot/user-prompt-submit.ts` | managed block in `$HOME/.copilot/copilot-instructions.md`; hook stdout remains `{}` | Copilot advisor is NEXT-PROMPT freshness: current prompt sees PRIOR turn's brief. |
| Gemini CLI | `mcp_server/hooks/gemini/user-prompt-submit.ts` | `hookSpecificOutput.additionalContext` | Reads `prompt`, `userPrompt`, or `request.prompt`. |
| Codex CLI | `mcp_server/hooks/codex/user-prompt-submit.ts` | `hookSpecificOutput.additionalContext` | Stdin JSON is canonical and wins over argv JSON. |
| Codex fallback | `mcp_server/hooks/codex/prompt-wrapper.ts` | `promptWrapper` and `wrappedPrompt` | Runs only when Codex hook policy reports hooks unavailable. |
| OpenCode | `.opencode/plugins/spec-kit-skill-advisor.js` + `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | `experimental.chat.system.transform` mutates `output.system` | Bridge imports native `compat/index.js`, applies the same effective threshold on native and fallback paths, then falls back to the Python-backed brief path only when native is unavailable. |

Build all runtime adapters:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

---

## 3. SHARED BEHAVIOR

All hook adapters:

- fail open with `{}` or no context when parsing, native status, scoring, or rendering fails
- honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`
- avoid persisting raw prompts in diagnostics, cache metadata, status, or attribution
- use the same freshness vocabulary: `live`, `stale`, `absent`, `unavailable`
- use the same status vocabulary: `ok`, `skipped`, `degraded`, `fail_open`
- render a compact `Advisor: ...` brief only when a route passes threshold
- use `0.8 / 0.35` as the default prompt-time confidence/uncertainty routing thresholds unless a caller explicitly overrides the confidence threshold
- persist prompt-safe hook diagnostics across hook processes and exclude raw prompt text from the durable sink

Native `advisor_recommend` returns prompt-safe lane contribution metadata when `includeAttribution` is true. It does not return prompt-derived evidence snippets.

---

## 4. SETUP AND SMOKE TESTS

### Claude Code

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' | \
  node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js
```

Expected: `{}` or `hookSpecificOutput.additionalContext` beginning with `Advisor:`.

### Copilot CLI

```bash
SPECKIT_COPILOT_INSTRUCTIONS_PATH="$(mktemp -d)/copilot-instructions.md"
export SPECKIT_COPILOT_INSTRUCTIONS_PATH
printf '%s' '{"prompt":"create a pull request on github","cwd":"'"$PWD"'"}' | \
  node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
cat "$SPECKIT_COPILOT_INSTRUCTIONS_PATH"
```

Expected: hook stdout is `{}` and the custom-instructions file contains `SPEC-KIT-COPILOT-CONTEXT` plus an `Active Advisor Brief` section.

### Gemini CLI

```bash
printf '%s' '{"request":{"prompt":"create a flowchart for the auth process","cwd":"'"$PWD"'"}}' | \
  node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js
```

Expected: `{}` or `hookSpecificOutput.additionalContext`.

### Codex CLI

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | \
  node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

Prompt wrapper fallback:

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | \
  node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/prompt-wrapper.js
```

### OpenCode Plugin Bridge

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | \
  node .opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs
```

Expected: `status: "ok"` with `metadata.route: "native"` when native is available, `metadata.workspaceRoot` matching the supplied repo root, and `metadata.effectiveThresholds` showing the active confidence/uncertainty pair.

---

## 5. CONTROL FLAGS

| Control | Applies To | Behavior |
| --- | --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | native MCP recommendation path, runtime hooks, plugin bridge, Python shim | Disables prompt-time advisor work and returns empty/skipped prompt-safe output. |
| `SPECKIT_COPILOT_INSTRUCTIONS_PATH` | Copilot CLI | Overrides the local custom-instructions target path; useful for tests and sandboxes. |
| `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED=1` | Copilot CLI | Skips writing the Spec Kit managed custom-instructions block while leaving the hook fail-open. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Python shim and OpenCode bridge diagnostics | Forces local Python fallback where supported. |
| `--force-native` | Python shim | Requires native `advisor_recommend`; exits nonzero if unavailable. |
| `--force-local` | Python shim | Bypasses native routing and uses local Python scoring. |
| `--threshold` | Python shim | Sets confidence threshold; default is `0.8`. |
| `--stdin` | Python shim | Reads one prompt from stdin. |

Examples:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-local "save this context"
printf '%s' "save this context" | python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --stdin
```

---

## 6. OPERATOR STATES

Use `advisor_status` for prompt-safe state:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

| State | Meaning | Operator Action |
| --- | --- | --- |
| `live` | Current graph generation is trusted. | No action. |
| `stale` | Sources are newer than graph state. | Run `advisor_rebuild({})`, then recheck with `advisor_status`. |
| `absent` | Required graph state is missing. | Run `advisor_rebuild({})`. `advisor_recommend` should fail open with empty recommendations until repaired. |
| `unavailable` | Status cannot be read. | Inspect daemon logs and SQLite state, then run `advisor_rebuild({"force":true})` when source metadata is intact. |
| `degraded` | Hook or daemon can only provide limited trust. | Follow OP-001 in the playbook. |
| `quarantined` | Watcher isolated malformed skill metadata. | Follow OP-002 in the playbook. |

H5 operator scenarios:

- OP-001 degraded daemon detection, log inspection, remediation
- OP-002 quarantined daemon malformed SKILL.md identify, fix, revert
- OP-003 unavailable daemon corrupted SQLite rebuild-from-source trigger

See `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/manual_testing_playbook.md`.

---

## 7. PRIVACY AND DIAGNOSTICS

Prompt-safety rules:

- Raw prompt text is never persisted in status output.
- Prompt cache keys are HMAC/hash based.
- Diagnostics use runtime, status, freshness, duration, cache, skill label, generation, and normalized error codes.
- `sanitizeSkillLabel` guards labels and lifecycle redirect fields before public output.
- `includeAttribution` returns numeric lane contribution metadata only.

Diagnostic status values:

| Status | Meaning |
| --- | --- |
| `ok` | Brief produced or native call succeeded. |
| `skipped` | Prompt policy, disable flag, or no matching route skipped advisor output. |
| `degraded` | Native or fallback path could not provide full trust. |
| `fail_open` | Error path returned safe empty output and let the prompt continue. |

---

## 8. VALIDATION

Native validation:

```text
advisor_validate({"confirmHeavyRun":true,"workspaceRoot":"/absolute/path/to/repo","skillSlug":null})
```

Package checks:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests --reporter=default
```

Python compatibility:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

Current baseline:

- 80.5% full corpus.
- 77.5% holdout.
- UNKNOWN <= 10.
- 0 regressions on Python-correct prompts.
- 52/52 Python regression suite passed.

Manual scenarios live in the Skill Advisor playbook:

```text
.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/manual_testing_playbook.md
```
