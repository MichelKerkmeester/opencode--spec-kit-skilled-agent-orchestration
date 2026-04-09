# Iteration 006 — Coordination Mode Taxonomy

Date: 2026-04-09

## Research question
Should Public explicitly document team, fan-out, and pipeline coordination shapes instead of treating all delegation as one generic pattern?

## Hypothesis
Relay's plugin commands name three useful coordination shapes that map cleanly to current Public workflows.

## Method
Read Relay's README and Claude plugin docs, then compared those modes with Public's orchestrator and parallel-dispatch guidance.

## Evidence
- Relay's top-level docs surface `/relay-team`, `/relay-fanout`, and `/relay-pipeline` as distinct built-in coordination skills. [SOURCE: external/README.md:70-85]
- The plugin docs define those modes precisely: lead-plus-workers for team, parallel identical work for fan-out, and sequential handoff for pipeline. [SOURCE: external/docs/plugin-claude-code.md:27-53]
- Public's orchestrator documents decomposition, delegation, evaluation, and synthesis, but does not name standard coordination shapes beyond direct vs parallel execution. [SOURCE: .opencode/agent/orchestrate.md:51-60] [SOURCE: .opencode/agent/orchestrate.md:266-268]
- Public's parallel-dispatch asset chooses whether to parallelize and shows a four-agent exploration pattern, but it does not classify pipeline versus team-lead versus fan-out as reusable modes. [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:21-27] [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:62-72]
- Public's deep-research command describes an iterative loop with init/loop/synth/save phases, which is already a pipeline shape in practice. [SOURCE: .opencode/command/spec_kit/deep-research.md:117-154]

## Analysis
Relay makes the coordination shape visible to users and agents before execution begins. Public already performs these shapes implicitly: deep research is pipeline-like, parallel exploration is fan-out-like, and orchestrated remediation often acts like a team model. Naming them would reduce prompt ambiguity and improve spec/document consistency without requiring a transport runtime.

## Conclusion
confidence: high
finding: Public should adopt Relay's mode taxonomy at the documentation and prompt-contract level. The concepts map cleanly onto existing workflows, and naming them would sharpen both human instructions and future automation.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md`, `.opencode/command/spec_kit/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define concise, non-overlapping mode names and examples that fit current Public workflows
- **Priority:** must-have (adopt now)

## Counter-evidence sought
Looked for an existing Public taxonomy that already names team/fan-out/pipeline separately; current docs describe behaviors but not the shared mode vocabulary.

## Follow-up questions for next iteration
- How should completion criteria differ by mode?
- Which current commands would gain the most from explicit mode names?
- Does evidence-based completion pair especially well with one of these shapes?
