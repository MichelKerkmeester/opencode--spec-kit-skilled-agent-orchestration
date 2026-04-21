---
title: "Manual Tests — Skill-Advisor Prompt Hook + PreToolUse (all runtimes)"
description: "Paste-ready prompts for verifying skill-advisor prompt-hook routing, native-first dispatch, stale-advisory fallback, policy-detector fix, and PreToolUse denial (Codex). Covers HOOK-P1-002, HOOK-P1-003, HOOK-P2-002, HOOK-P2-003 + ADR-004, ADR-005, ADR-006."
importance_tier: "high"
contextType: "manual-testing"
---

# Skill-Advisor Hook Tests — All Runtimes

The skill advisor is a prompt-time hook that runs on every `UserPromptSubmit` and
injects a compact recommendation (`Advisor: <skill> <conf>/<uncert>`) into the
session context. Phase 029 Phase B fixed three reliability issues:

1. Invalid `codex hooks list` probe in `lib/codex-hook-policy.ts` (HOOK-P1-003).
2. Subprocess SIGKILL timeout producing silent `{}` (HOOK-P1-002) — now returns `Advisor: stale` advisory.
3. Native-first dispatch — bypass Python subprocess when daemon/native scorer is reachable.

Phase D also hardened the Codex PreToolUse hook (HOOK-P2-002, HOOK-P2-003).

---

## Part 1 — Baseline Advisor Smoke (any runtime)

### Scenario SA-BASELINE-01 — Advisor surface exists

**Run in terminal:**
```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py \
  "I need to add rate limiting to our login endpoint" \
  --threshold 0.8
```

**Expected output (stdout, JSON or brief):**
- Recommendation for `system-spec-kit` skill (since implementing = file modification = spec folder required).
- Confidence ≥ 0.8.

### Scenario SA-BASELINE-02 — Native-first dispatch

**Run in terminal:**
```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py \
  "Review this pull request for security issues" \
  --force-native
```

**Expected:**
- Uses native TypeScript scorer (check stderr for diagnostic).
- Recommends `sk-code-review` with high confidence.

---

## Part 2 — Claude Code UserPromptSubmit

### Preconditions

```bash
jq '.hooks.UserPromptSubmit' .claude/settings.local.json
# Expected: entry pointing to dist/hooks/claude/user-prompt-submit.js
```

### Scenario SA-CL-01 — Unambiguous skill match

**In Claude Code CLI (fresh session):**
```
Paste this:

I want to review the session-resume handler for security issues. Before you answer, tell me what skill the advisor recommended for this request. Quote the advisor line verbatim (format: "Advisor: <skill> <conf>/<uncert>"). If no advisor line exists in your context, say "no advisor brief observed".
```

**Expected signals:**
- Response quotes `Advisor: sk-code-review <conf>/<uncert> pass` with conf ≥ 0.8.
- Uncertainty low (≤ 0.05).

**Fail modes:**
- "no advisor brief observed" → UserPromptSubmit hook not firing; check dist/ exists.
- Recommends a different skill → advisor regression.

### Scenario SA-CL-02 — Ambiguous request

**In Claude Code CLI (fresh session):**
```
Paste this:

Help me write something. Then before continuing, quote any advisor line from your context and indicate whether it marks this as "pass" or "ambiguous".
```

**Expected signals:**
- Response quotes advisor line ending with `ambiguous: <skill-a> <conf-a>/<uncert-a> vs <skill-b> <conf-b>/<uncert-b> pass` — two candidates within 0.05.
- Or `stale` if freshness degraded.

### Scenario SA-CL-03 — Stale-advisory fallback

**Precondition:** Temporarily break freshness by touching a tracked SKILL.md without indexing:
```bash
touch .opencode/skill/sk-doc/SKILL.md
# Do NOT run memory_index_scan
```

**In Claude Code CLI (fresh session):**
```
Paste this:

What is 2+2? Quote any advisor line you see.
```

**Expected:**
- Advisor line may show `stale` status (freshness TTL exceeded) but SHOULD still emit a recommendation or explicit stale advisory.
- NOT empty `{}` and NOT SIGNAL_KILLED.

**Cleanup:**
```bash
# Revert any mtime damage with no content change — rebuild index so other tests are clean
node .opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/scripts/reindex.js 2>/dev/null || true
```

---

## Part 3 — Codex CLI UserPromptSubmit + PreToolUse

### Preconditions

```bash
jq '.' .codex/settings.json
# Expected: UserPromptSubmit + PreToolUse entries present

jq '.' .codex/policy.json
# Expected: bashDenylist + bash_denylist arrays, both containing bare "git reset --hard" (post 19eb09c3c)
```

### Scenario SA-CX-01 — Prompt-hook smoke (compiled entrypoint)

