---
title: Skill Advisor Hook Validation Playbook
description: Manual release validation playbook for the Phase 020 skill-advisor hook.
trigger_phrases:
  - "skill advisor hook validation"
  - "advisor hook release playbook"
---

# Skill Advisor Hook Validation Playbook

Use this playbook before cutting a Phase 020 release or after changing any runtime hook registration. It verifies the reference contract, runtime parity, privacy boundaries, disable flag and rollback path.

---

<!-- ANCHOR:preconditions -->
## 1. PRECONDITIONS

Run from the repository root:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
npm run --workspace=@spec-kit/mcp-server build
```

Required files:

| File | Purpose |
|------|---------|
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Operator reference |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | This playbook |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` | Runtime parity |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts` | 019/004 corpus parity |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts` | Timing and replay gates |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts` | Privacy audit |

---

<!-- /ANCHOR:preconditions -->
<!-- ANCHOR:steps -->
## 2. VALIDATION STEPS

### Step 1: Spec Pre-Flight

Validate every Phase 020 child folder:

```bash
for child in \
  002-shared-payload-advisor-contract \
  003-advisor-freshness-and-source-cache \
  004-advisor-brief-producer-cache-policy \
  005-advisor-renderer-and-regression-harness \
  006-claude-hook-wiring \
  007-gemini-copilot-hook-wiring \
  008-codex-integration-and-hook-policy \
  009-documentation-and-release-contract
do
  bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/${child}" \
    --strict --no-recursive
done
```

Pass condition: each child reports `Errors: 0`.

### Step 2: Cross-Runtime Smoke

Use one known work-intent prompt:

```text
implement a TypeScript hook
```

Check each runtime:

| Runtime | Smoke |
|---------|-------|
| Claude | Start a prompt with the hook registered and confirm an advisor brief or documented no-op path |
| Gemini | Trigger `BeforeAgent` and confirm JSON `additionalContext` |
| Copilot | Use SDK callback or wrapper fallback and confirm model-visible advisor preamble |
| Codex | Use native `UserPromptSubmit` or documented fallback and confirm `additionalContext` |

Pass condition: every runtime shows the same brief when the fixture is live, or the no-brief state is documented by current freshness.

### Step 3: Disable-Flag Verification

Set the rollback flag:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
```

Run at least one runtime hook smoke. A fast Claude-style direct smoke can use unit fixtures:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run tests/claude-user-prompt-submit-hook.vitest.ts \
  --config vitest.config.ts \
  --reporter verbose
```

Pass condition: the disable test reports that the producer was not called and runtime output is `{}`.

Unset after the check:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
```

### Step 4: Corpus Parity

Run the 019/004 corpus parity check:

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts \
  --config .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts \
  --reporter verbose
```

Pass condition: `200/200` top-1 match.

### Step 5: Timing Gates

Run timing and replay gates:

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts \
  --config .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts \
  --reporter verbose
```

Pass conditions:

| Gate | Required |
|------|----------|
| Cache-hit p95 | `<= 50 ms` |
| 30-turn replay hit rate | `>= 60%` |

Current Phase 020 evidence from 005: cache-hit p95 `0.016 ms`, replay hit rate `66.7%`.

### Step 6: Privacy Audit

Run:

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts \
  --config .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts \
  --reporter verbose
```

Then spot-check any local diagnostic output:

```bash
rg -n "prompt|promptFingerprint|promptExcerpt|stdout|stderr" \
  .opencode/skill/system-spec-kit/mcp_server \
  -g '*advisor*' \
  -g '!dist/**'
```

Pass condition: tests pass and JSONL/metrics schemas do not include forbidden prompt-bearing fields.

### Step 7: Observability Check

Confirm metric names match the reference doc:

```bash
rg -n "speckit_advisor_hook_" .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts
```

Expected metric names:

- `speckit_advisor_hook_duration_ms`
- `speckit_advisor_hook_invocations_total`
- `speckit_advisor_hook_cache_hits_total`
- `speckit_advisor_hook_cache_misses_total`
- `speckit_advisor_hook_fail_open_total`
- `speckit_advisor_hook_freshness_state`

Pass condition: only closed labels appear in the metrics contract.

### Step 8: Rollback Drill

Verify the rollback path:

1. Enable runtime hook registration.
2. Confirm an advisor brief appears for a work-intent prompt.
3. Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
4. Repeat the prompt.
5. Confirm no advisor brief appears and no producer call occurs.
6. Unset the flag.
7. Repeat the prompt and confirm normal behavior returns.

Pass condition: rollback and re-enable need no state cleanup.

---

<!-- /ANCHOR:steps -->
<!-- ANCHOR:troubleshooting -->
## 3. TROUBLESHOOTING TABLE

| Symptom | Root Cause | Fix |
|---------|------------|-----|
| No brief appears in any runtime | Disable flag set, advisor script missing, or prompt policy skipped | Unset `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, check `skill_advisor.py`, use a work-intent prompt |
| Brief appears in Claude but not Gemini or Copilot | Runtime registration drift | Check `.gemini/settings.json`, Copilot SDK or wrapper config, then run `advisor-runtime-parity.vitest.ts` |
| `freshness: "unavailable"` persists | Probe failure, missing graph, or corrupt generation counter | Check `.opencode/skill/.advisor-state/generation.json`, `skill-graph.sqlite`, and JSONL `errorCode` |
| p95 latency exceeds 100 ms | Cache misses increased or subprocess path is hot | Inspect cache hit metrics, source-signature churn and graph rebuild frequency |
| Fail-open rate exceeds 5% | Python missing, timeout, invalid JSON, SQLite busy or script missing | Inspect `speckit_advisor_hook_fail_open_total` by `errorCode`, then fix the top code |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:evidence-log-template -->
## 4. EVIDENCE LOG TEMPLATE

Copy this block into release notes or the parent implementation summary:

```text
Advisor hook validation evidence:
- spec pre-flight: PASS, errors=0 for 002-009
- cross-runtime smoke: PASS or documented no-op
- disable flag: PASS, producer not called
- corpus parity: PASS, 200/200
- timing: PASS, cache-hit p95 <= 50 ms, hit rate >= 60%
- privacy: PASS, advisor-privacy suite green
- observability: PASS, metric labels closed
- rollback drill: PASS, flag disables and re-enable restores
```

---

<!-- /ANCHOR:evidence-log-template -->
