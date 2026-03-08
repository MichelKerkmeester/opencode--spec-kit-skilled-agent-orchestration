# Cross-AI Review Report: 009-extra-features (Sprint 9)

**Date**: 2026-03-06
**Reviewed by**: 8 AI agents across 3 CLI tools (3 Gemini, 3 Copilot, 2 Codex)
**Models used**: gemini-3.1-pro-preview, gpt-5.1-codex (via Copilot), gpt-5.4 xhigh (via Codex)

---

## Executive Summary

**Overall Health: YELLOW (Conditionally GREEN)**

Implementation is solid — 7 features coded, 7182 automated tests pass, no Critical security findings, and architecture decisions are well-documented. However, the sprint **cannot honestly claim completion** due to:

1. **58 runtime/eval verification items remain open** — automated tests alone do not cover live MCP server behavior, eval baselines, or performance benchmarks
2. **Documentation consistency gaps** — checklist marks items as verified (`[x]`) while tasks.md keeps the corresponding runtime tests open (`[ ]`), creating a false sense of completion
3. **One High-severity security finding** — file watcher trusts event paths without realpath/root containment checks (CWE-59/CWE-22)
4. **Local reranker is effectively dead on macOS/Linux** — `os.freemem()` check falsely reports insufficient memory on healthy machines due to OS disk cache behavior (P1-5 never activates)

The code quality is high but has specific correctness bugs. The path to GREEN is clear: fix the reranker memory check, fix the watcher boundary, run the runtime tests, and align the documentation.

---

## Agent Collection Status

| Agent | CLI | Model | Dimension | Status |
|-------|-----|-------|-----------|--------|
| G1 | Gemini | gemini-3.1-pro-preview | Architecture & Design | Completed — output cleaned up before collection |
| G2 | Gemini | gemini-3.1-pro-preview | Research Synthesis | Completed — output cleaned up before collection |
| G3 | Gemini | gemini-3.1-pro-preview | Integration & Regression | Completed — output cleaned up before collection |
| C1 | Copilot | claude-opus-4.6 | P0 Code Quality | Completed — output cleaned up before collection |
| **C2** | **Copilot** | **gpt-5.1-codex*** | **P1 Code Quality** | **COLLECTED** (16m 26s, deep code exploration) |
| **C3** | **Copilot** | **gpt-5.1-codex*** | **Documentation Quality** | **COLLECTED** |
| **X1** | **Codex** | **gpt-5.4 xhigh** | **Test Coverage Gaps** | **COLLECTED** |
| **X2** | **Codex** | **gpt-5.4 xhigh** | **Security & Robustness** | **COLLECTED** |

*Note: Copilot's `/model claude-opus-4.6` command within `-p` was treated as text, not a model switch. Copilot defaulted to gpt-5.1-codex. Gemini agent outputs were cleaned up by the system before they could be read.*

**4 of 8 agents' reports were successfully collected**, covering: P1 Code Quality, Security, Test Coverage, and Documentation Quality.

---

## Findings by Severity

### HIGH (4 findings)

| # | Finding | Agent | Evidence | Impact |
|---|---------|-------|----------|--------|
| H1 | **File watcher trusts event paths without realpath/root containment** — no symlink defense. A `specs/x/secret.md -> /outside/path` symlink passes `isMarkdownPath()`, gets read and indexed. | X2 | file-watcher.ts:121,138,177; CWE-59, CWE-22 | External files could be read and indexed via symlink aliasing |
| H2 | **Tasks/checklist inconsistency creates false completion signal** — CHK-020 through CHK-087 marked `[x]` while T012-T081 remain `[ ]` open. Readers assume verification is finished. | C3 | tasks.md:87-184; checklist.md:62-141 | Erodes audit confidence; masking untested runtime paths |
| H3 | **Most dangerous runtime gaps to skip**: T054 (crash recovery), T055 (100-file batch), T077 (live watcher reindex), T093-T095 (reranker gate/fallback/memory), T098 (reranker memory leak), T119-T122 (eval ablation baseline) | X1 | tasks.md:169-170,205,224-228 | These gaps represent real failure modes that automated unit tests cannot catch |
| H4 | **Local reranker never activates on macOS/Linux under default settings** — `os.freemem() < 4GB` guard blocks even on healthy 32GB machines because these OSes reserve RAM for disk cache, so `freemem()` almost always reports <4GB. Feature is effectively dead unless user sets custom model path (which skips the check). | C2 | local-reranker.ts:171-193 | P1-5 feature is non-functional on target platforms; rollout data unusable |

