---
title: "Consolidated Cross-Phase Research Report — 999 Agentic System Upgrade"
description: "Synthesis of 9 parallel deep-research phases investigating external agentic systems for system-spec-kit improvement opportunities. 14 must-have, 12 should-have, and 8 nice-to-have deduplicated findings aggregated from 222 raw actionable findings."
importance_tier: "critical"
contextType: "research"
---

# Consolidated Cross-Phase Research Report — 999 Agentic System Upgrade

## 1. Executive Summary

- Phases surveyed: 9 / 9
- Total iterations executed: 270
- External repos researched:
  - `001-agent-lightning-main` — agent-optimization framework centered on traces, adapters, reward payloads, and rollout control.
  - `002-babysitter-main` — process-as-code runtime with append-only journals, replay, hooks, and executable methodologies.
  - `003-claude-code-mastery-project-starter-kit-main` — Claude-first starter kit emphasizing guided commands, hooks, and lighter operator ergonomics.
  - `004-get-it-right-main` — retry-based brownfield coding workflow with explicit implement/check/review/refactor loop control.
  - `005-intellegix-code-agent-toolkit-master` — autonomous loop toolkit with completion gates, controller logic, and runtime-first test posture.
  - `006-ralph-main` — minimal fresh-context coding loop using tiny bridge artifacts, git lineage, and one-task-at-a-time discipline.
  - `007-relay-main` — transport-first multi-agent coordination system with readiness, routing, replay, and workflow primitives.
  - `008-bmad-autonomous-development` — skill-packaged sprint/story orchestrator with staged execution, model tiering, and guided setup.
  - `009-xethryon` — OpenCode fork focused on compact operator UX, prompt injection, ambient continuity, and lighter visible orchestration.
- Total actionable findings: 222
  - Must-have: 64
  - Should-have: 127
  - Nice-to-have: 31
- Total rejected recommendations: 48
- Total actionable findings after deduplication: 34
  - Must-have: 14
  - Should-have: 12
  - Nice-to-have: 8
- Total tokens consumed: `~2.4M` across the research program. This value comes from the operator brief; the phase artifacts themselves do not persist per-phase token totals.
- Top 10 cross-phase adoption opportunities for `system-spec-kit`:
  1. Runtime-own Gate 1 and routine Gate 2 behavior, while keeping Gate 3 explicit.
  2. Merge the public `plan -> implement -> complete` split behind one guided lifecycle front door.
  3. Split lightweight execution continuity from durable indexed memory.
  4. Replace level-first startup UX with named profiles and guided spec bootstrap.
  5. Collapse operator-facing policy into one authoritative contract with generated downstream guidance.
  6. Shift validation truth toward executable acceptance evidence, runtime scenarios, and thinner structural validators.
  7. Extract a shared lifecycle/deep-loop engine instead of duplicating YAML-driven orchestration.
  8. Shrink the public skill and agent taxonomy into a smaller set of domain facades.
  9. Make skill routing silent by default and only visible on ambiguity, conflict, or user request.
  10. Add shared workflow-profile configuration for model tiers, runtime manifests, continuation defaults, and common automation knobs.
- Critical bundles where 3+ phases converged:
  - Operator shell compression: `001, 002, 003, 004, 005, 006, 007, 008, 009`
  - Continuity split vs durable memory: `002, 003, 004, 005, 006, 007`
  - Profile-driven bootstrap and level hiding: `002, 003, 005, 008, 009`
  - Shared loop runtime under explicit deep-loop boundaries: `002, 004, 005, 007, 008, 009`
  - Validation as runtime truth: `001, 003, 005, 006, 007, 008`
  - Capability-surface consolidation: `001, 003, 004, 005, 006, 007, 008, 009`

## 2. Per-Phase Summary Table

| Phase | External repo | Iterations | Must | Should | Nice | Rejected | Headline finding |
|-------|---------------|------------|------|--------|------|----------|------------------|
| 001 | agent-lightning | 30 | 6 | 15 | 3 | 6 | Keep the core substrate, but hide lifecycle, routing, and capability ceremony behind a smaller operator shell. |
| 002 | babysitter | 30 | 8 | 16 | 3 | 3 | Runtime-owned policy, continuity-vs-memory separation, and shared iteration machinery are the main architectural lessons. |
| 003 | claude-code-mastery-project-starter-kit | 30 | 5 | 16 | 4 | 5 | Shrink visible ceremony, add guided work entry, and keep the stronger local substrate instead of mimicking starter-kit shallowness. |
| 004 | get-it-right | 30 | 13 | 13 | 0 | 4 | Retry/control patterns matter, but the bigger win is combining them with a much thinner default feature workflow. |
| 005 | intellegix-code-agent-toolkit | 30 | 6 | 14 | 4 | 6 | A typed controller plus behavior-first tests should sit underneath a thinner, profile-driven shell. |
| 006 | ralph | 30 | 6 | 14 | 5 | 5 | Split bridge continuity from archive memory, validate per task, and expose lightweight vs governed workflow lanes. |
| 007 | relay | 30 | 10 | 12 | 4 | 4 | One visible context story, one operator authority, and shared lifecycle machinery matter more than adopting a broker runtime. |
| 008 | bmad-autonomous-development | 30 | 7 | 14 | 1 | 8 | Guided bootstrap, bundled lifecycle entry, quieter safeguards, and shared workflow profiles are the real transfers. |
| 009 | xethryon | 30 | 3 | 13 | 7 | 7 | Selectively copy UX compression, not hidden autonomy; keep explicit memory and explicit deep-loop evidence. |

## 3. Aggregated Must-Have Findings

