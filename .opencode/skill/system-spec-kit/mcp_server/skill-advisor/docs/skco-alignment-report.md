# sk-code-opencode Alignment Report

## Summary

- Scope audited: 134 files (`128` TypeScript files, `5` Python/JavaScript/MJS compatibility files, `1` JSONL corpus file).
- Triaged audit artifact: `/tmp/skco-audit-report.json`.
- P0 findings: `42` true violations, all missing TypeScript module headers.
- P1 findings: `9` true findings, `8` fixed mechanically and `1` deferred because it requires runtime module-format design judgment.
- Python compatibility scripts had no actionable P0/P1 findings after AST validation of signatures.
- JavaScript compatibility surfaces kept existing runtime behavior; `.opencode/plugins/spec-kit-skill-advisor.js` remains ESM because the OpenCode plugin surface exports `default`.

## Per-Rule Counts

| Rule | Before | After | Resolution |
| --- | ---: | ---: | --- |
| `box_header` | 42 | 0 | Added missing TypeScript `MODULE` headers. |
| `no_any` in public API | 0 | 0 | No exported `any` signatures found. |
| `pascal_case_types` | 0 | 0 | No non-PascalCase exported or local type names found. |
| `commented_out_code` | 0 | 0 | One scanner hit was prose in `readiness-contract.ts`, not commented code. |
| `non_null_justification` | 4 | 0 | Added justification comments before true non-null assertions. |
| `named_boundary_interface` | 3 | 0 | Extracted named interfaces for code-graph boundary return shapes. |
| `explicit_return_type` | 1 | 0 | Added `PromotionLatencyBenchReport` return type. |
| `python_type_hints` | 0 | 0 | AST check found all audited Python functions fully annotated. |
| `js_commonjs_exports` | 1 | 1 deferred | Deferred ESM-to-CommonJS change for OpenCode plugin runtime compatibility. |

## Files Touched

- Files changed: `48` total.
- TypeScript style fixes: `47` files.
- Documentation report: `1` file.
- Representative files:
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lease.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/daemon-status.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/latency-bench.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`

## Verification Evidence

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck`: exit `0`.
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`: exit `0`.
- `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run mcp_server/skill-advisor/tests/ mcp_server/code-graph/tests/ --reporter=default`: `30` files passed, `219/219` tests passed.
- `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`: `52/52` cases passed, `overall_pass: true`.
