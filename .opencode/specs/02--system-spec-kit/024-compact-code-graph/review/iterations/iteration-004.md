# Iteration 004: D3 Traceability

## Findings

No P0 issues found.

### [P1] The checked "3-source hook merge" claims are not backed by the reviewed hook implementation
- **File**: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`; `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts`; `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- **Issue**: The spec and checklist describe the compaction hook as a real 3-source merge that reuses shared retrieval primitives and surfaces Memory, Code Graph, and CocoIndex context on the hook path. The reviewed implementation does not do that. `compact-inject.ts` derives its `codeGraph` section from transcript file paths, emits a static CocoIndex follow-up hint instead of semantic neighbors, and hardcodes both `constitutional` and `triggered` inputs to empty strings before calling `mergeCompactBrief()`. At the same time, the code-graph tools are only registered at the MCP dispatch layer; this hook never consumes those tools or an equivalent shared retrieval import. That leaves multiple checked checklist claims without code backing in the reviewed files, including constitutional memories on the hook path, CocoIndex semantic context in the compaction payload, and the stated "same tools other runtimes call explicitly" design. [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:54-66] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:81-95] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:36-44] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:56-62] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:31-51] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:109-147] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:141-189] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:18-26] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:36-54] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/index.ts:16-34]
- **Evidence**: `buildMergedContext()` constructs `codeGraph` from transcript-derived "Active files", sets `cocoIndex` to a single instructional sentence, and passes `constitutional: ''` plus `triggered: ''` into `mergeCompactBrief()`. The reviewed tool-registration files prove the code-graph tools exist in the MCP server, but there is no corresponding consumption path from `compact-inject.ts`.
- **Fix**: Either wire the hook to the shared retrieval modules the spec promises, or downgrade the checked checklist/spec language so it accurately describes the current behavior as heuristic transcript summarization plus tool suggestions rather than a real multi-source retrieval merge.

```json
{
  "type": "claim-adjudication",
  "claim": "The reviewed compaction hook already performs the documented Memory + Code Graph + CocoIndex merge using the same retrieval primitives described in the spec and checklist.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:54-66",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:81-95",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:36-44",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:56-62",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:31-51",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:109-147",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:141-189",
    ".opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:18-26",
    ".opencode/skill/system-spec-kit/mcp_server/tools/index.ts:16-34"
  ],
  "counterevidenceSought": "Looked for any call or import in the reviewed hook path that would retrieve real Memory, Code Graph, or CocoIndex payloads, and found only transcript heuristics plus MCP tool registration.",
  "alternativeExplanation": "The current hook may be an intentional transitional stub while the surrounding docs/checklist were written for the target end state rather than the shipped implementation.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if there is an approved traceability note stating that the checklist documents design completion rather than code-complete behavior for the reviewed files."
}
```

### [P2] Spec and decision references still point to obsolete hook locations and module paths
- **File**: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/review/deep-research-config.json`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- **Issue**: The traceability trail in the docs is stale in ways that make review evidence harder to follow. The spec's hook layout section still says the source files live under `.opencode/skill/system-spec-kit/scripts/hooks/claude/` and compile to `scripts/dist/hooks/claude/*.js`, while the actual implementation under review lives in `mcp_server/hooks/claude/`. DR-003 also says the hook should import from `dist/hooks/memory-surface.js`, but the reviewed source imports `../../lib/code-graph/compact-merger.js` instead. Even when the implementation may be acceptable, these stale references break cross-reference integrity and make the checklist impossible to audit directly from the documented paths. [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:98-109] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:42-51] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/review/deep-research-config.json:20-30] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17-18]
- **Evidence**: The review config lists `mcp_server/hooks/claude/compact-inject.ts` and related `mcp_server` files as the implementation set, but the spec and decision record still instruct reviewers to look in `scripts/hooks/claude/` or at `dist/hooks/memory-surface.js`.
- **Fix**: Update the spec/checklist/decision references to the real `mcp_server/hooks/claude/*` source locations and the actual integration modules, or move the implementation to the documented paths if those locations are intended to remain canonical.

```json
{
  "type": "claim-adjudication",
  "claim": "The spec and decision record still provide a correct, directly followable path from documentation to the reviewed hook implementation.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:98-109",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:42-51",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/review/deep-research-config.json:20-30",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17-18"
  ],
  "counterevidenceSought": "Looked for matching source files under the documented scripts/hooks path and for a compact-inject import of dist/hooks/memory-surface.js in the reviewed implementation path.",
  "alternativeExplanation": "The documentation may have preserved an older layout after the hook code was relocated into mcp_server without a corresponding doc sweep.",
  "finalSeverity": "P2",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if the project explicitly treats the documented scripts/hooks paths as historical design artifacts rather than current reviewer entry points."
}
```

## Summary

- P0: 0 findings
- P1: 1 finding
- P2: 1 finding
