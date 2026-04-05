# Iteration 030: CLAUDE.md & CODEX.md Recovery Analysis

## Focus

Audit the current recovery guidance in root `CLAUDE.md`, repo-local `.claude/CLAUDE.md`, root `CODEX.md`, and user-global `~/.claude/CLAUDE.md`; compare that against iteration 012 gap findings and the phase-4 packet guidance for cross-runtime fallback. [SOURCE: `CLAUDE.md:44-51`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:12-30`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:42-69`]

## Findings

1. Root `CLAUDE.md` does not contain a dedicated compaction-recovery section. The only active recovery guidance is the high-level quick-reference material that says research should use memory tools and prior work should be resumed with `/spec_kit:resume` or `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder })`. That matches iteration 012's conclusion that root `CLAUDE.md` has "only high-level recovery guidance, not a real post-compact playbook." [SOURCE: `CLAUDE.md:35-36`] [SOURCE: `CLAUDE.md:44-52`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:12-25`]

2. The exact root `CLAUDE.md` section relevant to recovery is:

   > `| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings |`
   >
   > `| **Resume prior work**     | `/spec_kit:resume` OR `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder })` → Review checklist → Continue |`

   There is no root-level instruction that says "after compaction, immediately call resume-mode memory_context", no requirement to re-read `CLAUDE.md`, and no mention of `profile: "resume"`. [SOURCE: `CLAUDE.md:49-51`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:19-23`]

3. Repo-local `.claude/CLAUDE.md` does not exist, even though the `.claude/` directory exists. Per the phase-4 packet, that missing file is still Gap B and should contain a private Claude-specific recovery layer with: explicit compaction recovery steps, a reference to hook-based injection when hooks are active, and an instruction to check `autoSurface` hints in MCP responses. The existing user-global `~/.claude/CLAUDE.md` is a strong baseline because it already provides a Claude-oriented stop/re-read/summarize/wait workflow after compaction. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:12-16`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:58-63`] [SOURCE: `/Users/michelkerkmeester/.claude/CLAUDE.md:1-22`]

4. Root `CODEX.md` does not exist, so there are currently no Codex-specific recovery instructions in-repo. The packet explicitly says `CODEX.md` should be updated with compaction recovery and that runtime docs should reference the same two primitives: `memory_match_triggers` and `memory_context(resume)`. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:65-69`]

5. The explicit recovery-related tool or command calls currently referenced across the inspected sources are:

   - `memory_match_triggers()` in root `CLAUDE.md` research flow. [SOURCE: `CLAUDE.md:49-49`]
   - `/spec_kit:resume` in root `CLAUDE.md` resume flow. [SOURCE: `CLAUDE.md:51-51`]
   - `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder })` in root `CLAUDE.md`. [SOURCE: `CLAUDE.md:51-51`]
   - `memory_context({ mode: "resume", profile: "resume", input: "context compaction recovery" })` in the phase-4 proposed `CLAUDE.md` enhancement. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:47-56`]
   - `/clear` and `/compact focus on [current task]` in the user-global Claude compaction instructions. [SOURCE: `/Users/michelkerkmeester/.claude/CLAUDE.md:21-22`]

6. `memory_context({ mode: "resume", profile: "resume" })` is referenced in the spec packet, but not in the live instruction files that were inspected. It appears in the decision record as a required contract for all resume paths, in the phase-4 fallback spec as the exact post-compaction call to add to `CLAUDE.md`, and in broader packet planning/checklist material. It does not appear in root `CLAUDE.md`, cannot appear in missing `.claude/CLAUDE.md` or `CODEX.md`, and does not appear in the user-global `~/.claude/CLAUDE.md`. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:69-74`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:47-56`] [SOURCE: `CLAUDE.md:44-52`] [SOURCE: `/Users/michelkerkmeester/.claude/CLAUDE.md:1-22`]

7. Iteration 012's gaps A through E are still the right frame for this analysis:

   - Gap A: No provider lifecycle hook. `autoSurfaceAtCompaction()` only runs when our MCP later receives `memory_context(..., mode: "resume")`; nothing fires automatically unless the AI or operator calls the resume workflow. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:135-143`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:12-12`]
   - Gap B: No private Claude recovery layer. Repo-local `.claude/CLAUDE.md` is still missing. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:145-147`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:13-13`]
   - Gap C: Envelope metadata is weaker than prompt injection. Iteration 012 found that `mode: "resume"` alone returns search-style output, so the brief format requires `profile: "resume"`. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:78-80`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:14-14`]
   - Gap D: Session-start automation is generic. Startup instructions announce stats but do not inject a recovery brief on their own. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:153-155`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:15-15`]
   - Gap E: Archived hook design never graduated. The old `pre_compact.py` design survives only in archive material. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:157-159`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:16-16`]

8. `CLAUDE.md` should be updated exactly in the direction already defined by phase 4 and DR-007: add a dedicated `## Context Compaction Behavior` section that makes the first post-compaction action an explicit profiled call, not a generic reminder. The packet's recommended block is:

   1. `IMMEDIATELY call memory_context({ mode: "resume", profile: "resume", input: "context compaction recovery" })`
   2. Read the response for `state`, `next steps`, and `blockers`
   3. Re-read `CLAUDE.md`
   4. Summarize and wait for user confirmation

   That is the concrete fix for the current root-level gap where `CLAUDE.md` mentions resume mode but not the required profile. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:42-56`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:69-74`]

