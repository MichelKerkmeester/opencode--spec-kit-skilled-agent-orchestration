---
title: Skill Advisor Hook Validation Playbook
description: Manual validation playbook for the shipped skill-advisor hook and MCP contract (Packet 014 surface).
---

# Skill Advisor Hook Validation Playbook

Use this playbook after changing any runtime hook registration, any advisor MCP handler (`advisor_recommend` / `advisor_validate`), the OpenCode plugin-helper bridge, or the shared render/threshold contract. It verifies the shipped Packet 014 surface: public `workspaceRoot` + effective-threshold state on advisor outputs, `thresholdSemantics`, prompt-safe accepted/corrected/ignored totals, durable JSONL diagnostics, runtime parity, the disable flag, and the rollback path.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Manual validation playbook for the shipped skill-advisor hook and MCP contract (Packet 014 surface).

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:preconditions -->
## 2. PRECONDITIONS

Run from the repository root:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

Required files:

| File | Purpose |
|------|---------|
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Operator reference (native tool table + runtime matrix + shared threshold/render contract) |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | This playbook |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | `advisor_recommend` handler (must accept `workspaceRoot`) |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts` | `advisor_validate` handler (must surface `thresholdSemantics` + telemetry totals) |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts` | Shared `renderAdvisorBrief(...)` invariants |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts` | Durable JSONL diagnostics sink + metric labels |
| `.opencode/plugins/spec-kit-skill-advisor.js` | OpenCode plugin |
| `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | OpenCode plugin-helper bridge entrypoint |

---

<!-- /ANCHOR:preconditions -->

<!-- ANCHOR:validation-steps -->
## 3. VALIDATION STEPS

### Step 1: Public Advisor Contract — `advisor_recommend`

Goal: verify `advisor_recommend` accepts explicit `workspaceRoot` and surfaces the resolved workspace + effective thresholds.

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/advisor-recommend.contract.vitest.ts \
  --config .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts \
  --reporter verbose
