---
title: Deep Review Strategy - 011-skill-advisor-graph
description: Runtime strategy tracking review progress, dimension coverage, findings, and outcomes across iterations.
---

# Deep Review Strategy - 011-skill-advisor-graph

## 1. OVERVIEW

### Purpose
Track review progress for the skill advisor graph implementation across 20 skill graph-metadata.json files, skill_graph_compiler.py, compiled skill-graph.json, and skill_advisor.py integration with graph-derived boosts.

---

## 2. TOPIC
Review of 011-skill-advisor-graph spec folder: a Level 2 implementation that added structured graph metadata to all 20 skill folders, compiled into a lightweight skill-graph.json, and integrated graph-derived boosts into the skill_advisor.py routing pipeline. Includes 5 sub-phases (001-005) covering research fixes, testing playbook, packaging, enrichment, and path migration.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness -- Logic errors, off-by-one, wrong return types, broken invariants in skill_advisor.py graph functions, compiler, and metadata files
- [x] D2 Security -- Input handling in compiler/advisor, file path traversal, unsafe JSON loading
- [x] D3 Traceability -- Spec/code alignment, checklist evidence verification, cross-reference integrity across spec docs and implementation
- [x] D4 Maintainability -- Patterns, clarity, documentation quality, ease of safe follow-on changes across all components
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Modifying any code under review (observation-only)
- Reviewing existing INTENT_BOOSTERS/MULTI_SKILL_BOOSTERS/PHRASE_INTENT_BOOSTERS (out of 011 scope)
- Evaluating session bootstrap injection (documented as future work)
- Reviewing graph visualization tooling (out of scope)

---

