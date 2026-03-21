OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d0aa9-b8c3-7ac3-81cc-192f694b128c
--------
user
You are a code auditor continuing a deep research audit of an indexing/normalization system. This is iteration 2, focused on architecture and performance.

CONTEXT FROM ITERATION 1:
- input-normalizer.ts has SRP violations: transformOpencodeCapture is 337 lines, normalizeInputData is 180 lines
- memory-indexer.ts has no error handling around embedding/vector writes
- SPEC_ID_REGEX doesn't cover all spec folder patterns
- Embedding cache is split-brain: MCP uses SQLite cache, scripts use in-memory

TASK: Deep-dive into workflow.ts (2,482 lines) for SRP violations and decomposition opportunities.

Primary files (READ ALL):
1. .opencode/skill/system-spec-kit/scripts/core/workflow.ts (2,482 lines)
2. .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts (205 lines)

Questions:
1. What are the distinct responsibilities in workflow.ts? Map each function to a domain concept.
2. What is the cyclomatic complexity of the top 10 most complex functions?
3. Propose a concrete decomposition plan: what modules to extract, what interfaces between them.
4. Are there God Object or God Function patterns?
5. What imports does workflow.ts pull in? Could some be eliminated with better module boundaries?
6. How does the embedding pipeline flow through workflow.ts? Is it cleanly separated?
7. Are there any dead code paths or unreachable branches?

OUTPUT FORMAT: For each finding:
- FINDING-ID (e.g., ARCH-001)
- Impact: HIGH / MEDIUM / LOW
- Description with evidence (function names, line ranges)
- Recommendation
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only architecture audit of `workflow.ts` and the adjacent indexing path. I’ll first load the relevant skill guidance and inspect the two target files end-to-end, then I’ll quantify complexity and map the embedding flow before I synthesize findings.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
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
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- ChatGPT runtime: `.opencode/agent/chatgpt/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`
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

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Deep-dive into .opencode/skill/system-spec-kit/scripts/core/workflow.ts for SRP violations, decomposition opportunities, architecture and performance audit, read-only research" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !audit(multi), !spec, !system-spec-kit(explicit), architecture"
  },
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !audit, !audit(multi), !intent:review, opencode, review(name)"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
codex
I’ve routed this through `system-spec-kit`, `sk-code--review`, and `sk-code--opencode` because this is a read-only audit of OpenCode system code with findings-first output. Next I’m reading the workflow implementation in full, extracting its function inventory, and using semantic search plus AST-based metrics so the decomposition plan is grounded in the actual control flow.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    2494 .opencode/skill/system-spec-kit/scripts/core/workflow.ts
     204 .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
    2698 total
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Memory Indexer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. MEMORY INDEXER
// ───────────────────────────────────────────────────────────────
// Handles persisting memory files to the vector index: embedding generation,
// Database storage, metadata updates, and DB-change notifications.

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