### CF-001 — Runtime-Owned Policy And Hidden Gate Defaults
- **Origin phase(s)**: `001/iteration-014`, `002/iteration-003`, `002/iteration-012`, `002/iteration-029`, `003/iteration-027`, `003/iteration-028`, `006/iteration-029`, `007/iteration-027`, `007/iteration-028`, `008/iteration-027`, `008/iteration-028`, `009/iteration-027`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:156-162]` `[SOURCE: 002-babysitter-main/research/research.md:124-135]` `[SOURCE: 002-babysitter-main/research/research.md:216-221]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:198-209]` `[SOURCE: 006-ralph-main/research/research.md:222-228]` `[SOURCE: 007-relay-main/research/research.md:203-214]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:199-212]` `[SOURCE: 009-xethryon/research/research.md:81-82]`
- **system-spec-kit target**: `AGENTS.md`, `CLAUDE.md`, `.opencode/skill/system-spec-kit/constitutional/`, `.opencode/skill/scripts/skill_advisor.py`, runtime hooks and wrappers
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: `001, 002, 003, 006, 007, 008, 009`
- **Adoption summary**: The strongest convergence is to stop treating Gate 1 and routine Gate 2 behavior as front-door operator rituals. The reports consistently recommend preserving the safety intent, keeping Gate 3 explicit for file-modifying scope binding, and moving the rest into runtime-owned defaults, exception handling, and compact preflight summaries.
- **Evidence**: The Babysitter, Starter Kit, Relay, Ralph, BAD, and Xethryon phases all independently recommend hiding most routing and gating mechanics while preserving or strengthening enforcement.
- **Risk / dependencies**: Requires one canonical policy source before any documentation or wrapper generation can be trusted.

### CF-002 — One Guided Lifecycle Front Door
- **Origin phase(s)**: `001/iteration-022`, `002/iteration-021`, `003/iteration-021`, `003/iteration-029`, `004/iteration-021`, `004/iteration-029`, `005/iteration-021`, `006/iteration-022`, `006/iteration-030`, `007/iteration-021`, `007/iteration-029`, `008/iteration-022`, `008/iteration-029`, `009/iteration-021`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:193-199]` `[SOURCE: 002-babysitter-main/research/research.md:174-179]` `[SOURCE: 004-get-it-right-main/research/research.md:164-169]` `[SOURCE: 004-get-it-right-main/research/research.md:212-244]` `[SOURCE: 007-relay-main/research/research.md:173-178]` `[SOURCE: 007-relay-main/research/research.md:215-220]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:171-177]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:213-221]` `[SOURCE: 009-xethryon/research/research.md:77-78]`
- **system-spec-kit target**: `.opencode/command/spec_kit/README.txt`, `plan.md`, `implement.md`, `complete.md`, shared lifecycle assets
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: all `9` phases
- **Adoption summary**: Every high-signal phase concluded that `plan`, `implement`, and `complete` are justified internal states but too exposed as public entrypoints. The combined recommendation is a guided `start/work` style front door that internally routes to the right phase, preserves advanced commands, and absorbs the most common save/resume handoffs.
- **Evidence**: The same theme appears in Agent Lightning, Babysitter, Starter Kit, Get It Right, Relay, BAD, Ralph, Intellegix, and Xethryon.
- **Risk / dependencies**: Depends on continuity, bootstrap, and policy redesign so the new front door can remain small.

### CF-003 — Split Lightweight Continuity From Durable Memory
- **Origin phase(s)**: `002/iteration-013`, `003/iteration-013`, `004/iteration-014`, `005/iteration-012`, `006/iteration-012`, `007/iteration-012`
- **External source**: `[SOURCE: 002-babysitter-main/research/research.md:130-135]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:101-106]` `[SOURCE: 004-get-it-right-main/research/research.md:123-128]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:103-109]` `[SOURCE: 006-ralph-main/research/research.md:122-128]` `[SOURCE: 007-relay-main/research/research.md:129-134]`
- **system-spec-kit target**: memory save workflow, `generate-context`, handover/resume surfaces, session bootstrap/resume handlers
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: `002, 003, 004, 005, 006, 007`
- **Adoption summary**: The combined research is unusually consistent here: the current memory platform is valuable, but it is carrying too much next-iteration continuity load. A smaller execution bridge should own immediate resumption, while durable memory stays responsible for indexed recall, governance, enrichment, and archival truth.
- **Evidence**: Six phases independently argued for a bridge-vs-archive split, even when they disagreed on almost everything else.
- **Risk / dependencies**: Migration must preserve current retrieval quality and avoid duplicating state between bridge artifacts and durable memory.

