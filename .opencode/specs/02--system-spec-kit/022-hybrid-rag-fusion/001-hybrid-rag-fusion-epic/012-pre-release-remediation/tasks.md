<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: 012 Pre-Release Remediation

<!-- ANCHOR:notation -->
## Packet Notes

- This is the live consolidated backlog for `012-pre-release-remediation`.
- Every carried-forward task is reset to `[ ]`, including tasks that were marked complete in `012`, `013`, or `014`.
- Primary IDs in this file are new consolidated IDs (`CT###`).
- Original task IDs are preserved inline as provenance.
- Historical predecessor packet names below are preserved as provenance only.
- Deduplication is conservative. Tasks are only merged where the source rows clearly describe the same downstream work.

## Coverage Summary

| Source | Source Task Rows | Representation In This File |
|--------|------------------|-----------------------------|
| 012-pre-release-fixes-alignment-preparation/tasks.md | 97 | Preserved one-to-one as `CT001-CT030` and `CT035-CT104` |
| 013-v7-remediation/tasks.md | 10 | Preserved across `CT031`, `CT032`, and `CT108-CT114` |
| 014-v8-p1-p2-remediation/tasks.md | 12 | Preserved across `CT031`, `CT032`, `CT034`, `CT076-CT078`, `CT105-CT107`, `CT112-CT114` |
| **Total source rows** | **119** | **114 consolidated tasks after 5 semantic merges** |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 1. Historical Carried-Forward Investigation And Early Remediation

- [ ] CT001 Audit Memory MCP server health and capture blocker findings. `[Source: 012:T01]`
- [ ] CT002 Audit `generate-context` and supporting scripts for pipeline and validation gaps. `[Source: 012:T02]`
- [ ] CT003 Compare feature catalog coverage against code audit coverage. `[Source: 012:T03]`
- [ ] CT004 Compare manual testing playbook coverage against the live catalog. `[Source: 012:T04]`
- [ ] CT005 Audit pipeline architecture against shipped implementation. `[Source: 012:T05]`
- [ ] CT006 Audit `009-perfect-session-capturing` completeness. `[Source: 012:T06]`
- [ ] CT007 Audit validator output and template compliance across the tree. `[Source: 012:T07]`
- [ ] CT008 Audit recent commits for regressions. `[Source: 012:T08]`
- [ ] CT009 Audit `sk-code--opencode` compliance and JSON-mode quality paths. `[Source: 012:T09]`
- [ ] CT010 Audit architecture docs against implementation boundaries. `[Source: 012:T10]`
- [ ] CT011 Compile findings into the canonical epic research synthesis under `../research/`. `[Source: 012:T11]`
- [ ] CT012 Cross-reference findings and identify cascade dependencies. `[Source: 012:T12]`
- [ ] CT013 Fix MCP server module resolution for `@spec-kit/mcp-server/api`. `[Source: 012:T13]`
- [ ] CT014 Add network-error handling to embedding and API-key startup validation. `[Source: 012:T14]`
- [ ] CT015 Clear lint blockers that previously broke `npm run check`. `[Source: 012:T15]`
- [ ] CT016 Reduce critical spec validation failures and restore missing packet scaffolding. `[Source: 012:T16]`
- [ ] CT017 Fix rejection-path quality loop behavior. `[Source: 012:T17]`
- [ ] CT018 Allow `preflight` and `postflight` through input normalization. `[Source: 012:T18]`
- [ ] CT019 Forward `--session-id` through the workflow pipeline. `[Source: 012:T19]`
- [ ] CT020 Remove dead script-registry entries and stale routing metadata. `[Source: 012:T20]`
- [ ] CT021 Fix path-fragment trigger contamination and fold in the former JSON-enrichment subtask. `[Source: 012:T21]`
- [ ] CT022 Restore Stage 1 vector fallback when hybrid fusion fails. `[Source: 012:T22]`
- [ ] CT023 Add script-side indexing governance and preflight checks. `[Source: 012:T23]`
- [ ] CT024 Resolve retention-sweep ambiguity by documenting or manualizing the path. `[Source: 012:T24]`
- [ ] CT025 Update `.opencode/skill/system-spec-kit/mcp_server/tools/README.md` tool totals. `[Source: 012:T25]`
- [ ] CT026 Update root 022 packet counts and remove phantom phase references. `[Source: 012:T26]`
- [ ] CT027 Refresh MCP server README architecture map and DB-path examples. `[Source: 012:T27]`
- [ ] CT028 Create the missing companion files for `009/016-json-mode-hybrid-enrichment`. `[Source: 012:T28]`
- [ ] CT029 Triage dead-code, catalog, playbook, and metadata polish items as historical follow-up work. `[Source: 012:T29]`
- [ ] CT030 Preserve the original post-release cleanup queue as carried-forward historical context that the merged packet can truth-sync explicitly. `[Source: 012:T30]`
- [ ] CT031 Capture the authoritative v7 and v8 review findings, packet role, and blocker or advisory registry from the `012` review artifacts. `[Source: 013:T001, 014:T001]`
- [ ] CT032 Capture the runtime and validator baselines needed for consolidation, including the landed runtime test gate and the recursive or non-recursive validator baselines. `[Source: 013:T002, 014:T002]`
- [ ] CT033 Confirm the landed code-side remediation for `F-C01`, `F-C02`, `F-C03`, `F-C04`, and `F-S01` from live source and tests before consolidating packet lineage. `[Source: 013:T003]`
- [ ] CT034 Split the remaining work into recursive blockers, P2 follow-ons, and consolidation-stage release-control work. `[Source: 014:T003]`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 2. Tree Truth-Sync And Doc-Integrity Remediation

