# Review Report - v5 Remediation Closure Audit

## 1. Executive Summary

This v5 deep review did **not** validate the remediation as complete. The runtime and security posture remain intact, and several v4 items are now genuinely closed, but four prior expected-closed findings still remain open under the packet's blocker rule: cross-runtime deep-review manual parity (F003), the shared-space retirement story in `spec.md` (F005), retired continuity-artifact wording in `memory/save.md` (F006), and the remaining README/confirm-workflow wording drift grouped under NF002. Three new P2 advisories also remain open.

## 2. Scope and Method

- Packet path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/review/v5/`
- Iterations completed: 10 of 10
- Dimensions covered: correctness, security, traceability, maintainability
- Review mode: fresh v5 packet; prior review packets were used only as historical reference, not overwritten
- Audited scope included:
  - `.opencode/skill/system-spec-kit/mcp_server/**`
  - `.opencode/skill/system-spec-kit/scripts/**`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/**`
  - `.opencode/skill/system-spec-kit/feature_catalog/**`
  - `.opencode/command/**`
  - `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`
  - `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md`
  - `001-remove-shared-memory/spec.md` and `checklist.md`

## 3. Verdict

**FAIL**

Severity counts:

| Severity | Count |
|---|---:|
| P0 | 4 |
| P1 | 0 |
| P2 | 3 |

Stop reason: max-iteration ceiling reached with active blocker findings still open.

## 4. Prior Finding Closure Status

| Finding | Status | Severity | Notes |
|---|---|---|---|
| F001 | **Closed** | — | Runtime still rejects retired `specs/**/memory/*.md` paths. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083] |
| F002 | **Open** | P0 (derivative) | Not reopened as a separate active registry item, but it is still not closed because F005 remains open. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534] |
| F003 | **Open** | P0 | Cross-runtime deep-review manuals still disagree on the iteration artifact schema. [SOURCE: .claude/agents/deep-review.md:148] [SOURCE: .gemini/agents/deep-review.md:148] [SOURCE: .opencode/agent/deep-review.md:140] [SOURCE: .codex/agents/deep-review.toml:139] |
| F004 | **Closed** | — | Lifecycle docs now keep continuity on canonical spec docs; only a non-blocking wording residue remains. [SOURCE: .opencode/command/spec_kit/handover.md:256] [SOURCE: .opencode/command/spec_kit/plan.md:351] [SOURCE: .opencode/command/spec_kit/complete.md:349] |
| F005 | **Open** | P0 | `spec.md` still mixes every-startup semantics with one-time / first-launch wording. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:65] |
| F006 | **Open** | P0 | `memory/save.md` still uses retired continuity-artifact framing. [SOURCE: .opencode/command/memory/save.md:302] [SOURCE: .opencode/command/memory/save.md:547] [SOURCE: .opencode/command/memory/save.md:602] |
| F007 | **Closed** | — | The complete workflow pair now routes save/index steps through canonical spec documents and uses scratch checkpoints. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1031] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1112] |
| F008 | **Closed** | — | The core feature-catalog/discovery contract remains aligned on warn-only spec-doc indexing and retired-surface removal. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:20] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:401] |
| F009 | **Closed** | — | The stale inline test comment now describes the canonical spec-document classification behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:396] |
| F010 | **Closed** | — | The folder-readme workflows now save/index `implementation-summary.md` and retire standalone `memory/*.md` files. [SOURCE: .opencode/command/create/assets/create_folder_readme_auto.yaml:661] [SOURCE: .opencode/command/create/assets/create_folder_readme_confirm.yaml:663] |
| NF001 | **Closed** | — | `create_agent_*` workflows still route saves to `implementation-summary.md` and reject standalone `memory/*.md`. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:577] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:665] |
| NF002 | **Open** | P0 | README wording plus `plan_confirm` / `implement_confirm` prose still drift from the canonical operator contract. [SOURCE: .opencode/command/memory/README.txt:157] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:589] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:567] |
| NF003 | **Closed** | — | No regression from the test/mock cleanup surfaced in the reviewed runtime test surfaces. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:157] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:61] |

## 5. New Findings

### P2

- **F012** - master feature catalog still describes older incremental scan mechanics instead of the current lease/content-hash behavior. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:651] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:186]
- **F013** - operator-facing verification surfaces do not fully reflect the three-source scan contract, especially graph-metadata coverage. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:502]
- **F014** - `memory/save` and `handover` docs still mix hard-coded `/tmp` examples with normalized temp-path guidance. [SOURCE: .opencode/command/memory/save.md:121] [SOURCE: .opencode/command/spec_kit/handover.md:214]

## 6. Dimension Coverage Summary

| Dimension | Result | Notes |
|---|---|---|
| Correctness | PASS | Runtime behavior stayed aligned; no execution-path regression surfaced. |
| Security | PASS | Save/index trust boundaries still reject retired paths and keep deprecated-column handling fail-safe. |
| Traceability | FAIL | Four prior expected-closed findings remain open across specs, docs, workflows, and runtime manuals. |
| Maintainability | PASS with advisories | F009 is fixed, but three low-severity doc/catalog advisories remain. |

## 7. Active Finding Registry

### P0

1. **F003** - cross-runtime deep-review manual parity drift. [SOURCE: .opencode/agent/deep-review.md:140] [SOURCE: .claude/agents/deep-review.md:148]
2. **F005** - `spec.md` startup-semantics drift. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:65]
3. **F006** - `memory/save.md` continuity-artifact wording drift. [SOURCE: .opencode/command/memory/save.md:302] [SOURCE: .opencode/command/memory/save.md:547]
4. **NF002** - remaining README/confirm-workflow wording drift. [SOURCE: .opencode/command/memory/README.txt:157] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:589]

### P2

1. **F012** - catalog lease/incremental wording drift.
2. **F013** - incomplete three-source verification coverage.
3. **F014** - mixed normalized vs hard-coded temp-path examples.

## 8. Recommendations

1. Fix **F003** by bringing `.opencode/agent/deep-review.md` and `.codex/agents/deep-review.toml` onto the same reducer-readable iteration template already used in `.claude` and `.gemini`.
2. Fix **F005** by removing the one-time / first-launch phrasing from `001-remove-shared-memory/spec.md` so it matches the every-startup runtime, checklist, and changelog contract.
3. Fix **F006** and **NF002** by replacing the remaining continuity-artifact wording in `memory/save.md`, `memory/README.txt`, `spec_kit_plan_confirm.yaml`, and `spec_kit_implement_confirm.yaml` with canonical spec-document wording.
4. Clean up **F012-F014** opportunistically after blocker remediation so the catalog/playbook summaries and temp-path examples match the current operational contract everywhere.

## 9. Audit Appendix

- Total iterations: 10
- Final release-readiness state: `release-blocking`
- Stop reason: `maxIterationsReached`
- Packet artifacts written:
  - `deep-review-config.json`
  - `deep-review-state.jsonl`
  - `deep-review-findings-registry.json`
  - `deep-review-strategy.md`
  - `deep-review-dashboard.md`
  - `iterations/iteration-001.md` through `iteration-010.md`
  - `review-report.md`

Final report path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/review/v5/review-report.md`
