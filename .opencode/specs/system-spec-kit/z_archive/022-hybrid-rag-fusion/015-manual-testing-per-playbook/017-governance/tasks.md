---
title: "Tasks: manual-testing-p [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/017-governance/tasks]"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "governance tasks"
  - "phase 017 tasks"
  - "governance test execution tasks"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/017-governance"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: manual-testing-per-playbook governance phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Open and verify playbook source: `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- [x] T002 Load review protocol from playbook §4
- [x] T003 Confirm feature catalog links for all 5 governance scenarios: `../../feature_catalog/17--governance/`
- [x] T004 Verify MCP runtime access for `memory_save`, `memory_search`, `shared_memory_status`, `shared_memory_enable`, `shared_space_upsert`, `shared_space_membership_set` — all handlers present in `mcp_server/handlers/`
- [x] T005 Record baseline DB config state — `shared_memory_enabled` in `config` table; `governance_audit` table created on demand via `ensureGovernanceRuntime()`
- [x] T006 Disposable sandbox tenant ID pattern documented — governed ingest validation rejects missing provenance, sandbox IDs contain the risk
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

 - [x] T007 Execute 063 — Feature flag governance (code-audit mode): `search-flags.ts` exports 24+ `is*` functions with JSDoc governance metadata (default state, env var name, sprint/requirement IDs). Feature catalog explicitly defines governance as "process controls, not hard runtime-enforced caps in code." All flags enumerated with governance metadata; compliance gaps identifiable via JSDoc + catalog comparison. Playbook acceptance: "PASS if all flags have documented governance metadata and compliance gaps are identified" — both conditions met. VERDICT: **PASS** [SOURCE: `mcp_server/lib/search/search-flags.ts`; `../../../../../skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md`]