- [ ] CT035 Correct the root 022 status contract for phase 015. `[Source: 012:T31]`
- [ ] CT036 Expand epic certification to the live 11-child subtree. `[Source: 012:T32]`
- [ ] CT037 Repair sprint-tail navigation from sprint 010 to 011. `[Source: 012:T33]`
- [ ] CT038 Truth-sync the retrieval audit coverage claim from 10 to the live 11-feature inventory. `[Source: 012:T34]`
- [ ] CT039 Reconcile `021-remediation-revalidation` with the still-open 022 release packet. `[Source: 012:T35]`
- [ ] CT040 Replace unbacked Hydra safety-rail verification with real drill evidence or honest pending state. `[Source: 012:T36]`
- [ ] CT041 Truth-sync root 022 direct and recursive directory totals. `[Source: 012:T37]`
- [ ] CT042 Correct `006-feature-catalog` snippet totals. `[Source: 012:T38]`
- [ ] CT043 Correct `006-feature-catalog` category totals. `[Source: 012:T39]`
- [ ] CT044 Add live child `022` to the 007 umbrella inventory. `[Source: 012:T40]`
- [ ] CT045 Fix stale evaluation inventory counts in `007/009`. `[Source: 012:T41]`
- [ ] CT046 Fix stale scoring inventory counts in `007/011`. `[Source: 012:T42]`
- [ ] CT047 Rebuild the 015 umbrella playbook totals from the live tree. `[Source: 012:T43]`
- [ ] CT048 Fix `014-agents-md-alignment` command inventory drift. `[Source: 012:T44]`
- [ ] CT049 Fix `018-rewrite-system-speckit-readme` command inventory drift. `[Source: 012:T45]`
- [ ] CT050 Fix `016-rewrite-memory-mcp-readme` tool inventory drift. `[Source: 012:T46]`
- [ ] CT051 Truth-sync root README agent and MCP totals, including the missing `@deep-review`. `[Source: 012:T47]`
- [ ] CT052 Refresh the root 022 checklist against the current validator. `[Source: 012:T48]`
- [ ] CT053 Make the epic phase map mirror child status labels verbatim. `[Source: 012:T49]`
- [ ] CT054 Resolve contradictory shipped-model and final-phase language in `010-template-compliance-enforcement`. `[Source: 012:T50]`
- [ ] CT055 Fix impossible upstream blocker totals in the Hydra umbrella checklist. `[Source: 012:T51]`
- [ ] CT056 Remove premature `Complete` status from Hydra children awaiting sign-off. `[Source: 012:T52]`
- [ ] CT057 Align Hydra child summaries with the umbrella's actual activation caveats. `[Source: 012:T53]`
- [ ] CT058 Reconcile sequencing and dependency drift between session phases 007 and 008. `[Source: 012:T54]`
- [ ] CT059 Reopen or truthfully scope `016-json-mode-hybrid-enrichment`. `[Source: 012:T55]`
- [ ] CT060 Align `017-json-primary-deprecation` docs with the shipped runtime. `[Source: 012:T56]`
- [ ] CT061 Reconcile the T04 contradiction inside this packet's story of prior remediation. `[Source: 012:T57]`
- [ ] CT062 Resolve `012-command-alignment` done and not-done contradictions. `[Source: 012:T58]`
- [ ] CT063 Remove over-claiming from `013-agents-alignment`. `[Source: 012:T59]`
- [ ] CT064 Fix the 015 umbrella's `Complete` claim while child packets remain open. `[Source: 012:T60]`
- [ ] CT065 Remove the false verified-P1 claim from `013-memory-quality-and-indexing`. `[Source: 012:T61]`
- [ ] CT066 Update the executed second-half 015 packets that still say `Not Started`. `[Source: 012:T62]`
- [ ] CT067 Sync rewrite packet status with actual task completion. `[Source: 012:T63]`
- [ ] CT068 Add a root navigation and traceability contract to `005-architecture-audit`. `[Source: 012:T64]`
- [ ] CT069 Repair broken evidence links in `005-architecture-audit` and `010-template-compliance-enforcement`. `[Source: 012:T65]`
- [ ] CT070 Add a traceability contract for completed 007 second-half phases. `[Source: 012:T66]`
- [ ] CT071 Complete the Level 3+ companion docs for `016-json-mode-hybrid-enrichment`. `[Source: 012:T67]`
- [ ] CT072 Remove orphaned references to the removed packet. `[Source: 012:T68]`
- [ ] CT073 Fix the wrong parent pointer under `011-skill-alignment/001-post-session-capturing-alignment`. `[Source: 012:T69]`
- [ ] CT074 Repair nonexistent playbook-path references in 015 child packets 003, 004, and 007. `[Source: 012:T70]`
- [ ] CT075 Replace placeholder testing packets 020-022 with real packets or honest draft status. `[Source: 012:T71]`
- [ ] CT076 Clear the remaining anchor and legacy-reference blockers across `001`, `003`, `005`, `010`, `013`, `016`, and `018` by completing the granular truth-sync and doc-integrity work captured in this section. `[Source: 014:T004]`
- [ ] CT077 Clear the remaining `006-feature-catalog` doc-integrity backlog by closing the linked count, inventory, and documentation-truth tasks in this section. `[Source: 014:T005]`
- [ ] CT078 Clear the remaining `007-code-audit-per-feature-catalog` and `015-manual-testing-per-playbook` doc-integrity backlog by closing the linked inventory, traceability, playbook, and testing-packet tasks in this section. `[Source: 014:T006]`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 3. Runtime And P2 Follow-On Remediation

