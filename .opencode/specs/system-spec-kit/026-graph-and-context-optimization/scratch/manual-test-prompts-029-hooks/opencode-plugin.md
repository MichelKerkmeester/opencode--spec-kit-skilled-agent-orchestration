---
title: "Manual Tests — OpenCode Plugin Deep-Dive"
description: "Paste-ready prompts for verifying all three OpenCode plugin surfaces: experimental.chat.system.transform (startup digest), experimental.chat.messages.transform (retrieval injection), experimental.session.compacting (compaction resume note). Also validates the bridge contract post-029/A."
importance_tier: "high"
contextType: "manual-testing"
---

# OpenCode Plugin — Full Feature Tests

The OpenCode plugin at `.opencode/plugins/spec-kit-compact-code-graph.js` implements
three experimental surfaces:

| Surface | Responsibility | Pre-029 state | Post-029 state |
|---|---|---|---|
| `experimental.chat.system.transform` | Startup digest injection | Silent no-op (minimal bridge dropped transport) | ✅ Injects `OpenCode Startup Digest` |
| `experimental.chat.messages.transform` | Mid-session retrieval injection | Silent no-op | ✅ Injects `OpenCode Retrieved Context` |
| `experimental.session.compacting` | Compaction resume note injection | Silent no-op | ✅ Injects `OpenCode Compaction Resume Note` |

All three depend on the plugin bridge (`spec-kit-compact-code-graph-bridge.mjs`)
receiving a valid `data.opencodeTransport.transportOnly === true` payload from
`session_resume({minimal:true})`.

This doc verifies each surface end-to-end AND the bridge contract.

---

## Part 1 — Bridge Contract (runs in terminal, not in OpenCode CLI)

### Scenario OC-P-01 — Bridge produces transport plan (minimal mode)

**Run in terminal:**
```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

node .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs --minimal > /tmp/bridge-minimal.json 2>/tmp/bridge-minimal.err

jq '{
  transportOnly: .data.opencodeTransport.transportOnly,
  hasMessagesTransform: (.data.opencodeTransport.messagesTransform | length),
  hasSystemTransform: (.data.opencodeTransport.systemTransform != null),
  hasCompactionNote: (.data.opencodeTransport.compactionNote != null)
}' /tmp/bridge-minimal.json
```

**Expected:**
```json
{
  "transportOnly": true,
  "hasMessagesTransform": <positive integer>,
  "hasSystemTransform": true,
  "hasCompactionNote": true
}
```

If any of these is false/0/null, bridge has regressed.

### Scenario OC-P-02 — parseTransportPlan accepts real bridge stdout

**Run in terminal:**
```bash
node -e "
import('./.opencode/plugins/spec-kit-compact-code-graph.js').then(mod => {
  const stdout = require('fs').readFileSync('/tmp/bridge-minimal.json', 'utf8');
  const plan = mod.parseTransportPlan(stdout.trim());
  console.log('plan.transportOnly:', plan?.transportOnly);
  console.log('plan.messagesTransform.length:', plan?.messagesTransform?.length);
})
"
```

**Expected:** `plan.transportOnly: true` and `plan.messagesTransform.length: <positive>`.

**Fail:** `plan: null` or throws — Phase 029/A regressed.

### Scenario OC-P-03 — Bridge full (non-minimal) mode still works

**Run in terminal:**
```bash
node .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs > /tmp/bridge-full.json 2>/dev/null
jq '.data | keys' /tmp/bridge-full.json
```

**Expected:** keys include `opencodeTransport`, `memory`, `codeGraph`, `cocoIndex`, `structuralContext`, `payloadContract`.

### Scenario OC-P-04 — Bridge time comparison (minimal < full)

**Run in terminal:**
```bash
time node .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs --minimal >/dev/null 2>&1
time node .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs         >/dev/null 2>&1
```

**Expected:** minimal invocation significantly faster (no full memory enrichment), while still producing `opencodeTransport` per OC-P-01.

### Scenario OC-P-05 — stderr diagnostic on missing transport

**Run in terminal:**
```bash
# Simulate broken handler by feeding plugin parser a response with empty data
echo '{"ok":true,"data":{}}' | node -e "
const m = await import('./.opencode/plugins/spec-kit-compact-code-graph.js');
const stdout = require('fs').readFileSync(0, 'utf8');
const plan = m.parseTransportPlan(stdout.trim());
console.error('parsed:', JSON.stringify(plan));
" 2>&1
```

