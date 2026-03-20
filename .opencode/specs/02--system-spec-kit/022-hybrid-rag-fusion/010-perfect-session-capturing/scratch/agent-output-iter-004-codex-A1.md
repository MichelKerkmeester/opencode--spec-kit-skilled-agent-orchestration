OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d0a29-1ff7-7942-8264-1d5b86386199
--------
user
# Role: Code Auditor (A1) — Iteration 004

## Mission
Trace how description enrichment (phases 006, 014) interacts with quality scoring and whether fallback text degrades search.

## Research Question
**Q12.** How does description enrichment (phases 006, 014) interact with quality scoring? Is fallback text degrading search?

## Files to Examine
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` — How quality scorer uses descriptions
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` — Description enrichment in the pipeline
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` — How descriptions affect indexing
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` — Where descriptions are collected
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` (if exists) — Per-folder description generation
- Search for "description" and "fallback" in the scripts directory

## Known Context
- Per-folder descriptions remain short heading/problem/first-line extractions
- Frontmatter can still fall back to generic continuation text ("continued work on...")
- Phase 006: improved description quality and scoring
- Phase 014: made per-folder description + filename/index infra reliable

## Deliverable
1. Trace the description data flow: Where is it generated? Where is it consumed for scoring? For indexing?
2. Find the fallback text patterns — what exact strings are used when real descriptions aren't available?
3. Measure: What percentage of code paths could produce fallback descriptions?
4. Assess: Does a fallback description lower quality score? Does it degrade search relevance?
5. Find any code that detects and flags generic/fallback descriptions
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: cocoindex_code starting
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’ll audit the description pipeline end-to-end by reading the listed files and then quantifying where fallback descriptions can be produced. I’m starting with a fast code search for `description` and `fallback` across the `system-spec-kit` scripts and MCP search code.
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
codex
I found the governing `AGENTS.md` at repo root (no deeper override for these paths), so I’m now tracing each target file directly and mapping where descriptions are created, transformed, scored, and indexed.
exec
/bin/zsh -lc 'ls -la .opencode/skill/system-spec-kit/scripts/extractors' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
total 648
drwxr-xr-x@ 21 michelkerkmeester  staff    672 Mar 20 08:28 .
drwxr-xr-x@ 34 michelkerkmeester  staff   1088 Mar 19 19:58 ..
-rw-r--r--@  1 michelkerkmeester  staff   2367 Mar 18 18:35 README.md
-rw-r--r--@  1 michelkerkmeester  staff  22664 Mar 19 22:44 claude-code-capture.ts
-rw-r--r--@  1 michelkerkmeester  staff  13613 Mar 19 20:16 codex-cli-capture.ts
-rw-r--r--@  1 michelkerkmeester  staff  38056 Mar 20 08:28 collect-session-data.ts
-rw-r--r--@  1 michelkerkmeester  staff   9504 Mar 19 20:16 contamination-filter.ts
-rw-r--r--@  1 michelkerkmeester  staff  10294 Mar 19 20:12 conversation-extractor.ts
-rw-r--r--@  1 michelkerkmeester  staff  13277 Mar 19 20:16 copilot-cli-capture.ts
-rw-r--r--@  1 michelkerkmeester  staff  23910 Mar 19 20:12 decision-extractor.ts
-rw-r--r--@  1 michelkerkmeester  staff   8350 Mar 19 20:13 diagram-extractor.ts
-rw-r--r--@  1 michelkerkmeester  staff  17840 Mar 19 20:12 file-extractor.ts
-rw-r--r--@  1 michelkerkmeester  staff  11901 Mar 19 20:16 gemini-cli-capture.ts
-rw-r--r--@  1 michelkerkmeester  staff  19747 Mar 19 20:16 git-context-extractor.ts
-rw-r--r--@  1 michelkerkmeester  staff  15683 Mar 16 12:04 implementation-guide-extractor.ts
-rw-r--r--@  1 michelkerkmeester  staff   1887 Mar 16 22:22 index.ts
-rw-r--r--@  1 michelkerkmeester  staff  28272 Mar 19 20:12 opencode-capture.ts
-rw-r--r--@  1 michelkerkmeester  staff   7853 Mar 19 21:54 quality-scorer.ts
-rw-r--r--@  1 michelkerkmeester  staff   9406 Mar 19 20:16 session-activity-signal.ts
exec
/bin/zsh -lc 'ls -la .opencode/skill/system-spec-kit/scripts/core' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
total 408
drwxr-xr-x@ 16 michelkerkmeester  staff    512 Mar 20 08:26 .
drwxr-xr-x@ 34 michelkerkmeester  staff   1088 Mar 19 19:58 ..
-rw-r--r--@  1 michelkerkmeester  staff   2430 Mar 18 18:34 README.md
-rw-r--r--@  1 michelkerkmeester  staff  13403 Mar 19 21:46 config.ts
-rw-r--r--@  1 michelkerkmeester  staff  10195 Mar 15 07:57 file-writer.ts
-rw-r--r--@  1 michelkerkmeester  staff   1232 Mar 15 07:57 index.ts
-rw-r--r--@  1 michelkerkmeester  staff   7890 Mar 18 21:04 memory-indexer.ts
-rw-r--r--@  1 michelkerkmeester  staff  13195 Mar 19 21:44 quality-scorer.ts
-rw-r--r--@  1 michelkerkmeester  staff   7868 Mar 15 07:57 subfolder-utils.ts
-rw-r--r--@  1 michelkerkmeester  staff   2259 Mar 16 19:46 topic-extractor.ts
-rw-r--r--@  1 michelkerkmeester  staff   2932 Mar 15 07:57 tree-thinning.d.ts
-rw-r--r--@  1 michelkerkmeester  staff   1318 Mar 11 20:29 tree-thinning.d.ts.map
-rw-r--r--@  1 michelkerkmeester  staff   7226 Mar 13 21:57 tree-thinning.js
-rw-r--r--@  1 michelkerkmeester  staff   3985 Mar 11 20:29 tree-thinning.js.map
-rw-r--r--@  1 michelkerkmeester  staff   9587 Mar 16 12:04 tree-thinning.ts
-rw-r--r--@  1 michelkerkmeester  staff  98490 Mar 20 08:26 workflow.ts
exec
/bin/zsh -lc 'ls -la .opencode/skill/system-spec-kit/mcp_server/lib/search' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
total 1608
drwxr-xr-x@ 52 michelkerkmeester  staff   1664 Mar 19 14:00 .
drwxr-xr-x@ 31 michelkerkmeester  staff    992 Mar 19 14:20 ..
-rw-r--r--@  1 michelkerkmeester  staff  46098 Mar 19 19:24 README.md
-rw-r--r--@  1 michelkerkmeester  staff   6971 Mar 15 07:57 anchor-metadata.ts
-rw-r--r--@  1 michelkerkmeester  staff  11716 Mar 15 07:57 artifact-routing.ts
-rw-r--r--@  1 michelkerkmeester  staff  12229 Mar 15 07:57 auto-promotion.ts
-rw-r--r--@  1 michelkerkmeester  staff  13536 Mar 15 07:57 bm25-index.ts
-rw-r--r--@  1 michelkerkmeester  staff  11543 Mar 19 14:00 causal-boost.ts
-rw-r--r--@  1 michelkerkmeester  staff   6293 Mar 15 07:57 channel-enforcement.ts
-rw-r--r--@  1 michelkerkmeester  staff   7036 Mar 15 07:57 channel-representation.ts
-rw-r--r--@  1 michelkerkmeester  staff   7080 Mar 15 07:57 confidence-truncation.ts
-rw-r--r--@  1 michelkerkmeester  staff   7662 Mar 15 07:57 context-budget.ts
-rw-r--r--@  1 michelkerkmeester  staff  17735 Mar 15 07:57 cross-encoder.ts
-rw-r--r--@  1 michelkerkmeester  staff   3685 Mar 15 07:57 dynamic-token-budget.ts
-rw-r--r--@  1 michelkerkmeester  staff  13760 Mar 15 07:57 embedding-expansion.ts
-rw-r--r--@  1 michelkerkmeester  staff   4196 Mar 15 07:57 encoding-intent.ts
-rw-r--r--@  1 michelkerkmeester  staff  20263 Mar 15 07:57 entity-linker.ts
-rw-r--r--@  1 michelkerkmeester  staff   8687 Mar 15 07:57 evidence-gap-detector.ts
-rw-r--r--@  1 michelkerkmeester  staff   5844 Mar 15 07:57 feedback-denylist.ts
codex
I’ve confirmed all target files exist, including `folder-discovery.ts`. Next I’m extracting every `description`/`fallback` occurrence to build a concrete flow map and fallback inventory.
exec
/bin/zsh -lc 'rg -n "description|fallback|continued work|generic" .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:806:  // Prevents a random last exchange from becoming the memory's entire description.
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:51:  | 'generic_title'
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:56:  | 'has_fallback_decision'
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:209:  // 3. File descriptions populated (0-20 points)
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:217:    const descriptionQualityAverage = files.reduce((sum, file) => sum + getDescriptionQualityScore(file), 0) / files.length;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:218:    breakdown.fileDescriptions = Math.round(descriptionQualityAverage * 20);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:219:    if (descriptionQualityAverage < 0.5) {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:221:      warnings.push(`${files.length - filesWithDesc.length}/${files.length} files missing descriptions`);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:235:    qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:237:    warnings.push('Primary memory title is generic — long output still lacks specificity');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:239:    qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:241:    warnings.push('Primary memory title is generic — medium-length output lacks specificity');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:243:    qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:245:    warnings.push('Primary memory title is generic — short output lacks specificity');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:291:      warnings.push('Observation titles remain too generic — semantic diversity reduced');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:333:    { id: 'file_descriptions', score01: breakdown.fileDescriptions / 20, score100: breakdown.fileDescriptions, maxScore100: 20, passed: files.length === 0 || breakdown.fileDescriptions / 20 >= 0.5 },
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:557:  const fallback = readableFolder.length > 0 ? `${readableFolder} session ${_date}` : `Session ${_date}`;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:558:  return truncateMemoryTitle(fallback);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:740:function readNumber(source: Record<string, unknown> | null | undefined, fallback: number, ...keys: string[]): number {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:742:    return fallback;
exec
/bin/zsh -lc 'rg -n "description|fallback|continued work|generic" .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
4:// Feature catalog: Spec folder description discovery
15: * Describes a single spec folder with its cached description
20:  description: string;
26: * Top-level cache structure written to descriptions.json.
36: * Per-folder description stored as `description.json` inside each spec folder.
41:  folderSlug: string;           // Slugified name e.g. "spec-descriptions"
232:        // Also check description.json mtime so aggregate cache staleness
233:        // Detects per-folder description edits (CHK-024 / REQ-008).
235:          const descPath = path.join(discoveredFolder.folderPath, 'description.json');
257: * Extract a short 1-sentence description from spec.md content.
268: * @returns A 1-sentence description string, or empty string for empty input.
339: * Extract significant keywords from a description string.
346: * @param description - A description string to extract keywords from.
349:export function extractKeywords(description: string): string[] {
350:  if (!description || typeof description !== 'string') {
354:  const lower = description.toLowerCase();
383: *   in its keywords or description (case-insensitive)
412:    const descLower = folder.description.toLowerCase();
416:      // Keywords set lookup is O(1); description substring is fallback for partial matches
421:      // Fall back to substring match in description
exec
/bin/zsh -lc 'rg -n "description|fallback|continued work|generic" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/README.md:3:description: "Current script inventory and execution flow for system-spec-kit scripts."
.opencode/skill/system-spec-kit/scripts/README.md:47:- `spec-folder/` - 5 TypeScript modules (`generate-description.ts`, `folder-detector.ts`, `alignment-validator.ts`, `directory-setup.ts`, `index.ts`)
.opencode/skill/system-spec-kit/scripts/loaders/README.md:3:description: "Data loader modules that normalize input from JSON files or native CLI capture, then hard-stop when no usable session data exists."
.opencode/skill/system-spec-kit/scripts/loaders/README.md:45:3. Native capture fallback order:
.opencode/skill/system-spec-kit/scripts/kpi/README.md:3:description: "Shell-based quality KPI reporter that scans memory files for placeholders, fallback content, AI contamination and missing trigger phrases."
.opencode/skill/system-spec-kit/scripts/kpi/README.md:69:- **stderr** -- One-line summary: `KPI Summary: files=N, placeholder=N%, fallback=N%, contamination=N%, empty_trigger=N%`
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:4:  "description": "Spec Kit Script Registry - Centralized catalog of all scripts for dynamic discovery",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:11:      "description": "Generate memory files with ANCHOR format for Spec Kit Memory indexing",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:28:      "description": "Force full embedding reindex across memory docs, specs, and constitutional files",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:45:      "description": "Validate spec folder contents against documentation level requirements",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:62:      "description": "Completion Verification Rule enforcement - verify checklist items are complete before claiming done",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:79:      "description": "Upgrade existing spec folders to higher documentation levels with backup and rollback. Post-upgrade: AI must auto-populate injected placeholder content from existing spec context",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:96:      "description": "Validate spec folder exists and contains required files for its level",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:112:      "description": "Calculate percentage of template placeholders replaced with real content",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:129:      "description": "Test runner for validate-spec.sh against fixture spec folders",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:145:      "description": "Create new spec folders with appropriate templates based on documentation level",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:150:        "required": "Feature description",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:162:      "description": "Recommend documentation level based on task complexity factors",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:178:      "description": "Move completed spec folders to archive, keeping specs/ directory clean",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:195:      "description": "Repository and branch utilities - get_repo_root(), get_current_branch()",
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts | sed -n '1,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Quality Scorer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. QUALITY SCORER
     7	// ───────────────────────────────────────────────────────────────
     8	// Scores the quality of generated memory files based on multiple criteria
     9	
    10	import {
    11	  isContaminatedMemoryName,
    12	  isGenericContentTask,
    13	  normalizeMemoryNameCandidate,
    14	  pickBestContentName,
    15	} from '../utils/slug-utils';
    16	import {
    17	  getDescriptionTierRank,
    18	  type DescriptionTier,
    19	  validateDescription,
    20	} from '../utils/file-helpers';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '500,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   500	      DESCRIPTION: mergeNote,
   501	      ACTION: 'Merged',
   502	      _synthetic: true,
   503	    };
   504	
   505	    const idx = reducedFiles.push(syntheticEntry) - 1;
   506	    const updatedIndices = indicesByParent.get(parentDir) ?? [];
   507	    updatedIndices.push(idx);
   508	    indicesByParent.set(parentDir, updatedIndices);
   509	  }
   510	
   511	  return reducedFiles;
   512	}
   513	
   514	function normalizeMemoryTitleCandidate(raw: string): string {
   515	  return raw
   516	    .replace(/\s+/g, ' ')
   517	    .trim()
   518	    .replace(/[\s\-:;,]+$/, '');
   519	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1080,1335p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1080	    title,
  1081	    content,
  1082	    triggerPhrases,
  1083	    files,
  1084	    observations,
  1085	    decisions,
  1086	    outcomes,
  1087	    nextAction,
  1088	    blockers,
  1089	    recentContext,
  1090	  } = params;
  1091	
  1092	  const meaningfulBlockers = typeof blockers === 'string'
  1093	    && blockers.trim().length > 0
  1094	    && !/^none$/i.test(blockers.trim())
  1095	    ? [blockers.trim()]
  1096	    : [];
  1097	
  1098	  return {
  1099	    title,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1580,1705p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1580	      // Count-based severity escalation: mass low-severity matches indicate
  1581	      // pervasive contamination that warrants a higher penalty
  1582	      if (hadContamination && contaminationMaxSeverity === 'low' && extractorRemovedPhraseCount >= 10) {
  1583	        contaminationMaxSeverity = 'medium';
  1584	      }
  1585	    }
  1586	
  1587	    // Step 3.5: Enrich stateless data with spec folder and git context
  1588	    if (isStatelessMode) {
  1589	      log('Step 3.5: Enriching stateless data...');
  1590	      collectedData = await enrichStatelessData(collectedData, specFolder, CONFIG.PROJECT_ROOT);
  1591	      log('   Enrichment complete');
  1592	
  1593	      // RC-4: Post-enrichment alignment re-check — enrichment can introduce
  1594	      // New foreign content (e.g., git context from other spec folders).
  1595	      // Re-verify alignment at a lower threshold (10%) to catch this.
  1596	      // Uses resolved specFolder (not raw activeSpecFolderArg) for accurate keyword matching.
  1597	      if (specFolder && (collectedData.observations || collectedData.FILES)) {
  1598	        const alignmentTargetsPost = await resolveAlignmentTargets(specFolder);
  1599	
exec
/bin/zsh -lc 'rg -n "continued work|No specific decisions|Development session|description|fallback|_provenance|validateDescription|quality" .opencode/skill/system-spec-kit/scripts/core/workflow.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
25:import { scoreMemoryQuality } from './quality-scorer';
43:} from '../extractors/quality-scorer';
48:} from '../memory/validate-memory-quality';
135:    /** Quality score (0-100) from the quality scorer. */
136:    qualityScore: number;
155:  qualityScore01: number;
156:  qualityAbortThreshold: number;
179:  if (options.qualityScore01 < options.qualityAbortThreshold) {
182:      reason: 'Rendered memory fell below the minimum quality threshold, so semantic indexing was skipped.',
557:  const fallback = readableFolder.length > 0 ? `${readableFolder} session ${_date}` : `Session ${_date}`;
558:  return truncateMemoryTitle(fallback);
740:function readNumber(source: Record<string, unknown> | null | undefined, fallback: number, ...keys: string[]): number {
742:    return fallback;
752:  return fallback;
755:function readString(source: Record<string, unknown> | null | undefined, fallback: string, ...keys: string[]): string {
757:    return fallback;
767:  return fallback;
829:  const fallbackType = inferMemoryType(sessionData.CONTEXT_TYPE, sessionData.IMPORTANCE_TIER);
832:    readString(collectedData, fallbackType, 'memory_type', 'memoryType'),
899:  const fallbackFingerprint = crypto
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1860,2335p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1860	      activeDataFile
  1861	    );
  1862	
  1863	    if (allowSpecTitleFallback) {
  1864	      if (specTitle.length >= 8) {
  1865	        enrichedTask = specTitle;
  1866	        log(`   Enriched task from spec.md: "${enrichedTask}"`);
  1867	      }
  1868	    }
  1869	
  1870	  const preferredMemoryTask = pickPreferredMemoryTask(
  1871	    enrichedTask || '',
  1872	    specTitle,
  1873	    folderBase,
  1874	    [
  1875	      sessionData.QUICK_SUMMARY || '',
  1876	      sessionData.TITLE || '',
  1877	      sessionData.SUMMARY || '',
  1878	    ],
  1879	    allowSpecTitleFallback
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Indexer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. MEMORY INDEXER
     7	// ───────────────────────────────────────────────────────────────
     8	// Handles persisting memory files to the vector index: embedding generation,
     9	// Database storage, metadata updates, and DB-change notifications.
    10	
    11	import * as fs from 'fs/promises';
    12	import * as fsSync from 'fs';
    13	import * as path from 'path';
    14	
    15	import { structuredLog } from '../utils';
    16	import { generateDocumentEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
    17	import { vectorIndex } from '@spec-kit/mcp-server/api/search';
    18	import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
    19	import { extractTriggerPhrases } from '../lib/trigger-extractor';
    20	import type { CollectedDataFull } from '../extractors/collect-session-data';
codex
I’ve now mapped the workflow/quality scorer sections; next I’m checking the collector and folder-discovery code for exact fallback strings and then computing how many branches can emit fallback descriptions.
exec
/bin/zsh -lc 'rg -n "DESCRIPTION|description|fallback|continued work|No specific|generic|validateDescription|Recent commit|Updated code|first line|summary" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
211:    PREFLIGHT_GAPS: preflight?.gaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
266:    GAPS_CLOSED: postflight?.gapsClosed?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
267:    NEW_GAPS: postflight?.newGaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? []
322:  let summary: string = parts.join('. ') + '.';
325:    summary += ' Overall: Highly productive learning session.';
327:    summary += ' Overall: Good learning session with meaningful progress.';
329:    summary += ' Overall: Moderate learning session.';
332:  return summary;
364:    // If explicit JSON data has summary + decisions + next steps, session is complete
465:            TASK_DESCRIPTION: taskDesc,
487:                TASK_DESCRIPTION: taskDesc,
502:      TASK_DESCRIPTION: nextAction,
511:  summary: string,
535:  if (summary &&
536:      summary.length > 30 &&
537:      !summary.includes('SIMULATION') &&
538:      !summary.includes('[response]')) {
539:    const trimmed = summary.substring(0, 200);
540:    parts.push(`**Summary:** ${trimmed}${summary.length > 200 ? '...' : ''}`);
583:  summary: string;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '720,980p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   720	      skillVersion: CONFIG.SKILL_VERSION
   721	    });
   722	  }
   723	
   724	  const data: CollectedDataFull = { ...collectedData };
   725	  const sessionId: string = generateSessionId();
   726	  const channel: string = getChannel();
   727	  const sessionInfo = data.recentContext?.[0] || {};
   728	
   729	  // Phase 1B: Extract explicit session and git metadata from JSON payload
   730	  const sessionMeta = (data as Record<string, unknown>).session as
   731	    { sessionId?: string; messageCount?: number; toolCount?: number; nextAction?: string; lastAction?: string; duration?: string; blockers?: string } | undefined;
   732	  const gitMeta = (data as Record<string, unknown>).git as
   733	    { headRef?: string; commitRef?: string; repositoryState?: string; isDetachedHead?: boolean } | undefined;
   734	
   735	  let observations: Observation[] = data.observations || [];
   736	  if (observations.length > CONFIG.MAX_OBSERVATIONS) {
   737	    // Prioritize followup observations (nextSteps) before truncation
   738	    const followups = observations.filter(o => o.type === 'followup');
   739	    const others = observations.filter(o => o.type !== 'followup');
exec
/bin/zsh -lc "rg -n \"function extractFilesFromData|DESCRIPTION|description|Recent commit|modified|updated|fallback\" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
211:    PREFLIGHT_GAPS: preflight?.gaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
266:    GAPS_CLOSED: postflight?.gapsClosed?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
267:    NEW_GAPS: postflight?.newGaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? []
465:            TASK_DESCRIPTION: taskDesc,
487:                TASK_DESCRIPTION: taskDesc,
502:      TASK_DESCRIPTION: nextAction,
555:    items.push({ CONTEXT_ITEM: `Files modified: ${fileList}` });
806:  // Prevents a random last exchange from becoming the memory's entire description.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
/bin/zsh -lc 'rg -n "DESCRIPTION|description|fallback|continued work|updated code|recent commit|placeholder|generic|validateDescription|_provenance" .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
8:// Extracts file references, descriptions, and observation types from session data
18:  validateDescription,
47:  description: string;
113:    description: string;
116:    _provenance?: DescriptionProvenance;
126:    description: string,
153:    const cleaned = cleanDescription(description);
154:    const cleanedTierRank = getDescriptionTierRank(validateDescription(cleaned).tier);
155:    const nextProvenance = provenance ?? existing?._provenance;
162:      // Merge: always prefer a more specific action when the existing one is generic
164:      const mergedProvenance = nextProvenance || existing._provenance;
166:      const existingTierRank = getDescriptionTierRank(validateDescription(existing.description).tier);
170:        || (cleanedTierRank === existingTierRank && cleaned.length > existing.description.length)
172:        // Better description available — use it, and merge action/provenance
174:          description: cleaned,
177:          ...(mergedProvenance ? { _provenance: mergedProvenance } : {}),
181:        // Keep existing description, but still merge action and provenance if newer
184:          || (mergedProvenance && mergedProvenance !== existing._provenance)
191:            ...(mergedProvenance ? { _provenance: mergedProvenance } : {}),
198:        description: cleaned || 'Modified during session',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts | sed -n '1,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: File Extractor
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. FILE EXTRACTOR
     7	// ───────────────────────────────────────────────────────────────
     8	// Extracts file references, descriptions, and observation types from session data
     9	
    10	import { CONFIG } from '../core';
    11	import { coerceFactToText, coerceFactsToText } from '../utils/fact-coercion';
    12	import {
    13	  toCanonicalRelativePath,
    14	  toRelativePath,
    15	  cleanDescription,
    16	  isDescriptionValid,
    17	  getDescriptionTierRank,
    18	  validateDescription,
    19	} from '../utils/file-helpers';
    20	import { getPathBasename } from '../utils/path-utils';
exec
/bin/zsh -lc 'rg -n "validateDescription|isDescriptionValid|placeholder|activity-only|semantic|high-confidence|Modified during session|Recent commit|generic|fallback|continued work" .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
12:export type DescriptionTier = 'placeholder' | 'activity-only' | 'semantic' | 'high-confidence';
20:  placeholder: 0,
21:  'activity-only': 1,
22:  semantic: 2,
23:  'high-confidence': 3,
33:  /^\[placeholder\]/i,
121:function validateDescription(description: string): DescriptionValidationResult {
124:    return { tier: 'placeholder', normalized: normalizeDescriptionForValidation(description) };
131:    return { tier: 'placeholder', normalized };
135:    return { tier: 'activity-only', normalized };
140:    return { tier: 'high-confidence', normalized };
144:    tier: normalized.length >= 16 ? 'semantic' : 'activity-only',
149:function isDescriptionValid(description: string): boolean {
150:  return getDescriptionTierRank(validateDescription(description).tier) > getDescriptionTierRank('placeholder');
177:  validateDescription,
178:  isDescriptionValid,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: File Helpers
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. FILE HELPERS
     7	// ───────────────────────────────────────────────────────────────
     8	// Path normalization, description cleaning, and file categorization utilities
     9	
    10	import { posix as pathPosix } from 'node:path';
    11	
    12	export type DescriptionTier = 'placeholder' | 'activity-only' | 'semantic' | 'high-confidence';
    13	
    14	export interface DescriptionValidationResult {
    15	  tier: DescriptionTier;
    16	  normalized: string;
    17	}
    18	
    19	const DESCRIPTION_TIER_ORDER: Record<DescriptionTier, number> = {
    20	  placeholder: 0,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '240,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '440,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   240	        } catch (_error: unknown) {
   241	          // Description.json may not exist yet — ignore.
   242	        }
   243	      } catch (_error: unknown) {
   244	        // Ignore unreadable spec.md entries during staleness probing.
   245	      }
   246	    }
   247	  }
   248	
   249	  return { latestMtime, specFolders };
   250	}
   251	
   252	// ───────────────────────────────────────────────────────────────
   253	// 3. DESCRIPTION EXTRACTION
   254	// ───────────────────────────────────────────────────────────────
   255	
   256	/**
   257	 * Extract a short 1-sentence description from spec.md content.
   258	 *
   259	 * Strategy (in order):
 succeeded in 0ms:
   440	// 6. CACHE GENERATION
   441	// ───────────────────────────────────────────────────────────────
   442	
   443	/**
   444	 * Scan spec base paths for spec.md files and generate a
   445	 * DescriptionCache by extracting descriptions from each.
   446	 *
   447	 * - Uses synchronous file I/O — this is a build-time/cache generation
   448	 *   function, NOT a hot path.
   449	 * - Expects specsBasePaths to be absolute paths to directories that
   450	 *   contain spec folder subdirectories (e.g., the `specs/` root).
   451	 * - A spec folder is any direct child directory of a base path
   452	 *   that contains a `spec.md` file.
   453	 * - Nested spec folders (phase subfolders) are also discovered if
   454	 *   they contain a `spec.md`.
   455	 *
   456	 * @param specsBasePaths - Array of absolute directory paths to scan.
   457	 * @returns A fully populated DescriptionCache.
   458	 */
   459	export function generateFolderDescriptions(specsBasePaths: string[]): DescriptionCache {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '560,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   560	      }
   561	    }
   562	  }
   563	}
   564	
   565	/**
   566	 * Internal helper: read spec.md and produce a FolderDescription.
   567	 * Returns null if content is unreadable or description is empty.
   568	 *
   569	 * @param folderPath  - Absolute path to the spec folder directory.
   570	 * @param specMdPath  - Absolute path to the spec.md file within folderPath.
   571	 * @param timestamp   - ISO timestamp to set as lastUpdated.
   572	 * @returns A FolderDescription, or null if extraction fails.
   573	 */
   574	function _processSpecFolder(
   575	  basePath: string,
   576	  folderPath: string,
   577	  specMdPath: string,
   578	  timestamp: string,
   579	): FolderDescription | null {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '338,436p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   338	/**
   339	 * Extract significant keywords from a description string.
   340	 *
   341	 * - Lowercases all words
   342	 * - Splits on non-alphanumeric boundaries
   343	 * - Filters stop words and words shorter than 3 characters
   344	 * - Deduplicates
   345	 *
   346	 * @param description - A description string to extract keywords from.
   347	 * @returns Deduplicated array of significant lowercase keywords.
   348	 */
   349	export function extractKeywords(description: string): string[] {
   350	  if (!description || typeof description !== 'string') {
   351	    return [];
   352	  }
   353	
   354	  const lower = description.toLowerCase();
   355	  const words = lower.match(/\b[a-z0-9][a-z0-9-]*[a-z0-9]\b|\b[a-z0-9]{3,}\b/g) || [];
   356	
   357	  const seen = new Set<string>();
exec
/bin/zsh -lc 'rg -n "continued work on|continued work|Development session|Session focused on implementing and testing features|Modified during session|description pending|No specific decisions were made|Recent commit:|tracked file history snapshot" .opencode/skill/system-spec-kit' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:198:        description: cleaned || 'Modified during session',
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:211:      const description = fileInfo.DESCRIPTION || fileInfo.description || 'Modified during session';
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:225:      addFile(fileInfo.path, fileInfo.changes_summary || 'Modified during session', 'Modified');
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:233:        addFile(file, 'Modified during session');
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:242:              addFile(file, 'Modified during session');
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:290:        DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:317:        DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:449:        : `Recent commit: ${entry.action} in repository history`;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:817:    || 'Session focused on implementing and testing features.';
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:840:    || 'Development session';
.opencode/skill/system-spec-kit/scripts/kpi/README.md:82:| Fallback rate | Contains phrases like "No specific decisions were made" |
.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:476:  let task: string = 'Development session';
.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:496:  if (task === 'Development session' && questionMessages.length > 0) {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:84:    MESSAGES: [{ TIMESTAMP: '2026-03-06T09:00:00Z', ROLE: 'User', CONTENT: 'Development session', TOOL_CALLS: [] }],
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:208:        userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:00:00Z' }],
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:214:      userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:01:00Z' }],
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:229:    task: 'Development session',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:442:  'Development session',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:475:    expect(shouldEnrichTaskFromSpecTitle('Development session', 'file', null)).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:476:    expect(shouldEnrichTaskFromSpecTitle('Development session', 'opencode-capture', '/tmp/context.json')).toBe(false);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts | sed -n '380,500p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   380	      : [];
   381	    const changeScores = new Map(
   382	      Array.from(parseStatScores(projectRoot, revCount > 0 ? getDiffOutput(projectRoot, revCount, '--stat') : '').entries())
   383	        .filter(([filePath]) => matchesSpecFolder(filePath, specScope))
   384	    );
   385	    const logArgs = [
   386	      'log',
   387	      '--name-only',
   388	      `--format=${COMMIT_ENTRY_SEPARATOR}%H%n%cI%n%s%n%b%n${COMMIT_FILES_SEPARATOR}`,
   389	      '--since=24 hours ago',
   390	      `-${MAX_COMMITS}`,
   391	    ];
   392	    const commits = revCount > 0
   393	      ? parseCommits(projectRoot, runGitCommand(projectRoot, logArgs))
   394	        .map((commit) => ({
   395	          ...commit,
   396	          files: commit.files.filter((filePath) => matchesSpecFolder(filePath, specScope)),
   397	        }))
   398	        .filter((commit) => commit.files.length > 0)
   399	      : [];
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '330,530p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   330	    return observation.facts.some((fact) => {
   331	      if (typeof fact !== 'string') {
   332	        return false;
   333	      }
   334	
   335	      return /^Next:\s+/i.test(fact) || /^Follow-up:\s+/i.test(fact);
   336	    });
   337	  });
   338	}
   339	
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
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts | sed -n '80,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    80	 * Determine whether a file path is a memory file.
    81	 * Memory files live under any directory segment named "memory".
    82	 */
    83	export function isMemoryFile(filePath: string): boolean {
    84	  const normalized = filePath.replace(/\\/g, '/');
    85	  return normalized.includes('/memory/');
    86	}
    87	
    88	/**
    89	 * Derive the parent path from a child path by stripping the last segment.
    90	 * Returns null for top-level files (no parent directory component).
    91	 */
    92	export function deriveParentPath(filePath: string): string | null {
    93	  const normalized = filePath.replace(/\\/g, '/');
    94	  const segments = normalized.split('/').filter(Boolean);
    95	  if (segments.length <= 1) {
    96	    return null;
    97	  }
    98	  segments.pop();
    99	  return segments.join('/');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Quality Scorer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. QUALITY SCORER
     7	// ───────────────────────────────────────────────────────────────
     8	// Computes deterministic quality score and flags for rendered memories
     9	
    10	import type {
    11	  QualityDimensionScore,
    12	  QualityFlag,
    13	  QualityScoreResult,
    14	} from '../core/quality-scorer';
    15	import type { ContaminationSeverity } from './contamination-filter';
    16	
    17	/* ───────────────────────────────────────────────────────────────
    18	   1. INTERFACES & CONSTANTS
    19	------------------------------------------------------------------*/
    20	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ---------------------------------------------------------------
     3	// MODULE: Validate Memory Quality
     4	// ---------------------------------------------------------------
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. VALIDATE MEMORY QUALITY
     7	// ───────────────────────────────────────────────────────────────
     8	// Post-render quality gate for generated memory files
     9	
    10	import fs from 'fs';
    11	import path from 'path';
    12	import { structuredLog } from '../utils/logger';
    13	import type { ContaminationAuditRecord } from '../lib/content-filter';
    14	import type { DataSource } from '../utils/input-normalizer';
    15	import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';
    16	
    17	type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';
    18	
    19	type ValidationRuleSeverity = 'low' | 'medium' | 'high';
    20	type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';
exec
/bin/zsh -lc 'rg -n "FALLBACK_DECISION_REGEX|V4|fallback decision|No specific decisions" .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
17:type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';
63:  V4: {
64:    ruleId: 'V4',
154:const FALLBACK_DECISION_REGEX = /No (specific )?decisions were made/i;
489:  const hasFallbackDecision = FALLBACK_DECISION_REGEX.test(content);
491:    ruleId: 'V4',
493:    message: hasFallbackDecision ? 'fallback decision text present' : 'ok',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '430,530p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   430	  const indexBlockingRuleIds = failedRules.filter((ruleId) => shouldBlockIndex(ruleId, source));
   431	  if (indexBlockingRuleIds.length > 0) {
   432	    return {
   433	      disposition: 'write_skip_index',
   434	      blockingRuleIds: [],
   435	      indexBlockingRuleIds,
   436	      softRuleIds: failedRules.filter((ruleId) => !indexBlockingRuleIds.includes(ruleId)),
   437	    };
   438	  }
   439	
   440	  return {
   441	    disposition: 'write_and_index',
   442	    blockingRuleIds: [],
   443	    indexBlockingRuleIds: [],
   444	    softRuleIds: [...failedRules],
   445	  };
   446	}
   447	
   448	function hasExecutionSignals(content: string): boolean {
   449	  return EXECUTION_SIGNAL_PATTERNS.some((pattern) => pattern.test(content));
exec
/bin/zsh -lc 'rg -n "deriveMemoryDescription|MEMORY_DESCRIPTION|continued work on|continued work|summary missing|fallback" .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/loaders/README.md:45:3. Native capture fallback order:
.opencode/skill/system-spec-kit/scripts/kpi/README.md:3:description: "Shell-based quality KPI reporter that scans memory files for placeholders, fallback content, AI contamination and missing trigger phrases."
.opencode/skill/system-spec-kit/scripts/kpi/README.md:69:- **stderr** -- One-line summary: `KPI Summary: files=N, placeholder=N%, fallback=N%, contamination=N%, empty_trigger=N%`
.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh:47:        # Pattern 5: Anchored inline fallback
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:82:      'has_fallback_decision',
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:115:      qualityFlags.add('has_fallback_decision');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:56:  | 'has_fallback_decision'
.opencode/skill/system-spec-kit/shared/types.ts:208:   * - `'fallback'` — best-effort score from degraded search path
.opencode/skill/system-spec-kit/shared/types.ts:214:   * `'rrf'`, `'cross-encoder'`, `'fallback'`.
.opencode/skill/system-spec-kit/shared/types.ts:216:  scoringMethod?: 'vector' | 'bm25' | 'hybrid' | 'rrf' | 'cross-encoder' | 'fallback';
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:18:const fallbackRegex = /No (specific )?decisions were made/i;
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:68:  fallback: 0,
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:76:  if (fallbackRegex.test(content)) totals.fallback += 1;
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:88:    fallbackRate: rate(totals.fallback),
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:96:console.error(`KPI Summary: files=${totals.total}, placeholder=${output.rates.placeholderRate}%, fallback=${output.rates.fallbackRate}%, contamination=${output.rates.contaminationRate}%, empty_trigger=${output.rates.emptyTriggerPhrasesRate}%`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:35:import { deriveMemoryDescription } from '../utils/memory-frontmatter';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:557:  const fallback = readableFolder.length > 0 ? `${readableFolder} session ${_date}` : `Session ${_date}`;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:558:  return truncateMemoryTitle(fallback);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:740:function readNumber(source: Record<string, unknown> | null | undefined, fallback: number, ...keys: string[]): number {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:742:    return fallback;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Frontmatter
     3	// ---------------------------------------------------------------
     4	// Shared helpers for memory-specific frontmatter quality.
     5	
     6	import { extractTriggerPhrases } from '../lib/trigger-extractor';
     7	
     8	export const GENERIC_MEMORY_DESCRIPTION = 'Session context memory template for Spec Kit indexing.';
     9	export const LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES = [
    10	  'memory dashboard',
    11	  'session summary',
    12	  'context template',
    13	];
    14	
    15	const GENERIC_MEMORY_DESCRIPTION_NORMALIZED = GENERIC_MEMORY_DESCRIPTION.toLowerCase();
    16	const TITLE_CLEANUP_RE = /\s+/g;
    17	
    18	function stripMarkdownNoise(value: string): string {
    19	  return value
    20	    .replace(/<!--[\s\S]*?-->/g, ' ')
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Generate Description
     3	// ───────────────────────────────────────────────────────────────
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. GENERATE DESCRIPTION
     7	// ───────────────────────────────────────────────────────────────
     8	// CLI: Generate Per-Folder description.json
     9	// Usage: node generate-description.js <folder-path> <base-path> [--description "text"]
    10	//
    11	// If --description is provided, uses it directly + keyword extraction.
    12	// Otherwise reads spec.md via generatePerFolderDescription().
    13	
    14	import * as path from 'node:path';
    15	import * as fs from 'node:fs';
    16	import {
    17	  generatePerFolderDescription,
    18	  savePerFolderDescription,
    19	  loadPerFolderDescription,
    20	  extractKeywords,
exec
/bin/zsh -lc "rg -n \"enhancedFiles|effectiveFiles|reduceMemoryTree|enhanceFilesWithSemanticDescriptions|_provenance|FILES:\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
21:  enhanceFilesWithSemanticDescriptions,
203:function ensureMinSemanticTopics(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
214:  const fileTokens = enhancedFiles
223:function ensureMinTriggerPhrases(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
696:function buildKeyFiles(effectiveFiles: FileChange[], specFolderPath: string): Array<{ FILE_PATH: string }> {
697:  const explicitKeyFiles = effectiveFiles
1052:  _provenance?: string;
1118:      provenance: typeof observation._provenance === 'string' ? observation._provenance : undefined,
1221:            file._provenance = 'git';
1629:        FILES: filesList.map((file) => ({
1819:  const enhancedFiles: FileChange[] = enhanceFilesWithSemanticDescriptions(
1835:  const thinFileInputs: ThinningFileEntry[] = enhancedFiles.map((f) => ({
1840:  const effectiveFiles = applyThinningToFileChanges(enhancedFiles, thinningResult);
1841:  const fileRowsReduced = Math.max(0, enhancedFiles.length - effectiveFiles.length);
1897:  const keyTopics: string[] = ensureMinSemanticTopics(keyTopicsInitial, effectiveFiles, specFolderName);
1921:    effectiveFiles.forEach(f => {
1961:    preExtractedTriggers = ensureMinTriggerPhrases(preExtractedTriggers, effectiveFiles, specFolderName);
1968:  const keyFiles = buildKeyFiles(enhancedFiles, specFolder);
1983:      FILES: effectiveFiles,
1984:      HAS_FILES: effectiveFiles.length > 0,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1760,1855p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1760	
  1761	  // Patch TOOL_COUNT for enriched stateless saves so V7 does not flag
  1762	  // Synthetic file paths as contradictory with zero tool usage.
  1763	  // RC-9 fix: Guard against NaN/undefined TOOL_COUNT before any comparison.
  1764	  if (!Number.isFinite(sessionData.TOOL_COUNT)) {
  1765	    sessionData.TOOL_COUNT = 0;
  1766	  }
  1767	  const enrichedFileCount = collectedData.FILES?.length ?? 0;
  1768	  const captureToolEvidenceCount = typeof collectedData._toolCallCount === 'number'
  1769	    && Number.isFinite(collectedData._toolCallCount)
  1770	    ? collectedData._toolCallCount
  1771	    : 0;
  1772	  const inferredToolCount = Math.max(enrichedFileCount, captureToolEvidenceCount);
  1773	  if (isStatelessMode && sessionData.TOOL_COUNT === 0 && inferredToolCount > 0) {
  1774	    sessionData.TOOL_COUNT = inferredToolCount;
  1775	  }
  1776	
  1777	  // Step 7.5: Generate semantic implementation summary
  1778	  log('Step 7.5: Generating semantic summary...');
  1779	
exec
/bin/zsh -lc 'rg -n "function extractFileChanges|description|Modified during session|fallback|Updated code|changed" .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
44:  description: string;
59:  description: string;
200:function extractFileChanges(messages: SemanticMessage[], observations: SemanticObservation[] = []): Map<string, FileChangeInfo> {
205:    modified: /(?:modified|edited|changed|updated|Edit\()/i,
249:          const fallbackIndex: number = content.indexOf(filePath);
250:          if (fallbackIndex === -1) continue;
251:          const contextStart: number = Math.max(0, fallbackIndex - 100);
252:          const contextEnd: number = Math.min(content.length, fallbackIndex + filePath.length + 200);
254:          const description: string = extractChangeDescription(context, filePath);
257:            fileChanges.set(filePath, { action, description, changes: [], mentions: 1 });
268:        const description: string = extractChangeDescription(context, filePath);
273:            description,
281:            if (description.length > existing.description.length) {
282:              existing.description = description;
299:          const description: string = extractChangeDescription(narrative, file);
302:            description: description,
320:// This version has 3 additional patterns (/^changed?$/i, /^no description available$/i, /^modified?$/i)
322:function isDescriptionValid(description: string): boolean {
323:  if (!description || description.length < 8) return false;
333:    /^changed?$/i,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | sed -n '180,370p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   180	    const type: MessageType = classifyMessage(content);
   181	    const bucket = classified.get(type);
   182	    if (bucket) bucket.push({
   183	      ...msg,
   184	      _semanticType: type,
   185	    });
   186	  }
   187	
   188	  return classified;
   189	}
   190	
   191	// ───────────────────────────────────────────────────────────────
   192	// 5. FILE CHANGE EXTRACTION
   193	// ───────────────────────────────────────────────────────────────
   194	function findFilePosition(content: string, filePath: string, searchFrom: number = 0): number {
   195	  const searchContent: string = content.substring(searchFrom);
   196	  const index: number = searchContent.indexOf(filePath);
   197	  return index === -1 ? -1 : searchFrom + index;
   198	}
   199	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | sed -n '370,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   370	  }
   371	
   372	  const withPatterns: RegExp[] = [
   373	    /with\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
   374	    /to\s+(?:add|apply|integrate|include|remove|fix|enhance|validate)\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
   375	    /for\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
   376	    /replaced\s+(.{5,40})\s+with\s+(.{5,40})/i,
   377	  ];
   378	
   379	  for (const pattern of withPatterns) {
   380	    const match: RegExpMatchArray | null = safeContext.match(pattern);
   381	    if (match && match[1]) {
   382	      let desc: string = match[1].trim();
   383	      if (match[2]) {
   384	        desc = `Replaced ${match[1].trim()} with ${match[2].trim()}`;
   385	      }
   386	      if (desc.includes(filePath) || desc.includes(filename)) continue;
   387	      desc = cleanDescription(desc);
   388	      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && !/^(the|a|an)\s/i.test(desc)) {
   389	        return desc;
exec
/bin/zsh -lc "rg -n \"hasMeaningfulFileDescription|PLACEHOLDER_FILE_PATTERNS|files\\.|meaningful file|evidenceCounts\" .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
51:const PLACEHOLDER_FILE_PATTERNS = [
111:  evidenceCounts: MemorySufficiencyEvidenceCounts;
181:function hasMeaningfulFileDescription(file: MemoryEvidenceFile): boolean {
187:  if (PLACEHOLDER_FILE_PATTERNS.some((pattern) => pattern.test(description))) {
309:    if (hasMeaningfulFileDescription(file)) {
393:    evidenceCounts: counts,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	    currentBody.push(trimmed);
   261	  }
   262	
   263	  flush();
   264	  return sections;
   265	}
   266	
   267	function isMeaningfulSection(section: { heading: string; body: string }): boolean {
   268	  const heading = normalizeWhitespace(section.heading);
   269	  if (!hasSemanticSubstance(section.body, 100, 16)) {
   270	    return false;
   271	  }
   272	
   273	  if (heading.length > 0 && !GENERIC_SECTION_PATTERNS.some((pattern) => pattern.test(heading))) {
   274	    return true;
   275	  }
   276	
   277	  return hasConcreteSignals(section.body);
   278	}
   279	
exec
/bin/zsh -lc "rg -n \"indexMemory\\(|embeddingSections|buildWeightedDocumentSections|WeightedDocumentSections|files:\\s*effectiveFiles|MEMORY_DESCRIPTION\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts .opencode/skill/system-spec-kit/shared/index* .opencode/skill/system-spec-kit/shared/index/*.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
zsh:1: no matches found: .opencode/skill/system-spec-kit/shared/index/*.ts
codex
I hit a shell glob miss while tracing embedding-section construction; I’m rerunning that search with safe path quoting to map exactly how file descriptions enter index embeddings.
exec
/bin/zsh -lc "rg -n \"indexMemory\\(|embeddingSections|buildWeightedDocumentSections|WeightedDocumentSections|MEMORY_DESCRIPTION|buildWeightedDocumentText\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:22:import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:54:async function indexMemory(
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:61:  embeddingSections: WeightedDocumentSections | null = null,
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:64:  const weightedEmbeddingInput = buildWeightedDocumentText(
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:65:    embeddingSections ?? {
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:126:  const memoryId: number = vectorIndex.indexMemory({
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2041:      MEMORY_DESCRIPTION: memoryDescription,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2383:        const embeddingSections = buildWeightedEmbeddingSections(implSummary, files[ctxFilename]);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2384:        memoryId = await indexMemory(
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2391:          embeddingSections
.opencode/skill/system-spec-kit/shared/index.ts:70:export type { WeightedDocumentSections } from './embeddings';
.opencode/skill/system-spec-kit/shared/index.ts:90:  buildWeightedDocumentText,
.opencode/skill/system-spec-kit/shared/embeddings.ts:25:export interface WeightedDocumentSections {
.opencode/skill/system-spec-kit/shared/embeddings.ts:147:function buildGeneralWeightedBlock(sections: WeightedDocumentSections): string {
.opencode/skill/system-spec-kit/shared/embeddings.ts:152:function buildDecisionWeightedBlock(sections: WeightedDocumentSections): string {
.opencode/skill/system-spec-kit/shared/embeddings.ts:156:function buildOutcomeWeightedBlock(sections: WeightedDocumentSections): string {
.opencode/skill/system-spec-kit/shared/embeddings.ts:160:function buildTitleWeightedBlock(sections: WeightedDocumentSections): string {
.opencode/skill/system-spec-kit/shared/embeddings.ts:209:function buildWeightedDocumentText(
.opencode/skill/system-spec-kit/shared/embeddings.ts:210:  sections: WeightedDocumentSections,
.opencode/skill/system-spec-kit/shared/embeddings.ts:760:  buildWeightedDocumentText,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2336,2425p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2336	    log(`  - ${filename} (${lines} lines)`);
  2337	  }
  2338	  log();
  2339	  log('Summary:');
  2340	  log(`  - ${conversations.MESSAGES.length} messages captured`);
  2341	  log(`  - ${decisions.DECISIONS.length} key decisions documented`);
  2342	  log(`  - ${diagrams.DIAGRAMS.length} diagrams preserved`);
  2343	  log(`  - Session duration: ${sessionData.DURATION}\n`);
  2344	
  2345	  // Step 11: Semantic memory indexing
  2346	  log('Step 11: Indexing semantic memory...');
  2347	
  2348	  let memoryId: number | null = null;
  2349	  let indexingStatus: WorkflowIndexingStatus | null = null;
  2350	  const persistIndexingStatus = async (
  2351	    status: IndexingStatusValue,
  2352	    reason?: string,
  2353	    errorMessage?: string
  2354	  ): Promise<void> => {
  2355	    indexingStatus = {
exec
/bin/zsh -lc "rg -n \"function buildWeightedEmbeddingSections|buildWeightedEmbeddingSections\\(\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
2383:        const embeddingSections = buildWeightedEmbeddingSections(implSummary, files[ctxFilename]);
exec
/bin/zsh -lc 'rg -n "buildWeightedEmbeddingSections" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:718:function buildWeightedEmbeddingSections(
.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:761:  buildWeightedEmbeddingSections,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:58:  buildWeightedEmbeddingSections,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2383:        const embeddingSections = buildWeightedEmbeddingSections(implSummary, files[ctxFilename]);
codex
I’ve confirmed indexing uses `buildWeightedEmbeddingSections(...)` from `semantic-summarizer`; I’m checking that function now to verify whether fallback descriptions propagate into embedding text or only frontmatter/trigger fields.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | sed -n '680,780p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   680	      ? (headings[index + 1].index ?? markdown.length)
   681	      : markdown.length;
   682	    const content = markdown.slice(contentStart, end).trim();
   683	
   684	    return {
   685	      content,
   686	      start,
   687	      end,
   688	    };
   689	  }
   690	
   691	  return null;
   692	}
   693	
   694	function extractSectionBullets(sectionContent: string): string[] {
   695	  return sectionContent
   696	    .split('\n')
   697	    .map((line) => line.trim())
   698	    .filter((line) => /^[-*]\s+/.test(line))
   699	    .map((line) => line.replace(/^[-*]\s+/, '').trim())
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | sed -n '468,680p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   468	function generateImplementationSummary(messages: SemanticMessage[], observations: SemanticObservation[] = []): ImplementationSummary {
   469	  const classified: Map<MessageType, SemanticMessage[]> = classifyMessages(messages);
   470	  const fileChanges: Map<string, FileChangeInfo> = extractFileChanges(messages, observations);
   471	  const decisions: ExtractedDecision[] = extractDecisions(messages);
   472	
   473	  const intentMessages: SemanticMessage[] = classified.get(MESSAGE_TYPES.INTENT) ?? [];
   474	  const questionMessages: SemanticMessage[] = classified.get(MESSAGE_TYPES.QUESTION) ?? [];
   475	
   476	  let task: string = 'Development session';
   477	
   478	  if (intentMessages.length > 0) {
   479	    const firstIntent: string = intentMessages[0].prompt || intentMessages[0].content || '';
   480	    const taskPatterns: RegExp[] = [
   481	      /^(?:I want to|I need to|Please|Help me)\s+(.{15,120}?)(?:[.!?\n]|$)/i,
   482	      /(?:implement|create|add|build|fix|improve)\s+(.{10,100}?)(?:[.!?\n]|$)/i,
   483	      /^(.{20,120}?)(?:[.!?\n]|$)/,
   484	    ];
   485	
   486	    for (const pattern of taskPatterns) {
   487	      const match: RegExpMatchArray | null = firstIntent.match(pattern);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env bash
     2	# ───────────────────────────────────────────────────────────────
     3	# SCRIPT: Quality KPI
     4	# Computes memory quality KPI rates and prints JSON + summary
     5	# ───────────────────────────────────────────────────────────────
     6	set -euo pipefail
     7	
     8	ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
     9	TARGET_SPEC_FOLDER="${1:-}"
    10	
    11	node - "$ROOT_DIR" "$TARGET_SPEC_FOLDER" <<'NODE'
    12	const fs = require('fs');
    13	const path = require('path');
    14	
    15	const rootDir = process.argv[2];
    16	const specFolderArg = process.argv[3];
    17	
    18	const fallbackRegex = /No (specific )?decisions were made/i;
    19	const contaminationRegex = /\b(I'll execute this step by step|Let me analyze|I'll now|Step\s+\d+:|Let me check|I need to|I'll start by)\b/i;
    20	
exec
/bin/zsh -lc "rg -n \"Modified during session|Recent commit:|Uncommitted:|Session focused on implementing and testing features\\.|Development session|Session context preserved for future continuation\\.|\\|\\|\\s*'["'^'"']*'\" .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts:121:  return 'Session context preserved for future continuation.';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:203:    decisionText = decisionItem.decision || decisionItem.title || 'Unknown decision';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:372:    FILE_PATH: (file.FILE_PATH || file.path || '') as string,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:373:    DESCRIPTION: (file.DESCRIPTION || file.description || 'Modified during session') as string,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:469:        filePath = entry.path || '';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:470:        changesSummary = entry.changes_summary || '';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:475:        const basename = filePath.replace(/\\/g, '/').split('/').pop()?.replace(/\.[^.]+$/, '') || '';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:521:    prompt: sessionSummary || 'Manual context save',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:526:    request: sessionSummary || 'Manual context save',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:527:    learning: sessionSummary || ''
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:650:  const toolName = tool.tool || 'unknown';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:658:  const filePath = input.filePath || input.file_path || input.path || '';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:683:      return shortPath ? `Bash ${shortPath}` : (desc || cmd || outputSummary || 'Bash command');
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:839:    matchesSpecAffinityText([exchange.userInput || '', exchange.assistantResponse || ''].join(' '), specAffinityTargets)
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:878:      title: tool.title || '',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:879:      output: tool.output || '',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:924:    prompt: ex.userInput || '',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1052:          || matchesSpecAffinityText([ex.userInput || '', ex.assistantResponse || ''].join(' '), specAffinityTargets);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1089:    request: contextExchanges[0].userInput || sessionTitle || 'OpenCode session',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1090:    learning: contextExchanges[contextExchanges.length - 1]?.assistantResponse || ''
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/embeddings.ts | sed -n '1,290p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Embeddings
     3	// ---------------------------------------------------------------
     4	// Feature catalog: Hybrid search pipeline
     5	
     6	// Node stdlib
     7	import crypto from 'crypto';
     8	
     9	// Internal modules
    10	import { createEmbeddingsProvider, getProviderInfo, validateApiKey, VALIDATION_TIMEOUT_MS } from './embeddings/factory';
    11	import { semanticChunk, MAX_TEXT_LENGTH, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH } from './chunking';
    12	import type {
    13	  IEmbeddingProvider,
    14	  EmbeddingCacheStats,
    15	  LazyLoadingStats,
    16	  BatchEmbeddingOptions,
    17	  ProviderMetadata,
    18	  ProviderInfo,
    19	  ApiKeyValidationResult,
    20	  TaskPrefixMap,
exec
/bin/zsh -lc "rg -n \"Phase 006|phase 006|Phase 014|phase 014|F-06|F-14|description enrichment|per-folder description|description\\.json\" .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:36: * Per-folder description stored as `description.json` inside each spec folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:232:        // Also check description.json mtime so aggregate cache staleness
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:233:        // Detects per-folder description edits (CHK-024 / REQ-008).
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:235:          const descPath = path.join(discoveredFolder.folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:472:      const descPath = path.join(discoveredFolder.folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:474:      // Prefer per-folder description.json if fresh and non-empty. Blank-description edge
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:540: * F-39: Batch repair stale description.json files.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:630: * Preserves memorySequence and memoryNameHistory from existing description.json.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:673:  // Preserve existing tracking data if description.json already exists
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:692: * Load a PerFolderDescription from `description.json` in the given folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:699:  const descPath = path.join(folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:747: * Save a PerFolderDescription to `description.json` using atomic write.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:761:  const descPath = path.join(folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:783: * Check whether a per-folder description.json is stale.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:784: * Compares description.json mtime vs spec.md mtime.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:785: * Missing description.json = stale.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:788: * @returns true if description.json is missing or older than spec.md.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:791:  const descPath = path.join(folderPath, 'description.json');
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:811:  // F-14: Runtime guards — validate capture shape before processing
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:234:  const descriptionDoc = readFileSafe(path.join(resolvedSpecFolderPath, 'description.json'));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import { describe, expect, it } from 'vitest';
     2	
     3	import { scoreMemoryQuality } from '../core/quality-scorer';
     4	import { extractFilesFromData } from '../extractors/file-extractor';
     5	import { deriveModificationMagnitude } from '../extractors/git-context-extractor';
     6	import { validateDescription } from '../utils/file-helpers';
     7	
     8	function buildContent(title: string): string {
     9	  return [
    10	    '---',
    11	    `title: "${title}"`,
    12	    '---',
    13	    '',
    14	    `# ${title}`,
    15	    '',
    16	    ...Array.from({ length: 24 }, (_, index) => `Evidence line ${index + 1} for file-description quality scoring.`),
    17	  ].join('\n');
    18	}
    19	
    20	describe('description enrichment', () => {
exec
/bin/zsh -lc "rg -n \"extractDescription|description\\.json|fallback to folder name|blank-description|perFolderFresh|findRelevantFolders\" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:36: * Per-folder description stored as `description.json` inside each spec folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:232:        // Also check description.json mtime so aggregate cache staleness
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:235:          const descPath = path.join(discoveredFolder.folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:270:export function extractDescription(specContent: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:394:export function findRelevantFolders(
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:472:      const descPath = path.join(discoveredFolder.folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:474:      // Prefer per-folder description.json if fresh and non-empty. Blank-description edge
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:477:      const perFolderFresh = perFolder && !isPerFolderDescriptionStale(discoveredFolder.folderPath);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:478:      if (perFolderFresh && perFolder.description.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:493:      if (descExists && (!perFolderFresh || (perFolder && perFolder.description.trim().length === 0))) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:514:      } else if (perFolderFresh) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:540: * F-39: Batch repair stale description.json files.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:588:  const rawDescription = extractDescription(content);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:630: * Preserves memorySequence and memoryNameHistory from existing description.json.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:657:  const description = extractDescription(content);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:673:  // Preserve existing tracking data if description.json already exists
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:692: * Load a PerFolderDescription from `description.json` in the given folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:699:  const descPath = path.join(folderPath, 'description.json');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:747: * Save a PerFolderDescription to `description.json` using atomic write.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:761:  const descPath = path.join(folderPath, 'description.json');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts | sed -n '590,780p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   590	
   591	/* ═══════════════════════════════════════════════════════════════
   592	   7. Per-Folder Description Integration
   593	   ═══════════════════════════════════════════════════════════════ */
   594	
   595	describe('PI-B3: Per-folder description preference', () => {
   596	  let tmpDir: string;
   597	
   598	  beforeEach(() => {
   599	    tmpDir = createTempWorkspace();
   600	  });
   601	
   602	  afterEach(() => {
   603	    cleanup(tmpDir);
   604	  });
   605	
   606	  it('T046-22: uses per-folder description.json when fresh', () => {
   607	    const specsDir = path.join(tmpDir, 'specs');
   608	    const specDir = createSpecFolder(tmpDir, '001-auth', '# Authentication System');
   609	
exec
/bin/zsh -lc "rg -n \"folder name|slug|fallback|empty|extractDescription\\('---|returns ''|spec.md has no\" .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
23:  slugifyFolderName,
57:  it('handles empty string input', () => {
93:  it('returns empty string for frontmatter-only content', () => {
94:    expect(extractDescription('---\ntitle: X\n---')).toBe('');
150:  it('handles empty string input', () => {
219:  it('returns empty array for a query with no keyword matches', () => {
244:  it('handles empty query gracefully', () => {
249:    const emptyCache: DescriptionCache = { version: 1, generated: '', folders: [] };
250:    expect(findRelevantFolders('memory search', emptyCache)).toEqual([]);
393:  it('returns empty folders array for empty base paths list', () => {
553:  it('parentChain is empty array for root folders', () => {
598:  it('memoryNameHistory is initially empty', () => {
689:    const emptyDir = path.join(tmpDir2, '005-empty');
690:    fs.mkdirSync(emptyDir, { recursive: true });
692:    const result = generatePerFolderDescription(emptyDir, tmpDir2);
926:  it('accepts empty arrays for optional array fields', () => {
999:describe('F14: slugifyFolderName', () => {
1000:  it('strips numeric prefix and slugifies', () => {
1001:    expect(slugifyFolderName('009-spec-descriptions')).toBe('spec-descriptions');
1005:    expect(slugifyFolderName('my-folder')).toBe('my-folder');
codex
I’m now validating the enrichment source itself (`spec-folder-extractor`/`git-context-extractor`) so we can distinguish real description upgrades from placeholder replacements and quantify where generic text still leaks through.
exec
/bin/zsh -lc "rg -n \"FILES|DESCRIPTION|summary|triggerPhrases|decisions|fallback|description pending|Modified during session|_provenance|spec-folder\" .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
31:    _provenance: 'spec-folder';
34:  FILES: Array<{ FILE_PATH: string; DESCRIPTION: string; _provenance: 'spec-folder' }>;
36:  summary: string;
37:  triggerPhrases: string[];
38:  decisions: Array<{ title: string; rationale: string; chosen: string; _provenance: 'spec-folder' }>;
180:  const files: SpecFolderExtraction['FILES'] = [];
182:  const triggerPhrases = dedupe([
186:  const summary = cleanText(
197:    if (filePath) files.push({ FILE_PATH: filePath, DESCRIPTION: cleanText(rawDescription), _provenance: 'spec-folder' });
208:      _provenance: 'spec-folder',
212:  return { summary, triggerPhrases, files, observations };
217:  const summary = cleanText(getSection(body, /^##\s+\d+\.\s+SUMMARY/i));
223:  return { summary, phaseTitle, nextActions };
247:function parseDecisionDoc(content: string | null): SpecFolderExtraction['decisions'] {
280:    return title && chosen ? { title, rationale, chosen, _provenance: 'spec-folder' as const } : null;
281:  }).filter((entry): entry is SpecFolderExtraction['decisions'][number] => Boolean(entry));
315:  const decisions = parseDecisionDoc(readDoc(specFolderPath, 'decision-record.md'));
317:  const summary = cleanText([
320:    spec.summary,
321:    plan.summary,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts | sed -n '300,410p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts | sed -n '150,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   150	function getSubsection(content: string, headingPattern: RegExp): string {
   151	  const lines = content.split('\n');
   152	  const start = lines.findIndex((line) => headingPattern.test(line));
   153	  if (start < 0) return '';
   154	  let end = lines.length;
   155	  for (let i = start + 1; i < lines.length; i++) {
   156	    if (/^###\s+/.test(lines[i]) || /^##\s+/.test(lines[i])) {
   157	      end = i;
   158	      break;
   159	    }
   160	  }
   161	  return lines.slice(start + 1, end).join('\n').trim();
   162	}
   163	
   164	function normalizeFilePath(rawPath: string): string {
   165	  const cleaned = rawPath.replace(/`/g, '').trim();
   166	  if (!cleaned) return '';
   167	  return toCanonicalRelativePath(cleaned, CONFIG.PROJECT_ROOT);
   168	}
   169	
 succeeded in 0ms:
   300	
   301	export async function extractSpecFolderContext(specFolderPath: string): Promise<SpecFolderExtraction> {
   302	  const descriptionRaw = readDoc(specFolderPath, 'description.json');
   303	  let description: Record<string, unknown> = {};
   304	  if (descriptionRaw) {
   305	    try {
   306	      description = JSON.parse(descriptionRaw) as Record<string, unknown>;
   307	    } catch {
   308	      description = {};
   309	    }
   310	  }
   311	  const spec = parseSpecDoc(readDoc(specFolderPath, 'spec.md'));
   312	  const plan = parsePlanDoc(readDoc(specFolderPath, 'plan.md'));
   313	  const tasks = parseTasksDoc(readDoc(specFolderPath, 'tasks.md'));
   314	  const checklist = parseChecklistDoc(readDoc(specFolderPath, 'checklist.md'));
   315	  const decisions = parseDecisionDoc(readDoc(specFolderPath, 'decision-record.md'));
   316	
   317	  const summary = cleanText([
   318	    String(description.title || description.name || ''),
   319	    String(description.description || ''),
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/historical-memory-remediation.ts | sed -n '580,700p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   580	  lines.splice(sectionEnd, 0, '', '<!-- /ANCHOR:metadata -->');
   581	
   582	  return lines.join('\n');
   583	}
   584	
   585	function requiresAuthoritativeRegeneration(issues: HistoricalIssue[]): boolean {
   586	  return issues.includes('malformed_frontmatter')
   587	    || issues.includes('raw_mustache_literal')
   588	    || issues.includes('literal_anchor_example');
   589	}
   590	
   591	function isLowSignalMemory(body: string, title: string | null): boolean {
   592	  const summary = extractSummary(body) || '';
   593	  const totalMessages = extractMetric(body, 'Total Messages');
   594	  const toolExecutions = extractMetric(body, 'Tool Executions');
   595	  const decisionsMade = extractMetric(body, 'Decisions Made');
   596	  const normalizedTitle = sanitizeMemoryFrontmatterTitle(title);
   597	
   598	  if (
   599	    totalMessages !== null &&
exec
/bin/zsh -lc 'rg -n "modified during session|recent commit|fallback data|placeholder|session focused on implementing and testing features|development session|memory dashboard|context template|session summary" .opencode/skill/system-spec-kit/shared/trigger-extractor.ts .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:64:  'placeholder data',
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:65:  'fallback data',
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:69:  'placeholder',
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:138:  'placeholder',
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:168:  const placeholderHits = PLACEHOLDER_INDICATORS.filter((indicator) => lowerText.includes(indicator));
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:169:  return placeholderHits.length >= 2;
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:50:  'placeholder', 'simulation', 'simulated', 'fallback', 'unknown',
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:182:  'simulation', 'placeholder', 'fallback', 'mock', 'stub', 'fake',
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:217:    /\b(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\s+(mode|data|value|state|behavior|response|output|result|content)\b/gi,
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:218:    /\b(mode|data|value|state|behavior|response|output|result|content)\s+(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\b/gi,
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:544:  const placeholderIndicators: string[] = [
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:547:    'placeholder data',
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:548:    'fallback data',
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:554:  const placeholderCount = placeholderIndicators.filter(p => lowerText.includes(p)).length;
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:555:  if (placeholderCount >= 2) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/trigger-extractor.ts | sed -n '520,575p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   520	    const words = candidate.phrase.split(' ');
   521	    return !words.every((word: string) => STOP_WORDS_TECH.has(word));
   522	  });
   523	}
   524	
   525	// ---------------------------------------------------------------
   526	// 12. MAIN EXTRACTION
   527	// ---------------------------------------------------------------
   528	
   529	/**
   530	 * Extract trigger phrases from memory content using TF-IDF + N-gram hybrid
   531	 * with problem, technical, and decision pattern extraction.
   532	 * Implements FR-012. Performance: <100ms for typical content (<10KB).
   533	 */
   534	export function extractTriggerPhrases(text: string): string[] {
   535	  if (!text || typeof text !== 'string') {
   536	    return [];
   537	  }
   538	
   539	  if (text.length < CONFIG.MIN_CONTENT_LENGTH) {
exec
/bin/zsh -lc "rg -n \"STOP_WORDS_TECH|stop words|modified|session|commit|recent\" .opencode/skill/system-spec-kit/shared/trigger-extractor.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
20:/** Defines stop words english. */
37:/** Defines stop words tech. */
38:export const STOP_WORDS_TECH: Set<string> = new Set([
54:/** Defines stop words artifacts. */
58:  'created', 'modified', 'updated', 'version', 'date', 'author',
125:/** Filter out stop words (preserves __break__ markers) */
291:    if (!seen.has(funcName) && funcName.length >= 4 && !STOP_WORDS_TECH.has(funcName)) {
375:    /\b(memory|context|trigger|session|spec|workflow|semantic|search|index)\s+([a-z]{3,})\b/gi,
517:/** Filter out phrases composed entirely of tech stop words */
521:    return !words.every((word: string) => STOP_WORDS_TECH.has(word));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/trigger-extractor.ts | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Trigger Extractor
     3	// ---------------------------------------------------------------
     4	// Feature catalog: Trigger phrase matching (memory_match_triggers)
     5	
     6	import type {
     7	  TriggerConfig,
     8	  TriggerPhrase,
     9	  NgramCount,
    10	  ScoredNgram,
    11	  ExtractionStats,
    12	  ExtractionBreakdown,
    13	  ExtractionResult,
    14	} from './types';
    15	
    16	// ---------------------------------------------------------------
    17	// 1. STOP WORD LISTS
    18	// ---------------------------------------------------------------
    19	
    20	/** Defines stop words english. */
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '130,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   130	    messageCount: number;
   131	    /** Number of decisions extracted. */
   132	    decisionCount: number;
   133	    /** Number of diagrams extracted. */
   134	    diagramCount: number;
   135	    /** Quality score (0-100) from the quality scorer. */
   136	    qualityScore: number;
   137	    /** Whether the data originated from a simulation rather than a live session. */
   138	    isSimulation: boolean;
   139	  };
   140	}
   141	
   142	const CODE_FENCE_SEGMENT_RE = /(```[\s\S]*?```)/g;
   143	const WORKFLOW_HTML_COMMENT_RE = /<!--(?!\s*\/?ANCHOR:)[\s\S]*?-->/g;
   144	const WORKFLOW_DANGEROUS_HTML_BLOCK_RE = /<(?:iframe|math|noscript|object|script|style|svg|template)\b[^>]*>[\s\S]*?<\/(?:iframe|math|noscript|object|script|style|svg|template)>/gi;
   145	const WORKFLOW_BLOCK_HTML_TAG_RE = /<\/?(?:article|aside|blockquote|body|br|dd|details|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|summary|table|tbody|td|th|thead|tr|ul)\b[^>]*\/?>/gi;
   146	const WORKFLOW_INLINE_HTML_TAG_RE = /<\/?(?:code|em|i|kbd|small|span|strong|sub|sup|u)\b[^>]*\/?>/gi;
   147	const WORKFLOW_PRESERVED_ANCHOR_ID_RE = /<a id="[^"]+"><\/a>/gi;
   148	const WORKFLOW_ANY_HTML_TAG_RE = /<\/?\s*[A-Za-z][\w:-]*(?:\s[^<>]*?)?\s*\/?>/g;
   149	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '940,1010p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   940	      saveDescriptionCache(fresh, cachePath);
   941	    } catch (_error: unknown) {
   942	      // Cache write failure — still return the generated cache
   943	    }
   944	    return fresh;
   945	  } catch (_error: unknown) {
   946	    // Never throw — return null for graceful degradation
   947	    return null;
   948	  }
   949	}
   950	
   951	/**
   952	 * Discover the most relevant spec folder for a query.
   953	 * Orchestrates: ensureCache → findRelevantFolders → threshold check.
   954	 *
   955	 * @param query     - User search query.
   956	 * @param basePaths - Spec base directories.
   957	 * @param threshold - Minimum relevance score to accept (default 0.3).
   958	 * @returns The best-matching specFolder path, or null if none meets threshold.
   959	 */
exec
/bin/zsh -lc "rg -n \"continued work on|continued work\" .opencode/skill/system-spec-kit | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

codex
**Q12 Audit Results**

1. **Description Data Flow (Generate → Score → Index)**
1. Generation:
- File descriptions are collected via `collect-session-data` calling `extractFilesFromData` ([collect-session-data.ts:34](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:34), [file-extractor.ts:96](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:96)).
- Stateless enrichment upgrades short file descriptions from git (`desc.length < 20`) in workflow ([workflow.ts:1208](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1208)).
- Git context can synthesize descriptions when commit subjects are missing ([git-context-extractor.ts:438](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:438)).
- Per-folder descriptions are produced from `spec.md` heading/problem/first-line and cached in `description.json`; stale/corrupt entries fall back to spec extraction ([folder-discovery.ts:270](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:270), [folder-discovery.ts:459](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:459)).
1. Scoring:
- Quality scorer classifies each file description (`placeholder/activity-only/semantic/high-confidence`) and applies provenance weighting ([quality-scorer.ts:99](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:99), [quality-scorer.ts:122](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:122)).
- Placeholder/generic patterns are centrally defined in validator rules ([file-helpers.ts:26](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:26), [file-helpers.ts:121](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:121)).
- Workflow runs both v2 and canonical scorer before gating/indexing ([workflow.ts:2104](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2104), [workflow.ts:2183](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2183)).
1. Indexing:
- Embeddings are built from weighted sections, not raw frontmatter (`stripFrontmatter`), and include summary file descriptions in `general` ([semantic-summarizer.ts:718](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:718), [semantic-summarizer.ts:734](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:734), [memory-indexer.ts:64](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:64)).
- Trigger phrases for index metadata are pre-extracted and can include file descriptions ([workflow.ts:1921](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1921), [memory-indexer.ts:82](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:82)).
- Folder search relevance uses per-folder `description` + `keywords` with substring fallback matching ([folder-discovery.ts:394](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:394), [folder-discovery.ts:421](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:421)).

2. **Exact Fallback Text / Patterns**
- `'Modified during session'` ([file-extractor.ts:198](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:198)).
- `` `Recent commit: ${entry.action} in repository history` `` ([git-context-extractor.ts:449](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:449)).
- `` `Uncommitted: ${entry.action} during session` `` ([git-context-extractor.ts:442](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:442)).
- `` `Updated ${humanReadable}` `` semantic fallback ([semantic-summarizer.ts:418](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:418)).
- `'Session focused on implementing and testing features.'` summary fallback ([collect-session-data.ts:817](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:817)).
- `'Development session'` quick-summary fallback ([collect-session-data.ts:840](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:840)).
- `'Session context preserved for future continuation.'` frontmatter-description fallback ([memory-frontmatter.ts:121](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts:121)).
- Folder name fallback when spec text extraction is empty ([folder-discovery.ts:590](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:590)).
- Placeholder classifier patterns explicitly include `description pending`, `modified during session`, `tracked file history snapshot`, and `Recent commit: ... in repository history` ([file-helpers.ts:26](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:26)).
- Literal `"continued work on"` was not found in current codebase search.

3. **Measured Fallback-Capable Path Ratios (Static branch analysis)**
- `extractFilesFromData` source branches: fallback-capable in 4/4 source channels; unconditional fallback in 2/4 (`observations.files`, `observations.facts.files`) ([file-extractor.ts:207](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:207), [file-extractor.ts:229](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:229)).
- Git description synthesis: explicit fallback in 2/4 outcomes (50%) ([git-context-extractor.ts:440](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:440)).
- Frontmatter description derivation: hard fallback in 1/4 exit paths (25%) ([memory-frontmatter.ts:97](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts:97)).
- `SUMMARY` derivation in session collector: hard fallback in 1/3 branches (~33%) ([collect-session-data.ts:814](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:814)).
- Per-folder cache selection by state: only fresh+non-empty `description.json` avoids fallback; stale/blank/corrupt/missing states fall back (4/5 states = 80%) ([folder-discovery.ts:474](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:474), [folder-discovery.ts:504](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:504)).

4. **Impact Assessment**
- **Quality score:** Yes, fallback file descriptions are penalized. Placeholder-tier descriptions score `0` before weighting, directly reducing the `fileDescriptions` 0–20 component ([quality-scorer.ts:99](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:99), [quality-scorer.ts:217](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:217)).
- **Save/index gate:** Placeholder file descriptions can reduce sufficiency evidence; sufficiency failure blocks indexing/write progression ([memory-sufficiency.ts:181](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:181), [workflow.ts:172](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:172)).
- **Search relevance:** Yes, generic fallback descriptions can degrade semantic signal because they are injected into weighted embedding text ([semantic-summarizer.ts:734](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:734)).  
  Mitigation exists: trigger extractor filters many artifact/generic tokens ([trigger-extractor.ts:55](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:55)).
- **Frontmatter generic description fallback:** lower impact on embeddings because frontmatter is stripped in weighted-section construction ([semantic-summarizer.ts:722](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:722)).

5. **Code That Detects/Flags Generic or Fallback Descriptions**
- Central description classifier + tiers: [file-helpers.ts:121](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:121).
- Quality penalties/flags from description quality: [quality-scorer.ts:122](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:122), [quality-scorer.ts:219](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:219).
- Sufficiency placeholder-file rejection: [memory-sufficiency.ts:51](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:51), [memory-sufficiency.ts:309](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:309).
- Fallback-decision detector (separate, not file-description specific): [validate-memory-quality.ts:154](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:154), [validate-memory-quality.ts:489](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:489).
- KPI fallback-rate metric: [quality-kpi.sh:18](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:18), [quality-kpi.sh:76](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:76).
tokens used
177,605
**Q12 Audit Results**

1. **Description Data Flow (Generate → Score → Index)**
1. Generation:
- File descriptions are collected via `collect-session-data` calling `extractFilesFromData` ([collect-session-data.ts:34](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:34), [file-extractor.ts:96](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:96)).
- Stateless enrichment upgrades short file descriptions from git (`desc.length < 20`) in workflow ([workflow.ts:1208](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1208)).
- Git context can synthesize descriptions when commit subjects are missing ([git-context-extractor.ts:438](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:438)).
- Per-folder descriptions are produced from `spec.md` heading/problem/first-line and cached in `description.json`; stale/corrupt entries fall back to spec extraction ([folder-discovery.ts:270](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:270), [folder-discovery.ts:459](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:459)).
1. Scoring:
- Quality scorer classifies each file description (`placeholder/activity-only/semantic/high-confidence`) and applies provenance weighting ([quality-scorer.ts:99](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:99), [quality-scorer.ts:122](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:122)).
- Placeholder/generic patterns are centrally defined in validator rules ([file-helpers.ts:26](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:26), [file-helpers.ts:121](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:121)).
- Workflow runs both v2 and canonical scorer before gating/indexing ([workflow.ts:2104](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2104), [workflow.ts:2183](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2183)).
1. Indexing:
- Embeddings are built from weighted sections, not raw frontmatter (`stripFrontmatter`), and include summary file descriptions in `general` ([semantic-summarizer.ts:718](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:718), [semantic-summarizer.ts:734](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:734), [memory-indexer.ts:64](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:64)).
- Trigger phrases for index metadata are pre-extracted and can include file descriptions ([workflow.ts:1921](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1921), [memory-indexer.ts:82](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:82)).
- Folder search relevance uses per-folder `description` + `keywords` with substring fallback matching ([folder-discovery.ts:394](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:394), [folder-discovery.ts:421](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:421)).

2. **Exact Fallback Text / Patterns**
- `'Modified during session'` ([file-extractor.ts:198](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:198)).
- `` `Recent commit: ${entry.action} in repository history` `` ([git-context-extractor.ts:449](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:449)).
- `` `Uncommitted: ${entry.action} during session` `` ([git-context-extractor.ts:442](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:442)).
- `` `Updated ${humanReadable}` `` semantic fallback ([semantic-summarizer.ts:418](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:418)).
- `'Session focused on implementing and testing features.'` summary fallback ([collect-session-data.ts:817](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:817)).
- `'Development session'` quick-summary fallback ([collect-session-data.ts:840](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:840)).
- `'Session context preserved for future continuation.'` frontmatter-description fallback ([memory-frontmatter.ts:121](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts:121)).
- Folder name fallback when spec text extraction is empty ([folder-discovery.ts:590](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:590)).
- Placeholder classifier patterns explicitly include `description pending`, `modified during session`, `tracked file history snapshot`, and `Recent commit: ... in repository history` ([file-helpers.ts:26](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:26)).
- Literal `"continued work on"` was not found in current codebase search.

3. **Measured Fallback-Capable Path Ratios (Static branch analysis)**
- `extractFilesFromData` source branches: fallback-capable in 4/4 source channels; unconditional fallback in 2/4 (`observations.files`, `observations.facts.files`) ([file-extractor.ts:207](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:207), [file-extractor.ts:229](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:229)).
- Git description synthesis: explicit fallback in 2/4 outcomes (50%) ([git-context-extractor.ts:440](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:440)).
- Frontmatter description derivation: hard fallback in 1/4 exit paths (25%) ([memory-frontmatter.ts:97](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts:97)).
- `SUMMARY` derivation in session collector: hard fallback in 1/3 branches (~33%) ([collect-session-data.ts:814](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:814)).
- Per-folder cache selection by state: only fresh+non-empty `description.json` avoids fallback; stale/blank/corrupt/missing states fall back (4/5 states = 80%) ([folder-discovery.ts:474](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:474), [folder-discovery.ts:504](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:504)).

4. **Impact Assessment**
- **Quality score:** Yes, fallback file descriptions are penalized. Placeholder-tier descriptions score `0` before weighting, directly reducing the `fileDescriptions` 0–20 component ([quality-scorer.ts:99](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:99), [quality-scorer.ts:217](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:217)).
- **Save/index gate:** Placeholder file descriptions can reduce sufficiency evidence; sufficiency failure blocks indexing/write progression ([memory-sufficiency.ts:181](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:181), [workflow.ts:172](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:172)).
- **Search relevance:** Yes, generic fallback descriptions can degrade semantic signal because they are injected into weighted embedding text ([semantic-summarizer.ts:734](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:734)).  
  Mitigation exists: trigger extractor filters many artifact/generic tokens ([trigger-extractor.ts:55](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:55)).
- **Frontmatter generic description fallback:** lower impact on embeddings because frontmatter is stripped in weighted-section construction ([semantic-summarizer.ts:722](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:722)).

5. **Code That Detects/Flags Generic or Fallback Descriptions**
- Central description classifier + tiers: [file-helpers.ts:121](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:121).
- Quality penalties/flags from description quality: [quality-scorer.ts:122](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:122), [quality-scorer.ts:219](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:219).
- Sufficiency placeholder-file rejection: [memory-sufficiency.ts:51](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:51), [memory-sufficiency.ts:309](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:309).
- Fallback-decision detector (separate, not file-description specific): [validate-memory-quality.ts:154](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:154), [validate-memory-quality.ts:489](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:489).
- KPI fallback-rate metric: [quality-kpi.sh:18](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:18), [quality-kpi.sh:76](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:76).
