# Iteration 6: Packet-local and playbook mirror parity for removed-flag wording

## Focus
Extended the doc audit into the canonical save playbook mirror and the packet-local `004-doc-surface-alignment` spec, checklist, and implementation summary. The goal was to decide whether the stale removed-flag wording is just residual narrative noise or whether the packet-local verification story itself is overstated.

## Findings

### P0

### P1

### P2
- **F003**: The phase-004 verification sweep did not actually guard the removed-flag semantics it claimed to cover — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment/implementation-summary.md:116` — The recorded `rg` sweep only checked broad routing tokens, so it still passed even though the canonical save playbook kept `SPECKIT_TIER3_ROUTING=true` and the packet-local closeout docs still described an opt-in/default-off Tier-3 path. The verification mechanism was too weak for the contract it claimed to prove.

{"type":"claim-adjudication","findingId":"F003","claim":"The phase-004 verification sweep was too weak to prove removed-flag/always-on Tier-3 doc parity.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment/implementation-summary.md:116",".opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md:34",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment/checklist.md:93"],"counterevidenceSought":"I checked whether the verification sweep also captured removed-flag tokens indirectly, but the saved pattern list does not include the words needed to catch the stale playbook or opt-in claims.","alternativeExplanation":"If a broader unrecorded human review happened outside the packet, the sweep weakness matters less, but the recorded packet evidence still does not prove the claim it makes.","finalSeverity":"P2","confidence":0.9,"downgradeTrigger":"Dismiss if the packet adds a stronger recorded verification step that explicitly checks removed-flag/always-on wording and passes."}

## Ruled Out
- Passing `validate.sh --strict` for phase `004` is enough by itself to prove the doc mirrors are semantically aligned with the removed-flag runtime contract.

## Dead Ends
- None.

## Recommended Next Focus
Return to the focused routing suites and verify whether any additional runtime/test gaps exist beyond the two already-open documentation findings and the metadata-host correctness issue.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: This pass found a new advisory process/verification gap after refining the broader documentation regression.
