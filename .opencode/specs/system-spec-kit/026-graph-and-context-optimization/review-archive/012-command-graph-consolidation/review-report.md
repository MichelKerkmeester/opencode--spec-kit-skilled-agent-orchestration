---
title: Review Report — 015-start-into-plan-merger
description: Final deep-review report for packet 015-start-into-plan-merger and downstream sweep.
---

# Review Report — 015-start-into-plan-merger

## 1. Overview

- **Target:** `015-start-into-plan-merger + downstream sweep`
- **Iterations run:** `10 / 10`
- **Stop reason:** `max_iterations`
- **Verdict:** `FAIL`
- **hasAdvisories:** `true`

The review covered all five configured dimensions (`correctness`, `security`, `traceability`, `maintainability`, `interconnection_integrity`) and still ended with four unresolved P0 blockers. The highest-impact defects are not cosmetic: packet-internal traceability is broken, the advertised `--intake-only` runtime path is not wired, forward-looking indexes still route operators toward a deleted command, and the system-spec-kit skill graph fails validation on dead file references.

## 2. Scope

Reviewed surfaces included:

- Packet canonical docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- Live command docs and assets: `.opencode/command/spec_kit/{plan,complete}.md`, all four YAML workflow assets, `.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`
- Regenerated runtime prompts: `.gemini/commands/spec_kit/{plan,complete}.toml`
- Skill and graph surfaces: `system-spec-kit/{SKILL.md,README.md,graph-metadata.json}`, `skill-advisor/{README.md,scripts/skill_advisor.py}`, `sk-deep-research/SKILL.md`, `sk-deep-research/references/spec_check_protocol.md`, `sk-deep-review/README.md`
- Template/operator docs: `templates/{README,level_2,level_3,level_3+,addendum}/README.md`, CLI delegation references, install guides, `.opencode/README.md`, root `README.md`

**Hotspots:** packet-local spec/checklist traceability, plan YAML execution semantics, command index tables, skill graph metadata, template quick starts, runtime delegation symmetry.

## 3. Findings Summary

| Dimension | P0 | P1 | P2 | Total |
|---|---:|---:|---:|---:|
| correctness | 3 | 1 | 2 | 6 |
| security | 0 | 1 | 0 | 1 |
| traceability | 1 | 0 | 0 | 1 |
| maintainability | 0 | 1 | 1 | 2 |
| interconnection_integrity | 0 | 1 | 1 | 2 |
| **Total** | **4** | **4** | **4** | **12** |

## 4. P0 Blockers

