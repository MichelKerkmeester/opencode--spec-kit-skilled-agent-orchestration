# Iteration 001 - Correctness

## Focus

Correctness pass over the packet state, declared success criteria, task state, and the live feature catalog roots.

## Files Reviewed

- `spec.md`
- `tasks.md`
- `checklist.md`
- `description.json`
- `graph-metadata.json`
- `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md`
- `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md`
- `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md`

## Findings

### DRFC-P1-001 - Packet completion state is stale relative to shipped catalogs

Severity: P1

The packet still declares the feature status as planned and leaves the sk-deep-research and sk-deep-review task groups unchecked, while all three target catalog roots now exist with populated feature counts. Evidence: `spec.md:34-37` marks the packet `Planned`; `tasks.md:18-30` leaves T001-T010 unchecked; the live roots show sk-deep-research coverage at `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31`, sk-deep-review coverage at `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31`, and sk-improve-agent coverage at `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29`.

Impact: resume and completion workflows can re-route agents to implement already-created catalogs or block completion because the packet state contradicts the filesystem.

Claim adjudication packet:
- findingId: DRFC-P1-001
- claim: The packet state is stale because it says the work is planned/unchecked while the referenced catalog roots exist.
- evidenceRefs: [`spec.md:34-37`, `tasks.md:18-30`, `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31`, `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31`, `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29`]
- counterevidenceSought: Checked the target catalog directories and root catalog overviews for all three skills.
- alternativeExplanation: The packet may intentionally remain open until checklist evidence is recorded, but that still requires the task/status metadata to distinguish implemented from unverified work.
- finalSeverity: P1
- confidence: 0.91
- downgradeTrigger: Downgrade to P2 if the packet is explicitly marked as an implementation-in-progress snapshot and tasks are split into implemented vs verified states.

### DRFC-P1-002 - Feature-count acceptance criteria understate the implemented catalog surface

Severity: P1

The spec scopes the target output as approximately 12 sk-deep-research files, approximately 12 sk-deep-review files, and approximately 8 sk-improve-agent files, but the live root catalogs declare 14, 19, and 13 features respectively. Evidence: `spec.md:103-106`; `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31`; `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31`; `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29`.

Impact: the acceptance criteria no longer define the shipped surface. A future verifier can pass or fail based on stale estimates instead of the actual catalog inventory.

Claim adjudication packet:
- findingId: DRFC-P1-002
- claim: The spec's count expectations are stale relative to the implemented catalogs.
- evidenceRefs: [`spec.md:103-106`, `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31`, `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31`, `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29`]
- counterevidenceSought: Counted per-feature files and checked root overview coverage rows.
- alternativeExplanation: The `~` marker allows estimates, but the implemented delta is large enough for sk-deep-review and sk-improve-agent to make the acceptance criteria unreliable.
- finalSeverity: P1
- confidence: 0.88
- downgradeTrigger: Downgrade to P2 if the spec adds a canonical note that counts are historical estimates and the root catalogs are authoritative.

## Delta

New findings: P1=2, P2=0. No P0 findings.
