GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-code-opencode is preselected.
Permission: only WRITE to the audit-report file under the spec folder scratch path. Do NOT modify any production code or tests during this pass — this is an audit, not a fix.

# Task — Audit recent backend code against sk-code-opencode standards

## Scope

Audit the TypeScript files touched across the 007 + 008 phases plus remediation passes (commits 87bf42a3d → 6fd20b1a2). Focus: alignment with the sk-code-opencode skill's TypeScript / JavaScript / JSON standards.

## Files to audit

Production code (under `.opencode/skill/system-spec-kit/mcp_server/`):

- `code_graph/lib/code-graph-db.ts`
- `code_graph/lib/gold-query-verifier.ts` (new)
- `code_graph/lib/edge-drift.ts` (new)
- `code_graph/lib/query-result-adapter.ts` (new)
- `code_graph/lib/ensure-ready.ts`
- `code_graph/lib/structural-indexer.ts`
- `code_graph/lib/tree-sitter-parser.ts`
- `code_graph/lib/indexer-types.ts`
- `code_graph/handlers/verify.ts` (new)
- `code_graph/handlers/scan.ts`
- `code_graph/handlers/status.ts`
- `code_graph/handlers/index.ts`
- `code_graph/handlers/detect-changes.ts`
- `code_graph/handlers/query.ts`
- `code_graph/tools/code-graph-tools.ts`
- `tool-schemas.ts`
- `lib/architecture/layer-definitions.ts`

Tests:

- `code_graph/tests/code-graph-verify.vitest.ts` (new)
- `code_graph/tests/edge-drift.vitest.ts` (new)
- `code_graph/tests/code-graph-indexer.vitest.ts`
- `code_graph/tests/code-graph-scan.vitest.ts`
- `code_graph/tests/code-graph-query-handler.vitest.ts`
- `code_graph/tests/code-graph-siblings-readiness.vitest.ts`
- `code_graph/tests/detect-changes.test.ts`
- `mcp_server/tests/context-server.vitest.ts`
- `mcp_server/tests/crash-recovery.vitest.ts`

## Standards to apply

Read `.opencode/skill/sk-code-opencode/SKILL.md` and the bundled references for:

- TypeScript checklist (interfaces, strict tsconfig, type guards, no `any` unless escape-hatch is documented)
- General quality lenses (CLARITY, SYSTEMS, BIAS, SUSTAINABILITY, VALUE, SCOPE)
- HVR / banned words for any user-facing strings, error messages, or doc comments
- CommonJS vs ESM rules (the mcp_server is TS compiled to CommonJS — non-plugin path)
- Error handling at boundaries vs trust internal code
- Comment policy (only WHY, not WHAT)
- File length / module size guidance if present

## Output

Write a single audit report at:

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/scratch/sk-code-opencode-audit-report.md`

Sections:

1. **Summary** — verdict (PASS / CONDITIONAL / FAIL) + 1-paragraph headline
2. **Methodology** — which sk-code-opencode references you read and applied
3. **Findings by file** — per-file group, P0 / P1 / P2 with file:line + reason + suggested fix
4. **Cross-cutting themes** — patterns observed across multiple files
5. **Strengths** — things the code does WELL that match the standards (be honest; if nothing, skip)
6. **Remediation roadmap** — ordered list of fixes if any
7. **Adversarial self-check** — for each P0, validate the file:line is actually the problem, not a caller

## Severity rubric

- **P0 (blocker)**: violates a hard sk-code-opencode rule, introduces type unsafety or a runtime hazard
- **P1 (required)**: significant quality issue (poor naming, dead code, weak typing, missed boundary check, banned HVR phrasing in user-visible string)
- **P2 (suggestion)**: style or maintainability nit

## Constraints

- READ-ONLY review. Do not edit any source file.
- Cite exact file:line ranges in every finding.
- Cap report at ~600 lines; group findings tightly to keep it skimmable.
- Do not duplicate findings already covered in `review/review-report.md` (the deep-review report). Cross-reference instead and only call out NEW issues.
- If a file has no findings, list it under a "Clean" section by name.

When done, print a one-line summary: `AUDIT_DONE total_findings P0=N P1=N P2=N verdict=X`
