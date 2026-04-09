# Codex CLI Prompt — Remediate the 7 P1 findings from the batch phase review (packets 002, 003, 008, 010, 013, 014)

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). Self-contained prompt — no prior conversation context. Fix all 7 P1 findings surfaced by the batch phase review at `026/review/batch-phase-review-consolidated.md`. 4 of the lanes are docs-only, 3 have runtime components. Rebuild `scripts/dist/` only if you touch scripts source. Run verification, report results.

## SCOPE

Resolve all 7 P1 findings across these 6 packets:

| Lane | Packet | Verdict before | Finding class | Fix type |
|------|--------|---------------|---------------|----------|
| 1 | `002-implement-cache-warning-hooks` | CONDITIONAL | Stale "Blocked" status metadata while impl-summary records completion | docs-only |
| 2 | `003-memory-quality-issues` | **FAIL** | Parent phase map omits child 008 + renumbers 009; status roll-up contradicts 006/007 child metadata | docs-only (2 P1s in the same file, handled together) |
| 3 | `008-graph-first-routing-nudge` | CONDITIONAL | `session-prime.ts` emits startup hint without the promised activation-scaffold gate | runtime + test + doc |
| 4 | `010-fts-capability-cascade-floor` | CONDITIONAL | `bm25_fallback` labeled as the lane that ran even though runtime returns empty lexical results | docs-only label rewrite (runtime fallback implementation is out of scope) |
| 5 | `013-warm-start-bundle-conditional-validation` | CONDITIONAL | CHK-022 cites stale benchmark evidence (`pass 28`) vs current shipped matrix (`38/40`) | docs-only |
| 6 | `014-code-graph-upgrades` | CONDITIONAL | Docs claim resume/bootstrap preserve graph-edge enrichment, but handlers and tests don't carry it | runtime + test + doc (mirrors the earlier 011 trust-preservation fix pattern) |

Total: **4 docs-only lanes + 2 runtime lanes + 1 hybrid (docs-only rewrite for 010)**.

Target: move all 6 packets from CONDITIONAL/FAIL → PASS. Move aggregate verdict from FAIL → PASS across the 026 train.

## PRE-APPROVALS (do not ask)

- Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (PRE-APPROVED, skip Gate 3)
- Each target packet folder is pre-approved for doc edits + its named runtime files for runtime edits
- Sandbox: workspace-write
- If you modify any `.ts` file under `scripts/`, you MUST rebuild `scripts/dist/` via `cd scripts && npm run build` before running the wild verification steps (lesson from the prior 009 render-layer cycle: vitest passes against source but the CLI runs compiled dist)

## MANDATORY READS (read once at start)

1. **Source of truth for each finding** (read all 6 per-phase review reports):
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/002-implement-cache-warning-hooks/review-report.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/003-memory-quality-issues/review-report.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/008-graph-first-routing-nudge/review-report.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/010-fts-capability-cascade-floor/review-report.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/013-warm-start-bundle-conditional-validation/review-report.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/014-code-graph-upgrades/review-report.md`
2. **Consolidated context** (optional but recommended): `026/review/batch-phase-review-consolidated.md` §6 Remediation Priority Queue
3. **Current state of every file you're about to modify** — read before editing; never edit blind. The per-phase reports cite the exact line numbers for each finding.
4. **Reference pattern for Lane 6** (014 enrichment preservation): the earlier 011 trust-preservation fix at `handlers/session-resume.ts` + `handlers/session-bootstrap.ts` + `lib/context/shared-payload.ts` is the canonical pattern for "preserve contract fields additively through resume/bootstrap." Mirror that pattern for graph-edge enrichment (`edgeEvidenceClass`, `numericConfidence`, `graphEdgeEnrichment` envelope).

## REMEDIATION LANES (execute in this order — docs-only fast lanes first)

### LANE 1 — Packet 002 stale Blocked status (docs-only)

**Problem**: `002/spec.md:36` Status field says `Blocked — awaiting 010 predecessor verification`, but `002/implementation-summary.md:25,35,81` records completed delivery, the producer seam shipped, and a fully passing verification table. Downstream packet 003 references 002 as a predecessor, so the stale blocked status misleads the chain.

**Fix**:
1. Edit `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/spec.md`:
   - Change Status field from `Blocked — awaiting 010 predecessor verification` to `Complete` (or `Implemented` — match whichever Status vocabulary the sibling packets use)
   - Move the predecessor relationship into the Dependencies table OR a Known Limitations bullet, not the overall packet status
2. Verify `002/implementation-summary.md` still has completion + verification evidence (do not edit it — just confirm alignment)
3. Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks` — must PASS

