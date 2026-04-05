● Search (grep)
  │ "warn|warning|template-data|missing|required"
  │ (.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts)
  └ 4 lines found

● Search (grep)
  │ "warn|warning|template-data|renderTemplate|render.*template"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 41 lines found

● Search (glob)
  │ "**/*template*.{test,spec}.{ts,tsx,js,mjs,cjs}"
  └ 1 file found

● Search (grep)
  │ "template-data|template data|warning|warn" in **/*.{test,spec}.{ts,js,mjs,cjs}
  └ 9 lines found

● Read template-renderer.ts
  │ .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts
  └ 221 lines read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2120:2285 (166 lines read)

● Search (grep)
  │ "renderTemplate|template-renderer|Missing template data|template data|template warning|warn\("
  │ in **/*test*.{ts,js,mjs,cjs} (.opencode/skill/system-spec-kit)
  └ 25 lines found

I found the key warning hooks; next I’ll trace how they flow through workflow execution and what tests actually assert about warnings vs failures.

● Read workflow-e2e.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
  └ L420:500 (81 lines read)

● Read test-template-comprehensive.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js
  └ L130:280 (150 lines read)

● Read test-scripts-modules.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js
  └ L1230:1315 (86 lines read)

● Search (grep)
  │ "populateTemplate|renderTemplate\(|templateContract|Missing template data|structuredLog\('warn'"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 8 lines found

● Search (grep)
  │ "Missing template data for|warnSpy|console\.warn|warning"
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 73 lines found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1885:2045 (161 lines read)

● Read logger.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/logger.ts
  └ 50 lines read

● Search (glob)
  │ "**/*context*_template*.md" in .opencode/skill/system-spec-kit/scripts
  └ No matches found

● Search (grep)
  │ "\{\{[\^#/]?\w+[\w.]*\}\}" in **/*template*.md (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1360:1455 (96 lines read)

● Read workflow-e2e.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
  └ L500:560 (60 lines read)

● Search (glob)
  │ "**/context_template.md" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (grep)
  │ "\{\{[\w.#/^]+\}\}" (.opencode/skill/system-spec-kit/templates)
  └ 5 lines found

● Search (grep)
  │ "\{\{[\w.]+\}\}" (.opencode/skill/system-spec-kit/templates/context_template.md)
  └ 5 lines found

✗ Compare template placeholders with workflow data keys (shell)
  │ node - <<'NODE'
  │ const fs=require('fs');
  │ const p='/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/templates/context_template.md';
  │ const t=fs.readFileSync(p,'utf8');…
  └ Permission denied and could not request permission from user

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L150:230 (81 lines read)

● Search (grep)
  │ "populateTemplate\(|renderTemplate\(" (.opencode/skill/system-spec-kit/scripts/tests)
  └ 8 lines found

● Search (grep)
  │ "Missing template data for" (.opencode/skill/system-spec-kit)
  └ 2 lines found

● Read memory-render-fixture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
  └ L340:470 (131 lines read)

● Read context_template.md
  │ .opencode/skill/system-spec-kit/templates/context_template.md
  └ L1:220 (220 lines read)

● Read context_template.md
  │ .opencode/skill/system-spec-kit/templates/context_template.md
  └ L221:520 (299 lines read)

● Search (grep)
  │ "console\.warn|warnSpy|Missing template data|QUALITY_GATE_WARN|QUALITY_GATE_ABORT"
  │ (.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts)
  └ No matches found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2038:2122 (85 lines read)

● Search (grep)
  │ "warnSpy|Missing template data
  │ for|QUALITY_GATE_WARN|QUALITY_GATE_ABORT|toHaveBeenCalledWith|not\.toHaveBeenCalled"
  │ (.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts)
  └ 5 lines found

● Search (grep)
  │ "Missing template data for|placeholder leakage|\{\{"
  │ (.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts)
  └ 4 lines found

