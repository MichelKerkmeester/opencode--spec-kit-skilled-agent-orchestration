# Iteration 3: Corpus-wide revalidation of headed prose playbook format

## Focus
Run a corpus-wide heading check across the three requested playbook roots to verify the legacy matrix regressions are gone and to identify any remaining scenario files that still miss the required headed prose sections.

## Findings

### P0
- None.

### P1
- **F001**: Two `system-spec-kit` scenarios still miss required headed prose sections — `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:19-27` — Phase 014 still describes the prompt rewrite as completed work [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48-51] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41-45], but `M-003` enters `## 3. TEST EXECUTION` with `### Commands` and no `### Prompt`, while `M-004` has `### Prompt` but no `### Commands`, so the system-spec-kit corpus still fails the required headed-section contract in two shipped scenarios [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:19-27] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:20-36].

```json
{"type":"claim-adjudication","findingId":"F001","claim":"Two system-spec-kit manual playbook scenarios still miss the required headed prose sections after the claimed Phase 014 rewrite.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48-51",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41-45",".opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:19-27",".opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md:20-36"],"counterevidenceSought":"A corpus-wide scan checked sk-deep-review, sk-deep-research, and system-spec-kit scenario files for the full headed prose block and for any surviving 9-column execution matrices.","alternativeExplanation":"These two files might be intentional prose-first exceptions.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Explicit playbook rules documenting these two files as allowed exceptions to the headed TEST EXECUTION contract."}
```

### P2
- None.

## Ruled Out
- Cross-skill heading regressions — ruled out; representative `sk-deep-review` and `sk-deep-research` scenarios both carry the full `### Prompt / ### Commands / ### Expected / ### Evidence / ### Pass/Fail / ### Failure Triage` block [SOURCE: .claude/skills/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:44-56] [SOURCE: .claude/skills/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:44-57].

## Dead Ends
- Treating the remaining omissions as harmless prose-first exceptions — rejected because both files still define a `## 3. TEST EXECUTION` contract and Phase 014 documents the rewrite as completed, not optional [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md:48-51] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/implementation-summary.md:41-45].

## Recommended Next Focus
Review complete. The remaining remediation is narrow: add the missing headed sections to `M-003` and `M-004`, then rerun the corpus-wide heading scan.

## Assessment
- New findings ratio: 0.17
- Dimensions addressed: correctness, traceability, maintainability
- Novelty justification: The corpus-wide scan closed the two prior cross-skill findings and narrowed the remaining rewrite gap to two system-spec-kit scenarios.