---

### LANE 2 — Packet 003 parent phase map + status roll-up (docs-only, 2 P1s)

**Problem A (phase map)**: `003/spec.md:33,84,95` has a phase map that OMITS `008-input-normalizer-fastpath-fix/` entirely and RENUMBERS `009-post-save-render-fixes/` as Phase 8. The real child phase set runs `001..009`, but the parent roll-up shows only 8 phases with 009 in the 8th slot. Evidence: `003/008-input-normalizer-fastpath-fix/spec.md:21,25` confirms 008 is a real child phase; `003/009-post-save-render-fixes/implementation-summary.md:23` confirms 009 is the current 9th child phase.

**Problem B (status contradiction)**: `003/spec.md:93,94,178` says phases 006 and 007 are `Phase-local complete, parent gates pending`, but:
- `003/spec.md:178` SC-001 says Phase 6 should still have pending placeholder work
- `003/006-memory-duplication-reduction/spec.md:30` still shows Status: `Draft`
- `003/007-skill-catalog-sync/spec.md:30` still shows Status: `Draft`

**Fix**:
1. Edit `003/spec.md` phase map to include `008-input-normalizer-fastpath-fix/` as its real phase number. Restore `009-post-save-render-fixes/` as Phase 9 (not Phase 8). Verify each phase in the map matches its actual child folder.
2. Reconcile the status roll-up for phases 006 and 007. Choose ONE of these paths:
   - **Path A (preferred — honest state)**: Update `003/spec.md` roll-up to say 006 and 007 children are still in Draft. Update SC-001 wording to match. Leave child specs untouched.
   - **Path B**: Update `003/006-memory-duplication-reduction/spec.md:30` and `003/007-skill-catalog-sync/spec.md:30` Status fields from `Draft` to `Complete` IF their implementation-summary.md files confirm completion (read first; if implementation is genuinely complete, flip the child Status; if not, use Path A).
