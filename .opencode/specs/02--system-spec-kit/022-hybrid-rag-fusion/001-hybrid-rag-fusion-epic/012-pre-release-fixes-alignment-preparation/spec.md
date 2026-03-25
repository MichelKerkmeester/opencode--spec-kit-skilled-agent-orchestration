# 012 — Pre-Release Fixes & Alignment Preparation

> **Level 2+ | Phase 12 of 022-hybrid-rag-fusion Epic**

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2+ |
| **Status** | In Progress — code gates are green, but release-control validation is still blocked by unresolved recursive validator debt across the `007-code-audit-per-feature-catalog` child packet family |
| **Priority** | P0 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | ../011-research-based-refinement/spec.md |
| **Packet Role** | Release-readiness control packet for the full `022-hybrid-rag-fusion` tree |
| **Completed Work Phases** | 7 (Phases 1-7 complete) |
| **Active Work Phase** | None — all phases complete |
| **v1 Original Audit** | 49 findings total: 4 P0, 19 P1, 26 P2 |
| **v2 Narrow Review** | 84/100 PASS WITH NOTES |
| **v3 Full-Tree Review** | 42/100 FAIL, 58 findings total: 6 P0, 38 P1, 14 P2 |
| **Live Review Scope** | 123 spec directories, 19 direct phases |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The original 012 packet was written for a targeted pre-release audit and remediation cycle. That scope is no longer sufficient.

The v1 remediation work fixed the original blockers and improved the score to **84/100 PASS WITH NOTES**, but the later full-tree review showed that the broader 022 documentation tree still carries severe **spec-truth, evidence, count, and status drift**. Parent and umbrella packets cannot yet be treated as authoritative release evidence.

### Purpose

This packet now governs the full release-readiness program for the 022 tree. It must preserve the truth of the completed work while defining the remaining remediation needed to clear the remaining packet-family validation blockers and reach a fully verified release state.

### Work History

1. **Phase 1: Original audit** (complete) — 10-agent deep research established the first release-risk backlog.
2. **Phase 2: v1 remediation** (complete) — `T01-T30` cleared the original blockers and repaired the first release packet. `T04` was completed during this Phase 2 v1 remediation cycle.
3. **Phase 3: Full-tree deep review** (complete) — a 20-iteration review of the full 022 tree verified the major v1 code fixes, but exposed broad documentation and evidence drift.
4. **Phase 4: Full-Tree Remediation** (in progress) — truth-sync the documentation tree, repair the evidence layer, and close the remaining release-control gaps in the `007` packet family before the release gate can close.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Historical scope (complete)
- Original 012 audit of runtime code, scripts, validators, catalogs, playbooks, and release docs
- v1 remediation of the original 49 findings through `T01-T30`
- Prior verification captured in `checklist.md`

### Active scope: full 022 tree remediation
- Clear all **6 P0 blockers** from the v3 full-tree review (separate from `T04`, which was completed during the Phase 2 v1 remediation cycle)
- Resolve all **11 count and inventory drift** findings
- Resolve all **16 status and completion drift** findings
- Repair all **8 missing docs and evidence** findings
- Fix all **12 code correctness and security P1** findings across `mcp_server/`, `scripts/`, and `shared/`
- Triage and close or defer all **14 P2** findings honestly
- Re-run validation, tests, and release review against the full 022 tree

### Phase 4: Full-Tree Remediation
- Truth-sync root, epic, umbrella, and child packets against the live tree
- Repair missing docs, evidence gaps, broken links, orphaned refs, and unsupported completion claims
- Clear the remaining 12 runtime correctness/security P1 items after documentation truth is restored
- Re-run release verification and drive the tree back to trustworthy sign-off

### In-scope tree areas
- Root `022-hybrid-rag-fusion` coordination packet
- `001-hybrid-rag-fusion-epic` and its sprint subtree
- `005-architecture-audit`
- `006-feature-catalog`
- `007-code-audit-per-feature-catalog`
- `008-hydra-db-based-features`
- `009-perfect-session-capturing`
- `010` through `018` alignment and rewrite packets
- `015-manual-testing-per-playbook`
- Runtime code under `.opencode/skill/system-spec-kit/{mcp_server,scripts,shared}`

