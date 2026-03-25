OpenAI Codex v0.116.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d23d8-bde5-7833-91d9-b97b72ca3423
--------
user
You are a code review agent. Review the scripts code for CORRECTNESS issues.

CONTEXT: Spec Kit Memory system scripts (Node.js/CommonJS, compiled to dist/). Prior v4 review found T79 bug in collect-session-data.js (nextSteps detection asymmetry). Check if this and other correctness issues exist.

SCOPE: Read key .js files under .opencode/skill/system-spec-kit/scripts/dist/ — focus on extractors/, evals/, memory/, and validators/.
Focus on: Logic errors, asymmetric checks, off-by-one errors, unhandled edge cases, incorrect type coercions.

OUTPUT FORMAT — use this exact structure:
# Iteration 002: Scripts Code Correctness Review
## Agent: codex / gpt-5.4 / high
## Dimension: correctness
## Files Reviewed
(list each file you read)
## Findings
### [SEVERITY]-[NNN]: [Title]
- Severity: P0|P1|P2
- Evidence: [file:line]
- Description: ...
- Impact: ...
- Fix: ...
(repeat for each finding, or write "No findings" if clean)
## Summary
- Total findings: N (P0: N, P1: N, P2: N)
- newFindingsRatio: X.XX

IMPORTANT: Specifically check .opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js lines 270-283 for the T79 nextSteps detection asymmetry (hasNextSteps checks both raw array AND observations, but hasUnresolvedNextSteps only checks raw array). Report whether this is STILL OPEN or FIXED.

