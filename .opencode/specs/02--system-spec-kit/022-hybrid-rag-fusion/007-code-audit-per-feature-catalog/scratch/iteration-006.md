# Iteration 6: Feature Flag Graduation Impact on Audit Validity (Q6)

## Focus
Investigate whether the mass graduation of 22 feature flags from opt-in (OFF) to default-ON during the audit window invalidated audit findings. The graduation commit (09acbe8ce, Mar 21 22:54) landed during active audit work (Mar 16-22), meaning some audit phases may have verified features against pre-graduation code paths that are now fundamentally different.

## Findings

### Finding 1: 22 Flags Graduated in a Single Commit Mid-Audit
Commit 09acbe8ce ("graduate all Wave 1-4 feature flags to default ON", Mar 21 22:54) changed 22 feature flags from opt-in (`=== 'true'`) to default-ON (`isFeatureEnabled()`). This affected 22 implementation files and 18 test files. The audit's final commit was 4a477420d on Mar 22 19:08, meaning the graduation landed roughly 20 hours before audit completion.

[SOURCE: git log 09acbe8ce, .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts]

### Finding 2: Behavioral Semantics Completely Reversed
The `isFeatureEnabled()` function in rollout-policy.ts (line 42-57) treats `undefined` environment variables as ENABLED (returns true when SPECKIT_ROLLOUT_PERCENT >= 100, which is the default). Pre-graduation, each flag function used `process.env.FLAG?.toLowerCase().trim() === 'true'`, meaning undefined = DISABLED. This is a complete inversion of default runtime behavior for all 22 features.

**Pre-graduation**: No env var set -> feature OFF (opt-in)
**Post-graduation**: No env var set -> feature ON (opt-out)

This means any audit phase that verified a feature's behavior while the flag was opt-in may have verified the WRONG code path (the disabled/fallback path) which is no longer the active production path.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:42-57]

### Finding 3: Graduated Flag Inventory by Domain
All 22 graduated flags and their audit-relevant phases:

**D1 (Scoring/Fusion) -- affects phases 011, 014, 015:**
- SPECKIT_CALIBRATED_OVERLAP_BONUS (REQ-D1-001)
- SPECKIT_RRF_K_EXPERIMENTAL (REQ-D1-003)
- SPECKIT_LEARNED_STAGE2_COMBINER (REQ-D1-006)

**D2 (Query Intelligence) -- affects phase 012:**
- SPECKIT_QUERY_DECOMPOSITION (REQ-D2-001)
- SPECKIT_GRAPH_CONCEPT_ROUTING (REQ-D2-002)
- SPECKIT_LLM_REFORMULATION (REQ-D2-003)
- SPECKIT_HYDE (REQ-D2-004)
- SPECKIT_QUERY_SURROGATES (REQ-D2-005)

**D3 (Graph Lifecycle) -- affects phase 010:**
- SPECKIT_TYPED_TRAVERSAL (D3 Phase A)
- SPECKIT_GRAPH_REFRESH_MODE (off -> write_local) (REQ-D3-003)
- SPECKIT_LLM_GRAPH_BACKFILL (REQ-D3-004)
- SPECKIT_GRAPH_CALIBRATION_PROFILE (REQ-D3-005/006)

**D4 (Feedback/Quality) -- affects phases 008, 009, 013:**
- SPECKIT_IMPLICIT_FEEDBACK_LOG (REQ-D4-001)
- SPECKIT_HYBRID_DECAY_POLICY (REQ-D4-002)
- SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS (REQ-D4-003)
- SPECKIT_BATCH_LEARNED_FEEDBACK (REQ-D4-004)
- SPECKIT_ASSISTIVE_RECONSOLIDATION (REQ-D4-005)
- SPECKIT_SHADOW_FEEDBACK (REQ-D4-006)

**D5 (UX/Disclosure) -- affects phase 018:**
- SPECKIT_EMPTY_RESULT_RECOVERY_V1 (REQ-D5-001)
- SPECKIT_RESULT_CONFIDENCE_V1 (REQ-D5-004)
- SPECKIT_RESULT_EXPLAIN_V1 (REQ-D5-002)
- SPECKIT_RESPONSE_PROFILE_V1 (REQ-D5-003)
- SPECKIT_PROGRESSIVE_DISCLOSURE_V1 (REQ-D5-005)
- SPECKIT_SESSION_RETRIEVAL_STATE_V1 (REQ-D5-006)

[SOURCE: git show 09acbe8ce commit message, search-flags.ts diff]

### Finding 4: Phase 020 Only Covers 7 Flags -- 33+ Flags Unaudited as Flags
The audit's Phase 020 ("Feature Flag Reference") audited only 7 features with a result of 6 MATCH / 1 PARTIAL. But search-flags.ts contains 40+ flag functions. The remaining 33+ flags were audited only as features within their respective domain phases (010-018), NOT as flag governance objects. This means:
- Whether each flag's default matches its JSDoc was NOT systematically verified for all flags
- Whether each flag's env var name matches across search-flags.ts and its consuming module was NOT systematically verified
- Whether graduated flags' tests were updated to reflect new defaults was verified in the graduation commit but NOT in the audit