### Deliverables

| Deliverable | Status | Content |
|-------------|--------|---------|
| `research.md` | Complete | Original 49-finding audit with file-backed evidence |
| `review-report.md` | Complete, current | 20-iteration release-readiness review plus the current blocker set for the 022 tree |
| `tasks.md` | Complete, requires follow-up updates | Historical remediation backlog and verification tasks |
| `checklist.md` | Complete, requires follow-up updates | Historical verification evidence plus remaining release gate items |
| `plan.md` | Rewritten | Full 7-phase remediation plan covering historical work and remaining phases |
| `spec.md` | Rewritten | Updated objective, scope, findings history, and full-tree remediation target |
| `scratch/agent-NN-*.md` | Complete | Original deep-research raw outputs |
| Full-tree truth-sync edits across 022 | Pending | Parent-child status, count, and navigation corrections |
| Evidence and companion-doc repairs across 022 | Pending | Missing docs, fixed links, orphan cleanup, verification evidence |
| Runtime remediation patches in `mcp_server/`, `scripts/`, `shared/` | Pending | Code correctness and security fixes required by v3 |

### Out of scope
- New feature development unrelated to the review findings
- Playbook expansion beyond what is required to close the documented evidence gaps
- Refactors not required to clear a v3 finding or reach release sign-off

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (must complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet must describe the full release-readiness program, not only the original 012 audit | Objective and scope explicitly cover original audit, v1 remediation, full-tree deep review, and Phase 4 remediation |
| REQ-002 | The packet must preserve both v1 and v3 finding totals | `49 findings` and `58 findings` are both recorded accurately with severity breakdowns |
| REQ-003 | The active scope must cover the full 022 remediation surface | Scope includes tree-wide documentation drift, evidence drift, and runtime P1 fixes |
| REQ-004 | A dedicated `Phase 4: Full-Tree Remediation` workstream must be defined | Problem and purpose, plan, and success criteria all describe the new remediation phase |
| REQ-005 | Historical passed criteria must stay visible | Existing passed release criteria remain recorded as achieved work |
| REQ-006 | New release criteria must address the live blocker set | Success criteria explicitly separate cleared code/runtime gates from the remaining packet-family validation blockers and final release review |

### Acceptance Scenarios

- **Given** the original 49-finding audit and the later 58-finding full-tree review, **when** a maintainer reads this packet, **then** both audit histories are understandable without reopening older packet versions.
- **Given** the live 022 remediation program, **when** a maintainer reviews this packet, **then** it is clear that the packet now governs the whole 022 release effort rather than only the original 012 fixes.
- **Given** the current remediation sequence, **when** a maintainer moves from this spec into `plan.md`, **then** the Phase 4-7 execution order is explicit.
- **Given** the current blocker set, **when** a reviewer reads the success criteria, **then** they can distinguish already-achieved criteria from the criteria that still block final release sign-off.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Historical criteria already achieved
- [x] All 10 original investigation areas were audited
- [x] Original findings were categorized by severity (P0/P1/P2)
- [x] No original P0 issue was left without a documented remediation path
- [x] Feature catalog and playbook gaps were quantified during the original audit
- [x] All original P0 blockers were resolved during v1 remediation — [EVIDENCE: `T01-T04` verified in `checklist.md`; `T04` completed during the Phase 2 v1 remediation cycle]
- [x] `validate.sh` reached a non-error state during the v1 remediation cycle — [EVIDENCE: prior pass recorded as exit 1 with 0 errors]
- [x] `npm run check` passed during the v1 remediation cycle — [EVIDENCE: prior checklist evidence records 0 lint errors and 0 TypeScript errors]
- [x] `workflow-e2e` passed during the v1 remediation cycle — [EVIDENCE: prior checklist evidence records 7/7 passing]
- [x] The MCP server startup path was hardened for flaky-network validation during v1 remediation — [EVIDENCE: prior checklist evidence for `T02`]

### Phase 4 release criteria
- [x] All **6 v3 P0 blockers** are cleared with file-backed evidence — [EVIDENCE: root 015 status corrected, epic direct-child truth synced to 12 children, Hydra drill claims demoted honestly, and the code-side reviewer confirmed no active implementation P0/P1 regressions in the T72-T83 scope]
- [ ] All **count and inventory drift** findings are fully closed across the live tree — [EVIDENCE: root 022 is now synced to the `2026-03-25` `399/21/122` snapshot and the epic is synced to 12 direct children, but the `007` packet family still carries child-packet validation debt]
- [ ] All **status and completion drift** findings are reconciled across parent packets, child packets, tasks, and checklists — [EVIDENCE: root and epic parent packets are now truthful, and the `007` umbrella sibling contract is repaired, but recursive `007` child packets still fail on level-match, stale metadata, and broader template debt]
- [ ] All **missing docs and evidence** findings are resolved, or downgraded honestly with no false verification claims left in place — [EVIDENCE: `005` and `013` evidence gates were repaired, but the `007` audit family still has unresolved child-spec hygiene, missing anchors, stale metadata, and template drift]
- [x] All **12 code correctness and security P1** findings are fixed and verified — [EVIDENCE: the T72-T83 scope remains green, T79 is fixed in source/dist and regression-covered, and direct correctness/security review found no active implementation P0/P1 issues]
- [ ] All **14 P2** findings are either closed or explicitly deferred with rationale — [EVIDENCE: major documentation truth-sync landed, but final release review still depends on resolving the remaining `007` packet-family blocker set]
- [ ] `validate.sh --recursive` on the 022 tree exits with no release-blocking packet-family issues — [EVIDENCE: root validation is clean, `005` and `013` now have evidence integrity, but recursive validation still reports 91 errors and 72 warnings inside the `007` child packet family]
- [x] Workspace verification passes for the live implementation (`npm run test` from `.opencode/skill/system-spec-kit`, plus direct `mcp_server` and `scripts` verification) — [EVIDENCE: full workspace `npm run test` exited 0 on 2026-03-25; direct correctness/security review also re-ran the `mcp_server` and `scripts` test suites successfully]
- [ ] A follow-up release review reports release-ready status with no active release-control blockers — [EVIDENCE: the current review packet remains CONDITIONAL because the `007` packet family is not yet validator-clean]

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parent packets keep false `Complete` claims | Release sign-off stays untrustworthy | Phase 4 truth-sync work must happen before any new certification |
| Risk | Evidence links remain stale after rewrite work | Review artifacts stay non-authoritative | Phase 5 repairs every evidence path before final verification |
| Risk | Runtime fixes land without matching packet updates | Code and docs drift again | Phase 6 depends on the corrected documentation baseline from Phases 4 and 5 |
| Dependency | `review-report.md` remains the source of truth for the active blocker set | Remediation can miss findings if the packet drifts from the report | Keep plan and tasks aligned to the v3 finding set |
| Dependency | Existing 022 child packets must tell the truth about their own status | Parent summaries cannot be fixed from historical prose alone | Use live child packet state as the authority during truth-sync work |

### Additional operating constraints
- Documentation truth must take priority over optimistic completion wording.
- All release claims must be backed by live files, live status, or live verification evidence.
- The packet must stay concise enough to serve as the control document for the wider remediation program.

### Edge conditions
- The v1 remediation evidence remains valid historical evidence, even though the v3 review opened a broader full-tree remediation scope.
- Some v3 findings may be resolved by downgrading false claims instead of adding new implementation work.
- Hydra drill evidence may require either new artifacts or honest demotion of unsupported verification claims.

### Complexity signal
This packet remains high-complexity coordination work because it spans tree-wide documentation truth, evidence quality, and runtime release gates at the same time.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

1. How far should the `007-code-audit-per-feature-catalog` child packets be modernized versus explicitly marked historical to clear the remaining recursive validator debt?
2. Which `007` child-packet findings are acceptable as historical/template drift, and which must be brought to current template, anchor, level, and metadata standards before release sign-off?
3. Should final release sign-off require a fully clean recursive strict validation, or a narrower gate with `007` child-packet modernization tracked as follow-up work?

<!-- /ANCHOR:questions -->
