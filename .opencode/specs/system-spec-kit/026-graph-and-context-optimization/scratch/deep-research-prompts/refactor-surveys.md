---
title: "Deep Research Prompts — Refactor Surveys"
description: "Pre-refactor risk assessment campaigns. Use before committing to a non-trivial refactor to understand the blast radius, rollout risk, and rollback path."
importance_tier: "normal"
contextType: "research-prompts"
---

# Refactor Surveys

Before you commit to a refactor, run one of these to surface hidden dependencies,
rollout risks, and rollback triggers. Output: risk-scored change plan with
explicit go/no-go recommendation.

---

## Scenario DR-RS-01 — Rename/relocate survey

**When:** You want to rename a symbol, file, or directory that's widely referenced.

**Paste this:**

```
/spec_kit:deep-research :auto "Survey the blast radius of renaming __OLD_NAME__ → __NEW_NAME__ in this repo. Enumerate: (1) every production code reference with file:line, (2) every test reference, (3) every spec-doc mention (and which claims remain true after rename), (4) every comment / README / playbook reference, (5) every external artifact (commit messages, PR titles, URLs, memory triggers) that would become stale but wouldn't be auto-caught, (6) any compiled dist/ references that need rebuild, (7) any SQLite / cache / DB state that serializes the name. Output: rename-ready checklist + list of items that require manual follow-up. P0 for any reference that can't be found via `rg` (e.g., serialized in DB row or computed from template). P1 for test / spec references. P2 for comment / doc drift. Include a concrete git mv + sed command plan." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-rename-__OLD_SLUG__-to-__NEW_SLUG__/
```

---

## Scenario DR-RS-02 — Extract-shared-library survey

**When:** You want to extract duplicated logic from N files into a shared module.

**Paste this:**

```
/spec_kit:deep-research :auto "Survey the viability of extracting __FUNCTIONALITY_DESCRIPTION__ from __CURRENT_LOCATIONS_GLOB__ into a shared module at __PROPOSED_SHARED_PATH__. Analysis: (1) audit each current implementation — how similar are they really (line-by-line diff), are they copies / forks / convergent reinventions, (2) identify the minimal shared contract — what inputs/outputs are actually common, (3) per-site adaptation needs — what parameters need to vary, what state needs to inject, (4) breakage risk — what tests would need updating, what imports would shift, (5) performance impact — if the shared version has a cost all sites must pay, quantify, (6) rollback path — how do we back out if the shared version misbehaves. Output: extraction plan with explicit go/no-go. P0 if the implementations are NOT actually the same (false-positive extraction). P1 for per-site adaptation burden. P2 for stylistic differences." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-extract-__SHARED_SLUG__/
```

---

## Scenario DR-RS-03 — Split-large-module survey

**When:** A single file has grown too large and you want to split it.

**Paste this:**

```
/spec_kit:deep-research :auto "Survey the viability of splitting __LARGE_MODULE_PATH__ (__CURRENT_LINE_COUNT__ lines) into multiple files. Analysis: (1) extract the actual clusters of related functions/classes via call-graph analysis — cite file:line for grouping evidence, (2) propose __N__ new file names + which functions go where, (3) audit internal coupling — what would become cross-file after split, measure the added import density, (4) private-state / module-local caches / closures that break the split, (5) test file reorganization if tests mirror the source layout, (6) public API preservation — every currently-exported symbol must still work from its current import path (re-exports may be needed). Output: split plan + required re-export scaffolding + test-reorg checklist. P0 for splits that break the public API. P1 for couplings that force a different cut. P2 for aesthetic friction." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-split-__MODULE_SLUG__/
```

---

## Scenario DR-RS-04 — Deprecate-and-remove survey

**When:** You want to remove a feature/API that may still have consumers.

**Paste this:**

