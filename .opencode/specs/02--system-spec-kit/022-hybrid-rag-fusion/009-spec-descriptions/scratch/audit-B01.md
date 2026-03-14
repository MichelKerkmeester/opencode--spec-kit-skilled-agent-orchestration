# Audit B-01: Code Quality — scripts/core/ + scripts/utils/

## Summary
| Metric | core/ | utils/ | Total |
|--------|-------|--------|-------|
| Files reviewed | N | N | N |
| Naming violations | N | N | N |
| Missing headers | N | N | N |
| any usage | N | N | N |
| Error handling issues | N | N | N |

## Per-File Findings

### scripts/core/[filename].ts
- [violations found]

[repeat for each file]

## Issues [ISS-B01-NNN with severity P0/P1/P2]
## Recommendations

NESTING CONSTRAINT: You are a LEAF agent at depth 1. Do NOT use the Task tool or dispatch sub-agents.

SELF-GOVERNANCE: If this task requires more than 12 tool calls, STOP after initial assessment and output what you have.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to run a read-only audit across all `.ts` files in `scripts/core/` and `scripts/utils/`, then map each finding to your checklist categories and produce the report in your exact markdown format. I’ll start by listing the target files and loading their contents for analysis.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg --files -g '**/AGENTS.md' && echo '--- CORE TS ---' && rg --files '.opencode/skill/system-spec-kit/scripts/core' -g '*.ts' && echo '--- UTILS TS ---' && rg --files '.opencode/skill/system-spec-kit/scripts/utils' -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
AGENTS.md
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
--- CORE TS ---
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
.opencode/skill/system-spec-kit/scripts/core/config.ts
.opencode/skill/system-spec-kit/scripts/core/index.ts
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
.opencode/skill/system-spec-kit/scripts/core/workflow.ts
.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts
--- UTILS TS ---
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts
.opencode/skill/system-spec-kit/scripts/utils/index.ts
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
codex
I confirmed there are exactly 9 TypeScript files in `core/` and 12 in `utils/` (21 total). Next I’m scanning all of them for headers, naming, `any`, error handling, export style, and import grouping so we can generate per-file violations and totals.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 .opencode/skill/scripts/skill_advisor.py \"Audit TypeScript code quality in .opencode/skill/system-spec-kit/scripts/core and scripts/utils against sk-code--opencode standards\" --threshold 0.8" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 4.14s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-uSTk5CPs' (errno=Operation not permitted)
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !audit(multi), !spec, !system-spec-kit(explicit), core"
  },
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !audit, !audit(multi), !intent:review, code(name), opencode"
  },
  {
codex
I ran skill routing and it strongly mapped to `system-spec-kit` + `sk-code--review`; since your checklist is explicitly “against sk-code--opencode,” I’m now loading that skill’s standards file and then applying it file-by-file.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && sed -n '1,260p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"header|JSDoc|any|camel|import|default export|try|catch|error|naming\" .opencode/skill/sk-code--opencode/references/typescript/*.md && echo '--- QUICK REF ---' && sed -n '1,240p' .opencode/skill/sk-code--opencode/references/typescript/quality_standards.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:3:description: Copy-paste templates, naming cheat sheet, and common patterns for TypeScript development in OpenCode.
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:8:Copy-paste templates, naming cheat sheet, and common patterns for TypeScript development in OpenCode.
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:36:import path from 'path';
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:37:import fs from 'fs';
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:39:import Database from 'better-sqlite3';
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:41:import { loadConfig } from './core/config';
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:42:import { MemoryError, ErrorCode } from './errors/core';
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:44:import type { SearchOptions, SearchResult } from '../types';
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:98:  try {
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:107:  } catch (error: unknown) {
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:108:    const message = error instanceof Error ? error.message : String(error);
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:109:    console.error(`[module-name] Error: ${message}`);
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:110:    throw error;
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:125:<!-- ANCHOR:naming-cheat-sheet -->
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:130:| Functions         | `camelCase`        | `loadConfig`              |
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:138:| Local variables   | `camelCase`        | `searchResults`           |
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:139:| Module variables  | `camelCase`        | `dbConnection`            |
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:140:| Parameters        | `camelCase`        | `queryText`               |
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:149:<!-- /ANCHOR:naming-cheat-sheet -->
.opencode/skill/sk-code--opencode/references/typescript/quick_reference.md:272:<!-- ANCHOR:import-export-templates -->
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && for f in .opencode/skill/system-spec-kit/scripts/core/*.ts; do echo \"===== "'$f ====="; nl -ba "$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 2304

===== .opencode/skill/system-spec-kit/scripts/core/config.ts =====
     1	// ---------------------------------------------------------------
     2	// MODULE: Configuration
     3	// Central configuration loader — reads JSONC config, resolves paths, exports CONFIG object
     4	// ---------------------------------------------------------------
     5	
     6	import * as path from 'path';
     7	import * as fsSync from 'fs';
     8	import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
     9	import { structuredLog } from '../utils/logger';
    10	
    11	/* -----------------------------------------------------------------
    12	   1. INTERFACES
    13	------------------------------------------------------------------*/
    14	
    15	export interface WorkflowConfig {
    16	  maxResultPreview: number;
    17	  maxConversationMessages: number;
codex
I found the core dump was too large and got truncated, so I’m switching to targeted pattern scans (imports/exports/`any`/catch blocks/naming markers) across all 21 files to ensure full coverage without missing lines.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && echo '--- FILE HEAD (first 20 lines) ---' && for f in .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts; do echo \"\\n### "'$f"; sed -n '"'1,20p' \""'$f"; done && echo '"'\\n--- IMPORTS ---' && rg -n \""'^import |''^import'"\\s+type|"'^export default|''^export'"\\s+\\{|"'^export'"\\s+async\\s+function|"'^export'"\\s+function|"'^export const|''^export interface|''^export type" .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts && echo '"'\\n--- ANY USAGE ---' && rg -n \"\\bany\\b\" .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts && echo '\\n--- CATCH BLOCKS ---' && rg -n \"catch\\s*\\(|catch\\s*\\{\" .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
--- FILE HEAD (first 20 lines) ---

### .opencode/skill/system-spec-kit/scripts/core/config.ts
// ---------------------------------------------------------------
// MODULE: Configuration
// Central configuration loader — reads JSONC config, resolves paths, exports CONFIG object
// ---------------------------------------------------------------

import * as path from 'path';
import * as fsSync from 'fs';
import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
import { structuredLog } from '../utils/logger';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

export interface WorkflowConfig {
  maxResultPreview: number;
  maxConversationMessages: number;
codex
I hit a sandbox limitation for heredoc scripting, so I’m rerunning the naming scan as a single inline command to extract non-camelCase function/variable identifiers per file.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 -c \"import os,re,glob; files=sorted(glob.glob('.opencode/skill/system-spec-kit/scripts/core/*.ts')+glob.glob('.opencode/skill/system-spec-kit/scripts/utils/*.ts')); camel=re.compile(r'"'^[a-z][a-zA-Z0-9]*$'"');
for file in files:
    bad=[]
    with open(file,'r',encoding='utf-8') as f: lines=f.read().splitlines()
    for i,line in enumerate(lines,1):
        l=re.sub(r'//.*"'$'"','',line)
        m=re.match(r'"'^'"\\s*(?:export\\s+)?(?:async\\s+)?function\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*\\(',l)
        if m:
            n=m.group(1)
            if not camel.match(n): bad.append((i,'function',n));
            continue
        m=re.match(r'"'^'"\\s*(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\b',l)
        if m:
            n=m.group(1)
            if not camel.match(n): bad.append((i,'variable',n))
    if bad:
        print('\\n'+file)
        [print(f'  L{ln} {k}: {n}') for ln,k,n in bad]
\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 2.13s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-v7TCULuh' (errno=Operation not permitted)

.opencode/skill/system-spec-kit/scripts/core/config.ts
  L50 variable: CORE_DIR
  L51 variable: SCRIPTS_DIR
  L190 variable: CONFIG

.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  L11 variable: MIN_SUBSTANCE_CHARS
  L12 variable: FRONTMATTER_BLOCK_RE

.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
  L12 variable: SPEC_FOLDER_PATTERN
  L15 variable: SPEC_FOLDER_BASIC_PATTERN
  L18 variable: CATEGORY_FOLDER_PATTERN
  L21 variable: SEARCH_MAX_DEPTH

.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
  L17 variable: SIMULATION_MARKER
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 -c \"import glob; files=sorted(glob.glob('.opencode/skill/system-spec-kit/scripts/core/*.ts')+glob.glob('.opencode/skill/system-spec-kit/scripts/utils/*.ts'));
for f in files:
    text=open(f,'r',encoding='utf-8').read().lstrip();
    if not text.startswith('/**'):
        print(f)
\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 804ms:
.opencode/skill/system-spec-kit/scripts/core/config.ts
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
.opencode/skill/system-spec-kit/scripts/core/index.ts
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts
.opencode/skill/system-spec-kit/scripts/core/workflow.ts
.opencode/skill/system-spec-kit/scripts/utils/data-validator.ts
.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts
.opencode/skill/system-spec-kit/scripts/utils/index.ts
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
.opencode/skill/system-spec-kit/scripts/utils/logger.ts
.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts
.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts
.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts
.opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts
codex
I’ve confirmed header compliance and naming anomalies; next I’m isolating true `any` type usages (not comment text) and then validating import grouping plus swallowed/weak catch handling per file.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n \"(:\\s*any\\b|as\\s+any\\b|<any>)\" .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:

exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 -c \"import glob,re; files=sorted(glob.glob('.opencode/skill/system-spec-kit/scripts/core/*.ts')+glob.glob('.opencode/skill/system-spec-kit/scripts/utils/*.ts'));
for f in files:
  lines=open(f,'r',encoding='utf-8').read().splitlines();
  print('\\n'+f)
  for i,l in enumerate(lines,1):
    if re.match(r'"'^import'"\\b',l): print(f'  {i}: {l}')
\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 942ms:

.opencode/skill/system-spec-kit/scripts/core/config.ts
  6: import * as path from 'path';
  7: import * as fsSync from 'fs';
  8: import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
  9: import { structuredLog } from '../utils/logger';

.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  6: import * as fs from 'fs/promises';
  7: import * as path from 'path';
  8: import * as crypto from 'crypto';
  9: import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';

.opencode/skill/system-spec-kit/scripts/core/index.ts

.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  7: import * as fs from 'fs/promises';
  8: import * as fsSync from 'fs';
  9: import * as path from 'path';
  11: import { structuredLog } from '../utils';
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 -c \"import re,glob; files=sorted(glob.glob('.opencode/skill/system-spec-kit/scripts/core/*.ts')+glob.glob('.opencode/skill/system-spec-kit/scripts/utils/*.ts'));
for f in files:
  lines=open(f,'r',encoding='utf-8').read().splitlines()
  catches=[i+1 for i,l in enumerate(lines) if re.search(r'catch\\s*(\\(|\\{)',l)]
  if not catches: continue
  print('\\n'+f)
  for ln in catches:
    start=max(1,ln-2); end=min(len(lines),ln+3)
    print(f'  --- L{ln} ---')
    for i in range(start,end+1): print(f'  {i:4}: {lines[i-1]}')
\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.06s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-Y1Lg6rYq' (errno=Operation not permitted)

.opencode/skill/system-spec-kit/scripts/core/config.ts
  --- L176 ---
   174:       return validateConfig(merged, defaultConfig);
   175:     }
   176:   } catch (error: unknown) {
   177:     const errMsg = error instanceof Error ? error.message : String(error);
   178:     structuredLog('warn', `Failed to load config.jsonc: ${errMsg}. Using default configuration values`);
   179:   }
  --- L245 ---
   243:     try {
   244:       realPath = fsSync.realpathSync(dir);
   245:     } catch {
   246:       // Keep original dir if realpath resolution fails
   247:     }
   248: 

.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
codex
I’ve now isolated all catch patterns with context. I’ll take one final pass to size each file (to judge “complex logic” comment expectations) and then compile the full markdown audit with per-file violations and issue IDs.
exec
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && wc -l .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     267 .opencode/skill/system-spec-kit/scripts/core/config.ts
      87 .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
      34 .opencode/skill/system-spec-kit/scripts/core/index.ts
     157 .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
     145 .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
     319 .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
      94 .opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
     242 .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts
     941 .opencode/skill/system-spec-kit/scripts/core/workflow.ts
     124 .opencode/skill/system-spec-kit/scripts/utils/data-validator.ts
      83 .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts
      83 .opencode/skill/system-spec-kit/scripts/utils/index.ts
     459 .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
      50 .opencode/skill/system-spec-kit/scripts/utils/logger.ts
     247 .opencode/skill/system-spec-kit/scripts/utils/message-utils.ts
      98 .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts
      99 .opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts
     165 .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts
      42 .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts
     132 .opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts
codex
# Audit B-01: Code Quality — scripts/core/ + scripts/utils/

## Summary
| Metric | core/ | utils/ | Total |
|--------|-------|--------|-------|
| Files reviewed | 9 | 12 | 21 |
| Naming violations | 6 | 3 | 9 |
| Missing headers | 9 | 12 | 21 |
| any usage | 0 | 0 | 0 |
| Error handling issues | 4 | 2 | 6 |

## Per-File Findings

### scripts/core/config.ts
- Missing JSDoc-style file header at top (uses `//` banner block).
- Naming violations: `CORE_DIR`, `SCRIPTS_DIR`, `CONFIG` (not camelCase).
- Error handling issue: bare `catch {}` in realpath fallback path suppresses error context.
- Import organization issue: built-in, external, and internal imports are not separated into grouped blocks.

### scripts/core/file-writer.ts
- Missing JSDoc-style file header at top.
- Naming violations: `MIN_SUBSTANCE_CHARS`, `FRONTMATTER_BLOCK_RE`.
- Error handling issues: multiple silent catches (`catch {}` / ignore unreadable files / non-critical cleanup) with minimal context.
- Import organization issue: built-ins and internal import are not grouped with separation.

### scripts/core/index.ts
- Missing JSDoc-style file header at top.
- No naming/`any`/error-handling/export/import-order violations beyond header requirement.

### scripts/core/memory-indexer.ts
- Missing JSDoc-style file header at top.
- Import organization issue: internal and external imports are mixed; type import is not kept in a final type-only group.
- Error handling generally meaningful (logged with context).

### scripts/core/quality-scorer.ts
- Missing JSDoc-style file header at top.
- AI-intent comment gap: scoring heuristics are sizable and would benefit from more WHY-focused rationale notes.

### scripts/core/subfolder-utils.ts
- Missing JSDoc-style file header at top.
- Naming violations: `SPEC_FOLDER_PATTERN`, `SPEC_FOLDER_BASIC_PATTERN`, `CATEGORY_FOLDER_PATTERN`, `SEARCH_MAX_DEPTH`.
- Error handling issues: many catches return fallbacks (`false`/`null`/`[]`/`continue`) without logging.
- Import organization issue: import groups are not separated.

### scripts/core/topic-extractor.ts
- Missing JSDoc-style file header at top.
- Naming violation: `SIMULATION_MARKER`.

### scripts/core/tree-thinning.ts
- Missing JSDoc-style file header at top.
- Naming violation: `DEFAULT_THINNING_CONFIG`.
- Import organization issue: import appears after interface declarations instead of import block near top.

### scripts/core/workflow.ts
- Missing JSDoc-style file header at top.
- Naming violations: `PREFERRED_PARENT_FILES`, `IMPL_SUMMARY_MD`, `HAS_IMPL`.
- Error handling issues: bare/silent catches (notably around spec title parse and description tracking).
- Import organization issues: external import mixed into internal block; type imports interleaved instead of grouped.
- AI-intent comment gap: very complex orchestration has many WHAT-step comments but limited WHY rationale in key heuristics/fallback paths.

### scripts/utils/data-validator.ts
- Missing JSDoc-style file header at top.
- Naming violations: `ARRAY_FLAG_MAPPINGS`, `PRESENCE_FLAG_MAPPINGS`.

### scripts/utils/file-helpers.ts
- Missing JSDoc-style file header at top.

### scripts/utils/index.ts
- Missing JSDoc-style file header at top.
- Export style is consistent (named exports).

### scripts/utils/input-normalizer.ts
- Missing JSDoc-style file header at top.
- Naming violation: `FILES`.
- AI-intent comment gap: large normalization flow would benefit from more WHY-focused comments in decision-heavy paths.

### scripts/utils/logger.ts
- Missing JSDoc-style file header at top.

### scripts/utils/message-utils.ts
- Missing JSDoc-style file header at top.

### scripts/utils/path-utils.ts
- Missing JSDoc-style file header at top.
- Error handling issues: multiple bare catches fallback silently during canonicalization/safety checks.

### scripts/utils/prompt-utils.ts
- Missing JSDoc-style file header at top.

### scripts/utils/slug-utils.ts
- Missing JSDoc-style file header at top.
- Naming violations: `GENERIC_TASK_SLUGS`, `CONTAMINATED_NAME_PATTERNS`.
- Error handling issue: `catch { return filename; }` suppresses filesystem failure context.

### scripts/utils/task-enrichment.ts
- Missing JSDoc-style file header at top.

### scripts/utils/tool-detection.ts
- Missing JSDoc-style file header at top.

### scripts/utils/validation-utils.ts
- Missing JSDoc-style file header at top.

## Issues [ISS-B01-NNN with severity P0/P1/P2]
- `ISS-B01-001 (P1)`: Missing top-of-file JSDoc headers in all 21 files.
- `ISS-B01-002 (P1)`: Non-camelCase function/variable naming in 9 files (mostly SCREAMING_SNAKE_CASE constants).
- `ISS-B01-003 (P1)`: Silent/bare catch blocks in core path and utility modules (`config.ts`, `file-writer.ts`, `subfolder-utils.ts`, `workflow.ts`, `path-utils.ts`, `slug-utils.ts`).
- `ISS-B01-004 (P2)`: Import grouping/order inconsistencies in key modules (`config.ts`, `file-writer.ts`, `memory-indexer.ts`, `subfolder-utils.ts`, `tree-thinning.ts`, `workflow.ts`).
- `ISS-B01-005 (P2)`: Limited WHY-oriented AI-intent comments in large/complex logic modules (`workflow.ts`, `quality-scorer.ts`, `input-normalizer.ts`).

## Recommendations
1. Add a short `/** ... */` module-purpose header to every `.ts` file.
2. Rename exported/internal constants to camelCase (or explicitly document/standardize constant-case exception if intended).
3. Replace silent catches with structured logging and context-rich messages; keep true best-effort catches but still log at `debug`/`warn`.
4. Normalize import blocks per standard: built-ins, external deps, internal modules, then `import type` block last.
5. Add concise WHY-comments around heuristics/fallback precedence in `workflow.ts`, `quality-scorer.ts`, and `input-normalizer.ts`.
6. Keep current named-export approach; no default-export migration is needed.
tokens used
65,885
