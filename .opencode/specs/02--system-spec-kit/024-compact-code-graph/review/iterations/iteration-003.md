# Review Iteration 3: Maintainability + Completeness - Root packet/runtime recovery coherence

## Focus
Maintainability + completeness pass over the root packet, Phase 021/027/028 packet bookkeeping, and runtime startup/recovery guidance surfaces.

## Scope
- Review target: root packet docs, child phase docs, runtime guidance docs, and runtime `context-prime` agent copies
- Spec refs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `021-cross-runtime-instruction-parity/spec.md`, `027-opencode-structural-priming/spec.md`, `028-startup-highlights-remediation/spec.md`
- Dimension: maintainability, completeness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `spec.md` | 3 | 3 | 2 | 2 |
| `plan.md` | 3 | 3 | 2 | 2 |
| `tasks.md` | 3 | 3 | 2 | 2 |
| `implementation-summary.md` | 3 | 3 | 2 | 2 |
| `021-cross-runtime-instruction-parity/spec.md` | 2 | 3 | 1 | 1 |
| `021-cross-runtime-instruction-parity/implementation-summary.md` | 2 | 3 | 1 | 1 |
| `027-opencode-structural-priming/implementation-summary.md` | 3 | 3 | 2 | 2 |
| `AGENTS.md` | 3 | 3 | 2 | 2 |
| `.opencode/agent/context-prime.md` | 3 | 3 | 2 | 2 |
| `.claude/agents/context-prime.md` | 2 | 3 | 1 | 1 |
| `.codex/agents/context-prime.md` | 2 | 3 | 1 | 1 |

## Findings
### P1-005: Phase 021 still documents `session_resume()` as the first-turn recovery contract
- Dimension: maintainability
- Evidence: Phase 021 still tells fresh sessions, `/clear`, and the `@context-prime` agent to start from `session_resume()` plus optional `session_health()` [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md:71-79] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md:91-96] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md:73-90]
- Cross-reference: Root guidance now says fresh OpenCode starts and hook-failure recovery should begin with `session_bootstrap()`, with `session_resume()` reserved for reconnect/detailed follow-up [SOURCE: AGENTS.md:75-93] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:48-57] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:121-140]
- Impact: The canonical packet says cross-runtime instruction parity is complete, but its own child packet preserves the superseded recovery table. Future doc sync work now has two incompatible “source-of-truth” bootstrap contracts, which risks reintroducing stale startup guidance into root/runtime docs.
- Skeptic: Phase 021 was completed before `session_bootstrap()` shipped, so it could be read as a historical artifact rather than a live contract.
- Referee: Rejected. The child spec and implementation summary present the table as the delivered “What Was Built” state, and the parent packet marks the phase complete, so readers are instructed to trust it as current behavior.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Phase 021 still presents `session_resume()` as the canonical first-turn recovery path even though the live root/runtime docs now require `session_bootstrap()` first.","evidenceRefs":[".opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md:71-79",".opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md:73-90","AGENTS.md:75-93",".opencode/skill/system-spec-kit/references/config/hook_system.md:48-57"],"counterevidenceSought":"Checked the root packet, AGENTS.md, and hook_system.md for any statement that Phase 021 remained intentionally historical or that `session_resume()` was still the first-call contract.","alternativeExplanation":"Phase 021 might have been intended as frozen historical context from before Phase 024/027 changed the recovery surface.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if Phase 021 is explicitly marked historical/superseded or updated to defer its recovery table to the newer root/bootstrap contract."}
```

### P2-001: Runtime `context-prime` copies no longer share the structural prime-package shape
- Dimension: completeness
- Evidence: The OpenCode runtime copy includes a dedicated `## Structural Context` block in the required Prime Package output [SOURCE: .opencode/agent/context-prime.md:125-145], but the Claude and Codex runtime copies jump directly from `## System Health` to `## Recommended Next Steps` with no structural section [SOURCE: .claude/agents/context-prime.md:124-139] [SOURCE: .codex/agents/context-prime.md:124-139]
- Cross-reference: Phase 027 says the structural bootstrap contract is now shared across startup/recovery surfaces and specifically records `.opencode/agent/context-prime.md` as the mirror for that contract [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:34-54] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:91-94]
- Impact: The runtime-specific agent copies are now harder to maintain because only one copy reflects the structural contract. This is non-blocking today, but it weakens cross-runtime consistency and increases the chance that later doc edits preserve different Prime Package schemas.
- Final severity: P2

## Cross-Reference Results
### Core Protocols
- Confirmed: Root packet, AGENTS.md, and `hook_system.md` now agree that `session_bootstrap()` is the canonical first hookless recovery call and `session_resume()` is the follow-up/detail surface [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:121-140] [SOURCE: AGENTS.md:75-93] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:48-57]
- Contradictions: Phase 021 still publishes the older `session_resume()`-first recovery table as shipped state [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md:71-79] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md:73-90]
- Unknowns: None material in the reviewed packet slice

### Overlay Protocols
- Confirmed: The OpenCode `context-prime` agent now includes the explicit structural contract section expected by Phase 027 [SOURCE: .opencode/agent/context-prime.md:125-145] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:47-54]
- Contradictions: The Claude and Codex runtime copies still omit that structural section, so agent surfaces are no longer schema-aligned [SOURCE: .claude/agents/context-prime.md:124-139] [SOURCE: .codex/agents/context-prime.md:124-139]
- Unknowns: Gemini runtime agent parity was not part of this iteration’s reviewed file set

## Ruled Out
- The hypothesis that Phase 028 over-claims broader startup/bootstrap remediation was ruled out. Its spec and implementation summary stay tightly scoped to `queryStartupHighlights()` quality fixes and explicitly keep broader startup contract work out of scope [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/spec.md:55-71] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/spec.md:87-91] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/implementation-summary.md:27-54]

## Sources Reviewed
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:85-140]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:65-119]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/tasks.md:77-138]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:72-178]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:80-184]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-223]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md:55-131]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md:68-135]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/tasks.md:49-61]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:27-247]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:31-104]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/spec.md:27-124]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/implementation-summary.md:27-84]
- [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:23-57]
- [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:736-799]
- [SOURCE: AGENTS.md:71-94]
- [SOURCE: .opencode/agent/context-prime.md:116-145]
- [SOURCE: .claude/agents/context-prime.md:118-139]
- [SOURCE: .codex/agents/context-prime.md:118-139]

## Assessment
- Confirmed findings: 2
- New findings ratio: 1.00
- noveltyJustification: One new P1 contract-drift finding and one new P2 runtime-copy divergence were both newly confirmed this iteration, so weightedNew matched weightedTotal.
- Dimensions addressed: maintainability, completeness

## Reflection
- What worked: Cross-checking child-phase “What Was Built” sections against the root packet and runtime guidance surfaced stale contract drift quickly.
- What did not work: The suspected Phase 028 bookkeeping drift did not hold up once the child packet was re-read end to end.
- Next adjustment: Use the performance pass to validate whether startup/bootstrap docs overstate build/test/runtime cost guarantees for structural priming and highlight generation.
