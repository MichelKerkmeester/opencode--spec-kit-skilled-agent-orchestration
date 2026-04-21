# Iteration 001: Correctness baseline on packet lineage

## Focus
Correctness review of the moved packet's persisted lineage metadata.

## Findings
### P1 - Required
- **F001**: `description.json` still records the old ancestor slug `010-search-and-routing-tuning` inside `parentChain`, even though the current packet path has already been renumbered to `001-search-and-routing-tuning`, so ancestry-aware tooling can follow stale lineage. [SOURCE: `description.json:14-20`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-88`]

## Ruled Out
- `graph-metadata.json.spec_folder` and `graph-metadata.json.packet_id` already use the current `001-search-and-routing-tuning` path, so the drift is confined to `description.json` rather than the whole packet identity surface. [SOURCE: `graph-metadata.json:3-4`]

## Dead Ends
- Re-reading `implementation-summary.md` did not reveal a second correctness defect; the summary is directionally consistent with the parser change, so the open correctness issue remains the stale ancestry metadata. [SOURCE: `implementation-summary.md:53-57`]

## Recommended Next Focus
Move to security and test whether any command-like key-file token can still survive the keep/resolution path for this packet.

## Assessment
- New findings ratio: 0.34
- Cumulative findings: 0 P0, 1 P1, 0 P2
