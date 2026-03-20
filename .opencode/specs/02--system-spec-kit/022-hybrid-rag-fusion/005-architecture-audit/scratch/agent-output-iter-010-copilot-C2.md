● skill(sk-code--review)

I’m reading the standards first, then I’ll audit `system-spec-kit` against each requested dimension and compile a cited scorecard.

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/b276e5f1-ef98-4131-8538-799f2ddf9cba/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read standards in sk-code--opencode and sk-doc.…
  └ 6 lines...

● Explore Audit system-spec-kit
  │ Count markdown files and list some (shell)
  │   │ find "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit" -name "*.md" ! -path "*/node_modules/*" | wc -l
  │   &&
  │   │ find "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit" -name "*.md" ! -path "*/node_modules/*" | head
  │   -20
  │   └ 22 lines...
  └ Check README organization (shell)
      │ grep -n "^-" "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/README.md" | head -20
      └ 21 lines...

I’ve got a strong first pass from the audit, and I’m now spot-checking the key claims directly in the repo so the final scorecard is grounded in exact citations.

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/tsconfig.json
  └ L1:80 (23 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L1:120 (119 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/shared/index.ts
  └ L1:120 (120 lines read)

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ L1:220 (220 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L1:140 (140 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-doc/SKILL.md
  └ L280:380 (101 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-code--opencode/SKILL.md
  └ L330:470 (141 lines read)

● Search (grep)
  │ "README|SKILL|frontmatter|DQI|table of contents|TOC|extract_structure"
  │ (.opencode/skill/sk-doc/SKILL.md)
  └ 5 lines found

● Search (grep)
  │ "^export \* from './|^export \{|^export type \{" in **/index.ts
  │ (.opencode/skill/system-spec-kit)
  └ 127 lines found

● Search (grep)
  │ "console\.(log|warn|error|info|debug)" in **/*.{ts,js,mjs,cjs} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "class\s+\w+\s+extends\s+Error|new Error\(|instanceof Error" in **/*.ts
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (glob)
  │ "/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/**/*.{test,spec,vitest}.ts"
  └ No matches found

● Search (glob)
  │ "/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/**/*.ts"
  └ No matches found

I’ve confirmed the top-level standards and a few representative files. Next I’m narrowing the evidence to concrete examples for each grade so the scorecard is precise rather than hand-wavy.

● Search (grep)
  │ "structuredLog|logger" in **/*.ts (.opencode/skill/system-spec-kit/scripts/utils)
  └ 20 lines found

● Search (grep)
  │ "^export (async )?function " in **/*.ts (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "console\.log" in **/*.{ts,js,mjs,cjs} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "class\s+\w+\s+extends\s+Error" in **/*.ts (.opencode/skill/system-spec-kit)
  └ 3 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/*.spec.ts"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/*.test.ts"
  └ 2 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/*.vitest.ts"
  └ 5 files found

I found a meaningful wrinkle: `system-spec-kit` does use custom `Error` subclasses in the MCP server, so I’m checking whether that’s consistent or fragmented across the workspace before grading that dimension.

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L180:280 (101 lines read)

● Read logger.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/logger.ts
  └ L1:120 (50 lines read)

● Read core.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts
  └ L1:180 (180 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/index.ts
  └ L1:80 (80 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L430:520 (91 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/scripts/core/index.ts
  └ L1:90 (39 lines read)

● Search (grep)
  │ "console\.(warn|error|info|debug)" in **/*.{ts,js,mjs,cjs} (.opencode/skill/system-spec-kit)
  └ 5 files found

● Search (grep)
  │ "console\.log" in **/*.{ts,js,mjs,cjs} (.opencode/skill/system-spec-kit)
  └ 80 files found

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L45:80 (35 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L1:60 (60 lines read)

● Read spec-doc-health.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts
  └ L1:80 (80 lines read)

● Read folder-detector.ts
  │ .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts
  └ L1:60 (60 lines read)

● Read spec-doc-health.test.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.test.ts
  └ L1:40 (40 lines read)

● Read eval-the-eval.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts
  └ L1:30 (30 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/index.ts
  └ L1:40 (7 lines read)

● Read decision-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ L1:40 (40 lines read)

● Read spec-doc-health.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts
  └ L150:240 (91 lines read)

● Read path-utils.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts
  └ L1:80 (80 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts
  └ L1:80 (40 lines read)

● Search (grep)
  │ "export function evaluateSpecDocHealth|export async function evaluateSpecDocHealth|export const
  │ evaluateSpecDocHealth" (.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts)
  └ 1 line found

● Search (grep)
  │ "^export (async )?function .*" in **/*.ts (.opencode/skill/system-spec-kit/scripts)
  └ 67 lines found

● Search (grep)
  │ "extract_structure\.py|DQI score|Strict|README|SKILL" (.opencode/skill/sk-doc/SKILL.md)
  └ 80 lines found

● Read path-utils.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts
  └ L80:140 (30 lines read)

● Read task-enrichment.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts
  └ L1:50 (49 lines read)

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts
  └ L1:40 (23 lines read)

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L247:272 (26 lines read)

● Search (grep)
  │ "export \{ sanitizePath|getPathBasename|export function sanitizePath|export function
  │ getPathBasename" (.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts)
  └ 2 lines found

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L1:80 (79 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L1:80 (80 lines read)

● Search (grep)
  │ "console\.(warn|error)" in **/*.ts (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "console\.(warn|error|log)" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "console\.log" in **/*.ts (.opencode/skill/system-spec-kit)
  └ 5 lines found

I found another useful nuance: TypeScript tests mostly follow the expected `*.test.ts` / `*.vitest.ts` pattern, but there’s also a legacy `scripts/tests/test-*.js` suite, so that dimension is more mixed than it first looked.

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts
  └ L1:40 (18 lines read)

● Read quality-extractors.test.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts
  └ L1:20 (20 lines read)

● Search (grep)
  │ "^import " (.opencode/skill/system-spec-kit/shared/embeddings/factory.ts)
  └ 4 lines found

● Read test-phase-command-workflows.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js
  └ L1:20 (20 lines read)

● Read test-bug-fixes.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js
  └ L1:20 (20 lines read)

● Read historical-memory-remediation.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts
  └ L1:20 (20 lines read)

I’ve got enough static evidence for most categories. I’m doing one last pass with existing validation commands where they add real signal, mainly strict TypeScript and document-structure checks.

● Read package.json
  │ .opencode/skill/system-spec-kit/package.json
  └ L1:80 (44 lines read)

● Run doc structure checks (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3
  │ .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/SKILL.md |
  │ head -n 80 && printf '\n---README---\n' && python3
  │ .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/README.md |
  │ head -n 80
  └ 163 lines...

● Run system-spec-kit typecheck (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && npm run -s typecheck
  └ 1 line...

One last documentation check: I want exact citations for the `sk-doc` expectations, and whether `system-spec-kit/SKILL.md` stays within the skill-size guidance.

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L820:847 (28 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L680:692 (13 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-doc/SKILL.md
  └ L430:480 (51 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-doc/SKILL.md
  └ L752:762 (11 lines read)

● Count doc words (shell)
  │ wc -w '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/SKILL.md'
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/README.md'
  └ 4 lines...

● Read message-utils.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/message-utils.ts
  └ L80:130 (51 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts
  └ L1:50 (36 lines read)

● Search (grep)
  │ "^## " (.opencode/skill/system-spec-kit/README.md)
  └ 10 lines found

● Search (grep)
  │ "^## " (.opencode/skill/system-spec-kit/SKILL.md)
  └ 12 lines found

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ L220:320 (100 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L438:540 (103 lines read)

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts
  └ L12:24 (12 lines read)

● Read config.ts
  │ .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ L90:120 (31 lines read)

● Read file-writer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  └ L100:140 (41 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts
  └ L1:20 (18 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/shared/index.ts
  └ L120:220 (101 lines read)

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ L57:80 (24 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-code--opencode/SKILL.md
  └ L418:454 (37 lines read)

✗ Memory stored build commands
  └ Run TypeScript checks for system-spec-kit with `npm run -s typecheck` from `.ope…

## Compliance Scorecard

| Dimension | Grade | Evidence |
|---|---|---|
| 1. JSDoc coverage on exported functions | **B-** | The overlay standard treats public-function docs as **P1** (`.opencode/skill/sk-code--opencode/SKILL.md:419-423,445-449`). There are solid examples, like `resolveProvider` and `validateApiKey` (`.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:71-75,300-307`) and `normalizeSpecTitleForMemory` / related exports (`.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:16-36`). But exported wrappers/helpers still ship without JSDoc, e.g. `extractTriggerPhrases*` (`.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:15-23`) and exported path helpers (`.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts:23-25,98-108`). |
| 2. Error class usage consistency | **C+** | `mcp_server` has a clear custom-error pattern with `MemoryError`, `PreflightError`, and `ToolSchemaValidationError` (`.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:90-109`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:209-238`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:444-500`). But `shared` and `scripts` still rely heavily on generic `Error` throws (`.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:129-188`, `.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts:23-25,31-33,83-89`). So error handling is competent, but not workspace-wide consistent. |
| 3. Logger usage (`console.log` vs proper logger) | **C+** | There is a proper structured logger abstraction in scripts (`.opencode/skill/system-spec-kit/scripts/utils/logger.ts:26-50`), and it is used in places like `message-utils` and `path-utils` (`.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:82-126`, `.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts:30-33,83-89`). However, direct `console.*` calls remain common in other areas: provider factory (`.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:87-99,125-177,227-257`), file writing (`.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:111-129`), MCP error reporting (`.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:169-172`), and CLI output (`.opencode/skill/system-spec-kit/mcp_server/cli.ts:43-75`). |
| 4. Import organization | **A-** | The codebase generally follows clean grouping by stdlib/external/internal, e.g. `folder-detector.ts` (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:10-33`) and `data-loader.ts` (`.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:13-35`). The OpenCode standard treats import-order work as **P2** optimization (`.opencode/skill/sk-code--opencode/SKILL.md:451-453`). I didn’t see major disorder, just normal variation in simpler files like `factory.ts` (`.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:5-14`). |
| 5. File naming conventions | **A** | Source files are consistently kebab-case and aligned with the naming rule set (`.opencode/skill/sk-code--opencode/SKILL.md:348-353`), with representative examples like `folder-detector.ts` (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1-3`), `path-utils.ts` (`.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts:1-3`), and `spec-doc-health.ts` (`.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts:1-3`). |
| 6. Module structure (barrel exports) | **A** | Barrel/module organization is a strength. `shared/index.ts` is sectioned and centralized (`.opencode/skill/system-spec-kit/shared/index.ts:72-124,126-220`), `scripts/utils/index.ts` and `scripts/core/index.ts` are clean re-export surfaces (`.opencode/skill/system-spec-kit/scripts/utils/index.ts:8-45`, `.opencode/skill/system-spec-kit/scripts/core/index.ts:8-37`), and `mcp_server` does the same for errors and pipeline APIs (`.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-40`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:4-36`). |
| 7. Test file naming conventions | **B** | Modern TS tests follow the expected patterns: `*.test.ts` and `*.vitest.ts` (`.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.test.ts:1-10`, `.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:1-15`). But there is also a legacy JS suite named `test-*.js` rather than suffix-based test names (`.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:1-7`, `.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:1-4`). So conventions are good in newer TS code, mixed across the whole workspace. |
| 8. TypeScript strict mode compliance | **A** | Root TS config has `strict: true` and project references for `shared`, `mcp_server`, and `scripts` (`.opencode/skill/system-spec-kit/tsconfig.json:2-22`). The workspace `typecheck` script covers all three (`.opencode/skill/system-spec-kit/package.json:14-24`). I also ran `npm run -s typecheck` successfully. |
| 9. Documentation quality of `SKILL.md` and `README.md` | **B** | `sk-doc` requires strict structure/frontmatter for `SKILL.md`, allows TOCs for `README.md`, requires validation, and recommends keeping `SKILL.md` under 5k words (`.opencode/skill/sk-doc/SKILL.md:304-305,436-445,470-478,758-759`). `system-spec-kit/SKILL.md` has proper frontmatter and the expected major sections (`.opencode/skill/system-spec-kit/SKILL.md:1-16,86-140,676-818`), and `README.md` is well-structured with frontmatter, TOC, overview, quick start, and related docs (`.opencode/skill/system-spec-kit/README.md:1-32,39-117,659-692`). The main ding: `SKILL.md` is slightly over the `<5k` guidance; `wc -w` reports **5,292** words. |

Strongest areas: **module structure, file naming, and strict TypeScript setup**.

Main compliance gaps: **mixed error/logging strategy across workspaces, uneven JSDoc coverage, and legacy `test-*.js` naming**.