```

Manual check (MCP or REPL):

```js
advisor_recommend({ prompt: "implement a TypeScript hook", workspaceRoot: "<repo-root>" })
```

Pass condition: the response includes `metadata.workspaceRoot` equal to the supplied root and `metadata.effectiveThresholds` with the resolved confidence/uncertainty numbers used for routing.

### Step 2: Public Advisor Contract — `advisor_validate`

Goal: verify `advisor_validate` surfaces `workspaceRoot`, `thresholdSemantics`, and prompt-safe `telemetry.outcomes.totals`.

```js
advisor_validate({ skillSlug: null, workspaceRoot: "<repo-root>" })
```

Pass conditions:

- `workspaceRoot` equals the supplied root.
- `thresholdSemantics` is present and distinguishes **aggregate** (across-corpus) vs **runtime** (per-invocation) semantics.
- `telemetry.outcomes.totals` contains numeric `accepted`, `corrected`, and `ignored` counts with no raw prompt text anywhere in the payload.
- Corpus/holdout/parity/safety/latency slices still render (existing contract preserved).

### Step 3: Durable JSONL Diagnostics

Goal: confirm hook diagnostics persist to bounded JSONL sinks under the temp metrics root and that `advisor_validate` can read them back across processes.

```bash
ls -la "${TMPDIR:-/tmp}"/speckit-advisor-metrics/*.jsonl
head -3 "${TMPDIR:-/tmp}"/speckit-advisor-metrics/*.jsonl
```

Then drive a prompt through any runtime hook (e.g. the Copilot deterministic smoke in Step 5), and confirm a fresh line appears in the sink and is reflected in the next `advisor_validate` telemetry rollup.

Pass condition: sinks are bounded (rotation/truncation visible), contain closed-label fields only, and are picked up by `advisor_validate` telemetry rollups.

### Step 4: OpenCode Bridge Smoke

Goal: confirm the plugin-helper bridge path is wired and routes through the shared render contract.

```bash
node --input-type=module -e "
  import('./.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs').then(async mod => {
    const res = await mod.default({ prompt: 'implement a TypeScript hook', cwd: process.cwd() });
    console.log(JSON.stringify(res, null, 2));
  });
"
```

Pass conditions:

- Response carries `metadata.workspaceRoot` + `metadata.effectiveThresholds` (Packet 014 surfaced state).
- The default prompt-time threshold contract is `0.8` (confidence) / `0.35` (uncertainty) unless overridden.
- No custom formatter is invoked — output matches the shared `renderAdvisorBrief(...)` invariants.

### Step 5: Cross-Runtime Smoke

One known work-intent prompt: `implement a TypeScript hook`

| Runtime | Smoke |
|---------|-------|
| Claude | Start a prompt with the hook registered and confirm an advisor brief or documented no-op path |
| Gemini | Trigger `BeforeAgent` and confirm JSON `additionalContext` |
| Copilot | Trigger `userPromptSubmitted` with `SPECKIT_COPILOT_INSTRUCTIONS_PATH` pointed at a temp file; confirm stdout is `{}` and the file contains the managed advisor block |
| Codex | Use native `UserPromptSubmit` (enable `[features].codex_hooks` + `~/.codex/hooks.json`) or the documented prompt-wrapper fallback, then confirm `additionalContext` |

Copilot deterministic smoke:

```bash
export SPECKIT_COPILOT_INSTRUCTIONS_PATH="$(mktemp -d)/copilot-instructions.md"
printf '%s' '{"prompt":"implement a TypeScript hook","cwd":"'"$PWD"'"}' | \
  node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
rg -n "SPEC-KIT-COPILOT-CONTEXT|Active Advisor Brief|Advisor:" "$SPECKIT_COPILOT_INSTRUCTIONS_PATH"
```

Expected: hook prints `{}` and the managed custom-instructions block carries the advisor brief.

Pass condition: every runtime shows the same brief when the advisor is live, or a documented no-brief state. The shared render contract means Codex and OpenCode produce byte-identical brief bodies for equivalent input.

### Step 6: Disable-Flag Verification

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
```

Run a fast direct-hook smoke:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run tests/claude-user-prompt-submit-hook.vitest.ts \
  --config vitest.config.ts \
  --reporter verbose
```

Pass condition: producer is not called, hook output is `{}`, and no JSONL lines are written for the suppressed prompts.

Unset after the check:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
```

### Step 7: Cross-Consistency Grep

Confirm no runtime or plugin still routes through a bespoke formatter or a non-shared threshold:

```bash
rg -n "renderAdvisorBrief|effectiveThresholds|thresholdSemantics|workspaceRoot" \
  .opencode/skill/system-spec-kit/mcp_server/skill_advisor \
  .opencode/plugins/spec-kit-skill-advisor.js \
  .opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs \
  .opencode/skill/system-spec-kit/mcp_server/hooks

rg -n "formatAdvisorBrief|legacyAdvisorRender|custom formatter" \
  .opencode/skill/system-spec-kit/mcp_server \
  .opencode/plugins \
  .opencode/skill/system-spec-kit/mcp_server/plugin_bridges
```

Pass condition: the first grep returns the expected shared-contract references; the second grep returns no hits (no drift back to branch-specific rendering).

### Step 8: Observability Check

Confirm metric names match the reference doc:

```bash
rg -n "speckit_advisor_hook_" .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts
```

Expected metric names:

- `speckit_advisor_hook_duration_ms`
- `speckit_advisor_hook_invocations_total`
- `speckit_advisor_hook_cache_hits_total`
- `speckit_advisor_hook_cache_misses_total`
- `speckit_advisor_hook_fail_open_total`
- `speckit_advisor_hook_freshness_state`

Pass condition: only closed labels appear in the metrics contract and the durable JSONL sink schema excludes prompt-bearing fields.

### Step 9: Rollback Drill

1. Enable runtime hook registration.
2. Confirm an advisor brief appears for a work-intent prompt; for Copilot confirm the managed custom-instructions block is refreshed.
3. Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
4. Repeat the prompt.
5. Confirm no advisor brief appears, no producer call occurs, and no new JSONL lines are written. For Copilot, also confirm the managed custom-instructions block is not rewritten while the flag is set.
6. Unset the flag.
7. Repeat the prompt and confirm normal behavior returns.

Pass condition: rollback and re-enable need no state cleanup.

---

<!-- /ANCHOR:validation-steps -->

<!-- ANCHOR:troubleshooting-table -->
## 4. TROUBLESHOOTING TABLE

| Symptom | Root Cause | Fix |
|---------|------------|-----|
| `workspaceRoot` missing from `advisor_recommend` / `advisor_validate` output | Handler not rebuilt or `workspaceRoot` resolver returning undefined | Rebuild the MCP server, confirm the request includes `workspaceRoot`, check the resolver in `skill-advisor/lib/` |
| `thresholdSemantics` absent from `advisor_validate` | Validator still on pre-Packet-014 branch or unified-builder path bypassed | Check `skill-advisor/handlers/advisor-validate.ts` and confirm it imports the shared threshold contract |
| Different brief bodies from Codex vs OpenCode for equivalent input | One path still routes through a custom formatter | Run Step 7 grep; any `formatAdvisorBrief`/`legacyAdvisorRender` hit is drift to fix |
| No brief appears in any runtime | Disable flag set, advisor script missing, or prompt policy skipped | Unset `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, check `skill_advisor.py`, use a work-intent prompt |
| Brief appears in Claude but not Gemini or Copilot | Runtime registration drift or Copilot custom-instructions target mismatch | Check `.gemini/settings.json`, `.github/hooks/*.json`, `SPECKIT_COPILOT_INSTRUCTIONS_PATH`, and the managed block in `$HOME/.copilot/copilot-instructions.md` |
| JSONL sink empty or unbounded | Metrics root misconfigured or rotation disabled | Check `TMPDIR`, confirm `skill-advisor/lib/metrics.ts` sink wiring, and verify rotation bounds |
| `freshness: "unavailable"` persists | Probe failure, missing graph, or corrupt generation counter | Check `.opencode/skill/.advisor-state/generation.json`, `skill-graph.sqlite`, and JSONL `errorCode` |
| Fail-open rate exceeds 5% | Python missing, timeout, invalid JSON, SQLite busy or script missing | Inspect `speckit_advisor_hook_fail_open_total` by `errorCode`, then fix the top code |

---

<!-- /ANCHOR:troubleshooting-table -->

<!-- ANCHOR:evidence-log-template -->
## 5. EVIDENCE LOG TEMPLATE

Copy this block into release notes or the parent implementation summary:

```text
Advisor hook validation evidence (Packet 014 surface):
- advisor_recommend contract: PASS — workspaceRoot + effectiveThresholds surfaced
- advisor_validate contract: PASS — workspaceRoot + thresholdSemantics + accepted/corrected/ignored totals present
- durable JSONL diagnostics: PASS — bounded sinks, read back by advisor_validate across processes
- opencode bridge smoke: PASS — shared renderAdvisorBrief path, 0.8 / 0.35 threshold contract
- cross-runtime smoke: PASS or documented no-op for Claude, Gemini, Copilot, Codex
- disable flag: PASS — producer not called, no JSONL lines written
- cross-consistency grep: PASS — no drift to legacy formatters
- observability: PASS — metric labels closed, no prompt-bearing fields
- rollback drill: PASS — flag disables and re-enable restores
```

---

<!-- /ANCHOR:evidence-log-template -->

<!-- ANCHOR:multi-turn-regression-harness -->
## 6. MULTI-TURN REGRESSION HARNESS

Use this harness when validating hook behavior across several advisor prompts. It keeps the prompts in one Claude Code session so the run pays one cache-creation cost instead of one fresh cache-creation per prompt.

Create the fixture:

```bash
cat > /tmp/speckit-advisor-regression.jsonl <<'JSONL'
{"type":"user","message":{"role":"user","content":[{"type":"text","text":"help me commit my current changes"}]}}
{"type":"user","message":{"role":"user","content":[{"type":"text","text":"implement a TypeScript MCP handler"}]}}
{"type":"user","message":{"role":"user","content":[{"type":"text","text":"review this pull request for correctness and tests"}]}}
{"type":"user","message":{"role":"user","content":[{"type":"text","text":"write documentation for the skill advisor hook"}]}}
{"type":"user","message":{"role":"user","content":[{"type":"text","text":"fix the failing advisor freshness regression"}]}}
JSONL
```

Run the fixture:

```bash
claude -p \
  --input-format stream-json \
  --output-format stream-json \
  --include-hook-events \
  --max-budget-usd 0.30 \
  < /tmp/speckit-advisor-regression.jsonl | tee /tmp/speckit-advisor-regression.out.jsonl
```

Inspect the cost and hook evidence:

```bash
jq -r 'select(.type=="result") | .total_cost_usd' /tmp/speckit-advisor-regression.out.jsonl
jq -r 'select(.type=="hook_started") | [.hook_event_name, .hook_name] | @tsv' \
  /tmp/speckit-advisor-regression.out.jsonl | sort | uniq -c
jq -r 'select(.type=="assistant") | tostring' /tmp/speckit-advisor-regression.out.jsonl | rg "Advisor:|skipped|fail_open"
```

Pass condition:

- The final `result.total_cost_usd` is `<= 0.30`.
- Each of the five work-intent prompts produces an `Advisor:` brief or a documented skip/fail-open reason.
- Hook events remain stable for `UserPromptSubmit`, `SessionStart`, and `Stop`.

Disable-flag note: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` is read by the hook process environment. Do not flip it midway through a stream-json session and expect deterministic mixed behavior. Run a separate disabled fixture for rollback verification:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 claude -p \
  --input-format stream-json \
  --output-format stream-json \
  --include-hook-events \
  --max-budget-usd 0.30 \
  < /tmp/speckit-advisor-regression.jsonl
```

Remove temporary fixtures after recording evidence:

```bash
rm -f /tmp/speckit-advisor-regression.jsonl /tmp/speckit-advisor-regression.out.jsonl
```

---

<!-- /ANCHOR:multi-turn-regression-harness -->
