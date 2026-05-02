---
title: "CX-011 -- high / xhigh override"
description: "This scenario validates the high and xhigh reasoning overrides for `CX-011`. It focuses on confirming both levels engage deeper analysis on a security-audit prompt."
---

# CX-011 -- high / xhigh override

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-011`.

---

## 1. OVERVIEW

This scenario validates the `high` and `xhigh` reasoning overrides for `CX-011`. It focuses on confirming both levels are accepted via `-c model_reasoning_effort="<level>"` and produce deeper analysis on a security-audit prompt that benefits from depth.

### Why This Matters

SKILL.md §3 + `integration_patterns.md` §5 explicitly recommend `high` / `xhigh` for architecture, security and complex planning. If these levels silently degrade to `medium` behavior, every routing recommendation that depends on depth (`@review`, `@multi-ai-council`, `@deep-research`) loses its quality edge.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-011` and confirm the expected signals without contradictory evidence.

- Objective: Verify `high` and `xhigh` reasoning levels engage deeper analysis on a security-sensitive prompt.
- Real user request: `Run a security review of the cli-codex Rules section at high and xhigh reasoning and show me the depth difference.`
- RCAF Prompt: `As a cross-AI orchestrator routing a security-sensitive analysis, dispatch a security review of @./.opencode/skill/cli-codex/SKILL.md §4 (Rules) twice: once with -c model_reasoning_effort="high", once with -c model_reasoning_effort="xhigh". Both invocations use --model gpt-5.5 --sandbox read-only -c service_tier="fast". Verify both exit 0, both return categorized findings with explicit references to specific rules, and the xhigh response demonstrates measurably deeper reasoning (more rule citations, more nuanced trade-offs). Return a verdict mapping each level to the citation count and apparent depth.`
- Expected execution process: Operator dispatches the same audit prompt twice with `-c model_reasoning_effort="high"` and `="xhigh"` -> captures both stdouts -> counts rule citations in each -> records the depth comparison.
- Expected signals: Both invocations exit 0. Both responses cite specific SKILL.md rules by number (e.g., "ALWAYS 1", "NEVER 4"). The `xhigh` response contains at least as many citations as the `high` response. Dispatched command lines include the documented effort flag verbatim.
- Desired user-visible outcome: An audit-quality output the operator can hand to a security reviewer, with proof that the higher reasoning levels are actually engaged and produce richer analysis.
- Pass/fail: PASS if both exit 0, both cite at least 3 specific rules by number/name, `xhigh` citation count >= `high` citation count, AND both dispatched command lines include the explicit effort flag. FAIL if either fails to dispatch or `xhigh` produces strictly fewer citations than `high`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch the audit prompt with `-c model_reasoning_effort="high"`.
2. Dispatch the same prompt with `-c model_reasoning_effort="xhigh"`.
3. Capture both stdouts to separate temp files.
4. Count rule citations in each (regex for "ALWAYS \d+", "NEVER \d+", "ESCALATE \d+").
5. Record the depth comparison and return a verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-011 | high / xhigh override | Verify high/xhigh reasoning produce deeper analysis with measurable rule citations | `As a cross-AI orchestrator routing a security-sensitive analysis, dispatch a security review of @./.opencode/skill/cli-codex/SKILL.md §4 (Rules) twice: once with -c model_reasoning_effort="high", once with -c model_reasoning_effort="xhigh". Both invocations use --model gpt-5.5 --sandbox read-only -c service_tier="fast". Verify both exit 0, both return categorized findings with explicit references to specific rules, and the xhigh response demonstrates measurably deeper reasoning (more rule citations, more nuanced trade-offs). Return a verdict mapping each level to the citation count and apparent depth.` | 1. `codex exec --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "@./.opencode/skill/cli-codex/SKILL.md Audit the §4 Rules section. For each ALWAYS, NEVER, and ESCALATE rule, identify the specific risk it mitigates and any edge cases where the rule alone is insufficient. Cite each rule by its number." > /tmp/cli-codex-cx011-high.txt 2>&1` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="xhigh" -c service_tier="fast" --sandbox read-only "@./.opencode/skill/cli-codex/SKILL.md Audit the §4 Rules section. For each ALWAYS, NEVER, and ESCALATE rule, identify the specific risk it mitigates and any edge cases where the rule alone is insufficient. Cite each rule by its number." > /tmp/cli-codex-cx011-xhigh.txt 2>&1` -> 3. `bash: HIGH_HITS=$(grep -cE "ALWAYS [0-9]+\|NEVER [0-9]+\|ESCALATE [0-9]+" /tmp/cli-codex-cx011-high.txt); XHIGH_HITS=$(grep -cE "ALWAYS [0-9]+\|NEVER [0-9]+\|ESCALATE [0-9]+" /tmp/cli-codex-cx011-xhigh.txt); printf 'high citations: %s\nxhigh citations: %s\n' "$HIGH_HITS" "$XHIGH_HITS" > /tmp/cli-codex-cx011-summary.txt` | Steps 1-2: both exit 0, both stdout files contain rule-by-number citations; Step 3: HIGH_HITS >= 3 AND XHIGH_HITS >= HIGH_HITS | Two captured stdouts, the summary file, two dispatched command lines, exit codes | PASS if both exit 0, both have >= 3 rule citations, xhigh has at least as many citations as high, AND both command lines have the explicit effort flag; FAIL if either fails or xhigh has strictly fewer citations | (1) Confirm `references/cli_reference.md` §5 lists both `high` and `xhigh`; (2) re-run with `2>&1 \| tee` for stderr inline; (3) inspect each output for non-numeric citation styles ("rule about sandboxing") and adjust grep accordingly |

### Optional Supplemental Checks

- Compare wall-clock latency for `high` vs `xhigh` to confirm the depth ladder hypothesis (xhigh slower than high, both slower than medium).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Reasoning Effort Levels, §3 Selection Strategy) | Documents high/xhigh as upgrade tiers |
| `../../references/cli_reference.md` (§5 Reasoning Effort Configuration) | Authoritative effort-level reference |
| `../../references/integration_patterns.md` (§5 Model Selection Strategy) | Decision matrix for high/xhigh tasks |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §5 Valid values table |
| `../../references/integration_patterns.md` | §5 Decision Matrix - architecture/security/planning rows |

---

## 5. SOURCE METADATA

- Group: Reasoning Effort
- Playbook ID: CX-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--reasoning-effort/003-high-xhigh-override.md`
