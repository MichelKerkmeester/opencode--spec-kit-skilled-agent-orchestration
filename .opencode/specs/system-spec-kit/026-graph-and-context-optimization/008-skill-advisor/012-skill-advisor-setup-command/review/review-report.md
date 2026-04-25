---
title: "Deep Review Report: 012-skill-advisor-setup-command"
description: "7-iteration deep-review run via cli-copilot gpt-5.5 high. CONDITIONAL verdict: 0 P0, 25 P1, 5 P2 across correctness, security, traceability, maintainability."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v2.2 -->"
trigger_phrases:
  - "012-skill-advisor-setup-command review report"
  - "skill advisor setup command deep review"
importance_tier: "important"
contextType: "review"
---
# Deep Review Report: 012-skill-advisor-setup-command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v2.2 -->

---

## 1. Executive Summary

Seven iterations of cli-copilot gpt-5.5 (reasoningEffort=high) audited the new `/spec_kit:skill-advisor` command, both YAML workflows, the install guide, the parent README updates, and the spec-folder packet docs. The packet ships clean of P0 blockers but carries a substantial P1 backlog concentrated in five recurring patterns: mutation-boundary enforcement gaps, rollback safety, dry-run contract drift, metadata schema drift, and approval/scope wiring. None of the P1s prevents merge in their current form; all are fixable as a follow-up remediation pass.

Convergence achieved (`newFindingsRatio=0.033`, well below the 0.10 threshold) but stop_reason is `max_iterations` because the loop ran the full 7 by design. All four configured dimensions (correctness, security, traceability, maintainability) received at least one full pass. Two iterations (003 and 006) produced their three-artifact payloads only inside their dispatch logs; canonical iteration files have been recovered post-loop and are now in place.

---

## 2. Verdict

| Field | Value |
|---|---|
| **Verdict** | CONDITIONAL |
| **hasAdvisories** | true |
| **stop_reason** | max_iterations (convergence threshold also satisfied) |
| **P0 outstanding** | 0 |
| **P1 outstanding** | 25 |
| **P2 outstanding** | 5 |
| **newFindingsRatio (iter 7)** | 0.0333 |
| **Dimensions covered** | correctness, security, traceability, maintainability |

---

## 3. Run Configuration