### P001-COR-001 — Repair broken checklist cross-references in spec risk sections
- **File:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-start-into-plan-merger/spec.md` (`L204-L207`, `L264-L269`)
- **Impact:** Canonical mitigation references point to nonexistent checklist rows, so packet-local risk controls are not verifiable.
- **Recommendation:** Replace `CHK-008`, `CHK-017`, and `CHK-005` with the real verification rows (`CHK-034`, `CHK-041`, `CHK-023`).

### P003-COR-001 — Implement a real intake-only stop path in plan YAML workflows
- **File:** `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` (`L327-L377`) and mirrored confirm workflow
- **Impact:** `/spec_kit:plan --intake-only` is documented but not executable; the workflow can fall through into normal planning instead of stopping after trio publication.
- **Recommendation:** Add an explicit `intake_only` gate that terminates successfully after Emit and bypasses Steps 1-7.

### P004-TRA-001 — Remove deleted start command from forward-looking command indexes
- **Files:** `.opencode/command/README.txt` (`L48`), `.opencode/command/spec_kit/README.txt` (`L143`)
- **Impact:** Forward-looking docs still advertise a deleted command surface and can route operators to something that no longer exists.
- **Recommendation:** Remove the stale `start` rows and point intake-specific guidance to `/spec_kit:plan --intake-only`.

### P006-COR-001 — Remove nonexistent agent paths from system-spec-kit graph metadata
- **File:** `.opencode/skill/system-spec-kit/graph-metadata.json` (`L71-L84`)
- **Impact:** `skill_graph_compiler.py --validate-only` fails, so skill-graph health checks are broken for the system-spec-kit surface.
- **Recommendation:** Replace or remove `.opencode/agent/speckit.md` and `.claude/agents/speckit.md` from `derived.key_files`.

## 5. P1 Required

### P001-COR-002 — Align closeout status with unmet validation and manual test gates
- **File:** `implementation-summary.md` (`L126-L134`)
- **Impact:** The packet reads as near-closeout even though required validation/manual-test gates remain unresolved.

### P002-IIN-001 — Eliminate duplicated intake questionnaire blocks from merged command surfaces
- **Files:** `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/complete.md`, and mirrored Gemini TOMLs
- **Impact:** The claimed shared intake contract is still duplicated in live prompts, so future edits can drift again.

### P007-MAI-001 — Replace manual template-copy quick starts with the canonical intake workflow
- **Files:** `templates/level_2/README.md`, `templates/level_3/README.md`, `templates/level_3+/README.md`
- **Impact:** Published quick starts bypass the canonical trio/bootstrap lifecycle and its metadata generation.

### P009-SEC-001 — Add the spec-packet governance route to Copilot delegation docs
- **File:** `.opencode/skill/cli-copilot/references/agent_delegation.md` (`L172-L183`)
- **Impact:** Copilot conductors do not receive the same governance guardrail documented for Claude, Codex, and Gemini runtimes.

## 6. P2 Suggestions

### P002-IIN-002 — Normalize seven-step versus eight-step plan workflow terminology
- **Surface:** `.opencode/command/spec_kit/plan.md` and mirrored Gemini prompt

### P003-COR-002 — Rename leftover start-delegation workflow labels after deleting `/spec_kit:start`
- **Surface:** plan YAML pair

### P007-MAI-002 — Align Level 3+ workflow notes with lower-level continuity guidance
- **Surface:** `templates/level_3+/README.md`

### P008-COR-001 — Rename leftover start-delegation identifiers in complete YAML workflows
- **Surface:** complete YAML pair

## 7. Cross-Reference Map

| Finding | Downstream surfaces affected |
|---|---|
| `P001-COR-001` | `spec.md`, `checklist.md`, packet reviewability |
| `P003-COR-001` | `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, documented `/spec_kit:plan --intake-only` behavior |
| `P004-TRA-001` | `.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`, operator command discovery |
| `P006-COR-001` | `system-spec-kit/graph-metadata.json`, skill-graph validation, skill-advisor graph health |
| `P002-IIN-001` | `plan.md`, `complete.md`, `.gemini/commands/spec_kit/{plan,complete}.toml` |
| `P007-MAI-001` | `templates/level_2/README.md`, `templates/level_3/README.md`, `templates/level_3+/README.md` |
| `P009-SEC-001` | `cli-copilot/references/agent_delegation.md`, cross-runtime delegation symmetry |

## 8. Remediation Plan

1. **Clear the blockers first**
   - Fix packet checklist references in `spec.md`
   - Wire `intake_only` into both plan YAML workflows
   - Remove deleted `start` rows from both command README indexes
   - Repair `system-spec-kit/graph-metadata.json` and rerun graph validation
2. **Resolve required doc/runtime drift**
   - Downgrade or complete `implementation-summary.md` closeout claims
   - De-duplicate intake prompts across `plan.md`/`complete.md` and regenerate Gemini TOMLs
   - Add the spec-packet governance lane to Copilot delegation docs
   - Rewrite template quick starts around `/spec_kit:plan --intake-only`
3. **Finish consistency cleanup**
   - Normalize step-count terminology
   - Rename remaining `start_delegation_*` identifiers in all YAML assets
   - Restore Level 3+ continuity guidance parity
4. **Re-run targeted verification**
   - command index grep / table audit
   - manual `--intake-only` execution check
   - `skill_graph_compiler.py --validate-only`
   - runtime delegation/doc parity spot-check

## 9. Convergence Evidence

- **newFindingsRatio trajectory:** `1.00, 1.00, 1.00, 1.00, 0.00, 1.00, 1.00, 0.50, 1.00, 0.00`
- **Rolling average (last 3):** `0.50`
- **Dimension coverage:** `5 / 5`
- **Why STOP was not legal before max iterations:** unresolved P0 findings remained active throughout, and the rolling ratio never dropped near the `< 0.10` convergence threshold for a stabilization window.