[SOURCE: spec.md Phase 020 row: "Complete (6M/1P)", search-flags.ts containing 40+ functions]

### Finding 5: 13 Pre-Existing Flags Were Already Default-ON Before Audit
Not all flags in search-flags.ts were graduated. 13 flags were already default-ON before the audit window (these use `isFeatureEnabled()` in both old and new code):
- SPECKIT_MMR, SPECKIT_TRM, SPECKIT_MULTI_QUERY, SPECKIT_CROSS_ENCODER
- SPECKIT_SEARCH_FALLBACK, SPECKIT_FOLDER_DISCOVERY
- SPECKIT_DOCSCORE_AGGREGATION, SPECKIT_SAVE_QUALITY_GATE
- SPECKIT_NEGATIVE_FEEDBACK, SPECKIT_EMBEDDING_EXPANSION
- SPECKIT_CONSOLIDATION, SPECKIT_ENCODING_INTENT
- SPECKIT_GRAPH_SIGNALS, SPECKIT_COMMUNITY_DETECTION, SPECKIT_MEMORY_SUMMARIES, SPECKIT_AUTO_ENTITIES, SPECKIT_ENTITY_LINKING, SPECKIT_DEGREE_BOOST, SPECKIT_CONTEXT_HEADERS

These flags' audit findings are NOT affected by the graduation event.

[SOURCE: search-flags.ts -- these functions already called isFeatureEnabled() in the pre-graduation codebase]

### Finding 6: 4 Flags Remain Opt-In (OFF by default) -- Potentially Under-Tested
Four flags still use explicit opt-in patterns (not `isFeatureEnabled()`):
- SPECKIT_RECONSOLIDATION (line 94): `=== 'true'` -- opt-in only
- SPECKIT_FILE_WATCHER (line 225): double-gate (explicit `=== 'true'` + rollout)
- RERANKER_LOCAL (line 234): double-gate (explicit `=== 'true'` + rollout)
- SPECKIT_QUALITY_LOOP (line 244): `=== 'true'` -- opt-in only

These features were OFF during the audit AND remain OFF now. Their code paths may have been audited only via catalog description (not runtime behavior). If the audit verified them as MATCH against catalog descriptions that say "opt-in", the MATCH is accurate for documentation but untested for runtime behavior.

[SOURCE: search-flags.ts:94, 225, 234, 244]

### Finding 7: Risk Assessment -- Which Audit Phases Are Invalidated?
The graduation commit (Mar 21 22:54) preceded the final audit commit (Mar 22 19:08). However, the key question is: were individual phase audits conducted BEFORE or AFTER graduation? The git history shows:
- 757eee38a (Mar 21 15:00) -- pipeline refactoring during audit (BEFORE graduation)
- 09acbe8ce (Mar 21 22:54) -- graduation commit
- 4a477420d (Mar 22 19:08) -- final audit commit completing all 21 phases

Since the final audit commit is a SINGLE commit completing all 21 phases at once, and it post-dates graduation, the audit LIKELY ran against post-graduation code. However, this is ambiguous -- if the audit was accumulated over multiple days (as evidenced by earlier audit commits on Mar 16-21), some phase findings may have been written against pre-graduation code and merely COMMITTED in the final batch.

The spec.md explicitly identifies this risk (R-003: "Source code changes during audit") with mitigation "Pin to specific commit SHA" -- but the audit used "Current HEAD on main branch at 2026-03-22" rather than a pinned SHA, meaning it accepted a MOVING baseline.

[SOURCE: spec.md section 6 (R-003), git log dates for audit commits]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` (full file, 498 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` (full file, 64 lines)
- `git show 09acbe8ce` (graduation commit diff + stat)
- `git log` for audit window commits (Mar 16-23)
- `spec.md` for audit phase structure and risk matrix

## Assessment
- New information ratio: 0.85
- Questions addressed: Q6 (feature flag graduation impact)
- Questions answered: Q6 -- substantially answered

## Reflection
- What worked and why: Reading the actual rollout-policy.ts implementation was critical -- it revealed that `isFeatureEnabled()` treats undefined env vars as ENABLED (with default 100% rollout), which is the behavioral inversion that makes the graduation significant. Without reading the implementation, the graduation might look like a simple comment change.
- What did not work and why: N/A -- the approach was well-matched to the question. Direct source code reading + git diff analysis gave definitive answers.
- What I would do differently: Could have also checked whether any of the 22 consuming implementation files (listed in the graduation commit stat) have behavioral differences in their flag-ON vs flag-OFF paths. This would quantify the practical impact beyond just "the default changed."

## Recommended Next Focus
Q8 (quantitative per-phase risk model) -- With Q1-Q6 now substantially answered, synthesizing all gap dimensions (unreferenced files, PARTIAL error rate, temporal churn, cross-cutting blind spots, flag graduation) into a per-phase risk score would provide the most actionable output. Q7 (PARTIAL re-verification) could be folded into Q8 as a severity multiplier.
