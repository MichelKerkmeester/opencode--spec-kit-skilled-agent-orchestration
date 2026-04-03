## [v0.3.0] - 2026-03-29

This phase matters because the scripts layer had to stay dependable while the packages around it changed. Phase 3 kept the scripts package stable during the ESM (the modern JavaScript module system) migration, proved that memory saving still works from input to indexing, and locked the JSON input contract so future saves are easier to generate correctly.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor` (Level 1)

---

## Architecture (3)

These changes focused on keeping the scripts package predictable while nearby packages moved to a newer module format.

### Kept the scripts package stable during the module-system transition

**Problem:** The scripts package had to keep its existing behavior while nearby packages moved to ESM (the modern JavaScript module system). Changing both sides at once would have made this phase larger, harder to verify, and more likely to break the tools that depend on scripts behaving the same way.

**Fix:** The scripts package kept its current external behavior while gaining a safe path to work with the migrated packages around it. That means the package can stay familiar to existing callers while still participating in the newer module setup behind the scenes.

### Removed the loading blockers that made cross-package use fail at runtime

**Problem:** The migration looked supported in theory, but some modules still paused during startup in ways that blocked real runtime loading. In practice, that meant the boundary between the scripts package and the migrated packages could still fail when the system actually ran.

**Fix:** Phase 3 cleared those blockers so the scripts package can now load the migrated packages through the normal runtime path. This turns cross-package use from a fragile edge case into the expected behavior during everyday execution.

### Reworked module-sensitive verification around real runtime behavior

**Problem:** Some tests still focused on older output details instead of checking what the system actually does when it runs. That left room for the test suite to say "pass" even if the live package boundary was still unreliable.

**Fix:** The phase shifted those checks toward real runtime behavior. That gives the release stronger proof that the system works in practice, not just that it still resembles an older internal layout.

---

## Saving Memories (4)

These fixes matter because a migration is not complete if session context becomes easier to lose while the platform is changing.

### Hardened the main save workflow so nearby package changes do not knock it offline

**Problem:** The main save path depended too directly on code that was changing during the migration. That made context capture vulnerable at exactly the moment when teams most needed a reliable way to save work and recover from interruptions.

**Fix:** The main save workflow now stays available even while nearby packages evolve. Users get a steadier context-saving path instead of a feature that can fail because an unrelated migration step happened first.

### Fixed phased-spec recognition so valid child work stops getting rejected

**Problem:** Work inside phased specs could be mistaken for unrelated work and blocked from saving. In plain terms, valid child phases could fail their own identity checks and be treated like they belonged somewhere else.

**Fix:** Phase 3 corrected that recognition path and expanded the allowed related-spec handling for legitimate cross-spec research. Saves that belong to validated child phases or approved related specs now pass with the project structure instead of fighting it.

### Added a fallback save path so blocked primary saves no longer become dead ends

**Problem:** When the main save route failed, there was no strong backup path for manually captured context. That made one broken save path much more expensive than it should have been because important session state could simply stop moving forward.

**Fix:** Users now have a recovery path when the main save route is blocked. Context can still be captured, stored, and picked up later instead of being lost because the preferred save route was temporarily unavailable.

### Locked the JSON input contract so save requests are easier to produce correctly

**Problem:** The structured JSON save input had too many aliases and too little clarity about what shape would be accepted. That made it harder for agents and operators to produce reliable save requests without trial and error.

**Fix:** Phase 3 froze the JSON v2 input contract and kept compatibility for older inputs. The save pipeline now has a clearer target shape, which makes structured saves more predictable and reduces avoidable input mistakes.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Tests passing | 0 verified in this phase packet | 476/477 scripts tests passing |
| Test files | 0 phase-verification files recorded | 6 targeted verification files updated or added |
| TypeScript errors | 0 reported | 0 reported |

Phase 3 also recorded a passing help-command smoke check, completed the module-sensitive verification suites, and documented an end-to-end save pipeline check from structured JSON input through memory indexing.

---

<details>
<summary>Technical Details: Files Changed (13 total)</summary>

### Source (5 files)

| File | Changes |
| ---- | ------- |
| `scripts/core/workflow.ts` | Removed direct runtime coupling so the main save workflow keeps working during the package transition. |
| `scripts/lib/validate-memory-quality.ts` | Fixed descendant phase detection and added `related_specs` allowlist support so valid child and related spec saves are accepted. |
| `scripts/memory/generate-context.ts` | Carried the frozen JSON v2 input contract and compatibility behavior for structured save input. |
| `mcp_server/handlers/save/markdown-evidence-builder.ts` | Expanded primary-evidence parsing so manually written context files qualify for recovery more reliably. |
| `shared/parsing/memory-sufficiency.ts` | Recognized stronger manual evidence and supported the fallback save path. |

### Tests (6 files)

| File | Changes |
| ---- | ------- |
| `scripts/tests/test-scripts-modules.js` | Proved the scripts package can use migrated sibling packages at runtime. |
| `scripts/tests/test-export-contracts.js` | Checked boundary behavior so exported surfaces stay dependable across the module transition. |
| `mcp_server/tests/modularization.vitest.ts` | Updated verification to reflect real runtime behavior instead of older output assumptions. |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Updated module-boundary assertions for the migrated runtime behavior. |
| `scripts/tests/test-integration.vitest.ts` | Verified scripts integration against the new package boundary. |
| `scripts/tests/architecture-boundary-enforcement.vitest.ts` | Verified the architecture rules that protect the boundary between scripts and migrated packages. |

### Documentation (2 files)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/spec.md` | Recorded the phase scope, save-pipeline hardening work, and the JSON v2 contract requirement. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/tasks.md` | Recorded completion evidence for the scripts tests, help-command smoke, schema freeze, and end-to-end save verification. |

</details>

---

## Upgrade

No migration required.

The scripts package keeps its existing outward contract. The release changes how safely it works with migrated sibling packages and how reliably session context can still be saved and recovered during that transition.
