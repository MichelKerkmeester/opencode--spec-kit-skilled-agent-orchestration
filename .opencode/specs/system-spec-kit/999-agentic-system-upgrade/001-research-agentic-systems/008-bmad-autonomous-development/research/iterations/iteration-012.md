# Iteration 012 — Timer-Aware Pause And Recovery

## Research question
Should `system-spec-kit` refactor its long-running loop recovery model around BAD-style timer-aware continuation and rate-limit pauses?

## Hypothesis
BAD treats pause/resume as a first-class runtime capability, while local deep loops treat it as mostly manual recovery; the external model is better for unattended automation.

## Method
Compared BAD's pre-continuation checks and timer branches with the current `deep-research` loop's pause/resume and packet-state model.

## Evidence
- BAD runs explicit pre-continuation checks before re-entering the loop: compact on context pressure, pause on 5-hour or 7-day rate limits, and either schedule an automatic resume or wait for the user depending on `TIMER_SUPPORT`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-15] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:19-54] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:58-88]
- BAD's main skill treats wait timers, retro timers, context-compaction thresholds, and rate-limit thresholds as part of the core runtime contract rather than as ad hoc operator behavior. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:47-61] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:443-479]
- Local `deep-research` has strong disk state and resume classification, but its live interruption model is limited to a pause sentinel plus manual resumption and convergence re-entry. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-155] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240-277]
- OpenCode's memory trigger docs explicitly note that automatic interval-driven saves are unsupported because the runtime lacks the necessary hooks, which explains the current manual bias but does not eliminate the design gap for hook-capable runtimes. [SOURCE: .opencode/skill/system-spec-kit/references/memory/trigger_config.md:17-22]

## Analysis
The local system already does the hard part of persistence correctly: packet-local state survives across sessions. What it lacks is a capability-aware continuation policy. BAD separates "can this runtime auto-resume?" from "should this workflow pause now?" and makes both explicit. That is a better shape for unattended loops than today's mostly manual stop-and-resume behavior.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** persistent disk state plus manual `/spec_kit:resume` or pause-sentinel recovery.
- **External repo's approach:** explicit continuation checks and timer-aware branching as part of the workflow contract.
- **Why the external approach might be better:** it treats context pressure and rate limits as expected loop states rather than exceptional operator interruptions.
- **Why system-spec-kit's approach might still be correct:** OpenCode cannot rely on timer hooks everywhere, so fully automatic continuation cannot be the only path.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a runtime-capability continuation policy for long autonomous loops with explicit branches such as `compact_now`, `pause_until`, `manual_resume`, and `continue_now`, while keeping disk-state recovery authoritative.
- **Blast radius of the change:** medium
- **Migration path:** prototype in `deep-research` first, then mirror to `deep-review`, and only later consider implementation workflows.

## Conclusion
confidence: high

finding: BAD's timer-aware continuation model is a meaningful improvement over purely manual long-loop recovery. `system-spec-kit` should preserve its packet-state design but refactor long autonomous loops to make pause and resume policies explicit and runtime-aware.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define a shared runtime capability contract so loops know when timer-based resume is actually supported
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing local continuation policy object or timer-capability abstraction in the deep-research packet surfaces; current behavior remains pause-sentinel and resume centric.

## Follow-up questions for next iteration
If timers become first-class, where should per-runtime model and threshold configuration live so it does not duplicate across command assets?
