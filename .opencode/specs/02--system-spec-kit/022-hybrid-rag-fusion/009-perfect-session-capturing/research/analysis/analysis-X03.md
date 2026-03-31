OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019ccec8-f5e5-7c30-9d79-4b5f06110a3d
--------
user
You are auditing the session-capturing pipeline of a Spec Kit Memory system. Your focus: ERROR HANDLING & EDGE CASES.

TASK: Systematically test error handling across the entire pipeline. Read ALL .ts files in these directories:
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/ (11 files)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/ (9 files)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/ (2 files)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/renderers/ (2 files)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/ (12 files)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts

For each file, analyze what happens when:
1. Session has 0 messages (empty conversation)
2. Session has 1000+ messages (very long conversation)
3. JSON is corrupted or malformed
4. Files referenced in session don't exist on disk
5. Disk is full during file write
6. Permission denied on output directory
7. Concurrent writes to the same memory file
8. Input contains extremely long strings (>1MB per field)
9. Timestamps are in wrong format or timezone
10. Spec folder path doesn't exist or is a symlink

Map every try/catch block. For each one:
- Does it catch the right exception types?
- Does it log useful information?
- Does it re-throw or swallow errors?
- Is there a fallback behavior, and is it correct?
- Are there unhandled promise rejections? 

OUTPUT FORMAT — repeat this block for EACH finding:

### FINDING-[NN]: [Title]
- **File:** [path:lines]
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** BUG / QUALITY / PERFORMANCE / SECURITY / DESIGN
- **Current Behavior:** [what happens now]
- **Expected Behavior:** [what should happen]
- **Root Cause:** [why it is wrong]
- **Suggested Fix:** [concrete code change or pseudocode]
- **Effort:** TRIVIAL (<5 min) / SMALL (<30 min) / MEDIUM (<2 hr) / LARGE (>2 hr)

End with:

