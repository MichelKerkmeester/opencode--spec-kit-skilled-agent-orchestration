# Deep Research — 009-hook-daemon-parity

<!-- ANCHOR:summary -->
## Summary
This investigation focused on the residual hook/daemon parity gaps still visible after `012-docs-impact-remediation` refreshed the operator-facing docs. The strongest gaps are no longer in the shared advisor core; they are in runtime activation, readiness detection, and startup/reporting surfaces for Codex, Copilot, and Gemini. Copilot's wrapper-based activation path is still reverted in the live repo config, Codex detection overstates native-hook readiness relative to the documented `codex_hooks` contract, and Gemini's checked-in hook names no longer match the operator docs or fallback fixtures. Lower-severity drift remains in startup-surface harmonization and in `advisor_status`, which currently treats freshness readability as a proxy for daemon availability. Iterations 02, 03, 05, and 07 contributed the most novel evidence. Evidence anchors: `.codex/config.toml:43`, `.claude/settings.local.json:24`, `.gemini/settings.json:95`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:93`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:scope -->
## Scope
This research covered the `009-hook-daemon-parity` parent packet, its direct child packet root docs, and the runtime/operator surfaces implicated by post-012 drift:

- Parent and child packet docs under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/`
- Runtime config and hook files under `.claude/`, `.codex/`, `.gemini/`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/`
- Cross-runtime readiness/detection and advisor-status code under `mcp_server/code-graph/lib/` and `mcp_server/skill-advisor/`
- OpenCode plugin bridge files under `.opencode/plugins/` for contrast
- Cross-runtime and runtime-specific test files that still define the current regression boundary

The investigation attempted CocoIndex semantic search for unfamiliar-code discovery, but the MCP calls were cancelled by the runtime, so the evidence trail below relies on direct code reads plus packet docs.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:key-findings -->
## Key Findings
### P0
No P0 release-blocker was found inside the shared advisor core. The residual gaps are concentrated in runtime/operator surfaces, not in the scorer or brief producer itself.

### P1
- `F-001` Codex readiness is overstated. The remediated docs say native Codex hooks require `[features].codex_hooks = true` and `~/.codex/hooks.json`, but the checked-in `.codex/config.toml` omits `codex_hooks`, no repo-local `hooks.json` exists, and `detectCodexHookPolicy()` still upgrades the runtime to `live` from `.codex/settings.json` alone. Evidence: [iteration-02.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-02.md), `.codex/config.toml:43`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:219`
- `F-002` Copilot activation parity is still reverted. Packets 010 and 011 both say the top-level wrapper fields and writer commands were removed and must be reapplied, and the live `.claude/settings.local.json` still contains only nested Claude hooks while docs present the wrapper path as current. Evidence: [iteration-03.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-03.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:24`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:24`, `.claude/settings.local.json:24`
- `F-003` Gemini's operator contract is fragmented. The checked-in runtime uses `BeforeAgent`, `PreCompress`, and `SessionEnd`, but docs and fallback tests still describe Gemini through older or Claude-shaped names and stale availability expectations. Evidence: [iteration-05.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-05.md), `.gemini/settings.json:83`, `.gemini/settings.json:95`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:59`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:102`

### P2
- `F-004` Copilot readiness detection keys off generic `.github/hooks/*.json` presence rather than Spec Kit wrapper presence in `.claude/settings.local.json`, so unrelated Copilot hooks can make the runtime look "enabled." Evidence: [iteration-04.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-04.md), `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:82`, `.github/hooks/superset-notify.json:4`
- `F-005` Startup-surface parity is not actually uniform. Claude/Codex preserve cached-summary rejection reasoning and optional spec-folder-aware startup shaping; Gemini and Copilot do not. Evidence: [iteration-06.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-06.md), `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:218`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:129`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:153`
- `F-006` `advisor_status` conflates daemon presence with freshness state. It reports `daemonAvailable` from generation state and only optionally includes a PID, so operators can read "daemon available" when only static freshness artifacts are present. Evidence: [iteration-07.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-07.md), `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:93`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:29`
<!-- /ANCHOR:key-findings -->

<!-- ANCHOR:evidence-trail -->
## Evidence Trail
- [iteration-02.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-02.md): "The checked-in `.codex/config.toml` does not actually contain `codex_hooks = true`." This is the clearest code-versus-doc contract miss.
- [iteration-03.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-03.md): "The current `.claude/settings.local.json` matches the reverted state." This is the strongest Copilot parity evidence.
- [iteration-04.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-04.md): "The detector can return `enabled` based on Superset hook presence alone." This shows the operator-surface false positive.
- [iteration-05.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-05.md): "The Gemini prompt-hook implementation agrees with `BeforeAgent` while docs still say `UserPromptSubmit`." This captures the strongest cross-runtime naming drift.
- [iteration-06.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-06.md): "Gemini and Copilot are materially thinner than Claude/Codex at startup." This explains why parity still feels uneven even where hooks exist.
- [iteration-07.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-07.md): "Freshness readability is standing in for daemon presence." This is the cleanest operator-status gap.
- [iteration-09.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/research/iterations/iteration-09.md): "The advisor core and OpenCode bridge look aligned." This helps bound the scope of the next remediation packet.
<!-- /ANCHOR:evidence-trail -->

<!-- ANCHOR:recommended-fixes -->
## Recommended Fixes
- `[P1][codex detection + operator config]` Make the checked-in Codex contract and the detector agree. Either add `codex_hooks = true` plus the supported registration path, or downgrade docs and `detectCodexHookPolicy()` so `live` requires both the feature flag and the documented hook-registration file.
- `[P1][copilot runtime config]` Reapply packets 010 and 011 in `.claude/settings.local.json`: restore the top-level wrapper fields on the relevant matcher objects, then restore the Copilot `UserPromptSubmit` and `SessionStart` writer commands.
- `[P1][gemini docs/tests]` Align Gemini docs and tests to the checked-in surface. Use the actual Gemini event names in operator docs or introduce an explicit normalization layer that both docs and tests consume.
- `[P2][copilot readiness detection]` Replace `.github/hooks/*.json` as the Copilot readiness probe with a Spec Kit-specific check for wrapper presence in `.claude/settings.local.json`; consider a separate "other Copilot hooks detected" diagnostic if that context still matters.
- `[P2][startup harmonization]` Refactor startup priming so Gemini and Copilot can accept the same continuity/spec-folder inputs Claude already uses, even if their transport format remains different.
- `[P2][advisor_status semantics]` Split freshness and daemon presence into separate reported fields. Keep `trustState` for freshness, but compute daemon-running state from an actual PID/lease/process signal rather than generation state alone.
- `[P2][regression coverage]` Add small runtime-contract tests that read real checked-in config files: one for Copilot wrapper field presence, one for Codex activation prerequisites, and one for Gemini event-name parity.
<!-- /ANCHOR:recommended-fixes -->

<!-- ANCHOR:convergence-report -->
## Convergence Report
The investigation converged without an early stop after 10 iterations. New information stayed above the stop threshold throughout, but the marginal return declined after iteration 08, which indicates the main fault lines are now understood. The highest-yield iterations were:

- Iteration 02 for Codex activation and detection drift
- Iteration 03 for Copilot wrapper/writer reversion evidence
- Iteration 05 for Gemini config-versus-doc/test fragmentation
- Iteration 07 for daemon-status semantics

Iterations 08 through 10 mostly refined fix ordering and bounded the problem to runtime/operator surfaces rather than shared advisor logic.
<!-- /ANCHOR:convergence-report -->

<!-- ANCHOR:open-questions -->
## Open Questions
- Is the intended near-term goal to make code/config catch up to the post-012 docs, or to soften the docs until the runtime surfaces are fully reapplied?
- Which parts of the Codex and Copilot activation contract are expected to be checked into the repo, and which are intentionally user-global migration steps?
- Should the runtime docs use native runtime event names everywhere, or keep an abstracted cross-runtime vocabulary and add an explicit translation table?
- Is there already a daemon lease/heartbeat artifact that `advisor_status` can consume, or would that require a new status source?
- Can the next remediation packet safely include both runtime detection and docs/test cleanup, or does Copilot wrapper reapply need to be isolated first?
<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:references -->
## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation/implementation-summary.md`
- `.claude/settings.local.json`
- `.codex/config.toml`
- `.codex/settings.json`
- `.gemini/settings.json`
- `.github/hooks/superset-notify.json`
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-compact-code-graph.js`
<!-- /ANCHOR:references -->
