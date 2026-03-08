OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccd03-66b8-7881-82bb-1ee426e58ea4
--------
user
You are an architecture reviewer. Analyze this implementation plan for architectural quality:

@.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md

Also read the existing implementation for context:
@.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts

CHECKS:
1. SRP VIOLATION: PerFolderDescription has 10 fields mixing two concerns: (a) description/metadata for discovery (specFolder, description, keywords, lastUpdated, specId, folderSlug, parentChain) and (b) mutable memory state (memorySequence, memoryNameHistory). Should these be two separate interfaces/files? Assess impact.
2. memoryNameHistory YAGNI: The ring buffer stores last 20 slugs but NO consumer reads them in the plan. No test asserts on the contents. Is this speculative engineering?
3. DUAL SOURCES OF TRUTH: During transition, both per-folder description.json AND centralized descriptions.json exist. Does the plan clearly define which is authoritative? What happens on conflict?
4. folder-discovery.ts BLOAT: The plan adds 4+ new functions (generatePerFolderDescription, loadPerFolderDescription, savePerFolderDescription, plus stale detection). This file is already large. Should a separate module handle per-folder descriptions?
5. PHASE DEPENDENCY ACCURACY: The plan says Phases 2, 3, 4 are independent after Phase 1. Verify: Does Phase 3 (uniqueness) truly NOT depend on Phase 2 (create.sh)? Does Phase 4 (aggregation) truly NOT depend on Phase 2?
6. MISSING MIGRATION TOOLING: 400+ existing folders have no description.json. The plan says "backward compatibility maintained during transition" but does not define when/how migration happens. Is a migration script needed?
7. COMPLEXITY SCORE: spec.md claims 35/70. Assess if this is accurate given the actual scope (7 files, 3 domains, backward compat, concurrency concerns).
8. KISS ASSESSMENT: Could the uniqueness problem be solved more simply? E.g., just scanning existing filenames in the memory/ directory without maintaining state in description.json. What is the simplest viable approach?

LEAF CONSTRAINT: Do not delegate. Complete this analysis yourself. Depth 1 LEAF only.

OUTPUT FORMAT: For each finding use: [Severity] [Tag] Description (line refs). Severities: P0/P1/P2/P3. Tag: [ARCH]. End with 3-line summary.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
Reviewing the plan and the existing `folder-discovery` implementation first, then I’ll trace the phase dependencies and look for missing migration or authority rules before I write up findings with line refs.
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Folder Discovery (PI-B3)
// ---------------------------------------------------------------
import * as fs from 'node:fs';
import * as path from 'node:path';

/* --- 1. TYPES --- */

/**
 * Describes a single spec folder with its cached description
 * and extracted keywords for lightweight matching.
 */
export interface FolderDescription {
  specFolder: string;
  description: string;
  keywords: string[];
  lastUpdated: string;
}

