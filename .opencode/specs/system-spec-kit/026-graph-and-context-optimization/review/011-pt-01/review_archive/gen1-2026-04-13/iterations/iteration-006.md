# Iteration 006: D3 Traceability deep pass

## Focus
D3 Traceability - cross-check sub-phase `001-research-findings-fixes` and `003-skill-advisor-packaging` packet claims against the current `skill-advisor` scripts, compiled graph artifact, and packet-local evidence files.

## Verified claims
- 001's landed ghost-candidate and graph-evidence-separation fixes still match the shipped advisor code: graph boosts require pre-graph evidence, family affinity only boosts already-scored members, and confidence calibration still tracks `_graph_boost_count`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes/spec.md:150] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:83] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:131] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1602]
- 003's package-layout description is current: the shipped root still contains `README.md`, `SET-UP_GUIDE.md`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, and `graph-metadata.json`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging/spec.md:30] [SOURCE: .opencode/skill/skill-advisor:1-6]
- Re-running the live checks this iteration confirmed that 003's strict-validation claim is now accurate and that 001's regression and compiler-validation claims still hold; the new issues below are packet traceability drift, not a fresh runtime regression.

## Spot-checked checklist evidence
- 001 CHK-023 / CHK-040 still line up with the live compiler: `--validate-only` passes and still emits the documented zero-edge warnings for `sk-deep-research` and `sk-git`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes/checklist.md:69] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes/checklist.md:87] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:521]
- 001 CHK-022 is stale: the checklist still records `3958` bytes, but this iteration's `wc -c .opencode/skill/skill-advisor/scripts/skill-graph.json` returned `4667`.
- 003 CHK-020 is accurate now: strict packet validation for `003-skill-advisor-packaging` passed with zero errors and zero warnings this iteration.

## Findings

### P1 - Required
- **F050**: `001-research-findings-fixes/spec.md` still scopes the phase as "Fix all 5 P1 issues," but the same packet's completion docs and the shipped advisor code show that three P1 items remain deferred. The spec therefore overstates what this sub-phase actually delivered. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes/spec.md:113] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes/checklist.md:98] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1062] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1596]
- **F051**: `001-research-findings-fixes/implementation-summary.md` freezes a verification snapshot with `skill_graph_skill_count: 20`, but `health_check()` reports the current compiled graph's `skill_count`, and the checked-in graph now declares `21`. That makes the packet's recorded verification evidence non-reproducible from the shipped artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:71] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1660] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1676] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]
- **F052**: `003-skill-advisor-packaging` still presents `review/deep-review-findings.md` as the packet's provenance source, but that file is a stale pre-remediation review artifact: it still records a CONDITIONAL verdict, cites `007-skill-advisor-graph/...` paths, and claims strict validation fails. That directly conflicts with the current 003 packet, which now reports validation/integrity PASS, so CHK-001 and the spec metadata point at the wrong evidence source. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging/spec.md:50] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging/checklist.md:42] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging/review/deep-review-findings.md:10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging/review/deep-review-findings.md:27] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging/review/deep-review-findings.md:81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging/implementation-summary.md:81]

## Ruled Out
- 003's current spec/checklist/implementation-summary are not falsely claiming a failed validator run anymore; the strict-validation pass reproduced cleanly in this iteration.
- 001's landed P0 fixes are still present in the code; the problem is packet drift around deferred P1 work and frozen verification metrics.

## Dead Ends
- No dead ends. The new issues were directly observable from packet docs, the stale review artifact, and the shipped advisor/compiler surfaces.

## Recommended Next Focus
Stabilization / convergence - all four review dimensions are now covered, so the next pass should re-check active P0/P1 findings and decide whether the loop is ready to synthesize.