### CF-004 — Shift Validation Truth Toward Executable Evidence And Runtime Tests
- **Origin phase(s)**: `001/iteration-012`, `003/iteration-016`, `005/iteration-010`, `005/iteration-016`, `006/iteration-014`, `007/iteration-015`, `008/iteration-019`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:142-148]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:119-124]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:88-93]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:131-137]` `[SOURCE: 006-ralph-main/research/research.md:136-142]` `[SOURCE: 007-relay-main/research/research.md:147-152]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:148-154]`
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, runtime test suites, readiness output surfaces
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: `001, 003, 005, 006, 007, 008`
- **Adoption summary**: The research consistently recommends keeping structural validation, but no longer treating it as the only truth source for automation-heavy workflows. Task-scoped executable acceptance evidence, scenario-first runtime tests, and machine-generated readiness views should become primary, with structural validation reduced to integrity, safety, and packaging guarantees.
- **Evidence**: This is the clearest multi-phase convergence around quality architecture, not just UX.
- **Risk / dependencies**: Requires a staged compatibility plan so current `validate.sh` users do not lose guarantees mid-transition.

### CF-005 — Replace Level-First Startup With Named Profiles And Guided Bootstrap
- **Origin phase(s)**: `002/iteration-011`, `003/iteration-023`, `005/iteration-023`, `008/iteration-023`, `009/iteration-023`
- **External source**: `[SOURCE: 002-babysitter-main/research/research.md:104-116]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:180-185]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:168-174]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:178-184]` `[SOURCE: 009-xethryon/research/research.md:77-78]`
- **system-spec-kit target**: `level_specifications.md`, `template_guide.md`, `templates/README.md`, `create.sh`, guided bootstrap surfaces
- **Change type**: redesign
- **Blast radius**: medium-large
- **Cross-phase convergence**: `002, 003, 005, 008, 009`
- **Adoption summary**: The consensus is not to delete levels. It is to stop making them the first thing an operator has to understand. Named work profiles, guided bootstrap, and required-file previews should sit above the existing Level 1/2/3+ model, which remains valuable as internal governance and validation metadata.
- **Evidence**: This convergence is especially strong across the UX-heavy Starter Kit, BAD, Intellegix, and Xethryon phases.
- **Risk / dependencies**: Must maintain backwards-compatible spec semantics and validator behavior.

### CF-006 — Extract A Shared Loop Controller And Lifecycle Engine
- **Origin phase(s)**: `002/iteration-014`, `004/iteration-020`, `005/iteration-013`, `007/iteration-011`, `007/iteration-030`, `008/iteration-013`, `009/iteration-030`
- **External source**: `[SOURCE: 002-babysitter-main/research/research.md:136-141]` `[SOURCE: 004-get-it-right-main/research/research.md:147-163]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:110-116]` `[SOURCE: 007-relay-main/research/research.md:123-128]` `[SOURCE: 007-relay-main/research/research.md:221-228]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:127-133]` `[SOURCE: 009-xethryon/research/research.md:84-84]`
- **system-spec-kit target**: deep-research/review lifecycle assets, lifecycle command assets, shared controller modules under `scripts/` and/or command runtime
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: `002, 004, 005, 007, 008, 009`
- **Adoption summary**: The repo has accumulated parallel loop stacks and repeated orchestration shells. The converged recommendation is to preserve domain-specific commands and LEAF semantics, but extract a typed shared controller and thinner per-workflow deltas so lifecycle assets stop repeating the same orchestration skeleton.
- **Evidence**: This theme emerged from both runtime-heavy phases and UX-heavy phases, which is why it should be treated as a platform concern rather than a cleanup task.
- **Risk / dependencies**: The non-goal is explicit: do not replace domain-specific research/review semantics with a generic external DSL.

### CF-007 — Shrink The Public Agent And Context Surface To Domain Facades
- **Origin phase(s)**: `001/iteration-025`, `003/iteration-024`, `004/iteration-025`, `005/iteration-024`, `006/iteration-025`, `007/iteration-024`, `008/iteration-024`, `009/iteration-024`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:214-220]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:186-191]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:175-181]` `[SOURCE: 006-ralph-main/research/research.md:201-207]` `[SOURCE: 007-relay-main/research/research.md:191-196]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:185-191]` `[SOURCE: 009-xethryon/research/research.md:79-80]`
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`, `context.md`, `context-prime.md`, `handover.md`, public command/help surfaces
- **Change type**: merge/redesign
- **Blast radius**: medium-large
- **Cross-phase convergence**: `001, 003, 004, 005, 006, 007, 008, 009`
- **Adoption summary**: The research does not argue for deleting specialist prompts. It argues for shrinking the visible role vocabulary: operators should meet a smaller set of domain facades, while narrow specialists remain internal or escalation-only.
- **Evidence**: This is especially strong around context bootstrap, retrieval, and continuation roles.
- **Risk / dependencies**: Must preserve file-ownership rules and specialist-only workflows where they are materially different.

### CF-008 — Consolidate Public Skills And Make Routing Silent By Default
- **Origin phase(s)**: `001/iteration-027`, `001/iteration-028`, `002/iteration-027`, `002/iteration-028`, `003/iteration-026`, `003/iteration-027`, `004/iteration-027`, `005/iteration-026`, `005/iteration-027`, `006/iteration-027`, `006/iteration-028`, `007/iteration-026`, `007/iteration-027`, `008/iteration-026`, `008/iteration-027`, `009/iteration-026`, `009/iteration-027`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:229-241]` `[SOURCE: 002-babysitter-main/research/research.md:204-215]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:192-209]` `[SOURCE: 004-get-it-right-main/research/research.md:200-205]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:182-195]` `[SOURCE: 006-ralph-main/research/research.md:208-221]` `[SOURCE: 007-relay-main/research/research.md:197-208]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:192-205]` `[SOURCE: 009-xethryon/research/research.md:80-82]`
- **system-spec-kit target**: `.opencode/skill/README.md`, `sk-code-*`, `sk-review`, `skill_advisor.py`, Gate 2 surfaces
- **Change type**: merge/simplify
- **Blast radius**: large
- **Cross-phase convergence**: all `9` phases
- **Adoption summary**: The skill substrate is widely seen as valuable, but its public packaging is too fragmented. The combined recommendation is one smaller coding/workflow surface, fewer public skill brands, and mostly invisible routing unless ambiguity or user override makes the choice itself useful.
- **Evidence**: This is one of the strongest all-phase convergences in the research corpus.
- **Risk / dependencies**: Routing telemetry, documentation, and fallback logic all need to move together or the new shell will drift immediately.

### CF-009 — Collapse Operator Guidance To One Authority And Generate The Rest
- **Origin phase(s)**: `001/iteration-029`, `002/iteration-029`, `003/iteration-028`, `004/iteration-029`, `005/iteration-028`, `007/iteration-028`, `008/iteration-028`, `009/iteration-028`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:242-248]` `[SOURCE: 002-babysitter-main/research/research.md:216-221]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:204-209]` `[SOURCE: 004-get-it-right-main/research/research.md:206-211]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:196-202]` `[SOURCE: 007-relay-main/research/research.md:209-214]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:206-212]` `[SOURCE: 009-xethryon/research/research.md:82-82]`
- **system-spec-kit target**: `AGENTS.md`, `CLAUDE.md`, constitutional summaries, command surfaces, generated docs/helpers
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: `001, 002, 003, 004, 005, 007, 008, 009`
- **Adoption summary**: The operator contract is currently spread across too many partially overlapping files. The combined research pushes toward one authoritative contract that defines policy and behavior, with generated or derived downstream surfaces for runtime-specific and domain-specific detail.
- **Evidence**: Multiple phases explicitly call out the same failure mode: the shell is too exposed and too hand-maintained.
- **Risk / dependencies**: The policy-source question must be resolved before refactoring public docs.

### CF-010 — Strengthen Deep-Loop Runtime Truth: Stop Reasons, Resume Semantics, Metrics, And Journals
- **Origin phase(s)**: `001/iteration-008`, `001/iteration-013`, `002/iteration-001`, `002/iteration-002`, `005/iteration-001`, `005/iteration-004`, `005/iteration-010`, `007/iteration-013`, `008/iteration-012`, `008/iteration-019`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:126-148]` `[SOURCE: 002-babysitter-main/research/research.md:62-72]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:46-69]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:88-93]` `[SOURCE: 007-relay-main/research/research.md:135-140]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:120-126]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:148-154]`
- **system-spec-kit target**: deep-research/deep-review runtime, `session-resume`, `session-bootstrap`, state/journal helpers, loop dashboards
- **Change type**: refactor/add
- **Blast radius**: medium-large
- **Cross-phase convergence**: `001, 002, 005, 007, 008`
- **Adoption summary**: The loop substrate needs clearer stop reasons, richer runtime health signals, explicit resume/start-from semantics, and a better audit trail than "JSONL plus hope". This is not a call to abandon file-mediated loops; it is a call to make their active truth more robust and easier to recover.
- **Evidence**: This bundle pulls together metrics, journals, stop reasons, and continuation semantics from five different research tracks.
- **Risk / dependencies**: Must stay consistent with the push to slim live contracts rather than re-bloat them.