**Expected:**
- stderr contains `[bridge] session_resume returned no opencodeTransport` or similar warning.
- `parsed: null`.

---

## Part 2 — Live Plugin Session Tests

These run inside the OpenCode CLI.

### Preconditions

```bash
# Sanity check: opencode is installed + plugin is loaded
which opencode
ls -la .opencode/plugins/spec-kit-compact-code-graph.js
```

Start a fresh OpenCode session for each scenario (to isolate startup / retrieval / compaction surfaces).

### Scenario OC-LIVE-01 — Startup digest (system.transform)

**In OpenCode CLI (fresh session, first message):**
```
Paste this as your FIRST message:

Before answering anything else: check your system prompt for a section labeled "OpenCode Startup Digest" (or similar). Quote the entire section verbatim, including any lists of file counts, node counts, edge counts, branch name, and timestamp. If no such section exists, say "no digest observed" and do not speculate about repository state.
```

**Expected signals:**
- Response quotes a digest with:
  - `repo:` or `workspace:` line containing the repo root
  - `branch:` line (likely `main`)
  - `code-graph:` or `Code Graph:` line with file/node/edge counts (example format: `33 files, 482 nodes, 165 edges`)
  - `generation:` or graph gen number
  - `memory:` summary line

**Fail:**
- "no digest observed" → system.transform surface is silent (bridge contract regressed; see OC-P-01).
- Digest mentions "0 files, 0 nodes" → bridge returned empty code graph.

### Scenario OC-LIVE-02 — Retrieval injection (messages.transform)

**In OpenCode CLI (fresh session OR continuing from OC-LIVE-01):**

**Message 1:**
```
Paste this:

Look at .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts. What does the buildOpencodeTransport() helper do and when is it called? Cite file:line references explicitly. If your context includes an "OpenCode Retrieved Context" block, quote the first 5 bullet points from it verbatim.
```

**Expected signals:**
- Response cites real file:line references (e.g., `handlers/session-resume.ts:214` for helper definition, `:657` for minimal-branch call).
- Response includes quoted `OpenCode Retrieved Context` block with relevant bullet points.

**Fail:**
- Response speculates or uses generic descriptions → retrieval not firing.
- Response cites pre-029 line numbers (e.g., cites `:560` for helper and treats minimal branch as an early return) → stale graph payload.

**Message 2 (retrieval for a different domain):**
```
Paste this:

Which files in .opencode/skill/system-spec-kit/mcp_server/hooks/ implement PreToolUse policy enforcement? List them with file:line references for the main entry functions. Quote any "OpenCode Retrieved Context" bullets at the end of your response.
```

**Expected:**
- Correctly identifies `pre-tool-use.ts` + `setup.ts`
- Cites `defaultCodexPolicyPath()`, `ensurePolicyBootstrap()`, `bashCommandFor()` with correct line numbers.

### Scenario OC-LIVE-03 — Compaction resume note (session.compacting)

**In OpenCode CLI (continue a session that has ~70% context used, or manually fill it):**

Context-padding preamble (send 3 separate messages to fill):
```
Message 1:
Paste this:

Explain in detail every MCP tool under .opencode/skill/system-spec-kit/mcp_server/tools/index.ts. For each tool: what it does, its input schema, and the handler file. Aim for comprehensive coverage (≥20 tools if that many exist).
```

```
Message 2:
Paste this:

Now do the same comprehensive review for every .vitest.ts file in mcp_server/tests/. For each: what it tests, why it exists, and any notable fixtures.
```

```
Message 3:
Paste this:

One more: walk me through every hook file in mcp_server/hooks/. Cover Claude, Codex, Copilot, and Gemini variants. Include compile-time entry points in dist/.
```

Now trigger compaction:
```
/compact focus on session_resume transport work
```

Then post-compaction:
```
Paste this:

Did your post-compaction context include an "OpenCode Compaction Resume Note"? If yes, quote it verbatim. If no, say "no resume note observed".
```

**Expected signals:**
- Quoted `OpenCode Compaction Resume Note` block with:
  - Recent action summary
  - Pending action ("session_resume transport work" or similar, matching /compact focus)
  - Open questions if any
  - Current code graph generation number

