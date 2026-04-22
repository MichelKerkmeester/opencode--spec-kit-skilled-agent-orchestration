---
title: "Deep Research Prompts — Pattern Mining"
description: "Extract canonical patterns and best practices from N existing sources. Use when building a new skill, writing a style guide, or documenting implicit conventions."
importance_tier: "normal"
contextType: "research-prompts"
---

# Pattern Mining

Extract the canonical pattern(s) for doing X by sampling N existing
implementations. Output: pattern catalog with evidence, counter-examples, and
pick-one-of-N decision guidance.

---

## Scenario DR-PM-01 — Canonical pattern from N same-purpose implementations

**When:** N files / modules solve the same problem; you need the canonical pattern.

**Paste this:**

```
/spec_kit:deep-research :auto "Mine the canonical pattern for __PROBLEM__ (e.g., 'MCP handler request validation', 'skill advisor trigger phrase extraction', 'graph metadata derived key-file extraction') across all instances in this repo. Scope: find every occurrence with `rg` or CocoIndex, typically __MIN_N__-__MAX_N__ files. For each instance: (a) cite file:line, (b) reduce to canonical signature, (c) note variations (parameter order, validation approach, error handling, return shape). Cluster into 2-4 major variants. For each variant: name it, quote the best representative, list the conditions under which it's preferred. Identify outright bugs or anti-patterns. P0: implementations with different contract semantics that can silently disagree. P1: significant variant divergence without clear decision rule. P2: stylistic drift. Final synthesis: canonical recipe + variant-selection matrix." --max-iterations=12 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__PATTERN_SLUG__-canonical/
```

---

## Scenario DR-PM-02 — Implicit-convention extraction

**When:** The codebase has implicit conventions (naming, file layout, comment style, import order) that aren't documented but everyone follows.

**Paste this:**

```
/spec_kit:deep-research :auto "Extract the implicit conventions followed in __SCOPE_PATH__. Audit: (a) file naming conventions (what kebab-case vs snake_case vs camelCase rules apply where), (b) directory layout — what lives in lib/ vs handlers/ vs shared/, (c) import ordering, (d) comment style (when are comments used, when omitted — our CLAUDE.md says 'default to no comments'), (e) exported vs private boundary conventions, (f) test file naming and colocation. Per convention: cite 5+ representative file:line examples, note the N-examples-agree rate, flag the violators. If violators are <10% of instances, they're outliers; if >25%, the 'convention' is a myth. Output: convention cheat-sheet + violation list. P1 for conventions that conflict with declared style guides (e.g., sk-code-opencode). P2 for ambiguous conventions." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SCOPE__-implicit-conventions/
```

---

## Scenario DR-PM-03 — Spec-folder template synthesis

**When:** You want to capture the actual structure (not the templated structure) of high-quality spec folders in this repo to seed a new template or style guide.

**Paste this:**

```
/spec_kit:deep-research :auto "Mine __N__ recently-completed high-quality spec folders to extract the canonical Level 3 packet structure. Scope: __LIST_OF_SPEC_FOLDERS__. For each packet: (a) catalog every doc file and its anchor tags, (b) measure spec.md / plan.md / tasks.md / checklist.md section presence, (c) extract representative frontmatter shapes, (d) count findings-per-packet (if review/ exists), (e) identify which ADRs were used and why. Cluster common structural moves and novel moves. Output: a 'tight template' distilled from actual practice + a 'optional extras' list with conditions for when each extra is worth including. Compare against .opencode/skill/system-spec-kit/templates/level_3/* and flag template drift. P1 for template drift that breaks validate.sh. P2 for organic conventions that could inform a template v2.3." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-spec-folder-template-synthesis/
```

---

## Scenario DR-PM-04 — Error-handling pattern catalog

**When:** You want to audit how errors are handled across a subsystem and extract the best practices to codify.

**Paste this:**

```
/spec_kit:deep-research :auto "Catalog error-handling patterns across __SCOPE_PATH__. For every try/catch, .catch(), error-return path, and rethrow: (a) cite file:line, (b) classify as 'recoverable / fail-closed / fail-open / escalate / ignore / log-only', (c) note whether the error is wrapped (context added) or bare, (d) flag any error paths that violate our error-envelope contract. Additionally: find all custom error classes and their call-sites. Synthesize 3-7 canonical error-handling recipes with conditions for each. P0: errors silently swallowed in security-relevant code. P1: fail-open where fail-closed is documented. P2: bare rethrow losing context." --max-iterations=11 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SCOPE__-error-handling-patterns/
```

---

## Scenario DR-PM-05 — Test-fixture pattern extraction

**When:** You need a style guide for test fixtures (setup/teardown, mocking, data-builders).

**Paste this:**

```
/spec_kit:deep-research :auto "Audit the test-fixture patterns used across __TEST_SCOPE__. For each test file: (a) setup approach (beforeEach, factory function, shared constants, inline), (b) teardown approach (afterEach, auto-cleanup, leak), (c) mocking approach (vi.mock, manual doubles, real deps, sandboxed env vars), (d) data-builder patterns (named fixtures, inline literals, faker-like), (e) isolation level (unit / integration / full stack). Cluster into 3-5 canonical fixture patterns with file:line representatives. Flag anti-patterns: test pollution (state leaks between tests), brittle mocks (mock drift from real), hidden mutations. P0 for tests that can pass/fail non-deterministically due to ordering. P1 for test-only mutation of shared state. P2 for fixture boilerplate duplication. Output: recommended fixture recipes + retirement list for anti-pattern fixtures." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__TEST_SCOPE__-fixture-patterns/
```

---

## Scenario DR-PM-06 — Prompt engineering pattern library

**When:** You want a library of prompt patterns from existing campaigns / agent definitions in this repo.

**Paste this:**

```
/spec_kit:deep-research :auto "Extract reusable prompt engineering patterns from this repo's existing agent/skill/command prompts. Scope: .opencode/agent/**/*.md, .opencode/skill/*/SKILL.md, .opencode/command/**/*.yaml|md, and recent /tmp/codex-prompt-*.txt captured in commit history. Extract patterns for: (a) Gate 3 pre-baked answers (for non-interactive dispatch), (b) sandbox-aware instructions (SANDBOX RULE blocks), (c) authority-scoping (READ/WRITE boundary declarations), (d) iteration-loop recipes, (e) evidence-required severity taxonomies (P0/P1/P2 schemes), (f) convergence-threshold choices, (g) fallback-dispatch escape hatches, (h) post-execution reporting formats. For each pattern: name, 1-2 canonical examples with file:line or commit SHA, the problem it solves, variations, conditions for use. Synthesize as a prompt-recipe playbook." --max-iterations=12 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-prompt-engineering-patterns/
```

---

## Results Log

```markdown
## YYYY-MM-DD — <pattern scope>

Scenario: DR-PM-__
Command: `/spec_kit:deep-research :auto "..."`
Spec folder: specs/.../
Executor: cli-codex gpt-5.4 high fast
Iterations: N / max
Verdict: PASS | CONDITIONAL | FAIL
Patterns extracted: [list of named canonical patterns + variant count]
Counter-examples: [anti-patterns worth retiring]
Codification target: [where the pattern library will live — new skill / style-guide update / README addendum]
Link: research/research.md (commit SHA)
```
