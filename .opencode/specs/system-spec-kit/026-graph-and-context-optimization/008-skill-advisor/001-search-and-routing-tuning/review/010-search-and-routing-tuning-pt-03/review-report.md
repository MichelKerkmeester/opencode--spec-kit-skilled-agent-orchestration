# Deep Review Report: 001-search-fusion-tuning

## 1. Executive Summary

- Release Readiness Verdict: CONDITIONAL
- Iterations completed: 10 of 10
- Scope: runtime code, requested docs, runtime mirrors, five live MCP configs, and the `001-005` packet tree
- Active findings: 0 P0, 6 P1, 0 P2
- hasAdvisories: false

The review did not uncover a release-blocking P0, but it did confirm six active P1 issues spanning the live continuity rerank path, repo docs, packet-local verification evidence, Codex mirror accuracy, and packet-tree closure state. The most important runtime defect is still the Stage 3 continuity handoff: resume-style searches route `adaptiveFusionIntent = 'continuity'` into Stage 1, but the default MMR pass still reads `detectedIntent`.

## 2. Planning Trigger

Route this outcome to `/spec_kit:plan`, not changelog or publish follow-up, because active P1s remain in three remediation lanes:

- Runtime alignment: Stage 3 continuity handoff still does not match the intended/search-documented behavior.
- Documentation and evidence repair: repo docs plus phase `005` packet evidence now overstate the shipped continuity Stage 3 state.
- Mirror and closure repair: Codex mirrors drift from the canonical review/continuity contracts, and child packets `001-004` are not fully checklist-verified.

## 3. Active Finding Registry

