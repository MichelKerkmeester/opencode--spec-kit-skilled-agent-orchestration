---
title: "Deep Review Strategy: 048 CLI Testing Playbooks"
description: "5-iteration cli-copilot/gpt-5.5/high review of spec 048 deliverables — 5 cli-* playbooks, Level 3 spec docs, HVR remediation, and the CURRENT REALITY → SCENARIO CONTRACT rename across the playbook ecosystem."
---

# Deep Review Strategy

## Review Charter
- Target: `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/`
- Type: spec-folder
- Dimensions: correctness, security, traceability, maintainability
- Iterations: 5 (hard cap, no early-convergence stop)
- Executor: cli-copilot, model gpt-5.5, reasoning effort high

## Iteration Plan
| Iter | Dimension | Focus |
|---|---|---|
| 1 | correctness | Playbook structural compliance: validator pass, scaffold sections, 9-column tables, frontmatter, ID counts, link integrity, forbidden sidecars |
| 2 | security | Destructive scenarios, sandbox boundary claims, secret handling, ADR-004 cross-AI handback isolation, self-invocation guard claims |
| 3 | traceability | Prompt-sync (root summary ↔ per-feature ↔ scenario-row), cross-reference index, source anchors, ADR↔checklist↔implementation-summary consistency |
| 4 | maintainability | HVR residuals classification accuracy, naming consistency, cross-CLI invariants (categories 01/06/07), section-rename completeness, future-update friction |
| 5 | cross-cutting | Synthesis: validate the implementation-summary.md claims (file counts, validator results, residual zones); audit any drift introduced by the rename pass; flag any P0/P1 missed in iters 1-4 |

## Known Context
- 5 cli-* playbooks: 20+25+21+18+31=115 per-feature files
- HVR pass: em-dash 251→98, semicolon 585→150, Oxford 770→261, banned-words 5→0
- Section rename: ## 2. CURRENT REALITY → ## 2. SCENARIO CONTRACT across 14 playbook trees + 5 source-of-truth files (504 files total carry new heading)
- Validators: all 14 root playbooks exit 0 on validate_document.py
- Spec strict-validation: known limitation (4 errors, same class as sibling 047)

## Severity contract
- P0 (Blocker): structural template violation, validator failure, broken cross-ref, ID-count mismatch, forbidden sidecar, structural rename miss
- P1 (Required): HVR violation in body text, missed playbook tree, prompt-sync drift, taxonomy invariant break
- P2 (Suggestion): stylistic inconsistency, redundant scaffolding, opportunity for tighter prose

## Hard rules
- READ-ONLY: no fixes applied during the loop
- 3-concurrent copilot dispatch cap (per-iteration)
- Each iteration writes findings to `iterations/iteration-NNN.md`
