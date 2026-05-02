---
title: "Feature Specification: Fix-Iteration Quality Meta-Research"
description: "Investigates why iterative LEAF-agent fix loops on the 009 packet required 4 rounds to converge, and what changes to FIX prompt template, sk-code-review skill, and sk-deep-review convergence criteria would compress the cycle."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "fix iteration quality"
  - "class of bug vs finding"
  - "LEAF agent fix narrowness"
  - "cross-cutting consumer detection"
  - "fix completeness checklist"
spec_id: "026/007/010"
level: 3
spec_kind: research
status: in-progress
importance_tier: important
_memory:
  spec_id: 026/007/010
  level: 3
  spec_kind: research
  status: in-progress
  topic: "Fix-iteration narrowness — root causes and remediation patterns"
  importance_tier: important
  continuity:
    last_updated_at: "2026-05-02T15:35:00Z"
    completion_pct: 5
    recent_action: "Spec scaffolded for 5-iter deep-research dispatch"
    next_safe_action: "Dispatch /spec_kit:deep-research:auto with cli-codex gpt-5.5 xhigh fast"
---

|---|---|---|
| Run 1 | CONDITIONAL | 2 P1 + 4 P2 | Original implementation gaps (ambiguous precedence, symlink edge case, doc drift) |
| Run 2 | FAIL | 2 P0 + 3 P1 + 5 P2 | FIX-009 was **too narrow** — fixed visible sites only, missed sibling sites (`data.errors` vs warnings) and cross-cutting consumers (`status.ts` vs `scan.ts`) |
| Run 3 | FAIL | 1 P0 | FIX-009-v2 picked **wrong abstraction** — regex-replace has inherent delimiter-class problem; should have used split-and-process from the start |
| Run 4 | PASS | 0/0/0 | FIX-009-v3 used **robust pattern** (split-then-relativize is delimiter-agnostic) — closes class of bug instead of one instance |

### Generalizable failure modes

1. **Single-site fix when class-of-bug exists** — fix targets the reported file:line; reviewer sees other instances in sibling files
2. **One-consumer fix when cross-cutting** — fix flows through one code path; reviewer sees parallel paths still buggy
3. **Algorithm choice with hidden edge cases** — regex with incomplete exclusion class; replace-in-place when split-and-process needed
4. **Partial test matrix** — describe.each with N-1 cases; reviewer enumerates the missing case
5. **Test isolation regressions** — pre-existing pattern bugs surfaced when reviewing the fix's new tests

<!-- ANCHOR:scope -->
## 2. SCOPE (FROZEN)

### IN scope

- Investigate the **5 failure modes above** as systematic patterns in LEAF-agent fix prompts
- Recommend changes to:
  - FIX prompt template (e.g., explicit "audit ALL sibling sites in this file" + "check ALL consumers of changed function")
  - `sk-code-review` skill (e.g., findings should include "class-of-bug-or-instance-only" classification)
  - `sk-deep-review` convergence criteria (e.g., should the convergence threshold differ for security-sensitive code?)
  - `/spec_kit:plan` → `/spec_kit:implement` flow for hardening fixes
- Compare cost: "narrow fix + verify cycle × 3" vs "broader-scope fix × 1" — wall-clock + Premium cost + reviewer fatigue
- Quantify: how often is a 1-round fix sufficient vs. multi-round? What predicts which case applies?
- Audit similar past packets in `026-graph-and-context-optimization/` to see if 4-round trajectory is typical or exceptional

### OUT of scope

