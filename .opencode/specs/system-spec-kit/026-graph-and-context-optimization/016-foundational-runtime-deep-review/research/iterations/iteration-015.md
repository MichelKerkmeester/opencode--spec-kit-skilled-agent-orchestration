# Iteration 15 — Domain 1: Silent Fail-Open Patterns (5/10)

## Investigation Thread
I re-read the five requested runtime seams against Iterations 001-014 and the Phase 015 review so this pass only kept residual fail-open behavior that had not already been written down. The remaining unique gap was not another status boolean in `graph-metadata-parser.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, or `post-insert.ts`; it was the stop-hook packet-targeting lane in `session-stop.ts`, where packet selection can silently drift or fail while the hook still looks like a normal completed autosave cycle.

## Findings

### Finding R15-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `61-77, 281-309`
- **Severity:** P1
- **Description:** Transcript-driven retargeting silently rewrites the autosave destination and immediately saves into the replacement packet. Trigger: the persisted `lastSpecFolder` exists, but `detectSpecFolder(...)` finds a different unambiguous packet in the current transcript tail. Caller perception: the stop hook simply validated continuity state and completed normally. Reality: the hook overwrites `lastSpecFolder` with an info log only, then `runContextAutosave()` reloads that new value and writes the summary into the retargeted packet during the same stop event.
- **Evidence:** The retarget branch calls `recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths)` and only logs `Retargeted autosave spec folder...` (`session-stop.ts:287-293`). `runContextAutosave()` then reloads state and builds its payload from `state?.lastSpecFolder?.trim()` plus the latest summary (`session-stop.ts:61-77`), and `processStopHook()` invokes it immediately afterward when autosave is enabled (`session-stop.ts:308-309`). Direct coverage only blesses the retarget-detection primitive in isolation (`mcp_server/tests/hook-session-stop.vitest.ts:70-88`), while the replay harness disables autosave entirely (`mcp_server/tests/hook-session-stop-replay.vitest.ts:14-56`).
- **Downstream Impact:** A transcript that briefly mentions another packet near the tail can cause continuity to be saved into the wrong spec folder without a caller-visible failure. Resume, handover, and memory-search flows then consume a plausible-looking save artifact that belongs to the wrong packet.

### Finding R15-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `294-295, 340-369`
- **Severity:** P2
- **Description:** Spec-folder detection only inspects the last 50 KB of the transcript, so long sessions can silently hide the real active packet and degrade into stale-target preservation. Trigger: the current packet reference appears earlier than the tail window, or the tail contains a different/ambiguous packet mix. Caller perception: the transcript was genuinely ambiguous, so preserving the prior autosave target is the safe choice. Reality: the detector never considered most of the transcript and may therefore preserve an obsolete packet target or miss the only correct packet reference.
- **Evidence:** `detectSpecFolder()` computes `bytesToRead = Math.min(size, SPEC_FOLDER_TAIL_BYTES)` and reads only the final slice of the transcript (`session-stop.ts:350-355`), then chooses a packet from matches in that truncated sample alone (`session-stop.ts:355-369`). If that tail slice yields no single winner, `processStopHook()` logs `Spec folder detection was ambiguous; preserving existing autosave target.` (`session-stop.ts:294-295`). The direct tests use only tiny synthetic transcripts and never exercise large transcripts whose relevant packet references fall outside the sampled tail (`mcp_server/tests/hook-session-stop.vitest.ts:17-88`).
- **Downstream Impact:** Long-running sessions can keep autosaving into an older packet even after the operator has moved to a different packet earlier in the conversation. The warning shape suggests benign ambiguity, not that the detector intentionally ignored most of the transcript.

### Finding R15-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `294-295, 370-378`
- **Severity:** P1
- **Description:** Transcript I/O failure is silently collapsed into the same "ambiguous transcript" path as ordinary packet ambiguity. Trigger: the transcript file is unreadable, missing, or rotated between hook input capture and `detectSpecFolder()` execution. Caller perception: packet detection ran and found no unambiguous winner, so preserving the existing autosave target is an informed fallback. Reality: detection never succeeded at all; the catch block discards the I/O failure and returns `null`, which the caller treats as mere ambiguity.
- **Evidence:** `detectSpecFolder()` swallows every exception from `openSync`, `fstatSync`, or `readSync` and falls through to `return null` (`session-stop.ts:370-378`). `processStopHook()` handles that `null` exactly like an ambiguous transcript and logs only `Spec folder detection was ambiguous; preserving existing autosave target.` (`session-stop.ts:294-295`). The test suite exercises only readable temp transcripts and does not cover unreadable or disappearing transcript files (`mcp_server/tests/hook-session-stop.vitest.ts:17-88`; `mcp_server/tests/hook-session-stop-replay.vitest.ts:14-56`).
- **Downstream Impact:** When transcript access fails, autosave can still proceed against a stale `lastSpecFolder` and make the stop event look healthy apart from a generic ambiguity warning. That risks saving the final summary into the wrong packet precisely when transcript evidence was unavailable.

## Novel Insights
- The remaining uncataloged fail-open behavior in this domain is concentrated in **packet-target authority**, not in additional enrichment booleans or reconsolidation filters. The stop hook's packet-detection path can be wrong, partial, or unreadable while the overall stop event still looks like a normal continuity cycle.
- Re-checking the requested non-hook seams did not produce new non-duplicate findings this pass: `graph-metadata-parser.ts:223-255` still only reconfirmed Iteration 11's legacy-fallback truth loss, `code-graph/query.ts` reconfirmed Iterations 3/11/12/13/14, `reconsolidation-bridge.ts:283-294` reconfirmed Iterations 11-13, and `post-insert.ts` reconfirmed Iterations 8 and 11-14.
- I explicitly excluded the already-known autosave-interrupt success bug from Phase 015 review iteration 010 so this iteration stayed additive rather than rewording an existing finding.

## Next Investigation Angle
Trace the consumer side of these packet-target degradations: `generate-context.js` argument authority, startup/resume readers that trust the last saved packet, and any telemetry surface that could distinguish "target was retargeted," "target was preserved because only the tail was sampled," and "target was preserved because transcript I/O failed."
