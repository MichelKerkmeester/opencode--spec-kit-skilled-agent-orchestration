# Iteration 1: JSON-Mode Pipeline Architecture Map

## Focus
This iteration mapped the runtime-backed JSON-mode save pipeline for `generate-context.js`, starting at the compiled CLI entry and tracing into the TypeScript source that parses structured input, normalizes payload fields, runs the extractor fan-out, renders the memory template, writes files atomically, runs the post-save reviewer, and conditionally indexes the saved memory. The goal was to establish the concrete call graph that later iterations can use to localize defect classes D1-D8. [CITATION: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:38-57`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:393-420`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:588-647`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1672-1853`]

## Source code structure
The active source tree is rooted under `scripts/`, not `scripts/src/`; the prompt’s `scripts/src/memory/` and `scripts/src/core/workflow.js` paths do not exist in this checkout. The runtime path fans into these modules:

```text
.opencode/skill/system-spec-kit/scripts/
├── memory/
│   └── generate-context.ts                 # CLI entry, mode parsing, validation, runWorkflow handoff
├── core/
│   ├── workflow.ts                         # Step 1-Step 12 orchestration
│   ├── file-writer.ts                      # Atomic write + rollback
│   ├── post-save-review.ts                 # JSON-mode saved-file reviewer
│   ├── memory-indexer.ts                   # Embedding + vector index write + metadata update
│   └── memory-metadata.ts                  # classification and causal-link context builders
├── extractors/
│   ├── collect-session-data.ts             # SessionData assembly
│   ├── conversation-extractor.ts           # MESSAGES payload
│   ├── decision-extractor.ts               # DECISIONS payload
│   ├── diagram-extractor.ts                # DIAGRAMS payload
│   ├── implementation-guide-extractor.ts   # implementation guide sub-payload
│   ├── spec-folder-extractor.ts            # spec-folder enrichment support
│   ├── git-context-extractor.ts            # git enrichment support
│   └── contamination-filter.ts             # contamination scrubbing
└── renderers/
    └── template-renderer.ts                # populateTemplate('context', data)
```

This tree matches the dist entry’s imports of `../core/workflow`, `../loaders`, and `../extractors/collect-session-data`, then resolves to the TypeScript modules above. [CITATION: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:52-57`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:24-27`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:21-22`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:38`, `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:176-205`]

## Entry point analysis
- `parseStructuredModeArguments()` is the JSON-mode gate for `--stdin` and `--json`: it reads stdin or the inline JSON string, parses the payload, resolves explicit CLI vs payload `specFolder`, requires a target spec folder, and returns `collectedData` with `_source: 'file'`. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:344-388`]
- `parseArguments()` routes all three entry modes:
  - `--stdin` / `--json` delegate into `parseStructuredModeArguments()`. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:418-420`]
  - file mode returns `{ dataFile: primaryArg, specFolderArg: secondaryArg }`, leaving `collectedData` null so the loader path is used later. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:431-436`]
  - direct spec-folder-only mode is explicitly rejected. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:423-429`]
- `main()` installs the parsed values into `CONFIG`, validates the chosen spec folder, and calls `runWorkflow()` with either preloaded structured data or a loader-backed fallback. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:550-571`]
- The compiled runtime entry exports the same functions and wires the same module imports, so the dist file is a direct operational bridge into the source workflow. [CITATION: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:38-57`]

