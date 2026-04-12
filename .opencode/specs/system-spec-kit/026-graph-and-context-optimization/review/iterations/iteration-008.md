# Review Iteration 8: 004-agent-execution-guardrails - Packet Docs and Status

## Focus
Packet doc completeness, status accuracy, and graph-metadata review for 004-agent-execution-guardrails.

## Scope
- Review target: 004-agent-execution-guardrails/
- Dimension: packet-doc-completeness, status-accuracy, graph-metadata-accuracy

## Findings

### P1-011: 004 graph-metadata leaks absolute personal filesystem paths
- Dimension: graph-metadata-accuracy
- Evidence: [SOURCE: 004-agent-execution-guardrails/graph-metadata.json:48-50 key_files, :81-93 entities]
- Impact: Three entries leak `/Users/michelkerkmeester/MEGA/Development/Code_Environment/` paths. One references a path in a separate `Barter/coder/` project. This is a privacy/portability issue -- graph-metadata is committed to git and should use relative paths.
- Hunter: Absolute paths in committed metadata files expose personal directory structure and reference files outside the repo.
- Skeptic: Could these be intentional external references? The Barter/coder path IS an external project. But graph-metadata should not contain absolute paths regardless.
- Referee: Confirmed P1. Absolute paths removed, replaced with relative references.
- Final severity: P1
- **FIXED**: Replaced key_files and entities with relative paths. Removed duplicate and external references.

```json
{"type":"claim-adjudication","claim":"004 graph-metadata contains absolute personal filesystem paths including cross-project references.","evidenceRefs":["004-agent-execution-guardrails/graph-metadata.json:48-50","004-agent-execution-guardrails/graph-metadata.json:81-93"],"counterevidenceSought":"Checked if other graph-metadata files use absolute paths. Only 004 does.","alternativeExplanation":"External AGENTS.md references may need absolute paths. Rejected: graph-metadata should use repo-relative paths only.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"If graph-metadata spec requires absolute paths for cross-repo references."}
```

### P1-012: 004 graph-metadata has duplicate entities (spec.md, plan.md, tasks.md appear twice)
- Dimension: graph-metadata-accuracy
- Evidence: [SOURCE: 004-agent-execution-guardrails/graph-metadata.json entities array]
- Impact: Duplicate entities inflate graph node counts and create ambiguous entity resolution.
- **FIXED**: Removed duplicate entities.

```json
{"type":"claim-adjudication","claim":"004 graph-metadata entities array contains duplicate spec.md, plan.md, tasks.md entries.","evidenceRefs":["004-agent-execution-guardrails/graph-metadata.json entities"],"counterevidenceSought":"Checked if duplicates have different paths. They did -- one set used full .opencode/specs/... paths, the other used relative paths. Duplicates nonetheless.","alternativeExplanation":"Different path formats might be intentional for different resolution strategies. Rejected: same semantic entity should not appear twice.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If entity dedup is handled at query time, not at storage time."}
```

### P1-013: 004 missing decision-record.md
- Dimension: packet-doc-completeness
- Evidence: [SOURCE: 004-agent-execution-guardrails/ directory listing]
- Impact: 004 has spec.md (17949 bytes), plan.md (13986 bytes), checklist.md (11602 bytes). This is clearly a substantial Level 3 packet without a decision-record.
- Skeptic: 004's scope is updating AGENTS.md files -- are there enough decisions to warrant a DR? The spec mentions multiple design choices (lean format, request-analysis block, tool ordering).
- Referee: P1 confirmed for Level 3 completeness, but lower urgency since decisions are documented in spec.md.
- Final severity: P1
- **NOT FIXED**: Flagged for follow-up. Creating decision-record.md requires content synthesis.

```json
{"type":"claim-adjudication","claim":"004-agent-execution-guardrails is a Level 3 packet missing decision-record.md.","evidenceRefs":["004-agent-execution-guardrails/ directory listing","004-agent-execution-guardrails/spec.md:1 (17949 bytes)"],"counterevidenceSought":"Checked if spec explicitly declares a lower level. No SPECKIT_LEVEL marker found in first 30 lines. File sizes suggest Level 3.","alternativeExplanation":"If 004 is actually Level 2, decision-record is optional.","finalSeverity":"P1","confidence":0.80,"downgradeTrigger":"If 004 is declared Level 2 elsewhere."}
```

### P2-007: 004 status "planned" in graph-metadata
- Dimension: status-accuracy
- Evidence: [SOURCE: 004-agent-execution-guardrails/graph-metadata.json:44]
- **FIXED**: Changed to "complete".

## Ruled Out
- Stale references: No shared memory, HYDRA, or archival-manager references found.
- Cross-references to 006/: 004 does not reference 006 child phases. It references AGENTS.md and CLAUDE.md which are root-level files. Correct.

## Sources Reviewed
- 004-agent-execution-guardrails/graph-metadata.json
- 004-agent-execution-guardrails/description.json
- 004-agent-execution-guardrails/implementation-summary.md (header)
- 004-agent-execution-guardrails/ directory listing

## Assessment
- Confirmed findings: 4 (3 P1, 1 P2)
- New findings ratio: 1.00
- noveltyJustification: First review of 004, all findings new.
- Dimensions addressed: packet-doc-completeness, status-accuracy, graph-metadata-accuracy
