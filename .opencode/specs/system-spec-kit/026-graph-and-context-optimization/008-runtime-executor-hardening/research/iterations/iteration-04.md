## Iteration 04
### Focus
Inspect the Gemini and Claude executor branches for command-injection, sandbox-selection, and permission-surface drift.

### Findings
- The Gemini branch uses `gemini "$(cat '...')"` and the Claude branch uses `claude -p "$(cat '...')"`; prompt contents are read from files, which avoids direct topic interpolation into shell syntax, but both branches still ignore the parsed `sandboxMode` value and hardcode their execution mode. [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:552-585; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:30-35]
- The command doc presents Gemini and Claude as ordinary executor choices, but only Claude's write-enabling permission mode is visible in the branch itself; Gemini's `-s none` is a hardcoded sandbox posture with no shared validation that it matches the config or the security checklist. [Evidence: .opencode/command/spec_kit/deep-research.md:114-119; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/checklist.md:82-87]
- ADR-009 deliberately enforces a Gemini model whitelist, but there is no comparable runtime check that the branch is still using the safest sandbox posture or that future CLI flag changes stay aligned with the support map. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/decision-record.md:203-236; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:38-128]
- Because cross-CLI delegation is allowed in principle and enforcement is absent, Gemini and Claude can still act as trampoline executors into other CLIs even when their own branch-specific flag surface looks constrained. [Evidence: .opencode/skill/sk-deep-research/SKILL.md:75-88]

### New Questions
- Should branch-specific permission flags become part of the validated executor schema instead of being hardcoded in YAML?
- Do Gemini and Claude need a shared "no nested CLI" guard at the prompt-pack level if runtime enforcement stays out of scope?
- Would a per-kind security smoke test catch future flag drift faster than command-shape tests alone?

### Status
converging
