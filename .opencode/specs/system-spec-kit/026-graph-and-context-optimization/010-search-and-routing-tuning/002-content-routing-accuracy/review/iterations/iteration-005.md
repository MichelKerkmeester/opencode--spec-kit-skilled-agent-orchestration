# Iteration 5: Primary save docs versus always-on Tier-3 runtime

## Focus
Audited the primary save command, the canonical save workflow reference, and the main skill surface against the current runtime/config truth. The review looked specifically for stale wording about removed flags, disabled-state behavior, and fail-open routing semantics after the user’s stated post-flag-removal state.

## Findings

### P0

### P1
- **F002**: Removed Tier-3 flag wording still ships across the primary save docs — `.opencode/command/memory/save.md:93` — The primary docs still describe a “disabled or unavailable” Tier-3 path and an alternate non-live branch, while the config mirrors say Tier 3 is always on and the feature-flag reference marks `SPECKIT_TIER3_ROUTING` as removed. That means the doc-alignment story is still wrong on the main save surfaces operators are expected to read first.

{"type":"claim-adjudication","findingId":"F002","claim":"The primary save docs still describe a removed Tier-3 opt-in/disabled-state story even though the live runtime and feature-flag reference say Tier 3 is always on.","evidenceRefs":[".opencode/command/memory/save.md:93",".opencode/skill/system-spec-kit/references/memory/save_workflow.md:321",".opencode/skill/system-spec-kit/SKILL.md:549",".mcp.json:24",".opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:130"],"counterevidenceSought":"I checked the config mirrors and feature-flag reference to see whether the removed-flag story had already been reintroduced there, but those surfaces are current and explicitly say always-on/removed.","alternativeExplanation":"Some wording could be read as describing endpoint unavailability rather than a feature flag, but the combination of packet-local references to `SPECKIT_TIER3_ROUTING` and the removed-flag reference makes the mismatch concrete.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if the runtime reintroduces a real Tier-3 routing flag or the docs are updated to describe endpoint absence without implying an opt-in control."}

### P2

## Ruled Out
- The stale Tier-3 story is limited to packet-local `004` docs rather than the primary save docs.

## Dead Ends
- None.

## Recommended Next Focus
Check the playbook and the `004` packet-local closeout docs, because the packet summary claims those mirrors were already synchronized too.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: This was the first primary-doc parity pass and it surfaced a new P1 documentation regression.
