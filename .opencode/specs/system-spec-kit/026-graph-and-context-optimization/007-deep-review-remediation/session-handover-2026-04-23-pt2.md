---
title: "Session Handover — 2026-04-23 pt.2 — Code-Graph Stale-Gate Fix + Defense-in-Depth Dedup"
description: "Continuation handover for a fresh Claude session after packets 012/002 and 012/003 shipped. Covers deep-research findings, two remediation packets, live verification across Claude Code + Copilot CLIs, and one pending operator action."
trigger_phrases:
  - "session handover 2026-04-23 pt2"
  - "code graph 33 file regression fix"
  - "packet 012 002 003"
  - "cross-file dedup defense"
---

# Session Handover — 2026-04-23 pt.2

> Continuation of `session-handover-2026-04-23.md`. That doc noted a pending operator-driven rescan; this session investigated why that rescan returned 33 files, root-caused two P0 bugs in the code-graph indexer, shipped two remediation packets, and verified the fix end-to-end via Claude Code CLI + Copilot CLI.

---

## 1. WHAT THIS SESSION SHIPPED

| Artifact | Title | Status | Highlights |
|---|---|---|---|
| **Deep research pt-04** | Code Graph Scan Scope Anomaly (33 vs 1425 files) | ✅ complete | 5 iterations via cli-codex (gpt-5.4 / high / fast); ~500K tokens; research.md 494 lines with file:line citations; newInfoRatio trajectory 0.88 → 0.62 → 0.41 → 0.34 → 0.18 |
| **Packet 012/002** | Incremental Fullscan Recovery | ✅ shipped | `IndexFilesOptions { skipFreshFiles }` default true; scan handler passes `{skipFreshFiles: effectiveIncremental}`; response payload adds `fullScanRequested` + `effectiveIncremental`; validate.sh --strict 0/0; 30/30 focused tests |
| **Packet 012/003** | Cross-File Dedup Defense | ✅ shipped | Layer 1: `globalSeenIds` sweep across all file results in `indexFiles()`; Layer 2: `INSERT OR IGNORE` in `replaceNodes()`; validate.sh --strict 0/0; 33/33 focused tests (+3 Layer 1 cases, +2 Layer 2 DB cases) |
| **DB VACUUM** | Reclaim stale pages from pre-fix scans | ✅ done | 451 MB → 22 MB main DB; 79 MB → 0 B WAL via `PRAGMA wal_checkpoint(TRUNCATE)`; integrity_check ok; 1,397 files / 31,655 nodes / 21,856 edges preserved |
| **Memory continuity** | Packet 012 `_memory.continuity` refresh | ✅ updated | Flipped `next_safe_action` to point at 012/002 then 012/003; added blockers + deep_research pointer |

All work is in the working tree. **NOT committed, NOT pushed** (per CLAUDE.md rule).

---

## 2. LIVE VERIFICATION RESULTS (cross-CLI)

Fresh `claude` and `copilot` CLI sessions were spawned (new MCP connections → fresh dist load). Both returned **7/8 PASS**:

| AC | Expected | Claude Code CLI | Copilot CLI |
|---|---|---|---|
| AC-1 filesScanned | ~1396 | 1,426 ✅ | 1,426 ✅ |
| AC-2 filesIndexed | ≥1390 | 1,426 (100%) ✅ | 1,426 (100%) ✅ |
| AC-3 errors length | 0 | 10 partial-parse ⚠️ | 10 partial-parse ⚠️ |
| AC-4 fullScanRequested | true | true ✅ | true ✅ |
| AC-5 effectiveIncremental | false | false ✅ | false ✅ |
| AC-6 z_future rows | 0 | 0 ✅ | 0 ✅ |
| AC-7 files-with-missing-nodes | 0 (was 519) | 0 ✅ | 0 ✅ |
| AC-8 advisor_status | valid | live / trust_state=live / gen=102 ✅ | live / trust_state=live / gen=101 ✅ |

AC-3 "FAIL" is benign: the errors are now tree-sitter `Tree contains syntax errors (partial parse)` warnings on 10 source files — the files still got INDEXED, they're data-quality warnings, not scan failures. This is pre-existing parser behavior, out of scope.

### Before / After

| Metric | Pre-fix | Post-012/002 only | Post-012/002 + 012/003 |
|---|---|---|---|
| filesScanned | 33 | 1,396 | 1,426 |
| filesIndexed | 33 | 878 (63%) | **1,426 (100%)** |
| UNIQUE errors | 3 | 10/scan | **0** |
| files-with-0-nodes | 0 | 519 | **0** |
| dbFileSize | 473 MB | 473 MB (no VACUUM) | **~39 MB** (post-VACUUM + rescan) |

