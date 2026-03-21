OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d0a3f-0655-7901-8a09-5d56c4e5de1a
--------
user
# Role: Test Analyst (A2) — Iteration 007

## Mission
Investigate the handback protocol across CLIs.

## Research Question
**Q15.** Memory Handback protocol — where does handback JSON fail minimum payload guidance?

## Files to Examine
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` — How file/stdin data is loaded
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` — validateInputData, normalizeInputData
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/` — All files
- Search for "handback", "outsourced", "delegated" in scripts/

## Deliverable
1. Document the minimum handback JSON payload schema (from validateInputData)
2. For each CLI, how does handback data flow through the pipeline?
3. What validation gaps allow malformed handback payloads through?
4. Propose minimum tests needed per CLI
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: cocoindex_code starting
mcp: code_mode starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’ll investigate this as a read-only analysis pass: first I’ll trace `validateInputData`/`normalizeInputData`, then map how each CLI feeds handback JSON through loaders into validation, and finally summarize gaps plus a minimal per-CLI test matrix. I’m starting by locating the exact files and relevant call sites.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback | sed 's#"'^#/#'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-31__completed-phase-015-by-aligning-the-outsourced.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/11-03-26_15-37__analyzed-loadcollecteddata-in-data-loader-ts.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-22__next-steps.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/14-03-26_15-20__live-outsourced-cli-dispatch-verification.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/metadata.json
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md
/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md
/.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh
/.opencode/skill/system-spec-kit/scripts/loaders/index.ts
/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
/.opencode/skill/system-spec-kit/scripts/loaders/README.md
/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
/.opencode/skill/system-spec-kit/scripts/extractors/index.ts
exec
/bin/zsh -lc 'rg -n "handback|outsourced|delegated|validateInputData|normalizeInputData|data-loader|stdin|payload" .opencode/skill/system-spec-kit/scripts .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:2:  "specFolder": "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:7:    "outsourced",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:9:    "handback",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:14:  "folderSlug": "outsourced-agent-handback",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:22:    "11-03-26_15-37__analyzed-loadcollecteddata-in-data-loader-ts.md",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:23:    "14-03-26_15-20__live-outsourced-cli-dispatch-verification.md",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:25:    "16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:26:    "16-03-26_22-31__completed-phase-015-by-aligning-the-outsourced.md",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:27:    "17-03-26_19-49__outsourced-agent-handback-architecture.md"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:3:description: "Align runtime memory-input handling, CLI handback docs, and spec evidence so explicit JSON-mode failures, next-step persistence, and verification status are all documented consistently."
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:4:trigger_phrases: ["outsourced agent memory", "memory handback plan", "cli agent protocol"]
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:30:This work now lands in four layers: runtime safeguards for explicit JSON-mode input handling, CLI handback documentation updates across all 8 relevant `cli-*` docs, a dedicated doc-regression test plus feature-catalog alignment, and spec-folder reconciliation so the written evidence matches the current repository state. The plan uses fresh 2026-03-17 verification instead of inherited 013-era claims.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:46:- [x] All 8 relevant `cli-*` docs reflect redact-and-scrub, snake_case acceptance, rejection-code guidance, and minimum-payload guidance
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:47:- [x] Feature-catalog and regression-test coverage protect the handback contract from drifting
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:61:- **`data-loader.ts`**: Loads explicit JSON-mode input and now throws `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` for missing, invalid, or invalid-shape input instead of falling back.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:62:- **`input-normalizer.ts`**: Accepts `nextSteps` or `next_steps`, persists `Next: ...` / `Follow-up: ...`, and preserves mixed structured payload next steps when those facts are missing.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:65:- **`outsourced-agent-handback-docs.vitest.ts`**: Keeps the 8 CLI handback docs and the feature catalog aligned on post-010 save-gate guidance.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:66:- **4 `cli-*` skills + 4 prompt templates**: Tell the caller to extract handback data, redact and scrub it, include richer `FILES` metadata, and stop on explicit JSON-mode failures.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:67:- **Feature catalog entry `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`**: Tracks the handback protocol as a current phase `015` concern rather than a stale `013` snapshot.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md:76:  -> valid input normalizes nextSteps or next_steps (including mixed structured payloads)
codex
I found the key hotspots and test files; next I’m reading the loader/normalizer plus the handback spec docs to extract the actual enforced schema and where each CLI’s protocol can drift from it. I’ll also trace `generate-context` call paths so we can pinpoint exact validation gaps.
tool cocoindex_code.search({"query":"validateInputData normalizeInputData handback payload nextSteps next_steps loadCollectedData generate-context","paths":[".opencode/skill/system-spec-kit/scripts/*"],"limit":10})
cocoindex_code.search({"query":"validateInputData normalizeInputData handback payload nextSteps next_steps loadCollectedData generate-context","paths":[".opencode/skill/system-spec-kit/scripts/*"],"limit":10}) success in 6.81s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"validateInputData normalizeInputData handback payload nextSteps next_steps loadCollectedData generate-context","limit":10})
cocoindex_code.search({"query":"validateInputData normalizeInputData handback payload nextSteps next_steps loadCollectedData generate-context","limit":10}) success in 200ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-QA2-C03-input-normalizer.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### P1 Required: 2 — manual-format field normalization and top-level shape validation still have correctness gaps\\n- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:233-235,298-300` `validateInputData()` explicitly accepts `SPEC_FOLDER`, but `normalizeInputData()` only copies `data.specFolder`. A manual payload that uses the accepted uppercase field normalizes into output with no `SPEC_FOLDER`, so a valid input shape silently loses its target spec-folder metadata.\\n- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:223-225,298-300,336-340` the pass-through gate treats any truthy `userPrompts`/`recentContext` as already normalized, but validation never checks those fields are arrays. Inputs like `{ \\\"userPrompts\\\": \\\"oops\\\" }` or `{ \\\"recentContext\\\": {} }` bypass normalization and ship invalid scalar/object shapes downstream.\",\n      \"start_line\": 6,\n      \"end_line\": 8,\n      \"score\": 0.5297653140891025\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C04.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### FINDING-06: Validation gap allows malformed “already-normalized” payloads\\n- **File:** [input-normalizer.ts#L291](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L291)\\n- **Severity:** MEDIUM\\n- **Category:** BUG\\n- **Current Behavior:** `validateInputData` checks `observations` type but does not validate `userPrompts` or `recentContext` array types, while loader may skip normalization.\\n- **Expected Behavior:** All normalized-shape fields should be type-validated.\\n- **Root Cause:** Incomplete validation rules combined with heuristic format detection.\\n- **Suggested Fix:** Add strict type checks for `userPrompts` and `recentContext` (and item shape checks).\\n- **Effort:** SMALL (<30 min)\",\n      \"start_line\": 408,\n      \"end_line\": 416,\n      \"score\": 0.5044954246015134\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C04.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### FINDING-06: Validation gap allows malformed “already-normalized” payloads\\n- **File:** [input-normalizer.ts#L291](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L291)\\n- **Severity:** MEDIUM\\n- **Category:** BUG\\n- **Current Behavior:** `validateInputData` checks `observations` type but does not validate `userPrompts` or `recentContext` array types, while loader may skip normalization.\\n- **Expected Behavior:** All normalized-shape fields should be type-validated.\\n- **Root Cause:** Incomplete validation rules combined with heuristic format detection.\\n- **Suggested Fix:** Add strict type checks for `userPrompts` and `recentContext` (and item shape checks).\\n- **Effort:** SMALL (<30 min)\",\n      \"start_line\": 322,\n      \"end_line\": 330,\n      \"score\": 0.5044954246015134\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-11-cross-cli.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- `015-outsourced-agent-handback/checklist.md:40` — hits: `.opencode/` x2 — - [x] CHK-011 [P0] Explicit invalid JSON and invalid-shape payloads do not fall back to OpenCode capture [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]\\n- `015-outsourced-agent-handback/checklist.md:41` — hits: `.opencode/` — - [x] CHK-012 [P0] `nextSteps` and `next_steps` are both accepted [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`]\",\n      \"start_line\": 251,\n      \"end_line\": 252,\n      \"score\": 0.5030116251872538\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-QA8-O13-dataflow.md\",\n      \"language\": \"markdown\",\n      \"content\": \"```\\nCLI args (dataFile, specFolderArg)\\n    │\\n    ▼\\ndata-loader.ts ─── loadCollectedData()\\n    │  Priority 1: File → JSON parse → validateInputData → normalizeInputData\\n    │  Priority 2: OpenCode capture → transformOpencodeCapture()\\n    │  Priority 3: Simulation fallback { _isSimulation: true }\\n    │\",\n      \"start_line\": 12,\n      \"end_line\": 20,\n      \"score\": 0.4983198857589457\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/search/validation-metadata.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/**\\n * Enrich a batch of pipeline rows with validation metadata.\\n *\\n * For each row, `extractValidationMetadata` is called. When a non-null\\n * result is returned, it is attached to the row under the `validationMetadata`\\n * key. Rows with no signals pass through unchanged.\\n *\\n * Score fields are NEVER modified. This function is metadata-only.\\n *\\n * @param results - Array of PipelineRow values from the scoring pipeline.\\n * @returns New array with `validationMetadata` added where signals exist.\\n */\",\n      \"start_line\": 249,\n      \"end_line\": 260,\n      \"score\": 0.497142655067357\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- [x] CHK-012 [P0] `nextSteps` and `next_steps` are both accepted [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`]\\n- [x] CHK-013 [P1] First next step persists as `Next: ...`, remaining steps persist as `Follow-up: ...`, `NEXT_ACTION` reads the first step, and mixed structured payloads preserve missing next-step facts without duplicate `Next:` / `Follow-up:` observations [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]\\n<!-- /ANCHOR:code-quality -->\\n\\n---\\n\\n<!-- ANCHOR:testing -->\",\n      \"start_line\": 44,\n      \"end_line\": 50,\n      \"score\": 0.49655633341964744\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X09.md\",\n      \"language\": \"markdown\",\n      \"content\": \".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:508:      metadata.sessionBoostApplied = sbMeta.applied;\\n.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:711:        sessionBoostApplied: metadata.sessionBoostApplied,\\n succeeded in 51ms:\\n110:function applyValidationSignalScoring(results: PipelineRow[]): PipelineRow[] {\\n114:    const metadata = row.validationMetadata as ValidationMetadataLike | undefined;\\n122:    const qualityFactor = 0.9 + (quality * 0.2); // [0.9, 1.1]\\n123:    const specLevelBonus = typeof metadata.specLevel === 'number' && Number.isFinite(metadata.specLevel)\\n127:    const completionBonus = metadata.completionStatus === 'complete'\\n133:    const checklistBonus = metadata.hasChecklist ? 0.01 : 0;\\n134:    const multiplier = clampMultiplier(qualityFactor + specLevelBonus + completionBonus + checklistBonus);\\n685:  // importance_tier, completion markers) and attach as `validationMetadata` key,\",\n      \"start_line\": 428,\n      \"end_line\": 438,\n      \"score\": 0.4893558967111673\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/scratch/legacy-memory-quarantine/24-12-25_14-51__modular-architecture.md\",\n      \"language\": \"markdown\",\n      \"content\": \"> **User** | 2025-12-24 @ 13:31:05\\n\\nExecuting sequentially no parallel agents\\n\\n---\\n\\n> **User** | 2025-12-24 @ 13:46:00\\n\\nContinuing conversation\\n\\n---\\n\\n> **Assistant** | 2025-12-24 @ 13:46:00\\n\\nContinuing conversation → I need to add validation to Step 11 (Completion).\\n\\n---\\n\\n> **User** | 2025-12-24 @ 13:51:57\\n\\n[user message]\\n\\n---\\n\\n> **Assistant** | 2025-12-24 @ 13:51:57\\n\\n[user message] → # Session Summary: Path-Scoped Validation Rules Implementation\",\n      \"start_line\": 1118,\n      \"end_line\": 1144,\n      \"score\": 0.4881925646120351\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tests/context-server.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"  // =================================================================\\n  // GROUP 8: Input Validation (validateInputLengths)\\n  // =================================================================\\n  describe('Group 8: Input Validation', () => {\\n    // T32: Source calls validateInputLengths before dispatch\\n    it('T32: validateInputLengths called before dispatchTool', () => {\\n      const validationOrder = /validateInputLengths\\\\(args\\\\)[\\\\s\\\\S]*?dispatchTool\\\\(name/\\n      expect(validationOrder.test(sourceCode)).toBe(true)\\n    })\\n\\n    it('T32a: Schema validation delegated to tool modules', () => {\\n      // Context-server validates only length pre-dispatch; schema checks occur in tool dispatch modules.\\n      expect(sourceCode).toMatch(/dispatchTool\\\\(name,\\\\s*args\\\\)/)\\n      expect(sourceCode).not.toMatch(/validateToolArgs\\\\(/)\\n    })\\n\\n    // T33: validateInputLengths direct tests\",\n      \"start_line\": 1446,\n      \"end_line\": 1462,\n      \"score\": 0.4837306142581994\n    }\n  ],\n  \"total_returned\": 10,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-QA2-C03-input-normalizer.md",
        "language": "markdown",
        "content": "### P1 Required: 2 — manual-format field normalization and top-level shape validation still have correctness gaps\n- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:233-235,298-300` `validateInputData()` explicitly accepts `SPEC_FOLDER`, but `normalizeInputData()` only copies `data.specFolder`. A manual payload that uses the accepted uppercase field normalizes into output with no `SPEC_FOLDER`, so a valid input shape silently loses its target spec-folder metadata.\n- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:223-225,298-300,336-340` the pass-through gate treats any truthy `userPrompts`/`recentContext` as already normalized, but validation never checks those fields are arrays. Inputs like `{ \"userPrompts\": \"oops\" }` or `{ \"recentContext\": {} }` bypass normalization and ship invalid scalar/object shapes downstream.",
        "start_line": 6,
        "end_line": 8,
        "score": 0.5297653140891025
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C04.md",
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Data Loader
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. DATA LOADER
     7	// ───────────────────────────────────────────────────────────────
     8	// Loads session data from file, native CLI capture, or hard-fail
     9	
    10	// ───────────────────────────────────────────────────────────────
    11	// 2. IMPORTS
    12	// ───────────────────────────────────────────────────────────────
    13	import fs from 'node:fs/promises';
    14	import path from 'node:path';
    15	import os from 'node:os';
    16	
    17	import { CONFIG } from '../core';
    18	import { structuredLog, sanitizePath } from '../utils';
    19	
    20	import {
 succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Input Normalizer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. INPUT NORMALIZER
     7	// ───────────────────────────────────────────────────────────────
     8	// Validates, normalizes, and transforms raw input data into structured session format
     9	import { structuredLog } from './logger';
    10	import {
    11	  buildSpecAffinityTargets,
    12	  evaluateSpecAffinityText,
    13	  matchesSpecAffinityFilePath,
    14	  matchesSpecAffinityText,
    15	  normalizeText,
    16	} from './spec-affinity';
    17	
    18	// ───────────────────────────────────────────────────────────────
    19	// 2. TYPES
    20	// ───────────────────────────────────────────────────────────────
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '340,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | sed -n '260,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	
   261	  const normalized = rawValue.trim().toLowerCase();
   262	  if (normalized.length === 0) {
   263	    return null;
   264	  }
   265	
   266	  const resolved = NATIVE_CAPTURE_ENV_ALIASES[normalized] || null;
   267	  if (!resolved) {
   268	    console.warn(
   269	      `   Warning: SYSTEM_SPEC_KIT_CAPTURE_SOURCE="${rawValue}" is not a recognized capture source. ` +
   270	      `Valid values: ${Object.keys(NATIVE_CAPTURE_ENV_ALIASES).join(', ')}. Ignoring override.`
   271	    );
   272	  }
   273	  return resolved;
   274	}
   275	
   276	function hasTruthyEnvKey(env: NodeJS.ProcessEnv, keys: readonly string[]): boolean {
   277	  return keys.some((key) => {
   278	    const value = env[key];
   279	    return typeof value === 'string' && value.trim().length > 0;
 succeeded in 0ms:
   340	// ───────────────────────────────────────────────────────────────
   341	// 5. INPUT NORMALIZATION
   342	// ───────────────────────────────────────────────────────────────
   343	function cloneInputData<T>(data: T): T {
   344	  if (typeof structuredClone === 'function') {
   345	    return structuredClone(data);
   346	  }
   347	
   348	  return JSON.parse(JSON.stringify(data)) as T;
   349	}
   350	
   351	function normalizeFileEntryLike(file: Record<string, unknown>): FileEntry {
   352	  const action = typeof file.ACTION === 'string'
   353	    ? file.ACTION
   354	    : (typeof file.action === 'string' ? file.action : undefined);
   355	  const provenance = file._provenance === 'git' || file._provenance === 'spec-folder' || file._provenance === 'tool'
   356	    ? file._provenance
   357	    : undefined;
   358	  const modificationMagnitude = (
   359	    file.MODIFICATION_MAGNITUDE === 'trivial'
exec
/bin/zsh -lc "rg -n \"function (transformOpencodeCapture|normalizeInputData|validateInputData)|export \\{|_source|SPEC_FOLDER|NEXT_ACTION|Next:\" .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
75:  SPEC_FOLDER?: string;
111:  SPEC_FOLDER?: string;
160:  _source: DataSource;
164:  _sourceTranscriptPath?: string;
165:  _sourceSessionId?: string;
166:  _sourceSessionCreated?: number;
167:  _sourceSessionUpdated?: number;
318:      `Next: ${firstStep}`,
335:      return /^Next:\s+/i.test(fact) || /^Follow-up:\s+/i.test(fact);
386:function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
425:    if (data.specFolder || data.spec_folder || data.SPEC_FOLDER) {
426:      cloned.SPEC_FOLDER = (data.specFolder || data.spec_folder || data.SPEC_FOLDER) as string;
442:  if (data.specFolder || data.spec_folder || data.SPEC_FOLDER) {
443:    normalized.SPEC_FOLDER = (data.specFolder || data.spec_folder || data.SPEC_FOLDER) as string;
551:function validateInputData(data: RawInputData, specFolderArg: string | null = null): void {
558:  if (specFolderArg === null && !data.specFolder && !data.spec_folder && !data.SPEC_FOLDER) {
806:function transformOpencodeCapture(
813:    return { userPrompts: [], observations: [], recentContext: [], FILES: [], _source: source };
1120:    _source: source,
1124:    _sourceTranscriptPath: typeof metadata?.file_summary === 'object' && metadata?.file_summary !== null
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '760,1165p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   760	function extractSpecIds(value: string): string[] {
   761	  return Array.from(new Set((value.match(SPEC_ID_REGEX) || []).map((specId) => specId.toLowerCase())));
   762	}
   763	
   764	function getCurrentSpecId(specFolderHint?: string | null): string | null {
   765	  if (!specFolderHint) {
   766	    return null;
   767	  }
   768	
   769	  const specIds = extractSpecIds(specFolderHint);
   770	  return specIds.at(-1) || null;
   771	}
   772	
   773	function isSafeSpecFallback(
   774	  currentSpecId: string | null,
   775	  specFolderHint: string | null | undefined,
   776	  ...parts: Array<string | undefined>
   777	): boolean {
   778	  const text = parts.filter(Boolean).join(' ');
   779	  const discoveredIds = extractSpecIds(text);
codex
I’ve extracted the exact validation/normalization logic. I’m now tracing `generate-context` argument modes (`--stdin`, `--json`, file path) and the post-normalization gates (`INSUFFICIENT_CONTEXT_ABORT`, contamination, quality) so we can locate where “minimum payload” guidance diverges from runtime behavior per CLI.
exec
/bin/zsh -lc 'rg -n "--stdin|--json|dataFile|loadCollectedData|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|QUALITY_GATE_FAIL|specFolderArg|argv|parse" .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 0ms:
rg: unrecognized flag --stdin|--json|dataFile|loadCollectedData|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|QUALITY_GATE_FAIL|specFolderArg|argv|parse
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Generate Context
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. GENERATE CONTEXT
     7	// ───────────────────────────────────────────────────────────────
     8	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
     9	
    10	// Node stdlib
    11	import * as path from 'path';
    12	import * as fsSync from 'fs';
    13	
    14	// Internal modules
    15	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    16	import {
    17	  CONFIG,
    18	  findActiveSpecsDir,
    19	  getSpecsDirectories,
    20	  SPEC_FOLDER_PATTERN,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '260,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	      const parentSegment = absoluteSegments.at(-2);
   261	
   262	      if (
   263	        (lastSegment && SPEC_FOLDER_PATTERN.test(lastSegment)) ||
   264	        (parentSegment && lastSegment && SPEC_FOLDER_PATTERN.test(parentSegment) && SPEC_FOLDER_PATTERN.test(lastSegment))
   265	      ) {
   266	        resolvedNestedPath = rawArg;
   267	      }
   268	    }
   269	
   270	    let cleaned = rawArg;
   271	    if (cleaned.startsWith('.opencode/specs/')) {
   272	      cleaned = cleaned.slice('.opencode/specs/'.length);
   273	    } else if (cleaned.startsWith('specs/')) {
   274	      cleaned = cleaned.slice('specs/'.length);
   275	    }
   276	    cleaned = cleaned.replace(/\/+$/, '');
   277	
   278	    if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
   279	      resolvedNestedPath = explicitProjectScopedPath;
exec
/bin/zsh -lc "rg -n -- '--stdin|--json|parseCliArguments|parse|readStdin|collectedData|loadCollectedData|runWorkflow|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|QUALITY_GATE_FAIL' .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
8:// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
25:import { runWorkflow } from '../core/workflow';
26:import { loadCollectedData } from '../loaders';
34:  collectedData: StructuredCollectedData | null;
62:  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
63:  --json <string>   Read structured JSON from an inline string (preferred over stateless capture when structured data is available)
72:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
73:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
92:  - Use --stdin or --json whenever the calling CLI can provide curated structured session data.
336:function parseStructuredJson(rawJson: string, sourceLabel: '--stdin' | '--json'): Record<string, unknown> {
341:  let parsed: unknown;
343:    parsed = JSON.parse(rawJson);
349:  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
353:  return parsed as Record<string, unknown>;
356:async function parseStructuredModeArguments(
357:  mode: '--stdin' | '--json',
361:  const rawJson = mode === '--stdin'
365:  if (mode === '--json' && rawJson === undefined) {
366:    throw new Error('--json requires an inline JSON string argument');
369:  const payload = parseStructuredJson(rawJson ?? '', mode);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Workflow
     3	// ───────────────────────────────────────────────────────────────
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. WORKFLOW
     7	// ───────────────────────────────────────────────────────────────
     8	// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
     9	// Node stdlib
    10	import * as path from 'node:path';
    11	import * as fsSync from 'node:fs';
    12	import * as crypto from 'node:crypto';
    13	
    14	// Internal modules
    15	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
    16	import {
    17	  extractConversations,
    18	  extractDecisions,
    19	  extractDiagrams,
    20	  extractPhasesFromData,
exec
/bin/zsh -lc 'rg -n "runWorkflow|collectedData|validateInputData|normalizeInputData|loadDataFn|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|QUALITY_GATE_ABORT|QUALITY_GATE_FAIL|MIN_|sufficiency|contamination" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/index.ts .opencode/skill/system-spec-kit/scripts/core/*.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:16:const MIN_SUBSTANCE_CHARS = 200;
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:72:  if (stripped.length < MIN_SUBSTANCE_CHARS) {
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:75:      `${stripped.length} chars substance (minimum ${MIN_SUBSTANCE_CHARS})`
.opencode/skill/system-spec-kit/scripts/core/index.ts:10:// Import directly: import { runWorkflow } from './core/workflow';
.opencode/skill/system-spec-kit/scripts/core/config.ts:60:  MIN_PROMPT_LENGTH: number;
.opencode/skill/system-spec-kit/scripts/core/config.ts:299:  MIN_PROMPT_LENGTH: userConfig.minPromptLength,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:21:import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:23:import type { ContaminationSeverity } from '../extractors/contamination-filter';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:46:  | 'has_contamination'
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:73:export interface QualityInsufficiencySummary {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:90:  insufficiency: QualityInsufficiencySummary | null;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:170:  sufficiencyResult?: MemorySufficiencyResult,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:172:  contaminationSeverity: ContaminationSeverity | null = null,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:297:  const effectiveSeverity: ContaminationSeverity = contaminationSeverity || 'medium';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:300:    qualityFlags.add('has_contamination');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:304:      warnings.push('Low-severity contamination detected (preamble only) — minor penalty applied');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:308:      warnings.push('Medium-severity contamination detected (orchestration chatter) — capped at 0.85');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:312:      warnings.push('High-severity contamination detected (AI self-reference/tool leaks) — capped at 0.60');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:316:  if (sufficiencyResult && !sufficiencyResult.pass) {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:318:    scoreCap = Math.min(scoreCap ?? 1, clamp01(sufficiencyResult.score * 0.4));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1340,1495p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2088,2260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2088	  log(`   Template populated (quality: ${filterStats.qualityScore}/100)\n`);
  2089	
  2090	  // Step 8.5: Content cleaning — strip leaked HTML tags from rendered content
  2091	  // Preserves HTML inside fenced code blocks (```...```) which is legitimate code.
  2092	  log('Step 8.5: Content cleaning...');
  2093	  const rawContent = files[ctxFilename];
  2094	  const cleanedContent = stripWorkflowHtmlOutsideCodeFences(rawContent);
  2095	  // Only update if cleaning made changes
  2096	  if (cleanedContent !== rawContent) {
  2097	    files[ctxFilename] = cleanedContent;
  2098	    log('   Stripped leaked HTML tags from content (code blocks preserved)');
  2099	  } else {
  2100	    log('   No HTML cleaning needed');
  2101	  }
  2102	
  2103	  // Step 8.6: Quality validation + scoring
  2104	  log('Step 8.6: Quality scoring...');
  2105	  const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
  2106	  contaminationAuditTrail.push(qualityValidation.contaminationAudit);
  2107	  const metadataJson = JSON.parse(files['metadata.json']) as Record<string, unknown>;
 succeeded in 0ms:
  1340	    }
  1341	
  1342	    const narrativeObservations = (enriched.observations || []).filter(
  1343	      (observation) => observation?._synthetic !== true
  1344	    );
  1345	    // Synthetic observations provide file coverage but do not influence session narrative
  1346	    enriched._narrativeObservations = narrativeObservations;
  1347	
  1348	  } catch (err: unknown) {
  1349	    // Enrichment failure is non-fatal — proceed with whatever data we have
  1350	    console.warn(`   Warning: Stateless enrichment failed: ${err instanceof Error ? err.message : String(err)}`);
  1351	  }
  1352	
  1353	  return enriched;
  1354	}
  1355	
  1356	// ───────────────────────────────────────────────────────────────
  1357	// 2. MAIN WORKFLOW
  1358	// ───────────────────────────────────────────────────────────────
  1359	
exec
/bin/zsh -lc 'rg -n "function formatSufficiencyAbort|MEMORY_SUFFICIENCY_REJECTION_CODE|evaluateMemorySufficiency|buildWorkflowMemoryEvidenceSnapshot|minimum payload|INSUFFICIENT_CONTEXT_ABORT" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/**/*.ts .opencode/skill/system-spec-kit/scripts/**/*.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:65:  evaluateMemorySufficiency,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:66:  MEMORY_SUFFICIENCY_REJECTION_CODE,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1067:function buildWorkflowMemoryEvidenceSnapshot(params: {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1142:function formatSufficiencyAbort(result: MemorySufficiencyResult): string {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1143:  return `${MEMORY_SUFFICIENCY_REJECTION_CODE}: Not enough context for a proper memory. `
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2114:  const sufficiencySnapshot = buildWorkflowMemoryEvidenceSnapshot({
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2126:  const sufficiencyResult = evaluateMemorySufficiency(sufficiencySnapshot);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:65:  evaluateMemorySufficiency,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:66:  MEMORY_SUFFICIENCY_REJECTION_CODE,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1067:function buildWorkflowMemoryEvidenceSnapshot(params: {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1142:function formatSufficiencyAbort(result: MemorySufficiencyResult): string {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1143:  return `${MEMORY_SUFFICIENCY_REJECTION_CODE}: Not enough context for a proper memory. `
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2114:  const sufficiencySnapshot = buildWorkflowMemoryEvidenceSnapshot({
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2126:  const sufficiencyResult = evaluateMemorySufficiency(sufficiencySnapshot);
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:3:import { evaluateMemorySufficiency } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:5:describe('evaluateMemorySufficiency', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:7:    const result = evaluateMemorySufficiency({
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:50:    const result = evaluateMemorySufficiency({
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:70:    expect(result.rejectionCode).toBe('INSUFFICIENT_CONTEXT_ABORT');
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:74:    const result = evaluateMemorySufficiency({
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1040,1170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1040	
  1041	  return '';
  1042	}
  1043	
  1044	type WorkflowObservationEvidence = {
  1045	  TITLE?: string;
  1046	  title?: string;
  1047	  NARRATIVE?: string;
  1048	  narrative?: string;
  1049	  FACTS?: unknown[];
  1050	  facts?: unknown[];
  1051	  _synthetic?: boolean;
  1052	  _provenance?: string;
  1053	  _specRelevant?: boolean;
  1054	};
  1055	
  1056	type WorkflowDecisionEvidence = {
  1057	  TITLE?: string;
  1058	  CHOSEN?: string;
  1059	  RATIONALE?: string;
exec
/bin/zsh -lc 'ls -la .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
total 112
drwxr-xr-x@ 10 michelkerkmeester  staff    320 Mar 19 16:45 .
drwxr-xr-x@ 36 michelkerkmeester  staff   1152 Mar 20 08:44 ..
-rw-r--r--@  1 michelkerkmeester  staff   7801 Mar 18 21:45 checklist.md
-rw-r--r--@  1 michelkerkmeester  staff    983 Mar 19 16:45 description.json
-rw-r--r--@  1 michelkerkmeester  staff   6215 Mar 18 21:45 implementation-summary.md
drwxr-xr-x@ 10 michelkerkmeester  staff    320 Mar 18 21:45 memory
-rw-r--r--@  1 michelkerkmeester  staff   9417 Mar 18 21:45 plan.md
drwxr-xr-x@  3 michelkerkmeester  staff     96 Mar 17 10:25 scratch
-rw-r--r--@  1 michelkerkmeester  staff  14309 Mar 18 21:45 spec.md
-rw-r--r--@  1 michelkerkmeester  staff   5451 Mar 18 21:45 tasks.md
exec
/bin/zsh -lc 'rg -n "minimum payload|payload|JSON|handback|nextSteps|next_steps|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|validateInputData|normalizeInputData|schema|FILES|specFolder" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:2:  "specFolder": "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:9:    "handback",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:14:  "folderSlug": "outsourced-agent-handback",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:25:    "16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md",
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json:27:    "17-03-26_19-49__outsourced-agent-handback-architecture.md"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:4:trigger_phrases: ["outsourced agent tasks", "memory handback tasks"]
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:36:- [x] T002 Hard-fail invalid JSON and invalid-shape explicit payloads without falling back to OpenCode capture (`.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`)
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:37:- [x] T003 Accept `nextSteps` and `next_steps`, then persist the first entry as `Next: ...` and later entries as `Follow-up: ...`, including mixed structured payload preservation when next-step facts are missing (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`)
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:39:- [x] T005 Add regression coverage for explicit JSON-mode failures and next-step persistence, including mixed structured payload behavior (`.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`)
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:47:- [x] T006 [P] Update all 4 `cli-*` SKILL files with redact-and-scrub, rejection-code, and minimum-payload guidance
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:48:- [x] T007 [P] Update all 4 `cli-*` prompt template files with accepted snake_case fields, richer `FILES` examples, and explicit JSON-mode hard-fail behavior
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:50:- [x] T009 Add doc-regression coverage for the 8 handback docs and the feature catalog (`.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`)
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:58:- [x] T010 Record current targeted Vitest evidence: `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/runtime-memory-inputs.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts` passed with `2` files and `32` tests
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:61:- [x] T013 Retained rich JSON-mode handback evidence: `memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md` exists at 556 lines with `generate-context.js` provenance
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:62:- [x] T014 Fresh thin JSON-mode handback verification: `generate-context.js` rejected the payload with `INSUFFICIENT_CONTEXT_ABORT` before file write
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:73:- [x] Next-step persistence wording matches the implemented normalizer and session extractor, including mixed structured payload behavior
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:74:- [x] All `cli-*` references use the real path layout and include redact-and-scrub, rejection-code, and minimum-payload guidance
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:75:- [x] The feature catalog and doc-regression test keep the caller-facing handback contract aligned
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:76:- [x] Fresh verification records one successful rich JSON-mode write and one thin-payload insufficiency rejection
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md:91:- **Regression coverage**: `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	import { fileURLToPath } from 'node:url';
     4	
     5	import { describe, expect, it } from 'vitest';
     6	
     7	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     8	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     9	
    10	function readWorkspaceFile(relativePath: string): string {
    11	  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
    12	}
    13	
    14	describe('outsourced agent handback docs', () => {
    15	  const skillDocs = [
    16	    '.opencode/skill/cli-codex/SKILL.md',
    17	    '.opencode/skill/cli-copilot/SKILL.md',
    18	    '.opencode/skill/cli-claude-code/SKILL.md',
    19	    '.opencode/skill/cli-gemini/SKILL.md',
    20	  ];
exec
/bin/zsh -lc 'rg -n "MEMORY_HANDBACK_START|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|minimum payload|nextSteps|next_steps|FILES|specFolder|save-context-data|generate-context.js|handback" .opencode/skill/cli-codex .opencode/skill/cli-copilot .opencode/skill/cli-gemini .opencode/skill/cli-claude-code' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/cli-copilot/assets/prompt_templates.md:340:Append this epilogue to any delegated prompt when the calling AI needs structured session memory back from Copilot CLI. The agent will include the delimited section in its output, enabling the calling AI to extract, parse, and save it via `generate-context.js`.
.opencode/skill/cli-copilot/assets/prompt_templates.md:349:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-copilot/assets/prompt_templates.md:365:[spec-folder-name, e.g. 015-outsourced-agent-handback]
.opencode/skill/cli-copilot/assets/prompt_templates.md:371:After receiving agent output, the calling AI extracts the handback section:
.opencode/skill/cli-copilot/assets/prompt_templates.md:374:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
.opencode/skill/cli-copilot/assets/prompt_templates.md:382:cat > /tmp/save-context-data.json << 'JSONEOF'
.opencode/skill/cli-copilot/assets/prompt_templates.md:386:  "FILES": [
.opencode/skill/cli-copilot/assets/prompt_templates.md:402:  "nextSteps": ["<extracted remaining work>"],
.opencode/skill/cli-copilot/assets/prompt_templates.md:403:  "specFolder": "<extracted or provided by calling AI>",
.opencode/skill/cli-copilot/assets/prompt_templates.md:408:# Save via generate-context.js JSON mode
.opencode/skill/cli-copilot/assets/prompt_templates.md:409:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]
.opencode/skill/cli-copilot/assets/prompt_templates.md:412:Accepted field names include camelCase and the documented snake_case equivalents such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`. Persistence behavior for next-step fields: the first item becomes `Next: ...` and sets `NEXT_ACTION`; additional items become `Follow-up: ...`.
.opencode/skill/cli-copilot/assets/prompt_templates.md:414:If `/tmp/save-context-data.json` is passed explicitly and cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture for that error.
.opencode/skill/cli-copilot/assets/prompt_templates.md:416:Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.
.opencode/skill/cli-copilot/assets/prompt_templates.md:418:Minimum viable payload: include a specific summary, at least one meaningful `recentContext` entry or equivalent observation, and `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known.
.opencode/skill/cli-codex/assets/prompt_templates.md:527:Append this epilogue to any delegated prompt when the calling AI needs structured session memory back from Codex CLI. The agent will include the delimited section in its output, enabling the calling AI to extract, parse, and save it via `generate-context.js`.
.opencode/skill/cli-codex/assets/prompt_templates.md:536:<!-- MEMORY_HANDBACK_START -->
.opencode/skill/cli-codex/assets/prompt_templates.md:552:[spec-folder-name, e.g. 015-outsourced-agent-handback]
.opencode/skill/cli-codex/assets/prompt_templates.md:558:After receiving agent output, the calling AI extracts the handback section:
.opencode/skill/cli-codex/assets/prompt_templates.md:561:const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
codex
I’ve confirmed the doc contract checks only for wording presence, not payload semantics. Next I’m reading runtime tests (`runtime-memory-inputs`, `generate-context-cli-authority`, `workflow-e2e`) to identify what is truly enforced versus what the docs imply as “minimum viable.”
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────────
     2	// MODULE: Runtime Memory Input Tests
     3	// ───────────────────────────────────────────────────────────────────
     4	// TEST: Runtime Memory Inputs
     5	// Covers explicit data-file failures and next-steps normalization
     6	import fs from 'node:fs/promises';
     7	import os from 'node:os';
     8	import path from 'node:path';
     9	import { beforeEach, describe, expect, it, vi } from 'vitest';
    10	
    11	import { normalizeQualityAbortThreshold } from '../core/config';
    12	import { collectSessionData } from '../extractors/collect-session-data';
    13	import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';
    14	
    15	const captureConversation = vi.fn(async () => null);
    16	const captureClaudeConversation = vi.fn(async () => null);
    17	const captureCodexConversation = vi.fn(async () => null);
    18	const captureCopilotConversation = vi.fn(async () => null);
    19	const captureGeminiConversation = vi.fn(async () => null);
    20	
exec
/bin/zsh -lc 'rg -n "validateInputData|normalizeInputData|INSUFFICIENT_CONTEXT_ABORT|CONTAMINATION_GATE_ABORT|nextSteps|next_steps|recentContext|FILES|specFolder|structured|stdin|--json|EXPLICIT_DATA_FILE_LOAD_FAILED|thin" .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:13:import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:79:      specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:80:      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found/);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:98:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:99:      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file/);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:114:      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:115:      nextSteps: 'not-an-array',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:123:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:124:      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file/);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:138:    await fs.writeFile(permFile, JSON.stringify({ specFolder: 'test' }), 'utf-8');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:146:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:147:      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Permission denied/);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:170:      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:172:      nextSteps: ['Update documentation.'],
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:179:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:219:        specFolderArg: '022-hybrid-rag-fusion/009-perfect-session-capturing',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:224:      expect(result.recentContext?.[0]?.request).toContain('snake_case JSON input handling');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:252:      specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:289:      specFolderArg: '022-hybrid-rag-fusion/009-perfect-session-capturing',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:328:      specFolderArg: '022-hybrid-rag-fusion/009-perfect-session-capturing',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts | sed -n '240,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   240	
   241	describe('path traversal security', () => {
   242	  beforeEach(() => {
   243	    vi.resetModules();
   244	    resetCaptureMocks();
   245	  });
   246	
   247	  it('rejects a dataFile path that attempts directory traversal', async () => {
   248	    const { loadCollectedData } = await import('../loaders/data-loader');
   249	
   250	    await expect(loadCollectedData({
   251	      dataFile: '../../etc/passwd',
   252	      specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
   253	    })).rejects.toThrow(/Security|Path outside allowed directories/);
   254	
   255	    expect(captureConversation).not.toHaveBeenCalled();
   256	    expect(captureClaudeConversation).not.toHaveBeenCalled();
   257	    expect(captureCodexConversation).not.toHaveBeenCalled();
   258	    expect(captureCopilotConversation).not.toHaveBeenCalled();
   259	    expect(captureGeminiConversation).not.toHaveBeenCalled();
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts | sed -n '560,940p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   560	
   561	    expect(transformed.observations).toEqual(expect.arrayContaining([
   562	      expect.objectContaining({
   563	        title: 'Read loaders/data-loader.ts',
   564	        facts: expect.arrayContaining(['Tool: view']),
   565	      }),
   566	    ]));
   567	
   568	    expect(transformed.FILES).toEqual([
   569	      {
   570	        FILE_PATH: '/tmp/spec-kit-project/scripts/utils/input-normalizer.ts',
   571	        DESCRIPTION: 'Apply parity hardening to the input normalizer.',
   572	        _provenance: 'tool',
   573	      },
   574	    ]);
   575	  });
   576	
   577	  it('preserves FILES metadata in structured payloads when present', () => {
   578	    const normalized = normalizeInputData({
   579	      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// TEST: Generate Context CLI Authority
     2	// Ensures main() preserves explicit CLI targets into runWorkflow
     3	import path from 'node:path';
     4	import { fileURLToPath } from 'node:url';
     5	import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
     6	
     7	const harness = vi.hoisted(() => ({
     8	  runWorkflow: vi.fn(async () => undefined),
     9	  loadCollectedData: vi.fn(async () => ({ _source: 'file' })),
    10	  collectSessionData: vi.fn(async () => undefined),
    11	}));
    12	
    13	vi.mock('../core/workflow', () => ({
    14	  runWorkflow: harness.runWorkflow,
    15	}));
    16	
    17	vi.mock('../loaders', () => ({
    18	  loadCollectedData: harness.loadCollectedData,
    19	}));
    20	
exec
/bin/zsh -lc 'for f in .opencode/skill/cli-codex/SKILL.md .opencode/skill/cli-copilot/SKILL.md .opencode/skill/cli-claude-code/SKILL.md .opencode/skill/cli-gemini/SKILL.md; do echo "===== $f ====="; rg -n "MEMORY_HANDBACK|Minimum payload guidance|Post-010 save gates|Explicit JSON mode failures|Parse to JSON|Write JSON|generate-context.js" "$f"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
===== .opencode/skill/cli-codex/SKILL.md =====
466:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
467:3. **Parse to JSON**: Map extracted fields to `{ sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps }` (the save flow also accepts documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`)
469:5. **Write JSON**: Save the scrubbed payload to `/tmp/save-context-data.json`
470:6. **Invoke generate-context.js**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]`
473:**Graceful degradation**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the JSON from agent output and saves via the same JSON mode path. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.
475:**Explicit JSON mode failures**: If the explicit data file cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture in that case; surface the error and stop.
477:**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.
479:**Minimum payload guidance**: Include a specific `sessionSummary`, at least one meaningful `recentContext` entry or equivalent observation, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known so the saved memory carries durable evidence instead of bare filenames.
===== .opencode/skill/cli-copilot/SKILL.md =====
310:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
311:3. **Parse to JSON**: Map extracted fields to `{ sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps }` (the save flow also accepts documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`)
313:5. **Write JSON**: Save the scrubbed payload to `/tmp/save-context-data.json`
314:6. **Invoke generate-context.js**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]`
317:**Graceful degradation**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the JSON from agent output and saves via the same JSON mode path. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.
319:**Explicit JSON mode failures**: If the explicit data file cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture in that case; surface the error and stop.
321:**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.
323:**Minimum payload guidance**: Include a specific `sessionSummary`, at least one meaningful `recentContext` entry or equivalent observation, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known so the saved memory carries durable evidence instead of bare filenames.
===== .opencode/skill/cli-claude-code/SKILL.md =====
466:2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
exec
/bin/zsh -lc 'rg -n "handback|outsourced|delegated" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:117:  /** Basename of the spec folder (e.g., "015-outsourced-agent-handback"). */
.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:35:    const filePath = buildPath('013-outsourced-agent-memory', 'memory.md');
.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:344:    const specFolder = path.join(tempRoot, '013-outsourced-agent-memory');
.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:424:    const specFolder = path.join(tempRoot, '013-outsourced-agent-memory');
.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:512:    const specFolder = path.join(tempRoot, '013-outsourced-agent-memory');
.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:697:      buildPath('013-outsourced-agent-memory', 'repair.md'),
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:79:      specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:98:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:114:      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:123:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:146:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:170:      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:179:        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:252:      specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:579:      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:630:      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:662:      sessionSummary: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:671:        request: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:672:        learning: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:686:    expect(sessionData.SUMMARY).toBe('Stabilized delegated memory save runtime behavior.');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js | sed -n '250,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   250	    const basename = getPathBasename('/path/to/file.js');
   251	    assertEqual(basename, 'file.js', 'T-003f: getPathBasename extracts filename');
   252	
   253	    // Test 7: getPathBasename handles Windows paths
   254	    const winBasename = getPathBasename('C:\\Users\\test\\file.js');
   255	    assertEqual(winBasename, 'file.js', 'T-003g: getPathBasename handles Windows paths');
   256	
   257	    // Test 8: getPathBasename handles empty input
   258	    const emptyBasename = getPathBasename('');
   259	    assertEqual(emptyBasename, '', 'T-003h: getPathBasename handles empty input');
   260	
   261	  } catch (error) {
   262	    fail('T-003: Path utils module', error.message);
   263	  }
   264	}
   265	
   266	async function testUtilsInputNormalizer() {
   267	  log('\n🔬 UTILS: input-normalizer.js');
   268	
   269	  try {
exec
/bin/zsh -lc "nl -ba .opencode/skill/cli-codex/SKILL.md | sed -n '444,492p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   444	
   445	### ⚠️ ESCALATE IF
   446	
   447	**Ask user when:**
   448	
   449	1. **ESCALATE IF Codex CLI is not installed** and user has not acknowledged
   450	   - Provide installation command: `npm i -g @openai/codex`
   451	
   452	2. **ESCALATE IF rate limits are persistently exceeded**
   453	   - Suggest checking API key quota or OAuth account limits
   454	
   455	3. **ESCALATE IF Codex output conflicts with existing code patterns**
   456	   - Present both perspectives and let user decide
   457	
   458	4. **ESCALATE IF task requires `--sandbox danger-full-access` or `--full-auto`**
   459	   - Describe risks and get explicit user approval before proceeding
   460	
   461	### Memory Handback Protocol
   462	
   463	When the calling AI needs to preserve session context from a Codex CLI delegation:
exec
/bin/zsh -lc "nl -ba .opencode/skill/cli-codex/assets/prompt_templates.md | sed -n '520,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   520	
   521	<!-- ANCHOR:memory_epilogue -->
   522	
   523	## 13. MEMORY EPILOGUE
   524	
   525	### Purpose
   526	
   527	Append this epilogue to any delegated prompt when the calling AI needs structured session memory back from Codex CLI. The agent will include the delimited section in its output, enabling the calling AI to extract, parse, and save it via `generate-context.js`.
   528	
   529	### Epilogue Template
   530	
   531	Append the following text to the end of any Codex CLI prompt:
   532	
   533	```text
   534	When you finish, include a session memory section in your output using EXACTLY this format:
   535	
   536	<!-- MEMORY_HANDBACK_START -->
   537	## Session Memory
   538	
   539	### Summary
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Outsourced Agent Handback Protocol"
     3	description: "External CLI handback protocol for session memory saves: hard-fail JSON input, next-step persistence, redact-and-scrub security, and post-010 awareness of sufficiency/contamination gates."
     4	trigger_phrases: ["outsourced agent memory", "cli agent context", "memory handback", "external agent save", "generate-context json"]
     5	importance_tier: "normal"
     6	contextType: "general"
     7	---
     8	# Feature Specification: Outsourced Agent Handback Protocol
     9	
    10	This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.
    11	
    12	
    13	<!-- SPECKIT_LEVEL: 2 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
    15	
    16	---
    17	
    18	<!-- ANCHOR:metadata -->
    19	## 1. METADATA
    20	
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Implementation Summary: Outsourced Agent Handback Protocol"
     3	description: "External CLI handback protocol: hard-fail JSON input, next-step persistence, richer caller guidance, and post-010 save-gate awareness."
     4	trigger_phrases: ["outsourced agent summary", "memory handback summary", "runtime memory inputs"]
     5	importance_tier: "normal"
     6	contextType: "general"
     7	---
     8	# Implementation Summary: Outsourced Agent Handback Protocol
     9	
    10	This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.
    11	
    12	
    13	<!-- SPECKIT_LEVEL: 2 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
    15	<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
    16	
    17	---
    18	
    19	<!-- ANCHOR:metadata -->
    20	## 1. METADATA
exec
/bin/zsh -lc 'rg -n "Codex|Copilot|Gemini|Claude|handback|generate-context|stdin|--json|/tmp/save-context-data.json|minimum payload|schema|validation|normalize" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/*.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:4:title: "Outsourced Agent Handback [015-outsourced-agent-handback/17-03-26_19-49__outsourced-agent-handback-architecture]"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:5:description: "The generate-context.js script requires substantial session data with meaningful observations to pass the memory sufficiency quality gate"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:7:  - "system spec kit/022 hybrid rag fusion/010 perfect session capturing/015 outsourced agent handback"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:9:  - "generate-context.js script requires substantial"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:30:  - "capturing/015 outsourced agent handback"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:36:  - "handback"
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:59:| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:110:**Recent:** Outsourced Agent Handback Architecture, Cross-CLI Memory Capture Validation Results, NEXT_ACTION: Fix bug X in handback template parser
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:112:**Summary:** The generate-context.js script requires substantial session data with meaningful observations to pass the memory sufficiency quality gate
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:122:/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:128:Spec: 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:129:Last: NEXT_ACTION: Fix bug X in handback template parser
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:137:- Last: NEXT_ACTION: Fix bug X in handback template parser
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:152:| Last Action | NEXT_ACTION: Fix bug X in handback template parser |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:154:| Blockers | Critical rendering issue discovered in the handback template parser where nested observation structu |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:171:**Key Topics:** `capturing/015 outsourced` | `perfect capturing/015` | `fusion/010 perfect` | `outsourced agent` | `kit/022 hybrid` | `rag fusion/010` | `agent handback` | `spec kit/022` | `system spec` | `hybrid rag` | `handback system` | `handback generate-context.js` |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:182:The generate-context.js script requires substantial session data with meaningful observations to pass the memory sufficiency quality gate
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:187:- NEXT_ACTION: Fix bug X in handback template parser
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:198:<!-- ANCHOR:architecture-outsourced-agent-handback-architecture-e12d2af7 -->
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md:201:The outsourced agent handback mechanism requires preserving session state including nextSteps when delegating work across CLI boundaries. The generate-context.js script handles nested spec folders via parent/child resolution, resolving paths like 009-perfect-session-capturing/015-outsourced-agent-handback through the findChildFolderSync function.
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	> **Note:** This session had limited actionable content (quality score: 0/100). 3 noise entries and 0 duplicates were filtered.
     2	
     3	---
     4	title: "Outsourced Agent Handback [015-outsourced-agent-handback/17-03-26_19-49__outsourced-agent-handback-architecture]"
     5	description: "The generate-context.js script requires substantial session data with meaningful observations to pass the memory sufficiency quality gate"
     6	trigger_phrases:
     7	  - "system spec kit/022 hybrid rag fusion/010 perfect session capturing/015 outsourced agent handback"
     8	  - "generate context"
     9	  - "generate-context.js script requires substantial"
    10	  - "script requires substantial session"
    11	  - "requires substantial session data"
    12	  - "substantial session data meaningful"
    13	  - "session data meaningful observations"
    14	  - "data meaningful observations pass"
    15	  - "meaningful observations pass memory"
    16	  - "observations pass memory sufficiency"
    17	  - "pass memory sufficiency quality"
    18	  - "memory sufficiency quality gate"
    19	  - "sufficiency quality gate system"
    20	  - "quality gate system spec"
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import type { DataSource } from './input-normalizer';
     2	
     3	export type SourceInputMode = 'structured' | 'stateless';
     4	export type KnownDataSource = DataSource;
     5	
     6	export interface SourceCapabilities {
     7	  source: DataSource;
     8	  inputMode: SourceInputMode;
     9	  toolTitleWithPathExpected: boolean;
    10	  prefersStructuredSave: boolean;
    11	}
    12	
    13	const SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {
    14	  file: {
    15	    source: 'file',
    16	    inputMode: 'structured',
    17	    toolTitleWithPathExpected: false,
    18	    prefersStructuredSave: true,
    19	  },
    20	  'opencode-capture': {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1838,1885p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1838	  }));
  1839	  const thinningResult = applyTreeThinning(thinFileInputs);
  1840	  const effectiveFiles = applyThinningToFileChanges(enhancedFiles, thinningResult);
  1841	  const fileRowsReduced = Math.max(0, enhancedFiles.length - effectiveFiles.length);
  1842	  log(`   Tree thinning: ${thinningResult.stats.totalFiles} files, ` +
  1843	      `${thinningResult.stats.thinnedCount} content-as-summary, ` +
  1844	      `${thinningResult.stats.mergedCount} merged-into-parent, ` +
  1845	      `~${thinningResult.stats.tokensSaved} tokens saved, ` +
  1846	      `${fileRowsReduced} rendered rows reduced\n`);
  1847	
  1848	  // Step 8: Populate templates
  1849	  log('Step 8: Populating template...');
  1850	
  1851	  const specFolderBasename: string = path.basename(sessionData.SPEC_FOLDER || specFolderName);
  1852	  const folderBase: string = specFolderBasename.replace(/^\d+-/, '');
  1853	
  1854	    let enrichedTask = implSummary.task;
  1855	    const dataSource = typeof collectedData?._source === 'string' ? collectedData._source : null;
  1856	    const specTitle = extractSpecTitle(specFolder);
  1857	    const allowSpecTitleFallback = shouldEnrichTaskFromSpecTitle(
exec
/bin/zsh -lc "rg -n \"QUALITY_ABORT_THRESHOLD|captureCapabilities|_source === 'file'|_source "'!== '"'file'|quality abort|skip.*QUALITY_GATE_ABORT\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
1240:  if (collectedData._source === 'file') {
1508:    const captureCapabilities = getSourceCapabilities(captureSource);
1514:        captureSource ? { captureSource: captureCapabilities.source, sourceCapabilities: captureCapabilities } : undefined,
2213:  const QUALITY_ABORT_THRESHOLD = CONFIG.QUALITY_ABORT_THRESHOLD;
2214:  if (qualityResult.score01 < QUALITY_ABORT_THRESHOLD) {
2216:      `is below minimum threshold (${QUALITY_ABORT_THRESHOLD.toFixed(2)}). ` +
2244:    } else if (captureCapabilities.inputMode === 'stateless') {
2252:  if (qualityResult.score01 < 0.6 && qualityResult.score01 >= QUALITY_ABORT_THRESHOLD) {
2379:        qualityAbortThreshold: QUALITY_ABORT_THRESHOLD,
exec
/bin/zsh -lc "rg -n \"QUALITY_GATE_ABORT|file-backed|_source: 'file'|source.*file|skip.*index|write_skip_index|quality threshold\" .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:529:    expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('QUALITY_GATE_ABORT'));
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:532:  it('writes but skips indexing when validation metadata marks a failure as index-blocking only', async () => {
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:535:    const dataFile = writeInputFile(harness, 'write-skip-index.json', createExplicitJsonInput({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:554:      status: 'skipped_index_policy',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:557:    expect(metadata.embedding?.status).toBe('skipped_index_policy');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:330:  it('renders session-source provenance and split file counts into frontmatter', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:353:          _source: 'file',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:529:    expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('QUALITY_GATE_ABORT'));
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:532:  it('writes but skips indexing when validation metadata marks a failure as index-blocking only', async () => {
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:535:    const dataFile = writeInputFile(harness, 'write-skip-index.json', createExplicitJsonInput({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:554:      status: 'skipped_index_policy',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:557:    expect(metadata.embedding?.status).toBe('skipped_index_policy');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:9:  loadCollectedData: vi.fn(async () => ({ _source: 'file' })),
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:124:        _source: 'file',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:150:        _source: 'file',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:183:        _source: 'file',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:192:        _source: 'file',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:210:      collectedData: { _source: 'file' },
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:49:      disposition: 'write_skip_index',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:182:      expect(result._source).toBe('file');
codex
I found an important contradiction to verify: the CLI docs/spec say file-backed handbacks “skip `QUALITY_GATE_ABORT`”, but tests appear to assert `QUALITY_GATE_ABORT` can still fire for `_source: 'file'`. I’m checking that section now because it changes where minimum-payload failures actually appear.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts | sed -n '1200,1335p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1200	    const contextDir = path.join(tempRoot, 'memory');
  1201	    fs.mkdirSync(specFolderPath, { recursive: true });
  1202	    fs.mkdirSync(contextDir, { recursive: true });
  1203	    fs.writeFileSync(
  1204	      path.join(specFolderPath, 'spec.md'),
  1205	      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
  1206	      'utf-8'
  1207	    );
  1208	
  1209	    workflowHarness.specFolderPath = specFolderPath;
  1210	    workflowHarness.contextDir = contextDir;
  1211	    evaluateMemorySufficiencyMock.mockReturnValueOnce({
  1212	      pass: false,
  1213	      rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT',
  1214	      reasons: [
  1215	        'No primary evidence was captured for this memory.',
  1216	        'Fewer than two spec-relevant evidence items were captured.',
  1217	      ],
  1218	      evidenceCounts: {
  1219	        primary: 0,
exec
/bin/zsh -lc 'rg --files | rg "memory-sufficiency"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import { describe, expect, it } from 'vitest';
     2	
     3	import { evaluateMemorySufficiency } from '@spec-kit/shared/parsing/memory-sufficiency';
     4	
     5	describe('evaluateMemorySufficiency', () => {
     6	  it('passes rich specific evidence', () => {
     7	    const result = evaluateMemorySufficiency({
     8	      title: 'Perfect Session Capturing Sufficiency Hardening',
     9	      content: [
    10	        '# Perfect Session Capturing Sufficiency Hardening',
    11	        '',
    12	        '## Overview',
    13	        'Implemented a shared insufficiency gate across workflow and memory_save so thin saves fail explicitly.',
    14	        '',
    15	        '## Decisions',
    16	        '- Chosen approach: reject thin memories before indexing because synthetic metadata should not count as durable context.',
    17	        '- Rationale: the prior path could index generic sessions that matched workspace identity but not the real task.',
    18	      ].join('\n'),
    19	      triggerPhrases: ['perfect session capturing', 'memory sufficiency', 'memory save', 'alignment block'],
    20	      files: [
 succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Sufficiency
     3	// ---------------------------------------------------------------
     4	
     5	const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;
     6	const COMMENT_RE = /<!--[\s\S]*?-->/g;
     7	const CODE_FENCE_RE = /```[\s\S]*?```/g;
     8	const WORD_RE = /\b[a-z][a-z0-9_-]{2,}\b/gi;
     9	const FILE_REF_RE = /`?[^`\s]+\.(ts|tsx|js|jsx|py|sh|md|json|jsonc|yml|yaml|toml|css|html|sql)`?/i;
    10	const DECISION_SIGNAL_RE = /\b(decided|decision|chosen|selected|because|rationale|tradeoff|next\b|follow-up|blocker|outcome|fixed|implemented|verified|tested|failed|error)\b/i;
    11	const TOOL_SIGNAL_RE = /\b(tool|bash|grep|glob|read|write|edit|search|query|command|result)\b/i;
    12	const SECTION_HEADING_RE = /^#{1,6}\s+(.+)$/;
    13	const GENERIC_TITLE_PATTERNS = [
    14	  /^memory$/i,
    15	  /^session$/i,
    16	  /^development session$/i,
    17	  /^work session$/i,
    18	  /^session summary$/i,
    19	  /^session context$/i,
    20	  /^implementation$/i,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   320	        supportEvidenceTexts.push(text);
   321	      }
   322	    }
   323	  }
   324	
   325	  for (const text of [
   326	    ...(snapshot.decisions || []),
   327	    ...(snapshot.nextActions || []),
   328	    ...(snapshot.blockers || []),
   329	    ...(snapshot.outcomes || []),
   330	  ]) {
   331	    if (isMeaningfulDecisionText(text)) {
   332	      primaryEvidenceTexts.push(normalizeWhitespace(text));
   333	    }
   334	  }
   335	
   336	  const contentSections = extractSectionBodies(snapshot.content || '');
   337	  const meaningfulSections = contentSections.filter(isMeaningfulSection);
   338	  if (meaningfulSections.length > 0) {
   339	    supportEvidenceTexts.push(meaningfulSections[0].body);
exec
/bin/zsh -lc 'find .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/description.json
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/implementation-summary.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/.gitkeep
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/11-03-26_15-37__analyzed-loadcollecteddata-in-data-loader-ts.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/14-03-26_15-20__live-outsourced-cli-dispatch-verification.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-22__next-steps.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/16-03-26_22-31__completed-phase-015-by-aligning-the-outsourced.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/17-03-26_19-49__outsourced-agent-handback-architecture.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/metadata.json
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/scratch/.gitkeep
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/spec.md
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/tasks.md
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/memory/11-03-26_15-37__analyzed-loadcollecteddata-in-data-loader-ts.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Analyzed loadCollectedData"
     3	description: "Analyzed loadCollectedData in data-loader.ts, including source priority order and fallback behavior. Confirmed only the final 'no data' condition throws fatally. Codex CLI..."
     4	trigger_phrases:
     5	  - "load collected data"
     6	  - "data loader"
     7	  - "gpt 5"
     8	  - "analyzed loadcollecteddata data-loader.ts including"
     9	  - "loadcollecteddata data-loader.ts including priority"
    10	  - "data-loader.ts including priority order"
    11	  - "including priority order fallback"
    12	  - "priority order fallback behavior"
    13	  - "confirmed final data condition"
    14	  - "final data condition throws"
    15	  - "data condition throws fatally"
    16	  - "analyzed loadcollecteddata analyzed loadcollecteddata"
    17	importance_tier: "normal"
    18	contextType: "general"
    19	quality_score: 1.00
    20	quality_flags: []
codex
I’ve now traced runtime code, docs, and tests. I’m doing one final pass through checklist/plan artifacts to distinguish what is contractually claimed versus what’s actually enforced, then I’ll deliver a concise gap matrix and per-CLI test set.
exec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/checklist.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-outsourced-agent-handback/plan.md | sed -n '1,230p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Implementation Plan: Outsourced Agent Memory Capture"
     3	description: "Align runtime memory-input handling, CLI handback docs, and spec evidence so explicit JSON-mode failures, next-step persistence, and verification status are all documented consistently."
     4	trigger_phrases: ["outsourced agent memory", "memory handback plan", "cli agent protocol"]
     5	importance_tier: "normal"
     6	contextType: "general"
     7	---
     8	# Implementation Plan: Outsourced Agent Memory Capture
     9	
    10	This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.
    11	
    12	<!-- SPECKIT_LEVEL: 2 -->
    13	<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
    14	
    15	---
    16	
    17	<!-- ANCHOR:summary -->
    18	## 1. SUMMARY
    19	
    20	### Technical Context
 succeeded in 0ms:
     1	---
     2	title: "Verification Checklist: Outsourced Agent Handback Protocol"
     3	description: "Verification checklist for the outsourced agent handback protocol"
     4	trigger_phrases: ["outsourced agent checklist", "memory handback checklist"]
     5	importance_tier: "normal"
     6	contextType: "general"
     7	---
     8	# Verification Checklist: Outsourced Agent Handback Protocol
     9	
    10	This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.
    11	
    12	<!-- SPECKIT_LEVEL: 2 -->
    13	<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
    14	
    15	---
    16	
    17	<!-- ANCHOR:protocol -->
    18	## 1. VERIFICATION PROTOCOL
    19	
    20	| Priority | Handling | Completion Impact |
exec
/bin/zsh -lc 'rg -n "userPrompts|recentContext|observations|Array.isArray|NEXT_ACTION|extractNextAction|specFolder|SPEC_FOLDER" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:71:  observations: Observation[];
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:75:  specFolderPath: string | null;
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:76:  recentContext?: RecentContextEntry[];
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:116: * @param decisionCount - Number of decision observations recorded.
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:158: * @param observations - Session observations containing type and fact data.
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:164:  observations: Observation[],
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:172:  const obsTypes = observations.map((o) => o.type || 'observation');
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:184: * Identify the most recently active file from observations, preferring non-synthetic entries.
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:185: * @param observations - Session observations that may reference files.
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:189:function extractActiveFile(observations: Observation[], files: FileEntry[] | undefined): string {
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:190:  const prioritizedObservations = observations.some((observation) => !observation._synthetic)
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:191:    ? observations.filter((observation) => !observation._synthetic)
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:192:    : observations;
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:201:function getBehavioralObservations(observations: Observation[]): Observation[] {
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:202:  const liveObservations = observations.filter((observation) => !observation._synthetic);
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:203:  return liveObservations.length > 0 ? liveObservations : observations;
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:206:function findFactByPattern(observations: Observation[], pattern: RegExp): string | null {
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:207:  for (let i = observations.length - 1; i >= 0; i--) {
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:208:    const obs = observations[i];
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:250:function extractFromRecentContext(recentContext?: RecentContextEntry[]): string | null {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '700,790p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   700	    const detectedFolder = await detectSpecFolder();
   701	    const normalizedDetected = path.resolve(detectedFolder).replace(/\\/g, '/');
   702	
   703	    const candidateSpecsDirs = Array.from(new Set([
   704	      findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs'),
   705	      ...getSpecsDirectories(),
   706	      path.join(CONFIG.PROJECT_ROOT, 'specs'),
   707	      path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
   708	    ]));
   709	
   710	    folderName = resolveSpecFolderRelative(normalizedDetected, candidateSpecsDirs);
   711	  }
   712	  const dateOnly: string = formatTimestamp(now, 'date-dutch');
   713	  const timeOnly: string = formatTimestamp(now, 'time-short');
   714	
   715	  if (!collectedData) {
   716	    console.log('   Warning: Using simulation data');
   717	    return getSimFactory().createSessionData({
   718	      specFolder: folderName,
   719	      channel: getChannel(),
exec
/bin/zsh -lc 'rg -n "sessionSummary|session_summary|filesModified|files_modified|triggerPhrases|trigger_phrases|nextSteps|next_steps|specFolder|spec_folder|keyDecisions|key_decisions" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
358:    const hasSessionSummary = !!(collectedData as Record<string, unknown>).sessionSummary;
359:    const hasKeyDecisions = Array.isArray((collectedData as Record<string, unknown>).keyDecisions) &&
360:      ((collectedData as Record<string, unknown>).keyDecisions as unknown[]).length > 0;
361:    const hasNextSteps = !!(collectedData as Record<string, unknown>).nextSteps;
415:  // CG-03: JSON-mode explicit data with sessionSummary → high completion
417:    const hasSessionSummary = !!(collectedData as Record<string, unknown>).sessionSummary;
693:  specFolderName: string | null = null
698:  let folderName: string = specFolderName || '';
718:      specFolder: folderName,
737:    // Prioritize followup observations (nextSteps) before truncation
742:      specFolder: data.SPEC_FOLDER || folderName,
856:  let specFolderPath: string | null = null;
864:        specFolderPath = candidate;
869:        specFolderPath = candidate;
874:  if (specFolderPath) {
876:      SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[];
895:      specFolderPath,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '320,440p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   320	  }
   321	
   322	  let summary: string = parts.join('. ') + '.';
   323	
   324	  if (learningIndex >= 40) {
   325	    summary += ' Overall: Highly productive learning session.';
   326	  } else if (learningIndex >= 25) {
   327	    summary += ' Overall: Good learning session with meaningful progress.';
   328	  } else if (learningIndex >= 10) {
   329	    summary += ' Overall: Moderate learning session.';
   330	  }
   331	
   332	  return summary;
   333	}
   334	
   335	/* ───────────────────────────────────────────────────────────────
   336	   3. CONTINUE SESSION DATA
   337	------------------------------------------------------------------*/
   338	
   339	function determineSessionStatus(
exec
/bin/zsh -lc "rg -n \"sessionSummary|SUMMARY|summary =|generateContextSummary|QUICK_SUMMARY|hasSessionSummary\" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
100:  LEARNING_SUMMARY: string;
112:  CONTEXT_SUMMARY: string;
231:    LEARNING_SUMMARY: string;
240:    LEARNING_SUMMARY: 'Learning metrics will be calculated when both preflight and postflight data are provided.'
261:      LEARNING_SUMMARY: generateLearningSummary(deltaKnow, deltaUncert, deltaContext, learningIndex)
358:    const hasSessionSummary = !!(collectedData as Record<string, unknown>).sessionSummary;
365:    if (isFileSource && hasSessionSummary && (hasKeyDecisions || hasNextSteps)) {
415:  // CG-03: JSON-mode explicit data with sessionSummary → high completion
417:    const hasSessionSummary = !!(collectedData as Record<string, unknown>).sessionSummary;
419:    if (isFileSource && hasSessionSummary) {
510:function generateContextSummary(
605:  const contextSummary = generateContextSummary(summary, observations, projectPhase, decisionCount);
625:    CONTEXT_SUMMARY: contextSummary,
805:  // P3-7: Check if rawLearning is topically related to the spec folder before using it as SUMMARY.
814:  const SUMMARY: string = (!isErrorContent && learningIsTopical && rawLearning.length > 0)
910:    summary: SUMMARY,
926:    SUMMARY,
936:    QUICK_SUMMARY: quickSummary,
1003:  generateContextSummary,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '790,870p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   790	  const sourceSessionUpdated = typeof data._sourceSessionUpdated === 'number' && Number.isFinite(data._sourceSessionUpdated)
   791	    ? data._sourceSessionUpdated
   792	    : 0;
   793	
   794	  const OUTCOMES: OutcomeEntry[] = observations
   795	    .slice(0, 10)
   796	    .map((obs) => ({
   797	      OUTCOME: obs.title || obs.narrative?.substring(0, 300) || '',
   798	      TYPE: detectObservationType(obs)
   799	    }));
   800	
   801	  const rawLearning = (sessionInfo as RecentContextEntry).learning || '';
   802	  const isErrorContent = /\bAPI\s+Error:\s*\d{3}\b/i.test(rawLearning)
   803	    || /\{"?\s*(?:type|error)"?\s*:\s*"?(?:error|api_error|overloaded_error)/i.test(rawLearning)
   804	    || /internal server error/i.test(rawLearning);
   805	  // P3-7: Check if rawLearning is topically related to the spec folder before using it as SUMMARY.
   806	  // Prevents a random last exchange from becoming the memory's entire description.
   807	  const learningIsTopical = (() => {
   808	    if (!folderName || rawLearning.length === 0) return rawLearning.length > 0;
   809	    const segments = folderName.split('/').map(s => s.replace(/^\d+--?/, '').trim().toLowerCase()).filter(s => s.length > 2);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1150,1268p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1150	/**
  1151	 * Selective enrichment for file-backed (JSON-mode) data.
  1152	 * Adds ONLY safe metadata (git provenance, spec-folder trigger phrases/decisions,
  1153	 * file description enhancement). Explicitly SKIPS observations and FILES from git
  1154	 * to preserve V8 safety — JSON payload remains authoritative for session content.
  1155	 */
  1156	async function enrichFileSourceData(
  1157	  collectedData: CollectedDataFull,
  1158	  specFolder: string,
  1159	  projectRoot: string
  1160	): Promise<CollectedDataFull> {
  1161	  const enriched: CollectedDataFull = { ...collectedData };
  1162	
  1163	  try {
  1164	    // Run spec-folder and git extraction in parallel (safe metadata only)
  1165	    const [specContext, gitContext] = await Promise.all([
  1166	      extractSpecFolderContext(specFolder).catch((err: unknown) => {
  1167	        const msg = err instanceof Error ? err.message : String(err);
  1168	        console.warn(`[workflow] file-source enrichment degraded (spec): ${msg}`);
  1169	        return null;
exec
/bin/zsh -lc 'rg -n "function extractFilesFromData|filesModified|files_modified|FILES" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
581:  FILES: FileChange[];
582:  SPEC_FILES: SpecFileEntry[];
596:    FILES, SPEC_FILES, summary, projectPhase, nextAction,
606:  const resumeContext = generateResumeContext(FILES, SPEC_FILES, observations);
764:  const FILES: FileChange[] = extractFilesFromData(data, observations);
766:    FILES,
770:    FILES,
774:    FILES,
820:    detectSessionCharacteristics(observations, userPrompts, FILES as FileEntry[]);
849:  let SPEC_FILES: SpecFileEntry[] = [];
876:      SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[];
880:      SPEC_FILES = [];
885:    observations, FILES, folderName
893:      FILES: FILES as FileEntry[],
894:      SPEC_FILES,
908:    FILES,
909:    SPEC_FILES,
927:    FILES: FILES.length > 0 ? FILES : [],
928:    HAS_FILES: FILES.length > 0,
931:    FILESYSTEM_FILE_COUNT: filesystemFileCount,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Collect Session Data
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. COLLECT SESSION DATA
     7	// ───────────────────────────────────────────────────────────────
     8	// Orchestrates session data collection — gathers observations, files, decisions, and context
     9	
    10	// Node stdlib
    11	import * as path from 'path';
    12	import * as fsSync from 'fs';
    13	
    14	// Internal modules
    15	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from '../core';
    16	import { formatTimestamp } from '../utils/message-utils';
    17	import { pickBestContentName } from '../utils/slug-utils';
    18	import { structuredLog } from '../utils/logger';
    19	import { coerceFactsToText } from '../utils/fact-coercion';
    20	import { detectSpecFolder } from '../spec-folder';
exec
/bin/zsh -lc "rg -n \"function extractFilesFromData|filesModified|files_modified|FILES|path|description\" .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts && nl -ba .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts | sed -n '140,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
8:// Extracts file references, descriptions, and observation types from session data
20:import { getPathBasename } from '../utils/path-utils';
47:  description: string;
96:function extractFilesFromData(
97:  collectedData: CollectedDataSubset<'FILES' | 'filesModified'> | null,
113:    description: string;
121:  if (!collectedData) collectedData = {} as CollectedDataSubset<'FILES' | 'filesModified'>;
126:    description: string,
138:    // F-20: Use full canonical source path as map key to prevent truncation-based collisions
147:      console.warn(`Warning: Disambiguating colliding path '${canonicalSourcePath}' as '${mapKey}'`);
153:    const cleaned = cleanDescription(description);
166:      const existingTierRank = getDescriptionTierRank(validateDescription(existing.description).tier);
170:        || (cleanedTierRank === existingTierRank && cleaned.length > existing.description.length)
172:        // Better description available — use it, and merge action/provenance
174:          description: cleaned,
181:        // Keep existing description, but still merge action and provenance if newer
198:        description: cleaned || 'Modified during session',
207:  // Source 1: FILES array (primary input format)
208:  if (collectedData.FILES && Array.isArray(collectedData.FILES)) {
209:    for (const fileInfo of collectedData.FILES) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts | sed -n '700,750p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   700	    });
   701	    const second = await workflowModule.runWorkflow({
   702	      dataFile: secondFile,
   703	      specFolderArg: harness.specFolderPath,
   704	      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
   705	      silent: true,
   706	    });
   707	
   708	    const markdownFiles = listMarkdownFiles(harness.contextDir);
   709	    const description = readDescription(harness);
   710	
   711	    expect(first.contextFilename).not.toBe(second.contextFilename);
   712	    expect(markdownFiles).toEqual([first.contextFilename, second.contextFilename].sort());
   713	    expect(description.memorySequence).toBe(2);
   714	    expect(description.memoryNameHistory).toEqual([first.contextFilename, second.contextFilename]);
   715	    expect(first.memoryId).not.toBeNull();
   716	    expect(second.memoryId).not.toBeNull();
   717	    expect(first.memoryId).not.toBe(second.memoryId);
   718	  });
   719	
exec
/bin/zsh -lc "rg -n \"function createExplicitJsonInput|buildRichSessionData|buildSparseSessionData\" .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts && nl -ba .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts | sed -n '160,250p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
12:import { buildRichSessionData, buildSparseSessionData, buildTreeThinningSessionData } from './fixtures/session-data-factory';
161:function createExplicitJsonInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
428:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
545:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
633:      buildRichSessionData(specFolderName || harness.specRelativePath)
698:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
704:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
736:      collectSessionDataFn: async (_collectedData, specFolderName) => buildSparseSessionData(specFolderName || harness.specRelativePath),
756:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
   160	
   161	function createExplicitJsonInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
   162	  return {
   163	    spec_folder: SPEC_RELATIVE_PATH,
   164	    session_summary: 'Implemented the integration testing phase with a real workflow save harness and Vitest migration.',
   165	    trigger_phrases: [
   166	      'perfect session capturing',
   167	      'integration testing',
   168	      'workflow save pipeline',
   169	      'memory sequence tracking',
   170	    ],
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "Data Loaders"
     3	description: "Data loader modules that normalize input from JSON files or native CLI capture, then hard-stop when no usable session data exists."
     4	trigger_phrases:
     5	  - "data loaders"
     6	  - "load collected data"
     7	  - "context loading"
     8	---
     9	
    10	
    11	# Data Loaders
    12	
    13	<!-- ANCHOR:table-of-contents -->
    14	## TABLE OF CONTENTS
    15	
    16	- [1. OVERVIEW](#1--overview)
    17	- [2. CURRENT INVENTORY](#2--current-inventory)
    18	- [3. SOURCE PRIORITY](#3--source-priority)
    19	- [4. SECURITY AND PATH HANDLING](#4--security-and-path-handling)
    20	- [5. QUICK USAGE](#5--quick-usage)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/README.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: "System Spec Kit Utilities"
     3	description: "Shared utility modules providing core functionality for data validation, path sanitization, file operations, logging and input normalization across all system-spec-kit scripts."
     4	trigger_phrases:
     5	  - "spec kit utilities"
     6	  - "data validator path utils"
     7	  - "script utility modules"
     8	---
     9	
    10	# System Spec Kit Utilities
    11	
    12	> Shared utility modules providing core functionality for data validation, path sanitization, file operations, logging and input normalization across all system-spec-kit scripts.
    13	
    14	---
    15	
    16	## TABLE OF CONTENTS
    17	<!-- ANCHOR:table-of-contents -->
    18	
    19	- [1. OVERVIEW](#1--overview)
    20	- [2. QUICK START](#2--quick-start)
exec
/bin/zsh -lc 'npm run -s test -- --config ../mcp_server/vitest.config.ts --root . tests/runtime-memory-inputs.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts exited 1 in 327ms:
file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:2170
			throw new Error(`Expected a single value for option "${command}", received [${received}]`);
			      ^

Error: Expected a single value for option "-c, --config <path>", received ["../mcp_server/vitest.config.ts", "../mcp_server/vitest.config.ts"]
    at transform (file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:2170:10)
    at setDotProp (file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:208:22)
    at CAC.mri (file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:592:9)
    at CAC.parse (file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:509:27)
    at file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/cli.js:29:13
    at ModuleJob.run (node:internal/modules/esm/module_job:430:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:655:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v25.6.1
codex
The first test run failed due duplicate `--config` injection from the npm script wrapper, not from the code under test. I’m rerunning with a direct `vitest` invocation so we can still validate the current behavior.
exec
/bin/zsh -lc 'npx vitest run --root . tests/runtime-memory-inputs.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts exited 1 in 427ms:

 RUN  v4.1.0 /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts

No test files found, exiting with code 1

filter: tests/runtime-memory-inputs.vitest.ts, tests/generate-context-cli-authority.vitest.ts, tests/outsourced-agent-handback-docs.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**

exec
/bin/zsh -lc 'npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/runtime-memory-inputs.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts exited 1 in 674ms:

 RUN  v4.1.0 /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts

 ❯ tests/outsourced-agent-handback-docs.vitest.ts (0 test)
 ❯ tests/runtime-memory-inputs.vitest.ts (0 test)
 ❯ tests/generate-context-cli-authority.vitest.ts (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/generate-context-cli-authority.vitest.ts [ tests/generate-context-cli-authority.vitest.ts ]
 FAIL  tests/outsourced-agent-handback-docs.vitest.ts [ tests/outsourced-agent-handback-docs.vitest.ts ]
 FAIL  tests/runtime-memory-inputs.vitest.ts [ tests/runtime-memory-inputs.vitest.ts ]
Error: EPERM: operation not permitted, mkdir '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/wHj0zgY3terMmWPLy-ZvR/ssr'
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯


 Test Files  3 failed (3)
      Tests  no tests
   Start at  09:05:19
   Duration  143ms (transform 0ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)
codex
`system-spec-kit` was used for this analysis (runtime + handback protocol tracing).

1. Minimum handback JSON schema (from `validateInputData`)
- Validation entrypoint: [`input-normalizer.ts#L551`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L551 )
- Required root: non-null object only.
- Conditional required field:
  - If no CLI `specFolderArg`, then at least one truthy field among `specFolder|spec_folder|SPEC_FOLDER|userPrompts|user_prompts|observations|recentContext|recent_context` is required ([`#L558-L561`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L558 )).
  - If `specFolderArg` is provided, even `{}` passes this check.
- Typed optional fields enforced:
  - arrays: `triggerPhrases`, `trigger_phrases`, `keyDecisions`, `key_decisions`, `filesModified`, `files_modified`, `nextSteps`, `next_steps`, `FILES`, `observations`, `user_prompts`, `recent_context`
  - objects: `session`, `git`
  - enum: `importanceTier|importance_tier`
  - `FILES[i]` must have `FILE_PATH` or `path`
- Not enforced (important): `sessionSummary`, `recentContext` (camelCase), `userPrompts` (camelCase), item shapes inside arrays, meaningful `FILES.DESCRIPTION`.

2. Per-CLI handback flow through pipeline
- Codex: [`cli-codex/SKILL.md#L461`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-codex/SKILL.md#L461 )
- Copilot: [`cli-copilot/SKILL.md#L305`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-copilot/SKILL.md#L305 )
- Claude Code: [`cli-claude-code/SKILL.md#L461`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-claude-code/SKILL.md#L461 )
- Gemini: [`cli-gemini/SKILL.md#L408`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-gemini/SKILL.md#L408 )

All four use the same flow:
1. Delegated CLI emits `MEMORY_HANDBACK` block.
2. Caller extracts block and builds JSON.
3. Caller writes `/tmp/save-context-data.json`.
4. Caller runs `generate-context.js /tmp/save-context-data.json [spec-folder]`.
5. File mode path calls loader validate+normalize ([`data-loader.ts#L520`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L520 ), [`#L523`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L523 )).
6. Workflow applies sufficiency/contamination/quality gates ([`workflow.ts#L2207`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2207 ), [`#L2227`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2227 )).

3. Validation gaps letting malformed/thin payloads through
- Gap A: Minimum-payload guidance is doc-level, not `validateInputData`-enforced. Thin payloads pass validation and fail later at sufficiency gate.
- Gap B: With explicit CLI spec folder, `{}` is accepted in structured mode path (test proves pass-through): [`generate-context-cli-authority.vitest.ts#L199`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts#L199 ).
- Gap C: `--stdin/--json` bypasses loader validation+normalization and sends raw payload to workflow ([`generate-context.ts#L356`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L356 ), [`#L565`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L565 ), [`workflow.ts#L1395`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1395 )).
- Gap D: SKILL step “Parse to JSON” lists only `{sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps}`, but minimum guidance later asks for `recentContext` + rich `FILES` metadata (same section in all 4 CLI SKILL docs).
- Gap E: Doc regression test checks wording presence only, not behavioral adequacy of payload schema: [`outsourced-agent-handback-docs.vitest.ts#L29`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts#L29 ).

4. Minimum tests needed per CLI
- T1 Contract-shape test: parse each CLI handback block into the currently documented step-3 JSON (without `recentContext`/`FILES`) and assert `INSUFFICIENT_CONTEXT_ABORT`.
- T2 Rich-payload success test: parse into JSON with `sessionSummary` + meaningful `recentContext` + rich `FILES.DESCRIPTION` (+ optional `ACTION`, `MODIFICATION_MAGNITUDE`, `_provenance`) and assert memory write succeeds.
- T3 Cross-spec contamination test: same rich payload but foreign-spec content, assert `CONTAMINATION_GATE_ABORT`.
- T4 Explicit file load failure test: missing/invalid JSON file, assert `EXPLICIT_DATA_FILE_LOAD_FAILED` and no native fallback.
- T5 Structured-mode parity guard (`--stdin`/`--json`): ensure they either normalize like file mode or explicitly reject unnormalized payloads; include snake_case coverage.
- T6 Doc-to-runtime consistency test: if SKILL “minimum payload guidance” changes, enforce corresponding runtime acceptance criteria (not just keyword presence).

I could not run Vitest end-to-end in this environment because sandbox restrictions block temp SSR dir creation (`EPERM` on `/var/folders/.../ssr`).
tokens used
693,704
`system-spec-kit` was used for this analysis (runtime + handback protocol tracing).

1. Minimum handback JSON schema (from `validateInputData`)
- Validation entrypoint: [`input-normalizer.ts#L551`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L551 )
- Required root: non-null object only.
- Conditional required field:
  - If no CLI `specFolderArg`, then at least one truthy field among `specFolder|spec_folder|SPEC_FOLDER|userPrompts|user_prompts|observations|recentContext|recent_context` is required ([`#L558-L561`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L558 )).
  - If `specFolderArg` is provided, even `{}` passes this check.
- Typed optional fields enforced:
  - arrays: `triggerPhrases`, `trigger_phrases`, `keyDecisions`, `key_decisions`, `filesModified`, `files_modified`, `nextSteps`, `next_steps`, `FILES`, `observations`, `user_prompts`, `recent_context`
  - objects: `session`, `git`
  - enum: `importanceTier|importance_tier`
  - `FILES[i]` must have `FILE_PATH` or `path`
- Not enforced (important): `sessionSummary`, `recentContext` (camelCase), `userPrompts` (camelCase), item shapes inside arrays, meaningful `FILES.DESCRIPTION`.

2. Per-CLI handback flow through pipeline
- Codex: [`cli-codex/SKILL.md#L461`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-codex/SKILL.md#L461 )
- Copilot: [`cli-copilot/SKILL.md#L305`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-copilot/SKILL.md#L305 )
- Claude Code: [`cli-claude-code/SKILL.md#L461`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-claude-code/SKILL.md#L461 )
- Gemini: [`cli-gemini/SKILL.md#L408`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/cli-gemini/SKILL.md#L408 )

All four use the same flow:
1. Delegated CLI emits `MEMORY_HANDBACK` block.
2. Caller extracts block and builds JSON.
3. Caller writes `/tmp/save-context-data.json`.
4. Caller runs `generate-context.js /tmp/save-context-data.json [spec-folder]`.
5. File mode path calls loader validate+normalize ([`data-loader.ts#L520`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L520 ), [`#L523`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L523 )).
6. Workflow applies sufficiency/contamination/quality gates ([`workflow.ts#L2207`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2207 ), [`#L2227`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2227 )).

3. Validation gaps letting malformed/thin payloads through
- Gap A: Minimum-payload guidance is doc-level, not `validateInputData`-enforced. Thin payloads pass validation and fail later at sufficiency gate.
- Gap B: With explicit CLI spec folder, `{}` is accepted in structured mode path (test proves pass-through): [`generate-context-cli-authority.vitest.ts#L199`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts#L199 ).
- Gap C: `--stdin/--json` bypasses loader validation+normalization and sends raw payload to workflow ([`generate-context.ts#L356`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L356 ), [`#L565`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L565 ), [`workflow.ts#L1395`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1395 )).
- Gap D: SKILL step “Parse to JSON” lists only `{sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps}`, but minimum guidance later asks for `recentContext` + rich `FILES` metadata (same section in all 4 CLI SKILL docs).
- Gap E: Doc regression test checks wording presence only, not behavioral adequacy of payload schema: [`outsourced-agent-handback-docs.vitest.ts#L29`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts#L29 ).

4. Minimum tests needed per CLI
- T1 Contract-shape test: parse each CLI handback block into the currently documented step-3 JSON (without `recentContext`/`FILES`) and assert `INSUFFICIENT_CONTEXT_ABORT`.
- T2 Rich-payload success test: parse into JSON with `sessionSummary` + meaningful `recentContext` + rich `FILES.DESCRIPTION` (+ optional `ACTION`, `MODIFICATION_MAGNITUDE`, `_provenance`) and assert memory write succeeds.
- T3 Cross-spec contamination test: same rich payload but foreign-spec content, assert `CONTAMINATION_GATE_ABORT`.
- T4 Explicit file load failure test: missing/invalid JSON file, assert `EXPLICIT_DATA_FILE_LOAD_FAILED` and no native fallback.
- T5 Structured-mode parity guard (`--stdin`/`--json`): ensure they either normalize like file mode or explicitly reject unnormalized payloads; include snake_case coverage.
- T6 Doc-to-runtime consistency test: if SKILL “minimum payload guidance” changes, enforce corresponding runtime acceptance criteria (not just keyword presence).

I could not run Vitest end-to-end in this environment because sandbox restrictions block temp SSR dir creation (`EPERM` on `/var/folders/.../ssr`).
