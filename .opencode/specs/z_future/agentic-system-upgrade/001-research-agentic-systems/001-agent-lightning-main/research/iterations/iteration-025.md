# Iteration 025 — Named Agent Roster Versus Capability Bundles

Date: 2026-04-10

## Research question
Is the current named-agent roster too granular, and should `system-spec-kit` merge several operator-visible roles into a smaller set of capability bundles?

## Hypothesis
Yes. A few roles remain genuinely exclusive, but too many workflow nuances are encoded as permanent first-class agent identities. The external repo suggests capability modules can stay strong without such a large role taxonomy.

## Method
I compared Public's orchestrator routing table and role-specialized agents with Agent Lightning's capability-oriented repo architecture.

## Evidence
- The orchestrator enumerates a broad LEAF roster: `@context-prime`, `@context`, `@deep-research`, `@ultra-think`, `@speckit`, `@review`, `@write`, `@general`, `@debug`, and `@handover`. [SOURCE: .opencode/agent/orchestrate.md:97-106]
- Those roles are backed by strict depth and LEAF-enforcement rules, so the role boundaries become architecture, not just prompts. [SOURCE: .opencode/agent/orchestrate.md:116-126] [SOURCE: .opencode/agent/orchestrate.md:152-156]
- `@context` is declared the exclusive entrypoint for all exploration tasks. [SOURCE: .opencode/agent/context.md:27-31]
- `@context-prime` exists specifically to return a compact Prime Package for startup or recovery. [SOURCE: .opencode/agent/context-prime.md:22-36] [SOURCE: .opencode/agent/context-prime.md:96-116]
- `@handover` separately owns continuation documents and mandates a specific source set and template. [SOURCE: .opencode/agent/handover.md:28-49]
- In contrast, Agent Lightning describes itself through functional modules: runners, tracers, store, algorithms, docs, examples, dashboard, scripts, and tests. [SOURCE: external/AGENTS.md:3-9]

## Analysis
The current roster makes sense historically: each role grew to protect one workflow boundary. But the comparison shows how much conceptual surface area Public is asking the operator and the orchestrator to carry. Startup context, general retrieval, and end-of-session continuation are all related forms of state transfer, yet they appear as separate named species.

Public should keep truly exclusive roles where file-permission and quality-gate rules demand them, especially `@speckit` and likely specialized review/research loops. But the rest should move toward capability bundles. That would make the system easier to explain, easier to route, and less likely to keep expanding every time a new workflow nuance appears.

## Conclusion
confidence: high

finding: `system-spec-kit` should merge much of its named-agent roster into a smaller capability-bundle model, while preserving a short list of genuinely exclusive roles.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md` and the operator-facing agent taxonomy
- **Change type:** architecture merge
- **Blast radius:** large
- **Prerequisites:** identify which current roles are truly exclusive, define canonical capability bundles, and preserve prompt/permission overlays where they add real safety
- **Priority:** must-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** The operator ecosystem includes many named agents with separate responsibilities, templates, and routing rules.
- **External repo's equivalent surface:** Responsibilities are partitioned by module capability, not by a large set of user-facing or architecture-facing role names.
- **Friction comparison:** Public's role taxonomy increases explanation cost and routing complexity. Agent Lightning's capability layering is easier to hold in one mental model.
- **What system-spec-kit could DELETE to improve UX:** Delete the need to explain most workflow differences as separate named agent identities.
- **What system-spec-kit should ADD for better UX:** Add a small canonical bundle map such as retrieve, plan, write, execute, review, and loop-specialist, then treat many current agents as internal presets under those bundles.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that the current roster is already near-minimal, but even startup context, exploration, and handover are split into distinct role surfaces. The strongest counterexamples are the genuinely exclusive writing roles, not the broader taxonomy.

## Follow-up questions for next iteration
- Which current agents must remain exclusive identities because of file-ownership or review rules?
- Can `context-prime`, `context`, and `handover` become one capability bundle with multiple modes?
- How should operator docs present agents if the internal prompt files remain separate for implementation reasons?
