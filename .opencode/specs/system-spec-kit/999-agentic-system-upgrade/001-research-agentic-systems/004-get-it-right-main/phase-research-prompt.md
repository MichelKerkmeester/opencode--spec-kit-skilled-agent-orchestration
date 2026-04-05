# $refine TIDD-EC Prompt: 004-get-it-right-main

## 1. Role

Specialist in iterative retry architectures, context boundary enforcement, and structured feedback loops for AI-assisted development.

Primary expertise:
- Brownfield AI coding workflows where understanding must be earned through iteration
- Retry-loop orchestration with explicit quality gates and failure recovery
- Context-boundary design, feedback compression, and thread/fork isolation
- Architecture extraction from workflow definitions, agent prompts, and supporting docs
- Translating external workflow patterns into adoption guidance for `Code_Environment/Public`

## 2. Task

Research Get It Right's retry loop architecture and feedback bridge patterns to identify improvements for Code_Environment/Public's agent workflows, especially around error recovery, context management, and quality verification cycles.

Research target:
- Phase folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main`
- External repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/get-it-right-main`

Mission focus:
- Extract how the loop actually works, not just how it is described
- Identify which patterns are portable into this repo's agent system
- Separate reusable architecture from Reliant-specific implementation details
- Produce evidence-backed adoption guidance for retry loops, review bridges, and bounded refactoring

## 3. Context

### System Description

Get It Right is a YAML workflow-driven retry loop for AI-assisted coding on brownfield codebases.

Core architecture to study:
- `implement -> [lint, test, build] -> review -> [refactor?] -> loop back`
- Fresh implement agent on every iteration via forked thread with `memo: false`
- Implement step reads only the original request plus accumulated review feedback
- Parallel verification runners for lint, test, and build after each implementation attempt
- Review agent acts as a strategy selector with `pass`, `continue`, or `refactor`
- Refactor agent undoes problematic work without reimplementing
- Only review feedback crosses iteration boundaries
- Thread architecture uses fork-per-iteration and minimal state transfer
- Retry budget is configurable through `max_retries` with range `1-10`, default `3`
- Workflow is agent-agnostic at the pattern level even though execution is encoded in Reliant YAML

### Architectural Lens

Treat Get It Right as a study in:
- Failure-informed iteration instead of naive "retry the same thing"
- Context compression through reviewer-authored feedback
- Control-plane separation between implement, verify, review, and refactor
- Loop convergence through structured gating rather than endless retries
- Safe recovery when an approach is fundamentally wrong

### Cross-Phase Awareness Table

| Phase | External system | Primary lens | Boundary with phase 004 |
| --- | --- | --- | --- |
| 001 | Agent Lightning | Agent optimization, training, selective improvement | Mention only where retry-loop feedback could become optimization signal later; do not turn this phase into agent training research |
| 002 | Babysitter | Deterministic orchestration and obedience controls | Contrast retry loops with deterministic control, but keep focus on feedback bridges rather than workforce governance |
| 003 | Claude Code Mastery Project Starter Kit | Project scaffolding, commands, hooks, docs, reusable workflow assets | Reuse any packaging ideas only if they help ship retry-loop patterns; avoid drifting into starter-kit ergonomics |
| 004 | Get It Right | Retry-loop architecture, feedback bridge, context boundary enforcement, conditional refactor | This is the active phase and the center of gravity |
| 005 | intellegix-code-agent-toolkit | Autonomous loop driver, worktree orchestration, budgets, governance | Note similarities in loop automation, but keep this phase on retry semantics, not portfolio governance |
| 006 | Ralph | Fresh-context autonomous looping with git/progress memory | Contrast Ralph's persistence-by-files/git with Get It Right's feedback-only bridge |
| 007 | Relay | Real-time inter-agent messaging | Mention only if message transport could support feedback handoff; do not broaden into communications architecture |
| 008 | BAD Autonomous Development | Backlog-driven multi-agent pipelines with isolated worktrees | Compare pipeline orchestration vs iterative recovery, but keep emphasis on retries within one task |
| 009 | Xethryon | Persistent memory, self-reflection, git awareness, skill invocation | Note where durable memory or self-reflection could complement retry loops without replacing the feedback bridge |

### What This Repo Already Has

Code_Environment/Public has spec-kit validation (`checklist.md`, `validate.sh`), but no formal retry loop or feedback bridge between iterations.

Relevant internal baseline:
- Strong spec-folder workflow and validation rules
- Memory/context infrastructure that persists knowledge across sessions
- Existing agent and skill orchestration patterns
- No explicit implement -> verify -> review -> refactor control loop for a single coding task
- No architecture where review feedback is the sole compressed state passed between attempts