Be thorough. Read actual code, cite file:line evidence.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp: cocoindex_code ready
mcp startup: ready: code_mode, sequential_thinking, cocoindex_code; failed: spec_kit_memory
codex
Reviewing the compiled Spec Kit Memory scripts for correctness, with special attention to the `collect-session-data.js` T79 asymmetry you called out. I’m first checking the applicable review guidance and then I’ll read the key `dist/` files in `extractors/`, `evals/`, `memory/`, and `validators/` before I write up findings with exact line citations.
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' -g 'SKILL.md' .opencode/skill/system-spec-kit .opencode/skill/sk-code--review .opencode/skill/sk-code--opencode" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-code--review/SKILL.md
.opencode/skill/sk-code--opencode/SKILL.md
.opencode/skill/system-spec-kit/SKILL.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Review the scripts code for correctness issues in .opencode/skill/system-spec-kit/scripts/dist, focusing on extractors, evals, memory, and validators" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publictool cocoindex_code.search({"query":"logic for collecting session data next steps unresolved next steps observations asymmetry","paths":[".opencode/skill/system-spec-kit/scripts/dist/extractors/*"],"languages":["javascript"],"limit":5,"refresh_index":true})
 succeeded in 1.21s:
2026-03-25 08:15:37.748 xcodebuild[66433:13650846]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:15:37.853 xcodebuild[66433:13650843] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-edZmg90V' (errno=Operation not permitted)
2026-03-25 08:15:38.185 xcodebuild[66607:13651163]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:15:38.290 xcodebuild[66607:13651146] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !intent:memory, !memory, !spec, !system-spec-kit(explicit)"
  },
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
cocoindex_code.search({"query":"logic for collecting session data next steps unresolved next steps observations asymmetry","paths":[".opencode/skill/system-spec-kit/scripts/dist/extractors/*"],"languages":["javascript"],"limit":5,"refresh_index":true}) success in 8.23s:
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
codex
I’ve confirmed the relevant skill docs are available. The advisor invocation had environment noise, so I’m polling it once and then I’ll proceed with the review using the obvious review path: `sk-code--review` for findings-first review, plus `sk-code--opencode` because this is OpenCode system JavaScript.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
 succeeded in 0ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

codex
SKILL ROUTING: `system-spec-kit`, `sk-code--review`, `sk-code--opencode`, and `mcp-coco-index` all crossed the threshold, so I’m using that review stack. Next I’m enumerating the scoped `dist/` files and reading the high-signal ones directly, especially around extraction, unresolved-next-step logic, validation boundaries, and any evaluation helpers that can hide off-by-one or coercion bugs.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/scripts/dist/extractors .opencode/skill/system-spec-kit/scripts/dist/evals .opencode/skill/system-spec-kit/scripts/dist/memory .opencode/skill/system-spec-kit/scripts/dist/validators' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 0ms:
rg: .opencode/skill/system-spec-kit/scripts/dist/validators: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.d.ts
.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.d.ts.map
.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.d.ts
.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.d.ts
.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.js.map
.opencode/skill/system-spec-kit/scripts/dist/memory/rebuild-auto-entities.d.ts.map
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.d.ts
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts.map
.opencode/skill/system-spec-kit/scripts/dist/memory/rebuild-auto-entities.js.map
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js.map
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js.map
.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js.map
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js.map
.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js
.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.js
.opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.d.ts
tool cocoindex_code.search({"query":"unresolved next steps detection observations array raw array asymmetry","paths":[".opencode/skill/system-spec-kit/scripts/dist/extractors/*",".opencode/skill/system-spec-kit/scripts/dist/memory/*",".opencode/skill/system-spec-kit/scripts/dist/validators/*"],"languages":["javascript"],"limit":10,"refresh_index":false})
cocoindex_code.search({"query":"unresolved next steps detection observations array raw array asymmetry","paths":[".opencode/skill/system-spec-kit/scripts/dist/extractors/*",".opencode/skill/system-spec-kit/scripts/dist/memory/*",".opencode/skill/system-spec-kit/scripts/dist/validators/*"],"languages":["javascript"],"limit":10,"refresh_index":false}) success in 249ms:
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
tool cocoindex_code.search({"query":"off by one type coercion parseInt Number isNaN length boundary file validation memory scripts","paths":[".opencode/skill/system-spec-kit/scripts/dist/evals/*",".opencode/skill/system-spec-kit/scripts/dist/memory/*",".opencode/skill/system-spec-kit/scripts/dist/validators/*"],"languages":["javascript"],"limit":10,"refresh_index":false})
cocoindex_code.search({"query":"off by one type coercion parseInt Number isNaN length boundary file validation memory scripts","paths":[".opencode/skill/system-spec-kit/scripts/dist/evals/*",".opencode/skill/system-spec-kit/scripts/dist/memory/*",".opencode/skill/system-spec-kit/scripts/dist/validators/*"],"languages":["javascript"],"limit":10,"refresh_index":false}) success in 247ms:
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
codex
The scope is slightly narrower than the prompt implies: there isn’t a `scripts/dist/validators/` directory here, so I’m treating validator logic under `dist/memory/validate-memory-quality.js` and related validation helpers as the validation surface. I’m pulling the actual `.js` files now and reading the core paths end to end.
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/scripts/dist -type d | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist
.opencode/skill/system-spec-kit/scripts/dist/config
.opencode/skill/system-spec-kit/scripts/dist/core
.opencode/skill/system-spec-kit/scripts/dist/evals
.opencode/skill/system-spec-kit/scripts/dist/extractors
.opencode/skill/system-spec-kit/scripts/dist/lib
.opencode/skill/system-spec-kit/scripts/dist/loaders
.opencode/skill/system-spec-kit/scripts/dist/memory
.opencode/skill/system-spec-kit/scripts/dist/renderers
.opencode/skill/system-spec-kit/scripts/dist/spec-folder
.opencode/skill/system-spec-kit/scripts/dist/tests
.opencode/skill/system-spec-kit/scripts/dist/tests/fixtures
.opencode/skill/system-spec-kit/scripts/dist/types
.opencode/skill/system-spec-kit/scripts/dist/utils
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Collect Session Data
     4	// ───────────────────────────────────────────────────────────────
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/scripts/dist/extractors .opencode/skill/system-spec-kit/scripts/dist/evals .opencode/skill/system-spec-kit/scripts/dist/memory -name '*.js' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js
.opencode/skill/system-spec-kit/scripts/dist/evals/check-architecture-boundaries.js
.opencode/skill/system-spec-kit/scripts/dist/evals/check-handler-cycles-ast.js
.opencode/skill/system-spec-kit/scripts/dist/evals/check-no-mcp-lib-imports-ast.js
.opencode/skill/system-spec-kit/scripts/dist/evals/check-no-mcp-lib-imports.js
.opencode/skill/system-spec-kit/scripts/dist/evals/check-source-dist-alignment.js
.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js
.opencode/skill/system-spec-kit/scripts/dist/evals/import-policy-rules.js
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js
.opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js
.opencode/skill/system-spec-kit/scripts/dist/evals/run-bm25-baseline.js
.opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js
.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/contamination-filter.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/diagram-extractor.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js
.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js | sed -n '420,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   420	    if (nextAction &&
   421	        nextAction !== 'Continue implementation' &&
   422	        !seen.has(nextAction.toLowerCase())) {
   423	        tasks.unshift({
   424	            TASK_ID: 'T000',
   425	            TASK_DESCRIPTION: nextAction,
   426	            TASK_PRIORITY: 'P0'
   427	        });
   428	    }
   429	    return tasks.slice(0, 10);
   430	}
   431	function generateContextSummary(summary, observations, projectPhase, decisionCount) {
   432	    const parts = [];
   433	    parts.push(`**Phase:** ${projectPhase}`);
   434	    if (observations.length > 0) {
   435	        const recentTitles = observations
   436	            .slice(-3)
   437	            .map((o) => o.title)
   438	            .filter((t) => !!t && t.length > 5)
   439	            .join(', ');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Session Extractor
     4	// ───────────────────────────────────────────────────────────────
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: File Extractor
     4	// ───────────────────────────────────────────────────────────────
     5	Object.defineProperty(exports, "__esModule", { value: true });
     6	exports.detectObservationType = detectObservationType;
     7	exports.extractFilesFromData = extractFilesFromData;
     8	exports.enhanceFilesWithSemanticDescriptions = enhanceFilesWithSemanticDescriptions;
     9	exports.buildObservationsWithAnchors = buildObservationsWithAnchors;
    10	exports.deduplicateObservations = deduplicateObservations;
    11	// ───────────────────────────────────────────────────────────────
    12	// 1. FILE EXTRACTOR
    13	// ───────────────────────────────────────────────────────────────
    14	// Extracts file references, descriptions, and observation types from session data
    15	const config_1 = require("../config");
    16	const fact_coercion_1 = require("../utils/fact-coercion");
    17	const file_helpers_1 = require("../utils/file-helpers");
    18	const path_utils_1 = require("../utils/path-utils");
    19	const anchor_generator_1 = require("../lib/anchor-generator");
    20	const ACTION_MAP = {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js | sed -n '320,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   320	                    if (process.env.DEBUG) {
   321	                        console.debug(`[session-extractor] rejected blocker artifact: ${sentence.trim()}`);
   322	                    }
   323	                    continue;
   324	                }
   325	                return sentence.trim().substring(0, 100);
   326	            }
   327	        }
   328	    }
   329	    return 'None';
   330	}
   331	/**
   332	 * Build a file progress list from spec files, marking each as `'EXISTS'`.
   333	 * @param specFiles - Optional array of spec file entries to convert.
   334	 * @returns Array of file progress entries, or empty array if no spec files provided.
   335	 */
   336	function buildFileProgress(specFiles) {
   337	    if (!specFiles?.length)
   338	        return [];
   339	    return specFiles.map((file) => ({ FILE_NAME: file.FILE_NAME, FILE_STATUS: 'EXISTS' }));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   320	                        existingFacts.push(fact);
   321	                        existingFactStrings.add(factStr);
   322	                    }
   323	                }
   324	                existing.obs.facts = existingFacts;
   325	            }
   326	            // Update narrative with count
   327	            if (existing.count === 2) {
   328	                existing.obs.narrative = `${existing.obs.narrative || title} (repeated ${existing.count} times)`;
   329	            }
   330	            else {
   331	                existing.obs.narrative = (existing.obs.narrative || title).replace(/\(repeated \d+ times\)/, `(repeated ${existing.count} times)`);
   332	            }
   333	        }
   334	        else {
   335	            // Deep copy nested arrays to prevent mutation of the original observations
   336	            const obsCopy = { ...obs, facts: obs.facts ? [...obs.facts] : undefined, files: obs.files ? [...obs.files] : undefined };
   337	            mergeTracker.set(dedupKey, { obs: obsCopy, count: 1, index: result.length });
   338	            result.push(obsCopy);
   339	        }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Conversation Extractor
     4	// ───────────────────────────────────────────────────────────────
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
codex
I’ve confirmed the specific T79 branch in `collect-session-data.js`, and the asymmetry you described is no longer present there. I’m now scanning the rest of the scoped runtime for other correctness risks by reading the main extractor, memory, and eval entrypoints plus a targeted grep for boundary-sensitive patterns like `parseInt`, `%`, `slice`, `length`, `new Date`, and `Array.isArray`.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Generate Context
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
exec
/bin/zsh -lc "rg -n \"parseInt|Number\\(|isNaN\\(|Number\\.isFinite|slice\\(|substring\\(|lastIndex|length\\s*[<>"'!=]=?|new Date'"\\(|Array\\.isArray|JSON\\.parse|Math\\.(floor|ceil|round)|%|split\\(\" .opencode/skill/system-spec-kit/scripts/dist/extractors .opencode/skill/system-spec-kit/scripts/dist/evals .opencode/skill/system-spec-kit/scripts/dist/memory" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/evals/import-policy-rules.js:74:    const segments = importPath.split('/');
.opencode/skill/system-spec-kit/scripts/dist/evals/import-policy-rules.js:77:        if (segment === '..' && resolved.length > 0) {
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:64:    const date = new Date(timestamp);
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:65:    if (isNaN(date.getTime())) {
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:74:        return `${Math.floor(daysSince * 24)}h ago`;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:76:        return `${Math.floor(daysSince)}d ago`;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:78:        return `${Math.floor(daysSince / 7)}w ago`;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:80:        return `${Math.floor(daysSince / 30)}mo ago`;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:81:    return `${Math.floor(daysSince / 365)}y ago`;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:87:    const scorePercent = Math.round((folder.score || 0) * 100);
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:88:    return `${name} (${count}, ${time}) ${scorePercent}%`;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:101:        createdAt: m.createdAt ?? new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:102:        updatedAt: m.updatedAt ?? m.createdAt ?? new Date().toISOString(),
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:116:        .slice(0, folderLimit)
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:144:            score: Math.round(score * 1000) / 1000,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:156:        .slice(0, folderLimit);
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:159:        .slice(0, folderLimit);
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:163:        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:164:        .slice(0, memoryLimit)
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:231:            options.folderLimit = parseInt(args[++i], 10) || 3;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env node
     2	"use strict";
     3	// ---------------------------------------------------------------
     4	// MODULE: Validate Memory Quality (re-export shim)
     5	// ---------------------------------------------------------------
     6	// Canonical implementation lives in ../lib/validate-memory-quality.ts.
     7	// This file re-exports everything for backward compatibility and
     8	// serves as the CLI entry point (node validate-memory-quality.js).
     9	var __importDefault = (this && this.__importDefault) || function (mod) {
    10	    return (mod && mod.__esModule) ? mod : { "default": mod };
    11	};
    12	Object.defineProperty(exports, "__esModule", { value: true });
    13	exports.validateMemoryQualityFile = exports.validateMemoryQualityContent = exports.shouldBlockWrite = exports.shouldBlockIndex = exports.getRuleMetadata = exports.determineValidationDisposition = exports.VALIDATION_RULE_METADATA = exports.HARD_BLOCK_RULES = void 0;
    14	const fs_1 = __importDefault(require("fs"));
    15	const path_1 = __importDefault(require("path"));
    16	// Re-export all values and types from the canonical location
    17	var validate_memory_quality_1 = require("../lib/validate-memory-quality");
    18	Object.defineProperty(exports, "HARD_BLOCK_RULES", { enumerable: true, get: function () { return validate_memory_quality_1.HARD_BLOCK_RULES; } });
    19	Object.defineProperty(exports, "VALIDATION_RULE_METADATA", { enumerable: true, get: function () { return validate_memory_quality_1.VALIDATION_RULE_METADATA; } });
    20	Object.defineProperty(exports, "determineValidationDisposition", { enumerable: true, get: function () { return validate_memory_quality_1.determineValidationDisposition; } });
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '420,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js | sed -n '1,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   420	                console.error('Did you mean:');
   421	                matches.forEach((m) => console.error(`  - ${m}`));
   422	            }
   423	            else {
   424	                // --- Subfolder support: multi-level deep scan as fallback ---
   425	                let deepMatches = [];
   426	                const targetBase = path.basename(specFolderArg);
   427	                for (const topEntry of available) {
   428	                    const isSpec = core_1.SPEC_FOLDER_PATTERN.test(topEntry);
   429	                    const isCategory = core_1.CATEGORY_FOLDER_PATTERN.test(topEntry);
   430	                    if (!isSpec && !isCategory)
   431	                        continue;
   432	                    const topPath = path.join(specsDir, topEntry);
   433	                    try {
   434	                        if (!fsSync.statSync(topPath).isDirectory())
   435	                            continue;
   436	                        const topChildren = fsSync.readdirSync(topPath);
   437	                        // Search direct children of spec/category folders
   438	                        const childMatches = topChildren.filter((c) => c.includes(targetBase) && core_1.SPEC_FOLDER_PATTERN.test(c));
   439	                        for (const child of childMatches) {
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	"use strict";
     3	// ---------------------------------------------------------------
     4	// MODULE: Rank Memories
     5	// ---------------------------------------------------------------
     6	// ───────────────────────────────────────────────────────────────
     7	// 1. RANK MEMORIES
     8	// ───────────────────────────────────────────────────────────────
     9	// Computes composite ranking scores for memories and folders with recency decay
    10	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    11	    if (k2 === undefined) k2 = k;
    12	    var desc = Object.getOwnPropertyDescriptor(m, k);
    13	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    14	      desc = { enumerable: true, get: function() { return m[k]; } };
    15	    }
    16	    Object.defineProperty(o, k2, desc);
    17	}) : (function(o, m, k, k2) {
    18	    if (k2 === undefined) k2 = k;
    19	    o[k2] = m[k];
    20	}));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/check-source-dist-alignment.js | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Check Source / Dist Alignment
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env npx tsx
     2	"use strict";
     3	// ---------------------------------------------------------------
     4	// MODULE: Run Ablation
     5	// ---------------------------------------------------------------
     6	// ───────────────────────────────────────────────────────────────
     7	// 1. RUN ABLATION
     8	// ───────────────────────────────────────────────────────────────
     9	//
    10	// Runtime entry point for the ablation framework. Runs controlled
    11	// Ablation studies that selectively disable one search channel at
    12	// A time, measuring Recall@20 delta against a full-pipeline baseline.
    13	//
    14	// Usage:
    15	//   SPECKIT_ABLATION=true npx tsx scripts/evals/run-ablation.ts [--channels vector,bm25,fts5] [--verbose]
    16	//
    17	// Output:
    18	//   - Prints formatted ablation report (markdown table)
    19	//   - Records results to speckit-eval.db (eval_metric_snapshots)
    20	//   - Writes full result JSON to /tmp/ablation-result.json
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Check Allowlist Expiry
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js | sed -n '1,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Decision Extractor
     4	// ───────────────────────────────────────────────────────────────
     5	Object.defineProperty(exports, "__esModule", { value: true });
     6	exports.extractDecisions = extractDecisions;
     7	// ───────────────────────────────────────────────────────────────
     8	// 1. DECISION EXTRACTOR
     9	// ───────────────────────────────────────────────────────────────
    10	// Extracts decision records with options, rationale, confidence, and decision trees
    11	const message_utils_1 = require("../utils/message-utils");
    12	const data_validator_1 = require("../utils/data-validator");
    13	const fact_coercion_1 = require("../utils/fact-coercion");
    14	const anchor_generator_1 = require("../lib/anchor-generator");
    15	const decision_tree_generator_1 = require("../lib/decision-tree-generator");
    16	/* ───────────────────────────────────────────────────────────────
    17	   1. INTERFACES
    18	------------------------------------------------------------------*/
    19	// F-32: Word boundaries prevent partial matches (e.g., "undecided" matching "decided")
    20	const DECISION_CUE_REGEX = /\b(decided|chose|will use|approach is|going with|rejected|we'll|selected|prefer|adopt)\b/i;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js | sed -n '1,460p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Git Context Extractor
     4	// ───────────────────────────────────────────────────────────────
     5	var __importDefault = (this && this.__importDefault) || function (mod) {
     6	    return (mod && mod.__esModule) ? mod : { "default": mod };
     7	};
     8	Object.defineProperty(exports, "__esModule", { value: true });
     9	exports.deriveModificationMagnitude = deriveModificationMagnitude;
    10	exports.extractGitContext = extractGitContext;
    11	// ───────────────────────────────────────────────────────────────
    12	// 1. GIT CONTEXT EXTRACTOR
    13	// ───────────────────────────────────────────────────────────────
    14	// Mines git history for file changes and observations for captured-session enrichment
    15	const child_process_1 = require("child_process");
    16	const path_1 = __importDefault(require("path"));
    17	const spec_folder_extractor_1 = require("./spec-folder-extractor");
    18	/* ───────────────────────────────────────────────────────────────
    19	   1. INTERFACES & CONSTANTS
    20	------------------------------------------------------------------*/
 succeeded in 0ms:
     1	"use strict";
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Spec Folder Extractor
     4	// ───────────────────────────────────────────────────────────────
     5	var __importDefault = (this && this.__importDefault) || function (mod) {
     6	    return (mod && mod.__esModule) ? mod : { "default": mod };
     7	};
     8	Object.defineProperty(exports, "__esModule", { value: true });
     9	exports.extractSpecFolderContext = extractSpecFolderContext;
    10	// ───────────────────────────────────────────────────────────────
    11	// 1. SPEC FOLDER EXTRACTOR
    12	// ───────────────────────────────────────────────────────────────
    13	// Extracts structured context from spec folder documents for captured-session enrichment
    14	const fs_1 = __importDefault(require("fs"));
    15	const path_1 = __importDefault(require("path"));
    16	const config_1 = require("../config");
    17	const file_helpers_1 = require("../utils/file-helpers");
    18	/* ───────────────────────────────────────────────────────────────
    19	   1. INTERFACES
    20	------------------------------------------------------------------*/
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/run-bm25-baseline.js | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env npx tsx
     2	"use strict";
     3	// ---------------------------------------------------------------
     4	// MODULE: Run Bm25 Baseline
     5	// ---------------------------------------------------------------
     6	// ───────────────────────────────────────────────────────────────
     7	// 1. RUN BM25 BASELINE
     8	// ───────────────────────────────────────────────────────────────
     9	//
    10	// Execute the BM25-only baseline against the
    11	// Live production context-index.sqlite and record results in the
    12	// Eval DB. Produces the contingency decision (PAUSE/RATIONALIZE/
    13	// PROCEED) with bootstrap 95% CI for statistical significance.
    14	//
    15	// Usage:
    16	//   npx tsx scripts/evals/run-bm25-baseline.ts [--skip-hard-negatives] [--verbose]
    17	//
    18	// Output:
    19	//   - Prints metrics, contingency decision, and bootstrap CI
    20	//   - Records results to speckit-eval.db (eval_metric_snapshots)
codex
I’ve got two concrete correctness candidates worth validating before I finalize: one in `rank-memories.js` around negative/zero CLI limits, and one in `git-context-extractor.js` around rename parsing with spaced paths. I’m doing one more pass over the remaining memory/eval utilities now so the report is complete and not tunnel-visioned on just the extractors.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env node
     2	"use strict";
     3	// ---------------------------------------------------------------
     4	// MODULE: Backfill Frontmatter
     5	// ---------------------------------------------------------------
     6	// ───────────────────────────────────────────────────────────────
     7	// 1. BACKFILL FRONTMATTER
     8	// ───────────────────────────────────────────────────────────────
     9	// Bulk normalizes markdown frontmatter for templates, spec docs, and memories.
    10	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    11	    if (k2 === undefined) k2 = k;
    12	    var desc = Object.getOwnPropertyDescriptor(m, k);
    13	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    14	      desc = { enumerable: true, get: function() { return m[k]; } };
    15	    }
    16	    Object.defineProperty(o, k2, desc);
    17	}) : (function(o, m, k, k2) {
    18	    if (k2 === undefined) k2 = k;
    19	    o[k2] = m[k];
    20	}));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Cleanup Orphaned Vectors
     4	// ---------------------------------------------------------------
     5	var __importDefault = (this && this.__importDefault) || function (mod) {
     6	    return (mod && mod.__esModule) ? mod : { "default": mod };
     7	};
     8	Object.defineProperty(exports, "__esModule", { value: true });
     9	exports.main = main;
    10	// ───────────────────────────────────────────────────────────────
    11	// 1. CLEANUP ORPHANED VECTORS
    12	// ───────────────────────────────────────────────────────────────
    13	// Database maintenance — removes orphaned vector embeddings and history entries
    14	// External packages
    15	const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
    16	const sqlite_vec_1 = require("sqlite-vec");
    17	// Shared config
    18	const paths_1 = require("@spec-kit/shared/paths");
    19	/* ───────────────────────────────────────────────────────────────
    20	   2. CONFIGURATION
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	#!/usr/bin/env node
     2	"use strict";
     3	// ---------------------------------------------------------------
     4	// MODULE: Reindex Embeddings
     5	// ---------------------------------------------------------------
     6	// ───────────────────────────────────────────────────────────────
     7	// 1. REINDEX EMBEDDINGS
     8	// ───────────────────────────────────────────────────────────────
     9	/* ───────────────────────────────────────────────────────────────
    10	   1. MODULE SETUP
    11	──────────────────────────────────────────────────────────────── */
    12	Object.defineProperty(exports, "__esModule", { value: true });
    13	exports.reindex = reindex;
    14	const indexing_1 = require("@spec-kit/mcp-server/api/indexing");
    15	/* ───────────────────────────────────────────────────────────────
    16	   3. REINDEX FUNCTION
    17	──────────────────────────────────────────────────────────────── */
    18	async function reindex() {
    19	    console.log('='.repeat(60));
    20	    console.log('MEMORY DATABASE REINDEX');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/check-architecture-boundaries.js | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Check Architecture Boundaries
     4	// ---------------------------------------------------------------
     5	// NOTE: This script enforces shared/ neutrality and mcp_server/scripts/ wrapper-only rules.
     6	// The companion check for Scripts -> MCP-internals import policy lives in:
     7	//   check-no-mcp-lib-imports-ast.ts (AST-based, with allowlist governance)
     8	// Both checks should be run together for full boundary compliance.
     9	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    10	    if (k2 === undefined) k2 = k;
    11	    var desc = Object.getOwnPropertyDescriptor(m, k);
    12	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    13	      desc = { enumerable: true, get: function() { return m[k]; } };
    14	    }
    15	    Object.defineProperty(o, k2, desc);
    16	}) : (function(o, m, k, k2) {
    17	    if (k2 === undefined) k2 = k;
    18	    o[k2] = m[k];
    19	}));
    20	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
