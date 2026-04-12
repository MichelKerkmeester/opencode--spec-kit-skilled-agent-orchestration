# Codex CLI Prompt — Implement packet 014-code-graph-upgrades runtime

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). This prompt is self-contained — you have no prior conversation context. Read the files I name, implement the runtime lanes, run the verification commands, report results.

## SCOPE

Ship the runtime for packet `014-code-graph-upgrades` per its 9-task roadmap. Packet 014 is scaffolded as a Level-3 planning packet at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/`, but its current §2 marks it as "planning-only, does not authorize code implementation in this run." **That boundary is now lifted** (Step 0 below). You will edit 014's spec.md to authorize runtime, then implement the adopt-now lane (5 required lanes) across the existing Code Graph MCP surfaces.

014 is a **post-R5/R6 side branch** depending on:
- **007** (detector regression floor) — shipped; you will add regression fixtures under its discipline
- **011** (graph payload validator + trust preservation) — shipped; you will enrich current owner payloads additively
- **008** (graph-first routing nudge) — shipped; **STRICT non-overlap**: do NOT touch startup/resume/compact/response-hint surfaces

## PRE-APPROVALS (do not ask)

- Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/` (PRE-APPROVED, skip Gate 3)
- Skill routing: pre-decided implementation work, skip Gate 2
- Sandbox: workspace-write — you may write to runtime files under `mcp_server/`, tests under `mcp_server/tests/` and `scripts/tests/`, and docs under the 014 packet folder
- Boundary override: user explicitly authorized runtime implementation of 014 in this run. You will codify this in Step 0 by editing 014/spec.md §2

