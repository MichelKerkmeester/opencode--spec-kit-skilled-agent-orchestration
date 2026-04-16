# Review Report - V3 Deep Review

## Executive summary
The fresh 10-iteration v3 deep review **did not reopen any P0 runtime path**. The live save, scan, create-agent, and representative workflow entry points still reject or avoid retired `specs/**/memory/*.md` targets, but the review converged on **four open P1 documentation and traceability defects**: `F005`, `F006`, `F007`, and `F008`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-008.md:17] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-009.md:24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-010.md:40]

**Verdict: CONDITIONAL** — no P0 findings remain, but four P1 contract and documentation defects are still open. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/deep-review-findings-registry.json:96] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-010.md:40]

## Severity counts

| Severity | Count |
| --- | ---: |
| P0 | 0 |
| P1 | 4 |
| P2 | 0 |

[SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/deep-review-findings-registry.json:96]

## Prior-finding closure status

| Finding | Status | Basis |
| --- | --- | --- |
| F001 | **Closed** | `memory_save` rejects noncanonical files and `memory_index_scan` skips `memory/` directories. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-001.md:6] |
| F002 | **Open via F005** | Shared-column retirement story still mismatches runtime retry semantics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-003.md:6] |
| F003 | **Closed** | Active cross-runtime manuals now point continuity recovery at canonical spec-doc surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-004.md:33] |
| F004 | **Closed** | Both lifecycle playbooks now reference canonical spec docs rather than retired memory artifacts. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-003.md:8] |
| NF001 | **Closed** | Create-agent auto/confirm still route `memory_save` to `implementation-summary.md`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-004.md:35] |
| NF002 | **Open via F006/F007** | Command and workflow wording drift still models retired continuity/support-artifact surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-004.md:52] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-005.md:18] |
| NF003 | **Closed** | Test harness now mocks `discoverMemoryFiles`; no removed `findMemoryFiles` surface remains. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-001.md:6] |

## New findings by severity

### P1
- **F005 - shared_space_id contract drift**: packet docs, checklist evidence, and changelog still overstate the deprecated-column cleanup compared with the retry-on-bootstrap runtime helper. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory/checklist.md:53] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:94] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534]
- **F006 - memory command docs still describe retired continuity surfaces**: operator docs still frame legacy `memory/` artifacts as active continuity material. [SOURCE: .opencode/command/memory/save.md:145] [SOURCE: .opencode/command/memory/manage.md:50] [SOURCE: .opencode/command/memory/README.txt:112]
- **F007 - workflow YAML family still documents non-canonical support-artifact indexing**: deep-review, deep-research, completion, and adjacent flows still use generic support-artifact or retired checkpoint wording instead of canonical spec-doc routing. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1031] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-009.md:31]
- **F008 - feature catalog still claims retired memory-file discovery**: the `memory_index_scan` feature doc and generated catalog remain out of sync with runtime discovery. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:649] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:27]

## Dimension coverage summary
- **Correctness: PASS** — no live retired-path acceptance or emission remained on reviewed entry points. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/deep-review-strategy.md:29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/iterations/iteration-009.md:24]
- **Security: PASS** — governed ingest, retention checks, and save-path gating remained fail-closed. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/deep-review-strategy.md:30]
- **Traceability: FAIL** — `F005` and `F008` remain open. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/deep-review-strategy.md:31]
- **Maintainability: FAIL** — `F006` and `F007` remain open. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v3/deep-review-strategy.md:32]

## Recommendations
1. Rewrite the `shared_space_id` cleanup narrative in `001-remove-shared-memory/spec.md`, `checklist.md`, and `v3.4.0.0.md` so it matches the retry-on-bootstrap helper exactly.
2. Remove active operator guidance that still treats `memory/` artifacts as a supported continuity surface from `memory/save.md`, `memory/manage.md`, and `memory/README.txt`.
3. Replace generic support-artifact and retired checkpoint wording in the spec-kit workflow YAML family with canonical spec-document targets.
4. Fix the `memory_index_scan` feature-catalog source doc and regenerate `feature_catalog.md` so current-reality text matches runtime discovery.
