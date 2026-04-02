# Review Iteration 2: Security - Gemini Compact Recovery Provenance Boundaries

## Focus
Security review of the compact-prime recovery path and adjacent runtime-governance surfaces, with emphasis on prompt-injection boundaries, cached payload handling, and runtime policy truth in the shipped tree.

## Scope
- Review target: `.opencode/specs/02--system-spec-kit/024-compact-code-graph`
- Reviewed runtime files:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts`
- Reviewed packet/spec files:
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md`
- Dimension: security

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `hooks/gemini/session-prime.ts` | 6/10 | 4/10 | 6/10 | 6/10 |
| `hooks/claude/shared.ts` | 8/10 | 8/10 | 7/10 | 7/10 |
| `hooks/claude/session-prime.ts` | 8/10 | 8/10 | 7/10 | 7/10 |
| `lib/code-graph/runtime-detection.ts` | 7/10 | 7/10 | 5/10 | 6/10 |
| `tests/cross-runtime-fallback.vitest.ts` | 7/10 | 7/10 | 6/10 | 7/10 |

## Findings
### P1-002 [P1] Gemini compact recovery drops the provenance fence around recovered payloads
- Dimension: security
- Evidence: the Gemini compact recovery branch sanitizes the cached payload, then injects the sanitized text directly as `Recovered Context (Post-Compression)` without wrapping it in the provenance markers used by the shared hook helper.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:64-72][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:102-109]
- Cross-reference: the root checklist still marks "Recovered context fenced with provenance markers" as complete.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:143-144]
- Impact: this path still replays transcript-derived context into the model, but on Gemini it loses the explicit `[SOURCE: hook-cache ...][/SOURCE]` boundary that the packet relies on to distinguish recovered content from live system instructions. Sanitization removes only obvious system-like lines; it does not preserve the stronger provenance fence used by the Claude path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:91-109]
- Skeptic: Gemini comments note that `source=compact` is not a native lifecycle event and may only run in a one-shot recovery path, while sanitization already strips some hostile-looking lines before injection.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:175-178][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72]
- Referee: even as a fallback path, the shipped branch is explicitly reachable when `source === "compact"`, and it weakens the documented prompt-boundary contract precisely on recovered transcript content. That is a required security fix, not an advisory documentation polish item.

```json
{"type":"claim-adjudication","claim":"Gemini compact recovery injects cached transcript-derived payloads without the provenance fence the packet documents as the prompt-injection boundary.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:64-72",".opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:102-109",".opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:143-144"],"counterevidenceSought":"Checked whether the Gemini compact branch calls wrapRecoveredCompactPayload() elsewhere or adds equivalent provenance markers after sanitization; it does not.","alternativeExplanation":"The Gemini path may be treated as a lower-risk fallback because native compact recovery is not always present. That still leaves the documented recovery surface with a weaker trust boundary than the Claude implementation.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"If the Gemini compact branch wraps cached payloads with explicit provenance markers equivalent to wrapRecoveredCompactPayload(), or if the compact branch is removed from shipped runtime paths, this finding can be downgraded or resolved."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: the Claude compact recovery path still wraps cached payloads with explicit source markers before injection.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:67-76][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:102-109]
- Contradictions: the root checklist marks provenance fencing complete, but the Gemini compact path omits the wrapper on the live tree.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:143-144][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:64-72]
- Unknowns: there is no reviewed end-to-end Gemini compact test exercising this branch.

### Overlay Protocols
- Confirmed: runtime detection remains two-field (`runtime`, `hookPolicy`) in the shipped code and tests.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:21-53][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:83-99]
- Contradictions: the root decision record and runtime support matrix still describe Gemini as a v1 policy suppression story ("tool fallback by policy" / `disabled_by_scope`), while the shipped detector and tests now model Gemini as config-sensitive and `unavailable` when `.gemini/settings.json` is absent.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:112-117][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:217-222][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:46-76][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:92-99]
- Unknowns: whether a checked-in `.gemini/settings.json` in downstream repos would intentionally move this runtime back to `enabled`.

## Ruled Out
- The Claude compact recovery branch is not missing provenance fencing; it uses `wrapRecoveredCompactPayload()` and injects the wrapped payload.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:67-76][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:102-109]
- The security issue is not missing sanitization entirely; the Gemini path does sanitize obvious system-style lines before injection.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:91-100]

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:41-83]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:175-178]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:91-109]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:67-76]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:21-76]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:83-99]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:143-144]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:112-117]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:217-222]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: this pass added one new live-tree security finding and no refinements; the only confirmed issue in scope was the Gemini-specific provenance-boundary gap.
- Dimensions addressed: security

## Reflection
- What worked: comparing the Gemini and Claude compact recovery branches against the shared wrapper helper made the boundary regression obvious without relying on archived review conclusions.
- What did not work: packet-level runtime support prose was less reliable than the current runtime detector/tests for understanding Gemini hook policy.
- Next adjustment: rotate to D3 traceability and pin checked packet claims against the current hook/session runtime, especially the still-claimed Claude `session_id` -> Spec Kit session bridge.
