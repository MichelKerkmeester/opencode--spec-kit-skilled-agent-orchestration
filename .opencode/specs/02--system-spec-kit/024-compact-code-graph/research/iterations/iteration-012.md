# Iteration 012 — Current Compaction Handling and Gaps

**Focus:** Current compaction handling and gaps
**Status:** complete
**newInfoRatio:** 0.72
**Novelty:** This pass shifts from external code-graph research to our own runtime. It separates active compaction or resume behavior from archived hook concepts that are no longer wired into the current checkout.

---

## Findings

### 1. `CLAUDE.md` has only high-level recovery guidance, not a real post-compact playbook

The active root `CLAUDE.md` says two compaction-relevant things:

- Spec Kit Memory MCP is mandatory for research and context recovery. [SOURCE: `CLAUDE.md:35-36`]
- Resume previous work should use `/spec_kit:resume` or `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder })`. [SOURCE: `CLAUDE.md:51-51`]

That is useful, but it is still operator guidance, not lifecycle automation. There is no explicit root-level instruction like:

- "After compaction, re-read `CLAUDE.md`"
- "Run a PreCompact hook before context is collapsed"
- "Auto-inject prior state into the next session"

`.claude/CLAUDE.md` does not exist in this checkout, so there are no additional private Claude-specific compaction instructions to read. [CITATION: NONE]

Related docs do acknowledge compaction as a recovery scenario, but again as workflow guidance:

- `handover.md` says that on compaction detection ("Please continue the conversation..."), the operator should run `/spec_kit:handover`, then `/spec_kit:resume` in a new session. [SOURCE: `.opencode/command/spec_kit/handover.md:291-297`]
- The resume command assets classify "Context compaction detected" as a normal `/spec_kit:resume` use case. [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:173-179`]

### 2. There is some automation, but it is all inside the MCP server after a resume tool call starts

The active automation layers are:

**A. Resume-mode retrieval**

`memory_context` has a dedicated `resume` mode with strategy `resume` and a 1200-token budget. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:581-587`]

**B. "Compaction hook" helper logic**

`context-server.ts` treats `memory_context` with `args.mode === "resume"` as a "compaction lifecycle call" and routes it through `autoSurfaceAtCompaction(contextHint)` before normal dispatch. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:324-338`]

Tests confirm that runtime behavior: resume-mode `memory_context` invokes `autoSurfaceAtCompaction`, while non-resume `memory_context` uses the normal memory-aware path instead. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:965-997`]

**C. Auto-resume prompt context injection**

If the session is trusted as resumed and `SPECKIT_AUTO_RESUME` is enabled, `handleMemoryContext()` injects `systemPromptContext` and `systemPromptContextInjected = true` into the returned data. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228-1239`]

The feature flag is default-on unless `SPECKIT_AUTO_RESUME=false`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:39-45`]

**D. Startup instruction injection**

At MCP startup, the server can inject dynamic instructions via `setInstructions()`, but those instructions only summarize memory counts, channel availability, and stale-memory warnings. They are not session-specific recovery context. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:236-259`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1184-1189`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1200-1218`]

### 3. `memory_context({ mode: "resume" })` is basically a tuned `memory_search`, not a special recovery object by default

The `resume` strategy calls `handleMemorySearch()` with resume-specific tuning:

- `query: input || "resume work continue session"`
- `limit: 5`
- `includeConstitutional: false`
- `includeContent: true`
- `anchors: ["state", "next-steps", "summary", "blockers"]` by default
- `enableDedup: false`
- `useDecay: false`
- `minState: "WARM"` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:688-717`]

So the default result is still an MCP response envelope wrapped around search-style data, plus resume metadata:

- `summary` and `hints`
- `meta` including session lifecycle and token budget info
- `data.strategy = "resume"`
- `data.mode = "resume"`
- `data.resumeAnchors = [...]`
- `data.results` from the underlying search path [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1247-1279`]

Important nuance: `mode: "resume"` alone does **not** automatically return a compact resume brief like `{ state, nextSteps, blockers }`. That smaller shape only happens when the caller also asks for `profile: "resume"`, because the resume formatter lives in the separate profile system. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:341-360`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:397-414`]

The current `/spec_kit:resume` command assets do **not** pass `profile: "resume"`; they only pass `mode: "resume"` plus `includeContent: true`. [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:73-82`] [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:81-84`]

When the session is recognized as resumed, the handler may also append:

- `data.systemPromptContextInjected = true`
- `data.systemPromptContext = [...]`
- `meta.sessionLifecycle.resumedContextCount = N` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:570-590`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:669-727`]

### 4. `autoSurfaceAtCompaction()` is a lightweight helper, not a provider-fired lifecycle integration

`autoSurfaceAtCompaction()` itself is simple:

1. Return `null` if `enableCompactionHook === false`
2. Return `null` if the input is missing, non-string, or shorter than 3 characters
3. Trim whitespace
4. Delegate to `autoSurfaceMemories(sessionContext, 4000, "compaction")` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:283-316`]

