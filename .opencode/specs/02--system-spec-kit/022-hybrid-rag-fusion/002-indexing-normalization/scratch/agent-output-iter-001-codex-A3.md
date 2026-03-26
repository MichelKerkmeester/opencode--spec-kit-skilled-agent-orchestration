OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d0aa0-3031-70b1-994a-b23ad24bbefd
--------
user
You are a cross-system alignment auditor checking consistency between three skill definitions and their implementations.

TASK: Check for misalignments between the indexing/normalization implementation and the skill standards.

Primary files (READ ALL):
1. .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts (1,157 lines)
2. .opencode/skill/system-spec-kit/scripts/types/session-types.ts (534 lines)
3. .opencode/skill/system-spec-kit/SKILL.md
4. .opencode/skill/sk-code--opencode/SKILL.md
5. .opencode/skill/sk-doc/SKILL.md

Specific questions to answer:
1. Do the type definitions in session-types.ts use naming conventions from sk-code--opencode? (camelCase vs PascalCase, interface naming)
2. Are the importance tier names (critical/important/normal/low) consistent across spec-kit SKILL.md and importance-tiers.ts?
3. Does the P0/P1/P2 priority system in the spec's checklist match the definitions in sk-code--opencode?
4. Are there naming conflicts between DataSource types and any sk-doc document types?
5. Does the input-normalizer handle all field aliases documented in the spec-kit SKILL.md?
6. Is the file header convention (MODULE comment block) consistent with sk-code--opencode standards?
7. Are export patterns (named vs default, barrel files) aligned with sk-code--opencode?

OUTPUT FORMAT: For each finding:
- FINDING-ID (e.g., ALIGN-001, NAMING-001)
- Severity: BREAKING / INCONSISTENT / COSMETIC
- Files involved
- Description with evidence from both sides
- Recommendation
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: cocoindex_code starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only alignment audit across the implementation and the three skill standards. First I’m loading the relevant skill guidance and source files, then I’ll compare each of your seven questions against the actual code and document any mismatches with evidence.
tool codex.list_mcp_resources({})
codex.list_mcp_resources({}) success in 6ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resources\":[]}"
    }
  ],
  "isError": false
}
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' -g '.opencode/**/SKILL.md' -g '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' -g '.opencode/skill/system-spec-kit/scripts/types/session-types.ts' -g '.opencode/skill/system-spec-kit/scripts/**/importance-tiers.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
AGENTS.md
.opencode/skill/sk-code--review/SKILL.md
.opencode/skill/cli-gemini/SKILL.md
.opencode/skill/cli-copilot/SKILL.md
.opencode/skill/mcp-coco-index/SKILL.md
.opencode/skill/sk-git/SKILL.md
.opencode/skill/mcp-chrome-devtools/SKILL.md
.opencode/skill/cli-claude-code/SKILL.md
.opencode/skill/mcp-figma/SKILL.md
.opencode/skill/mcp-clickup/SKILL.md
.opencode/specs/03--commands-and-skills/016-sk-code-review-creation/context/SKILL.md
.opencode/skill/sk-prompt-improver/SKILL.md
.opencode/skill/mcp-code-mode/SKILL.md
.opencode/skill/cli-codex/SKILL.md
.opencode/skill/sk-code--full-stack/SKILL.md
.opencode/skill/sk-doc/SKILL.md
.opencode/skill/sk-code--opencode/SKILL.md
.opencode/skill/sk-code--web/SKILL.md
.opencode/skill/system-spec-kit/SKILL.md
.opencode/skill/sk-deep-research/SKILL.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Cross-system alignment audit checking consistency between system-spec-kit, sk-code--opencode, sk-doc, and implementation files input-normalizer.ts/session-types.ts" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !audit(multi), !intent:memory, !session, !session(multi), !spec"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !opencode, !sk-code--opencode(explicit), check~, code(name)"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit`, `sk-code--opencode`, `sk-doc`, and `sk-code--review` all crossed the threshold, and the user explicitly directed review of those skill definitions. I’m reading the relevant sections from those skills plus the implementation files, then I’ll trace each question against the exact normalization and type definitions.
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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
name: sk-doc
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.3.0.0
---

<!-- Keywords: sk-doc, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows, (4) Install guide creation for setup documentation and (5) Feature catalog and manual testing playbook creation for inventory and validation packages.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations.


## 1. WHEN TO USE

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

🌐 Searching the web...
🌐 Searched the web
codex
I’ve got the skill routing and top-level standards loaded. Next I’m pulling the exact TypeScript style rules, priority definitions, and the implementation hotspots in `session-types.ts` and `input-normalizer.ts` so the findings map cleanly back to both sides.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Input Normalizer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INPUT NORMALIZER
// ───────────────────────────────────────────────────────────────
// Validates, normalizes, and transforms raw input data into structured session format
import { structuredLog } from './logger';
import {
  buildSpecAffinityTargets,
  evaluateSpecAffinityText,
  matchesSpecAffinityFilePath,
  matchesSpecAffinityText,
  normalizeText,
} from './spec-affinity';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/types/session-types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Session Types
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SESSION TYPES
// ───────────────────────────────────────────────────────────────
// Canonical type definitions shared between simulation-factory and extractors.
// Eliminates parallel type hierarchies (TECH-DEBT P6-05).

export type DescriptionProvenance = 'git' | 'spec-folder' | 'tool';

export type ModificationMagnitude = 'trivial' | 'small' | 'medium' | 'large' | 'unknown';

