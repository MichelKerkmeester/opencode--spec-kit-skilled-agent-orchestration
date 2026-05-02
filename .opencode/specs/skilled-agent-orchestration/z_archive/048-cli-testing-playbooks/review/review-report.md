---
title: "Deep Review Report: 048 CLI Testing Playbooks"
description: "Canonical synthesis of a 5-iteration deep review of spec 048 (CLI testing playbooks + HVR pass + section rename) executed via cli-copilot/gpt-5.5/high. Final verdict: FAIL — multiple independent P0 blockers across correctness, security, traceability, and maintainability dimensions."
---

# Deep Review Report: 048 CLI Testing Playbooks

## 1. METADATA

| Field | Value |
|---|---|
| Spec folder | `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/` |
| Iterations | 5/5 (hard cap, no early-convergence stop) |
| Executor | cli-copilot · gpt-5.5 · effort=high |
| Dimensions | correctness, security, traceability, maintainability, cross-cutting |
| Verdict | **FAIL** |
| Findings total | 31 (14 P0 + 15 P1 + 2 P2) |

---

## 2. RELEASE-READINESS VERDICT

**FAIL** — the deliverable is not ready to claim COMPLETE.

| Success Criterion | Status |
|---|---|
| SC-001 (validators exit 0) | PARTIAL — root validators pass but per-feature 9-col tables are structurally broken |
| SC-002 (115 per-feature files linked) | PASS |
| SC-003 (cross-CLI invariants 01/06/07) | PARTIAL — names/positions match but cat 06 content drifts so the invariant is cosmetic |
| SC-004 (spec strict validation exit 0) | FAIL — `validate.sh ... --strict` still exits 1 with 5 errors |
| SC-005 (memory save) | PARTIAL — files present but status metadata advertises `complete` while blockers are open |

Any single confirmed P0 blocks PASS. This review has multiple independent P0s across four dimensions.

---

## 3. P0 PUNCH LIST (PRIORITIZED)

1. **[security] Make destructive cli-opencode `--share` scenarios safe by default.** CO-026, CO-027, CO-028 contain runnable `opencode run --share --port ... --dir /Users/michelkerkmeester/MEGA/Development/...` flows with insufficient sandboxing, confirmation, and teardown. They can publish live share sessions from the operator's real project tree. Sandbox + gate + document recovery before release.
2. **[correctness] Restore the 9-column per-feature scenario table contract.** 51 bad scenario rows across cli-claude-code (1), cli-codex (24), cli-copilot (19), cli-gemini (7) due to unescaped shell/regex pipes inside table cells. Escape pipes (`\|`), or move pipe-bearing commands out of table cells, or rephrase. cli-opencode (0/31) is the clean baseline.
3. **[correctness] Make spec-folder strict validation pass, OR formally revise SC-004.** `validate.sh ... --strict` still exits failed with `SPEC_DOC_INTEGRITY` (20 issues), `TEMPLATE_SOURCE` (5 missing), and `TEMPLATE_HEADERS` (5 deviations). The "known limitation" waiver in implementation-summary.md does not satisfy the written success criterion.
4. **[maintainability] Re-run HVR cleanup or honestly amend the false protected-zone claim.** Iter-4 found 29 non-protected body-text HVR hits. Iter-3 found published residual counts materially wrong. The implementation-summary cannot be used as release evidence in its current state.
5. **[traceability] Correct the section-rename evidence and metadata.** implementation-summary.md says 504 files carry `## 2. SCENARIO CONTRACT`. Iter-5 fresh sweep counts **592** (`.opencode` repo-wide) and 590 (manual_testing_playbook scope). Stale by 18%. Update or regenerate.
6. **[traceability] Resolve canonical prompt + source-anchor blockers.** CO-006 has two competing canonical prompts (3-way prompt-sync drift). CX-004 cites `~/.claude/projects/...` ellipsis path that does not resolve to a real source.
7. **[correctness] Reconcile the root-playbook H2 invariant.** spec.md asks for "10-section root scaffold". Delivered roots have 14, 15, 16, 16, 17 numbered H2s because category sections expand the scaffold. Either change the invariant to allow expansion, or restructure roots to satisfy the literal contract.

---

## 4. P1 PUNCH LIST (PRIORITIZED)

