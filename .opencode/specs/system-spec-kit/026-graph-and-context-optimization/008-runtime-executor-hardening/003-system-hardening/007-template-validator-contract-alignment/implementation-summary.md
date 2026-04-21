---
title: "Implementation Summary: Template/Validator Contract Alignment"
description: "Validator registry, semantic frontmatter validation, anchor parity, reporting split, and decision-record template fix."
trigger_phrases: ["validator alignment summary"]
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/007-template-validator-contract-alignment"
    last_updated_at: "2026-04-18T22:55:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Completed validator regression; full mcp_server suite blocked"
    next_safe_action: "Resolve broad mcp_server suite failures outside validator scope"
---
# Implementation Summary: Template/Validator Contract Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-template-validator-contract-alignment |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
| **Source Review** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/review-report.md` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Implemented all five ranked proposals from the template/validator audit:

- Rank 1 registry canonicalization: `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json` now stores rule IDs, aliases, paths, severities, descriptions, strict-only flags, and authored/runtime categories; `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.ts` exposes a typed loader.
- Rank 1 validator wiring: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` now reads canonical names, severities, script paths, default dispatch order, and help text from the registry through `validator_registry_query()` and `emit_rule_script()`.
- Rank 2 frontmatter semantics: `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh` rejects empty `title`, `description`, `trigger_phrases`, `importance_tier`, and `contextType`; `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` treats empty continuity fields as missing.
- Rank 2 grandfathering: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-grandfather-allowlist.json` provides a bounded cutoff allowlist for legacy empty-frontmatter exceptions.
- Rank 3 anchor parity: `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh` rejects duplicate opening anchor IDs, matching `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts`.
- Rank 4 reporting split: `.opencode/skill/system-spec-kit/scripts/rules/README.md` and `validate.sh --help` group rule coverage into `authored_template` and `operational_runtime`.
- Rank 5 template repair: `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` now has a valid frontmatter description without the stray comment terminator.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The validator refactor was kept additive to the dirty worktree. Existing canonical-save rule work in `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` and `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh` was preserved and represented in the registry rather than reverted.

Validation changes were covered through focused synthetic cases in `.opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts`. The tests assert registry/help parity, empty authored frontmatter failure, empty continuity-field failure, and duplicate anchor failure.

The active 026 packet scan found no latent duplicate opening anchor IDs outside review/research/archive trees, so Rank 3 should not introduce immediate active-packet cleanup work.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- The JSON registry is the shell-facing source of truth because Bash can read it through Node without adding a `jq` dependency.
- The TypeScript registry file is a typed loader over the JSON file, avoiding duplicate metadata while still giving TS consumers a stable module.
- `FRONTMATTER_VALID` remains able to warn for template provenance, but semantic empty fields use `RULE_STATUS=fail` so required metadata is actually rejected.
- Strict-only validators stay outside `get_rule_scripts()` and continue to run through `run_strict_validators()`, while still appearing in help and severity lookup from the registry.
- Rank 4 was implemented as grouped registry/help/README output because there was no separate coverage-matrix generator in the scoped validator surface.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Completed verification:

- `bash -n .opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `bash -n .opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh`
- `bash -n .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh`
- `node -e "const fs=require('fs'); const r=JSON.parse(fs.readFileSync('.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json','utf8')); console.log(r.length); console.log(new Set(r.map(x=>x.rule_id)).size); console.log(r.filter(x=>!x.rule_id||!x.script_path||!x.severity||!x.category||!x.description).length);"` returned `33`, `33`, `0`.
- `validate.sh --help` rendered registry-sourced `authored_template` and `operational_runtime` groups.
- `SKIP_TEMPLATE_CHECK=1 SPECKIT_RULES=FRONTMATTER_VALID validate.sh <synthetic-empty-frontmatter-fixture> --verbose` exited `2` and reported empty `title` and `trigger_phrases`.
- `SPECKIT_RULES=ANCHORS_VALID validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/011-anchors-duplicate-ids --verbose` exited `2` and reported duplicate anchor ID `section`.
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/spec-doc-structure.vitest.ts` passed `14` tests.
- Active 026 duplicate-anchor scan returned: `No duplicate opening anchor IDs found in active 026 packet docs.`
- `.opencode/skill/system-spec-kit/scripts/spec/test-validation.sh` passed `32` tests with `0` failures.
- `.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh` passed `108` tests with `0` failures.
- `node .opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js` passed `99` tests with `0` failures.
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/spec-doc-structure.vitest.ts` passed `14` tests after the final fixture/test updates.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/007-template-validator-contract-alignment --strict --quiet` returned `RESULT: PASSED (errors=0 warnings=0)`.

Blocked verification:

- `cd .opencode/skill/system-spec-kit/mcp_server && npm test` was attempted. The `test:core` phase reported broad failures across `handler-memory-save`, `cli`, `task-enrichment`, resume/perf, modularization, graph payload, startup brief, docs, transaction recovery, search archival, and related runtime suites, then stopped producing output before `test:file-watcher`.
- A representative isolated failure, `npx vitest run tests/handler-memory-save.vitest.ts -t "routes canonical atomic saves into the target implementation summary document"`, fails because `atomicSaveMemory()` returns `success: false`; this is outside the validator registry/frontmatter/anchor implementation surface and overlaps existing dirty runtime files.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- The full mcp_server test suite is not green in the current dirty worktree; validator-owned targeted coverage is green.
- This run did not commit or push by design; the orchestrator owns final commit handling.
<!-- /ANCHOR:limitations -->
