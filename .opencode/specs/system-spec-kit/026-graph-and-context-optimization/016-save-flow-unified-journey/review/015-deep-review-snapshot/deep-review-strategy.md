<!-- SNAPSHOT: copied from 015-save-flow-planner-first-trim/review/deep-review-strategy.md on 2026-04-15. Authoritative source at original packet. -->

---
title: "Deep Review Strategy: Packet 015 Save-Flow Planner-First Trim"
description: "10-iteration deep-review steering record for Phase 015 plus cross-packet residual sweep. Runtime: cli-copilot --effort high; fallback cli-codex."
---

# Deep Review Strategy — Packet 015 Save-Flow Planner-First Trim

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Independent deep-review of packet 015's save-flow planner-first trim (43 tasks, 15 subsystems touched) plus a residual cross-packet sweep covering packets 012 + 013 closures, v3.4.1.0 changelog accuracy, and dependabot remediation. Goal is to catch P0 regressions (load-bearing violations, fallback divergence), P1 quality issues (doc-runtime drift, dead flags, test coverage gaps), and P2 polish items.

### Runtime

- **Agent**: cli-copilot (`--effort high`, `--allow-all`)
- **Fallback**: cli-codex (gpt-5.4 high fast)
- **Mode**: auto, 10 iterations (fixed), each iteration writes iteration-N.md + appends state.jsonl + updates findings-registry.json

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Phase 015 risks audit: did the planner-first default preserve the 4 load-bearing pieces bit-for-bit? Does `plannerMode: "full-auto"` fallback actually produce the pre-015 pipeline? Are the 4 new env flags correctly wired? Are the 3 new follow-up API entry points real? Does the planner response correctly classify hard checks as blockers and score-heavy checks as advisories? Did any dead branches, dead flags, or F026-style phantom compute survive the trim? Are there test coverage gaps? Does documentation match runtime? Cross-packet: does v3.4.1.0 changelog claim match reality?

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (per iteration)

- [ ] Q1 (iter 1) — Load-bearing: atomic-index-memory.ts, create-record.ts, content-router.ts switch, thin-continuity-record.ts byte-level preservation vs pre-015 commit f3dc18993~1
- [ ] Q2 (iter 2) — Full-auto fallback: every plannerMode branch reaches pre-015 code path when fallback is chosen
- [ ] Q3 (iter 3) — Flag wires: SPECKIT_ROUTER_TIER3_ENABLED, SPECKIT_QUALITY_AUTO_FIX, SPECKIT_RECONSOLIDATION_ENABLED, SPECKIT_POST_INSERT_ENRICHMENT_ENABLED all read + acted on
- [ ] Q4 (iter 4) — Follow-up API: refreshGraphMetadata / reindexSpecDocs / runEnrichmentBackfill are real implementations
- [ ] Q5 (iter 5) — Planner response: hard structural checks = blockers, score-heavy checks = advisories, no inversions
- [ ] Q6 (iter 6) — Eight-category routing: narrative_progress, narrative_delivery, decision, handover_state, research_finding, task_update, metadata_only, drop all dispatch identically; only Tier 3 default trigger removed
- [ ] Q7 (iter 7) — Dead branches: no F026-style phantom compute, no unused imports, no unreachable flag-gated code
- [ ] Q8 (iter 8) — Test coverage: every M2-M4 code path has tests for BOTH planner-first AND fallback
- [ ] Q9 (iter 9) — Docs vs runtime: /memory:save + ENV_REFERENCE.md + AGENTS.md + system-spec-kit/SKILL.md + spec.md + plan.md + decision-record.md all accurate
- [ ] Q10 (iter 10) — Cross-packet: v3.4.1.0 changelog accuracy, zero-reference sweep, dependabot remediation verified, dist builds clean, convergence synthesis

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Re-auditing packets 012 + 014 (already converged in prior deep-reviews)
- Rerunning packet 013 r2 closure audit (F028-F040 already closed)
- Implementing any findings discovered — this is review-only
- Testing against live fixtures (requires staged environment)

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- 10 iterations complete (fixed count)
- Any P0 finding MUST be documented; not necessarily blocking iteration progression
- Synthesis pass (iteration 10) MUST aggregate + recommend remediation priorities

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED (machine-owned)