9. The clean split between root `CLAUDE.md` and repo-local `.claude/CLAUDE.md` should be:

   - Root `CLAUDE.md`: cross-runtime, portable recovery contract shared across assistants and sessions; it should name the canonical primitives and the exact profiled `memory_context` call. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:42-56`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:67-69`]
   - `.claude/CLAUDE.md`: Claude-only operational details, including how hook-based injection interacts with compaction, when to trust SessionStart(source=compact), when to inspect `meta.autoSurface` hints, and the global Claude-style "stop, re-read, summarize, wait" discipline. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:58-63`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:58-67`] [SOURCE: `/Users/michelkerkmeester/.claude/CLAUDE.md:3-22`]

## Evidence

- Root `CLAUDE.md` current recovery language:

  > `| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings |`
  >
  > `| **Resume prior work**     | `/spec_kit:resume` OR `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder })` → Review checklist → Continue |`

  [SOURCE: `CLAUDE.md:49-51`]

- User-global Claude compaction behavior already exists and is more explicit than root `CLAUDE.md`:

  > `CRITICAL: After any context compaction event:`
  >
  > `1. STOP — do not take any action, do not use any tools`
  >
  > `2. Re-read this CLAUDE.md file completely`
  >
  > `3. Summarize your understanding of:`
  >
  > `4. Present this summary to the user and WAIT for confirmation before proceeding`

  [SOURCE: `/Users/michelkerkmeester/.claude/CLAUDE.md:3-13`]

- Phase-4 target state for root `CLAUDE.md`:

  > `## Context Compaction Behavior`
  >
  > `After any context compaction event:`
  >
  > `1. IMMEDIATELY call memory_context({ mode: "resume", profile: "resume", input: "context compaction recovery" })`
  >
  > `2. Read the response — it contains state, next steps, and blockers`
  >
  > `3. Re-read this CLAUDE.md file`
  >
  > `4. Summarize and WAIT for user confirmation`

  [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:47-56`]

- DR-007 makes the profile requirement explicit:

  > `All resume paths must pass profile: "resume" alongside mode: "resume"`

  [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:69-74`]

## New Information Ratio (0.0-1.0)

0.41

## Novelty Justification

Most of the packet already knew that `profile: "resume"` was missing, but this iteration adds current-state instruction-file evidence: root `CLAUDE.md` still only exposes a generic resume row, repo-local `.claude/CLAUDE.md` and root `CODEX.md` are still absent, and the user-global `~/.claude/CLAUDE.md` already contains a reusable Claude-specific stop/re-read/summarize compaction workflow. That contrast makes the implementation target much sharper: the missing work is now clearly "promote the profiled call into shared docs, then layer Claude-only hook nuance on top."

## Recommendations for Implementation

1. Update root `CLAUDE.md` with a dedicated `## Context Compaction Behavior` section that uses the exact profiled call from phase 4: `memory_context({ mode: "resume", profile: "resume", input: "context compaction recovery" })`. Do not leave recovery buried only in the quick-reference table. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:42-56`]

2. Create repo-local `.claude/CLAUDE.md` by starting from the existing user-global compaction discipline, then add Claude-specific notes about SessionStart(source=`compact`), hook-based injection boundaries, and checking `meta.autoSurface`/hint metadata. [SOURCE: `/Users/michelkerkmeester/.claude/CLAUDE.md:3-22`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:58-63`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:58-67`]

3. Add `CODEX.md` with the same cross-runtime fallback primitives as root `CLAUDE.md`: `memory_match_triggers` plus the profiled resume-mode `memory_context` call. Codex-specific content should stay tool-based because the phase-4 packet treats non-Claude runtimes as fallback consumers rather than hook-driven runtimes. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/spec.md:65-69`]

4. Treat iteration 012 Gap C as non-optional: every compaction recovery path, command, and runtime instruction should explicitly include `profile: "resume"`, otherwise recovery stays in the verbose search-envelope shape instead of the compact brief the packet expects. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:78-80`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:69-74`]