## Workflow step sequence
1. **Step 1: Loading collected data**. `runWorkflow()` either normalizes preloaded JSON via `normalizeInputData(preloadedData)` or loads file-mode data through `loadCollectedDataFromLoader()`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:612-647`]
2. **Step 1.5: Captured-session alignment check**. This gate only runs when the input is not `_source === 'file'`, so JSON-mode bypasses the captured-session alignment block. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:654-695`]
3. **Step 2: Detecting spec folder**. The workflow resolves the final spec folder path and derives a relative `specFolderName` used downstream in templates and indexing. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:698-735`]
4. **Step 3: Setting up context directory**. `setupContextDirectory(specFolder)` creates the memory output directory. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:737-740`]
5. **Step 3.5: Enriching captured-session data**. This branch is guarded by `isCapturedSessionMode`, so it is skipped for JSON-mode saves and only applies to runtime-captured sessions. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]
6. **Steps 4-7: Parallel extraction**. The workflow runs `collectSessionData()`, `extractConversations()`, `extractDecisions()`, `extractDiagrams()`, and the workflow-flowchart builder in one `Promise.all(...)`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:958-1063`]
7. **Step 7.5: Generating semantic summary**. The workflow builds `implSummary`, semantic file changes, and Markdown summary material from normalized messages and observations. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1080-1132`]
8. **Step 7.6: Applying tree thinning**. Semantic file rows are reduced before rendering. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1134-1149`]
9. **Step 8: Populating template**. The workflow derives titles, topics, trigger phrases, metadata contexts, then renders the context memory via `populateTemplate('context', ...)`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1151-1313`, `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:176-205`]
10. **Step 8.5 / 8.6: Cleaning and quality gates**. Rendered content is cleaned, validated, sufficiency-scored, contract-checked, and annotated before write disposition is decided. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1471-1633`]
11. **Step 9: Writing files**. `writeFilesAtomically()` persists the rendered files to disk with duplicate detection, temp-file writes, rename, and rollback safeguards. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1672-1679`, `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:130-220`]
12. **Step 10.5: Post-save quality review**. For non-captured saves, the workflow compares the saved file back against the original structured payload. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-349`]
13. **Step 11: Semantic memory indexing**. The workflow evaluates `shouldIndexMemory(...)`, then calls `indexMemory(...)` and persists embedding status into `metadata.json`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1800-1887`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:63-229`]

## Extractor inventory
- `collectSessionData()` in `collect-session-data.ts` assembles the primary `SessionData` object used as the base template context; it also invokes `buildImplementationGuideData()` before returning. Input: `CollectedDataFull | null`, spec folder, optional session id. Output: `SessionData`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:752-756`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:987-1007`]
- `buildImplementationGuideData()` in `implementation-guide-extractor.ts` derives `TOPIC`, `IMPLEMENTATIONS`, `IMPL_KEY_FILES`, `EXTENSION_GUIDES`, and `PATTERNS` for the session data bundle. Input: observations, files, spec folder. Output: `ImplementationGuideData`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:344-369`]
- `extractConversations()` in `conversation-extractor.ts` produces `MESSAGES` and related conversation metadata; in JSON-mode fallback it synthesizes messages from `sessionSummary`, `keyDecisions`, and `nextSteps` via `extractFromJsonPayload()`. Input: structured conversation subset or null. Output: `ConversationData`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:58-127`, `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:130-174`]
- `extractDecisions()` in `decision-extractor.ts` merges `_manualDecisions` with observation/user-prompt-derived lexical decisions; the lexical fallback titles candidates as `"observation decision N"` or `"user decision N"`. Input: decision-related collected data subset or null. Output: `DecisionData`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-215`]
- `extractDiagrams()` in `diagram-extractor.ts` scans observation narratives/facts for ASCII diagram content and classifies diagram outputs; its helper `extractPhasesFromData()` is also used by the workflow-flowchart branch. Input: observation/user-prompt subset or null. Output: `DiagramData`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:48-115`, `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:121-170`]
- `extractSpecFolderContext()` and `extractGitContext()` are not part of the JSON-mode extractor fan-out; they are only injected during the captured-session enrichment branch in Step 3.5. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:45-46`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

## Template populator
The actual template fill happens in `populateTemplate(templateName, data)` inside `renderers/template-renderer.ts`, which reads `${templateName}_template.md`, calls `renderTemplate(template, data)`, and strips template-config comments before returning the rendered markdown. The workflow calls this as `populateTemplate('context', { ...sessionData, ...conversations, ...workflowData, ... })` when building the primary memory file. [CITATION: `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:176-205`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1311-1327`]

## Post-save quality review
The reviewer is `reviewPostSaveQuality()` in `core/post-save-review.ts`. It only runs when a file was actually written and the save was not in captured mode; inside the reviewer, JSON-mode is further enforced by skipping any payload whose `_source` is not `'file'`. The review reads the saved markdown, parses frontmatter and metadata, and checks title quality, trigger-phrase corruption/missing phrases, importance tier mismatch, decision count propagation, context type mismatch, and generic descriptions. `printPostSaveReview()` then prints a machine-readable result, and the workflow logs a score penalty advisory without patching the saved file. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-349`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419`]

## Indexer
The index stage is gated in the workflow by `shouldIndexMemory(...)` after the write succeeds. If indexing proceeds, `indexMemory()` builds weighted document text, generates an embedding with `generateDocumentEmbedding(...)`, reuses pre-extracted trigger phrases when available, computes importance and quality metadata, and calls `vectorIndex.indexMemory(...)` with `specFolder`, `filePath`, `title`, `triggerPhrases`, `importanceWeight`, `embedding`, `qualityScore`, and `qualityFlags`. `updateMetadataEmbeddingStatus()` then writes the embedding/index status back into `metadata.json`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1833-1875`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:63-192`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:195-229`]

