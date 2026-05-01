# Iteration 001

## Focus

SCOUT pass over the external SPAR-Kit structure and the closest internal system-spec-kit surfaces. This iteration focused on Axis 1, installer / multi-target distribution, and Axis 3, command / skill granularity.

Deferred by design: managed-block depth (Axis 2), template architecture (Axis 4), tools.yaml discovery UX (Axis 5), and personas / tone (Axis 6).

## Actions Taken

1. Read external root docs and package surface:
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/README.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/ROADMAP.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/technicalBrief.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/AGENTS.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/package.json`
2. Read the five external SPAR skills:
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-init/SKILL.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-act/SKILL.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-retain/SKILL.md`
3. Read external target configs and installer code:
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/default.json`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/codex.json`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/opencode.json`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/cli.mjs`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/install-engine.mjs`
4. Read internal command and runtime surfaces:
   - `.opencode/skill/system-spec-kit/SKILL.md`
   - `.opencode/command/spec_kit/plan.md`
   - `.opencode/command/spec_kit/implement.md`
   - `.opencode/command/spec_kit/complete.md`
   - `.opencode/command/spec_kit/resume.md`
   - `.opencode/command/spec_kit/deep-research.md`
   - `.opencode/command/spec_kit/deep-review.md`
   - `.opencode/command/memory/README.txt`
   - `.opencode/command/create/agent.md`
   - `.opencode/agent/README.txt`
   - `.opencode/skill/system-spec-kit/ARCHITECTURE.md`

## Findings

### F-001: Adapt SPAR's target-config installer model, not the npm installer as-is

Verdict: `adapt`

SPAR's strongest distribution pattern is not npm itself; it is the small target manifest layer. The external package exposes one install command with runtime flags in `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/cli.mjs`, applies default/general behavior through `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/install-engine.mjs`, and expresses placement policy through `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/default.json`, `codex.json`, and `opencode.json`.

The internal system already has cross-runtime complexity, but it is spread through command assets, runtime agent directories, and hook architecture rather than a single install manifest. Relevant internal surfaces include `.opencode/agent/README.txt`, `.opencode/command/create/assets/create_feature_catalog_confirm.yaml`, and `.opencode/skill/system-spec-kit/ARCHITECTURE.md`.

Adoption risk: medium-high, because a manifest would need to describe hooks, agents, skills, commands, and memory/indexing surfaces without pretending all runtimes have the same capabilities.

Follow-on packet: `058-runtime-target-manifest` — create a read-only manifest prototype for `.opencode`, `.claude`, `.codex`, and `.gemini` placement, then compare it against current hook and agent directory reality before any installer work.

### F-002: Adapt SPAR's four phase verbs as a user-facing map over our larger command set

Verdict: `adapt`

SPAR gives the user an obvious lifecycle: Specify, Plan, Act, Retain. The external root README presents that as the primary workflow, and the phase skills enforce the handoff boundaries in `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md`, `spar-plan/SKILL.md`, `spar-act/SKILL.md`, and `spar-retain/SKILL.md`.

The internal surface is more capable but harder to scan: six `/spec_kit:*` commands in `.opencode/command/spec_kit/`, four `/memory:*` commands documented in `.opencode/command/memory/README.txt`, and six `/create:*` commands under `.opencode/command/create/`. The comparison points to a UX layer, not a deletion target: `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:resume`, `/spec_kit:deep-research`, and `/spec_kit:deep-review` do different jobs than SPAR's compact public phase model.

Adoption risk: medium, because a too-simple phase map could hide important command suffixes like `:auto`, `:confirm`, `:with-phases`, and deep-loop executor choices.

Follow-on packet: `059-command-surface-matrix` — design a two-axis command map that keeps existing commands intact while giving users a SPAR-like lifecycle view: intake, plan, implement, complete/retain, recover, investigate.

### F-003: Adopt SPAR's phase-boundary language inside internal command prompts

Verdict: `adopt-as-is`

SPAR's individual skills are concise about what not to do in each phase. `spar-specify` forbids implementation planning, `spar-plan` asks before starting implementation, `spar-act` stops before retention, and `spar-retain` reconciles final artifacts before archiving. The relevant external files are `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md`, `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md`, `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-act/SKILL.md`, and `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-retain/SKILL.md`.

Internal commands already have strong gates and YAML ownership language, but they often lead with execution protocol complexity rather than the phase contract. Relevant internal surfaces are `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/complete.md`, and `.opencode/skill/system-spec-kit/SKILL.md`.

Adoption risk: low-medium, because this is mostly wording and guardrail placement; the risk is duplicating existing gates or creating contradictions with YAML-owned command steps.

Follow-on packet: `060-phase-boundary-copy-pass` — add compact phase-boundary summaries to the top of the major `/spec_kit:*` command docs, preserving YAML ownership and existing Gate 3 / validation contracts.

## Questions Answered

- Partial Q6: SPAR's npm installer pattern is valuable mainly as evidence for a target-config distribution model. Installing our full system-spec-kit through npm is not yet justified by this pass because our runtime hooks and memory subsystems are materially heavier than SPAR's payload.
- Partial Q2: A lifecycle map is plausible, but collapsing internal suffixes and deep-loop modes is not safe without a command-surface matrix. Existing `/spec_kit:*`, `/memory:*`, and `/create:*` contracts carry too many distinct responsibilities for a flat four-phase replacement.
- Q8: Evidence is thin for Axis 2, Axis 4, Axis 5, and Axis 6 because this iteration only skimmed root docs, skill docs, target configs, and command surfaces.

## Questions Remaining

- Q1 needs a focused managed-block pass over `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs` and the internal AGENTS.md sync triad.
- Q2 needs a suffix / mode matrix pass over `/spec_kit:*` command YAML assets and skill-advisor routing contracts.
- Q3 needs a template architecture pass over external `templates/spec.md`, `templates/plan.md`, and internal `.opencode/skill/system-spec-kit/templates/compose.sh`.
- Q4 and Q7 need the personas / tone pass over `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md` and SPAR's specify/plan prompt language.
- Q5 needs the tools.yaml pass over `.spar-kit/.local/tools.yaml` seed behavior and internal skill-advisor + MCP discovery.

## Next Focus

Iteration 2 should cover Axis 2 and Axis 4 together: read external `lib/repo-bootstrap.mjs`, `install-root/AGENTS.md`, `install-root/CLAUDE.md`, `templates/spec.md`, `templates/plan.md`, and internal `.opencode/skill/system-spec-kit/templates/compose.sh` plus the core/addendum template directories. The goal is to separate a small managed-block policy we can realistically adapt from template-composition ideas that need deeper design.