## 5. STOP CONDITIONS
- All 4 dimensions reviewed with file-cited evidence
- No active P0 findings remaining unconfirmed
- All core cross-reference protocols checked (spec_code, checklist_evidence)
- 20 iterations reached (hard cap)

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1, 5, 8, 12, 13, 17, 19 | Found a latent conflict-penalty ordering bug plus two P1 compiler-validator gaps and a P1 health-check blind spot. Later stabilization passes ruled out both the inert 21st-node routing hypothesis and same-pass graph-boost/family-affinity compounding, so the remaining D1 defects stay narrowed to F001, F040, F041, and F110. |
| D2 Security | CONDITIONAL | 2, 13, 15 | Found one P1 trust-boundary gap in compiler path validation, one P2 resilience gap in advisor graph consumption, and a deep-pass live metadata drift where `skill-advisor` / `mcp-coco-index` ship 22 edges outside the packet's documented weight bands; the iteration 15 confidence-calibration recheck added no new finding and ruled out a graph-only threshold bypass. |
| D3 Traceability | FAIL | 3, 6, 7, 14 | Found the top-level packet drift from iteration 3, a first deep-pass packet drift in sub-phases 001/003, a second deep pass showing Phase 005 still overclaims grep-zero closure while Phase 004 overstates what its packet metadata serializes, and a checklist-evidence replay showing CHK-031/032 now freeze stale behavioral examples. |
| D4 Maintainability | CONDITIONAL | 4, 11, 16, 18 | Found one P1 drift hazard from duplicated relation semantics across compiler/advisor code, one P2 authoring hazard from mixed metadata path conventions, a no-new-finding executable playbook pass, a feature-catalog P1 where the schema page still documents schema-v1 as current reality, and a parent-ledger P1 where top-level `tasks.md` stayed all-green after child packets deferred and remediated packet-owned work. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 4 active
- **P1 (Major):** 17 active
- **P2 (Minor):** 2 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Reading the state packet first exposed that D2 had already been covered, so this pass could stay tightly scoped to D3 without duplicating the prior security findings.
- Sampled `graph-metadata.json` files were structurally consistent and repo-relative, which narrowed the security review to validator and runtime trust-boundary handling instead of active metadata poisoning.
- The D3 pass was able to confirm that the Section 3 boost constants and call-site order still match the shipped advisor code, which limited the review to traceability drift instead of re-litigating the scoring design.
- Re-running validate-only, health, and regression checks made it clear the major problem is packet accuracy: commands still pass, but the docs now describe an older graph shape.
- The D4 pass confirmed the sampled metadata files are internally consistent with each other, which kept the maintainability review focused on shared contract design rather than one-off data corruption.
- Recompiling the graph from the current metadata reproduced the checked-in `skill-graph.json`, which ruled out generated-artifact drift and kept the D1 deep pass focused on validator behavior.
- Cross-checking Section 3.3 against `skill_advisor.py` confirmed that all damping constants still match the design, so the new D1 issues are isolated to compiler validation semantics rather than runtime boost math.
- The 003 packet itself now passes strict validation cleanly, which let the D3 deep pass separate current packet health from stale provenance artifacts.
- Cross-checking the exact repo evidence files cited by Phase 005 showed those READMEs, the root playbook, and `skill-advisor/graph-metadata.json` already use the migrated `scripts/` layout, which isolated the remaining migration drift to packet-local continuity surfaces.
- Comparing Phase 004's checklist evidence against its packet `graph-metadata.json` showed the packet did replace the old glob-based metadata pattern; the remaining gap is a narrower overclaim about which live evidence files are actually serialized.
- Cross-checking the health docs against `skill_advisor.py` showed the graph-status field names still align across code, the feature catalog, the compiler playbook, and the setup guide, which narrowed this pass to failure-state semantics rather than naming drift.
- Re-running representative routing, graph, compiler, and regression scenarios from sub-phase 002 showed the playbook's migrated `scripts/` paths and documented flags still execute cleanly against the current codebase.
- A full 21-file metadata sweep plus `--validate-only` ruled out missing required fields, invalid targets, self-edges, and dependency cycles, which narrowed this deep D2 pass to live weight-band drift rather than general graph corruption.
- Sampling across CLI, MCP, system, review, code-quality, and utility skills showed the integrity issue is localized: many peer/prerequisite edges remain structurally sound and in-band, so remediation can stay focused on the offending router metadata.
- The dedicated D1 stabilization pass on iteration 008 ruled out the suspected 21-node routing bug: the extra `skill-advisor` node is not discovered as a routable skill, its outgoing edges do not mint new candidates, and system-family affinity does not surface it in ranked output.
- The new `P1-GRAPH-001/002/003` fixture rows still line up with both the live router and the canonical regression harness, so this pass could isolate D3 drift to packet evidence rather than fixture content.
- Replaying the checklist's own runtime examples showed that CHK-020/021/022/023/030/033/040/041 still hold, which narrowed this pass to stale behavioral evidence rather than a fresh graph-integration regression.
- The targeted `_apply_family_affinity()` re-check confirmed the 8% sibling nudge is computed from a stable `max_boost` snapshot and does not cascade across newly boosted siblings, which closed the feared additive-stacking bug without adding a new finding.
- A live CLI routing check still showed sibling CLIs entering only through lexical evidence with `_graph_boost_count: 0`, so the pre-explicit placement of family affinity continues to behave like the documented ghost-sibling guard.
- The D2 confidence-calibration recheck showed the graph layer only amplifies already-evidenced skills, and the shipped GB-005 prompt plus a 4,005-prompt pair sweep did not surface any passing recommendation with a strict graph-majority evidence split.
- The feature-catalog deep pass confirmed that the graph-system package is mostly current: seven sampled feature pages still match the live compiler/runtime constants and compiled artifact shape, which localized the maintainability drift to the schema reference page instead of the whole catalog.
- The iteration 017 adversarial recheck found no counterevidence strong enough to downgrade F020, F021, F022, or F060: F021 remains impact-limited to an inert extra node, but the packet's schema/count/size/path-closure claims are still false on the current tree.
- Comparing the parent `tasks.md` against the 001 and 005 child ledgers showed that deferred and remediation work is still packet-local and explicit somewhere in the review root, which narrowed this pass to stale top-level execution tracking instead of a total loss of defer rationale.
- A targeted re-read of `_apply_graph_boosts()`, `_apply_family_affinity()`, and the downstream filtering path confirmed the pipeline is still bounded: graph propagation reads from a frozen snapshot, family affinity remains a one-shot polish step, and `filter_recommendations()` only filters finished recommendation records.

