# Iteration 3 — Traceability

## Dispatcher

- iteration: 3 of 7
- dispatcher: task-tool / @deep-review / claude-opus-4-7
- session_id: 2026-04-17T120827Z-016-phase017-review
- timestamp: 2026-04-17T11:05:00Z

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/` (directory listing)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/closing-pass-notes.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/deep-research-config.json`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:485-611`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py` (grep-only)
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` (scope check)
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1037,1099`
- `.opencode/skill/system-spec-kit/mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts` (grep-only)
- `.opencode/skill/system-spec-kit/mcp_server/tests/p0-b-reconsolidation-composite.vitest.ts` (grep-only)
- `.opencode/skill/system-spec-kit/scripts/tests/gate-3-classifier.vitest.ts` (grep-only)

## Investigation Thread

Traceability pass covering 6 tracks from the iteration brief:

1. **Commit-to-task ID verification** — Sampled commit `e774eef07` (largest bundle claiming 10 task IDs). All 10 claimed task IDs (T-HST-10, T-RCB-09/10/11, T-PIN-07/08, T-ENR-02, T-SRS-03/04, T-SAP-03) exist in `tasks.md` and are marked `[x]` with the citation `[EVIDENCE: e774eef07 scattered medium refactors ...]`. Tasks.md closure quality check: 0 open tasks / 158 completed. Sample-of-one passes — commit claims match task IDs.

2. **Spec folder metadata refresh** — `description.json` has `lastUpdated: 2026-04-16T21:45:00Z` and `status: "ready_for_implementation"`. `graph-metadata.json` has `last_save_at: 2026-04-17T11:20:00Z` and `status: "implemented"`. Drift. Git log confirms: `description.json` last touched in commit `6b4de51fc` (Stage 2 charter, pre-Phase 017) and never refreshed after 27 fix(016) commits landed. `graph-metadata.json` was refreshed in `bc47d3dce` (Apr 17) which updated status and timestamp.

3. **Research folder metadata** — The resolved path `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/` has NO `description.json` and NO `graph-metadata.json`. Only `deep-research-config.json` + `findings-registry.json` + iteration markdown + synthesis markdown. Per CLAUDE.md §3: "Every spec folder (Level 1+) MUST contain `description.json` and `graph-metadata.json`." This violates the contract.

4. **CP-001..CP-004 remediation state** — Cross-referenced closing-pass-notes.md against current code:
   - **CP-001** (`context.ts:97-105` readiness fail-open): Not re-reviewed this iteration (scope); closing-pass-notes documents it as open. No commit cites T-CGQ-C001 or similar.
   - **CP-002** (`graph-lifecycle.ts:onIndex()` 5 skip conditions): **RESOLVED but closing-pass-notes NOT updated.** Code at `graph-lifecycle.ts:509-514` now has `OnIndexSkipReason` enum with 4 distinct reasons (`graph_refresh_disabled`, `entity_linking_disabled`, `empty_content`, `onindex_exception`) and `buildSkipped(reason)` helper. Exception branch at line 606-610 returns `buildSkipped('onindex_exception')`. This was landed by `e774eef07` T-PIN-08 (R27-001). Closing-pass-notes still says CP-002 is OPEN — stale claim.
   - **CP-003** (`entity-linker.ts:1131-1133` whole-corpus escalation): Not re-reviewed this iteration; closing-pass-notes documents it as OPEN; no commit in the 27-commit window cites entity-linker changes beyond T-ENR-01/02. Status likely correctly OPEN.
   - **CP-004** (`complete_confirm.yaml` untyped boolean DSL): **STILL PRESENT.** `spec_kit_complete_confirm.yaml:1099` contains `when: "Immediately after the canonical spec document is refreshed on disk"` — a prose English sentence in a `when:` field, which is exactly the untyped-DSL pattern CP-004 flagged. The `when: "folder_state != populated-folder"` at lines 514/520/539 IS typed. But line 1099 bypasses the grammar. Commit `f9478670c` (S7 YAML predicate grammar) only touched `plan_auto.yaml`, `plan_confirm.yaml`, `complete_auto.yaml` — NOT `complete_confirm.yaml`. CP-004 scope gap persists; closing-pass-notes correctly identifies it as open.

