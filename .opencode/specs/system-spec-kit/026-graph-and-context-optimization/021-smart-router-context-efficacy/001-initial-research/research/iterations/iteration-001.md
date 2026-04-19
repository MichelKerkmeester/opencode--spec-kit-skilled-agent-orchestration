# Iteration 001 - Baseline Packet State and Evidence Map

## Focus Questions

V1, V2, V8, V10

## Tools Used

- `sed` reads for sk-deep-research protocol, strategy, charter, hook reference, validation playbook, plugin examples
- `find` for packet and plugin discovery
- `rg` for advisor and hook evidence
- `ccc search` attempted and failed due sandbox write denial

## Sources Queried

- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`
- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`

## Findings

- The research packet was already initialized with `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, and `spec.md`; no prior `iteration-NNN.md` files existed, so this run starts from iteration 1 rather than resuming prior research. (sourceStrength: primary)
- The Phase 020 reference defines the intended model-visible contract as a compact advisor line such as `Advisor: live; use sk-code-opencode 0.91/0.23 pass.`, with default brief cap 80 token-estimate units and ambiguity paths capped at 120. (sourceStrength: primary)
- The hook reference explicitly frames the hook as a replacement for easy-to-miss manual Gate 2 invocation, while keeping the CLI advisor as fallback. This directly supports V2's steering question. (sourceStrength: primary)
- The validation playbook gives pre-existing release evidence: corpus parity, timing gates, privacy checks, rollback drills, and per-runtime smoke tests. This establishes that Phase 020 had functional validation, but not direct context-load measurement. (sourceStrength: primary)
- The working OpenCode plugin pattern is the compact code-graph plugin under `.opencode/plugins/`; it exports one default plugin function, uses OpenCode hook keys, delegates heavy work to a bridge process, caches by session, and exposes a status tool. This is the architectural pattern V8 should mirror. (sourceStrength: primary)
- `ccc search` was attempted for semantic discovery but failed because the sandbox could not access `~/.cocoindex_code/daemon.log`; this limits semantic-search evidence and must be documented as a methodology limitation. (sourceStrength: primary)

## Novelty Justification

This first pass established the packet state, the core Phase 020 contract, the plugin reference pattern, and a tooling limitation not already present in the packet.

## New Info Ratio

0.92

## Next Iteration Focus

Quantify V1 and V3 with static skill-package size measurement and corpus-driven simulation.
