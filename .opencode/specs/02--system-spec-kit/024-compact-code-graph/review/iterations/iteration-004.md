# Review Iteration 4: Performance - Startup/bootstrap and structural-priming cost guarantees

## Focus
Performance pass over startup/bootstrap and structural-priming surfaces, especially whether current docs overstate token-budget, query-cost, or startup-latency guarantees for `session_bootstrap`, structural context, and startup highlights.

## Scope
- Review target: startup/bootstrap handlers, structural-read handlers, shared structural contract builder, and root/phase packet docs
- Spec refs: `spec.md`, `plan.md`, `implementation-summary.md`, `decision-record.md`, `027-opencode-structural-priming/spec.md`, `027-opencode-structural-priming/plan.md`, `027-opencode-structural-priming/implementation-summary.md`, `028-startup-highlights-remediation/spec.md`, `028-startup-highlights-remediation/implementation-summary.md`
- Dimension: performance

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `mcp_server/handlers/session-bootstrap.ts` | 3 | 4 | 2 | 3 |
| `mcp_server/handlers/session-resume.ts` | 3 | 4 | 2 | 3 |
| `mcp_server/handlers/session-health.ts` | 3 | 4 | 2 | 3 |
| `mcp_server/handlers/code-graph/context.ts` | 4 | 4 | 3 | 3 |
| `mcp_server/handlers/code-graph/query.ts` | 4 | 4 | 3 | 3 |
| `mcp_server/lib/code-graph/ensure-ready.ts` | 4 | 4 | 3 | 3 |
| `mcp_server/lib/session/session-snapshot.ts` | 3 | 4 | 2 | 3 |
| `mcp_server/lib/code-graph/startup-brief.ts` | 3 | 4 | 3 | 3 |
| `mcp_server/hooks/claude/session-prime.ts` | 3 | 4 | 3 | 3 |
| `spec.md` | 3 | 4 | 2 | 3 |
| `plan.md` | 3 | 4 | 2 | 3 |
| `implementation-summary.md` | 3 | 4 | 2 | 3 |
| `027-opencode-structural-priming/spec.md` | 3 | 4 | 1 | 2 |
| `027-opencode-structural-priming/plan.md` | 3 | 4 | 1 | 2 |
| `027-opencode-structural-priming/implementation-summary.md` | 3 | 4 | 2 | 2 |
| `028-startup-highlights-remediation/spec.md` | 4 | 4 | 3 | 3 |

## Findings
### P1-006: Structural bootstrap packet promises a hard token ceiling that the shared builder never enforces
- Dimension: performance
- Evidence: Phase 027 defines the structural bootstrap contract as a 250-400 token target with a 500-token hard ceiling [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:144-147] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/plan.md:88-93]. The shared implementation only assembles a summary plus optional highlights and never counts or truncates tokens before returning [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:29-39] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:159-193]. `session_bootstrap`, `session_resume`, and `session_health` then surface that object directly with no additional budget guard [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:84-105] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:120-143] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:90-137].
- Cross-reference: Phase 027's implementation summary presents the contract as delivered across startup and recovery surfaces, not as a future aspiration [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:34-45] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:91-94]
- Impact: The canonical packet treats a bounded structural digest as a shipped performance guarantee, but the live implementation relies only on small-string conventions. As the graph summary grows or the highlights become richer, bootstrap/recovery surfaces can exceed the documented token ceiling and silently increase first-turn query cost.
- Skeptic: The current builder keeps the payload short in practice by emitting one summary string and at most five terse highlights, so the ceiling may be satisfied empirically even without explicit counting.
- Referee: Kept at P1. The spec and plan describe a hard ceiling, not an informal expectation. No code on the shared builder path or the consuming handlers measures or trims structural-contract output to that limit, so the documented performance bound is not actually enforced.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Phase 027 documents a 250-400 token structural bootstrap contract with a 500-token hard ceiling, but the shared builder and consuming handlers never enforce that ceiling.","evidenceRefs":[".opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:144-147",".opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/plan.md:88-93",".opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:159-193",".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:84-105",".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:120-143",".opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:90-137"],"counterevidenceSought":"Checked the shared builder, startup/bootstrap consumers, and surrounding helper comments for any token-counting, truncation, or max-length guard on the structural contract before it is returned to callers.","alternativeExplanation":"The team may have intended the 250-400/500-token language as descriptive guidance because current summary strings are usually short.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Downgrade if the packet language is relaxed from a hard ceiling to a best-effort target, or if a real token/length guard is added on the shared structural-contract path."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: `session_bootstrap` no longer suppresses the full resume payload; it calls `handleSessionResume` without `minimal: true`, and only the explicit `args.minimal` branch inside `session_resume` skips the heavy memory call [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58-65] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:59-85]
- Contradictions: Phase 027 still documents the structural contract as a hard-bounded payload even though the shared builder and bootstrap/resume/health surfaces do not enforce that limit [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:132-147] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:137-193]
- Unknowns: No measured large-workspace latency benchmark for the structural-contract builder was surfaced in the reviewed canonical packet slice.

### Overlay Protocols
- Confirmed: Claude SessionStart startup output still has an explicit 2000-token guard through `SESSION_PRIME_TOKEN_BUDGET`, pressure adjustment, and final truncation [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:9-10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:83-89] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:226-236]
- Confirmed: Phase 028 remains scoped to startup-highlight quality fixes rather than a broader token-budget increase for startup output [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/spec.md:55-71] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/implementation-summary.md:29-37]
- Unknowns: No overlay-specific performance mismatch was newly confirmed beyond the Phase 027 token-ceiling drift.

## Ruled Out
- The previously suspected synchronous read-path reindex cost on `code_graph_context` / `code_graph_query` is not present in the live handlers. Both read paths call `ensureCodeGraphReady(..., { allowInlineIndex: false })`, and the helper explicitly returns early with `inline auto-index skipped for read path` when that flag is false [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:89-92] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:118-121] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:236-243]
- The previously suspected `session_bootstrap` minimal-mode payload suppression is not present in the current tree [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58-65] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:59-85]
- The previously suspected startup-highlights budget expansion is not supported by the current startup hook path; startup output still uses the existing 2000-token session-prime budget and truncation guard [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:9-10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:209-236]

## Sources Reviewed
- [SOURCE: .opencode/skill/sk-code--review/references/review_core.md:12-29]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53-112]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:50-158]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:54-145]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:86-181]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-213]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:219-285]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:28-39]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:137-193]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47-80]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:349-416]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:5-10]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:83-129]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:99-155]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:226-245]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:85-141]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:67-120]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:80-126]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:185-223]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger/spec.md:55-149]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger/implementation-summary.md:68-136]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:132-152]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/plan.md:76-97]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:34-45]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:82-95]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/spec.md:55-91]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/implementation-summary.md:29-37]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The only confirmed issue this pass is a fully new P1 packet-versus-runtime performance mismatch, so weightedNew and weightedTotal are both 5.
- Dimensions addressed: performance

## Reflection
- What worked: Following explicit token-budget claims from the Phase 027 packet into the shared builder and consuming handlers quickly separated enforced limits from aspirational comments.
- What did not work: The earlier hypothesis about synchronous inline reindex cost on structural read paths did not hold up once the handlers and `allowInlineIndex` branch were checked together.
- Next adjustment: Shift to a convergence-stabilization challenge pass over active P1 findings, with special attention to lingering documentation guarantees on bootstrap and code-graph surfaces.
