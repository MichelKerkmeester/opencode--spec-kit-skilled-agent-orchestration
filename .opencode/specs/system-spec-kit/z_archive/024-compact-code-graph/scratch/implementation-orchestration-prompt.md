# Implementation Orchestration Prompt — Spec 024: Hybrid Context Injection

> **Target:** Claude Opus agent running `/spec_kit:implement` across all 7 phases
> **Delegation:** Up to 10 GPT-5.4 agents via `codex exec` (all `high` reasoning)
> **Constraint:** No concurrent file conflicts — strict file ownership per agent
> **Branch:** `system-speckit/024-compact-code-graph` (already created — checkout before starting)

---

## IDENTITY

You are the lead implementation orchestrator for spec 024 (Hybrid Context Injection — Hook + Tool Architecture). You implement all 7 phases by running `/spec_kit:implement` on each phase folder, delegating parallelizable work to GPT-5.4 agents via `codex exec`.

---

## SPEC FOLDER

```
specs/system-spec-kit/024-compact-code-graph/
  001-precompact-hook/       ← Phase 1 (P0)
  002-session-start-hook/    ← Phase 2 (P1)
  003-stop-hook-tracking/    ← Phase 3 (P2)
  004-cross-runtime-fallback/← Phase 4 (P1)
  005-command-agent-alignment/← Phase 5 (P1)
  006-documentation-alignment/← Phase 6 (P1)
  007-testing-validation/    ← Phase 7 (P1)
```

Each phase has `spec.md`, `plan.md`, `checklist.md` with full implementation details.

---

## CRITICAL RULES

### Rule 1: File Ownership — NO CONCURRENT WRITES
Each file has exactly ONE owner at any time. Before dispatching agents:
1. List every file each agent will read or write
2. Check the ownership table below
3. If any WRITE target overlaps → run agents sequentially, not in parallel
4. READ-only overlap is fine — multiple agents can read the same file

### Rule 2: Codex Agent Configuration
```bash
codex exec -m gpt-5.4 -c reasoning_effort="high" -s workspace-write < /tmp/prompt-NNN.md
```
- **Always `high` reasoning** — never `xhigh`
- **Always `workspace-write` sandbox** — agents need to create/edit files
- **Always pipe prompt from file** — write detailed prompt to `/tmp/prompt-NNN.md` first
- **Max 10 agents total across entire implementation** (5 active at any time)

### Rule 3: Phase Dependencies
```
Phase 1 ──→ Phase 2 (shares session-prime.ts)
Phase 1 ──→ Phase 3 (shared utilities pattern)
Phase 1 ──→ Phase 7 (needs implementation to test)
Phase 4 ──┐
Phase 5 ──┤→ Phase 7 (all implementations must complete before testing)
Phase 6 ──┘
```

### Rule 4: Verification Between Waves
After each wave completes:
1. Run `npx tsc --noEmit` to verify TypeScript compiles
2. Run `npx vitest run --reporter=verbose` on affected test files
3. Check `git diff --stat` to verify only expected files changed
4. If errors → fix before starting next wave

---

## EXECUTION PLAN — 4 WAVES

### Wave 1: Core Hook Scripts (Phases 1+2)
**Run sequentially** — Phase 1 and 2 share `session-prime.ts`

```
/spec_kit:implement specs/system-spec-kit/024-compact-code-graph/001-precompact-hook
/spec_kit:implement specs/system-spec-kit/024-compact-code-graph/002-session-start-hook
```

**Codex agents (up to 2):**

| Agent | Focus | WRITES to | READS from |
|-------|-------|-----------|------------|
| Agent A | `shared.ts` + `hook-state.ts` | `scripts/hooks/claude/shared.ts`, `scripts/hooks/claude/hook-state.ts` | `hooks/memory-surface.ts`, `context-server.ts` |
| Agent B | `compact-inject.ts` | `scripts/hooks/claude/compact-inject.ts` | `hooks/memory-surface.ts`, Agent A's files (wait for A) |

**You (orchestrator):** Build `session-prime.ts` yourself (shared between Phase 1 and 2, most complex). Register hooks in `.claude/settings.local.json`.

**File ownership during Wave 1:**
```
LOCKED (orchestrator): session-prime.ts, settings.local.json
LOCKED (Agent A):      shared.ts, hook-state.ts
LOCKED (Agent B):      compact-inject.ts (after Agent A completes)
READ-ONLY:             hooks/memory-surface.ts, context-server.ts, tool-schemas.ts
```

---

### Wave 2: Stop Hook + Cross-Runtime + Commands (Phases 3, 4, 5 — parallel)
**Run in parallel** — these touch completely different file sets