### CF-011 — Add Task-Sized Execution Lanes, Retry Control, And Stage Contracts
- **Origin phase(s)**: `004/iteration-001` through `004/iteration-020`, `006/iteration-005`, `006/iteration-009`, `006/iteration-014`
- **External source**: `[SOURCE: 004-get-it-right-main/research/research.md:47-104]` `[SOURCE: 004-get-it-right-main/research/research.md:105-163]` `[SOURCE: 006-ralph-main/research/research.md:57-70]` `[SOURCE: 006-ralph-main/research/research.md:136-142]`
- **system-spec-kit target**: implementation workflow assets, future retry controller, tasks template, review-agent strategy contract
- **Change type**: architectural shift
- **Blast radius**: medium-large
- **Cross-phase convergence**: `004, 006`
- **Adoption summary**: The code-execution lane needs a tighter unit of work. That means one verified task/story per run, opt-in retry control instead of ad hoc looping, explicit stage contracts, and objective pre-review gates before expensive semantic review or packet-level completion work.
- **Evidence**: Get It Right drives the controller shape; Ralph reinforces the one-task-per-run discipline and task-sized acceptance evidence.
- **Risk / dependencies**: Must remain opt-in and phase-scoped rather than becoming the default for all implementation.

### CF-012 — Centralize Workflow Profiles, Runtime Manifests, And Model Tiering
- **Origin phase(s)**: `002/iteration-007`, `005/iteration-014`, `008/iteration-006`, `008/iteration-013`, `007/iteration-016`
- **External source**: `[SOURCE: 002-babysitter-main/research/research.md:98-103]` `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:117-123]` `[SOURCE: 007-relay-main/research/research.md:153-158]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:90-96]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:127-133]`
- **system-spec-kit target**: shared workflow-profile layer, harness/runtime manifest resolver, model tier keys, provider registry
- **Change type**: refactor/pivot
- **Blast radius**: medium-large
- **Cross-phase convergence**: `002, 005, 007, 008`
- **Adoption summary**: Multiple phases identify the same missing middle layer: repo-wide workflow profiles and runtime manifests that sit between raw env vars and duplicated per-command YAML. This layer should own model tiers, runtime capability branching, continuation defaults, and shared provider/runtime metadata.
- **Evidence**: BAD, Babysitter, Relay, and Intellegix all point to the same config-shaping gap from different directions.
- **Risk / dependencies**: A bad central profile layer would become a new drift hub; generation and parity tests are mandatory.

### CF-013 — Import Secret Guardrails As An Immediate Tactical Win
- **Origin phase(s)**: `003/iteration-006`
- **External source**: `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:71-76]`
- **system-spec-kit target**: Claude-capable runtime settings, stop hooks, secret verification helpers
- **Change type**: add
- **Blast radius**: small
- **Cross-phase convergence**: `003` only
- **Adoption summary**: This is the clearest low-blast-radius tactical import in the whole program: bring stronger secret-detection and secret-verification checks into the existing stop-hook or runtime-policy layer.
- **Evidence**: The Starter Kit phase treats this as the most concrete short-term safety win.
- **Risk / dependencies**: Runtime-specific first; broader multi-runtime rollout can follow.

### CF-014 — Add A Claim-Verification Ledger For Research Quality
- **Origin phase(s)**: `009/iteration-010`, `009/iteration-012`
- **External source**: `[SOURCE: 009-xethryon/research/research.md:62-71]`
- **system-spec-kit target**: `.opencode/agent/deep-research.md`, research packet templates, research reducers
- **Change type**: add
- **Blast radius**: small-medium
- **Cross-phase convergence**: `009` only
- **Adoption summary**: Xethryon contributed the strongest research-quality improvement: make major external claims carry an explicit status such as `verified`, `contradicted`, or `unresolved`, and tie those statuses to concrete evidence in the packet.
- **Evidence**: This directly addresses over-trusting README claims and runtime marketing surfaces.
- **Risk / dependencies**: Needs lightweight ergonomics or it will become another unmaintained ledger.

## 4. Aggregated Should-Have Findings

### CF-015 — Add A Unified Context Concierge And Merge The Visible Continuity Story
- **Origin phase(s)**: `002/iteration-022`, `002/iteration-024`, `003/iteration-024`, `006/iteration-025`, `007/iteration-022`, `007/iteration-024`, `009/iteration-024`
- **External source**: `[SOURCE: 002-babysitter-main/research/research.md:180-197]` `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:186-191]` `[SOURCE: 006-ralph-main/research/research.md:201-207]` `[SOURCE: 007-relay-main/research/research.md:179-196]` `[SOURCE: 009-xethryon/research/research.md:79-83]`
- **system-spec-kit target**: `resume.md`, memory command discovery, `context.md`, `context-prime.md`, `handover.md`
- **Change type**: merge
- **Blast radius**: medium
- **Cross-phase convergence**: `002, 003, 006, 007, 009`
- **Adoption summary**: Users should not have to pre-classify whether they need resume, search, save, or manage. A single continuity/context concierge can front that capability while narrower commands and roles remain available underneath.
- **Evidence**: This complements, rather than duplicates, the lifecycle-front-door recommendation.
- **Risk / dependencies**: Must avoid turning the concierge into another verbose command index.

### CF-016 — Add A Guided Spec-Level Chooser With Validator And File Previews
- **Origin phase(s)**: `003/iteration-023`, `008/iteration-023`, `009/iteration-023`
- **External source**: `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:180-185]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:178-184]` `[SOURCE: 009-xethryon/research/research.md:77-78]`
- **system-spec-kit target**: templates README, bootstrap helpers, `speckit` guidance, template docs
- **Change type**: add
- **Blast radius**: medium
- **Cross-phase convergence**: `003, 008, 009`
- **Adoption summary**: Several phases specifically recommend a guided chooser that previews required files, validator expectations, and likely level/profile outcomes instead of teaching template taxonomy first.
- **Evidence**: This is a direct UX-onboarding improvement that reinforces `CF-005`.
- **Risk / dependencies**: The chooser must reflect the real validator and template rules, not a second hand-maintained summary.