### MEDIUM (7 findings)

| # | Finding | Agent | Evidence | Impact |
|---|---------|-------|----------|--------|
| M1 | **Ingestion and watcher paths are unbounded** — no max paths count, no file-size gate, no cap on accumulated errors_json. `hashFileContent()` reads whole files into memory. | X2 | tool-input-schemas.ts:298; memory-ingest.ts:62; job-queue.ts:206,309; CWE-400 | Resource exhaustion via oversized files or large ingest requests |
| M2 | **Reranker lacks hard workload limits** — no timeout/abort, prompt size unbounded (query + document text), only coarse free-memory threshold | X2 | local-reranker.ts:61,171,229; CWE-400 | Large candidates can stall or exhaust local inference |
| M3 | **Implementation summary claims "T001-T092 complete"** but T012-T098 testing subset is open, creating numbering confusion | C3 | implementation-summary.md:34-37; tasks.md:87-101 | Misleading status reporting |
| M4 | **Watcher <5s benchmark may not hold** under SQLITE_BUSY — 1s write stability + 2s debounce + retries can exceed 10s | X1 | file-watcher.ts:21,191 | Performance threshold may be unrealistic under contention |
| M5 | **Contextual header injection can stall search requests** — `buildDescriptionTailMap()` triggers synchronous cache regeneration (`generateFolderDescriptions`) on the hot path when cache is stale (>60s). Full filesystem crawl mid-query blocks the user thread and scales poorly. | C2 | hybrid-search.ts:1203-1233; folder-discovery.ts:413-447,586-615 | Search latency spikes as spec folder count grows |
| M6 | **Dynamic instructions hard-code channel names regardless of runtime state** — `buildServerInstructions()` prints `"vector, fts5, bm25, graph, degree"` even when graph/docscore/summaries modules are disabled. Operators believe capabilities are live when they're not. | C2 | context-server.ts:224-236,838-845 | Misleading operational telemetry; undermines "dynamic init" requirement |
| M7 | **Feature flag rollout inconsistency** — `isFileWatcherEnabled()` and `isLocalRerankerEnabled()` bypass the `isFeatureEnabled()`/`SPECKIT_ROLLOUT_PERCENT` policy entirely. When "enable everything" is set, these two flags ignore percentage rollouts and identity bucketing. | C2 | search-flags.ts:190-205; local-reranker.ts:171-207 | Cross-feature experiments brittle; unvetted code paths exposed to all tenants |

### LOW (3 findings)

| # | Finding | Agent | Evidence | Impact |
|---|---------|-------|----------|--------|
| L1 | **`.strict()` is not a complete injection defense** — only blocks unknown top-level keys, doesn't validate path semantics, allowed roots, symlink status. `SPECKIT_STRICT_SCHEMAS=false` bypasses all schemas. | X2 | tool-input-schemas.ts:13,126,298; CWE-20 | Schema validation is structural, not semantic |
| L2 | **Error handling leaks internal paths** — `memory_ingest_status` returns raw paths, watcher/reranker log full file/model paths, uncaught exceptions expose stack traces | X2 | memory-ingest.ts:44; file-watcher.ts:156; local-reranker.ts:244; CWE-209, CWE-532 | Information leakage in stdio MCP server where stderr is visible to host |
| L3 | **No explicit REQ→task/checklist mapping table** — requirement traceability must be inferred rather than explicitly documented | C3 | spec.md:152-169; tasks.md:38-210 | Auditors cannot follow requirement coverage without inference |

