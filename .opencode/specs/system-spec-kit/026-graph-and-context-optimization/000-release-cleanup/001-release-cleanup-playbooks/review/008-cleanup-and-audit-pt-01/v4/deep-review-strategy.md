---
title: Deep Review Strategy
description: Mutable review strategy for the v4 remediation closure audit packet.
---

# Deep Review Strategy - v4 Remediation Closure Audit

## 2. TOPIC
Fresh v4 audit that re-verifies closure of F001-F008 and NF001-NF003 without reading prior review packet state.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness - runtime retired-surface rejection and comment-only remediation behavior
- [ ] D2 Security - no new trust-boundary or stale-surface exposure introduced by remediation
- [ ] D3 Traceability - spec, checklist, changelog, agents, commands, workflows, feature catalog, and runtime agree
- [ ] D4 Maintainability - no dead mocks, stale comments, orphan tests, broken cross-links, or replace-all collateral drift
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Do not change audited implementation or documentation files.
- Do not reuse `review/`, `review/v2/`, or `review/v3/` packet state as evidence.

## 5. STOP CONDITIONS
- Stop after 10 iterations or an unrecoverable blocker.
- Any still-open prior finding counts as an active blocker for final synthesis.
- Any newly confirmed P0 blocks PASS.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Runtime still rejects retired `specs/**/memory/*.md` paths and the helper comment did not change execution semantics. |
| D3 Traceability | FAIL | 2 | F005 remains open because the changelog still says SQLite 3.35+ installs shed the column on first launch. |
| D2 Security | PASS | 7 | Path validation, canonical-source filtering, and save-pipeline tests still reject traversal and non-canonical sources. |
| D4 Maintainability | PASS | 8 | No dead findMemoryFiles mocks resurfaced; only one stale test comment remains as a P2 advisory. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 4 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Fresh packet initialization from skill templates avoids dependence on prior review lineage.
- Cross-checking handler, parser, and regression tests provided a clean correctness closure baseline. (iteration 1)
- Re-reading all four F005 surfaces made the remaining drift obvious without relying on prior packet summaries. (iteration 2)
- A narrow command-doc sweep isolated F006 to `memory/save.md` while confirming `manage.md` and `README.txt` moved onto canonical-surface wording. (iteration 3)
- A family-wide YAML search quickly isolated the remaining F007 drift to the `spec_kit_complete_*` pair instead of the deep-review/deep-research workflows. (iteration 4)
- The feature catalog pair now matches the live discovery code, so F008 appears genuinely closed. (iteration 5)
- Agent-manual parity held across all four runtimes, which made the remaining lifecycle-playbook drift easier to isolate. (iteration 6)
- The security sweep confirmed the behavioral guardrails stayed intact even though several docs and workflows drifted. (iteration 7)
- A targeted maintainability pass confirmed NF003 stayed closed and isolated the only residual code-level drift to a stale comment. (iteration 8)
- The manual testing playbook root now cleanly describes canonical spec-doc continuity, so no new drift surfaced there. (iteration 9)
- NF001 stayed closed because both `create_agent_*` YAMLs save to `implementation-summary.md` and explicitly reject standalone `memory/*.md` files. (iteration 10)

## 9. WHAT FAILED
- The v4 remediation did not fully propagate the every-startup story into both changelog surfaces. (iteration 2)
- The memory command-doc cleanup stopped short of removing all continuity-support-artifact wording from `memory/save.md`. (iteration 3)
- The workflow cleanup left stale forbidden memory-path checks and support-artifact placeholders in the complete-mode save blocks. (iteration 4)
- Lifecycle playbooks outside the targeted YAML family still tell operators to verify support artifacts under `memory/`. (iteration 6)
- A stale inline test comment still describes the retired memory/ pattern even though the assertion behavior is correct. (iteration 8)
- The broader `create` command family still routes folder-readme save artifacts and setup prompts through retired `memory/*.md` surfaces. (iteration 10)

## 10. EXHAUSTED APPROACHES (do not retry)
None yet.