---

## 9. WHAT FAILED
- `validate_derived_metadata()` only checks whether referenced files exist, not whether those paths stay inside the intended skill/repo roots.
- `skill_advisor.py` treats a syntactically valid `skill-graph.json` as trusted and does not fail closed when graph field types drift.
- `_apply_graph_conflict_penalty()` still runs before current-pass `passes_threshold` values are recomputed, so future non-empty `conflicts` metadata would remain a latent no-op until the analyze-request call order changes.
- The traceability packet has drifted behind the implementation: it still asserts schema version 1 everywhere, 20 compiled metadata files, and a 1950-byte artifact, none of which match the current shipped graph.
- Checklist and implementation-summary evidence for `hub_skills` were not refreshed after the compiler moved to an above-median inbound-degree calculation and the artifact grew a much larger hub list.
- Relation semantics now live in several hand-maintained code paths (`EDGE_TYPES`, symmetry checks, compiled export selection, and advisor boost propagation), so schema changes are easy to implement incompletely.
- The derived metadata schema mixes skill-relative and repo-relative path bases, which keeps the current samples valid but makes the authoring contract harder to remember and regenerate safely.
- `validate_skill_metadata()` still accepts any numeric edge weight inside `[0.0, 1.0]`, even when the value violates the edge-type-specific bands documented in the packet.
- `validate_edge_symmetry()` only checks reciprocal target presence, not reciprocal weight parity, so materially different sibling / prerequisite strengths can pass validation as if they were symmetric.
- Sub-phase 001 still scopes "all 5 P1 issues" as delivered work even though three P1 items remain explicitly deferred and still visible in the advisor/compiler surfaces.
- Sub-phase 003 still anchors provenance to a stale `review/deep-review-findings.md` file whose verdict, packet paths, and validator status describe the pre-remediation `007-...` lineage instead of the current 011 packet.
- Phase 005's closeout packet did not clean the full `011-skill-advisor-graph/` root it claims to validate; `handover.md` still carries legacy non-`scripts/` `skill-advisor` paths.
- Phase 004's CHK-014 evidence claims the packet metadata serializes specific live evidence files (`sk-deep-review/graph-metadata.json`, `skill_graph_compiler.py`) that are not actually present in `derived.key_files`.
- The packet still claims that the regression fixture "fixed 3 wrong expectations," but no retained file or fixture history identifies which three case IDs changed or what the previous expectations were.
- `health_check()` treats missing and corrupt `skill-graph.json` as the same `graph unavailable` state and still reports top-level `status: ok`, so the health probe does not surface graph degradation as an overall readiness failure or provide triage detail.
- The live metadata corpus now contains real, shipped off-band edges: `skill-advisor` serializes all twenty `enhances` edges at `0.8`, above the packet's `0.3-0.7` overlay band.
- The `skill-advisor` <-> `mcp-coco-index` dependency pair is serialized at `0.4`, below the packet's `0.7-1.0` hard-dependency band, so a documented foundational relationship is materially underweighted in the shipped graph.
- The top-level checklist's behavioral evidence has drifted: CHK-031 still freezes `mcp-code-mode at 0.92` for `"use figma"` even though the live advisor now returns `0.95`, and CHK-032 still cites `"build full stack"` as a `!graph:family(sk-code)` proof point even though that prompt no longer reproduces.
- The feature catalog's `02--graph-system/01-graph-metadata-schema.md` page still calls `schema_version: 1` the live contract and omits the schema-v2 `derived` requirements even though the compiler and sampled metadata corpus are now schema-v2 aware.
- The parent `tasks.md` still presents the packet as a fully complete 12-task delivery and does not point maintainers to the later child-packet deferred items or closeout/remediation work that now carry part of the packet's execution history.

---