### Source Priority

Read sources in this order:
1. `workflow.yaml` - central executable definition
2. `agents/implementer.md`, `agents/reviewer.md`, `agents/refactorer.md` - role contracts
3. `docs/loop-explained.md`, `docs/thread-architecture.md`, `docs/when-to-use.md` - loop mechanics, thread model, adoption boundaries
4. `README.md` - framing, terminology, and public positioning

## 4. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main` as the approved phase folder and keep all writable artifacts inside it.
2. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/get-it-right-main` as read-only source material.
3. Start with `workflow.yaml` and map the actual loop: entry node, loop condition, outputs, edge conditions, and retry budget.
4. Trace the implement path first: identify exactly what the implement agent inherits, what is injected, what is not saved, and why the fresh-fork model matters.
5. Trace the parallel verification stage: lint, test, and build runners; how `join_checks` works; and how failed checks short-circuit review.
6. Trace the review stage carefully: distinguish `grade` from `strategy`, identify how `save_message` works, and explain why the reviewer is a strategy selector rather than a conventional code reviewer.
7. Trace the refactor stage as a separate control path: identify when it runs, what data it receives, why it is undo-only, and how it prepares the workspace for the next attempt.
8. Follow the full data flow for cross-iteration state: original request, injected messages, node references, saved review feedback, and any fallback strategy when review is skipped.
9. Read `agents/implementer.md`, `agents/reviewer.md`, and `agents/refactorer.md` to verify prompt-level intent, not just YAML wiring.
10. Read `docs/loop-explained.md` and `docs/thread-architecture.md` to confirm how context boundaries are enforced and how fork-per-iteration minimizes stale state.
11. Read `docs/when-to-use.md` to capture adoption criteria, anti-fit scenarios, and operational tradeoffs between correctness and speed.
12. Compare Get It Right against this repo's current workflow model: identify what already exists, what is missing, and where a retry-loop layer could integrate cleanly.
13. Explicitly address overlap with phase `001-agent-lightning-main`: note where retry-loop feedback could later feed optimization systems, but keep this phase scoped to retry architecture and feedback transfer.
14. Separate findings into `adopt now`, `prototype later`, and `reject`, with concrete reasons tied to this repo's agent workflows.
15. Prefer architecture patterns over product branding or YAML syntax trivia. The goal is to extract transferable mechanisms for Code_Environment/Public.

## 5. Research Questions

1. How does Get It Right make retries converge instead of degenerating into repeated blind attempts?
2. Why is review feedback the only state that crosses iteration boundaries, and what does that buy in context quality and failure isolation?
3. How do `memo: false` forks change the behavior of implement, review, and refactor compared with a cumulative thread?
4. What are the exact benefits and costs of skipping review when lint, test, or build fails?
5. How does the reviewer balance `pass`, `continue`, and `refactor`, and what heuristics appear encoded in the reviewer prompt?
6. What problem does the refactorer solve that a simple reimplementation retry would not solve?
7. How much of the system is truly Reliant-specific, and how much is portable as a repo-level orchestration pattern?
8. Which parts of the feedback bridge could map onto this repo's Spec Kit, memory, validation, or agent workflow systems?
9. What evidence suggests that fork-per-iteration plus compressed feedback is better than carrying forward full implementation history?
10. What parallel verification patterns are worth copying directly into Code_Environment/Public?
11. When should a retry loop like this be used, and when would it add more overhead than value?
12. Which ideas in Get It Right overlap with phase 001 optimization research, and where should the boundary be kept sharp?

## 6. Do's

- Trace the complete `implement -> verify -> review -> refactor` cycle from executable workflow definitions, not just README prose.
- Confirm how review feedback is the ONLY state that crosses iteration boundaries and capture the exact mechanisms used.
- Study the refactor agent's "undo without reimplement" contract and explain why it exists.
- Check the thread and fork architecture in detail, including `memo: false`, injected messages, and `save_message`.
- Distinguish workflow control logic from agent prompt logic; both matter.
- Compare the external pattern against what Code_Environment/Public already has and what it still lacks.
- Note where the retry loop improves failure recovery, context discipline, and verification quality.
- Call out portable design patterns even when the concrete implementation is Reliant-specific.

## 7. Don'ts

- Don't try to run the Reliant platform or depend on external hosted services for this research.
- Don't focus on Reliant-specific YAML syntax more than the retry and boundary patterns it encodes.
- Don't confuse the review agent with a standard code reviewer; it is a loop-control and strategy-selection mechanism.
- Don't treat refactoring as "fixing the code a bit more"; in this design it means undoing a bad approach.
- Don't blur this phase into phase 001 optimization, model tuning, or RL-based improvement work.
- Don't mistake persistent memory systems for the same thing as a feedback bridge between bounded retries.
- Don't write vague summaries without exact file-path evidence.
- Don't recommend adoption without explaining integration cost, risk, or fit for this repo.

## 8. Examples

### Example Finding: Context Boundary Enforcement

**Evidence**
- `workflow.yaml`
- `docs/thread-architecture.md`
- `agents/reviewer.md`

**Finding**
- Get It Right keeps the main thread intentionally lean by saving only reviewer feedback back to the parent thread.
- Implementer summaries, check logs, and refactor narratives stay inside forked threads and do not accumulate across attempts.

**Why it matters for Code_Environment/Public**
- This repo already has durable memory and validation, but it does not have a bounded retry loop where each attempt receives distilled corrective guidance instead of raw prior context.
- A similar bridge could reduce context rot in repeated implementation attempts inside existing agent workflows.

**Recommendation**
- `prototype later`

**Reason**
- The pattern is promising, but integration requires a place to store attempt-scoped review feedback without polluting broader session memory.
- Prototype it as a phase-local or task-local retry controller before wiring it into general agent execution.

## 9. Constraints

- Use exact file paths whenever citing evidence.
- Keep all paths under `999-agentic-system-upgrade`; avoid legacy path roots entirely.
- Stay phase-local: research `004-get-it-right-main`, but maintain awareness of the other eight phases.
- Treat the external repo as read-only.
- Keep scope on retry loops, feedback bridges, context boundaries, conditional refactoring, and verification gates.
- Flag overlap with `001-agent-lightning-main` instead of absorbing optimization research into this phase.
- Separate portable architecture from implementation detail.
- Prefer evidence-backed claims; if a point is inferred rather than explicit, label it as inference.
- Avoid recommendations that require Reliant to be the only viable runtime.
- Keep findings actionable for Code_Environment/Public rather than generic for all agent systems.

## 10. Deliverables

- A concise architecture summary of Get It Right's retry loop
- A data-flow explanation covering implement, checks, review, refactor, and saved feedback
- A findings set that explains what to adopt, prototype, or reject for this repo
- Explicit analysis of context boundary enforcement and the feedback bridge
- Notes on how parallel verification could strengthen current workflows
- A clear boundary statement between phase 004 retry-loop research and phase 001 optimization research
- File-path citations for every meaningful conclusion

Preferred finding template:
- `What the external system does`
- `Evidence`
- `Why it matters here`
- `Recommendation: adopt now | prototype later | reject`
- `Integration notes / risks`

## 11. Evaluation

Score the research output against CLEAR with a target of `>= 40/50`:

| Dimension | Target | What good looks like |
| --- | --- | --- |
| Correctness | 10 | Findings match `workflow.yaml`, agent docs, and loop docs without architectural distortion |
| Logic | 10 | The retry loop, gate conditions, and data flow are explained coherently from source evidence |
| Expression | 15 | Writing is specific, domain-aware, and useful to an engineer deciding whether to port the pattern |
| Arrangement | 10 | Findings are organized by mechanism, fit, and adoption path rather than by raw note dump |
| Reusability | 5 | Output can guide later implementation work in Code_Environment/Public |

RICCE compliance requirements:
- **Role** is explicit and domain-specific
- **Instructions** are actionable and sequenced
- **Context** captures system shape, repo baseline, and cross-phase boundaries
- **Constraints** narrow the scope and prevent drift
- **Examples** demonstrate the expected finding format

## 12. Completion Bar

The research is complete only when:
- `workflow.yaml` has been read as the central source of truth
- All three agent docs and all three supporting docs have been examined
- The full retry loop and check gate behavior are explained accurately
- The feedback bridge and thread-boundary model are described clearly
- Refactor-vs-continue-vs-pass tradeoffs are analyzed, not merely listed
- The role of parallel lint/test/build runners is captured with adoption guidance
- The overlap boundary with phase `001-agent-lightning-main` is explicit
- Findings include `adopt now`, `prototype later`, or `reject`
- Every meaningful conclusion is tied to exact evidence paths
- Recommendations are framed for Code_Environment/Public, not for Reliant users in general

## 13. Final Orientation

Think like a researcher extracting a reusable control pattern from a working external system.

The goal is not to admire Get It Right.

The goal is to determine:
- which retry-loop mechanics should be copied,
- which context-boundary rules should be preserved,
- which parts should stay external,
- and how Code_Environment/Public could gain better error recovery and quality-verification cycles without inheriting unnecessary platform coupling.
