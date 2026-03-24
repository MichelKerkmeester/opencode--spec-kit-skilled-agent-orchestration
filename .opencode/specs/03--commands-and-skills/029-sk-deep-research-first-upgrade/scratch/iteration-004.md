# Iteration 4: Q4 State Management and Context Resilience Comparison

## Focus
Compare how ResearcherSkill and `pjhoberman/autoresearch` externalize state, resume sessions, survive context compaction, and support multi-round experiments versus our `deep-research-config.json` + `deep-research-state.jsonl` + `deep-research-strategy.md` model.

## Findings
1. ResearcherSkill treats state as a full laboratory container. Its `.lab/` directory stores operator intent (`config.md`), tabular experiment outcomes (`results.tsv`), narrative reasoning (`log.md`), non-linear lineage (`branches.md`), and deferred ideas (`parking-lot.md`), while git commits and resets manage code state separately. This is the richest model for experiment genealogy and rollback safety, but much of the knowledge state is human-readable rather than machine-first. Our approach is more normalized and orchestrator-friendly because config, event log, strategy, and iteration artifacts each have declared mutability and explicit parsing rules. [Sources: `/tmp/deep-research-029/ResearcherSkill/researcher.md:18-35`, `/tmp/deep-research-029/ResearcherSkill/researcher.md:64-77`, `/tmp/deep-research-029/ResearcherSkill/researcher.md:97-142`, `/tmp/deep-research-029/ResearcherSkill/GUIDE.md:43-59`, `.opencode/skill/sk-deep-research/references/state_format.md:15-25`, `.opencode/skill/sk-deep-research/references/state_format.md:31-89`, `.opencode/skill/sk-deep-research/references/state_format.md:95-124`, `.opencode/skill/sk-deep-research/references/state_format.md:237-261`]

   | Dimension | ResearcherSkill | Autoresearch | Our approach |
   |---|---|---|---|
   | Primary state container | `.lab/` directory plus git | `autoresearch.jsonl` plus `autoresearch_dashboard.md` | Config JSON + append-only JSONL + mutable strategy + write-once iteration files + progressive `research.md` |
   | Machine-readable core | `results.tsv`, partial branch registry | Strong: JSONL config header and result lines | Strong: config JSON, typed JSONL records, defined recovery rules |
   | Human-readable core | `config.md`, `log.md`, `parking-lot.md`, `summary.md` | Dashboard and instructions | Strategy file, iteration notes, `research.md` |
   | Code-state tracking | Strongest: commit before every run, revert on discard | Medium: commit keeps, revert constrained file on failures | Weak today: checkpoint commits are reference-only, not live behavior |

2. Resume behavior differs sharply in safety guarantees. ResearcherSkill runs an explicit Phase 0 resume check: if `.lab/` exists, it reads config/results/branches/log tail, summarizes the lab, and asks whether to resume or archive and start fresh. Autoresearch uses a lighter-weight resume contract: the launch prompt and instructions tell the agent to re-read `autoresearch.jsonl` and the dashboard, then continue from the last iteration number. Our loop is stricter and more defensive than both: initialization classifies the session as `fresh`, `resume`, `completed-session`, or `invalid-state`, requires config/JSONL/strategy agreement before resume, logs a `resumed` event, and can also pause via sentinel file rather than forcing a hard stop. [Sources: `/tmp/deep-research-029/ResearcherSkill/researcher.md:26-37`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:167-215`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:63-70`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/launch_prompt.md:6-18`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:42-69`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:91-108`]

   | Resume question | ResearcherSkill | Autoresearch | Our approach |
   |---|---|---|---|
   | Resume entrypoint | Phase 0 `.lab/` check | Relaunch prompt reads JSONL + dashboard | Init-time state classification |
   | Safety check | Human review of lab summary | Implicit trust in JSONL/dashboard continuity | Explicit agreement check across config, JSONL, and strategy |
   | Resume side effect | Checkout active branch, continue next experiment | Continue from last iteration number | Log `resumed` event, continue from last iteration |
   | Fresh-start option | Yes, archive `.lab` to timestamped backup | Usually create a new round/new files | `completed-session` and `invalid-state` are first-class states |

3. On context compaction resilience, autoresearch is explicitly designed for it, while ResearcherSkill is only implicitly resilient. Autoresearch says the JSONL file is the persistent memory, states that it survives context compaction, and pairs it with a dashboard so the agent can recover both exact iteration history and a quick human summary after losing context. ResearcherSkill survives long runs because the agent repeatedly reads `.lab/results.tsv`, recent `log.md`, `branches.md`, and `parking-lot.md`, but it does not define a dedicated compaction protocol or compact state injection. Our design is the most compaction-aware of the three: each iteration runs with fresh context by design, state continuity is file-backed, the orchestrator injects a compact state summary before dispatch, and if JSONL is corrupted we can reconstruct iteration records from write-once iteration files. [Sources: `/tmp/deep-research-029/ResearcherSkill/researcher.md:81-90`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:167-215`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:63-70`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/launch_prompt.md:12-18`, `.opencode/skill/sk-deep-research/references/state_format.md:174-211`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:110-141`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:301-320`]

   | Compaction/resilience trait | ResearcherSkill | Autoresearch | Our approach |
   |---|---|---|---|
   | Explicit compaction instructions | No | Yes | Yes |
   | Redundant state channels | TSV + log + branches + parking lot + git | JSONL + dashboard | JSONL + strategy + iteration notes + `research.md` + injected state summary |
   | Recovery from partial corruption | Mostly manual via git plus `.lab` inspection | Re-read JSONL/dashboard | Structured JSONL fault tolerance plus iteration-file reconstruction |
   | Fresh-context-by-design | No | Not architectural, but resume-aware | Yes, core design principle |

