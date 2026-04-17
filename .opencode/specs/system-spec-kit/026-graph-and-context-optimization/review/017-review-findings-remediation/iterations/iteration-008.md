---
iteration: 8
dimension: p0-escalation
dispatcher: claude-opus-4.7-1m (manual exec)
branch: main
cwd: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
created_at: 2026-04-17T21:15:00Z
convergence_candidate: true
note: "Iter 7 artifact absent on disk at start of iter 8; only iterations 001-006 present. Treating prior landscape as iter 1-6 adjudicated state (iter 6 verdicts authoritative). C1 P0 compound from iter 5 re-examined here under expanded threat models."
---

# Iteration 008 — P0 escalation assessment

Read-only adjudication of whether any current finding crosses to P0 under expanded threat models (multi-UID, non-POSIX, MCP transport injection, supply-chain, prototype pollution, race conditions).

## 1. Attack scenarios tested

1. **Multi-UID (same host, different UID)** — attacker shell + victim MCP server under distinct UIDs.
2. **Non-POSIX / Windows + eCryptfs** — `getProjectHash()` + `hook-state.ts` tmpdir semantics.
3. **MCP transport-layer injection** — HTTP/WS + stdio `_extra.sessionId` forgery.
4. **Supply-chain** — Phase 017 package.json / postinstall / SDK version drift.
5. **Prototype pollution** — `JSON.parse` + `Object.assign` + `for...in` on new 017 surfaces.
6. **Race conditions** — concurrent `runWithCallerContext`, retry-budget mid-clear, dual canonical saves.

## 2. Findings with P0-escalation verdicts

### S1 — C1 (iter 5 P0) under multi-UID — **DEMOTED: stays P1 (C1 P0 re-adjudicated DOWN)**

**Scenario:** different-UID attacker on same host tries to exploit homoglyph + vacuous session guard.

**Prerequisites:**
- POSIX `0o700` on `getStateDir()` (`hook-state.ts:180`) + `0o600` on state files (`:278`). Cross-UID read is denied by kernel DAC.
- MCP server is stdio-only in production (`context-server.ts:425` hardcodes `transport: 'stdio'`). Different-UID attacker cannot open the victim's stdin/stdout of an already-running child process; they would need to start their own server, which reads their own state dir under their own project hash (`process.cwd()` based, `hook-state.ts:163`).
- Writing a "malicious transcript file" into victim's `~/.claude/projects/` requires victim-UID write access — which a different-UID attacker does not have.

**Verdict:** **stays P1** for same-UID co-resident (C1 as-written), **ruled out** for cross-UID. The C1 P0 upgrade in iter 5 implicitly assumed same-UID ("local-UID access"); under that prereq the chain holds and P0 severity was justified for THAT threat model. Under the cross-UID expansion the DAC barrier blocks steps 1 and 3 of the chain. No new P0 surface beyond what iter 5 already claimed.

Evidence: `hook-state.ts:168,180,278`; `context-server.ts:425` (transport hardcoded `stdio`).

### S2 — MCP HTTP/WS `_extra.sessionId` attacker forgery — **RULED OUT (not P0; confirms iter 6 downgrade)**

**Scenario:** attacker hits the MCP server over HTTP/WS (hypothetical future deployment) and supplies arbitrary `mcp-session-id` header to forge `_extra.sessionId`.

**Evidence:**
- `node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.js:419` — sessionId is server-generated (`this.sessionIdGenerator?.()`).
- `:580-585` — incoming `mcp-session-id` header is compared against `this.sessionId`: `if (sessionId !== this.sessionId) { … reject }`. A client cannot forge an unallocated sessionId and have the transport accept it.
- `context-server.ts:425` hardcodes `transport: 'stdio'` — the server does not even mount the HTTP transport today. The attack surface does not exist in the shipping binary.

**Verdict:** **ruled out**. Confirms iter 6 R17-P1-002 downgrade (P1→P2). No P0.

### S3 — Supply-chain / postinstall / SDK drift — **RULED OUT**

**Evidence:**
- `git log 4d3af5a8c..HEAD -- .opencode/skill/system-spec-kit/mcp_server/package.json` → empty. Phase 017 modified zero package.json files.
- Grep for `postinstall|preinstall` in mcp_server/package.json → no matches.
- No dependency bumps; `@modelcontextprotocol/sdk` on-disk is pre-017 baseline.

**Verdict:** **ruled out**. No new attack surface. No P0.

### S4 — Prototype pollution on new Phase 017 surfaces — **RULED OUT**