- **F001 [P1 | correctness]** Stage 3 MMR ignores the internal continuity handoff. Evidence: [`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830`], [`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538`], [`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`], [`.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641`], [`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:69`].
- **F002 [P1 | traceability]** Repo-level search docs now describe a continuity-aware Stage 3 lambda that the runtime does not execute. Evidence: [`.opencode/command/memory/search.md:102`], [`.opencode/skill/system-spec-kit/ARCHITECTURE.md:150`], [`.opencode/skill/system-spec-kit/mcp_server/configs/README.md:49`], [`README.md:393`], [`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`].
- **F003 [P1 | traceability]** The `005-doc-surface-alignment` packet records the continuity Stage 3 lambda behavior as verified shipped reality even though the runtime path still ignores `adaptiveFusionIntent` in Stage 3. Evidence: [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/spec.md:62`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/tasks.md:58`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:65`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/implementation-summary.md:61`], [`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`].
- **F004 [P1 | traceability]** Child packets `001-004` are not fully verification-closed: each checklist still carries `status: planned` with unchecked items, so the `001` tree is not actually fully checklist-verified. Evidence: [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/checklist.md:3`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/checklist.md:15`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry/checklist.md:3`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/checklist.md:13`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/checklist.md:13`].
- **F005 [P1 | maintainability]** `.codex/agents/deep-review.toml` still instructs a non-canonical iteration schema that the active reducer does not parse. Evidence: [`.claude/agents/deep-review.md:148`], [`.codex/agents/deep-review.toml:140`], [`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:202`].
- **F006 [P1 | traceability]** `.codex/agents/context.toml` omits the canonical continuity recovery ladder and graph-health probe that Claude/Gemini now require for context recovery. Evidence: [`.claude/agents/context.md:29`], [`.claude/agents/context.md:48`], [`.codex/agents/context.toml:30`], [`.codex/agents/context.toml:31`].

## 4. Remediation Workstreams

- **Workstream A: Runtime continuity handoff**
  Fix Stage 3 to read `adaptiveFusionIntent` (or an equivalent continuity-aware override), then add a regression that proves resume-style searches keep continuity semantics through MMR.
- **Workstream B: Documentation and packet evidence reality check**
  Update the repo doc surfaces and phase `005` packet evidence so they describe the current runtime accurately, then re-run the relevant packet validation and review surfaces.
- **Workstream C: Codex mirror parity**
  Resync Codex `deep-review` and `context` to the canonical Claude/Gemini contracts, then verify reducer compatibility and continuity-first recovery behavior.
- **Workstream D: Packet-tree closure**
  Either finish the unchecked `001-004` checklist items with evidence and strict validation, or explicitly reopen/defer them so the tree no longer reads as silently complete.

## 5. Spec Seed

- Open a follow-on child packet under `001-search-fusion-tuning/` for Stage 3 continuity handoff remediation plus doc-reality sync.
- Open a sibling child packet for Codex mirror parity on `deep-review` and `context`.
- If checklist closure work is kept separate, add a packet focused on `001-004` verification-state cleanup and strict validation closure.

## 6. Plan Seed

1. Thread `adaptiveFusionIntent` into Stage 3 lambda selection and add regression coverage for the default MMR-enabled path.
2. Correct the repo docs and `005-doc-surface-alignment` packet evidence so they no longer present the continuity Stage 3 lambda as shipped reality until the runtime fix lands.
3. Normalize `.codex/agents/deep-review.toml` to the canonical reducer-compatible iteration template.
4. Normalize `.codex/agents/context.toml` to the canonical `handover.md -> _memory.continuity -> spec docs` recovery ladder plus `code_graph_status()` preflight.
5. Close or explicitly defer the unchecked checklist items in `001-004`, then re-run strict validation on the full `001` tree.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | fail | Runtime Stage 3 continuity behavior still diverges from packet and repo claims. |
| `checklist_evidence` | core | fail | `001-004` checklists are still planned/incomplete, and phase `005` records a continuity claim that the runtime does not yet satisfy. |
| `skill_agent` | overlay | fail | Codex `deep-review` and `context` drift from the canonical contracts. |
| `agent_cross_runtime` | overlay | fail | Claude and Gemini align on the reviewed flows; Codex is the material outlier. |
| `feature_catalog_code` | overlay | fail | Feature-catalog retrieval entries repeat the unshipped Stage 3 continuity-lambda behavior. |
| `playbook_capability` | overlay | pass | The inspected reranker playbook surface accurately reflects telemetry and neutral length-scaling behavior. |

## 8. Deferred Items

- Historical packet docs outside `001` still contain `SPECKIT_TIER3_ROUTING` mentions, but the five live configs are clean and the active save handler is always-on Tier 3 with fail-open Tier 2 fallback.
- `SKILL.md` is not part of the active drift set: it correctly mentions continuity profile, rerank gate, and telemetry without explicitly promising the Stage 3 continuity lambda is already live.
- No new security-sensitive regressions were found in `memory-save.ts`, the live MCP configs, or the reranker telemetry path during this review.

## 9. Audit Appendix

### Iteration Allocation

| Iterations | Allocation | Outcome |
|------------|------------|---------|
| 1-2 | Code correctness | Found F001; ruled out telemetry, rerank-gate, and Tier 3 config/runtime drift |
| 3-4 | Doc accuracy | Found F002; confirmed catalog mirrors repeat the same Stage 3 continuity claim |
| 5-6 | Cross-reference integrity | Found F003 and F004 across packet-local evidence and child checklist closure |
| 7-8 | Mirror consistency | Found F005 and F006 in Codex `deep-review` and `context` |
| 9-10 | Traceability and stabilization | No new findings; confirmed config cleanliness, Claude/Gemini parity, and strict-validation summary state |

### Validation Summary

| Target | Strict Validation Result |
|--------|--------------------------|
| `001-search-fusion-tuning/` | FAIL (`exit 2`, `Errors: 21`, `Warnings: 31`) |
| `001-remove-length-penalty/` | FAIL (`exit 2`, `Errors: 4`, `Warnings: 6`) |
| `002-add-reranker-telemetry/` | FAIL (`exit 2`, `Errors: 3`, `Warnings: 7`) |
| `003-continuity-search-profile/` | FAIL (`exit 2`, `Errors: 4`, `Warnings: 6`) |
| `004-raise-rerank-minimum/` | FAIL (`exit 2`, `Errors: 4`, `Warnings: 6`) |
| `005-doc-surface-alignment/` | PASS (`exit 0`, `Errors: 0`, `Warnings: 0`) |

### Key Commands

- `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "Run 10 sk-deep-review iterations across 001-search-fusion-tuning and ALL its sub-phases (001-005)..." --threshold 0.8`
- `rg -n "SPECKIT_TIER3_ROUTING" . -g '!**/node_modules/**' -g '!**/dist/**'`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <target>`
- `rg -n "continuity|Stage 3|lambda|getRerankerStatus|applyLengthPenalty" <runtime/docs>`

### Convergence / Stop Reason

- Stop reason: operator-requested `maxIterations=10` reached
- Last two iteration ratios: `0.00 -> 0.00`
- Final active severity mix: `0 P0 / 6 P1 / 0 P2`
- Result: no new late-cycle findings, but active P1s remain, so the verdict stays CONDITIONAL rather than PASS
