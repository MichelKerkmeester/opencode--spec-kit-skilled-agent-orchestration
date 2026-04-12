# Test Prompts for 005-code-graph-upgrades — All CLIs

These prompts exercise the code graph upgrades shipped in packet 014. Run each prompt through the specified CLI and verify the expected behavior.

---

## Test Matrix

| Test | Feature | MCP Tools Used | Expected Evidence |
|------|---------|----------------|-------------------|
| T1 | Graph scan + status | `code_graph_scan`, `code_graph_status` | Graph is populated, status shows ready |
| T2 | Basic query | `code_graph_query` | Returns callers/imports/outline |
| T3 | Detector provenance | `code_graph_scan`, `code_graph_status` | Provenance summary with dominant detector + counts |
| T4 | Blast-radius depth cap | `code_graph_query` | Traversal stops at maxDepth, no out-of-bound nodes |
| T5 | Multi-file union mode | `code_graph_query` | Multiple files merged without duplicates |
| T6 | Hot-file breadcrumbs | `code_graph_query` | High-degree files get advisory hotFileBreadcrumb |
| T7 | Edge evidence enrichment | `code_graph_query` | Response includes edgeEvidenceClass + numericConfidence |
| T8 | Structural routing hint | `code_graph_context`, `session_bootstrap` | Advisory "prefer code_graph_query" for structural questions |
| T9 | Regression floor | vitest only | DetectorProvenance + depth expectations frozen |

---

## Claude Code Prompts

### T1-CC: Graph Scan + Status

```
Call code_graph_scan to index the codebase, then call code_graph_status. 
Show me the graph status including node count, edge count, and whether 
the graph is ready. Also show the detector provenance summary if available.
```

### T2-CC: Basic Query

```
Use code_graph_query to find all callers of the function 
"validateMemoryQualityContent" in the codebase. Show me the file paths 
and line numbers of each caller.
```

### T3-CC: Detector Provenance

```
After running code_graph_scan, check code_graph_status and tell me:
1. What is the dominant detector provenance (AST, regex, or heuristic)?
2. What are the counts per detector type?
3. Is the provenance summary stored and retrievable?
```

### T4-CC: Blast-Radius Depth Cap

```
Use code_graph_query to find all dependencies of 
".opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts" 
with maxDepth=2. Verify that no nodes beyond depth 2 appear in the results. 
Then try maxDepth=1 and confirm the result set is smaller.
```

### T5-CC: Multi-File Union Mode

```
Use code_graph_query to query the callers of BOTH 
"shared-payload.ts" AND "memory-metadata.ts" in a single query using 
union mode. Verify the results are merged without duplicate entries.
```

### T6-CC: Hot-File Breadcrumbs

```
Use code_graph_query to get the outline of "shared-payload.ts". 
This file has many importers so it should be flagged as a hot file. 
Check if the response includes a hotFileBreadcrumb advisory warning 
about blast radius.
```

### T7-CC: Edge Evidence Enrichment

```
Use code_graph_query to find edges connected to 
"code-graph-db.ts". Check whether the response includes 
edgeEvidenceClass and numericConfidence metadata on the edges. 
Report the evidence class and confidence values you see.
```

### T8-CC: Structural Routing Hint

```
Call session_bootstrap and check if the response includes a structural 
routing hint that suggests using code_graph_query for structural 
questions (callers, imports, dependencies). Report the exact hint text.
```

---

## Codex CLI Prompts

Run each with: `codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast"`

### T1-CX: Graph Scan + Status

```
codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast" "Call the MCP tool code_graph_scan to index the codebase. Then call code_graph_status. Report: node count, edge count, graph readiness state, and detector provenance summary (dominant detector type and per-type counts). Do NOT modify any files."
```

### T2-CX: Basic Query

```
codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast" "Use the MCP tool code_graph_query to find all callers of the function validateMemoryQualityContent. List every caller with file path and line number. Do NOT modify any files."
```

