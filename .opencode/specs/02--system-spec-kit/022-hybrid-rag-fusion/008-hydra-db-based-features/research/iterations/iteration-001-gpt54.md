# Iteration 1 (GPT-5.4): Capability Flags + Shared Spaces Audit

## Focus
Audit capability-flags.ts (rollout control, phase gating) and shared-spaces.ts (shared-space policy, conflict handling) for bugs, dead code, architecture issues, and refinement opportunities.

## Findings

### capability-flags.ts

1. **Bug: Invalid canonical phase suppresses valid legacy fallback** — At capability-flags.ts:98, the code picks `SPECKIT_MEMORY_ROADMAP_PHASE` before validating it. If that value is unsupported but a valid legacy phase is set via `SPECKIT_HYDRA_PHASE` (line 36), lines 98-102 fall back to `shared-rollout` instead of honoring the legacy env var. Tests only cover the separate cases at memory-roadmap-flags.vitest.ts:89 and :99.
   — SOURCE: capability-flags.ts:98-102

2. **Dead code: `isMemoryRoadmapCapabilityEnabled` exported but unused at runtime** — Exported at capability-flags.ts:149 but repo search shows no runtime callers; only its own definition/export appears. Dead public surface.
   — SOURCE: capability-flags.ts:149

3. **Dead code: `CAPABILITY_ENV` test-only export** — At capability-flags.ts:41, only imported by tests at memory-roadmap-flags.vitest.ts:2, never by runtime code.
   — SOURCE: capability-flags.ts:41

4. **Architecture: Defaults snapshot rollout-sampled without identity** — capability-flags.ts:79 fabricates `memory-roadmap:<flag>` identities. Production callers invoke `getMemoryRoadmapDefaults()` with no identity (retrieval-telemetry.ts:178, memory-state-baseline.ts:182). Under partial rollout, telemetry reports arbitrary hash-bucketed states rather than actual defaults.
   — SOURCE: capability-flags.ts:79; retrieval-telemetry.ts:178; memory-state-baseline.ts:182

5. **Refinement: Type/array truth duplication** — `MemoryRoadmapPhase` type (line 10) and `SUPPORTED_PHASES` array (line 59) duplicate the same source of truth. Deriving the type from a single `as const` array would remove drift risk.
   — SOURCE: capability-flags.ts:10, 59

6. **Test gap: No "invalid canonical + valid legacy" test** — The risky compatibility path is untested. Tests at memory-roadmap-flags.vitest.ts:89 and :99 cover separate cases only.
   — SOURCE: memory-roadmap-flags.vitest.ts:89, 99

7. **Test gap: No no-identity rollout test** — Runtime callers use getMemoryRoadmapDefaults() without identity but tests only exercise identity-supplied path at memory-roadmap-flags.vitest.ts:76.
   — SOURCE: memory-roadmap-flags.vitest.ts:76

8. **Test gap: Docs test misses canonical vars** — feature-flag-reference-docs.vitest.ts:88 only asserts legacy Hydra docs text, not canonical `SPECKIT_MEMORY_*` roadmap vars or capability-flags.ts.
   — SOURCE: feature-flag-reference-docs.vitest.ts:88

### shared-spaces.ts

9. **Bug: Env disable doesn't override persisted DB enable** — shared-spaces.ts:170 only returns early on env `true`; env `false` falls through to DB read at lines 176-180 and can come back `true`, contradicting the "Tier 1 override" contract in the docstring. Tests only cover positive override at shared-spaces.vitest.ts:575.
   — SOURCE: shared-spaces.ts:170-180

10. **Bug: `getAllowedSharedSpaceIds` bypasses global disable** — shared-spaces.ts:423 never checks `isSharedMemoryEnabled`, while `assertSharedSpaceAccess()` does (line 475). Direct callers in stage1-candidate-gen.ts:510 and retention.ts:41 can use shared-space allowlists even after the feature is globally disabled.
    — SOURCE: shared-spaces.ts:423, 475; stage1-candidate-gen.ts:510; retention.ts:41

11. **Bug: Conflict escalation race condition** — shared-spaces.ts:127 counts prior conflicts, then :560 inserts a new one in a separate statement without a transaction. Two concurrent writers can both see `priorConflictCount = 0` and both choose `append_version`, defeating escalation to `manual_merge`.
    — SOURCE: shared-spaces.ts:127, 560

12. **Architecture: Policy split across inconsistent entry points** — `getAllowedSharedSpaceIds()` (line 423) allows discovery without tenant guardrail, while `assertSharedSpaceAccess()` (line 497) denies access when no tenant is present. Tests enumerate spaces with only user/agent id at shared-spaces.vitest.ts:52, :170, :198.
    — SOURCE: shared-spaces.ts:423, 497

13. **Architecture: No FK integrity on shared-space tables** — `upsertSharedMembership()` (line 405) and `recordSharedConflict()` (line 547) insert rows blindly. Schema at vector-index-schema.ts:1134 and :1146 defines no foreign keys. Typos in `spaceId` become silent orphaned data.
    — SOURCE: shared-spaces.ts:405, 547; vector-index-schema.ts:1134, 1146

14. **Architecture: Conflict write + audit not atomic** — shared-spaces.ts:560 inserts conflict row, then :574 separately writes audit event. Failure between them leaves inconsistent state.
    — SOURCE: shared-spaces.ts:560, 574

15. **Refinement: rolloutCohort not normalized** — Lines 393, 227, 309 allow `'pilot-a'` and `' pilot-a '` to behave like different cohorts.
    — SOURCE: shared-spaces.ts:393, 227, 309

16. **Refinement: Conflict strategy unvalidated** — Lines 81, 117 accept arbitrary `metadata.strategy` values, creating meaningless summary buckets at line 345.
    — SOURCE: shared-spaces.ts:81, 117, 345

17. **Test gap: No env=false precedence test** — Only env=true asserted at shared-spaces.vitest.ts:575.
    — SOURCE: shared-spaces.vitest.ts:575

18. **Test gap: No disabled-feature bypass test for getAllowedSharedSpaceIds** — Suite focuses on assertSharedSpaceAccess positive cases.
    — SOURCE: shared-spaces.vitest.ts

19. **Test gap: No concurrency test for conflict escalation** — shared-spaces.vitest.ts:292 tests escalation serially only.
    — SOURCE: shared-spaces.vitest.ts:292

20. **Test gap: No negative test for nonexistent spaceId** — No test for orphan membership/conflict writes with invalid spaceId.
    — SOURCE: shared-spaces.vitest.ts

## Sources Consulted
- capability-flags.ts (full file)
- shared-spaces.ts (full file, 760 lines)
- shared-spaces.vitest.ts (680 lines)
- feature-flag-reference-docs.vitest.ts
- memory-roadmap-flags.vitest.ts
- rollout-policy.ts
- scope-governance.ts (cross-reference)
- vector-index-schema.ts (FK definitions)
- memory-save.ts, stage1-candidate-gen.ts, retention.ts (caller sites)
- retrieval-telemetry.ts, memory-state-baseline.ts (production callers)

## Assessment
- New information ratio: 0.95 — First audit of these modules; all findings novel
- Questions addressed: Q1 (bugs), Q2 (capability flags refinement), Q4 (architecture/code quality)

## Recommended Next Focus
- Handler integration layer (handlers/shared-memory.ts) for duplicate interface definitions
- Retention sweep transaction boundaries
- Test coverage for the env=false disable path