/** Captures a file change discovered in session data. */
export interface FileChange {
  FILE_PATH: string;
  DESCRIPTION: string;
  ACTION?: string;
  MODIFICATION_MAGNITUDE?: ModificationMagnitude;
exec
/bin/zsh -lc 'rg -n "importance-tiers|critical|important|normal|low" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts:53: * 2. GFM table          — header row followed by a separator row `| --- |`
.opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts:87:    // GFM table: header row followed immediately by a separator row
.opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts:197:      // Headings always start a new chunk so they pair with the content below
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:13:  normalizeMemoryNameCandidate,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:151:  const normalized = normalizeMemoryNameCandidate(title);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:152:  if (normalized.length < 10) {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:156:  return !isGenericContentTask(normalized) && !isContaminatedMemoryName(normalized);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:271:  // Repeated titles usually indicate low-information duplication.
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:278:      .map((observation) => normalizeMemoryNameCandidate(observation.TITLE || ''))
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:302:    if (severity === 'low') {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:337:    { id: 'contamination', score01: hadContamination ? (effectiveSeverity === 'low' ? 0.95 : effectiveSeverity === 'medium' ? 0.85 : 0.60) : 1, score100: hadContamination ? (effectiveSeverity === 'low' ? 95 : effectiveSeverity === 'medium' ? 85 : 60) : 100, maxScore100: 100, passed: !hadContamination },
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:1:import type { DataSource } from './input-normalizer';
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:10:  /** @planned Wire to mode selection in workflow.ts. Currently unused at runtime. */
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:8:// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:25:import { runWorkflow } from '../core/workflow';
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:178:function isUnderApprovedSpecsRoot(normalizedInput: string): boolean {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:179:  return validateFilePath(path.resolve(CONFIG.PROJECT_ROOT, normalizedInput), getSpecsDirectories()) !== null;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:186:  const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:188:  const trailingSegments = normalizedInput.split('/');
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:194:      const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
exec
/bin/zsh -lc 'rg -n "camelCase|PascalCase|interface|MODULE|header|default export|named export|barrel|P0|P1|P2|priority|critical|important|normal|low|document type|playbook|feature catalog|README|frontmatter" .opencode/skill/sk-code--opencode .opencode/skill/system-spec-kit .opencode/skill/sk-doc' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:3:description: Template for per-feature scenario files stored directly under manual_testing_playbook category directories.
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:8:Per-feature scenario files for split manual testing playbooks. Use this template for the one-file-per-feature contract described in the main playbook template.
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:14:Each feature file is the canonical home for full scenario execution detail. The root `MANUAL_TESTING_PLAYBOOK.md` stays readable by summarizing the feature and linking here, while the feature file carries the realistic user-testing context, orchestration process, 9-column test row, structured source references, and concise metadata. The file shape should intentionally mirror the Feature Catalog snippet pattern so operators can move between the catalog and the playbook without relearning the document structure.
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:20:- Root playbook summary plus per-feature file cross-link
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:29:**Validator note**: The current validator checks markdown structure on the root playbook. It does not recurse into category folders or verify cross-file links.
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:35:Copy this into `manual_testing_playbook/{CATEGORY_DIR}/{NNN}-{feature-name}.md`:
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:45:This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `{FEATURE_ID}`.
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:89:Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:99:| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:115:- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
.opencode/skill/sk-doc/README.md:2:title: "Workflows Documentation"
.opencode/skill/sk-doc/README.md:3:description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows, ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks"
.opencode/skill/sk-doc/README.md:6:  - "opencode component creation workflow"
.opencode/skill/sk-doc/README.md:10:# Workflows Documentation
.opencode/skill/sk-doc/README.md:12:> Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows, ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks.
.opencode/skill/sk-doc/README.md:34:This skill is the central documentation engine for OpenCode projects. It operates in five modes: **Document Quality** (structure enforcement, DQI scoring, content optimization), **Component Creation** (skills, agents, commands with templates and validation), **Flowchart Creation** (ASCII diagrams for workflows and decision trees), **Install Guide Creation** (phase-based setup documentation) and **Catalog/Playbook Creation** (feature catalogs and manual testing playbooks for inventory and validation packages).
.opencode/skill/sk-doc/README.md:36:The architecture follows a script-assisted AI analysis model: Python scripts handle deterministic parsing and metrics extraction, while the AI handles quality judgment and recommendations. The core principle is **structure first, then content, then quality**.
.opencode/skill/sk-doc/README.md:38:All documentation output must follow **Human Voice Rules (HVR)**: no em dashes, no semicolons, no Oxford commas, no banned words (leverage, robust, seamless, etc.) and active voice throughout. See `hvr_rules.md` for the full HVR ruleset.
.opencode/skill/sk-doc/README.md:40:Use this skill when creating or improving markdown documentation, scaffolding new OpenCode components (skills, agents, commands), visualizing workflows as ASCII flowcharts or writing installation guides. If the request is for styled HTML visuals, interactive diagrams, or dashboard-style data pages, use a dedicated HTML workflow instead. Do not use this skill for non-markdown files or auto-generated API docs. Simple typo fixes also fall outside its scope.
.opencode/skill/sk-doc/README.md:67:# Validate a README
tool cocoindex_code.search({"query":"TypeScript naming conventions, export style, module header comments, priority P0 P1 P2, importance tiers in .opencode skills and system-spec-kit scripts","paths":[".opencode/skill/**"],"languages":"typescript,markdown","limit":10,"refresh_index":false})
cocoindex_code.search({"query":"TypeScript naming conventions, export style, module header comments, priority P0 P1 P2, importance tiers in .opencode skills and system-spec-kit scripts","paths":[".opencode/skill/**"],"languages":"typescript,markdown","limit":10,"refresh_index":false}) failed in 7ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript,markdown', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
Plan update
Running a read-only consistency audit across the implementation and three skill standards, with each user question mapped to evidence in code and docs.
  → Load the complete primary files and relevant supporting references like importance tier definitions and TS style guidance
  • Compare the implementation against each of the seven requested alignment checks and capture evidence
  • Return findings in the requested findings-first format with severity, file list, evidence, and recommendations
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-code--opencode/references/typescript/style_guide.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: TypeScript Style Guide
description: Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.
---

# TypeScript Style Guide

Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines consistent styling rules for TypeScript files to ensure readability, maintainability, and alignment across all OpenCode TypeScript code.

### When to Use

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/types/session-types.ts .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/sk-code--opencode/SKILL.md .opencode/skill/sk-doc/SKILL.md .opencode/skill/system-spec-kit/scripts/utils/importance-tiers.ts .opencode/skill/sk-code--opencode/references/typescript/style_guide.md .opencode/skill/sk-code--opencode/references/shared/universal_patterns.md .opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: YAML Frontmatter Templates
description: Templates and validation rules for YAML frontmatter across all document types in the OpenCode ecosystem.
---

# YAML Frontmatter Templates - Document Type Reference

Templates and validation rules for YAML frontmatter by document type.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Is YAML Frontmatter?

**YAML frontmatter** is a metadata block at the beginning of markdown files, delimited by `---` markers. It provides machine-readable configuration that controls how AI agents and tools process the document.

```yaml
---
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/references/shared/universal_patterns.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
wc: .opencode/skill/system-spec-kit/scripts/utils/importance-tiers.ts: open: No such file or directory
    1217 .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
     534 .opencode/skill/system-spec-kit/scripts/types/session-types.ts
     845 .opencode/skill/system-spec-kit/SKILL.md
     703 .opencode/skill/sk-code--opencode/SKILL.md
     856 .opencode/skill/sk-doc/SKILL.md
     705 .opencode/skill/sk-code--opencode/references/typescript/style_guide.md
     571 .opencode/skill/sk-code--opencode/references/shared/universal_patterns.md
     796 .opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md
    6227 total
 succeeded in 0ms:
---
title: Universal Patterns - Cross-Language Code Standards
description: Patterns applicable to ALL languages in OpenCode system code including naming principles, commenting philosophy, and reference comment patterns.
---

# Universal Patterns - Cross-Language Code Standards

Patterns applicable to ALL languages in OpenCode system code.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This reference defines patterns that apply universally across JavaScript, TypeScript, Python, Shell, and JSON/JSONC in the OpenCode codebase. These principles ensure consistency regardless of language choice.

### Core Principle

exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts | rg 'importance-tiers\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc 'rg -n "default export|named export|barrel|index.ts|export patterns|export style|export all|re-export" .opencode/skill/sk-code--opencode/SKILL.md .opencode/skill/sk-code--opencode/references/typescript/style_guide.md .opencode/skill/sk-code--opencode/references/shared/universal_patterns.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:191:**Legacy Exception**: `IEmbeddingProvider` and `IVectorStore` retain their `I` prefix for backward compatibility with re-export aliases across the codebase. All NEW interfaces omit the prefix. This exception is documented in the migration plan (Decision D5).
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:304:vector-index.ts
exec
/bin/zsh -lc 'rg -n "Document Type|README|SKILL.md|Command|Knowledge|Spec|manual testing playbook|feature catalog|catalog|playbook|document types" .opencode/skill/sk-doc/SKILL.md .opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md .opencode/skill/sk-doc/references/specific/*.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:3:description: Templates and validation rules for YAML frontmatter across all document types in the OpenCode ecosystem.
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:6:# YAML Frontmatter Templates - Document Type Reference
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:32:- **Argument parsing** - Specify expected inputs for commands
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:39:### Document Types and Frontmatter Requirements
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:41:| Document Type | Frontmatter Required? | Reason |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:43:| **SKILL.md** | ✅ **Required** | AI needs metadata to discover and invoke skills |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:44:| **Command** | ✅ **Required** | Arguments and tools must be declared |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:45:| **Knowledge** | ❌ **Forbidden** | Pure content, no programmatic interface |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:46:| **Spec** | ❌ **Not recommended** | Use inline metadata for flexibility |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:47:| **README** | ⚪ **Optional** | Usually none, unless documenting a skill |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:65:         │   └─► Not found? → No frontmatter (may be error for SKILL/Command)
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:99:- Document is a SKILL.md that AI agents invoke
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:109:**By Document Type**:
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:111:| Document Type | Add Frontmatter? | Required Fields | Optional Fields |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:113:| **SKILL.md** | ✅ Always | `name`, `description`, `allowed-tools` | `tags`, `category`, `version` |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:114:| **Command** | ✅ Always | `description`, `argument-hint`, `allowed-tools` | `name`, `model`, `version` |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:115:| **Knowledge** | ❌ Never | — | — |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:116:| **Spec** | ❌ Avoid | — | Use inline metadata instead |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:117:| **README** | ⚪ Rarely | Only if in `.opencode/skill/*/` | — |
.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:122:- Knowledge files (reference documentation)
exec
/bin/zsh -lc 'rg -n "P0|P1|P2|priority" .opencode/skill/sk-code--opencode .opencode/skill/system-spec-kit' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:472:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research.md, handover.md). These are indexed with higher priority than regular memories. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:318:    // P1-11 FIX: Module-level guard avoids redundant calls on every tool invocation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:369:                // P1-06 FIX: Recalculate token count from the full envelope
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:427:    // P1 follow-up: derive those known locations from all allowed memory roots so startup recovery matches ingest roots.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:468:    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:588:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:590:// P1-11 FIX: Module-level guard to avoid redundant initializeDb() calls per tool invocation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:638:    // P1-09 FIX: Close MCP transport on shutdown
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:823:          // P1-08 FIX: Mark embedding ready even on timeout so the system is usable
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:993:    // P0-3: Async ingestion job queue initialization + crash recovery reset.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1008:    // P1-7: Optional real-time markdown watcher for automatic re-indexing.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1052:  // P1-09: Assign to module-level transport (not const) so shutdown handlers can close it
.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md:23:| P0 | HARD BLOCKER | Must fix before commit |
.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md:24:| P1 | Required | Must fix or get explicit approval |
.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md:25:| P2 | Recommended | Can defer with justification |
.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md:31:## 2. P0 - HARD BLOCKERS
.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md:122:## 3. P1 - REQUIRED
.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md:222:## 4. P2 - RECOMMENDED
.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md:23:| P0 | HARD BLOCKER | Must fix before commit |
.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md:24:| P1 | Required | Must fix or get explicit approval |
exec
/bin/zsh -lc 'rg -n "importance_tier|importance tier|critical|important|normal|low|constitutional|temporary|deprecated" .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/references .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/SKILL.md:3:description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
.opencode/skill/system-spec-kit/SKILL.md:4:allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
.opencode/skill/system-spec-kit/SKILL.md:8:<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->
.opencode/skill/system-spec-kit/SKILL.md:12:Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.
.opencode/skill/system-spec-kit/SKILL.md:66:  - `scratch/` → temporary workspace, any agent
.opencode/skill/system-spec-kit/SKILL.md:71:Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`
.opencode/skill/system-spec-kit/SKILL.md:92:- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
.opencode/skill/system-spec-kit/SKILL.md:96:- `references/workflows/` for command workflows and worked examples.
.opencode/skill/system-spec-kit/SKILL.md:106:- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
.opencode/skill/system-spec-kit/SKILL.md:133:DEFAULT_RESOURCE = "references/workflows/quick_reference.md"
.opencode/skill/system-spec-kit/SKILL.md:138:    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
.opencode/skill/system-spec-kit/SKILL.md:146:    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
.opencode/skill/system-spec-kit/SKILL.md:157:        "references/workflows/quick_reference.md",
.opencode/skill/system-spec-kit/SKILL.md:158:        "references/workflows/worked_examples.md",
.opencode/skill/system-spec-kit/SKILL.md:167:        "references/workflows/quick_reference.md",
.opencode/skill/system-spec-kit/SKILL.md:175:        "references/memory/save_workflow.md",
.opencode/skill/system-spec-kit/SKILL.md:179:        "references/workflows/quick_reference.md",
.opencode/skill/system-spec-kit/SKILL.md:238:    return " ".join(parts).lower()
.opencode/skill/system-spec-kit/SKILL.md:241:    """Allow markdown loads only within this skill folder."""
.opencode/skill/system-spec-kit/SKILL.md:244:    if resolved.suffix.lower() != ".md":
tool cocoindex_code.search({"query":"input normalizer aliases for specFolder sessionSummary keyDecisions nextSteps technicalContext trigger phrases importance tier files user prompts recent context and capture source types","paths":[".opencode/skill/system-spec-kit/scripts/**/*.ts"],"languages":["typescript"],"limit":8,"refresh_index":false})
cocoindex_code.search({"query":"input normalizer aliases for specFolder sessionSummary keyDecisions nextSteps technicalContext trigger phrases importance tier files user prompts recent context and capture source types","paths":[".opencode/skill/system-spec-kit/scripts/**/*.ts"],"languages":["typescript"],"limit":8,"refresh_index":false}) success in 442ms:
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
I’ve isolated the standards references for TypeScript naming, file headers, checklist priorities, and sk-doc document categories. I’m now reading the full implementation files in chunks and checking whether the documented aliases and naming systems actually match what the normalizer and session types accept.
exec
/bin/zsh -lc "sed -n '441,534p' .opencode/skill/system-spec-kit/scripts/types/session-types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '221,440p' .opencode/skill/system-spec-kit/scripts/types/session-types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  FEATURE_NAME: string;
  DESCRIPTION: string;
}

/** Associates an important file with its role in the implementation. */
export interface KeyFileWithRole {
  FILE_PATH: string;
  ROLE: string;
}

/** Describes how the implementation can be extended safely. */
export interface ExtensionGuide {
  GUIDE_TEXT: string;
}

/** Summarizes a reusable code pattern identified in the implementation. */
export interface CodePattern {
  PATTERN_NAME: string;
  USAGE: string;
}
 succeeded in 0ms:
/** Session data structure — canonical type */
export interface SessionData {
  TITLE: string;
  DATE: string;
  TIME: string;
  SPEC_FOLDER: string;
  DURATION: string;
  SUMMARY: string;
  FILES: FileChange[];
  HAS_FILES: boolean;
  FILE_COUNT: number;
  CAPTURED_FILE_COUNT: number;
  FILESYSTEM_FILE_COUNT: number;
  GIT_CHANGED_FILE_COUNT: number;
  OUTCOMES: OutcomeEntry[];
  TOOL_COUNT: number;
  MESSAGE_COUNT: number;
  QUICK_SUMMARY: string;
  SKILL_VERSION: string;
  OBSERVATIONS: ObservationDetailed[];
exec
/bin/zsh -lc "sed -n '781,1040p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  if (!specFolderHint) return [];

  const keywords = new Set<string>();
  const segments = specFolderHint
    .split('/')
    .map((segment) => segment.replace(/^\d+--?/, '').trim())
    .filter(Boolean);

  for (const segment of segments) {
    const normalizedSegment = normalizeText(segment);
    // Multi-word phrases are specific enough to keep (e.g., "session capturing")
    if (normalizedSegment.length > 2 && normalizedSegment.includes(' ')) {
      keywords.add(normalizedSegment);
    }

    for (const token of normalizedSegment.split(' ')) {
      // P1-07: Skip generic single tokens that cause false-positive relevance matches
      if (token.length > 2 && !RELEVANCE_PATH_STOPWORDS.has(token)) {
        keywords.add(token);
      }
 succeeded in 0ms:
 */
function buildSessionSummaryObservation(summary: string, triggerPhrases: string[] = []): Observation {
  const summaryTitle: string = summary.length > 100
    ? summary.substring(0, 100).replace(/\s+\S*$/, '') + '...'
    : summary;

  return {
    type: 'feature',
    title: summaryTitle,
    narrative: summary,
    facts: triggerPhrases
  };
}

/**
 * Builds an implementation observation from a technical context key-value map.
 * @param techContext - A record of technical details (e.g., stack, config, dependencies).
 * @returns An Observation of type 'implementation' with a semicolon-delimited narrative of the context entries.
 */
function buildTechnicalContextObservation(techContext: Record<string, unknown>): Observation {
exec
/bin/zsh -lc "sed -n '521,780p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  if (nextSteps.length > 0) {
    observations.push(buildNextStepsObservation(nextSteps));
  }

  normalized.observations = observations;

  normalized.userPrompts = [{
    prompt: sessionSummary || 'Manual context save',
    timestamp: new Date().toISOString()
  }];

  normalized.recentContext = [{
    request: sessionSummary || 'Manual context save',
    learning: sessionSummary || ''
  }];

  if (triggerPhrases.length > 0) {
    normalized._manualTriggerPhrases = [...triggerPhrases];
  }

exec
/bin/zsh -lc "sed -n '1041,1217p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    '"rate_limit_error"',
    'internal server error',
  ];

  for (const ex of exchanges) {
    if (ex.assistantResponse) {
      const lowerResponse: string = ex.assistantResponse.toLowerCase();
      const isPlaceholder: boolean = placeholderPatterns.some((p: string) => lowerResponse.includes(p.toLowerCase()));

      if (!isPlaceholder && ex.assistantResponse.length > 20) {
        // When spec folder hint is provided, skip exchanges whose content
        // Doesn't mention any relevant keyword
        if (specFolderHint && relevanceKeywords.length > 0) {
          const responseRelevant = containsRelevantKeyword(relevanceKeywords, ex.assistantResponse)
            || matchesSpecAffinityText(ex.assistantResponse, specAffinityTargets);
          const inputRelevant = ex.userInput
            ? (
              containsRelevantKeyword(relevanceKeywords, ex.userInput)
              || matchesSpecAffinityText(ex.userInput, specAffinityTargets)
            )
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit | rg 'importance-tiers\\.(ts|md|js|d\\.ts)"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
exec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]

    command = str(getattr(task, "command", "")).lower()
    for prefix, intent in COMMAND_BOOSTS.items():
        if command.startswith(prefix):
            scores[intent] += 6

    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    """Return primary intent and secondary intent when scores are close."""
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["IMPLEMENT"]

    selected = [ranked[0][0]]
    if len(ranked) > 1:
exec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '521,845p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        ├─ Fall back to keyword matching
        └─ Prompt user if ambiguous
        ↓
STEP 2: Load Shared Patterns (ALWAYS)
        ├─ universal_patterns.md → Naming, commenting principles
        └─ code_organization.md → File structure, sections
        ↓
STEP 3: Load Language References (CONDITIONAL)
        ├─ {language}/style_guide.md → Headers, formatting
        ├─ {language}/quality_standards.md → Errors, logging
        └─ {language}/quick_reference.md → Cheat sheet
        ↓
STEP 4: Apply Standards
        ├─ Follow patterns from loaded references
        ├─ Use checklist for validation (ON_DEMAND)
        └─ Cite evidence with file:line references
```

### Key Pattern Categories

 succeeded in 0ms:
```

Memory files are always saved to the child folder's `memory/` directory (e.g., `specs/02--system-spec-kit/121-script-audit/memory/`). If a bare child name matches multiple parents, the script reports an error and requires the full `parent/child` path.

**Memory File Structure:**
```markdown
## Project Context
[Auto-generated summary of conversation and decisions]

## Project State Snapshot
- Phase: Implementation
- Last Action: Completed auth middleware
- Next Action: Add unit tests for login flow
- Blockers: None

## Key Artifacts
- Modified: src/middleware/auth.ts
- Created: src/utils/jwt.ts
```

exec
/bin/zsh -lc "sed -n '521,856p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '521,703p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Importance Tiers
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
export interface TierConfig {
  value: number;
  searchBoost: number;
  decay: boolean;
  autoExpireDays: number | null;
  excludeFromSearch?: boolean;
  alwaysSurface?: boolean;
  maxTokens?: number;
  description: string;
}

export type ImportanceTier =
 succeeded in 0ms:
#### Commands

##### ✅ ALWAYS

1. **ALWAYS load command_template.md first** (template-first workflow)
2. **ALWAYS define clear triggers** (what invokes the command)
3. **ALWAYS include usage examples** (copy-paste ready)
4. **ALWAYS validate command name** (lowercase, colon-separated)

##### ❌ NEVER

1. **NEVER create commands without frontmatter** (required for discovery)
2. **NEVER use ambiguous triggers** (must be unique)
3. **NEVER skip testing** (commands must work on first invocation)

##### ⚠️ ESCALATE IF

1. Command conflicts with existing command
2. Trigger phrase is ambiguous
3. Command requires special permissions
 succeeded in 0ms:
    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing-references -->
 succeeded in 0ms:
| Shell      | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Config     | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |

### Checklists

- `assets/checklists/universal_checklist.md` - Cross-language P0 items
- `assets/checklists/javascript_checklist.md` - JS-specific validation
- `assets/checklists/typescript_checklist.md` - TS-specific validation
- `assets/checklists/python_checklist.md` - Python-specific validation
- `assets/checklists/shell_checklist.md` - Shell-specific validation
- `assets/checklists/config_checklist.md` - JSON/JSONC validation
- `references/shared/alignment_verification_automation.md` - verifier contract and automation workflow

### Related Skills

| Skill                       | Use For                                    |
| --------------------------- | ------------------------------------------ |
| **sk-code--review**       | Findings-first review baseline, severity model, risk reporting |
| **sk-code--web**          | Web/frontend development, browser testing  |
| **sk-doc** | Markdown documentation, skill creation     |
exec
/bin/zsh -lc "sed -n '221,320p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    implementation_summary: 'normal',
    research: 'normal',
    handover: 'normal',
    memory: 'normal',
  };

  const normalizedDocumentType = normalizeDocumentType(documentType);
  return DOC_TYPE_TIERS[normalizedDocumentType] || 'normal';
}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/types/session-types.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Session Types
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. SESSION TYPES
     7	// ───────────────────────────────────────────────────────────────
     8	// Canonical type definitions shared between simulation-factory and extractors.
     9	// Eliminates parallel type hierarchies (TECH-DEBT P6-05).
    10	
    11	export type DescriptionProvenance = 'git' | 'spec-folder' | 'tool';
    12	
    13	export type ModificationMagnitude = 'trivial' | 'small' | 'medium' | 'large' | 'unknown';
    14	
    15	/** Captures a file change discovered in session data. */
    16	export interface FileChange {
    17	  FILE_PATH: string;
    18	  DESCRIPTION: string;
    19	  ACTION?: string;
    20	  MODIFICATION_MAGNITUDE?: ModificationMagnitude;
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-code--opencode/references/typescript/style_guide.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	---
     2	title: TypeScript Style Guide
     3	description: Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.
     4	---
     5	
     6	# TypeScript Style Guide
     7	
     8	Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.
     9	
    10	---
    11	
    12	<!-- ANCHOR:overview -->
    13	## 1. OVERVIEW
    14	
    15	### Purpose
    16	
    17	Defines consistent styling rules for TypeScript files to ensure readability, maintainability, and alignment across all OpenCode TypeScript code.
    18	
    19	### When to Use
    20	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Importance Tiers
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. TYPES
     7	
     8	// ───────────────────────────────────────────────────────────────
     9	export interface TierConfig {
    10	  value: number;
    11	  searchBoost: number;
    12	  decay: boolean;
    13	  autoExpireDays: number | null;
    14	  excludeFromSearch?: boolean;
    15	  alwaysSurface?: boolean;
    16	  maxTokens?: number;
    17	  description: string;
    18	}
    19	
    20	export type ImportanceTier =
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/SKILL.md | sed -n '380,700p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   380	
   381	```
   382	Level 1 (Core):         Essential what/why/how (~455 LOC)
   383	         ↓ +Verify
   384	Level 2 (Verification): +Quality gates, NFRs, edge cases (~875 LOC)
   385	         ↓ +Arch
   386	Level 3 (Full):         +Architecture decisions, ADRs, risk matrix (~1090 LOC)
   387	         ↓ +Govern
   388	Level 3+ (Extended):    +Enterprise governance, AI protocols (~1075 LOC)
   389	```
   390	
   391	| Level  | LOC Guidance | Required Files                                        | What It ADDS                                |
   392	| ------ | ------------ | ----------------------------------------------------- | ------------------------------------------- |
   393	| **1**  | <100         | spec.md, plan.md, tasks.md, implementation-summary.md | Essential what/why/how                      |
   394	| **2**  | 100-499      | Level 1 + checklist.md                                | Quality gates, verification, NFRs           |
   395	| **3**  | ≥500         | Level 2 + decision-record.md                          | Architecture decisions, ADRs                |
   396	| **3+** | Complex      | Level 3 + extended content                            | Governance, approval workflow, AI protocols |
   397	
   398	**Level Selection Examples:**
   399	
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/SKILL.md | sed -n '295,330p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   295	#    - Evaluation questions
   296	
   297	# 3. AI reviews and provides recommendations
   298	```
   299	
   300	**Document Type Detection** (auto-applies enforcement):
   301	
   302	| Type      | Enforcement | Frontmatter | Notes                            |
   303	| --------- | ----------- | ----------- | -------------------------------- |
   304	| README    | Flexible    | None        | Focus on quick-start usability   |
   305	| SKILL     | Strict      | Required    | No structural checklist failures |
   306	| Knowledge | Moderate    | Forbidden   | Consistent, scannable reference  |
   307	| Command   | Strict      | Required    | Must be executable               |
   308	| Spec      | Loose       | Optional    | Working docs. Avoid blocking.    |
   309	| Generic   | Flexible    | Optional    | Best-effort structure            |
   310	
   311	### Mode 2: OpenCode Component Creation
   312	
   313	#### Skill Creation
   314	
codex
I’ve now read the full primary implementation files and the remaining skill docs. I’m doing one more pass for precise line references around aliases, exports, and checklist semantics so the final findings are concrete rather than hand-wavy.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '261,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   261	 */
   262	function buildSessionSummaryObservation(summary: string, triggerPhrases: string[] = []): Observation {
   263	  const summaryTitle: string = summary.length > 100
   264	    ? summary.substring(0, 100).replace(/\s+\S*$/, '') + '...'
   265	    : summary;
   266	
   267	  return {
   268	    type: 'feature',
   269	    title: summaryTitle,
   270	    narrative: summary,
   271	    facts: triggerPhrases
   272	  };
   273	}
   274	
   275	/**
   276	 * Builds an implementation observation from a technical context key-value map.
   277	 * @param techContext - A record of technical details (e.g., stack, config, dependencies).
   278	 * @returns An Observation of type 'implementation' with a semicolon-delimited narrative of the context entries.
   279	 */
   280	function buildTechnicalContextObservation(techContext: Record<string, unknown>): Observation {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '1041,1217p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1041	    '"rate_limit_error"',
  1042	    'internal server error',
  1043	  ];
  1044	
  1045	  for (const ex of exchanges) {
  1046	    if (ex.assistantResponse) {
  1047	      const lowerResponse: string = ex.assistantResponse.toLowerCase();
  1048	      const isPlaceholder: boolean = placeholderPatterns.some((p: string) => lowerResponse.includes(p.toLowerCase()));
  1049	
  1050	      if (!isPlaceholder && ex.assistantResponse.length > 20) {
  1051	        // When spec folder hint is provided, skip exchanges whose content
  1052	        // Doesn't mention any relevant keyword
  1053	        if (specFolderHint && relevanceKeywords.length > 0) {
  1054	          const responseRelevant = containsRelevantKeyword(relevanceKeywords, ex.assistantResponse)
  1055	            || matchesSpecAffinityText(ex.assistantResponse, specAffinityTargets);
  1056	          const inputRelevant = ex.userInput
  1057	            ? (
  1058	              containsRelevantKeyword(relevanceKeywords, ex.userInput)
  1059	              || matchesSpecAffinityText(ex.userInput, specAffinityTargets)
  1060	            )
exec
/bin/zsh -lc "rg -n \"export default|default export|named export|barrel|index.ts|re-export|export \\{.*\\}|export \\*\" .opencode/skill/sk-code--opencode/references/typescript/style_guide.md .opencode/skill/sk-code--opencode/references/shared/*.md .opencode/skill/sk-code--opencode/assets/checklists/*.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md:135:export { function_name };
.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md:136:export default function_name;
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:191:**Legacy Exception**: `IEmbeddingProvider` and `IVectorStore` retain their `I` prefix for backward compatibility with re-export aliases across the codebase. All NEW interfaces omit the prefix. This exception is documented in the migration plan (Decision D5).
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:304:vector-index.ts
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:537:export * from './module';
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:540:export { MemoryError, ErrorCode } from './errors/core';
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:643:  export default config;
.opencode/skill/sk-code--opencode/references/typescript/style_guide.md:673:export { memorySearch, loadConfig };
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:165:├── index.ts                # Entry point, exports public API
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:182:### Barrel Files (index.ts)
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:184:Use barrel files to expose public API:
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:187:// lib/errors/index.ts - Barrel file
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:188:export { MemoryError, ErrorCodes, buildErrorResponse } from './core';
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:189:export { getRecoveryHint, ERROR_CODES } from './recovery-hints';
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:341:// Barrel file (index.ts) — re-exports from submodules
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:342:export { MemoryError, ErrorCode } from './errors/core';
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:343:export { VectorIndex } from './search/vector-index';
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:346:// Default export (use sparingly — named exports preferred)
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:347:export default class ContextServer { }
.opencode/skill/sk-code--opencode/references/shared/code_organization.md:350:export * from './module';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | sed -n '621,1040p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   621	  }
   622	  if (data.git !== undefined && (typeof data.git !== 'object' || data.git === null || Array.isArray(data.git))) {
   623	    errors.push('git must be an object');
   624	  }
   625	
   626	  // Phase 1B: Validate closed-domain session/git leaf fields
   627	  if (typeof data.session === 'object' && data.session !== null && !Array.isArray(data.session)) {
   628	    const s = data.session as Record<string, unknown>;
   629	    const validStatuses = ['IN_PROGRESS', 'COMPLETED', 'BLOCKED'];
   630	    if (s.status !== undefined && (typeof s.status !== 'string' || !validStatuses.includes(s.status))) {
   631	      errors.push(`session.status must be one of: ${validStatuses.join(', ')}`);
   632	    }
   633	    if (s.completionPercent !== undefined) {
   634	      if (typeof s.completionPercent !== 'number' || !Number.isFinite(s.completionPercent)
   635	          || s.completionPercent < 0 || s.completionPercent > 100
   636	          || !Number.isInteger(s.completionPercent)) {
   637	        errors.push('session.completionPercent must be an integer 0-100');
   638	      }
   639	    }
   640	    if (s.messageCount !== undefined && (typeof s.messageCount !== 'number'
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-code--opencode/SKILL.md | sed -n '320,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   320	The recurring verifier at `scripts/verify_alignment_drift.py` applies severity-aware reporting:
   321	
   322	- Output format includes rule id and severity: `[{RULE_ID}] [{ERROR|WARN}]`.
   323	- Default failure criteria: `ERROR` findings only.
   324	- Optional strict mode: `--fail-on-warn` makes warnings build-breaking.
   325	- Style rules (`JS-*`, `TS-*`, `PY-*`, `SH-*`) are warning-first by default.
   326	- Parse/integrity rules (`COMMON-*`, `JSON-*`, `JSONC-*`) are error-class by default.
   327	- Header style invariants and comment policy checks are manual checklist gates; the verifier checks marker-level headers only.
   328	- Context-aware advisory downgrade is applied in archival/contextual paths (`z_archive`, `scratch`, `memory`, `research`, `context`, `assets`, `examples`, `fixtures`, and test-heavy paths).
   329	- TypeScript module-header enforcement is skipped for test files (`*.test.ts`, `*.spec.ts`, `*.vitest.ts` + TSX variants) and pattern assets.
   330	- JavaScript strict-mode enforcement is skipped for `.mjs`.
   331	- `tsconfig*.json` supports comment-aware parsing fallback.
   332	
   333	---
   334	
   335	<!-- /ANCHOR:how-it-works -->
   336	<!-- ANCHOR:rules -->
   337	## 4. RULES
   338	
   339	### ✅ ALWAYS
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md | sed -n '39,170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    39	### Document Types and Frontmatter Requirements
    40	
    41	| Document Type | Frontmatter Required? | Reason |
    42	|---------------|----------------------|--------|
    43	| **SKILL.md** | ✅ **Required** | AI needs metadata to discover and invoke skills |
    44	| **Command** | ✅ **Required** | Arguments and tools must be declared |
    45	| **Knowledge** | ❌ **Forbidden** | Pure content, no programmatic interface |
    46	| **Spec** | ❌ **Not recommended** | Use inline metadata for flexibility |
    47	| **README** | ⚪ **Optional** | Usually none, unless documenting a skill |
    48	
    49	### Core Characteristics
    50	
    51	| Characteristic | Description |
    52	|----------------|-------------|
    53	| **Delimiter syntax** | Must start and end with `---` on separate lines |
    54	| **Position** | Must be at the very beginning of the file (line 1) |
    55	| **YAML format** | Key-value pairs, no nested objects for required fields |
    56	| **Single-line values** | Description must be on one line (parser limitation) |
    57	| **Case-sensitive** | Field names are lowercase (`name`, not `Name`) |
    58	
tool cocoindex_code.search({"query":"where input normalizer validates raw input aliases like specFolder spec_folder SPEC_FOLDER filesModified files_modified sessionSummary session_summary keyDecisions key_decisions nextSteps next_steps technicalContext triggerPhrases trigger_phrases importanceTier importance_tier userPrompts user_prompts recentContext recent_context and open code capture snake_case session_title session_id captured_at","paths":[".opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts"],"languages":["typescript"],"limit":5,"refresh_index":false})
cocoindex_code.search({"query":"where input normalizer validates raw input aliases like specFolder spec_folder SPEC_FOLDER filesModified files_modified sessionSummary session_summary keyDecisions key_decisions nextSteps next_steps technicalContext triggerPhrases trigger_phrases importanceTier importance_tier userPrompts user_prompts recentContext recent_context and open code capture snake_case session_title session_id captured_at","paths":[".opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts"],"languages":["typescript"],"limit":5,"refresh_index":false}) success in 449ms:
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
/bin/zsh -lc 'rg -n "specFolder|spec_folder|SPEC_FOLDER|sessionSummary|session_summary|keyDecisions|key_decisions|nextSteps|next_steps|technicalContext|triggerPhrases|trigger_phrases|importanceTier|importance_tier|userPrompts|user_prompts|recentContext|recent_context|session_title|session_id|captured_at|filePath|file_path" .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/references' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/SKILL.md:577:- **REQUIRED:** `query` (string) OR `concepts` (2-5 strings). `specFolder` alone causes E040 error.
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:220:specFolder: [###-folder-name]
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:225:importanceTier: [normal / important / critical]
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:120:4. **Score**: `(matches / spec_folder_words) * 100`
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:125:function calculateAlignmentScore(conversationTopics: string[], specFolderName: string): number {
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:127:  const specTopics = specFolderName.replace(/^\d+-/, '').split(/[-_]/);
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:146:- **User request**: First conversation request in `recent_context`
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:66:memory_search({ query: "auth", specFolder: "122" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:72:memory_search({ query: "auth", specFolder: "122-skill-standardization" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:125:| **Wrong memory loaded** | Context from different session | Check `specFolder` parameter matches intent |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:318:  // Note: omit specFolder to search all folders
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:327:1. Check if memory exists: `memory_list({ specFolder: "###-name" })`
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:329:3. Use `Read(filePath)` for direct access to known content
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:333:Root Cause: Incorrect specFolder parameter
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:338:memory_list({ specFolder: "###-correct-folder", limit: 3 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:341:const results = await memory_search({ specFolder: "###-correct-folder", limit: 3 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:342:Read(results[0].filePath)  // Read specific memory file
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:367:memory_update({ id: 123, importanceTier: "constitutional" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:413:| **Memory Not Found** | Search returns no results | Check `memory_search({ specFolder: "..." })` |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:429:  specFolder: "###-feature-name",
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-code--opencode/references/typescript/style_guide.md | sed -n '520,690p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/sk-code--opencode/references/shared/code_organization.md | sed -n '180,370p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   180	```
   181	
   182	### Barrel Files (index.ts)
   183	
   184	Use barrel files to expose public API:
   185	
   186	```typescript
   187	// lib/errors/index.ts - Barrel file
   188	export { MemoryError, ErrorCodes, buildErrorResponse } from './core';
   189	export { getRecoveryHint, ERROR_CODES } from './recovery-hints';
   190	export type { ErrorResponse, ErrorResponseData } from './core';
   191	```
   192	
   193	Benefits:
   194	- Single import point: `import { MemoryError } from './lib/errors';`
   195	- Clear public API surface
   196	- Implementation details hidden
   197	
   198	---
   199	
 succeeded in 0ms:
   520	```typescript
   521	// CORRECT — type-only import (erased at compile time)
   522	import type { EmbeddingProfile } from '../shared/types';
   523	
   524	// CORRECT — mixed: value import (needed at runtime)
   525	import { MemoryError } from './errors/core';
   526	
   527	// INCORRECT — importing a type without `import type`
   528	import { SearchResult } from '../types';  // Only used as a type
   529	```
   530	
   531	**Rule**: If an import is ONLY used in type annotations, parameter types, return types, or generic constraints, use `import type`.
   532	
   533	### Re-export Syntax
   534	
   535	```typescript
   536	// Re-export everything
   537	export * from './module';
   538	
   539	// Re-export specific items
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts | sed -n '240,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   240	  opencode: 'opencode-capture',
   241	  'opencode-capture': 'opencode-capture',
   242	  claude: 'claude-code-capture',
   243	  'claude-code': 'claude-code-capture',
   244	  'claude-code-capture': 'claude-code-capture',
   245	  codex: 'codex-cli-capture',
   246	  'codex-cli': 'codex-cli-capture',
   247	  'codex-cli-capture': 'codex-cli-capture',
   248	  copilot: 'copilot-cli-capture',
   249	  'copilot-cli': 'copilot-cli-capture',
   250	  'copilot-cli-capture': 'copilot-cli-capture',
   251	  gemini: 'gemini-cli-capture',
   252	  'gemini-cli': 'gemini-cli-capture',
   253	  'gemini-cli-capture': 'gemini-cli-capture',
   254	};
   255	
   256	function normalizePreferredCaptureSource(rawValue: string | null | undefined): CaptureDataSource | null {
   257	  if (!rawValue) {
   258	    return null;
   259	  }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/memory/save_workflow.md | sed -n '170,250p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   170	<!-- ANCHOR:direct-script -->
   171	## 4. DIRECT SCRIPT
   172	
   173	**When to Use:** Testing, debugging, custom workflows, CI/CD pipelines
   174	**Requirement:** Node.js installed
   175	
   176	### Usage Pattern
   177	
   178	```bash
   179	# Create minimal JSON data file
   180	cat > /tmp/test-save-context.json << 'EOF'
   181	{
   182	  "SPEC_FOLDER": "049-anchor-context-retrieval",
   183	  "recent_context": [{
   184	    "request": "Test save-context execution",
   185	    "completed": "Verified system works standalone",
   186	    "learning": "Direct script execution requires minimal JSON",
   187	    "duration": "5m",
   188	    "date": "2025-11-28T18:30:00Z"
   189	  }],
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/memory/save_workflow.md | sed -n '360,395p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   360	
   361	<!-- /ANCHOR:document-structure -->
   362	<!-- ANCHOR:metadata -->
   363	## 7. METADATA
   364	
   365	### JSON Structure
   366	
   367	```json
   368	{
   369	  "timestamp": "2025-12-07T14:30:00Z",
   370	  "specFolder": "049-oauth-implementation",
   371	  "messageCount": 45,
   372	  "decisionCount": 3,
   373	  "diagramCount": 2,
   374	  "duration": "2h 15m",
   375	  "topics": ["oauth", "jwt", "authentication"]
   376	}
   377	```
   378	
   379	### Field Definitions
exec
/bin/zsh -lc 'rg -n "importance tier|importanceTier|critical|important|normal|low|temporary|deprecated|constitutional" .opencode/skill/system-spec-kit/references/memory/memory_system.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
17:The Spec Kit Memory system provides context preservation across sessions through vector-based semantic search and structured memory files. This reference covers MCP tool behavior, importance tiers, decay scoring, and configuration.
25:| Constitutional | `constitutional/` | Always-surface rules (Gate 3 enforcement) |
42:| **Memory Files** | `specs/*/memory/*.{md,txt}` | Varies (episodic, procedural, etc.) | `normal` | `findMemoryFiles()` |
43:| **Constitutional Rules** | `.opencode/skill/*/constitutional/*.md` | `meta-cognitive` | `constitutional` | `findConstitutionalFiles()` |
44:| **Spec Documents** | `.opencode/specs/**/*.md` | Per-type (spec, plan, tasks, etc.) | `normal` | `findSpecDocuments()` |
49:- **Constitutional Rules** — Always-surface critical rules. Injected at top of every search result. No decay.
52:**Post-implementation hardening (spec 126 follow-up):**
56:- `document_type` and `spec_level` preservation in update/reinforce flows, including vector metadata update plumbing
63:4. Documents are indexed alongside memory and constitutional files
92:- Stored in `constitutional/` folder
138:| `includeConstitutional` | boolean | true | Scan `.opencode/skill/*/constitutional/` directories |
161:- `includeConstitutional`: Include constitutional tier memories
163:- `tier`: Filter by importance tier
174:| `includeConstitutional` | boolean | No | true | Include constitutional memories |
178:| `tier` | string | No | - | Filter by importance tier |
198:> **Important:** Constitutional memories ALWAYS appear at the top of search results, even when a `specFolder` filter is applied. This is BY DESIGN to ensure critical context (e.g., Gate enforcement rules) is never accidentally filtered out.
202:| `specFolder: "007-auth"` | Filters results to that folder, but constitutional memories still appear first |
203:| `includeConstitutional: false` | Explicitly excludes constitutional memories from results |
225:// Exclude constitutional tier
227:  query: "login flow",
exec
/bin/zsh -lc 'rg -n "DataSource|CaptureDataSource|source type|document type|simulation|opencode-capture|claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture" .opencode/skill/system-spec-kit/scripts .opencode/skill/sk-doc' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/README.md:141:- Auto-detection of document types (README, SKILL, Knowledge, Command, Spec, Generic)
.opencode/skill/sk-doc/README.md:143:- Frontmatter validation for 11 document types
.opencode/skill/sk-doc/README.md:174:No configuration required. The skill auto-detects document types and applies the appropriate enforcement level:
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:40:// 1. TYPES (local to simulation-factory only)
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:58:/** Full simulation result */
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:67:/** Collected data that might need simulation */
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:79:  _simulationWarning?: string;
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:97:// Intentionally kept separate: simulation data should use raw UTC without timezone offset.
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:147:  const specFolder: string = config.specFolder || 'simulation';
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:172:      { OUTCOME: '\u26A0\uFE0F SIMULATION MODE - Real conversation data not available', TYPE: 'simulation' },
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:196:    PROJECT_PHASE: 'simulation',
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:535:    _simulationWarning: 'This memory was generated using placeholder data, not from a real conversation',
.opencode/skill/system-spec-kit/scripts/loaders/index.ts:10:export type { DataSource, LoadedData } from './data-loader';
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:1:import type { DataSource } from './input-normalizer';
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:4:export type KnownDataSource = DataSource;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:7:  source: DataSource;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:14:const SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:21:  'opencode-capture': {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:22:    source: 'opencode-capture',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:27:  'claude-code-capture': {
exec
/bin/zsh -lc 'rg -n "importanceTier" .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/types/session-types.ts .opencode/skill/system-spec-kit/references .opencode/skill/system-spec-kit/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:87:  importanceTier?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:662:  if (data.importanceTier !== undefined && !validTiers.includes(data.importanceTier)) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:663:    errors.push(`Invalid importanceTier: ${data.importanceTier}. Valid values: ${validTiers.join(', ')}`);
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:225:importanceTier: [normal / important / critical]
.opencode/skill/system-spec-kit/references/memory/memory_system.md:482:   importanceTier: constitutional
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:367:memory_update({ id: 123, importanceTier: "constitutional" })
exec
/bin/zsh -lc 'rg -n "interface Observation|interface UserPrompt|interface FileEntry|interface OpencodeCapture|canonical type definitions|parallel type hierarchies" .opencode/skill/system-spec-kit/scripts/types/session-types.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/types/README.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/types/README.md:34:**Shared session type definitions** used across the Spec Kit scripts pipeline. This module is the **canonical source of truth** for all session-related types, eliminating parallel type hierarchies that previously existed between `simulation-factory` and the extractors (resolves **TECH-DEBT P6-05**).
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:34:export interface Observation {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:49:export interface UserPrompt {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:61:export interface FileEntry {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:145:export interface OpencodeCapture {
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:9:// Eliminates parallel type hierarchies (TECH-DEBT P6-05).
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:56:export interface Observation {
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:69:export interface UserPrompt {
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:155:export interface ObservationDetailed {
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:183:export interface FileEntry {
exec
/bin/zsh -lc "rg -n \"from '../types/session-types'|from './types/session-types'|from '../utils/input-normalizer'|export \\* from './session-types'|export type \\* from './session-types'|export \\{.*input-normalizer|export type \\{.*DataSource\" .opencode/skill/system-spec-kit/scripts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/loaders/index.ts:10:export type { DataSource, LoadedData } from './data-loader';
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:24:} from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:35:} from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:41:export type { DataSource };
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:22:import type { DescriptionProvenance } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:23:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:22:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:14:import type { CollectedDataSubset } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts:16:import type { CollectedDataSubset } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:27:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/utils/phase-classifier.ts:15:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/session-activity-signal.ts:11:import type { CollectedDataBase, FactValue, Observation } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts:10:import type { ConversationPhaseLabel } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:28:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:58:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:19:} from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:19:} from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:85:import type { FileChange, SessionData } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts:19:} from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:24:} from '../types/session-types';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/memory/memory_system.md | sed -n '360,370p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/templates/template_style_guide.md | sed -n '216,230p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/memory/memory_system.md | sed -n '478,484p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   360	#### Tier-Specific Decay Rates
   361	
   362	| Tier | Decay Rate | Behavior |
   363	|------|------------|----------|
   364	| `constitutional` | 1.0 | Never decays (exempt) |
   365	| `critical` | 1.0 | Never decays (exempt) |
   366	| `important` | 1.0 | Never decays (exempt) |
   367	| `normal` | 0.80 | Standard decay (~20% loss per 30 days) |
   368	| `temporary` | 0.60 | Fast decay (~40% loss per 30 days) |
   369	| `deprecated` | 1.0 | Never decays (but excluded from search results) |
   370	
 succeeded in 0ms:
   478	   triggers:
   479	     - "file modification"
   480	     - "gate 3"
   481	     - "spec folder"
   482	   importanceTier: constitutional
   483	   ---
   484	   ```
 succeeded in 0ms:
   216	
   217	```yaml
   218	---
   219	title: [Descriptive title for semantic search]
   220	specFolder: [###-folder-name]
   221	sessionId: [YYYYMMDD_HHMMSS]
   222	triggers:
   223	  - [keyword 1]
   224	  - [keyword 2]
   225	importanceTier: [normal / important / critical]
   226	---
   227	```
   228	
   229	### Spec Folder File Frontmatter
   230	
Plan update
I’ve finished the evidence pass across the implementation and the linked standards/docs, and I’m packaging the audit into findings-first output with explicit line-backed recommendations.
  ✓ Load the complete primary files and relevant supporting references like importance tier definitions and TS style guidance
  ✓ Compare the implementation against each of the seven requested alignment checks and capture evidence
  → Return findings in the requested findings-first format with severity, file list, evidence, and recommendations
codex
I’ve got the findings isolated. One last detail pass: I’m pulling exact line references for the canonical-type contract so I can anchor the duplication finding cleanly instead of relying on a high-level summary.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/types/README.md | sed -n '30,40p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    30	
    31	<!-- ANCHOR:overview -->
    32	## 1. OVERVIEW
    33	
    34	**Shared session type definitions** used across the Spec Kit scripts pipeline. This module is the **canonical source of truth** for all session-related types, eliminating parallel type hierarchies that previously existed between `simulation-factory` and the extractors (resolves **TECH-DEBT P6-05**).
    35	
    36	---
    37	
    38	<!-- /ANCHOR:overview -->
    39	
    40	<!-- ANCHOR:structure -->
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/loaders/index.ts | sed -n '1,30p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Index
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. INDEX
     7	// ───────────────────────────────────────────────────────────────
     8	// Barrel export for data loading modules
     9	export { loadCollectedData } from './data-loader';
    10	export type { DataSource, LoadedData } from './data-loader';
codex
**Findings**

**ALIGN-001**  
Severity: BREAKING  
Files involved: [save_workflow.md#L181](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md#L181), [save_workflow.md#L219](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md#L219), [input-normalizer.ts#L411](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L411), [input-normalizer.ts#L527](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L527)  
Description: The documented direct-script payload allows `SPEC_FOLDER` plus required `recent_context`, with `observations` and `user_prompts` optional. The implementation only preserves `recent_context` and `user_prompts` in the fast path when at least two canonical arrays exist. In the slow path it drops the caller-supplied arrays and synthesizes fallback `recentContext`/`userPrompts` from `sessionSummary` or `"Manual context save"`.  
Recommendation: Preserve provided `recent_context` and `user_prompts` in the slow path too, or tighten the docs so the required payload shape matches the implementation.

**ALIGN-002**  
Severity: BREAKING  
Files involved: [template_style_guide.md#L225](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md#L225), [memory_system.md#L482](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md#L482), [input-normalizer.ts#L87](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L87), [input-normalizer.ts#L110](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L110), [input-normalizer.ts#L661](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L661)  
Description: The docs/templates expose `importanceTier` as part of the contract, and the normalizer validates both `importanceTier` and `importance_tier`, but `NormalizedData` has no place to store the field and `normalizeInputData()` never copies it forward. That means accepted user input is silently discarded before downstream indexing/scoring.  
Recommendation: Add `importanceTier` to the normalized/shared data contract and persist it, or remove it from accepted input and docs.

**ALIGN-003**  
Severity: INCONSISTENT  
Files involved: [importance-tiers.ts#L20](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts#L20), [memory_system.md#L364](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md#L364), [template_style_guide.md#L225](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md#L225), [system-spec-kit/SKILL.md#L645](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L645)  
Description: The authoritative implementation and linked memory docs use a six-tier model: `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated`. The template style guide still advertises only `normal / important / critical`. There is no `low` tier on either side.  
Recommendation: Make one source of truth explicit and update the template docs to the full six-tier set, or clearly label the reduced three-tier list as a limited authoring shortcut.

**ALIGN-004**  
Severity: INCONSISTENT  
Files involved: [session-types.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L1), [input-normalizer.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L1), [style_guide.md#L31](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/references/typescript/style_guide.md#L31), [sk-code--opencode/SKILL.md#L341](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/SKILL.md#L341), [sk-code--opencode/SKILL.md#L412](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/SKILL.md#L412)  
Description: Both TypeScript files use ASCII dashed module banners, while the TypeScript standard requires the box-drawing `MODULE:` header format and treats header compliance as a P0 gate.  
Recommendation: Normalize these files to the documented TypeScript header convention, or relax the standard so the current ASCII banner is explicitly allowed.

**ALIGN-005**  
Severity: INCONSISTENT  
Files involved: [session-types.ts#L8](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L8), [types/README.md#L34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/README.md#L34), [input-normalizer.ts#L34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L34), [input-normalizer.ts#L49](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L49), [input-normalizer.ts#L61](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L61)  
Description: `session-types.ts` and its README claim to be the canonical source of truth that eliminated parallel type hierarchies, but `input-normalizer.ts` still defines its own `Observation`, `UserPrompt`, `FileEntry`, and `OpencodeCapture` interfaces locally. That keeps the same concepts split across two contracts.  
Recommendation: Import shared types from `session-types.ts` where shapes truly match, and isolate any intentional deltas into adapter-specific types with different names.

**No Additional Findings**

- `Q1`: Interface and type names themselves are aligned with `sk-code--opencode`. Examples like `SessionMetadata`, `GitMetadata`, and `DecisionRecord` are PascalCase and do not use new `I*` prefixes; the drift is in field-schema naming, not interface naming. See [session-types.ts#L104](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L104) and [style_guide.md#L171](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/references/typescript/style_guide.md#L171).
- `Q3`: The checklist priority semantics are materially aligned. `system-spec-kit` says P0 cannot defer, P1 needs approval to defer, P2 can defer; `sk-code--opencode` says the same with slightly different wording. See [system-spec-kit/SKILL.md#L420](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L420) and [sk-code--opencode/SKILL.md#L427](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/SKILL.md#L427).
- `Q4`: I did not find a naming collision between `DataSource` values (`file`, `opencode-capture`, `simulation`, etc.) and sk-doc document types (`README`, `SKILL`, `Knowledge`, `Command`, `Spec`, `Generic`). See [input-normalizer.ts#L21](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L21) and [sk-doc/SKILL.md#L300](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-doc/SKILL.md#L300).
- `Q7`: Export style is aligned. These modules use named exports, no default exports, and the codebase already uses barrel files where a public API is needed. See [input-normalizer.ts#L1207](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L1207), [loaders/index.ts#L9](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/index.ts#L9), and [code_organization.md#L182](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/references/shared/code_organization.md#L182).
tokens used
401,719
**Findings**

**ALIGN-001**  
Severity: BREAKING  
Files involved: [save_workflow.md#L181](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md#L181), [save_workflow.md#L219](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md#L219), [input-normalizer.ts#L411](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L411), [input-normalizer.ts#L527](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L527)  
Description: The documented direct-script payload allows `SPEC_FOLDER` plus required `recent_context`, with `observations` and `user_prompts` optional. The implementation only preserves `recent_context` and `user_prompts` in the fast path when at least two canonical arrays exist. In the slow path it drops the caller-supplied arrays and synthesizes fallback `recentContext`/`userPrompts` from `sessionSummary` or `"Manual context save"`.  
Recommendation: Preserve provided `recent_context` and `user_prompts` in the slow path too, or tighten the docs so the required payload shape matches the implementation.

**ALIGN-002**  
Severity: BREAKING  
Files involved: [template_style_guide.md#L225](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md#L225), [memory_system.md#L482](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md#L482), [input-normalizer.ts#L87](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L87), [input-normalizer.ts#L110](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L110), [input-normalizer.ts#L661](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L661)  
Description: The docs/templates expose `importanceTier` as part of the contract, and the normalizer validates both `importanceTier` and `importance_tier`, but `NormalizedData` has no place to store the field and `normalizeInputData()` never copies it forward. That means accepted user input is silently discarded before downstream indexing/scoring.  
Recommendation: Add `importanceTier` to the normalized/shared data contract and persist it, or remove it from accepted input and docs.

**ALIGN-003**  
Severity: INCONSISTENT  
Files involved: [importance-tiers.ts#L20](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts#L20), [memory_system.md#L364](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md#L364), [template_style_guide.md#L225](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/references/templates/template_style_guide.md#L225), [system-spec-kit/SKILL.md#L645](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L645)  
Description: The authoritative implementation and linked memory docs use a six-tier model: `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated`. The template style guide still advertises only `normal / important / critical`. There is no `low` tier on either side.  
Recommendation: Make one source of truth explicit and update the template docs to the full six-tier set, or clearly label the reduced three-tier list as a limited authoring shortcut.

**ALIGN-004**  
Severity: INCONSISTENT  
Files involved: [session-types.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L1), [input-normalizer.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L1), [style_guide.md#L31](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/references/typescript/style_guide.md#L31), [sk-code--opencode/SKILL.md#L341](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/SKILL.md#L341), [sk-code--opencode/SKILL.md#L412](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/SKILL.md#L412)  
Description: Both TypeScript files use ASCII dashed module banners, while the TypeScript standard requires the box-drawing `MODULE:` header format and treats header compliance as a P0 gate.  
Recommendation: Normalize these files to the documented TypeScript header convention, or relax the standard so the current ASCII banner is explicitly allowed.

**ALIGN-005**  
Severity: INCONSISTENT  
Files involved: [session-types.ts#L8](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L8), [types/README.md#L34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/README.md#L34), [input-normalizer.ts#L34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L34), [input-normalizer.ts#L49](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L49), [input-normalizer.ts#L61](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L61)  
Description: `session-types.ts` and its README claim to be the canonical source of truth that eliminated parallel type hierarchies, but `input-normalizer.ts` still defines its own `Observation`, `UserPrompt`, `FileEntry`, and `OpencodeCapture` interfaces locally. That keeps the same concepts split across two contracts.  
Recommendation: Import shared types from `session-types.ts` where shapes truly match, and isolate any intentional deltas into adapter-specific types with different names.

**No Additional Findings**

- `Q1`: Interface and type names themselves are aligned with `sk-code--opencode`. Examples like `SessionMetadata`, `GitMetadata`, and `DecisionRecord` are PascalCase and do not use new `I*` prefixes; the drift is in field-schema naming, not interface naming. See [session-types.ts#L104](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L104) and [style_guide.md#L171](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/references/typescript/style_guide.md#L171).
- `Q3`: The checklist priority semantics are materially aligned. `system-spec-kit` says P0 cannot defer, P1 needs approval to defer, P2 can defer; `sk-code--opencode` says the same with slightly different wording. See [system-spec-kit/SKILL.md#L420](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L420) and [sk-code--opencode/SKILL.md#L427](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/SKILL.md#L427).
- `Q4`: I did not find a naming collision between `DataSource` values (`file`, `opencode-capture`, `simulation`, etc.) and sk-doc document types (`README`, `SKILL`, `Knowledge`, `Command`, `Spec`, `Generic`). See [input-normalizer.ts#L21](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L21) and [sk-doc/SKILL.md#L300](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-doc/SKILL.md#L300).
- `Q7`: Export style is aligned. These modules use named exports, no default exports, and the codebase already uses barrel files where a public API is needed. See [input-normalizer.ts#L1207](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L1207), [loaders/index.ts#L9](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/index.ts#L9), and [code_organization.md#L182](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/references/shared/code_organization.md#L182).