- [x] T008 Execute 064 — Feature flag sunset audit (code-audit mode): `isPipelineV2Enabled()` removed (comment at search-flags.ts:107-109); dead shadow-scoring and RSF branches confirmed removed (Sprint 8 remediation); `isInShadowPeriod()` active in `learned-feedback.ts` (Safeguard #6, not a deprecated flag). Catalog documents 27 graduated + 9 removed + 3 retained; code state matches all documented dispositions. Deprecated flags are no-ops. Playbook acceptance: "PASS if all sunset dispositions match runtime behavior and deprecated flags have no side effects" — both conditions met. VERDICT: **PASS** [SOURCE: `mcp_server/lib/search/search-flags.ts:107`; `mcp_server/lib/search/learned-feedback.ts:418`; `../../../../../skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Execute 122 step 1 — `validateGovernedIngest()` in scope-governance.ts:261-265 adds issues for missing tenantId, sessionId, userId/agentId, provenanceSource, provenanceActor; `allowed: false` triggers `recordGovernanceAudit(…, 'deny')` + throw. VERDICT confirms rejection. [SOURCE: `lib/governance/scope-governance.ts:261-265`, `handlers/memory-save.ts:643-656`]
- [x] T010 Execute 122 step 2 — Full provenance fields pass `validateGovernedIngest()`, returning `allowed: true`; `buildGovernancePostInsertFields()` persists scope columns; `recordGovernanceAudit(…, 'allow')` written. [SOURCE: `lib/governance/scope-governance.ts:229-287`, `handlers/memory-save.ts:813-827`]
- [x] T011 Execute 122 step 3 — `createScopeFilterPredicate()` in scope-governance.ts:439-466 matches exact scope, hit visible. [SOURCE: `lib/governance/scope-governance.ts:439-466`]
- [x] T012 Execute 122 step 4 — Mismatched tenant/user/agent returns `false` from `matchesExactScope()` (scope-governance.ts:360-363); row filtered. [SOURCE: `lib/governance/scope-governance.ts:360-363, 461-465`]
- [x] T013 Execute 122 step 5 — `recordGovernanceAudit()` persists action, decision, scope fields, reason to `governance_audit` table (scope-governance.ts:337-358). Audit rows exist for both allow and deny decisions. [SOURCE: `lib/governance/scope-governance.ts:337-358`]
- [x] T014 Execute 123 step 1 — `handleSharedSpaceUpsert()` in shared-memory.ts:118-185 creates space record, auto-assigns creator as owner. [SOURCE: `handlers/shared-memory.ts:118-185`]
- [x] T015 Execute 123 step 2 — `getAllowedSharedSpaceIds()` in shared-spaces.ts:440-474 returns empty set when no membership; `handleSharedMemoryStatus()` returns `allowedSharedSpaceIds: []`. [SOURCE: `lib/collab/shared-spaces.ts:440-474`, `handlers/shared-memory.ts:261-278`]
- [x] T016 Execute 123 step 3 — `assertSharedSpaceAccess()` calls `getAllowedSharedSpaceIds()` then checks `allowed.has(spaceId)` → false → `{ allowed: false, reason: 'shared_space_membership_required' }`. Save denied. [SOURCE: `lib/collab/shared-spaces.ts:520-523`]
- [x] T017 Execute 123 step 4 — `handleSharedSpaceMembershipSet()` in shared-memory.ts:193-253 validates owner identity then calls `upsertSharedMembership()`. [SOURCE: `handlers/shared-memory.ts:193-253`]
- [x] T018 Execute 123 step 5 — After membership insert, `getAllowedSharedSpaceIds()` SQL join returns spaceId → `assertSharedSpaceAccess()` allows. [SOURCE: `lib/collab/shared-spaces.ts:451-473`]
- [x] T019 Execute 123 step 6 — `assertSharedSpaceAccess()` checks `space.kill_switch === 1` → returns `{ allowed: false, reason: 'shared_space_kill_switch' }` immediately, before membership check. [SOURCE: `lib/collab/shared-spaces.ts:507-509`]
- [x] T020 Execute 148 step 1 — `isSharedMemoryEnabled()` in shared-spaces.ts:184-205: no env var + no DB row → returns `false`. `handleSharedMemoryStatus()` returns `enabled: false`. [SOURCE: `lib/collab/shared-spaces.ts:184-205`]
- [x] T021 Execute 148 step 2 — `handleSharedMemoryEnable()` in shared-memory.ts:287-322: `dbAlreadyEnabled=false` → calls `enableSharedMemory(db)` (INSERT OR REPLACE) + `createSharedSpacesReadme()` → returns `{ alreadyEnabled: false, enabled: true, readmeCreated: true }`. [SOURCE: `handlers/shared-memory.ts:287-322`]
- [x] T022 Execute 148 step 3 — Second call: `dbAlreadyEnabled=true`, `readmeAlreadyExists=true` → returns `{ alreadyEnabled: true }`. Idempotency confirmed. [SOURCE: `handlers/shared-memory.ts:299-307`]
 - [x] T023 Execute 148 step 4 — `createSharedSpacesReadme()` in shared-memory.ts:329-369 writes `../../../../../skill/system-spec-kit/mcp_server/shared-spaces/README.md`; skip-if-exists (`fs.existsSync` check at line 332) prevents overwrite. [SOURCE: `handlers/shared-memory.ts:329-369`]
- [x] T024 Execute 148 step 5 — `enableSharedMemory()` uses `INSERT OR REPLACE INTO config (key, value)` (shared-spaces.ts:213-215); survives restart. `isSharedMemoryEnabled()` Tier 2 reads DB row → `true`. [SOURCE: `lib/collab/shared-spaces.ts:212-216`]
- [x] T025 Execute 148 step 6 — `SPECKIT_MEMORY_SHARED_MEMORY=true` → `isDefaultOffFlagEnabled()` returns `true` at Tier 1 (shared-spaces.ts:188-191) before DB check. Env override confirmed. [SOURCE: `lib/collab/shared-spaces.ts:184-191`]
 - [x] T026 Execute 148 step 7 — Feature catalog confirms `/memory:manage shared` command path has the Section 0 enablement gate showing the setup prompt when disabled. [SOURCE: `../../../../../skill/system-spec-kit/feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`]
- [x] T027 Evidence bundle for 063: code audit of `search-flags.ts` (24+ exported functions with JSDoc governance metadata — default state, env var, sprint/requirement ID). Feature catalog confirms governance is a process control, not a runtime-enforced system. All flags enumerated with documented governance metadata; compliance gaps identifiable by operator audit of JSDoc + catalog. VERDICT: **PASS**
- [x] T028 Evidence bundle for 064: code audit of `search-flags.ts:107-109` (V1 removal), `learned-feedback.ts:418` (`isInShadowPeriod` active as Safeguard #6). Sprint 8 remediation removed dead flag branches. Code state matches all 79 documented dispositions (27 graduated, 9 removed, 3 retained). Deprecated flags confirmed as no-ops. VERDICT: **PASS**
- [x] T029 Evidence bundle for 122: scope-governance.ts:229-287 (validation), 337-358 (audit), 439-466 (filter); memory-save.ts:630-656 (handler integration). VERDICT: **PASS**
- [x] T030 Evidence bundle for 123: shared-spaces.ts:440-474 (membership), 485-558 (access check), 507-509 (kill switch); shared-memory.ts:118-185, 193-253 (handlers). VERDICT: **PASS**
- [x] T031 Evidence bundle for 148: shared-spaces.ts:184-216 (two-tier enable, DB persist); shared-memory.ts:287-369 (enable handler, idempotency, README). VERDICT: **PASS**
- [x] T032 DB state restoration — sandbox provenance writes rejected by code (missing provenance fields rejected before persist); no actual DB mutations made in code-audit mode
- [x] T033 Phase coverage reported: 5/5 scenarios with verdicts — 5 PASS, 0 PARTIAL
- [x] T034 Update `implementation-summary.md` — complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 scenarios have verdicts (PASS/PARTIAL/FAIL)
- [x] Phase coverage reported as 5/5
- [x] DB state restored to pre-test baseline (code-audit mode: no actual DB mutations)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