### SUMMARY
- Total findings: [N]
- Critical: [N], High: [N], Medium: [N], Low: [N]
- Top 3 recommendations: [...]

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or spawn child tasks. Complete ALL work with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only code audit of the entire session-capturing pipeline, with emphasis on error paths, edge cases, and every `try/catch` boundary. I’ll first route the task through the local skill system, then enumerate and read all targeted `.ts` files so the findings are grounded in exact code paths and line references.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts/extractors .opencode/skill/system-spec-kit/scripts/core .opencode/skill/system-spec-kit/scripts/loaders .opencode/skill/system-spec-kit/scripts/renderers .opencode/skill/system-spec-kit/scripts/utils .opencode/skill/system-spec-kit/scripts/memory | rg '\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
.opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts
.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts
.opencode/skill/system-spec-kit/scripts/core/workflow.ts
.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
.opencode/skill/system-spec-kit/scripts/core/config.ts
.opencode/skill/system-spec-kit/scripts/core/index.ts
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Audit the Spec Kit Memory session-capturing pipeline for error handling and edge cases across extractors, core, loaders, renderers, utils, and memory/generate-context.ts; map all try/catch blocks and produce findings-first review output." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 653ms:
[
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !audit, !audit(multi), !findings, !intent:review, !review"
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
    "confidence": 0.95,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, context, conversation, memory(name), save(name)"
  },
  {
    "skill": "command-spec-kit",
    "kind": "command",
codex
SKILL ROUTING: `sk-code--review` (confidence `0.95`). I’m loading that review guidance now, then I’ll read the targeted TypeScript files in manageable batches and build a try/catch map with exact file/line evidence.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
codex
I’ve confirmed this is a findings-first review task and I’m treating `.opencode` as OpenCode system code, so I’m pairing the review baseline with the `sk-code--opencode` overlay. Next I’m enumerating the exact 37 target files, then I’ll read them batch-by-batch and build a matrix for the 10 edge cases plus every `try/catch` site.
Plan update
Findings-first audit of the Spec Kit Memory session-capturing pipeline, focused on error handling and edge cases across the specified TypeScript files.
  ✓ Load review guidance and enumerate the exact 37 target TypeScript files in scope
  → Read every in-scope file and inventory pipeline stages, I/O boundaries, and try/catch blocks
  • Analyze the 10 requested edge cases against each relevant code path and identify concrete findings with severity
  • Assemble final findings report with file:line evidence and summary counts
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "printf 'extractors\\n'; rg --files .opencode/skill/system-spec-kit/scripts/extractors -g '*.ts'; printf '\\ncore\\n'; rg --files .opencode/skill/system-spec-kit/scripts/core -g '*.ts'; printf '\\nloaders\\n'; rg --files .opencode/skill/system-spec-kit/scripts/loaders -g '*.ts'; printf '\\nrenderers\\n'; rg --files .opencode/skill/system-spec-kit/scripts/renderers -g '*.ts'; printf '\\nutils\\n'; rg --files .opencode/skill/system-spec-kit/scripts/utils -g '*.ts'; printf '\\nmemory\\n'; printf '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts\\n'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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

 succeeded in 52ms:
extractors
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/index.ts
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts

core
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
.opencode/skill/system-spec-kit/scripts/core/config.ts
.opencode/skill/system-spec-kit/scripts/core/index.ts
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
codex
I’ve got the exact 37 files in scope now. To keep this rigorous without drowning in raw output, I’m building a structural inventory first: line counts, filesystem/JSON/timestamp touchpoints, and every `try/catch` location, then I’ll open the higher-risk files around those hotspots and backfill the lower-risk modules to ensure all files were read.
exec
/bin/zsh -lc "rg -n \"\\btry\\b|\\bcatch\\b|JSON\\.parse|JSON\\.stringify|readFile|writeFile|mkdir|stat\\(|lstat\\(|realpath|symlink|rename\\(|rm\\(|unlink\\(|new Date\\(|Date\\.parse|parseISO|Promise\\.all|await \" .opencode/skill/system-spec-kit/scripts/extractors .opencode/skill/system-spec-kit/scripts/core .opencode/skill/system-spec-kit/scripts/loaders .opencode/skill/system-spec-kit/scripts/renderers .opencode/skill/system-spec-kit/scripts/utils .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); const files=[...process.argv.slice(1)]; for (const f of files){ const txt=fs.readFileSync(f,'utf8'); const lines=txt.split(/\\r?\\n/); console.log('FILE',f,lines.length); lines.forEach((line,i)=>{ if(/\\btry\\b|\\bcatch\\b|JSON\\.parse|JSON\\.stringify|readFile|writeFile|mkdir|stat\\(|lstat\\(|realpath|symlink|rename\\(|rm\\(|unlink\\(|new Date\\(|Date\\.parse|parseISO|Promise\\.all|await /.test(line)) console.log(String(i+1).padStart(4,' ')+': '+line);}); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/extractors/*.ts .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/loaders/*.ts .opencode/skill/system-spec-kit/scripts/renderers/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:293:  // --- Subfolder support: before failing, try to find the folder as a child ---
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:313:    try {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:330:          try {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:345:                try {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:354:                } catch (_error: unknown) {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:361:          } catch (_error: unknown) {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:380:    } catch (error: unknown) {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:455:  try {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:460:    await runWorkflow({
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:466:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:487:  main().catch((error: unknown) => {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:134:          return firstKey ? String((item as Record<string, unknown>)[firstKey]) : JSON.stringify(item);
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:142:      return firstKey ? String((value as Record<string, unknown>)[firstKey]) : JSON.stringify(value);
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:164:  try {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:166:    await fs.access(templatePath);
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:167:  } catch (_accessError: unknown) {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:178:  try {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:179:    template = await fs.readFile(templatePath, 'utf-8');
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:180:  } catch (readError: unknown) {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:54:    try {
 succeeded in 51ms:
FILE .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts 837
 577:     ? new Date(lastPrompt.timestamp).toISOString()
 578:     : new Date().toISOString();
 618:   const now = new Date();
 622:     const detectedFolder = await detectSpecFolder();
 730:     try {
 731:       SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[];
 732:     } catch (docError: unknown) {

FILE .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts 91

FILE .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts 254
  80:     const rawTimestamp: string = userPrompt.timestamp || new Date().toISOString();
  89:     const userTime = new Date(rawTimestamp);
  96:         const obsTime = new Date(obs.timestamp || '');
 101:         const timeA = new Date(a.obs.timestamp || '').getTime();
 102:         const timeB = new Date(b.obs.timestamp || '').getTime();
 163:         timestamps.push(new Date(phaseTimestamp));
 170:     const timeA = new Date(a.TIMESTAMP.replace(' @ ', 'T')).getTime();
 171:     const timeB = new Date(b.TIMESTAMP.replace(' @ ', 'T')).getTime();
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/scripts/extractors/*.ts .opencode/skill/system-spec-kit/scripts/core/*.ts .opencode/skill/system-spec-kit/scripts/loaders/*.ts .opencode/skill/system-spec-kit/scripts/renderers/*.ts .opencode/skill/system-spec-kit/scripts/utils/*.ts .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     836 .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
      90 .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
     253 .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts
     400 .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
     236 .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts
     338 .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
     400 .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts
      37 .opencode/skill/system-spec-kit/scripts/extractors/index.ts
     539 .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
     127 .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
     479 .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
     287 .opencode/skill/system-spec-kit/scripts/core/config.ts
      97 .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
      35 .opencode/skill/system-spec-kit/scripts/core/index.ts
     155 .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
     146 .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
     352 .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
      96 .opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts
     248 .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts
     950 .opencode/skill/system-spec-kit/scripts/core/workflow.ts
codex
I’ve mapped the likely fault boundaries. The next pass is a direct source read, split into chunks so I can inspect full implementations instead of relying on grep alone; I’m starting with the shared utilities and the smaller core/loader/renderer modules, because those define most of the normalization and path/error contracts the larger pipeline files build on.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); for (const f of process.argv.slice(1)) { console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line)); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/loaders/index.ts .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/renderers/index.ts .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts .opencode/skill/system-spec-kit/scripts/core/index.ts .opencode/skill/system-spec-kit/scripts/core/file-writer.ts .opencode/skill/system-spec-kit/scripts/core/config.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts .opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); for (const f of process.argv.slice(1)) { console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line)); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/utils/index.ts .opencode/skill/system-spec-kit/scripts/utils/data-validator.ts .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/utils/logger.ts .opencode/skill/system-spec-kit/scripts/utils/message-utils.ts .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts .opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts .opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts .opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/loaders/index.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Index
   3: // ---------------------------------------------------------------
   4: // Barrel export for data loading modules
   5: // ---------------------------------------------------------------
   6: 
   7: export { loadCollectedData } from './data-loader';
   8: export type { DataSource, LoadedData } from './data-loader';
   9: 

FILE .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Data Loader
   3: // ---------------------------------------------------------------
   4: // Loads session data from file, OpenCode capture, or simulation fallback
   5: 
   6: // 1. IMPORTS
   7: 
   8: import fs from 'fs/promises';
 succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/utils/index.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Index
   3: // ---------------------------------------------------------------
   4: // Barrel export for utility modules (logger, path, validation, file helpers)
   5: // ---------------------------------------------------------------
   6: 
   7: export { structuredLog } from './logger';
   8: export type { LogLevel, LogEntry } from './logger';
   9: 
  10: export { sanitizePath, getPathBasename } from './path-utils';
  11: 
  12: export {
  13:   ARRAY_FLAG_MAPPINGS,
  14:   PRESENCE_FLAG_MAPPINGS,
  15:   ensureArrayOfObjects,
  16:   hasArrayContent,
  17:   validateDataStructure,
  18: } from './data-validator';
  19: export type { ValidatedData } from './data-validator';
codex
A few of the larger shared modules were truncated in the first pass, especially `input-normalizer`, `message-utils`, `path-utils`, and `file-writer`. I’m reopening those directly now because they sit on the validation, timestamp, and write-path boundaries that determine whether bad input gets contained or leaks deeper into the pipeline.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); for (const f of process.argv.slice(1)) { console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line)); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/core/file-writer.ts .opencode/skill/system-spec-kit/scripts/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); for (const f of process.argv.slice(1)) { console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line)); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/utils/message-utils.ts .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts .opencode/skill/system-spec-kit/scripts/utils/logger.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
FILE .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: File Writer
   3: // ---------------------------------------------------------------
   4: // Atomic file writing with validation and rollback on failure
   5: 
   6: import * as fs from 'fs/promises';
   7: import * as path from 'path';
   8: import * as crypto from 'crypto';
   9: import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';
  10: 
  11: const MIN_SUBSTANCE_CHARS = 200;
  12: const FRONTMATTER_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;
  13: 
  14: function validateContentSubstance(content: string, filename: string): void {
  15:   const stripped = content
  16:     .replace(FRONTMATTER_BLOCK_RE, '')            // frontmatter
  17:     .replace(/<!--.*?-->/g, '')                 // HTML comments / anchors
  18:     .replace(/^#+\s*.*$/gm, '')                // empty headings
  19:     .replace(/^\|.*\|$/gm, '')                 // table rows (template structure)
 succeeded in 50ms:
FILE .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Input Normalizer
   3: // ---------------------------------------------------------------
   4: // Validates, normalizes, and transforms raw input data into structured session format
   5: 
   6: // 1. TYPES
   7: 
   8: /** Data source type indicating where loaded data came from */
   9: export type DataSource = 'file' | 'opencode-capture' | 'simulation';
  10: 
  11: /** A single observation record produced by transformation */
  12: export interface Observation {
  13:   type: string;
  14:   title: string;
  15:   narrative: string;
  16:   facts: string[];
  17:   timestamp?: string;
  18:   files?: string[];
  19:   _manualDecision?: {
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); for (const f of process.argv.slice(1)) { console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line)); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); const f=process.argv[1]; console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line));\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
FILE .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Subfolder Utils
   3: // ---------------------------------------------------------------
   4: // CORE: SUBFOLDER UTILS
   5: 
   6: import * as path from 'path';
   7: import * as fsSync from 'fs';
   8: import * as fs from 'fs/promises';
   9: import { CONFIG, getSpecsDirectories } from './config';
  10: 
  11: /** Pattern for strict spec folder names: 3 digits + kebab-case suffix. */
  12: export const SPEC_FOLDER_PATTERN: RegExp = /^\d{3}-[a-z][a-z0-9-]*$/;
  13: 
  14: /** Basic pattern for initial spec folder detection (less strict). */
  15: export const SPEC_FOLDER_BASIC_PATTERN: RegExp = /^\d{3}-[a-zA-Z]/;
  16: 
  17: /** Pattern for category/organizational folders: 2 digits + double-hyphen + kebab-case (e.g., "02--system-spec-kit"). */
  18: export const CATEGORY_FOLDER_PATTERN: RegExp = /^\d{2}--[a-z][a-z0-9-]*$/;
  19: 
 succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/core/workflow.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Workflow
   3: // ---------------------------------------------------------------
   4: // Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
   5: // ---------------------------------------------------------------
   6: 
   7: // Node stdlib
   8: import * as path from 'path';
   9: import * as fsSync from 'fs';
  10: 
  11: // Internal modules
  12: import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
  13: import {
  14:   extractConversations,
  15:   extractDecisions,
  16:   extractDiagrams,
  17:   extractPhasesFromData,
  18:   enhanceFilesWithSemanticDescriptions,
  19: } from '../extractors';
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const f=process.argv[1]; console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line));\" .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); for (const f of process.argv.slice(1)) { console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line)); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/extractors/index.ts .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Session Extractor
   3: // ---------------------------------------------------------------
   4: // Extracts session metadata — ID, title, duration, key topics, and learning delta
   5: 
   6: // Node stdlib
   7: import * as crypto from 'crypto';
   8: import { execSync } from 'child_process';
   9: import * as fs from 'fs/promises';
  10: import * as path from 'path';
  11: 
  12: // Internal modules
  13: import { CONFIG } from '../core';
  14: import {
  15:   createValidShortTerms,
  16:   shouldIncludeTopicWord,
  17:   tokenizeTopicWords,
  18: } from '../lib/topic-keywords';
  19: 
 succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/extractors/index.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Index
   3: // ---------------------------------------------------------------
   4: // Barrel export for all extractor modules (files, diagrams, conversations, decisions, sessions)
   5: // ---------------------------------------------------------------
   6: 
   7: export * from './file-extractor';
   8: export * from './diagram-extractor';
   9: export * from './conversation-extractor';
  10: export * from './decision-extractor';
  11: export * from './session-extractor';
  12: /** Re-export extractor functions and helpers. */
  13: export {
  14:   buildImplementationGuideData,
  15:   hasImplementationWork,
  16:   extractMainTopic,
  17:   extractWhatBuilt,
  18:   extractKeyFilesWithRoles,
  19:   generateExtensionGuide,
codex
The extractor pass surfaced the main risk zones: timestamp parsing in `conversation-extractor`, broad fallback behavior in `data-loader`/`workflow`, and a lot of “best effort” filesystem handling in the OpenCode capture path. I’m drilling into the remaining truncated modules now, plus the CLI entrypoint and collection code, because that’s where malformed input and partial filesystem failures are most likely to get misclassified instead of stopped.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); for (const f of process.argv.slice(1)) { console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line)); console.log(''); }\" .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); const f=process.argv[1]; console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line));\" .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
FILE .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Decision Extractor
   3: // ---------------------------------------------------------------
   4: // Extracts decision records with options, rationale, confidence, and decision trees
   5: 
   6: import { formatTimestamp } from '../utils/message-utils';
   7: import { validateDataStructure } from '../utils/data-validator';
   8: import { generateAnchorId, validateAnchorUniqueness, extractSpecNumber } from '../lib/anchor-generator';
   9: import { generateDecisionTree } from '../lib/decision-tree-generator';
  10: import type { DecisionNode } from '../lib/decision-tree-generator';
  11: import * as simFactory from '../lib/simulation-factory';
  12: import type { DecisionOption, DecisionRecord, DecisionData } from '../types/session-types';
  13: 
  14: // Re-export canonical types for backward compatibility
  15: export type { DecisionOption, DecisionRecord, DecisionData };
  16: 
  17: /* -----------------------------------------------------------------
  18:    1. INTERFACES
  19: ------------------------------------------------------------------*/
 succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Opencode Capture
   3: // ---------------------------------------------------------------
   4: // Captures and parses OpenCode session data from JSONL conversation logs
   5: 
   6: import * as fs from 'fs/promises';
   7: import * as fsSync from 'fs';
   8: import * as path from 'path';
   9: import * as readline from 'readline';
  10: import { CONFIG } from '../core';
  11: 
  12: /* -----------------------------------------------------------------
  13:    1. INTERFACES
  14: ------------------------------------------------------------------*/
  15: 
  16: /** A prompt entry captured from a session transcript. */
  17: export interface PromptEntry {
  18:   input: string;
  19:   timestamp: string | null;
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const f=process.argv[1]; console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line));\" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); const f=process.argv[1]; console.log('FILE '+f); fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((line,i)=>console.log(String(i+1).padStart(4,' ')+': '+line));\" .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Generate Context
   3: // ---------------------------------------------------------------
   4: // CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
   5: 
   6: // Node stdlib
   7: import * as path from 'path';
   8: import * as fsSync from 'fs';
   9: 
  10: // Internal modules
  11: import {
  12:   CONFIG,
  13:   findActiveSpecsDir,
  14:   getSpecsDirectories,
  15:   SPEC_FOLDER_PATTERN,
  16:   SPEC_FOLDER_BASIC_PATTERN,
  17:   CATEGORY_FOLDER_PATTERN,
  18:   findChildFolderSync,
  19:   getPhaseFolderRejectionSync,
 succeeded in 52ms:
FILE .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
   1: // ---------------------------------------------------------------
   2: // MODULE: Collect Session Data
   3: // ---------------------------------------------------------------
   4: // Orchestrates session data collection — gathers observations, files, decisions, and context
   5: 
   6: // Node stdlib
   7: import * as path from 'path';
   8: 
   9: // Internal modules
  10: import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from '../core';
  11: import { formatTimestamp } from '../utils/message-utils';
  12: import { pickBestContentName } from '../utils/slug-utils';
  13: import { detectSpecFolder } from '../spec-folder';
  14: 
  15: import {
  16:   generateSessionId,
  17:   getChannel,
  18:   detectSessionCharacteristics,
  19:   buildProjectStateSnapshot,
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; import re; files=list(Path('.opencode/skill/system-spec-kit/scripts/extractors').glob('*.ts'))+list(Path('.opencode/skill/system-spec-kit/scripts/core').glob('*.ts'))+list(Path('.opencode/skill/system-spec-kit/scripts/loaders').glob('*.ts'))+list(Path('.opencode/skill/system-spec-kit/scripts/renderers').glob('*.ts'))+list(Path('.opencode/skill/system-spec-kit/scripts/utils').glob('*.ts'))+[Path('.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts')]; total=0; per=[]; 
for f in files:
 txt=f.read_text(); c=len(re.findall(r'\\btry\\b',txt));
 if c: per.append((str(f),c)); total+=c
print('total_try',total)
for p,c in per: print(c,p)\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 691ms:
total_try 55
1 .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
8 .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
2 .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
6 .opencode/skill/system-spec-kit/scripts/core/workflow.ts
3 .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
5 .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
2 .opencode/skill/system-spec-kit/scripts/core/config.ts
12 .opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
4 .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
2 .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts
1 .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts
4 .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts
5 .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
exec
/bin/zsh -lc "rg -n \"new Date\\(["'^)]*'"\\)\\.toISOString\\(|new Date\\(["'^)]*'"\\)\\.getTime\\(|new Date\\(["'^)]*'"\\)\" .opencode/skill/system-spec-kit/scripts/extractors .opencode/skill/system-spec-kit/scripts/utils .opencode/skill/system-spec-kit/scripts/loaders .opencode/skill/system-spec-kit/scripts/core .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:267:    timestamp: new Date().toISOString()
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:386:    timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString()
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:422:          timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:435:      timestamp: tool.timestamp ? new Date(tool.timestamp).toISOString() : new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:91:      timestamp: new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:325:      TIMESTAMP: obs.timestamp || new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:79:function formatTimestamp(date: Date | string | number = new Date(), format: TimestampFormat = 'iso'): string {
.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:80:  const d: Date = date instanceof Date ? date : new Date(date);
.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:84:    return formatTimestamp(new Date(), format);
.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:88:  const adjustedDate: Date = new Date(d.getTime() + offsetMs);
.opencode/skill/system-spec-kit/scripts/utils/logger.ts:28:    timestamp: new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:577:    ? new Date(lastPrompt.timestamp).toISOString()
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:578:    : new Date().toISOString();
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:618:  const now = new Date();
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:133:      generatedAt: new Date().toISOString()
.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:446:    captured_at: new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:474:      const promptTime = new Date(p.timestamp || '').getTime();
.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:157:        TIMESTAMP: obs.timestamp || new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:283:    const parsed = new Date(dateStr);
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:80:    const rawTimestamp: string = userPrompt.timestamp || new Date().toISOString();
exec
/bin/zsh -lc "rg -n \"JSON\\.parse|SyntaxError|readJsonSafe|readJsonlTail|fs\\.readFile\\(|fsSync\\.readFileSync\\(|fs\\.writeFile\\(|fsSync\\.writeFileSync\\(|fs\\.rename\\(|fs\\.unlink\\(|fs\\.access\\(|fs\\.readdir\\(|fsSync\\.readdirSync\\(|fs\\.realpath\\(|fsSync\\.realpathSync\\(|process\\.exit\\(|withWorkflowRunLock|ensureUniqueMemoryFilename|checkForDuplicateContent|SIGINT|SIGTERM\" .opencode/skill/system-spec-kit/scripts/extractors .opencode/skill/system-spec-kit/scripts/core .opencode/skill/system-spec-kit/scripts/loaders .opencode/skill/system-spec-kit/scripts/renderers .opencode/skill/system-spec-kit/scripts/utils .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:105:  process.exit(0);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:112:process.on('SIGTERM', () => {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:113:  console.log('\nWarning: Received SIGTERM signal, shutting down gracefully...');
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:114:  process.exit(0);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:117:process.on('SIGINT', () => {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:118:  console.log('\nWarning: Received SIGINT signal, shutting down gracefully...');
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:119:  process.exit(0);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:314:      const available = fsSync.readdirSync(specsDir);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:332:            const topChildren = fsSync.readdirSync(topPath);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:347:                  const grandChildren = fsSync.readdirSync(midPath);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:386:  process.exit(1);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:478:    process.exit(1);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:493:    process.exit(1);
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:58:    return fsSync.readFileSync(filePath, 'utf8');
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:84:    return fsSync.readdirSync(parentPath).filter((entry) => {
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:180:    try { realRoot = fsSync.realpathSync(specsDir); } catch (_error: unknown) {
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:196:    try { realDir = fsSync.realpathSync(dir); } catch (_error: unknown) {
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:205:      dirents = fsSync.readdirSync(dir, { withFileTypes: true });
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:239:      try { return fsSync.realpathSync(m); } catch (_error: unknown) {
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:270:      await fs.access(specsDir);
codex
Mapped 55 `try/catch` blocks across the 37 requested files. This is a source audit rather than a destructive runtime repro because the workspace is read-only. I did not find a clear top-level unhandled-promise-rejection path; the recurring problem is swallowed exceptions plus incorrect fallback behavior.

### FINDING-01: Malformed JSON Input Silently Downgrades To Capture/Simulation
- **File:** [data-loader.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L82>), [data-loader.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L117>), [data-loader.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L145>)
- **Severity:** CRITICAL
- **Category:** BUG
- **Current Behavior:** If an explicit `dataFile` is unreadable, malformed, or fails validation, the catch logs a warning and then falls through to OpenCode capture and finally simulation mode.
- **Expected Behavior:** An explicit JSON input should be authoritative; malformed input should stop the run with a non-zero exit unless fallback was explicitly requested.
- **Root Cause:** The `dataFile` branch wraps read, parse, and validation in one broad catch and treats all failures as recoverable.
- **Suggested Fix:** Fail fast when `dataFile` is provided. Only enter capture/simulation when `dataFile` is absent. Split read/parse/validate into explicit error branches with path + parse-position details.
- **Effort:** SMALL (<30 min)

### FINDING-02: Timestamp Handling Is Inconsistent And Can Either Crash Or Skew Ordering
- **File:** [input-normalizer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L384>), [collect-session-data.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L575>), [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L160>)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `new Date(value).toISOString()` throws on malformed timestamps, while readable timestamps are later re-parsed as local time for sorting/duration, which can skew ordering around timezone/DST boundaries.
- **Expected Behavior:** Bad timestamps should degrade per-record, not abort the run, and ordering should use preserved epoch values instead of display strings.
- **Root Cause:** Multiple modules bypass [`formatTimestamp`](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts#L79>) and round-trip through raw `Date` parsing.
- **Suggested Fix:** Add a shared `safeTimestamp()` helper returning `{ iso, epoch }`; use `epoch` for sort/duration and fallback to `Date.now()` only per bad record.
- **Effort:** MEDIUM (<2 hr)

### FINDING-03: Observation-Only / Zero-Message Sessions Lose Conversation History
- **File:** [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L55>), [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L77>)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** When `userPrompts` is empty, the extractor only warns; it never converts observations into `MESSAGES`, so phases stay empty and duration becomes `N/A`.
- **Expected Behavior:** Observation-only sessions should still produce a minimal timeline from observation timestamps/titles.
- **Root Cause:** The extractor’s main loop is keyed entirely off `userPrompts`.
- **Suggested Fix:** Add a fallback branch that synthesizes assistant/observation messages when prompts are absent but observations exist.
- **Effort:** SMALL (<30 min)

### FINDING-04: Output Writes Are Not Transactionally Atomic
- **File:** [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L59>), [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L80>), [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L845>)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Each file is written atomically on its own, but a later `ENOSPC`/`EACCES` can leave earlier files already promoted, despite the rollback comment.
- **Expected Behavior:** The memory save should be all-or-nothing across the full output set.
- **Root Cause:** The writer renames files one-by-one and never rolls back already-promoted outputs.
- **Suggested Fix:** Stage all temp files first, validate all of them, then promote them together; if any promotion fails, delete temps and revert promoted files.
- **Effort:** MEDIUM (<2 hr)

### FINDING-05: Concurrent Processes Can Overwrite The Same Memory File
- **File:** [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L359>), [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L651>), [slug-utils.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L136>), [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L72>)
- **Severity:** CRITICAL
- **Category:** DESIGN
- **Current Behavior:** The queue lock is process-local; two CLI processes can choose the same filename from a stale directory snapshot, and the writer will only warn before overwriting.
- **Expected Behavior:** Cross-process saves should be mutually exclusive, or at minimum refuse final-target overwrite.
- **Root Cause:** TOCTOU filename generation plus no filesystem-level lock or `O_EXCL`/no-clobber semantics.
- **Suggested Fix:** Add a per-context lockfile, generate unique temp names, and fail if the final target already exists instead of overwriting it.
- **Effort:** LARGE (>2 hr)

### FINDING-06: Spec Folder Validation Does Not Verify Existence Or Symlink Safety
- **File:** [generate-context.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L137>), [generate-context.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L217>), [generate-context.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L389>)
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** Paths that merely look like `NNN-name` can be accepted even if the directory does not exist, and symlink targets are never canonicalized/rejected.
- **Expected Behavior:** An explicit spec-folder target should exist, be a directory, and resolve inside an approved specs root.
- **Root Cause:** Validation is based on naming/prefix heuristics instead of `lstat` + `realpath`.
- **Suggested Fix:** After parsing, `lstatSync` the target, reject symlinks, `realpathSync` both target and roots, and compare canonical paths before continuing.
- **Effort:** SMALL (<30 min)

### FINDING-07: Corrupted Or Unreadable OpenCode Storage Is Treated As “No Data”
- **File:** [opencode-capture.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L127>), [opencode-capture.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L205>), [opencode-capture.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L242>)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Malformed JSON, `EACCES`, and other read failures collapse to `null`/`[]`, so upstream logic treats corruption as an empty/missing session and may fall back to simulation.
- **Expected Behavior:** `ENOENT` may be recoverable, but parse and permission failures should surface with file-path context and stop capture.
- **Root Cause:** `readJsonSafe` and directory readers catch any `Error` and return absence instead of typed failure.
- **Suggested Fix:** Only swallow `ENOENT`; throw structured parse/permission errors, and include the offending path in logs.
- **Effort:** MEDIUM (<2 hr)

### FINDING-08: Permission Errors Are Misclassified As “Directory Missing” During Safeguard Checks
- **File:** [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L35>), [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L72>), [slug-utils.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L136>)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** `readdir`/`access` failures including `EACCES` are treated the same as `ENOENT`, disabling duplicate and uniqueness checks before the later write fails.
- **Expected Behavior:** Only “not found” should be ignored; permission and type errors should abort immediately with a precise diagnostic.
- **Root Cause:** Broad catch blocks do not inspect errno codes and emit little/no logging.
- **Suggested Fix:** Branch on `err.code`; ignore `ENOENT`, but rethrow `EACCES`, `ENOTDIR`, and similar errors with `contextDir`/`filePath`.
- **Effort:** SMALL (<30 min)

### FINDING-09: There Are No Payload Size Or Message-Count Guards Before Expensive Work
- **File:** [input-normalizer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L291>), [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L77>), [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L705>), [memory-indexer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L42>)
- **Severity:** MEDIUM
- **Category:** PERFORMANCE
- **Current Behavior:** 1000+ messages and 1MB+ fields pass validation unchanged, then flow into nested scans, full-template rendering, and embedding generation.
- **Expected Behavior:** Oversized payloads should be rejected, truncated, or summarized before extraction/rendering/indexing.
- **Root Cause:** Validation checks shape only; it does not cap counts, lengths, or rendered output size.
- **Suggested Fix:** Enforce max messages/observations/string bytes at validation time and short-circuit to summarized mode when limits are exceeded.
- **Effort:** MEDIUM (<2 hr)

### FINDING-10: Missing Referenced Files Are Surfaced As Current Artifacts Without Annotation
- **File:** [file-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts#L101>), [session-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts#L197>), [implementation-guide-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts#L162>)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Paths mentioned in the session are treated as live `FILES`, `ACTIVE_FILE`, and key-file roles even if the file no longer exists on disk.
- **Expected Behavior:** Historical references can be preserved, but they should be marked missing/deleted before they are presented as current artifacts.
- **Root Cause:** The pipeline uses one file-reference shape for both historical evidence and present filesystem state.
- **Suggested Fix:** Add optional `EXISTS`/`MISSING` metadata during enrichment and prefer existing files for “active file” / key-file selection.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 10
- Critical: 2, High: 4, Medium: 4, Low: 0
- Top 3 recommendations: 1. Make explicit inputs authoritative and fail fast on malformed JSON/timestamps/storage corruption instead of falling back to capture/simulation. 2. Replace per-file writes with a transactional multi-file write path plus cross-process locking/no-clobber semantics. 3. Harden validation up front: canonicalize spec-folder paths, reject symlinks/escaped realpaths, cap payload sizes, and carry epochs instead of reparsing display timestamps.
tokens used
174,665
Mapped 55 `try/catch` blocks across the 37 requested files. This is a source audit rather than a destructive runtime repro because the workspace is read-only. I did not find a clear top-level unhandled-promise-rejection path; the recurring problem is swallowed exceptions plus incorrect fallback behavior.

### FINDING-01: Malformed JSON Input Silently Downgrades To Capture/Simulation
- **File:** [data-loader.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L82>), [data-loader.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L117>), [data-loader.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L145>)
- **Severity:** CRITICAL
- **Category:** BUG
- **Current Behavior:** If an explicit `dataFile` is unreadable, malformed, or fails validation, the catch logs a warning and then falls through to OpenCode capture and finally simulation mode.
- **Expected Behavior:** An explicit JSON input should be authoritative; malformed input should stop the run with a non-zero exit unless fallback was explicitly requested.
- **Root Cause:** The `dataFile` branch wraps read, parse, and validation in one broad catch and treats all failures as recoverable.
- **Suggested Fix:** Fail fast when `dataFile` is provided. Only enter capture/simulation when `dataFile` is absent. Split read/parse/validate into explicit error branches with path + parse-position details.
- **Effort:** SMALL (<30 min)

### FINDING-02: Timestamp Handling Is Inconsistent And Can Either Crash Or Skew Ordering
- **File:** [input-normalizer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L384>), [collect-session-data.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L575>), [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L160>)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `new Date(value).toISOString()` throws on malformed timestamps, while readable timestamps are later re-parsed as local time for sorting/duration, which can skew ordering around timezone/DST boundaries.
- **Expected Behavior:** Bad timestamps should degrade per-record, not abort the run, and ordering should use preserved epoch values instead of display strings.
- **Root Cause:** Multiple modules bypass [`formatTimestamp`](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts#L79>) and round-trip through raw `Date` parsing.
- **Suggested Fix:** Add a shared `safeTimestamp()` helper returning `{ iso, epoch }`; use `epoch` for sort/duration and fallback to `Date.now()` only per bad record.
- **Effort:** MEDIUM (<2 hr)

### FINDING-03: Observation-Only / Zero-Message Sessions Lose Conversation History
- **File:** [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L55>), [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L77>)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** When `userPrompts` is empty, the extractor only warns; it never converts observations into `MESSAGES`, so phases stay empty and duration becomes `N/A`.
- **Expected Behavior:** Observation-only sessions should still produce a minimal timeline from observation timestamps/titles.
- **Root Cause:** The extractor’s main loop is keyed entirely off `userPrompts`.
- **Suggested Fix:** Add a fallback branch that synthesizes assistant/observation messages when prompts are absent but observations exist.
- **Effort:** SMALL (<30 min)

### FINDING-04: Output Writes Are Not Transactionally Atomic
- **File:** [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L59>), [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L80>), [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L845>)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Each file is written atomically on its own, but a later `ENOSPC`/`EACCES` can leave earlier files already promoted, despite the rollback comment.
- **Expected Behavior:** The memory save should be all-or-nothing across the full output set.
- **Root Cause:** The writer renames files one-by-one and never rolls back already-promoted outputs.
- **Suggested Fix:** Stage all temp files first, validate all of them, then promote them together; if any promotion fails, delete temps and revert promoted files.
- **Effort:** MEDIUM (<2 hr)

### FINDING-05: Concurrent Processes Can Overwrite The Same Memory File
- **File:** [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L359>), [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L651>), [slug-utils.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L136>), [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L72>)
- **Severity:** CRITICAL
- **Category:** DESIGN
- **Current Behavior:** The queue lock is process-local; two CLI processes can choose the same filename from a stale directory snapshot, and the writer will only warn before overwriting.
- **Expected Behavior:** Cross-process saves should be mutually exclusive, or at minimum refuse final-target overwrite.
- **Root Cause:** TOCTOU filename generation plus no filesystem-level lock or `O_EXCL`/no-clobber semantics.
- **Suggested Fix:** Add a per-context lockfile, generate unique temp names, and fail if the final target already exists instead of overwriting it.
- **Effort:** LARGE (>2 hr)

### FINDING-06: Spec Folder Validation Does Not Verify Existence Or Symlink Safety
- **File:** [generate-context.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L137>), [generate-context.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L217>), [generate-context.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L389>)
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** Paths that merely look like `NNN-name` can be accepted even if the directory does not exist, and symlink targets are never canonicalized/rejected.
- **Expected Behavior:** An explicit spec-folder target should exist, be a directory, and resolve inside an approved specs root.
- **Root Cause:** Validation is based on naming/prefix heuristics instead of `lstat` + `realpath`.
- **Suggested Fix:** After parsing, `lstatSync` the target, reject symlinks, `realpathSync` both target and roots, and compare canonical paths before continuing.
- **Effort:** SMALL (<30 min)

### FINDING-07: Corrupted Or Unreadable OpenCode Storage Is Treated As “No Data”
- **File:** [opencode-capture.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L127>), [opencode-capture.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L205>), [opencode-capture.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L242>)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Malformed JSON, `EACCES`, and other read failures collapse to `null`/`[]`, so upstream logic treats corruption as an empty/missing session and may fall back to simulation.
- **Expected Behavior:** `ENOENT` may be recoverable, but parse and permission failures should surface with file-path context and stop capture.
- **Root Cause:** `readJsonSafe` and directory readers catch any `Error` and return absence instead of typed failure.
- **Suggested Fix:** Only swallow `ENOENT`; throw structured parse/permission errors, and include the offending path in logs.
- **Effort:** MEDIUM (<2 hr)

### FINDING-08: Permission Errors Are Misclassified As “Directory Missing” During Safeguard Checks
- **File:** [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L35>), [file-writer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L72>), [slug-utils.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L136>)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** `readdir`/`access` failures including `EACCES` are treated the same as `ENOENT`, disabling duplicate and uniqueness checks before the later write fails.
- **Expected Behavior:** Only “not found” should be ignored; permission and type errors should abort immediately with a precise diagnostic.
- **Root Cause:** Broad catch blocks do not inspect errno codes and emit little/no logging.
- **Suggested Fix:** Branch on `err.code`; ignore `ENOENT`, but rethrow `EACCES`, `ENOTDIR`, and similar errors with `contextDir`/`filePath`.
- **Effort:** SMALL (<30 min)

### FINDING-09: There Are No Payload Size Or Message-Count Guards Before Expensive Work
- **File:** [input-normalizer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L291>), [conversation-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts#L77>), [workflow.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L705>), [memory-indexer.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L42>)
- **Severity:** MEDIUM
- **Category:** PERFORMANCE
- **Current Behavior:** 1000+ messages and 1MB+ fields pass validation unchanged, then flow into nested scans, full-template rendering, and embedding generation.
- **Expected Behavior:** Oversized payloads should be rejected, truncated, or summarized before extraction/rendering/indexing.
- **Root Cause:** Validation checks shape only; it does not cap counts, lengths, or rendered output size.
- **Suggested Fix:** Enforce max messages/observations/string bytes at validation time and short-circuit to summarized mode when limits are exceeded.
- **Effort:** MEDIUM (<2 hr)

### FINDING-10: Missing Referenced Files Are Surfaced As Current Artifacts Without Annotation
- **File:** [file-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts#L101>), [session-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts#L197>), [implementation-guide-extractor.ts](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts#L162>)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Paths mentioned in the session are treated as live `FILES`, `ACTIVE_FILE`, and key-file roles even if the file no longer exists on disk.
- **Expected Behavior:** Historical references can be preserved, but they should be marked missing/deleted before they are presented as current artifacts.
- **Root Cause:** The pipeline uses one file-reference shape for both historical evidence and present filesystem state.
- **Suggested Fix:** Add optional `EXISTS`/`MISSING` metadata during enrichment and prefer existing files for “active file” / key-file selection.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 10
- Critical: 2, High: 4, Medium: 4, Low: 0
- Top 3 recommendations: 1. Make explicit inputs authoritative and fail fast on malformed JSON/timestamps/storage corruption instead of falling back to capture/simulation. 2. Replace per-file writes with a transactional multi-file write path plus cross-process locking/no-clobber semantics. 3. Harden validation up front: canonicalize spec-folder paths, reject symlinks/escaped realpaths, cap payload sizes, and carry epochs instead of reparsing display timestamps.
<!-- /ANCHOR:when-to-use -->