3. If the 003 parent is intentionally bounded to the original 5-phase remediation train and the later phases (006, 007, 008, 009) are outside its scope, state that explicitly in `003/spec.md` and REMOVE the later-phase roll-up entries rather than leaving them half-current. Do NOT leave a half-current roll-up.
4. Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues` — must PASS

**Investigation first**: read `003/spec.md` §1 Metadata, §2 Phase Map, §SC-001, and `003/006/spec.md:30`, `003/007/spec.md:30` before editing. Determine which path (A or B) matches reality. Be honest.

---

### LANE 3 — Packet 008 session-prime activation-scaffold gate (runtime + test)

**Problem**: `008/spec.md:92,120` says the routing nudge only appears when graph readiness AND activation-scaffolding justify it. `008/implementation-summary.md:35,37,45,56` repeats the claim. But the shipped startup/resume hook path in `mcp_server/hooks/claude/session-prime.ts:114,120` emits the structural routing hint whenever `graphState === "ready"` — no activation-scaffolding check, no task-shape check. The focused regression suite at `mcp_server/tests/graph-first-routing-nudge.vitest.ts:15,67` only exercises the stricter helper+response-surface paths, so the hook path is both UNTESTED and OUT OF CONTRACT.

**Fix (runtime)**:
1. Read `mcp_server/hooks/claude/session-prime.ts` lines 100-140 to understand the current hook emission logic
2. Add an activation-scaffold gate (or task-shape gate, depending on what `008/spec.md:92` defines as the readiness contract) at line 114 before emitting the structural routing hint. The gate check should return early if the scaffolding is not present.
3. If the packet defines a helper function for the scaffolding gate that already exists in `context-server.ts` or `memory-context.ts`, reuse it — do not invent a new gate implementation

**Fix (test)**:
4. Extend `mcp_server/tests/graph-first-routing-nudge.vitest.ts` (around line 14 or at the end) with a new test case that:
   - Invokes the session-prime hook path directly (not just the helper path)
   - Asserts that when `graphState === "ready"` but activation-scaffolding is absent, NO routing hint is emitted
   - Asserts that when BOTH `graphState === "ready"` AND activation-scaffolding IS present, the hint IS emitted
5. This lane may also break existing tests in `graph-first-routing-nudge.vitest.ts` or `hook-session-start.vitest.ts` if they were implicitly relying on the lax behavior. If so, update those tests to match the new gate.

**Alternative (docs-only fallback if runtime fix is impossible)**: if the activation-scaffolding concept doesn't actually exist in the codebase yet, narrow `008/spec.md:92,120` and `008/implementation-summary.md` wording so the readiness-plus-scaffolding gate explicitly excludes the startup hook surface. Use this fallback ONLY if you genuinely cannot find a scaffolding gate to enforce — do not default to docs-only.

**Verification**: after the fix, `cd mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/graph-first-routing-nudge.vitest.ts tests/hook-session-start.vitest.ts` must PASS

---

### LANE 4 — Packet 010 bm25_fallback label honesty (docs-only rewrite)

**Problem**: `010/spec.md:95,98,125` and `010/implementation-summary.md:34,36,56` label the degraded state as `bm25_fallback` — implying a real BM25 lexical lane ran. But `mcp_server/lib/search/sqlite-fts.ts:99,101,210,212` logs `bm25_fallback` and returns an EMPTY lexical result set as soon as FTS5 is unavailable. The "fallback lane that actually ran" did not execute. This is an honesty drift, not a runtime correctness bug — the runtime behavior is fine, the label is misleading.

**Fix (docs-only rewrite preferred)**:
1. Choose a new, honest label for the degraded state. Suggestions:
   - `"fts5_unavailable_empty"` — explicitly names the cause and the result
   - `"lexical_degraded_empty"` — generic degraded state
   - `"no_lexical_lane"` — describes what ran
   Pick whichever fits the existing sibling label vocabulary in `sqlite-fts.ts`.
2. Update `mcp_server/lib/search/sqlite-fts.ts` lines 99, 101, 210, 212 to emit the new label instead of `bm25_fallback`. This is a string literal rename, NOT a behavior change — the lane still returns empty lexical results.
3. Update `mcp_server/lib/search/README.md:177,185` to match the new label and explain that it means "FTS5 unavailable → empty lexical results, no fallback execution".
4. Update `010/spec.md:95,98,125` and `010/implementation-summary.md:34,36,56` to use the new label and document that it describes a capability-status marker, not an executed lexical lane.
5. Update any vitest case in `mcp_server/tests/sqlite-fts.vitest.ts` that asserts on the old `bm25_fallback` literal — find them via grep, update to new literal.

**Alternative (runtime fix)**: implement an actual degraded BM25 lexical path behind `sqlite-fts.ts:208` that runs when FTS5 is unavailable. This is OUT OF SCOPE for this remediation cycle — do NOT attempt it unless you find existing scaffolding you can wire up in under 30 lines of code. Default to the docs-only rewrite.

**Verification**: after the fix, `cd mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/sqlite-fts.vitest.ts tests/handler-memory-search.vitest.ts` must PASS

---

### LANE 5 — Packet 013 CHK-022 stale benchmark evidence (docs-only)

**Problem**: `013/checklist.md:55` CHK-022 says the combined bundle achieved `pass 28`. But the current shipped evidence reports `38/40`:
- `013/implementation-summary.md:71` reports `38/40`
- `013/scratch/benchmark-matrix.md:20` reports `38/40`
- `scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:188,192` asserts `38/40`

The checklist line was copied from an older benchmark revision and never refreshed after the discriminating pass metric landed in the close-009-gaps cycle.

**Fix**:
1. Edit `013/checklist.md` line 55 (CHK-022) to cite `pass 38/40` instead of `pass 28`. Match the wording style of the adjacent checklist items.
2. Also verify `013/spec.md:98` — if it references the same stale number, update it too
3. Check for other sibling doc references to `pass 28` via grep in the 013 folder + any consolidated review notes

**Verification**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-warm-start-bundle-conditional-validation` must PASS