● Search (grep)
  │ "template contract|missing_frontmatter|missing_|empty|warning" in **/*template*contract*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 4 lines found

● Search (grep)
  │ "function validateMemoryTemplateContract|validateMemoryTemplateContract\("
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 12 lines found

● Read memory-render-fixture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
  └ L200:260 (61 lines read)

● Read memory-template-contract.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts
  └ 167 lines read

● Search (grep)
  │ "export function validateMemoryTemplateContract|function validateMemoryTemplateContract"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "function collectSessionData|const collectSessionData|export .*collectSessionData"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "SESSION_STATUS|COMPLETION_PERCENT|LAST_ACTIVITY_TIMESTAMP|SESSION_DURATION|CONTINUATION_COUNT|C
  │ ONTEXT_SUMMARY|PENDING_TASKS|RESUME_CONTEXT" (.opencode/skill/system-spec-kit/scripts)
  └ 7 files found

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L640:860 (221 lines read)

● Search (grep)
  │ "SESSION_STATUS|COMPLETION_PERCENT|LAST_ACTIVITY_TIMESTAMP|SESSION_DURATION|CONTINUATION_COUNT|C
  │ ONTEXT_SUMMARY|PENDING_TASKS|RESUME_CONTEXT|HAS_PREFLIGHT_BASELINE|PREFLIGHT_"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 42 lines found

I’m now mapping each warning site to its exact condition (and whether it still allows success), then I’ll synthesize a clear pass/fail answer for Q10.

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1318:1370 (53 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1570:1635 (66 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1768:1820 (53 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2388:2455 (68 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1128:1270 (143 lines read)

● Read memory-template-contract.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "function validateMemoryTemplateContract|missing_frontmatter|invalid_trigger_phrases|raw_mustach
  │ e_literal|required|title|description|contextType|importance_tier"
  │ (.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts)
  └ 34 lines found

● Read memory-template-contract.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts
  └ L258:360 (103 lines read)

● Read memory-template-contract.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts
  └ L360:430 (29 lines read)

✗ Run targeted workflow e2e tests for warning behavior (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npx vitest run
  │ tests/workflow-e2e.vitest.ts -t 'writes memory + metadata and keeps happy path free from
  │ template-data warnings|warns but proceeds for stateless saves when only V10 fails validation'
  │ --reporter=verbose
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "structuredLog\('warn'|console\.warn\("
  │ (.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts)
  └ 7 lines found

● Search (grep)
  │ "console\.warn\(|\bwarn\(" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Read copilot-tool-output-1773992306997-qr8t81.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773992306997-qr8t81.txt
  └ 1 line read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2148:2260 (113 lines read)

● Search (grep)
  │ "\bwarn\(|console\.warn\(" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 27 lines found

✗ Memory stored testing practices
  └ workflow-e2e has a happy-path assertion that no 'Missing template data for' warn…

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2288:2330 (43 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1948:1970 (23 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1408:1452 (45 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1592:1618 (27 lines read)

Yes — successful runs can still emit warnings.

`template-renderer.ts` warning point:
- `147`: `structuredLog('warn', "Missing template data for: {{KEY}}")` when placeholder value is `undefined/null` and `KEY` is not in `OPTIONAL_PLACEHOLDERS`.

`workflow.ts` warning points:
- Non-fatal degradation: `1168,1173,1227,1251,1256,1350,1965,2308,2320,2423-2425,2442`.
- Warn-and-continue policy: `1429` (`ALIGNMENT_WARNING`), `1807`, `2181`, `2199`, `2240-2247`.
- Warn-and-abort (substantive): `1448,1614,2164,2209,2219,2229,2234`.

Tests:
- `workflow-e2e.vitest.ts:423-445` explicitly checks happy path has no `"Missing template data for"`.
- Most other template tests check render validity/contract/no raw mustache, not globally warning-free.

Recommendation:
- Promote to error: non-optional missing placeholders in frontmatter/mandatory sections.
- Keep as warnings: optional-section gaps, enrichment degradation, indexing/embedding failures, soft-quality policy warns.


Total usage est:        1 Premium request
API time spent:         7m 46s
Total session time:     8m 10s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex            1.7m in, 17.4k out, 1.6m cached (Est. 1 Premium request)