- [ ] CT079 Make the BM25 spec-folder scope filter fail closed. `[Source: 012:T72]`
- [ ] CT080 Bind working-memory access to trusted server-side session scope. `[Source: 012:T73]`
- [ ] CT081 Scope the governance audit away from full-table enumeration by default. `[Source: 012:T74]`
- [ ] CT082 Sanitize persisted and surfaced embedding-provider failure messages. `[Source: 012:T75]`
- [ ] CT083 Add an atomic claim step before retry work is processed. `[Source: 012:T76]`
- [ ] CT084 Remove stale auto-entity rows during in-place memory updates. `[Source: 012:T77]`
- [ ] CT085 Make SIGINT and SIGTERM cleanup clear workflow locks before reporting success. `[Source: 012:T78]`
- [ ] CT086 Stop structured JSON saves from reporting complete when `nextSteps` remain pending. `[Source: 012:T79]`
- [ ] CT087 Return bounded validation errors for empty `--json` input. `[Source: 012:T80]`
- [ ] CT088 Align startup embedding-dimension validation with runtime fallback rules. `[Source: 012:T81]`
- [ ] CT089 Reject invalid `EMBEDDINGS_PROVIDER` values at startup. `[Source: 012:T82]`
- [ ] CT090 Respect configured `VOYAGE_BASE_URL` during startup validation. `[Source: 012:T83]`
- [ ] CT091 Remove dead MCP-server code that still appears in release surfaces. `[Source: 012:T84]`
- [ ] CT092 Keep `npm run check` green after the v3 code and documentation sweep. `[Source: 012:T85]`
- [ ] CT093 Remove the production TODO marker from vector-index mutations. `[Source: 012:T86]`
- [ ] CT094 Eliminate or regenerate orphaned dist artifacts. `[Source: 012:T87]`
- [ ] CT095 Remove stale catalog references to deleted code and tests. `[Source: 012:T88]`
- [ ] CT096 Add catalog coverage for the three uncataloged audit categories. `[Source: 012:T89]`
- [ ] CT097 Replace brittle number-based catalog and audit matching with slug-based matching. `[Source: 012:T90]`
- [ ] CT098 Migrate Python CLI scripts from `sys.argv` to `argparse`. `[Source: 012:T91]`
- [ ] CT099 Move shell strict mode to the top of the affected scripts. `[Source: 012:T92]`
- [ ] CT100 Improve weak `description.json` metadata for umbrella packets. `[Source: 012:T93]`
- [ ] CT101 Raise playbook coverage above the current 75 percent baseline and clean orphan scenarios. `[Source: 012:T94]`
- [ ] CT102 Resolve dormant code modules instead of leaving them half-supported. `[Source: 012:T95]`
- [ ] CT103 Fix stale sprint metadata in sprints 5, 6, and 11. `[Source: 012:T96]`
- [ ] CT104 Close the architecture components gap between docs and code. `[Source: 012:T97]`
- [ ] CT105 Re-evaluate `F-P2-06` in `stage2-fusion.ts` and implement or re-defer it with evidence. `[Source: 014:T008]`
- [ ] CT106 Refresh `F-P2-13` and `F-P2-24` across the feature catalog, manual testing playbook, and release-control checklists. `[Source: 014:T009]`
- [ ] CT107 Record explicit disposition for remaining deferred P2 items that stay outside this wave. `[Source: 014:T010]`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 4. Verification And Release-Control Sync

