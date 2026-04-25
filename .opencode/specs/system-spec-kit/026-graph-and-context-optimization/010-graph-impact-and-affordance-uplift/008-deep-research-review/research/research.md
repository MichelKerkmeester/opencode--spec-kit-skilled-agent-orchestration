---
title: "Deep Research: Phase 010 + 010/007 + 011 Independent Review"
description: "10-iteration cli-codex review of all work shipped under 026/010-graph-impact-and-affordance-uplift, the 010/007 remediation pass, and the 011 playbook coverage follow-up. Verdict: 0 P0, 1 P1, 17 distinct P2; 5 of 33 010/007 closures contradicted by code; two follow-up sub-phases recommended."
trigger_phrases:
  - "010 deep-research review"
  - "010 closure integrity"
  - "008 deep-research review"
  - "010/007 closure verification"
  - "26 010 review research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review"
    last_updated_at: "2026-04-25T23:15:00Z"
    last_updated_by: "claude-opus-4-7-orchestrator"
    recent_action: "10-iteration cli-codex deep-research review complete. 18 distinct findings (1 P1, 17 P2) across all 010 + 010/007 + 011 surfaces. 33-closure systematic audit: 20 in code, 8 doc-only, 5 contradicted. Final convergence 0.93."
    next_safe_action: "Plan + scaffold 010/008-closure-integrity-and-pathfix-remediation (P1 + 8 P2) and optionally 010/009-test-rig-adversarial-coverage (4 P2)."
    blockers: []
    key_files:
      - "research.md"
      - "resource-map.md"
      - "008-deep-research-review-pt-01/iterations/iteration-001.md"
      - "008-deep-research-review-pt-01/iterations/iteration-002.md"
      - "008-deep-research-review-pt-01/iterations/iteration-003.md"
      - "008-deep-research-review-pt-01/iterations/iteration-004.md"
      - "008-deep-research-review-pt-01/iterations/iteration-005.md"
      - "008-deep-research-review-pt-01/iterations/iteration-006.md"
      - "008-deep-research-review-pt-01/iterations/iteration-007.md"
      - "008-deep-research-review-pt-01/iterations/iteration-008.md"
      - "008-deep-research-review-pt-01/iterations/iteration-009.md"
      - "008-deep-research-review-pt-01/iterations/iteration-010.md"
      - "008-deep-research-review-pt-01/deep-research-state.jsonl"
    completion_pct: 100
---
# Deep Research: Phase 010 + 010/007 + 011 Independent Review

<!-- ANCHOR:research-summary -->

## 1. EXECUTIVE SUMMARY

A 10-iteration deep-research review (cli-codex gpt-5.5 high fast, fresh-context per iteration) audited every system shipped under Phase 010 (sub-phases 001-006), the 010/007 remediation pass (T-A through T-F, claiming 33 closed findings), and the 011 manual-testing-playbook coverage follow-up (4 scenarios extended + 17 new vitest cases).

**Headline verdict:** 0 P0 regressions, 1 reachable P1, 17 distinct P2 issues. 010/007's claimed 33 closures: 20 closed-in-code, 8 intended-doc-only (T-B sync), 5 contradicted-by-code. Final convergence 0.93.

**The single P1 (D1):** `detect_changes` validates only the chosen post-image diff path; an attacker can pair `--- a/../../etc/passwd` with `+++ b/src/safe.ts` and slip past the canonical-root containment check. The 010/007/T-D R-007-3 hardening test only covered both-side escapes.

**5 closure-integrity gaps against 010/007 claims:**
1. **R-007-P2-4** — `limit + 1` overflow detection: documented but mechanism not implemented as specified
2. **R-007-8** — `conflicts_with` reject: only Python compiler enforces; TS normalizer still accepts
3. **R-007-13** — claim "3/3 SQL pipeline tests pass" misrepresents actual mix (2 SQL + 1 formatter pass-through)
4. **R-007-17** — tool-count canonicalization (51) incomplete: SKILL.md still 48/47, INSTALL_GUIDE 43, mcp_server README omits 11 tools, feature_catalog 43
5. **R-007-3** — path canonicalization tight on both-side escape but loose on mixed headers (the P1 above)

