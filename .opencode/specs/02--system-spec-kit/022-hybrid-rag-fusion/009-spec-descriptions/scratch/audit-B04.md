# Audit B-04: Code Quality — memory/ + spec-folder/

## Summary
| Metric | memory/ | spec-folder/ | Total |
|--------|---------|-------------|-------|
| Files | 7 | 5 | 12 |
| SQL injection risks | 0 | 0 | 0 |
| Missing error handling | 0 | 1 | 1 |
| Transaction issues | 1 | 0 | 1 |

## Security Findings
- No SQL injection vectors found in direct SQL usage. Queries are static/prepared with bound parameters in [cleanup-orphaned-vectors.ts:80](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:80) and [folder-detector.ts:964](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:964).
- Medium risk: DB-derived `spec_folder` relative values can resolve outside approved roots before candidate selection in [folder-detector.ts:479](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:479), [folder-detector.ts:548](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:548), [folder-detector.ts:1006](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1006).
- Data validation before DB access is mostly solid: query parameters are constants (`SESSION_LOOKBACK_HOURS`, `SESSION_ROW_LIMIT`) and not user input in [folder-detector.ts:970](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:970).

## Per-File Findings
- [ast-parser.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts): No DB interaction; no `any` abuse; missing file-level JSDoc header.
- [backfill-frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts): No DB interaction; good path boundary validation; missing file-level JSDoc header.
- [cleanup-orphaned-vectors.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts): Prepared statements and transactions present; cleanup is chunk-transactional (not fully atomic end-to-end); missing file-level JSDoc header.
- [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts): No DB interaction; strong spec-folder input validation; missing file-level JSDoc header.
- [rank-memories.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts): No DB interaction; camelCase mostly consistent; no `any` abuse; missing file-level JSDoc header.
- [reindex-embeddings.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts): No direct SQL; no `any` abuse; missing file-level JSDoc header.
- [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts): No DB interaction; no `any` abuse; missing file-level JSDoc header.
- [alignment-validator.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts): No DB interaction; no `any` abuse; missing file-level JSDoc header.
- [directory-setup.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts): No DB interaction; path sanitization is good; missing file-level JSDoc header.
- [folder-detector.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts): Parameterized readonly query and proper close in `finally`; relative DB-derived path validation gap; DB lookup failures mostly silent outside DEBUG; snake_case compatibility exports.
- [generate-description.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts): No DB interaction; missing file-level JSDoc header.
- [index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/index.ts): No DB interaction; snake_case alias exports violate strict camelCase naming; missing file-level JSDoc header.

## Issues [ISS-B04-NNN with severity]
- `ISS-B04-001` (Medium): Relative `spec_folder` values from `session_learning` can escape approved roots before selection/return. Evidence: [folder-detector.ts:479](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:479), [folder-detector.ts:548](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:548), [folder-detector.ts:1006](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1006).
- `ISS-B04-002` (Medium): Cleanup writes are not single-transaction atomic across all affected tables; partial commits can occur on mid-run failure. Evidence: [cleanup-orphaned-vectors.ts:94](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:94), [cleanup-orphaned-vectors.ts:136](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:136).
- `ISS-B04-003` (Low): Session-learning DB lookup failures are mostly suppressed in non-DEBUG mode, reducing observability. Evidence: [folder-detector.ts:1012](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1012).
- `ISS-B04-004` (Low): Strict camelCase naming is violated by snake_case compatibility exports. Evidence: [index.ts:45](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/index.ts:45), [folder-detector.ts:1163](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1163).
- `ISS-B04-005` (Low): File-level JSDoc headers are missing (banner comments used instead) across all 12 audited files.

