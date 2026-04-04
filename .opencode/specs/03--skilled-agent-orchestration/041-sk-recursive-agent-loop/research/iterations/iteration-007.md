# Iteration 7: Control Bundle and Target Manifest Design

## Focus
Infer what the repo-native replacement for `program.md` should look like: which files define the policy, the mutable boundary, and the promotion contract.

## Findings
1. The control plane needs a source-vs-derived distinction. `.opencode/agent/` is the canonical source layer, while runtime copies live under runtime-specific directories and create workflows already resolve paths differently per runtime. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:41]
2. File-level allowlists are not enough. Agent definitions already have required frontmatter fields (`name`, `description`, `mode`, `temperature`, unified `permission`), so a target manifest should be able to protect or mutate specific frontmatter keys and named body sections rather than only whole files. [SOURCE: .opencode/skill/sk-doc/assets/agents/agent_template.md:41] [SOURCE: .opencode/skill/sk-doc/assets/agents/agent_template.md:68]
3. Repo-native loops are package-shaped, not prompt-shaped. `sk-deep-research` uses a command entrypoint, workflow layer, leaf agent, reducer, and disk state, while create commands route through explicit mode YAMLs and operation branches. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/README.txt:126] [SOURCE: .opencode/command/create/sk-skill.md:239]
4. The reducer ownership model already suggests where decisions should live. Deep research keeps iteration detail in write-once artifacts and append-only JSONL, then regenerates dashboards and registry state from those sources. [SOURCE: .opencode/agent/deep-research.md:159] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15]

## Ruled Out
- A lone `program.md` is too weak for this repo. The existing command/skill architecture expects a small control bundle with human-authored policy plus machine-readable state and routing configuration. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:249]

## Dead Ends
- Treating runtime mirror directories as primary mutation targets would tangle the control plane immediately. The manifest has to distinguish canonical sources from derived runtime copies up front. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:41]

## Sources Consulted
- .opencode/README.md:330
- .opencode/command/create/assets/create_agent_auto.yaml:41
- .opencode/skill/sk-doc/assets/agents/agent_template.md:41
- .opencode/skill/sk-deep-research/SKILL.md:137

## Assessment
- New information ratio: 0.79
- Questions addressed: What should the MVP scope, boundaries, and success metric be for a new skill in this repo?
- Questions answered: None newly answered; this iteration clarified the repo-native control-plane shape.

## Reflection
- What worked and why: Looking at create workflows, templates, and reducer-managed state made the answer much less abstract than reasoning from `program.md` alone.
- What did not work and why: Broad searching for "manifest" and "generated from" found the right hints, but the architecture only clicked once the runtime/source split was read alongside the deep-research packet model.
- What I would do differently: If implementation begins, design the control bundle schema before writing the skill prose so the workflow and state model stay aligned.

## Recommended Next Focus
Decide which parts of the deep-research packet model can be reused directly and which ones must be replaced with experiment-oriented ledger semantics.