**Recommended remediation:** two follow-up sub-phases — `010/008-closure-integrity-and-pathfix-remediation` (P1 + 8 P2 = closure repair) and `010/009-test-rig-adversarial-coverage` (4 P2 = test-add).

<!-- /ANCHOR:research-summary -->

---

## 2. RESEARCH CHARTER

### Scope under review
- **010/001** clean-room license audit
- **010/002** phase-DAG runner + `detect_changes` MCP preflight
- **010/003** code-graph edge `reason`/`step` + `blast_radius` enrichment (depthGroups, riskLevel, minConfidence, ambiguityCandidates, failureFallback.code)
- **010/004** skill-advisor affordance evidence (denylist, debug counters, conflicts_with reject)
- **010/005** memory causal trust display (merge-per-field, age allowlist, DI seam, cache invalidation)
- **010/006** docs and catalogs rollup (root README, SKILL.md, mcp_server README/INSTALL_GUIDE)
- **010/007** review remediation T-A..T-F (claimed 33 closed findings)
- **011** manual-testing-playbook coverage (4 scenarios + 17 new vitest cases + fixture fix)

### Key research questions
- **RQ1**: P0/P1 regressions in 010/001-006 the 010/007 pass missed?
- **RQ2**: 33 closed findings genuinely closed, or doc-edit-only papering?
- **RQ3**: 010/007 hardenings tight at adversarial boundaries?
- **RQ4**: Umbrella docs match code reality?
- **RQ5**: 011 tests sufficient to detect regressions?

### Method
- 10 iterations, cli-codex gpt-5.5 high fast, fresh context per iteration
- Each iteration produced source-cited findings + JSONL delta
- Convergence: hard stop at iter 10; soft converge target 0.05 delta + no new P0/P1 for 2 iters
- Iteration 8 was the systematic 33-closure audit; iteration 10 was synthesis

---

## 3. CONVERGENCE TRAJECTORY

| Iter | Focus | Findings | Convergence |
|---|---|---|---|
| 1 | 010/001 + 010/002 phase-runner + detect_changes | 5 (1 P1 + 4 P2) | 0.42 |
| 2 | 010/002 input validation defensive audit | 5 (1 P1 confirmed + 4 P2) | 0.50 |
| 3 | 010/003 reason/step + blast_radius enrichment | 3 P2 | 0.60 |
| 4 | 010/003 minConfidence + 5 failureFallback codes (verify F12) | 3 P2 (F12 confirmed) | 0.68 |
| 5 | 010/004 affordance denylist + counters | 3 P2 | 0.62 |
| 6 | 010/005 trust-badge + cache invalidation | 3 P2 | 0.74 |
| 7 | 010/006 umbrella docs vs code | 5 P2 | 0.79 |
| 8 | 010/007 33-closure systematic audit | 0 new (confirmed prior) | 0.84 |
| 9 | 011 test rig adversarial completeness | 5 P2 | 0.88 |
| 10 | Cross-cutting synthesis + A/A/R/D matrix | 0 new (consolidated) | **0.93** |

The iter-8 zero-new-finding signal was the strongest convergence indicator: a systematic recheck of all 33 closures surfaced no new contradictions beyond those caught in iters 1-7.

---

## 4. CUMULATIVE FINDING INVENTORY (DEDUPLICATED)

28 raw finding IDs collapse to 18 distinct issues after grouping repeats, follow-up confirmations, and test/doc mirrors:

| ID | Raw | First | Sev | Remediation | RQ | Action | Owner |
|---|---|---|---|---|---|---|---|
| **D1** | F1/F6/F24 | iter 1 | **P1** | code-fix + test-add | RQ1/RQ3/RQ5 | ADOPT | 010/008 |
| D2 | F2/F7 | iter 1 | P2 | code-fix | RQ3 | DEFER | future |
| D3 | F3/F10 | iter 1 | P2 | code-fix | RQ3 | DEFER | future |
| D4 | F4 | iter 1 | P2 | test-add | RQ5 | ADOPT | 010/009 |
| D5 | F5 | iter 1 | P2 | doc-fix | RQ4 | ADOPT | 010/008 |
| D6 | F8/F9 | iter 2 | P2 | code-fix + test-add | RQ3/RQ5 | DEFER | future |
| D7 | F11/F25 | iter 3 | P2 | code-fix + test-add | RQ3/RQ5 | ADOPT | 010/008 |
| D8 | F12 | iter 3 | P2 | code-fix or doc-fix | RQ2 | ADOPT | 010/008 |
| D9 | F13-iter3 | iter 3 | P2 | doc-fix | RQ4 | ADOPT | 010/008 |
| D10 | F14-iter4/F15-iter4 | iter 4 | P2 | test-add | RQ5 | ADOPT | 010/009 |
| D11 | F13-iter5 | iter 5 | P2 | test-add/code-fix | RQ3/RQ5 | ADAPT | future |
| D12 | F14-iter5/F27 | iter 5 | P2 | code-fix + test/doc | RQ2/RQ3/RQ5 | ADOPT | 010/008 |
| D13 | F15-iter5 | iter 5 | P2 | test-add/doc-fix | RQ2/RQ5 | ADAPT | 010/008 |
| D14 | F16/F18 | iter 6 | P2 | test-add | RQ3/RQ5 | ADOPT | 010/009 |
| D15 | F17 | iter 6 | P2 | doc-fix or test-add | RQ2/RQ5 | ADOPT | 010/008 |
| D16 | F19-F23 | iter 7 | P2 | doc-fix | RQ4 | ADOPT | 010/008 |
| D17 | F26 | iter 9 | P2 | test-add | RQ5 | ADOPT | 010/009 |
| D18 | F28 | iter 9 | P2 | scope-defer | RQ5 | DEFER | polish |

**Aggregate:** 0 P0 | **1 P1** (D1) | 17 P2 | ADOPT 12 | ADAPT 2 | REJECT 0 | DEFER 4

---

## 5. THE P1 IN DETAIL

### D1 — `detect_changes` mixed-header path-containment bypass

**Severity:** P1 (security-relevant)
**RQ:** RQ1 + RQ3 + RQ5

**The gap:** `mcp_server/code_graph/handlers/detect-changes.ts:141-156` (`resolveCandidatePath`) chooses `newPath` unless it's `/dev/null`, never validating the unused `oldPath`. A unified diff with header `--- a/../../etc/passwd` paired with `+++ b/src/safe.ts` slips through the canonical-root containment check because only `newPath` is validated.

**Evidence:**
- `mcp_server/code_graph/handlers/detect-changes.ts:118-124` — comments declare diff paths as untrusted; require `../../etc/passwd` and absolute `/etc/passwd` rejected explicitly.
- `mcp_server/code_graph/handlers/detect-changes.ts:141-156` — `resolveCandidatePath` validates only the chosen path.
- `mcp_server/code_graph/tests/detect-changes.test.ts:185-196` — existing test only covers both-side-escape.
- `mcp_server/code_graph/tests/detect-changes.test.ts:175-230` — adversarial path suite is incomplete on this dimension (confirmed by iter 9).

**Why it matters:** The 010/007/T-D R-007-3 closure claimed canonical-root containment was tight. It's tight for both-side escapes but loose for mixed headers. An attacker who can supply diff input can attribute changes to paths inside the workspace while pre-image headers escape.

**Suggested fix:** Validate both `oldPath` and `newPath` independently, ignoring only `/dev/null`, before choosing the attribution path. Add mixed-header tests for escaping-old/in-root-new and in-root-old/escaping-new.

---

## 6. CLOSURE-INTEGRITY GAPS (5 of 33)

The 33-closure audit (iter 8) classified 5 closures as CONTRADICTED-BY-CODE. Each is a concrete claim in 010/007 implementation-summary that does not match the shipped code:

### D8 — R-007-P2-4 `limit + 1` overflow detection

**Claim** (010/007/T-F implementation-summary): `query.ts` requests `limit + 1` rows from SQL to detect true overflow.

**Code reality**: The mechanism is implemented differently. Iter 4 confirmed the documented mechanism vs actual mechanism diverge. Either correct the doc or change the implementation to match.

### D12 — R-007-8 `conflicts_with` reject (TS/PY parity)

**Claim** (010/007/T-D implementation-summary): `conflicts_with` rejected as reserved field in affordance derived inputs.