## MANDATORY READS (read once at start)

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md` — packet scope, requirements (REQ-001..REQ-009), acceptance scenarios
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/plan.md` — phases, execution rules, dependency matrix
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/tasks.md` — the 9 roadmap tasks
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/decision-record.md` — ADR-001 (011 dependency), ADR-002 (008 non-overlap), ADR-003 (prototype-later boundaries), ADR-004 (side-branch placement)
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/research.md` — §20 Code Graph Upgrade Charter (the canonical roadmap; §20.1-20.8 covers charter boundary, matrix, adopt-now lane, prototype-later lane)
6. **Predecessor contracts you must respect**:
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/z_archive/research-governance-contracts/011-graph-payload-validator-and-trust-preservation/spec.md` — validator contract you must NOT replace
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md` §3 Out of Scope — the non-overlap boundary
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/z_archive/research-governance-contracts/007-detector-provenance-and-regression-floor/spec.md` — the regression floor discipline
7. **Existing runtime you'll touch** (read current state before editing):
   - `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` — has 005's `CertaintyStatus`, 006's `StructuralTrust` axes (`ParserProvenance`/`EvidenceStatus`/`FreshnessAuthority`), 011's validator
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` — the code-graph query handler (blast-radius lives here)
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` — code-graph context enrichment
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts` — scan-time detector output
   - `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` — an existing detector with provenance labels
   - `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` — graph search logic
   - `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` — blast-radius type definitions

## STEP 0 — Override the planning-only boundary (do this first)

Edit `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md`:

Replace the §2 boundary note:
```
> **Planning boundary:** This is a planning-only packet. It does not authorize code implementation in this run, does not touch live Code Graph MCP source, does not touch any `external/` tree, and keeps packet `008` authoritative for startup, resume, compact, and response-surface nudges.
```

With:
```
> **Runtime authorization:** As of 2026-04-09, runtime implementation of the adopt-now lane is explicitly authorized by the operator. Implementation remains bounded to code-graph-local detector, payload, and query surfaces inside `mcp_server/`. This packet still does NOT touch any `external/` tree and keeps packet `008` authoritative for startup, resume, compact, and response-surface nudges. Clustering, export, and routing-facade work remains prototype-later per ADR-003 and does not land in this run.
```

Also update the **Status** row in §1 METADATA from `Draft` to `Implementing`.

This is the only pre-implementation edit. Do not change any other text in 014/spec.md until the runtime lanes are complete, then update the Files to Change table + implementation-summary.md as part of Step 7 (closeout).

## REQUIRED RUNTIME LANES (execute A → E in order, verify after each)

### LANE A — Detector provenance taxonomy + serialization (T002)

**Goal**: Graph detector outputs distinguish `ast | structured | regex | heuristic` provenance and never mislabel non-AST results as AST.

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` — add a new `DetectorProvenance` type (or extend 006's existing `PARSER_PROVENANCE_VALUES` const array if it currently lacks `structured`). Export the type + assertion helper + isDetectorProvenance guard.
- Scan `mcp_server/lib/search/` for detector files that emit provenance labels. `evidence-gap-detector.ts` is a known candidate from packet 007's audit (which found no AST overclaims). Do NOT rewrite detectors whose provenance is already honest. Focus on any detector that currently has no provenance field or uses a loose string.
- `mcp_server/handlers/code-graph/scan.ts` and `mcp_server/handlers/code-graph/context.ts` — wire the detector provenance into scan/context responses if they aren't already carrying it.

**Constraint**: 
- 006 owns the `ParserProvenance` type that's currently used by 011's structural-trust axes. Your `DetectorProvenance` must either (a) REUSE `ParserProvenance` if the 4 values map cleanly, or (b) be a SUPERSET declared alongside it, with explicit conversion helpers. Do NOT collide with or shadow the existing type.
- 011's `StructuralTrust.parserProvenance` field must continue to accept the same set of values it accepts today. If you extend, ensure 011's tests still pass.

**Test**:
- Add a new vitest file or extend `tests/structural-trust-axis.vitest.ts` (006's) or `scripts/tests/detector-regression-floor.vitest.ts.test.ts` (007's). Assert:
  - A non-AST detector path never emits `provenance: 'ast'`
  - The explicit fallback state (`structured` or `heuristic`) survives serialization through the payload envelope
  - The `DetectorProvenance` type guard rejects invalid values

### LANE B — Blast-radius depth-cap correction + multi-file union (T003)

**Goal**: `code_graph_query` blast-radius enforces `maxDepth` BEFORE result inclusion (not after), and supports explicit multi-file union semantics.

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` — the main query handler. Search for `blastRadius`, `maxDepth`, or `traverse` logic. If the current code applies `maxDepth` as a post-filter instead of bounding the traversal itself, fix it.
- `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` — if the blast-radius input type needs a `unionMode?: 'single' | 'multi'` parameter (or similar) to request explicit multi-file union, add it.

**Constraint**:
- Depth enforcement must be at the traversal level (cut the BFS/DFS at depth N), not a post-filter that still visits all nodes.
- Multi-file union must be an EXPLICIT caller flag, not an implicit behavior change. Default behavior must match whatever the current behavior is (don't silently change semantics).

**Test**:
- Add a new vitest file OR extend an existing code-graph test. Create a small frozen graph (in-memory or fixture file) with nodes at depths 0, 1, 2, 3, 4. Assert:
  - Query with `maxDepth: 2` returns nodes at depth ≤ 2 and NEVER surfaces depth-3 or depth-4 nodes
  - Query with `maxDepth: 0` returns only the seed node
  - Multi-file union mode, when requested explicitly, merges results from multiple seed nodes without duplication

### LANE C — Degree-based hot-file breadcrumbs (T011)

**Goal**: Code-graph outputs surface honest degree-based hot-file breadcrumbs as low-authority "change carefully" hints (NOT authority claims).

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` or `handlers/code-graph/context.ts` — add a helper that computes degree (in-degree + out-degree) for each file node in the result set, then annotates nodes with a `hotFileBreadcrumb?: { degree: number; changeCarefullyReason: string }` field when degree exceeds a threshold (suggested default: top 10% of nodes in the result set, or absolute >= 20, whichever is lower).
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` — if a new breadcrumb type is needed, add it as an OPTIONAL field on the existing code-graph payload owner type (additive only).

**Constraint**:
- The breadcrumb wording must be ADVISORY: `changeCarefullyReason: "High-degree node; changes here ripple to N dependents"`. NEVER use authority wording like `authority: 'high'` or `trustLevel: 'critical'`.
- The breadcrumb must NOT replace or compete with 011's `StructuralTrust` envelope. It's a DIFFERENT field on the same payload section.

**Test**:
- Assert that breadcrumbs appear only on nodes exceeding the degree threshold
- Assert that breadcrumb wording contains "change carefully" (or equivalent low-authority phrasing) and does NOT contain `authority:` or `trust:` as structured field names
- Assert that a result set with no high-degree nodes produces no breadcrumbs (empty, not error)

### LANE D — Edge evidence classes + numeric confidence backfill (T012)

**Goal**: Graph payload schema gains `edgeEvidenceClass` (e.g., `direct_call | import | type_reference | inferred_heuristic | test_coverage`) and `numericConfidence` (0.0-1.0) on existing owner contracts, additively. NO new graph-only owner payload family.

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` — add:
  - `EdgeEvidenceClass` type (enum or string literal union)
  - `GraphEdgeEnrichment` interface with `edgeEvidenceClass` + `numericConfidence` (optional fields)
  - Helper: `attachGraphEdgeEnrichment(payload, enrichment)` similar to 011's `attachStructuralTrustFields`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` — populate edge enrichment on query results when the caller requests enriched output (gate behind a request flag or return unconditionally if backward-compatible)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` — if bootstrap surfaces code-graph context payloads, ensure edge enrichment is PRESERVED through to the bootstrap output (don't strip it). Refer to how 011's `structuralTrust` is preserved via `extractStructuralTrustFromPayload` → `attachStructuralTrustFields`. Mirror that pattern for edge enrichment.

