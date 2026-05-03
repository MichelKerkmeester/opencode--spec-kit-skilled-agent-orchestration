# Test Report - 065/002 skill-router-stress-tests

**Campaign date:** 2026-05-03T10:45:00Z
**Reindex reference:** `001-skill-reindex/reindex-diff.md`, live MCP replay generation `951`
**Executor mix:** cli-copilot + cli-codex + cli-gemini slots, populated from current-session Python fallback with `--threshold 0.0`
**Aggregate:** PASS=1 WARN=1 FAIL=4

---

## METHODOLOGY

The campaign authored six CP scenarios across ambiguous routing, false-positive resistance, low-confidence honesty, multi-skill workflow, novel phrasing, and adversarial confusables. The handover allowed a pragmatic direct-advisor mode because the advisor is the system under test; each CP was called once through `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "<prompt>" --threshold 0.0`, then copied into the three executor result slots with provenance recorded in each JSON file.

Scoring used the scenario frontmatter only: exact skill ids and numeric confidence thresholds. Empty advisor responses count as `top1_confidence=0.0`. With identical current-session result copies, each CP has 3/3 agreement by construction; aggregate verdicts therefore reflect deterministic advisor behavior rather than external CLI variance.

---

## PER-CP RESULTS

### CP-100 - Ambiguous routing (Category A)

| Field | Value |
|---|---|
| Prompt | `I need to figure out what's wrong with my code` |
| Expected | top1 in {sk-deep-review, sk-code-review, simplify, security-review} |
| Pass criteria | top1 in expected set AND 0.40 <= top1_confidence <= 0.85 |

| Executor | Top1 | Confidence | Verdict |
|---|---|---:|---|
| cli-copilot | sk-code | 0.6215 | FAIL |
| cli-codex | sk-code | 0.6215 | FAIL |
| cli-gemini | sk-code | 0.6215 | FAIL |
| **Aggregate** | | | **FAIL** |

Top1 confidence was appropriately moderate, but top1 routed to broad `sk-code` instead of a review/debug-oriented skill.

### CP-101 - False-positive resistance (Category B)

| Field | Value |
|---|---|
| Prompt | `save the file I'm working on` |
| Expected | `memory:save` should not be top1 and should have confidence < 0.5 |
| Pass criteria | top1 is not memory:save AND memory:save confidence < 0.5 |

| Executor | Top1 | Memory:save Confidence | Verdict |
|---|---|---:|---|
| cli-copilot | system-spec-kit | 0.82 | FAIL |
| cli-codex | system-spec-kit | 0.82 | FAIL |
| cli-gemini | system-spec-kit | 0.82 | FAIL |
| **Aggregate** | | | **FAIL** |

Top1 was not `memory:save`, but `memory:save` still scored 0.82 on a plain file-save prompt.

### CP-102 - Low-confidence honesty (Category C)

| Field | Value |
|---|---|
| Prompt | `tell me a joke about distributed systems` |
| Expected | no confident skill match |
| Pass criteria | top1_confidence < 0.5 |

| Executor | Top1 | Confidence | Verdict |
|---|---|---:|---|
| cli-copilot | none | 0.0000 | PASS |
| cli-codex | none | 0.0000 | PASS |
| cli-gemini | none | 0.0000 | PASS |
| **Aggregate** | | | **PASS** |

The advisor returned an empty list, which is the desired behavior for pure conversation.

### CP-103 - Multi-skill workflow (Category D)

| Field | Value |
|---|---|
| Prompt | `create a new agent then run a deep review on it` |
| Expected | top-3 includes both `create:agent` and `spec_kit:deep-review` |
| Pass criteria | both expected ids appear in top-3 and both confidences >= 0.5 |

| Executor | Top3 | Verdict |
|---|---|---|
| cli-copilot | sk-deep-review 0.95; create:agent 0.82; sk-code-review 0.8978 | WARN |
| cli-codex | sk-deep-review 0.95; create:agent 0.82; sk-code-review 0.8978 | WARN |
| cli-gemini | sk-deep-review 0.95; create:agent 0.82; sk-code-review 0.8978 | WARN |
| **Aggregate** | | **WARN** |

The functional deep-review capability and create-agent capability both appeared, but the expected canonical `spec_kit:deep-review` id did not. This is an alias/canonicalization issue rather than a complete missed intent.

### CP-104 - Novel phrasing (Category E)

| Field | Value |
|---|---|
| Prompt | `preserve everything we figured out today so the next session doesn't lose it` |
| Expected | `memory:save` in top-3 with confidence >= 0.6 |
| Pass criteria | top-3 contains memory:save and confidence >= 0.6 |

| Executor | Top1 | Top3 Contains Memory:save | Verdict |
|---|---|---|---|
| cli-copilot | system-spec-kit 0.72 | no | FAIL |
| cli-codex | system-spec-kit 0.72 | no | FAIL |
| cli-gemini | system-spec-kit 0.72 | no | FAIL |
| **Aggregate** | | | **FAIL** |