## Recommendations
1. Enforce `isPathWithin`/approved-root checks for every resolved session-learning candidate path before adding/returning it.
2. Decide cleanup atomicity policy explicitly; if consistency is required, wrap cross-table cleanup in one transaction.
3. Emit at least warning-level logs for DB lookup fallback path in non-DEBUG mode.
4. Add file-level JSDoc module headers to all audited files.
5. Keep snake_case exports only behind a documented deprecation path and prefer camelCase at call sites.
6. Keep current `any` discipline: no explicit `any` abuse found in audited files.
    8	import * as fsSync from 'fs';
     9	
    10	// Internal modules
    11	import {
    12	  CONFIG,
    13	  findActiveSpecsDir,
    14	  getSpecsDirectories,
    15	  SPEC_FOLDER_PATTERN,
    16	  SPEC_FOLDER_BASIC_PATTERN,
    17	  CATEGORY_FOLDER_PATTERN,
    18	  findChildFolderSync,
    19	  getPhaseFolderRejectionSync,
exec
/bin/zsh -lc "echo '===== .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts ====='; nl -ba .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
===== .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts =====
     1	#!/usr/bin/env node
     2	// ---------------------------------------------------------------
     3	// MODULE: Rank Memories
     4	// Computes composite ranking scores for memories and folders with recency decay
     5	// ---------------------------------------------------------------
     6	
     7	import * as fs from 'fs';
     8	import * as path from 'path';
     9	
    10	/* -----------------------------------------------------------------
    11	   1. IMPORTS FROM FOLDER-SCORING
    12	------------------------------------------------------------------*/
    13	
    14	import {
    15	  isArchived,
    16	  getArchiveMultiplier,
    17	  computeRecencyScore,
    18	  computeSingleFolderScore,
    19	  simplifyFolderPath,
exec
/bin/zsh -lc "echo '===== .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts ====='; nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
===== .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts =====
     1	#!/usr/bin/env node
     2	// ---------------------------------------------------------------
     3	// MODULE: Validate Memory Quality
     4	// Post-render quality gate for generated memory files
     5	// ---------------------------------------------------------------
     6	
     7	import fs from 'fs';
     8	import path from 'path';
     9	
    10	type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9';
    11	
    12	interface RuleResult {
    13	  ruleId: QualityRuleId;
    14	  passed: boolean;
    15	  message: string;
    16	}
    17	
    18	interface ValidationResult {
    19	  valid: boolean;
codex
I’m now validating the `spec-folder/` internals, starting with alignment logic and folder detection, since that’s where DB lookups and boundary checks usually live.
exec
/bin/zsh -lc "echo '===== .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts ====='; nl -ba .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
===== .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts =====
     1	// ---------------------------------------------------------------
     2	// MODULE: Alignment Validator
     3	// Validates conversation-to-spec-folder alignment using topic and keyword matching
     4	// ---------------------------------------------------------------
     5	
     6	// Node stdlib
     7	import * as fs from 'fs/promises';
     8	import * as path from 'path';
     9	
    10	// Internal modules
    11	import { promptUserChoice } from '../utils/prompt-utils';
    12	
    13	/* -----------------------------------------------------------------
    14	   1. INTERFACES
    15	------------------------------------------------------------------*/
    16	
    17	export interface AlignmentConfig {
    18	  THRESHOLD: number;
    19	  WARNING_THRESHOLD: number;
exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts; do echo "===== $f ====="; nl -ba "$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
===== .opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts =====
     1	// ---------------------------------------------------------------
     2	// MODULE: Directory Setup
     3	// Creates and configures spec folder directory structure with memory subdirectories
     4	// ---------------------------------------------------------------
     5	
     6	// Node stdlib
     7	import * as fs from 'fs/promises';
     8	import * as path from 'path';
     9	
    10	// Internal modules
    11	import { structuredLog, sanitizePath } from '../utils';
    12	import { CONFIG, findActiveSpecsDir, getSpecsDirectories, SPEC_FOLDER_PATTERN } from '../core';
    13	
    14	/* -----------------------------------------------------------------
    15	   1. DIRECTORY SETUP
    16	------------------------------------------------------------------*/
    17	
    18	async function setupContextDirectory(specFolder: string): Promise<string> {
    19	  let sanitizedPath: string;
exec
/bin/zsh -lc "echo '===== .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts (1-420) ====='; nl -ba .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
===== .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts (1-420) =====
     1	// ---------------------------------------------------------------
     2	// MODULE: Folder Detector
     3	// Detects, lists, and resolves spec folders with interactive selection and alignment scoring
     4	// ---------------------------------------------------------------
     5	
     6	// Node stdlib
     7	import * as fs from 'fs/promises';
     8	import * as path from 'path';
     9	
    10	// External packages
    11	import Database from 'better-sqlite3';
    12	
    13	// Internal modules
    14	import { DB_PATH } from '@spec-kit/shared/paths';
    15	import { promptUser, promptUserChoice } from '../utils/prompt-utils';
    16	import { CONFIG, findActiveSpecsDir, getAllExistingSpecsDirs, SPEC_FOLDER_PATTERN, findChildFolderAsync } from '../core';
    17	import {
    18	  ALIGNMENT_CONFIG,
    19	  isArchiveFolder,
exec
/bin/zsh -lc "echo '===== .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts (421-840) ====='; nl -ba .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | sed -n '421,840p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
===== .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts (421-840) =====
   421	    return stat.isDirectory();
   422	  } catch (_error: unknown) {
   423	    return false;
   424	  }
   425	}
   426	
   427	async function collectSpecParentCache(specsDirs: string[]): Promise<Map<string, string[]>> {
   428	  const parentCache = new Map<string, string[]>();
   429	
   430	  for (const specsDir of specsDirs) {
   431	    try {
   432	      const entries = await fs.readdir(specsDir);
   433	      const parentFolders: string[] = [];
   434	
   435	      for (const entry of entries) {
   436	        if (!SPEC_FOLDER_PATTERN.test(entry)) continue;
   437	        const entryPath = path.join(specsDir, entry);
   438	        if (await pathIsDirectory(entryPath)) {
   439	          parentFolders.push(entry);
exec
/bin/zsh -lc "echo '===== .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts (841-1200) ====='; nl -ba .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | sed -n '841,1200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
===== .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts (841-1200) =====
   841	          }
   842	        }
   843	      }
   844	
   845	      // Bare child search across all parents
   846	      const childResult = await findChildFolderAsync(specArg);
   847	      if (childResult) {
   848	        return childResult;
   849	      }
   850	
   851	      console.error(`\n Specified spec folder not found: ${explicitSpecFolderArg}\n`);
   852	      console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');
   853	
   854	      try {
   855	        const searchDir = specsDir || defaultSpecsDir;
   856	        const entries = await fs.readdir(searchDir);
   857	        const available = entries
   858	          .filter((name) => /^\d{3}-/.test(name))
   859	          .filter((name) => !isArchiveFolder(name))
