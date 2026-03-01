# Executive Brief: System-Spec-Kit Script Audit
**Audit Period:** 2026-02-15  
**Review Source:** 10 independent review-agent artifacts (C01–C10)  
**Overall Status:** PASS WITH REQUIRED CORRECTIONS

---

## 1. Scope

This comprehensive audit assessed 121 scripts, shared utilities, MCP server handlers, root orchestration, memory/indexing, validation scripts, data contracts, error handling, path assumptions, and cross-system alignment across the System-Spec-Kit codebase.

**Coverage:**
- **10 audit shards** with independent context analysis and build verification
- **175+ inspection points** across 14 core modules
- **85+ findings** identified, cross-validated, and severity-adjusted
- **Reliability range:** 72–90/100 across shards (acceptable to excellent)

---

## 2. Key Confirmed Risks

### Critical Data Integrity & Safety Risks

1. **DB marker path contract silently diverges** (C05-P0)  
   Memory indexer and MCP server resolve `.db-updated` marker via different paths. When `SPEC_KIT_DB_DIR` is set, writer and reader target different files—stale data served indefinitely.  
   *Impact:* Silent data staleness with no user notification.

2. **Null DB returns `true` allowing unsafe operations** (C08-P0)  
   `session-manager.ts:314` allows `shouldSendMemory` to proceed when database is null, disabling deduplication silently.  
   *Impact:* Duplicate memories, potential data corruption without observability.

3. **Swallowed errors in cleanup operations** (C08-P0)  
   Empty catch blocks in `cleanup-orphaned-vectors.ts:164,183-185` hide cleanup failures.  
   *Impact:* Data integrity unknown; orphaned vectors accumulate.

4. **UPDATE matching 0 rows reports false success** (C08-P0)  
   `memory-save.ts:253` warns but doesn't fail when PE reinforcement updates 0 rows.  
   *Impact:* FSRS tracking broken; caller believes operation succeeded.

### Validation & Contract Enforcement Gaps

5. **Zero-file anchor validation false pass** (C06-P1)  
   `check-anchors.sh:28` scopes validation exclusively to `memory/*.md`; broken anchors in `spec.md`, `plan.md`, `decision-record.md` pass silently.  
   *Impact:* Broken anchors ship undetected.

6. **IVectorStore interface signature divergence** (C07-P1)  
   Canonical interface (`shared/types.ts:244-251`) declares `search(embedding: number[], options?)` but runtime class uses `search(_embedding, _topK, _options?)`. Type mismatches on `upsert`, `get`, `close` parameters.  
   *Impact:* Compile-time invisible mismatches cause runtime failures.

### Operational & Observability Risks

7. **Unknown-tool dispatch diagnostics are generic** (C03-P1)  
   `context-server.ts:139-142` dispatches to unknown tools throw generic error code `E040` (semantically wrong for dispatch miss); no `requested_tool` or `available_tools` metadata.  
   *Impact:* Automated monitoring misled; manual triage required.

8. **Embedding readiness race on cold start** (C03-P1)  
   `context-server.ts:473-478` marks embedding ready immediately in lazy mode without actual model probe.  
   *Impact:* First embedding-dependent calls may hit uninitialized model.

9. **Startup remediation references non-existent script** (C03-P1)  
   `startup-checks.ts:37-38` hardcodes `scripts/setup/rebuild-native-modules.sh` which does not exist.  
   *Impact:* Users hitting native module mismatch get dead-end remediation.

10. **Save-then-query not guaranteed** (C05-P1)  
    `memory-save.ts:816-817` returns `status = 'deferred'` when embedding fails; `memory-index.ts:240` rate-limits scans to 60s cooldown.  
    *Impact:* Freshly saved memory invisible to vector search for ≥60s.

---

## 3. Exclusions

The following were **out of scope** or **unverified**:

- **Handler-level deep internals:** ~15-20 MCP handler calls not individually audited (C03 coverage gap)
- **Path-security shared module:** Mentioned in barrel export but no dedicated finding or explicit exclusion (C02-P2)
- **Cross-platform path claims:** Windows/macOS symlink and path assumptions noted but not runtime-tested (C09—theoretical only)
- **Timing-based side channels:** No coverage of timing attacks in search/session deserialization (C07 gap)
- **Performance benchmarking:** No profiling or load testing; timeout/retry findings are design-level only

---

## 4. Immediate Next 5 Fixes

**Priority-ordered by impact and fix effort:**

1. **Fix null-DB-returns-true in `shouldSendMemory`** (C08-F008)  
   *File:* `session-manager.ts:314`  
   *Action:* Change `return true` → `return false` or throw when DB is null.  
   *Effort:* 10 minutes | *Impact:* Prevents silent deduplication bypass and duplicate memory creation.

2. **Unify DB marker path resolution** (C05-P0)  
   *File:* `memory-indexer.ts:19`  
   *Action:* Replace hardcoded `__dirname`-relative path with canonical `DATABASE_DIR` from `config.ts`.  
   *Effort:* 15 minutes | *Impact:* Eliminates stale data serving when `SPEC_KIT_DB_DIR` is set.

3. **Fix swallowed cleanup errors and add metrics** (C08-F001 + C08-F003)  
   *Files:* `cleanup-orphaned-vectors.ts:164,183-185`, `memory-indexer.ts:32,89,146`  
   *Action:* Replace empty catch blocks with structured error aggregation; add degraded-operation counters.  
   *Effort:* 2 hours | *Impact:* Makes operational health observable; fixes 8 findings at once.

4. **Fix UPDATE-0-rows false success in PE reinforcement** (C08-F010)  
   *File:* `memory-save.ts:253`  
   *Action:* Check `changes === 0` and return error result instead of success.  
   *Effort:* 20 minutes | *Impact:* FSRS tracking reliability restored.

5. **Expand anchor validation scope beyond `memory/*.md`** (C06-P2)  
   *File:* `check-anchors.sh:28`  
   *Action:* Validate anchor format in all `*.md` files (excluding `scratch/`), not just `memory/*.md`.  
   *Effort:* 30 minutes | *Impact:* Catches broken anchors in spec/plan/decision-record files.

---

**Next Steps:** Address these 5 fixes in sequence. Total estimated effort: 3.5 hours. Fixes 1–4 resolve P0 data-integrity risks; fix 5 closes highest-severity validation gap.