**Run in terminal (do NOT paste into CLI):**
```bash
printf '%s\n' '{"prompt":"review this TypeScript hook implementation","cwd":"'"$PWD"'"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

**Expected stdout (post-029):**
```json
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: sk-code-review <conf>/<uncert> pass"}}
```

**Expected stderr diagnostic:**
```json
{"timestamp":"...","runtime":"codex","status":"ok","freshness":"live","durationMs":<N>,"cacheHit":false,"errorCode":null}
```

**Pre-029 failure signature (should NOT occur anymore):**
- stdout: `{}`
- stderr: `"status":"fail_open","errorCode":"SIGNAL_KILLED"`

**Post-029 stale-path signature (acceptable):**
- stdout: `{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: stale (cold-start timeout ≥3s)"}}`
- stderr: `"status":"stale"` (NOT `fail_open`).

### Scenario SA-CX-02 — Live Codex session prompt-hook

**In Codex CLI (fresh `codex` session):**
```
Paste this:

I need to add a new MCP tool handler. Quote the advisor brief you received for this prompt (format: "Advisor: <skill> <conf>/<uncert> <pass|ambiguous|stale>"). If no brief exists, say "no advisor brief observed".
```

**Expected signals:** `Advisor: system-spec-kit <high>/<low> pass` (file modification = spec folder required).

### Scenario SA-CX-03 — Codex hook timeout config (extended budget)

**Precondition:** Set extended timeout env.
```bash
export SPECKIT_CODEX_HOOK_TIMEOUT_MS=5000
```

**Run in terminal:**
```bash
printf '%s\n' '{"prompt":"complex routing request","cwd":"'"$PWD"'"}' \
  | SPECKIT_CODEX_HOOK_TIMEOUT_MS=5000 node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

**Expected:** stderr `durationMs` may exceed 1000ms without triggering SIGNAL_KILLED; stdout has non-empty `additionalContext`.

### Scenario SA-CX-04 — Hook-policy detector (no `codex hooks list`)

**Run in terminal:**
```bash
node -e "
const { detectCodexHookPolicy } = require('./.opencode/skill/system-spec-kit/mcp_server/dist/lib/codex-hook-policy.js');
detectCodexHookPolicy().then(r => console.log(JSON.stringify(r, null, 2)));
"
```

**Expected post-029:**
```json
{
  "status": "full",
  "source": "codex-settings-json",
  "signals": {
    "settingsJsonPresent": true,
    "versionProbeOk": true
  }
}
```

**Pre-029 (should NOT occur anymore):**
- Attempts to call `codex hooks list` which Codex 0.121+ rejects with `unexpected argument 'list'`.
- Status `partial` or `unavailable` due to invalid probe.

### Scenario SA-CX-05 — Hook-policy probe under Superset TUI env

**Run in terminal (simulate Superset TUI env):**
```bash
CODEX_TUI_RECORD_SESSION=1 CODEX_TUI_SESSION_LOG_PATH=/tmp/fake.jsonl CODEX_CI=1 \
  node -e "
const { detectCodexHookPolicy } = require('./.opencode/skill/system-spec-kit/mcp_server/dist/lib/codex-hook-policy.js');
detectCodexHookPolicy().then(r => console.log(JSON.stringify(r, null, 2)));
"
```

**Expected:** Same `status:"full"` as SA-CX-04 — the env-scrub logic strips TUI vars before probing (ADR-004 consequences).

**Pre-029 failure signature:** Timeout on `codex --version` probe under Superset env, incorrectly classifying as `unavailable`.

### Scenario SA-CX-06 — PreToolUse denial (explicit pattern)

**Run in terminal:**
```bash
printf '%s\n' '{"tool":"Bash","tool_input":{"command":"git reset --hard origin/main"}}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js
```

**Expected stdout:**
```json
{"decision":"deny","reason":"Codex PreToolUse denied Bash command matching git reset --hard origin/main"}
```

### Scenario SA-CX-07 — PreToolUse denial (bare `git reset --hard`, post-029)

**Run in terminal:**
```bash
printf '%s\n' '{"tool":"Bash","tool_input":{"command":"git reset --hard"}}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js
```

**Expected post-029:**
```json
{"decision":"deny","reason":"Codex PreToolUse denied Bash command matching git reset --hard"}
```

**Pre-029 failure signature:** `{}` (bare form not in denylist until Phase D added it to defaults + updated `.codex/policy.json` in commit `19eb09c3c`).

### Scenario SA-CX-08 — PreToolUse casing coverage (toolInput camelCase)

**Run in terminal:**
```bash
printf '%s\n' '{"toolName":"Bash","toolInput":{"command":"git reset --hard origin/main"}}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js
```

**Expected post-029:** `{"decision":"deny",...}` — parser now reads `toolInput.command` (camelCase) in addition to `tool_input.command`.

**Pre-029 failure:** `{}` (only snake_case parsed).

### Scenario SA-CX-09 — PreToolUse `bash_denylist` alias

**Run in terminal with a temp policy file using ONLY the snake_case alias:**
```bash
TMPDIR=$(mktemp -d)
cat > "$TMPDIR/.codex/policy.json" <<'EOF'
{
  "version": 1,
  "bash_denylist": ["rm -rf /"]
}
EOF
mkdir -p "$TMPDIR/.codex"
cat > "$TMPDIR/.codex/policy.json" <<'EOF'
{
  "version": 1,
  "bash_denylist": ["rm -rf /"]
}
EOF

cd "$TMPDIR" && printf '%s\n' '{"tool":"Bash","tool_input":{"command":"rm -rf /"}}' \
  | node /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js
cd -
```

**Expected post-029:** `{"decision":"deny",...}` — both `bashDenylist` and `bash_denylist` are loaded.

**Pre-029 failure:** `{}` (only `bashDenylist` key was read).

### Scenario SA-CX-10 — PreToolUse does NOT write policy file

**Run in terminal:**
```bash
TMPDIR=$(mktemp -d)
cd "$TMPDIR"
# No .codex dir exists
printf '%s\n' '{"tool":"Bash","tool_input":{"command":"ls"}}' \
  | node /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js
ls -la .codex 2>/dev/null || echo "no .codex dir created — PASS"
cd -
```

**Expected post-029:**
- Hook output: `{}` (command not denied; `ls` is not in defaults).
- stderr diagnostic: `{"status":"in_memory_default","policyPath":"..."}`
- No `.codex` directory created.

**Pre-029 failure:** `.codex/policy.json` would be written from inside PreToolUse (ADR-006 violation).

---

## Part 4 — Copilot UserPromptSubmit

### Preconditions

```bash
bash .github/hooks/scripts/user-prompt-submit.sh --help 2>&1 | head -5 || true
ls .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
```

### Scenario SA-CP-01 — Prompt-hook smoke

**Run in terminal:**
```bash
echo '{"prompt":"create a new Webflow component","cwd":"'"$PWD"'"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
```

**Expected:** Advisor brief routed to `sk-code-web` or `system-spec-kit` with high confidence.

### Scenario SA-CP-02 — Live Copilot advisor line

**In Copilot CLI (fresh session):**
```
Paste this:

I want to refactor the CSS in our landing page. What skill did the advisor recommend? Quote the advisor line verbatim (format: "Advisor: <skill> <conf>/<uncert> <status>"). If none observed, say "no advisor brief observed".
```

**Expected:** `Advisor: sk-code-web <high>/<low> pass`.

---

## Part 5 — Gemini UserPromptSubmit (smoke)

### Scenario SA-GM-01 — Prompt-hook smoke

**Run in terminal:**
```bash
echo '{"prompt":"help me write a Python script","cwd":"'"$PWD"'"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js 2>&1 | head -20
```

**Expected:** non-empty `additionalContext` with advisor routing.

### Scenario SA-GM-02 — Live Gemini advisor line

**In Gemini CLI:**
```
Paste this:

Help me write a Python CLI. Quote any advisor line from your context. If none, say "no advisor brief observed".
```

---

## Part 6 — Consistency Check

After running SA-CL-01, SA-CX-02, SA-CP-02, SA-GM-02 with the identical prompt
(`"I want to review the session-resume handler for security issues"`), the advisor
should recommend the same skill (`sk-code-review`) with confidence delta ≤ 0.05
across runtimes.

**Fail:** Different skills recommended — scoring divergence in one runtime.

---

## Results Log

```markdown
## 2026-04-21 First run (post-029)

| Scenario | Runtime | Expected | Observed | Pass/Fail |
|---|---|---|---|---|
| SA-BASELINE-01 | cli | system-spec-kit rec | | |
| SA-BASELINE-02 | cli --force-native | sk-code-review rec | | |
| SA-CL-01 | claude | sk-code-review ≥0.8 | | |
| SA-CL-02 | claude | ambiguous marker | | |
| SA-CL-03 | claude | stale marker | | |
| SA-CX-01 | codex smoke | additionalContext non-empty | | |
| SA-CX-02 | codex live | system-spec-kit | | |
| SA-CX-03 | codex smoke w/ 5s | durationMs >1000ms ok | | |
| SA-CX-04 | codex policy detect | status:"full" | | |
| SA-CX-05 | codex Superset env | status:"full" | | |
| SA-CX-06 | codex pre-tool | deny explicit | | |
| SA-CX-07 | codex pre-tool | deny bare reset --hard | | |
| SA-CX-08 | codex pre-tool | deny toolInput camelCase | | |
| SA-CX-09 | codex pre-tool | deny bash_denylist alias | | |
| SA-CX-10 | codex pre-tool | no .codex dir created | | |
| SA-CP-01 | copilot smoke | sk-code-web rec | | |
| SA-CP-02 | copilot live | sk-code-web | | |
| SA-GM-01 | gemini smoke | non-empty | | |
| SA-GM-02 | gemini live | advisor line | | |
| Cross-check | all | same skill ±0.05 | | |
```