5. **Cross-runtime parity for T-SAP-03** — `COMMAND_BRIDGES` dict is defined at `skill_advisor.py:1309` and iterated at lines 1571 and 1788. `skill_advisor_runtime.py` is a frontmatter parsing + caching helper with no command-bridge responsibility. `skill_graph_compiler.py` has zero `COMMAND_BRIDGES` references. So T-SAP-03's scope is correctly limited to `skill_advisor.py` — no other runtime/compiler needs the port. Barter's single-runtime port is complete per contract. No gap.

6. **Test-to-source alignment** — Verified three regression test files:
   - `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` line 67 describes it as "Claude, Gemini, and OpenCode consumers" and line 11 imports `handleCompact as handleGeminiCompact` from `hooks/gemini/session-prime.js`. Test lines 152-154 assert `geminiSections[0]` — genuine cross-runtime coverage for Claude + Gemini. OpenCode is mentioned in the `it(...)` string but no OpenCode consumer is actually invoked; OpenCode coverage is by extension of the same tmpdir path schema rather than an explicit import. Weak-coverage note.
   - `p0-b-reconsolidation-composite.vitest.ts` has only 3 `it(...)` blocks: (a) rejects conflict writer with `conflict_stale_predecessor`, (b) blocks duplicate complement inserts, (c) uses batched governed-scope read. The 3 tests map 1:1 to Phases B1 (CAS) / B2 (complement) / B3 (batched scope). Coverage IS 3-phase even though there are only 3 tests.
   - `gate-3-classifier.vitest.ts` has 29 test cases (matching the claim). **BUT zero Unicode/NFKC/homoglyph coverage.** `grep -iE "unicode|nfkc|homoglyph|\\\\u[0-9A-F]{4}"` returns zero hits. This reinforces iteration 2's R2-P1-002 finding from a traceability angle: the documented T-DOC-02/T-DOC-03 contract does not cover the character-set class.

7. **Evidence citation hygiene in checklist.md** — 179 completed CHK items, 0 open. Of 179 completed: 170 close with `)` (orphaned parenthesis, no closing `]`) and only 9 close with `]` (canonical `[EVIDENCE: ... (verified)]` form). This is a mechanical lint failure on 95% of completed items.

## Findings

### P0 Findings

None. No traceability gap rises to P0. Claimed remediations trace to actual code changes, test migrations map to expected surfaces, and commit-to-task evidence holds on the sampled bundle.

### P1 Findings

1. **`closing-pass-notes.md` CP-002 is stale — documented as OPEN but fully resolved by `e774eef07` T-PIN-08** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/closing-pass-notes.md:84-86`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:509-514`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:606-610` — closing-pass-notes.md lines 72-88 describe `onIndex()` as returning `{ skipped: true }` across 5 distinct conditions without a `reason` field, and propose a future fix to add `{ skipped: true, skipReason: 'refresh_disabled' | 'entity_linking_disabled' | 'empty_content' | 'pipeline_exception' }`. Exactly this fix has already landed in `graph-lifecycle.ts`: lines 507-514 define `OnIndexSkipReason` and the `buildSkipped(reason)` helper; lines 516-528 route the three "feature/content" skip paths to distinct reasons; line 606-610 routes the exception branch to `'onindex_exception'`. The commit is `e774eef07` (T-PIN-08, R27-001). But `closing-pass-notes.md` was never amended to mark CP-002 as RESOLVED, so anyone reading the closing-pass audit as the authoritative backlog view sees a ghost finding. Severity P1 because closing-pass-notes.md is cited as a primary source in `description.json.authoritativeSources` and `graph-metadata.json.key_files`, making this a load-bearing documentation surface rather than a transient note. The gap misleads future auditors AND understates Phase 017's remediation reach.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "closing-pass-notes.md CP-002 documents graph-lifecycle.ts:onIndex() as having 5 fan-in skip conditions without a reason field, but the code now has a typed OnIndexSkipReason enum with 4 distinct reasons + buildSkipped helper + exception-branch routing — fix landed in e774eef07 T-PIN-08 (R27-001) and was not back-propagated to the audit narrative.",
      "evidenceRefs": [
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/closing-pass-notes.md:72-88",
        ".opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:507-514",
        ".opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:516-528",
        ".opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:606-610",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/tasks.md:192"
      ],
      "counterevidenceSought": "Searched tasks.md for T-PIN-08 and found '[EVIDENCE: e774eef07 scattered medium refactors; (verified)]' — so tasks.md correctly records the remediation. Searched checklist.md for CP-002 — no explicit CP-002 checklist entry exists. The gap is strictly in the closing-pass audit narrative.",
      "alternativeExplanation": "Closing-pass-notes.md is dated 2026-04-17 at the file-level but the CP-002 section may predate e774eef07 (Apr 17 08:48). If the audit was captured before the T-PIN-08 landing, the staleness is a time-ordering artifact rather than a missed update. However, the whole Phase 017 remediation is cited as landed in description.json / graph-metadata.json, so any reader cross-checking closing-pass-notes against 'current' state gets mixed signals.",
      "finalSeverity": "P1",
      "confidence": 0.90,
      "downgradeTrigger": "If an amendment or explicit '[STATUS: RESOLVED by T-PIN-08 / e774eef07]' marker is added to closing-pass-notes.md section 3, this becomes P2 hygiene."
    }
    ```