/**
 succeeded in 51ms:
---
title: "Feature Specification: Spec Folder Description System Refactor"
description: "Refactor the centralized descriptions.json into per-folder description.json files, improve memory filename uniqueness, and integrate description generation into spec folder creation automation."
trigger_phrases:
  - "descriptions.json"
  - "description system"
  - "spec folder descriptions"
  - "per-folder description"
  - "memory uniqueness"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Spec Folder Description System Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
 succeeded in 51ms:
---
title: "Implementation Plan: Spec Folder Description System Refactor"
description: "Refactor centralized descriptions.json into per-folder description.json files with collision-resistant memory naming, integrated into spec folder creation automation."
trigger_phrases:
  - "description system refactor"
  - "per-folder description"
  - "memory uniqueness"
  - "descriptions.json"
  - "spec folder description"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Spec Folder Description System Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
codex
I’ve got the core plan and spec. Next I’m pulling line-numbered views plus a few adjacent implementation files so I can check whether the claimed phase independence and the proposed module growth actually hold in the current codebase.
exec
/bin/zsh -lc "nl -ba '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md' | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts' && nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"create\\.sh|ensureUniqueSlug|ctxFilename|writeFilesAtomically|description\\.json|generateFolderDescriptions|ensureDescriptionCache|isCacheStale\" '.opencode/skill/system-spec-kit'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	---
     2	title: "Implementation Plan: Spec Folder Description System Refactor"
     3	description: "Refactor centralized descriptions.json into per-folder description.json files with collision-resistant memory naming, integrated into spec folder creation automation."
     4	trigger_phrases:
     5	  - "description system refactor"
     6	  - "per-folder description"
     7	  - "memory uniqueness"
     8	  - "descriptions.json"
     9	  - "spec folder description"
    10	importance_tier: "normal"
    11	contextType: "general"
    12	---
    13	# Implementation Plan: Spec Folder Description System Refactor
    14	
    15	<!-- SPECKIT_LEVEL: 2 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:summary -->
 succeeded in 50ms:
     1	---
     2	title: "Feature Specification: Spec Folder Description System Refactor"
     3	description: "Refactor the centralized descriptions.json into per-folder description.json files, improve memory filename uniqueness, and integrate description generation into spec folder creation automation."
     4	trigger_phrases:
     5	  - "descriptions.json"
     6	  - "description system"
     7	  - "spec folder descriptions"
     8	  - "per-folder description"
     9	  - "memory uniqueness"
    10	importance_tier: "normal"
    11	contextType: "general"
    12	---
    13	# Feature Specification: Spec Folder Description System Refactor
    14	
    15	<!-- SPECKIT_LEVEL: 2 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:metadata -->
 succeeded in 50ms:
     812 .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
     1	// ---------------------------------------------------------------
     2	// MODULE: Folder Discovery (PI-B3)
     3	// ---------------------------------------------------------------
     4	import * as fs from 'node:fs';
     5	import * as path from 'node:path';
     6	
     7	/* --- 1. TYPES --- */
     8	
     9	/**
    10	 * Describes a single spec folder with its cached description
    11	 * and extracted keywords for lightweight matching.
    12	 */
    13	export interface FolderDescription {
    14	  specFolder: string;
    15	  description: string;
    16	  keywords: string[];
    17	  lastUpdated: string;
    18	}
    19	
 succeeded in 51ms:
.opencode/skill/system-spec-kit/README.md:138:.opencode/skill/system-spec-kit/scripts/spec/create.sh "Add user authentication" --level 2
.opencode/skill/system-spec-kit/README.md:208:| `spec/create.sh` | Create feature branch and spec folder; `--phase` creates parent + child phase folders |
.opencode/skill/system-spec-kit/README.md:643:./scripts/spec/create.sh "Add OAuth2 with MFA" --level 2
.opencode/skill/system-spec-kit/README.md:646:./scripts/spec/create.sh "Add OAuth2" --level 1 --skip-branch
.opencode/skill/system-spec-kit/README.md:682:./scripts/spec/create.sh "feature name" --level 2
.opencode/skill/system-spec-kit/README.md:718:| Spec folder not found | `./scripts/spec/create.sh "name" --level 1` |
.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:204:./scripts/spec/create.sh "Simple bugfix"
.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:207:./scripts/spec/create.sh "Add authentication" --level 2
.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:210:./scripts/spec/create.sh "Major refactor" --level 3
.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:213:./scripts/spec/create.sh "Platform migration" --level 3+
.opencode/skill/system-spec-kit/templates/addendum/phase/phase-parent-section.md:25:<!-- [YOUR_VALUE_HERE: PHASE_ROW] — Replaced by create.sh with full 5-column table rows (e.g., "| 1 | 001-name/ | [scope] | [deps] | Pending |") -->
.opencode/skill/system-spec-kit/templates/addendum/phase/phase-parent-section.md:38:<!-- [YOUR_VALUE_HERE: HANDOFF_ROW] — Replaced by create.sh with full 4-column table rows (e.g., "| 001-name | 002-name | [criteria] | [verification] |") -->
.opencode/skill/system-spec-kit/templates/addendum/phase/phase-child-header.md:17:<!-- PARENT_FOLDER: Replaced with ".." (relative path from child to parent folder) by create.sh -->
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:5://        generateFolderDescriptions, loadDescriptionCache,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:16:  generateFolderDescriptions,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:263:   4. generateFolderDescriptions — file system scanning
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:266:describe('T009 generateFolderDescriptions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:286:    const cache = generateFolderDescriptions([tmpDir]);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:299:    const cache = generateFolderDescriptions([tmpDir]);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:314:    const cache = generateFolderDescriptions([tmpDir]);
codex
The current codebase already has some of the proposed pieces live, which is useful here: I’m reading the actual `PerFolderDescription`, aggregation, and memory-save paths now so the review can call out where the plan is structurally sound versus where it’s overspecified.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts' | sed -n '400,700p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | sed -n '620,880p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/spec/create.sh' | sed -n '780,1085p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   400	
   401	  // Sort descending by relevance
   402	  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
   403	
   404	  return results.slice(0, limit);
   405	}
   406	
   407	/* --- 6. CACHE GENERATION --- */
   408	
   409	/**
   410	 * Scan spec base paths for spec.md files and generate a
   411	 * DescriptionCache by extracting descriptions from each.
   412	 *
   413	 * - Uses synchronous file I/O — this is a build-time/cache generation
   414	 *   function, NOT a hot path.
   415	 * - Expects specsBasePaths to be absolute paths to directories that
   416	 *   contain spec folder subdirectories (e.g., the `specs/` root).
   417	 * - A spec folder is any direct child directory of a base path
   418	 *   that contains a `spec.md` file.
   419	 * - Nested spec folders (phase subfolders) are also discovered if
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Slug Utils
     3	// Content-aware slug generation for memory filenames
     4	// ---------------------------------------------------------------
     5	
     6	import { createHash } from 'node:crypto';
     7	import * as fs from 'node:fs';
     8	import * as path from 'node:path';
     9	
    10	const GENERIC_TASK_SLUGS = new Set([
    11	  'development-session',
    12	  'session-summary',
    13	  'session-context',
    14	  'session',
    15	  'context',
    16	  'implementation',
    17	  'work-session',
    18	  'implementation-and-updates',
    19	]);
    20	
 succeeded in 50ms:
   620	      enrichedTask,
   621	      dataSource,
   622	      activeDataFile
   623	    );
   624	
   625	    if (allowSpecTitleFallback) {
   626	      if (specTitle.length >= 8) {
   627	        enrichedTask = specTitle;
   628	        log(`   Enriched task from spec.md: "${enrichedTask}"`);
   629	      }
   630	    }
   631	
   632	  const preferredMemoryTask = pickPreferredMemoryTask(
   633	    enrichedTask || '',
   634	    specTitle,
   635	    folderBase,
   636	    [
   637	      sessionData.QUICK_SUMMARY || '',
   638	      sessionData.TITLE || '',
   639	      sessionData.SUMMARY || '',
 succeeded in 50ms:
   780	            PHASE_PARENT_TEMPLATE=$(< "$PHASE_ADDENDUM_DIR/phase-parent-section.md")
   781	
   782	            # Replace placeholders in template
   783	            # Use a temp file for sed replacements (avoids in-place issues)
   784	            _tmp_phase_section=$(mktemp)
   785	            PHASE_TMP_FILES+=("$_tmp_phase_section")
   786	
   787	            # Write the template, replacing [PHASE_ROW] and [HANDOFF_ROW] line placeholders
   788	            while IFS= read -r _line; do
   789	                if [[ "$_line" == *"[YOUR_VALUE_HERE: PHASE_ROW]"* ]]; then
   790	                    printf '%s\n' "$PHASE_ROWS"
   791	                elif [[ "$_line" == *"[YOUR_VALUE_HERE: HANDOFF_ROW]"* ]]; then
   792	                    if [[ -n "$HANDOFF_ROWS" ]]; then
   793	                        printf '%s\n' "$HANDOFF_ROWS"
   794	                    else
   795	                        printf '%s\n' "| (single phase - no handoffs) | | | |"
   796	                    fi
   797	                else
   798	                    printf '%s\n' "$_line"
   799	                fi
codex
I found that the current repo already exercises the same design the plan proposes. I’m checking actual consumers of `memoryNameHistory`, current authority rules, and the live tests now, because that’s where the architectural weaknesses show up most clearly.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts' | sed -n '500,840p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts' | sed -n '540,660p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"memoryNameHistory|memorySequence|PerFolderDescription|isPerFolderDescriptionStale|loadPerFolderDescription|savePerFolderDescription\" '.opencode/skill/system-spec-kit'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   500	});
   501	
   502	/* -----------------------------------------------------------
   503	   7. PerFolderDescription — per-folder description.json operations
   504	----------------------------------------------------------------*/
   505	
   506	describe('T009 PerFolderDescription schema', () => {
   507	  it('has required specId field', () => {
   508	    const desc: PerFolderDescription = {
   509	      specFolder: '010-spec-descriptions',
   510	      description: 'Test',
   511	      keywords: ['test'],
   512	      lastUpdated: new Date().toISOString(),
   513	      specId: '010',
   514	      folderSlug: 'spec-descriptions',
   515	      parentChain: [],
   516	      memorySequence: 0,
   517	      memoryNameHistory: [],
   518	    };
   519	    expect(desc.specId).toBe('010');
 succeeded in 51ms:
     1	# Spec folder description discovery
     2	
     3	## Current Reality
     4	
     5	Each spec folder now has its own `description.json` containing identity metadata
     6	(`specId`, `folderSlug`, `parentChain`) and memory tracking fields
     7	(`memorySequence`, `memoryNameHistory`). These per-folder files are the primary
     8	source of truth, auto-generated by `create.sh` on folder creation and updated
     9	by the memory save workflow.
    10	
    11	A centralized `descriptions.json` aggregation layer remains for backward
    12	compatibility. The `generateFolderDescriptions()` function prefers fresh
    13	per-folder files and falls back to `spec.md` extraction when `description.json`
    14	is missing or stale (spec.md modified after description.json).
    15	
    16	The `memory_context` orchestration layer checks descriptions before issuing
    17	vector queries. If the target folder can be identified from the description
    18	alone, the system skips full-corpus search entirely. Runs behind the
    19	`SPECKIT_FOLDER_DISCOVERY` flag (default ON).
    20	
 succeeded in 51ms:
   540	  });
   541	});
   542	
   543	/* ═══════════════════════════════════════════════════════════════
   544	   7. Per-Folder Description Integration
   545	   ═══════════════════════════════════════════════════════════════ */
   546	
   547	describe('PI-B3: Per-folder description preference', () => {
   548	  let tmpDir: string;
   549	
   550	  beforeEach(() => {
   551	    tmpDir = createTempWorkspace();
   552	  });
   553	
   554	  afterEach(() => {
   555	    cleanup(tmpDir);
   556	  });
   557	
   558	  it('T046-22: uses per-folder description.json when fresh', () => {
   559	    const specsDir = path.join(tmpDir, 'specs');
 succeeded in 51ms:
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:121:| NEW-042 | Spec folder description discovery (PI-B3) | Confirm per-folder + aggregated routing | `Validate PI-B3 folder description discovery.` | 1) Create spec folder via create.sh → verify description.json exists 2) Edit spec.md → verify isPerFolderDescriptionStale detects change 3) Run generateFolderDescriptions → verify per-folder files preferred over spec.md 4) Mixed mode: some folders with/without description.json → verify aggregation 5) Run memory_context query → verify short-circuit folder routing |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:198:| NEW-119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | Confirm collision resolution | `Validate memory filename collision prevention.` | 1) Save memory to a folder 2) Save again with same slug within same minute 3) Verify two distinct filenames (second has -1 suffix) 4) Verify memorySequence increments in description.json 5) Verify memoryNameHistory updated |
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:6://        saveDescriptionCache, PerFolderDescription operations
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:19:  generatePerFolderDescription,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:20:  loadPerFolderDescription,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:21:  savePerFolderDescription,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:22:  isPerFolderDescriptionStale,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:24:import type { FolderDescription, DescriptionCache, PerFolderDescription } from '../lib/search/folder-discovery';
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:503:   7. PerFolderDescription — per-folder description.json operations
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:506:describe('T009 PerFolderDescription schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:508:    const desc: PerFolderDescription = {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:516:      memorySequence: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:517:      memoryNameHistory: [],
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:523:    const desc: PerFolderDescription = {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:531:      memorySequence: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:532:      memoryNameHistory: [],
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:538:    const desc: PerFolderDescription = {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:546:      memorySequence: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:547:      memoryNameHistory: [],
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:553:    const desc: PerFolderDescription = {
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts' | sed -n '700,812p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"ensureUniqueMemoryFilename|slug-uniqueness\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/scripts/tests' '.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   700	 */
   701	export function getSpecsBasePaths(workspacePath?: string): string[] {
   702	  const root = workspacePath ?? process.cwd();
   703	  const candidates = [
   704	    path.join(root, 'specs'),
   705	    path.join(root, '.opencode', 'specs'),
   706	  ];
   707	
   708	  return normalizeBasePaths(candidates);
   709	}
   710	
   711	/**
   712	 * Check whether a description cache is stale by comparing its
   713	 * `generated` timestamp against the most recent spec.md mtime
   714	 * across all base paths using recursive depth-limited scan.
   715	 *
   716	 * @param cache     - The loaded DescriptionCache to check.
   717	 * @param basePaths - Spec base directories to scan for spec.md files.
   718	 * @returns true if any spec.md was modified after cache generation, or if cache is invalid.
   719	 */
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// CLI: Generate Per-Folder description.json
     3	// ---------------------------------------------------------------
     4	// Usage: node generate-description.js <folder-path> <base-path> [--description "text"]
     5	//
     6	// If --description is provided, uses it directly + keyword extraction.
     7	// Otherwise reads spec.md via generatePerFolderDescription().
     8	
     9	import * as path from 'node:path';
    10	import {
    11	  generatePerFolderDescription,
    12	  savePerFolderDescription,
    13	  extractKeywords,
    14	  slugifyFolderName,
    15	} from '@spec-kit/mcp-server/lib/search/folder-discovery';
    16	import type { PerFolderDescription } from '@spec-kit/mcp-server/lib/search/folder-discovery';
    17	
    18	function main(): void {
    19	  const args = process.argv.slice(2);
    20	  if (args.length < 2) {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/utils/README.md:173:| `slug-utils.ts` | Content-aware slug generation for memory filenames. Provides `ensureUniqueMemoryFilename()` to prevent collisions via `-1`, `-2` suffix appending |
.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:130:export function ensureUniqueMemoryFilename(contextDir: string, filename: string): string {
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:4:// Tests: ensureUniqueMemoryFilename collision detection and resolution
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:16:function ensureUniqueMemoryFilename(contextDir: string, filename: string): string {
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:51:describe('ensureUniqueMemoryFilename', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:53:    const result = ensureUniqueMemoryFilename(tmpDir, '08-03-26_10-24__my-slug.md');
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:59:    const result = ensureUniqueMemoryFilename(nonExistent, 'test.md');
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:65:    const result = ensureUniqueMemoryFilename(tmpDir, '08-03-26_10-24__my-slug.md');
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:73:    const result = ensureUniqueMemoryFilename(tmpDir, 'test.md');
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:80:      const name = ensureUniqueMemoryFilename(tmpDir, 'collision.md');
.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts:89:    const result = ensureUniqueMemoryFilename(tmpDir, 'test.md');
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:25:import { generateContentSlug, pickBestContentName, ensureUniqueMemoryFilename } from '../utils/slug-utils';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:645:  const ctxFilename: string = ensureUniqueMemoryFilename(contextDir, rawCtxFilename);
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts' | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Test — Slug Uniqueness
     3	// ---------------------------------------------------------------
     4	// Tests: ensureUniqueMemoryFilename collision detection and resolution
     5	// Note: Function is in scripts/utils/slug-utils.ts but tested here
     6	//       where vitest infrastructure exists.
     7	
     8	import { describe, it, expect, beforeEach, afterEach } from 'vitest';
     9	import * as fs from 'node:fs';
    10	import * as path from 'node:path';
    11	import * as os from 'node:os';
    12	import { createHash } from 'node:crypto';
    13	
    14	// Inline implementation for testing since the function is in the scripts project
    15	// and cannot be directly imported. This mirrors the exact logic in slug-utils.ts.
    16	function ensureUniqueMemoryFilename(contextDir: string, filename: string): string {
    17	  let entries: string[];
    18	  try {
    19	    entries = fs.readdirSync(contextDir).filter(f => f.endsWith('.md'));
    20	  } catch {
codex
[P1] [ARCH] The plan mixes two separate responsibilities in one contract and even describes two different uniqueness mechanisms for the same invariant. `PerFolderDescription` combines immutable discovery metadata with mutable memory-save bookkeeping, while the architecture section says uniqueness comes from `memorySequence` and Phase 3 says uniqueness comes from scanning existing filenames. That is both an SRP violation and a YAGNI signal; `memoryNameHistory` especially looks speculative because the plan defines no consumer, and in the reviewed implementation even the added tests only prove ring-buffer shape, not business value ([plan.md#L92](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L92), [plan.md#L118](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L118), [plan.md#L151](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L151), [plan.md#L156](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L156), [spec.md#L183](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L183), [folder-discovery.ts#L34](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L34), [folder-discovery.ts#L537](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L537), [workflow.ts#L841](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L841), [folder-discovery.vitest.ts#L597](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts#L597)).

[P1] [ARCH] The transition still has dual sources of truth without a crisp authority contract. The plan says the centralized file remains for backward compatibility and that aggregation prefers per-folder files, but it never states normatively whether `descriptions.json` is strictly derived/read-only, what wins on conflict, or whether divergence is ever allowed. That should be explicit, because “preferred on rebuild” is weaker than “authoritative at rest” ([plan.md#L32](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L32), [plan.md#L82](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L82), [plan.md#L165](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L165), [plan.md#L168](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L168), [spec.md#L94](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L94), [spec.md#L142](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L142), [04-spec-folder-description-discovery.md#L5](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md#L5)).

[P2] [ARCH] The migration story is missing. “Backward compatibility maintained during transition” is not enough when the spec itself says there are 400+ existing entries and migration is out of scope; that means the system has no convergence mechanism and can remain permanently mixed-mode unless folders are manually touched. If per-folder files are the long-term model, the plan needs either a one-shot backfill script or a lazy write-back strategy during scans ([plan.md#L33](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L33), [plan.md#L170](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L170), [spec.md#L38](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L38), [spec.md#L58](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L58), [spec.md#L60](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L60)).

[P2] [ARCH] `folder-discovery.ts` is the wrong place to keep growing this behavior. It already spans traversal, extraction, scoring, cache generation, cache I/O, and public orchestration; adding per-folder CRUD and staleness logic makes it both discovery engine and persistence layer. A separate `description-store.ts` or `per-folder-description.ts` module would reduce bloat and keep the save-path dependency from `workflow.ts` from reaching back into the search package ([plan.md#L77](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L77), [plan.md#L82](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L82), [plan.md#L127](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L127), [folder-discovery.ts#L425](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L425), [folder-discovery.ts#L543](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L543), [folder-discovery.ts#L720](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L720), [workflow.ts#L843](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L843)).

[P2] [ARCH] The phase dependency statement is directionally right for coding parallelism, but too strong for rollout semantics. Phase 3 can implement filename uniqueness after Phase 1, and Phase 4 can implement mixed-mode aggregation after Phase 1, but Phase 3’s tracking updates only apply where `description.json` already exists and Phase 4’s “primary per-folder” behavior does not become normal system behavior until Phase 2 or migration populates those files. The table should separate “can be developed in parallel” from “delivers independent end-to-end value” ([plan.md#L138](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L138), [plan.md#L156](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L156), [plan.md#L165](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L165), [plan.md#L244](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L244), [plan.md#L252](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L252), [workflow.ts#L847](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L847), [spec.md#L60](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L60)).

[P2] [ARCH] The complexity score is optimistic, and the KISS path is narrower than the plan. This change is not just “7 files across 3 domains”; it also carries dual-store transition logic, backward compatibility, bash/TypeScript integration, stale-detection rules, and best-effort concurrent writes. A truer score is closer to mid/high L2. The simplest viable architecture is to keep `description.json` discovery-only and solve uniqueness exclusively with directory-based collision checks, which the current implementation already does successfully ([spec.md#L168](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L168), [spec.md#L173](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L173), [plan.md#L151](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L151), [plan.md#L205](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L205), [slug-utils.ts#L130](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L130), [workflow.ts#L643](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L643), [slug-uniqueness.vitest.ts#L77](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts#L77)).

Top risk: the plan couples discovery metadata to mutable save-state and never fully settles source-of-truth ownership during the transition.  
Operationally, it also lacks a convergence path for the 400+ existing folders and understates both boundary pressure and rollout complexity.  
Simplest viable architecture: make per-folder `description.json` discovery-only, treat centralized `descriptions.json` as derived/read-only, and keep uniqueness at the filesystem layer.
tokens used
78,138
[P1] [ARCH] The plan mixes two separate responsibilities in one contract and even describes two different uniqueness mechanisms for the same invariant. `PerFolderDescription` combines immutable discovery metadata with mutable memory-save bookkeeping, while the architecture section says uniqueness comes from `memorySequence` and Phase 3 says uniqueness comes from scanning existing filenames. That is both an SRP violation and a YAGNI signal; `memoryNameHistory` especially looks speculative because the plan defines no consumer, and in the reviewed implementation even the added tests only prove ring-buffer shape, not business value ([plan.md#L92](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L92), [plan.md#L118](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L118), [plan.md#L151](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L151), [plan.md#L156](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L156), [spec.md#L183](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L183), [folder-discovery.ts#L34](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L34), [folder-discovery.ts#L537](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L537), [workflow.ts#L841](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L841), [folder-discovery.vitest.ts#L597](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts#L597)).

[P1] [ARCH] The transition still has dual sources of truth without a crisp authority contract. The plan says the centralized file remains for backward compatibility and that aggregation prefers per-folder files, but it never states normatively whether `descriptions.json` is strictly derived/read-only, what wins on conflict, or whether divergence is ever allowed. That should be explicit, because “preferred on rebuild” is weaker than “authoritative at rest” ([plan.md#L32](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L32), [plan.md#L82](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L82), [plan.md#L165](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L165), [plan.md#L168](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L168), [spec.md#L94](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L94), [spec.md#L142](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L142), [04-spec-folder-description-discovery.md#L5](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md#L5)).

[P2] [ARCH] The migration story is missing. “Backward compatibility maintained during transition” is not enough when the spec itself says there are 400+ existing entries and migration is out of scope; that means the system has no convergence mechanism and can remain permanently mixed-mode unless folders are manually touched. If per-folder files are the long-term model, the plan needs either a one-shot backfill script or a lazy write-back strategy during scans ([plan.md#L33](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L33), [plan.md#L170](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L170), [spec.md#L38](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L38), [spec.md#L58](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L58), [spec.md#L60](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L60)).

[P2] [ARCH] `folder-discovery.ts` is the wrong place to keep growing this behavior. It already spans traversal, extraction, scoring, cache generation, cache I/O, and public orchestration; adding per-folder CRUD and staleness logic makes it both discovery engine and persistence layer. A separate `description-store.ts` or `per-folder-description.ts` module would reduce bloat and keep the save-path dependency from `workflow.ts` from reaching back into the search package ([plan.md#L77](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L77), [plan.md#L82](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L82), [plan.md#L127](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L127), [folder-discovery.ts#L425](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L425), [folder-discovery.ts#L543](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L543), [folder-discovery.ts#L720](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L720), [workflow.ts#L843](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L843)).

[P2] [ARCH] The phase dependency statement is directionally right for coding parallelism, but too strong for rollout semantics. Phase 3 can implement filename uniqueness after Phase 1, and Phase 4 can implement mixed-mode aggregation after Phase 1, but Phase 3’s tracking updates only apply where `description.json` already exists and Phase 4’s “primary per-folder” behavior does not become normal system behavior until Phase 2 or migration populates those files. The table should separate “can be developed in parallel” from “delivers independent end-to-end value” ([plan.md#L138](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L138), [plan.md#L156](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L156), [plan.md#L165](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L165), [plan.md#L244](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L244), [plan.md#L252](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L252), [workflow.ts#L847](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L847), [spec.md#L60](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L60)).

[P2] [ARCH] The complexity score is optimistic, and the KISS path is narrower than the plan. This change is not just “7 files across 3 domains”; it also carries dual-store transition logic, backward compatibility, bash/TypeScript integration, stale-detection rules, and best-effort concurrent writes. A truer score is closer to mid/high L2. The simplest viable architecture is to keep `description.json` discovery-only and solve uniqueness exclusively with directory-based collision checks, which the current implementation already does successfully ([spec.md#L168](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L168), [spec.md#L173](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md#L173), [plan.md#L151](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L151), [plan.md#L205](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/plan.md#L205), [slug-utils.ts#L130](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L130), [workflow.ts#L643](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L643), [slug-uniqueness.vitest.ts#L77](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/slug-uniqueness.vitest.ts#L77)).

Top risk: the plan couples discovery metadata to mutable save-state and never fully settles source-of-truth ownership during the transition.  
Operationally, it also lacks a convergence path for the 400+ existing folders and understates both boundary pressure and rollout complexity.  
Simplest viable architecture: make per-folder `description.json` discovery-only, treat centralized `descriptions.json` as derived/read-only, and keep uniqueness at the filesystem layer.