**Evidence:**
- Grep `JSON.parse(` across `handlers/save/**` returns 1 hit (`dedup.ts:121`), pre-017 code.
- `caller-context.ts:7-18` — `MCPCallerContext.metadata: Record<string, unknown>` — `buildCallerContext` at `context-server.ts:422` spreads `...extra` into a fresh object literal, not merged onto any prototype. Keys like `__proto__` would land as own-properties on a fresh object, not pollute `Object.prototype`.
- No `Object.assign(target, ...)` where `target` is a prototype-reachable object on new 017 surfaces.
- `readiness-contract.ts`, `retry-budget.ts`, `shared-provenance.ts`, `exhaustiveness.ts` — no `JSON.parse`, no `Object.assign`, no `for…in`.

**Verdict:** **ruled out**. No P0.

### S5 — AsyncLocalStorage cross-handler leakage — **RULED OUT**

**Scenario:** two handlers running concurrently in different `runWithCallerContext()` envelopes might share storage and leak `sessionId`.

**Evidence:** `caller-context.ts:20` — `new AsyncLocalStorage<MCPCallerContext>()` is per-async-chain isolated by Node runtime (documented invariant). Each JSON-RPC request enters its own `storage.run(ctx, handler)` scope (`context-server.ts` handler entry, confirmed in iter 1 traceability). No shared module-level state.

**Verdict:** **ruled out**. No P0.

### S6 — Concurrent canonical saves on same spec folder — **NEW FINDING P2 (not P0)**

**Scenario:** two CLI invocations (two worktrees, two parallel operators) fire `workflow.ts` canonical save against the same spec folder simultaneously. Read-modify-write pattern at `workflow.ts:1296-1338` is file-based, not mutex-guarded.

**Evidence:**
- `:1302` `loadPFD(specFolderAbsolute)` — per-attempt re-read.
- `:1308-1311` increment `memorySequence` in-memory.
- `:1322` `savePFD(sequenceSnapshot, specFolderAbsolute)` — non-atomic write (unlike `hook-state.ts:269-280` which uses tmp-file + rename).
- `:1324-1328` retry loop reads back after write and confirms sequence matches; up to 3 attempts with 25 ms delay.

Retry loop is the mitigation: if process A writes seq=5 and process B writes seq=5 concurrently, one verification read will return the other's value; the losing process loops up to 3 times. But if both lose 3 times in a row (tight interleaving), the `console.warn('[workflow] memorySequence update could not be confirmed after 3 attempts')` fires and save continues without guaranteed monotonic sequence. `lastUpdated` timestamps can interleave out of order. No data corruption, but audit-trail integrity can drift.

**Verdict:** **new finding P2** (R8-P2-001 in delta). Not P0 — no security bypass, no cross-session data leak, no RCE. Operational hazard bounded by retry mitigation. Stays P2.

**Recommended action:** either adopt the `hook-state.ts:276-280` atomic tmp+rename pattern or hold a per-folder lockfile (`.description.json.lock`) around `loadPFD → savePFD`. Tracked for Phase 018.

### S7 — Retry-budget clear mid-retry (race) — **stays P2 (no escalation)**

**Scenario:** `runEnrichmentStep` calls `recordFailure()` then a concurrent coordinator calls `clearBudget(memoryId)`; next retry sees empty budget and retries again past MAX.

