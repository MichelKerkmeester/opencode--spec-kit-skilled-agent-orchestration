## Packet 049: runtime-command-agent-alignment-review — Tier B audit + apply

You are cli-codex (gpt-5.5 high fast) implementing **036-runtime-command-agent-alignment-review**.

### CRITICAL: Spec folder path

The packet folder is: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/036-runtime-command-agent-alignment-review/` — write ALL packet files there. Do NOT ask for the spec folder.

### Goal

Audit + align commands and agents across ALL supported runtimes after this session's wave of changes (031-048 — added tools, renamed dirs, refreshed schemas). Focus: are command and agent definitions in each runtime's config dir reflecting current reality, OR did we drift?

### Runtime config dirs to audit

| Runtime | Commands | Agents |
|---------|----------|--------|
| **OpenCode** (primary) | `.opencode/command/` | `.opencode/agent/` |
| **Claude Code** | (uses .opencode + extras) | `.claude/agents/` |
| **Codex CLI** | (uses .opencode) | `.codex/agents/` (if present) |
| **Gemini CLI** | (uses .opencode) | `.gemini/agents/` (if present) |
| **GitHub Copilot CLI** | `.github/hooks/` only | (none) |

Discovery:

```bash
find .opencode/command -name '*.md' -type f | wc -l
find .opencode/agent -name '*.md' -type f | wc -l
find .claude/agents -name '*.md' -type f 2>/dev/null | wc -l
find .codex/agents -name '*.md' -type f 2>/dev/null | wc -l
find .gemini/agents -name '*.md' -type f 2>/dev/null | wc -l
```

### Audit dimensions

For each command + agent, check:

1. **Tool references current** — any tool name mentioned matches the canonical set in `tool-schemas.ts` (50 spec_kit_memory + 4 advisor = 54 total). Any tool name that no longer exists / was renamed should be flagged.
2. **Path references current** — paths like `mcp_server/matrix_runners/`, `mcp_server/stress_test/`, `mcp_server/code_graph/feature_catalog/` are present where appropriate; old paths like `mcp_server/matrix-runners/` (kebab) are gone.
3. **Tool count claims current** — "54 MCP tools" / "50 + 4" / "63 across 4 servers" — match canonical sources (`tool-schemas.ts`, `opencode.json`).
4. **Capability matrix current** — agents that mention runtime capabilities (e.g., "Claude has UserPromptSubmit hook") match 013/043/044 reality.
5. **Auto-claim trigger column** — same rule as 040: every "auto-fires"/"auto-managing" claim has a Trigger column or file:line citation.
6. **Cross-runtime consistency** — agents that exist in multiple runtimes (`@write`, `@review`, `@orchestrate`, `@deep-research`, `@deep-review`, etc.) should have equivalent capability descriptions across `.opencode/agent/` and `.claude/agents/`.
7. **Evergreen-doc rule compliance** — no packet IDs in command/agent narrative content (per 040 rule).
8. **New tools surfaced** — agents that should know about `memory_retention_sweep`, `advisor_rebuild`, `freshness-smoke-check`, matrix_runners adapters reference them where appropriate.

### Specific things to look for

- `@review` / `@deep-review` agent definitions: do they cite current sk-deep-review skill methodology + severity rubric?
- `@deep-research` definition: does it cite current sk-deep-research workflow + lineage modes (`new`, `resume`, `restart`)?
- `@context` agent: does it cite the LEAF-only constraint correctly?
- `@debug`: does it preserve user-invoked-only directive (no auto-dispatch)?
- `@orchestrate`: does it cite the runtime agent directory resolution rule (use `.opencode/agent/` for OpenCode profile, `.claude/agents/` for Claude profile)?
- `@write`: does it cite sk-doc skill + DQI rules + evergreen-doc rule?
- `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:resume`: do their YAML workflows reference current paths (no `matrix-runners`, no `tests/search-quality/` for stress)?
- `/memory:save`, `/memory:search`, `/memory:manage`: do they mention `memory_retention_sweep`?
- `/doctor:mcp_install`: does it reference the 4-server bootstrap with current Node floor (≥20.11.0)?
- `/doctor:skill-advisor`: does it reference `advisor_rebuild` as the explicit rebuild path?
- `/doctor:code-graph`: does it reference the read-path/manual contract (no watcher claim)?

### Implementation

#### Phase 1: Discovery + audit

Walk every command/agent file. For each, classify:
- PASS: current and consistent
- DRIFT: stale tool/path/count/capability reference
- MISSING: doesn't mention something it should

Write `audit-findings.md` at packet root with per-file classification + finding ID + severity (P0/P1/P2).

#### Phase 2: Apply fixes

For each DRIFT or MISSING finding:
- Apply minimal Edit to bring the doc current
- Cite file:line in the edit (replace stale ref with current file:line)
- Honor evergreen-doc rule (no packet IDs in narrative)

For each PASS: do nothing.

#### Phase 3: Cross-runtime consistency check

For agents that exist in BOTH `.opencode/agent/` AND `.claude/agents/`:
- Read both versions
- Diff capability descriptions
- If they should be equivalent (same agent, different runtime), align them — pick the more-current source as truth
- If they're intentionally divergent (e.g., Claude-specific tooling), document why

#### Phase 4: Verification

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/036-runtime-command-agent-alignment-review --strict` — must exit 0
- Self-check: run the evergreen-rule grep across all touched command/agent files; goal is zero unexempted hits
- For any command with a YAML asset: confirm strict validator on the wrapper packet (if applicable) still passes

### Packet structure to create (Level 2)

7-file structure under this packet folder.

PLUS: `audit-findings.md` (per-file classifications), `remediation-log.md` (per-finding fix log), `cross-runtime-diff.md` (consistency report between OpenCode/Claude/Codex/Gemini agent definitions).

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/029-root-readme-refresh","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/034-matrix-runners-snake-case-rename","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/035-remaining-p1-p2-remediation"]`.

**Trigger phrases**: `["036-runtime-command-agent-alignment-review","runtime command audit","agent alignment review","cross-runtime agent consistency"]`.

**Causal summary**: `"Audits all commands in .opencode/command/ and agents in .opencode/agent/, .claude/agents/, .codex/agents/, .gemini/agents/ for current-reality alignment after 031-048. Surfaces tool/path/count/capability drift; applies fixes; cross-checks runtime-equivalent agents for consistency."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- Strict validator MUST exit 0 on this packet.
- DO NOT mutate any tool source or schema; this is alignment-of-docs only (some commands have YAML assets — those YAMLs may need touch but only doc-level fixes, not workflow logic changes).
- Honor evergreen-doc rule.
- DO NOT commit; orchestrator commits.
- If a finding requires a design decision (e.g., should two runtime-divergent agents be aligned to one definition?), document in `cross-runtime-diff.md` rather than apply a hasty merge.
- Be honest about which agents are intentionally runtime-specific vs accidentally drifted.

When done, last action: strict validator passing + audit-findings.md complete + remediation-log.md showing per-finding outcome. No narration; just write files and exit.
