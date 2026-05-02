OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d0ab1-40ca-7c83-bf54-d2535a030b78
--------
user
You are a cross-system alignment auditor. This is iteration 3 focused on remaining gaps.

TASK: Answer these specific cross-skill alignment questions with evidence.

Primary files (READ ALL):
1. .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts (229 lines)
2. .opencode/skill/system-spec-kit/scripts/spec/validate.sh
3. .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py
4. .opencode/skill/sk-doc/scripts/extract_structure.py
5. .opencode/skill/sk-doc/references/global/hvr_rules.md

Questions:
1. What exit codes does validate.sh use? Compare to verify_alignment_drift.py and extract_structure.py.
2. Does sk-doc HVR (Human Voice Rules) apply to spec folder documents? What enforces it?
3. Are document-type scoring multipliers consistent between importance-tiers.ts (getDefaultTierForDocumentType) and sk-doc template_rules.json?
4. Is the Smart Router ambiguity_delta value the same across system-spec-kit, sk-code-opencode, and sk-doc SKILL.md files?
5. Do P0/P1/P2 definitions in spec-kit checklist templates match sk-code-opencode quality gate priorities?
6. Is the 6-tier importance system (constitutional/critical/important/normal/temporary/deprecated) mentioned consistently in all three SKILL.md files?

OUTPUT: ALIGN-NNN findings with severity BREAKING/INCONSISTENT/COSMETIC.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only audit pass: I’ll load the five required files plus the three relevant `SKILL.md` files and compare the exact definitions, exit codes, and terminology before I answer the six alignment questions.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-doc/references/global/hvr_rules.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: Human Voice Rules (HVR) - Writing Standards Reference
description: Linguistic standards that eliminate detectable AI patterns and enforce natural human writing across all documentation.
---

# Human Voice Rules (HVR) - Writing Standards Reference

Linguistic standards for all documentation output. These rules eliminate AI-detectable patterns and ensure every piece of writing reads as if a knowledgeable human wrote it.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

AI-generated text carries tells: em dashes everywhere, three-item lists, hedging language, the same 20 overused words. Readers spot these patterns and trust drops. HVR defines what to aim for and what to avoid.

### Usage

Apply to all AI-generated documentation: READMEs, implementation summaries, decision records, install guides and spec folder docs.

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-code-opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code-opencode
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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: ALIGNMENT DRIFT VERIFIER
# ───────────────────────────────────────────────────────────────

"""Lightweight recurring alignment checks for OpenCode codebases.

This verifier is intentionally behavior-neutral: it only inspects files and
reports actionable findings. It exits non-zero when violations are found.

Coverage:
- TypeScript (.ts, .tsx, .mts)
- JavaScript (.js, .mjs, .cjs)
- Python (.py)
- Shell (.sh)
- JSON (.json)
- JSONC (.jsonc)
"""

from __future__ import annotations
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-doc/scripts/extract_structure.py" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCUMENT STRUCTURE EXTRACTOR
# ───────────────────────────────────────────────────────────────

"""
Document Structure Extractor for Script-Assisted AI Analysis

Extracts structured data from markdown documents for AI consumption:
- Frontmatter parsing with issue detection
- Heading and section extraction
- Code block extraction
- Metrics calculation
- Type-specific checklist validation (skill, readme, asset, reference, command)
- Content quality validation (placeholders, code languages, dividers)
- Style validation (H2 ALL CAPS, H3 semantic emoji, section dividers)
- Evaluation question generation

Output: JSON to stdout for AI agent processing
"""
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/spec/validate.sh" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Validate Spec
# ───────────────────────────────────────────────────────────────
# Spec Folder Validation Orchestrator - Bash 3.2+ compatible

# Strict mode with guarded dynamic expansions.
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Feature flag: Skip validation if SPECKIT_SKIP_VALIDATION is set
if [[ -n "${SPECKIT_SKIP_VALIDATION:-}" ]]; then
    echo "Validation skipped (SPECKIT_SKIP_VALIDATION=${SPECKIT_SKIP_VALIDATION})" >&2
    exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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

