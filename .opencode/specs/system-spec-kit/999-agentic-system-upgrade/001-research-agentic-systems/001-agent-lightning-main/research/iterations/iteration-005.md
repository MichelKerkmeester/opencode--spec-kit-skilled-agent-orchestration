# Iteration 005 — Trainer Pluggability And Loop Drivers

Date: 2026-04-09

## Research question
Does Agent Lightning's pluggable Trainer architecture offer a reusable component-registry pattern for Public's deep-loop drivers?

## Hypothesis
The Trainer is probably more flexible than Public needs today, but parts of its component-resolution model may still be useful if Public ever needs alternate loop backends, reducers, or evaluator drivers.

## Method
I examined the Trainer and Algorithm contracts, focusing on how components are resolved, injected, and reused across fit and dev modes. I then compared that architecture against Public's current deep-research loop manager, which is driven by fixed command markdown plus a fixed YAML asset.

## Evidence
- Agent Lightning's Trainer is explicitly a high-level orchestration layer that wires algorithm, runner, store, tracer, adapter, hooks, optional LLM proxy, and execution strategy into one entry point. [SOURCE: external/agentlightning/trainer/trainer.py:36-58]
- The Trainer accepts component specifications as concrete instances, classes, factories, registry strings, or config dictionaries, then resolves those inputs through a common component-building path. [SOURCE: external/agentlightning/trainer/trainer.py:33-34] [SOURCE: external/agentlightning/trainer/trainer.py:120-145]
- Trainer initialization resolves tracer, adapter, algorithm, strategy, store, runner, proxy, and hooks as separate concerns rather than baking those dependencies into one monolithic runtime. [SOURCE: external/agentlightning/trainer/trainer.py:205-243] [SOURCE: external/agentlightning/trainer/trainer.py:280-317]
- The Algorithm contract is deliberately lightweight: it receives trainer, store, adapter, and optional proxy references, then runs its own logic against those injected collaborators. [SOURCE: external/agentlightning/algorithm/base.py:25-33] [SOURCE: external/agentlightning/algorithm/base.py:86-118] [SOURCE: external/agentlightning/algorithm/base.py:135-149]
- Even the fast `Trainer.dev()` path keeps the same store, runners, hooks, and tracer plumbing; it swaps in a lightweight algorithm rather than creating a completely separate debug path. [SOURCE: external/docs/tutorials/debug.md:243-245] [SOURCE: external/docs/tutorials/debug.md:272-280]
- Public's deep-research command does not expose that sort of pluggability. It hardwires a single workflow that chooses between two YAML assets, then runs a fixed iteration/init/synthesis/save loop. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-173]
- The autonomous YAML asset is similarly fixed: it names one agent, one tool set, one set of state files, and one workflow structure rather than a component registry or interchangeable loop backend. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:64-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-127]

## Analysis
Agent Lightning's Trainer earns its flexibility because it has to orchestrate multiple runtime bundles and multiple learning algorithms. Public is solving a much narrower problem: packet-local iterative research and review. That makes a full Trainer-style component lattice excessive right now. Still, there is one transferable idea: if Public introduces more than one reducer, evaluator, or loop backend in the future, those concerns should be swappable through a small registry rather than forked into separate command assets with duplicated workflow logic.

In other words, the Trainer pattern is not an adopt-now fit, but it is a useful design guardrail. If future phases add multiple evaluator drivers, alternate convergence reducers, or different execution surfaces, Public should centralize how those components are resolved instead of copying whole YAML workflows for each variation.

## Conclusion
confidence: medium

finding: Agent Lightning's Trainer pluggability is a valuable architectural reference, but it is mostly future-facing for Public. The current deep-loop workflows are still simple enough that a full component registry would add abstraction before it pays off. The main actionable takeaway is to avoid cloning whole workflows if loop backends multiply later; introduce a small registry at that moment instead.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** real demand for multiple loop backends, reducers, or evaluator drivers; agreement on a minimal registry contract
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for evidence that Public already has multiple interchangeable deep-loop backends and did not find it. I also looked for signs that the Trainer abstraction was mostly accidental complexity, but the component-resolution and shared fit/dev plumbing show it is intentional and justified in Agent Lightning's environment.

## Follow-up questions for next iteration
- How does Agent Lightning's agent-selection machinery isolate one agent or subset of agents inside larger traces?
- Are Agent Lightning's framework wrappers genuinely analogous to Public's hook system, or are they solving a different layer entirely?
- Which of Agent Lightning's operational metrics deserve to be lifted into Public's dashboard model?
