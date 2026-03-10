# Phase 002-mutation — Mutation — Audit Plan

## Methodology

### Step 1: Feature Inventory
- Read all 10 feature .md files in `feature_catalog/02--mutation/`
- Extract source file lists (Implementation + Tests)
- Map features to manual test playbook scenarios (EX-010..EX-017, NEW-*)

### Step 2: Code Review Per Feature
For each feature's source files:
- **Correctness:** Logic bugs, off-by-one, null/undefined handling, error paths
- **Standards:** sk-code--opencode TypeScript checklist (naming, types, error handling, imports)
- **Behavior:** Does code match the "Current Reality" description in the catalog?
- **Edge cases:** Boundary conditions, empty inputs, concurrent access

### Step 3: Test Coverage Assessment
- Verify tests exist for all listed test files
- Verify tests cover the described behavior
- Identify gaps between described functionality and test assertions

### Step 4: Manual Test Playbook Cross-Reference
- Find matching scenarios: EX-010..EX-017, NEW-*
- Note features with NO manual test scenario (gap)
- Note if scenario adequately covers described feature

### Step 5: Findings Report
Per feature, produce structured findings:
- Status: PASS | WARN | FAIL
- Code Issues
- Standards Violations
- Behavior Mismatch
- Test Gaps
- Playbook Coverage
- Recommended Fixes

## sk-code--opencode Checklist (per file)

- [ ] Naming: camelCase functions, PascalCase types/interfaces
- [ ] Imports: explicit, no barrel re-exports of side-effect modules
- [ ] Types: strict TypeScript, no `any` without justification
- [ ] Error handling: typed errors, no swallowed catches
- [ ] Null safety: optional chaining, nullish coalescing
- [ ] Constants: UPPER_SNAKE_CASE, no magic numbers
- [ ] Functions: single responsibility, < 50 lines preferred
- [ ] Comments: only where logic is non-obvious
- [ ] Exports: explicit named exports