---

### LANE 6 — Packet 014 graph-edge enrichment resume/bootstrap preservation (runtime + test + doc)

**Problem**: `014/spec.md:83,84,89,90,106` and `014/implementation-summary.md:48,75` and `014/checklist.md:55` claim that `session_resume` and `session_bootstrap` preserve additive graph-edge enrichment (`edgeEvidenceClass`, `numericConfidence`, `graphEdgeEnrichment` envelope). But neither handler carries those fields today:
- `mcp_server/handlers/session-resume.ts:518,587` — no enrichment carriage
- `mcp_server/handlers/session-bootstrap.ts:246,326` — no enrichment extraction or attachment
- `mcp_server/tests/graph-payload-validator.vitest.ts:198` — doesn't assert enrichment preservation
- `mcp_server/tests/shared-payload-certainty.vitest.ts:228` — doesn't assert enrichment preservation

This is the SAME class of overclaim as the earlier DR-026-I001 finding on 011 trust preservation, which was fixed by implementing actual preservation through session-resume → session-bootstrap. Mirror that pattern here.

**Reference pattern (read first)**: look at how `structuralTrust` is preserved today:
- `mcp_server/handlers/session-resume.ts` — search for `structuralTrust` emission on the structural-context payload section
- `mcp_server/handlers/session-bootstrap.ts` — search for `extractStructuralTrustFromPayload` and `attachStructuralTrustFields`
- `mcp_server/lib/context/shared-payload.ts` — search for `extractStructuralTrustFromPayload` helper

**Fix (runtime, preferred)**:
1. In `mcp_server/lib/context/shared-payload.ts`, add (or locate if it already exists) a helper `extractGraphEdgeEnrichmentFromPayload(payload)` that pulls `edgeEvidenceClass` / `numericConfidence` / `graphEdgeEnrichment` fields from a payload section if present. Mirror the structure of `extractStructuralTrustFromPayload`.
2. Also add (or locate) `attachGraphEdgeEnrichmentFields(targetPayload, enrichment, {label})` similar to `attachStructuralTrustFields`.
3. In `mcp_server/handlers/session-resume.ts` around line 518 (where the structural-context payload section is built), emit `edgeEvidenceClass` / `numericConfidence` if they exist in the underlying query result. Pattern: same emission style as the existing `structuralTrust` field.
4. In `mcp_server/handlers/session-bootstrap.ts` around line 246 (where the resume payload is consumed), extract graph-edge enrichment from the resume payload and preserve it through to the bootstrap output. Pattern: same as the `extractStructuralTrustFromPayload → attachStructuralTrustFields` chain.
5. Add vitest cases to `mcp_server/tests/graph-payload-validator.vitest.ts` around line 198 that:
   - Assert a resume payload with enrichment fields survives through session_resume → session_bootstrap
   - Assert enrichment fields DON'T leak into unrelated payload sections
   - Assert the additive contract: enrichment fields coexist with StructuralTrust without collapsing the trust axes
6. Also extend `mcp_server/tests/shared-payload-certainty.vitest.ts` around line 228 with a non-regression case that 005's CertaintyStatus still coexists with the new enrichment fields

**Alternative (docs-only rescope)**: if the runtime preservation chain is too complex to fix in this cycle, re-scope `014/spec.md:83,84,89,90,106` and `014/implementation-summary.md:48,75` to state that graph-edge enrichment is limited to graph-local query surfaces only and explicitly excludes resume/bootstrap. Update `014/checklist.md:55` to match. This is a valid downgrade path — use it if the runtime fix would take more than ~50 lines of new code across the 3 affected files.

