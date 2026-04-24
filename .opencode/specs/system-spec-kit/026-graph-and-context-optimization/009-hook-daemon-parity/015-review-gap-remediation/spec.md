---
title: "Feature Specification: Review Gap Remediation for 009 Hook/Daemon Parity"
description: "Level-2 remediation packet addressing the merged 013/014 review-gap registry: 39 findings total, led by one P0 workspace-isolation defect and 26 P1 follow-on fixes spanning code, packet evidence ledgers, schemas, READMEs, feature pages, and manual playbooks."
trigger_phrases:
  - "review gap remediation"
  - "hook daemon parity review gaps"
  - "026/009/015"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/015-review-gap-remediation"
    last_updated_at: "2026-04-24T10:41:09Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Scaffolded Level-2 remediation packet from the merged 013/014 review-gap synthesis and findings registry"
    next_safe_action: "Create plan.md, tasks.md, and checklist.md, then execute the P0 workspace-isolation fix before sequencing the remaining P1 code and documentation remediations"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Use phase subfolder 015-review-gap-remediation and scaffold only spec.md, description.json, and graph-metadata.json."
    status: "planning"
---
# Feature Specification: Review Gap Remediation for 009 Hook/Daemon Parity

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planning |
| **Created** | 2026-04-24 |
| **Parent** | `026-graph-and-context-optimization/009-hook-daemon-parity/` |
| **Parent Spec** | `../spec.md` |
| **Source Synthesis** | `../../research/013-014-review-gap-merged-synthesis.md` |
| **Source Findings** | `../../research/013-014-review-gap-merged-findings.json` |
| **Predecessors** | `../013-code-graph-hook-improvements/`, `../014-skill-advisor-hook-improvements/` |

---

## 2. PROBLEM

The merged review-gap synthesis for packets `013-code-graph-hook-improvements` and `014-skill-advisor-hook-improvements` identifies **39 unique findings** with no exact cross-audit duplicates collapsed: **1 P0**, **26 P1**, and **12 P2**. The registry spans four buckets: `013-impl-defects` (10), `013-missed-files` (13), `014-impl-defects` (8), and `014-missed-files` (8). Across those buckets, the recurring failure modes are live correctness bugs, stale public contracts, packet evidence drift, incomplete cross-runtime parity, and verification coverage that lagged the implementation.

The single P0 driver is `RG-001`: `advisor_recommend` accepts an explicit `workspaceRoot`, but the cache key ignores that root and can therefore reuse recommendations across repositories when freshness state matches. This is a correctness and repository-isolation failure on a public MCP surface, so it must be cleared before the rest of the remediation work proceeds.

This packet turns the merged registry into one execution-owned remediation scope for the P0 plus all 26 P1 findings. The source synthesis recommends a Level-3 follow-up because the work spans two subsystems and many downstream docs, but this sub-packet is intentionally scaffolded as **Level 2** per user direction so the highest-risk execution path is documented immediately and can sequence P0 before the remaining P1 fixes.

---

## 3. SCOPE

### In Scope

- Remediate the P0 cache-isolation defect in the skill-advisor recommendation path (`RG-001`).
- Fix the 013 code-graph P1 correctness defects (`RG-002` through `RG-005`) and restore packet-013 evidence integrity (`RG-006`).
- Update the 013 downstream schemas, READMEs, feature pages, and manual playbooks that still describe the pre-013 contract (`RG-007` through `RG-015`).
- Reconcile packet-014 lineage/evidence defects (`RG-016`, `RG-017`, `RG-019`) and finish the 014 shared-renderer and telemetry correctness fixes (`RG-018`, `RG-020`, `RG-021`).
- Update the 014 downstream feature pages, playbooks, schemas, README surfaces, and plugin-bridge references that still describe the pre-014 contract (`RG-022` through `RG-027`).
- Keep code-path fixes, verification surfaces, and operator-facing documentation in lockstep so packet 015 does not reintroduce evidence drift.

### Out of Scope

- P2 follow-up cleanup (`RG-028` through `RG-039`).
- New feature work beyond remediating the merged 013/014 review-gap registry.
- New research beyond the already-produced merged synthesis and findings registry.
- Closeout artifacts for packet 015 beyond this initial Level-2 scaffold.

### Files to Change

