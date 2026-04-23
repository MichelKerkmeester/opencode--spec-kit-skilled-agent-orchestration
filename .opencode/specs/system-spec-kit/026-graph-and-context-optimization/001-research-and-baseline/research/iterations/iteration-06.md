## Iteration 06
### Focus
Reassess the old hook and startup prerequisites against the later hook-parity packets, with attention to what improved and what reopened.

### Findings
- The archived roadmap still treated graph-first hook activation and guarded cached-startup work as future rails. Since then, Codex hook parity shipped native `SessionStart` and `UserPromptSubmit` adapters that inject startup context and advisor briefs through Codex-native `additionalContext`. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/research.md:176-182`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation/implementation-summary.md:50-67`
- The Codex parity packet also includes real verification: build and test passes, direct SessionStart and UserPromptSubmit smokes, and a user-driven interactive Codex smoke. This is stronger operational evidence than the archived run had. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation/implementation-summary.md:97-110`
- Cross-runtime parity is still not converged. The hook-parity parent now marks packet `010-copilot-wrapper-schema-fix` and packet `011-copilot-writer-wiring` as reverted and needing reapply, and both child packets confirm the current live `.claude/settings.local.json` no longer carries those top-level Copilot-safe fields or writer commands. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/implementation-summary.md:69-79`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:22-25`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:55-58`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:22-25`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:92-96`
- The current Codex hook code also now short-circuits to a native advisor path when freshness is `live` or `stale`, and only falls back to subprocess brief-building otherwise. That runtime behavior did not exist when the archived master packet converged. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180-205`; `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:342-381`; `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:153-176`

### New Questions
- After packet 010 and 011 are reapplied, which runtime still lacks parity-level smoke evidence?
- Should the root packet now split "hook parity" from "configuration durability," since reverts are the main remaining issue?
- Does the current native-brief path change any of the archived effort or risk assumptions for startup routing?

### Status
converging