`autoSurfaceMemories()` then:

- pulls constitutional memories from the DB cache
- runs fast trigger matching
- enriches constitutional memories with retrieval directives
- enforces a 4000-token budget
- returns `{ constitutional, triggered, surfaced_at, latencyMs }` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:188-223`]

Tests confirm the practical behavior:

- empty or tiny strings return `null`
- whitespace is trimmed
- the return shape contains `constitutional`, `triggered`, `surfaced_at`, and `latencyMs` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:379-425`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:431-466`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:473-530`]

The surfaced result is added to the response envelope as hints and `meta.autoSurface`, not directly inserted into the system prompt by this hook. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-111`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:63-97`]

### 5. There are no active standalone hook scripts in the repo

The active `hooks/` implementation is just TypeScript helper modules inside the MCP server:

- `memory-surface.ts`
- `mutation-feedback.ts`
- `response-hints.ts` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:27-33`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18`]

That README explicitly says this is "not a standalone MCP hook registration system." [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:27-34`]

There is also no active `.opencode/hooks/` directory and no `pre_compact.py` or similar hook script under `.opencode` in the current checkout. [CITATION: NONE]

The only concrete `PreCompact` hook evidence I found is archived historical documentation. It references:

- `.opencode/hooks/pre_compact.py`
- `.opencode/compaction_snapshots/`
- emergency-save verification commands [SOURCE: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/verification-guide.md:208-220`] [SOURCE: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/verification-guide.md:628-635`]

That archived design is not present in the active runtime tree.

### 6. Main gaps between "AI reads `CLAUDE.md` after compact" and "hook auto-injects context"

#### Gap A: No actual provider lifecycle hook

The biggest gap is naming versus reality. `autoSurfaceAtCompaction()` sounds like a hook that fires when the client compacts context, but in the current implementation it only runs when **our own MCP server later receives** `memory_context(..., mode: "resume")`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:326-338`]

That means:

- if the user or assistant never calls `/spec_kit:resume` or `memory_context(mode: "resume")`, nothing auto-surfaces
- there is no proof of Claude/Codex/OpenCode calling our code at the moment compaction happens
- `.claude/mcp.json` only wires MCP servers; it does not define a provider-side compaction hook pipeline [SOURCE: `.claude/mcp.json:1-47`]

#### Gap B: No private Claude recovery layer

Because `.claude/CLAUDE.md` is missing, there is no Claude-specific compact-recovery instruction set beyond the shared root docs. [CITATION: NONE]

#### Gap C: Envelope metadata is weaker than prompt injection

The compaction helper adds `hints` and `meta.autoSurface`, which is useful for observability, but that is not the same as guaranteed prompt-state restoration. The only prompt-like injection I found is the separate `systemPromptContext` path, and that depends on resumed-session identity plus `SPECKIT_AUTO_RESUME` being enabled. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:71-104`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228-1239`]

#### Gap D: Session-start automation is generic, not recovery-aware

Startup instruction injection exists, but it only announces memory stats, channels, and stale warnings. It does not recover the last task, open the last spec, or inject a compaction recovery brief at session start. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:236-259`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1200-1218`]

#### Gap E: Archived hook design never graduated to active runtime

The repo still contains evidence of an older PreCompact snapshot architecture, but it survives only in `z_archive` docs. The active tree has helper modules and tests, not hook scripts or snapshot plumbing. [SOURCE: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/verification-guide.md:208-220`]

## Bottom Line

Current state is:

- **Documented recovery exists** via `/spec_kit:resume` and `memory_context(mode: "resume")`
- **Runtime resume support exists** via resume-tuned retrieval, optional session prompt injection, and auto-surface metadata
- **True compaction-event automation does not exist** in the active repo

So today the system behaves much closer to:

> "After compaction, the AI or operator should remember to run the resume workflow"

than to:

> "A provider hook automatically injects the right recovery context at compaction time"

---

## Dead Ends

- `.claude/CLAUDE.md` was requested but is not present in this checkout, so there were no private Claude-level instructions to analyze. [CITATION: NONE]
- Live MCP lookup via the in-session memory and CocoIndex tools did not return usable results here, so this iteration is based on source and test inspection rather than live tool responses. [CITATION: NONE]

## Sources

- [SOURCE: `CLAUDE.md:35-36`]
- [SOURCE: `CLAUDE.md:51-51`]
- [SOURCE: `.opencode/command/spec_kit/handover.md:291-297`]
- [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:73-82`]
- [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:173-179`]
- [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:81-84`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:236-259`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:324-338`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:374-395`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1184-1189`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:581-587`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:688-717`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228-1239`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1247-1279`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:27-34`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:188-223`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:283-316`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-111`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:341-360`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:397-414`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:39-45`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:965-997`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1200-1218`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:379-425`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:431-466`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:473-530`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:570-590`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:669-727`]
- [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:63-97`]
- [SOURCE: `.claude/mcp.json:1-47`]
- [SOURCE: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/verification-guide.md:208-220`]
- [SOURCE: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/verification-guide.md:628-635`]
