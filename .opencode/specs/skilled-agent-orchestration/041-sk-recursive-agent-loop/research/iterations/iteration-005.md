# Iteration 5: Runtime Target Topology and Canonical Mutation Surface

## Focus
Determine which repo-side runtime surfaces should be considered primary mutation targets, which ones behave like derived copies, and which adjacent files materially shape execution.

## Findings
1. `.opencode/agent/` is the cleanest primary mutation surface. The repo documentation describes it as the base agent source layer, with runtime copies under `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`, and Codex agent files explicitly record conversion from `.opencode/agent/*`. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/install_guides/README.md:1421] [SOURCE: .codex/agents/context.toml:1]
2. Cross-runtime parity is semantic, not literal. The same `@context` role differs by runtime in path convention, tool inventory, and workflow shape, which means "one change everywhere" is not a safe assumption. [SOURCE: .opencode/agent/context.md:1] [SOURCE: .claude/agents/context.md:1] [SOURCE: .gemini/agents/context.md:1] [SOURCE: .codex/agents/context.toml:88]
3. Some command assets pin specific runtime agent files directly. The deep-research workflow still shows `.claude/agents/deep-research.md` as the concrete `agent_file`, even while describing runtime-agnostic resolution. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66]
4. Codex has a split control plane: `.codex/config.toml` governs `codex exec -p <profile>` delegation, while `.codex/agents/*.toml` supports the interactive multi-agent TUI. Editing agent TOMLs alone would miss an important runtime path. [SOURCE: .opencode/skill/cli-codex/SKILL.md:314] [SOURCE: .codex/config.toml:47]
5. Gemini is likewise shaped by adjacent orchestration docs. The CLI skill and delegation reference hardcode the `As @agent` invocation style and routing table, so runtime behavior is partly defined outside `.gemini/agents/`. [SOURCE: .opencode/skill/cli-gemini/SKILL.md:277] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:19] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:60]

## Ruled Out
- Treating `.opencode/agent`, `.claude/agents`, `.codex/agents`, and `.gemini/agents` as equal first-class mutation targets is too broad for an MVP; some are copies, some are format translations, and some behavior lives in adjacent control files. [SOURCE: .opencode/README.md:330] [SOURCE: .codex/config.toml:47] [SOURCE: .opencode/skill/cli-gemini/SKILL.md:277]

## Dead Ends
- I did not locate a checked-in sync/generation workflow that deterministically refreshes all runtime copies from `.opencode/agent`, which keeps mirror maintenance a live drift risk. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/install_guides/README.md:1421]

## Sources Consulted
- .opencode/README.md:330
- .opencode/install_guides/README.md:1421
- .codex/agents/context.toml:1
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66

## Assessment
- New information ratio: 0.82
- Questions addressed: What should the MVP scope, boundaries, and success metric be for a new skill in this repo?
- Questions answered: None newly answered; this iteration narrowed the canonical mutation surface.

## Reflection
- What worked and why: Tracing runtime mirrors and adjacent control files made it obvious that `.opencode/agent` is the right primary boundary and that parity is a later-phase concern.
- What did not work and why: Broad keyword search was noisier than reading runtime docs and config surfaces directly.
- What I would do differently: If implementation starts, inventory every adjacent control file per target runtime before allowing any auto-edit promotion.

## Recommended Next Focus
Identify concrete evaluator candidates in this repo so we can connect the canonical mutation surface to a trustworthy keep/discard rule.
