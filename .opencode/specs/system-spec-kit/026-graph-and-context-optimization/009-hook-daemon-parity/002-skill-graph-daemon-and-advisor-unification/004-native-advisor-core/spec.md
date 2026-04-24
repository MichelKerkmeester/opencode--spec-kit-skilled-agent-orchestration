---
title: "...text-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core/spec]"
description: "Port scoring to TypeScript under self-contained mcp_server/skill-advisor/. 5-lane analytical fusion (0.45/0.30/0.15/0.10/0.00). Skill projection, bounded skill_edges traversal, ambiguity handling, Python↔TS parity harness. Consumes 027/002 lifecycle-normalized inputs."
trigger_phrases:
  - "027/003"
  - "native advisor core"
  - "5-lane fusion"
  - "parity harness"
  - "skill projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-native-advisor-core"
    last_updated_at: "2026-04-20T14:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded 027/003 packet"
    next_safe_action: "Land 027/001 + 027/002, then dispatch /spec_kit:implement :auto 027/003"
    blockers:
      - "027/001 daemon + freshness must land"
      - "027/002 lifecycle-normalized inputs + fixtures must land (Y3 hard prerequisite)"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-003-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/003 — Native Advisor Core

<!-- SPECKIT_LEVEL: 2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../003-lifecycle-and-derived-metadata/spec.md` |
| **Successor** | `../005-mcp-advisor-surface/spec.md` |
| **Research source** | `research.md` §6 Track C + §13.4 Track G + §13.5 Y2/Y3; iterations 016-020, 022, 050-053, 057-058 |

## 2. PROBLEM & PURPOSE

### Problem
Advisor matching is a Python subprocess with fixed-weight keyword scoring. It can't leverage memory-MCP primitives (hybrid, causal, tier), has no lane separation, and no ablation protocol. Migrating means porting to TypeScript AND consuming 027/002's lifecycle-normalized inputs (Y3 hard prerequisite) so fusion validates against the correct pre-fusion state.

### Purpose
Port scoring to TypeScript under self-contained `mcp_server/skill-advisor/` package. Implement 5-lane analytical fusion with documented initial weights. Provide ablation protocol + Python↔TS parity harness. This packet is THE hard gate before 027/004 MCP surface + 027/006 promotion gates.

## 3. SCOPE

### In Scope
- **Target folder:** `mcp_server/skill-advisor/lib/` (NOT `mcp_server/lib/skill-advisor/`). Migrate existing `mcp_server/lib/skill-advisor/*.ts` (11 files) to the new folder as part of port.
- `lib/scorer/projection.ts` — project `skill_nodes` + `skill_edges` into advisor-shaped retrieval channels without mixing memory lifecycle fields.
- `lib/scorer/fusion.ts` — 5-lane analytical fusion with initial weights:
  - `explicit_author: 0.45`
  - `lexical: 0.30`
  - `graph_causal: 0.15`
  - `derived_generated: 0.10`
  - `semantic_shadow: 0.00` (shadow-only, never live)
- `lib/scorer/lanes/{explicit,lexical,graph-causal,derived,semantic-shadow}.ts` — per-lane scorers.
- `lib/scorer/ambiguity.ts` — top-2 within 0.05 confidence → ambiguous brief (post-025 renderer pathway).
- `lib/scorer/attribution.ts` — brief explains which lane(s) contributed.
- `lib/scorer/ablation.ts` — protocol for lane-by-lane validation.
- `tests/parity/python-ts-parity.vitest.ts` — exact per-prompt top-1 + pass-threshold/abstain agreement on 200-prompt corpus + canonical regression fixtures.
- Lifecycle-aware fixtures from 027/002 consumed via `tests/fixtures/lifecycle/` export.
- `bench/scorer-bench.ts` — cache-hit p95, uncached deterministic p95.

### Out of Scope
- MCP tool handlers (027/004).
- Shadow-cycle + promotion gates (027/006).
- Python shim removal (027/005 keeps it as compat during migration).
- Any weight tuning without the ablation protocol.
- **Automated causal-edge discovery (Track I, deferred to post-027).** Traversal uses existing / hand-authored `skill_edges` only. No trigger co-occurrence mining, no SKILL.md cross-reference inference, no command-bridge log mining. If implementation evidence surfaces a blocker, raise it; otherwise defer.

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. 5-lane fusion implemented with documented initial weights; weights live in a named constants module + Zod-validated config.
2. Semantic-shadow lane scored but never contributes to live ranking (weight 0.00).
3. Lifecycle-normalized inputs from 027/002 consumed (Y3 hard prerequisite).
4. Parity harness exists: exact per-prompt top-1 + pass-threshold/abstain match on 200-prompt corpus + canonical regression fixtures.
5. Python↔TS parity green on full corpus before this child converges.
6. Ablation protocol callable; documents corpus/holdout/parity/safety/latency slice deltas per lane move.
7. Scoring code lives under `mcp_server/skill-advisor/lib/` (NOT `mcp_server/lib/skill-advisor/`).

### 4.1.a Deterministic acceptance gates (from research.md §11)
8. **Full-corpus exact top-1 ≥ 70%** (≥140/200 correct).
9. **Stratified holdout top-1 ≥ 70%** (≥28/40 correct).
10. **UNKNOWN fallback count ≤ 10** on full corpus (down from 37 baseline).
11. **Gold-`none` false-fire count** on `none`-labeled prompts: no increase from baseline.
12. **Explicit-skill prompts:** top-1 / no-abstain — no regression, derived lane does not displace author-authored signals.
13. **Ambiguity slice stable:** top-2-within-0.05 cases render ambiguous brief (no silent collapse to single skill).
14. **Derived-lane attribution required:** derived-only or derived-dominant matches must be lane-attributed in output; cannot pass default confidence threshold without direct explicit/lexical support unless precision-gated.
15. **Adversarial-stuffing fixture** cannot pass default routing without legitimate direct evidence.
16. **Regression safety:** P0 pass rate 1.0, failed cases 0, command-bridge false-positive rate ≤ 0.05 on `skill_advisor_regression.py` suite (during compat window).

### 4.2 P1 (Required)
1. Skill projection layer: project-not-copy memory fields; advisor owns its own schema.
2. Bounded `skill_edges` traversal (depth + breadth caps).
3. Ambiguity rendering via top-2-within-0.05 rule.
4. Attribution: brief/metadata includes which lanes contributed.
5. Scorer bench: cache-hit p95 ≤50ms; uncached deterministic p95 ≤60ms.
6. Existing 11 lib/skill-advisor/*.ts files migrated to new location without behavior change (behavior diffs proven via existing 65-test suite baseline).

### 4.3 P2 (Suggestion)
1. Lane-specific tracing for debug (can be stripped at release).
2. Weight-config schema supports `--lane-ablation` flag.

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** Python scorer + TS scorer produce exact per-prompt top-1 match on all 200 corpus prompts.
2. **AC-2** Pass-threshold / abstain outcome matches on all 200 prompts.
3. **AC-3** Ambiguous prompt (top-2 within 0.05) renders ambiguous brief via renderer.
4. **AC-4** Ablation disabling `lexical` lane shows measurable accuracy drop (regression check).
5. **AC-5** Semantic-shadow lane produces scored candidates but contributes 0.00 to live fusion.
6. **AC-6** Cache-hit p95 ≤50ms; uncached deterministic p95 ≤60ms.
7. **AC-7** Skill migration: existing 65-test suite still green after files moved + imports updated.
8. **AC-8** Lifecycle fixture (superseded skill): explicit old-name prompt surfaces deprecated skill with redirect metadata from fusion output.

## 6. FILES TO CHANGE

### New / moved (under `mcp_server/skill-advisor/`)
- `lib/scorer/projection.ts`
- `lib/scorer/fusion.ts`
- `lib/scorer/weights-config.ts`
- `lib/scorer/lanes/{explicit,lexical,graph-causal,derived,semantic-shadow}.ts`
- `lib/scorer/ambiguity.ts`
- `lib/scorer/attribution.ts`
- `lib/scorer/ablation.ts`
- `bench/scorer-bench.ts`
- `tests/scorer/**` (unit)
- `tests/parity/python-ts-parity.vitest.ts`

### Migrated (from `mcp_server/lib/skill-advisor/` → `mcp_server/skill-advisor/lib/`)
- `skill-advisor-brief.ts`, `render.ts`, `subprocess.ts`, `prompt-cache.ts`, `prompt-policy.ts`, `freshness.ts`, `generation.ts`, `source-cache.ts`, `metrics.ts`, `normalize-adapter-output.ts`, `error-diagnostics.ts` (11 files)

### Test file migrations
- Move `mcp_server/tests/advisor-*.vitest.ts` to `mcp_server/skill-advisor/tests/` where applicable (package-local). Cross-package fixtures stay under `mcp_server/tests/_support/`.

### Kept but read-only referenced
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` — source-of-truth during parity, retired in a later phase (post-027).