2. **Research folder is missing both mandatory packet-metadata files (`description.json` + `graph-metadata.json`)** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/` — The canonical packet invariant per CLAUDE.md §3 and system-spec-kit SKILL.md is: "Every spec folder (Level 1+) MUST contain `description.json` and `graph-metadata.json`." The research folder contains `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `deep-research-dashboard.md`, `research.md`, `findings-registry.json`, `FINAL-synthesis-and-review.md`, 50 `iterations/iteration-*.md`, 5 `interim-synthesis-*.md`, `closing-pass-notes.md` — all the deep-research-loop artifacts — but NEITHER of the two mandatory canonical packet metadata files. The spec-folder side has them (with known drift — see P2 finding #1). Consequences: this research folder is INVISIBLE to memory search and graph traversal via the derived-metadata route that `description.json` feeds, and the `graph-metadata.json` status-derivation chain has no data to read. `graph-metadata.json` backfill is "inclusive by default" per CLAUDE.md §3 so this should have been produced automatically; it was not. This is a lineage-contract violation of the same class that Phase 016 was chartered to eliminate. Classified P1 because the research folder is cited by authority from the spec folder's `description.json.authoritativeSources` — cross-reference consumers expect both surfaces to be discoverable.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "The Phase 016 research packet folder at research/016-foundational-runtime-deep-review/ is missing both mandatory canonical metadata files (description.json, graph-metadata.json), violating the CLAUDE.md §3 invariant that every spec folder must contain them, and making the research folder invisible to memory-search/graph traversal.",
      "evidenceRefs": [
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/ (listing)",
        "CLAUDE.md §3 'Mandatory metadata: Every spec folder (Level 1+) MUST contain description.json and graph-metadata.json'",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/description.json:112-119 (authoritativeSources cites research/ surfaces)"
      ],
      "counterevidenceSought": "Checked whether the research folder is a recognized level-0 or transient-only folder exempt from the rule — no such exemption exists in CLAUDE.md or system-spec-kit SKILL.md. Research packets inside a spec tree are themselves spec folders (they carry plan/research/synthesis deliverables). Checked whether `generate-context.js` was ever run against this path — git history shows no commits touching these two filenames for this path.",
      "alternativeExplanation": "The dispatch was a manual wave (`dispatched_by: cli-copilot gpt-5.4 high (manual wave dispatch)`, `worker_runtime: gh copilot ... not /spec_kit:deep-research`), so the standard metadata refresh pipeline was never invoked. The note at deep-research-config.json:8 explicitly says metadata was 'back-filled after the 50-iteration run' but the back-fill only produced the deep-research-loop artifacts, not the canonical packet metadata. This downgrades to 'intentional manual-dispatch consequence' if the team treats research packets under research/ as exempt, but no such policy is documented anywhere.",
      "finalSeverity": "P1",
      "confidence": 0.85,
      "downgradeTrigger": "If CLAUDE.md is amended to exempt research/{phase}/ subfolders from the mandatory-metadata rule, OR if generate-context.js is run against this path and the two files are produced, this resolves. Treat as P2 if the team documents research-packet exemption explicitly."
    }
    ```

### P2 Findings

1. **`description.json` metadata drift — `lastUpdated` and `status` stale relative to `graph-metadata.json` and Phase 017 remediation state** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/description.json:37`, `:46-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/graph-metadata.json:162-163` — `description.json.lastUpdated` reads `2026-04-16T21:45:00Z` and `status: "ready_for_implementation"` / `phaseStage: "stage-2-planning-complete"`. `graph-metadata.json.derived.last_save_at` reads `2026-04-17T11:20:00Z` and `status: "implemented"`. Git log confirms `description.json` was last touched at `6b4de51fc` (Stage 2 charter, pre-Phase 017) and never refreshed after 27 subsequent `fix(016)` commits landed. `graph-metadata.json` was refreshed at `bc47d3dce` (Apr 17). The divergence means any memory-search consumer that reads `description.json` sees "ready for implementation" while graph traversal through `graph-metadata.json` sees "implemented". Reconciliation is required at next `/memory:save` via `generate-context.js`. Classified P2 because the remediation IS complete in code and the graph-metadata side correctly reflects it; only the description-layer is stale, and the drift is auto-resolvable by re-running the canonical save script. Reinforces the prior-iteration theme that canonical-save-surface hygiene has gaps.

