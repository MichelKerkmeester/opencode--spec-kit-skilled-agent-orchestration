OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-9e44-72f0-aa47-70297648079d
--------
user
You are a feature catalog verification agent. Read each feature snippet file in: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/ (13 files), /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/ (5 files), /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/ (7 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying each feature snippet against the actual `system-spec-kit` MCP server code, checking the listed paths, and looking for missing implementation files. First I’m loading the local guidance that applies here and running the required skill routing so we stay aligned with the repo’s workflow.
exec
/bin/zsh -lc "printf '18 ux-hooks: '; rg --files .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks | wc -l && printf '19 decisions-and-deferrals: '; rg --files .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals | wc -l && printf '20 feature-flag-reference: '; rg --files .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference | wc -l" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md' -g '.opencode/**/AGENTS.md' . /Users/michelkerkmeester/MEGA/Development/Opencode\\ Env/Public" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
18 ux-hooks:       13
19 decisions-and-deferrals:        5
20 feature-flag-reference:        7
 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/AGENTS.md
./AGENTS.md
./.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
./.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog snippet files in 18--ux-hooks, 19--decisions-and-deferrals, and 20--feature-flag-reference against source files in .opencode/skill/system-spec-kit/mcp_server; check current reality accuracy, listed path validity, and missing important source files; output structured verification per feature file" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 716ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, file"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !opencode, check~, opencode(name), system"
  },
  {
    "skill": "sk-code--full-stack",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit` (recommended at 0.95 confidence). I’m loading just the parts of that skill relevant to feature-catalog verification, then I’ll audit the 25 snippet files against the `mcp_server` implementation and compile the result in your exact template.
Plan update
  → Read the relevant `system-spec-kit` skill guidance and identify the feature files plus their referenced source paths.
  • Compare each feature snippet’s `Current Reality` and `Source Files` against the actual `mcp_server` code, including missing implementation files.
  • Assemble the per-feature verification report in the user’s required output format.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "printf '18 files\\n'; rg --files .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks && printf '\\n19 files\\n'; rg --files .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals && printf '\\n20 files\\n'; rg --files .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
Total output lines: 1825

.opencode/skill/system-spec-kit/mcp_server/.github/hooks/superset-notify.json
.opencode/skill/system-spec-kit/mcp_server/.node-version-marker
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
.opencode/skill/system-spec-kit/mcp_server/LICENSE
.opencode/skill/system-spec-kit/mcp_server/README.md
.opencode/skill/system-spec-kit/mcp_server/_pending
.opencode/skill/system-spec-kit/mcp_server/api/README.md
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
.opencode/skill/system-spec-kit/mcp_server/api/index.ts
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
.opencode/skill/system-spec-kit/mcp_server/api/search.ts
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
.opencode/skill/system-spec-kit/mcp_server/cli.ts
.opencode/skill/system-spec-kit/mcp_server/configs/README.md
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
 succeeded in 52ms:
18 files
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exposure.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md

19 files
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/04-implemented-memory-summary-generation.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/05-implemented-cross-document-entity-linking.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md
codex
I’ve got the feature set and the MCP server tree loaded. Next I’m extracting each snippet’s `Current Reality` and `Source Files` so I can check them systematically against the live TypeScript modules and tests instead of eyeballing them one by one.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path');const dirs=['.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks','.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals','.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference'];for(const dir of dirs){for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort()){const full=path.join(dir,file);const text=fs.readFileSync(full,'utf8');const current=((text.match(/## Current Reality\\n([\\s\\S]*?)(?:\\n## |"'$)/))||['"'',''])[1].trim();const sources=((text.match(/## Source Files\\n([\\s\\S]*?)(?:\\n## |"'$)/))||['"'',''])[1].split('\\n').map(l=>l.trim()).filter(Boolean);console.log('---');console.log(file);console.log('CURRENT_REALITY:');console.log(current.replace(/\\n+/g,'\\n'));console.log('SOURCE_FILES:');for(const s of sources)console.log(s);}}\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 1699

---
01-shared-post-mutation-hook-wiring.md
CURRENT_REALITY:
Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.
SOURCE_FILES:
### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
codex
The catalog snippets are a bit mixed: some have explicit source-file tables, while the feature-flag reference files embed source paths inside the `Current Reality` flag table itself. I’m normalizing both formats now so I can validate every referenced module and spot omissions consistently.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path');const root='.opencode/skill/system-spec-kit';const dirs=['feature_catalog/18--ux-hooks','feature_catalog/19--decisions-and-deferrals','feature_catalog/20--feature-flag-reference'];for(const rel of dirs){const dir=path.join(root,rel);for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort()){const text=fs.readFileSync(path.join(dir,file),'utf8');const sec=((text.match(/## Source Files\\n([\\s\\S]*?)(?:\\n## |"'$)/))||['"'',''])[1];const curr=((text.match(/## Current Reality\\n([\\s\\S]*?)(?:\\n## |"'$)/))||['"'',''])[1];const srcText = /Source file references are included/.test(sec) ? curr : sec; const paths=[...new Set([...srcText.matchAll(/"'`([''^`]*'"\\/(?:["'^`]+))`/g)].map(m=>m[1]).filter(p=>/'"\\.(ts|js|json|md)"'$/.test(p)||p.includes('"'/')))].sort(); console.log('--- '+file); for(const p of paths) console.log(p);}}\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
zsh:1: parse error near `[^'
zsh:1: parse error in command substitution
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const dirs=[\"feature_catalog/18--ux-hooks\",\"feature_catalog/19--decisions-and-deferrals\",\"feature_catalog/20--feature-flag-reference\"];for(const rel of dirs){const dir=path.join(root,rel);for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){const text=fs.readFileSync(path.join(dir,file),\"utf8\");const sec=((text.match(/## Source Files\\n([\\s\\S]*?)(?:\\n## |"'$)/))||["",""])[1];const curr=((text.match(/## Current Reality'"\\n([\\s\\S]*?)(?:\\n## |"'$)/))||["",""])[1];const srcText=/Source file references are included/.test(sec)?curr:sec;const paths=[...new Set([...srcText.matchAll(/`([''^`]*'"\\/(?:["'^`]+))`/g)].map(m=>m[1]).filter(p=>/'"\\.(ts|js|json|md)"'$/.test(p)||p.includes("/")))].sort();console.log("--- "+file);for(const p of paths)console.log(p);}}'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
--- 01-shared-post-mutation-hook-wiring.md
mcp_server/configs/cognitive.ts
mcp_server/core/config.ts
mcp_server/handlers/memory-crud-types.ts
mcp_server/handlers/mutation-hooks.ts
mcp_server/hooks/memory-surface.ts
mcp_server/hooks/mutation-feedback.ts
mcp_server/lib/cache/embedding-cache.ts
mcp_server/lib/cache/tool-cache.ts
mcp_server/lib/cognitive/co-activation.ts
mcp_server/lib/graph/graph-signals.ts
mcp_server/lib/interfaces/vector-store.ts
mcp_server/lib/parsing/content-normalizer.ts
mcp_server/lib/parsing/trigger-matcher.ts
mcp_server/lib/providers/embeddings.ts
mcp_server/lib/scoring/interference-scoring.ts
mcp_server/lib/search/bm25-index.ts
mcp_server/lib/search/retrieval-directives.ts
mcp_server/lib/search/vector-index-aliases.ts
mcp_server/lib/search/vector-index-mutations.ts
codex
I’ve confirmed the catalog is using more than one path convention: some entries point to `mcp_server/...` explicitly, while the flag reference tables use paths like `lib/...` that need to be resolved relative to `mcp_server/`. I’m checking existence with that normalization so we don’t mark valid references as broken just because the snippet omits the base prefix.
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit -maxdepth 2 -type d | sort | rg '/(mcp_server|shared)"'$|/mcp_server/(lib|handlers|hooks|core|schemas|tests|tools|utils|configs|formatters|api)$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const dirs=[\"feature_catalog/18--ux-hooks\",\"feature_catalog/19--decisions-and-deferrals\",\"feature_catalog/20--feature-flag-reference\"];const norm=p=>p.startsWith(\"mcp_server/\")||p.startsWith(\"shared/\")?p:"'`mcp_server/${p}`;for(const rel of dirs){const dir=path.join(root,rel);for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(".md")).sort()){const text=fs.readFileSync(path.join(dir,file),"utf8");const sec=((text.match(/## Source Files'"\\n([\\s\\S]*?)(?:\\n## |"'$)/))||["",""])[1];const curr=((text.match(/## Current Reality'"\\n([\\s\\S]*?)(?:\\n## |"'$)/))||["",""])[1];const srcText=/Source file references are included/.test(sec)?curr:sec;let paths=[...new Set([...srcText.matchAll(/`([''^`]*'"\\/(?:["'^`]+))`/g)].map(m=>m[1]).filter(p=>/'"\\.(ts|js|json|md)"'$/.test(p)||p.includes("/")))].sort();paths=paths.filter(p=>!p.startsWith("/''^")&&!p.includes("total_edges / total_memories")&&!p.includes("sMax +")&&!p.includes(" Exports ")&&!p.startsWith(", max 100 chars"));const invalid=[];for(const p of paths){const resolved=path.join(root,norm(p));if(!fs.existsSync(resolved))invalid.push(norm(p));}console.log(JSON.stringify({file, count: paths.length, invalid}, null, 0));}}'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server
.opencode/skill/system-spec-kit/mcp_server/api
.opencode/skill/system-spec-kit/mcp_server/configs
.opencode/skill/system-spec-kit/mcp_server/core
.opencode/skill/system-spec-kit/mcp_server/formatters
.opencode/skill/system-spec-kit/mcp_server/handlers
.opencode/skill/system-spec-kit/mcp_server/hooks
.opencode/skill/system-spec-kit/mcp_server/lib
.opencode/skill/system-spec-kit/mcp_server/schemas
.opencode/skill/system-spec-kit/mcp_server/tests
.opencode/skill/system-spec-kit/mcp_server/tools
.opencode/skill/system-spec-kit/mcp_server/utils
.opencode/skill/system-spec-kit/shared
.opencode/skill/system-spec-kit/shared/mcp_server
 succeeded in 52ms:
{"file":"01-shared-post-mutation-hook-wiring.md","count":69,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"02-memory-health-autorepair-metadata.md","count":183,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"03-checkpoint-delete-confirmname-safety.md","count":105,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"04-schema-and-type-contract-synchronization.md","count":13,"invalid":[]}
{"file":"05-dedicated-ux-hook-modules.md","count":71,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"06-mutation-hook-result-contract-expansion.md","count":69,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"07-mutation-response-ux-payload-exposure.md","count":17,"invalid":[]}
{"file":"08-context-server-success-hint-append.md","count":365,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"09-duplicate-save-no-op-feedback-hardening.md","count":178,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"10-atomic-save-parity-and-partial-indexing-hints.md","count":155,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"11-final-token-metadata-recomputation.md","count":2,"invalid":[]}
{"file":"12-hooks-readme-and-export-alignment.md","count":71,"invalid":["mcp_server/tests/retry.vitest.ts"]}
{"file":"13-end-to-end-success-envelope-verification.md","count":15,"invalid":[]}
{"file":"01-int8-quantization-evaluation.md","count":0,"invalid":[]}
{"file":"02-implemented-graph-centrality-and-community-detection.md","count":4,"invalid":[]}
{"file":"03-implemented-auto-entity-extraction.md","count":12,"invalid":[]}
{"file":"04-implemented-memory-summary-generation.md","count":8,"invalid":[]}
{"file":"05-implemented-cross-document-entity-linking.md","count":7,"invalid":[]}
{"file":"01-1-search-pipeline-features-speckit.md","count":37,"invalid":["mcp_server/. The env var is retained for compatibility/testing context but does not enable production scoring paths. |\n| ","mcp_server/lib/search/rrf-fusion.ts"]}
{"file":"02-2-session-and-cache.md","count":3,"invalid":[]}
exec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts && echo exists || echo missing' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit | rg 'rrf-fusion\\.ts"'$|retry'"\\.vitest\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
missing
 succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit | rg 'retry\\.vitest\\.ts"'$|shared/utils/retry'"\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/utils/retry.ts
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit/feature_catalog\";const dirs=[\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"];for(const dirRel of dirs){const dir=path.join(root,dirRel);for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){const text=fs.readFileSync(path.join(dir,file),\"utf8\");const current=((text.match(/## Current Reality\\n([\\s\\S]*?)(?:\\n## |"'$)/))||["",""])[1].trim();console.log("--- "+file);console.log(current);}}'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
--- 01-shared-post-mutation-hook-wiring.md
Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.
--- 02-memory-health-autorepair-metadata.md
`memory_health` now accepts optional `autoRepair` execution and returns structured repair metadata. Callers can trigger repair work intentionally and inspect what changed from handler output.
--- 03-checkpoint-delete-confirmname-safety.md
Checkpoint deletion now requires a matching `confirmName` safety parameter before destructive action proceeds. The finalized follow-up pass enforced that requirement across handler, schema, tool-schema, and tool-type layers so callers cannot bypass it through a looser boundary. Successful deletion responses also report the confirmation outcome through `safetyConfirmationUsed=true` plus deletion metadata.
--- 04-schema-and-type-contract-synchronization.md
Phase 014 aligned runtime validation and TypeScript contracts for the new mutation-safety behavior. Tool schemas and types were updated together so added parameters and output metadata remain consistent across handler logic, schema validation, and tool typing. The finalized follow-up closures specifically synced required `confirmName` enforcement and the updated mutation response metadata contract across all layers.
--- 05-dedicated-ux-hook-modules.md
Phase 014 introduced dedicated UX hook modules for mutation feedback and response hints. This separated UX hook logic from individual mutation handlers and standardized post-mutation UX behavior through shared module boundaries.
--- 06-mutation-hook-result-contract-expansion.md
The shared mutation hook result contract was expanded to include `latencyMs` and cache-clear booleans. Callers now receive explicit timing and cache invalidation signals from post-mutation hook execution.
--- 07-mutation-response-ux-payload-exposure.md
Mutation responses now expose UX payload data produced by post-mutation hooks, including `postMutationHooks` and hint strings. This makes UX guidance available directly in tool responses on successful mutation paths. The finalized follow-up pass also hardened duplicate-save no-op behavior so no false `postMutationHooks` or cache-clearing hints are emitted when caches remain unchanged.
--- 08-context-server-success-hint-append.md
The context-server success path now appends UX hints through `appendAutoSurfaceHints` while preserving the existing `autoSurfacedContext` payload. This adds guidance without changing the established context auto-surface contract. The finalized implementation runs that append step before token-budget enforcement and recomputes final token metadata from the completed envelope.
--- 09-duplicate-save-no-op-feedback-hardening.md
Duplicate-content save no-op responses no longer emit false `postMutationHooks`, cache-clear booleans, or misleading invalidation hints. They now explain that the save was a no-op and that caches were left unchanged, so callers receive accurate mutation feedback without pretending a hook ran.
--- 10-atomic-save-parity-and-partial-indexing-hints.md
`atomicSaveMemory()` now returns the same `postMutationHooks` envelope shape and UX hint payloads as the primary save path. The finalized follow-up pass also preserved structured partial-indexing guidance so callers can handle atomic-save outcomes with the same parsing and recovery flow used for standard saves.
codex
The flag-reference set is where drift is most likely, so I’m cross-checking those entries by searching each env var in the live source tree rather than trusting the table labels. That lets me catch both stale descriptions and cases where the cited “source file” isn’t where the behavior actually lives anymore.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const dir=\".opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference\";for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){const text=fs.readFileSync(path.join(dir,file),\"utf8\");const vars=[...text.matchAll(/"'`([A-Z][A-Z0-9_]+)`/g)].map(m=>m[1]).filter(v=>v===v.toUpperCase());const uniq=[...new Set(vars)];console.log("--- "+file);console.log(uniq.join(" "));}'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
--- 01-1-search-pipeline-features-speckit.md
SPECKIT_ABLATION SPECKIT_ARCHIVAL SPECKIT_AUTO_ENTITIES SPECKIT_ENTITY_LINKING SPECKIT_AUTO_RESUME SPECKIT_ROLLOUT_PERCENT SPECKIT_CAUSAL_BOOST SPECKIT_CHANNEL_MIN_REP SPECKIT_CLASSIFICATION_DECAY SPECKIT_COACTIVATION SPECKIT_COACTIVATION_STRENGTH SPECKIT_COGNITIVE_COACTIVATION_FLAGS SPECKIT_COGNITIVE_COACTIVATION_PATTERN SPECKIT_COMMUNITY_DETECTION SPECKIT_COMPLEXITY_ROUTER SPECKIT_CONFIDENCE_TRUNCATION SPECKIT_CONSOLIDATION SPECKIT_CONSUMPTION_LOG SPECKIT_CONTEXT_HEADERS SPECKIT_CROSS_ENCODER SPECKIT_DASHBOARD_LIMIT SPECKIT_DEBUG_INDEX_SCAN SPECKIT_DEGREE_BOOST SPECKIT_DOCSCORE_AGGREGATION SPECKIT_DYNAMIC_INIT SPECKIT_DYNAMIC_TOKEN_BUDGET SPECKIT_EAGER_WARMUP SPECKIT_EMBEDDING_EXPANSION SPECKIT_ENCODING_INTENT SPECKIT_ENTITY_LINKING_MAX_DENSITY SPECKIT_EVAL_LOGGING SPECKIT_EVENT_DECAY SPECKIT_EXTENDED_TELEMETRY SPECKIT_EXTRACTION SPECKIT_FILE_WATCHER SQLITE_BUSY SPECKIT_FOLDER_DISCOVERY SPECKIT_FOLDER_SCORING SPECKIT_FOLDER_TOP_K SPECKIT_GRAPH_SIGNALS SPECKIT_GRAPH_UNIFIED SPECKIT_INDEX_SPEC_DOCS SPECKIT_INTERFERENCE_SCORE SPECKIT_LAZY_LOADING SPECKIT_LEARN_FROM_SELECTION SPECKIT_MEMORY_SUMMARIES SPECKIT_MMR INTENT_LAMBDA_MAP SPECKIT_MULTI_QUERY SPECKIT_NEGATIVE_FEEDBACK SPECKIT_NOVELTY_BOOST SPECKIT_PIPELINE_V2 SPECKIT_PRESSURE_POLICY SPECKIT_QUALITY_LOOP SPECKIT_RECONSOLIDATION SPECKIT_RELATIONS SPECKIT_RESPONSE_TRACE SPECKIT_RRF SPECKIT_RSF_FUSION SPECKIT_SAVE_QUALITY_GATE SPECKIT_SCORE_NORMALIZATION SPECKIT_SEARCH_FALLBACK SPECKIT_SESSION_BOOST SPECKIT_SHADOW_SCORING SPECKIT_SIGNAL_VOCAB SPECKIT_SKIP_API_VALIDATION SPECKIT_STRICT_SCHEMAS SPECKIT_TRM SPECKIT_WORKING_MEMORY
--- 02-2-session-and-cache.md
DISABLE_SESSION_DEDUP ENABLE_BM25 ENABLE_TOOL_CACHE SESSION_DEDUP_DB_UNAVAILABLE_MODE SESSION_MAX_ENTRIES SESSION_TTL_MINUTES STALE_CLEANUP_INTERVAL_MS STALE_SESSION_THRESHOLD_MS TOOL_CACHE_CLEANUP_INTERVAL_MS TOOL_CACHE_MAX_ENTRIES TOOL_CACHE_TTL_MS
--- 03-3-mcp-configuration.md
MCP_ANCHOR_STRICT MCP_CHARS_PER_TOKEN MCP_DUPLICATE_THRESHOLD MCP_MAX_CONTENT_LENGTH MCP_MAX_MEMORY_TOKENS MCP_MIN_CONTENT_LENGTH MCP_TOKEN_WARNING_THRESHOLD
--- 04-4-memory-and-storage.md
MEMORY_ALLOWED_PATHS MEMORY_BASE_PATH MEMORY_DB_DIR SPEC_KIT_DB_DIR MEMORY_DB_PATH SPECKIT_DB_DIR SPEC_KIT_BATCH_DELAY_MS SPEC_KIT_BATCH_SIZE
--- 05-5-embedding-and-api.md
COHERE_API_KEY EMBEDDING_DIM EMBEDDINGS_PROVIDER OPENAI_API_KEY RERANKER_LOCAL SPECKIT_RERANKER_MODEL VOYAGE_API_KEY
--- 06-6-debug-and-telemetry.md
DEBUG_TRIGGER_MATCHER LOG_LEVEL SPECKIT_EVAL_LOGGING SPECKIT_DEBUG_INDEX_SCAN SPECKIT_EXTENDED_TELEMETRY SPECKIT_CONSUMPTION_LOG
--- 07-7-ci-and-build-informational.md
BRANCH_NAME GIT_BRANCH CI_COMMIT_REF_NAME VERCEL_GIT_COMMIT_REF
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit/mcp_server\";const featureDir=\".opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference\";function walk(dir,res=[]){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if([\"dist\",\"node_modules\",\"database\"].includes(ent.name)) continue;const full=path.join(dir,ent.name);if(ent.isDirectory()) walk(full,res); else if(/\\.(ts|js|json|md)"'$/.test(ent.name)) res.push(full);}return res;}const files=walk(root);for(const md of fs.readdirSync(featureDir).filter(f=>f.endsWith('"'.md')).sort()){const text=fs.readFileSync(path.join(featureDir,md),'utf8');const vars=[...new Set([...text.matchAll(/"'`([A-Z][A-Z0-9_]+)`/g)].map(m=>m[1]).filter(v=>!/''^(SQLITE_BUSY|INTENT_LAMBDA_MAP)$/.test(v)))];console.log('"'--- '+md);for(const v of vars){const hits=files.filter(f=>fs.readFileSync(f,'utf8').includes(v)).map(f=>f.replace(/"'^'"\\.opencode\\/skill\\/system-spec-kit\\/mcp_server\\//,''));console.log(v+': '+(hits.join(', ')||'NONE'));}}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
[eval]:1
const fs=require("fs"),path=require("path");const root=".opencode/skill/system-spec-kit/mcp_server";const featureDir=".opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference";function walk(dir,res=[]){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(["dist","node_modules","database"].includes(ent.name)) continue;const full=path.join(dir,ent.name);if(ent.isDirectory()) walk(full,res); else if(/\.(ts|js|json|md)$/.test(ent.name)) res.push(full);}return res;}const files=walk(root);for(const md of fs.readdirSync(featureDir).filter(f=>f.endsWith(.md)).sort()){const text=fs.readFileSync(path.join(featureDir,md),utf8);const vars=[...new Set([...text.matchAll(/`([A-Z][A-Z0-9_]+)`/g)].map(m=>m[1]).filter(v=>!/^(SQLITE_BUSY|INTENT_LAMBDA_MAP)$/.test(v)))];console.log(---
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ^
Expression expected

SyntaxError: Unexpected token '.'
    at makeContextifyScript (node:internal/vm:194:14)
    at compileScript (node:internal/process/execution:388:10)
    at evalTypeScript (node:internal/process/execution:260:22)
    at node:internal/main/eval_string:71:3

Node.js v25.6.1
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit/mcp_server\";const featureDir=\".opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference\";function walk(dir,res=[]){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if([\"dist\",\"node_modules\",\"database\"].includes(ent.name)) continue;const full=path.join(dir,ent.name);if(ent.isDirectory()) walk(full,res); else if(/\\.(ts|js|json|md)"'$/.test(ent.name)) res.push(full);}return res;}const files=walk(root);for(const md of fs.readdirSync(featureDir).filter(f=>f.endsWith(".md")).sort()){const text=fs.readFileSync(path.join(featureDir,md),"utf8");const vars=[...new Set([...text.matchAll(/`([A-Z][A-Z0-9_]+)`/g)].map(m=>m[1]).filter(v=>!/''^(SQLITE_BUSY|INTENT_LAMBDA_MAP)$/.test(v)))];console.log("--- "+md);for(const v of vars){const hits=files.filter(f=>fs.readFileSync(f,"utf8").includes(v)).map(f=>f.replace(/''^'"\\.opencode\\/skill\\/system-spec-kit\\/mcp_server\\//,\"\"));console.log(v+\": \"+(hits.join(\", \")||\"NONE\"));}}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 2.49s:
SPECKIT_AUTO_ENTITIES: README.md, lib/extraction/README.md, lib/extraction/entity-extractor.ts, lib/search/README.md, lib/search/search-flags.ts, tests/deferred-features-integration.vitest.ts, tests/flag-ceiling.vitest.ts
SPECKIT_ENTITY_LINKING: README.md, lib/search/README.md, lib/search/entity-linker.ts, lib/search/search-flags.ts, tests/deferred-features-integration.vitest.ts, tests/entity-linker.vitest.ts, tests/flag-ceiling.vitest.ts
SPECKIT_AUTO_RESUME: handlers/memory-context.ts, tests/handler-memory-context.vitest.ts, tests/rollout-policy.vitest.ts
SPECKIT_ROLLOUT_PERCENT: handlers/memory-context.ts, lib/cognitive/rollout-policy.ts, lib/search/search-flags.ts, tests/adaptive-fusion.vitest.ts, tests/handler-memory-context.vitest.ts, tests/rollout-policy.vitest.ts, tests/working-memory-event-decay.vitest.ts
SPECKIT_CAUSAL_BOOST: README.md, lib/eval/data/ground-truth.json, lib/search/causal-boost.ts, tests/causal-boost.vitest.ts, tests/phase2-integration.vitest.ts, tests/rollout-policy.vitest.ts, tool-schemas.ts
SPECKIT_CHANNEL_MIN_REP: README.md, lib/search/channel-enforcement.ts, lib/search/channel-representation.ts, lib/search/hybrid-search.ts, tests/channel-enforcement.vitest.ts, tests/channel-representation.vitest.ts, tests/cross-feature-integration-eval.vitest.ts, tests/feature-eval-query-intelligence.vitest.ts, tests/query-router-channel-interaction.vitest.ts, tests/search-fallback-tiered.vitest.ts
SPECKIT_CLASSIFICATION_DECAY: README.md, lib/cognitive/fsrs-scheduler.ts, lib/scoring/composite-scoring.ts, lib/search/README.md, tests/composite-scoring.vitest.ts, tests/decay.vitest.ts, tests/feature-eval-scoring-calibration.vitest.ts
SPECKIT_COACTIVATION: lib/cognitive/README.md, lib/cognitive/co-activation.ts, lib/search/pipeline/stage2-fusion.ts, tests/co-activation.vitest.ts, tests/cross-feature-integration-eval.vitest.ts, tests/rrf-degree-channel.vitest.ts
SPECKIT_COACTIVATION_STRENGTH: lib/cognitive/co-activation.ts, tests/co-activation.vitest.ts, tests/rrf-degree-channel.vitest.ts
SPECKIT_COGNITIVE_COACTIVATION_FLAGS: configs/cognitive.ts, tests/config-cognitive.vitest.ts
SPECKIT_COGNITIVE_COACTIVATION_PATTERN: configs/cognitive.ts, tests/config-cognitive.vitest.ts
SPECKIT_COMMUNITY_DETECTION: lib/graph/community-detection.ts, lib/search/README.md, lib/search/search-flags.ts, tests/deferred-features-integration.vitest.ts, tests/flag-ceiling.vitest.ts
SPECKIT_COMPLEXITY_ROUTER: README.md, lib/search/embedding-expansion.ts, lib/search/hybrid-search.ts, lib/search/query-classifier.ts, lib/search/query-router.ts, tests/cross-feature-integration-eval.vitest.ts, tests/embedding-expansion.vitest.ts, tests/feature-eval-query-intelligence.vitest.ts, tests/graph-regression-flag-off.vitest.ts, tests/hybrid-search.vitest.ts, tests/pipeline-integration.vitest.ts, tests/query-classifier.vitest.ts, tests/query-router-channel-interaction.vitest.ts, tests/query-router.vitest.ts, tests/search-fallback-tiered.vitest.ts, tests/shadow-comparison.vitest.ts
SPECKIT_CONFIDENCE_TRUNCATION: README.md, lib/search/confidence-truncation.ts, lib/search/hybrid-search.ts, tests/confidence-truncation.vitest.ts, tests/cross-feature-integration-eval.vitest.ts, tests/feature-eval-query-intelligence.vitest.ts, tests/search-fallback-tiered.vitest.ts
SPECKIT_CONSOLIDATION: lib/search/search-flags.ts, lib/storage/consolidation.ts, tests/flag-ceiling.vitest.ts, tests/n3lite-consolidation.vitest.ts
SPECKIT_CONSUMPTION_LOG: lib/telemetry/consumption-logger.ts, tests/consumption-logger.vitest.ts
SPECKIT_CONTEXT_HEADERS: README.md, lib/search/search-flags.ts, tests/search-flags.vitest.ts
SPECKIT_CROSS_ENCODER: README.md, lib/search/hybrid-search.ts, lib/search/pipeline/stage3-rerank.ts, lib/search/search-flags.ts, tests/flag-ceiling.vitest.ts, tests/search-flags.vitest.ts
SPECKIT_DASHBOARD_LIMIT: lib/eval/reporting-dashboard.ts
SPECKIT_DEBUG_INDEX_SCAN: handlers/memory-index.ts
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts && printf '\\n---FILE---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "postMutationHooks|runPostMutationHooks|latencyMs|cacheCleared|toolCacheCleared|embeddingCacheCleared|appendAutoSurfaceHints|autoSurfacedContext|confirmName|safetyConfirmationUsed|autoRepair|repair|partial indexing|indexWarning|no-op|duplicate" .opencode/skill/system-spec-kit/mcp_server/{context-server.ts,handlers,hooks,schemas,tool-schemas.ts,formatters,tests}' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Envelope
// ---------------------------------------------------------------

import { estimateTokens } from '../../formatters/token-metrics';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/**
 * Describes the ResponseMeta shape.
 */
export interface ResponseMeta {
  tool: string;
  tokenCount: number;
  tokenBudget?: number;
  latencyMs?: number;
  cacheHit: boolean;
  isError?: boolean;
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Mutation Hooks
// ---------------------------------------------------------------

import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { clearConstitutionalCache } from '../hooks/memory-surface';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';

import type { MutationHookResult } from './memory-crud-types';

export type { MutationHookResult };

function runPostMutationHooks(
  operation: string,
  context: Record<string, unknown> = {}
): MutationHookResult {
  const startTime = Date.now();

 succeeded in 50ms:
Total output lines: 412

.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:55:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:172:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 1500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:173:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:      autoRepair: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:214:        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:      confirmName: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:303:    required: ['name', 'confirmName']
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:38:import { runPostMutationHooks } from './handlers/mutation-hooks';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:50:  appendAutoSurfaceHints,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:283:    let autoSurfacedContext: AutoSurfaceResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:293:            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:295:            autoSurfacedContext = await autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:304:        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:315:    // Ensure database is initialized (safe no-op if already done)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:332:    if (autoSurfacedContext && result && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:333:      appendAutoSurfaceHints(result, autoSurfacedContext);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:334:      result.autoSurfacedContext = autoSurfacedContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:647:      runPostMutationHooks('delete', { filePath, deletedCount });
exec
/bin/zsh -lc "sed -n '260,360p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts && printf '\\n---FILE---\\n' && sed -n '760,840p' .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts && printf '\\n---FILE---\\n' && sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '150,340p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts && printf '\\n---FILE---\\n' && sed -n '420,540p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts && printf '\\n---FILE---\\n' && sed -n '180,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts && printf '\\n---FILE---\\n' && sed -n '190,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts && printf '\\n---FILE---\\n' && sed -n '200,270p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,160p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts && printf '\\n---FILE---\\n' && sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts && printf '\\n---FILE---\\n' && sed -n '200,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts && printf '\\n---FILE---\\n' && sed -n '300,450p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Types
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */

/** Arguments for the memory_delete handler. */
interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

/** Arguments for the memory_update handler. */
interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
 succeeded in 51ms:
--------------------------------------------------------------- */

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFINITIONS
}));

/* ---------------------------------------------------------------
   5. TOOL DISPATCH (T303: routed through tools/*.ts)
--------------------------------------------------------------- */

server.setRequestHandler(CallToolRequestSchema, async (request, _extra: unknown) => {
  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
  const { name } = requestParams;
  const args: Record<string, unknown> = requestParams.arguments ?? {};
  const callId = resolveToolCallId(request as { id?: unknown });

  try {
    // SEC-003: Validate input lengths before processing (CWE-400 mitigation)
    validateInputLengths(args);
    // T304: Zod validation is applied per-tool inside each dispatch module
 succeeded in 51ms:
    setImmediate(() => {
      retryManager.retryEmbedding(memoryId, memoryContent).catch((err: unknown) => {
        const message = toErrorMessage(err);
        console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${message}`);
      });
    });
  }

  if (causalLinksResult) {
    result.causalLinks = {
      processed: causalLinksResult.processed,
      inserted: causalLinksResult.inserted,
      resolved: causalLinksResult.resolved,
      unresolved_count: causalLinksResult.unresolved.length,
    };
    if (causalLinksResult.errors.length > 0) {
      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
    }
  }

exec
/bin/zsh -lc "sed -n '220,360p' .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts && printf '\\n---FILE---\\n' && sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/hooks/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

---FILE---
// ---------------------------------------------------------------
// TEST: Dual-Scope Memory Auto-Surface Hooks
// ---------------------------------------------------------------
// Covers:
//   - autoSurfaceAtToolDispatch: fires at tool dispatch lifecycle point
//   - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
//   - Token budget constants (4000 max per point)
//   - Config flag disabling both hooks
//   - No regression in existing autoSurfaceMemories behaviour
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock transitive DB dependencies before importing the module under test
vi.mock('../lib/search/vector-index', () => ({
  initializeDb: vi.fn(),
  getDb: vi.fn(() => null),
}));
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts && printf '\\n---FILE---\\n' && sed -n '220,340p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts && printf '\\n---FILE---\\n' && sed -n '200,260p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts && printf '\\n---FILE---\\n' && sed -n '760,840p' .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts && printf '\\n---FILE---\\n' && sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { executeAutoPromotion } from '../lib/search/auto-promotion';
import { recordSelection } from '../lib/search/learned-feedback';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';

exec
/bin/zsh -lc "rg -n \"handleCheckpointDelete|confirmName|safetyConfirmationUsed\" .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts && sed -n '240,340p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
49:  confirmName?: string;
135:      `Delete with: checkpoint_delete({ name: "${name}", confirmName: "${name}" })`
274:async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
277:  const { name, confirmName } = args;
282:  if (!confirmName || typeof confirmName !== 'string') {
283:    throw new Error('confirmName is required and must be a string');
285:  if (confirmName !== name) {
286:    throw new Error('confirmName must exactly match name to delete checkpoint');
300:      safetyConfirmationUsed: true,
449:  handleCheckpointDelete,
457:const handle_checkpoint_delete = handleCheckpointDelete;
      summary: `Checkpoint "${name}" restored with warnings (${result.errors.length})`,
      data: {
        success: true,
        partial: true,
        warningCount: result.errors.length,
        restored: result,
      },
      hints: [
        'Restore applied partially; review restored.errors before retrying',
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts && printf '\\n---FILE---\\n' && sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts && printf '\\n---FILE---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts && printf '\\n---FILE---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"SPECKIT_COMMUNITY_DETECTION|degree_snapshots|community_assignments|SPECKIT_AUTO_ENTITIES|memory_entities|entity_catalog|SPECKIT_MEMORY_SUMMARIES|memory_summaries|SPECKIT_ENTITY_LINKING|SPECKIT_ENTITY_LINKING_MAX_DENSITY|supports|strength=0.7|created_by='entity_linker'|int8|quantiz\" .opencode/skill/system-spec-kit/mcp_server/{lib,tests,README.md}" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Memory Summaries
// ---------------------------------------------------------------
// Gated via SPECKIT_MEMORY_SUMMARIES

import type Database from 'better-sqlite3';
import { generateSummary } from './tfidf-summarizer';
import { isMemorySummariesEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface SummarySearchResult {
  id: number;
  memoryId: number;
  similarity: number;
}

// ---------------------------------------------------------------------------
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Community Detection
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from "better-sqlite3";

// ---------------------------------------------------------------------------
// 2. TYPES
// ---------------------------------------------------------------------------

/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

// ---------------------------------------------------------------------------
 succeeded in 52ms:
Total output lines: 334

.opencode/skill/system-spec-kit/mcp_server/README.md:324:The causal graph supports 6 relationship types for tracing decision history:
.opencode/skill/system-spec-kit/mcp_server/README.md:333:| `supports`     | A provides evidence or support for B          |
.opencode/skill/system-spec-kit/mcp_server/README.md:704:| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0`                      | S5 density guard threshold for cross-document entity linking |
.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
.opencode/skill/system-spec-kit/mcp_server/README.md:792:| `SPECKIT_AUTO_ENTITIES`        | `true`  | Extracts entities at save time for cross-document linking (R10) |
.opencode/skill/system-spec-kit/mcp_server/README.md:793:| `SPECKIT_ENTITY_LINKING`       | `true`  | Links memories sharing extracted entities (S5) |
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:53:  'SPECKIT_COMMUNITY_DETECTION',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:54:  'SPECKIT_MEMORY_SUMMARIES',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:55:  'SPECKIT_AUTO_ENTITIES',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:56:  'SPECKIT_ENTITY_LINKING',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:77:  { flag: 'SPECKIT_COMMUNITY_DETECTION', checker: isCommunityDetectionEnabled },
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:78:  { flag: 'SPECKIT_MEMORY_SUMMARIES', checker: isMemorySummariesEnabled },
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:79:  { flag: 'SPECKIT_AUTO_ENTITIES', checker: isAutoEntitiesEnabled },
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:80:  { flag: 'SPECKIT_ENTITY_LINKING', checker: isEntityLinkingEnabled },
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:193:      > Important: The memory architecture supports both semantic and keyword search.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:4:// Deferred feature — gated via SPECKIT_AUTO_ENTITIES
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:126: * Store extracted entities in the memory_entities table.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:142:      INSERT OR REPLACE INTO memory_entities
exec
/bin/zsh -lc "sed -n '260,340p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts && printf '\\n---FILE---\\n' && sed -n '440,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts && printf '\\n---FILE---\\n' && sed -n '560,700p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts && printf '\\n---FILE---\\n' && sed -n '40,120p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts && printf '\\n---FILE---\\n' && sed -n '500,580p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  const sql = `
    SELECT id, COUNT(*) AS cnt FROM (
      SELECT source_id AS id FROM causal_edges WHERE source_id IN (${placeholders})
      UNION ALL
      SELECT target_id AS id FROM causal_edges WHERE target_id IN (${placeholders})
    ) GROUP BY id
  `;

  try {
    const rows = (db.prepare(sql) as Database.Statement).all(
      ...nodeIds,
      ...nodeIds,
    ) as Array<{ id: string; cnt: number }>;
    for (const row of rows) {
      counts.set(row.id, row.cnt);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-linker] batchGetEdgeCounts failed: ${message}`);
  }
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts && printf '\\n---FILE---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/core/config.ts && printf '\\n---FILE---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/shared/config.ts && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Tool Cache
// ---------------------------------------------------------------

import crypto from 'crypto';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ToolCacheConfig {
  enabled: boolean;
  defaultTtlMs: number;
  maxEntries: number;
  cleanupIntervalMs: number;
}

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Search Flags
// ---------------------------------------------------------------
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export function isMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MMR');
}

/**
 * Transparent Reasoning Module (evidence-gap detection).
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import path from 'path';
import os from 'os';
import { COGNITIVE_CONFIG as LOADED_COGNITIVE_CONFIG } from '../configs/cognitive';
import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Input validation limits configuration */
export interface InputLimitsConfig {
  query: number;
  title: number;
  specFolder: number;
  contextType: number;
  name: number;
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const dir=path.join(root,\"feature_catalog/20--feature-flag-reference\");for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){const text=fs.readFileSync(path.join(dir,file),\"utf8\");const lines=text.split(/\\r?\\n/);const paths=[];for(const line of lines){if("'!line.startsWith("| ")) continue;const cols=line.split("|").slice(1,-1).map(s=>s.trim());if(cols.length<4) continue;if(cols[0]==="Name"||cols[0]==="---") continue;const src=cols.length===5?cols[3]:cols[1];if(src.startsWith("`")&&src.endsWith("`")){paths.push(src.slice(1,-1));}}const invalid=[];for(const p of paths){const resolved=path.join(root,p.startsWith("mcp_server/")||p.startsWith("shared/")?p:`mcp_server/${p}`);if(!fs.existsSync(resolved)) invalid.push(p.startsWith("mcp_server/")||p.startsWith("shared/")?p:`mcp_server/${p}`);}console.log(JSON.stringify({file, paths, invalid}, null, 2));}'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
{
  "file": "01-1-search-pipeline-features-speckit.md",
  "paths": [
    "lib/eval/eval-metrics.ts",
    "lib/cognitive/archival-manager.ts",
    "lib/search/search-flags.ts",
    "handlers/memory-context.ts",
    "lib/search/causal-boost.ts",
    "lib/search/channel-representation.ts",
    "lib/scoring/composite-scoring.ts",
    "lib/cognitive/co-activation.ts",
    "lib/cognitive/co-activation.ts",
    "configs/cognitive.ts",
    "lib/search/search-flags.ts",
    "lib/search/query-classifier.ts",
    "lib/search/confidence-truncation.ts",
    "lib/search/search-flags.ts",
    "lib/telemetry/consumption-logger.ts",
    "lib/search/hybrid-search.ts",
    "lib/search/search-flags.ts",
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib/search | rg 'vector-index-(impl|store)\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts && printf '\\n---FILE---\\n' && sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts && printf '\\n---FILE---\\n' && sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts && printf '\\n---FILE---\\n' && sed -n '1,160p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Vector Index Impl
// ---------------------------------------------------------------
// AI-WHY: NOTE: Implementation has been split into focused modules:
// - vector-index-types.ts
// - vector-index-schema.ts
// - vector-index-mutations.ts
// - vector-index-store.ts
// - vector-index-queries.ts
// - vector-index-aliases.ts
// Keep this file for backward compatibility with direct imports.

export * from './vector-index';

---FILE---
// ---------------------------------------------------------------
// MODULE: Local Reranker
// ---------------------------------------------------------------
// AI-WHY: Optional local reranker for Stage 3. This module is fully gated by
// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
exec
/bin/zsh -lc "rg -n \"SESSION_MAX_ENTRIES|sessionTtlMinutes|maxEntriesPerSession|dbUnavailableMode|STALE_CLEANUP_INTERVAL_MS|STALE_SESSION_THRESHOLD_MS|TOOL_CACHE_TTL_MS|TOOL_CACHE_MAX_ENTRIES|TOOL_CACHE_CLEANUP_INTERVAL_MS|ENABLE_BM25\" .opencode/skill/system-spec-kit/mcp_server/lib/{session/session-manager.ts,cache/tool-cache.ts,search/bm25-index.ts} && sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts && printf '\\n---FILE---\\n' && sed -n '240,360p' .opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts && printf '\\n---FILE---\\n' && sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:51:  defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS || '60000', 10) || 60000,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:52:  maxEntries: parseInt(process.env.TOOL_CACHE_MAX_ENTRIES || '1000', 10) || 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:53:  cleanupIntervalMs: parseInt(process.env.TOOL_CACHE_CLEANUP_INTERVAL_MS || '30000', 10) || 30000,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:57:  return process.env.ENABLE_BM25 !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:18:  sessionTtlMinutes: number;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:19:  maxEntriesPerSession: number;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:21:  dbUnavailableMode: 'allow' | 'block';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:162:  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES as string, 10) || 100,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:164:  dbUnavailableMode: process.env.SESSION_DEDUP_DB_UNAVAILABLE_MODE === 'allow' ? 'allow' : 'block',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:178:const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:179:const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:231:  }, STALE_CLEANUP_INTERVAL_MS);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:317:    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:318:    console.warn(`[session-manager] Database not initialized. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} memory.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:337:    return SESSION_CONFIG.dbUnavailableMode === 'allow';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:354:    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:355:    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:387:    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:481:    if (count <= SESSION_CONFIG.maxEntriesPerSession) return;
exec
/bin/zsh -lc 'rg -n "MEMORY_ALLOWED_PATHS|MEMORY_BASE_PATH|SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|MEMORY_DB_DIR|MEMORY_DB_PATH|SPEC_KIT_BATCH_DELAY_MS|SPEC_KIT_BATCH_SIZE|validateFilePath|ALLOWED_BASE_PATHS" .opencode/skill/system-spec-kit/mcp_server/{core/config.ts,utils,bash,lib/search/vector-index-store.ts,lib/utils/path-security.ts,handlers/memory-ingest.ts,tests/regression-010-index-large-files.vitest.ts,tests/handler-helpers.vitest.ts} .opencode/skill/system-spec-kit/shared/config.ts .opencode/skill/system-spec-kit/shared/utils/path-security.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 53ms:
rg: .opencode/skill/system-spec-kit/mcp_server/bash: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:24:  const dbDir = process.env.SPEC_KIT_DB_DIR
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:25:    ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:40:    DEFAULT_BASE_PATH:        process.env.MEMORY_BASE_PATH || process.cwd(),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:41:    ALLOWED_BASE_PATHS:       [path.join(os.homedir(), '.claude'), process.cwd()].map((b: string) => path.resolve(b)),
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:33:export const DATABASE_DIR: string = process.env.SPEC_KIT_DB_DIR
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:34:  ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:43:export const BATCH_SIZE: number = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:44:export const BATCH_DELAY_MS: number = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:72:export const DEFAULT_BASE_PATH: string = process.env.MEMORY_BASE_PATH || process.cwd();
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:74:export const ALLOWED_BASE_PATHS: string[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:21:import { validateFilePath } from '../utils/path-security';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:197:        `3) Use MEMORY_DB_PATH for provider-specific databases.`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:214:const DEFAULT_DB_DIR = process.env.SPEC_KIT_DB_DIR ||
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:215:  process.env.MEMORY_DB_DIR ||
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:218:export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH ||
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:223:  if (process.env.MEMORY_DB_PATH) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:224:    return process.env.MEMORY_DB_PATH;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:238:const ALLOWED_BASE_PATHS = [
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:243:  ...(process.env.MEMORY_ALLOWED_PATHS ? process.env.MEMORY_ALLOWED_PATHS.split(path.delimiter) : [])
exec
/bin/zsh -lc "sed -n '214,270p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts && printf '\\n---FILE---\\n' && sed -n '80,120p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts && printf '\\n---FILE---\\n' && sed -n '1,80p' .opencode/skill/system-spec-kit/shared/utils/path-security.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
const DEFAULT_DB_DIR = process.env.SPEC_KIT_DB_DIR ||
  process.env.MEMORY_DB_DIR ||
  path.resolve(__dirname, '../../database');
/** Default path for the vector-index database file. */
export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH ||
  path.join(DEFAULT_DB_DIR, 'context-index.sqlite');
const DB_PERMISSIONS = 0o600;

function resolve_database_path() {
  if (process.env.MEMORY_DB_PATH) {
    return process.env.MEMORY_DB_PATH;
  }

  const embeddings = embeddingsProvider;
  const profile = embeddings.getEmbeddingProfile();

  if (!profile || !('getDatabasePath' in profile)) {
    return DEFAULT_DB_PATH;
  }

exec
/bin/zsh -lc 'rg -n "COHERE_API_KEY|EMBEDDINGS_PROVIDER|OPENAI_API_KEY|VOYAGE_API_KEY|EMBEDDING_DIM|RERANKER_LOCAL|SPECKIT_RERANKER_MODEL" .opencode/skill/system-spec-kit/{mcp_server,shared} | head -n 200' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/embeddings.ts:468:  const provider = process.env.EMBEDDINGS_PROVIDER?.toLowerCase();
.opencode/skill/system-spec-kit/shared/embeddings.ts:472:  if (process.env.VOYAGE_API_KEY && !process.env.OPENAI_API_KEY) return 1024;
.opencode/skill/system-spec-kit/shared/embeddings.ts:473:  if (process.env.OPENAI_API_KEY && !process.env.VOYAGE_API_KEY) return 1536;
.opencode/skill/system-spec-kit/shared/embeddings.ts:570:const EMBEDDING_DIM: number = 768;
.opencode/skill/system-spec-kit/shared/embeddings.ts:622:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/shared/index.ts:110:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/shared/README.md:320:| `VOYAGE_API_KEY`          | No       | -                                | Voyage AI API key (recommended) |
.opencode/skill/system-spec-kit/shared/README.md:321:| `OPENAI_API_KEY`          | No       | -                                | OpenAI API key                  |
.opencode/skill/system-spec-kit/shared/README.md:322:| `EMBEDDINGS_PROVIDER`     | No       | `auto`                           | Force specific provider         |
.opencode/skill/system-spec-kit/shared/README.md:328:1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`)
.opencode/skill/system-spec-kit/shared/README.md:329:2. Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)
.opencode/skill/system-spec-kit/shared/README.md:330:3. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
.opencode/skill/system-spec-kit/shared/README.md:497:| Provider not detected | Check `echo $VOYAGE_API_KEY` or `echo $OPENAI_API_KEY` |
.opencode/skill/system-spec-kit/shared/README.md:498:| Wrong provider        | Set `EMBEDDINGS_PROVIDER` explicitly                   |
.opencode/skill/system-spec-kit/shared/README.md:506:echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
.opencode/skill/system-spec-kit/shared/README.md:507:echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
.opencode/skill/system-spec-kit/shared/README.md:508:echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"
.opencode/skill/system-spec-kit/mcp_server/README.md:712:| `EMBEDDINGS_PROVIDER` | No         | Force: `voyage`, `openai` or `hf-local` |
.opencode/skill/system-spec-kit/mcp_server/README.md:713:| `VOYAGE_API_KEY`      | For Voyage | Voyage AI API key (1024d, recommended)  |
.opencode/skill/system-spec-kit/mcp_server/README.md:714:| `OPENAI_API_KEY`      | For OpenAI | OpenAI API key (1536d/3072d)            |
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts && printf '\\n---FILE---\\n' && sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts && printf '\\n---FILE---\\n' && sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts && printf '\\n---FILE---\\n' && sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Rollout Policy
// ---------------------------------------------------------------

const DEFAULT_ROLLOUT_PERCENT = 100;

function getRolloutPercent(): number {
  const raw = process.env.SPECKIT_ROLLOUT_PERCENT;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  return Math.max(0, Math.min(100, parsed));
}

exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts && printf '\\n---FILE---\\n' && sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts && printf '\\n---FILE---\\n' && sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Logger
// ---------------------------------------------------------------
// Structured logging that writes ALL output to stderr.
// In MCP servers, stdout is reserved for JSON-RPC — diagnostic
// output on stdout corrupts the protocol stream.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/** Log severity levels (ascending) */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Numeric severity for level comparison */
const LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
codex
I’ve got enough implementation context now to start calling out real drift instead of just path issues. I’m checking a few suspect snippets more closely where the prose is very specific, because those are the ones most likely to have stale claims or omitted source files.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md && printf '\\n---FILE---\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md && printf '\\n---FILE---\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/01-int8-quantization-evaluation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Final token metadata recomputation

## Current Reality

Phase 014 now recomputes final token metadata after `appendAutoSurfaceHints(...)` adds the last response-envelope content and before token-budget enforcement evaluates the payload. This keeps `meta.tokenCount` aligned with the finalized envelope that callers actually receive.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Final token metadata recomputation
- Current reality source: FEATURE_CATALOG.md
exec
/bin/zsh -lc "rg -n \"context-server\\.vitest|response-hints|context-server\\.ts|appendAutoSurfaceHints\" .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
5:The context-server success path now appends UX hints through `appendAutoSurfaceHints` while preserving the existing `autoSurfacedContext` payload. This adds guidance without changing the established context auto-surface contract. The finalized implementation runs that append step before token-budget enforcement and recomputes final token metadata from the completed envelope.
14:| `mcp_server/context-server.ts` | Core | MCP server entry point |
63:| `mcp_server/hooks/response-hints.ts` | Hook | Response hint hook |
251:| `mcp_server/tests/context-server.vitest.ts` | Context server tests |
exec
/bin/zsh -lc "rg -n \"hooks-ux-feedback\\.vitest\" .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:

exec
/bin/zsh -lc "rg -n \"0\\.05|momentum|causal depth|community|shouldEscalateToLouvain|stage 2|graph signals\" .opencode/skill/system-spec-kit/mcp_server/lib/{graph/graph-signals.ts,graph/community-detection.ts,search/pipeline/stage2-fusion.ts,search/search-flags.ts}" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:137: * N2a+N2b: Graph momentum scoring and causal depth signals.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:25://   2b. Community co-retrieval  — N2c inject community co-members
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:26://   2c. Graph signals           — N2a momentum + N2b causal depth
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:65:import { applyCommunityBoost } from '../../graph/community-detection';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:469: *   2c. Graph signals      (N2a+N2b — momentum + depth)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:485:  const metadata: Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean } = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:569:  // Inject community co-members into result set before graph signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:570:  // so injected rows also receive momentum/depth adjustments.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:577:        (metadata as Record<string, unknown>).communityBoostApplied = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:581:      console.warn(`[stage2-fusion] community boost failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:586:  // Additive score adjustments for graph momentum and causal depth.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:595:      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:26: * related community members without overwhelming the primary result set.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:27: * Lower values (e.g. 0.1) make community neighbours nearly invisible;
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:30: * development as the sweet-spot that keeps community signals additive
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:81:    console.warn(`[community-detection] Failed to build adjacency list: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:93: * Returns a map of nodeId -> communityId (0-indexed).
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:104:  let communityId = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:116:      assignments.set(current, communityId);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:129:    communityId++;
exec
/bin/zsh -lc 'rg -n "extractEntities|storeEntities|updateEntityCatalog|SPECKIT_AUTO_ENTITIES|memory_entities|entity_catalog" .opencode/skill/system-spec-kit/mcp_server/{handlers,lib/search,lib/extraction,tests}' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:4:// Deferred feature — gated via SPECKIT_AUTO_ENTITIES
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:49:export function extractEntities(content: string): ExtractedEntity[] {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:126: * Store extracted entities in the memory_entities table.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:135:export function storeEntities(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:142:      INSERT OR REPLACE INTO memory_entities
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:159:    console.warn(`[entity-extractor] storeEntities failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:169: * Upsert entities into entity_catalog with alias normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:181:export function updateEntityCatalog(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:189:      'SELECT id, aliases, memory_count FROM entity_catalog WHERE canonical_name = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:192:      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:196:      UPDATE entity_catalog
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:239:    console.warn(`[entity-extractor] updateEntityCatalog failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:107:**Purpose**: Extract named entities from memory content using pure-TS rule-based extraction (zero npm dependencies). Gated via `SPECKIT_AUTO_ENTITIES`.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:114:| **Persistence** | `storeEntities()` writes extracted entities to the `memory_entities` table |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:115:| **Catalog Update** | `updateEntityCatalog()` maintains canonical entity names for cross-document linking |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:122:| `extractEntities` | `(content: string) => ExtractedEntity[]` | Extract entities from raw text |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:124:| `storeEntities` | `(db, memoryId, entities) => void` | Persist entities to database |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:125:| `updateEntityCatalog` | `(db, memoryId, entities, specFolder) => void` | Update canonical entity catalog |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:212:| `SPECKIT_AUTO_ENTITIES`   | true    | Enable auto entity extraction (R10). When `true`, entities are extracted from memory content at save time using rule-based extraction and stored in the `memory_entities` table. Required by entity linking (S5). |
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:162: * Default: TRUE (enabled). Set SPECKIT_AUTO_ENTITIES=false to disable.
exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts && printf '\\ncount=' && node -e 'const m=require(\"fs\").readFileSync(\".opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts\",\"utf8\");const arr=(m.match(/export const ENTITY_DENYLIST = \\[([\\s\\S]*?)\\] as const/)||[])[1]||\"\";console.log((arr.match(/'/g)||[]).length/2)'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
zsh:1: parse error near `)'
exec
/bin/zsh -lc 'rg -n "64|denylist|ENTITY_DENYLIST" .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts .opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:5://         entity-denylist
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:25:  ENTITY_DENYLIST,
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:26:} from '../lib/extraction/entity-denylist.js';
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:241:  it('removes entities where ALL words are on the denylist', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:242:    // "new" and "thing" are both on the denylist
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:270:      { text: 'old change', type: 'heading', frequency: 1 },          // all denylist
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:280:  it('is case-insensitive for denylist matching', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:281:    // "THING" should match "thing" in the denylist
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:332:    expect(size).toBe(ENTITY_DENYLIST.size);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:48: * Complete denylist of common nouns, technology stop words, and generic
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:52:export const ENTITY_DENYLIST: Set<string> = new Set<string>([
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:63: * Check if a term is on the entity denylist (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:69:  return ENTITY_DENYLIST.has(term.toLowerCase().trim());
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:73: * Get the total number of words in the entity denylist.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:75: * @returns The size of the entity denylist set
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:78:  return ENTITY_DENYLIST.size;
exec
/bin/zsh -lc "sed -n '48,90p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
 * Complete denylist of common nouns, technology stop words, and generic
 * modifiers that should be filtered from entity extraction results.
 * All terms stored in lowercase for case-insensitive matching.
 */
export const ENTITY_DENYLIST: Set<string> = new Set<string>([
  ...COMMON_NOUNS,
  ...TECHNOLOGY_STOP_WORDS,
  ...GENERIC_MODIFIERS,
]);

// ---------------------------------------------------------------------------
// 5. PUBLIC API
// ---------------------------------------------------------------------------

/**
 * Check if a term is on the entity denylist (case-insensitive).
 *
 * @param term - The term to check
 * @returns true if the term is denied and should NOT be extracted as an entity
 */
exec
/bin/zsh -lc "node -e 'const mod=require(\"./.opencode/skill/system-spec-kit/mcp_server/dist/lib/extraction/entity-denylist.js\"); console.log(mod.getEntityDenylistSize())'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
64
exec
/bin/zsh -lc 'rg -n "SPECKIT_RRF|SPECKIT_LAZY_LOADING|SPECKIT_CONTEXT_HEADERS|SPECKIT_FILE_WATCHER|SPECKIT_RSF_FUSION|SPECKIT_DYNAMIC_INIT|SPECKIT_STRICT_SCHEMAS|SPECKIT_RESPONSE_TRACE|SPECKIT_ABLATION|SPECKIT_DEBUG_INDEX_SCAN" .opencode/skill/system-spec-kit/mcp_server/{context-server.ts,handlers,lib,schemas,tests,tool-schemas.ts,README.md}' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:726:| `SPECKIT_RRF`                | `true`  | Enable RRF search fusion                                                              |
.opencode/skill/system-spec-kit/mcp_server/README.md:755:| `SPECKIT_STRICT_SCHEMAS`        | `true`  | Enforce strict Zod input validation for all MCP tools (`false` allows passthrough unknown keys) |
.opencode/skill/system-spec-kit/mcp_server/README.md:756:| `SPECKIT_RESPONSE_TRACE`        | `false` | Include provenance-rich `scores` / `source` / `trace` response envelopes by default |
.opencode/skill/system-spec-kit/mcp_server/README.md:757:| `SPECKIT_DYNAMIC_INIT`          | `true`  | Inject dynamic startup instructions with live memory/index counts |
.opencode/skill/system-spec-kit/mcp_server/README.md:758:| `SPECKIT_CONTEXT_HEADERS`       | `true`  | Prepend contextual tree headers to markdown content chunks in search results |
.opencode/skill/system-spec-kit/mcp_server/README.md:759:| `SPECKIT_FILE_WATCHER`          | `false` | Enable chokidar-based real-time markdown re-indexing |
.opencode/skill/system-spec-kit/mcp_server/README.md:763:| `SPECKIT_ABLATION`              | `false` | Ablation tool execution |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:157:        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:347:  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:221:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:989:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:5:// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:14:  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:619:  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:123:  /** RSF shadow fusion result (SPECKIT_RSF_FUSION) — shadow-mode only, not used for ranking. */
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:59:      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:60:      { flag: 'SPECKIT_ABLATION' }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:541:      ...(process.env.SPECKIT_DEBUG_INDEX_SCAN === 'true'
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:19:// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:42: * Returns true only when SPECKIT_ABLATION=true (case-insensitive).
exec
/bin/zsh -lc "sed -n '1,160p' .opencode/skill/system-spec-kit/mcp_server/tests/lazy-loading.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------
// TEST: Lazy Loading Startup Behavior (T016-T019)
// ---------------------------------------------------------------
// Architecture-aligned replacement for legacy deferred placeholder.

const ENV_KEYS = [
  'EMBEDDINGS_PROVIDER',
  'SPECKIT_EAGER_WARMUP',
  'SPECKIT_LAZY_LOADING',
  'VOYAGE_API_KEY',
  'OPENAI_API_KEY',
] as const;

const ORIGINAL_ENV = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]])
) as Record<string, string | undefined>;

function resetEnv(): void {
exec
/bin/zsh -lc 'rg -n "shouldEagerWarmup|SPECKIT_EAGER_WARMUP|SPECKIT_LAZY_LOADING" .opencode/skill/system-spec-kit/shared/embeddings.ts .opencode/skill/system-spec-kit/shared/README.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/embeddings.ts:134: * - SPECKIT_EAGER_WARMUP=true: Force eager loading at startup (legacy behavior)
.opencode/skill/system-spec-kit/shared/embeddings.ts:135: * - SPECKIT_LAZY_LOADING=false: Alias for SPECKIT_EAGER_WARMUP=true
.opencode/skill/system-spec-kit/shared/embeddings.ts:147: * SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING env vars are inert.
.opencode/skill/system-spec-kit/shared/embeddings.ts:149:function shouldEagerWarmup(): boolean {
.opencode/skill/system-spec-kit/shared/embeddings.ts:206:    eagerWarmupEnabled: shouldEagerWarmup(),
.opencode/skill/system-spec-kit/shared/embeddings.ts:616:  shouldEagerWarmup,
exec
/bin/zsh -lc "sed -n '124,160p' .opencode/skill/system-spec-kit/shared/embeddings.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
 *
 * The embedding provider is initialized lazily on first use to reduce
 * MCP startup time from 2-3s to <500ms.
 *
 * Initialization Flow:
 * 1. On first embedding request, get_provider() creates the instance
 * 2. Provider is created without warmup (warmup: false)
 * 3. First actual embedding call triggers model loading
 *
 * Environment Variables:
 * - SPECKIT_EAGER_WARMUP=true: Force eager loading at startup (legacy behavior)
 * - SPECKIT_LAZY_LOADING=false: Alias for SPECKIT_EAGER_WARMUP=true
 */

let providerInstance: IEmbeddingProvider | null = null;
let providerInitPromise: Promise<IEmbeddingProvider> | null = null;
let providerInitStartTime: number | null = null;
let providerInitCompleteTime: number | null = null;
let firstEmbeddingTime: number | null = null;

exec
/bin/zsh -lc 'rg -n "createTelemetry|recordLatency|recordMode|recordFallback|recordQualityProxy|SPECKIT_EXTENDED_TELEMETRY" .opencode/skill/system-spec-kit/mcp_server/{handlers,lib,context-server.ts,tests}' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:22:  'SPECKIT_EXTENDED_TELEMETRY',
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:83:      'SPECKIT_EXTENDED_TELEMETRY',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:670:        const t = retrievalTelemetry.createTelemetry();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:671:        retrievalTelemetry.recordMode(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:679:          retrievalTelemetry.recordFallback(t, `pressure override: ${requested_mode} -> ${effectiveMode}`);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:7:  createTelemetry,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:8:  recordLatency,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:9:  recordMode,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:10:  recordFallback,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:11:  recordQualityProxy,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:36:  ReturnType<typeof createTelemetry>,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:39:  mode: ReturnType<typeof createTelemetry>['mode'] & Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:40:  fallback: ReturnType<typeof createTelemetry>['fallback'] & Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:41:  quality: ReturnType<typeof createTelemetry>['quality'] & Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:56: *  createTelemetry() returns disabled objects. Force-enable for recording tests. */
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:57:function createEnabledTelemetry(): ReturnType<typeof createTelemetry> {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:58:  const t = createTelemetry();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:67:    previousFlag = process.env.SPECKIT_EXTENDED_TELEMETRY;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:68:    delete process.env.SPECKIT_EXTENDED_TELEMETRY;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:73:      delete process.env.SPECKIT_EXTENDED_TELEMETRY;
exec
/bin/zsh -lc 'rg -n "injectContextualTree|context headers|header overhead|SPECKIT_CONTEXT_HEADERS" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:21:  'SPECKIT_CONTEXT_HEADERS',
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:66:    process.env.SPECKIT_CONTEXT_HEADERS = 'false';
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:80:    process.env.SPECKIT_CONTEXT_HEADERS = 'true';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1004:          reranked = reranked.map((row) => injectContextualTree(row, descriptionCache));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1264:function injectContextualTree(row: HybridSearchResult, descCache: Map<string, string>): HybridSearchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1658:  injectContextualTree,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:184: * Default: TRUE. Set SPECKIT_CONTEXT_HEADERS=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:187:  return isFeatureEnabled('SPECKIT_CONTEXT_HEADERS');
exec
/bin/zsh -lc 'rg -n "EMBEDDING_DIM" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/index.ts:110:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/shared/embeddings.ts:570:const EMBEDDING_DIM: number = 768;
.opencode/skill/system-spec-kit/shared/embeddings.ts:622:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts:14:const EMBEDDING_DIM: number = 768;
.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts:86:    this.dim = options.dim || EMBEDDING_DIM;
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:60:    expect(ERROR_CODES.EMBEDDING_DIMENSION_INVALID).toBe('E002');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:627:        ERROR_CODES.EMBEDDING_DIMENSION_INVALID,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:63:  EMBEDDING_DIMENSION_INVALID: 'E002',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:49:  EMBEDDING_DIMENSION_INVALID: 'E002',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:153:  [ERROR_CODES.EMBEDDING_DIMENSION_INVALID]: {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:115:        'EMBEDDING_DIM', 'DEFAULT_DB_PATH',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:132:    it('has correct constants EMBEDDING_DIM=768 and DEFAULT_DB_PATH', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:133:      expect(mod.EMBEDDING_DIM).toBe(768);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:177:// EMBEDDING_DIM, DEFAULT_DB_PATH, getEmbeddingDim, getConfirmedEmbeddingDimension,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:29:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:118:export const EMBEDDING_DIM = 768;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:144:  return EMBEDDING_DIM;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:156:    if (dim !== 768 || process.env.EMBEDDING_DIM === '768') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:362:| `EMBEDDING_DIM`          | `768`    | Fallback embedding dimension        |
exec
/bin/zsh -lc "rg -n \"getDbDir\\(|SPECKIT_DB_DIR\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/config.ts:9:export function getDbDir(): string | undefined {
.opencode/skill/system-spec-kit/shared/config.ts:10:  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
.opencode/skill/system-spec-kit/shared/config.ts:42:  const configuredDir = getDbDir();
.opencode/skill/system-spec-kit/shared/paths.ts:13:  const dir = getDbDir();
exec
/bin/zsh -lc "rg -n \"shared/paths|getDbDir\\(|DB_UPDATED_FILE\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/config.ts:9:export function getDbDir(): string | undefined {
.opencode/skill/system-spec-kit/shared/config.ts:41:export const DB_UPDATED_FILE: string = (() => {
.opencode/skill/system-spec-kit/shared/config.ts:42:  const configuredDir = getDbDir();
.opencode/skill/system-spec-kit/shared/paths.ts:13:  const dir = getDbDir();
.opencode/skill/system-spec-kit/shared/index.ts:160:export { getDbDir, DB_UPDATED_FILE } from './config';
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:6:import { DB_UPDATED_FILE } from './config';
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:105:    const updateTimeRaw = await fs.readFile(DB_UPDATED_FILE, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:8:import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:37:export const DB_UPDATED_FILE: string = SHARED_DB_UPDATED_FILE;
.opencode/skill/system-spec-kit/mcp_server/core/index.ts:16:  DB_UPDATED_FILE,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:34:    DB_UPDATED_FILE:          path.join(dbDir, '.db-updated'),
codex
I’ve finished the cross-check and I’m assembling the final per-feature verdicts now. Most UX snippets have accurate prose but messy source-file inventories; the biggest real drift is in the feature-flag reference, where a few rows no longer match the runtime behavior.
Plan update
  ✓ Read the relevant `system-spec-kit` skill guidance and identify the feature files plus their referenced source paths.
  ✓ Compare each feature snippet’s `Current Reality` and `Source Files` against the actual `mcp_server` code, including missing implementation files.
  → Assemble the per-feature verification report in the user’s required output format.
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Post Insert
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser';

import * as embeddings from '../../lib/providers/embeddings';
import { processCausalLinks } from '../causal-links-processor';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
} from '../../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
import { runEntityLinking } from '../../lib/search/entity-linker';
import { toErrorMessage } from '../../utils';

interface CausalLinksResult {
context compacted
codex
I'm in the final synthesis pass now, checking the exact feature filenames so the report lines up one-to-one with the catalog.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks -maxdepth 1 -type f | sed 's#"'^.*/##'"' | sort && printf '\\n--\\n' && find .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals -maxdepth 1 -type f | sed 's#"'^.*/##'"' | sort && printf '\\n--\\n' && find .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference -maxdepth 1 -type f | sed 's#"'^.*/##'"' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exposure.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/01-int8-quantization-evaluation.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/04-implemented-memory-summary-generation.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/05-implemented-cross-document-entity-linking.md
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/02-2-session-and-cache.md
 succeeded in 50ms:
01-shared-post-mutation-hook-wiring.md
02-memory-health-autorepair-metadata.md
03-checkpoint-delete-confirmname-safety.md
04-schema-and-type-contract-synchronization.md
05-dedicated-ux-hook-modules.md
06-mutation-hook-result-contract-expansion.md
07-mutation-response-ux-payload-exposure.md
08-context-server-success-hint-append.md
09-duplicate-save-no-op-feedback-hardening.md
10-atomic-save-parity-and-partial-indexing-hints.md
11-final-token-metadata-recomputation.md
12-hooks-readme-and-export-alignment.md
13-end-to-end-success-envelope-verification.md

--
01-int8-quantization-evaluation.md
02-implemented-graph-centrality-and-community-detection.md
03-implemented-auto-entity-extraction.md
04-implemented-memory-summary-generation.md
05-implemented-cross-document-entity-linking.md
codex
---
FEATURE: 01-shared-post-mutation-hook-wiring.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Current Reality matches the hook wiring in code, but the source list has one dead test path and omits the main mutation call sites.
---
FEATURE: 02-memory-health-autorepair-metadata.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tests/memory-crud-extended.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The `autoRepair` flow and returned repair metadata match the handler, schema, and tests; the only issues are stale/incomplete source references.
---
FEATURE: 03-checkpoint-delete-confirmname-safety.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tests/mcp-input-validation.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Code enforces `confirmName` and returns the safety marker exactly as described, but the source list uses one invalid test path and misses the validation coverage.
---
FEATURE: 04-schema-and-type-contract-synchronization.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts, mcp_server/handlers/checkpoints.ts, mcp_server/handlers/memory-crud-types.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The schema/type sync is real, but the Source Files section does not include several contract-defining files that participate in the runtime/tool boundary.
---
FEATURE: 05-dedicated-ux-hook-modules.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/hooks/README.md, mcp_server/tests/hooks-ux-feedback.vitest.ts, mcp_server/tests/dual-scope-hooks.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The dedicated hook module split is accurate, but the source list misses the module README and the main hook-specific regression tests.
---
FEATURE: 06-mutation-hook-result-contract-expansion.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The expanded hook result payload is present in code, but the Source Files section misses the response-producing mutation handlers and includes one dead test path.
---
FEATURE: 07-mutation-response-ux-payload-exposure.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts, mcp_server/tests/memory-save-ux-regressions.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Mutation responses do expose the UX payload as described, but the source list misses the handlers and regression test that actually surface and verify it.
---
FEATURE: 08-context-server-success-hint-append.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tests/hooks-ux-feedback.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Successful responses append the auto-surface hints before final token accounting exactly as described; the issue is stale/incomplete test path coverage in the catalog entry.
---
FEATURE: 09-duplicate-save-no-op-feedback-hardening.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The duplicate-save no-op suppression behavior matches the save handler and regression test, but the Source Files section still contains a dead retry test path.
---
FEATURE: 10-atomic-save-parity-and-partial-indexing-hints.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts, mcp_server/tests/memory-save-ux-regressions.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Atomic save parity and partial-indexing hint behavior are implemented, but the catalog entry omits the primary handler/test and still cites a missing retry test.
---
FEATURE: 11-final-token-metadata-recomputation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/hooks/response-hints.ts, mcp_server/context-server.ts, mcp_server/tests/context-server.vitest.ts, mcp_server/tests/hooks-ux-feedback.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Final token metadata is recomputed after hint injection as described, but the most important implementation and verification files are not listed.
---
FEATURE: 12-hooks-readme-and-export-alignment.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/hooks/README.md
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Export alignment is correct in code, but the source list omits the hook README and still includes one nonexistent test file.
---
FEATURE: 13-end-to-end-success-envelope-verification.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tests/context-server.vitest.ts, mcp_server/context-server.ts, mcp_server/hooks/response-hints.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The end-to-end verification exists and matches the description, but the source list misses the actual end-to-end test and core implementation files.
---
FEATURE: 01-int8-quantization-evaluation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The codebase does reflect a no-implementation/deferred state, but the benchmark/evaluation details in Current Reality are documented claims rather than code-verifiable facts.
---
FEATURE: 02-implemented-graph-centrality-and-community-detection.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/search-flags.ts, mcp_server/lib/graph/graph-signals.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The graph centrality/community feature is implemented as described, but the catalog entry omits the flag, fusion, and schema files that make it operational.
---
FEATURE: 03-implemented-auto-entity-extraction.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/search-flags.ts, mcp_server/lib/search/vector-index-schema.ts, mcp_server/lib/extraction/entity-denylist.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Auto entity extraction matches the implementation, but the Source Files section misses the save-time integration, flag, schema, and denylist files.
---
FEATURE: 04-implemented-memory-summary-generation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Summary generation is implemented as described, but the catalog entry leaves out the stage-1 search integration and backing schema definitions.
---
FEATURE: 05-implemented-cross-document-entity-linking.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/vector-index-schema.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Cross-document entity linking behavior matches code, but the feature entry should also cite the schema/migration file that stores the resulting graph data.
---
FEATURE: 01-1-search-pipeline-features-speckit.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/search/rrf-fusion.ts
MISSING_CODE_PATHS: mcp_server/lib/eval/ablation-framework.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/search-flags.ts, shared/algorithms/rrf-fusion.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Several rows are stale or misleading, including the dead RRF path, warmup/lazy-loading behavior, and `SPECKIT_EXTENDED_TELEMETRY`, so this entry needs more than a path cleanup.
---
FEATURE: 02-2-session-and-cache.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: The Current Reality text and cited source files align with the session, cache, and BM25-related implementation.
---
FEATURE: 03-3-mcp-configuration.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: The MCP configuration entry accurately reflects current code and its listed source files are valid and sufficient.
---
FEATURE: 04-4-memory-and-storage.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/vector-index-store.ts, mcp_server/handlers/memory-ingest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The entry understates where `MEMORY_ALLOWED_PATHS` is enforced and overstates `SPECKIT_DB_DIR` as a primary runtime DB selector, while also missing the enforcement files.
---
FEATURE: 05-5-embedding-and-api.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/cross-encoder.ts, shared/embeddings.ts, shared/embeddings/factory.ts, shared/embeddings/providers/openai.ts, shared/embeddings/providers/voyage.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The entry has meaningful drift, including an unsupported `EMBEDDING_DIM` story, stale reranker thresholds, and source citations that point to tests/re-exports instead of the real provider implementation.
---
FEATURE: 06-6-debug-and-telemetry.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-context.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `SPECKIT_EXTENDED_TELEMETRY` is still active in runtime code, so the description needs correction and the memory-context handler should be added to the source list.
---
FEATURE: 07-7-ci-and-build-informational.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The listed files exist, but the documented vars appear to be used only for checkpoint metadata rather than a broader eval-record/build pipeline.
tokens used
245,308
---
FEATURE: 01-shared-post-mutation-hook-wiring.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Current Reality matches the hook wiring in code, but the source list has one dead test path and omits the main mutation call sites.
---
FEATURE: 02-memory-health-autorepair-metadata.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tests/memory-crud-extended.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The `autoRepair` flow and returned repair metadata match the handler, schema, and tests; the only issues are stale/incomplete source references.
---
FEATURE: 03-checkpoint-delete-confirmname-safety.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tests/mcp-input-validation.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Code enforces `confirmName` and returns the safety marker exactly as described, but the source list uses one invalid test path and misses the validation coverage.
---
FEATURE: 04-schema-and-type-contract-synchronization.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts, mcp_server/handlers/checkpoints.ts, mcp_server/handlers/memory-crud-types.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The schema/type sync is real, but the Source Files section does not include several contract-defining files that participate in the runtime/tool boundary.
---
FEATURE: 05-dedicated-ux-hook-modules.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/hooks/README.md, mcp_server/tests/hooks-ux-feedback.vitest.ts, mcp_server/tests/dual-scope-hooks.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The dedicated hook module split is accurate, but the source list misses the module README and the main hook-specific regression tests.
---
FEATURE: 06-mutation-hook-result-contract-expansion.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The expanded hook result payload is present in code, but the Source Files section misses the response-producing mutation handlers and includes one dead test path.
---
FEATURE: 07-mutation-response-ux-payload-exposure.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts, mcp_server/tests/memory-save-ux-regressions.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Mutation responses do expose the UX payload as described, but the source list misses the handlers and regression test that actually surface and verify it.
---
FEATURE: 08-context-server-success-hint-append.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tests/hooks-ux-feedback.vitest.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Successful responses append the auto-surface hints before final token accounting exactly as described; the issue is stale/incomplete test path coverage in the catalog entry.
---
FEATURE: 09-duplicate-save-no-op-feedback-hardening.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The duplicate-save no-op suppression behavior matches the save handler and regression test, but the Source Files section still contains a dead retry test path.
---
FEATURE: 10-atomic-save-parity-and-partial-indexing-hints.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts, mcp_server/tests/memory-save-ux-regressions.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Atomic save parity and partial-indexing hint behavior are implemented, but the catalog entry omits the primary handler/test and still cites a missing retry test.
---
FEATURE: 11-final-token-metadata-recomputation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/hooks/response-hints.ts, mcp_server/context-server.ts, mcp_server/tests/context-server.vitest.ts, mcp_server/tests/hooks-ux-feedback.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Final token metadata is recomputed after hint injection as described, but the most important implementation and verification files are not listed.
---
FEATURE: 12-hooks-readme-and-export-alignment.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/hooks/README.md
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Export alignment is correct in code, but the source list omits the hook README and still includes one nonexistent test file.
---
FEATURE: 13-end-to-end-success-envelope-verification.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tests/context-server.vitest.ts, mcp_server/context-server.ts, mcp_server/hooks/response-hints.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The end-to-end verification exists and matches the description, but the source list misses the actual end-to-end test and core implementation files.
---
FEATURE: 01-int8-quantization-evaluation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The codebase does reflect a no-implementation/deferred state, but the benchmark/evaluation details in Current Reality are documented claims rather than code-verifiable facts.
---
FEATURE: 02-implemented-graph-centrality-and-community-detection.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/search-flags.ts, mcp_server/lib/graph/graph-signals.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The graph centrality/community feature is implemented as described, but the catalog entry omits the flag, fusion, and schema files that make it operational.
---
FEATURE: 03-implemented-auto-entity-extraction.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/search-flags.ts, mcp_server/lib/search/vector-index-schema.ts, mcp_server/lib/extraction/entity-denylist.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Auto entity extraction matches the implementation, but the Source Files section misses the save-time integration, flag, schema, and denylist files.
---
FEATURE: 04-implemented-memory-summary-generation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Summary generation is implemented as described, but the catalog entry leaves out the stage-1 search integration and backing schema definitions.
---
FEATURE: 05-implemented-cross-document-entity-linking.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/vector-index-schema.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Cross-document entity linking behavior matches code, but the feature entry should also cite the schema/migration file that stores the resulting graph data.
---
FEATURE: 01-1-search-pipeline-features-speckit.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/search/rrf-fusion.ts
MISSING_CODE_PATHS: mcp_server/lib/eval/ablation-framework.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/search-flags.ts, shared/algorithms/rrf-fusion.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Several rows are stale or misleading, including the dead RRF path, warmup/lazy-loading behavior, and `SPECKIT_EXTENDED_TELEMETRY`, so this entry needs more than a path cleanup.
---
FEATURE: 02-2-session-and-cache.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: The Current Reality text and cited source files align with the session, cache, and BM25-related implementation.
---
FEATURE: 03-3-mcp-configuration.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: The MCP configuration entry accurately reflects current code and its listed source files are valid and sufficient.
---
FEATURE: 04-4-memory-and-storage.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/vector-index-store.ts, mcp_server/handlers/memory-ingest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The entry understates where `MEMORY_ALLOWED_PATHS` is enforced and overstates `SPECKIT_DB_DIR` as a primary runtime DB selector, while also missing the enforcement files.
---
FEATURE: 05-5-embedding-and-api.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/cross-encoder.ts, shared/embeddings.ts, shared/embeddings/factory.ts, shared/embeddings/providers/openai.ts, shared/embeddings/providers/voyage.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The entry has meaningful drift, including an unsupported `EMBEDDING_DIM` story, stale reranker thresholds, and source citations that point to tests/re-exports instead of the real provider implementation.
---
FEATURE: 06-6-debug-and-telemetry.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-context.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `SPECKIT_EXTENDED_TELEMETRY` is still active in runtime code, so the description needs correction and the memory-context handler should be added to the source list.
---
FEATURE: 07-7-ci-and-build-informational.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The listed files exist, but the documented vars appear to be used only for checkpoint metadata rather than a broader eval-record/build pipeline.
