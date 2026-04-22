---
title: "Deep Research Prompts — Cross-Project Comparisons"
description: "Comparative research campaigns that contrast approaches across codebases, libraries, or doc sets. Use when choosing between patterns or benchmarking against prior art."
importance_tier: "normal"
contextType: "research-prompts"
---

# Cross-Project Comparisons

Compare approach A vs B vs C across codebases, libraries, or doc sets. Output
is a grounded comparison matrix with ranked tradeoffs and a recommended choice
tied to your specific context.

---

## Scenario DR-CPC-01 — Pattern comparison across 2-5 projects

**When:** You're deciding between alternative implementation patterns and want to see how they play out in practice across real projects.

**Paste this:**

```
/spec_kit:deep-research :auto "Compare how __PATTERN_A__ vs __PATTERN_B__ vs __PATTERN_C__ are implemented in practice. Sources to audit:\n- __PROJECT_1_PATH_OR_URL__\n- __PROJECT_2_PATH_OR_URL__\n- __PROJECT_3_PATH_OR_URL__\n\nFor each pattern, extract: (1) canonical example with file:line, (2) the specific problem it solves, (3) constraints/assumptions it makes, (4) observed failure modes, (5) ecosystem consensus or divergence. Output a comparison matrix: patterns × (fit-for-purpose / complexity / performance / operational cost / learning curve / community adoption). Recommend a choice for __OUR_CONTEXT__: __CONTEXT_SUMMARY__. P0 for patterns with known-broken implementations in real projects. P1 for subtle correctness hazards. P2 for aesthetic/style differences." --max-iterations=12 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__PATTERN_COMPARISON__-cross-project/
```

---

## Scenario DR-CPC-02 — Library/framework selection

**When:** You need to pick a library or framework for a specific feature area.

**Paste this:**

```
/spec_kit:deep-research :auto "Evaluate __LIBRARY_A__ vs __LIBRARY_B__ (vs __LIBRARY_C__) for implementing __FEATURE_NEED__ in this codebase. For each candidate: (1) installed footprint (deps, bundle size, runtime deps), (2) API surface fit for our use-case — write sample code for __CANONICAL_OPERATIONS__, (3) failure modes and error surface, (4) maintenance health (last release, open issue count, last P1 fix), (5) incompatibility risk with our existing __CURRENT_STACK__, (6) migration cost from our current approach __CURRENT_APPROACH__. Evidence for every claim: docs link, GitHub file:line, or `npm view` output. P0 for any library with active CVE or abandoned status. P1 for API gaps that require fork/workaround. P2 for style mismatches. Final recommendation with tradeoffs explicit." --max-iterations=12 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__FEATURE__-library-selection/
```

---

## Scenario DR-CPC-03 — Our-implementation vs upstream reference

**When:** We built X in-house; you want to know how our implementation compares to a canonical upstream reference (e.g., LangChain's version, Hugging Face's version, a published paper).

**Paste this:**

```
/spec_kit:deep-research :auto "Compare our in-house implementation of __FEATURE__ at __OUR_PATH__ against the reference implementation at __REFERENCE_URL_OR_PATH__ and the paper/design doc at __DESIGN_REFERENCE__. Deliverables: (1) algorithmic parity check — does our code compute the same thing, with evidence, (2) feature-gap matrix (reference has X, we have Y, gap = Z), (3) performance assumption divergence (reference assumes A, we assume B), (4) correctness audit — where do we diverge from published semantics and why, (5) recommendation: adopt upstream / fork / keep ours / document divergence intentionally. P0 for silent semantic divergence that affects correctness. P1 for missing features we'd benefit from. P2 for stylistic / API shape differences. Cite our file:line AND the reference file:line or paper section for every claim." --max-iterations=14 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__FEATURE__-upstream-parity/
```

---

## Scenario DR-CPC-04 — Spec-kit / skill pattern cross-check

**When:** You're writing a new skill or spec-kit extension and want to see how N existing skills / packets solve similar problems.

**Paste this:**

```
/spec_kit:deep-research :auto "Cross-reference how __PROBLEM_TYPE__ (e.g., 'spec-folder auto-detection', 'advisor confidence gating', 'graph metadata refresh') is handled across existing skills in this repo. Scope: scan ALL .opencode/skill/*/SKILL.md + references/ + scripts/ for prior art. For each existing approach: cite the skill name, file:line of the relevant code, the specific problem it solved, whether it's still current or deprecated, and a one-line 'do this if __condition__' summary. Synthesize the canonical pattern(s) and the conditions for choosing each. Flag outright contradictions across skills. P0 for contradictions that would cause runtime failure when two skills are active. P1 for divergent approaches that should converge. P2 for stylistic variance." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__PROBLEM_TYPE__-cross-skill/
```

---

## Scenario DR-CPC-05 — CLI executor capability comparison

**When:** You need to decide which CLI executor (codex / copilot / claude / gemini) best fits a specific workflow.

**Paste this:**

```
/spec_kit:deep-research :auto "Compare the 4 CLI executors (codex, copilot, claude-code, gemini) for the workflow: __WORKFLOW_DESCRIPTION__. Dimensions: (a) prompt throughput — how many tokens / iteration can each handle, (b) concurrency limits — per-account / per-organization caps with source evidence, (c) sandbox behavior — filesystem access, git behavior, network, (d) tool/MCP compatibility — which MCP servers each speaks, (e) cost per iteration at typical scale, (f) known-failure modes (e.g., codex hangs on stdin, copilot rate-limits at 3), (g) observable latency percentiles from recent usage. Primary evidence sources: .opencode/skill/cli-*/SKILL.md + references/ + recent /tmp/*-driver-stdout.log outputs in this repo. Recommendation matrix: workflow-pattern × best-executor with confidence score. P0 for any executor with documented data-loss pattern. P1 for undocumented concurrency limits. P2 for stylistic output differences." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-cli-executor-__WORKFLOW_SLUG__/
```

---

## Scenario DR-CPC-06 — Old-vs-new implementation parity

**When:** You migrated a subsystem (e.g., from Python → TypeScript, or from one algorithm to another) and need to verify the new one behaves identically on the relevant surface.

**Paste this:**

```
/spec_kit:deep-research :auto "Audit behavioral parity between __OLD_IMPL_PATH__ and __NEW_IMPL_PATH__ across a representative input set. Scope: (a) identify the canonical test/fixture set that both must pass, (b) run both against the same inputs (script both invocations, capture outputs), (c) diff outputs line-by-line and categorize differences as: FUNCTIONAL (semantics changed), COSMETIC (formatting only), INTENDED (documented divergence in migration spec at __MIGRATION_SPEC_PATH__), UNDOCUMENTED (functional divergence not in spec). Sample at least __N__ representative inputs. P0: any UNDOCUMENTED FUNCTIONAL divergence on a documented P0 test case. P1: INTENDED divergence without spec backing. P2: COSMETIC differences that affect downstream parsers. Final: go/no-go recommendation for retiring __OLD_IMPL_PATH__." --max-iterations=14 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SUBSYSTEM__-migration-parity/
```

---

## Results Log

```markdown
## YYYY-MM-DD — <comparison topic>

Scenario: DR-CPC-__
Command: `/spec_kit:deep-research :auto "..."`
Spec folder: specs/.../
Executor: cli-codex gpt-5.4 high fast
Iterations: N / max
Verdict: PASS | CONDITIONAL | FAIL
Comparison matrix: [summary of winners per dimension]
Recommended choice: [with confidence + conditions]
Tradeoffs accepted: [what we give up]
Follow-ups: [implementation plan / next spec folder]
Link: research/research.md (commit SHA)
```