**Constraint (ADR-001)**:
- 011 owns the fail-closed trust contract. Your edge enrichment is ADDITIVE on top of 011's payload envelope. Do NOT create a new validator, new owner surface, or new trust axis.
- All enrichment must preserve 011's `StructuralTrust` fields. Both types coexist on the same payload sections.
- If the payload already fails 011's validator, don't attempt to add edge enrichment — let the validator failure propagate.

**Test**:
- Assert that a query result with edge enrichment carries both `structuralTrust` (from 011) AND `edgeEvidenceClass`/`numericConfidence` (from 014) on the same payload section
- Assert that a numerical confidence outside [0, 1] is rejected
- Assert that bootstrap preserves edge enrichment from resume payloads end-to-end (integration test with real `handleSessionResume` — follow the pattern from the lane-3 fix of the prior remediation cycle)

### LANE E — Regression fixtures under 007 discipline (T013)

**Goal**: Frozen fixtures that fail on detector-provenance regressions AND blast-radius depth regressions. Owned by 014 but co-located with 007's fixture discipline.

**Affected files**:
- `.opencode/skill/system-spec-kit/scripts/tests/` — follow the pattern of `detector-regression-floor.vitest.ts.test.ts` (007's existing fixture harness). Add a new file `graph-upgrades-regression-floor.vitest.ts.test.ts` that:
  - Loads frozen input samples (inline or from `scripts/tests/fixtures/graph-upgrades/`)
  - Runs the detector provenance logic from Lane A and asserts provenance labels match frozen expectations
  - Runs the blast-radius traversal from Lane B with a frozen graph and asserts depth-cap behavior
  - FAILS on any regression that reintroduces AST overclaiming or depth-cap leakage
- (Optional) `.opencode/skill/system-spec-kit/scripts/tests/fixtures/graph-upgrades/` — create if you decide to externalize the fixture data

**Constraint**:
- Must use the same pattern as 007's existing `detector-regression-floor.vitest.ts.test.ts` (note: the `.vitest.ts.test.ts` suffix is intentional for scripts-side vitest config — follow the existing convention)
- Fixture data must be small (3-5 scenarios). This is a REGRESSION FLOOR, not an exhaustive corpus.
- The test must FAIL if the fix from Lane A or Lane B is reverted — this is the whole point of the fixture floor.

### OPTIONAL LANES (defer by default, only implement if time remains after A-E pass clean)

**LANE F (T014) — Graph-local lexical fallback capability selector** — If `code_graph_query` has any lexical fallback path (similar to 010's FTS5 capability cascade), add a capability selector + forced-degrade matrix. DEFER unless you discover a concrete existing fallback path. If the current query.ts has no lexical fallback, skip this lane and note it in the implementation summary.

**LANE G (T015) — Clustering/export contracts behind feature flags** — Per ADR-003, these are prototype-later. DEFER entirely unless the operator explicitly says otherwise. If you implement ANY clustering or export hint, gate it behind a hard-off feature flag and include no user-visible surface.

## STEP 7 — Closeout (after A-E are all green)

1. **Update 014/implementation-summary.md** — replace the placeholder body with a real closeout following the pattern of 002-implement-cache-warning-hooks/implementation-summary.md (shipped, canonical example):
   - `Metadata.Completed: 2026-04-09`
   - `What Was Built` section with concrete per-lane summary
   - `How It Was Delivered` section with the sequence
   - `Key Decisions` table with the real decisions made during implementation (e.g., whether DetectorProvenance reused or extended ParserProvenance, whether blast-radius traversal was a bug or pre-existing limitation, etc.)
   - `Verification` table with exact commands run + PASS/FAIL for each
   - `Known Limitations` section — honest, specific, numbered
2. **Update 014/checklist.md** — mark every P0/P1/P2 item `[x]` with `[SOURCE: <file:line>]` evidence pointers to shipped code/tests. Fill L3 sign-off rows with `[Packet Orchestrator]`, `[x] Approved`, `2026-04-09`.
3. **Update 014/tasks.md** — mark T002-T015 `[x]`. If any optional task was deferred, mark it `[ ] DEFERRED` with rationale in an adjacent note.
4. **Update 014/plan.md** — mark all Phase 1/2/3 checkboxes and Definition-of-Done checkboxes `[x]`.
5. **Update 014/spec.md §1 METADATA** — Status: `Implementing` → `Implemented`.
6. **Update 014/spec.md §3 Files to Change** — replace the scaffold-only file list with the ACTUAL runtime files you modified.

## VERIFICATION COMMANDS (run after each lane AND at the very end)

```bash
cd .opencode/skill/system-spec-kit/mcp_server
TMPDIR=./.tmp/tsc-tmp npm run typecheck
TMPDIR=./.tmp/vitest-tmp npx vitest run \
  tests/shared-payload-certainty.vitest.ts \
  tests/structural-trust-axis.vitest.ts \
  tests/graph-payload-validator.vitest.ts \
  tests/graph-first-routing-nudge.vitest.ts \
  tests/sqlite-fts.vitest.ts \
  tests/hook-state.vitest.ts \
  tests/hook-session-start.vitest.ts \
  tests/handler-memory-search.vitest.ts \
  tests/publication-gate.vitest.ts \
  <any new 014-specific test files you added>
cd -

cd .opencode/skill/system-spec-kit/scripts
TMPDIR=./.tmp/vitest-tmp npx vitest run \
  tests/detector-regression-floor.vitest.ts.test.ts \
  tests/session-cached-consumer.vitest.ts.test.ts \
  tests/warm-start-bundle-benchmark.vitest.ts.test.ts \
  tests/graph-upgrades-regression-floor.vitest.ts.test.ts
cd -

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades
```

ALL must PASS. The existing test files (covering 005-013) are your regression guard — they MUST continue to pass. Any new 014 test files must PASS too.

## CONSTRAINTS (absolute)

- **READ FIRST**: read every file before editing it. Do NOT edit blind.
- **SCOPE LOCK**: only modify runtime files inside `mcp_server/` (specifically `handlers/code-graph/`, `lib/context/`, `lib/search/`, `handlers/session-bootstrap.ts`, `tools/types.ts`) + test files inside `mcp_server/tests/` and `scripts/tests/` + the 014 packet folder docs.
- **STRICT 008 NON-OVERLAP (ADR-002)**: Do NOT modify `hooks/claude/session-prime.ts`, do NOT add startup/resume/compact/response-hint routing nudges, do NOT touch `context-server.ts` for routing logic. 008 owns those surfaces.
- **STRICT 011 DEPENDENCY (ADR-001)**: Your edge enrichment must be ADDITIVE on top of 011's `StructuralTrust` envelope. Do NOT weaken 011's validator, do NOT replace its fail-closed semantics, do NOT create a parallel graph-only trust contract.
- **STRICT 007 FIXTURE DISCIPLINE**: All detector/blast-radius changes must ship with frozen regression fixtures that fail on reverts. No runtime-only changes without a fixture.
- **ADDITIVE ONLY on shared files**: `shared-payload.ts`, `session-bootstrap.ts`, `contracts/README.md`, `ENV_REFERENCE.md` are touched by multiple packets. ADD on top of the existing structure. Do NOT delete, weaken, or rename anything 005-013 shipped.
- **PROTOTYPE-LATER DEFERRALS (ADR-003)**: routing facade, Leiden clustering, GraphML/Cypher exports, rationale-node support are OUT OF SCOPE for this run. Defer them entirely.
- **NO new subsystem, agent, or skill**: 014 is bounded to the existing Code Graph MCP substrate.
- **DO NOT COMMIT**: leave all changes uncommitted for the operator to review.
- **006-research-memory-redundancy alignment**: Do NOT modify the memory save generator, collector, body template, or memory-template-contract. 014 is a runtime-code packet; its alignment status under 006's Downstream Impact Map defaults to "No change".
- **HONESTY**: If a lane cannot be implemented cleanly (e.g., the blast-radius code is already correct, or there's no detector with an AST overclaim to fix), report that truthfully in the lane's BLOCKERS field and mark the lane as `NO_FIX_NEEDED` or `ALREADY_CORRECT`. Do NOT invent work to justify the lane.

## OUTPUT FORMAT (print at the very end)

```
=== IMPLEMENT_014_RUNTIME_RESULT ===
STEP_0_BOUNDARY_OVERRIDE: DONE  (014/spec.md §2 rewritten, status Draft→Implementing)

LANE_A_DETECTOR_PROVENANCE:      DONE | NO_FIX_NEEDED | BLOCKED  (notes)
LANE_B_BLAST_RADIUS:             DONE | NO_FIX_NEEDED | BLOCKED  (notes)
LANE_C_HOT_FILE_BREADCRUMBS:     DONE | NO_FIX_NEEDED | BLOCKED  (notes)
LANE_D_EDGE_EVIDENCE_CONFIDENCE: DONE | NO_FIX_NEEDED | BLOCKED  (notes)
LANE_E_REGRESSION_FIXTURES:      DONE | BLOCKED  (notes)

LANE_F_LEXICAL_FALLBACK:         DEFERRED | DONE | NOT_APPLICABLE  (reason)
LANE_G_CLUSTERING_EXPORT:        DEFERRED  (per ADR-003)

FILES_MODIFIED: <list>
NEW_TESTS_ADDED: <list>
TYPECHECK: PASS | FAIL
VITEST: PASS | FAIL (test counts: <passed>/<failed>, MUST include all prior 005-013 test files as regression guard)
VALIDATE_SH_014: PASS | FAIL (errors=N warnings=N)
PRIOR_PACKETS_REGRESSED: yes | no   (005-013 must stay clean — your prior work shipped 0 P1s after remediation, any regression here is a P0 blocker)
008_NON_OVERLAP_PRESERVED: yes | no   (did you modify any startup/resume/compact/response-hint surface? if yes, explain)
011_VALIDATOR_NOT_REPLACED: yes | no   (did your edge enrichment stay additive on top of StructuralTrust? if no, explain)
007_FIXTURE_DISCIPLINE_HONORED: yes | no   (do all detector/blast-radius changes have frozen regression fixtures? if no, list gaps)

IMPLEMENTATION_SUMMARY_UPDATED: yes | no
CHECKLIST_VERIFIED: <n>/<total> with evidence pointers
TASKS_VERIFIED: <n>/<total>
DOC_DONE_MARKED: <n>/<total>

BLOCKERS: <list or "none">
PROTOTYPE_LATER_NOTES: <list of features deliberately deferred, per ADR-003>

NEXT_REVIEW_RECOMMENDATION: run /spec_kit:deep-review:auto on 014-code-graph-upgrades with maxIterations=8 convergenceThreshold=0.05 to verify no new findings in the expanded graph surface
=== END_IMPLEMENT_014_RUNTIME_RESULT ===
```

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/` (pre-approved, skip Gate 3)
