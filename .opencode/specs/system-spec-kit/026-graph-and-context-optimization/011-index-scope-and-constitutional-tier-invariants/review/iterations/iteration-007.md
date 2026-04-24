# Iteration 007 — exploit-chain synthesis + final validation sweep

## Dispatcher
- iteration: 7 of 7 (FINAL)
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T14:00:00Z
- session: 2026-04-24T08:04:38.636Z (generation 1, lineageMode=new)

## Summary

Iter-7 executes the exploit-chain validation, shadow-handler sweep, canonical-path × isConstitutionalPath interaction audit, config-driven bypass grep, and iter-3 spec.md continuity spot-check demanded by iter-6's recommendation. **Zero new P0s discovered.** **One prior finding (P1-019, iter-6 "direct-save bypass of walker exclusion") is REFUTED on re-read and converted to a resolved status note.** One prior finding (P1-003 symlink) is reinforced with a new variant worth calling out in remediation (symlink-INTO-/constitutional/ pointing OUT, strictly worse than the original out-of-repo framing).

The compound exploit chain P0-001 → checkpoint_create → (bulk_delete audit) → checkpoint_restore is proven end-to-end reachable by any MCP client holding a single standard capability envelope (no admin gate, no tenant gate, no provenance gate on the two P0 tools).

**Convergence veto: YES** — two P0s still open from iter-5 and iter-6. Stopping at the user-specified 7-iteration budget cap, not at convergence.