| Field | Value |
|---|---|
| Spec folder | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command` |
| Executor | cli-copilot |
| Model | gpt-5.5 |
| reasoningEffort | high |
| serviceTier | n/a (cli-copilot does not support it) |
| timeoutSeconds | 900 per iteration |
| maxIterations | 7 |
| convergenceThreshold | 0.10 |
| Wall-clock | 22m39s (16:54:40Z → 17:17:19Z) |
| Concurrency | sequential (each iteration depends on prior) |

---

## 4. Findings — Correctness (P1: 11, P2: 3)

### P1

| ID | Title | Origin | Files |
|---|---|---|---|
| **F-CORR-001** | No-suffix execution mode contract is contradictory (top-level says INTERACTIVE default, setup parser sets ASK + Q0) | iter 1 | skill-advisor.md:43,56 |
| **F-CORR-002** | Execution protocol tells runners to load YAML first, but the same file later says YAML loads only after setup passes | iter 1 | skill-advisor.md:11,193 |
| **F-CORR-003** | Dry-run behavior inconsistent: command says skip Phase 3 + Phase 4; YAML jumps to Phase 4 verify; proposal path alternates `/tmp/...` vs `scratch/...` | iter 1 | skill-advisor.md:185,187,225 + spec_kit_skill-advisor_auto.yaml:135,151 |
| **F-CORR-005** | Auto YAML names graph-metadata fields (`derived.triggers`, `derived.keywords`) that don't match the real schema (`derived.trigger_phrases`, `derived.key_topics`) | iter 2 | spec_kit_skill-advisor_auto.yaml:73-75 + projection.ts:234-240 |
| **F-CORR-006** | Mutation-boundary enforcement declared but Phase 3 has no concrete pre-write allowlist/denylist validation | iter 2 | spec_kit_skill-advisor_auto.yaml:49-58,132-148 |
| **F-CORR-007** | Graph-scan failure handling contradictory: hard post-verify gate vs partial-recovery in error_recovery | iter 2 | spec_kit_skill-advisor_auto.yaml:165-188,221 |
| **F-CORR-008** | Confidence framework not wired into proposal outputs or pre-apply gate; thresholds unenforceable | iter 2 | spec_kit_skill-advisor_auto.yaml:201-206,125-128,176-179 |
| **F-CORR-010** | Confirm mode inherits the same `derived.triggers`/`derived.keywords` field mismatch | iter 3 | spec_kit_skill-advisor_confirm.yaml:138-140 |
| **F-CORR-011** | Confirm `C <lane>` per-lane approval still flows into unconditional explicit/lexical/derived edits | iter 3 | spec_kit_skill-advisor_confirm.yaml:85-91,201-206 |
| **F-CORR-012** | post_phase_4 rollback option has no rollback action attached (auto + pre_phase_4 do; post does not) | iter 3 | spec_kit_skill-advisor_confirm.yaml:111,120-123 |
| **F-CORR-013** | pre_phase_4 gate allows verification choices even when build_status=failure | iter 3 | spec_kit_skill-advisor_confirm.yaml:99-111 |

### P2

| ID | Title | Origin |
|---|---|---|
| F-CORR-004 | Rollback wording inconsistent: `git checkout HEAD --` vs `git revert` across sections | iter 1 |
| F-CORR-009 | Scope filter asserted but Phase 3 activities written as unconditional edits across all lanes | iter 2 |
| F-CORR-014 | Per-skill loop's `C) Edit (provide replacement)` branch is user-visible but not machine-specified | iter 3 |

---

## 5. Findings — Security (P1: 5, P2: 1)

### P1

| ID | Title | Origin | Files |
|---|---|---|---|
| **F-SEC-001** | Autonomous proposal generation reads untrusted SKILL.md frontmatter without a data-only/prompt-injection boundary while granting Write/Edit/Bash/Task | iter 4 | skill-advisor.md:4 + spec_kit_skill-advisor_auto.yaml:14-15,85,120,136-138 |
| **F-SEC-002** | Mutation-boundary enforcement lacks canonical target-path validation (no `realpath`, no `..` rejection, no allowlist exact-match) | iter 4 | spec_kit_skill-advisor_auto.yaml:49-58,126-128,136-138,173-180 |
| **F-SEC-003** | Rollback uses broad `git checkout HEAD --` paths without clean-tree guard; can destroy unrelated WIP | iter 4 | skill-advisor.md:37 + spec_kit_skill-advisor_auto.yaml:149 + install guide:30-35,112-118 |
| **F-SEC-004** | Review runner grants `--allow-all-tools --no-ask-user` for nominally read-only review iterations | iter 4 | review/runner.sh:38-50 |
| **F-SEC-005** | Proposal diffs written to `/tmp/skill-advisor-proposal-*.md` without `umask 077`, `mktemp`, or `chmod 0600` | iter 4 | skill-advisor.md:185 + spec_kit_skill-advisor_auto.yaml:130 + install guide:129 |

### P2

| ID | Title | Origin |
|---|---|---|
| F-SEC-006 | TOKEN_BOOSTS / PHRASE_BOOSTS proposal validation is collision-only, not literal/schema-bounded before TS source edit | iter 4 |

### Confirmed non-issues
- No regex-injection path in current scorer (`PHRASE_BOOSTS` uses `lower.includes(phrase)`, phrase-boundary regex helper escapes dynamic input).
- `--scope` is a closed enum (`all|explicit|derived|lexical`), not a path traversal input.
- No hardcoded secrets in command markdown, YAMLs, or install guide.

---

## 6. Findings — Traceability (P1: 6, P2: 0)

| ID | Title | Origin | Verification |
|---|---|---|---|
| **F-TRACE-001** | Packet markdown docs still contain relative `.md` references despite the full repo-rooted path contract | iter 5 | spec.md:49-51 + tasks.md:103-106 + plan.md:20-22 + checklist.md:19-22 + implementation-summary.md:87-90 |
| **F-TRACE-002** | `graph-metadata.json` `derived.key_files` and `derived.entities[].path` mix repo-rooted with bare paths (`tasks.md`, `spec.md`) | iter 5 | graph-metadata.json:65,167-180,201-210 |
| **F-TRACE-003** | Parent metadata/count text still describes pre-012 11-child state; trigger_phrases omit 012 slug | iter 5 | parent context-index.md:3,10-20,53,70 + parent spec.md:3,10-20,121 + parent tasks.md:10-20,84 |
| **F-TRACE-004** | `.opencode/README.md` counts don't match live repo: claimed 23 commands / 10 spec_kit / 31 YAML; actual 22 / 7 / 30 | iter 5 | README.md:58,60,74,158-167 |
| **F-TRACE-005** | Nested changelog Files Changed table omits 3 rows present in implementation-summary (graph-metadata, description, implementation-summary) | iter 5 | changelog-008-012-*.md:61-75 |
| **F-TRACE-006** | Nested changelog spec-folder + parent paths missing `.opencode/` prefix; cited paths don't resolve | iter 5 | changelog-008-012-*.md:17-18 |

### Confirmed non-issues
- Packet identity consistent across `graph-metadata.json` (`packet_id`, `spec_folder`), `description.json` (`specFolder`), and frontmatter title.
- Parent context-index, spec, and tasks rows for 012 exist (the issue is metadata sync around them, not the rows themselves).
- `.opencode/command/spec_kit/README.txt` includes the new skill-advisor row and structure-tree entries.

---

## 7. Findings — Maintainability (P1: 2, P2: 1)

### P1

| ID | Title | Origin | Files |
|---|---|---|---|
| **F-MAINT-001** | `skill-advisor.md` has unapproved H2 vocabulary (`CONSTRAINTS`, `0. UNIFIED SETUP PHASE`, `9. SCORING SYSTEM REFERENCE`) outside sk-doc Section 6 approved names | iter 6 | skill-advisor.md:20,47,252 |
| **F-MAINT-002** | mcp_server README addendum says boundaries are "enforced in YAML" but iters 2 and 4 prove enforcement is declared, not implemented | iter 6 | mcp_server/README.md:592 |

### P2

| ID | Title | Origin |
|---|---|---|
| F-MAINT-003 | implementation-summary.md overstates the refactored install guide as containing a "per-phase walkthrough"; the guide has a 5-phase diagram, not a walkthrough | iter 6 |

### Confirmed non-issues
- DQI baselines hold: `skill-advisor.md` 94/100 Excellent, install guide 99/100 Excellent.
- HVR grep found zero banned-word matches in command markdown, install guide, implementation-summary, or mcp_server README addendum.
- Install guide AI-FIRST PROMPT is copy-paste ready, includes prereq check, command invocation, rollback.
- mcp_server Section 3.1.14 has one local architecture paragraph + one fusion-lane paragraph; no duplicate scoring architecture.

---

## 8. Findings — Convergence (P1: 1, P2: 0)

| ID | Title | Origin | Action |
|---|---|---|---|
| F-CONV-001 | Iterations 003 and 006 missing canonical `iterations/iteration-NNN.md` and `deltas/iteration-NNN.json`; payloads only in logs | iter 7 | RESOLVED post-loop: iter-003.md and iter-006.md materialized from logs into canonical paths |

---

## 9. Cross-Dimension Patterns

Iteration 7 identified five recurring root causes that span multiple dimensions. Fixing the root cause closes multiple findings:

1. **Mutation-boundary enforcement gap** (recurs across correctness + security + maintainability):
   - F-CORR-006 + F-SEC-002 + F-MAINT-002 all describe the same gap: YAML declares `mutation_boundaries.allowed_targets` and `forbidden_targets` but Phase 3 has no concrete pre-write canonical-path validation step.
   - **Single fix**: Add a Phase 3 first-step validator that resolves every proposal target via `realpath`, asserts repo-relative, rejects `..` / symlinks / absolute paths, exact-matches an allowlist pattern, fails fast on first violation. Update the README addendum wording to match.

2. **Rollback safety** (recurs across correctness + security):
   - F-CORR-004 + F-CORR-012 + F-CORR-013 + F-SEC-003 all describe rollback paths that are inconsistent, incomplete, or potentially destructive.
   - **Single fix**: One rollback contract: capture `git status --porcelain -- <scoped paths>` before Phase 3, refuse apply unless clean (or after explicit `git stash` snapshot), generate a per-run rollback script with the exact files modified, attach it to `pre_phase_4.rollback_action` AND `post_phase_4.B`.

3. **Dry-run + proposal artifact handling** (recurs across correctness + security):
   - F-CORR-003 + F-SEC-005 point to one decision: dry-run contract + private proposal-artifact path.
   - **Single fix**: Standardize: dry-run always skips Phase 3 entirely (no Phase 4 jump). Proposal path is a packet-local `scratch/skill-advisor-proposal-<ts>.md` (gitignored), not `/tmp`. Update command markdown, both YAMLs, install guide, examples, and next-steps consistently.

4. **Metadata schema drift** (recurs across correctness + traceability):
   - F-CORR-005 + F-CORR-010 + F-TRACE-001 + F-TRACE-002 all describe field/path contract drift across YAMLs, graph metadata, and packet docs.
   - **Single fix**: Pick the canonical names (`derived.trigger_phrases` / `derived.key_topics` per `projection.ts`) and update both YAMLs + spec-folder docs + graph-metadata derived entries to use repo-rooted paths consistently.

5. **Approval / scope wiring** (recurs across correctness + maintainability):
   - F-CORR-008 + F-CORR-009 + F-CORR-011 + F-CORR-014 all describe missing machine-checkable output schemas and conditional lane-specific apply steps.
   - **Single fix**: Add `confidence_by_skill` to Phase 2 outputs, gate Phase 3 on confidence + scope, rewrite Phase 3 activities as conditional lane-specific steps (`if scope contains explicit: edit explicit.ts`, etc.), define the per-skill loop `C` accepted_response schema.

---

## 10. Recommended Remediation Order

Tackle in this order — each step closes multiple findings:

| Priority | Fix | Closes | Effort |
|---|---|---|---|
| 1 | Add Phase 3 pre-write canonical target validator (cross-dimension pattern 1) | F-CORR-006, F-SEC-002, F-MAINT-002 | medium |
| 2 | Standardize rollback contract with clean-tree guard + per-run rollback script (pattern 2) | F-CORR-004, F-CORR-012, F-CORR-013, F-SEC-003 | medium |
| 3 | Standardize dry-run + proposal artifact path (pattern 3) | F-CORR-003, F-SEC-005 | small |
| 4 | Normalize metadata schema names + repo-rooted paths (pattern 4) | F-CORR-005, F-CORR-010, F-TRACE-001, F-TRACE-002 | small |
| 5 | Wire confidence + scope into Phase 2/3 + per-skill loop schema (pattern 5) | F-CORR-008, F-CORR-009, F-CORR-011, F-CORR-014 | medium |
| 6 | Resolve no-suffix mode + first-action contradictions in command markdown | F-CORR-001, F-CORR-002 | small |
| 7 | Fix graph-scan handling contradiction (hard gate vs partial recovery) | F-CORR-007 | small |
| 8 | Sync parent docs, README counts, changelog rows + paths | F-TRACE-003, F-TRACE-004, F-TRACE-005, F-TRACE-006 | small |
| 9 | Demote/rename unapproved H2s in command markdown | F-MAINT-001 | small |
| 10 | Add SKILL.md/graph-metadata data-only boundary + tighten allowed-tools + harden review runner | F-SEC-001, F-SEC-004 | medium |
| 11 | Add proposal schema validation for TOKEN_BOOSTS/PHRASE_BOOSTS keys before TS source edit | F-SEC-006 | small |
| 12 | Update implementation-summary "per-phase walkthrough" → "phase overview" | F-MAINT-003 | trivial |

---

## 11. Quality Gates

| Gate | Result | Notes |
|---|---|---|
| Evidence quality | PASS | Active findings cite file:line; iters 3+6 evidence recovered to canonical paths |
| Scope | PASS | All findings within declared command + YAML + install-guide + README + spec-packet scope |
| Coverage | PASS | All four dimensions covered |
| P0 closure | PASS | No P0 findings opened |
| Convergence novelty | PASS | newFindingsRatio=0.0333 (well below 0.10) |
| Artifact continuity | PASS | F-CONV-001 resolved post-loop |

---

## 12. Iteration Index

| Iter | Dim | New P1 | New P2 | newFindingsRatio | Files reviewed | Wall-clock |
|---|---|---:|---:|---:|---:|---|
| 1 | correctness | 3 | 1 | 1.0000 | 8 | 3m22s |
| 2 | correctness | 4 | 1 | 0.5556 | 12 | 2m55s |
| 3 | correctness | 4 | 1 | (recovered) | 9 | 2m53s |
| 4 | security | 5 | 1 | 0.3000 | 15 | 3m23s |
| 5 | traceability | 6 | 0 | 0.2308 | 19 | 3m48s |
| 6 | maintainability | 2 | 1 | (recovered) | 15 | 3m05s |
| 7 | convergence | 1 | 0 | 0.0333 | 22 | 3m13s |
| **Total** | — | **25** | **5** | — | — | **22m39s** |

Iteration artifacts:
- `review/iterations/iteration-{001..007}.md` (003 + 006 recovered post-loop from logs)
- `review/deltas/iteration-{001,002,004,005,007}.json` (003 + 006 deltas remain log-embedded)
- `review/logs/iteration-{001..007}.log` + `review/logs/runner.log`
- `review/deep-review-state.jsonl` (init + executor + 6 iteration records; iter 3 record absent)

---

## 13. Notes on Incomplete Artifacts

Iterations 3 and 6 produced their full 3-artifact payloads inside their dispatch logs but failed to write to canonical paths during execution — most likely a copilot file-write tool not engaging on those runs. F-CONV-001 captured this. As of report time:

- `iteration-003.md` and `iteration-006.md` are now extracted from logs into canonical paths.
- `iteration-003.json` and `iteration-006.json` deltas remain log-embedded; iter 7's carried-forward backlog (Section 9 of `iteration-007.md`) already aggregates their findings, so synthesis was not blocked.
- The state log `deep-review-state.jsonl` is missing the iter 3 record (iter 6 record is present); this is documented in F-CONV-001 and does not affect the verdict because all iter 3 findings appear in the carried-forward backlog.

For a future re-run: tighten the runner's per-iteration validation (already declared in YAML `post_dispatch_validate.assert_exists`) so the runner halts when a canonical artifact is missing rather than continuing to the next iteration.

---

## 14. Next Steps

| Condition | Suggested Command | Reason |
|---|---|---|
| Plan remediation | `/spec_kit:plan` "skill-advisor command remediation - close 25 P1 findings from deep-review" | Bundle the 12-step ordered backlog into a child packet under 008-skill-advisor/ |
| Implement specific fixes | `/spec_kit:implement <remediation-spec-folder>` | Execute the planned remediation |
| Spot-fix quick wins (priorities 3, 4, 6, 8, 12) | direct edits | Low-effort items can land without full spec workflow |
| Re-review after remediation | `/spec_kit:deep-review:auto <packet> --max-iterations=5` | Verify P1 closure with a smaller iteration budget |
| Refresh continuity | `/memory:save` | Index this report so future search picks it up |

**ALWAYS** end with: "What would you like to do next?"
