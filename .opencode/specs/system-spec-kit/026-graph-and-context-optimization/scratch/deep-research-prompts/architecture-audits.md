---
title: "Deep Research Prompts — Architecture Audits"
description: "System-mapping research campaigns that produce a grounded architecture document + identified weak points. Use before refactors or when inheriting unfamiliar code."
importance_tier: "normal"
contextType: "research-prompts"
---

# Architecture Audits

Produce a grounded architecture document for a defined scope plus a prioritized
list of structural weak points. Output is `research/research.md` with diagrams
(ASCII), module inventory, boundary contracts, and P0/P1/P2 weak points ranked
by blast radius.

---

## Scenario DR-AA-01 — Single-package architecture map

**When:** You inherited / are about to refactor one self-contained package.

**Paste this:**

```
/spec_kit:deep-research :auto "Produce an architecture map of __PACKAGE_PATH__ (a single self-contained package with internal module structure). Deliverables in research/research.md: (1) module inventory — every exported symbol grouped by file with one-line purpose, (2) internal dependency graph in ASCII (which module imports which), (3) external dependency boundary — what crosses the package edge, what's consumed by other packages, what's strictly internal, (4) data-shape contracts at every boundary function with file:line reference, (5) weak-point list ranked by blast radius: P0 = global coupling that blocks refactor, P1 = duplicated logic or type drift, P2 = naming/organization friction. Use CocoIndex semantic search + grep to find actual callers. Every finding cites file:line." --max-iterations=12 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__PACKAGE__-architecture/
```

---

## Scenario DR-AA-02 — Cross-package coupling audit

**When:** A package claims to be self-contained but you suspect it has leaked couplings to other packages.

**Paste this:**

```
/spec_kit:deep-research :auto "Audit __PACKAGE_PATH__ for claimed self-containment. Enumerate every boundary violation: (a) imports from outside the package, (b) files outside the package that import from inside, (c) shared runtime state (caches, singletons, files on disk), (d) shared configuration files, (e) cross-package test fixtures. Categorize each as: LEGITIMATE (declared in package manifest as public API), LEAKED (accidental coupling), or CONTAMINATION (old migration residue). P0 for any CONTAMINATION that crashes when the adjacent package is missing. P1 for LEAKED coupling in hot paths. P2 for LEAKED coupling in test-only code. Every finding cites both the consumer file:line AND the producer file:line." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__PACKAGE__-boundary-audit/
```

---

## Scenario DR-AA-03 — Layered architecture conformance

**When:** You have a defined layer model (e.g., handlers → lib → shared) and need to check the code respects it.

**Paste this:**

```
/spec_kit:deep-research :auto "Verify __CODEBASE_ROOT__ conforms to the layer model: __LAYER_MODEL__ (e.g. 'handlers → lib → shared; handlers never imports handlers; shared never imports lib'). For every layer violation: (a) cite consumer file:line, (b) cite producer file:line, (c) classify as 'accidental' (fixable in <10 lines) vs 'structural' (requires redesign). Output a layer-by-layer import matrix. P0 for violations that create circular imports or runtime-only failures. P1 for architectural debt. P2 for test-only violations. Use `rg` / `grep` for import graph, not just spec claims." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__CODEBASE__-layer-conformance/
```

---

## Scenario DR-AA-04 — Startup path analysis

**When:** You need to understand exactly what happens from process start to "ready", including hook chains, eager loads, and failure-recovery.

**Paste this:**

```
/spec_kit:deep-research :auto "Trace the startup path for __RUNTIME__ (e.g., MCP server, CLI command, agent dispatch). From entry point (__ENTRY_FILE__) to 'ready to serve': (1) list every module loaded eagerly with file:line of the import, (2) every I/O performed during startup (file reads, DB opens, network calls), (3) every hook/lifecycle event fired and handler, (4) recovery behavior for each potential startup failure (file missing, DB corrupt, network down), (5) time-to-ready estimate. ASCII sequence diagram in the synthesis. P0 for unhandled startup failures that crash. P1 for eager loads that could be lazy. P2 for redundant startup I/O." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__RUNTIME__-startup-path/
```

---

## Scenario DR-AA-05 — State-machine extraction

**When:** Code implements an implicit state machine (request lifecycle, cache invalidation, lease management) and you need the explicit model.

**Paste this:**

```
/spec_kit:deep-research :auto "Extract the implicit state machine from __SUBSYSTEM_PATH__. Identify: (1) all states (named, with invariants), (2) all transitions (with trigger + guard + side-effects), (3) entry and exit actions per state, (4) unreachable states and unreachable transitions, (5) inconsistency between documented contract and implemented machine. Render as ASCII state diagram in synthesis. P0: a transition that violates invariants (e.g., reaches final state without running teardown). P1: unreachable legitimate transition or ghost state. P2: naming confusion or documentation drift. Every state + transition cites file:line." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SUBSYSTEM__-state-machine/
```

---

## Scenario DR-AA-06 — Configuration surface audit

**When:** You need a complete map of environment variables, config files, and flags that affect a subsystem's behavior.

**Paste this:**

```
/spec_kit:deep-research :auto "Enumerate every configuration input that affects __SUBSYSTEM_PATH__. Categories: (a) environment variables — read where, default value, effect on behavior, (b) config files — path, schema, precedence, (c) feature flags / rollout controls, (d) CLI flags for entry commands, (e) MCP tool parameters. For each: cite the line where the value is read, document the resulting behavior change, flag unvalidated inputs (P1 if security-relevant, P0 if can crash), document missing defaults. Output a configuration-to-behavior table in the synthesis." --max-iterations=9 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SUBSYSTEM__-config-surface/
```

---

## Scenario DR-AA-07 — Blast-radius map for a proposed change

**When:** You're considering a change to module X and need to know what else will be affected before you commit to it.

**Paste this:**

```
/spec_kit:deep-research :auto "Produce a blast-radius map for a proposed change to __MODULE_PATH__: __CHANGE_DESCRIPTION__. Enumerate: (1) direct callers of the changed symbols (file:line), (2) transitive callers (2-3 hops out), (3) tests that would need updating, (4) spec docs / implementation-summaries that assert current behavior, (5) other packages or plugins that depend on the current contract, (6) runtime state that would need migration (caches, databases, files), (7) rollout risk: what breaks if the change ships to some users but not others. P0 for any caller in a critical path with no fallback. P1 for tests or docs needing update. P2 for non-hot-path callers. ASCII dependency graph in synthesis." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__MODULE__-blast-radius-__CHANGE_SLUG__/
```

---

## Results Log

```markdown
## YYYY-MM-DD — <scope>

Scenario: DR-AA-__
Command: `/spec_kit:deep-research :auto "..."`
Spec folder: specs/.../
Executor: cli-codex gpt-5.4 high fast
Iterations: N / max
Verdict: PASS | CONDITIONAL | FAIL
Findings: P0=N P1=N P2=N
Architecture artifacts: [ASCII diagram, module table, layer matrix]
Surprises: [what the audit revealed that wasn't in prior docs]
Refactor go/no-go: [based on findings]
Link: research/research.md (commit SHA)
```