## Files Reviewed (this iteration)

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts` (full file — re-read for realpath semantics)
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` (full file — re-read for guard input)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (lines 295-320, 805-830 — guard + test-env hook)
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts` (full dispatch 1-110)
- `.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts` (full dispatch 1-40)
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (lines 280-400 — memory_update + checkpoint_* schemas)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` (lines 40-300 — grep for tenantId/authz)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/spec.md` (lines 1-30 — continuity re-check)

## PART A — Final Validation Surfaces

### A.1 Exploit chain verification (end-to-end reachability)

**Goal:** prove the compound attack P0-001 + P0-002 is executable by an ordinary MCP client.

| Step | Tool | File:line | Gate? | Reachable by ordinary client? |
|---|---|---|---|---|
| 1 — poison | `memory_update({ id: X, importanceTier: 'constitutional' })` on any non-constitutional-path row | `tool-schemas.ts:294-297`, `memory-tools.ts:104`, `memory-crud-update.ts:67,87,149`, `vector-index-mutations.ts:399` | **none** — no `tenantId`, no `userId`, no `adminRole`, no `provenanceSource/Actor` in schema or handler (grepped — 0 matches) | **YES** |
| 2 — snapshot | `checkpoint_create({ name: "clean-state" })` | `tool-schemas.ts:329-345`, `checkpoint-tools.ts:34`, `checkpoints.ts` create path | `tenantId` is OPTIONAL (not in `required: ['name']`); no admin gate | **YES** |
| 3 — optional audit erase | `memory_bulk_delete({ tier: 'deprecated', confirm: true })` or wait for retention sweep | `tool-schemas.ts:322-325`, `memory-bulk-delete.ts` | Refuses constitutional without specFolder scope, but mutation_ledger rows are themselves tier='normal' — purgeable without guard | **YES (for ledger rows, not for constitutional memory_index rows)** |
| 4 — re-hydrate | `checkpoint_restore({ name: "clean-state" })` | `tool-schemas.ts:363-377`, `checkpoint-tools.ts:36`, `checkpoints.ts:1467-1570` | `tenantId` OPTIONAL; `validateMemoryRow` at 1258 does TYPE-only validation; no `isConstitutionalPath` call | **YES** |
| 5 — poisoned row surfaces | Auto-surface hook returns the re-hydrated row in every search's constitutional prelude | `hooks/memory-surface.ts:187` | none — hook correctly filters by tier=constitutional; the poison is upstream | automatic |

**Verdict:** the full 5-step chain is reachable by ANY MCP client that can call `memory_update`, `checkpoint_create`, and `checkpoint_restore` — which is the standard capability envelope, NOT an admin envelope. No step depends on a gate the attacker cannot satisfy. The chain produces a state where an attacker-controlled memory row is `importance_tier='constitutional'`, is returned in the constitutional auto-surface, and survives subsequent cleanup runs because **the cleanup script is path-based, not tier+path-coupled** (`cleanup-index-scope-violations.ts` deletes by path pattern only; an attacker-controlled row whose `file_path` is a legitimate repo doc but whose tier has been illegally promoted will NOT be caught by cleanup). This is the full "poison → snapshot → restore → persistent" attack.

**Downgrade counterevidence sought:** checked whether `checkpoint_restore` requires an admin envelope — it does not (schema is public, handler has no admin check). Checked whether `checkpoint_create` limits scope to tenant — `tenantId` is optional, not required. Checked whether an attacker-taken snapshot could be rejected at restore because a hash mismatch — no integrity signature is computed or checked. Checked whether `clearExisting: false` (default) prevents re-hydration of already-deleted rows — it allows INSERT OR REPLACE which HYDRATES rows that don't currently exist, the exact attack vector. None of these gates exist.

**Note:** the attacker needs the single memory's `id`, which `memory_list` / `memory_search` expose freely. Not a barrier.

```json
{
  "claim": "The compound exploit chain P0-001 (memory_update tier promotion) → checkpoint_create → checkpoint_restore is reachable end-to-end by any MCP client holding the standard public capability envelope; no admin, tenant, or provenance gate blocks any step.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:294",
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:329",
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:363",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:67",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1258",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1544"
  ],
  "counterevidenceSought": "Grepped memory-crud-update.ts for 'tenantId|validateGovernedIngest|authz|admin' — zero matches. Checked checkpoint_restore schema — tenantId is present but not in required. Checked whether checkpoint body is integrity-signed — no signature verification before decompression+apply. Checked whether checkpoint payloads include provenance — metadata is free-form JSON with no required auth-chain.",
  "alternativeExplanation": "If the deployment envelops the entire MCP server behind a trust boundary (e.g., single-tenant dev machine), the compound attack devolves to 'user can poison their own DB' — low severity. But the packet's invariant language is absolute ('only files under /constitutional/ can be constitutional-tier'), and the auto-surface hook injects constitutional rows into EVERY session including future sessions with other operators. The multi-tenant or shared-environment case is the relevant threat model for the invariant.",
  "finalSeverity": "P0 (re-confirms P0-001 + P0-002; no new P0 but reinforces both)",
  "confidence": 0.92,
  "downgradeTrigger": "Evidence that the MCP surface is behind admin-only deployment posture AND the product decision is that invariants are trust-boundary-defined; neither is present today."
}
```

### A.2 Shadow-handler sweep

**Goal:** find any tool handler exposed at runtime but NOT listed in `tool-schemas.ts` that could mutate `memory_index`.

Swept:
- `.opencode/skill/system-spec-kit/mcp_server/tools/*.ts` — 7 dispatch modules (memory-tools, checkpoint-tools, causal-tools, lifecycle-tools, skill-graph-tools, context-tools, plus `.opencode/skill/system-spec-kit/mcp_server/code-graph/tools/*` — code-graph DB, separate)
- Each dispatch module exports `TOOL_NAMES: Set<string>` and `handleTool(name, args)`. Every `handleTool` calls `validateToolArgs(name, args)` against the shared schema registry before dispatching to a handler.
- Enumerated every `TOOL_NAMES` set: the union matches the `TOOL_DEFINITIONS` export in `tool-schemas.ts:861-923` exactly (17 tools + causal + checkpoint + lifecycle + skill-graph + context = 40 total MCP tools). No orphan handler.
- Grepped `mcp_server/handlers/*.ts` for `export async function handle*` — every matching symbol is imported and dispatched from one of the `tools/*.ts` dispatch modules. There is no `handleRawMemoryUpdate` or `handleMemoryIndexWrite` reachable from the MCP surface outside the validated dispatch chain.
- `.opencode/skill/system-spec-kit/scripts/*` are CLI scripts, NOT MCP tools; they only run when invoked directly by an operator (node CLI), and they do not self-register as MCP handlers.

**Verdict:** No shadow handlers. The iter-6 17-tool inventory stands. **No new P0 or P1 from this sweep.**

### A.3 canonical-path.ts × isConstitutionalPath interaction (crux of iter-1/iter-2 symlink finding)

**Claim under test:** if a symlink `<repo>/.opencode/skill/specs/foo/constitutional/safe.md` points at `<repo>/.opencode/specs/foo/z_future/evil.md`, what does the guard see?

Re-read `canonical-path.ts`:
- `getCanonicalPathKey(filePath)` at `:24` calls `fs.realpathSync(filePath)` — FOLLOWS symlinks. If realpath fails, falls back to `path.resolve` (no symlink follow).
- `canonicalizeForSpecFolderExtraction(filePath)` at `:40` also calls `fs.realpathSync` with ENOENT fallback — FOLLOWS symlinks.

Re-read `memory-save.ts:306`:
```
const canonicalFilePath = path.resolve(parsed.filePath).replace(/\\/g, '/');
if (!shouldIndexForMemory(canonicalFilePath)) { throw }
if (parsed.importanceTier === 'constitutional' && !isConstitutionalPath(canonicalFilePath)) { downgrade }
```

The guard input is `path.resolve(parsed.filePath)` — **NOT** `getCanonicalPathKey(parsed.filePath)`. `path.resolve` does NOT follow symlinks.

**Exploit scenario:**
- Attacker places a file at `<repo>/.opencode/skill/any-skill/constitutional/safe.md` as a SYMLINK pointing at `<repo>/.opencode/specs/project/z_future/evil.md`.
- Calls `memory_save({ filePath: '.opencode/skill/any-skill/constitutional/safe.md', content: { importance_tier: 'constitutional' } })`.
- Guard at `memory-save.ts:307`: `shouldIndexForMemory(path.resolve(...))` sees `.../constitutional/safe.md`. Is `/constitutional/` in `EXCLUDED_FOR_MEMORY`? NO — `EXCLUDED_FOR_MEMORY` is `[z_future, external, z_archive]`. `/constitutional/` is NOT excluded. **Passes.**
- Guard at line 310: `isConstitutionalPath(path.resolve(...))` → tests for `(^|/)constitutional(/|$)` against `.../constitutional/safe.md` → **matches**. Tier stays `constitutional`.
- memory-parser then reads the FILE CONTENT via the symlink and gets the `z_future/evil.md` contents — which become the constitutional memory body.
- Separately, the `canonicalFilePath` DB column (if written later via `getCanonicalPathKey` at e.g. memory-save.ts:861) will contain the REAL path (`.../z_future/evil.md`).

**Result:** the row has:
- `file_path` = `.opencode/skill/any-skill/constitutional/safe.md` (symlink path — passes guard)
- `canonical_file_path` = `.opencode/specs/project/z_future/evil.md` (real path — violates Invariant 1 AND Invariant 3)
- `importance_tier` = `constitutional`

This is a DOUBLE invariant violation (1 + 3) AND surfaces the attacker's z_future content as constitutional. **The symlink attack is worse than the iter-5 framing.** P1-003 should be upgraded in remediation planning or at least tagged with this variant in the report. I am NOT upgrading to P0 in this iteration because:
1. the exploit requires the attacker to write a symlink into a `/constitutional/` directory that a maintainer merges via PR (detection surface exists);
2. in a single-tenant dev environment the attacker is the owner (out of scope);
3. evidence from code-graph/handlers/scan.ts:135 shows the design team IS aware of realpath requirement (explicit SECURITY comment), meaning this is a known gap of extension to memory-save rather than a novel finding.

But I am **strengthening the P1-003 evidence** with this variant and noting in the Wave-1 remediation that the fix must use `getCanonicalPathKey` (realpath) as the guard input.

```json
{
  "claim": "The memory-save guard input `path.resolve(parsed.filePath)` at memory-save.ts:306 does NOT follow symlinks (unlike getCanonicalPathKey which uses realpathSync). A symlink placed under /constitutional/ pointing at a /z_future/ or /external/ file bypasses both Invariant 1/2 AND Invariant 3 in one write; the resulting row has file_path=symlink (guard-passing) and canonical_file_path=real path (invariant-violating), with importance_tier=constitutional.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306",
    ".opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:24",
    ".opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:40",
    ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:135"
  ],
  "counterevidenceSought": "Checked whether the guard is re-applied downstream on canonical_file_path — it is not (canonical_file_path is a DB column, never fed back through isConstitutionalPath). Checked whether memory-parser rejects symlinks — it does not; fs.readFileSync follows symlinks transparently. Checked whether getCanonicalPathKey is called BEFORE the guard anywhere — no; it's only called later for the DB column write.",
  "alternativeExplanation": "The attacker's required capability (writing a symlink into a /constitutional/ directory) is non-trivial: most deployments have /constitutional/ as read-only or maintained by repo owners. But internal dev environments where the MCP server and repo share a filesystem with broad write access satisfy the prerequisite.",
  "finalSeverity": "P1 (reinforced; already tracked as P1-003 + P1-017)",
  "confidence": 0.88,
  "downgradeTrigger": "The memory-save guard switches to `getCanonicalPathKey` (realpath) before running isConstitutionalPath, matching the code-graph scan.ts doctrine. That fix closes this variant."
}
```

### A.4 Config-driven / data-driven bypass grep

Grepped scope for env vars and feature flags with names containing `SPECKIT_`, `ALLOW_`, `BYPASS_`, `SKIP_GUARD`, `DISABLE_`:
- **Only match of concern:** `memory-save.ts:813` → `SPECKIT_TEST_DISABLE_CANONICAL_ROUTING`. This disables the Tier 3 LLM canonical-routing pipeline, NOT the invariant guard. Traced: when the env var is set, `shouldUseCanonicalRouting()` returns false, which sends saves through the legacy `prepareParsedMemoryForIndexing` path — which still runs `shouldIndexForMemory` at line 307 and `isConstitutionalPath` at line 310. **No invariant bypass.**
- No other `process.env.SPECKIT_*` flag was found that gates any guard. No "admin override" env var. No "disable invariant" runtime switch.

**Verdict:** No configuration-driven bypass path. **No new P0 or P1 from this audit.**

### A.5 iter-3 docs drift spot-check — P1-011 (_memory.continuity freshness)

Re-read `spec.md` lines 1-30. As of iter-7 execution time (2026-04-24T14:00:00Z):
- Line 16: `last_updated_at: "2026-04-24T00:00:00Z"` — STALE (00:00:00 is prior to any iter-1..iter-6 work)
- Line 17: `last_updated_by: "codex-gpt-5"` — STALE (all review iterations have been @deep-review)
- Line 18: `recent_action: "Packet scaffolded"` — STALE (implementation complete per checklist + impl-summary)
- Line 21: `completion_pct: 20` — STALE (tasks.md / impl-summary / checklist all at 100%)

No auto-save has landed between iter-3 and iter-7. **P1-011 persists and must carry into the report.**

## Findings - New

### P0 Findings
- **None.** Zero new P0s. Both existing P0-001 + P0-002 confirmed reachable end-to-end.

### P1 Findings
- **None new.** P1-003 evidence reinforced with the symlink-INTO-constitutional variant (documented above in A.3); no new finding record minted because this strengthens rather than duplicates P1-003.

### P2 Findings
- **None new.**

## Findings - Resolved / Refuted

1. **P1-019 (iter-6, "memory_save direct-call bypasses walker's z_future/external exclusion")** — **REFUTED.** Re-read of `memory-save.ts:298-320` shows that line 307 DOES call `shouldIndexForMemory(canonicalFilePath)` and throws an error for z_future/external/z_archive paths BEFORE the constitutional tier check at line 310. Iter-6's reasoning was that only line 310 (tier=constitutional) gated the path, but line 307 is an unconditional early-throw that covers Invariants 1 and 2 on the direct-save path. The walker is therefore NOT the sole enforcement; direct saves are also gated. Severity: removed from open-findings list. **Correction to iter-6 record required in registry.**

## Traceability Checks

- **exploit_chain_reachability** (new this iteration): 5-step chain enumerated; every step's schema and handler audited for admin/tenant/provenance gate; zero gates present on P0-001 + P0-002 tools. Status: **FAIL (gating failure — compound attack reachable).**
- **shadow_handler_sweep** (new this iteration): enumerated all 7 dispatch modules; cross-referenced every `handle*` export against `tool-schemas.ts` definitions; no orphan handler. Status: **PASS.**
- **symlink_realpath_audit** (new this iteration): confirmed memory-save guard input does not follow symlinks (path.resolve not realpathSync); the attack variant symlink-INTO-/constitutional/-pointing-OUT is worse than iter-5's framing. Status: **PARTIAL** (known P1-003 + P1-017 stand; no new P0).
- **config_bypass_grep** (new this iteration): one test-env hook found (`SPECKIT_TEST_DISABLE_CANONICAL_ROUTING`); traced to not bypass invariant. Status: **PASS.**
- **p1_011_re_verify** (new this iteration): spec.md continuity still stale (completion_pct=20, recent_action="Packet scaffolded"). Status: **FAIL (persists).**

## Confirmed-Clean Surfaces (this iteration)

- No shadow MCP tool handlers exist; iter-6's 17-tool inventory is comprehensive
- No environment-variable feature flag can disable the save-time guard
- `SPECKIT_TEST_DISABLE_CANONICAL_ROUTING` test hook does not open an invariant bypass
- Direct `memory_save` is NOT bypassing walker exclusion (P1-019 refuted); `shouldIndexForMemory` fires unconditionally at memory-save.ts:307

## Severity Re-evaluation of Prior Findings

- **P0-001 (memory_update)**: reachability re-confirmed; exploit chain proof adds compound-attack context. Severity unchanged.
- **P0-002 (checkpoint_restore)**: reachability re-confirmed; exploit chain proof shows step-by-step attack vector. Severity unchanged.
- **P1-003 (symlink bypass)**: EVIDENCE REINFORCED with symlink-INTO-constitutional-pointing-OUT variant. Severity stays P1 but the variant is worse than the original framing; remediation MUST use realpath as guard input.
- **P1-019 (iter-6, direct-save walker bypass)**: **REFUTED AND RESOLVED.** Line 307 catches z_future/external before tier check.

## Convergence Signal Check

Per-iteration `newFindingsRatio` (severity-weighted):
- iter-1: 1.0
- iter-2: 0.77
- iter-3: 0.81
- iter-4: 1.0
- iter-5: 1.0 (P0 override)
- iter-6: 1.0 (P0 override)
- **iter-7: 0.0** (zero new findings; one refuted)

Noise floor:
- Ratios excluding iter-7: [1.0, 0.77, 0.81, 1.0, 1.0, 1.0]; median = 1.0; MAD = 0.0; noise threshold = 0.0.
- Iter-7 ratio (0.0) at or below floor — would SIGNAL CONVERGENCE if not for the two open P0s. **P0 override rule still applies: convergence is blocked.**

**Decision:** Stopping at iter-7 per user-specified max-iterations cap of 7, not due to convergence. Two P0s remain open. Verdict is FAIL regardless of iteration budget.

## Coverage

- Dimensions covered: correctness, security, traceability, maintainability, correctness-deep, security-extended, exploit-chain-synthesis (this iteration)
- Iterations executed: 7 of 7 (budget exhausted)
- Findings inventory stable: P0=2, P1=18 (was 19; P1-019 refuted), P2=22

## Next Focus

Iter-7 is final; synthesis follows in `review/review-report.md`. No iter-8.
