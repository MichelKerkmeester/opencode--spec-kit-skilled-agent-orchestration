## Packet 034: half-auto-upgrades — Tier C 4 sub-tasks

You are cli-codex (gpt-5.5 high fast) implementing remediation packet **021-half-auto-upgrades**.

### Goal

Take 4 "half-automated" surfaces from 013's reality map and upgrade each to either fully-automated OR mechanically-honest documented contract. All 4 sub-tasks are scope-locked; do NOT expand:

#### Sub-task 1: Copilot freshness wording (doc + minimal code)

013 finding F1.CopilotFreshness: Copilot advisor refreshes for the **next** prompt, not the current one (`hooks/copilot/user-prompt-submit.ts:1-7` ignores hook output; `hooks/copilot/custom-instructions.ts:101-190` writes for next turn). Currently many docs say "Copilot advisor auto-injects context" — false. Make it mechanically visible.

Implementation:
- Update CLAUDE.md, AGENTS.md, .opencode/skill/system-spec-kit/SKILL.md, references/hooks/skill-advisor-hook.md, references/config/hook_system.md to say "Copilot advisor: NEXT-PROMPT freshness; current prompt sees PRIOR turn's brief".
- Add a `nextPromptFreshness: true` field to the Copilot custom-instructions block header so operators can see at a glance which version of the brief they're getting.
- Update `hooks/copilot/README.md:14-36` to make next-prompt the leading sentence.

#### Sub-task 2: Codex cold-start fallback hardening (small code addition + doc)

013 finding F1.CodexFreshness: `hooks/codex/user-prompt-submit.ts:174-180` falls back to stale cold-start context on timeout silently. Currently no signal to operator that they got stale context.

Implementation:
- Edit `hooks/codex/user-prompt-submit.ts` to:
  - When timeout fallback fires, include a `stale: true, reason: "timeout-fallback"` marker in the returned context
  - Log a warning (one line, structured) when fallback fires
- Add a smoke check helper `hooks/codex/lib/freshness-smoke-check.ts` that returns `{fresh: bool, lastUpdateAt, latencyMs}` for the cold-start context
- Update `references/config/hook_system.md` Codex section to document the timeout fallback semantics
- Add a small test at `mcp_server/tests/hooks-codex-freshness.vitest.ts` covering the fallback marker

#### Sub-task 3: Feature-flag default-state column (doc generation)

013 finding F4.FeatureFlags: many search/memory feature flags ship default-OFF (`mcp_server/lib/search/search-flags.ts:140-152` reconsolidation; `:348-355` watcher; etc.); docs say "auto" without disclosing default state.

Implementation:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` exhaustively
- Generate a "Feature flags reference table" section in `mcp_server/ENV_REFERENCE.md` with columns: flag name | default state (ON/OFF) | governing env var | which automation it gates | added in version
- Update CLAUDE.md and SKILL.md to reference this table when discussing automation defaults
- Do NOT change runtime behavior; doc-only generation from existing source

#### Sub-task 4: advisor_status freshness — keep as diagnostic + add explicit rebuild command (decision: keep diagnostic)

013 finding NEW-013-006: `advisor-status.ts:86` detects stale state but does not invoke the rebuild helper. Decision: keep `advisor_status` as **diagnostic-only** (not auto-repair) but add a clearly-named separate command `advisor_rebuild` that operators can call when status reports stale.

Implementation:
- Update `advisor-status.ts` JSDoc to explicitly state "diagnostic-only; does not rebuild. Use advisor_rebuild to repair."
- Add new MCP tool `advisor_rebuild({ force?: boolean })` at `skill_advisor/handlers/advisor-rebuild.ts`
- Register in tool-schemas + tools/index
- Update `references/hooks/skill-advisor-hook.md` to cross-reference both tools
- Add test at `mcp_server/tests/advisor-rebuild.vitest.ts` covering basic rebuild path

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/017-automation-reality-supplemental-research/research/research-report.md` (Section 6 Packet 034 scope)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research/research/research-report.md` (RQ1 Copilot/Codex freshness rows; RQ4 feature flags)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` (current state)

### Packet structure to create (Level 2)

Same 7-file structure as 031 under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades/`. Use 013's packet as template.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/018-doc-truth-pass","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/019-code-graph-watcher-retraction","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep"]`.

**Trigger phrases**: `["021-half-auto-upgrades","Copilot freshness","Codex cold-start","feature-flag table","advisor rebuild","half-auto upgrades"]`.

**Causal summary**: `"Tier C: 4 sub-tasks. (1) Copilot next-prompt freshness wording + visible header. (2) Codex cold-start fallback marker + smoke check. (3) Feature-flag default-state table. (4) advisor_status diagnostic-only + new advisor_rebuild tool."`.

**Frontmatter rules**: Same compact `recent_action` / `next_safe_action` rules as 031. < 80 chars, non-narrative.

### Phases

1. **Phase 1: Setup** — Create 7 packet files. Initial completion_pct=5.
2. **Phase 2: Implementation** — Apply 4 sub-tasks in order (1 → 2 → 3 → 4). Each sub-task is independent; do not couple them.
3. **Phase 3: Validation** — Strict validator exits 0; new tests pass; TS build succeeds.

### Constraints

- This packet WRITES code AND docs. Be surgical per sub-task.
- Strict validator MUST exit 0.
- New tests MUST pass: `hooks-codex-freshness.vitest.ts` + `advisor-rebuild.vitest.ts`.
- TS build MUST succeed.
- DO NOT commit; orchestrator will commit.
- Cite file:line evidence in packet docs.

When done, last action is strict validator + tests passing. No narration; just write files and exit.