---

## Cross-AI Agreement Analysis

| Finding | X1 (GPT-5.4) | X2 (GPT-5.4) | C2 (GPT-5.1) | C3 (GPT-5.1) | Consensus |
|---------|:---:|:---:|:---:|:---:|-----------|
| Watcher symlink/boundary risk | Noted T077-T081 as high-risk gaps | **Primary finding** (H1) | — | — | HIGH CONFIDENCE (2/4) |
| Tasks/checklist inconsistency | Noted checklist overclaiming | — | — | **Primary finding** (H2) | HIGH CONFIDENCE (2/4) |
| Resource exhaustion (CWE-400) | Noted reranker <500ms may not hold | **Primary findings** (M1, M2) | Aligned (reranker workload) | — | HIGH CONFIDENCE (3/4) |
| Runtime test gaps critical | **Primary finding** (H3) | Aligned (watcher/reranker) | — | Aligned (T012-T081 open) | HIGH CONFIDENCE (3/4) |
| Reranker `freemem()` broken on macOS/Linux | — | — | **Primary finding** (H4) | — | Single agent — HIGH IMPACT |
| Search hot-path stall (cache regen) | — | — | **Primary finding** (M5) | — | Single agent — VERIFY |
| Dynamic init channel misreporting | — | — | **Primary finding** (M6) | — | Single agent — VERIFY |
| Feature flag rollout inconsistency | — | — | **Primary finding** (M7) | — | Single agent — VERIFY |
| Documentation status confusion | — | — | — | **Primary finding** (M3) | Single agent — VERIFY |
| SQL injection safety | — | **Confirmed SAFE** | — | — | CONFIRMED (no finding) |
| Feature flag rollback safety | — | **Confirmed SAFE** | Aligned (restart-based) | — | CONFIRMED (no finding) |

**Cross-AI validation insight**: All 4 collected agents independently identified runtime verification gaps as the primary risk. C2 found the most impactful code-level bug (H4: reranker `freemem()` broken on macOS/Linux) — a feature that's effectively dead on target platforms. The security agent found no Critical vulnerabilities. C2's hot-path stall and channel misreporting findings (M5, M6) should be verified but are architecturally plausible.

---

## Minimum Viable Test Plan (from X1)

Priority order for derisking the 58 open items (~3-4 hours):

1. **Ingestion E2E** (T051-T055): 10-file happy path, progress polling, cancel mid-run, restart recovery, 100-file batch
2. **Watcher E2E** (T077-T081): Watcher on/off, .md change reindexed, non-.md ignored, debounce verification
3. **Reranker gate suite** (T093-T098): Model present/missing, forced low-memory, 50 sequential warm runs, latency logging
4. **Eval ablation baseline** (T119-T122): Run `eval_run_ablation` now as baseline, rerun after Sprint 9 features toggled
5. **Tool contract sweep** (T012-T014): All 24 tools with valid + unknown-key payloads
6. **Envelope contract test** (T029-T031): `includeTrace=false` byte-stable, `includeTrace=true` enriched, score match
7. **Startup handshake test** (T038-T039): Boot server, capture instructions, repeat with `SPECKIT_DYNAMIC_INIT=false`

**Shortest path to confidence**: Do steps 1, 2, 3, and 4 first.

---

## Top Security Recommendations (from X2)

1. **Harden the watcher boundary**: Add `followSymlinks: false` explicitly, `realpath()` every event target, reject paths outside configured watch roots before hashing/reindexing/removal
2. **Add hard resource budgets**: Cap `memory_ingest_start.paths` count, per-path length, max file size, max stored errors per job, reranker query/document bytes, reranker wall-clock timeout
3. **Sanitize outward-facing errors**: Don't return full path lists or raw exception messages; redact absolute paths/model paths; prefer opaque error codes + recovery hints