## 11. RULED OUT DIRECTIONS
- A runtime regression from the new helper comment was ruled out because the executable body still only returns early or swallows unsupported `DROP COLUMN` failures. (iteration 1, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1538`)
- A spec/checklist mismatch was ruled out for F005; the remaining drift is isolated to the changelog wording. (iteration 2, evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47`)
- F008 was ruled out as an active issue because both catalog surfaces now describe the same three-source discovery pipeline as the runtime. (iteration 5, evidence: `.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22`)
- F003 was ruled out as an active issue because the four runtime deep-review manuals still agree on the single-iteration contract and `review/`-only write boundary. (iteration 6, evidence: `.opencode/agent/deep-review.md:29`)
- A security regression in path validation or canonical-source filtering was ruled out because validators and enforcement tests still reject traversal and non-canonical inputs. (iteration 7, evidence: `.opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:122`)
- NF003 was ruled out as an active issue because the context-server test mocks in scope only cover session snapshot bootstrap paths, not a retired `findMemoryFiles` seam. (iteration 8, evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1088`)
- Manual testing playbook drift was ruled out because the root playbook now treats spec-doc anchored continuity as the live path and points new coverage at the canonical save substrate. (iteration 9, evidence: `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:65`)
- NF001 was ruled out as an active issue because both `create_agent_*` YAMLs route the save target to `implementation-summary.md` and explicitly state that standalone `memory/*.md` files are retired. (iteration 10, evidence: `.opencode/command/create/assets/create_agent_auto.yaml:568`)

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis complete - final report written to `review-report.md`.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- F005/F006/F007/F008 were open P1 findings in v3 and are the primary remediation targets.
- F001/F003/F004/NF001/NF003 were previously reported closed and must stay closed.
- F002 should remain closed if F005's shared_space_id startup semantics are aligned.
- NF002 should remain closed if F006/F007 remove retired continuity-surface framing from commands and workflows.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Runtime correctness guard verified; spec and changelog wording still pending traceability pass. |
| `spec_code` | core | fail | 2 | F005 remains open: changelog still diverges from spec/checklist/runtime on every-startup semantics. |
| `checklist_evidence` | core | partial | 2 | Checklist aligns with runtime, but release docs still overstate a first-launch effect. |
| `checklist_evidence` | core | fail | 3 | `memory/save.md` still documents generated continuity support artifacts despite the canonical-spec-doc command contract. |
| `playbook_capability` | overlay | fail | 4 | `spec_kit_complete_*` save blocks still check retired memory paths and use support-artifact placeholders. |
| `feature_catalog_code` | overlay | pass | 5 | Both feature catalog surfaces now match live discovery: constitutional + canonical spec docs + graph metadata only. |
| `skill_agent` | overlay | pass | 6 | Agent manuals continue to match the deep-review single-iteration contract and `review/` write boundary. |
| `agent_cross_runtime` | overlay | pass | 6 | `.opencode`, `.claude`, `.codex`, and `.gemini` deep-review manuals remain aligned on iteration contract and permissions. |
| `playbook_capability` | overlay | fail | 9 | Broader spec-kit playbooks still mention indexed support artifacts even after the targeted YAML cleanup. |
| `checklist_evidence` | core | fail | 10 | Broader create-command surfaces still ask operators to use retired memory files, conflicting with the canonical continuity contract. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | [D1] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | [D1] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | [D1] | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | [D1] | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/scripts/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/**` | [D3] | 9 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/feature_catalog/**` | [D3] | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/command/**` | [D3] | 10 | 4 P0, 1 P1, 0 P2 | partial |
| `.opencode/agent/**` | [D3] | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.claude/agents/**` | [D3] | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.codex/agents/**` | [D3] | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.gemini/agents/**` | [D3] | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md` | [D3] | 2 | 1 P0, 0 P1, 0 P2 | partial |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md` | [D1,D3] | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/checklist.md` | [D3] | 2 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.05
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=review-v4-20260414T145040Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-04-14T14:50:40.643Z
<!-- MACHINE-OWNED: END -->
