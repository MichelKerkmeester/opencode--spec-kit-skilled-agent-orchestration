# Focus

Axis 5 tool-discovery UX: compare SPAR's `.spar-kit/.local/tools.yaml` seed-once discovery surface with our skill-advisor hook, native Spec Kit Memory MCP tools, and Code Mode progressive MCP discovery. The focus was sessions where the user or agent does not already know which tools exist.

# Actions Taken

1. Read SPAR's shipped tool registry and install policy:
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/.spar-kit/.local/tools.yaml`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/default.json`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs`
2. Read SPAR's tool-check contract and skill workflow:
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/specs/completed/tools-check/tools-check_spec.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-init/SKILL.md`
3. Compared internal discovery and routing surfaces:
   - `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
   - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts`
   - `.opencode/command/doctor/skill-advisor.md`
   - `.opencode/skill/mcp-code-mode/SKILL.md`
   - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tools/README.md`
4. Checked live internal tool-schema count with `rg '^\\s*name:' .../tool-schemas.ts | wc -l`.

# Findings

## F-007: Adapt SPAR's local tool-state ledger as a complement to live routing

Verdict: `adapt`

SPAR's `tools.yaml` is both human-readable and machine-readable. It declares `schema_version`, a top-level `checked_at`, stable tool metadata (`name`, `purpose`, `check`, optional `when`), and mutable status fields (`installed`, `version`, `reason`). The shipped registry covers a small fixed set: `git`, `just`, `npm`, forge CLIs (`gh`, `glab`, `bb`), installers (`winget`, `brew`), and `uv`.

The important UX difference is persistence. SPAR seeds `.spar-kit/.local/tools.yaml` with `policy: "seed_if_missing"` in `install-root/targets/default.json`, then `spar-init` updates the same repo-local file in place. That gives a user-visible "what this repo expects and what this machine has" surface.

Our system-spec-kit discovery is stronger at routing intent, but weaker as an inspectable local ledger. The skill-advisor hook injects a compact prompt-time brief, uses live/stale/absent/unavailable freshness, and defaults to 0.8 confidence plus 0.35 uncertainty thresholds. Code Mode then exposes `search_tools()`, `list_tools()`, and `tool_info()` for `.utcp_config.json` tools. Those are powerful, but they require the agent to know which discovery path applies.

Recommendation: create a `tool-discovery-ledger` follow-on packet. Do not replace skill-advisor. Add a generated, seed-if-missing local manifest that summarizes runtime discovery paths, configured MCP families, required CLIs, and last check status.

## F-008: Reject a static `tools.yaml` as the source of truth for MCP capability discovery

Verdict: `reject-with-rationale`

SPAR's model works because its v1 tool set is intentionally tiny and CLI-focused. The `tools-check` spec fixes the v1 list at nine entries and constrains writes to `.spar-kit/.local/tools.yaml`. The contract is intentionally about presence/version checks, not dynamic protocol capabilities.

Our internal surface has multiple capability layers. Native Spec Kit Memory tools are declared in `tool-schemas.ts`; this checkout currently exposes 55 `name:` entries there, while older docs and the prompt still mention 47. Code Mode separately documents "200+ MCP tools" through `.utcp_config.json` and says its discovery tools do not show native MCP tools. The hook/advisor layer is another surface again, with `advisor_recommend`, `advisor_status`, `advisor_rebuild`, and `advisor_validate`.

A static SPAR-style registry would become stale quickly if treated as authoritative for all MCP tools. It should record discovery entrypoints and health summaries, not mirror every MCP tool definition.

Recommendation: keep authoritative MCP truth in live schemas and tool discovery APIs. Use a local ledger only as a dashboard: "native memory tools live/stale", "Code Mode servers configured", "CocoIndex available/missing", "advisor graph live/stale", and "CLI tools present".

## F-009: Adapt SPAR's "check everything, continue on failure, persist final state" flow for operator diagnostics

Verdict: `adapt`

SPAR's tool-check flow is unusually operator-friendly: run all checks, continue after failures, optionally auto-install when permitted, re-check attempted installs, write final status once, and update `checked_at` only after a complete pass. It also preserves unknown fields when practical and records failure reasons instead of silently skipping rows.

The analogous internal operation is split across advisor status/rebuild, Code Mode `list_tools()`, native MCP health, CocoIndex status, and CLI checks. The `/doctor:skill-advisor` command is mature for advisor graph optimization, but it is not a general "what tools can this repo use right now?" dashboard. It is a five-phase scoring and rebuild workflow, not a lightweight session-discovery affordance.

Recommendation: add a read-mostly `/doctor:tools` or `/spec_kit:tools` diagnostic that writes a local ledger only when asked or during install/init. It should use SPAR's semantics: complete pass, stable ordering, final status, no hard stop for one missing optional tool.

## F-010: Tool-discovery UX should separate "agent routing" from "operator inventory"

Verdict: `take-inspiration`

SPAR's ledger is easy to inspect because it answers one question: which external CLIs are expected and available? Our system currently answers a harder question: which skill or MCP path should the agent use for this prompt? Those are different jobs.

The skill-advisor hook is a routing system. It injects a compact brief, suppresses raw prompt persistence, tracks freshness, and fails open. Code Mode is a progressive-discovery execution system. It deliberately reduces context by searching/loading tools on demand. Neither one is optimized as a user-facing inventory.

Recommendation: keep the distinction explicit in future UX copy. "Advisor" routes the next action. "Tools ledger" inventories environment capability. "Code Mode discovery" finds external MCP calls inside a tool workflow. Collapsing those into one surface would make each less clear.

# Questions Answered

- Q5 answered: SPAR's `tools.yaml` improves discoverability for environment prerequisites and local setup state, especially when the user does not know what the repo expects. It does not beat skill-advisor or Code Mode for intent routing or dynamic MCP capability lookup. The best internal adaptation is a repo-local tool ledger/dashboard that points at live discovery systems rather than replacing them.
- Q8 updated: The "47 MCP tools" figure is stale for the current checkout. `tool-schemas.ts` now contains 55 native Spec Kit Memory tool definitions by the simple `name:` count, while Code Mode documentation separately claims 200+ external MCP tools.

# Questions Remaining

- Should the future local ledger be command-owned (`/doctor:tools`) or install/init-owned (`/spec_kit:init` style) so it does not create write-on-read behavior?
- Which live statuses belong in the ledger: skill-advisor freshness, native MCP health, Code Mode server list, CocoIndex availability, git/gh/npm/brew/uv CLI checks, or all of them?
- How should the ledger represent runtime-specific availability differences across `.opencode`, `.codex`, `.claude`, `.gemini`, and Copilot without turning into another long instruction file?

# Next Focus

Axis 6 personas/tone and Q7: compare SPAR's personas plus "Key Follow-Up vs Optional Follow-Up" guidance in `spar-specify` / `spar-plan` against our consolidated-question protocol and terse senior-engineer output style. The goal is to decide which tone/persona affordances are portable and which would clash with current instruction discipline.