---

## 3. PENDING OPERATOR ACTION (THE ONE THING)

**Restart OpenCode in the current session (or any OpenCode TUI running against this repo) so the MCP server reloads the latest dist.**

Why: During this session the MCP server inside the running OpenCode instance held stale dist in Node's require-cache. Scans from the current session still return the pre-012/003 pattern (filesIndexed ~878, 10 UNIQUE errors). Fresh `claude` / `copilot` CLI processes already prove the fix works (see §2) — only the long-running OpenCode MCP server needs the bounce.

After restart:

```
mcp__spec_kit_memory__code_graph_scan({
  rootDir: "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
  incremental: false
})
```

Expected: `filesScanned: 1426`, `filesIndexed: 1426`, `errors: []` or only benign `partial-parse`, `fullScanRequested: true`, `effectiveIncremental: false`.

Optional follow-ups (non-blocking):
- `git status` / `git diff` to review the uncommitted tree, then commit 012/002 + 012/003 + research + memory continuity as one or separate commits.
- Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict` on both packets if anything else touched them.

---

## 4. RELATED FOLLOW-UPS (NOT BLOCKING)

| # | Item | Source | Action |
|---|---|---|---|
| 1 | Reducer path-resolution bug for active packets | Deep research pt-04 synthesis §17 | `sk-deep-research/scripts/reduce-state.cjs` calls `resolveArtifactRoot` which always allocates the NEXT `pt-NN` slot rather than locating the active one, so `reduce-state.cjs` cannot rehydrate an in-flight packet. File as a separate sk-deep-research packet. Manually inlining prior findings in iteration prompts worked around it. |
| 2 | Copilot-hook-wiring pre-existing test failure | Carry-over from pt.1 handover | Still failing; still out of scope. |
| 3 | 10 files with `Tree contains syntax errors (partial parse)` | AC-3 in this session's verification | Benign parser warnings on source files whose content exposes tree-sitter limitations (generics, incomplete TypeScript constructs). Candidate for a future parser-completeness packet. |
| 4 | Method-count suspiciously low (170 methods across 1,426 files) | Observed during iteration 1 of pt-04 research | Parser under-counts class methods. Deferred to future parser-completeness packet. |
| 5 | `method_signature` not in `JS_TS_KIND_MAP` | Deep research open question | Deferred to parser-completeness packet. |
| 6 | Separate `candidateFilesDiscovered` vs `filesIndexed` response field | Deep research open question | Operator confusion around "how many candidates existed pre-filter" vs "how many indexed". Defer to packet 014 operator-metrics. |
| 7 | Commit the working tree | Throughout session | Nothing committed. User to decide commit granularity (single batch vs per-packet). |

---

## 5. KEY ARTIFACTS

### Spec folders

All under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/`:

- `012-code-graph-context-and-scan-scope/` (prior session; `_memory.continuity` refreshed this session)
- `012-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/` ← shipped this session
- `012-code-graph-context-and-scan-scope/003-cross-file-dedup-defense/` ← shipped this session
- `session-handover-2026-04-23.md` (prior session)
- `session-handover-2026-04-23-pt2.md` (this file)

### Research packet