**Code reality**: The Python compiler (`skill_graph_compiler.py`) rejects via `AFFORDANCE_REJECTED_RELATION_FIELDS`. The TypeScript normalizer (`affordance-normalizer.ts`) does not enforce the same rule — TS callers passing `conflicts_with` still produce affordance edges that Python would reject.

### D15 — R-007-13 trust-badges DI test count

**Claim** (010/007/T-E implementation-summary): "3/3 SQL pipeline tests pass after DI fix."

**Code reality**: `tests/memory/trust-badges.test.ts` has 3 tests but only 2 exercise the SQL pipeline directly; the third is a formatter pass-through that does not depend on SQL bind-type coercion. The fix landed correctly; the test-count claim is precise-tense wrong.

### D16 — R-007-17 tool-count canonicalization

**Claim** (010/007/T-F implementation-summary): "51 spec_kit_memory tools, synced across all umbrella docs."

**Code reality**: Synced in root README (lines 7, 56, 1261, 1281, 1301, 677). NOT synced in:
- `system-spec-kit/SKILL.md` — still claims 48/47 in places
- `mcp_server/INSTALL_GUIDE.md` — still claims 43
- `mcp_server/README.md` — detailed tool reference omits 11 of 51 entries
- `feature_catalog` command-surface paragraph — still says 43

### D5 — R-007-1 010/001 license docs (related drift, P2)

**Claim** (010/007/T-B): post-scrub state synced; LICENSE quote no longer needed.

**Code reality**: Implementation-summary updated. But original 010/001 spec.md still requires reading and quoting `external/LICENSE`; the ADR still labels a canonical PolyForm block as "verbatim." The post-scrub mitigation is the controlling defensible posture, but the packet retains stale "verbatim quote" claims that contradict it.

---

## 7. RQ-BY-RQ VERDICTS

| RQ | Verdict | Confidence | Evidence |
|---|---|---|---|
| **RQ1** P0/P1 in 010/001-006 | ANSWERED | 0.95 | 1 P1 (D1), 0 P0; no late high-severity surprises after iter 2. |
| **RQ2** 33 closures genuinely closed | MOSTLY-ANSWERED | 0.90 | 20/33 closed-in-code, 8/33 intended-doc-only, 5/33 contradicted (D1, D8, D12, D15, D16). |
| **RQ3** Hardenings tight at boundaries | ANSWERED with bounded gaps | 0.88 | Most boundaries code-backed. Open: D1 (P1), D7 (malformed JSON), D11 (obfuscated injection), D12 (TS parity). Deferred: D2/D3/D6. |
| **RQ4** Docs match code | ANSWERED | 0.94 | Drift well-bounded and P2: D5 license, D9 riskLevel threshold, D16 tool-count. No new P0/P1. |
| **RQ5** 011 tests sufficient | ANSWERED | 0.90 | Test-add list bounded: D1, D4, D7, D10, D12, D14, D17. D18 deferred polish. |

---

## 8. ADOPT / ADAPT / REJECT / DEFER MATRIX

### ADOPT (P1 + closure-critical P2 — must close in next packet)

| Distinct | Severity | Owner | Type |
|---|---|---|---|
| D1 mixed-header path bypass | **P1** | 010/008 | code-fix + test-add |
| D4 phase-runner duplicate-output regression test | P2 | 010/009 | test-add |
| D5 010/001 license docs stale | P2 | 010/008 | doc-fix |
| D7 malformed metadata JSON sanitizer coverage | P2 | 010/008 | code-fix + test-add |
| D8 R-007-P2-4 limit+1 mechanism mismatch | P2 | 010/008 | code-fix OR doc-fix |
| D9 riskLevel depth-one count 10 undocumented | P2 | 010/008 | doc-fix |
| D10 failureFallback.code + minConfidence handler tests | P2 | 010/009 | test-add |
| D12 conflicts_with TS parity + playbook 199 claim | P2 | 010/008 | code-fix + test-add/doc |
| D14 trust-badge partial overlay + age boundary tests | P2 | 010/009 | test-add |
| D15 R-007-13 SQL test-count claim | P2 | 010/008 | doc-fix OR test-add |
| D16 tool-count canonicalization complete sweep | P2 | 010/008 | doc-fix |
| D17 R-007-12 cache-key memory_search semantics | P2 | 010/009 | test-add |