- [ ] CT108 Rewrite the consolidated packet `spec.md` and `plan.md` to a current Level 3 structure that replaces the legacy `013` packet narrative. `[Source: 013:T004]`
- [ ] CT109 Record `F-P0-02`, `F-C01`, `F-C02`, `F-C03`, `F-C04`, and `F-S01` as evidence-backed complete in the consolidated packet docs. `[Source: 013:T005]`
- [ ] CT110 Add implementation-summary.md and restore required anchors across the consolidated packet docs. `[Source: 013:T008]`
- [ ] CT111 Run packet-local validation and clear consolidated packet structural errors. `[Source: 013:T009]`
- [ ] CT112 Re-run packet-local validation for each touched blocker packet before the global sweep. `[Source: 014:T007]`
- [ ] CT113 Run the full post-cleanup verification sweep, including `npm test`, non-recursive validator baselines, and recursive `022-hybrid-rag-fusion` validation. `[Source: 013:T010, 014:T011]`
- [ ] CT114 Update release-control artifacts and packet-local summaries to keep blocker truth honest, preserve the written v8 FAIL review until replaced, and leave wider cleanup explicitly open until reruns prove closure. `[Source: 013:T006, 013:T007, 014:T012]`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Review Checklist For This Packet

- [ ] Every source task row from `012`, `013`, and `014` is represented in this file via one-to-one carry-forward or explicit semantic merge.
- [ ] Every staged task remains unchecked.
- [ ] No merge was performed solely because source IDs collided.
- [ ] The five semantic merges are acceptable for review:
  `013:T001 + 014:T001`, `013:T002 + 014:T002`, `013:T010 + 014:T011`, and `013:T006 + 013:T007 + 014:T012`.
<!-- /ANCHOR:cross-refs -->