```
/spec_kit:deep-research :auto "Survey the safety of deprecating + removing __FEATURE_OR_API__. Find every current consumer: (1) direct callers in this repo (file:line), (2) test callers, (3) spec-doc mentions that promise the feature to operators, (4) external consumers — search commit history, memory entries, feature_catalog, install guides for anything that assumes this feature's existence, (5) runtime artifacts that might silently depend on the feature (hook configs, env vars, plugin loads). For each consumer: classify as 'migratable in <10 LOC' / 'needs replacement feature' / 'can be deleted entirely'. Propose a deprecation timeline with explicit milestones: T=0 announce, T+1 warn on use, T+2 feature-flag off by default, T+3 remove. Estimate risk per milestone. P0: a consumer with no viable replacement and high usage. P1: consumers requiring non-trivial migration. P2: quiet consumers whose removal is trivial." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-deprecate-__FEATURE_SLUG__/
```

---

## Scenario DR-RS-05 — Migration path survey (algorithm / backend / schema)

**When:** You want to migrate from approach A to approach B (e.g., SQLite → DuckDB, Python scorer → TypeScript, v1 schema → v2 schema).

**Paste this:**

```
/spec_kit:deep-research :auto "Survey the migration path from __CURRENT_APPROACH__ to __TARGET_APPROACH__. Analysis: (1) every read/write site of the current implementation with file:line, (2) the minimal adapter interface that abstracts both, (3) backfill strategy if persistent state is involved (one-shot vs incremental, reversible vs one-way), (4) dual-write period plan — when can reads safely come from the new backend, when can writes go new-only, (5) observability — what metrics must exist to verify parity during migration, (6) rollback path — what specifically does 'undo' look like at each milestone, (7) test strategy — golden tests that both implementations must pass. Output: migration plan with explicit checkpoints, dual-write windows, and rollback procedures. P0: checkpoints that would be irreversible once passed. P1: parity gaps that could cause silent divergence during dual-write. P2: observability gaps." --max-iterations=14 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-migrate-__MIGRATION_SLUG__/
```

---

## Scenario DR-RS-06 — Invert-dependency survey (break a circular import)

**When:** Circular imports exist and you need to know how to break them.

**Paste this:**

```
/spec_kit:deep-research :auto "Survey circular import chains in __SCOPE_PATH__. Identify every cycle (even length-2 cycles), for each: (1) the nodes involved (file paths), (2) the symbols that cross the cycle, (3) the causal direction — which symbol should own the interface, which should depend on it, (4) the extraction target — a shared interface module / a type-only module / an inversion of control layer. Propose the specific minimal refactor per cycle. Flag cycles that likely indicate the modules are fused (should become one file) vs cycles that indicate genuine architectural drift (should be split more cleanly). P0 for cycles that cause runtime ordering issues. P1 for cycles that block isolated testing. P2 for cycles that are only stylistic." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-invert-deps-__SCOPE_SLUG__/
```

---

## Scenario DR-RS-07 — Schema-evolution safety survey

**When:** You want to change a persistent schema (JSON, SQLite, YAML frontmatter) and need to know what breaks.

**Paste this:**

```
/spec_kit:deep-research :auto "Survey the safety of a schema change: __CURRENT_SCHEMA_SUMMARY__ → __PROPOSED_SCHEMA_SUMMARY__ for __SCHEMA_LOCATION__. Find: (1) every writer of this schema (file:line), (2) every reader, (3) every consumer of the parsed output, (4) existing persistent data in this format and their shape distribution, (5) migration script path (one-way vs reversible), (6) compatibility layer viability — can readers handle both old and new for a rollout window, (7) validator coverage — does validate.sh or schema.vitest cover both shapes, (8) runtime fallback when the reader hits unexpected shape. Output: schema-evolution plan with migration script, compat window, and explicit rollback checkpoints. P0: silent data loss on migration. P1: non-backward-compatible reader that would fail on old data. P2: cosmetic schema drift." --max-iterations=11 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-schema-__SCHEMA_SLUG__-evolution/
```

---

## Results Log

```markdown
## YYYY-MM-DD — <refactor target>

Scenario: DR-RS-__
Command: `/spec_kit:deep-research :auto "..."`
Spec folder: specs/.../
Executor: cli-codex gpt-5.4 high fast
Iterations: N / max
Verdict: PASS (safe) | CONDITIONAL (go with mitigations) | FAIL (do not proceed)
Blast radius: N production callers, M tests, K docs, L external artifacts
Go/no-go: [with explicit conditions]
Rollback plan: [summary]
Checkpoint milestones: [ordered list]
Link: research/research.md (commit SHA)
```
