### Finding SEC-003: Shared-memory rollout default is overstated in SKILL.md
- **Severity**: P1
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/SKILL.md:687`
- **Evidence**: The 011 spec pack preserves a docs-only boundary (`spec.md:63`, `spec.md:187`, `checklist.md:70-71`) and the current workspace diff for this review target contains only scratch-file edits, so no runtime TypeScript changes were introduced. However, `SKILL.md` documents `SPECKIT_MEMORY_SHARED_MEMORY` as `true`, while the runtime gate keeps shared memory default-OFF until explicitly enabled (`mcp_server/lib/collab/shared-spaces.ts:177-190`), the flag-reference doc also says OFF (`references/config/environment_variables.md:339`), and the doc-validation test encodes the legacy/shared-memory default as `false` (`mcp_server/tests/feature-flag-reference-docs.vitest.ts:69-76`).
- **Impact**: This mismatch can mislead operators or reviewers into believing shared-memory collaboration is enabled by default, weakening governance expectations and undermining the evidence behind CHK-031's docs-only boundary claim even though CHK-030 itself holds.
- **Fix**: Align `SKILL.md` with the runtime/default-off shared-memory rollout model and keep governance wording explicit that shared memory requires opt-in enablement (`/memory:shared` or env/database enablement), not implicit default activation.