### ADAPT (P2 — accept with scope adjustment)

| Distinct | Adjustment |
|---|---|
| D11 obfuscated injection variants | Adopt bounded scope: regex synonyms + zero-width-norm if cheap; document that semantic / multilingual / encoded-payload coverage is NOT guaranteed |
| D13 dropped_unsafe counter permanently zero | Either rename + document as reserved, OR define a stable unsafe-drop event and increment only there. Avoid inventing broad unsafe semantics. |

### REJECT

None. No finding turned out to be a false positive.

### DEFER (legitimate but lower priority)

| Distinct | Defer-to |
|---|---|
| D2 diff path byte-safety contract (NUL/control/backslash/length) | Future diff hardening packet |
| D3 phase-runner exported-API runtime-key validation | Future phase-runner hardening |
| D6 hunk completeness + rename/copy diff handling | Future diff parser completeness packet |
| D18 fixture corpus near-duplicate pairs | Polish backlog (only if duplicate-threshold flake recurs) |

---

## 9. RECOMMENDED FOLLOW-UP SUB-PHASES

### `010/008-closure-integrity-and-pathfix-remediation` (must-do)

Closes: **D1 (P1), D5, D7, D8, D9, D12, D13, D15, D16** = 9 distinct issues = ~13 raw findings.

**Mix:** 1 P1 code-fix + ~5 P2 doc-fix sweeps + ~3 P2 code-fixes.

**Why this packet exists:** Contains the only P1 plus all closure-contradiction repairs that could make the 010/007 closure record misleading to future operators reading implementation-summary.md.

**Scope:**
- code-fix: detect_changes mixed-header containment validation (D1)
- code-fix: malformed metadata JSON sanitizer + parse-error coverage (D7)
- code-fix or doc-fix decision for D8 (limit+1 mechanism)
- code-fix: TS conflicts_with rejection parity with Python (D12)
- doc-fix: 010/001 license posture wording + ADR alignment (D5)
- doc-fix: riskLevel threshold documentation (D9)
- doc-fix: tool-count sweep across SKILL.md/INSTALL_GUIDE/mcp_server README/feature_catalog (D16)
- doc-fix or test-add for D15 (R-007-13 SQL test-count claim)
- test-add or doc-fix for D13 (dropped_unsafe counter semantics)

### `010/009-test-rig-adversarial-coverage` (recommended)

Closes: **D4, D10, D14, D17** plus regression-detection tests for D1/D7/D12 if not already in 010/008.

**Mix:** All test-add. Mostly handler-level vitest cases.

**Why a separate packet:** Test rig expansion benefits from independent review; folding into 010/008 is acceptable if cycle time matters more than separation.

**Scope:**
- phase-runner duplicate-output regression test (D4)
- failureFallback.code 5-trigger handler test + minConfidence runtime boundary test (D10)
- trust-badge partial overlay + age-label boundary cases (D14)
- R-007-12 memory_search end-to-end cache-key change test + enableCausalBoost gating test (D17)
- Cross-coverage tests for D1/D7/D12 if needed beyond what 010/008 produces

### Future backlog (DEFER)

- Diff hardening packet for D2 + D6
- Phase-runner exported-API hardening for D3
- Bounded affordance-obfuscation hardening for D11 (depends on threat-model breadth decision)
- Fixture polish for D18

---

## 10. NEGATIVE CONVERGENCE (CLEAN SURFACES)

Important for future operators — these surfaces came up clean across all 9 audit iterations:

- **Runtime scrub (010/001)**: zero `GitNexus`/`gitnexus` hits in shipped runtime paths. Stale wording is in spec docs only.
- **Phase runner (010/002)**: rejects duplicate phase names, duplicate output keys, output/name collisions, and cycles. Open issue is exported-API runtime key validation only.
- **detect_changes readiness (010/002)**: fail-closed for non-fresh graph states; does not inline-index during diff handling.
- **Diff parser per-file counters (010/002)**: prevent next file's `--- a/` header from being eaten as hunk body. Open issues are completeness/rename/copy attribution, not greedy multi-file corruption.
- **Blast-radius exact-limit runtime behavior (010/003)**: response is correct (matches docs at the field level). The closure issue is narrow: the documented `limit + 1` *mechanism* doesn't match implementation, plus missing boundary tests.
- **Affordance routing (010/004)**: `derived_generated` + `graph_causal` lanes are the only paths; raw matched phrases do NOT surface in recommendation evidence. Privacy contract intact.
- **Trust-badge core wiring (010/005)**: per-field merge, DB getter seam, bind-side string casting, failure-reason shape, and non-causal cache-key exclusion all implemented and code-backed.
- **Root README + system-spec-kit/README.md (010/006)**: mostly match the shipped 51-tool surface. Drift concentrates in SKILL.md, INSTALL_GUIDE, mcp_server README detail sections, and feature catalog.
- **Iter-8 zero-new-findings signal**: systematic recheck of all 33 closures surfaced no new contradictions beyond those already caught in iters 1-7. Strongest convergence indicator in the run.

---

## 11. METHODOLOGY NOTES

### Iteration prompt evolution
- Iter 1: free-form audit by sub-phase
- Iter 2 (initial): rejected by codex content-filter on adversarial-input language. **Lesson:** defensive-audit framing matters; "construct adversarial input" reads as attack-planning. Reframed as "verify the code rejects these inputs."
- Iter 2 (retry): rejected because `...` in paths read as placeholders. **Lesson:** absolute paths only when feeding cli-codex.
- Iters 3-9: HANDLED-vs-GAP checklist format with explicit per-item file:line citation requirement. Worked well.
- Iter 8: tasked with the 33-closure systematic audit explicitly; given larger tool budget (12/16). Highest-value iteration of the run — confirmed which previous findings were real and surfaced no new ones.
- Iter 10: synthesis-only; no new investigation; produced the A/A/R/D matrix.

### Convergence detection
- Hard stop: iter 10 reached
- Soft converge target: 0.05 delta + no new P0/P1 for 2 iters — would have triggered after iter 8 (zero new findings)
- Final score 0.93 leaves room for one missed adversarial dimension; not certified as 1.0

### What the executor missed
- Did not run the actual vitest/pytest suite during iterations (read-only audit).
- Did not exercise the runner against live MCP server.
- Did not investigate cross-repo dependencies (assumed shipped code in `mcp_server/` is the surface under audit).

---

## 12. SOURCE INDEX

All findings carry file:line citations from the shipped code on `main`. Primary files referenced across the 10 iterations:

**Code Graph package:**
- `mcp_server/code_graph/handlers/detect-changes.ts` (lines 100-280, esp. 118-124, 141-156, 193-226)
- `mcp_server/code_graph/handlers/query.ts` (lines 600-1500, esp. 614-635, 859-897, 1048-1058, 1121-1135)
- `mcp_server/code_graph/lib/diff-parser.ts` (lines 109-220)
- `mcp_server/code_graph/lib/phase-runner.ts` (lines 31-235)
- `mcp_server/code_graph/lib/structural-indexer.ts` (lines 1248-1547, esp. 1369-1525)
- `mcp_server/code_graph/lib/code-graph-db.ts` (lines 756-805 for sanitizer + rowToEdge)
- `mcp_server/code_graph/lib/code-graph-context.ts` (lines 287-320 for formatContextEdge)

**Skill Advisor package:**
- `mcp_server/skill_advisor/lib/affordance-normalizer.ts` (lines 59-73 denylist, 153-157 counters)
- `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` (lines 45-78 conflicts_with, 78-101 denylist, 407 counters, 470 validate_derived_affordances)

**Memory package:**
- `mcp_server/formatters/search-results.ts` (lines 235-360 trust-badge merge + age allowlist + DI seam + fetch-result shape)
- `mcp_server/lib/storage/causal-edges.ts` (lines 159-171 generation counter)
- `mcp_server/lib/search/search-utils.ts` (CacheArgsInput.causalEdgesGeneration)
- `mcp_server/handlers/memory-search.ts` (generation read + thread)