- Baseline diffing against `f3dc18993~1` isolated the load-bearing delta quickly and cleanly.
- The audit confirmed three of four protected files stayed untouched, which sharply narrows later parity work.
- Full-auto branch tracing isolated one validator regression while confirming parity for Tier 3 routing, quality-loop auto-fix, reconsolidation, enrichment, chunking, and workflow follow-ups.
- The flag sweep mapped each new env toggle to a concrete branch quickly, and no dead-plumbing cases surfaced.
- The follow-up API audit showed the packet did not ship facade-only wrappers; all three new entry points route into existing runtime logic and are exported cleanly.
- The blocker/advisory audit cleanly separated one true inversion from the intended score-heavy downgrades, so the classification surface is now narrowed to a single template-contract issue.
- The router preservation pass proved the category contract and deterministic Tier 1/Tier 2 layers survived intact, so the routing risk is localized to the already-known Tier 3 default change.
- The dead-branch sweep distinguished live planner-first deferrals from actual ghost behavior, surfacing one observability bug and one clearly documented future stub without over-reporting the new gates.
- The coverage sweep showed the core planner/full-auto split is already well-tested, so remaining test risk is concentrated in deferred follow-up execution rather than the main routing pipeline.
- The doc drift pass quickly separated aligned operator docs from stale packet/reference docs, so remaining documentation risk is now localized instead of repo-wide.
- The residual sweep confirmed the repo is operationally clean outside the packet itself: deprecated wrappers stayed gone, the standing regression script still passes, and the expected build targets compile.

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED (machine-owned)

- File-level diff alone cannot tell whether the `content-router.ts` logic change is an allowed preservation exception, so later iterations still need parity evidence rather than assuming this P0 is benign.
- Repo-wide plannerMode grep was too noisy; targeted call-chain tracing through `memory-save.ts`, `search-flags.ts`, and `workflow.ts` produced the useful signal.
- Searching only raw env variable names misses helper-mediated branch sites, so branch verification still needed helper-to-caller tracing.
- For enrichment backfill, wrapper inspection alone was insufficient; it required tracing through `runMemoryIndexScan()` into `indexMemoryFile()` and the post-insert wrapper to rule out a silent no-op.
- The planner response classification is split across memory-save helpers and legacy rejection builders, so severity auditing required tracing both planner and non-planner branches together.
- Router-preservation review still required the baseline diff, because category and Tier 1/Tier 2 stability is easier to prove by absence of hunks than by reading the live file alone.
- Dead-branch review was noisier than previous passes because planner-first intentionally introduces deferred paths; each suspected no-op had to be checked against downstream response handling before it qualified as a finding.
- Coverage mapping had to go beyond the required focused suites because several Phase 015 changes are only indirectly exercised; planner-response shape assertions are not the same as executing the follow-up helpers they advertise.
- Packet-local docs still contained pre-rename API references, so grep-based doc review needed direct runtime cross-checks instead of assuming the packet text was updated alongside the implementation.
- The release notes still overstate a couple of Phase 015 details, so the final synthesis had to distinguish code truth from changelog truth rather than treating the release note as authoritative.

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:next-focus -->
## 8. NEXT FOCUS (machine-owned)

**Converged:** 10/10 iterations complete. Final synthesis written to `review/review-report.md`; no additional review dimensions remain.

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:cross-refs -->
## 9. CROSS-REFERENCES

- `../spec.md` — Phase 015 requirements
- `../plan.md` — M1-M5 milestones + file-level change map
- `../tasks.md` — 43 tasks
- `../decision-record.md` — 5 ADRs (ADR-001 through ADR-005)
- `../implementation-summary.md` — cli-codex + cli-copilot implementation record
- `../../014-save-flow-backend-relevance-review/research/research.md` — upstream research verdict
- `../../../../.opencode/changelog/01--system-spec-kit/v3.4.1.0.md` — release notes
- `iterations/iteration-NNN.md` — per-iteration evidence
- `deep-review-state.jsonl` — append-only lineage
- `deep-review-findings-registry.json` — consolidated findings + verdicts
- `review-report.md` — final synthesis
<!-- /ANCHOR:cross-refs -->
