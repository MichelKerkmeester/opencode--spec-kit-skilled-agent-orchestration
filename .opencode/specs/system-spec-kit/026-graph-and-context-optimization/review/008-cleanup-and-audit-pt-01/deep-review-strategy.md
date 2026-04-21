# Deep Review Strategy

## 1. OVERVIEW

Fresh run against the memory deprecation track. The loop reached 20 iterations because a release-blocking P0 remained active after dimension coverage stabilized.

## 2. TOPIC

Verify that the deprecated standalone memory system is fully retired across runtime, scripts, docs, agents, playbooks, and spec evidence.

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- No runtime or test remediation during the review.
- No web research.
- No edits outside the review packet.

## 5. STOP CONDITIONS

- Stop at 20 iterations or earlier convergence.
- Do not allow PASS while any confirmed P0 remains active.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | FAIL | 1 | F001 shows legacy specs/**/memory support still active on save and startup scan hot paths. |
| D2 Security | PASS | 2 | No new shared-memory governance, auth, or sharedSpaceId security residues surfaced. |
| D3 Traceability | FAIL | 3 | F002 and F003 show packet/changelog/doc surfaces no longer tell one coherent retirement story. |
| D4 Maintainability | CONDITIONAL | 8 | F004 plus cross-runtime doc residue leave stale operator guidance in place. |

## 7. RUNNING FINDINGS

- P0 (Critical): 1 active
- P1 (Major): 2 active
- P2 (Minor): 1 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Tight token sweeps for shared-memory names and sharedSpaceId quickly eliminated false positives from runtime code. (iterations 2, 10, 18)
- Direct hot-path reads of memory-save.ts, memory-parser.ts, context-server.ts, and vector-index-schema.ts exposed the release-blocking contradictions fast. (iterations 1, 3, 13, 17)
- Cross-runtime agent doc comparison made the stale instruction family obvious instead of treating each runtime in isolation. (iterations 4, 16)

## 9. WHAT FAILED

- Broad repo-wide searches pulled archived review artifacts and were too noisy to support precise findings. Targeted scope reads were required instead. (iteration 4)

## 10. EXHAUSTED APPROACHES

### Broad repo-wide sweeps -- BLOCKED (iteration 4, 1 attempt)
- What was tried: repo-wide text scans for memory/, sharedSpaceId, and shared-memory symbols.
- Why blocked: archived packets and generated review artifacts drowned the active signal.
- Do NOT retry: use targeted audit roots and direct file reads instead.

### Scoped hot-path reads -- PRODUCTIVE (iteration 1)
- What worked: focused reads on memory-save.ts, memory-parser.ts, context-server.ts, vector-index-schema.ts, and cross-runtime agents.
- Prefer for: future retirement audits or packet-versus-runtime truth checks.

## 11. RULED OUT DIRECTIONS

- Active shared-memory lifecycle tool registrations did not survive in the live MCP tool surface; no new finding recorded from that sweep. (iterations 2, 10, 18)
- The resume ladder itself does not fall back to standalone memory files; it matches the new continuity contract. (iteration 11)

## 12. NEXT FOCUS

None. Max iterations reached; synthesize review-report.md and route remediation into focused follow-up work.

## 13. KNOWN CONTEXT

- Claimed retirement state from the v3.4.0.0 changelog was treated as the release claim under audit.
- Cleanup packet 001-remove-shared-memory was treated as the detailed implementation record under audit.
- Review scope included runtime, scripts, agents, commands, playbooks, and per-packet memory directory spot checks.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | fail | 3 | F001 and F002 show active runtime behavior diverges from the retirement story in packet docs. |
| checklist_evidence | core | fail | 7 | CHK-013 still certifies a schema-column exception that no longer matches shipped runtime behavior. |
| skill_agent | overlay | fail | 4 | Active agent docs still describe memory/ as a live surface. |
| agent_cross_runtime | overlay | fail | 4 | OpenCode, Claude, Gemini, and Codex copies drift together and preserve retired guidance. |
| feature_catalog_code | overlay | pass | 10 | No active shared-memory catalog residue was needed to explain the failing verdict. |
| playbook_capability | overlay | fail | 8 | Playbook scenarios 097 and 144 still teach specs/<target-spec>/memory/*.md examples. |

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | D1, D3 | 17 | 1 P0 | complete |
| .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | D1, D3 | 17 | 1 P0 | complete |
| .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts | D1 | 17 | 1 P0 | complete |
| .opencode/skill/system-spec-kit/mcp_server/context-server.ts | D1 | 17 | 1 P0 | complete |
| .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts | D1 | 13 | 1 P0 | complete |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | D1, D3 | 7 | 1 P1 | complete |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md | D3 | 19 | 1 P1 | complete |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/checklist.md | D3 | 7 | 1 P1 | complete |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/implementation-summary.md | D3 | 19 | 1 P1 | complete |
| .opencode/changelog/01--system-spec-kit/v3.4.0.0.md | D3 | 19 | 1 P1 | complete |
| .opencode/agent/orchestrate.md | D4 | 20 | 1 P1 | complete |
| .claude/agents/orchestrate.md | D4 | 16 | 1 P1 | complete |
| .gemini/agents/orchestrate.md | D4 | 16 | 1 P1 | complete |
| .codex/agents/orchestrate.toml | D4 | 20 | 1 P1 | complete |
| .codex/agents/handover.toml | D4 | 4 | 1 P1 | complete |
| .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md | D4 | 20 | 1 P2 | complete |
| .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md | D4 | 20 | 1 P2 | complete |

## 16. REVIEW BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.05
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=review-memory-deprecation-20260414T092851Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: deep-review-findings-registry.json
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: track
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-04-14T09:28:51.408Z
