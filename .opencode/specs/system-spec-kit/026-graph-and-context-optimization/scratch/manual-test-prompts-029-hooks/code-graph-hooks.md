---
title: "Manual Tests — Code-Graph Hooks + OpenCode Plugin Bridge"
description: "Paste-ready prompts for verifying code-graph lifecycle hook parity across Claude, Copilot, Gemini, and OpenCode plugin. Covers HOOK-P1-001 (minimal bridge transport mismatch) and HOOK-P2-005 (plugin tests mocking bridge contract)."
importance_tier: "high"
contextType: "manual-testing"
---

# Code-Graph Hook + Plugin-Bridge Tests

Verify that each runtime actually receives a code-graph payload at the surfaces it claims to support.

**Reminder:** Codex CLI has no startup/lifecycle hook surface (by design — CLI doesn't expose one). It is NOT covered here; see `skill-advisor-hooks.md` for its prompt-time surface.

---

## Part 1 — OpenCode Plugin (Bridge Contract + Lifecycle)

The OpenCode plugin at `.opencode/plugins/spec-kit-compact-code-graph.js` uses the
`spec-kit-compact-code-graph-bridge.mjs` bridge to call `session_resume({minimal:true})`,
then injects `opencodeTransport` into system, message, and compaction surfaces.
Before Phase 029, the minimal path dropped `opencodeTransport`, making the plugin a
silent no-op.

### Preconditions (run in terminal, not CLI)

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Verify the plugin + bridge are in place
ls -la .opencode/plugins/spec-kit-compact-code-graph.js \
       .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs

# Verify mcp_server build is fresh (handler-side transport fix lives here)
cd .opencode/skill/system-spec-kit/mcp_server && npm run build
cd -
```

### Scenario CG-OC-01 — Bridge smoke test (unmocked)

**What it tests:** HOOK-P1-001 fix in `handlers/session-resume.ts` — minimal branch now returns `opencodeTransport.transportOnly === true`.

**Run in terminal (not CLI):**
```bash
node .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs --minimal | tee /tmp/bridge-minimal.json | jq '.data.opencodeTransport.transportOnly'
```

**Expected output:**
```
true
```

If this prints `null`, `false`, or errors with `Cannot read property 'transportOnly' of undefined`, Phase A is broken. Capture full `/tmp/bridge-minimal.json` and file an issue.

---

### Scenario CG-OC-02 — Plugin startup digest injection

**What it tests:** OpenCode plugin `experimental.chat.system.transform` receives a valid transport plan and injects the startup digest at the top of the system prompt.

**In OpenCode CLI (fresh session):**
```
Paste this:

What code-graph context was injected at session start? Look at your system prompt and quote any section labeled "OpenCode Startup Digest" verbatim. If no such section exists, say "no digest observed" and do not speculate.
```

**Expected signals:**
- Response quotes a section starting with `OpenCode Startup Digest` or similar.
- Digest contains at least: repo root path, current branch, tracked-file count, and graph generation number.
- Response does NOT say "no digest observed".

**Fail modes:**
- Response says "no digest observed" → bridge transport regression or plugin not loaded.
- Digest quoted but identical across sessions (static content) → transport construction regressed.

---

### Scenario CG-OC-03 — Message-retrieval transform (mid-session injection)

**What it tests:** Plugin `experimental.chat.messages.transform` injects `OpenCode Retrieved Context` on queries that match the code graph.

**In OpenCode CLI (after CG-OC-02):**
```
Paste this:

Show me how session_resume constructs its minimal payload. Cite specific file:line references from the mcp_server source tree, not from memory. If your context includes an "OpenCode Retrieved Context" block, quote the first 3 bullet points from it verbatim at the end of your response.
```

**Expected signals:**
- Response cites `mcp_server/handlers/session-resume.ts` with real line numbers (~560-680 range after 029/A).
- Response references `buildOpencodeTransport()` helper (new in Phase A).
- Response ends with quoted `OpenCode Retrieved Context` bullets.

**Fail modes:**
- Response speculates about the code without file:line citations → retrieval injection not firing.
- Response cites wrong files (e.g. deprecated `lib/skill-advisor/`) → stale graph payload.

---

### Scenario CG-OC-04 — Compaction resume note

**What it tests:** Plugin `experimental.session.compacting` surface injects a compaction summary when the session compacts.

**In OpenCode CLI (continue from CG-OC-03):**

Pad the context first:
```
Paste this 3 times in a row:

Explain in detail what each MCP tool in this workspace does. Cover at least 10 tools per response, with file:line citations for each handler.
```

Then trigger compaction (if the CLI has a `/compact` command; otherwise let auto-compact fire at context threshold):
```
/compact focus on session_resume transport work
```

After compaction, paste:
```
What does your post-compaction context show? Quote any "OpenCode Compaction Resume Note" section verbatim. If absent, say "no resume note observed".
```

**Expected signals:**
- Response quotes `OpenCode Compaction Resume Note` with:
  - Recent action summary
  - Open questions list (if any)
  - Code graph generation number

**Fail modes:**
- "no resume note observed" after a confirmed compaction → compaction hook regressed.

---

### Scenario CG-OC-05 — Bridge diagnostic on missing transport

**What it tests:** Phase A added a stderr diagnostic to the bridge when the handler response lacks `opencodeTransport` (ADR-001 consequences).

**Run in terminal:**
```bash
# Simulate a broken handler by pointing the bridge at a stub that returns empty data
FAKE_HANDLER=$(cat <<'EOF'
{"ok":true,"data":{}}
EOF
)
echo "$FAKE_HANDLER" | node -e "
const plan = require('./.opencode/plugins/spec-kit-compact-code-graph.js').parseTransportPlan(require('fs').readFileSync(0, 'utf8'));
console.log('plan:', plan);
"
```

**Expected signals:**
- stderr contains a diagnostic like `[bridge] session_resume returned no opencodeTransport — plugin injection will no-op`
- stdout: `plan: null` (parser rejects the missing-transport shape).

**Fail modes:**
- No stderr diagnostic → HOOK-P2-005 reopened.
- Bridge writes to stdout instead of stderr → protocol violation.

---

## Part 2 — Claude Code SessionStart Hook

Claude has a full lifecycle hook via `.claude/settings.local.json` → `dist/hooks/claude/session-prime.js`. Code-graph context is primed into the startup summary.

### Preconditions

```bash
cat .claude/settings.local.json | jq '.hooks.SessionStart'
# Expected: entry pointing to .../dist/hooks/claude/session-prime.js
```

### Scenario CG-CL-01 — SessionStart code-graph priming

**In Claude Code CLI (fresh `claude` session, no prior context):**
```
Paste this as your first message:

Before I ask anything else: what repository state was injected into your startup context? List every bullet point from any section labeled "Code Graph", "OpenCode Startup", or "Startup Digest". Include file count, branch name, graph generation number, and any staleness markers. If none of those sections exist, say "no startup context observed".
```

**Expected signals:**
- Startup banner quoted with current branch (`main`), tracked file count, graph gen number, staleness status (`fresh`, `stale`, or `unavailable`).
- If code graph is stale: response includes a note like `"last scan 2026-04-20; first structural read may refresh inline"`.

### Scenario CG-CL-02 — PreCompact + post-compact priming

**In Claude Code CLI (continue CG-CL-01 session, fill context ~70%):**
```
/compact focus on session-resume transport contract
```

After compact:
```
What "OpenCode Compaction Resume Note" or equivalent post-compact context was injected? Quote it verbatim.
```

**Expected signals:**
- Post-compact response includes continuity note referencing the focus topic.
- Note cites _memory.continuity fields from recent saves.

---

## Part 3 — Copilot Session-Start Wrapper (post-029/C fix)

Pre-029: `.github/hooks/superset-notify.json` routed `sessionStart` directly to `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh`, bypassing the repo-local wrapper.
Post-029 (HOOK-P1-004): routes through `.github/hooks/scripts/session-start.sh` which fans out to Superset and also runs `dist/hooks/copilot/session-prime.js`.

### Preconditions

```bash
jq '.hooks.sessionStart' .github/hooks/superset-notify.json
# Expected: "bash" entry pointing to .github/hooks/scripts/session-start.sh (NOT the Superset path directly)

bash .github/hooks/scripts/session-start.sh </dev/null 2>&1 | head -20
# Expected: startup banner output including "Code Graph:" line
```

### Scenario CG-CP-01 — Startup wrapper banner smoke

**Run in terminal:**
```bash
echo '{"source":"startup","session_id":"smoke-test"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js
```

**Expected signals:**
- stdout contains a block labeled `Session context received`:
  - Memory summary
  - Code Graph line with file/node/edge counts
  - CocoIndex status line
- stderr has diagnostic JSON with `status:"ok"` or `status:"stale"`.

### Scenario CG-CP-02 — Live Copilot session-start banner

**In Copilot CLI (fresh session):**
```
Paste this as your first message:

Describe the startup context you were given. Include the exact values you see for code graph file count, node count, edge count, and whether the graph is marked fresh or stale. If you received no startup context, say "no startup context observed".
```

**Expected signals:**
- Response cites concrete counts (e.g., "33 files, 482 nodes, 165 edges") — not speculation.
- Freshness status matches what the direct smoke returned.

**Fail modes:**
- "no startup context observed" → JSON route regression; re-check `superset-notify.json`.
- Counts don't match the direct smoke → wrapper or bridge mismatch.

---

## Part 4 — Gemini SessionStart (parity smoke)

Gemini has `session-prime.ts` in `mcp_server/hooks/gemini/`. Not deep-smoked pre-029.

### Preconditions

```bash
ls .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/
# Expected: session-prime.ts, user-prompt-submit.ts, compact-inject.ts, session-stop.ts
```

### Scenario CG-GM-01 — Gemini startup hook smoke

**Run in terminal:**
```bash
echo '{"source":"startup","session_id":"smoke"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js 2>&1 | head -40
```

**Expected signals:**
- stdout matches structure from `Copilot Session-Prime` (same context surface).
- No errors about missing files or stale paths.

### Scenario CG-GM-02 — Live Gemini startup prime

**In Gemini CLI (fresh session):**
```
Paste this as your first message:

What "Code Graph" or "Startup Digest" section was injected into your session context? Quote file/node/edge counts verbatim. If none, say "no startup context observed".
```

**Expected signals:** same as CG-CP-02.

---

## Cross-Runtime Consistency Check

After running CG-OC-02, CG-CL-01, CG-CP-02, and CG-GM-02 in four separate sessions within ~30 min of each other, compare the quoted **Code Graph** counts.

**Expected:** All four runtimes report the same (file count, node count, edge count, gen number) within a tolerance of ±2 for any count that reflects background watcher activity.

**Fail:** Counts diverge by >2 or gen numbers disagree — indicates one runtime has a stale cached read.

---

## Results Log

```markdown
## 2026-04-21 First run (post-029)

| Scenario | Runtime | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|---|
| CG-OC-01 | opencode bridge | transportOnly=true | | | |
| CG-OC-02 | opencode | digest quoted | | | |
| CG-OC-03 | opencode | retrieved context shown | | | |
| CG-OC-04 | opencode | resume note after /compact | | | |
| CG-OC-05 | opencode bridge | stderr diagnostic | | | |
| CG-CL-01 | claude | startup banner quoted | | | |
| CG-CL-02 | claude | post-compact note | | | |
| CG-CP-01 | copilot smoke | banner via wrapper | | | |
| CG-CP-02 | copilot live | counts cited | | | |
| CG-GM-01 | gemini smoke | banner | | | |
| CG-GM-02 | gemini live | counts cited | | | |
| Cross-check | all | counts ±2 | | | |
```
