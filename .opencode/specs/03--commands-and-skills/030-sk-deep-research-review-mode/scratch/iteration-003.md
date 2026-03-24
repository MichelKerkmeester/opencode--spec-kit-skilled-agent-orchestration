# Review Iteration 3: Scope Decomposition & Cross-Reference Protocol

## Focus
Q3: How should review scope be decomposed into per-iteration focus areas + cross-reference checks?

## Findings

### Grounding

This is grounded in the repo's actual review/deep-research/playbook/catalog patterns: review quick ref (`.opencode/skill/sk-code--review/references/quick_reference.md#L38`), strategy template (`.opencode/skill/sk-deep-research/assets/deep_research_strategy.md#L35`), the live Level 3 packet 028 spec (`.opencode/specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/spec.md#L76`), 028 checklist (`.opencode/specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/checklist.md#L18`), 028 summary (`.opencode/specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/implementation-summary.md#L30`), the templates catalog template (`.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md#L24`) and playbook template (`.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md#L18`), live docs system catalog root (`.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md#L11`), memory_context feature (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md#L11`), live DR playbook (`.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md#L47`), DR-008 scenario (`.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md#L45`), and the current 030 review spec (`.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/spec.md#L11`), 030 strategy (`.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md#L11`).

---

### PART A: Scope Decomposition

#### Section 1: Review Target Types

| Target Type | Input | Discovery | Size | Default Max |
|---|---|---|---|---|
| Single spec folder | `spec:03--commands-and-skills/028-...` or folder path | Read root packet files; include `scratch/` and `memory/`; expand to files named in `Files to Change`, `Source Files`, checklist evidence, and implementation summary | Medium | 6 |
| Skill | `skill:sk-deep-research` or skill folder path | `SKILL.md`, `README`, `references/`, `assets/`, `scripts/`, `templates/`, `feature_catalog/`, `manual_testing_playbook/`, linked agents/commands | Medium-Large | 8 |
| Agent family | `agent:review` or `agent:deep-research` | Normalize siblings across `.opencode/agent/`, `.opencode/agent/chatgpt/`, `.codex/agents/`, `.claude/agents/` and compare workflow/permissions | Medium | 5 |
| Feature track | `track:03--commands-and-skills` or track folder path | Enumerate numbered child spec folders; ignore `scratch/` and `z_archive/` unless explicitly requested; sample from each child packet plus shared track patterns | Large | 10 |
| Arbitrary file set | explicit files/globs | Start from user paths, then add immediate cross-reference artifacts they cite or depend on | Small-Variable | 4 |

#### Section 2: Default Review Dimensions

| Dimension | Checks | Tool Actions | Typical Findings | Priority |
|---|---|---|---|---|
| Correctness | logic, state flow, edge cases, error handling, contract safety | `Read` core files/tests, `Grep` callers/entry points, `Glob` tests | P0 destructive wrong behavior, P1 bad state/null path, P2 thin edge-case coverage | 1 |
| Security | authz, unsafe input/output, data exposure, dangerous permissions | `Read` boundaries, `Grep` risky patterns/permission drift, `Glob` exposed entrypoints | P0 auth bypass/unsafe write surface, P1 data leak, P2 weaker hardening | 2 |
| Spec Alignment | spec/plan/tasks/checklist/summary claims vs shipped reality | `Read` packet + implementation, `Grep` IDs/files/claims, `Glob` promised artifacts | P0 false blocker completion, P1 promised behavior/file missing, P2 stale summary | 3 |
| Completeness | required files, required sections, tests/scenarios, checklist coverage | `Glob` package trees, `Read` root indexes, `Grep` IDs/checks | P0 missing blocker artifact, P1 missing required test/playbook/catalog file, P2 optional gap | 4 |
| Cross-Reference Integrity | IDs, links, root-to-snippet alignment, runtime anchors, catalog/playbook/spec links | `Grep` IDs/paths, `Read` source+target, `Glob` target existence | P1 broken canonical anchor or ID drift, P2 stale secondary link | 5 |
| Patterns | baseline+overlay compliance, template shape, runtime/path conventions | `Read` SKILL/agent/template docs, `Grep` required sections, `Glob` runtime variants | P1 missing required workflow/section, P2 style/template drift | 6 |
| Documentation Quality | "current reality" honesty, operator clarity, release-readiness usefulness | `Read` root docs + per-file docs, `Grep` stale/live/reference-only markers | P1 misleading operator guidance, P2 clarity/polish issue | 7 |

