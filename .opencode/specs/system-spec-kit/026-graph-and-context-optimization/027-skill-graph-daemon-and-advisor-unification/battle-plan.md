---
title: "Phase 027 — Battle Plan"
description: "Execution plan for implementing all 6 child sub-packets (027/001-006) using cli-codex gpt-5.4 high fast (primary) + cli-copilot gpt-5.4 high (fallback), with inter-phase review gates and deferred-item handling."
importance_tier: "high"
contextType: "implementation"
---

# Phase 027 Battle Plan

## Mission

Take Phase 027 from scaffolded research to fully shipped implementation. 6 child sub-packets, dependency-ordered, each converged to its checklist + test gates before the next starts. Final state: skill-graph daemon auto-updates on skill change, derived metadata + lifecycle handling under self-contained `mcp_server/skill-advisor/` package, native TS scorer with 5-lane fusion + Python parity, MCP tool surface live, compat shims working, promotion gates gated shadow-only for semantic.

## Executor contract

- **Primary:** cli-codex gpt-5.4 high fast
  ```
  codex exec --model gpt-5.4 \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox workspace-write \
    "<per-phase prompt>"
  ```
- **Fallback:** cli-copilot gpt-5.4 high
  ```
  copilot -p "<prompt>" --model gpt-5.4 --allow-all-tools --no-ask-user
  ```
- **Fallback triggers:** codex rate-limit / quota / auth error / 5xx / stream closed / connection reset.
- **Concurrency:** max 1 active executor per phase (SQLite single-writer lease + prompt-packing makes parallel codex on same repo unsafe). Two phases may run in parallel ONLY when they touch disjoint file sets AND the human orchestrator has validated no dependency overlap — the only eligible pair is **027/004 + 027/006** after 027/003 lands.
- **Timeout:** codex `--timeout` not set explicitly; rely on shell driver wrapping (30-60 min per dispatch). If a single phase exceeds 60 min wall-clock, kill + retry with more targeted prompt.

## Dispatch order

Strict dependency chain (per `plan.md` + `graph-metadata.json.manual.depends_on`):

```
  [001] daemon + freshness          ← no deps inside 027
    |
    v
  [002] lifecycle + derived         ← depends on 001 daemon + freshness
    |
    v
  [003] native advisor core         ← HARD GATE; depends on 001 + 002 (Y3 prereq)
    |
    +---------+
    |         |
    v         v
  [004]     [006]                   ← may run in parallel after 003
    |
    v
  [005] compat migration            ← sequences after 004
```

## Per-phase dispatch plan

### Phase A — 027/001 Daemon + Freshness Foundation