## 10. EXHAUSTED APPROACHES (do not retry)
- Re-sampling maintainability across the same `skill_advisor.py` graph helpers, `skill_graph_compiler.py`, and representative `graph-metadata.json` files without a code change; iteration 4 already covered that surface.
- Re-checking D1 compiler correctness for hub computation, family grouping, compiled artifact integrity, and Section 3.3 damping parity without a code change; iteration 5 completed that deep pass.
- Re-running the same sub-phase 002 playbook command sweep (CP-001/003/005, RA-001/008, GB-001/002/003/004/006/007, RS-001/003/004) without a playbook or runtime change; iteration 11 already showed those command surfaces are executable.
- Re-auditing the parent `tasks.md` against the same 001/005 child task ledgers without a documentation change; iteration 18 already established that the omission pattern lives in the stale top-level tracker.
- Re-checking D1 snapshot/ordering safety around `_apply_graph_boosts()`, `_apply_family_affinity()`, and `filter_recommendations()` without a code change; iteration 19 confirmed there is still no same-pass graph compounding beyond the already-logged F001 conflict-ordering defect.

---

## 11. RULED OUT DIRECTIONS
- Current sampled metadata files do not themselves contain absolute or traversal-shaped paths; the issue is acceptance of a future malicious payload, not a present sample-file compromise.
- Phase 005's cited runtime evidence sources are not the stale part of the migration story; the remaining mismatch is packet-local to `handover.md` and closeout claims inside the 011 root.
- The current 21-file metadata corpus does not have missing required fields, unknown targets, self-edges, sibling/prerequisite symmetry mismatches, or live `depends_on` cycles; the present integrity defect is weight-band drift, not broader graph corruption.
- `_apply_family_affinity()` does not produce an all-strong-family overboost today; once every member is already above `1.0`, the helper intentionally no-ops and leaves the family unchanged.
- The graph-system feature catalog is not broadly stale; the sampled compiler, compiled-graph, transitive-boost, family-affinity, conflict-penalty, ghost-guard, and evidence-separation pages still match the current runtime constants and compiled artifact shape.
- The current confidence-calibration path does not allow graph-only recommendations through the default routing threshold: both graph-boost helpers require a pre-existing positive target score, family affinity is included in `_graph_boost_count`, and the iteration 15 sweep found no passing result with `_graph_boost_count / _num_matches > 0.5`.
- Same-pass graph feedback loops are not present in the current router: `_apply_graph_boosts()` propagates from a frozen snapshot, `_apply_family_affinity()` is a single bounded follow-on pass, and filtering never reapplies graph state.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
 Synthesis / final report -- the registry is now stable after reading iterations 001-019, folding F051 into F021, and confirming that F020, F021, F022, and F060 remain active P0 blockers after adversarial replay. Final synthesis should use 23 active canonical findings (4 P0, 17 P1, 2 P2) and issue FAIL until those four blocker-level packet contradictions are corrected.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- Implementation completed by claude-opus-4-6 on 2026-04-13
