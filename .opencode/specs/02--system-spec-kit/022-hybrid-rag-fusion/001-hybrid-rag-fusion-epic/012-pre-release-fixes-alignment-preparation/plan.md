# Plan: Pre-Release Fixes, Alignment & Full-Tree Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

This plan keeps the original 012 work history intact and extends the packet into a full-tree release-readiness plan for the live `022-hybrid-rag-fusion` tree.

- **Phase 1** is complete: original deep audit and backlog creation
- **Phase 2** is complete: v1 remediation of the original 49 findings
- **Phase 3** is complete: full-tree deep review and release-readiness reassessment
- **Phases 4-7** are the remaining release path for the live 022 tree

The plan must clear the v3 blocker set of **6 P0, 38 P1, and 14 P2** and produce a clean final re-review at **100/100**.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Mandatory release gates
- No active P0 findings
- No active P1 findings
- Honest parent-child status alignment across the 022 tree
- No unsupported verification claims in checklists or summaries
- `validate.sh --recursive` on the 022 tree exits 0 or 1 with no error-level issues
- `npm run -s lint`, `npm run -s typecheck`, and `npm test` pass from `.opencode/skill/system-spec-kit`
- Final release review scores **100/100**

### Interim gates by phase
- **Phase 4 gate**: counts, statuses, and navigation are truth-synced before evidence repair begins
- **Phase 5 gate**: broken links, orphaned refs, and missing companion docs are resolved before runtime fixes are closed
- **Phase 6 gate**: all 12 code P1 items are fixed and verified before final polish begins
- **Phase 7 gate**: no remaining unsupported release claims before the final review

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Workstream model

The remediation program has four active layers:
1. **Spec truth layer** — root, epic, sprint, umbrella, and rewrite packets must tell the same truth
2. **Evidence layer** — checklists, review artifacts, links, and companion docs must back every release claim
3. **Runtime correctness layer** — `mcp_server/`, `scripts/`, and `shared/` must clear the 12 remaining P1 code findings
4. **Release gate layer** — validation, tests, and final re-review must confirm the tree is genuinely sign-off ready

### Historical context inputs
- `research.md` captures the original 49-finding audit
- `review-report.md` captures the current 58-finding full-tree blocker set
- `tasks.md` and `checklist.md` hold the historical remediation record that now needs follow-up truth-sync updates

### Active remediation outputs
- Updated parent and umbrella packets across the 022 tree
- Repaired evidence and companion-doc set
- Verified code fixes in runtime packages
- Final release packet state with no active P0 or P1 findings

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Original Deep Audit (complete)

**What was fixed or established**
- Audited the original release surface across runtime code, scripts, validators, catalogs, playbooks, and architecture docs
- Produced the original **49-finding** backlog
- Established the first remediation order and release gate

**Files changed**
- `research.md`
- `tasks.md`
- `checklist.md`
- `scratch/agent-*.md`

**Verification completed**
- Findings categorized into P0, P1, and P2
- Cross-agent evidence consolidated into `research.md`
- Initial remediation backlog confirmed and ordered

### Phase 2: v1 Remediation (complete)

**What was fixed**
- Cleared the original P0 blockers and most of the required follow-up work through `T01-T30`
- Repaired the earlier startup, validation, workflow, and documentation blockers identified by the original audit
- Reached the v2 checkpoint of **84/100 PASS WITH NOTES**

**Files changed**
- Runtime source in `.opencode/skill/system-spec-kit/{mcp_server,scripts,shared}/**`
- Selected 022 documentation packets touched by `T01-T30`
- Current packet evidence files under `012-pre-release-fixes-alignment-preparation/`

**Verification completed**
- `npm run check` passed during the v1 cycle
- `workflow-e2e` passed during the v1 cycle
- `validate.sh` reached a non-error state during the v1 cycle
- Historical evidence captured in `checklist.md`

### Phase 3: Full-Tree Deep Review (complete)

**What was fixed or established**
- Reassessed the full live 022 tree after v1 remediation
- Verified that the major v1 code fixes were largely sound
- Identified the new release blocker set: **6 P0, 38 P1, 14 P2**
- Confirmed that the main remaining risk is documentation and spec-truth drift across the evidence layer

**Files changed**
- `review-report.md`
- Review support artifacts used to produce the 20-iteration result

**Verification completed**
- 20 review iterations completed
- 119 spec directories and 19 direct phases reviewed
- All P0 and P1 findings backed by file evidence in `review-report.md`

### Phase 4: Spec Truth Remediation

**What to fix**
- Clear the **6 P0 blockers** rooted in false completion claims, stale subtree accounting, broken navigation, and unsupported verification claims
- Resolve the **11 count and inventory drift** findings across root, catalog, code-audit, testing, alignment, and rewrite packets
- Resolve the **16 status and completion drift** findings so parent packets, child packets, tasks, and checklists describe the same live state