### T3-CX: Detector Provenance

```
codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast" "Run code_graph_scan, then code_graph_status. Report the detector provenance summary: which detector type is dominant (AST, regex, heuristic), what the per-type counts are, and whether the DetectorProvenance contract from shared-payload.ts is correctly serialized. Cite the specific fields you see in the response. Do NOT modify any files."
```

### T4-CX: Blast-Radius Depth Cap

```
codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast" "Use code_graph_query to find all dependencies of shared-payload.ts with maxDepth=2. Count the nodes at each depth level. Then repeat with maxDepth=1. Verify that depth-2 nodes do NOT appear in the maxDepth=1 result. Report both result sets and confirm blast-radius depth cap is working. Do NOT modify any files."
```

### T5-CX: Multi-File Union Mode

```
codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast" "Use code_graph_query to query callers of both shared-payload.ts and memory-metadata.ts using union mode (multiple source files in one query). Verify the results are merged and contain no duplicate entries. Report the total unique callers found. Do NOT modify any files."
```

### T6-CX: Hot-File Breadcrumbs

```
codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast" "Use code_graph_query to get the outline of shared-payload.ts. Check if the response includes a hotFileBreadcrumb advisory about blast radius for this high-degree file. Report the exact breadcrumb text and whether it uses low-authority advisory wording (not claiming a new score). Do NOT modify any files."
```

### T7-CX: Edge Evidence Enrichment

```
codex exec -m gpt-5.4 -c model_reasoning_effort=high -c service_tier="fast" "Use code_graph_query to find edges connected to code-graph-db.ts. Check whether the response includes graphEdgeEnrichment with edgeEvidenceClass and numericConfidence fields. Report the evidence class values and confidence numbers you see. Do NOT modify any files."
```

---

## Copilot CLI Prompts

Run each with: `copilot -p "..."`

### T1-CP: Graph Scan + Status

```
copilot -p "Use the Spec Kit Memory MCP server to call code_graph_scan followed by code_graph_status. Report the graph node count, edge count, readiness state, and detector provenance summary. Do not modify any files."
```

### T2-CP: Basic Query

```
copilot -p "Use code_graph_query from the Spec Kit Memory MCP to find all callers of validateMemoryQualityContent. List each caller with file path and line number."
```

### T3-CP: Detector Provenance

```
copilot -p "After running code_graph_scan, check code_graph_status for the detector provenance summary. Report which detector is dominant (AST vs regex vs heuristic), the per-type counts, and whether the DetectorProvenance taxonomy from shared-payload.ts is correctly reflected."
```

### T4-CP: Blast-Radius Depth Cap

```
copilot -p "Use code_graph_query to find dependencies of .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts with maxDepth=2, then again with maxDepth=1. Verify depth cap works by confirming fewer nodes at depth 1. Report both counts."
```

### T5-CP: Multi-File Union

```
copilot -p "Use code_graph_query to query callers of both shared-payload.ts and memory-metadata.ts in union mode. Confirm merged results with no duplicates."
```

### T6-CP: Hot-File Breadcrumbs

```
copilot -p "Query the code graph for shared-payload.ts outline. Check for a hotFileBreadcrumb advisory in the response — this file has many importers so it should be flagged. Report the breadcrumb text."
```

### T7-CP: Edge Evidence

```
copilot -p "Query code_graph_query for edges connected to code-graph-db.ts. Report whether edgeEvidenceClass and numericConfidence metadata appear on the edges."
```

---

## Gemini CLI Prompts

Run each with: `gemini -p "..."`

### T1-GE: Graph Scan + Status

```
gemini -p "Call the MCP tools code_graph_scan and code_graph_status from the spec_kit_memory server. Report graph node count, edge count, readiness, and detector provenance summary."
```

### T2-GE: Basic Query

```
gemini -p "Use the code_graph_query MCP tool to find all callers of the function validateMemoryQualityContent. Show file paths and line numbers."
```

