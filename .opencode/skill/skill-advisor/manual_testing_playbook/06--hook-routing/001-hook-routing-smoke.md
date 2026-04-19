---
title: "Hook Routing Smoke Playbook"
description: "Manual smoke validation for the Phase 020 skill-advisor hook surface across Claude, Gemini, Copilot, and Codex."
---

# Hook Routing Smoke Playbook

Validate the Phase 020 hook path as the primary advisor invocation route. This scenario package uses the [Skill Advisor Hook Reference](../../../system-spec-kit/references/hooks/skill-advisor-hook.md) for runtime setup, disable-flag behavior, privacy constraints, and troubleshooting.

---

## Scenario IDs

| ID | Scenario | Result |
|---|---|---|
| HR-001 | Runtime registration check | Each active runtime points to the compiled hook command or documented wrapper fallback |
| HR-002 | Work-intent prompt emits brief | Work prompt produces model-visible `Advisor: ...` context when freshness allows emission |
| HR-003 | Help prompt suppresses brief | `/help` emits `{}` or no wrapper rewrite |
| HR-004 | Disable flag bypass | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` bypasses producer work |
| HR-005 | Stale graph still emits stale badge | Stale source state still emits `Advisor: stale` for passing recommendations |
| HR-006 | Diagnostic privacy spot-check | Prompt-bearing forbidden fields are absent from diagnostics |

---

## Preconditions

1. Run from the repository root.
2. Build the MCP server hook bundle:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

3. Confirm the Phase 020 reference docs are present:

```bash
test -f .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md
test -f .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md
```

4. Capture terminal transcript output for every runtime smoke.

---

## HR-001: Runtime Registration Check

Inspect the configured runtime surfaces from the reference doc §3.

```bash
jq -r '.hooks.UserPromptSubmit[0].hooks[0].command' .claude/settings.local.json
jq -r '.hooks.BeforeAgent[0].hooks[] | select(.name=="speckit-user-prompt-advisor") | .command' .gemini/settings.json
rg -n "userPromptSubmitted|copilot|user-prompt-submit" .github .copilot .opencode -g '*.json' -g '*.jsonc'
rg -n "UserPromptSubmit|pre-tool-use|prompt-wrapper" .codex .opencode -g '*.json' -g '*.jsonc'
```

Pass when every active runtime either points to `mcp_server/dist/hooks/<runtime>/user-prompt-submit.js` or has a documented wrapper fallback from the reference doc.

---

## HR-002: Work-Intent Prompt Emits Brief

Use this prompt in each active runtime:

```text
implement a TypeScript hook
```

Expected model-visible signal:

```text
Advisor:
```

The freshness label may be `live` or `stale`. If no brief appears, capture the runtime diagnostic JSONL line and classify the outcome through the reference doc §4 failure-mode table.

---

## HR-003: `/help` Suppresses Brief

Use this prompt in each active runtime:

```text
/help
```

Pass when the runtime emits `{}` or no wrapper rewrite. No model-visible `Advisor:` text should appear.

---

## HR-004: Disable Flag Bypass

Run one representative runtime smoke with the disable flag set:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
```

Repeat the HR-002 prompt. Pass when output is `{}` or no wrapper rewrite and diagnostics show `status: "skipped"` with `freshness: "unavailable"`.

Unset the flag before continuing:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
```

---

## HR-005: Stale Graph Still Emits Stale Badge

Simulate a stale graph without deleting graph artifacts:

```bash
touch .opencode/skill/sk-code-opencode/SKILL.md
```

Repeat the HR-002 work-intent prompt in one runtime. Pass when a passing recommendation still emits and the brief starts with:

```text
Advisor: stale
```

After the check, rebuild or rescan the skill graph before release validation if the environment expects live freshness.

---

## HR-006: Diagnostic Privacy Spot-Check

Inspect captured hook diagnostics and source schemas:

```bash
rg -n "prompt|promptFingerprint|promptExcerpt|stdout|stderr" \
  .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts \
  .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md
```

Pass when forbidden prompt-bearing fields appear only in explicit forbidden-field documentation and never as emitted JSONL fields.

---

## Evidence Log

Record:

- Runtime(s) tested
- Registration command or wrapper path
- Work-intent prompt result
- `/help` result
- Disable-flag result
- Stale graph result
- Diagnostic privacy excerpt
- Final verdict: PASS, FAIL, or SKIP with blocker