import { structuredLog } from '../utils';
import { generateDocumentEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
import { vectorIndex } from '@spec-kit/mcp-server/api/search';
import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
import { extractTriggerPhrases } from '../lib/trigger-extractor';
import type { CollectedDataFull } from '../extractors/collect-session-data';
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Workflow
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. WORKFLOW
// ───────────────────────────────────────────────────────────────
// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
// Node stdlib
import * as path from 'node:path';
import * as fsSync from 'node:fs';
import * as crypto from 'node:crypto';

// Internal modules
import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
import {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractPhasesFromData,
tool cocoindex_code.search({"query":"workflow.ts architecture embedding pipeline memory indexing normalize input capture retrieval save index spec kit","paths":[".opencode/skill/system-spec-kit/scripts/core/*"],"languages":"typescript","limit":8,"refresh_index":true})
cocoindex_code.search({"query":"workflow.ts architecture embedding pipeline memory indexing normalize input capture retrieval save index spec kit","paths":[".opencode/skill/system-spec-kit/scripts/core/*"],"languages":"typescript","limit":8,"refresh_index":true}) failed in 8ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
codex
I’ve got the baseline modules loaded. Now I’m pulling the full `workflow.ts` structure in chunks and generating an AST-backed inventory so the SRP map and complexity ranking use code structure rather than rough grep heuristics.
exec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

  return segments.map((segment) => {
    if (segment.startsWith('```')) {
      return segment;
    }

    const preservedAnchorIds: string[] = [];
    const protectedSegment = segment.replace(WORKFLOW_PRESERVED_ANCHOR_ID_RE, (match: string) => {
      const token = `__WORKFLOW_ANCHOR_ID_${preservedAnchorIds.length}__`;
      preservedAnchorIds.push(match);
      return token;
    });

    let cleaned = protectedSegment
      .replace(WORKFLOW_HTML_COMMENT_RE, '')
      .replace(WORKFLOW_DANGEROUS_HTML_BLOCK_RE, '\n')
      .replace(WORKFLOW_BLOCK_HTML_TAG_RE, '\n')
      .replace(WORKFLOW_INLINE_HTML_TAG_RE, '')
      .replace(WORKFLOW_ANY_HTML_TAG_RE, '')
      .replace(/[ \t]+\n/g, '\n')
exec
/bin/zsh -lc "sed -n '781,1040p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  return 'episodic';
}

function defaultHalfLifeDays(memoryType: string): number {
  switch (memoryType) {
    case 'constitutional':
      return 0;
    case 'procedural':
      return 180;
    case 'semantic':
      return 365;
    case 'episodic':
    default:
      return 30;
  }
}

function baseDecayRateFromHalfLife(halfLifeDays: number): number {
  if (halfLifeDays <= 0) {
    return 0;
exec
/bin/zsh -lc "sed -n '521,780p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

function truncateMemoryTitle(title: string, maxLength: number = 110): string {
  if (title.length <= maxLength) {
    return title;
  }

  const truncated = title.slice(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace >= Math.floor(maxLength * 0.6)) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/(?<=\d)-(?=\d)/g, '\x00')   // protect digit-digit hyphens (dates like 2026-03-13)
    .replace(/-/g, ' ')
    .replace(/\x00/g, '-')                 // restore digit-digit hyphens
exec
/bin/zsh -lc 'rg -n "''^(export'"\\s+)?(async\\s+)?function\\s+|"'^(const|let|var)'"\\s+[A-Za-z0-9_]+\\s*=\\s*(async\\s*)?\\(\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
151:function shouldIndexMemory(options: {
204:function ensureMinSemanticTopics(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
224:function ensureMinTriggerPhrases(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
246:function renderTriggerPhrasesYaml(triggerPhrases: string[]): string {
259:function stripWorkflowHtmlOutsideCodeFences(rawContent: string): string {
291:function escapeLiteralAnchorExamples(input: string): string {
305:function normalizeFilePath(rawPath: string): string {
313:function getParentDirectory(filePath: string): string {
319:function capText(value: string, maxLength: number): string {
328:function summarizeAuditCounts(counts: Map<string, number>): string[] {
332:function pickCarrierIndex(indices: number[], files: FileChange[]): number {
342:function compactMergedContent(value: string): string {
357:function buildAlignmentKeywords(specFolderPath: string): string[] {
380:async function resolveAlignmentTargets(specFolderPath: string): Promise<AlignmentTargets> {
402:function matchesAlignmentTarget(filePath: string, alignmentTargets: AlignmentTargets): boolean {
429:function applyThinningToFileChanges(
515:function normalizeMemoryTitleCandidate(raw: string): string {
522:function truncateMemoryTitle(title: string, maxLength: number = 110): string {
536:function slugToTitle(slug: string): string {
545:function buildMemoryTitle(_implementationTask: string, _specFolderName: string, _date: string, contentSlug?: string): string {
tool cocoindex_code.search({"query":"workflow orchestration memory generation indexing validation embedding pipeline control flow","paths":[".opencode/skill/system-spec-kit/scripts/core/*"],"languages":["typescript"],"limit":8,"refresh_index":true})
cocoindex_code.search({"query":"workflow orchestration memory generation indexing validation embedding pipeline control flow","paths":[".opencode/skill/system-spec-kit/scripts/core/*"],"languages":["typescript"],"limit":8,"refresh_index":true}) success in 599ms:
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
exec
/bin/zsh -lc "sed -n '1041,1300p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

  return '';
}

type WorkflowObservationEvidence = {
  TITLE?: string;
  title?: string;
  NARRATIVE?: string;
  narrative?: string;
  FACTS?: unknown[];
  facts?: unknown[];
  _synthetic?: boolean;
  _provenance?: string;
  _specRelevant?: boolean;
};

type WorkflowDecisionEvidence = {
  TITLE?: string;
  CHOSEN?: string;
  RATIONALE?: string;
exec
/bin/zsh -lc "sed -n '1301,1560p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        ];
      }

      // Merge decisions
      if (specContext.decisions.length > 0) {
        enriched._manualDecisions = [
          ...(enriched._manualDecisions || []),
          ...specContext.decisions,
        ];
      }

      // Use spec summary if collectedData summary is missing or generic
      if (specContext.summary && (!enriched.SUMMARY || enriched.SUMMARY === 'Development session')) {
        enriched.SUMMARY = specContext.summary;
      }

      // Merge recentContext
      if (specContext.recentContext.length > 0) {
        enriched.recentContext = [
          ...(enriched.recentContext || []),
exec
/bin/zsh -lc "sed -n '1561,1820p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
          title: observation.title ? cleanContaminationText(observation.title) : observation.title,
          narrative: observation.narrative ? cleanContaminationText(observation.narrative) : observation.narrative,
          facts: observation.facts?.map((fact) => (
            typeof fact === 'string'
              ? cleanContaminationText(fact)
              : {
                ...fact,
                text: typeof fact.text === 'string' ? cleanContaminationText(fact.text) : fact.text
              }
          )),
        };
      });
    };

    // F-23: Pre-enrichment contamination cleaning pass
    {
      const preCleanedObservations = cleanObservations(collectedData.observations);
      const preCleanedSummary = (typeof collectedData.SUMMARY === 'string' && collectedData.SUMMARY.length > 0)
        ? cleanContaminationText(collectedData.SUMMARY) : collectedData.SUMMARY;
      collectedData = { ...collectedData, observations: preCleanedObservations, SUMMARY: preCleanedSummary };
exec
/bin/zsh -lc 'rg -n "''^import " .opencode/skill/system-spec-kit/scripts/core/workflow.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
10:import * as path from 'node:path';
11:import * as fsSync from 'node:fs';
12:import * as crypto from 'node:crypto';
15:import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
16:import {
23:import { detectSpecFolder, setupContextDirectory } from '../spec-folder';
24:import { populateTemplate } from '../renderers';
25:import { scoreMemoryQuality } from './quality-scorer';
26:import { extractKeyTopics } from './topic-extractor';
27:import type { DecisionForTopics } from './topic-extractor';
28:import { writeFilesAtomically } from './file-writer';
29:import { generateContentSlug, pickBestContentName, ensureUniqueMemoryFilename } from '../utils/slug-utils';
30:import { normalizeSpecTitleForMemory, pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';
31:import { validateDescription } from '../utils/file-helpers';
32:import {
36:import { deriveMemoryDescription } from '../utils/memory-frontmatter';
37:import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
38:import type { CollectedDataFull } from '../extractors/collect-session-data';
39:import type { SemanticFileInfo } from '../extractors/file-extractor';
40:import { filterContamination, getContaminationPatternLabels, SEVERITY_RANK, type ContaminationSeverity } from '../extractors/contamination-filter';
exec
/bin/zsh -lc "node -e \"const ts=require('typescript'); console.log(ts.version)\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
node:internal/modules/cjs/loader:1458
  throw err;
  ^

Error: Cannot find module 'typescript'
Require stack:
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/[eval]
    at Module._resolveFilename (node:internal/modules/cjs/loader:1455:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1065:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1070:22)
    at Module._load (node:internal/modules/cjs/loader:1241:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.require (node:internal/modules/cjs/loader:1555:12)
    at require (node:internal/modules/helpers:152:16)
    at [eval]:1:10
    at runScriptInThisContext (node:internal/vm:219:10)
    at node:internal/process/execution:451:12 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/[eval]'
codex
The file is larger than the user’s line count suggests: `workflow.ts` is 2,494 lines in this checkout. I’ve finished the first half and confirmed this isn’t just one orchestrator function; it’s a dense mix of path/security helpers, enrichment, contamination filtering, extraction, rendering, validation, and indexing control in one module.
exec
/bin/zsh -lc "sed -n '2081,2340p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1821,2080p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
  if (filterPipeline.isLowQuality()) {
    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
  }

  const implSummary = generateImplementationSummary(
    normalizedMessages,
    (collectedData?.observations || []) as Parameters<typeof generateImplementationSummary>[1]
  );

  const semanticFileChanges: Map<string, SemanticFileInfo> = extractFileChanges(
    normalizedMessages,
    (collectedData?.observations || []) as Parameters<typeof extractFileChanges>[1]
  );
  const enhancedFiles: FileChange[] = enhanceFilesWithSemanticDescriptions(
    sessionData.FILES || [],
    semanticFileChanges
  );

 succeeded in 0ms:
        decisions: implSummary.decisions.length,
        messageStats: implSummary.messageStats
      },
      fileCounts: {
        fileCount: sessionData.FILE_COUNT,
        capturedFileCount: sessionData.CAPTURED_FILE_COUNT,
        filesystemFileCount: sessionData.FILESYSTEM_FILE_COUNT,
        gitChangedFileCount: sessionData.GIT_CHANGED_FILE_COUNT,
      },
      sourceProvenance: {
        transcriptPath: sessionData.SOURCE_TRANSCRIPT_PATH,
        sessionId: sessionData.SOURCE_SESSION_ID,
        sessionCreated: sessionData.SOURCE_SESSION_CREATED,
        sessionUpdated: sessionData.SOURCE_SESSION_UPDATED,
      },
      embedding: {
        status: 'pending',
        model: MODEL_NAME,
        dimensions: EMBEDDING_DIM
      }
exec
/bin/zsh -lc "sed -n '2341,2520p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  }
  log();

  // Step 9.5: State embedded in memory file
  log('Step 9.5: State embedded in memory file (V13.0)');

  // Step 10: Success confirmation
  log('Context saved successfully!\n');
  log(`Location: ${contextDir}\n`);
  log('Files created:');
  for (const [filename, content] of Object.entries(files)) {
    const lines = content.split('\n').length;
    log(`  - ${filename} (${lines} lines)`);
  }
  log();
  log('Summary:');
  log(`  - ${conversations.MESSAGES.length} messages captured`);
  log(`  - ${decisions.DECISIONS.length} key decisions documented`);
  log(`  - ${diagrams.DIAGRAMS.length} diagrams preserved`);
  log(`  - Session duration: ${sessionData.DURATION}\n`);
exec
/bin/zsh -lc "python3 - <<'PY'
import re, json, pathlib
p=pathlib.Path('.opencode/skill/system-spec-kit/scripts/core/workflow.ts')
text=p.read_text()
# crude top-level function extractor
funcs=[]
for m in re.finditer(r'(?m)"'^((?:export'"\\s+)?async\\s+function|(?:export\\s+)?function)\\s+([A-Za-z0-9_]+)\\s*\\(', text):
    name=m.group(2)
    start=m.start()
    brace=text.find('{', m.end())
    if brace==-1: continue
    depth=0
    i=brace
    in_s=in_d=in_t=False
    line_comment=block_comment=False
    esc=False
    while i < len(text):
        ch=text[i]
        nxt=text[i+1] if i+1 < len(text) else ''
        if line_comment:
            if ch=='\\n': line_comment=False
        elif block_comment:
            if ch=='*' and nxt=='/': block_comment=False; i+=1
        elif in_s:
            if not esc and ch==\"'\": in_s=False
            esc=(ch=='\\\\' and not esc)
            if ch"'!='"'\\\\': esc=False
        elif in_d:
            if not esc and ch=='\\\"': in_d=False
            esc=(ch=='\\\\' and not esc)
            if ch"'!='"'\\\\': esc=False
        elif in_t:
            if not esc and ch=='"'`'"': in_t=False
            esc=(ch=='\\\\' and not esc)
            if ch"'!='"'\\\\': esc=False
        else:
            if ch=='/' and nxt=='/': line_comment=True; i+=1
            elif ch=='/' and nxt=='*': block_comment=True; i+=1
            elif ch==\"'\": in_s=True
            elif ch=='\\\"': in_d=True
            elif ch=='"'`'"': in_t=True
            elif ch=='{': depth+=1
            elif ch=='}':
                depth-=1
                if depth==0:
                    end=i+1
                    body=text[brace+1:i]
                    funcs.append((name,start,end,body))
                    break
        i+=1

# complexity approximation
patterns=[r'\\bif\\b',r'\\bfor\\b',r'\\bfor\\s*\\(',r'\\bwhile\\b',r'\\bcatch\\b',r'\\bcase\\b',r'\\?["'^:]'"',r'&&',r'\\|\\|']
# de-duplicate overlapping for/for( by using one for pattern later
out=[]
for name,start,end,body in funcs:
    stripped=re.sub(r'//.*?"'$|/'"\\*.*?\\*/|\\\"(?:\\\\.|["'^'"\\\"])*\\\"|\\'(?:\\\\.|["'^'"\\'])*\\'|"'`(?:'"\\\\.|["'^`])*`'"', ' ', body, flags=re.S|re.M)
    complexity=1
    counts={}
    for label,pat in [('if',r'\\bif\\b'),('for',r'\\bfor\\b'),('while',r'\\bwhile\\b'),('catch',r'\\bcatch\\b'),('case',r'\\bcase\\b'),('ternary',r'\\?'),('and',r'&&'),('or',r'\\|\\|')]:
        c=len(re.findall(pat,stripped))
        counts[label]=c
        complexity+=c
    line=text.count('\\n',0,start)+1
    endline=text.count('\\n',0,end)+1
    out.append({'name':name,'line':line,'endLine':endline,'complexity':complexity,'counts':counts})
print(json.dumps(sorted(out,key=lambda x:(-x['complexity'],x['line']))[:15], indent=2))
PY" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "name": "enrichFileSourceData",
    "line": 1169,
    "endLine": 1248,
    "complexity": 36,
    "counts": {
      "if": 8,
      "for": 1,
      "while": 0,
      "catch": 3,
      "case": 0,
      "ternary": 9,
      "and": 3,
      "or": 11
    }
  },
  {
    "name": "enrichStatelessData",
    "line": 1250,
exec
/bin/zsh -lc "find . -path '*node_modules/typescript' -type d | head -5" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.42s:
./.opencode/skill/system-spec-kit/node_modules/typescript
./.opencode/skill/mcp-code-mode/mcp_server/node_modules/typescript
codex
I hit a tooling gap: the workspace doesn’t have `typescript` installed for an AST parse, so I’m switching to a custom parser over the actual source text. That still lets me rank the hot functions and avoids inventing complexity numbers from eyeballing.
exec
/bin/zsh -lc "python3 - <<'PY'
import re, json, pathlib
path = pathlib.Path('.opencode/skill/system-spec-kit/scripts/core/workflow.ts')
text = path.read_text()
lines = text.splitlines(True)
starts = []
for i, line in enumerate(lines, start=1):
    m = re.match(r'"'^(?:export'"\\s+)?(?:async\\s+)?function\\s+([A-Za-z0-9_]+)\\s*\\(', line)
    if m:
        starts.append((m.group(1), i))

# map line to absolute offset
line_offsets = [0]
off = 0
for ln in lines:
    off += len(ln)
    line_offsets.append(off)

def offset_for_line(line_no):
    return line_offsets[line_no-1]

def scan_function(name, start_line):
    start = offset_for_line(start_line)
    # find opening brace after declaration
    brace = text.find('{', start)
    if brace == -1:
        return None
    i = brace
    depth = 0
    mode = 'code'
    quote = ''
    while i < len(text):
        ch = text[i]
        nxt = text[i+1] if i+1 < len(text) else ''
        if mode == 'code':
            if ch == '/' and nxt == '/':
                mode = 'line_comment'; i += 1
            elif ch == '/' and nxt == '*':
                mode = 'block_comment'; i += 1
            elif ch in ('\"', \"'\", '"'`'"'):
                mode = 'string'; quote = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    return start, brace, end
        elif mode == 'line_comment':
            if ch == '\\n':
                mode = 'code'
        elif mode == 'block_comment':
            if ch == '*' and nxt == '/':
                mode = 'code'; i += 1
        elif mode == 'string':
            if quote == '"'`'"':
                if ch == '\\\\':
                    i += 1
                elif ch == '"'`'"':
                    mode = 'code'
            else:
                if ch == '\\\\':
                    i += 1
                elif ch == quote:
                    mode = 'code'
        i += 1
    return None

def strip_comments_strings(s):
    out=[]
    i=0
    mode='code'
    quote=''
    while i < len(s):
        ch=s[i]
        nxt=s[i+1] if i+1 < len(s) else ''
        if mode=='code':
            if ch=='/' and nxt=='/':
                mode='line_comment'; i+=1; out.append('  ')
            elif ch=='/' and nxt=='*':
                mode='block_comment'; i+=1; out.append('  ')
            elif ch in ('\"', \"'\", '"'`'"'):
                mode='string'; quote=ch; out.append(' ')
            else:
                out.append(ch)
        elif mode=='line_comment':
            if ch=='\\n':
                mode='code'; out.append('\\n')
            else:
                out.append(' ')
        elif mode=='block_comment':
            if ch=='*' and nxt=='/':
                mode='code'; i+=1; out.append('  ')
            else:
                out.append('\\n' if ch=='\\n' else ' ')
        elif mode=='string':
            if quote=='"'`'"':
                if ch=='\\\\':
                    out.append('  '); i+=1
                elif ch=='"'`'"':
                    mode='code'; out.append(' ')
                else:
                    out.append('\\n' if ch=='\\n' else ' ')
            else:
                if ch=='\\\\':
                    out.append('  '); i+=1
                elif ch==quote:
                    mode='code'; out.append(' ')
                else:
                    out.append('\\n' if ch=='\\n' else ' ')
        i+=1
    return ''.join(out)

results=[]
for name, start_line in starts:
    scanned = scan_function(name, start_line)
    if not scanned:
        continue
    start, brace, end = scanned
    body = text[brace+1:end-1]
    stripped = strip_comments_strings(body)
    counts = {
        'if': len(re.findall(r'\\bif\\b', stripped)),
        'for': len(re.findall(r'\\bfor\\b', stripped)),
        'while': len(re.findall(r'\\bwhile\\b', stripped)),
        'catch': len(re.findall(r'\\bcatch\\b', stripped)),
        'case': len(re.findall(r'\\bcase\\b', stripped)),
        'ternary': len(re.findall(r'(?<"'!'"\\?)\\?(?"'!['"\\?.])', stripped)),
        'and': stripped.count('&&'),
        'or': stripped.count('||'),
    }
    complexity = 1 + sum(counts.values())
    end_line = text.count('\\n', 0, end) + 1
    results.append({
        'name': name,
        'line': start_line,
        'endLine': end_line,
        'complexity': complexity,
        'counts': counts,
    })

print(json.dumps(sorted(results, key=lambda x: (-x['complexity'], x['line'])), indent=2))
PY" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "name": "enrichStatelessData",
    "line": 1250,
    "endLine": 1371,
    "complexity": 30,
    "counts": {
      "if": 8,
      "for": 0,
      "while": 0,
      "catch": 3,
      "case": 0,
      "ternary": 3,
      "and": 1,
      "or": 14
    }
  },
  {
    "name": "enrichFileSourceData",
    "line": 1169,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1384,1405p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1384	async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
  1385	  return withWorkflowRunLock(async () => {
  1386	    const {
  1387	      dataFile,
  1388	      specFolderArg,
  1389	      collectedData: preloadedData,
  1390	      loadDataFn,
  1391	      collectSessionDataFn,
  1392	      silent = false
  1393	    } = options;
  1394	
  1395	    const hasDirectDataContext = (
  1396	      dataFile !== undefined ||
  1397	      preloadedData !== undefined ||
  1398	      loadDataFn !== undefined
  1399	    );
  1400	    const activeDataFile = dataFile ?? (hasDirectDataContext ? null : CONFIG.DATA_FILE);
  1401	    const activeSpecFolderArg = specFolderArg ?? (hasDirectDataContext ? null : CONFIG.SPEC_FOLDER_ARG);
  1402	
  1403	
exec
/bin/zsh -lc "python3 - <<'PY'
import re, json, pathlib
p=pathlib.Path('.opencode/skill/system-spec-kit/scripts/core/workflow.ts')
text=p.read_text()
lines=text.splitlines()
starts=[]
for i,line in enumerate(lines, start=1):
    m=re.match(r'"'^(?:export'"\\s+)?(?:async\\s+)?function\\s+([A-Za-z0-9_]+)\\s*\\(', line)
    if m:
        starts.append((m.group(1), i))
results=[]
for idx,(name,start) in enumerate(starts):
    end=(starts[idx+1][1]-1) if idx+1 < len(starts) else len(lines)
    chunk='\\n'.join(lines[start-1:end])
    # strip comments/strings roughly
    s=[]; i=0; mode='code'; quote=''
    while i < len(chunk):
        ch=chunk[i]; nxt=chunk[i+1] if i+1 < len(chunk) else ''
        if mode=='code':
            if ch=='/' and nxt=='/': mode='line'; s.append('  '); i+=1
            elif ch=='/' and nxt=='*': mode='block'; s.append('  '); i+=1
            elif ch in ('\"', \"'\", '"'`'"'): mode='str'; quote=ch; s.append(' ')
            else: s.append(ch)
        elif mode=='line':
            if ch=='\\n': mode='code'; s.append('\\n')
            else: s.append(' ')
        elif mode=='block':
            if ch=='*' and nxt=='/': mode='code'; s.append('  '); i+=1
            else: s.append('\\n' if ch=='\\n' else ' ')
        elif mode=='str':
            if ch=='\\\\': s.append('  '); i+=1
            elif ch==quote: mode='code'; s.append(' ')
            else: s.append('\\n' if ch=='\\n' else ' ')
        i+=1
    stripped=''.join(s)
    counts={
      'if': len(re.findall(r'\\bif\\b', stripped)),
      'for': len(re.findall(r'\\bfor\\b', stripped)),
      'while': len(re.findall(r'\\bwhile\\b', stripped)),
      'catch': len(re.findall(r'\\bcatch\\b', stripped)),
      'case': len(re.findall(r'\\bcase\\b', stripped)),
      'ternary': len(re.findall(r'(?<"'!'"\\?)\\?(?"'!['"\\?.])', stripped)),
      'and': stripped.count('&&'),
      'or': stripped.count('||'),
    }
    complexity=1+sum(counts.values())
    results.append({'name':name,'line':start,'endLine':end,'complexity':complexity,'counts':counts})
print(json.dumps(sorted(results,key=lambda x:(-x['complexity'],x['line']))[:15], indent=2))
PY" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "name": "runWorkflow",
    "line": 1384,
    "endLine": 2494,
    "complexity": 199,
    "counts": {
      "if": 64,
      "for": 6,
      "while": 0,
      "catch": 6,
      "case": 0,
      "ternary": 47,
      "and": 26,
      "or": 49
    }
  },
  {
    "name": "enrichStatelessData",
    "line": 1250,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '151,203p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   151	function shouldIndexMemory(options: {
   152	  ctxFileWritten: boolean;
   153	  validationDisposition: ValidationDispositionResult;
   154	  templateContractValid: boolean;
   155	  sufficiencyPass: boolean;
   156	  qualityScore01: number;
   157	  qualityAbortThreshold: number;
   158	}): { shouldIndex: boolean; reason?: string } {
   159	  if (!options.ctxFileWritten) {
   160	    return {
   161	      shouldIndex: false,
   162	      reason: 'Context file content matched an existing memory file, so semantic indexing was skipped.',
   163	    };
   164	  }
   165	
   166	  if (!options.templateContractValid) {
   167	    return {
   168	      shouldIndex: false,
   169	      reason: 'Rendered memory failed the template contract, so semantic indexing was skipped.',
   170	    };
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '544,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   544	
   545	function buildMemoryTitle(_implementationTask: string, _specFolderName: string, _date: string, contentSlug?: string): string {
   546	  if (contentSlug && contentSlug.length > 0) {
   547	    return truncateMemoryTitle(slugToTitle(contentSlug));
   548	  }
   549	
   550	  // Fallback (should not happen — contentSlug is always available at call site)
   551	  const preferredTitle = pickBestContentName([_implementationTask]);
   552	  if (preferredTitle.length > 0) {
   553	    return truncateMemoryTitle(normalizeMemoryTitleCandidate(preferredTitle));
   554	  }
   555	
   556	  const folderLeaf = _specFolderName.split('/').filter(Boolean).pop() || _specFolderName;
   557	  const readableFolder = normalizeMemoryTitleCandidate(folderLeaf.replace(/^\d+-/, '').replace(/-/g, ' '));
   558	  const fallback = readableFolder.length > 0 ? `${readableFolder} session ${_date}` : `Session ${_date}`;
   559	  return truncateMemoryTitle(fallback);
   560	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2160,2235p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2160	    const specFolderAbsForHealth = path.resolve(specFolder);
  2161	    specDocHealth = evaluateSpecDocHealth(specFolderAbsForHealth);
  2162	    if (!specDocHealth.pass) {
  2163	      log(`   Spec doc health: ${specDocHealth.errors} errors, ${specDocHealth.warnings} warnings (score: ${specDocHealth.score})`);
  2164	    }
  2165	    files[ctxFilename] = injectSpecDocHealthMetadata(files[ctxFilename], specDocHealth);
  2166	  } catch (e: unknown) {
  2167	    // Non-blocking — health annotation failure must not prevent memory save
  2168	    log(`   Spec doc health check skipped: ${e instanceof Error ? e.message : String(e)}`);
  2169	  }
  2170	
  2171	  // CG-07b: Validate template contract BEFORE any banner/warning is prepended.
  2172	  // Banners prepended after this point (low-quality, simulation, medium-quality)
  2173	  // would shift the frontmatter away from position 0, causing false
  2174	  // missing_frontmatter violations when the contract is checked later.
  2175	  const templateContractEarly = validateMemoryTemplateContract(files[ctxFilename]);
  2176	  if (!templateContractEarly.valid) {
  2177	    const contractDetails = templateContractEarly.violations
  2178	      .map((violation: { code: string; sectionId?: string }) => violation.sectionId ? `${violation.code}:${violation.sectionId}` : violation.code)
  2179	      .join(', ');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2458,2488p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2458	    const errMsg = e instanceof Error ? e.message : String(e);
  2459	    warn(`   Warning: Retry processing error: ${errMsg}`);
  2460	  }
  2461	
  2462	  log();
  2463	
  2464	      return {
  2465	        contextDir,
  2466	        specFolder,
  2467	        specFolderName,
  2468	        contextFilename: ctxFilename,
  2469	        writtenFiles,
  2470	        memoryId,
  2471	        indexingStatus: indexingStatus ?? {
  2472	          status: 'failed_embedding',
  2473	          memoryId,
  2474	          reason: 'Indexing status was not finalized before workflow completion.',
  2475	        },
  2476	        stats: {
  2477	          messageCount: conversations.MESSAGES.length,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2230,2285p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2230	  const QUALITY_ABORT_THRESHOLD = CONFIG.QUALITY_ABORT_THRESHOLD;
  2231	  if (qualityResult.score01 < QUALITY_ABORT_THRESHOLD) {
  2232	    const abortMsg = `QUALITY_GATE_ABORT: Memory quality score ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}) ` +
  2233	      `is below minimum threshold (${QUALITY_ABORT_THRESHOLD.toFixed(2)}). ` +
  2234	      `This typically means the captured session data does not contain meaningful content for this spec folder. ` +
  2235	      `To force save, pass data via JSON file instead of stateless mode.`;
  2236	    warn(abortMsg);
  2237	    throw new Error(abortMsg);
  2238	  }
  2239	
  2240	  const validationDisposition = determineValidationDisposition(qualityValidation.failedRules, captureSource);
  2241	  if (validationDisposition.disposition === 'abort_write') {
  2242	    const failedContaminationRules = validationDisposition.blockingRuleIds.filter((ruleId) => ruleId === 'V8' || ruleId === 'V9');
  2243	    if (failedContaminationRules.length > 0) {
  2244	      const contaminationAbortMsg = `CONTAMINATION_GATE_ABORT: Critical contamination rules failed: [${failedContaminationRules.join(', ')}]. ` +
  2245	        `Content contains cross-spec contamination that would corrupt the memory index. Aborting write.`;
  2246	      warn(contaminationAbortMsg);
  2247	      throw new Error(contaminationAbortMsg);
  2248	    }
  2249	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
exec
/bin/zsh -lc "rg -n \"indexMemory\\(|buildWeightedEmbeddingSections\\(|extractTriggerPhrases\\(|updateMetadataEmbeddingStatus\\(|retryManager\\.|EMBEDDING_DIM|MODEL_NAME\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:16:import { generateDocumentEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:54:async function indexMemory(
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:89:      triggerPhrases = extractTriggerPhrases(content);
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:126:  const memoryId: number = vectorIndex.indexMemory({
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:150:  await updateMetadataEmbeddingStatus(contextDir, {
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:156:async function updateMetadataEmbeddingStatus(
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:168:      model: MODEL_NAME,
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:169:      dimensions: EMBEDDING_DIM,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:63:import { EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1949:    preExtractedTriggers = extractTriggerPhrases(triggerSource);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2053:      EMBEDDING_MODEL: MODEL_NAME || 'text-embedding-3-small',
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2098:        model: MODEL_NAME,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2099:        dimensions: EMBEDDING_DIM
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2378:    await updateMetadataEmbeddingStatus(contextDir, indexingStatus);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2400:        const embeddingSections = buildWeightedEmbeddingSections(implSummary, files[ctxFilename]);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2401:        memoryId = await indexMemory(
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2411:          log(`   Indexed as memory #${memoryId} (${EMBEDDING_DIM} dimensions)`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2448:    const retryStats = retryManager.getRetryStats();
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2451:      const results = await retryManager.processRetryQueue(3);
exec
/bin/zsh -lc "python3 - <<'PY'
import re, pathlib, json
text=pathlib.Path('.opencode/skill/system-spec-kit/scripts/core/workflow.ts').read_text()
imports=[]
for m in re.finditer(r'"'^import'"\\s+(.*?)\\s+from\\s+[\\'\\\"](["'^'"\\'\\\"]+)[\\'\\\"];?"'$'"', text, re.M|re.S):
    imports.append((m.group(1).replace('\\n',' '), m.group(2)))
print(json.dumps(imports, indent=2))
PY" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  [
    "* as path",
    "node:path"
  ],
  [
    "* as fsSync",
    "node:fs"
  ],
  [
    "* as crypto",
    "node:crypto"
  ],
  [
    "{ CONFIG, findActiveSpecsDir, getSpecsDirectories }",
    "./config"
  ],
  [
    "{   extractConversations,   extractDecisions,   extractDiagrams,   extractPhasesFromData,   enhanceFilesWithSemanticDescriptions, }",
    "../extractors"
exec
/bin/zsh -lc "rg -n \"runWorkflow\\(|enrichStatelessData\\(|enrichFileSourceData\\(|applyThinningToFileChanges\\(|buildWorkflowMemoryEvidenceSnapshot\\(\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
429:function applyThinningToFileChanges(
1068:function buildWorkflowMemoryEvidenceSnapshot(params: {
1169:async function enrichFileSourceData(
1250:async function enrichStatelessData(
1258:    return enrichFileSourceData(collectedData, specFolder, projectRoot);
1384:async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
1607:      collectedData = await enrichStatelessData(collectedData, specFolder, CONFIG.PROJECT_ROOT);
1679:        '  - If calling runWorkflow() directly, pass { collectSessionDataFn: yourFunction } in options\n' +
1857:  const effectiveFiles = applyThinningToFileChanges(enhancedFiles, thinningResult);
2131:  const sufficiencySnapshot = buildWorkflowMemoryEvidenceSnapshot({
exec
/bin/zsh -lc "rg -n \"extractSpecFolderContext\\(|extractGitContext\\(|filterContamination\\(|validateMemoryTemplateContract\\(|evaluateMemorySufficiency\\(|determineValidationDisposition\\(|writeFilesAtomically\\(|populateTemplate\\(\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
385:    const specContext = await extractSpecFolderContext(path.resolve(specFolderPath));
1182:      extractSpecFolderContext(specFolder).catch((err: unknown) => {
1187:      extractGitContext(projectRoot, specFolder).catch((err: unknown) => {
1266:      extractSpecFolderContext(specFolder).catch((err: unknown) => {
1271:      extractGitContext(projectRoot, specFolder).catch((err: unknown) => {
1528:      const filtered = filterContamination(
1991:    [ctxFilename]: await populateTemplate('context', {
2143:  const sufficiencyResult = evaluateMemorySufficiency(sufficiencySnapshot);
2175:  const templateContractEarly = validateMemoryTemplateContract(files[ctxFilename]);
2240:  const validationDisposition = determineValidationDisposition(qualityValidation.failedRules, captureSource);
2277:  const writtenFiles: string[] = await writeFilesAtomically(contextDir, files);
exec
/bin/zsh -lc "rg -n \"updateMetadataWithEmbedding\\b\" ." in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 108ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/scratch/agent-output-iter-001-copilot-C3.md:344:  │ "updateMetadataWithEmbedding|updateMetadataEmbeddingStatus|notifyDatabaseUpdated|Embedding
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/scratch/agent-output-iter-001-copilot-C3.md:393:  │ "memory-indexer weighting|indexMemory\(|updateMetadataWithEmbedding|updateMetadataEmbeddingStatu
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/scratch/agent-output-iter-001-copilot-C3.md:460:Suggested: unit tests around `indexMemory()`, `updateMetadataEmbeddingStatus()`, `updateMetadataWithEmbedding()` with mocked fs/vector failures.
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C15.md:1203:    // Test 4: updateMetadataWithEmbedding is exported from memory-indexer module
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C15.md:1204:    assertType(memoryIndexer.updateMetadataWithEmbedding, 'function', 'T-024d: updateMetadataWithEmbedding exported via memory-indexer');
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/scratch/agent-output-iter-002-codex-A1.md:1067:/bin/zsh -lc "rg -n \"updateMetadataWithEmbedding\\b\" ." in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:81:/bin/zsh -lc "rg -n \"writeFilesAtomically|indexMemory|updateMetadataWithEmbedding|scoreMemoryQualityV2|scoreMemoryQuality|validateMemoryQualityContent|injectQualityMetadata\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:83:/bin/zsh -lc "rg -n \"function indexMemory|const indexMemory|updateMetadataWithEmbedding|retryManager\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:88:50:import { indexMemory, updateMetadataWithEmbedding } from './memory-indexer';
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:96:895:        await updateMetadataWithEmbedding(contextDir, memoryId);
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:111:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1551:    // Test 4: updateMetadataWithEmbedding is exported from memory-indexer module
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:112:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1552:    assertType(memoryIndexer.updateMetadataWithEmbedding, 'function', 'T-024d: updateMetadataWithEmbedding exported via memory-indexer');
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:113:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1583:    // Test 8: updateMetadataWithEmbedding signature check (async function)
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:114:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1584:    if (memoryIndexer.updateMetadataWithEmbedding.constructor.name === 'AsyncFunction') {
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:115:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1585:      pass('T-024i: updateMetadataWithEmbedding is async function', 'AsyncFunction confirmed');
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C08.md:116:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1587:      fail('T-024i: updateMetadataWithEmbedding is async function', 'Not an async function');
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C17.md:142:895:        await updateMetadataWithEmbedding(contextDir, memoryId);
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-output-iter-005-codex-A2.md:366:      "updateMetadataWithEmbedding"
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-output-iter-005-codex-A2.md:1242:/bin/zsh -lc "rg -n --glob '*.vitest.ts' --glob '*.test.ts' \"\\b(writeFilesAtomically|indexMemory|updateMetadataEmbeddingStatus|updateMetadataWithEmbedding|runWorkflow|stripWorkflowHtmlOutsideCodeFences|collectSessionData|shouldAutoSave|extractPreflightPostflightData|calculateLearningIndex|getScoreAssessment|getTrendIndicator|generateLearningSummary|buildContinueSessionData|determineSessionStatus|estimateCompletionPercent|extractPendingTasks|generateContextSummary|generateResumeContext|filterContamination|getContaminationPatternLabels|extractDecisions_alias|extractDecisions|detectObservationType|extractFilesFromData|enhanceFilesWithSemanticDescriptions|buildObservationsWithAnchors|deduplicateObservations|captureConversation|getProjectId|getRecentSessions|getCurrentSession|getSessionMessages|getMessageParts|getSessionResponses|getToolExecutions|pathExists|readJsonSafe|readJsonlTail|scoreMemoryQuality|generateSessionId|getChannel|detectContextType|detectImportanceTier|detectProjectPhase|extractActiveFile|extractNextAction|extractBlockers|buildFileProgress|countToolsByType|calculateSessionDuration|calculateExpiryEpoch|detectRelatedDocs|extractKeyTopics|detectSessionCharacteristics|buildProjectStateSnapshot|loadCollectedData|inferPreferredCaptureSourceFromEnv|buildNativeCaptureOrder|populateTemplate|renderTemplate|cleanupExcessiveNewlines|stripTemplateConfigComments|isFalsy|transformKeyDecision|buildSessionSummaryObservation|buildTechnicalContextObservation|normalizeInputData|validateInputData|transformOpencodeCapture|transformOpenCodeCapture|getSourceCapabilities|isKnownDataSource|SOURCE_CAPABILITIES)\\b\" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/system-spec-kit/shared/parsing" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-output-iter-005-codex-A2.md:1406:/bin/zsh -lc 'rg -n "indexMemory|updateMetadataEmbeddingStatus|updateMetadataWithEmbedding" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
exec
/bin/zsh -lc "python3 - <<'PY'
import pathlib,re
text=pathlib.Path('.opencode/skill/system-spec-kit/scripts/core/workflow.ts').read_text()
print(sum(1 for _ in re.finditer(r'"'^import'"\\s+', text, re.M)))
PY" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
43
exec
/bin/zsh -lc "rg -n \"Step [0-9]|Steps 4-7|Step 7\\.5|Step 7\\.6|Step 8\\.5|Step 8\\.6|Step 9\\.5|Step 11|Step 12\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
1408:    // Step 1: Load collected data
1409:    log('Step 1: Loading collected data...');
1428:    // Step 1.5: Stateless mode alignment check
1472:    // Step 2: Detect spec folder with context alignment
1473:    log('Step 2: Detecting spec folder...');
1511:    // Step 3: Setup context directory
1512:    log('Step 3: Setting up context directory...');
1604:    // Step 3.5: Enrich stateless data with spec folder and git context
1606:      log('Step 3.5: Enriching stateless data...');
1672:    // Steps 4-7: Parallel data extraction
1673:    log('Steps 4-7: Extracting data (parallel execution)...\n');
1794:  // Step 7.5: Generate semantic implementation summary
1795:  log('Step 7.5: Generating semantic summary...');
1848:  // Step 7.6: Tree thinning — pre-pipeline token reduction
1851:  log('Step 7.6: Applying tree thinning...');
1865:  // Step 8: Populate templates
1866:  log('Step 8: Populating template...');
2107:  // Step 8.5: Content cleaning — strip leaked HTML tags from rendered content
2109:  log('Step 8.5: Content cleaning...');
2120:  // Step 8.6: Quality validation + scoring
codex
I found a local `typescript` install under the skill package, so I can switch from heuristic counting to the compiler API. I’m recalculating complexity now with nested functions excluded, which should give us a cleaner top-10 list and make the hotspots much more trustworthy.
exec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript');
const fs = require('fs');
const file = '.opencode/skill/system-spec-kit/scripts/core/workflow.ts';
const source = fs.readFileSync(file, 'utf8');
const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function lineOf(pos) {
  return sf.getLineAndCharacterOfPosition(pos).line + 1;
}

function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node);
}

function cyclomatic(node) {
  let complexity = 1;
  function visit(n, inRoot = false) {
    if ("'!inRoot && isFunctionLike(n)) return;
    switch (n.kind) {
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.ConditionalExpression:
        complexity++;
        break;
      case ts.SyntaxKind.CaseClause:
        complexity++;
        break;
      case ts.SyntaxKind.BinaryExpression: {
        const op = n.operatorToken.kind;
        if (op === ts.SyntaxKind.AmpersandAmpersandToken || op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) {
          complexity++;
        }
        break;
      }
    }
    ts.forEachChild(n, c => visit(c, false));
  }
  visit(node, true);
  return complexity;
}

const results = [];
for (const stmt of sf.statements) {
  if (ts.isFunctionDeclaration(stmt) && stmt.name) {
    results.push({
      name: stmt.name.text,
      startLine: lineOf(stmt.getStart(sf)),
      endLine: lineOf(stmt.end),
      complexity: cyclomatic(stmt)
    });
  }
}
results.sort((a,b)=> b.complexity - a.complexity || a.startLine - b.startLine);
console.log(JSON.stringify(results.slice(0,15), null, 2));
NODE' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 48ms:
[
  {
    "name": "enrichFileSourceData",
    "startLine": 1169,
    "endLine": 1248,
    "complexity": 27
  },
  {
    "name": "enrichStatelessData",
    "startLine": 1250,
    "endLine": 1371,
    "complexity": 23
  },
  {
    "name": "applyThinningToFileChanges",
    "startLine": 429,
    "endLine": 513,
    "complexity": 16
  },
  {
exec
/bin/zsh -lc 'node - <<"NODE"
const ts = require("./.opencode/skill/system-spec-kit/node_modules/typescript");
const fs = require("fs");
const file = ".opencode/skill/system-spec-kit/scripts/core/workflow.ts";
const source = fs.readFileSync(file, "utf8");
const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function lineOf(pos) {
  return sf.getLineAndCharacterOfPosition(pos).line + 1;
}

function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node);
}

function cyclomatic(node) {
  let complexity = 1;
  function visit(n, inRoot = false) {
    if (!inRoot && isFunctionLike(n)) return;
    switch (n.kind) {
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.ConditionalExpression:
        complexity++;
        break;
      case ts.SyntaxKind.CaseClause:
        complexity++;
        break;
      case ts.SyntaxKind.BinaryExpression: {
        const op = n.operatorToken.kind;
        if (op === ts.SyntaxKind.AmpersandAmpersandToken || op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) {
          complexity++;
        }
        break;
      }
    }
    ts.forEachChild(n, c => visit(c, false));
  }
  visit(node, true);
  return complexity;
}

const results = [];
for (const stmt of sf.statements) {
  if (ts.isFunctionDeclaration(stmt) && stmt.name) {
    results.push({
      name: stmt.name.text,
      startLine: lineOf(stmt.getStart(sf)),
      endLine: lineOf(stmt.end),
      complexity: cyclomatic(stmt)
    });
  }
}
results.sort((a,b)=> b.complexity - a.complexity || a.startLine - b.startLine);
console.log(JSON.stringify(results.slice(0,15), null, 2));
NODE' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 41ms:
[
  {
    "name": "enrichFileSourceData",
    "startLine": 1169,
    "endLine": 1248,
    "complexity": 27
  },
  {
    "name": "enrichStatelessData",
    "startLine": 1250,
    "endLine": 1371,
    "complexity": 23
  },
  {
    "name": "applyThinningToFileChanges",
    "startLine": 429,
    "endLine": 513,
    "complexity": 16
  },
  {
exec
/bin/zsh -lc 'node - <<"NODE"
const ts = require("./.opencode/skill/system-spec-kit/node_modules/typescript");
const fs = require("fs");
const file = ".opencode/skill/system-spec-kit/scripts/core/workflow.ts";
const source = fs.readFileSync(file, "utf8");
const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
for (const stmt of sf.statements) {
  if (ts.isFunctionDeclaration(stmt) && stmt.name) {
    const name = stmt.name.text;
    if (name === "runWorkflow") {
      console.log("found", name, sf.getLineAndCharacterOfPosition(stmt.getStart(sf)).line + 1, sf.getLineAndCharacterOfPosition(stmt.end).line + 1);
      function isFunctionLike(node) {
        return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node);
      }
      let complexity = 1;
      function visit(n, inRoot = false) {
        if (!inRoot && isFunctionLike(n)) return;
        switch (n.kind) {
          case ts.SyntaxKind.IfStatement:
          case ts.SyntaxKind.ForStatement:
          case ts.SyntaxKind.ForInStatement:
          case ts.SyntaxKind.ForOfStatement:
          case ts.SyntaxKind.WhileStatement:
          case ts.SyntaxKind.DoStatement:
          case ts.SyntaxKind.CatchClause:
          case ts.SyntaxKind.ConditionalExpression:
            complexity++;
            break;
          case ts.SyntaxKind.CaseClause:
            complexity++;
            break;
          case ts.SyntaxKind.BinaryExpression: {
            const op = n.operatorToken.kind;
            if (op === ts.SyntaxKind.AmpersandAmpersandToken || op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) complexity++;
            break;
          }
        }
        ts.forEachChild(n, c => visit(c, false));
      }
      visit(stmt, true);
      console.log("complexity", complexity);
    }
  }
}
NODE' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 61ms:
found runWorkflow 1384 2485
complexity 1
codex
The AST result exposed an important quirk: `runWorkflow` itself scores as complexity `1` because all real logic lives inside the immediately-invoked async callback it passes to `withWorkflowRunLock`. I’m switching the ranking to all function-like nodes, including anonymous callbacks, so the true hotspot at lines `1385-2484` shows up instead of being hidden by the wrapper.
exec
/bin/zsh -lc 'node - <<"NODE"
const ts = require("./.opencode/skill/system-spec-kit/node_modules/typescript");
const fs = require("fs");
const file = ".opencode/skill/system-spec-kit/scripts/core/workflow.ts";
const source = fs.readFileSync(file, "utf8");
const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function lineOf(pos) {
  return sf.getLineAndCharacterOfPosition(pos).line + 1;
}
function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node);
}
function complexityOf(node) {
  let complexity = 1;
  function visit(n, inRoot = false) {
    if (!inRoot && isFunctionLike(n)) return;
    switch (n.kind) {
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.ConditionalExpression:
        complexity++;
        break;
      case ts.SyntaxKind.CaseClause:
        complexity++;
        break;
      case ts.SyntaxKind.BinaryExpression: {
        const op = n.operatorToken.kind;
        if (op === ts.SyntaxKind.AmpersandAmpersandToken || op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) complexity++;
        break;
      }
    }
    ts.forEachChild(n, c => visit(c, false));
  }
  visit(node, true);
  return complexity;
}
function label(node) {
  if (ts.isFunctionDeclaration(node) && node.name) return `function ${node.name.text}`;
  if (ts.isArrowFunction(node)) {
    const parent = node.parent;
    if (ts.isCallExpression(parent)) {
      const expr = parent.expression.getText(sf).slice(0,60);
      return `arrow in ${expr}`;
    }
    return '"'arrow function';
  }
  if (ts.isFunctionExpression(node)) return 'function expression';
  return ts.SyntaxKind[node.kind];
}
const results=[];
function walk(n){
  if (isFunctionLike(n)) {
    results.push({label: label(n), startLine: lineOf(n.getStart(sf)), endLine: lineOf(n.end), complexity: complexityOf(n)});
  }
  ts.forEachChild(n, walk);
}
walk(sf);
results.sort((a,b)=> b.complexity - a.complexity || a.startLine - b.startLine);
console.log(JSON.stringify(results.slice(0,15), null, 2));
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 48ms:
[
  {
    "label": "arrow in withWorkflowRunLock",
    "startLine": 1385,
    "endLine": 2484,
    "complexity": 158
  },
  {
    "label": "function enrichFileSourceData",
    "startLine": 1169,
    "endLine": 1248,
    "complexity": 27
  },
  {
    "label": "function enrichStatelessData",
    "startLine": 1250,
    "endLine": 1371,
    "complexity": 23
  },
  {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '658,690p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   658	
   659	function listSpecFolderKeyFiles(specFolderPath: string): Array<{ FILE_PATH: string }> {
   660	  const collected: string[] = [];
   661	  const ignoredDirs = new Set(['memory', 'scratch', '.git', 'node_modules']);
   662	
   663	  const visit = (currentDir: string, relativeDir: string): void => {
   664	    const entries = fsSync.readdirSync(currentDir, { withFileTypes: true });
   665	    for (const entry of entries) {
   666	      if (entry.isSymbolicLink()) {
   667	        continue;
   668	      }
   669	      if (entry.isDirectory()) {
   670	        if (ignoredDirs.has(entry.name)) {
   671	          continue;
   672	        }
   673	
   674	        visit(path.join(currentDir, entry.name), path.join(relativeDir, entry.name));
   675	        continue;
   676	      }
   677	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1518,1549p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1518	    let contaminationMaxSeverity: ContaminationSeverity | null = null;
  1519	    const contaminationAuditTrail: ContaminationAuditRecord[] = [];
  1520	    const extractorPatternCounts = new Map<string, number>();
  1521	    let extractorProcessedFieldCount = 0;
  1522	    let extractorCleanedFieldCount = 0;
  1523	    let extractorRemovedPhraseCount = 0;
  1524	    const captureSource = typeof collectedData?._source === 'string' ? collectedData._source : undefined;
  1525	    const captureCapabilities = getSourceCapabilities(captureSource);
  1526	    const cleanContaminationText = (input: string): string => {
  1527	      extractorProcessedFieldCount++;
  1528	      const filtered = filterContamination(
  1529	        input,
  1530	        undefined,
  1531	        captureSource ? { captureSource: captureCapabilities.source, sourceCapabilities: captureCapabilities } : undefined,
  1532	      );
  1533	      if (filtered.hadContamination) {
  1534	        hadContamination = true;
  1535	        extractorCleanedFieldCount++;
  1536	        extractorRemovedPhraseCount += filtered.removedPhrases.length;
  1537	        if (filtered.maxSeverity !== null) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1098,1125p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1098	
  1099	  return {
  1100	    title,
  1101	    content,
  1102	    triggerPhrases,
  1103	    files: files.map((file) => ({
  1104	      path: file.FILE_PATH,
  1105	      description: file.DESCRIPTION,
  1106	      specRelevant: true,
  1107	    })),
  1108	    observations: observations.map((observation) => ({
  1109	      title: typeof observation.TITLE === 'string'
  1110	        ? observation.TITLE
  1111	        : (typeof observation.title === 'string' ? observation.title : ''),
  1112	      narrative: typeof observation.NARRATIVE === 'string'
  1113	        ? observation.NARRATIVE
  1114	        : (typeof observation.narrative === 'string' ? observation.narrative : ''),
  1115	      facts: Array.isArray(observation.FACTS)
  1116	        ? observation.FACTS.map(normalizeEvidenceLine).filter(Boolean)
  1117	        : (Array.isArray(observation.facts) ? observation.facts.map(normalizeEvidenceLine).filter(Boolean) : []),
exec
/bin/zsh -lc "python3 - <<'PY'
import re, pathlib
text=pathlib.Path('.opencode/skill/system-spec-kit/scripts/core/workflow.ts').read_text()
mods=[]
for m in re.finditer(r'"'^import'"\\s+.*?\\s+from\\s+[\\'\\\"](["'^'"\\'\\\"]+)[\\'\\\"];?"'$'"', text, re.M|re.S):
    mods.append(m.group(1))
print('import statements', len(mods))
print('unique modules', len(set(mods)))
PY" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import statements 43
unique modules 39
codex
Cyclomatic numbers below come from the local TypeScript compiler API over function-like nodes. One important caveat: named `runWorkflow()` looks trivial by that metric because almost all of its logic lives inside the async callback it passes to `withWorkflowRunLock()`.

- `FINDING-ID: ARCH-001`
- `Impact: HIGH`
- `Description: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L10) is a God Module, not a clean workflow coordinator. It owns at least 8 distinct domains: index policy (`shouldIndexMemory`, lines 151-202), topic/trigger derivation (`ensureMinSemanticTopics`, `ensureMinTriggerPhrases`, `renderTriggerPhrasesYaml`, lines 204-257), content sanitization (`stripWorkflowHtmlOutsideCodeFences`, `escapeLiteralAnchorExamples`, lines 259-295), path/alignment/tree-thinning IO (`normalizeFilePath` through `buildKeyFiles`, lines 305-707), naming/title generation (`normalizeMemoryTitleCandidate` through `extractSpecTitle`, lines 515-603), memory classification/metadata shaping (`readNamedObject` through `buildCausalLinksContext`, lines 709-942), frontmatter/evidence shaping (`injectQualityMetadata` through `formatSufficiencyAbort`, lines 960-1161), enrichment (`enrichFileSourceData`, `enrichStatelessData`, lines 1169-1371), and full orchestration/persistence/indexing (`runWorkflow`, lines 1384-2485). This is not a classic God Object because there is no class with shared mutable state, but architecturally it is a God Module.
- `Recommendation: Split the file by domain and leave `workflow.ts` as a thin phase coordinator only.`

- `FINDING-ID: ARCH-002`
- `Impact: HIGH`
- `Description: The real God Function is the async callback inside `runWorkflow`, not `runWorkflow` itself. The wrapper starts at [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1384), but the callback spans lines 1385-2484 and has estimated cyclomatic complexity 158. Top 10 function-like hotspots: `arrow in withWorkflowRunLock` 158 (1385-2484), `enrichFileSourceData` 27 (1169-1248), `enrichStatelessData` 23 (1250-1371), `applyThinningToFileChanges` 16 (429-513), `resolveTreeThinningContent` 13 (633-657), `injectQualityMetadata` 11 (960-1008), `observations.map` callback 8 (1108-1121), `cleanContaminationText` callback 8 (1526-1547), `shouldIndexMemory` 7 (151-202), `visit` callback in `listSpecFolderKeyFiles` 7 (663-684). The callback also clearly contains multiple phases in one body: load/alignment (1408-1512), contamination/enrichment (1516-1641), extraction (1672-1811), rendering (1794-2105), quality gates (2120-2273), write/index/retry (2275-2460).
- `Recommendation: Extract each phase into a named function or service so the callback disappears and complexity becomes visible and testable.`

- `FINDING-ID: ARCH-003`
- `Impact: HIGH`
- `Description: `enrichFileSourceData()` and `enrichStatelessData()` in [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1169) are secondary SRP hotspots. Each one mixes external adapter calls (`extractSpecFolderContext`, `extractGitContext`), merge precedence rules, summary fallback, trigger/decision propagation, file deduplication, provenance tagging, and narrative shaping. `enrichFileSourceData()` is complexity 27; `enrichStatelessData()` is 23. These are doing policy, transformation, and integration work at the same time.
- `Recommendation: Split them into `loadSpecContext`, `loadGitContext`, `mergeFilesByPath`, `mergeSummary`, `mergeManualSignals`, and `buildNarrativeObservations` under a `ContextEnricher` boundary.`

- `FINDING-ID: ARCH-004`
- `Impact: MEDIUM`
- `Description: The embedding pipeline is not cleanly separated between [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1917) and [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L54). `workflow.ts` pre-extracts trigger phrases, injects embedding model metadata into template/metadata, decides whether indexing is allowed, builds weighted embedding sections, persists indexing status, and processes retries. `memory-indexer.ts` then rebuilds weighted document text, generates embeddings, re-extracts trigger phrases as fallback, computes importance weight, writes to `vectorIndex`, and updates metadata. Both files know about `MODEL_NAME`/`EMBEDDING_DIM`; trigger extraction exists in both places.
- `Recommendation: Introduce a single `MemoryIndexingPipeline` that owns preparation, gating, indexing, metadata persistence, and retry handling. `workflow.ts` should only call `indexingPipeline.run(renderedMemory)` and receive a result.`

- `FINDING-ID: ARCH-005`
- `Impact: MEDIUM`
- `Description: Import sprawl confirms the boundary problem. [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L10) has 43 import statements from 39 modules, spanning stdlib IO, extractors, renderers, semantic summarizers, validators, shared parsers, embedding primitives, retry providers, and index/persistence helpers. With cleaner boundaries, the orchestrator should not need direct imports like `EMBEDDING_DIM`, `MODEL_NAME`, `retryManager`, `indexMemory`, `updateMetadataEmbeddingStatus`, `validateMemoryTemplateContract`, `evaluateMemorySufficiency`, `evaluateSpecDocHealth`, `populateTemplate`, or `extractSpecFolderContext`.
- `Recommendation: Reduce `workflow.ts` to orchestration over narrow interfaces such as `InputPreparation`, `Renderer`, `QualityGate`, `Persistence`, and `IndexingCoordinator`.`

- `FINDING-ID: ARCH-006`
- `Impact: HIGH`
- `Description: Concrete decomposition plan: `workflow-orchestrator.ts` for `runWorkflow`/locking only; `workflow-input.ts` for data load, spec detection, alignment, context-dir setup; `workflow-sanitizer.ts` for contamination cleanup/audit; `workflow-enricher.ts` for spec/git enrichment; `workflow-renderer.ts` for semantic summary, tree thinning, title/slug generation, trigger extraction, template population, metadata draft creation; `workflow-quality-gate.ts` for HTML cleanup, sufficiency, template contract, health annotation, quality scoring, validation disposition; `workflow-persistence.ts` for atomic writes and per-folder description tracking; `workflow-indexing.ts` for policy, embedding preparation, index writes, metadata status, and retry queue. The current phase seams are already visible from the step markers in [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1408).
- `Recommendation: Use DTOs between phases, e.g. `PreparedWorkflowInput`, `RenderedMemoryArtifacts`, `QualityGateResult`, `PersistenceResult`, and `WorkflowIndexingStatus`, so later phases stop reaching back into raw `collectedData`.`

- `FINDING-ID: ARCH-007`
- `Impact: MEDIUM`
- `Description: There are performance smells caused by the current architecture. Content is scrubbed multiple times: pre-enrichment contamination pass (1572-1596), file description cleaning (1636-1659), then prompt/summary/observation cleaning again before extraction (1687-1711) in [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1526). Tree-thinning also performs synchronous filesystem reads per file in `resolveTreeThinningContent()` (633-657) and recursive sync directory walks in `listSpecFolderKeyFiles()` (659-695). On large spec folders, this makes rendering more IO-bound than it needs to be.
- `Recommendation: Normalize/sanitize once into an immutable cleaned session model, and move tree-thinning reads behind an async or cached spec-file reader.`

- `FINDING-ID: ARCH-008`
- `Impact: LOW`
- `Description: There are dead or effectively unreachable paths. In [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L151), most branches in `shouldIndexMemory()` are redundant at its only call site because earlier code already aborts on template-contract failure (2175-2182), sufficiency failure (2224-2227), low quality threshold (2230-2237), and `abort_write` disposition (2240-2252); duplicate writes are handled before the call as well. `buildMemoryTitle()` keeps a fallback the comment says “should not happen” because `contentSlug` is always provided (545-560). The returned `indexingStatus ?? fallback` near the end (2471-2475) also looks unreachable because every step-11 path persists a status before returning. In [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L149), `updateMetadataWithEmbedding()` appears unused in production code; repo hits are tests/docs plus its own export.
- `Recommendation: Delete or collapse dead branches now, especially `shouldIndexMemory()`, or mark them as compatibility shims with a single documented reason.`

No repo tests were run; this was a static audit only.
tokens used
160,049
Cyclomatic numbers below come from the local TypeScript compiler API over function-like nodes. One important caveat: named `runWorkflow()` looks trivial by that metric because almost all of its logic lives inside the async callback it passes to `withWorkflowRunLock()`.

- `FINDING-ID: ARCH-001`
- `Impact: HIGH`
- `Description: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L10) is a God Module, not a clean workflow coordinator. It owns at least 8 distinct domains: index policy (`shouldIndexMemory`, lines 151-202), topic/trigger derivation (`ensureMinSemanticTopics`, `ensureMinTriggerPhrases`, `renderTriggerPhrasesYaml`, lines 204-257), content sanitization (`stripWorkflowHtmlOutsideCodeFences`, `escapeLiteralAnchorExamples`, lines 259-295), path/alignment/tree-thinning IO (`normalizeFilePath` through `buildKeyFiles`, lines 305-707), naming/title generation (`normalizeMemoryTitleCandidate` through `extractSpecTitle`, lines 515-603), memory classification/metadata shaping (`readNamedObject` through `buildCausalLinksContext`, lines 709-942), frontmatter/evidence shaping (`injectQualityMetadata` through `formatSufficiencyAbort`, lines 960-1161), enrichment (`enrichFileSourceData`, `enrichStatelessData`, lines 1169-1371), and full orchestration/persistence/indexing (`runWorkflow`, lines 1384-2485). This is not a classic God Object because there is no class with shared mutable state, but architecturally it is a God Module.
- `Recommendation: Split the file by domain and leave `workflow.ts` as a thin phase coordinator only.`

- `FINDING-ID: ARCH-002`
- `Impact: HIGH`
- `Description: The real God Function is the async callback inside `runWorkflow`, not `runWorkflow` itself. The wrapper starts at [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1384), but the callback spans lines 1385-2484 and has estimated cyclomatic complexity 158. Top 10 function-like hotspots: `arrow in withWorkflowRunLock` 158 (1385-2484), `enrichFileSourceData` 27 (1169-1248), `enrichStatelessData` 23 (1250-1371), `applyThinningToFileChanges` 16 (429-513), `resolveTreeThinningContent` 13 (633-657), `injectQualityMetadata` 11 (960-1008), `observations.map` callback 8 (1108-1121), `cleanContaminationText` callback 8 (1526-1547), `shouldIndexMemory` 7 (151-202), `visit` callback in `listSpecFolderKeyFiles` 7 (663-684). The callback also clearly contains multiple phases in one body: load/alignment (1408-1512), contamination/enrichment (1516-1641), extraction (1672-1811), rendering (1794-2105), quality gates (2120-2273), write/index/retry (2275-2460).
- `Recommendation: Extract each phase into a named function or service so the callback disappears and complexity becomes visible and testable.`

- `FINDING-ID: ARCH-003`
- `Impact: HIGH`
- `Description: `enrichFileSourceData()` and `enrichStatelessData()` in [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1169) are secondary SRP hotspots. Each one mixes external adapter calls (`extractSpecFolderContext`, `extractGitContext`), merge precedence rules, summary fallback, trigger/decision propagation, file deduplication, provenance tagging, and narrative shaping. `enrichFileSourceData()` is complexity 27; `enrichStatelessData()` is 23. These are doing policy, transformation, and integration work at the same time.
- `Recommendation: Split them into `loadSpecContext`, `loadGitContext`, `mergeFilesByPath`, `mergeSummary`, `mergeManualSignals`, and `buildNarrativeObservations` under a `ContextEnricher` boundary.`

- `FINDING-ID: ARCH-004`
- `Impact: MEDIUM`
- `Description: The embedding pipeline is not cleanly separated between [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1917) and [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L54). `workflow.ts` pre-extracts trigger phrases, injects embedding model metadata into template/metadata, decides whether indexing is allowed, builds weighted embedding sections, persists indexing status, and processes retries. `memory-indexer.ts` then rebuilds weighted document text, generates embeddings, re-extracts trigger phrases as fallback, computes importance weight, writes to `vectorIndex`, and updates metadata. Both files know about `MODEL_NAME`/`EMBEDDING_DIM`; trigger extraction exists in both places.
- `Recommendation: Introduce a single `MemoryIndexingPipeline` that owns preparation, gating, indexing, metadata persistence, and retry handling. `workflow.ts` should only call `indexingPipeline.run(renderedMemory)` and receive a result.`

- `FINDING-ID: ARCH-005`
- `Impact: MEDIUM`
- `Description: Import sprawl confirms the boundary problem. [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L10) has 43 import statements from 39 modules, spanning stdlib IO, extractors, renderers, semantic summarizers, validators, shared parsers, embedding primitives, retry providers, and index/persistence helpers. With cleaner boundaries, the orchestrator should not need direct imports like `EMBEDDING_DIM`, `MODEL_NAME`, `retryManager`, `indexMemory`, `updateMetadataEmbeddingStatus`, `validateMemoryTemplateContract`, `evaluateMemorySufficiency`, `evaluateSpecDocHealth`, `populateTemplate`, or `extractSpecFolderContext`.
- `Recommendation: Reduce `workflow.ts` to orchestration over narrow interfaces such as `InputPreparation`, `Renderer`, `QualityGate`, `Persistence`, and `IndexingCoordinator`.`

- `FINDING-ID: ARCH-006`
- `Impact: HIGH`
- `Description: Concrete decomposition plan: `workflow-orchestrator.ts` for `runWorkflow`/locking only; `workflow-input.ts` for data load, spec detection, alignment, context-dir setup; `workflow-sanitizer.ts` for contamination cleanup/audit; `workflow-enricher.ts` for spec/git enrichment; `workflow-renderer.ts` for semantic summary, tree thinning, title/slug generation, trigger extraction, template population, metadata draft creation; `workflow-quality-gate.ts` for HTML cleanup, sufficiency, template contract, health annotation, quality scoring, validation disposition; `workflow-persistence.ts` for atomic writes and per-folder description tracking; `workflow-indexing.ts` for policy, embedding preparation, index writes, metadata status, and retry queue. The current phase seams are already visible from the step markers in [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1408).
- `Recommendation: Use DTOs between phases, e.g. `PreparedWorkflowInput`, `RenderedMemoryArtifacts`, `QualityGateResult`, `PersistenceResult`, and `WorkflowIndexingStatus`, so later phases stop reaching back into raw `collectedData`.`

- `FINDING-ID: ARCH-007`
- `Impact: MEDIUM`
- `Description: There are performance smells caused by the current architecture. Content is scrubbed multiple times: pre-enrichment contamination pass (1572-1596), file description cleaning (1636-1659), then prompt/summary/observation cleaning again before extraction (1687-1711) in [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1526). Tree-thinning also performs synchronous filesystem reads per file in `resolveTreeThinningContent()` (633-657) and recursive sync directory walks in `listSpecFolderKeyFiles()` (659-695). On large spec folders, this makes rendering more IO-bound than it needs to be.
- `Recommendation: Normalize/sanitize once into an immutable cleaned session model, and move tree-thinning reads behind an async or cached spec-file reader.`

- `FINDING-ID: ARCH-008`
- `Impact: LOW`
- `Description: There are dead or effectively unreachable paths. In [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L151), most branches in `shouldIndexMemory()` are redundant at its only call site because earlier code already aborts on template-contract failure (2175-2182), sufficiency failure (2224-2227), low quality threshold (2230-2237), and `abort_write` disposition (2240-2252); duplicate writes are handled before the call as well. `buildMemoryTitle()` keeps a fallback the comment says “should not happen” because `contentSlug` is always provided (545-560). The returned `indexingStatus ?? fallback` near the end (2471-2475) also looks unreachable because every step-11 path persists a status before returning. In [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L149), `updateMetadataWithEmbedding()` appears unused in production code; repo hits are tests/docs plus its own export.
- `Recommendation: Delete or collapse dead branches now, especially `shouldIndexMemory()`, or mark them as compatibility shims with a single documented reason.`

No repo tests were run; this was a static audit only.