### CF-017 — Generate Shared Provider Registries And Machine-Readable Mirrors
- **Origin phase(s)**: `003/iteration-017`, `007/iteration-016`, `007/iteration-020`
- **External source**: `[SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:125-130]` `[SOURCE: 007-relay-main/research/research.md:153-170]`
- **system-spec-kit target**: provider delegation references, command READMEs, generated doc/mirror tooling
- **Change type**: refactor
- **Blast radius**: medium
- **Cross-phase convergence**: `003, 007`
- **Adoption summary**: The repo has multiple parallel references that should be generated from one canonical provider/runtime registry. This is the low-risk route to parity across Codex, Gemini, Copilot, and future runtime-facing surfaces.
- **Evidence**: Relay is the strongest structural case; Starter Kit contributes the manifest/help angle.
- **Risk / dependencies**: Must start with a bounded doc family before expanding generation further.

### CF-018 — Name Coordination Shapes Explicitly: Team, Fan-Out, And Pipeline
- **Origin phase(s)**: `007/iteration-006`
- **External source**: `[SOURCE: 007-relay-main/research/research.md:97-102]`
- **system-spec-kit target**: orchestrator docs, parallel dispatch guidance, deep-research coordination language
- **Change type**: add
- **Blast radius**: small-medium
- **Cross-phase convergence**: `007` only
- **Adoption summary**: Public already uses these coordination shapes implicitly. Naming them explicitly would improve prompts, docs, and future automation without committing to a broker runtime.
- **Evidence**: Relay frames this cleanly enough to be worth adopting directly.
- **Risk / dependencies**: Should stay vocabulary-first until a transport/runtime layer actually needs stronger semantics.

### CF-019 — Enrich Continuity With Git Lineage, Progress Logs, And Orientation Artifacts
- **Origin phase(s)**: `006/iteration-003`, `006/iteration-004`, `009/iteration-003`, `009/iteration-018`
- **External source**: `[SOURCE: 006-ralph-main/research/research.md:78-91]` `[SOURCE: 009-xethryon/research/research.md:65-75]`
- **system-spec-kit target**: `generate-context`, session bootstrap/resume, new progress-log template or lightweight orientation output
- **Change type**: add
- **Blast radius**: small-medium
- **Cross-phase convergence**: `006, 009`
- **Adoption summary**: Several lighter-weight continuity improvements recur: append-only progress snippets, git lineage, branch-aware orientation, and runtime-agnostic continuity summaries. These are useful because they add bridge clarity without redefining the durable memory system.
- **Evidence**: Ralph and Xethryon converge on "small continuity artifacts help a lot".
- **Risk / dependencies**: Keep these artifacts non-authoritative and derived where possible.

### CF-020 — Extend Reconsolidation Beyond Save-Time Into Durable Pending State
- **Origin phase(s)**: `009/iteration-004`, `009/iteration-014`
- **External source**: `[SOURCE: 009-xethryon/research/research.md:63-72]`
- **system-spec-kit target**: `reconsolidation-bridge.ts`, save pipeline
- **Change type**: refactor
- **Blast radius**: small-medium
- **Cross-phase convergence**: `009` only
- **Adoption summary**: Reconsolidation should not be treated as a save-only event. Xethryon argues for a deferred cadence and durable pending-state tracking so long-running work can be cleaned up predictably instead of opportunistically.
- **Evidence**: This is a focused improvement with a clear existing target.
- **Risk / dependencies**: Must remain subordinate to the memory split in `CF-003`.

### CF-021 — Add Research-Quality Add-Ons: Publication Critique, Runtime Inventory, And Promotion Checkpoints
- **Origin phase(s)**: `006/iteration-008`, `009/iteration-005`, `009/iteration-011`
- **External source**: `[SOURCE: 006-ralph-main/research/research.md:92-98]` `[SOURCE: 009-xethryon/research/research.md:64-70]`
- **system-spec-kit target**: deep-research assets, reducers, research closeout
- **Change type**: add
- **Blast radius**: small-medium
- **Cross-phase convergence**: `006, 009`
- **Adoption summary**: These are not architectural pivots, but they are valuable research-quality upgrades: explicit publication critique, explicit runtime-surface inventories, and explicit promotion checkpoints for reusable guidance.
- **Evidence**: Both phases focus on making research output easier to trust and operationalize.
- **Risk / dependencies**: Keep optional or lightweight to avoid bloating the live loop contract.

### CF-022 — Add Explicit Continue/Pause/Resume Branches And A Fast Continuation Profile
- **Origin phase(s)**: `005/iteration-029`, `007/iteration-013`, `008/iteration-012`
- **External source**: `[SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:203-211]` `[SOURCE: 007-relay-main/research/research.md:135-140]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:120-126]`
- **system-spec-kit target**: continuation logic in lifecycle and deep-loop assets, bound-work fast path
- **Change type**: add/refactor
- **Blast radius**: medium
- **Cross-phase convergence**: `005, 007, 008`
- **Adoption summary**: The current continuation experience is too re-initialization-heavy. Multiple phases recommend explicit continuation branches and a reduced-friction path for already-bound work or small deltas.
- **Evidence**: This is a practical complement to both the lifecycle-front-door and continuity-split recommendations.
- **Risk / dependencies**: Needs stable policy defaults or it simply becomes another visible mode explosion.

### CF-023 — Add Thin Presets, Aliases, And Lightweight Vs Governed Workflow Lanes
- **Origin phase(s)**: `001/iteration-030`, `006/iteration-020`, `006/iteration-030`, `008/iteration-018`
- **External source**: `[SOURCE: 001-agent-lightning-main/research/research.md:249-254]` `[SOURCE: 006-ralph-main/research/research.md:171-177]` `[SOURCE: 006-ralph-main/research/research.md:229-237]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:141-147]`
- **system-spec-kit target**: quick reference, command aliases, guided wrappers, lane selection
- **Change type**: add/simplify
- **Blast radius**: medium
- **Cross-phase convergence**: `001, 006, 008`
- **Adoption summary**: Not every improvement needs a giant redesign. Several phases recommend thinner alias or preset entrypoints, plus a clear lightweight-vs-governed lane model, as an incremental way to improve the shell immediately.
- **Evidence**: This is the lowest-risk path to reduce day-to-day friction while larger refactors are planned.
- **Risk / dependencies**: Alias surfaces must not become yet another parallel command family.