exec
/bin/zsh -lc "rg -n \"parseInt\\(["'^'"\\n]+\\)\\s*\\|\\||Number\\(["'^'"\\n]+\\)\" .opencode/skill/system-spec-kit/scripts/dist/extractors .opencode/skill/system-spec-kit/scripts/dist/evals .opencode/skill/system-spec-kit/scripts/dist/memory" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js:138:            memoryId: Number(r.id),
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:231:            options.folderLimit = parseInt(args[++i], 10) || 3;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:234:            options.memoryLimit = parseInt(args[++i], 10) || 5;
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:99:    const year = Number(dateText.slice(0, 4));
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:100:    const month = Number(dateText.slice(5, 7));
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:101:    const day = Number(dateText.slice(8, 10));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/import-policy-rules.js | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Import Policy Rules
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Ast Parser
     4	// ---------------------------------------------------------------
     5	Object.defineProperty(exports, "__esModule", { value: true });
     6	exports.splitIntoBlocks = exports.chunkMarkdown = void 0;
     7	exports.parseMarkdownSections = parseMarkdownSections;
     8	// ───────────────────────────────────────────────────────────────
     9	// 1. AST PARSER
    10	// ───────────────────────────────────────────────────────────────
    11	const structure_aware_chunker_1 = require("@spec-kit/shared/lib/structure-aware-chunker");
    12	Object.defineProperty(exports, "chunkMarkdown", { enumerable: true, get: function () { return structure_aware_chunker_1.chunkMarkdown; } });
    13	Object.defineProperty(exports, "splitIntoBlocks", { enumerable: true, get: function () { return structure_aware_chunker_1.splitIntoBlocks; } });
    14	function extractHeadingTitle(content) {
    15	    const match = content.match(/^#{1,6}\s+(.*)$/m);
    16	    if (!match) {
    17	        return null;
    18	    }
    19	    return match[1]?.trim() ?? null;
    20	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/rebuild-auto-entities.js | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Rebuild Auto Entities
     4	// ---------------------------------------------------------------
     5	var __importDefault = (this && this.__importDefault) || function (mod) {
     6	    return (mod && mod.__esModule) ? mod : { "default": mod };
     7	};
     8	Object.defineProperty(exports, "__esModule", { value: true });
     9	exports.main = main;
    10	const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
    11	const paths_1 = require("@spec-kit/shared/paths");
    12	const { rebuildAutoEntities } = require('@spec-kit/mcp-server/api');
    13	const HELP_TEXT = `
    14	rebuild-auto-entities — Rebuild auto-generated entity rows from current memory content
    15	
    16	Usage: node rebuild-auto-entities.js [options]
    17	
    18	Options:
    19	  --dry-run                 Preview the rebuild without changing the database
    20	  --spec-folder <path>      Limit the rebuild to one spec folder
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Run Redaction Calibration
     4	// ---------------------------------------------------------------
     5	var __importDefault = (this && this.__importDefault) || function (mod) {
     6	    return (mod && mod.__esModule) ? mod : { "default": mod };
     7	};
     8	Object.defineProperty(exports, "__esModule", { value: true });
     9	// ───────────────────────────────────────────────────────────────
    10	// 1. RUN REDACTION CALIBRATION
    11	// ───────────────────────────────────────────────────────────────
    12	const fs_1 = __importDefault(require("fs"));
    13	const path_1 = __importDefault(require("path"));
    14	const NON_SECRET_FP_PATTERNS = [
    15	    /^[0-9a-f]{40}$/,
    16	    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    17	    /^v?\d+\.\d+\.\d+$/,
    18	];
    19	function parseArgs() {
    20	    const [, , specFolder] = process.argv;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Collect Redaction Calibration Inputs
     4	// ---------------------------------------------------------------
     5	var __importDefault = (this && this.__importDefault) || function (mod) {
     6	    return (mod && mod.__esModule) ? mod : { "default": mod };
     7	};
     8	Object.defineProperty(exports, "__esModule", { value: true });
     9	// ───────────────────────────────────────────────────────────────
    10	// 1. COLLECT REDACTION CALIBRATION INPUTS
    11	// ───────────────────────────────────────────────────────────────
    12	const fs_1 = __importDefault(require("fs"));
    13	const path_1 = __importDefault(require("path"));
    14	const child_process_1 = require("child_process");
    15	function parseArgs() {
    16	    const [, , specFolder] = process.argv;
    17	    if (!specFolder) {
    18	        throw new Error('Usage: ts-node scripts/evals/collect-redaction-calibration-inputs.ts <spec-folder-relative-path>');
    19	    }
    20	    return { specFolder };
exec
/bin/zsh -lc "rg -n \"new Date\\(["'^'"\\)]*\\)\\.getTime\\(|new Date\\(["'^'"\\)]*\\);\" .opencode/skill/system-spec-kit/scripts/dist/extractors .opencode/skill/system-spec-kit/scripts/dist/evals .opencode/skill/system-spec-kit/scripts/dist/memory" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:64:    const date = new Date(timestamp);
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:163:        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:102:        const userTime = new Date(rawTimestamp);
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:109:            const obsTime = new Date(obs.timestamp || '');
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:114:            const timeA = new Date(a.obs.timestamp || '').getTime();
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:115:            const timeB = new Date(b.obs.timestamp || '').getTime();
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:191:        const timeA = new Date(a.rawTimestamp).getTime();
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:192:        const timeB = new Date(b.rawTimestamp).getTime();
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:198:        const currTime = new Date(curr.rawTimestamp).getTime();
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:199:        const nextTime = new Date(next.rawTimestamp).getTime();
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:247:        const firstTime = new Date(tempMessages[0].rawTimestamp);
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:248:        const lastTime = new Date(tempMessages[tempMessages.length - 1].rawTimestamp);
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:102:    const parsed = new Date(`${dateText}T00:00:00Z`);
.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js:122:    const now = new Date();
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:482:        const d = new Date(lastPrompt.timestamp);
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:542:    const now = new Date();
.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:385:        const parsed = new Date(dateStr);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/evals/check-no-mcp-lib-imports-ast.js | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Check No Mcp Lib Imports Ast
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
codex
# Iteration 002: Scripts Code Correctness Review
## Agent: codex / gpt-5.4 / high
## Dimension: correctness
## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-source-dist-alignment.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-architecture-boundaries.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/import-policy-rules.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-no-mcp-lib-imports-ast.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/run-bm25-baseline.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/rebuild-auto-entities.js`

## Findings
T79 status: FIXED. In `.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js`, `hasUnresolvedNextSteps` now checks both raw `nextSteps` and `"Next Steps"` observations, matching `hasNextSteps` (`:270-277` logic is symmetric now).

### P1-001: Redaction input collector ignores the requested spec folder
- Severity: P1
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:38`, `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:49`, `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:58`
- Description: `parseArgs()` requires a `specFolder`, but `buildCommandMatrix()` does not accept it and hard-codes `.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch` into every run.
- Impact: Running the script for any other spec folder collects irrelevant inputs or fails if that historical path is absent, so the calibration corpus is not scoped to the target being evaluated.
- Fix: Pass `specFolder` into `buildCommandMatrix()` and derive any spec-relative commands from that argument instead of a fixed path.

### P2-002: `extractNextAction()` drops structured fact objects
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:234`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:240`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:287`
- Description: `findFactByPattern()` only inspects facts when `typeof fact === 'string'`. Other code in this runtime accepts object facts with text fields, but next-action extraction ignores them entirely.
- Impact: Sessions that store `next:` / `todo:` / `follow-up:` in structured fact objects fall back to stale `recentContext` or `"Continue implementation"`, producing incorrect resume guidance.
- Fix: Normalize facts with the same coercion helper used elsewhere (`coerceFactsToText` / `coerceFactToText`) before regex matching.

### P2-003: Git rename parsing truncates paths that contain spaces
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:95`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:97`
- Description: `parseNameStatusLine()` splits porcelain status lines on whitespace and, for renames, keeps only `rest[rest.length - 1]`. A rename like `R  old name.js -> new name.js` collapses to just `name.js`.
- Impact: Uncommitted renames with spaced paths are mis-scoped, so `FILES`, observations, and spec-folder matching can point at the wrong file or drop the change entirely.
- Fix: Parse `git status --porcelain -z` / tab-delimited output, or explicitly split rename records on ` -> ` without whitespace tokenization.

### P2-004: `rank-memories` CLI limit parsing accepts invalid values and mis-slices output
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:230`, `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:234`, `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:116`, `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:164`
- Description: `parseInt(args[++i], 10) || 3/5` treats `0` as “use default”, while negative integers remain truthy and flow through to `slice(0, folderLimit)` / `slice(0, memoryLimit)`.
- Impact: `--folder-limit 0` is ignored, and negative limits silently produce truncated-from-the-end results instead of an error or empty set.
- Fix: Parse once, validate `Number.isInteger(value) && value >= 0`, and clamp or reject invalid limits explicitly.

### P2-005: Conversation extraction has no safe fallback for invalid observation timestamps
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:102`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:109`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:111`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:246`
- Description: Observation/user timestamps are fed directly into `new Date(...)`. When a timestamp is missing or malformed, `getTime()` becomes `NaN`; those observations fail the time-window match, sort comparators return `NaN`, and duration math can degrade into invalid output.
- Impact: Tool calls and assistant summaries can disappear from extracted conversations, and duration can become nonsensical for imperfect JSON-mode inputs.
- Fix: Add a safe date parser with fallback behavior and use it consistently for matching, sorting, and duration calculation.

## Summary
- Total findings: 5 (P0: 0, P1: 1, P2: 4)
- newFindingsRatio: 1.00
tokens used
653,854
# Iteration 002: Scripts Code Correctness Review
## Agent: codex / gpt-5.4 / high
## Dimension: correctness
## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-source-dist-alignment.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/run-ablation.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-allowlist-expiry.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-architecture-boundaries.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/import-policy-rules.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/check-no-mcp-lib-imports-ast.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/run-bm25-baseline.js`
- `.opencode/skill/system-spec-kit/scripts/dist/evals/run-redaction-calibration.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/rebuild-auto-entities.js`

## Findings
T79 status: FIXED. In `.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js`, `hasUnresolvedNextSteps` now checks both raw `nextSteps` and `"Next Steps"` observations, matching `hasNextSteps` (`:270-277` logic is symmetric now).

### P1-001: Redaction input collector ignores the requested spec folder
- Severity: P1
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:38`, `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:49`, `.opencode/skill/system-spec-kit/scripts/dist/evals/collect-redaction-calibration-inputs.js:58`
- Description: `parseArgs()` requires a `specFolder`, but `buildCommandMatrix()` does not accept it and hard-codes `.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/scratch` into every run.
- Impact: Running the script for any other spec folder collects irrelevant inputs or fails if that historical path is absent, so the calibration corpus is not scoped to the target being evaluated.
- Fix: Pass `specFolder` into `buildCommandMatrix()` and derive any spec-relative commands from that argument instead of a fixed path.

### P2-002: `extractNextAction()` drops structured fact objects
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:234`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:240`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:287`
- Description: `findFactByPattern()` only inspects facts when `typeof fact === 'string'`. Other code in this runtime accepts object facts with text fields, but next-action extraction ignores them entirely.
- Impact: Sessions that store `next:` / `todo:` / `follow-up:` in structured fact objects fall back to stale `recentContext` or `"Continue implementation"`, producing incorrect resume guidance.
- Fix: Normalize facts with the same coercion helper used elsewhere (`coerceFactsToText` / `coerceFactToText`) before regex matching.

### P2-003: Git rename parsing truncates paths that contain spaces
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:95`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:97`
- Description: `parseNameStatusLine()` splits porcelain status lines on whitespace and, for renames, keeps only `rest[rest.length - 1]`. A rename like `R  old name.js -> new name.js` collapses to just `name.js`.
- Impact: Uncommitted renames with spaced paths are mis-scoped, so `FILES`, observations, and spec-folder matching can point at the wrong file or drop the change entirely.
- Fix: Parse `git status --porcelain -z` / tab-delimited output, or explicitly split rename records on ` -> ` without whitespace tokenization.

### P2-004: `rank-memories` CLI limit parsing accepts invalid values and mis-slices output
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:230`, `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:234`, `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:116`, `.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:164`
- Description: `parseInt(args[++i], 10) || 3/5` treats `0` as “use default”, while negative integers remain truthy and flow through to `slice(0, folderLimit)` / `slice(0, memoryLimit)`.
- Impact: `--folder-limit 0` is ignored, and negative limits silently produce truncated-from-the-end results instead of an error or empty set.
- Fix: Parse once, validate `Number.isInteger(value) && value >= 0`, and clamp or reject invalid limits explicitly.

### P2-005: Conversation extraction has no safe fallback for invalid observation timestamps
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:102`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:109`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:111`, `.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:246`
- Description: Observation/user timestamps are fed directly into `new Date(...)`. When a timestamp is missing or malformed, `getTime()` becomes `NaN`; those observations fail the time-window match, sort comparators return `NaN`, and duration math can degrade into invalid output.
- Impact: Tool calls and assistant summaries can disappear from extracted conversations, and duration can become nonsensical for imperfect JSON-mode inputs.
- Fix: Add a safe date parser with fallback behavior and use it consistently for matching, sorting, and duration calculation.

## Summary
- Total findings: 5 (P0: 0, P1: 1, P2: 4)
- newFindingsRatio: 1.00