---

## Top Code Quality Recommendations (from C2)

1. **Fix reranker memory check**: Replace `os.freemem() < 4GB` with a more accurate signal (e.g., `os.totalmem() - os.freemem()` against a configurable ceiling, or wrap model load in try/catch) so the feature works on macOS/Linux
2. **Move description-cache regeneration off search hot path**: Build tail map from pre-loaded cache, refresh asynchronously or on startup, fail open when stale instead of triggering full filesystem crawl mid-query
3. **Route all P1 feature flags through `isFeatureEnabled()`**: Ensure `SPECKIT_FILE_WATCHER` and `RERANKER_LOCAL` honor rollout percentages and identity bucketing like all other flags

---

## Top Documentation Recommendations (from C3)

1. **Align checklist with tasks**: Either mark corresponding CHK items as open or mark tasks complete with evidence after actual runtime verification
2. **Fix implementation summary wording**: Avoid "T001-T092 complete" blanket claim until the testing subset (T012-T098) is actually closed
3. **Add REQ→task/checklist mapping table**: Enable explicit traceability from requirements to verification evidence

---

## Positive Findings (What's Working Well)

- **SQLite safety is solid**: All user-influenced values use parameterized `?` bindings (no injection risk)
- **Feature flag design is mostly sound**: 6 independent flags with conservative defaults, restart-based rollback is safe (though C2 found rollout policy bypass for 2 flags)
- **No command injection risk**: `local-reranker.ts` uses library API calls (node-llama-cpp), not shell exec
- **Architecture decisions well-documented**: 5 ADRs with alternatives considered and trade-offs explicit
- **7182 automated tests pass**: Strong unit/integration coverage at the code level
- **Research provenance exceptional**: 16 research documents from 6 cross-AI agents with meta-synthesis

---

## Gaps Due to Lost Agent Outputs

The following review dimensions were covered by agents that completed but whose outputs were cleaned up before collection:

| Dimension | Agent | Recommendation |
|-----------|-------|----------------|
| Architecture & Design Decisions | G1 (Gemini) | Re-run if ADR quality verification is needed |
| Research Synthesis Quality | G2 (Gemini) | Re-run if research methodology audit is needed |
| Integration & Regression Risk | G3 (Gemini) | Re-run if cross-feature coupling analysis is needed |
| P0 Code Quality (Zod, envelopes, job queue) | C1 (Copilot) | Re-run if deep P0 code review is needed |
| P1 Code Quality (reranker, watcher, init) | C2 (Copilot) | **COLLECTED** — 4 findings (1 High, 3 Medium) |

To re-run lost agents, use `gemini` CLI directly (outputs return inline) or pipe Copilot output to a file: `copilot -p "..." --allow-all-tools 2>&1 | tee /tmp/agent-output.txt`

---

## Conclusion

Sprint 9 is **implementation-complete with strong automated test coverage**, but **verification-incomplete and has specific correctness bugs**. The code is fundamentally sound (no Critical security issues, solid SQL safety) but has 4 High-severity findings that need attention. The path to full completion is:

1. Fix H4 (reranker `freemem()` broken on macOS/Linux) — ~30 min code change
2. Fix H1 (watcher symlink boundary) — ~1 hour code change
3. Fix M5 (search hot-path stall from sync cache regen) — ~1 hour refactor
4. Fix M6 (dynamic init channel misreporting) — ~30 min
5. Fix M7 (route all flags through rollout policy) — ~30 min
6. Run the minimum viable test plan — ~3-4 hours
7. Align documentation (H2, M3, L3) — ~30 minutes
8. Save context via `generate-context.js`

**Estimated effort to GREEN: ~7 hours total.**