**Preconditions:**
- Scaffold committed (done: commit `7b639258a`).
- Audit patches applied (done: commit `9197e4ede`).
- TS build clean baseline: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`
- Baseline test green: `cd mcp_server && npx vitest run` (8 files / 65 tests + any Phase 026 follow-ons — see Phase 026 commit `874554827`)

**Dispatch prompt summary:** "Implement 027/001 per spec.md/plan.md/tasks.md/checklist.md. Create `mcp_server/skill-advisor/lib/daemon/{watcher,lease,lifecycle}.ts` + `lib/freshness/{generation,trust-state,rebuild-from-source}.ts` + `bench/watcher-benchmark.ts`. Use Chokidar (narrow scope + per-skill `derived.key_files` dynamic additions), workspace-scoped single-writer lease, post-commit generation publication, fail-open semantics. Add Track H inline hardening (reindex-storm back-pressure, malformed SKILL.md quarantine, partial-write resilience). Tests under `tests/daemon/**` + `tests/freshness/**`. Benchmark must meet ≤1% idle CPU / <20MB RSS. No code outside 001's scope. Full vitest suite must pass at end."

**Success gate:**
- All P0 checklist items green
- Benchmark harness meets ≤1% CPU / <20MB RSS on current skill set
- Watcher behavior: atomic-rename, ENOENT, SQLITE_BUSY, rebuild-from-source tests pass
- Single-writer lease verified under simulated multi-daemon contention
- TS build clean + existing 65-test baseline still green

**Expected wall:** 1-2 codex sessions × 30-60 min each = **~1-2 hours**. Human effort estimate (research §9): 4-6 days.

### Phase B — 027/002 Lifecycle + Derived Metadata

**Preconditions:** 027/001 landed + converged.

**Dispatch prompt summary:** "Implement 027/002 per spec.md/plan.md/tasks.md/checklist.md. Create `lib/derived/{extract,provenance,trust-lanes,anti-stuffing,sanitizer}.ts` + `lib/lifecycle/{age-haircut,supersession,archive-handling,schema-migration}.ts` + `lib/corpus/df-idf.ts` + `schemas/skill-derived-v2.ts` (Zod). B1 input set = full (SKILL.md frontmatter/headings/body/examples + references/** headings + assets/** filenames + intent_signals + source_docs + key_files). **A7 sanitizer MUST wrap every write boundary** (SQLite, graph-metadata.json.derived, envelope, diagnostics) — instruction-shaped fixtures must be rejected. Targeted invalidation per input category. Integration with 027/001 daemon: watcher fires → derived refresh → generation bump < 10s. Export `tests/fixtures/lifecycle/` for 027/003."

**Success gate:**
- All P0 checklist items green (including new #8 sanitizer + #9 targeted invalidation from audit patch)
- Schema-v2 `derived` block with `key_files[]` + `sanitizer_version` validated
- Rollback test: v2 → v1 preserves all author-authored fields
- Integration test: SKILL.md edit → derived refresh end-to-end < 10s
- Lifecycle fixtures exported + smoke-consumed

**Expected wall:** **~2-3 hours**. Human effort: 5-7 days.

### Phase C — 027/003 Native Advisor Core (HARD GATE)

**Preconditions:** 027/001 + 027/002 both landed + converged. Lifecycle fixtures available.

**Dispatch prompt summary:** "Implement 027/003 per spec.md/plan.md/tasks.md/checklist.md. **Target folder: `mcp_server/skill-advisor/lib/`** (NOT `mcp_server/lib/skill-advisor/`). Migrate 11 existing `lib/skill-advisor/*.ts` files to new location; existing 65-test baseline must stay green after migration. Port `skill_advisor_runtime.py` scoring logic to TS. Create `lib/scorer/{projection,fusion,ambiguity,attribution,ablation,weights-config}.ts` + per-lane modules. Initial weights 0.45 / 0.30 / 0.15 / 0.10 / 0.00. Python↔TS parity harness under `tests/parity/`: exact per-prompt top-1 + pass-threshold/abstain on 200-prompt corpus. **§11 acceptance gates:** ≥70% full-corpus + ≥70% holdout, UNKNOWN ≤10, gold-none no increase, explicit-skill no regression, ambiguity stable, derived-lane attribution, adversarial blocked, regression-suite P0=1.0."

**Success gate (THE HARD GATE):**
- All §11 deterministic gates green
- Parity 200/200 per-prompt top-1 + pass-threshold match vs Python
- All 11 files migrated under `mcp_server/skill-advisor/lib/`; 65-test baseline preserved
- Cache-hit p95 ≤50ms + uncached deterministic p95 ≤60ms
- Semantic-shadow lane scored but 0.00 live (config-level lock verified)
- Ablation protocol runs clean: each lane disable produces measurable delta

**If gate fails:** do NOT proceed to 004/006. Fix scorer. Re-run parity. If repeated failure indicates research insufficiency, escalate before continuing.

**Expected wall:** **~3-5 hours** (largest phase; port + parity). Human effort: 7-10 days.

### Phase D1 — 027/004 MCP Advisor Surface (parallel-eligible with D2)

**Preconditions:** 027/003 landed + HARD GATE passed.

**Dispatch prompt summary:** "Implement 027/004 per spec.md/plan.md/tasks.md/checklist.md. Create `mcp_server/skill-advisor/{tools,handlers}/{advisor-recommend,advisor-status,advisor-validate}.ts` + `schemas/advisor-tool-schemas.ts` (Zod). Register in existing system-spec-kit MCP dispatcher — do NOT create a new MCP server. `advisor_validate` output schema must include §11 slice fields (full_corpus_top1, holdout_top1, unknown_count, gold_none_false_fire_count, explicit_skill_top1_regression, ambiguity_slice_stable, derived_lane_attribution_complete, adversarial_stuffing_blocked, regression_suite_status). Cache integration reuses post-025 HMAC prompt cache. Privacy contracts from post-025 preserved (no raw prompts in any observable surface). Handler tests per tool (happy/fail-open/stale/cache-hit/cache-miss)."

**Success gate:**
- All 3 tools discoverable via MCP introspection
- Per-tool tests green
- No raw prompts in any observable surface (privacy regression test)
- TS build clean

**Expected wall:** **~1-2 hours**. Human effort: 4-6 days.

### Phase D2 — 027/006 Promotion Gates (parallel-eligible with D1)

**Preconditions:** 027/003 landed + HARD GATE passed. 027/004 NOT required (may run in parallel with D1).

**Dispatch prompt summary:** "Implement 027/006 per spec.md/plan.md/tasks.md/checklist.md. Create `lib/promotion/{shadow-cycle,weight-delta,gates,rollback}.ts` + `bench/{corpus-accuracy,latency,safety}.ts`. Shadow-cycle harness replays corpus without live state mutation. Weight-delta cap: 0.05 per promotion. Gate evaluator enforces full §11 slice bundle (≥75% full + ≥72.5% holdout + UNKNOWN≤10 + gold-none no increase + explicit-skill no regression + ambiguity stable + derived-lane attribution + adversarial blocked + lifecycle slices green + latency gates + parity preservation + regression-suite gates). Two-positive-shadow-cycles rule enforced. Semantic live weight locked at 0.00 — raising it without gate approval must fail at config load. Rollback on regression."

**Success gate:**
- Shadow cycles produce zero detected live mutations (audit log check)
- Weight delta >0.05 rejected
- Simulated good promotion passes all 13 gates
- Simulated bad promotion (any single gate fail) correctly rejects
- Semantic weight raise blocked at config load

**Expected wall:** **~2-3 hours**. Human effort: 3-5 days.

### Phase E — 027/005 Compat + Bootstrap (final)

**Preconditions:** 027/004 landed. 027/006 ideally landed (005 playbook references 006 promotion gates) but not hard requirement.

**Dispatch prompt summary:** "Implement 027/005 per spec.md/plan.md/tasks.md/checklist.md. Rewrite `.opencode/skill/skill-advisor/scripts/skill_advisor.py` as probe→route-native-or-fallback shim (preserve Phase 025 `--stdin` mode + Phase 026 fixes). Rewire `.opencode/plugins/spec-kit-skill-advisor.js` + `-bridge.mjs` to delegate to `advisor_recommend` when daemon present. Create `lib/compat/{daemon-probe,redirect-metadata}.ts`. Update `.opencode/skill/system-spec-kit/install_guide/**` with daemon bootstrap + rollback docs. Update `.opencode/skill/skill-advisor/manual_testing_playbook/**` with native path + Python-shim path + supersession/archive/rollback redirect scenarios + H5 operator-alerting playbook. Prompt-safe status surfaces for 4 lifecycle states."

**Success gate:**
- Python shim tests green (daemon-on + daemon-off)
- Plugin bridge tests green (daemon-on + daemon-off)
- Phase 025 + 026 regressions preserved (no tests broken)
- Install-guide walkthrough succeeds on fresh checkout (manual spot-check)
- Supersession / archive / rollback fixtures render correct redirect metadata
- Disable flag honored across all compat paths

**Expected wall:** **~2 hours**. Human effort: 4-6 days.

## Cumulative expected wall-clock

| Phase | Solo codex | With review |
|---|---|---|
| 027/001 | 1-2 h | +30 min |
| 027/002 | 2-3 h | +30 min |
| 027/003 | 3-5 h | +1 h (HARD GATE) |
| 027/004 | 1-2 h | +15 min |
| 027/006 | 2-3 h | +30 min |
| 027/005 | 2 h | +30 min |
| **Total** | **11-17 h** | **+3-4 h** |

**Realistic total: 14-21 hours** across multiple dispatch cycles + review breaks. Can compress with 004 ∥ 006 parallel window.

## Per-phase dispatch recipe

The established pattern (same as Phase 026 driver):

1. **Write a single-phase prompt file** at `/tmp/codex-027-NNN-prompt.txt` with:
   - Scope reference (read spec.md/plan.md/tasks.md/checklist.md)
   - Predecessor dependency: "read `../NNN-prior-child/implementation-summary.md` before starting"
   - Concrete deliverable list
   - Test gate instructions
   - Final marker line requirement (`PHASE_027_NNN_DONE p0_closed=X p1_closed=Y tests_passed=Z`)
2. **Dispatch:** `codex exec <prompt> > /tmp/codex-027-NNN-log.txt 2>&1` — background or foreground based on urgency.
3. **Monitor:** cron `:MM,MM+10,...` via CronCreate (established pattern); report iter progress until final marker.
4. **Verify** (orchestrator):
   - Read child's `implementation-summary.md` for per-finding closure evidence
   - Re-run focused test suite (`npx vitest run tests/...`)
   - Re-run TS build
   - Read commit diff to spot-check scope discipline (no out-of-scope file touches)
5. **Commit + push** (orchestrator, sandbox-bypassed): one commit per phase.
6. **Optional deep-review** (see next section).

## Inter-phase review policy

**After each phase lands:** light orchestrator verification (tests + diff inspection). Not a full deep-review — too expensive per cycle.

**After 027/003 (HARD GATE):** single 7-iter cli-codex deep-review focused on:
- D2 correctness of 5-lane fusion math
- D6 test coverage of per-lane edge cases
- D5 parity-harness thoroughness (200/200 + regression)

Rationale: 003 is the architectural load-bearing phase. If anything's wrong, catch it before 004/006 consume its output.

**After all 6 phases land:** optional 20-iter cli-copilot deep-review on the integrated stack. Cover D1 security (A7 sanitizer end-to-end), D3 performance (daemon under load), D7 docs (install guide + playbook).

## Fallback + retry protocol

**If codex dispatch fails** (rate-limit / quota / 5xx):
- Detect: grep log for "rate limit" / "429" / "quota" / "5[0-9][0-9]" / "stream closed" / "connection reset" / non-zero exit with no iter file
- Retry with cli-copilot (same prompt, replace `codex exec ...` with `copilot -p "..." --model gpt-5.4 --allow-all-tools --no-ask-user`)
- If copilot also fails: pause + diagnose. Don't infinite-loop retry.

**If dispatch produces wrong-scope changes** (e.g. 001 codex touches 003 files):
- Do NOT commit.
- `git stash` the changes.
- Re-prompt with stricter scope language + `--sandbox workspace-write` limitation: "ONLY touch files under `<child-folder>/` + `mcp_server/skill-advisor/lib/<child-scope>/` + `tests/<child-scope>/**`."

**If tests fail after dispatch:**
- Do NOT commit.
- Re-prompt codex with the exact failing test names + ask for a minimal fix.
- If test is pre-existing failure from outside 027 scope (see Phase 020 deferral list: `transcript-planner-export.vitest.ts`, `deep-loop/prompt-pack.vitest.ts`, `context-server-error-envelope.vitest.ts`), document as known non-regression and proceed.

**If benchmark fails** (027/001 CPU/RSS):
- Review narrow-scope assumption — did codex enable broad watching?
- Re-prompt with stricter narrow-scope language.
- If genuine measurement exceeds ≤1%, raise with user — may warrant debounce tuning (E4) before shipping.

## Commit discipline per phase

One commit per phase, conventional format:

```
feat(027/NNN): <short description>

<body: what, why, acceptance evidence>

Files touched: N under `<scope>/`
Tests: <added / modified / passing count>
Research conformance: <checklist items closed with file:line evidence>
Parity: <parity harness outcome if applicable>
Audit gaps closed: <gap IDs if applicable>
```

## Orchestrator hooks

Before dispatching each phase:
- [ ] Last commit on main is the prior phase's convergence
- [ ] No uncommitted changes in scope directory
- [ ] `/tmp/codex-027-NNN-prompt.txt` written + reviewed
- [ ] Background task ID captured
- [ ] Cron scheduled for status checks if wall > 30 min

After each phase lands:
- [ ] Checklist items for that phase marked `[x]` with `file:line` evidence
- [ ] `implementation-summary.md` for that phase populated
- [ ] Parent `027/implementation-summary.md` Children Convergence Log row updated
- [ ] Phase commit pushed to origin/main
- [ ] Next phase preconditions verified before dispatching

## Expected outputs at completion

- 6 convergent child implementation packets
- Self-contained `mcp_server/skill-advisor/` package with lib/tools/handlers/tests
- Auto-updating skill graph (daemon watches, publishes generation bumps)
- Derived metadata pipeline with trust lanes + A7 sanitizer at every write
- Native TS scorer with 5-lane fusion + Python↔TS parity 200/200
- 3 MCP tools live: `advisor_recommend`, `advisor_status`, `advisor_validate`
- Shadow-cycle harness for future semantic promotion
- Compat shim + plugin bridge routing to native when daemon present
- Install guide + playbook updated for new architecture
- Phase 027 implementation-summary.md Children Convergence Log complete
- Optional: clean deep-review pass on the integrated stack

## Out of scope for this battle plan

- Actual removal of Python `skill_advisor.py` CLI — deferred post-027 per ADR + research D4.
- Semantic lane promotion (stays 0.00 live through first wave per ADR-006).
- Track I causal-edge discovery (deferred post-027 per audit Gap 6 patch).
- Cross-repo skill discovery (explicitly rejected in prior research).
- Live-AI telemetry collection (still deferred per Phase 024).

## Rollback strategy

Per-phase: `git revert <phase-commit>` reverts ONLY that phase's changes; prior phases stay intact.

Cross-phase: if 003 parity fails catastrophically, revert 003 + 004 + 006 (which depend on 003's scorer output). 001 + 002 remain because they are independent foundations.

Full Phase 027 rollback: revert in reverse order (005, 006, 004, 003, 002, 001). Research artifacts (pt-01) and scaffolding commits stay — they're documentation.