**Files to change**
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/{spec.md,plan.md,tasks.md,checklist.md}`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/010-sprint-9-extra-features/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-*` through `018-*` packets that still carry stale counts or contradictory status text
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/**`
- `012-pre-release-fixes-alignment-preparation/{spec.md,plan.md,tasks.md,checklist.md}` for current-program tracking

**Verification steps**
- Recount the live 022 tree and direct-child families before editing parent summaries
- Compare every parent or umbrella status against live child packet status, not historical prose
- Re-run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on touched folders and on the 022 tree recursively after truth-sync edits
- Confirm that no packet still claims `Complete` where the linked child packet or task state says `Not Started`, `Draft`, or otherwise incomplete

### Phase 5: Evidence & Documentation Fixes

**What to fix**
- Resolve the **8 missing docs and evidence** findings across architecture, code-audit, Hydra, session-capturing, testing, and rewrite packets
- Add or repair evidence for Hydra rollback and kill-switch drills, or downgrade those claims honestly if evidence cannot be produced
- Clean broken links, orphaned refs, and wrong parent pointers left behind by deleted or rewritten packets

**Files to change**
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/**`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-*` through `019-*` rewrite packets that cite stale counts, refs, or ownership
- Any packet under 022 that still references deleted `013-*` paths or nonexistent playbook artifacts

**Verification steps**
- Re-run spec validation and confirm no broken markdown references or required-companion-doc failures remain in touched packets
- Confirm every checklist evidence link points to a live file, command result, or review artifact
- Confirm every child packet points at the correct parent packet
- Expand placeholder packets into honest test packets, or mark them as draft or not started instead of complete

### Phase 6: Code Correctness & Security Fixes

**What to fix**
- Make BM25 spec-folder filtering fail closed on lookup errors
- Stop binding session-scoped working memory to a caller-controlled `sessionId`
- Prevent governance audit enumeration from defaulting to unscoped full-table reads
- Sanitize raw embedding-provider failure messages before persistence or surfacing
- Add an atomic claim to retry work selection to prevent concurrent embedding races
- Remove stale auto-entity rows on in-place memory updates
- Prevent stale workflow locks on `SIGINT` and `SIGTERM`
- Stop structured JSON saves from reporting complete when `nextSteps` are still pending
- Treat empty `--json` input as validation failure, not a crash with stack trace leakage
- Align startup embedding-dimension validation with runtime provider fallback behavior
- Reject invalid `EMBEDDINGS_PROVIDER` values at startup
- Validate `VOYAGE_BASE_URL` from the configured startup path, not only the default URL

**Files to change**
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/**`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/**`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/**`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/**`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/**`
- `.opencode/skill/system-spec-kit/scripts/**`
- `.opencode/skill/system-spec-kit/shared/**`
- Related tests in `.opencode/skill/system-spec-kit/mcp_server/tests/**` and any script or shared test coverage that already exists for the touched paths

**Verification steps**
- Run `npm run -s lint` from `.opencode/skill/system-spec-kit`
- Run `npm run -s typecheck` from `.opencode/skill/system-spec-kit`
- Run `npm test` from `.opencode/skill/system-spec-kit`
- Run targeted regression suites for touched runtime areas where existing tests already exist
- Confirm startup validation paths by exercising the configured provider and URL checks without leaking raw stack traces or provider internals

### Phase 7: P2 Polish & Final Verification

**What to fix**
- Close or explicitly defer the **14 P2 findings** covering stale metadata, evidence bookkeeping, defense-in-depth, and naming ambiguity
- Sweep any residual drift exposed by Phases 4-6
- Prepare the full packet family for a clean release-readiness re-review

**Files to change**
- Any 022 documentation packet still carrying stale counts, naming ambiguity, or weak evidence after Phases 4-5
- Any runtime file still needing low-risk hardening after Phase 6
- Current packet files under `012-pre-release-fixes-alignment-preparation/` to record the final release gate state

**Verification steps**
- Re-run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` recursively on the 022 tree
- Re-run `npm run -s lint`, `npm run -s typecheck`, and `npm test` from `.opencode/skill/system-spec-kit`
- Confirm no active P0 or P1 findings remain
- Confirm all remaining P2 items are either fixed or explicitly deferred with rationale
- Run the final release-readiness review and do not close the packet until it scores **100/100**

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Documentation verification
- Validate touched spec folders with `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Re-run recursive validation on the full 022 tree before final sign-off
- Spot-check parent-child links, count tables, and checklist evidence against live files

### Runtime verification
- Run `npm run -s lint` from `.opencode/skill/system-spec-kit`
- Run `npm run -s typecheck` from `.opencode/skill/system-spec-kit`
- Run `npm test` from `.opencode/skill/system-spec-kit`
- Run targeted regression suites for touched runtime areas when existing tests already cover them

### Release verification
- Confirm no active P0 or P1 findings remain
- Confirm all remaining P2 items are resolved or explicitly deferred
- Execute the final release-readiness review against the fully updated tree

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### Historical sequence
`Phase 1 -> Phase 2 -> Phase 3`

### Remaining release sequence
`Phase 4 -> Phase 5 -> Phase 6 -> Phase 7`

### Why this order matters
- **Phase 4 before Phase 5**: evidence repair cannot be trusted until counts, statuses, parent links, and navigation are truth-synced.
- **Phase 5 before Phase 6**: runtime fixes need an accurate documentation and evidence layer so the team can verify against the right contracts.
- **Phase 6 before Phase 7**: final polish and release verification only matter after both the spec layer and the code layer are corrected.

### External dependencies
- `review-report.md` remains the source of truth for the active v3 finding set
- Live child packet status remains the authority for parent packet truth-sync work
- Existing workspace test and validation commands remain the required verification gates

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Documentation rollback
- Revert individual packet truth-sync edits if a child packet was misread or if a parent summary introduced a new contradiction
- Prefer fixing false `Complete` claims by downgrading them first, then re-adding completion only after evidence exists

### Runtime rollback
- Revert any Phase 6 code fix that causes lint, typecheck, test, or startup regression
- Keep runtime fixes isolated enough that a single finding can be rolled back without undoing unrelated remediation work

### Release rollback
- If the final re-review still finds active P0 or P1 issues, do not mark the tree release-ready
- Keep the packet in progress until the blocker set is actually closed

<!-- /ANCHOR:rollback -->
