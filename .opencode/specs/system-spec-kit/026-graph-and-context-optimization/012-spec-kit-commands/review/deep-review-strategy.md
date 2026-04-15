---
title: Deep Review Strategy
description: Session strategy and coverage tracker for packet 015-start-into-plan-merger.
---

# Deep Review Strategy

## 1. Topic
015-start-into-plan-merger + downstream sweep

## 2. Review Dimensions
- [x] correctness - Verify packet promises, acceptance criteria, and workflow semantics stay internally consistent.
- [ ] security - Check deleted-surface removal, routing safety, and command-surface hygiene.
- [x] traceability - Verify spec/plan/tasks/checklist/decision-record/reporting claims cross-link correctly.
- [ ] maintainability - Check templates, READMEs, and operator docs remain clear and sustainable after the sweep.
- [x] interconnection_integrity - Custom session dimension for missed references, stale semantics, parity drift, and broken cross-doc links.

## 3. Known Context
### Canonical packet docs
- `spec.md` defines the merger scope, requirements, and success criteria for replacing `/spec_kit:start` with `/spec_kit:plan --intake-only`.
- `plan.md` describes the shared intake-contract extraction, downstream sweep, and deletion plan.
- `tasks.md` breaks the work into M0-M5 tasks, including M5a forward-looking sweeps and M5b deletions.
- `checklist.md` provides 14 P0, 10 P1, and 1 P2 verification rows.
- `decision-record.md` contains ADR-001 through ADR-009 for the merger architecture.
- `implementation-summary.md` claims the shared intake contract shipped, the start surface was deleted, 26 downstream files were updated, and manual integration tests remain deferred.

### Session modification list
- Created: `references/intake-contract.md` and the 015 canonical packet docs. The 015 work is documented in the consolidated `v3.4.0.0` changelog entry (the interim `v3.4.2.0` file was superseded by folding its content into `v3.4.0.0`).
- Modified: `plan.md`, `complete.md`, `system-spec-kit/SKILL.md`, `system-spec-kit/README.md`, `sk-deep-research/*`, `sk-deep-review/README.md`, `skill-advisor/README.md`, template READMEs, CLI agent delegation references, install guides, root READMEs, command READMEs, four YAML assets, and `descriptions.json`.
- Regenerated: `.gemini/commands/spec_kit/plan.toml`, `.gemini/commands/spec_kit/complete.toml`.
- Deleted: `.opencode/command/spec_kit/start.md`, both `spec_kit_start_*.yaml` assets, and `.gemini/commands/spec_kit/start.toml`.

## 4. Non-Goals
- Do not modify any canonical packet doc or any file under review.
- Do not mutate packet 012 internals or re-open historical artifacts.
- Do not run memory save or implementation workflows.

## 5. Stop Conditions
- Minimum 3 iterations before convergence can stop the loop.
- Stop early only if rolling average stays below 0.10, all 5 dimensions are covered, and no unresolved P0 findings were introduced in the last 3 iterations.
- Otherwise stop at iteration 10.

## 6. Completed Dimensions
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness | FAIL | 001,003,006,008 | Found broken intra-packet references, overstated closeout status, an unwired `--intake-only` stop path in the live plan workflows, broken skill-graph metadata paths that fail validation, and stale deleted-surface identifiers lingering in the complete YAML pair. |
| interconnection_integrity | CONDITIONAL | 002,005 | The shared intake contract is still duplicated inside live command prompts, and the regenerated Gemini prompts faithfully mirror that duplication and the seven-step terminology drift instead of introducing new parity-only defects. |
| maintainability | CONDITIONAL | 007 | Template READMEs still teach manual folder/file copying instead of the canonical intake flow, and Level 3+ omits continuity guidance carried by the lower-level template docs. |
| security | CONDITIONAL | 009 | Cross-runtime delegation docs are mostly clean, but the Copilot runtime still lacks the spec-packet governance route that the other runtimes now document. |
| traceability | FAIL | 004 | Forward-looking command indexes still advertise the deleted `start` surface despite the prose sweep. |

## 7. Running Findings
- **P0:** 4 active
- **P1:** 4 active
- **P2:** 4 active
- **Known Findings:**
  - `P001-COR-001` - spec.md risk sections cite nonexistent checklist rows (`CHK-008`, `CHK-017`, `CHK-005`).
  - `P001-COR-002` - implementation-summary.md overstates closeout readiness despite failed/deferred required gates.
  - `P002-IIN-001` - plan.md and complete.md still duplicate the intake questionnaire despite the shared-module claim.
  - `P002-IIN-002` - `/spec_kit:plan` step-count terminology drifts between packet docs and the live command header.
  - `P003-COR-001` - the executable plan YAMLs do not implement the advertised `--intake-only` early-stop path.
  - `P003-COR-002` - plan YAML branch and event labels still use deleted `start_delegation` terminology.
  - `P004-TRA-001` - command README indexes still advertise the deleted `start` command.
  - `P006-COR-001` - system-spec-kit graph metadata still points to nonexistent runtime agent files and fails skill-graph validation.
  - `P007-MAI-001` - template level quick starts still teach manual `mkdir/cp` setup instead of routing through canonical intake.
  - `P007-MAI-002` - Level 3+ omits resume/save continuity notes that lower template levels still carry.
  - `P008-COR-001` - complete YAML workflows still expose `start_delegation_*` identifiers even after the start surface deletion.
  - `P009-SEC-001` - Copilot delegation docs omit the spec-packet governance route that the other runtimes now advertise.

