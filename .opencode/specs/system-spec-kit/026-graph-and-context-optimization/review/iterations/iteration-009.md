# Review Iteration 9: 005-code-graph-upgrades - Packet Docs and Code References

## Focus
Packet doc completeness, code graph code correctness references, and graph-metadata accuracy for 005-code-graph-upgrades.

## Scope
- Review target: 005-code-graph-upgrades/
- Dimension: packet-doc-completeness, graph-metadata-accuracy, code-correctness

## Findings

### P1-014: 005 graph-metadata has full shell commands in key_files and entity paths
- Dimension: graph-metadata-accuracy
- Evidence: [SOURCE: 005-code-graph-upgrades/graph-metadata.json:45-46 key_files, :78-86 entities]
- Impact: Two shell commands (cd + vitest runs) stored as key_files entries and entity paths. These are multi-line vitest invocations with TMPDIR environment variables, not file paths.
- **FIXED**: Replaced with actual test file paths. Cleaned key_files to contain only valid file paths.

```json
{"type":"claim-adjudication","claim":"005 graph-metadata stores vitest shell commands as key_files and entity paths.","evidenceRefs":["005-code-graph-upgrades/graph-metadata.json:45-46","005-code-graph-upgrades/graph-metadata.json:78-86"],"counterevidenceSought":"Same pattern as 002, 003 children. Confirmed invalid.","alternativeExplanation":"None viable.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"None."}
```

### P1-015: 005 graph-metadata status "planned" despite shipped implementation
- Dimension: status-accuracy
- Evidence: [SOURCE: 005-code-graph-upgrades/graph-metadata.json:41]
- Impact: description.json shows memorySequence:7 with extensive memoryNameHistory confirming multiple ship sessions.
- **FIXED**: Changed to "complete".

```json
{"type":"claim-adjudication","claim":"005 status is planned but memoryNameHistory shows 7 save events including 'shipped the 005-code-graph-upgrades runtime lane'.","evidenceRefs":["005-code-graph-upgrades/graph-metadata.json:41","005-code-graph-upgrades/description.json:20-27"],"counterevidenceSought":"Checked tasks.md header. Confirmed work complete.","alternativeExplanation":"None.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"None."}
```

### P2-008: 005 key_files included self-referencing spec path
- Dimension: graph-metadata-accuracy
- Evidence: [SOURCE: 005-code-graph-upgrades/graph-metadata.json:59]
- Impact: key_files included `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md` (full absolute path within repo) instead of just `implementation-summary.md`.
- Final severity: P2
- **FIXED**: Replaced with relative path in the key_files cleanup.

## Ruled Out
- Missing packet docs: 005 has complete Level 3 doc set (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json).
- Code correctness: Actual code files (shared-payload.ts, code-graph-db.ts, query.ts, context.ts, scan.ts) are referenced in key_files and entities. These are correct paths. The code itself is out of scope for this structural review.
- Stale references: No shared memory, HYDRA, or archival-manager references found.

## Sources Reviewed
- 005-code-graph-upgrades/graph-metadata.json
- 005-code-graph-upgrades/description.json
- 005-code-graph-upgrades/implementation-summary.md (header)
- 005-code-graph-upgrades/ directory listing

## Assessment
- Confirmed findings: 3 (2 P1, 1 P2)
- New findings ratio: 0.65
- noveltyJustification: Shell-command pattern is recurrent but 005-specific instances are new. Status fix is mechanical.
- Dimensions addressed: packet-doc-completeness, graph-metadata-accuracy, status-accuracy