### T3-GE: Detector Provenance

```
gemini -p "Run code_graph_scan then code_graph_status. Report the detector provenance summary: dominant type, per-type counts, and whether DetectorProvenance is correctly serialized."
```

### T4-GE: Blast-Radius Depth Cap

```
gemini -p "Use code_graph_query to get dependencies of shared-payload.ts at maxDepth=2, then maxDepth=1. Compare result counts to verify the depth cap works correctly."
```

### T5-GE: Multi-File Union

```
gemini -p "Query code_graph_query for callers of both shared-payload.ts and memory-metadata.ts using union mode. Verify merged results without duplicates."
```

### T6-GE: Hot-File Breadcrumbs

```
gemini -p "Query the code graph for shared-payload.ts. Check if the response includes a hotFileBreadcrumb advisory for this high-degree file."
```

### T7-GE: Edge Evidence

```
gemini -p "Query code_graph_query for edges of code-graph-db.ts. Check for edgeEvidenceClass and numericConfidence metadata on edges."
```

---

## Verification Checklist

After running all prompts, fill in this matrix:

| Test | Feature | Claude Code | Codex CLI | Copilot CLI | Gemini CLI |
|------|---------|-------------|-----------|-------------|------------|
| T1 | Scan + Status | [ ] | [ ] | [ ] | [ ] |
| T2 | Basic Query | [ ] | [ ] | [ ] | [ ] |
| T3 | Detector Provenance | [ ] | [ ] | [ ] | [ ] |
| T4 | Depth Cap | [ ] | [ ] | [ ] | [ ] |
| T5 | Union Mode | [ ] | [ ] | [ ] | [ ] |
| T6 | Hot-File Breadcrumbs | [ ] | [ ] | [ ] | [ ] |
| T7 | Edge Evidence | [ ] | [ ] | [ ] | [ ] |
| T8 | Routing Hint | [ ] | N/A | N/A | N/A |
| T9 | Regression Floor | vitest | vitest | vitest | vitest |

### Pass criteria per test:

- **T1**: Node count > 0, edge count > 0, status shows "ready", provenance summary present
- **T2**: At least 1 caller returned with valid file path
- **T3**: Dominant detector identified, counts > 0 for at least one type
- **T4**: maxDepth=1 returns strictly fewer nodes than maxDepth=2
- **T5**: Union result count <= sum of individual counts (dedup proof)
- **T6**: hotFileBreadcrumb present with advisory/low-authority wording
- **T7**: edgeEvidenceClass and numericConfidence fields present with non-null values
- **T8**: Bootstrap response includes "prefer code_graph_query" advisory
- **T9**: `npx vitest run tests/graph-payload-validator.vitest.ts` passes

### Running T9 (regression floor) across CLIs:

```bash
# Direct (any CLI can run this)
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-payload-validator.vitest.ts

# Via Codex
codex exec -m gpt-5.4 -c service_tier="fast" "cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-payload-validator.vitest.ts && report pass/fail count"

# Via Copilot
copilot -p "Run the graph payload validator tests: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-payload-validator.vitest.ts — report results"

# Via Gemini
gemini -p "Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-payload-validator.vitest.ts — report pass/fail"
```

---

## Quick-Run Script (all T1-T7 via Codex in parallel)

```bash
for t in 1 2 3 4 5 6 7; do
  codex exec --dangerously-bypass-approvals-and-sandbox -m gpt-5.4 \
    -c model_reasoning_effort=high -c service_tier="fast" \
    "$(sed -n "/^### T${t}-CX/,/^### T/p" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/scratch/test-prompts-all-clis.md | head -n -1 | tail -n +3 | tr -d '`')" \
    > /tmp/014-test-T${t}-codex.log 2>&1 &
done
wait
for t in 1 2 3 4 5 6 7; do
  echo "=== T${t} ===" && tail -5 /tmp/014-test-T${t}-codex.log
done
```