## Call graph (input → output)
```text
dist/memory/generate-context.js
  -> source memory/generate-context.ts main()
  -> parseArguments()
     -> --json / --stdin: parseStructuredModeArguments()
        -> parseStructuredJson()
        -> resolve explicit CLI target or payload specFolder
        -> collectedData with _source='file'
     -> file mode: return dataFile + optional CLI spec folder
  -> validateArguments()
  -> runWorkflow(...)
     -> Step 1: normalizeInputData(preloaded JSON) or loadCollectedDataFromLoader(file mode)
     -> Step 2: detectSpecFolder(...)
     -> Step 3: setupContextDirectory(...)
     -> Steps 4-7: Promise.all(
          collectSessionData(),
          extractConversations(),
          extractDecisions(),
          extractDiagrams(),
          workflow flowchart builder
        )
     -> Step 7.5: generateImplementationSummary() + extractFileChanges()
     -> Step 7.6: applyTreeThinning()
     -> Step 8: populateTemplate('context', ...)
     -> Step 8.5/8.6: clean HTML, validate quality, inject metadata, decide write/index disposition
     -> Step 9: writeFilesAtomically(contextDir, files)
     -> Step 10.5: reviewPostSaveQuality(savedFilePath, collectedData, inputMode)
     -> Step 11: shouldIndexMemory(...)
        -> indexMemory(...)
           -> generateDocumentEmbedding(...)
           -> vectorIndex.indexMemory(...)
           -> updateMetadataEmbeddingStatus(...)
```

All structured JSON modes (`--json`, `--stdin`, JSON temp file) converge before `runWorkflow()`, then diverge only at Step 1 depending on whether the data arrived preloaded or via loader. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:344-388`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:418-436`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:612-647`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:958-1063`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1672-1853`]

## Findings (count and list)
1. The compiled runtime entry is a thin bridge into the source workflow modules; it imports `../core/workflow`, `../loaders`, and `../extractors/collect-session-data` rather than containing a separate pipeline. [CITATION: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:52-57`]
2. JSON-mode is normalized before extraction: `parseStructuredModeArguments()` always stamps `_source: 'file'` onto structured payloads, which later makes the save eligible for the JSON post-save review path. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:379-385`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-222`]
3. File-mode and inline/stdin JSON share the same downstream workflow; the only difference is whether Step 1 receives `preloadedData` and calls `normalizeInputData(...)` or loads from disk through `loadCollectedDataFromLoader(...)`. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:431-436`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:615-647`]
4. JSON-mode skips the captured-session enrichment branch entirely because `isCapturedSessionMode` is false when `_source === 'file'`; that means spec-folder/git enrichment is not part of the structured-input defect surface. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]
5. The extractor fan-out is explicitly parallel and consists of five concurrent branches: session-data assembly, conversations, decisions, diagrams, and workflow-flowchart generation. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1063`]
6. The lexical-decision fallback in `decision-extractor.ts` manufactures titles like `"observation decision 1"` and `"user decision 1"`, making that function an immediate suspect for defect D2’s generic placeholders. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:152-164`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:167-172`]
7. Trigger phrases are generated before rendering in the workflow, not in the post-save review or indexer; the workflow builds trigger source text from summary, decisions, file descriptions, and spec-folder tokens, filters them, and only then passes them into both the template and `indexMemory()`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1209-1299`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1845-1852`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-125`]
8. Post-save quality review is advisory only in the current pipeline: it detects mismatches after the markdown file is already written, prints findings, and logs a score penalty hint, but it does not patch or block the saved file. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419`]
9. Semantic indexing is strictly post-write and policy-gated; duplicate skips, failed validation disposition, missing embeddings, or index-policy decisions can all prevent a saved file from entering the vector store even after the markdown exists on disk. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1825-1875`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:79-97`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-181`]
10. The actual source layout differs from the prompt’s assumed `scripts/src/...` paths, so future iterations should inspect `scripts/memory`, `scripts/core`, `scripts/extractors`, and `scripts/renderers` as the canonical source tree for this runtime. [CITATION: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:52-57`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:24-27`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:21-22`]

## Open questions discovered
- D1 likely sits after extraction and before or during rendering, but this pass did not isolate whether truncation originates in `collectSessionData()` summary generation, `generateImplementationSummary()`, or a template-level field contraction. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1019`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1080-1132`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1311-1327`]
- D3 could originate in either workflow pre-extraction (`extractTriggerPhrases` + folder token merge) or the indexer’s fallback trigger extraction, so the next pass should compare those two trigger sources against the broken files. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1209-1299`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-137`]
- D4 may involve frontmatter rendering versus metadata block generation, but this iteration only confirmed that the post-save reviewer checks for mismatch after save; it did not yet identify both writers. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-290`]

## Next focus recommendation
Iteration 2 should trace defect D1 by following the overview/summary text fields end to end: `normalizeInputData(...)` inputs, `collectSessionData()` summary construction, any semantic-summary helpers in Step 7.5, the specific mustache fields used by `context_template.md`, and any cleanup/validation stage that could clip content before write. The fastest win is to compare where a long `sessionSummary` or `SUMMARY` string is first shortened versus where the final rendered `OVERVIEW` anchor is emitted. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:617-636`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:856-860`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1080-1132`, `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:176-205`]
