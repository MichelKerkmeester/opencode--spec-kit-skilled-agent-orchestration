# Iteration 007 — Unified Runtime Manifest

Date: 2026-04-09

## Research question
Should `system-spec-kit` adopt a unified runtime-manifest layer for agent, hook, and command resolution across harnesses?

## Hypothesis
Babysitter's plugin manifests and harness registry will expose a cleaner cross-runtime contract than `system-spec-kit`'s current mix of directory conventions and command-local path assumptions.

## Method
I compared Babysitter's plugin manifest and harness discovery contracts with `system-spec-kit`'s runtime-directory rules and the deep-research workflow's agent resolution.

## Evidence
- Babysitter's OpenCode plugin manifest declares one normalized bundle with explicit `harness`, `hooks`, `commands`, and `skills` roots. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10]
- The Codex plugin maps concrete hook entrypoints for `SessionStart`, `UserPromptSubmit`, and `Stop` through a single `hooks.json` file. [SOURCE: external/plugins/babysitter-codex/hooks.json:2-35]
- Babysitter's harness registry centralizes known harness names, capabilities, and config roots, including `claude-code`, `codex`, `cursor`, `gemini-cli`, `opencode`, `pi`, and `internal`. [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126]
- `system-spec-kit`'s top-level routing rules say runtime directories must switch between `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` depending on runtime. [SOURCE: AGENTS.md:277-288]
- The current deep-research YAML claims to be runtime-agnostic but still hardcodes `agent_file: ".claude/agents/deep-research.md"` in both auto and confirm workflows. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:66-74]

## Analysis
This is a concrete inconsistency in `system-spec-kit`: the architectural rule says runtime directory selection should vary by harness, but the deep-research workflow still embeds a Claude-specific agent path. Babysitter avoids that class of drift by separating plugin manifests and harness discovery from the orchestration logic. [SOURCE: AGENTS.md:277-288] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74] [SOURCE: external/packages/sdk/src/harness/discovery.ts:49-126]

The strongest transferable pattern is not Babysitter's whole plugin system. It is the normalized manifest boundary: one place to resolve harness-specific roots, capabilities, and hook entrypoints so command workflows stop hardcoding per-runtime paths. [SOURCE: external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: external/plugins/babysitter-codex/hooks.json:2-35]

## Conclusion
confidence: high

finding: `system-spec-kit` should add a runtime manifest/resolver layer and route deep-research, deep-review, and similar workflows through it. This is a direct fix for a currently visible path-hardcoding problem and a prerequisite for any cleaner multi-runtime workflow packaging.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, and a new runtime-manifest helper under `.opencode/skill/system-spec-kit/`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a canonical manifest format for runtime agent roots, hook roots, and runtime capabilities
- **Priority:** must-have

## Counter-evidence sought
I looked for an existing manifest-driven resolver that the deep-research YAML already uses and found only directory conventions in `AGENTS.md`, plus the hardcoded Claude path in both YAML files. [SOURCE: AGENTS.md:277-288] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:66-74]

## Follow-up questions for next iteration
- Should `system-spec-kit` also adopt Babysitter's marketplace installer model, or is the manifest boundary enough?
- Which workflows besides deep research currently hardcode runtime-specific paths?
- Could a manifest layer also drive headless internal execution?