- Re-fixing the 009 packet (it's clean, this is meta-analysis)
- Changing the LEAF-agent dispatch model (out-of-scope; this researches WITHIN the model)
- Replacing cli-copilot or cli-codex executors (this is about prompt + workflow, not executor)
- General prompt-engineering theory (focus on this specific class of workflow)

<!-- ANCHOR:requirements -->
## 3. REQUIREMENTS

### Functional Requirements (research outputs)

**F1.** Synthesize the 5 failure modes with: definition, 009-packet evidence, frequency hypothesis (rare/common/universal), prevention pattern.

**F2.** Audit ≥3 prior fix packets in `026-graph-and-context-optimization/` for the same patterns. Output table: packet → rounds-to-clean → which failure modes appeared → which prevention patterns would have helped.

**F3.** Compare cost: 4-round trajectory (009 packet) vs hypothetical "preventive fix" with same artifacts but one round. Estimate wall-clock + Premium delta.

**F4.** Recommend specific edits to:
- `.opencode/skill/system-spec-kit/scripts/templates/level_*/` FIX template
- `.opencode/skill/sk-code-review/SKILL.md` finding classification
- `.opencode/skill/sk-deep-review/references/convergence.md` convergence rules

**F5.** Define a "fix completeness checklist" that the FIX prompt should require codex/copilot to run before declaring DONE. Examples:
- "List all sibling sites in this file that share the changed pattern; explain why each is OK or fix it"
- "List all consumers of the changed function/policy; explain why each is OK or update it"
- "If algorithm choice (regex/loop/etc.), enumerate edge cases tested vs untested"

### Quality / Convergence Requirements

- ≥5 iterations or convergence threshold 0.05
- ≥3 historical packets audited
- Minimum 1 ADR-worthy decision in output

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

- Deep-research produces `research/research.md` with synthesized recommendation
- Recommendations cite specific file:line edits to skill/template files
- Cost-comparison table quantifies Premium + wall-clock savings
- Audit table shows pattern frequency across ≥3 historical packets
- Decision-record ADR-001 captures the chosen prevention pattern set

<!-- ANCHOR:risks -->
## 5. RISKS

- **R1 [P1]** — Recommendations may add prompt bloat that slows individual fixes more than it saves on cycle count. Mitigation: cost analysis is an explicit success criterion.
- **R2 [P2]** — Audit base may be small (only a few packets have multi-round trajectories logged). Mitigation: focus on whatever data exists; flag low-N as a research limitation.
- **R3 [P2]** — "Fix completeness checklist" may be hard to operationalize without becoming a checkbox-theater addition that codex skips. Mitigation: design checklist items to be self-verifying via grep/test commands.

<!-- ANCHOR:questions -->
## 6. RESEARCH QUESTIONS

1. Of the 5 failure modes, which is most frequent across past packets?
2. Is the multi-round pattern correlated with security-sensitive code, or does it appear in correctness/maintainability fixes too?
3. Would a "broader-scope fix" prompt produce a longer wall-clock per fix (acceptable trade-off) OR would it just shift the missed-class-of-bug cost?
4. Should `sk-deep-review` convergence include a hard-stop "gates re-checked after fix" requirement, separate from the rolling-avg threshold?
5. Should `/spec_kit:plan` for fix packets explicitly enumerate all consumers of changed functions in plan.md §"Affected Surfaces"?
6. Is there evidence that fresh-context LEAF-agent reviewers find genuinely different findings each round (adversarial diversity working as designed) vs. just finding the same bugs in different locations (pure fix narrowness)?
7. What's the right default for the fix prompt: "fix this finding" vs. "fix this finding AND explicitly justify why each sibling site / consumer is unchanged"?

<!-- ANCHOR:related-documents -->
## 7. RELATED DOCUMENTS

- Source packet (4-round trajectory evidence): `../009-end-user-scope-default/`
- Run 1 review archive: `../009-end-user-scope-default/review_archive/run-001-converged-at-6-*`
- Run 2 review archive: `../009-end-user-scope-default/review_archive/run-002-v2-conditional-*`
- Run 3 review archive: `../009-end-user-scope-default/review_archive/run-003-v3-fail-1p0-*`
- Run 4 final review: `../009-end-user-scope-default/review/`
- Sibling packets for pattern-frequency audit: `../001-*` through `../008-*`
- sk-code-review SKILL: `.opencode/skill/sk-code-review/SKILL.md`
- sk-deep-review convergence rules: `.opencode/skill/sk-deep-review/references/convergence.md`
