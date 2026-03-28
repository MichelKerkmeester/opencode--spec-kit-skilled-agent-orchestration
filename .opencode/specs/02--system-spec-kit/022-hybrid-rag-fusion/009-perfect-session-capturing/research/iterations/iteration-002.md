---
title: "Deep Research v2 — Iteration 002"
focus: "Q2 + Q8 + Q9 + Q14: Exchange pairing deep dive, saved-but-not-indexed, source-capabilities interaction, contamination migration"
agents: "A1(complete), A2(running), A3(complete), C1(complete), C2(complete), C3(complete)"
newInfoRatio: 0.71
timestamp: "2026-03-20T11:15:00Z"
---

# Iteration 002 — Deep Dives: Exchange Pairing + Source Capabilities

## Key Findings

### Q2: P1-03 and P1-04 Deep Dive (A1)

**P1-03 — First-child selection (CONFIRMED RUNTIME RISK):**
- Code location: `opencode-capture.ts:808-832`
- `matchingResponses = responses.filter(r => responseMsg?.parent_id === userMsg.id)` followed by `response = matchingResponses[0]`
- No preference for completed, latest, or best — pure FIFO

**4 realistic transcript shapes where P1-03 gives wrong results:**
1. **Regenerate/retry siblings:** `u1→a1("draft"), u1→a2("final")` — stale a1 wins identity
2. **Error-then-recovery:** `u1→a1("tool failed"), u1→a2("fixed answer")` — failure text privileged
3. **Agent handoff:** `u1→a1("handoff"), u1→a2("actual implementation")` — wrong agent text captured
4. **Partial aborted + completed:** `u1→a1(completed=null), u1→a2(completed=...)` — no prefer-completed rule

**P1-04 — Multi-part reassembly (CONFIRMED PARTIAL RUNTIME RISK):**
- Code: Parts flattened per-part at `opencode-capture.ts:643-655`, joined at `:818`
- Direct children of user ARE joined, but continuation chains (assistant→assistant) are MISSED
- Parent-only matching: `parent_id === userMsg.id` excludes grandchildren

**4 realistic transcript shapes where P1-04 causes incomplete memory:**
1. **Continuation chain:** `u1→a1("part 1"), a1→a2("part 2 final")` — a2 excluded (parent is a1, not u1)
2. **Sibling multi-part blending:** `u1→a1(parts=["1a","1b"]), u1→a2(parts=["2a","2b"])` — parts from both siblings concatenated with no boundary
3. **Unsorted cached parts:** Parts returned unsorted from cache at `:607`; reconstructed text order can be wrong
4. **Long multipart + TOOL_OUTPUT_MAX_LENGTH:** Joined text clipped at config limit (`:820`), truncating memory text

**Severity assessment:**
- High impact: bad pairing directly contaminates `assistantResponse`, which feeds observations/recent context and memory templates
- Frequency: Multi-part text is common in tool-heavy turns; retry siblings are moderate frequency
- **These bugs are specific to `opencode-capture.ts`** — the dedicated CLI adapters (claude/codex/copilot/gemini) use different pairing logic with lower risk

**Minimal fix approach:**
- P1-03: In `buildExchanges`, choose best candidate by deterministic rule (prefer `completed`, else latest `created`)
- P1-04: In `getSessionResponses`, aggregate text per assistant messageId before returning; then operate on aggregated messages, not raw parts

### Q14: Source-Capabilities Migration (A3)

**Contamination exception migration: COMPLETE.**
- No `=== 'claude-code-capture'` check exists in `contamination-filter.ts`
- Current logic is generic capability-based: `contamination-filter.ts:110` uses `sourceCapabilities.toolTitleWithPathExpected`
- Only `claude-code-capture` has `toolTitleWithPathExpected: true` (at `source-capabilities.ts:29`)

**Capability map per CLI:**
| CLI | inputMode | toolTitleWithPathExpected | prefersStructuredSave |
|-----|-----------|--------------------------|----------------------|
| opencode-capture | structured | false | true |
| claude-code-capture | stateless | true | true |
| codex-cli-capture | stateless | false | true |
| copilot-cli-capture | stateless | false | true |
| gemini-cli-capture | stateless | false | true |

**Where source-capabilities IS used (capability-driven):**
- contamination-filter.ts — severity downgrading
- workflow.ts — capture capabilities lookup, warning text
- validate-memory-quality.ts — rule applicability

**Where direct source-name checks STILL exist (expected/correct):**
- data-loader.ts — switch dispatch for native capture (routing, not policy)
- workflow.ts:1156 — file-source check (`_source === 'file'`)
- collect-session-data.ts:355,402 — file-source check
- task-enrichment.ts:27 — file-source check

**Verdict:** Contamination policy migration is complete. Remaining direct source-name checks are in the routing/dispatch layer, not policy layer — this is architecturally correct.

### Q9: Source-Capabilities Interaction (C1 + partial)
From tool traces, C1 confirmed the same capability lookup chain: `getSourceCapabilities()` is the single entry point, consumed by contamination filter, workflow, and validation.

### Q8: Saved-but-not-indexed (A2 still running, C2 partial)
From C2 tool traces, the documentation audit found:
- Phase 018 spec.md does document the write/index disposition model
- research/research.md mentions the soft-fail state
- Feature catalog has a session-capturing-pipeline-quality entry
- The main gap: no user-facing documentation explaining what to do when a save is "not indexed"

## Cross-Agent Agreements
- A1 and A3 independently confirmed: exchange pairing bugs are specific to opencode-capture.ts, not the dedicated CLI adapters
- A3 and C3 both confirmed: contamination-filter.ts has NO hardcoded CLI-name checks
- A3 and C3 both confirmed: `toolTitleWithPathExpected: true` only for claude-code-capture

## Cross-Agent Disagreements
None significant.

## Questions Status Update
- Q1: ~80% answered (iteration 001 classified 67 items; iteration 002 deepened P1-03/P1-04 understanding)
- Q2: ~90% answered (exact code locations, 4+ realistic failure scenarios per bug, severity + fix approach documented)
- Q7: ~75% answered (from iteration 001 + iteration 002 details on saved-but-not-indexed still pending A2)
- Q8: ~40% answered (A2 still running; C2 found documentation gaps)
- Q9: ~50% answered (capability interaction mapped)
- Q13: ~70% answered (from iteration 001)
- Q14: ~95% answered (migration complete for contamination; remaining direct checks are routing, not policy)

## New Findings
- `opencode-capture.ts` cached parts returned unsorted at `:607` — potential text order corruption
- TOOL_OUTPUT_MAX_LENGTH clips joined multi-part text, potentially losing critical content
- The 4 dedicated CLI adapters have LOWER risk for pairing bugs than the opencode adapter
