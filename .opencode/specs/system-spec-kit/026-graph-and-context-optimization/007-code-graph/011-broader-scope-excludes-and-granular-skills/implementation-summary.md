---
title: "Implementation Summary: Broader Default Excludes and Granular Skills"
description: "Code-graph default scope now excludes five .opencode folders while maintainers can opt in selected folders or selected sk-* skills."
trigger_phrases:
  - "broader default excludes"
  - "granular skill selection"
  - "fingerprint v2"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "026/007/011"
    last_updated_at: "2026-05-02T19:50:00Z"
    last_updated_by: "codex"
    recent_action: "Implementation complete; Gates A-D passed"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:5555555555555555555555555555555555555555555555555555555555555555"
      session_id: "026-007-011-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-broader-scope-excludes-and-granular-skills |
| **Completed** | 2026-05-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Code-graph scans now keep five internal-heavy `.opencode` folders out of the default index: skill, agent, command, specs and plugins. Maintainers can opt those folders back in per folder, and skills can be included as all skills or a selected `sk-*` list.

### Scope Policy

The resolver now parses five env vars, per-call folder booleans, `includeSkills: boolean | string[]`, csv skill env values, and deterministic v2 fingerprints. V1 fingerprints intentionally parse as null so readiness requires a full scan before graph reads trust older stored scope.

### Scan Consumers

`getDefaultConfig()` builds exclude globs from the resolved policy, while `shouldIndexForCodeGraph()` remains the final guard. Skill lists are enforced in the walker so selected skill folders can be included without opening every skill folder.

### Schemas and Status

The scan handler accepts the new args, status reports expanded active scope fields, and both public and runtime schema validators now handle selected skill arrays. The public validator also understands property-level unions and string regex checks.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/code_graph/lib/index-scope-policy.ts` | Modified | Scope constants, env parsing, v2 fingerprints. |
| `mcp_server/code_graph/lib/indexer-types.ts` | Modified | Default config consumes all policy globs. |
| `mcp_server/lib/utils/index-scope.ts` | Modified | Walker enforces five folders and selected skills. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Modified | Stored scope returns expanded fields. |
| `mcp_server/code_graph/handlers/scan.ts` | Modified | New scan args. |
| `mcp_server/code_graph/handlers/status.ts` | Modified | Expanded active scope payload. |
| `mcp_server/tool-schemas.ts` | Modified | Public scan schema. |
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | Zod scan schema. |
| `mcp_server/utils/tool-input-schema.ts` | Modified | Public property union and regex validation. |
| `mcp_server/code_graph/tests/*.vitest.ts` | Modified | Scope matrix, v2 round-trip, v1 migration. |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Schema acceptance and rejection coverage. |
| `mcp_server/code_graph/README.md` | Modified | Operator docs. |
| `mcp_server/ENV_REFERENCE.md` | Modified | Env var docs. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

R5 fix-completeness drove the implementation: first inventory same-class `.opencode` folder producers, then audit every `IndexScopePolicy` consumer, then add matrix tests for default, env and per-call behavior. The public schema validator gap was found by focused tests and fixed as part of the same consumer audit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use v2 fingerprints and reject v1 parsing | Stored v1 scope cannot represent the broader folders or selected skills. Blocking reads until full scan is safer. |
| Filter selected skills in the walker | A blanket `.opencode/skill/**` glob would prevent traversal into selected skill folders. |
| Sort selected skill names before fingerprinting | Equivalent input order must produce the same stored scope. |
| Extend public validator | Zod alone was not enough because the public schema path accepted invalid selected skill payloads. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gate A focused Vitest | PASS: 4 files, 174 tests. |
| Gate B full code-graph Vitest | PASS: 19 files, 244 tests. |
| Gate C workflow-invariance | PASS: 1 file, 2 tests. |
| Gate D strict validate 009 + 011 | PASS: both packets strict-validated with 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Per-folder tracked-file counts are not split out.** Status preserves the existing `excludedTrackedFiles` field and expands active scope, but does not add separate counters for agent, command, specs or plugins.
<!-- /ANCHOR:limitations -->