**Fail:**
- "no resume note observed" despite confirmed compaction → session.compacting hook regressed.

### Scenario OC-LIVE-04 — Runtime-status visibility

**In OpenCode CLI (any session):**
```
Paste this:

If you're running under OpenCode with the spec-kit-compact-code-graph plugin, your runtime status entries should list plugin injection results. List any entries related to "spec-kit-compact-code-graph" or "opencodeTransport". Quote verbatim. If none, say "no plugin runtime status observed".
```

**Expected:** Runtime status mentions plugin injection success/failure per surface.

---

## Part 3 — Failure-Mode Simulations

### Scenario OC-FAIL-01 — What the plugin SHOULD do when bridge is unavailable

**Precondition (terminal):**
```bash
# Temporarily make the bridge script unreadable
chmod 000 .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs
```

**In OpenCode CLI (fresh session):**
```
Paste this:

What code-graph context was injected? If none, describe what diagnostic you see.
```

**Expected:**
- Response says no digest was injected.
- Runtime diagnostic visible: `[plugin] bridge execution failed` or `Bridge returned no OpenCode transport payload`.
- Session continues functional (plugin fails gracefully, not fatally).

**Cleanup:**
```bash
chmod 644 .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs
```

### Scenario OC-FAIL-02 — Plugin continues when session_resume handler errors

**Precondition (terminal):**
```bash
# Introduce an obvious bug in the bridge for this test (don't commit)
cp .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs /tmp/bridge-backup.mjs
sed -i.bak 's/handleSessionResume/handleSessionNOPE/g' .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs
```

**In OpenCode CLI (fresh session):**
```
Paste this:

Plugin status check — what happened with the bridge? Any stderr diagnostics visible?
```

**Expected:**
- stderr visibility of the error from broken bridge path.
- Session still usable.
- No crash, no hang.

**Cleanup (critical — must restore):**
```bash
cp /tmp/bridge-backup.mjs .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs
rm .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs.bak 2>/dev/null
```

---

## Part 4 — Parity with Claude SessionStart

This cross-checks that OpenCode's plugin surface and Claude's SessionStart hook
deliver the same underlying code-graph data (just via different injection
mechanisms).

### Scenario OC-PARITY-01 — Same counts across runtimes

Run CG-OC-02 (from `code-graph-hooks.md`) in OpenCode.
Run CG-CL-01 (from `code-graph-hooks.md`) in Claude.

Both within 30 minutes. Compare:

| Metric | OpenCode digest | Claude banner | Match? |
|---|---|---|---|
| File count | | | |
| Node count | | | |
| Edge count | | | |
| Graph generation | | | |
| Branch | | | |

**Expected:** All counts equal (±1 if background watcher fired between runs). Generation numbers exactly equal unless an edit triggered a bump.

**Fail:** Generation numbers diverge → one runtime is serving stale data; check freshness publication (Phase 4 scan-findings Theme 4 MERGE-P1-004).

---

## Results Log

```markdown
## 2026-04-21 First run (post-029)

| Scenario | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|
| OC-P-01 | transportOnly=true + non-null fields | | | |
| OC-P-02 | plan.transportOnly=true | | | |
| OC-P-03 | full keys present | | | |
| OC-P-04 | minimal faster than full | | | |
| OC-P-05 | stderr diagnostic on missing transport | | | |
| OC-LIVE-01 | startup digest quoted | | | |
| OC-LIVE-02 | retrieved context quoted, correct lines | | | |
| OC-LIVE-03 | compaction resume note present | | | |
| OC-LIVE-04 | runtime status visible | | | |
| OC-FAIL-01 | graceful degradation on unreadable bridge | | | |
| OC-FAIL-02 | graceful degradation on broken handler ref | | | |
| OC-PARITY-01 | counts match Claude SessionStart | | | |
```

---

## Known Open Issues

See `../implementation-summary.md` §Blocked gates for what's still deferred:

1. Full-workspace vitest — being worked on in background codex session (`bqsia6c2t`).
2. `.codex/policy.json` EPERM — closed in commit `19eb09c3c` (setup.ts now resolves via `git rev-parse --show-toplevel`).

For live-system validation of the Phase 029 remediation goals G1–G8, run this
entire doc + `skill-advisor-hooks.md` + `code-graph-hooks.md` end-to-end and log
all results in each doc's Results Log section.
