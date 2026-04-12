# Iteration 11: Traceability sweep on SKILL.md canonical continuity examples

## Focus
Post-remediation validation of `.opencode/skill/system-spec-kit/SKILL.md` after the ADR-004 allowance and graph-metadata refresh fix landed. I re-checked the corrected save-path wording, then scanned the remaining spec-folder structure guidance for contradictions with the same canonical continuity model.

## Findings

### P0
- None.

### P1
- **F011**: SKILL.md still teaches per-packet `memory/` directories as active structure — `.opencode/skill/system-spec-kit/SKILL.md:26` — The top-level spec-folder definition and the sub-folder versioning example still say packets contain optional `memory/` directories and show child packets ending in `memory/`, even though the same skill now says canonical continuity lives in `_memory.continuity`/spec docs and `generate-context.js` no longer authors standalone `memory/*.md` primary artifacts (`.opencode/skill/system-spec-kit/SKILL.md:485-501`, `.opencode/skill/system-spec-kit/SKILL.md:542`). This reintroduces outdated operator guidance after the remediation.

```json
{"type":"claim-adjudication","findingId":"F011","claim":"SKILL.md still teaches per-packet `memory/` directories as current packet structure after the canonical continuity refactor.","evidenceRefs":[".opencode/skill/system-spec-kit/SKILL.md:26",".opencode/skill/system-spec-kit/SKILL.md:485-501",".opencode/skill/system-spec-kit/SKILL.md:542"],"counterevidenceSought":"Re-checked the remediated save-path section for any explicit carve-out that preserved memory directories as an active packet requirement.","alternativeExplanation":"The example could be intended as legacy historical context, but it appears inside live spec-folder structure guidance rather than an archival section.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if the skill is explicitly re-scoped to describe legacy packet layouts and no longer presents these examples as current operator guidance."}
```

### P2
- None.

## Ruled Out
- The canonical save path now explicitly documents `graph-metadata.json` refresh — `.opencode/skill/system-spec-kit/SKILL.md:508-512`
- ADR-004 continuity edits are now correctly scoped to `_memory.continuity` in `implementation-summary.md` — `.opencode/skill/system-spec-kit/SKILL.md:512`

## Dead Ends
- The stale `memory/` examples are not explained away by historical context because they appear in the live "Contents" and "Sub-Folder Versioning" guidance, not in an archival note — `.opencode/skill/system-spec-kit/SKILL.md:26`, `.opencode/skill/system-spec-kit/SKILL.md:482-503`

## Recommended Next Focus
If this packet is reopened, rewrite the spec-folder contents bullet and sub-folder versioning example so they no longer present `memory/` directories as current packet structure.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: The targeted remediation fixed the original save-path omission, but a broader structure sweep uncovered a distinct new documentation contradiction.