| File Path | Change Type | Driver(s) |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts` | Modify | RG-001, RG-024, RG-025 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts` | Modify | RG-001 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts` | Modify | RG-001 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` | Modify | RG-002 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` | Modify | RG-002 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts` | Modify | RG-003 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts` | Modify | RG-003, RG-004 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts` | Modify | RG-004 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Modify | RG-005 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` | Modify | RG-005 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts` | Modify | RG-005 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/implementation-summary.md` | Modify | RG-006 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/checklist.md` | Modify | RG-006 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/resource-map.md` | Modify | RG-006 |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Modify | RG-007 |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` | Modify | RG-008 |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modify | RG-009 |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | RG-010 |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md` | Modify | RG-011 |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md` | Modify | RG-012 |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md` | Modify | RG-013 |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` | Modify | RG-014 |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | Modify | RG-015 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md` | Modify | RG-016 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/implementation-summary.md` | Modify | RG-016, RG-017, RG-019 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/checklist.md` | Modify | RG-016, RG-017, RG-019 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/resource-map.md` | Modify | RG-016, RG-017, RG-019 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts` | Modify | RG-018 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts` | Modify | RG-018 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-brief-producer.vitest.ts` | Modify | RG-018 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts` | Modify | RG-020 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts` | Modify | RG-020, RG-021, RG-026, RG-027 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts` | Modify | RG-020 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts` | Modify | RG-021, RG-025, RG-027 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md` | Modify | RG-021, RG-024, RG-026 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md` | Modify | RG-022 |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | RG-022 |
| `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs` | Modify | RG-022, RG-023 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md` | Modify | RG-023 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` | Modify | RG-023 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md` | Modify | RG-024 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md` | Modify | RG-025 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md` | Modify | RG-026 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md` | Modify | RG-027 |

---

## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-P0-001 | Resolve `RG-001` (`014-impl-defects`): the public `advisor_recommend` cache key ignores explicit `workspaceRoot`, so one process can reuse recommendations across repositories when freshness state matches. | Recommendation cache isolation is workspace-scoped, and regression coverage proves recommendations cannot bleed across repositories. |

### P1 — Required

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-P1-001 | Resolve `RG-002` (`013-impl-defects`): ambiguous `CALLS`/import subject resolution still ranks only the first 10 SQL matches, so the selector can miss the correct implementation symbol in larger ambiguity sets. | Large ambiguity sets are fully re-ranked, and a `>10`-candidate regression proves the correct implementation can still win. |
| REQ-P1-002 | Resolve `RG-003` (`013-impl-defects`): CocoIndex seed fidelity is preserved only when callers send `seed.file`; `seed.filePath` falls through and drops provider-specific metadata. | Both `seed.file` and `seed.filePath` preserve CocoIndex seed fidelity, with regression coverage for both input shapes. |
| REQ-P1-003 | Resolve `RG-004` (`013-impl-defects`): the new `partialOutput` contract undercounts omitted anchors when the deadline expires before multiple remaining anchors are processed. | `partialOutput.omittedAnchors` counts every unprocessed anchor after deadline expiry, including multi-anchor timeout cases. |
| REQ-P1-004 | Resolve `RG-005` (`013-impl-defects`): no-op incremental scans can report `filesSkipped: 0` and clear the persisted edge-enrichment summary even though fresh files were skipped before parsing and no new graph state was written. | No-op incremental scans retain skipped-file accounting and preserve persisted edge-enrichment summaries when no replacement state is written. |
| REQ-P1-005 | Resolve `RG-006` (`013-impl-defects`): packet-local `applied/T-*.md` evidence is cited throughout packet 013 closeout docs, but those files are not present on disk. | Packet 013 closeout artifacts cite only evidence that exists on disk, and the verification trail is auditable from the checkout. |
| REQ-P1-006 | Resolve `RG-007` (`013-missed-files`): the central MCP README still documents `code_graph_status` and `code_graph_context` at the pre-013 contract level. | The central MCP README documents `graphQualitySummary`, blocked-read payloads, and structured `partialOutput` at the live 013 contract level. |
| REQ-P1-007 | Resolve `RG-008` (`013-missed-files`): the code-graph subsystem README still presents the older status/readiness surface and omits post-013 status, blocked-read, and startup-quality details. | The code-graph subsystem README reflects the post-013 status, blocked-read, and startup-quality surfaces. |
| REQ-P1-008 | Resolve `RG-009` (`013-missed-files`): the install guide still explains only freshness/full-scan behavior, so operators do not get the newer 013-era status/context vocabulary in the troubleshooting path. | The install guide teaches the 013-era status/context vocabulary in troubleshooting and operator guidance. |
| REQ-P1-009 | Resolve `RG-010` (`013-missed-files`): public tool-schema descriptions still describe the old `code_graph_status` and `code_graph_context` outputs. | Tool-schema descriptions match the live `code_graph_status` and `code_graph_context` outputs used by generated docs and downstream consumers. |
| REQ-P1-010 | Resolve `RG-011` (`013-missed-files`): the storage/query feature page still points at the old indexer test path and stale counts-only framing. | The storage/query feature page references the correct tests and describes the current status surface, not the stale counts-only framing. |
| REQ-P1-011 | Resolve `RG-012` (`013-missed-files`): the CocoIndex bridge feature page still omits the richer post-013 context contract. | The CocoIndex bridge feature page documents seed fidelity plus blocked/partial-output behavior from the live contract. |
| REQ-P1-012 | Resolve `RG-013` (`013-missed-files`): the startup manual-testing playbook still validates only the old startup contract. | The startup playbook validates startup payload and graph-quality assertions alongside the live hook startup contract. |
| REQ-P1-013 | Resolve `RG-014` (`013-missed-files`): the storage/query playbook still uses the old suite path and validates counts-only status behavior. | The storage/query playbook points to the real suites and checks `graphQualitySummary` expectations. |
| REQ-P1-014 | Resolve `RG-015` (`013-missed-files`): the semantic-vs-structural routing playbook never mentions blocked-read or `partialOutput` behavior. | The routing playbook validates blocked-read and `partialOutput` behavior for semantic-vs-structural routing scenarios. |
| REQ-P1-015 | Resolve `RG-016` (`014-impl-defects`): packet 014's governing spec still defines the work as research-only, while the same folder claims completed implementation and verification. | Packet 014 governing docs no longer claim mutually exclusive research-only and implementation-complete states. |
| REQ-P1-016 | Resolve `RG-017` (`014-impl-defects`): packet 014 marks tasks complete and cites `applied/T-###.md` evidence, but no `applied/` directory exists. | Packet 014 verification artifacts either restore the missing evidence ledger or remove claims that depend on non-existent `applied/` files. |
| REQ-P1-017 | Resolve `RG-018` (`014-impl-defects`): packet 014 did not fully converge on a shared renderer, leaving builder and hook-visible brief formats divergent. | Shared payload storage and hook-visible rendering converge on one rendered advisor brief contract with regression coverage. |
| REQ-P1-018 | Resolve `RG-019` (`014-impl-defects`): packet 014's Codex verification narrative proves fail-open `{}` behavior, not the successful shared-brief path it claims to normalize. | Packet 014 closeout evidence proves the successful shared-brief path, or its claims are narrowed to what the artifacts actually verify. |
| REQ-P1-019 | Resolve `RG-020` (`014-impl-defects`): malformed JSONL outcome telemetry can make `advisor_validate` throw and take down the validation surface. | Malformed telemetry lines are ignored safely, and `advisor_validate` remains available with corrupt-data regression coverage. |
| REQ-P1-020 | Resolve `RG-021` (`014-impl-defects`): `skillSlug` validation scopes corpus rows only, while telemetry totals remain workspace-global and therefore misleading. | Subset validation totals are either scoped to `skillSlug` or explicitly labeled as workspace-global everywhere they are surfaced. |
| REQ-P1-021 | Resolve `RG-022` (`014-missed-files`): the OpenCode plugin-bridge feature page still points at the old helper location and pre-014 threshold wording. | The plugin-bridge feature page and related bridge surfaces reflect the helper relocation and the landed 014 threshold wording. |
| REQ-P1-022 | Resolve `RG-023` (`014-missed-files`): the OpenCode bridge manual playbook still tells operators to invoke the old bridge path with `thresholdConfidence:0.7`. | The bridge manual playbook uses the live helper path and validates the 014 threshold pair operators actually run. |
| REQ-P1-023 | Resolve `RG-024` (`014-missed-files`): the `advisor_recommend` feature page still omits `workspaceRoot` and `effectiveThresholds` from the public contract. | The `advisor_recommend` feature page documents `workspaceRoot` and `effectiveThresholds` as part of the public contract. |
| REQ-P1-024 | Resolve `RG-025` (`014-missed-files`): the native `advisor_recommend` manual scenario still validates only the recommendation payload. | The native `advisor_recommend` scenario asserts the new public output fields, not only the recommendation payload. |
| REQ-P1-025 | Resolve `RG-026` (`014-missed-files`): the `advisor_validate` feature page still omits threshold semantics, telemetry diagnostics, and outcome totals. | The `advisor_validate` feature page documents threshold semantics, telemetry diagnostics, and outcome totals from the live contract. |
| REQ-P1-026 | Resolve `RG-027` (`014-missed-files`): the native `advisor_validate` playbook still checks only slice presence and baseline metrics. | The native `advisor_validate` playbook checks threshold semantics, telemetry diagnostics, and outcome totals alongside slice presence. |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `RG-001` is resolved first, and multi-workspace regression coverage proves `advisor_recommend` cannot bleed recommendations across repositories.
- **SC-002**: All 26 P1 findings are translated into executed remediation work or explicit evidence-backed deferrals in downstream packet planning artifacts.
- **SC-003**: The 44 unique P0/P1 target files listed in scope are the only execution surfaces used to clear the merged remediation backlog.
- **SC-004**: Packets 013 and 014 no longer over-claim evidence, and their downstream docs/playbooks/schemas match the live contracts they describe.
- **SC-005**: Packet 015 maintains code-path fixes, verification coverage, and operator-facing documentation in sync throughout remediation sequencing.