Performance should stay conditional, not default. For code-heavy targets, fold it into Correctness unless the user explicitly asks for a perf pass.

#### Section 3: Iteration Ordering Strategy

1. Use a hybrid order: one fast inventory pass first, then risk-ordered deep passes.
2. Iteration 0: build the artifact map, canonical source list, ID/link map, and likely blocker zones.
3. Then run `Correctness -> Security -> Spec Alignment -> Completeness -> Cross-Reference Integrity -> Patterns -> Documentation Quality`.
4. For large targets, `Next Focus` must always be `dimension + artifact slice + reason`, for example `Security :: runtime agents :: permission drift check`.
5. Re-review a dimension only when a later iteration invalidates it, adds new contradictory evidence, or a fix/remediation changes the target.

This matches the review baseline's front-loaded correctness/security order in review quick ref (`.opencode/skill/sk-code--review/references/quick_reference.md#L38`) while preserving deep-research's "one focus per iteration" model in strategy template (`.opencode/skill/sk-deep-research/assets/deep_research_strategy.md#L19`).

#### Section 4: `strategy.md` Adaptation

How "Key Questions" becomes "Review Dimensions" in strategy.md:

```md
## 3. Review Dimensions (remaining)
- [ ] D1 Correctness
- [ ] D2 Security
- [ ] D3 Spec Alignment
- [ ] D4 Completeness
- [ ] D5 Cross-Reference Integrity
- [ ] D6 Patterns
- [ ] D7 Documentation Quality

## 6. Reviewed Dimensions
- [x] D1 Correctness — 3 findings (P1x2, P2x1); coverage: spec packet + runtime docs
- [x] D2 Security — 0 findings; coverage: agent permissions + write surfaces

## 11. Next Focus
Cross-Reference Integrity :: playbook root + per-scenario files :: IDs and source anchors need parity review
```

`Answered Questions` becomes `Reviewed Dimensions`. `Next Focus` can point either to the next untouched dimension or to `re-review:Dn` if later evidence changed the earlier verdict.

---

### PART B: Cross-Reference Verification Protocol

Evidence format for every cross-reference finding: `source claim -> target evidence -> observed drift -> impact -> severity`.

#### Cross-Reference 1: Spec Claims vs Code

Compare `spec.md` Proposed Solution, `plan.md` Files to Modify/Change, `tasks.md` completion, and `implementation-summary.md` claims to actual files/behavior. Detect by reading the packet first, then checking existence and behavior of named targets. P0 when a blocker/safety claim is falsely complete, P1 when promised behavior or file is missing, P2 when summaries are stale.

**Example:** 028 spec (`.opencode/specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/spec.md#L114`) requires explicit "no feature catalog yet" disclosure, and that appears in live DR playbook (`.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md#L47`) and DR-008 scenario (`.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md#L75`).

#### Cross-Reference 2: Checklist vs Evidence

Compare every `[x]` item to its cited evidence, and verify that referenced outputs/sections actually exist. P0 if a P0 item is unchecked or falsely marked complete, P1 if a checked item has no real evidence, P2 if evidence is weak but directionally present.

**Example:** 028 checklist (`.opencode/specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/checklist.md#L32`) uses real evidence links for `CHK-001..004`, while `CHK-010..014` stay unchecked because they still point at future artifacts.

#### Cross-Reference 3: SKILL.md vs Agent Files

