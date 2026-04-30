---
title: "267 -- Tool routing enforcement"
description: "This scenario validates tool routing enforcement for 267. It focuses on enforcing semantic, structural, and exact-search routing across MCP and runtime surfaces."
audited_post_018: true
---

# 267 -- Tool routing enforcement

## 1. OVERVIEW

This scenario validates tool routing enforcement.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the tool routing enforcement layer (Phase 025) correctly injects routing rules at all 3 MCP enforcement points (server instructions, session priming, response hints) and that runtime instruction files plus the canonical resume/bootstrap surfaces propagate the same routing directives; This ensures AI assistants across all CLIs use CocoIndex for semantic searches and Code Graph for structural queries instead of defaulting to Grep.
- Real user request: `` Please validate Tool routing enforcement against Manual: call memory_stats({}) on a fresh session and inspect response hints for primePackage.routingRules.toolRouting and tell me whether the expected signals are present: Server instructions include a `## Tool Routing` section; PrimePackage contains `routingRules.toolRouting` with SEARCH ROUTING guidance; Code-search-oriented tool responses include hints pointing to `mcp__cocoindex_code__search`; All 4 runtime instruction files contain CocoIndex/semantic-search routing enforcement language; Canonical resume/bootstrap surfaces rely on the same routing contract without a separate bootstrap agent surface. ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Tool routing enforcement against Manual: call memory_stats({}) on a fresh session and inspect response hints for primePackage.routingRules.toolRouting. Verify the tool routing enforcement layer (Phase 025) correctly injects routing rules at all 3 MCP enforcement points (server instructions, session priming, response hints) and that runtime instruction files plus the canonical resume/bootstrap surfaces propagate the same routing directives. This ensures AI assistants across all CLIs use CocoIndex for semantic searches and Code Graph for structural queries instead of defaulting to Grep. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Server instructions include a `## Tool Routing` section; PrimePackage contains `routingRules.toolRouting` with SEARCH ROUTING guidance; Code-search-oriented tool responses include hints pointing to `mcp__cocoindex_code__search`; All 4 runtime instruction files contain CocoIndex/semantic-search routing enforcement language; Canonical resume/bootstrap surfaces rely on the same routing contract without a separate bootstrap agent surface
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All 3 MCP enforcement points emit routing guidance and all runtime/agent files propagate the same decision tree; FAIL: Any enforcement point omits routing rules, or any runtime/agent file lacks the routing directive

---

## 3. TEST EXECUTION

### Prompt

```
Validate 267a server instruction routing section
```

### Commands

1. cd .opencode/skill/system-spec-kit && rg -n "## Tool Routing|buildServerInstructions" mcp_server/context-server.ts && node -e "const fs=require('fs'); const p='mcp_server/context-server.ts'; const s=fs.readFileSync(p,'utf8'); console.log(s.includes('## Tool Routing'))"

### Expected

`buildServerInstructions()` source includes `## Tool Routing` section and routing-rule assembly mentioning CocoIndex and Code Graph

### Evidence

Source grep output and boolean confirmation from the script

### Pass / Fail

- **Pass**: the routing section is present in server instructions
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `mcp_server/context-server.ts` around `buildServerInstructions()` and confirm routing rules are not gated off unexpectedly

---

### Prompt

```
As a context-and-code-graph validation operator, validate PrimePackage includes toolRouting directive against Manual: call memory_stats({}) on a fresh session and inspect response hints for primePackage.routingRules.toolRouting. Verify first tool call returns PrimePackage with routingRules.toolRouting containing SEARCH ROUTING directive. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Manual: call memory_stats({}) on a fresh session and inspect response hints for primePackage.routingRules.toolRouting

### Expected

First tool call returns PrimePackage with `routingRules.toolRouting` containing `SEARCH ROUTING` directive

### Evidence

MCP response JSON showing `primePackage.routingRules.toolRouting`

### Pass / Fail

- **Pass**: `toolRouting` field is present with routing rules
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `mcp_server/hooks/memory-surface.ts` prime assembly and confirm the session is actually fresh before testing

---

### Prompt

```
As a context-and-code-graph validation operator, validate Tool response hints fire on code-search queries against Manual: call memory_search({ query: "find function implementations" }). Verify response hints suggest semantic code search via mcp__cocoindex_code__search. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Manual: call memory_search({ query: "find function implementations" })

### Expected

Response hints suggest semantic code search via `mcp__cocoindex_code__search`

### Evidence

MCP response hints showing routing recommendation

### Pass / Fail

- **Pass**: a hint explicitly mentions `cocoindex_code__search`
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `mcp_server/hooks/response-hints.ts` code-search detection patterns and confirm the query is classified as code-search intent

---

### Prompt

```
Validate 267d runtime instruction routing tables
```

### Commands

1. cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "CocoIndex|semantic search|Tool Routing Enforcement|SEARCH ROUTING" CLAUDE.md .claude/CLAUDE.md .codex/CODEX.md .gemini/GEMINI.md

### Expected

All 4 runtime instruction files contain routing enforcement language for semantic vs structural queries

### Evidence

Grep output with matches from all 4 files

### Pass / Fail

- **Pass**: all 4 files contain routing enforcement
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

If one file is missing, compare it to the others and patch the runtime-specific instruction document that drifted

---

### Prompt

```
Validate 267e resume/bootstrap routing contract
```

### Commands

1. cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "session_bootstrap|session_resume|/spec_kit:resume|SEARCH ROUTING|code_graph_query|mcp__cocoindex_code__search" .opencode/command/spec_kit/README.txt .opencode/command/spec_kit/resume.md .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md

### Expected

Resume/bootstrap surfaces mention the same routing contract used by server priming and response hints

### Evidence

Grep output showing routing-language lines in the canonical recovery surfaces

### Pass / Fail

- **Pass**: routing directives are present in the recovery surfaces without referencing a separate bootstrap agent surface
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Update the canonical recovery docs if one surface fell behind the others

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/23-tool-routing-enforcement.md](../../feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 267
- Canonical root source: manual_testing_playbook.md
- Feature file path: 22--context-preservation-and-code-graph/267-tool-routing-enforcement.md