**Decision rule**: prefer the runtime fix for consistency with the earlier 011 trust-preservation cycle. If you estimate the runtime fix needs <50 added lines across the 3 files, ship the runtime fix. If >50 lines OR you discover a blocker, take the docs-only rescope path.

**Verification**: after the fix, `cd mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/graph-payload-validator.vitest.ts tests/shared-payload-certainty.vitest.ts tests/structural-trust-axis.vitest.ts tests/graph-first-routing-nudge.vitest.ts tests/hook-session-start.vitest.ts` must PASS

---

## REBUILD REQUIREMENT (if any scripts/ .ts file was modified)

None of the 6 lanes above should touch `scripts/` directly (all runtime changes are in `mcp_server/`). BUT if Lane 4 (010 label) or Lane 5 (013 checklist) accidentally edits a file under `scripts/tests/` that is the benchmark or fts test, do NOT forget:

```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
```

Without the rebuild, the compiled `dist/` stays stale and CLI-level verifications use old code. Lesson from the prior 009 cycle.

## VERIFICATION (run after all lanes + before printing the final result block)

```bash
cd .opencode/skill/system-spec-kit/mcp_server
TMPDIR=./.tmp/tsc-tmp npm run typecheck
TMPDIR=./.tmp/vitest-tmp npx vitest run \
  tests/shared-payload-certainty.vitest.ts \
  tests/structural-trust-axis.vitest.ts \
  tests/graph-payload-validator.vitest.ts \
  tests/graph-first-routing-nudge.vitest.ts \
  tests/sqlite-fts.vitest.ts \
  tests/handler-memory-search.vitest.ts \
  tests/publication-gate.vitest.ts \
  tests/hook-state.vitest.ts \
  tests/hook-session-start.vitest.ts \
  tests/hook-session-stop.vitest.ts \
  tests/hook-session-stop-replay.vitest.ts \
  tests/session-token-resume.vitest.ts
cd -

cd .opencode/skill/system-spec-kit/scripts
TMPDIR=./.tmp/vitest-tmp npx vitest run \
  tests/detector-regression-floor.vitest.ts.test.ts \
  tests/session-cached-consumer.vitest.ts.test.ts \
  tests/warm-start-bundle-benchmark.vitest.ts.test.ts \
  tests/post-save-render-round-trip.vitest.ts
cd -

# Strict validate.sh on all 6 affected packets
for pkt in 002-implement-cache-warning-hooks \
           003-memory-quality-issues \
           008-graph-first-routing-nudge \
           010-fts-capability-cascade-floor \
           013-warm-start-bundle-conditional-validation \
           014-code-graph-upgrades; do
  echo "=== $pkt ==="
  bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict \
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/$pkt"
done
```

**ALL must PASS**. The prior 009 post-save-render test (`post-save-render-round-trip.vitest.ts`) is included as a regression guard for the memory-save pipeline.

## CONSTRAINTS (absolute)

- **READ FIRST**: read every file before editing. The per-phase reports give you exact line numbers — verify them in current state before patching. Codebase may have drifted since the review was written.
- **SCOPE LOCK**: only modify the files named in each lane above + the tests/specs/impl-summaries for the 6 affected packets. Do NOT touch:
  - Any file in the 7 passing packets (005, 006, 007, 009, 011, 012 — wait, the previous review had 004 passing too — double-check; the consolidated report listed PASS for 004, 005, 006, 007, 009, 011, 012)
  - Any file under `scripts/core/`, `scripts/extractors/`, `scripts/memory/`, `scripts/utils/`, `scripts/loaders/` UNLESS a lane explicitly requires it (Lane 5 CHK-022 is docs-only and should NOT touch scripts)
  - `templates/context_template.md` (owned by 003/006 wrapper contract and 009 render-layer fix)
  - `mcp_server/lib/context/shared-payload.ts` contracts shipped by 005/006/011 — only ADD new helpers for Lane 6, do NOT modify existing type definitions or validators