2. **179/179 completed CHK items: 95% have malformed evidence-marker closures (orphaned `)` instead of canonical `]`)** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/checklist.md` (all 179 completed CHK lines) — Canonical evidence-marker format per project convention is `[EVIDENCE: <hash> <description>; (verified)]` — open bracket, content, close bracket. Of 179 completed CHK items (0 open), 170 close with `)` (orphaned parenthesis, no closing `]`), example: `[EVIDENCE: 104f534bd P0-B composite)`. Only 9 properly close with `]`. A mechanical lint would reject 95% of entries. Effect: traceability parsers that regex on `\[EVIDENCE:.*?\]` will fail to extract all but 9 of the 170 citations. A grep like `grep -oE '\[EVIDENCE:[^]]*\]'` returns mostly nothing because the bracket is never closed. The CHK items themselves correctly cite commits; the framing is defective. Classified P2 because the information is present and human-readable; only machine-parseable traceability tooling is impaired.

3. **`p0-a-cross-runtime-tempdir-poisoning.vitest.ts` describes "Claude, Gemini, and OpenCode consumers" in the `it(...)` name but only imports Claude and Gemini helpers — OpenCode is covered by extension/inference, not explicit assertion** — `.opencode/skill/system-spec-kit/mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:11`, `:67`, `:152-154` — Line 67: `it('quarantines a poisoned hook-state file so Claude, Gemini, and OpenCode consumers keep working', ...)`. Line 11 imports only `handleCompact as handleGeminiCompact` from `hooks/gemini/session-prime.js`; no OpenCode import. Lines 152-154 assert on `geminiSections[0]?.title` and `...content` only. No OpenCode-side assertion exists. The test does validate that the hook-state tmpdir path schema is quarantined correctly, which structurally covers OpenCode (OpenCode uses the same path schema), but the `it()` name's promise of three-runtime coverage is one consumer short of explicit verification. Classified P2 because the structural-path coverage IS genuine and OpenCode does share the tmpdir infrastructure, but the test name overclaims — a reader looking for "explicit OpenCode consumer assertion" will not find it. This reinforces the theme that cross-runtime coverage in Phase 017 tests is asymmetric.

## Traceability Checks

- **commit → task-ID parity (e774eef07 sample)**: pass — 10 claimed task IDs all present and marked `[x]` in tasks.md with commit citation. Sample-of-one pass.
- **spec-folder canonical metadata (package-level invariant)**: partial — spec folder has both files but description.json stale; research folder missing both files entirely.
- **closing-pass audit → remediation state reconciliation (CP-001..CP-004)**: partial — CP-004 correctly still open; CP-002 stale (resolved but not updated in audit); CP-001 and CP-003 not re-verified this iteration.
- **cross-runtime parity for T-SAP-03**: pass — COMMAND_BRIDGES scope is correctly limited to `skill_advisor.py`; no other runtime/compiler requires the per-subcommand bridges.
- **test → source alignment (3 files sampled)**: partial — p0-a overclaims OpenCode coverage in test name (P2 #3), p0-b 3-phase coverage sound, gate-3-classifier 29 cases correct but zero unicode coverage (traceability reinforcement of iter 2 R2-P1-002).
- **checklist evidence-marker hygiene**: partial — 95% of 179 completed citations have malformed closing bracket (P2 #2); information is present, form is defective.

## Confirmed-Clean Surfaces

- `tasks.md` — 0 open tasks / 158 completed; all sampled (T-HST-10, T-RCB-09/10/11, T-PIN-07/08, T-ENR-02, T-SRS-03/04, T-SAP-03) correctly reference the landed commit `e774eef07`.
- `skill_advisor.py` COMMAND_BRIDGES scope — correctly confined to the one script; `skill_advisor_runtime.py` is frontmatter parsing + caching only and `skill_graph_compiler.py` has zero bridge references. T-SAP-03's port target surface is complete.
- `p0-b-reconsolidation-composite.vitest.ts` — 3 tests map 1:1 to phases B1/B2/B3 (conflict CAS, complement window, batched governed-scope read). Coverage is phase-accurate despite the low count.
- `graph-lifecycle.ts:onIndex()` — `OnIndexSkipReason` enum with 4 distinct values implements the typed-status contract correctly (resolves CP-002).
- `graph-metadata.json` for 016 spec folder — `last_save_at` and `status` correctly reflect Phase 017 implemented state.
- `gate-3-classifier.vitest.ts` — 29 test cases match the declared contract. (Character-set gap is a separate finding from iter 2, reinforced but not re-raised here.)

## Confirmed Already-Known (cross-reference to iterations 1 + 2)

- **R1-P1-001** (empty-string scope CAS bypass) — further narrowed by iter 2's symmetric-normalizer confirmation. No new traceability evidence changes the severity position.
- **R1-P1-002** (partial_causal_link_unresolved infinite-retry pairing) — out of traceability scope; carry forward.
- **R1-P2-001..003** — not re-reviewed this iteration.
- **R2-P1-001** (session_resume cross-session leakage) — out of traceability scope; carry forward.
- **R2-P1-002** (gate-3-classifier unicode bypass) — **reinforced from a traceability angle**: `gate-3-classifier.vitest.ts` has 29 cases with ZERO unicode/NFKC/homoglyph coverage. The contract-side (T-DOC-02 / T-DOC-03) does not claim unicode coverage, so this is not a "claim without evidence" failure; it IS a "evidence-gap that matches the earlier P1 finding" — the absence of unicode cases is itself a traceability signal that the character-set contract was never specified. No new finding.
- **R2-P2-001..003** — not re-reviewed this iteration.
- **CP-001** (context.ts readiness fail-open) — still OPEN in closing-pass-notes; no commit in 27-commit window remediates it. Correctly tracked.
- **CP-003** (entity-linker whole-corpus) — still OPEN; no commit remediates it. Correctly tracked.
- **CP-004** (complete_confirm.yaml untyped DSL) — STILL PRESENT at `spec_kit_complete_confirm.yaml:1099`. Commit `f9478670c` only touched the three other YAMLs. CP-004 correctly tracked as OPEN.

## Convergence Signal

- Novel findings this iteration: 5 (2 P1, 3 P2)
- Severity-weighted new findings: (2 × 5.0) + (3 × 1.0) = 13.0
- Cumulative severity-weighted total (iter 1 + iter 2 + iter 3): 13.0 + 13.0 + 13.0 = 39.0
- newFindingsRatio = 13.0 / 39.0 = **0.333**
- No P0 override (no new P0 this iteration).
- Convergence trend: iter 1 (1.00) → iter 2 (0.50) → iter 3 (0.33). Trajectory heading toward the 0.10 threshold but not yet crossed. Iterations are still producing net-new findings at a decreasing severity-weighted rate.
- Overlap with prior iterations: 0 net overlap — all 5 findings this iteration are in the traceability dimension and distinct from correctness (iter 1) and security (iter 2) surfaces.
- Overlap with closing-pass-notes CP-*: CP-002 staleness is my P1 finding #1 (new observation that the audit narrative is stale, not a rediscovery of the underlying issue).
- ruledOut this iteration: ["commit e774eef07 claimed task IDs all present in tasks.md (pass)", "tasks.md has zero open tasks (pass)", "skill_advisor_runtime.py requires T-SAP-03 port (pass — no such requirement exists)", "p0-b test coverage of 3 phases (pass — 3 tests map to B1/B2/B3)", "CP-001 and CP-003 remediation status (not re-verified this iteration, carried forward)", "spec-folder graph-metadata.json freshness (pass — refreshed at bc47d3dce)"]

## Next Iteration Angle

Iteration 4 should pivot to MAINTAINABILITY dimension:

- Code clarity of the 5 new security/correctness hardening layers (`boolean-expr.ts`, `gate-3-classifier.ts`, `reconsolidation.ts` predecessor CAS, `onIndex` typed skip reasons, `hook-state.ts` Zod + quarantine).
- Duplication check: `normalizeScopeValue` (reconsolidation-bridge) vs `normalizeScopeMatchValue` (types.ts) — iter 2 confirmed they are symmetric; iter 4 should check if they could be collapsed to one helper without losing call-site clarity.
- Documentation rot: does the YAML predicate grammar spec match runtime behavior (boolean-expr.ts:242-245 `hasOwnProperty.call` + TRUE/FALSE coercion shim)? Is the shim documented?
- File-length and function-length hygiene on the heavily-refactored files (`reconsolidation.ts`, `hook-state.ts`, `session-stop.ts`, `post-insert.ts`).
- Cross-check that checklist.md 95% malformed-citation issue is mechanical, not semantic — i.e., the commit hashes and descriptions are correct even though the bracket is.
- Parse error resilience: if `description.json` drift is auto-repairable by `generate-context.js`, is there a nightly job or precommit hook that catches stale `lastUpdated` vs. `graph-metadata.json.last_save_at` divergence?

Iteration 5 should pivot to CROSS-REFERENCE / SYNTHESIS:

- Revisit all P1 findings across iter 1/2/3 and assess whether any should upgrade to P0 in synthesis.
- Revisit R1-P1-001 downgrade recommendation from iter 2.
- Assess which findings are truly independent vs. instances of a shared root cause (e.g. "sanitization is mostly-ASCII-only" theme linking R2-P1-002 + R2-P2-001; or "canonical-save-surface hygiene gaps" linking R3-P1-002 research-metadata-missing + R3-P2-001 description-json-drift + R3-P2-002 citation-bracket-lint).

## Assessment

- Traceability of Phase 017 remediation is **mostly sound** on the commit-to-task-ID axis. The one sampled bundle (e774eef07, 10 task IDs) correctly cross-references tasks.md. 0 open tasks, 158 completed. The large-scale structure of the remediation is intact.
- The two P1 findings are about **audit-surface and packet-invariant hygiene**:
  - Closing-pass-notes.md carries stale "CP-002 open" narrative that is resolved by e774eef07.
  - Research folder violates the mandatory canonical-metadata invariant (no description.json + graph-metadata.json).
- The three P2 findings reinforce the theme that **canonical-save-surface hygiene is inconsistent**: spec-folder description.json drifts from graph-metadata.json; 95% of checklist evidence citations have malformed closing brackets; one test name overclaims cross-runtime reach.
- No new P0 traceability findings. Severity-weighted newFindingsRatio 0.33 — still productive, not yet converging.
- The unicode-coverage gap in gate-3-classifier.vitest.ts is NOT a new finding; it is traceability evidence supporting iter 2's R2-P1-002.