codex
I’ve loaded the required files. Next I’m tracing the exact enforcement points and matching terms across the skill docs, templates and scripts so the findings map cleanly to each question.
exec
/bin/zsh -lc "rg -n \"exit\\(|sys\\.exit|returncode|EXIT CODES|warnings|errors|fail-on-warn|print\\(|main\\(\" .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/scripts/spec/validate.sh" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/scripts/extract_structure.py:1233:def main() -> None:
.opencode/skill/sk-doc/scripts/extract_structure.py:1236:        print(json.dumps({
.opencode/skill/sk-doc/scripts/extract_structure.py:1239:        sys.exit(1)
.opencode/skill/sk-doc/scripts/extract_structure.py:1245:    print(json.dumps(result, indent=2))
.opencode/skill/sk-doc/scripts/extract_structure.py:1249:        sys.exit(1)
.opencode/skill/sk-doc/scripts/extract_structure.py:1253:    main()
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:54:        python3 -c "import time; print(int(time.time() * 1000))" 2>/dev/null || echo $(( $(date +%s) * 1000 ))
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87:    --json         JSON output   --strict       Warnings as errors
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:92:EXIT CODES: 0=pass, 1=warnings, 2=errors
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:494:        echo "RESULT: $status (errors=$ERRORS warnings=$WARNINGS)"
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:524:    echo "{\"version\":\"$VERSION\",\"folder\":\"$folder_escaped\",\"level\":$json_level,\"levelMethod\":\"$LEVEL_METHOD\",\"config\":$cfg,\"results\":[$RESULTS]${phases_json},\"summary\":{\"errors\":$ERRORS,\"warnings\":$WARNINGS,\"info\":$INFOS},\"passed\":$passed,\"strict\":$STRICT_MODE}"
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:534:    local child_errors=0
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:535:    local child_warnings=0
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:561:        local parent_errors=$ERRORS
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:562:        local parent_warnings=$WARNINGS
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:577:        child_errors=$((child_errors + ERRORS))
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:578:        child_warnings=$((child_warnings + WARNINGS))
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:590:        phase_results+="{\"name\":\"$(_json_escape "$phase_name")\",\"level\":$json_level,\"errors\":$ERRORS,\"warnings\":$WARNINGS,\"passed\":$child_passed,\"results\":[$RESULTS]}"
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:594:        ERRORS=$((parent_errors + ERRORS))
.opencode/skill/system-spec-kit/scripts/spec/validate.sh:595:        WARNINGS=$((parent_warnings + WARNINGS))
exec
/bin/zsh -lc "rg -n \"template_rules\\.json|getDefaultTierForDocumentType|importance|constitutional|critical|important|normal|temporary|deprecated|ambiguity_delta|P0|P1|P2|quality gate|priority\" .opencode/skill/system-spec-kit .opencode/skill/sk-code-opencode .opencode/skill/sk-doc" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:129:interface AutoSurfaceResult { constitutional: unknown[]; triggered: unknown[]; }
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:318:    // P1-11 FIX: Module-level guard avoids redundant calls on every tool invocation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:369:                // P1-06 FIX: Recalculate token count from the full envelope
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:427:    // P1 follow-up: derive those known locations from all allowed memory roots so startup recovery matches ingest roots.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:445:      // Also scan constitutional directories (.opencode/skill/*/constitutional/)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:452:              const constDir = path.join(skillDir, entry.name, 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:460:        // Non-fatal: constitutional directory discovery failed
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:468:    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:588:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:590:// P1-11 FIX: Module-level guard to avoid redundant initializeDb() calls per tool invocation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:638:    // P1-09 FIX: Close MCP transport on shutdown
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:823:          // P1-08 FIX: Mark embedding ready even on timeout so the system is usable
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:832:    console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:993:    // P0-3: Async ingestion job queue initialization + crash recovery reset.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1008:    // P1-7: Optional real-time markdown watcher for automatic re-indexing.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1052:  // P1-09: Assign to module-level transport (not const) so shutdown handlers can close it
.opencode/skill/sk-code-opencode/assets/checklists/shell_checklist.md:23:| P0 | HARD BLOCKER | Must fix before commit |
.opencode/skill/sk-code-opencode/assets/checklists/shell_checklist.md:24:| P1 | Required | Must fix or get explicit approval |
.opencode/skill/sk-code-opencode/assets/checklists/shell_checklist.md:25:| P2 | Recommended | Can defer with justification |
.opencode/skill/sk-code-opencode/assets/checklists/shell_checklist.md:31:## 2. P0 - HARD BLOCKERS
tool cocoindex_code.search({"query":"Where is sk-doc template_rules.json and how are document-type scoring multipliers defined or referenced? Also where are HVR rules enforced for spec folder documents?","limit":10,"refresh_index":false})
cocoindex_code.search({"query":"Where is sk-doc template_rules.json and how are document-type scoring multipliers defined or referenced? Also where are HVR rules enforced for spec folder documents?","limit":10,"refresh_index":false}) success in 437ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary: Template Compliance\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## 1. METADATA\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 012-template-compliance |\\n| **Completed** | 2026-03-17 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 9,\n      \"end_line\": 29,\n      \"score\": 0.6862073378207398\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 019-decisions-and-deferrals |\\n| **Completed** | 2026-03-13 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 12,\n      \"end_line\": 32,\n      \"score\": 0.6426023748880425\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/005-lifecycle/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 005-lifecycle |\\n| **Completed** | 2026-03-12 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 8,\n      \"end_line\": 27,\n      \"score\": 0.6405672841800065\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/020-feature-flag-reference/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 020-feature-flag-reference |\\n| **Completed** | 2026-03-14 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 13,\n      \"end_line\": 33,\n      \"score\": 0.6386662273721964\n    },\n    {\n      \"file_path\": \"specs/04--agent-orchestration/022-context-overload-prevention/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 022-context-overload-prevention |\\n| **Completed** | 2026-02-20 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 13,\n      \"end_line\": 33,\n      \"score\": 0.6368517997804997\n    },\n    {\n      \"file_path\": \"specs/03--commands-and-skills/008-cli-copilot-creation/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 004-cli-copilot |\\n| **Completed** | 2026-03-02 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 9,\n      \"end_line\": 29,\n      \"score\": 0.6347932934591469\n    },\n    {\n      \"file_path\": \"specs/03--commands-and-skills/007-cli-claude-code-creation/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 003-cli-claude-code |\\n| **Completed** | 2026-03-02 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 9,\n      \"end_line\": 29,\n      \"score\": 0.6301688722259211\n    },\n    {\n      \"file_path\": \"specs/04--agent-orchestration/025-codex-cli-agents/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 025-codex-cli-agents |\\n| **Completed** | 2026-03-01 |\\n| **Level** | 2 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 11,\n      \"end_line\": 31,\n      \"score\": 0.6301516479423537\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 3 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## 1. METADATA\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 009-perfect-session-capturing |\\n| **Completed** | 2026-03-17 |\\n| **Level** | 3 |\\n| **Status** | Complete |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 11,\n      \"end_line\": 32,\n      \"score\": 0.6255361961011658\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary\\n\\n<!-- SPECKIT_LEVEL: 1 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\\n\\n---\\n\\n<!-- ANCHOR:metadata -->\\n## Metadata\\n\\n| Field | Value |\\n|-------|-------|\\n| **Spec Folder** | 007-code-audit-per-feature-catalog |\\n| **Completed** | 2026-03-15 |\\n| **Level** | 1 |\\n<!-- /ANCHOR:metadata -->\\n\\n---\\n\\n<!-- ANCHOR:what-built -->\",\n      \"start_line\": 12,\n      \"end_line\": 32,\n      \"score\": 0.6252098158945998\n    }\n  ],\n  \"total_returned\": 10,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/implementation-summary.md",
        "language": "markdown",
        "content": "# Implementation Summary: Template Compliance\n\n<!-- SPECKIT_LEVEL: 2 -->\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\n<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->\n\n---\n\n<!-- ANCHOR:metadata -->\n## 1. METADATA\n\n| Field | Value |\n|-------|-------|\n| **Spec Folder** | 012-template-compliance |\n| **Completed** | 2026-03-17 |\n| **Level** | 2 |\n<!-- /ANCHOR:metadata -->\n\n---\n\n<!-- ANCHOR:what-built -->",
        "start_line": 9,
        "end_line": 29,
        "score": 0.6862073378207398
      },
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/implementation-summary.md",
codex
I’ve got the broad matches. I’m narrowing this to the exact line ranges for exit behavior, HVR enforcement, template multipliers, ambiguity settings and P0/P1/P2 definitions so the audit findings stay evidence-first instead of speculative.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/scripts/extract_structure.py | sed -n '1230,1260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py | sed -n '440,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/sk-doc | rg 'template_rules\\.json"'$|checklist.*'"\\.md"'$|validation'"\\.md"'$|workflows'"\\.md"'$|core_standards'"\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "ambiguity_delta|select_intents|select.*ambigu" .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/sk-code-opencode/SKILL.md .opencode/skill/sk-doc/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/spec/validate.sh | sed -n '80,140p;610,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/assets/template_rules.json
.opencode/skill/sk-doc/references/global/core_standards.md
.opencode/skill/sk-doc/references/global/validation.md
.opencode/skill/sk-doc/references/global/workflows.md
 succeeded in 0ms:
  1230	# 10. CLI ENTRY POINT
  1231	# ───────────────────────────────────────────────────────────────
  1232	
  1233	def main() -> None:
  1234	    """CLI entry point for document structure extraction."""
  1235	    if len(sys.argv) < 2:
  1236	        print(json.dumps({
  1237	            'error': 'Usage: python extract_structure.py <path-to-markdown-file>'
  1238	        }), file=sys.stderr)
  1239	        sys.exit(1)
  1240	    
  1241	    filepath = sys.argv[1]
  1242	    result = extract_structure(filepath)
  1243	    
  1244	    # Output JSON to stdout
  1245	    print(json.dumps(result, indent=2))
  1246	    
  1247	    # Exit with error code if extraction failed
  1248	    if 'error' in result:
  1249	        sys.exit(1)
 succeeded in 0ms:
   440	    try:
   441	        return os.path.relpath(path, os.getcwd())
   442	    except ValueError:
   443	        return path
   444	
   445	
   446	def main() -> int:
   447	    args = parse_args()
   448	    roots = args.root or [os.getcwd()]
   449	    findings: List[Finding] = []
   450	    scanned = 0
   451	
   452	    for file_path in sorted(iter_code_files(roots)):
   453	        scanned += 1
   454	        findings.extend(check_file(file_path))
   455	
   456	    error_count = sum(1 for item in findings if item.severity == "ERROR")
   457	    warning_count = sum(1 for item in findings if item.severity == "WARN")
   458	    should_fail = error_count > 0 or (args.fail_on_warn and warning_count > 0)
   459	
 succeeded in 0ms:
.opencode/skill/sk-doc/SKILL.md:239:def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
.opencode/skill/sk-doc/SKILL.md:244:    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
.opencode/skill/sk-doc/SKILL.md:250:    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
.opencode/skill/system-spec-kit/SKILL.md:273:def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
.opencode/skill/system-spec-kit/SKILL.md:283:        if secondary_score > 0 and (primary_score - secondary_score) <= ambiguity_delta:
.opencode/skill/system-spec-kit/SKILL.md:291:    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
 succeeded in 0ms:
    80	show_help() { cat << 'EOF'
    81	validate-spec.sh - Spec Folder Validation Orchestrator (v2.0)
    82	
    83	USAGE: ./validate-spec.sh <folder-path> [OPTIONS]
    84	
    85	OPTIONS:
    86	    --help, -h     Show help     --version, -v  Show version
    87	    --json         JSON output   --strict       Warnings as errors
    88	    --verbose      Detailed      --quiet, -q    Results only
    89	    --recursive    Validate parent + all [0-9][0-9][0-9]-*/ child phase folders
    90	    --no-recursive Disable auto-recursive validation when phase children exist
    91	
    92	EXIT CODES: 0=pass, 1=warnings, 2=errors
    93	
    94	RULES: FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, LEVEL_DECLARED,
    95	       PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID, TOC_POLICY, PHASE_LINKS,
    96	       SPEC_DOC_INTEGRITY
    97	
    98	LEVELS: 1=spec+plan+tasks+impl-summary*, 2=+checklist, 3=+decision-record
    99	        *impl-summary required after tasks completed
exec
/bin/zsh -lc 'rg -n "constitutional|critical|important|normal|temporary|deprecated|6-tier|importance tier|importance system" .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/sk-code-opencode/SKILL.md .opencode/skill/sk-doc/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/SKILL.md:38:- Check critical violations (missing frontmatter, wrong section order)
.opencode/skill/sk-doc/SKILL.md:42:- Creating critical documentation (specs, knowledge, skills)
.opencode/skill/sk-doc/SKILL.md:708:- ✅ All critical issues addressed
.opencode/skill/system-spec-kit/SKILL.md:8:<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->
.opencode/skill/system-spec-kit/SKILL.md:66:  - `scratch/` → temporary workspace, any agent
.opencode/skill/system-spec-kit/SKILL.md:71:Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`
.opencode/skill/system-spec-kit/SKILL.md:146:    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
.opencode/skill/system-spec-kit/SKILL.md:591:- **Constitutional tier** — 3.0x search boost + 2.0x importance multiplier; merged into normal scoring pipeline
.opencode/skill/system-spec-kit/SKILL.md:592:- **Document-type scoring** — 10 indexed document types with multipliers: spec (1.4x), plan (1.3x), constitutional (2.0x), decision_record (1.4x), tasks (1.1x), implementation_summary (1.1x), research (1.1x), checklist (1.0x), handover (1.0x), memory (1.0x). README files and skill-doc trees (`sk-*`, including `references/` and `assets/`) are excluded from memory indexing.
.opencode/skill/system-spec-kit/SKILL.md:609:- **Validation scoring** — `wasUseful=false` applies a demotion penalty to memory scores; 5+ positive validations may promote a memory's importance tier
.opencode/skill/system-spec-kit/SKILL.md:627:| `SPECKIT_RELATIONS`          | off     | Enables correction tracking with undo semantics (superseded/deprecated/refined/merged) |
.opencode/skill/system-spec-kit/SKILL.md:634:| `SPECKIT_SCORE_NORMALIZATION` | on     | Min-max score normalization across channels |
.opencode/skill/system-spec-kit/SKILL.md:645:**Full documentation:** See [memory_system.md](./references/memory/memory_system.md) for tool behavior, importance tiers, and configuration.
.opencode/skill/system-spec-kit/SKILL.md:838:| Constitutional    | `constitutional/`                                                          | Always-surface rules              |
exec
/bin/zsh -lc 'rg -n "P0|P1|P2|HARD BLOCKER|Required OR approved skip|Required|Can defer|checklist" .opencode/skill/system-spec-kit/templates .opencode/skill/system-spec-kit/references .opencode/skill/sk-code-opencode/SKILL.md .opencode/skill/sk-code-opencode/assets/checklists' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-code-opencode/SKILL.md:3:description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
.opencode/skill/sk-code-opencode/SKILL.md:56:| **Browser**   | Not applicable               | Required verification |
.opencode/skill/sk-code-opencode/SKILL.md:77:- `assets/checklists/` for language-specific quality gates and completion checklists.
.opencode/skill/sk-code-opencode/SKILL.md:192:            if task.needs_checklist:
.opencode/skill/sk-code-opencode/SKILL.md:193:                selected.append("assets/checklists/javascript_checklist.md")
.opencode/skill/sk-code-opencode/SKILL.md:201:            if task.needs_checklist:
.opencode/skill/sk-code-opencode/SKILL.md:202:                selected.append("assets/checklists/typescript_checklist.md")
.opencode/skill/sk-code-opencode/SKILL.md:210:            if task.needs_checklist:
.opencode/skill/sk-code-opencode/SKILL.md:211:                selected.append("assets/checklists/python_checklist.md")
.opencode/skill/sk-code-opencode/SKILL.md:219:            if task.needs_checklist:
.opencode/skill/sk-code-opencode/SKILL.md:220:                selected.append("assets/checklists/shell_checklist.md")
.opencode/skill/sk-code-opencode/SKILL.md:228:            if task.needs_checklist:
.opencode/skill/sk-code-opencode/SKILL.md:229:                selected.append("assets/checklists/config_checklist.md")
.opencode/skill/sk-code-opencode/SKILL.md:237:            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
.opencode/skill/sk-code-opencode/SKILL.md:275:        ├─ Use checklist for validation (ON_DEMAND)
.opencode/skill/sk-code-opencode/SKILL.md:310:   - Avoid duplicate literals across handlers, tests, or checklists.
.opencode/skill/sk-code-opencode/SKILL.md:327:- Header style invariants and comment policy checks are manual checklist gates; the verifier checks marker-level headers only.
.opencode/skill/sk-code-opencode/SKILL.md:390:2. **Skip the file header** - Every file needs identification (P0)
.opencode/skill/sk-code-opencode/SKILL.md:412:| File Header        | Matches language-specific format         | P0       |
.opencode/skill/sk-code-opencode/SKILL.md:413:| Naming Convention  | Consistent throughout file               | P0       |
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/assets/template_rules.json | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	{
     2	  "version": "1.2.0",
     3	  "description": "Machine-readable template specifications for automated documentation validation - aligned with all 9 templates",
     4	  "documentTypes": {
     5	    "readme": {
     6	      "description": "README.md files for projects, components, and features",
     7	      "requiredSections": ["overview"],
     8	      "recommendedSections": ["quick_start", "troubleshooting", "related"],
     9	      "optionalSections": ["structure", "features", "configuration", "usage_examples", "faq"],
    10	      "sectionEmojis": {
    11	        "overview": "\ud83d\udcd6",
    12	        "quick_start": "\ud83d\ude80",
    13	        "structure": "\ud83d\udcc1",
    14	        "features": "\u26a1",
    15	        "configuration": "\u2699\ufe0f",
    16	        "usage_examples": "\ud83d\udca1",
    17	        "usage": "\ud83d\udca1",
    18	        "troubleshooting": "\ud83d\udee0\ufe0f",
    19	        "faq": "\u2753",
    20	        "related_documents": "\ud83d\udcda",
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts | sed -n '180,235p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   180	}
   181	
   182	// Compare tiers for sorting (negative if A > B, positive if B > A)
   183	export function compareTiers(tierA: string, tierB: string): number {
   184	  const valueA = getTierValue(tierA);
   185	  const valueB = getTierValue(tierB);
   186	  return valueB - valueA; // Higher value = more important, so reverse for descending sort
   187	}
   188	
   189	// Get all tiers sorted by importance (highest first)
   190	export function getTiersByImportance(): ImportanceTier[] {
   191	  return ([...VALID_TIERS] as ImportanceTier[]).sort((a, b) => {
   192	    return IMPORTANCE_TIERS[b].value - IMPORTANCE_TIERS[a].value;
   193	  });
   194	}
   195	
   196	// 5. DOCUMENT TYPE HELPERS
   197	
   198	/**
   199	 * Get the default importance tier for a given document type.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/SKILL.md | sed -n '260,310p;585,600p;830,845p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	
   261	    for intent, cfg in INTENT_SIGNALS.items():
   262	        for keyword in cfg["keywords"]:
   263	            if keyword in text:
   264	                scores[intent] += cfg["weight"]
   265	
   266	    command = str(getattr(task, "command", "")).lower()
   267	    for prefix, intent in COMMAND_BOOSTS.items():
   268	        if command.startswith(prefix):
   269	            scores[intent] += 6
   270	
   271	    return scores
   272	
   273	def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
   274	    """Return primary intent and secondary intent when scores are close."""
   275	    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
   276	    if not ranked or ranked[0][1] <= 0:
   277	        return ["IMPLEMENT"]
   278	
   279	    selected = [ranked[0][0]]
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/SKILL.md | sed -n '232,252p;30,45p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    30	**Frontmatter Validation** - Use `frontmatter_templates.md` when:
    31	- Validating YAML frontmatter in any document
    32	- Checking required fields for document types
    33	- Fixing frontmatter syntax errors
    34	
    35	**Validation Workflow** - Apply after Write/Edit operations:
    36	- Auto-correct filename violations (ALL CAPS to lowercase, hyphens to underscores)
    37	- Fix safe violations (separators, H2 case)
    38	- Check critical violations (missing frontmatter, wrong section order)
    39	
    40	**Manual Optimization** - Run when:
    41	- README needs optimization for AI assistants
    42	- Creating critical documentation (specs, knowledge, skills)
    43	- Pre-release quality checks
    44	- Generating llms.txt for LLM navigation
    45	
   232	    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
   233	    for intent, cfg in INTENT_SIGNALS.items():
   234	        for keyword in cfg["keywords"]:
   235	            if keyword in text:
exec
/bin/zsh -lc 'rg -n "HVR|human voice|hvr_rules|spec folder docs|specs, knowledge, skills|implementation summaries|decision records|spec folder" .opencode/skill/sk-doc/SKILL.md .opencode/skill/sk-doc/references/global/validation.md .opencode/skill/sk-doc/references/global/workflows.md .opencode/skill/sk-doc/references/global/core_standards.md .opencode/skill/sk-doc/references/global/hvr_rules.md .opencode/skill/system-spec-kit/templates .opencode/skill/system-spec-kit/references' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/SKILL.md:42:- Creating critical documentation (specs, knowledge, skills)
.opencode/skill/sk-doc/SKILL.md:185:    "HVR": {"weight": 4, "keywords": ["human voice", "hvr", "voice rules", "banned words", "writing style"]},
.opencode/skill/sk-doc/SKILL.md:197:    "HVR": ["references/global/hvr_rules.md"],
.opencode/skill/sk-doc/SKILL.md:445:10. **ALWAYS enforce Human Voice Rules (HVR)** on all documentation output. Full ruleset: [hvr_rules.md](./references/global/hvr_rules.md). Quick reference: `readme_template.md` §9.
.opencode/skill/sk-doc/SKILL.md:454:6. **NEVER use banned HVR words** (leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable)
.opencode/skill/sk-doc/SKILL.md:632:- [hvr_rules.md](./references/global/hvr_rules.md) - Human Voice Rules for all documentation output
.opencode/skill/sk-doc/SKILL.md:672:| **Style**     | 30  | H2 formatting, dividers, intro paragraph, HVR compliance |
.opencode/skill/sk-doc/SKILL.md:674:**HVR Compliance in DQI**: Human Voice Rules violations count against the Style component. Documents with em dashes, semicolons, banned words or banned phrases receive deductions in the Style score. Full HVR ruleset: [hvr_rules.md](./references/global/hvr_rules.md).
.opencode/skill/sk-doc/SKILL.md:709:- ✅ HVR compliance verified (no banned words, punctuation or structure violations)
.opencode/skill/sk-doc/SKILL.md:803:| **system-spec-kit** | Context files can be optimized. Validates spec folder documentation structure. |
.opencode/skill/sk-doc/references/global/hvr_rules.md:2:title: Human Voice Rules (HVR) - Writing Standards Reference
.opencode/skill/sk-doc/references/global/hvr_rules.md:6:# Human Voice Rules (HVR) - Writing Standards Reference
.opencode/skill/sk-doc/references/global/hvr_rules.md:15:AI-generated text carries tells: em dashes everywhere, three-item lists, hedging language, the same 20 overused words. Readers spot these patterns and trust drops. HVR defines what to aim for and what to avoid.
.opencode/skill/sk-doc/references/global/hvr_rules.md:19:Apply to all AI-generated documentation: READMEs, implementation summaries, decision records, install guides and spec folder docs.
.opencode/skill/sk-doc/references/global/hvr_rules.md:318:### Templates That Apply HVR
.opencode/skill/sk-doc/references/global/hvr_rules.md:329:- [sk-doc SKILL.md](../../SKILL.md) - Parent skill with HVR enforcement rules
.opencode/skill/system-spec-kit/templates/addendum/README.md:12:> Source-only extension blocks that compose into final level templates during spec folder setup.
.opencode/skill/system-spec-kit/templates/addendum/README.md:31:Addendums are **not** copied into spec folders directly. They are merged into `level_2`, `level_3`, and `level_3+` templates by the composition pipeline.
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:187:- [checklist.md](../../templates/level_2/checklist.md) - Checklist template for spec folders (Level 2+)
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:3:description: Conventions and standards for system-spec-kit templates ensuring documentation consistency across all spec folders.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-code-opencode/SKILL.md | sed -n '400,455p;150,190p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   150	    """Weighted language intent scoring with top-2 ambiguity handling."""
   151	    ext = Path(task.path).suffix.lower() if getattr(task, "path", "") else ""
   152	    if ext in FILE_EXTENSIONS:
   153	        return [FILE_EXTENSIONS[ext]], {FILE_EXTENSIONS[ext]: 100.0}
   154	
   155	    text = _task_text(task)
   156	    scores = {lang: 0.0 for lang in LANGUAGE_KEYWORDS}
   157	    for language, signals in LANGUAGE_KEYWORDS.items():
   158	        for term, weight in signals.items():
   159	            if term in text:
   160	                scores[language] += weight
   161	    for language, synonyms in NOISY_SYNONYMS.items():
   162	        for term, weight in synonyms.items():
   163	            if term in text:
   164	                scores[language] += weight
   165	
   166	    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
   167	    best_lang, best_score = ranked[0]
   168	    second_lang, second_score = ranked[1]
   169	    if best_score == 0:
codex
I’ve confirmed one likely gap already: `sk-code-opencode` doesn’t use the same Smart Router `ambiguity_delta` mechanism as the other two skills, so I’m checking whether that difference is intentional or an undocumented drift before I classify it.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/references/global/hvr_rules.md | sed -n '14,24p;318,332p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/SKILL.md | sed -n '440,460p;668,710p;628,635p;798,806p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    14	
    15	AI-generated text carries tells: em dashes everywhere, three-item lists, hedging language, the same 20 overused words. Readers spot these patterns and trust drops. HVR defines what to aim for and what to avoid.
    16	
    17	### Usage
    18	
    19	Apply to all AI-generated documentation: READMEs, implementation summaries, decision records, install guides and spec folder docs.
    20	
    21	- Read the voice directives (Section 2) to understand the target voice
    22	- Use word lists (Sections 5-7) as reference during writing
    23	- Run the pre-publish checklist (Section 8) before finalizing
    24	- **Scoring:** Hard blockers cost -5 points. Soft deductions cost -2 or -1. Clean document starts at 100.
   318	### Templates That Apply HVR
   319	
   320	| Template | Location | Focus |
   321	|----------|----------|-------|
   322	| Implementation Summary | `.opencode/skill/system-spec-kit/templates/*/implementation-summary.md` | Narrative prose, explain "why", direct address |
   323	| Decision Record | `.opencode/skill/system-spec-kit/templates/level_3*/decision-record.md` | Clear rationale, no hedging, active voice |
   324	| README | `.opencode/skill/sk-doc/assets/documentation/readme_template.md` | Welcoming tone, practical focus |
   325	| Install Guide | `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` | Direct instructions, imperative mood |
   326	
 succeeded in 0ms:
   440	5. **ALWAYS ask about llms.txt generation** (never auto-generate)
   441	6. **ALWAYS apply safe auto-fixes** (H2 case, separators, filenames)
   442	7. **ALWAYS validate before completion** (structure + content + style)
   443	8. **ALWAYS provide metrics** (before/after counts from script output)
   444	9. **ALWAYS run `validate_document.py` before delivery** (exit 0 required for READMEs)
   445	10. **ALWAYS enforce Human Voice Rules (HVR)** on all documentation output. Full ruleset: [hvr_rules.md](./references/global/hvr_rules.md). Quick reference: `readme_template.md` §9.
   446	
   447	#### ❌ NEVER
   448	
   449	1. **NEVER modify spec files during active development** (loose enforcement)
   450	2. **NEVER delete original content without approval**
   451	3. **NEVER block for safe violations** (only block: missing frontmatter, wrong order)
   452	4. **NEVER generate llms.txt without asking**
   453	5. **NEVER apply wrong enforcement level**
   454	6. **NEVER use banned HVR words** (leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable)
   455	
   456	#### ⚠️ ESCALATE IF
   457	
   458	1. Document type ambiguous
   459	2. Critical violations detected
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/templates/level_3/decision-record.md | sed -n '13,18p;120,126p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md | sed -n '12,18p;112,118p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    13	# Decision Record: [NAME]
    14	
    15	<!-- SPECKIT_LEVEL: 3 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
    17	<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
    18	
   120	---
   121	
   122	<!--
   123	Level 3 Decision Record (Addendum): One ADR per major decision.
   124	Write in human voice: active, direct, specific. No em dashes, no hedging.
   125	HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
   126	-->
 succeeded in 0ms:
    12	# Implementation Summary
    13	
    14	<!-- SPECKIT_LEVEL: 1 -->
    15	<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
    16	<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
    17	
    18	---
   112	---
   113	
   114	<!--
   115	CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
   116	Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
   117	HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
   118	-->
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/validation/phase_checklists.md | sed -n '12,20p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    12	<!-- ANCHOR:overview -->
    13	## 1. OVERVIEW
    14	
    15	**Priority Levels**:
    16	- **P0 (HARD BLOCKER)** - Must complete before proceeding
    17	- **P1 (MUST COMPLETE)** - Required for completion, can defer with approval
    18	- **P2 (NICE TO HAVE)** - Optional, can defer without approval
    19	
    20	> **Context**: Use these checklists during the Completion Verification Rule to ensure all requirements are met.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/validation/validation_rules.md | sed -n '312,322p;418,422p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/templates/level_2/checklist.md | sed -n '24,34p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    24	| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
    25	| **[P1]** | Required | Must complete OR get user approval |
    26	| **[P2]** | Optional | Can defer with documented reason |
    27	<!-- /ANCHOR:protocol -->
    28	
    29	---
    30	
    31	<!-- ANCHOR:pre-impl -->
    32	## Pre-Implementation
    33	
    34	- [ ] CHK-001 [P0] Requirements documented in spec.md
 succeeded in 0ms:
   312	**Description:** Validates that checklist items use proper P0/P1/P2 priority tagging format.
   313	
   314	### Priority Definitions
   315	
   316	| Priority | Meaning       | Deferral Rules                             |
   317	| -------- | ------------- | ------------------------------------------ |
   318	| **P0**   | HARD BLOCKER  | Must complete, cannot defer                |
   319	| **P1**   | Must complete | Can defer only with explicit user approval |
   320	| **P2**   | Can defer     | Can defer without approval                 |
   321	
   322	### Recognized Formats
   418	| Priority | Evidence Required | Rationale                          |
   419	| -------- | ----------------- | ---------------------------------- |
   420	| **P0**   | YES               | Critical items need strong proof   |
   421	| **P1**   | YES               | Required items need verification   |
   422	| **P2**   | NO (exempt)       | Deferrable items may be incomplete |
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/sk-doc/assets/template_rules.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        "document structure": "document_structure",
        "standard asset structure": "standard_structure",
        "standard structure": "standard_structure",
        "logic representation patterns": "logic_representation",
        "logic representation": "logic_representation",
        "decision logic examples": "decision_logic",
        "decision logic": "decision_logic",
        "workflow patterns": "workflow_patterns",
        "configuration templates": "configuration_templates",
        "template guidelines": "template_guidelines",
        "asset file checklist": "checklist",
        "asset checklist": "checklist",
        "asset maintenance": "asset_maintenance",
        "best practices summary": "best_practices",
        "asset file naming quick reference": "naming_reference",
        "naming reference": "naming_reference"
      },
      "tocRequired": false,
      "h2EmojiRequired": false
    },
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/memory/memory_system.md | sed -n '136,142p;46,52p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    46	**Content Source Behavior:**
    47	
    48	- **Memory Files** — Session-specific context generated via `generate-context.js`. Subject to temporal decay.
    49	- **Constitutional Rules** — Always-surface critical rules. Injected at top of every search result. No decay.
    50	- **Spec Documents** — Discovered via `findSpecDocuments()` which walks `.opencode/specs/`. Indexes spec folder documentation (specs, plans, tasks, checklists, decision records, implementation summaries, research, handovers) with per-type scoring multipliers. Controlled by `includeSpecDocs` parameter (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable. Causal chains are created via `createSpecDocumentChain()` linking spec->plan->tasks->implementation_summary.
    51	
    52	**Post-implementation hardening (spec 126 follow-up):**
   136	| `specFolder` | string | - | Limit scan to specific spec folder |
   137	| `force` | boolean | false | Force re-index all files (ignore content hash) |
   138	| `includeConstitutional` | boolean | true | Scan `.opencode/skill/*/constitutional/` directories |
   139	| `includeSpecDocs` | boolean | true | Scan for spec folder documents in `.opencode/specs/`. When true, discovers and indexes specs, plans, tasks, decision records, etc. with document-type scoring multipliers (11 types). Also controllable via `SPECKIT_INDEX_SPEC_DOCS` env var. |
   140	| `incremental` | boolean | true | Skip files whose mtime and content hash are unchanged since last index |
   141	
   142	| L7: Maintenance | `memory_get_learning_history()` | Get learning history (preflight/postflight records) | Analyze learning patterns |
exec
/bin/zsh -lc 'rg -n "multiplier|weight|score|documentType|importance|points|dqi" .opencode/skill/sk-doc/assets/template_rules.json' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
4:  "documentTypes": {
53:      "recommendedSections": ["success_criteria", "integration_points", "related_resources"],
61:        "integration_points": "\ud83d\udd0c",
76:        "integration points": "integration_points",
338:        "dqi_scoring": "\ud83d\udcca",
360:        "dqi scoring": "dqi_scoring",
exec
/bin/zsh -lc 'rg -n "document-type scoring|10 indexed document types|11 types|README files and skill-doc trees|template_rules.json" .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/references/memory/memory_system.md .opencode/skill/sk-doc/SKILL.md .opencode/skill/sk-doc/assets/template_rules.json' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/references/memory/memory_system.md:139:| `includeSpecDocs` | boolean | true | Scan for spec folder documents in `.opencode/specs/`. When true, discovers and indexes specs, plans, tasks, decision records, etc. with document-type scoring multipliers (11 types). Also controllable via `SPECKIT_INDEX_SPEC_DOCS` env var. |
.opencode/skill/system-spec-kit/SKILL.md:592:- **Document-type scoring** — 10 indexed document types with multipliers: spec (1.4x), plan (1.3x), constitutional (2.0x), decision_record (1.4x), tasks (1.1x), implementation_summary (1.1x), research (1.1x), checklist (1.0x), handover (1.0x), memory (1.0x). README files and skill-doc trees (`sk-*`, including `references/` and `assets/`) are excluded from memory indexing.
.opencode/skill/system-spec-kit/SKILL.md:617:| `SPECKIT_INDEX_SPEC_DOCS`    | on      | Gates spec document indexing in `memory_index_scan()`. When enabled, discovers and indexes spec folder documents (specs, plans, tasks, etc.) with document-type scoring multipliers. Set `SPECKIT_INDEX_SPEC_DOCS=false` to disable. |
exec
/bin/zsh -lc 'rg -n "6-tier|constitutional tier|importance tier|importance tiers|constitutional/|critical|important|temporary|deprecated|normal" .opencode/skill/system-spec-kit/references/memory/memory_system.md .opencode/skill/sk-code-opencode/SKILL.md .opencode/skill/sk-doc/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/SKILL.md:38:- Check critical violations (missing frontmatter, wrong section order)
.opencode/skill/sk-doc/SKILL.md:42:- Creating critical documentation (specs, knowledge, skills)
.opencode/skill/sk-doc/SKILL.md:708:- ✅ All critical issues addressed
.opencode/skill/system-spec-kit/references/memory/memory_system.md:17:The Spec Kit Memory system provides context preservation across sessions through vector-based semantic search and structured memory files. This reference covers MCP tool behavior, importance tiers, decay scoring, and configuration.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:25:| Constitutional | `constitutional/` | Always-surface rules (Gate 3 enforcement) |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:42:| **Memory Files** | `specs/*/memory/*.{md,txt}` | Varies (episodic, procedural, etc.) | `normal` | `findMemoryFiles()` |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:43:| **Constitutional Rules** | `.opencode/skill/*/constitutional/*.md` | `meta-cognitive` | `constitutional` | `findConstitutionalFiles()` |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:44:| **Spec Documents** | `.opencode/specs/**/*.md` | Per-type (spec, plan, tasks, etc.) | `normal` | `findSpecDocuments()` |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:49:- **Constitutional Rules** — Always-surface critical rules. Injected at top of every search result. No decay.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:92:- Stored in `constitutional/` folder
.opencode/skill/system-spec-kit/references/memory/memory_system.md:138:| `includeConstitutional` | boolean | true | Scan `.opencode/skill/*/constitutional/` directories |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:161:- `includeConstitutional`: Include constitutional tier memories
.opencode/skill/system-spec-kit/references/memory/memory_system.md:163:- `tier`: Filter by importance tier
.opencode/skill/system-spec-kit/references/memory/memory_system.md:178:| `tier` | string | No | - | Filter by importance tier |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:198:> **Important:** Constitutional memories ALWAYS appear at the top of search results, even when a `specFolder` filter is applied. This is BY DESIGN to ensure critical context (e.g., Gate enforcement rules) is never accidentally filtered out.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:225:// Exclude constitutional tier
.opencode/skill/system-spec-kit/references/memory/memory_system.md:241:- Token efficiency is important (large memory files)
.opencode/skill/system-spec-kit/references/memory/memory_system.md:358:Where `elapsedDays` = calendar days since the memory's `updated_at` (or `created_at`). The 30-day normalization means the decay rate applies per 30-day period. Scores below `0.001` are clamped to 0.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:365:| `critical` | 1.0 | Never decays (exempt) |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:366:| `important` | 1.0 | Never decays (exempt) |
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-code-opencode/assets/checklists/universal_checklist.md | sed -n '21,26p;246,250p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "HVR|human voice|em dash|hedging|banned words|style score|validate_document|extract_structure" .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/references/validation/validation_rules.md .opencode/skill/sk-doc/scripts .opencode/skill/sk-doc/references/global/validation.md .opencode/skill/sk-doc/references/global/workflows.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    21	| Level | Meaning | Enforcement |
    22	|-------|---------|-------------|
    23	| P0 | HARD BLOCKER | Must fix before commit |
    24	| P1 | Required | Must fix or get explicit approval |
    25	| P2 | Recommended | Can defer with justification |
    26	
   246	2. Check this universal checklist
   247	   - All P0 items must pass
   248	   - P1 items addressed or approved
   249	
   250	3. Run language-specific checklist
 succeeded in 0ms:
.opencode/skill/sk-doc/references/global/workflows.md:50:| **Script-assisted review** | 1+2 | `python scripts/extract_structure.py` + AI eval | Critical docs (specs, skills, READMEs) | JSON output + qualitative assessment + recommendations |
.opencode/skill/sk-doc/references/global/workflows.md:52:| **Content optimization** | 2 | `python scripts/extract_structure.py` + AI eval | Improve existing docs for AI | Recommendations for clarity + AI-friendliness |
.opencode/skill/sk-doc/references/global/workflows.md:53:| **Audit snapshot** | 1 (JSON only) | `python scripts/extract_structure.py` | Quality audit, no changes | JSON report for another agent |
.opencode/skill/sk-doc/references/global/workflows.md:71:- **Script**: `python scripts/validate_document.py <file>`
.opencode/skill/sk-doc/references/global/workflows.md:84:- **Script**: `python scripts/extract_structure.py <file>`
.opencode/skill/sk-doc/references/global/workflows.md:92:Run: python scripts/validate_document.py <file>  ← NEW: Format validation
.opencode/skill/sk-doc/references/global/workflows.md:100:Run: python scripts/extract_structure.py <file>
.opencode/skill/sk-doc/references/global/workflows.md:197:Phase 1: Extract structure (extract_structure.py)
.opencode/skill/sk-doc/references/global/workflows.md:232:scripts/extract_structure.py SKILL.md
.opencode/skill/sk-doc/references/global/workflows.md:241:scripts/extract_structure.py README.md
.opencode/skill/sk-doc/references/global/workflows.md:254:scripts/extract_structure.py specs/042/spec.md
.opencode/skill/sk-doc/references/global/workflows.md:273:  scripts/extract_structure.py "$file"
.opencode/skill/sk-doc/references/global/validation.md:17:Validation provides a comprehensive quality assessment framework for markdown documentation. The `extract_structure.py` script parses documents into structured JSON; AI uses this data to evaluate quality across structure, content, and style dimensions.
.opencode/skill/sk-doc/references/global/validation.md:31:**"Measure what matters, gate what guarantees quality"** - Structure ensures validity, Content ensures AI-friendliness, Style ensures consistency. AI evaluates all dimensions based on `extract_structure.py` output.
.opencode/skill/sk-doc/references/global/validation.md:41:### Stage 1: Format Validation (validate_document.py)
.opencode/skill/sk-doc/references/global/validation.md:46:python scripts/validate_document.py document.md
.opencode/skill/sk-doc/references/global/validation.md:64:**MANDATORY**: Run `validate_document.py` before delivery. Exit code 0 required.
.opencode/skill/sk-doc/references/global/validation.md:66:### Stage 2: Quality Assessment (extract_structure.py)
.opencode/skill/sk-doc/references/global/validation.md:68:**Validation uses `extract_structure.py` to parse documents, then AI evaluates:**
.opencode/skill/sk-doc/references/global/validation.md:73:SCRIPT: extract_structure.py
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/references/global/validation.md | sed -n '64,110p;178,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "HVR|human voice|em dash|semicolon|Oxford|banned words|banned phrases|style component|dqi|Style" .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/sk-doc/scripts/extract_structure.py' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/sk-doc/scripts/extract_structure.py:16:- Style validation (H2 ALL CAPS, H3 semantic emoji, section dividers)
.opencode/skill/sk-doc/scripts/extract_structure.py:939:def calculate_dqi(
.opencode/skill/sk-doc/scripts/extract_structure.py:950:    Components: Structure (40pts), Content (30pts), Style (30pts) = 100pts total.
.opencode/skill/sk-doc/scripts/extract_structure.py:1098:    # Style issues penalty (8 points - deduct for issues)
.opencode/skill/sk-doc/scripts/extract_structure.py:1115:    total_dqi = structure_score + content_score + style_score
.opencode/skill/sk-doc/scripts/extract_structure.py:1118:    if total_dqi >= 90:
.opencode/skill/sk-doc/scripts/extract_structure.py:1121:    elif total_dqi >= 75:
.opencode/skill/sk-doc/scripts/extract_structure.py:1124:    elif total_dqi >= 60:
.opencode/skill/sk-doc/scripts/extract_structure.py:1132:        'total': total_dqi,
.opencode/skill/sk-doc/scripts/extract_structure.py:1159:        checklist, content_issues, style_issues, dqi, evaluation_questions.
.opencode/skill/sk-doc/scripts/extract_structure.py:1200:    dqi = calculate_dqi(
.opencode/skill/sk-doc/scripts/extract_structure.py:1224:        'dqi': dqi,
 succeeded in 0ms:
    64	**MANDATORY**: Run `validate_document.py` before delivery. Exit code 0 required.
    65	
    66	### Stage 2: Quality Assessment (extract_structure.py)
    67	
    68	**Validation uses `extract_structure.py` to parse documents, then AI evaluates:**
    69	
    70	```
    71	INPUT: Markdown Document
    72	    ↓
    73	SCRIPT: extract_structure.py
    74	    - Parses frontmatter (values + issues)
    75	    - Extracts structure (headings, sections, code blocks)
    76	    - Calculates metrics (word count, heading depth, code ratio)
    77	    - Runs type-specific checklist
    78	    - Generates evaluation questions
    79	    ↓
    80	OUTPUT: Structured JSON
    81	    ↓
    82	AI EVALUATION:
    83	    - Reviews checklist results
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/references/global/workflows.md | sed -n '46,55p;68,105p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    46	## 2. FOUR EXECUTION MODES
    47	
    48	| Workflow | Phases | Command | Use When | Output |
    49	| --- | --- | --- | --- | --- |
    50	| **Script-assisted review** | 1+2 | `python scripts/extract_structure.py` + AI eval | Critical docs (specs, skills, READMEs) | JSON output + qualitative assessment + recommendations |
    51	| **Structure checks** | 1 | `python scripts/quick_validate.py` | File save, structural validation | Checklist results + fix list |
    52	| **Content optimization** | 2 | `python scripts/extract_structure.py` + AI eval | Improve existing docs for AI | Recommendations for clarity + AI-friendliness |
    53	| **Audit snapshot** | 1 (JSON only) | `python scripts/extract_structure.py` | Quality audit, no changes | JSON report for another agent |
    54	
    55	**Mode selection**:
    68	
    69	**Pre-Delivery Format Validation** (MANDATORY for READMEs):
    70	- **When**: Before claiming completion on any README
    71	- **Script**: `python scripts/validate_document.py <file>`
    72	- **Action**: Check TOC, H2 format, anchor format, required sections
    73	- **Blocking**: Yes - exit code 1 blocks delivery
    74	- **Auto-fix**: Use `--fix` for safe issues (single-dash anchors)
    75	
    76	**Post-Write Validation Pattern** (manual):
    77	- **When**: After Write/Edit operations on `.md` files
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/scripts/extract_structure.py | sed -n '930,1135p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "style_issues|H2|divider|intro paragraph|hvr|em dash|semicolon|banned" .opencode/skill/sk-doc/scripts/extract_structure.py' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
15:- Content quality validation (placeholders, code languages, dividers)
16:- Style validation (H2 ALL CAPS, H3 semantic emoji, section dividers)
296:# Used to validate H2 headers have proper emoji formatting
310:# Document types that require H2 emojis (blocking error if missing)
311:# Emoji enforcement has been removed — no document types require H2 emojis
355:def check_section_dividers(content: str, headings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
356:    """Check for --- dividers between H2 sections.
363:        List of issue dicts for missing dividers.
372:        has_divider = bool(re.search(r'\n---\s*\n', section_content)) or section_content.strip().endswith('---')
374:        if not has_divider:
376:                'type': 'missing_divider',
378:                'text': f"Missing --- divider before '{next_h2['text']}'",
409:    """Check H2 formatting: number + emoji + ALL CAPS for template-based types.
439:                'text': f"H2 '{text}' missing number prefix (e.g., '1. ')",
451:                'text': f"H2 '{text}' missing emoji (found: '{found_char}' where emoji expected)",
463:                'text': f"H2 section name '{section_text}' should be ALL CAPS",
525:    """Check if there's an introduction paragraph after H1 and before first H2.
533:        True if intro paragraph with sufficient words exists.
570:        True if brief intro paragraph exists.
671:    ('h2_numbered', 'H2s have number prefix', lambda fm, h, c: all(heading['has_number'] for heading in h if heading['level'] == 2)),
 succeeded in 0ms:
   930	    },
   931	    'generic': {
   932	        'word_count': (100, 5000),
   933	        'min_headings': 1,
   934	        'heading_density': (1.0, 8.0),
   935	    },
   936	}
   937	
   938	
   939	def calculate_dqi(
   940	    doc_type: str,
   941	    checklist_pass_rate: float,
   942	    metrics: Dict[str, Any],
   943	    headings: List[Dict[str, Any]],
   944	    content: str,
   945	    style_issues: List[Dict[str, Any]],
   946	    content_issues: List[Dict[str, Any]]
   947	) -> Dict[str, Any]:
   948	    """Calculate Document Quality Index (DQI) - a 100% deterministic score.
   949	
codex
I’m on the last pass now: pulling the exact lines that show what `extract_structure.py` actually scores, because that’s the deciding evidence for whether HVR is truly enforced or only documented.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/scripts/validate_document.py | sed -n '8,18p;620,640p;676,682p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/scripts/extract_structure.py | sed -n '1188,1198p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1188	    content_issues = []
  1189	    content_issues.extend(detect_placeholders(content))
  1190	    content_issues.extend(check_code_block_languages(code_blocks))
  1191	
  1192	    style_issues = []
  1193	    if doc_type in EMOJI_REQUIRED_TYPES:
  1194	        style_issues.extend(check_h2_formatting(headings, doc_type))
  1195	        style_issues.extend(check_section_dividers(content, headings))
  1196	    if doc_type == 'skill':
  1197	        style_issues.extend(check_h3_emoji_usage(headings, content))
  1198	
 succeeded in 0ms:
     8	
     9	Validates markdown documentation against template rules to ensure
    10	consistent formatting with proper TOC, H2 emojis, and section structure.
    11	
    12	Usage:
    13	    python validate_document.py <document.md> [--type readme|skill|reference|asset|agent|command|install_guide|spec]
    14	    python validate_document.py <document.md> --json
    15	    python validate_document.py <document.md> --fix [--dry-run]
    16	    python validate_document.py <document.md> --blocking-only
    17	
    18	Exit Codes:
   620	    parser.add_argument('--dry-run', action='store_true', help='Show fixes without applying (use with --fix)')
   621	    parser.add_argument('--no-exclude', action='store_true',
   622	                        help='Validate even excluded paths (pytest_cache, node_modules, etc.)')
   623	
   624	    args = parser.parse_args()
   625	
   626	    # Load rules
   627	    script_dir = Path(__file__).parent
   628	    rules = load_template_rules(script_dir)
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/assets/template_rules.json | sed -n '300,318p;397,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   300	        "feature catalog cross-reference index": "feature_catalog_cross_reference",
   301	        "feature catalog cross reference": "feature_catalog_cross_reference",
   302	        "coverage notes": "coverage_notes"
   303	      },
   304	      "tocRequired": true,
   305	      "h2EmojiRequired": false,
   306	      "h2UppercaseRequired": true
   307	    },
   308	    "spec": {
   309	      "description": "Spec-kit specification documents under specs/ folders",
   310	      "requiredSections": [],
   311	      "recommendedSections": [],
   312	      "optionalSections": [],
   313	      "sectionEmojis": {},
   314	      "sectionAliases": {},
   315	      "tocRequired": false,
   316	      "h2EmojiRequired": false,
   317	      "h2UppercaseRequired": false
   318	    },
   397	        "missing_toc",
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-doc/scripts/validate_document.py | sed -n '18,24p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    18	Exit Codes:
    19	    0 - Valid (no blocking errors)
    20	    1 - Invalid (blocking errors found)
    21	    2 - File not found or parse error
    22	
    23	Examples:
    24	    python validate_document.py README.md
codex
**Findings**

- `ALIGN-001` `INCONSISTENT`  
  `validate.sh` uses a 3-state contract: `0=pass`, `1=warnings`, `2=errors`, with `--strict` promoting warnings to `2` at runtime in [validate.sh#L92](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh#L92>) and [validate.sh#L631](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh#L631>). `verify_alignment_drift.py` is binary: `0=pass`, `1=fail`, where warnings only fail with `--fail-on-warn`, in [verify_alignment_drift.py#L458](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py#L458>) and [verify_alignment_drift.py#L485](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py#L485>). `extract_structure.py` is also binary and only uses `1` for usage/extraction failure, not warnings-vs-errors, in [extract_structure.py#L1235](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1235>) and [extract_structure.py#L1248](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1248>). One extra drift: `validate.sh` ends with a stale footer comment that no longer matches actual behavior at [validate.sh#L639](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh#L639>).

- `ALIGN-002` `BREAKING`  
  `sk-doc` HVR explicitly applies to spec-folder docs, including implementation summaries and decision records, per [hvr_rules.md#L19](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/references/global/hvr_rules.md#L19>) and the template matrix at [hvr_rules.md#L322](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/references/global/hvr_rules.md#L322>). It is also referenced directly inside spec-kit templates at [implementation-summary.md#L16](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md#L16>) and [decision-record.md#L17](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_3/decision-record.md#L17>).  
  The gap is enforcement: `sk-doc` says HVR is “ALWAYS” enforced and counted in DQI at [sk-doc/SKILL.md#L445](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L445>) and [sk-doc/SKILL.md#L674](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L674>), but `extract_structure.py` only scores H2 formatting, dividers and skill H3 emoji checks at [extract_structure.py#L1072](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1072>) and [extract_structure.py#L1192](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1192>). So HVR currently applies by policy/template guidance, not by hard script enforcement.

- `ALIGN-003` `INCONSISTENT`  
  The document-type scoring models are not aligned. `getDefaultTierForDocumentType()` maps 10 spec-memory document types into tiers in [importance-tiers.ts#L213](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts#L213>), while `sk-doc` `template_rules.json` is a structural schema registry with no scoring multipliers at all, and only a generic `spec` stub for spec-folder docs at [template_rules.json#L308](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/assets/template_rules.json#L308>).  
  There is broader drift around the same concept: system-spec-kit `SKILL.md` says “10 indexed document types” at [system-spec-kit/SKILL.md#L592](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L592>), while `memory_system.md` says “11 types” at [memory_system.md#L139](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md#L139>).

- `ALIGN-004` `INCONSISTENT`  
  The Smart Router `ambiguity_delta` is the same in `system-spec-kit` and `sk-doc` (`1.0`) at [system-spec-kit/SKILL.md#L273](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L273>), [system-spec-kit/SKILL.md#L291](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L291>), [sk-doc/SKILL.md#L239](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L239>) and [sk-doc/SKILL.md#L250](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L250>).  
  `sk-code-opencode` does not use `ambiguity_delta`; it uses a different ambiguity rule, `(best_score - second_score) <= 0.8`, in [sk-code-opencode/SKILL.md#L172](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/SKILL.md#L172>). So the answer is no.

- `ALIGN-005` `COSMETIC`  
  P0/P1/P2 semantics are broadly aligned, with only wording drift. Spec-kit checklist templates define P0/P1/P2 as hard blocker / required with approval / optional with documented reason at [level_2/checklist.md#L24](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_2/checklist.md#L24>) and the same policy is restated in [validation_rules.md#L318](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md#L318>). `sk-code-opencode` uses hard blocker / required or approved skip / can defer at [sk-code-opencode/SKILL.md#L429](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/SKILL.md#L429>) and [universal_checklist.md#L23](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/assets/checklists/universal_checklist.md#L23>).  
  Net: same policy intent, but `Optional` vs `Recommended`, and `documented reason` vs `justification`, are not word-for-word identical.

- `ALIGN-006` `COSMETIC`  
  The 6-tier importance system is not documented consistently across all three `SKILL.md` files. `system-spec-kit` clearly references importance-tier concepts at [system-spec-kit/SKILL.md#L591](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L591>) and points to the memory reference for full tier behavior at [system-spec-kit/SKILL.md#L645](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L645>). A search across the three `SKILL.md` files did not find corresponding 6-tier documentation in `sk-code-opencode` or `sk-doc`; their matches for words like “critical” are generic prose, not the tier model.  
  Net: the tier system is effectively system-spec-kit-only documentation today, not a shared cross-skill concept.

If you want, I can turn this into a compact remediation matrix with “source of truth”, “drift type” and “recommended fix”.
tokens used
115,469
**Findings**

- `ALIGN-001` `INCONSISTENT`  
  `validate.sh` uses a 3-state contract: `0=pass`, `1=warnings`, `2=errors`, with `--strict` promoting warnings to `2` at runtime in [validate.sh#L92](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh#L92>) and [validate.sh#L631](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh#L631>). `verify_alignment_drift.py` is binary: `0=pass`, `1=fail`, where warnings only fail with `--fail-on-warn`, in [verify_alignment_drift.py#L458](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py#L458>) and [verify_alignment_drift.py#L485](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py#L485>). `extract_structure.py` is also binary and only uses `1` for usage/extraction failure, not warnings-vs-errors, in [extract_structure.py#L1235](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1235>) and [extract_structure.py#L1248](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1248>). One extra drift: `validate.sh` ends with a stale footer comment that no longer matches actual behavior at [validate.sh#L639](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh#L639>).

- `ALIGN-002` `BREAKING`  
  `sk-doc` HVR explicitly applies to spec-folder docs, including implementation summaries and decision records, per [hvr_rules.md#L19](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/references/global/hvr_rules.md#L19>) and the template matrix at [hvr_rules.md#L322](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/references/global/hvr_rules.md#L322>). It is also referenced directly inside spec-kit templates at [implementation-summary.md#L16](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md#L16>) and [decision-record.md#L17](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_3/decision-record.md#L17>).  
  The gap is enforcement: `sk-doc` says HVR is “ALWAYS” enforced and counted in DQI at [sk-doc/SKILL.md#L445](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L445>) and [sk-doc/SKILL.md#L674](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L674>), but `extract_structure.py` only scores H2 formatting, dividers and skill H3 emoji checks at [extract_structure.py#L1072](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1072>) and [extract_structure.py#L1192](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py#L1192>). So HVR currently applies by policy/template guidance, not by hard script enforcement.

- `ALIGN-003` `INCONSISTENT`  
  The document-type scoring models are not aligned. `getDefaultTierForDocumentType()` maps 10 spec-memory document types into tiers in [importance-tiers.ts#L213](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts#L213>), while `sk-doc` `template_rules.json` is a structural schema registry with no scoring multipliers at all, and only a generic `spec` stub for spec-folder docs at [template_rules.json#L308](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/assets/template_rules.json#L308>).  
  There is broader drift around the same concept: system-spec-kit `SKILL.md` says “10 indexed document types” at [system-spec-kit/SKILL.md#L592](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L592>), while `memory_system.md` says “11 types” at [memory_system.md#L139](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md#L139>).

- `ALIGN-004` `INCONSISTENT`  
  The Smart Router `ambiguity_delta` is the same in `system-spec-kit` and `sk-doc` (`1.0`) at [system-spec-kit/SKILL.md#L273](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L273>), [system-spec-kit/SKILL.md#L291](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L291>), [sk-doc/SKILL.md#L239](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L239>) and [sk-doc/SKILL.md#L250](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md#L250>).  
  `sk-code-opencode` does not use `ambiguity_delta`; it uses a different ambiguity rule, `(best_score - second_score) <= 0.8`, in [sk-code-opencode/SKILL.md#L172](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/SKILL.md#L172>). So the answer is no.

- `ALIGN-005` `COSMETIC`  
  P0/P1/P2 semantics are broadly aligned, with only wording drift. Spec-kit checklist templates define P0/P1/P2 as hard blocker / required with approval / optional with documented reason at [level_2/checklist.md#L24](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_2/checklist.md#L24>) and the same policy is restated in [validation_rules.md#L318](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md#L318>). `sk-code-opencode` uses hard blocker / required or approved skip / can defer at [sk-code-opencode/SKILL.md#L429](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/SKILL.md#L429>) and [universal_checklist.md#L23](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code-opencode/assets/checklists/universal_checklist.md#L23>).  
  Net: same policy intent, but `Optional` vs `Recommended`, and `documented reason` vs `justification`, are not word-for-word identical.

- `ALIGN-006` `COSMETIC`  
  The 6-tier importance system is not documented consistently across all three `SKILL.md` files. `system-spec-kit` clearly references importance-tier concepts at [system-spec-kit/SKILL.md#L591](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L591>) and points to the memory reference for full tier behavior at [system-spec-kit/SKILL.md#L645](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md#L645>). A search across the three `SKILL.md` files did not find corresponding 6-tier documentation in `sk-code-opencode` or `sk-doc`; their matches for words like “critical” are generic prose, not the tier model.  
  Net: the tier system is effectively system-spec-kit-only documentation today, not a shared cross-skill concept.

If you want, I can turn this into a compact remediation matrix with “source of truth”, “drift type” and “recommended fix”.