- **ADDITIVE ONLY for shared files**: `shared-payload.ts`, `session-bootstrap.ts`, `session-resume.ts`, `contracts/README.md`, `ENV_REFERENCE.md` are touched by multiple earlier packets. When Lane 3 or Lane 6 touches them, ADD helpers/fields alongside the existing structure. Do NOT delete or rename anything shipped by 005/006/009/010/011/012/013/014.
- **STRICT non-regression**: the 7 already-passing packets (004, 005, 006, 007, 009, 011, 012) must NOT regress. Their existing tests (listed in the verification block above) must stay green.
- **NO new subsystem, agent, skill, or packet scaffolding** — these are bounded bug fixes.
- **NO commits** — leave all changes uncommitted for operator review.
- **Honesty**: if a lane's runtime fix turns out to be impossible (e.g., the named functions don't exist, or the scaffolding is missing), report that in the lane's result and take the documented docs-only fallback path. Do NOT invent work.
- **Preserve per-phase review reports**: the `026/review/<phase-slug>/review-report.md` files are READ-ONLY inputs to this remediation. Do NOT modify them (they're the audit trail showing what was fixed).

## OUTPUT FORMAT (print at the very end)

```
=== REMEDIATE_BATCH_REVIEW_FINDINGS_RESULT ===
LANE_1_002_BLOCKED_STATUS:         DONE | BLOCKED | FALLBACK (notes)
LANE_2_003_PHASE_MAP_ROLLUP:       DONE | BLOCKED | FALLBACK (path A or path B chosen)
LANE_3_008_SCAFFOLD_GATE:          DONE | BLOCKED | FALLBACK (runtime + test or docs-only rescope)
LANE_4_010_BM25_FALLBACK_LABEL:    DONE | BLOCKED | FALLBACK (new label chosen: <label>)
LANE_5_013_CHK022_BENCHMARK:       DONE | BLOCKED | FALLBACK
LANE_6_014_EDGE_ENRICHMENT:        DONE | BLOCKED | FALLBACK (runtime or docs-only rescope; estimate of lines added)

FILES_MODIFIED: <newline-separated list>
NEW_TESTS_ADDED: <newline-separated list, or "none (extended existing)">

BUILD:
  scripts_dist_rebuilt: yes | no (N/A if no scripts/ .ts was modified)
  mcp_server_typecheck: PASS | FAIL

VITEST:
  mcp_server_suite: PASS | FAIL (<passed>/<failed>)
  scripts_suite: PASS | FAIL (<passed>/<failed>)

VALIDATE_SH:
  002: PASS | FAIL
  003: PASS | FAIL
  008: PASS | FAIL
  010: PASS | FAIL
  013: PASS | FAIL
  014: PASS | FAIL

PRIOR_PASSING_PACKETS_REGRESSED: yes | no (004, 005, 006, 007, 009, 011, 012 must stay green)

REMEDIATION_PATH_PER_LANE:
  Lane 1: runtime | docs-only | docs-fallback
  Lane 2: docs-only (Path A = honest state OR Path B = flip children)
  Lane 3: runtime + test | docs-fallback
  Lane 4: docs-only rewrite (label renamed to <label>)
  Lane 5: docs-only
  Lane 6: runtime + test | docs-fallback (if docs-fallback: rescope wording applied to 014 spec/impl-summary/checklist)

BLOCKERS: <list or "none">

NEW_026_VERDICT_TRAJECTORY:
  before: FAIL (0 P0 / 7 P1 / 0 P2, packets 002/003/008/010/013/014 flagged)
  after:  PASS | CONDITIONAL (<finding counts>, packets that still have open items)

NEXT_STEP_RECOMMENDATION:
  - If after = PASS: commit + push the remediation as a single commit, re-run the synthesis prompt to regenerate the consolidated report with the new verdicts
  - If after = CONDITIONAL: name remaining P1s and recommend another focused cycle or doc-fallback acceptance
  - If BLOCKED: explain which lane blocked and what the operator needs to unblock
=== END_REMEDIATE_BATCH_REVIEW_FINDINGS_RESULT ===
```

Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (pre-approved, skip Gate 3)