### CF-024 — Add A Readiness Ledger For Phased Work
- **Origin phase(s)**: `008/iteration-002`
- **External source**: `[SOURCE: 008-bmad-autonomous-development/research/research.md:69-75]`
- **system-spec-kit target**: phased-work definitions and recursive completion state
- **Change type**: add
- **Blast radius**: medium
- **Cross-phase convergence**: `008` only
- **Adoption summary**: BAD contributes one useful phased-work concept that does not require importing sprint automation wholesale: a readiness ledger that distinguishes planned dependencies from merged/completed truth.
- **Evidence**: This would improve phase orchestration and recursive completion integrity without touching the core lifecycle model.
- **Risk / dependencies**: Best treated as a phase-system enhancement, not a general runtime dependency.

### CF-025 — Keep PR Watch/Repair And Sprint Runners As Opt-In Extensions
- **Origin phase(s)**: `008/iteration-007`, `008/iteration-020`
- **External source**: `[SOURCE: 008-bmad-autonomous-development/research/research.md:97-103]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:155-161]`
- **system-spec-kit target**: `sk-git`, future extension packets, not core lifecycle contracts
- **Change type**: extension-layer add
- **Blast radius**: medium
- **Cross-phase convergence**: `008` only
- **Adoption summary**: There is real value in PR watch/repair loops and domain automation, but the synthesis is clear that these belong as optional extension layers above stable primitives, not in the core shell.
- **Evidence**: BAD is the main evidence source, and its own architecture reinforces keeping these features domain-bounded.
- **Risk / dependencies**: Do not let extension logic bleed into general-purpose git or core spec-kit behavior.

### CF-026 — Generate Runtime Mirrors Instead Of Paying Manual Mirror Tax
- **Origin phase(s)**: `002/iteration-016`, `008/iteration-016`
- **External source**: `[SOURCE: 002-babysitter-main/research/research.md:148-153]` `[SOURCE: 008-bmad-autonomous-development/research/research.md:134-140]`
- **system-spec-kit target**: runtime mirror directories, specialist agent/skill packaging, parity tests
- **Change type**: refactor
- **Blast radius**: medium
- **Cross-phase convergence**: `002, 008`
- **Adoption summary**: Several phases argue that the problem is not specialist roles themselves; it is the cost of mirroring and exposing them manually across runtimes. A generated mirror path would preserve specialization while reducing drift and explanation cost.
- **Evidence**: This is a practical complement to the capability-facade work.
- **Risk / dependencies**: Requires canonical metadata first; otherwise generation will just automate inconsistency.

## 5. Nice-to-Have Findings (brief)

- `CF-027 — Optional council-style synthesis profile` from `005/iteration-007`; useful for ambiguous research or architecture packets, but too expensive and failure-prone for the default path. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:76-81]
- `CF-028 — Visual lifecycle explainer` from `006/iteration-019`; a diagram or interactive explainer would lower onboarding friction for a governance-heavy framework. [SOURCE: 006-ralph-main/research/research.md:164-170]
- `CF-029 — Ephemeral non-authoritative run-state overlay` from `006/iteration-016`; a `scratch/`-style bridge artifact could help local recovery while staying subordinate to durable memory and packet truth. [SOURCE: 006-ralph-main/research/research.md:150-156]
- `CF-030 — Packet-local coordination board for very large agentic work` from `009/iteration-009`; useful for high-scale orchestration, but unnecessary before the core shell is simplified. [SOURCE: 009-xethryon/research/research.md:68-69]
- `CF-031 — Read-only project orientation surface` from `009/iteration-002`; derive a light orientation layer from packet artifacts without re-authoring memory truth. [SOURCE: 009-xethryon/research/research.md:67-67]
- `CF-032 — Bootstrap git snapshot plus mode/status hints` from `009/iteration-006` and `009/iteration-020`; helpful for recovery ergonomics after the more structural shell work lands. [SOURCE: 009-xethryon/research/research.md:68-76]
- `CF-033 — Component registry / executable methodology pack experiments` from `001/iteration-005` and `002/iteration-006`; only justified if the repo eventually supports multiple loop backends or reusable domain workflow packs. [SOURCE: 001-agent-lightning-main/research/research.md:110-117] [SOURCE: 002-babysitter-main/research/research.md:92-97]
- `CF-034 — Working-brief / compressed-brief mid-layer artifacts` from `003/iteration-003` and `003/iteration-004`; useful as an operator convenience layer between full packets and raw scratch notes. [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:53-64]

## 6. Rejected Recommendations (brief)

- `CR-001 — Do not replace slash-command discovery problems with a single binary front door`; multiple phases conclude the issue is taxonomy and UX, not transport. [SOURCE: 001-agent-lightning-main/research/research.md:278-280]
- `CR-002 — Do not replace spec folders and Level 1/2/3+ with thinner generic docs or PRD-only artifacts`; the right fix is gentler onboarding, not removal of governance depth. [SOURCE: 006-ralph-main/research/research.md:252-258] [SOURCE: 008-bmad-autonomous-development/research/research.md:238-246]
- `CR-003 — Do not replace durable, file-first memory with local state, ambient repo markdown, or an imported retrieval engine`; thinner systems omit that layer because they solve narrower problems. [SOURCE: 001-agent-lightning-main/research/research.md:270-272] [SOURCE: 009-xethryon/research/research.md:89-91]
- `CR-004 — Do not fully collapse advanced /memory administration into the main lifecycle`; common save/resume should become easier, but governance/admin/search remain distinct capabilities. [SOURCE: 008-bmad-autonomous-development/research/research.md:256-256] [SOURCE: 009-xethryon/research/research.md:94-94]
- `CR-005 — Do not replace explicit LEAF deep loops and externalized state with hidden iteration, shell runners, or a generic external DSL`; extract shared mechanics, but keep explicit evidence-heavy research/review products. [SOURCE: 007-relay-main/research/research.md:235-247] [SOURCE: 009-xethryon/research/research.md:95-95]
- `CR-006 — Do not import full external runtimes such as broker architectures, plugin marketplaces, compression stacks, or sprint runners into the core`; extension-layer discipline is part of the convergence. [SOURCE: 002-babysitter-main/research/research.md:254-262] [SOURCE: 008-bmad-autonomous-development/research/research.md:224-232]
- `CR-007 — Do not default to auto-worktrees, sequential auto-merge, or undo-only retry refactors in the core workflow`; those patterns assume a tighter coordinator boundary than the current repo can safely assume. [SOURCE: 004-get-it-right-main/research/research.md:245-259] [SOURCE: 008-bmad-autonomous-development/research/research.md:224-232]
- `CR-008 — Do not tear down validation or governance simply because thinner repos omit them`; the consistent message is to retarget and hide validation, not delete it. [SOURCE: 008-bmad-autonomous-development/research/research.md:242-246]
- `CR-009 — Do not treat external guard claims as verified enforcement or import autonomous skill execution without evidence`; where hard technical evidence was absent, the safer recommendation was explicit non-adoption. [SOURCE: 008-bmad-autonomous-development/research/research.md:232-236] [SOURCE: 009-xethryon/research/research.md:90-90]
- `CR-010 — Do not replace task-tool orchestration with a full Relay-style broker today`; transport-first runtime replacement is outside the intended scope of this research train. [SOURCE: 007-relay-main/research/research.md:227-231]

