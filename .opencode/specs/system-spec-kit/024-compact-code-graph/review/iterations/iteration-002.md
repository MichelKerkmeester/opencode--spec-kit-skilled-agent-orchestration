# Review Iteration 2: Security + Reliability - compact reinjection fencing and stop-hook autosave durability

## Focus
Security + reliability pass over hook-state/session-prime/session-stop durability, temp-file permissions, recovery-surface error handling, and packet claim drift.

## Scope
- Review target: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/{hook-state,session-prime,session-stop,shared,compact-inject}.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/{session-prime,compact-inject,shared}.ts`, `.opencode/skill/system-spec-kit/mcp_server/{context-server.ts,handlers/memory-context.ts}`
- Spec refs: `.opencode/specs/system-spec-kit/024-compact-code-graph/{spec.md,implementation-summary.md}`
- Dimension: security, reliability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | 3 | 4 | 3 | 3 |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | 3 | 3 | 3 | 3 |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | 2 | 2 | 2 | 2 |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | 3 | 1 | 1 | 2 |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts` | 3 | 3 | 3 | 3 |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md` | 2 | 2 | 1 | 3 |

## Findings
### P1-003: Gemini SessionStart still injects recovered compact text without provenance fencing
- Dimension: security
- Evidence: Gemini `handleCompact()` injects `sanitizeRecoveredPayload(payload)` directly as `Recovered Context (Post-Compression)` instead of wrapping it with the shipped provenance fence, even though the shared wrapper exists and the Gemini BeforeAgent compact path already uses it. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:108-115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:52-63]
- Cross-reference: The canonical packet still claims Phase 014 delivered “provenance fencing for injection safety,” which overstates the current Gemini SessionStart posture. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:108-111]
- Impact: Recovered transcript text is still instruction-shaped content. Sanitization removes obvious role-prefixed lines, but without the `[SOURCE: ...]` wrapper this recovery block is presented as ordinary injected context, weakening the prompt-safety boundary exactly on the Gemini runtime path.
- Skeptic: The payload is sanitized first, and Gemini `compact-inject.ts` does fence one compact-recovery surface, so this could be an intentional minimal SessionStart rendering choice.
- Referee: Rejected. The SessionStart compact path is itself a recovery injection surface, the shared wrapper is already available, and the shipped packet claims the fence as a delivered safety hardening item rather than an optional variant.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Gemini SessionStart compact recovery injects recovered transcript text without the provenance fence that the packet claims as shipped injection-safety hardening.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72",".opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:108-115",".opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:52-63",".opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:108-111"],"counterevidenceSought":"Checked whether sanitization alone or another Gemini recovery surface already fenced the payload; verified that only BeforeAgent compact-inject uses the wrapper while SessionStart does not.","alternativeExplanation":"The Gemini SessionStart path intentionally chose a plainer rendering because sanitizeRecoveredPayload strips obvious instruction prefixes.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Evidence that Gemini never injects SessionStart additionalContext into the model prompt, or that another runtime layer adds provenance fencing before delivery, would justify downgrading this finding."}
```

### P1-004: Claude stop-hook spec-folder autodetection can auto-save into whichever spec path dominates the transcript tail
- Dimension: reliability
- Evidence: `detectSpecFolder()` scans the last 50 KB of transcript text, counts every `specs/...` match, and returns the most frequent normalized path without checking filesystem existence or whether that path is the current active packet. `runContextAutosave()` then feeds `state.lastSpecFolder` straight into `generate-context.js`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:53-80] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:229-267] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:279-302]
- Cross-reference: The packet claims the Stop hook “saves session state” and that `lastSpecFolder` provides continuity, but this implementation can persist summaries into an unrelated packet whenever the transcript discusses another spec more often than the active one. [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:115-118] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:188-195] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:84-90]
- Impact: Session summaries can be auto-saved under the wrong spec folder, contaminating future resume context and making recovery behavior nondeterministic after cross-packet discussions.
- Skeptic: The regex is constrained to `specs/...` paths with numbered segments, and frequency voting reduces one-off false positives.
- Referee: Still confirmed. Frequency counting is not an active-session check; a transcript that discusses sibling packets, links, or examples can legitimately make the wrong packet “win,” and there is no post-detection validation before autosave.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Claude stop-hook autosave can persist session summaries to the wrong spec folder because transcript-tail path frequency is treated as authoritative active-session state.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:53-80",".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:229-267",".opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:279-302",".opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:115-118",".opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:188-195",".opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:84-90"],"counterevidenceSought":"Checked for a filesystem existence check, active-workspace verification, or generate-context pre-validation before autosave; none is performed in the stop hook before lastSpecFolder is saved and reused.","alternativeExplanation":"The most frequent spec path in the transcript tail is intended as a pragmatic proxy for the active packet and may be good enough for most sessions.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"A demonstrated downstream guard in generate-context.js or another stop-hook validation step that rejects non-active or non-existent folders before persistence would justify downgrading this finding."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: Claude compact recovery now clears `pendingCompactPrime` only after stdout write, matching the documented durability intent. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:238-244] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:120-153]
- Contradictions: The packet still overstates delivered injection-safety and continuity guarantees because Gemini SessionStart lacks the provenance fence and Claude stop-hook autosave trusts transcript frequency as active-folder truth. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:229-302] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:84-90] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:108-111]
- Unknowns: Downstream `generate-context.js` folder-validation behavior was not re-audited in this iteration.

### Overlay Protocols
- Confirmed: Hook-state temp storage is permission-hardened (`0700` directory, `0600` files) and both Claude/Gemini compact paths clear cached payload only after stdout write. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:49-55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:106-117] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:70-77]
- Contradictions: Cross-runtime compact recovery is not actually parity-safe; Claude SessionStart uses the provenance wrapper while Gemini SessionStart does not. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:67-76] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72]
- Unknowns: Gemini stop-hook autosave parity was not revalidated in this iteration.

## Ruled Out
- Missing temp permission hardening is not a live issue: `ensureStateDir()` creates the hook-state directory with `0o700`, and `saveState()` writes the temp file with `0o600` before atomic rename. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:49-55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:106-117]
- The previously reported delete-before-write compact race is not present on the live Claude path: `session-prime.ts` writes stdout before calling `clearCompactPrime()`, and `hook-state.ts` exposes split read/clear helpers instead of destructive read-and-clear usage. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:238-244] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:120-153]

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:1-198]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44-245]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:18-99]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:228-303]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:91-116]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:188-318]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:41-82]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:34-77]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:61-89]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:797-910]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1028-1440]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:101-118]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:188-195]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:84-111]

## Assessment
- Confirmed findings: 2
- New findings ratio: 1.00
- noveltyJustification: Both confirmed findings are fully new P1 issues discovered by cross-checking live hook behavior against cross-runtime parity expectations and the canonical packet claims.
- Dimensions addressed: security, reliability

## Reflection
- What worked: Comparing Claude and Gemini compact recovery side by side exposed a concrete prompt-safety parity gap quickly.
- What did not work: The temp-permissions hypothesis did not produce a live defect because the current hook-state implementation already enforces 0700/0600.
- Next adjustment: Shift to maintainability + completeness review of root/runtime docs and startup/recovery surfaces, especially where packet claims may still outrun current handler behavior.