**Tests:**
- `mcp_server/code_graph/tests/detect-changes.test.ts` (existing + 011 adversarial cases)
- `mcp_server/code_graph/tests/phase-runner.test.ts`
- `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts`
- `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`
- `mcp_server/code_graph/tests/edge-metadata-sanitize.test.ts` (011-added)
- `mcp_server/tests/causal-edges-unit.vitest.ts` (R-007-12 cases)
- `mcp_server/tests/memory/trust-badges.test.ts` (T-E DI rig)
- `mcp_server/skill_advisor/tests/affordance-normalizer.test.ts`
- `mcp_server/skill_advisor/tests/python/test_skill_advisor.py`

**Docs:**
- `README.md` (root)
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `010/{001-006}/spec.md` + `implementation-summary.md` + `decision-record.md`
- `010/007-review-remediation/implementation-summary.md`
- `011-manual-testing-playbook-coverage-and-run/implementation-summary.md`

---

## 13. ITERATION ARTIFACT INDEX

Per-iteration findings, deltas, logs, and prompts are preserved at:

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/`

| File | Content |
|---|---|
| `strategy.md` | Research charter, per-iteration focus rotation, convergence detection |
| `deep-research-config.json` | Frozen config (executor, RQs, non-goals, stop conditions) |
| `deep-research-state.jsonl` | Append-only event log (init + 10 iteration_complete events) |
| `prompts/iteration-{001..010}.md` | Per-iteration cli-codex prompts |
| `iterations/iteration-{001..010}.md` | Per-iteration findings (verdict tables, citations, RQ coverage) |
| `deltas/iteration-{001..010}.jsonl` | Per-iteration JSONL deltas (severity counts, finding IDs) |
| `logs/iteration-{001..010}.log` | Raw cli-codex outputs |

---

## 14. NEXT ACTIONS

1. **Plan + scaffold** `010/008-closure-integrity-and-pathfix-remediation` (Level 2 spec folder) covering D1, D5, D7, D8, D9, D12, D13, D15, D16. ~13 raw findings, mixed code/doc/test.
2. **Optionally plan + scaffold** `010/009-test-rig-adversarial-coverage` (Level 2) covering D4, D10, D14, D17.
3. **Defer**: D2, D3, D6, D11, D18 to future packets per their owner column.
4. **Update** 010/007 implementation-summary.md to acknowledge 5 contradicted closures (so the closure record is honest going forward).

---

## 15. CONFIDENCE STATEMENT

The 10-iteration review answered all five RQs with source-cited evidence from the iteration artifacts. Confidence is **high** for the P0/P1 verdict (one P1 reachable, zero P0), the 33-closure aggregate (verified twice — iter 1-7 and iter 8 systematic re-check), and the doc-drift inventory.

Confidence is **medium-high** for the P2 backlog prioritization because several items are policy-shaped: D8 (limit+1) can be fixed in code or corrected in docs; D15 (SQL test count) can be fixed by adding a third SQL test or by claim correction; D11 (obfuscated injection) depends on how broad the sanitizer threat model should become.

The single biggest unresolved P2 is **D8 (R-007-P2-4)**: the documented mechanism vs implementation gap should be settled by either (a) wiring a true `limit + 1` SQL request, or (b) updating the implementation-summary to describe the actual mechanism. The team's choice depends on whether the boundary case the documented mechanism was meant to detect is genuinely caught by the actual implementation — that's a small additional verification step recommended for the 010/008 packet.

---

## 16. APPENDIX — RAW CONVERGENCE DELTAS

```
iter 1: 0.42  (5 findings: 1 P1 + 4 P2)
iter 2: 0.50  (5 findings: 1 P1 confirmed + 4 P2)
iter 3: 0.60  (3 findings: 3 P2)
iter 4: 0.68  (3 findings: 3 P2; F12 confirmed)
iter 5: 0.62  (3 findings: 3 P2; slight dip on TS/PY parity finding)
iter 6: 0.74  (3 findings: 3 P2)
iter 7: 0.79  (5 findings: 5 P2 doc drift)
iter 8: 0.84  (0 new findings; systematic 33-closure verification)
iter 9: 0.88  (5 findings: 5 P2 test rig)
iter 10: 0.93 (synthesis)

raw findings: 28
distinct after dedup: 18
```

---

## 17. END

`STATUS=OK | iterations=10 | total_findings=18 | P0=0 | P1=1 | P2=17 | adopt=12 | adapt=2 | reject=0 | defer=4 | convergence=0.93`
