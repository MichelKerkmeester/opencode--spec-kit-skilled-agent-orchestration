## Iteration 02
### Focus
Check whether sandbox-related config and packet security claims are actually wired into each CLI executor branch.

### Findings
- `executor-config.ts` accepts `sandboxMode` for `cli-codex`, `cli-gemini`, and `cli-claude-code`, but the research YAML hardcodes `--sandbox workspace-write`, `-s none`, and `--permission-mode acceptEdits` instead of reading `config.executor.sandboxMode`. The setting is parseable but operationally ignored. [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:16-35; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:516-585]
- The Phase 018 spec and checklist frame sandbox selection as an enforced safety invariant, yet the implementation summary still carries `sandboxMode: null` while the command path is fixed to `workspace-write`. That is policy drift, not just missing ergonomics. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/spec.md:181-196; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/checklist.md:127-130; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/implementation-summary.md:87-98]
- The Copilot branch always uses `--allow-all-tools`, which is the broadest permission surface in the matrix, and there is no parallel config knob to narrow it. The command surface is therefore more permissive than the shared executor schema suggests. [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:528-551; .opencode/command/spec_kit/deep-research.md:114-119]
- Cross-CLI delegation is explicitly documented as possible inside each executor sandbox, and runtime enforcement is explicitly absent, so a mis-scoped executor can invoke additional CLIs without a built-in recursion or privilege boundary check. [Evidence: .opencode/skill/sk-deep-research/SKILL.md:73-88; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/decision-record.md:119-160]

### New Questions
- Should `sandboxMode` be removed from the schema until per-kind command wiring exists?
- Should Copilot get an explicit "unsafe by design" contract note instead of appearing symmetric with configurable executors?
- Is runtime recursion detection now a security requirement rather than a deferred ergonomics improvement?

### Status
new-territory