- 44/44 regression tests still pass in the current review run
- `skill_graph_compiler.py --validate-only` currently discovers 21 metadata files and reports zero hard errors plus 2 zero-edge warnings
- `skill_advisor.py --health` currently reports 20 real skills but `skill_graph_skill_count: 21`
- When `skill-graph.json` is missing or corrupt, `_load_skill_graph()` returns `None` and `--health` falls back to `skill_graph_loaded: false` plus `skill_graph_skill_count: 0` while leaving top-level `status: ok`
- The checked-in `skill-graph.json` measured 4667 bytes in this review run, so the packet's 1950-byte claim is stale
- 5 sub-phases completed (001-research-findings-fixes through 005-repo-wide-path-migration)
- The checked-in `skill-graph.json` still matches fresh compiler output from the current metadata set; the current D1 issues are validator gaps, not stale artifact generation.
- Compiler validation still passes even though it does not enforce edge-type-specific weight bands or reciprocal weight parity for symmetric relationships.
- `003-skill-advisor-packaging` now passes strict packet validation with zero errors/warnings, but its referenced `review/deep-review-findings.md` still reflects a pre-remediation 007-era failure report.
- Phase 005's cited README/playbook/metadata evidence sources already use the migrated `scripts/` layout; the remaining path-migration drift is in packet-local continuity docs.
- Phase 004's packet `graph-metadata.json` still omits the exact live evidence files named in CHK-014 even though the packet no longer uses the old glob-based metadata pattern.
- The sub-phase 002 manual testing playbook package remains executable on the live codebase: representative routing, graph, compiler, and regression scenarios all ran successfully with the documented `scripts/` paths and flags.
- The `manual_testing_playbook/` package still presents the expected 24-scenario breakdown (8 routing, 7 graph, 5 compiler, 4 regression) plus the root guide and live feature-catalog link.
- A repo-wide sweep across all 21 `graph-metadata.json` files found no missing required fields, invalid targets, self-edges, symmetry mismatches, or `depends_on` cycles.
- The live corpus currently contains 22 off-band edges accepted by validation: twenty `skill-advisor.enhances` edges at `0.8` plus the `skill-advisor` <-> `mcp-coco-index` dependency pair at `0.4`.
- The compiled graph still contains a 21st `skill-advisor` node, but runtime discovery/ranking remains limited to `*/SKILL.md`-backed skills and commands, so that extra node is currently inert for live routing behavior.
- `P1-GRAPH-001/002/003` currently match live advisor output and the 44/44 regression run; the remaining fixture-related drift is the packet's unsupported claim that three older expectations were corrected.
- `_apply_family_affinity()` still only nudges family members with `0 < score < 1.0`; if all members are already above `1.0`, the pass intentionally produces no additional boost, and explicit variant hits still do not participate because family affinity runs earlier in the pipeline.
- The iteration 15 confidence-calibration recheck confirmed that `_graph_boost_count` covers both transitive and family-affinity reasons, and that the strict-majority haircut did not allow any passing graph-majority recommendation in the current runtime sweep.
- Iteration 017 adversarially re-read F020, F021, F022, and F060 and found no downgrade path: the packet still falsely claims schema-version-1-only metadata, a 20-skill compiled graph, a 1950-byte artifact, and grep-zero path-migration closure across the broader root.
- A live replay of CHK-020 through CHK-041 showed that only CHK-031 and CHK-032 are currently stale: the former freezes an outdated `0.92` confidence for `mcp-code-mode`, while the latter cites a `build full stack` family-affinity example that no longer reproduces.
- The graph-system feature catalog sample is mostly current, but `02--graph-system/01-graph-metadata-schema.md` still describes a schema-v1 current reality even though `skill_graph_compiler.py` accepts schema versions `1` and `2` and sampled live metadata files are already on version `2`.
- Final dedupe leaves 23 active canonical findings: 4 P0, 17 P1, 2 P2. `F051` collapses into `F021` as the same 20-vs-21 skill-count contradiction, while `F001` stays active because iteration 019 re-confirmed it is still the only open ordering defect on the analyze-request pipeline.
- The packet now contains iteration files `001-019`, but `deep-review-state.jsonl` still duplicates runs 3 and 13 and keeps the P0 adversarial recheck aliases (`F160`-`F163`) as standalone `findingRefs`. Final synthesis should therefore treat the iteration markdown as the canonical registry source and the JSONL as lineage metadata only.
- The parent `tasks.md` still marks all top-level tasks complete and does not surface the later child-packet deferred/remediation lanes, so it is no longer a reliable packet-level execution ledger on its own.
- `_apply_graph_boosts()` snapshots the pre-graph score map and later calibration/filtering stages never write back into that state, so graph-derived boosts do not recursively compound within a single `analyze_request()` call; the remaining pipeline-order defect on this surface is the previously logged F001 conflict-penalty no-op.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 17 | The iteration 017 adversarial pass found no downgrade path for F020/F021/F022/F060: the top-level packet still contradicts the live schema/count/size contract, and Phase 005 still claims root-level grep-zero closure even though `handover.md` keeps forbidden legacy paths. |
| `checklist_evidence` | core | fail | 17 | The iteration 017 adversarial pass confirmed that CHK-006 / CHK-012 / CHK-023 remain false on the current tree: the live corpus still includes schema-v2 metadata, the compiled graph is far above the claimed 1950-byte size, and `handover.md` still defeats the Phase 005 grep-zero closeout claim. |
| `feature_catalog_code` | overlay | fail | 16 | The graph-system catalog mostly matches runtime behavior, but `01-graph-metadata-schema.md` still documents a schema-v1 current reality while the compiler and sampled live metadata corpus are schema-v2 aware. |
| `playbook_capability` | overlay | pass | 11 | Sub-phase 002's migrated playbook commands and path references are executable against the live `skill-advisor/scripts` CLI surfaces; no stale flag or file-path drift was found in the sampled scenarios. |
| `skill_agent` | overlay | notApplicable | - | Not a skill target type |
| `agent_cross_runtime` | overlay | notApplicable | - | Not an agent target type |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | [D1, D2, D3, D4] | 19 | 1 P0, 3 P1, 1 P2 (F001, F021, F030, F110, F011) | reviewed |
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | [D1, D2, D3, D4] | 5 | 3 P0, 4 P1, 1 P2 (F020, F021, F022, F023, F030, F031, F040, F041) | reviewed |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | [D1, D2, D3] | 5 | 2 P0, 1 P1, 0 P2 (F021, F022, F023) | reviewed |
| `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md` | [D4] | 16 | 0 P0, 1 P1, 0 P2 (F150) | reviewed |
| `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/*.md` | [D4] | 16 | 0 P0, 1 P1, 0 P2 (F150; schema page drifts while sampled peer pages still match runtime) | partial |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | [D3] | 14 | Supports F090 and F131 evidence replay | reviewed |
| `.opencode/skill/*/graph-metadata.json` (21 files on disk) | [D2, D3, D4] | 13 | 2 P0, 2 P1, 1 P2 (F020, F021, F031, F080, F081; deep-pass sweep localized live weight drift to `skill-advisor` + `mcp-coco-index`) | partial |
| `011-skill-advisor-graph/spec.md` | [D3] | 3 | 3 P0, 0 P1, 0 P2 (F020, F021, F022) | partial |
| `011-skill-advisor-graph/plan.md` | [] | - | - | pending |
| `011-skill-advisor-graph/implementation-summary.md` | [D3, D4] | 18 | 1 P0, 2 P1, 0 P2 (F022, F023, F090) | partial |
| `011-skill-advisor-graph/checklist.md` | [D3] | 14 | 1 P0, 3 P1, 0 P2 (F020, F023, F130, F131) | reviewed |
| `011-skill-advisor-graph/tasks.md` | [D4] | 18 | 0 P0, 1 P1, 0 P2 (F170) | partial |
| `011-skill-advisor-graph/001-research-findings-fixes/` | [D3] | 10 | 3 P1 (F050, F051, F090) | partial |
| `011-skill-advisor-graph/002-manual-testing-playbook/` | [D4] | 11 | 0 P0, 0 P1, 0 P2 (no new findings) | reviewed |
| `011-skill-advisor-graph/003-skill-advisor-packaging/` | [D3] | 6 | 1 P1 (F052) | partial |
| `011-skill-advisor-graph/004-graph-metadata-enrichment/spec.md` | [D3] | 7 | 0 P0, 1 P1, 0 P2 (F061) | partial |
| `011-skill-advisor-graph/004-graph-metadata-enrichment/checklist.md` | [D3] | 7 | 0 P0, 1 P1, 0 P2 (F061) | partial |
| `011-skill-advisor-graph/004-graph-metadata-enrichment/graph-metadata.json` | [D3] | 7 | 0 P0, 1 P1, 0 P2 (F061) | partial |
| `011-skill-advisor-graph/005-repo-wide-path-migration/spec.md` | [D3] | 7 | 1 P0, 0 P1, 0 P2 (F060) | partial |
| `011-skill-advisor-graph/005-repo-wide-path-migration/checklist.md` | [D3] | 7 | 1 P0, 0 P1, 0 P2 (F060) | partial |
| `011-skill-advisor-graph/005-repo-wide-path-migration/implementation-summary.md` | [D3] | 7 | 1 P0, 0 P1, 0 P2 (F060) | partial |
| `011-skill-advisor-graph/handover.md` | [D3] | 10 | 1 P0, 1 P1, 0 P2 (F060, F090) | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 20
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-011-2026-04-13T16-50-00Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-04-13T16:50:00Z
<!-- MACHINE-OWNED: END -->