**Evidence:** `retry-budget.ts:24` module-level `Map`. Node single-threaded event loop makes any `Map.get` + `Map.set` pair atomic per microtask (iter 1 ruled-out #3). Concurrent `clearBudget` can ONLY interleave at await boundaries; within `recordFailure` there are no awaits (`retry-budget.ts:40-65` pure sync). Latent regression vector only if future refactor introduces awaits.

**Verdict:** **stays P2**. Not P0.

### S8 — Non-POSIX / Windows / eCryptfs — **stays P2 (no escalation)**

**Scenario:** on Windows, `0o600`/`0o700` modes are advisory; on eCryptfs, filenames > 143 bytes are rejected.

**Evidence:**
- `hook-state.ts:162-163` `getProjectHash()` returns 12-char SHA-256 prefix → filenames like `<12-char>.json` = 17 bytes — well under eCryptfs 143-byte cap. Safe.
- `:173-174` `getStatePath()` uses 16-char SHA-256 prefix of sessionId — 21-byte filename. Safe.
- Windows POSIX-mode is advisory; cross-UID cross-user attack on Windows is possible via NTFS ACL misconfig, but Phase 017 does not set explicit ACLs. This is a pre-017 baseline issue; not a Phase 017 regression.

**Verdict:** **stays P2** as a documentation/portability note on pre-017 hook-state baseline. No Phase 017 code introduces a new Windows-specific bypass. Not P0.

### S9 — Process-restart retry-budget wipe (iter 5 C4) — **stays P2**

Iter 5 C4 bounded this at P2 due to OOM-on-retry self-amplification loop. Nothing in iter 8 expanded threat models changes this. **No P0.**

## 3. P0 escalation summary

| # | Scenario | Prerequisite | Verdict |
|---|----------|--------------|---------|
| S1 | C1 cross-UID | different UID on same host | ruled out (DAC blocks) |
| S2 | HTTP/WS `_extra.sessionId` forgery | HTTP transport mounted | ruled out (server-generated sessionId) |
| S3 | Supply-chain postinstall | new dep in Phase 017 | ruled out (no dep edits) |
| S4 | Prototype pollution | crafted args.* | ruled out (fresh object spread) |
| S5 | ALS cross-handler leak | concurrent handlers | ruled out (per-chain isolation) |
| S6 | Concurrent canonical saves | 2 parallel workflow.ts | **new P2** (R8-P2-001) |
| S7 | Retry-budget clear-mid-retry | async refactor | stays P2 (latent) |
| S8 | Non-POSIX / eCryptfs | Windows/eCryptfs deployment | stays P2 (pre-017 baseline) |
| S9 | Retry-budget process-restart wipe | OOM + restart | stays P2 (iter 5 C4) |

**0 P0 escalations confirmed** in iter 8 under expanded threat models. Iter 5 C1 remains the only P0 claim and it is same-UID-scoped; multi-UID expansion RULES OUT, not worsens.

## 4. Hypotheses ruled out

1. Multi-UID homoglyph injection — POSIX `0o600` blocks cross-UID file read.
2. HTTP/WS sessionId forgery — MCP SDK validates header against server-issued token.
3. Supply-chain postinstall — no Phase 017 dependency changes on disk.
4. `__proto__` pollution via `args.*` — handlers spread into fresh literals.
5. AsyncLocalStorage cross-request leak — per-chain isolation by Node runtime.

## 5. Self-skepticism

- Iter 5 C1 assumed "local-UID access" without explicit threat-model framing. Under a broadened "local privilege" model it is genuinely P0. Under "multi-tenant cross-UID host" it is ruled out. The severity depends on deployment context — for production MCP on single-user workstation (typical), C1 is P0; for shared-host deployments with DAC separation (uncommon), C1 is P1. Iter 5's P0 verdict is defensible for the typical threat model. No escalation beyond that.
- S6 race is genuinely new — not surfaced in iter 1-6. It is a correctness/audit gap, not a security gap. P2 is honest severity; escalating to P1 would be sycophantic.

## 6. Metrics

- **Findings count iter 8:** 1 (R8-P2-001, S6 concurrent-canonical-save race)
- **Severity-weighted new iter 8:** 1 × 1.0 = **1.0**
- **Cumulative weighted severity (post-iter 6 baseline 35.0 + iter 7 unknown + iter 8 +1.0):** per iter 6 final tally 35.0; iter 7 absent on disk; iter 8 adds 1.0 → **assume 36.0 cumulative** (revise when iter 7 artifact confirmed).
- **newFindingsRatio iter 8:** 1.0 / 36.0 = **0.028** ← well below 0.08 threshold.
- **convergedThisIter:** TRUE (0.028 < 0.08, and 2nd consecutive iteration below threshold counting iter 6 at 0.057).
- **toolCallsUsed:** 11 (under 12 budget).

## 7. Next iteration recommendation

**Iteration 9/10 dimension recommendation:** **regression-verification** — actually execute the 17 vitest suites cited in `deep-review-config.json:regression_tests` against HEAD. Prior iterations have all been pure audit; an empirical test-run pass would close the loop with high confidence. Alternately **stop**: convergence conditions met (two consecutive iterations ≤ 0.08 ratio; no P0 escalations beyond iter 5 C1; all P1 findings stable).

**Key deliverables for Phase 018 planning:**
1. C1 remains P0 under same-UID threat model — prioritize fix: expand homoglyph fold to Unicode confusables set + remove vacuous stdio session guard or document as stdio-only.
2. S6 concurrent-save race (new P2) — adopt atomic tmp+rename in `savePFD` path.
3. F1/F2 (iter 3/6) remain unclosed — parent tasks.md has 79 open checkboxes; v3.4.0.2 changelog has 0 Phase-017 commit hashes. Close before declaring Phase 017 done.
4. Iter 7 artifact absence (if still missing after this iter) — state-machine gap or dispatcher skip; reconcile via rerun or annotation.
