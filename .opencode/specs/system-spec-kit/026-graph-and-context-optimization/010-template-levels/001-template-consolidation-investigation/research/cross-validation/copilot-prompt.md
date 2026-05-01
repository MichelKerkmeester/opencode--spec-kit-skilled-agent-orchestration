# Independent analysis request — template system greenfield design

You are a fresh agent with no prior context. Read this carefully and respond with a **research scope proposal**, not a final answer.

## Context

This repo uses a "spec-kit" framework where every code-changing task has an associated spec folder under `.opencode/specs/`. Each spec folder contains markdown documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) plus optional addon docs (`handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`). These docs are scaffolded from templates that live in `.opencode/skill/system-spec-kit/templates/`.

### Current template system (the thing under evaluation)

Today's templates folder = **86 files / ~13K LOC**, organized as:

- `core/` — 4 source files (`spec-core.md`, `plan-core.md`, `tasks-core.md`, `impl-summary-core.md`) — the irreducible base content for each doc type
- `addendum/` — 4 folders (`level2-verify/`, `level3-arch/`, `level3-plus-govern/`, `phase/`) — extension blocks that add sections per "level"
- `level_1/`, `level_2/`, `level_3/`, `level_3+/` — 4 folders containing **rendered output** of `compose.sh` (the build-time composer that mixes `core/` + applicable `addendum/` for each level)
- `phase_parent/` — lean trio template for "parent" packets that have phase children
- Cross-cutting templates at root (`handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`)
- `scripts/templates/compose.sh` — the composer; reads `core/` + `addendum/`, writes `level_N/` outputs to disk
- `scripts/templates/wrap-all-templates.ts` — anchor-tag injector (memory parsers depend on `<!-- ANCHOR:section-id -->` comments around each section)
- `scripts/spec/create.sh` — primary consumer; `cp`-copies files from `level_N/` into the new spec folder
- `scripts/rules/check-files.sh` — validator; encodes "Level N requires files X,Y,Z"

### Level system (today)

- **Level 1** (`<100 LOC`): spec.md + plan.md + tasks.md + impl-summary.md
- **Level 2** (`100-499 LOC`): Level 1 + checklist.md
- **Level 3** (`>=500 LOC` / arch): Level 2 + decision-record.md
- **Level 3+** (enterprise): Level 3 + governance/sign-off/AI-protocols
- **Phase parent** (special): only spec + description.json + graph-metadata.json (lean trio)

### Prior research outcome

A 10-iteration deep-research loop just completed (`./research/research.md`, 29.7 KB). It recommended **PARTIAL consolidation** — keep `level_N/` rendered dirs as committed goldens, fix `compose.sh` byte-equivalence, add a thin TS resolver, migrate consumers, optionally delete `level_N/` later (Phase 4). This recommendation was driven heavily by a backward-compat concern: 868 existing spec folders contain provenance markers (`<!-- SPECKIT_TEMPLATE_SOURCE: ... -->`) that reference the level taxonomy.

### The reframe (your job)

The user has now **explicitly rejected** the backward-compat focus. Their literal words:

> "We want to change the template system itself and not focus research on fixing stuff retroactively."

> "simplest template back-end architecture / unique template addon documents etc. Also maybe remove level system with something more smart."

So the design problem is now **greenfield**:
- Existing 868 spec folders are immutable git history. Their provenance markers are descriptive comments. Nothing re-renders them. They're not a constraint on the new template system.
- Goal: simplest possible backend storage of templates
- Open question: do we even need the level system? Or is there a smarter axis?
- Open question: how should the addon docs (handover, debug-delegation, research, resource-map, context-index) fit into the new system?
- ANCHOR semantics + frontmatter conventions still matter (memory parsers + the deep-research loop both depend on them).
- `phase_parent` semantics (lean trio) still matter.

## Your task

Respond with a **research scope proposal** — what questions should the next research iteration investigate? What design options should it compare? What experiments would distinguish between options?

**Specifically include:**

1. **5-10 research questions** that the next loop should answer. Frame each question so it has a concrete, testable answer (not "explore X").
2. **3-7 candidate greenfield designs** with one-sentence pros/cons each. Cover the spectrum from "minimal change" to "radical simplification."
3. **2-4 critical experiments** the loop should run to distinguish between designs (e.g., "scaffold a sample packet under design A vs design D and count files / ergonomics / generator complexity").
4. **A proposed iteration count and convergence threshold** for the next deep-research loop based on how well-scoped the question is.
5. **Top 3 risks or tradeoffs** the loop should be careful to surface.

**Critical constraints on your response:**
- Do NOT propose a final answer. Propose the **research that should happen**.
- Be SHARP and specific. Vague "explore tradeoffs" doesn't help.
- Challenge assumptions if you see ones worth challenging — including assumptions in this prompt.
- Keep the response under 1500 words. Quality over volume.

Write your response as plain markdown to stdout.