## 7. Cross-Phase Themes

### Theme T-001 — Operator Shell Compression
- **Phases converging**: `001, 002, 003, 004, 005, 006, 007, 008, 009`
- **Core insight**: The repo's biggest current problem is exposed ceremony, not missing raw capability.
- **Combined adoption story**: Multiple phases independently say the same thing in different words: hide lifecycle branching, route skills automatically, collapse visible agent/skill taxonomies, and replace doctrine-heavy onboarding with guided defaults.

### Theme T-002 — Continuity Is Not The Same Thing As Durable Memory
- **Phases converging**: `002, 003, 004, 005, 006, 007`
- **Core insight**: Recovery and next-run continuity need a smaller, faster contract than archival semantic memory.
- **Combined adoption story**: The strongest architectural throughline after shell compression is a two-lane state model: a lightweight execution bridge plus durable promoted memory.

### Theme T-003 — Profiles Beat Taxonomy At The Front Door
- **Phases converging**: `002, 003, 005, 008, 009`
- **Core insight**: Operators reason better from intents and named profiles than from level numbers, command families, or validator architecture.
- **Combined adoption story**: Keep levels and advanced commands internally, but expose guided profile selection, wizard-style bootstrap, and starter packets on the common path.

### Theme T-004 — Policy Must Become Runtime Truth
- **Phases converging**: `001, 002, 003, 005, 006, 007, 008, 009`
- **Core insight**: Written policy without runtime ownership creates teaching cost and drift.
- **Combined adoption story**: Consolidate operator rules into one authoritative source, generate supporting surfaces, and make Gate 1/routine Gate 2 behavior mostly implicit.

### Theme T-005 — Validation Should Follow Runtime Evidence
- **Phases converging**: `001, 003, 005, 006, 007, 008`
- **Core insight**: The repo already has strong structural validation, but automation-heavy flows need task evidence and executable scenarios as first-class truth.
- **Combined adoption story**: Preserve strictness, but move runtime truth to tests, stop reasons, acceptance evidence, and derived readiness views.

### Theme T-006 — Shared Loop Mechanics, Explicit Deep-Loop Products
- **Phases converging**: `002, 004, 005, 007, 008, 009`
- **Core insight**: The repo should share lifecycle mechanics without collapsing research and review into a generic hidden workflow DSL.
- **Combined adoption story**: Extract common controllers, journal/state helpers, and resume branches while preserving explicit LEAF evidence-heavy products.

### Theme T-007 — Capability Packaging Matters More Than Capability Count
- **Phases converging**: `001, 003, 004, 005, 006, 007, 008, 009`
- **Core insight**: Specialists are often justified; the visible packaging is the bigger problem.
- **Combined adoption story**: Merge public agent and skill UX into domain facades, generate mirrors, and keep niche specialists opt-in or internal.

### Theme T-008 — Extension-Layer Discipline
- **Phases converging**: `004, 007, 008`
- **Core insight**: Retry controllers, sprint runners, PR watch loops, and transport primitives are valuable, but they should consume the core substrate rather than expand the core by default.
- **Combined adoption story**: Stabilize the shell and runtime substrate first, then build domain-specific automation as extension packets.

## 8. Refactor / Pivot / Simplify / UX Recommendations

### Memory System
- **Keep**: file-first durable memory, advanced search/governance/admin surfaces, explicit save quality controls.
- **Refactor**: split execution continuity from durable promoted memory; treat reconsolidation and closeout as bridge-to-archive operations.
- **Simplify**: move common save/resume/recall into the lifecycle shell so memory stops feeling like a second product.
- **Pivot**: do not let durable memory own all next-run continuity; give it archival and recall authority instead.

### Gate System And Operator Contract
- **Keep**: Gate 3 as the explicit scope-binding boundary for file modification.
- **Refactor**: move Gate 1 and routine Gate 2 decisions into runtime-owned defaults, escalation paths, and ambiguity handling.
- **Simplify**: replace doctrine-heavy gate exposition with compact preflight summaries and guided defaults.
- **Pivot**: collapse `AGENTS.md`, `CLAUDE.md`, constitutional gate docs, and hook-facing guidance behind one authoritative policy source.

### Validation Pipeline
- **Keep**: strict structural validation and multi-file drift detection.
- **Refactor**: decompose `validate.sh`, shift readiness truth toward executable task evidence, and back automation-heavy workflows with scenario tests.
- **Simplify**: hide rule names, template taxonomy, and validator jargon from the common path.
- **Pivot**: treat runtime truth as testable behavior plus acceptance evidence, not only as checklist state.

### Agent Architecture
- **Keep**: specialist roles where they materially improve execution quality or file-ownership safety.
- **Refactor**: reduce mirror tax with canonical metadata and generated mirrors.
- **Simplify**: present one smaller context/continuity story and fewer public role identities.
- **Pivot**: future automation should ship as domain coordinators/facades, not as more exposed generic agent taxonomy.

### Skills System
- **Keep**: modular overlays and niche specialist skills as substrate.
- **Refactor**: merge the visible `sk-code-*` family into one smaller operator-facing coding surface.
- **Simplify**: make routing silent by default and surface the choice only when it is itself useful.
- **Pivot**: treat skills as internal capability packaging first, public taxonomy second.

