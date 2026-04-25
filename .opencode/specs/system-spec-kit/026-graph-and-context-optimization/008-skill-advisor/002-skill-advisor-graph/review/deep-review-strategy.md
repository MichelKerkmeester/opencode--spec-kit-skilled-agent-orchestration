---
title: Deep Review Strategy - 011-skill-advisor-graph (Gen2)
description: Runtime strategy tracking review progress, dimension coverage, findings, and outcomes across the post-remediation review.
---

# Deep Review Strategy - 011-skill-advisor-graph (Gen2)

## 1. OVERVIEW

### Purpose
Track the post-remediation deep review for the skill advisor graph packet, starting with the D2 security recheck of the compiler boundary fix and the newly added SQLite and shell-entry surfaces.

---

## 2. TOPIC
Review of `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/002-skill-advisor-graph` after remediation, with this restart session re-checking corrected defects and adjacent trust-boundary surfaces.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness -- Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security -- Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability -- Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability -- Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Re-litigating archived gen1 findings outside the currently remediated surfaces unless the current code reintroduces them.
- Modifying any code under review.
- External or dependency-level security review beyond the checked repository surfaces.

---

## 5. STOP CONDITIONS
- All 4 dimensions reviewed with file-cited evidence.
- Any re-opened P0/P1 security defect immediately blocks release readiness.
- Max 7 iterations reached.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D2 Security | PASS | 2 | F010's direct traversal vector is no longer reproducible, and the adjacent SQLite and init-shell surfaces remain parameterized / quoted without new injection findings. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Cross-checking the archived F010 record against the remediated compiler lines isolated the intended trust-boundary fix quickly.
- A direct import-and-call probe confirmed `../` and absolute paths are now rejected before existence checks.
- Reviewing the SQLite and init-script surfaces stayed efficient because the reviewed code paths are small and consistently parameterized / quoted.

---

## 9. WHAT FAILED
- The restarted gen2 packet did not include an active `deep-review-strategy.md`, so this state surface had to be reconstructed from the live config and the requested iteration scope.
- The active packet also lacks `iteration-001.md`, so run numbering currently depends on operator context rather than a complete local lineage.

---

## 10. EXHAUSTED APPROACHES (do not retry)
- Re-testing plain `../` or absolute-path traversal against `validate_derived_metadata()` without a compiler change; iteration 2 already confirmed the direct string-based escape is closed.
- Re-scanning `skill-graph-db.ts` for injection using the same prepared-statement surfaces without a code change; iteration 2 already ruled out SQL injection on that storage path.

---

## 11. RULED OUT DIRECTIONS
- SQL injection in the reviewed `skill-graph-db.ts` query paths.
- Shell injection in `init-skill-graph.sh`.
- Direct `../` or absolute-path traversal across `source_docs`, `key_files`, and `entities[].path`.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
D3 Traceability - verify that the restarted gen2 review packet and remediation docs reflect the current security verdict, especially the rebuilt lineage/state surfaces under `review/`.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- Archived gen1 iteration 002 originally logged F010 as active against the pre-remediation compiler.
- The active gen2 packet currently contains only the config record in `deep-review-state.jsonl`; no earlier live iteration artifact is present at `review/iterations/iteration-001.md`.
- This D2 pass reviewed `skill_graph_compiler.py`, `skill-graph-db.ts`, and `init-skill-graph.sh`.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Not reviewed in this D2 pass. |
| `checklist_evidence` | core | pending | - | Not reviewed in this D2 pass. |
| `feature_catalog_code` | overlay | notApplicable | - | Not part of the security recheck scope. |
| `playbook_capability` | overlay | notApplicable | - | Not part of the security recheck scope. |
| `skill_agent` | overlay | notApplicable | - | Not a skill target type. |
| `agent_cross_runtime` | overlay | notApplicable | - | Not an agent target type. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | [D2] | 2 | 0 P0, 0 P1, 0 P2 (F010 remediated) | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | [D2] | 2 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` | [D2] | 2 | 0 P0, 0 P1, 0 P2 | reviewed |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-011-gen2-2026-04-13T21-00-00Z, parentSessionId=rvw-011-2026-04-13T16-50-00Z, generation=2, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-04-13T21:00:00Z
<!-- MACHINE-OWNED: END -->