Compare skill routing/rules/resources to the operational agent contract. Detect by matching tool expectations, write/read posture, LEAF/orchestrator status, required workflow steps, and canonical path conventions. P0 if permissions create unsafe behavior, P1 if a critical workflow step or guardrail is missing, P2 for wording drift only.

**Good pass example:** The deep-research agent's LEAF-only and spec-folder write exception mirror the skill's loop model in deep-research agent (`.opencode/agent/deep-research.md#L32`).

#### Cross-Reference 4: Agent Cross-Runtime Consistency

Compare semantic equivalence, not text identity, across `.opencode`, `.claude`, `.codex`, and runtime-specific variants. Detect by normalizing core workflow, permission model, required sections, and allowed runtime-specific notes. P0 if one runtime can write while another is read-only for the same agent role, P1 if workflow/rubric diverges, P2 if only model/path wording differs.

**Good pass example:** OpenCode review agent (`.opencode/agent/review.md#L30`) and Codex review agent (`.codex/agents/review.toml#L16`) are semantically aligned on read-only review and baseline+overlay loading.

#### Cross-Reference 5: Feature Catalog vs Implementation

Compare root-catalog "Current Reality" claims and per-feature source tables to live implementation/test files. Detect by following each root entry into its snippet, then verifying referenced files still exist and still support the claim. P1 if removed or materially changed behavior is still cataloged as live, P2 if implemented behavior has no catalog entry.

**Example:** System catalog root (`.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md#L11`) explicitly acts as canonical inventory, and memory_context feature (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md#L11`) gives the source-file/test surface that must still match reality.

#### Cross-Reference 6: Testing Playbook vs Capability

Compare root playbook summaries and per-scenario execution rows to the live capability/docs/tests they claim to validate. Detect by checking source anchors, expected signals, pass/fail criteria, and whether each shipped critical capability has at least one scenario. P1 if a scenario tests unshipped behavior or omits a critical path, P2 if coverage is incomplete but non-critical.

**Example:** Live DR playbook (`.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md#L362`) exposes explicit automated-test and catalog cross-reference sections, while DR-008 scenario (`.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md#L45`) shows the canonical 9-column row plus source anchors.

---

### PART C: Findings Deduplication

- **Dedup key:** `reference_type + normalized_issue + source_artifact + target_artifact + primary_location`.
- If the same file:line shows up in multiple dimensions, keep one finding and attach multiple dimension tags such as `["Completeness","Cross-Reference Integrity"]`.
- Only split findings when the remediation differs materially. "Broken link" and "false shipped-claim" in the same line are separate only if they need different fixes.
- Severity upgrades mutate the existing finding instead of creating a second one. Record `first_seen_iteration`, `upgraded_in_iteration`, and `previous_severity`.
- Convergence should use deduped new findings, not raw observations, or later iterations will look artificially novel.

---

### PART D: Ruled Out Approaches

- **Reject "all dimensions every iteration."** It destroys novelty tracking and wastes the 8-12 call budget that deep-research already assumes.
- **Reject file-slice-only decomposition.** It catches local defects but misses the highest-value review work: spec/code/playbook/catalog/agent contradictions.
- **Reject strict text parity across runtime agents.** `.md` and `.toml` formats legitimately differ; compare workflow semantics and permission equivalence instead.
- **Reject making Performance a default first-class dimension for every target.** Spec folders, skills, and agent docs often need correctness/alignment more than perf; treat performance as a conditional sub-pass.

---

### Synthesis

This gives review mode a stable unit of work: one review dimension on one artifact slice, with explicit cross-reference contracts and deduped findings that can converge cleanly.

## Assessment
newFindingsRatio: 1.0 (first iteration for this question, all findings new)

## Recommended Next Focus
Q4: Agent dispatch model -- should review mode use @review, create @deep-review, or adapt @deep-research with review-specific dispatch context? The scope decomposition and cross-reference protocol defined here constrain the agent's required capabilities (read-only vs write, dimension-scoped focus, cross-artifact comparison), which directly informs the agent architecture decision.
