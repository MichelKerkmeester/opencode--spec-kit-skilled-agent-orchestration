# System-Spec-Kit 026 Release Alignment Reference Map

This phase document is the release-alignment follow-up map for work completed under `026-graph-and-context-optimization`.

It replaces the earlier raw recursive filesystem dump with a curated, authored-document map driven by actual 026 packet evidence. The goal here is not to inventory every file under `.opencode/skill/system-spec-kit/`; it is to identify which maintained documents are the most plausible post-026 update surfaces.

## Scope and Method

- Analysis window: 2026-04-01 through 2026-04-10.
- Evidence base:
  - Git commit history touching `.opencode/specs/system-spec-kit/026-graph-and-context-optimization`.
  - Git commit history touching `.opencode/skill/system-spec-kit`.
  - Current maintained markdown paths under `.opencode/skill/system-spec-kit`.
- Included:
  - Root skill docs.
  - Reference docs.
  - Template and asset docs.
  - MCP server docs.
  - Feature catalog and manual testing playbook docs directly tied to 026 behavior.
  - Script README surfaces that explain runtime or authoring behavior changed by 026 work.
- Excluded:
  - `node_modules/`, `.tmp/`, `dist/`, caches, symlink targets, vendored files, generated runtime state, and fixture markdown unless the fixture itself is part of the public documentation contract.

## 026 Work Summary

| Workstream | Evidence | Why it matters for docs |
| --- | --- | --- |
| Research-track closeout and packet normalization | `6aeb89f` `docs(026-research)` | Research findings were promoted into packet docs and should be reflected in root guidance and reference surfaces. |
| Runtime shipping across packets `005-014` | `33823d0` `feat(026-graph-context)` and `2837e15` `feat(026-014)` | Graph routing, FTS fallback, session-start behavior, and code graph flows affect runtime-facing docs and operational references. |
| Memory save contract and post-save rendering changes | `7f0c057` `feat(026-memory-redundancy)`, `eb1f49c` `feat(026-003-009)`, `03d26e2` `feat(026-003-010)` | Save workflow, heuristics, lineage, trigger sanitization, and context template guidance all shifted. |
| Deep-review remediation across runtime packets | `8fa97d8` `fix(026)` and `c01db61` `fix(026)` | Review fixes landed on search routing, FTS handling, session-start behavior, and agent guidance; related docs may now be stale. |
| Final review and verification closeout | `abaa61d` `review(026)` and `81329f8` `review(026)` | The packet reached release-verification state; follow-up documentation should align to verified current reality, not pre-review assumptions. |

## Priority Legend

- `HIGH`: Direct contract or operator-facing documentation that is likely stale if 026 behavior changed.
- `MEDIUM`: Supporting or explanatory documentation that should be reviewed if nearby `HIGH` surfaces change.
- `LOW`: Intentionally excluded from this map unless a later release task names them explicitly.

## Priority Review Map

### 1. Root Skill Contract Docs

| Priority | Path | Status | Why review now |
| --- | --- | --- | --- |
| HIGH | `.opencode/skill/system-spec-kit/SKILL.md` | Touched during 026 | Core routing, resource-domain wording, and session/context guidance must match the post-026 graph-first and memory-save behavior. |
| HIGH | `.opencode/skill/system-spec-kit/README.md` | Touched during 026 | Primary operator-facing overview; should reflect final 026 runtime/documentation reality, not intermediary packet state. |
| HIGH | `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Adjacent to 026 runtime/code-graph work | Architecture boundaries should stay aligned with code-graph storage/query changes and session-start routing decisions delivered in 026. |
| MEDIUM | `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md` | Adjacent to 026 memory-quality work | Shared-memory wording may need a quick parity pass where save/indexing terminology changed in 026. |
| MEDIUM | `.opencode/skill/system-spec-kit/constitutional/README.md` | Adjacent to 026 routing and guardrail work | Constitutional index should point clearly at the current guardrail surfaces after agent-execution and routing updates. |
| HIGH | `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md` | Touched during 2026 packet window | Graph-first routing, CocoIndex fallback, and code-graph nudges are central 026 outcomes and should remain explicit here. |
| MEDIUM | `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | Adjacent to 026 guardrail work | Execution-gate wording may need parity with refined session-start and release-verification expectations. |

### 2. Reference Docs

