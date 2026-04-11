# Iteration 18: D4 sk-improve-agent Contract Artifact Survival

## Focus
This iteration audited contract self-compliance for `sk-improve-agent` by comparing the published operator-facing promises in the README, SKILL, changelog, and `assets/improvement_strategy.md` against the visible reducer/dashboard path in `scripts/reduce-state.cjs`. The goal was to verify which promised artifacts actually survive end-to-end and where trade-off labeling, benchmark stability wording, and stop-reason/session-outcome language drift.

## Findings
- `assets/improvement_strategy.md` presents reducer-owned machine sections for `What Improved`, `What Failed`, `Best Known State`, `Next Recommendation`, `Packaging Follow-Up`, `Mutation Coverage`, `Convergence Eligibility`, and `Trade-Off Detection`, but the visible reducer never opens or writes that file. `reduce-state.cjs` only emits `experiment-registry.json` and `agent-improvement-dashboard.md`, so most of the promised strategy-surface artifacts cannot survive the shipped reducer path. (`.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:71-137`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`)
- The dimensional-progress contract does survive. README says the reducer renders a Dimensional Progress table and stops when dimensions plateau, and the reducer both renders that table and adds an `all dimensions plateaued` stop reason when the plateau window condition is met. This is the clearest operator-visible contract that remains self-compliant in the visible path. (`.opencode/skill/sk-improve-agent/README.md:163-169`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:305-325`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:371-391`)
- Trade-off annotations do not survive the visible dashboard path. `improvement_strategy.md` reserves a `Trade-Off Detection` table plus hard/soft resolution guidance, but `renderProfileSection()` only outputs repeated failure modes plus dimensional progress and `renderDashboard()` adds only summary, guardrails, stop status, and recommendation. No trade-off table or action annotation is rendered in the shipped dashboard output. (`.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:125-136`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:394-475`)
- Benchmark stability wording is lost between the published contract and the reducer surface. README says promotion depends on benchmark status and repeatability evidence, and SKILL says `benchmark-stability.cjs` emits a weight-recommendation report only after a minimum session-count threshold, but the dashboard only shows benchmark run/pass/fail counts, best benchmark score, and a generic benchmark-failure recommendation. There is no replay-count, stability-coefficient, repeatability, or `insufficient data` label in the visible reducer output. (`.opencode/skill/sk-improve-agent/README.md:159-165`, `.opencode/skill/sk-improve-agent/SKILL.md:318-323`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:404-438`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:444-475`)
- Stop-reason and session-outcome wording drift before reaching the operator-facing dashboard. The changelog says sessions should report exact `STOP_REASONS` and `SESSION_OUTCOMES`, and SKILL publishes the outcome labels plus `blockedStop` gate-bundle language, but the reducer collapses stop status to booleans and free-text reasons while only counting `Keep-baseline results` in the global summary. The visible dashboard never renders enum-style stop reasons or session outcomes such as `promoted`, `rolledBack`, or `advisoryOnly`. (`.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:15-18`, `.opencode/skill/sk-improve-agent/SKILL.md:261-289`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-332`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:440-468`)

## Ruled Out
- This is not universal contract drift. README's `mirror drift as packaging work` guidance survives in the dashboard guardrails, and the dimensional-progress/plateau path is also visibly implemented. (`.opencode/skill/sk-improve-agent/README.md:167-169`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:458-463`)

## Dead Ends
- I did not inspect `scripts/improvement-journal.cjs` or the `/improve:agent` YAML emitters in this pass, so I cannot yet tell whether exact stop reasons and session outcomes are produced upstream and then dropped by the reducer, or whether the visible workflow path never emits them at all.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:36-53`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-017.md:42-43`
- `.opencode/skill/sk-improve-agent/README.md:159-169`
- `.opencode/skill/sk-improve-agent/SKILL.md:261-323`
- `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:71-137`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-503`
- `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:15-18`

## Reflection
- What worked and why: Comparing the contract documents directly against the reducer write targets made it easy to separate promises that survive in the shipped dashboard from promises that stop at documentation.
- What did not work and why: The visible reducer path does not show whether richer stop/outcome fields exist upstream in the journal or YAML emitters, so the drift boundary is still scoped to the published reducer/dashboard surface.
- What I would do differently: I would inspect the journal emitter and `/improve:agent` auto workflow next so the next pass can locate the exact stage where enum-rich stop and outcome fields are lost.

## Recommended Next Focus
Stay on D4 for one more pass, but move upstream from the dashboard to `scripts/improvement-journal.cjs`, `.opencode/command/improve/agent.md`, and the visible improve-agent YAML workflow. The most productive next step is to determine whether exact stop reasons, session outcomes, and gate-result payloads are emitted correctly and then discarded by `reduce-state.cjs`, or whether the workflow never emits the richer contract in the first place. That would close the self-compliance story end-to-end before rotating back to D5 coverage-graph usage in the improvement loop.
