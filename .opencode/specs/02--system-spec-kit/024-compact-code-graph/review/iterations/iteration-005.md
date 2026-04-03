# Review Iteration 5: Convergence Stabilization - Active Finding Challenge Pass

## Focus
Challenge the active P1/P2 registry against current-tree evidence and prefer falsification over confirmation.

## Scope
- Review target: root packet artifacts plus the runtime/doc surfaces backing P1-001 through P1-006 and P2-001
- Spec refs: `021-cross-runtime-instruction-parity/implementation-summary.md`, `027-opencode-structural-priming/spec.md`
- Dimension: convergence-stabilization challenge pass

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | 3 | 3 | 2 | 3 |
| `.opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md` | 2 | 3 | 2 | 2 |
| `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md` | 2 | 3 | 2 | 2 |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | 3 | 2 | 2 | 3 |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | 3 | 2 | 2 | 3 |
| `AGENTS.md` | 3 | 3 | 2 | 2 |
| `.opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md` | 2 | 3 | 2 | 2 |
| `.opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md` | 3 | 3 | 2 | 3 |
| `.opencode/agent/context-prime.md` | 3 | 3 | 3 | 2 |
| `.claude/agents/context-prime.md` | 3 | 3 | 2 | 2 |
| `.codex/agents/context-prime.md` | 3 | 3 | 2 | 2 |

## Findings
No new findings were added in this stabilization pass. All seven active findings were challenged against live-tree evidence; none met downgrade, invalidation, or strengthening criteria.

### P1-001: `session_bootstrap` still lacks the documented recommended-next-actions payload
- Dimension: traceability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:754] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:100-105]
- Impact: The public tool contract still promises recommended next actions, but the handler only returns `resume`, `health`, `structuralContext`, and `hints`.
- Challenge result: Survives. I sought counterevidence in the live handler for a dedicated next-actions field; `structuralContext.recommendedAction` and the generic `hints` array do not satisfy the documented composite payload promise.
- Final severity: P1 (unchanged)

### P1-002: Root checklist evidence still relies on a stale implementation summary
- Dimension: traceability
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:110-111] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:163-164] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:162-163] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:167-170] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:176-177]
- Impact: Checklist items still cite a summary that marks Phase 015 items deferred and Phase 016 scope/intent sync as later follow-through, so the checklist evidence remains unreliable.
- Challenge result: Survives. I looked for later root-summary corrections that would reconcile those checklist claims, but the live root summary still carries the stale deferred/partial language.
- Final severity: P1 (unchanged)

### P1-003: Gemini compact recovery still lacks provenance fencing around recovered text
- Dimension: security
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:17-21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72]
- Impact: Sanitization happens, but Gemini still injects recovered compact text directly without the provenance wrapper the packet claims as shipped hardening.
- Challenge result: Survives. I looked for later wrapping in adjacent code, but the live compact path only emits `sanitizedPayload`; `wrapRecoveredCompactPayload` is imported and unused.
- Final severity: P1 (unchanged)

### P1-004: Claude stop-hook autosave can still persist to the wrong spec folder
- Dimension: reliability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:53-76] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:205-267]
- Impact: The autosave uses `state.lastSpecFolder`, and that state is still populated by transcript-tail path frequency, so cross-spec discussions can bias the chosen destination.
- Challenge result: Survives. I looked for a stronger source-of-truth override before autosave, but the live path still depends on `detectSpecFolder()`'s frequency winner.
- Final severity: P1 (unchanged)

### P1-005: Phase 021 still publishes the superseded `session_resume()`-first recovery contract
- Dimension: maintainability
- Evidence: [SOURCE: AGENTS.md:75-93] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md:75-90]
- Impact: The canonical root guidance says OpenCode should call `session_bootstrap()` first on fresh start or after `/clear`, but Phase 021 still describes a `session_resume()`-first flow and an agent built around it.
- Challenge result: Survives. I looked for phase-local wording that had been updated after the root truth-sync, but the child implementation summary still carries the older contract.
- Final severity: P1 (unchanged)

### P1-006: Phase 027's hard structural-token ceiling is still not enforced in code
- Dimension: performance
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:144-147] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:142-193]
- Impact: The phase spec still commits to a 500-token hard ceiling, but the shared structural contract builder never measures or truncates emitted output to enforce that cap.
- Challenge result: Survives. I looked for token-count enforcement inside the shared contract builder and found only fixed top-kind slicing, which is not an actual hard ceiling.
- Final severity: P1 (unchanged)

### P2-001: Runtime `context-prime` copies still diverge from the OpenCode structural Prime Package shape
- Dimension: completeness
- Evidence: [SOURCE: .opencode/agent/context-prime.md:130-146] [SOURCE: .claude/agents/context-prime.md:129-140] [SOURCE: .codex/agents/context-prime.md:129-140]
- Impact: The OpenCode agent includes an explicit Structural Context section, while the Claude/Codex copies still omit it, so cross-runtime startup guidance remains only partially mirrored.
- Challenge result: Survives. I looked for equivalent structural-package sections in the Claude and Codex copies and did not find them.
- Final severity: P2 (unchanged)

## Cross-Reference Results
### Core Protocols
- Confirmed: None in this challenge pass.
- Contradictions: `spec_code` remains contradicted by P1-001, P1-005, and P1-006. `checklist_evidence` remains contradicted by P1-002.
- Unknowns: No fresh `feature_catalog_code` or playbook re-check was needed for this falsification pass.

### Overlay Protocols
- Confirmed: None in this challenge pass.
- Contradictions: `agent_cross_runtime` remains contradicted by P1-003 and P2-001. `skill_agent` remains contradicted by P1-005 and P2-001.
- Unknowns: `feature_catalog_code` and `playbook_capability` were not reopened because no challenged finding depended on them.

## Ruled Out
- A downgrade of P1-001 to an advisory docs nit was ruled out because the live schema still advertises a shipped handler contract that callers can rely on. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:754]
- A downgrade of P1-003 based on sanitization alone was ruled out because no provenance wrapper is added after sanitization. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72]
- A downgrade of P1-006 to a soft wording issue was ruled out because the Phase 027 spec still states a hard 500-token ceiling. [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:144-147]

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58-105]
- [SOURCE: .opencode/command/spec_kit/resume.md:257-279]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:104-126]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:156-184]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:123-178]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:41-82]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:53-99]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:205-303]
- [SOURCE: AGENTS.md:71-93]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md:71-92]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:132-152]
- [SOURCE: .opencode/agent/context-prime.md:117-146]
- [SOURCE: .claude/agents/context-prime.md:118-140]
- [SOURCE: .codex/agents/context-prime.md:118-140]

## Assessment
- Confirmed findings: 0 new, 7 challenged and retained
- New findings ratio: 0.00
- noveltyJustification: This pass was intentionally adversarial and only re-tested existing findings; no contradictory evidence or severity refinements were found.
- Dimensions addressed: traceability, security, reliability, maintainability, performance, completeness

## Reflection
- What worked: Re-reading only the live files tied to each active finding made falsification efficient without reopening unrelated packet surfaces.
- What did not work: Broad challenge pressure did not produce any weakening evidence, so repeating the same registry-only pass would likely be low-yield.
- Next adjustment: Use the next pass for synthesis-prep and any still-pending overlay protocols rather than another identical broad challenge sweep.
