# Changelog: 024/022-gemini-hook-porting

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 022-gemini-hook-porting -- 2026-03-31

Gemini CLI has supported hooks since v0.33.1, but we never configured any -- meaning Gemini users had no automatic context recovery when sessions started, no context preservation when conversations were compressed, and no token tracking. This phase ports the full Claude Code hook suite (session priming, compaction caching, context injection, session tracking) to Gemini's lifecycle format, raising Gemini's context parity from 50% to 85%. Rather than copying Claude hooks verbatim, each hook was adapted to Gemini's different lifecycle event names and I/O format, with shared utilities to keep both runtimes aligned.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/022-gemini-hook-porting/`

---

## New Features (4)

### Session Priming for Gemini

**Problem:** When a Gemini CLI user started a new session -- or resumed an earlier one, or cleared the conversation and started fresh -- the AI had no memory of prior work. It began every conversation completely cold: no awareness of what spec folder was active, what task was in progress, or what blockers existed. Claude Code users already had automatic session priming (a hook that injects context at the start of every session), but Gemini users got nothing.

**Fix:** Created a `SessionStart` hook (`session-prime.ts`, 165 lines) that runs automatically whenever a Gemini session begins. The hook detects the type of session start -- fresh startup, resuming prior work, or restarting after a clear -- and injects the appropriate context. It reuses the same context-gathering logic (`memory-surface.ts`) that powers Claude's session priming, so both runtimes surface the same information. Gemini users now get the same "pick up where you left off" experience that Claude Code users already had.

### Compaction Context Caching

**Problem:** When a conversation gets long, Gemini compresses (or "compacts") it to save space. This is necessary for performance, but the compression silently discards critical details: which spec folder is active, what task the user is working on, what blockers exist, and the status of the code graph. After compression, the AI continues the conversation but has lost important context -- a form of "context amnesia" that forces the user to re-explain what they were doing.

**Fix:** Created a `PreCompress` hook (`compact-cache.ts`, 137 lines) that acts as a safety net. Just before Gemini compresses the conversation, this hook snapshots all critical context -- the active spec folder, current task, known blockers, and code graph status -- and writes it to a temporary file on disk. The compression can then proceed without risk: even though the conversation itself loses detail, the important state is preserved externally.

### Post-Compaction Context Injection

**Problem:** The caching hook (above) saves context before compression, but that cached data has no way to get back into the conversation. After compression finishes, the AI starts its next response with no knowledge that a cache file exists. The safety net catches the falling context, but nobody picks it back up.

**Fix:** Created a one-shot `BeforeAgent` hook (`compact-inject.ts`, 82 lines) that fires once, right after compression, before the AI generates its next response. It reads the cached context from the temporary file written by `compact-cache.ts` and injects it back into the conversation as additional context. The hook uses a sanitized version of the payload (see the F055 bug fix below) to prevent malformed data from leaking in. Together, the cache and inject hooks give Gemini the same compaction recovery that Claude Code already provides.

### Session Stop Tracking

**Problem:** Token usage and session state were not being tracked for Gemini sessions. Without this data, there was no way to monitor how much capacity a session consumed, detect runaway token usage, or preserve session state for later analysis. Claude Code already tracked this through its `Stop` hook, but Gemini had no equivalent.

**Fix:** Created a `SessionEnd` hook (`session-stop.ts`, 113 lines) that records token usage and saves session state when a Gemini session ends. The hook was adapted from Claude's Stop hook but rewritten to handle Gemini's different transcript format (Gemini structures its conversation history differently than Claude, so the transcript-parsing logic could not be reused directly).

---

## Bug Fixes (1)

### Sanitized Payload Now Actually Used in Compact-Inject (F055)

**Problem:** The compact-inject hook (which injects cached context after conversation compression) had code that prepared a sanitized version of the payload -- cleaned up, validated, safe to inject. But a bug meant the hook was actually injecting the raw, unsanitized version instead. This meant malformed or unexpected data could leak into the AI's context after compression, potentially causing garbled recovery. The issue was identified as finding F055 (severity P2) during deep review iteration 046.