1. **Stop advertising the packet as complete.** Update `implementation-summary.md` continuity (`completion_pct: 100`, `blockers: []`, `recent_action: "Closed out"`) and `graph-metadata.json` `status: complete` to in-progress while P0/P1 remain open.
2. **Update the 2 missed source-of-truth files.** `.opencode/command/create/assets/create_testing_playbook_auto.yaml:167-172` and `create_testing_playbook_confirm.yaml:181-186` still require feature files to contain `## 2. CURRENT REALITY`. The section rename pass missed these YAML workflows.
3. **Add explicit recovery + cleanup evidence for non-`--share` destructive scenarios.** CP-020, CP-021, CP-008, CP-013, CX-007 lack cloud/sandbox/state cleanup branches.
4. **Remove or quarantine the runnable Codex negative control.** CX-004 normalizes a command without `service_tier="fast"` while claiming to enforce that auto-memory rule.
5. **Close or explicitly defer documented CLI surface coverage gaps.** cli-claude-code (5 missing agents + cost/background); cli-codex (research/write profiles + `codex cloud`); cli-gemini (`@debug`); cli-opencode (deep-research, deep-review, orchestrate).
6. **Link CHK-040/041/042 to ADR-001.** Checklist rows verify ADR-001 invariants but do not cite the ADR.
7. **Clarify category-06 invariant contract.** Same numeric slot across CLIs, but content mixes materially different lessons.
8. **Decide root-prompt-text contract.** 76 root prompt entries drift from per-feature canonical prompts. Either rename to `Prompt summary` with looser rule, or generate from per-feature sources.

---

## 5. P2 SUGGESTIONS

1. Replace hard-coded personal repo paths in cli-opencode playbook examples with `<repo-root>` or `REPO_ROOT="$(pwd)"` where the live operator path is not essential.

---

## 6. CLEAN CHECKS (CONFIRMED PASSING)

| Check | Result |
|---|---|
| Root playbook `validate_document.py` exit 0 | PASS for all 9 (5 cli-* + 4 mcp-* + system-spec-kit + sk-deep-research + sk-deep-review + sk-improve-agent + skill_advisor nested) |
| Per-feature link integrity | PASS — 115/115 links resolve, 0 broken |
| Feature-ID count parity in 5 cli-* playbooks | PASS — CC=20, CX=25, CP=21, CG=18, CO=31 |
| Forbidden sidecars | PASS — zero `review_protocol.md` / `subagent_utilization_ledger.md` / `snippets/` across all 14 playbook trees |
| Cross-CLI category positions (01/06/07) | PASS for names/positions (semantic content drift recorded as P1) |
| No leaked secrets / API keys / credentials | PASS — security iter found none |
| Self-invocation guard documentation (CO-008, CO-031, CP-001) | PASS |
| ADR-004 cross-AI handback isolation | PASS in scenario contracts |
| Codex `service_tier="fast"` flag presence in command sequences | PASS in 25/25 scenarios (negative control CX-004 is the P1 issue) |
| cli-copilot 3-concurrent dispatch cap documented | PASS |
| Section rename — old `CURRENT REALITY` headings outside legitimate feature-catalog/spec-history contexts | PASS — only 2 stragglers (the YAML files in P1-2) |

---

## 7. ITERATION SUMMARIES

| Iter | Dimension | New P0 | New P1 | New P2 | Key finding |
|---|---|---|---|---|---|
| 1 | correctness | 6 | 0 | 0 | 51 broken 9-col rows due to unescaped pipes |
| 2 | security | 3 | 6 | 1 | unsafe `--share` flows on operator project tree |
| 3 | traceability | 4 | 5 | 1 | CO-006 prompt mismatch + stale counts |
| 4 | maintainability | 1 | 3 | 0 | false HVR protected-zone classification |
| 5 | cross-cutting | 0 | 1 | 0 | completion metadata falsely reports complete |

---

## 8. NEXT STEPS

| If goal | Recommended command |
|---|---|
| Plan remediation | `/spec_kit:plan` against this report |
| Implement P0 fixes | `/spec_kit:implement` after plan |
| Re-review after fixes | `/spec_kit:deep-review:auto` (same target) to verify P0 closures |

This review is READ-ONLY — no fixes were applied during the loop. The deliverable remains in its post-rename state. Remediation is a separate work stream.

---

## 9. ARTIFACTS

- Strategy: `review/deep-review-strategy.md`
- Dashboard: `review/deep-review-dashboard.md`
- State log: `review/deep-review-state.jsonl`
- Findings registry: `review/deep-review-findings-registry.json`
- Iteration files: `review/iterations/iteration-001.md` through `iteration-005.md`
- Iteration prompts: `review/prompts/iteration-001-prompt.md` through `iteration-005-prompt.md`