4. For multi-round work, ResearcherSkill and autoresearch optimize for different shapes of continuity. ResearcherSkill favors non-linear branching inside one evolving lab: experiments can fork from any successful commit, multiple branches remain active, and the lab keeps the global history. That is stronger than our current model for branch genealogy, but it does not create explicit round boundaries. Autoresearch has the opposite bias: Round 2 is a new harness with new instructions, possibly a new eval script, a new JSONL, and a new dashboard, while keeping the same test data and reading the prior round's log to decide what to attack next. Our current loop sits between them: it has a single-session strategy file and append-only history, and documents segments and wave execution as reference-only, but it does not yet have a first-class "Round N" packaging convention or ResearcherSkill-grade branch lineage. [Sources: `/tmp/deep-research-029/ResearcherSkill/researcher.md:130-146`, `/tmp/deep-research-029/ResearcherSkill/GUIDE.md:214-226`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:140-165`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:69-75`, `.opencode/skill/sk-deep-research/references/state_format.md:213-231`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:232-297`]

   | Multi-round / branching model | ResearcherSkill | Autoresearch | Our approach |
   |---|---|---|---|
   | Primary structure | Branch tree inside one lab | Sequential rounds with new harness files | Single evolving session; segments and waves are reference-only |
   | Continuity artifact | `.lab/*` plus git history | Prior round logs + same test data | Same JSONL/strategy/iteration archive |
   | Best for | Exploratory experimentation with divergent branches | Controlled staged optimization rounds | Long-form research with progressive synthesis |
   | Main gap vs ours | Lacks typed machine-state and explicit compaction protocol | Less expressive about open questions and research reasoning | Lacks first-class round packaging and live branch genealogy |

5. Overall, the systems are complementary rather than strictly better or worse. ResearcherSkill is strongest at preserving experiment lineage and rollbackable code state. Autoresearch is strongest at lightweight resume after context loss and at round-based experiment packaging. Our JSONL + strategy.md model is strongest at orchestrated research continuity: it separates immutable config, append-only machine log, mutable planning state, write-once evidence, and progressive synthesis, and it adds stricter resume validation plus recovery paths. The clearest upgrade opportunities are to borrow a human-facing dashboard from autoresearch and a branch or ideas registry pattern from ResearcherSkill without giving up our stronger state contracts. [Sources: `/tmp/deep-research-029/ResearcherSkill/researcher.md:18-35`, `/tmp/deep-research-029/ResearcherSkill/researcher.md:130-157`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:167-215`, `/tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:69-75`, `.opencode/skill/sk-deep-research/references/state_format.md:15-25`, `.opencode/skill/sk-deep-research/references/state_format.md:193-211`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:42-69`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:110-141`]

## Sources Consulted
- `/tmp/deep-research-029/ResearcherSkill/researcher.md:18-35`
- `/tmp/deep-research-029/ResearcherSkill/researcher.md:64-157`
- `/tmp/deep-research-029/ResearcherSkill/GUIDE.md:43-65`
- `/tmp/deep-research-029/ResearcherSkill/GUIDE.md:97-159`
- `/tmp/deep-research-029/ResearcherSkill/GUIDE.md:192-260`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:124-215`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:29-75`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:52-70`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/launch_prompt.md:6-18`
- `.opencode/skill/sk-deep-research/references/state_format.md:15-25`
- `.opencode/skill/sk-deep-research/references/state_format.md:31-89`
- `.opencode/skill/sk-deep-research/references/state_format.md:95-211`
- `.opencode/skill/sk-deep-research/references/state_format.md:267-306`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:42-69`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:79-168`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:175-226`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:232-320`
- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:6-52`
- `.opencode/skill/sk-deep-research/assets/deep_research_config.json:1-19`

## Assessment
- New information ratio: 0.86
- Questions addressed: [Q4: How do ResearcherSkill and autoresearch handle state externalization, session resume, context compaction resilience, and multi-round experiments compared to our JSONL + strategy.md approach?]
- Questions answered: [Q4: ResearcherSkill is strongest on branch-aware lab state and git-backed rollback, autoresearch is strongest on lightweight JSONL resume plus dashboard compaction recovery, and our approach is strongest on typed orchestration state, resume validation, and structured recovery.]

## Reflection
- What worked and why: Comparing each system by the same five dimensions (state container, resume, compaction resilience, multi-round structure, granularity) made the trade-offs legible without flattening the differences between experiment loops and research loops.
- What did not work and why: There was no existing `iteration-00N.md` sample in the spec folder, so I could not mirror a prior local style. I used the canonical iteration schema from `state_format.md`, which is authoritative but less tailored to this spec's earlier voice.
- What I would do differently: For the next pass, I would translate these findings into a concrete upgrade matrix for Q5 that scores candidate borrowings by implementation cost, compatibility with our state contracts, and likely impact on long-running research reliability.

## Recommended Next Focus
Q5: Turn this comparison into a ranked upgrade shortlist, with special attention to three candidate additions: an `autoresearch_dashboard.md`-style human summary, a ResearcherSkill-inspired branch or ideas registry, and an explicit round-packaging convention that sits above our current single-session JSONL + strategy model.
