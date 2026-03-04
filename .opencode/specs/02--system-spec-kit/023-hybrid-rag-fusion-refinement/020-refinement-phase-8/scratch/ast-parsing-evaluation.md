# AST-Based Parsing Evaluation for `check-no-mcp-lib-imports.ts`

## Context
Current enforcement in `check-no-mcp-lib-imports.ts` is regex-based and line-oriented. It matches `import`, `from`, `require()`, and `import()` patterns, now including 1-hop transitive barrel checks. The question is whether to upgrade parsing to an AST approach.

## Evaluation Criteria
- Detection accuracy (false positives/false negatives)
- Implementation complexity and maintenance cost
- Runtime overhead in CI/local checks
- Fit for current policy scope (import/re-export boundary enforcement)

## Option 1: TypeScript Compiler API (`ts.createSourceFile` + `ts.forEachChild`)
### Pros
- Native TypeScript parser with no additional dependency.
- Strong accuracy for TS syntax, including multiline imports and edge cases.
- Easy direct access to `ImportDeclaration`, `ExportDeclaration`, and dynamic import call nodes.
- Stable API and good long-term maintainability for TS-first repo code.

### Cons
- More verbose AST traversal code than regex.
- Slight onboarding overhead for contributors unfamiliar with TS compiler nodes.
- Requires careful handling of different node kinds and string-literal extraction.

### Effort Estimate
- Medium: ~4-6 hours for initial migration + tests.

### Accuracy Improvement
- High: expected reduction in regex miss cases (multiline constructs, comments/strings edge cases).

### Runtime Impact
- Low to medium increase per file parse, typically acceptable for script-scale CI checks.

## Option 2: `@typescript-eslint/typescript-estree` (ESTree AST)
### Pros
- ESTree output is familiar to JS tooling users.
- Great if we plan to share lint-like logic with ESLint ecosystem tools.
- Good TS syntax handling when configured correctly.

### Cons
- Adds a new dependency and parser config surface.
- Slightly heavier toolchain integration than using built-in TypeScript APIs.
- Less direct benefit unless we also standardize on ESTree-based tooling elsewhere.

### Effort Estimate
- Medium-high: ~6-8 hours including dependency wiring and parser option hardening.

### Accuracy Improvement
- High: similar structural correctness gains to TS Compiler API.

### Runtime Impact
- Medium: parser startup and AST conversion overhead can be slightly higher.

## Option 3: Keep Regex + Incremental Hardening
### Pros
- Lowest immediate implementation effort.
- No dependency changes.
- Fast runtime, simple execution model.

### Cons
- Structural blind spots remain (complex syntax forms, line-based ambiguities).
- Ongoing patchwork likely increases regex complexity and fragility.
- Harder to prove correctness as policy rules grow.

### Effort Estimate
- Low initial: ~1-3 hours per iteration, but recurring maintenance cost.

### Accuracy Improvement
- Low to medium: improvements are incremental, not systemic.

### Runtime Impact
- Lowest overhead.

## Recommendation
**Recommend Option 1: TypeScript Compiler API.**

### Justification
- Best balance of accuracy, maintainability, and dependency footprint.
- Aligns with a TypeScript codebase without introducing additional parser packages.
- Supports future policy expansion (e.g., deeper transitive graph checks) with reliable syntax handling.
- Keeps runtime impact reasonable while eliminating regex-specific correctness gaps.

## Suggested Rollout
1. Keep current regex implementation as baseline behavior.
2. Introduce AST path behind a temporary feature flag and compare outputs on current `scripts/` tree.
3. Remove regex path once parity plus targeted edge-case improvements are verified.
