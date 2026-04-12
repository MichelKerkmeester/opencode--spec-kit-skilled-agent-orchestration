---
title: "267 -- Tool routing enforcement"
description: "This scenario validates tool routing enforcement for 267. It focuses on enforcing semantic, structural, and exact-search routing across MCP and runtime surfaces."
audited_post_018: true
---

# 267 -- Tool routing enforcement

## 1. OVERVIEW

This scenario validates tool routing enforcement.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the tool routing enforcement layer (Phase 025) correctly injects routing rules at all 3 MCP enforcement points (server instructions, session priming, response hints) and that runtime instruction files plus the canonical resume/bootstrap surfaces propagate the same routing directives. This ensures AI assistants across all CLIs use CocoIndex for semantic searches and Code Graph for structural queries instead of defaulting to Grep.
- **Prerequisites**:
  - MCP server running and accessible
  - Working directory is the project root
  - Runtime instruction files present at `CLAUDE.md`, `.claude/CLAUDE.md`, `.codex/CODEX.md`, and `.gemini/GEMINI.md`
- Canonical resume/bootstrap surfaces available via `/spec_kit:resume`, `session_bootstrap()`, and `session_resume()`
- **Prompt**: `Validate 267 tool routing enforcement. Confirm: (1) buildServerInstructions() injects a Tool Routing section with CocoIndex and Code Graph rules, (2) first-call PrimePackage includes routingRules.toolRouting with SEARCH ROUTING directive, (3) response hints on code-search style memory queries recommend cocoindex_code__search, (4) all runtime instruction files contain active routing enforcement, and (5) the canonical resume/bootstrap surfaces rely on the same routing contract without a separate bootstrap agent surface.`
- **Expected signals**:
  - Server instructions include a `## Tool Routing` section
  - PrimePackage contains `routingRules.toolRouting` with SEARCH ROUTING guidance
  - Code-search-oriented tool responses include hints pointing to `mcp__cocoindex_code__search`
  - All 4 runtime instruction files contain CocoIndex/semantic-search routing enforcement language
- Canonical resume/bootstrap surfaces rely on the same routing contract without a separate bootstrap agent surface
- **Pass/fail criteria**:
  - PASS: All 3 MCP enforcement points emit routing guidance and all runtime/agent files propagate the same decision tree
  - FAIL: Any enforcement point omits routing rules, or any runtime/agent file lacks the routing directive

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 267a | Tool routing enforcement | Server instructions contain routing section | `Validate 267a server instruction routing section` | `cd .opencode/skill/system-spec-kit && rg -n "## Tool Routing|buildServerInstructions" mcp_server/context-server.ts && node -e "const fs=require('fs'); const p='mcp_server/context-server.ts'; const s=fs.readFileSync(p,'utf8'); console.log(s.includes('## Tool Routing'))"` | `buildServerInstructions()` source includes `## Tool Routing` section and routing-rule assembly mentioning CocoIndex and Code Graph | Source grep output and boolean confirmation from the script | PASS if the routing section is present in server instructions | Check `mcp_server/context-server.ts` around `buildServerInstructions()` and confirm routing rules are not gated off unexpectedly |
| 267b | Tool routing enforcement | PrimePackage includes toolRouting directive | `Validate 267b PrimePackage toolRouting directive` | `Manual: call memory_stats({}) on a fresh session and inspect response hints for primePackage.routingRules.toolRouting` | First tool call returns PrimePackage with `routingRules.toolRouting` containing `SEARCH ROUTING` directive | MCP response JSON showing `primePackage.routingRules.toolRouting` | PASS if `toolRouting` field is present with routing rules | Check `mcp_server/hooks/memory-surface.ts` prime assembly and confirm the session is actually fresh before testing |
| 267c | Tool routing enforcement | Tool response hints fire on code-search queries | `find function implementations` | `Manual: call memory_search({ query: "find function implementations" })` | Response hints suggest semantic code search via `mcp__cocoindex_code__search` | MCP response hints showing routing recommendation | PASS if a hint explicitly mentions `cocoindex_code__search` | Check `mcp_server/hooks/response-hints.ts` code-search detection patterns and confirm the query is classified as code-search intent |
| 267d | Tool routing enforcement | All 4 runtime instruction files have routing tables | `Validate 267d runtime instruction routing tables` | `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "CocoIndex|semantic search|Tool Routing Enforcement|SEARCH ROUTING" CLAUDE.md .claude/CLAUDE.md .codex/CODEX.md .gemini/GEMINI.md` | All 4 runtime instruction files contain routing enforcement language for semantic vs structural queries | Grep output with matches from all 4 files | PASS if all 4 files contain routing enforcement | If one file is missing, compare it to the others and patch the runtime-specific instruction document that drifted |
| 267e | Tool routing enforcement | Resume/bootstrap surfaces keep the same routing contract | `Validate 267e resume/bootstrap routing contract` | `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "session_bootstrap|session_resume|/spec_kit:resume|SEARCH ROUTING|code_graph_query|mcp__cocoindex_code__search" .opencode/command/spec_kit/README.txt .opencode/command/spec_kit/resume.md .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md` | Resume/bootstrap surfaces mention the same routing contract used by server priming and response hints | Grep output showing routing-language lines in the canonical recovery surfaces | PASS if routing directives are present in the recovery surfaces without referencing a separate bootstrap agent surface | Update the canonical recovery docs if one surface fell behind the others |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/23-tool-routing-enforcement.md](../../feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 267
- Canonical root source: manual_testing_playbook.md
- Feature file path: 22--context-preservation-and-code-graph/267-tool-routing-enforcement.md