```
Phase 3: Stop hook scripts + token tracking
Phase 4: CLAUDE.md, CODEX.md instruction updates
Phase 5: Command and agent definition updates
```

**Codex agents (up to 5 in parallel):**

| Agent | Phase | WRITES to | READS from |
|-------|-------|-----------|------------|
| Agent C | 3 | `scripts/hooks/claude/session-stop.ts` | Wave 1 files (read-only) |
| Agent D | 3 | `scripts/hooks/claude/claude-transcript.ts` | None (new file) |
| Agent E | 3 | DB migration: `session_token_snapshots` table | `mcp_server/core/` (read) |
| Agent F | 4 | `CLAUDE.md` compaction section only | Current CLAUDE.md (read) |
| Agent G | 5 | `.opencode/command/spec_kit/` assets | Phase spec files (read) |

**You (orchestrator):** Phase 5 agent definitions (`.claude/agents/`, `.opencode/agent/`) — only you touch agent files.

**File ownership during Wave 2:**
```
LOCKED (Agent C): session-stop.ts
LOCKED (Agent D): claude-transcript.ts
LOCKED (Agent E): DB schema / migration files
LOCKED (Agent F): CLAUDE.md (ONLY §Context Compaction section)
LOCKED (Agent G): .opencode/command/spec_kit/ assets
LOCKED (orchestrator): agent definitions
READ-ONLY: All Wave 1 output files, hooks/, context-server.ts
NO-TOUCH: .claude/settings.local.json (already done in Wave 1)
```

**CONFLICT PREVENTION:**
- Agent F edits ONLY the `## Context Compaction Behavior` section of CLAUDE.md — nothing else
- Agent G edits ONLY command YAML assets — not SKILL.md or README
- Agent E touches ONLY database schema — not context-server.ts core logic
- No agent touches `hooks/memory-surface.ts` (read-only reference)

---

### Wave 3: Documentation (Phase 6)
**Run after Waves 1-2 complete** — docs must reflect implemented code

```
/spec_kit:implement specs/system-spec-kit/024-compact-code-graph/006-documentation-alignment
```

**Codex agents (up to 3 in parallel):**

| Agent | Focus | WRITES to | READS from |
|-------|-------|-----------|------------|
| Agent H | Feature catalog entries (5 new) | `feature_catalog/` new files only | Implemented code from Waves 1-2 |
| Agent I | Manual testing playbook scenarios | `manual_testing_playbook/` new files only | Feature catalog (after H), phase specs |
| Agent J | SKILL.md + ARCHITECTURE.md + READMEs | `SKILL.md`, `ARCHITECTURE.md`, `README.md` files | All implemented code, feature catalog |

**File ownership during Wave 3:**
```
LOCKED (Agent H): feature_catalog/ (NEW files only, never edit existing)
LOCKED (Agent I): manual_testing_playbook/ (NEW files only)
LOCKED (Agent J): SKILL.md, ARCHITECTURE.md, .opencode/skill/README.md, root README.md, AGENTS.md
NO-TOUCH: Any code files (implementation is done)
```

**CONFLICT PREVENTION:**
- Agent H creates NEW feature catalog files — never edits existing entries
- Agent I creates NEW playbook files — never edits existing scenarios
- Agent J is the ONLY agent touching SKILL.md, ARCHITECTURE.md, README files
- Sequential dependency: Agent I should start AFTER Agent H (playbooks reference feature catalog)

---

### Wave 4: Testing (Phase 7)
**Run last** — requires all implementations and docs complete

```
/spec_kit:implement specs/system-spec-kit/024-compact-code-graph/007-testing-validation
```

**Codex agents (up to 5 in parallel):**

| Agent | Focus | WRITES to |
|-------|-------|-----------|
| Agent K | `runtime-routing.vitest.ts` + `cross-runtime-fallback.vitest.ts` | 2 new test files |
| Agent L | `hook-session-start.vitest.ts` + `hook-precompact.vitest.ts` | 2 new test files |
| Agent M | `hook-stop-token-tracking.vitest.ts` + `token-snapshot-store.vitest.ts` | 2 new test files |
| Agent N | `session-token-resume.vitest.ts` | 1 new test file |
| Agent O | Extend `dual-scope-hooks.vitest.ts` + `crash-recovery.vitest.ts` | 2 existing files |

**File ownership during Wave 4:**
```
Each agent owns ONLY its assigned test files — no overlap
Agent O is the ONLY agent editing existing test files
NO-TOUCH: Any implementation code (read-only reference)
```

---

## CODEX AGENT PROMPT TEMPLATE