Under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/`:

- `007-deep-review-remediation-pt-04/` — 5 iteration narratives + 5 delta files + state.jsonl + strategy + registry + research.md + prompts (iteration-001..005 + implement-codex + implement-012-003) + logs

### Source + dist changes (working tree)

| File | Change | Origin packet |
|---|---|---|
| `mcp_server/code-graph/lib/structural-indexer.ts` | `IndexFilesOptions`, conditional stale-gate, `seenSymbolIds` per-file, `globalSeenIds` cross-file | 012/002 + 012/003 |
| `mcp_server/code-graph/lib/code-graph-db.ts` | `INSERT OR IGNORE` in `replaceNodes()` | 012/003 |
| `mcp_server/code-graph/handlers/scan.ts` | Pass `skipFreshFiles: effectiveIncremental`; add `fullScanRequested` + `effectiveIncremental` response fields | 012/002 |
| `mcp_server/code-graph/README.md` | Document new response fields + surface matrix | 012/002 |
| `mcp_server/tests/structural-contract.vitest.ts` | +3 options tests, +2 integration tests, +3 Layer 1 dedup tests | 012/002 + 012/003 |
| `mcp_server/tests/tree-sitter-parser.vitest.ts` | +3 dedup regression tests | 012/002 |
| `mcp_server/tests/code-graph-db.vitest.ts` | +2 Layer 2 DB persistence tests (INSERT OR IGNORE) | 012/003 |
| `mcp_server/dist/*` | Rebuilt at 14:09 (012/002) and 14:51 (012/003) | both |

### Production-verified state (from fresh CLI sessions)

```
Copilot CLI (gpt-5.4):
  filesScanned=1426, filesIndexed=1426, errors=10 (partial-parse only)
  fullScanRequested=true, effectiveIncremental=false
  totalNodes=52157, totalEdges=30235
  advisor_status: freshness=live, trust_state=live, generation=101

Claude Code CLI (claude-opus-4-7):
  filesScanned=1426, filesIndexed=1426, errors=10 (partial-parse only)
  fullScanRequested=true, effectiveIncremental=false
  advisor_status: freshness=live, trust_state=live, generation=102,
                  daemon lastLiveAt=2026-04-23T13:08:32.907Z
```

---

## 6. CONTINUATION PROMPT FOR NEW SESSION

Paste this into a fresh Claude Code / OpenCode session to resume:

```
Read .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/session-handover-2026-04-23-pt2.md for full context. Then:

1. Confirm the MCP server has been restarted since 2026-04-23T14:51Z (check code_graph_status — if lastScanAt is from before then, or if a scan still returns filesIndexed ~878, the server may still be on the pre-012/003 dist).

2. Run: mcp__spec_kit_memory__code_graph_scan({ rootDir: "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public", incremental: false })

3. Verify: filesScanned >= 1400, filesIndexed == filesScanned, errors: [] or only tree-sitter "partial-parse" entries, fullScanRequested: true, effectiveIncremental: false.

4. Review `git status` — the full packet 012/002 + 012/003 + research pt-04 + memory continuity edit are unstaged. Decide commit granularity. Conventional-commit recommendation:
   - fix(026/007/012/002): thread IndexFilesOptions; add fullScanRequested+effectiveIncremental response fields
   - fix(026/007/012/003): defense-in-depth cross-file dedup + INSERT OR IGNORE
   - docs(026/007): research pt-04 synthesis + handover pt2
   - chore(026/007/012): refresh _memory.continuity pointing at 012/002..003

5. If any of the deferred items in §4 (follow-up table) are in scope for this next session, open a new nested packet under 012 or a sibling under 007.
```

---

## 7. DEEPER CONTEXT (READ ONLY IF NEEDED)

| Doc | Purpose |
|---|---|
| `research/007-deep-review-remediation-pt-04/research.md` | 17-section synthesis with root-cause analysis, exact diffs, test plan, risk register, acceptance criteria. This is the canonical "how we got here". |
| `012/002/spec.md` + `plan.md` + `tasks.md` + `decision-record.md` | Packet 012/002 canonical docs (stale-gate fix) |
| `012/003/spec.md` + `plan.md` + `tasks.md` + `decision-record.md` | Packet 012/003 canonical docs (defense-in-depth) |
| `012/002/implementation-summary.md` + `012/003/implementation-summary.md` | What actually landed per packet, with `_memory.continuity` blocks |
| `research/007-deep-review-remediation-pt-04/iterations/iteration-001..005.md` | Per-iteration narratives from cli-codex dispatches |
| `research/007-deep-review-remediation-pt-04/logs/iteration-001..005.log` | Raw codex stdout per iteration |
| `research/007-deep-review-remediation-pt-04/logs/implement-codex.log` | Codex plan+implement run for 012/002 |
| `research/007-deep-review-remediation-pt-04/logs/implement-012-003.log` | Codex plan+implement run for 012/003 |

---

## 8. SESSION METRICS

| Metric | Value |
|---|---|
| Session date | 2026-04-23 (pt.2, ~13:00-15:30 Z) |
| Packets shipped | 2 (012/002, 012/003) |
| Deep research runs | 1 × 5 iterations + 2 × plan+implement dispatches |
| Codex dispatches | 7 total (5 research + 2 implementation) |
| Codex tokens used | ~500K research + ~226K (012/002) + ~288K (012/003) ≈ 1.01M total |
| External-CLI verification | 2 (1 × claude, 1 × copilot) — both 7/8 PASS |
| Strict-validate passes | 2/2 (012/002 and 012/003 both 0 errors / 0 warnings) |
| Test growth | structural-contract+tree-sitter+code-graph-db: 20 → 33 focused |
| Net behavioral win | 33 → 1,426 files indexed (43×), 519 → 0 files-with-0-nodes, 3 UNIQUE/scan → 0 |
| Disk reclaim | 530 MB → 22 MB (DB + WAL) |
| DQI / compliance | validate.sh --strict 0/0 on all canonical docs; no commits; no pushes |
