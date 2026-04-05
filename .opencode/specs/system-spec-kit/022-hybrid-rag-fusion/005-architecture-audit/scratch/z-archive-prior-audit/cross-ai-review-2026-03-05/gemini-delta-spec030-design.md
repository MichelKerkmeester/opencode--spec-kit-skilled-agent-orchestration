MCP issues detected. Run /mcp list for status.## GEMINI-DELTA: Spec 013 Design Review

### Dimension Scores
| Dimension | Score (1-10) | Assessment |
|-----------|-------------|------------|
| 1. Problem Framing | 6 | Identifies valid boundary gaps but entirely misses the CRITICAL evasion vectors identified in predecessor Spec 012 (e.g., `core/*` not blocked, dynamic imports undetected). |
| 2. Scope Sizing | 7 | Phase 2 API expansion risks significant scope creep if deep internal types and classes must be exported. |
| 3. Phase Design | 8 | Logical progression, but enforcement (Phase 3) could be implemented first (with current exceptions) to prevent new violations during the refactor. |
| 4. Alternative Approaches | 8 | Moving constants to `shared/` is architecturally sound, but expanding `api/` for administrative scripts is an anti-pattern. |
| 5. Enforcement Automation | 8 | Correctly identifies the need for automation, but leaves the critical choice (CI vs. pre-commit) as an open question instead of mandating CI. |
| 6. API Surface Expansion | 4 | Exposing internal storage primitives (`checkpoints`, `access-tracker`) via the public `api/` boundary degrades encapsulation. |
| 7. Backward Compatibility | 10 | Re-exporting `DB_UPDATED_FILE` from `core/config` is an excellent, zero-friction safeguard. |
| 8. Testing Strategy | 6 | Relies heavily on `tsc` and manual checks. Import path changes can introduce runtime circular dependencies that `tsc` will ignore. |
| 9. Rollback Plan | 9 | Clear, commit-based rollback is feasible and low-risk. |
| 10. Effort Estimation | 7 | 2-4 hours is optimistic if Phase 2 triggers a cascade of type exports or if circular dependencies occur. |

### Phase Design Analysis
The current sequence (Phase 1: Constant -> Phase 2: API -> Phase 3: Enforcement) leaves the codebase vulnerable to new boundary violations while work is ongoing. 

**Recommendation**: Move CI Enforcement (Phase 3) to **Phase 1**, configuring it to run the existing `npm run check` with the *current* allowlist. This immediately stops the bleeding. Then proceed with Phase 2 (Constant/Indexer Migration) and Phase 3 (Reindex Audit), burning down the allowlist and testing against the newly established CI gate.

### Open Question Recommendations
| Question | Recommendation | Rationale |
|----------|---------------|-----------|
| Should enforcement use a pre-commit hook (husky) or CI-only (GitHub Actions)? | **CI-Primary, Pre-commit Optional** | CI is non-bypassable and guarantees enforcement on PRs. Pre-commit hooks can be bypassed (`git commit --no-verify`) and should only be used for optional fast-feedback, not as the primary security gate. |
| Should `mcp_server/api/` get a new `storage.ts` module or extend `search.ts`? | **Neither (Do not expose primitives)** | Exposing `checkpoints` and `access-tracker` primitives pollutes the public API boundary. `api/` should be reserved for high-level runtime interactions. |
| Can `reindex-embeddings.ts` be fully migrated to api/ or does it need the wildcard permanently? | **Retain Specific Exceptions** | Scripts that inherently manipulate low-level database state (like a re-indexer) are valid exceptions to the `api/` boundary. Replace the wildcard with explicit, specific file imports in the allowlist and document them as permanent administrative exceptions. |

### Alternative Approach Evaluation
**1. Moving `DB_UPDATED_FILE` to `shared/config`**
- *Proposed:* Move to `shared/config` and re-export.
- *Alternative:* Duplicate the constant. (Violates DRY).
- *Alternative:* Expose via `api/`. (Incorrect concern; it's a structural constant, not a runtime API).
- *Evaluation:* The proposed move to `shared/` is the optimal architectural choice.

**2. Expanding `api/` to support `reindex-embeddings.ts`**
- *Proposed:* Expose `checkpoints` and `access-tracker` through `api/`.
- *Alternative:* Move the reindex logic inside `mcp_server/` and expose a single `api.reindex()` orchestration method.
- *Alternative:* Keep the script in the allowlist, but narrow the wildcard to specific imports.
- *Evaluation:* The proposed approach degrades the API boundary. The alternatives (orchestration method or explicit allowlisting) are vastly superior.

### Findings by Severity
#### CRITICAL
- **Ignored Spec 012 Evasion Vectors**: Spec 013 completely ignores the critical enforcement flaws found in the Spec 012 audit (e.g., `check-no-mcp-lib-imports.ts` does not block `core/*` imports, ignores dynamic imports, and fails on relative paths). Remediation of the enforcement *scripts themselves* must be included.
- **Missing CI Pipeline Mandate**: Leaving CI vs. pre-commit as an open question is dangerous. Enforcement MUST be mandated in CI.

#### MAJOR
- **API Boundary Pollution**: Modifying the public `api/` boundary to expose low-level storage mechanisms solely to satisfy an administrative script breaks encapsulation principles.
- **Incomplete Testing Strategy**: The testing strategy omits running the main automated test suite (`npm run test` or `vitest`). Import refactoring frequently introduces Node.js runtime circular dependencies that TypeScript (`tsc --noEmit`) will not catch.

#### MINOR
- **Scope Creep Risk**: Exposing deep internals for Phase 2 will likely require exporting dozens of underlying interfaces and types, breaking the 2-4 hour time budget.

#### PASS
- **Backward Compatibility**: Re-exporting legacy paths is perfectly executed.
- **Allowlist JSON Updates**: The governance metadata requirements for the allowlist are well respected.

### Recommendations for Spec Improvement
1. **Add Enforcement Script Fixes**: Add a Phase to update `check-no-mcp-lib-imports.ts` and `check-api-boundary.sh` to fix the evasion vectors identified in Spec 012 (block `core/*`, detect relative paths, and catch dynamic imports).
2. **Mandate CI**: Update the scope and tasks to explicitly require a CI workflow integration, explicitly rejecting a pre-commit-only approach.
3. **Revise the Reindex Strategy**: Change Phase 2 to: "Audit `reindex-embeddings.ts` and replace its `lib/*` wildcard exception with explicit, specific path exceptions in the allowlist." Remove the requirement to expand the `api/` surface for these internals.
4. **Expand Verification**: Add `npm test` (or the project's runtime test equivalent) to Phase verification tasks and `checklist.md` to catch circular dependencies.

### Overall Verdict
MAJOR REVISIONS
Confidence: 95/100