**Fix:** Updated `compact-inject.ts` to use the sanitized payload variable instead of the raw one. A small change with an outsized impact: it ensures that post-compression context injection is always clean and well-formed.

---

## Architecture (2)

### Hook Lifecycle Mapping Established

**Problem:** Claude Code and Gemini CLI use different names and structures for their hook lifecycle events. Without a clear mapping between the two, porting hooks would be guesswork -- each developer would need to figure out the correspondence independently, leading to inconsistent implementations and missed edge cases.

**Fix:** Documented and implemented a formal mapping between the two runtimes' lifecycle events. `SessionStart` maps directly (both use the same name). Claude's `PreCompact` becomes Gemini's `PreCompress` (Gemini uses the word "compress" rather than "compact"). Claude's `SessionStart(compact)` -- which fires when a session resumes after compaction -- becomes a one-shot `BeforeAgent` hook in Gemini (since Gemini does not have a post-compression session-start event). Claude's `Stop` becomes Gemini's `SessionEnd`. This mapping serves as the foundation for maintaining feature parity across runtimes going forward.

### Settings Registration

**Problem:** Even with hook scripts written, Gemini CLI will not run them unless they are registered in its settings file (`.gemini/settings.json`). Without registration, the hooks are inert code sitting on disk.

**Fix:** Added a hook registration block to `.gemini/settings.json` that maps each lifecycle event to the correct hook script. All four events (`SessionStart`, `PreCompress`, `BeforeAgent`, `SessionEnd`) are registered, so Gemini CLI automatically invokes the right hook at the right moment without any manual user configuration.

---

## Shared Utilities (1)

### Shared Gemini Hook Utilities

**Problem:** Each Gemini hook needs to read input from stdin (in Gemini's specific JSON format) and produce output in Gemini's expected format. If every hook file implemented this parsing and formatting independently, the code would drift over time -- small differences would accumulate between hooks, and the Gemini implementation would gradually diverge from Claude's. Bugs fixed in one hook's I/O handling might not be fixed in others.

**Fix:** Created a shared utility file (`shared.ts`, 89 lines) that centralizes all Gemini-specific I/O logic. It defines TypeScript types for Gemini's hook input and output structures (`GeminiHookInput`, `GeminiHookOutput`) and provides two helper functions: `parseGeminiStdin()` (which reads and parses Gemini's stdin format) and `formatGeminiOutput()` (which produces correctly structured output). All four Gemini hooks import from this single file, ensuring consistent behavior and making future format changes a one-file fix.

---

## Known Limitations

- **F056 (deferred):** `session-stop.ts` reads the full conversation transcript without imposing a size limit. In practice this is low-risk because transcripts rarely grow large enough to cause problems, but a size cap should be added in a future phase to guard against edge cases.

---

<details>
<summary>Files Changed (6)</summary>

| File | Change Type | What Changed |
|------|------------|--------------|
| `hooks/gemini/shared.ts` | New (89 lines) | GeminiHookInput and GeminiHookOutput type definitions, `parseGeminiStdin()` and `formatGeminiOutput()` helper functions for standardized Gemini hook I/O |
| `hooks/gemini/session-prime.ts` | New (165 lines) | SessionStart hook that detects session source (startup, resume, clear) and injects appropriate context as JSON `additionalContext` |
| `hooks/gemini/compact-cache.ts` | New (137 lines) | PreCompress hook that snapshots active spec folder, current task, blockers, and code graph status to a temp file before compression |
| `hooks/gemini/compact-inject.ts` | New (82 lines) | One-shot BeforeAgent hook that reads cached context from temp file and injects sanitized payload after compression |
| `hooks/gemini/session-stop.ts` | New (113 lines) | SessionEnd hook that records token usage and saves session state using Gemini-native transcript parsing |
| `.gemini/settings.json` | Modified | Added hook registration block mapping all four lifecycle events to their hook scripts |

</details>

## Upgrade

No migration required. Gemini CLI users automatically benefit from the new hooks after updating. No changes needed for Claude Code, Codex, or Copilot users.
