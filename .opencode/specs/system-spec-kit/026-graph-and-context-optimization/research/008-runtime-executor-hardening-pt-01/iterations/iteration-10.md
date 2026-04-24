## Iteration 10
### Focus
Consolidate the evidence into a severity-ranked hardening picture for executor failure modes, sandbox escape risks, stuck-wrapper roots, and timeout handling.

### Findings
- The highest-risk defect is an internal contract break: non-native runs are validated as if `executor` were inline on the canonical iteration record, while the published prompt-pack contract omits that field and the YAML only tries to append it after validation. This can make a spec-compliant executor fail by design. [Evidence: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:38-48; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:145-150; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:586-617]
- The second high-risk defect is unhandled dispatch failure specificity: timeout/crash helpers exist, but no live path calls them, so operator-visible failures degrade into generic schema-mismatch symptoms and delayed stuck recovery. [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:128-149; .opencode/skill/sk-deep-research/references/loop_protocol.md:232-241; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:836-840]
- The main security/control-plane defect is config-to-command drift around `sandboxMode` and broad executor permissions. The schema accepts sandbox choices, but the branches either hardcode their mode or expose an always-permissive path (`--allow-all-tools`) with no shared enforcement. [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:30-35; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:516-585]
- The stuck-wrapper story is mostly a Copilot evidence gap: the `@path` wrapper exists syntactically, but there is still no live smoke proving it writes the required artifacts, and prior research had already called that fallback an open hardening item. [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:528-551; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution-pt-01/research.md:57-60,199-201]

### New Questions
- Can the first-write provenance fix and typed dispatch-failure fix land together without changing reducer semantics?
- Should sandbox configuration be made executable or removed from the public config surface immediately?
- Do we need one smoke-test packet per executor kind, or a shared harness that can drive all four branches through the same artifact contract?

### Status
converging
