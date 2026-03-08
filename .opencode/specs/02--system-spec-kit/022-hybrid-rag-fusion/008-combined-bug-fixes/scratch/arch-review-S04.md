OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccedd-1318-7cf3-b210-757a86813b72
--------
user
You are a README coverage audit agent. Cross-check every .ts source file against its directory README.md.

WORKING DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
MCP SERVER: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/
SHARED: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/

TASK: For each of the following README.md files, list all .ts files in its directory (excluding test files, .vitest.ts, .test.ts, .spec.ts), then check if each .ts file is referenced/listed in the README.

README FILES TO CHECK (38 total):
MCP_SERVER READMES:
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md

SHARED READMES:
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/embeddings/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/scoring/README.md
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/utils/README.md

OUTPUT FORMAT:
---
DIRECTORY: [path]
README: [readme path]
TOTAL_TS_FILES: [count]
LISTED_IN_README: [count]
MISSING_FROM_README: [count]
MISSING_FILES:
- [file1.ts]
- [file2.ts]
---

At the end, provide a SUMMARY:
TOTAL_DIRECTORIES: [count]
TOTAL_TS_FILES: [count]
TOTAL_LISTED: [count]
TOTAL_MISSING: [count]
COVERAGE_PERCENTAGE: [pct]

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only audit: I’ll enumerate the `.ts` files beside each requested `README.md`, exclude test-pattern files, and then compare each filename against that README’s contents to compute coverage.
exec
/bin/zsh -lc pwd in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
 succeeded in 52ms:
AGENTS.md
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "README coverage audit: cross-check every .ts source file against its directory README.md under .opencode/skill/system-spec-kit/mcp_server and shared; report missing filenames only; no file edits" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 643ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !audit(multi), !spec, !system-spec-kit(explicit), documentation"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !intent:documentation, !readme, document, documentation~, markdown"
  },
  {
    "skill": "sk-code--review",
    "kind": "skill",
codex
Skill routing points to `system-spec-kit` and `sk-doc`, which fits this documentation audit. I’m loading just the minimal guidance from those skill files, then I’ll run the coverage check across the requested README set.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:

 succeeded in 51ms:
---
name: sk-doc
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts and install guides."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.2.0
---

<!-- Keywords: sk-doc, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows and (4) Install guide creation for setup documentation.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations.


## 1. WHEN TO USE

Plan update
User specified: "Cross-check every .ts source file against its directory README.md." I’ve confirmed the task is read-only, loaded the relevant documentation skills, and I’m now collecting the per-directory file inventory and README coverage data.
  → Gather the requested README paths and enumerate non-test .ts files in each sibling directory
  • Compare each filename against its directory README.md and compute per-directory coverage
  • Assemble the required block-by-block audit report and overall summary
codex
I’ve got the routing and scope locked in. Next I’m running a single pass over the 38 target directories so the counts and missing-file lists all come from the same comparison logic.
codex
The first pass tripped over the sandbox’s temp-file restriction, so I’m switching to an inline `node -e` audit script instead of a heredoc. Same logic, just a sandbox-safe execution path.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const readmes=[\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/embeddings/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/scoring/README.md\",\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/utils/README.md\"]; const exclude=[\".test.ts\",\".spec.ts\",\".vitest.ts\"]; let totalTs=0,totalListed=0,totalMissing=0; for (const readme of readmes){ const dir=path.dirname(readme); const text=fs.existsSync(readme)?fs.readFileSync(readme,\"utf8\"):\"\"; const tsFiles=fs.existsSync(dir)?fs.readdirSync(dir).filter(name=>name.endsWith(\".ts\") && "'!exclude.some(s=>name.endsWith(s)) && fs.statSync(path.join(dir,name)).isFile()).sort():[]; const listed=tsFiles.filter(name=>text.includes(name)); const missing=tsFiles.filter(name=>!text.includes(name)); totalTs+=tsFiles.length; totalListed+=listed.length; totalMissing+=missing.length; console.log("---"); console.log(`DIRECTORY: ${dir}`); console.log(`README: ${readme}`); console.log(`TOTAL_TS_FILES: ${tsFiles.length}`); console.log(`LISTED_IN_README: ${listed.length}`); console.log(`MISSING_FROM_README: ${missing.length}`); console.log("MISSING_FILES:"); if (missing.length){ for (const name of missing) console.log(`- ${name}`); } else { console.log("- None"); } console.log("---'"\\n\"); } const coverage=totalTs?((totalListed/totalTs)*100).toFixed(2):\"100.00\"; console.log(\"SUMMARY:\"); console.log("'`TOTAL_DIRECTORIES: ${readmes.length}`); console.log(`TOTAL_TS_FILES: ${totalTs}`); console.log(`TOTAL_LISTED: ${totalListed}`); console.log(`TOTAL_MISSING: ${totalMissing}`); console.log(`COVERAGE_PERCENTAGE: ${coverage}%`);'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
TOTAL_TS_FILES: 5
LISTED_IN_README: 5
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md
TOTAL_TS_FILES: 6
LISTED_IN_README: 6
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

Plan update
The audit pass completed successfully. I compared each requested README against the immediate non-test `.ts` files in its directory and computed the final coverage totals.
  ✓ Gather the requested README paths and enumerate non-test .ts files in each sibling directory
  ✓ Compare each filename against its directory README.md and compute per-directory coverage
  ✓ Assemble the required block-by-block audit report and overall summary
codex
---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
TOTAL_TS_FILES: 5
LISTED_IN_README: 5
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md
TOTAL_TS_FILES: 6
LISTED_IN_README: 6
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md
TOTAL_TS_FILES: 3
LISTED_IN_README: 3
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md
TOTAL_TS_FILES: 0
LISTED_IN_README: 0
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md
TOTAL_TS_FILES: 3
LISTED_IN_README: 3
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
TOTAL_TS_FILES: 29
LISTED_IN_README: 29
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 1
MISSING_FROM_README: 3
MISSING_FILES:
- memory-surface.ts
- mutation-feedback.ts
- response-hints.ts
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md
TOTAL_TS_FILES: 10
LISTED_IN_README: 10
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md
TOTAL_TS_FILES: 0
LISTED_IN_README: 0
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md
TOTAL_TS_FILES: 3
LISTED_IN_README: 3
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md
TOTAL_TS_FILES: 15
LISTED_IN_README: 15
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/manage
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md
TOTAL_TS_FILES: 7
LISTED_IN_README: 7
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
TOTAL_TS_FILES: 47
LISTED_IN_README: 47
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
TOTAL_TS_FILES: 12
LISTED_IN_README: 12
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
TOTAL_TS_FILES: 0
LISTED_IN_README: 0
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md
TOTAL_TS_FILES: 7
LISTED_IN_README: 7
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/utils
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md
TOTAL_TS_FILES: 6
LISTED_IN_README: 6
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/README.md
TOTAL_TS_FILES: 8
LISTED_IN_README: 8
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/embeddings
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/embeddings/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/scoring
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/scoring/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/utils
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/utils/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

SUMMARY:
TOTAL_DIRECTORIES: 38
TOTAL_TS_FILES: 206
TOTAL_LISTED: 203
TOTAL_MISSING: 3
COVERAGE_PERCENTAGE: 98.54%
tokens used
34,873
---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
TOTAL_TS_FILES: 5
LISTED_IN_README: 5
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md
TOTAL_TS_FILES: 6
LISTED_IN_README: 6
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md
TOTAL_TS_FILES: 3
LISTED_IN_README: 3
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md
TOTAL_TS_FILES: 0
LISTED_IN_README: 0
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md
TOTAL_TS_FILES: 3
LISTED_IN_README: 3
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
TOTAL_TS_FILES: 29
LISTED_IN_README: 29
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 1
MISSING_FROM_README: 3
MISSING_FILES:
- memory-surface.ts
- mutation-feedback.ts
- response-hints.ts
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md
TOTAL_TS_FILES: 10
LISTED_IN_README: 10
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md
TOTAL_TS_FILES: 0
LISTED_IN_README: 0
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md
TOTAL_TS_FILES: 3
LISTED_IN_README: 3
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md
TOTAL_TS_FILES: 15
LISTED_IN_README: 15
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/manage
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md
TOTAL_TS_FILES: 7
LISTED_IN_README: 7
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
TOTAL_TS_FILES: 47
LISTED_IN_README: 47
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
TOTAL_TS_FILES: 12
LISTED_IN_README: 12
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
TOTAL_TS_FILES: 0
LISTED_IN_README: 0
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md
TOTAL_TS_FILES: 7
LISTED_IN_README: 7
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/utils
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md
TOTAL_TS_FILES: 6
LISTED_IN_README: 6
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/README.md
TOTAL_TS_FILES: 8
LISTED_IN_README: 8
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/embeddings
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/embeddings/README.md
TOTAL_TS_FILES: 2
LISTED_IN_README: 2
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/scoring
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/scoring/README.md
TOTAL_TS_FILES: 1
LISTED_IN_README: 1
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

---
DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/utils
README: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/utils/README.md
TOTAL_TS_FILES: 4
LISTED_IN_README: 4
MISSING_FROM_README: 0
MISSING_FILES:
- None
---

SUMMARY:
TOTAL_DIRECTORIES: 38
TOTAL_TS_FILES: 206
TOTAL_LISTED: 203
TOTAL_MISSING: 3
COVERAGE_PERCENTAGE: 98.54%