## 8. What Worked
- Cross-checking spec.md risk/mitigation prose against checklist row numbers quickly exposed broken packet-local references (iteration 001).
- Verifying implementation-summary claims against REQ/CHK gates highlighted closeout drift instead of relying on prose at face value (iteration 001).
- Comparing the claimed shared-module contract against the live command prompts exposed duplicated questionnaire text that grep alone would have missed (iteration 002).
- Auditing the executable YAML rather than the markdown command doc exposed a runtime-breaking gap: the flag is documented, but the workflow branch is absent (iteration 003).
- Widening the sweep beyond literal `/spec_kit:start` strings found stale command-table entries that a slash-only grep would miss (iteration 004).
- Decoding the Gemini TOML `prompt` payloads and comparing them against the source markdown established that the regenerated runtime files are prompt-faithful mirrors plus a `User request: {{args}}` suffix, which is the right way to test parity for serialized prompt surfaces (iteration 005).
- Running the skill-advisor health check and graph validator separated routing correctness from metadata correctness: routing still passes, but the validator pinpoints the exact dead `derived.key_files` paths that break graph health (iteration 006).
- Comparing the templates root README against each level README exposed lifecycle guidance that was updated at the top level but not propagated into the operator quick-start sections beneath it (iteration 007).
- Re-auditing all four YAML assets together showed the runtime-gap blocker remains isolated to the plan pair, while the completion pair still carries stale `start_delegation_*` identifiers that were easy to miss when reviewing only the plan assets (iteration 008).
- Comparing all four runtime delegation references side-by-side made the missing Copilot packet-governance lane obvious; the install guides were already aligned, so the asymmetry is isolated to the Copilot delegation reference itself (iteration 009).
- Final adversarial P0 recheck reconfirmed all four blockers directly against source files and validation output, while the remaining modified docs (`system-spec-kit/README.md`, `sk-deep-research/*`, `sk-deep-review/README.md`, `.opencode/README.md`, root `README.md`) stayed clean in the closing sweep (iteration 010).

## 9. What Failed
- Counting only top-level acceptance items in spec.md was insufficient; the real integrity breaks were in secondary risk-mitigation references (iteration 001).
- Exact token searches for `/spec_kit:start` alone are not enough for this packet; several defects are semantic drifts rather than stale literal references (iteration 002).
- Searching only for the literal flag inside YAML misses the real issue; the decisive evidence was the missing conditional edge before `step_1_request_analysis` (iteration 003).
- Literal `/spec_kit:start` grep misses bare `start` table entries; table-driven docs need structural review, not just string replacement checks (iteration 004).
- Raw grep against escaped TOML text is noisy and misleading; parity review needed decoded prompt comparison rather than literal-line inspection (iteration 005).
- README-only review would have missed the real graph defect; the failing `skill_graph_compiler.py --validate-only` run was necessary to expose the dead runtime-agent references (iteration 006).
- Reading only the templates root README would have hidden the operator-facing drift; the real mismatch sits in the level-specific quick-start blocks that still prescribe manual copying (iteration 007).
- Reviewing only the plan YAMLs understated the rename problem; the same deleted-surface vocabulary still survives in both complete YAMLs (iteration 008).
- Literal deleted-command greps stayed clean in runtime docs; the remaining runtime issue is an omitted governance route, not a stale `/spec_kit:start` string (iteration 009).
- A max-iteration synthesis pass is still necessary when blockers remain; coverage alone was not enough to justify convergence because the P0 set survived adversarial recheck (iteration 010).

## 10. Exhausted Approaches
- None yet.