For each agent, write a prompt file at `/tmp/prompt-024-{wave}-{agent}.md`:

```markdown
# Implementation Task: [TITLE]

## Context
You are implementing Phase [N] of spec 024 (Hybrid Context Injection).
Read the phase spec first: `specs/system-spec-kit/024-compact-code-graph/[NNN]-[phase]/spec.md`

## Your Scope
You ONLY create/edit these files:
- [FILE 1] — [purpose]
- [FILE 2] — [purpose]

## DO NOT TOUCH
- [list of files other agents own]
- Any files not listed in "Your Scope"

## Reference Files (READ-ONLY)
- [list of files to read for context]

## Implementation Details
[Paste relevant section from phase spec.md and plan.md]

## Output
When done, verify your files:
1. Run: `npx tsc --noEmit` (if TypeScript)
2. Confirm file exists and has correct content
3. Exit cleanly
```

---

## VERIFICATION CHECKLIST

After ALL waves complete:

```bash
# 1. TypeScript compilation
npx tsc --noEmit

# 2. Run all new tests
npx vitest run tests/runtime-routing.vitest.ts tests/hook-*.vitest.ts tests/cross-runtime-fallback.vitest.ts tests/token-snapshot-store.vitest.ts tests/session-token-resume.vitest.ts

# 3. Run existing affected tests
npx vitest run tests/dual-scope-hooks.vitest.ts tests/crash-recovery.vitest.ts

# 4. Verify file count
find .opencode/skill/system-spec-kit/scripts/hooks/claude/ -type f | wc -l  # expect 6 .ts files

# 5. Verify hook registration
cat .claude/settings.local.json | jq '.hooks'

# 6. Verify no unintended changes
git diff --stat  # review every changed file
```

---

## AGENT BUDGET

| Wave | Agents | Duration | Parallelism |
|------|--------|----------|-------------|
| 1 | 2 codex + you | ~30 min | Sequential (shared files) |
| 2 | 5 codex + you | ~30 min | Full parallel (no overlap) |
| 3 | 3 codex | ~20 min | 2 parallel + 1 sequential |
| 4 | 5 codex | ~30 min | Full parallel (no overlap) |
| **Total** | **15 codex dispatches** | **~2 hours** | Max 5 concurrent |

---

## GIT WORKFLOW

**Branch:** `system-speckit/024-compact-code-graph`

Commit after each wave:
```bash
# After Wave 1
git add .opencode/skill/system-spec-kit/scripts/hooks/claude/ .claude/settings.local.json
git commit -m "feat(hooks): Phase 1+2 — PreCompact precompute + SessionStart injection"

# After Wave 2
git add .opencode/skill/system-spec-kit/scripts/hooks/claude/session-stop.ts .opencode/skill/system-spec-kit/scripts/hooks/claude/claude-transcript.ts CLAUDE.md .opencode/command/
git commit -m "feat(hooks): Phase 3+4+5 — Stop hook, cross-runtime fallback, command alignment"

# After Wave 3
git add .opencode/skill/system-spec-kit/feature_catalog/ .opencode/skill/system-spec-kit/manual_testing_playbook/ .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/ARCHITECTURE.md .opencode/skill/README.md README.md AGENTS.md
git commit -m "docs(hooks): Phase 6 — documentation alignment for hook system"

# After Wave 4
git add .opencode/skill/system-spec-kit/mcp_server/tests/
git commit -m "test(hooks): Phase 7 — automated tests for hook system"

# Push all
git push -u origin system-speckit/024-compact-code-graph
```

## ROLLBACK PLAN

If any wave fails:
1. `git stash` all changes
2. Read error messages
3. Fix the root cause
4. `git stash pop` and retry the failed agent only
5. Never retry the entire wave — only the failed agent's scope

---

## KEY TECHNICAL DETAILS (from research)

1. **PreCompact stdout NOT injected** — precompute to cache file, inject via SessionStart(source=compact)
2. **`profile: "resume"` required** — without it, `memory_context(resume)` returns search results not a brief
3. **Hook-state bridges session IDs** — Claude `session_id` → Spec Kit `effectiveSessionId` via temp file
4. **Token tracking is append-only** — `session_token_snapshots` table, not mutable rows
5. **`async: true` for Stop hook** — runs in background, doesn't block session exit
6. **Copilot/Gemini have hooks** — v1 policy suppresses them, but code should use `hookPolicy` not hardcoded exclusion
7. **Existing `autoSurfaceAtCompaction()` has 4000 token budget** — reuse, don't rebuild
8. **Direct import from compiled dist** — hook scripts import functions directly for speed (<2s)