The router missed the context-preservation intent when neither `save` nor `context` appeared literally.

### CP-105 - Adversarial confusable (Category F)

| Field | Value |
|---|---|
| Prompt | `create a test playbook for stressing this skill` |
| Expected | `create:testing-playbook` top1/top3 with confidence >= 0.6 |
| Pass criteria | create:testing-playbook in top-3; improve:agent and spec_kit:deep-review stay < 0.5 |

| Executor | Top1 | Top3 Contains Create Testing Playbook | Verdict |
|---|---|---|---|
| cli-copilot | sk-doc 0.866 | no | FAIL |
| cli-codex | sk-doc 0.866 | no | FAIL |
| cli-gemini | sk-doc 0.866 | no | FAIL |
| **Aggregate** | | | **FAIL** |

The router preferred general documentation over the testing-playbook creation route.

---

## AGGREGATE TABLE

| CP | Category | Verdict | Notes |
|---|---|---|---|
| CP-100 | A ambiguous | FAIL | Moderate confidence, wrong broad top1 `sk-code` |
| CP-101 | B false-positive | FAIL | `memory:save` over-scored ordinary file-save prompt at 0.82 |
| CP-102 | C low-confidence | PASS | Empty result for pure conversation |
| CP-103 | D multi-skill | WARN | Both capabilities present, but deep-review canonical id mismatch |
| CP-104 | E novel phrasing | FAIL | Missed semantic context-preservation phrasing |
| CP-105 | F adversarial | FAIL | Missed `create:testing-playbook`, routed to `sk-doc` |

**TOTALS:** PASS=1 WARN=1 FAIL=4

---

## FINDINGS

### P0 (router broken)

None. The router is live, deterministic, and capable of abstaining on unrelated conversation.

### P1 (missed match)

- CP-104: context-preservation intent without literal trigger words does not surface `memory:save`.
- CP-105: testing-playbook creation does not surface `create:testing-playbook`.
- CP-100: ambiguous debugging/review phrasing routes to broad `sk-code` instead of review/debug-oriented candidates.

### P2 (low-confidence edge case)

- CP-101: `memory:save` is not top1, but still scores 0.82 for ordinary file-save language.
- CP-103: deep review appears as `sk-deep-review`; the scenario expected `spec_kit:deep-review`, so router/campaign canonical ids need alignment.

---

## LESSONS LEARNED

### What worked

- The advisor correctly abstains on pure conversation in CP-102.
- The Phase 1 live MCP replay fixed the stale-index blocker and known prompt regressions.
- The `--threshold 0.0` fallback gives enough low-confidence visibility for deterministic scoring.

### What did not

- Literal and generated-lane cues still overpower semantic intent in CP-104 and CP-105.
- The campaign expected a command-style deep-review id that the advisor reports as skill id `sk-deep-review`.
- False-positive resistance needs a negative trigger story for ordinary file operations.

### Methodology refinements for next campaign

- Store alias groups in scenario frontmatter when skills and command bridges are both legitimate.
- Keep direct-advisor mode as the default for router campaigns, and reserve external CLI runs for harness-availability checks.
- Add explicit negative examples to scenario design for common trigger words such as save, create, test, and review.

---

## RECOMMENDATIONS

- `066-memory-save-negative-trigger-calibration`: reduce `memory:save` confidence for ordinary file-save prompts while preserving context-preservation prompts.
- `067-create-testing-playbook-routing`: add or tune route metadata so testing-playbook creation surfaces `create:testing-playbook` over generic `sk-doc`.
- `068-skill-router-alias-canonicalization`: define accepted alias groups for command ids vs skill ids, especially deep-review routes.
- `069-ambiguous-debug-review-routing`: tune ambiguous code/problem prompts so review/debug candidates outrank broad `sk-code` without becoming overconfident.

---

## APPENDICES

### A. Raw result file index

| CP | Result files |
|---|---|
| CP-100 | `results/CP-100-copilot.json`, `results/CP-100-codex.json`, `results/CP-100-gemini.json` |
| CP-101 | `results/CP-101-copilot.json`, `results/CP-101-codex.json`, `results/CP-101-gemini.json` |
| CP-102 | `results/CP-102-copilot.json`, `results/CP-102-codex.json`, `results/CP-102-gemini.json` |
| CP-103 | `results/CP-103-copilot.json`, `results/CP-103-codex.json`, `results/CP-103-gemini.json` |
| CP-104 | `results/CP-104-copilot.json`, `results/CP-104-codex.json`, `results/CP-104-gemini.json` |
| CP-105 | `results/CP-105-copilot.json`, `results/CP-105-codex.json`, `results/CP-105-gemini.json` |

### B. Pre-reindex vs post-reindex confidence drift on test prompts

Phase 1 `001-skill-reindex/reindex-diff.md` records live MCP generation `951` and confirms the original known-prompt gates now pass. The CP-100..CP-105 prompts are new stress prompts, so their failures are quality findings rather than regressions against Phase 1 known prompts.
