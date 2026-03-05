# CHK-029 Manual Test Protocol

## Goal
Complete human verification for CHK-029 manual acceptance:
- multi-turn session continuity
- pause/resume behavior
- extraction verification in realistic CLI/browser flow

## Preconditions
- Use a clean local session with `mcp_server` runnable.
- Keep feature flags at current intended defaults for evaluation lane.
- Have access to both CLI workflow and browser-visible outputs/logs.

## Test Matrix

### 1) Multi-turn Session Continuity (CLI)
1. Start a new session and issue 8-10 semantically related prompts.
2. Include at least 3 prompts that should surface prior context.
3. Verify responses preserve relevant session context without manual `/memory:save` intervention.
4. Record observed continuity quality and any context drops.

Pass criteria:
- Context remains coherent across turns.
- No unexpected context resets.

### 2) Pause/Resume Session Behavior (CLI + time gap)
1. In the same session, stop interaction for at least 5 minutes.
2. Resume with `resume`-style prompt referencing prior task state.
3. Confirm resumed context includes prior key items.
4. Verify no collapse caused purely by wall-clock pause.

Pass criteria:
- Session resumes with expected relevant memory.
- Behavior is consistent with event-based decay model.

### 3) Extraction Verification (CLI + logs)
1. Run prompts/tools that emit extractable content (for example file-read style content and command output).
2. Confirm extraction applies where expected and sensitive patterns are redacted.
3. Confirm non-sensitive passthrough content is not over-redacted.
4. Capture any false positives/false negatives.

Pass criteria:
- Expected items are extracted with provenance metadata.
- Redaction gate protects sensitive tokens/PII.
- No critical extraction misses for high-signal items.

## Evidence Capture Checklist
- Session ID(s) used
- Timestamped command history
- Relevant console/log snippets
- Screenshot(s) for browser-facing checks (if used)
- Final pass/fail decision per matrix section

## Result Template
- Multi-turn continuity: PASS/FAIL (+ notes)
- Pause/resume: PASS/FAIL (+ notes)
- Extraction verification: PASS/FAIL (+ notes)
- Overall CHK-029: PASS/FAIL