## 11. Ruled Out Directions
- `decision-record.md` ADR coverage itself is not missing: ADR-001 through ADR-009 are present and consistently marked Accepted (iteration 001).
- The five-state taxonomy itself is aligned across `intake-contract.md`, `plan.md`, and `complete.md`; the drift is in duplicated prompts and terminology, not state names (iteration 002).
- Install guides, `.opencode/README.md`, root `README.md`, and CLI delegation references appear clean for literal `/spec_kit:start` references in the reviewed ranges (iteration 004).
- The regenerated Gemini `plan.toml` and `complete.toml` files do not introduce markdown-vs-TOML semantic drift; they reproduce the source markdown verbatim except for the standard trailing `User request: {{args}}` suffix (iteration 005).
- `system-spec-kit/SKILL.md` command boosts no longer reference `/spec_kit:start`, and the skill-advisor regression harness still passes all 52 cases; the new defect is isolated to graph metadata, not top-level routing behavior (iteration 006).
- The addendum README's composition model remains aligned with the intake-contract narrative; the drift is in level quick starts and Level 3+ workflow notes, not the addendum structure itself (iteration 007).
- All four YAML assets do reference the shared intake contract and canonical metadata files; the remaining correctness drift is branch wiring in the plan pair and stale naming across the full YAML set, not a missing intake-contract hookup (iteration 008).
- Claude, Codex, Gemini, and the install guides no longer advertise `/spec_kit:start`; the only runtime delegation gap left is Copilot's missing spec-packet routing lane (iteration 009).
- `system-spec-kit/README.md`, `sk-deep-research/SKILL.md`, `sk-deep-research/references/spec_check_protocol.md`, `sk-deep-review/README.md`, `.opencode/README.md`, and root `README.md` all stayed aligned with the merged intake semantics in the final sweep (iteration 010).

## 12. Next Focus
Loop complete -> `review/review-report.md` written with FAIL verdict, remediation plan, and convergence evidence.

## 13. Cross-Reference Status
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 004 | Forward-looking command indexes still contradict the shipped command surface by advertising `start`. |
| `checklist_evidence` | core | partial | 004 | Packet checklist rows exist, but command indexes still lag behind the documented migration. |
| `feature_catalog_code` | overlay | partial | 002 | Shared-module parity is incomplete because the live command prompts still duplicate the intake questionnaire. |
| `playbook_capability` | overlay | partial | 009 | Runtime/operator docs are mostly aligned, but Copilot still lacks the spec-packet governance lane documented by the other runtimes. |

## 14. Files Under Review
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `spec.md` | correctness | 001 | 1 P0, 0 P1, 0 P2 | partial |
| `plan.md` | correctness | 001 | 0 P0, 0 P1, 0 P2 | reviewed |
| `tasks.md` | correctness | 001 | 0 P0, 0 P1, 0 P2 | reviewed |
| `checklist.md` | correctness | 001 | 0 P0, 0 P1, 0 P2 | reviewed |
| `decision-record.md` | correctness | 001 | 0 P0, 0 P1, 0 P2 | reviewed |
| `implementation-summary.md` | correctness | 001 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | interconnection_integrity | 002 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/command/spec_kit/plan.md` | interconnection_integrity, correctness | 003 | 1 P0, 1 P1, 1 P2 | partial |
| `.opencode/command/spec_kit/complete.md` | interconnection_integrity | 002 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | correctness | 003 | 1 P0, 0 P1, 1 P2 | partial |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | correctness | 003 | 1 P0, 0 P1, 1 P2 | partial |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | correctness | 008 | 0 P0, 0 P1, 1 P2 | partial |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | correctness | 008 | 0 P0, 0 P1, 1 P2 | partial |
| `.gemini/commands/spec_kit/plan.toml` | interconnection_integrity | 005 | 0 P0, 1 P1, 1 P2 | partial |
| `.gemini/commands/spec_kit/complete.toml` | interconnection_integrity | 005 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/SKILL.md` | correctness | 006 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/system-spec-kit/graph-metadata.json` | correctness | 006 | 1 P0, 0 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/README.md` | synthesis | 010 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/system-spec-kit/templates/README.md` | maintainability | 007 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/system-spec-kit/templates/level_2/README.md` | maintainability | 007 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/templates/level_3/README.md` | maintainability | 007 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/templates/level_3+/README.md` | maintainability | 007 | 0 P0, 1 P1, 1 P2 | partial |
| `.opencode/skill/system-spec-kit/templates/addendum/README.md` | maintainability | 007 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/sk-deep-research/SKILL.md` | synthesis | 010 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` | synthesis | 010 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/sk-deep-review/README.md` | synthesis | 010 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/skill-advisor/README.md` | correctness | 006 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | correctness | 006 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/cli-claude-code/references/agent_delegation.md` | security | 009 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/cli-codex/references/agent_delegation.md` | security | 009 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/cli-gemini/references/agent_delegation.md` | security | 009 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skill/cli-copilot/references/agent_delegation.md` | security | 009 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/install_guides/README.md` | security | 009 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | security | 009 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/README.md` | synthesis | 010 | 0 P0, 0 P1, 0 P2 | reviewed |
| `README.md` | synthesis | 010 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/command/README.txt` | traceability | 004 | 1 P0, 0 P1, 0 P2 | partial |
| `.opencode/command/spec_kit/README.txt` | traceability | 004 | 1 P0, 0 P1, 0 P2 | partial |

## 15. Review Boundaries
- Max iterations: 10
- Convergence threshold: 0.10
- Session lineage: sessionId=`deep-review-015-2026-04-15T13-52-46Z`, parentSessionId=`null`, generation=`1`, lineageMode=`new`
- Findings registry: `review/findings-registry.json`
- Review target type: `spec-folder`
- Start time: `2026-04-15T13:52:46Z`