### Lifecycle And Command Surface
- **Keep**: internal phase boundaries such as planning, implementation, completion, research, review, and resume.
- **Refactor**: extract shared lifecycle machinery from repeated YAML orchestration skeletons.
- **Simplify**: merge the visible lifecycle front door and add presets, aliases, or a guided bundled path for the common journey.
- **Pivot**: optimize for one lead mode plus escalation, not a ladder of equally primary commands.

### Spec-Folder Lifecycle
- **Keep**: spec packets, levels, phase overlays, and implementation summaries as governance artifacts.
- **Refactor**: build guided bootstrap and profile selection above the current file sets and validators.
- **Simplify**: stop asking operators to understand level architecture before work begins.
- **Pivot**: use named work profiles and starter packets as the primary UX while treating levels as internal metadata.

### Deep-Loop Infrastructure
- **Keep**: explicit LEAF workers, externalized packet-local state, and auditable research/review artifacts.
- **Refactor**: share loop kernels, typed controllers, resume semantics, and continuation policies across adjacent workflows.
- **Simplify**: keep live loop contracts small and move reference-only complexity out of executable paths.
- **Pivot**: improve metrics, stop reasons, and runtime summaries without migrating to hidden iteration or a generic external DSL.

## 9. Adoption Priority Queue

### Bundle B-001 — Operator Shell Compression
- **Proposed packet name**: `002-operator-shell-compression`
- **Findings included**: `CF-001`, `CF-002`, `CF-008`, `CF-009`
- **Blast radius**: large
- **Dependencies**: none; this is the top-level UX anchor
- **Estimated complexity**: Level 3
- **First-step suggestion**: `.opencode/command/spec_kit/README.txt`

### Bundle B-002 — Guided Profiles And Spec Bootstrap
- **Proposed packet name**: `003-profile-driven-bootstrap`
- **Findings included**: `CF-005`, `CF-016`, `CF-023`
- **Blast radius**: medium-large
- **Dependencies**: `B-001`
- **Estimated complexity**: Level 2-3
- **First-step suggestion**: `.opencode/skill/system-spec-kit/templates/README.md`

### Bundle B-003 — Continuity And Memory Split
- **Proposed packet name**: `004-continuity-memory-split`
- **Findings included**: `CF-003`, `CF-015`, `CF-019`, `CF-020`, `CF-022`
- **Blast radius**: large
- **Dependencies**: `B-001`
- **Estimated complexity**: Level 3
- **First-step suggestion**: `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`

### Bundle B-004 — Shared Lifecycle And Deep-Loop Runtime
- **Proposed packet name**: `005-shared-lifecycle-engine`
- **Findings included**: `CF-006`, `CF-010`, `CF-011`
- **Blast radius**: large
- **Dependencies**: `B-001`, `B-003`
- **Estimated complexity**: Level 3
- **First-step suggestion**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`

### Bundle B-005 — Validation As Runtime Truth
- **Proposed packet name**: `006-runtime-truth-validation`
- **Findings included**: `CF-004`, `CF-014`, `CF-021`
- **Blast radius**: large
- **Dependencies**: `B-004`
- **Estimated complexity**: Level 3
- **First-step suggestion**: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`

### Bundle B-006 — Capability Surface Consolidation
- **Proposed packet name**: `007-capability-surface-consolidation`
- **Findings included**: `CF-007`, `CF-008`, `CF-026`
- **Blast radius**: medium-large
- **Dependencies**: `B-001`
- **Estimated complexity**: Level 2-3
- **First-step suggestion**: `.opencode/agent/orchestrate.md`

### Bundle B-007 — Workflow Profiles, Runtime Manifest, And Provider Registry
- **Proposed packet name**: `008-workflow-profile-layer`
- **Findings included**: `CF-012`, `CF-017`, `CF-018`
- **Blast radius**: medium-large
- **Dependencies**: `B-004`, `B-006`
- **Estimated complexity**: Level 2-3
- **First-step suggestion**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`

### Bundle B-008 — Tactical Safety And Operator Observability
- **Proposed packet name**: `009-tactical-safety-and-observability`
- **Findings included**: `CF-013`, `CF-024`, `CF-025`
- **Blast radius**: medium
- **Dependencies**: `B-001`, `B-005`
- **Estimated complexity**: Level 2
- **First-step suggestion**: `.claude/settings.local.json`

## 10. What The Research Did Not Cover

- **Out of scope in the research**:
  - empirical usage telemetry showing which current commands or skills are actually used most in production
  - migration sequencing across every supported runtime after a shell simplification lands
  - UI implementation details for any future guided wizard or workflow cards
  - real cost/latency measurement for different profile/model-tier combinations inside this repo
- **Evidence gaps**:
  - token totals are not persisted in phase artifacts, so the `~2.4M` figure remains operator-supplied
  - `009-xethryon` compresses its findings into a table, so it provides weaker narrative rationale density than the other eight phases
  - extension-layer ideas such as sprint runners, PR watch loops, and live transport remain structurally plausible but not empirically validated inside this repo
- **External repos with lowest structural signal**:
  - `003-claude-code-mastery-project-starter-kit-main` — very useful for UX and guardrails, weaker for runtime architecture
  - `009-xethryon` — very useful for shell compression and research verification, weaker for auditable runtime design
  - `006-ralph-main` — strong for boundary clarity and task sizing, intentionally narrow as a system architecture model
- **Phase overlaps that need arbitration**:
  - lifecycle-front-door compression vs keeping advanced `/memory:*` explicit
  - profile-driven bootstrap vs preserving Level 1/2/3+ compatibility and validator semantics
  - shared loop engine extraction vs the hard boundary that keeps explicit LEAF research/review products
  - capability-facade consolidation vs retaining opt-in specialist skills and roles
- **Data discrepancy to note**:
  - the operator brief mentions `90 iterations`, but every phase report and every `deep-research-state.jsonl` file records `30` iterations per phase, which yields `270` total iterations. The report uses the artifact-backed number.

## 11. Recommended Next Step

The first implementation packet should be `002-operator-shell-compression`, anchored on `CF-001`, `CF-002`, `CF-008`, and `CF-009`. It has the clearest target files, the strongest cross-phase convergence, and the highest leverage because it removes visible friction without forcing immediate deep runtime migration. The concrete starting point is `.opencode/command/spec_kit/README.txt`, followed immediately by the policy-source decision across `AGENTS.md`, `CLAUDE.md`, and the constitutional gate surfaces.