| Priority | Path | Status | Why review now |
| --- | --- | --- | --- |
| HIGH | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Adjacent to 026 | Compact command guidance should reflect `/spec_kit:resume`, graph-first routing, and current validation/recovery flows. |
| HIGH | `.opencode/skill/system-spec-kit/references/workflows/execution_methods.md` | Touched during 026 | Execution pathways should stay aligned with compact retrieval wrapper behavior and current save/runtime workflows. |
| HIGH | `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Adjacent to 026 memory-save work | 026 materially changed save heuristics, lineage handling, post-save review behavior, and context-template expectations. |
| HIGH | `.opencode/skill/system-spec-kit/references/memory/memory_system.md` | Touched during 026 | Tool behavior documentation should reflect verified search/routing/runtime outcomes from the packet. |
| HIGH | `.opencode/skill/system-spec-kit/references/memory/trigger_config.md` | Adjacent to 026 memory-quality work | Trigger sanitization and filter behavior changed in the packet remediation lane. |
| MEDIUM | `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Adjacent to 026 session-start work | Hook-capable runtimes and fallback wording should match the latest session-start and context injection behavior. |
| HIGH | `.opencode/skill/system-spec-kit/references/config/environment_variables.md` | Adjacent to 026 runtime work | FTS, graph, routing, and session-start toggles need parity with the shipped runtime surfaces. |
| MEDIUM | `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Touched during 026 | Template guidance should stay aligned with compact memory content and release-aligned packet authoring. |
| MEDIUM | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Touched during 026 | Level requirements should remain consistent with release-alignment packet usage and implementation-summary expectations. |
| MEDIUM | `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` | Adjacent to 026 | The packet heavily used multi-phase release and review workflows; this should remain consistent with reality. |
| MEDIUM | `.opencode/skill/system-spec-kit/references/validation/validation_rules.md` | Adjacent to 026 packet closeout work | Validation wording should reflect strict packet-closeout and review-remediation expectations verified in 026. |
| MEDIUM | `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md` | Adjacent to 026 | Phase closeout expectations should match the release-alignment and review-verification process actually used. |

### 3. Template and Asset Docs

| Priority | Path | Status | Why review now |
| --- | --- | --- | --- |
| HIGH | `.opencode/skill/system-spec-kit/templates/` | Touched during 026 | The core context template contract and metadata rendering changed in the 003/009/010 lanes. |
| MEDIUM | `.opencode/skill/system-spec-kit/templates/README.md` | Adjacent to 026 | Template architecture overview should stay aligned if the core context template or release packet composition expectations changed. |
| MEDIUM | `.opencode/skill/system-spec-kit/templates/changelog/README.md` | Adjacent to 026 release closeout | Packet closeout and nested changelog workflows were exercised repeatedly during 026. |
| MEDIUM | `.opencode/skill/system-spec-kit/templates/changelog/phase.md` | Adjacent to 026 release closeout | Phase changelog language may need parity with current packet closeout wording. |
| MEDIUM | `.opencode/skill/system-spec-kit/templates/changelog/root.md` | Adjacent to 026 release closeout | Root changelog expectations may need parity with consolidated review/report patterns used in 026. |
| MEDIUM | `.opencode/skill/system-spec-kit/assets/template_mapping.md` | Adjacent to 026 | Asset-level routing should stay aligned with the template set that 026 used in practice. |
| MEDIUM | `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md` | Touched during current packet window | Decision guidance may need a final wording pass now that the packet completed release verification. |
| LOW | `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md` | Adjacent only | Review only if broader release wording touches multi-agent execution guidance. |

### 4. MCP Server Docs

| Priority | Path | Status | Why review now |
| --- | --- | --- | --- |
| HIGH | `.opencode/skill/system-spec-kit/mcp_server/README.md` | Adjacent to 026 runtime and code-graph work | Server overview should match graph-first routing, FTS fallback behavior, and current recovery surfaces. |
| HIGH | `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Adjacent to 026 runtime and startup work | Installation and setup guidance should not drift from current startup and routing behavior. |
| HIGH | `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Touched during 026 | Environment variable reference should remain aligned with the runtime flags actually exercised in the packet. |
| MEDIUM | `.opencode/skill/system-spec-kit/mcp_server/database/README.md` | Adjacent to 026 code-graph work | Database doc may need parity where code-graph storage/query behavior was upgraded. |
| MEDIUM | `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | Touched during 026 | Contract documentation should stay aligned with search/routing result shapes and guardrails. |
| HIGH | `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` | Touched during 026 | Search subsystem docs were directly implicated by graph-first routing and FTS remediation. |
| HIGH | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md` | Adjacent to 026 code-graph upgrades | Graph docs should reflect the delivered scan/query/readiness behavior and recovery posture. |

### 5. Script README Surfaces

| Priority | Path | Status | Why review now |
| --- | --- | --- | --- |
| MEDIUM | `.opencode/skill/system-spec-kit/scripts/spec-folder/README.md` | Adjacent to 026 | Spec-folder utilities are adjacent to description discovery and release-alignment packet handling. |
| HIGH | `.opencode/skill/system-spec-kit/scripts/memory/README.md` | Adjacent to 026 memory-quality work | Memory CLI behavior changed materially in compact save, lineage, and post-save review lanes. |
| MEDIUM | `.opencode/skill/system-spec-kit/scripts/spec/README.md` | Adjacent to 026 packet-closeout work | Validation and completion tooling docs should stay aligned with the packet workflow used to close 026. |
| MEDIUM | `.opencode/skill/system-spec-kit/scripts/templates/README.md` | Adjacent to 026 | Template composition docs may need parity if context and changelog templates changed. |

### 6. Feature Catalog Docs

These are the highest-signal feature-catalog entries tied to 026 outcomes. They are the most likely catalog surfaces to review if a release note or current-reality sweep is requested.

| Priority | Path | Status | Why review now |
| --- | --- | --- | --- |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md` | Touched during current packet window | Recovery guidance should reflect the current resume/bootstrap posture after 026. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md` | Adjacent to 026 memory-save work | Description discovery was directly adjacent to the memory save heuristic-calibration lane. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md` | Adjacent to 026 memory-save work | Session enrichment and alignment language may need parity with the verified post-save behavior. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md` | Adjacent to 026 memory-save work | Post-save review is a direct contract surface for the 003/009/010 packet work. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/24-save-quality-gate-exceptions.md` | Adjacent to 026 memory-save work | Save gate exceptions need to remain consistent with the calibrated heuristics now shipped. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/12-graph-expanded-fallback.md` | Touched during current packet window | Graph-expanded fallback is central to the graph/context optimization packet. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/13-always-on-graph-context-injection.md` | Touched during current packet window | Context injection behavior is directly adjacent to the graph-first runtime lane. |
| MEDIUM | `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/28-spec-folder-detection-and-description.md` | Touched during current packet window | Detection and description behavior intersects memory-save contract refinements. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md` | Touched during current packet window | Category overview should match the final 026 code-graph and context-preservation story. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` | Touched during current packet window | Cross-runtime fallback wording must align with current session-start and graph fallback behavior. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/06-runtime-detection.md` | Touched during current packet window | Runtime detection is adjacent to hook-capable behavior and context-prime deprecation. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/07-structural-code-indexer.md` | Touched during current packet window | Structural code indexing was a core 026 delivery surface. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md` | Touched during current packet window | Code-graph storage/query behavior changed directly in the packet. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md` | Touched during current packet window | Routing between semantic code search and structural context is central to the packet scope. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md` | Touched during current packet window | Auto-priming wording should match the current session bootstrap/resume posture. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/17-session-health-tool.md` | Touched during current packet window | Session health reporting is part of the current recovery/readiness story. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md` | Touched during current packet window | Resume behavior should reflect current `/spec_kit:resume` reality. |
| HIGH | `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md` | Touched during current packet window | Tool-routing enforcement is a direct downstream surface of graph-first routing. |

### 7. Manual Testing Playbook Docs

These playbook entries are worth reviewing if the release-alignment pass extends from descriptive docs into operator validation guidance.

| Priority | Path | Status | Why review now |
| --- | --- | --- | --- |
| MEDIUM | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` | Touched during current packet window | Fallback procedures should match current runtime behavior. |
| MEDIUM | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md` | Touched during current packet window | Detection steps should match the current runtime-selection model. |
| HIGH | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` | Touched during current packet window | Operator test steps should match the shipped code-graph scan/query workflow. |
| HIGH | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | Touched during current packet window | Routing verification steps should align with graph-first guidance. |
| MEDIUM | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md` | Touched during current packet window | Priming verification steps should reflect the final resume/bootstrap posture. |
| MEDIUM | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/262-session-health.md` | Touched during current packet window | Health checks should align with current readiness hints. |
| HIGH | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md` | Touched during current packet window | Resume verification should reflect the canonical recovery surface. |
| HIGH | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md` | Touched during current packet window | Routing-enforcement test steps should align with graph/CocoIndex/manual-read fallbacks. |

## Release-Alignment Notes

- The strongest direct 026 documentation evidence lives in:
  - root skill docs,
  - memory-save references,
  - MCP search/runtime docs,
  - code-graph and resume feature catalog entries,
  - the core context template contract under `.opencode/skill/system-spec-kit/templates/`.
- The best review order for an actual doc-update pass is:
  1. `.opencode/skill/system-spec-kit/SKILL.md` and `.opencode/skill/system-spec-kit/README.md`
  2. memory/reference docs
  3. MCP server runtime docs
  4. templates/assets
  5. feature catalog and playbook parity surfaces
- If a follow-up task asks for actual wording changes rather than reference mapping, the `HIGH` rows above are the intended first-pass scope.

## Superseded Approach

The prior version of this file recursively listed tens of thousands of paths, including generated caches, vendored packages, runtime artifacts, and other non-authored files. That format was not useful for release alignment because it obscured the maintained documents that can actually drift after packet 026.

This curated version is now the canonical reference map for `016-release-alignment/001-sk-system-speckit`.
