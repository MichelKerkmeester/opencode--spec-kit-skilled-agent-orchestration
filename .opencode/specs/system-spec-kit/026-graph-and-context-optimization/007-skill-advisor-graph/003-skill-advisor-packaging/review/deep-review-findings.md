---
title: "Deep Review Findings: Skill Advisor Packaging"
description: "10-iteration deep review of 003-skill-advisor-packaging across correctness, completeness, consistency, evidence quality, path accuracy, template compliance, cross-reference integrity, metadata quality, scope alignment, and actionability."
---

# Deep Review Findings: Skill Advisor Packaging

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **P0:** 0
- **P1:** 4
- **P2:** 2

This review covered every `.md` and `.json` file in the packet, plus the packaging surfaces those documents claim as evidence: `CLAUDE.md`, `.opencode/skill/skill-advisor/feature_catalog/`, `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, and `.opencode/skill/skill-advisor/graph-metadata.json`.

### Requested check outcomes

| Check | Result | Evidence |
|---|---|---|
| Packet `.md`/`.json` files read | PASS | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `description.json`, `graph-metadata.json` |
| 19 catalog markdown files exist | PASS | Command audit found `total_md=19` under `.opencode/skill/skill-advisor/feature_catalog/` |
| 18 per-feature catalog files have 4 `##` sections | PASS | Command audit found `:4` for all 18 per-feature files |
| Root catalog has 4 sections | FAIL (by strict reading) / N/A (by intent) | Root file has 6 `##` sections, not 4; per-feature files are the ones following the 4-section snippet contract |
| `skill-advisor` has a `scripts/` subfolder | PASS | `.opencode/skill/skill-advisor` directory listing includes `scripts` [SOURCE: .opencode/skill/skill-advisor:1-6] |
| Skill-advisor `graph-metadata.json` exists | PASS | Directory listing and file content confirm presence [SOURCE: .opencode/skill/skill-advisor:1-6] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:1-72] |
| Packet `graph-metadata.json` exists | PASS | Present in packet root [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/graph-metadata.json:1-21] |
| `CLAUDE.md` Gate 2 path is correct | PASS | Gate 2 points at `.opencode/skill/skill-advisor/scripts/skill_advisor.py` [SOURCE: CLAUDE.md:122-127] |
| Legacy `skill-advisor/skill_advisor.py` doc paths remain under skill-advisor docs | PASS | No matches in `feature_catalog/` or `manual_testing_playbook/` |
| Strict packet validation passes | FAIL | `validate.sh --strict` fails on anchors, level consistency, template headers, spec-doc integrity, and malformed packet graph metadata |

## 2. Iteration Log

| Iteration | Dimension | Focus | Result |
|---|---|---|---|
| 1 | correctness | Verify packet claims against on-disk artifacts | Found packet/file-name drift around the catalog root |
| 2 | completeness | Check whether required deliverables exist | 19 catalog files, `scripts/`, and `graph-metadata.json` all exist |
| 3 | consistency | Compare packet status fields vs actual state | Found stale pending/open status for already-created artifacts |
| 4 | evidence-quality | Check whether completion claims are backed by current evidence | Found stale “missing catalog” narrative in the playbook and stale open tasks in the packet |
| 5 | path-accuracy | Verify exact paths and filename casing | Found `FEATURE_CATALOG.md` vs `feature_catalog.md` mismatch |
| 6 | template-compliance | Count section structure across catalog docs | 18 per-feature files match 4-section contract; root file intentionally differs with 6 H2 sections |
| 7 | cross-reference-integrity | Verify doc-to-doc references | Strict validation found unresolved packet references in addition to the stale playbook index |
| 8 | metadata-quality | Inspect packet and skill metadata | Packet graph metadata exists but strict validation flags it as malformed |
| 9 | scope-alignment | Check whether the packet tracks the intended packaging work | Scope is still aligned, but completion tracking lags shipped artifacts and level declarations disagree |
| 10 | actionability | Assess whether next steps are clear and accurate | Current next steps are partly stale; remediation is small and concrete |

## 3. Findings Registry

### P1-001 - Root catalog filename contract is internally inconsistent

- **Severity:** P1
- **Why it matters:** The packet, packet metadata, and per-feature catalog files all describe the root catalog as `FEATURE_CATALOG.md`, but the actual shipped file is `feature_catalog.md`. That breaks path accuracy and makes completion evidence ambiguous on case-sensitive filesystems.
- **Evidence:**
  - Actual root file on disk is lowercase `feature_catalog.md` [SOURCE: .opencode/skill/skill-advisor/feature_catalog:1-5]
  - Packet spec still requires uppercase `FEATURE_CATALOG.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/spec.md:59-63] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/spec.md:120-124]
  - Packet graph metadata still advertises uppercase `FEATURE_CATALOG.md` as a key file [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/graph-metadata.json:8-16]
  - Per-feature catalog files also name the canonical root as `FEATURE_CATALOG.md` [SOURCE: .opencode/skill/skill-advisor/feature_catalog/01--routing-pipeline/01-skill-discovery.md:42-46]
- **Recommended fix:** Pick one canonical filename and update the packet docs, packet graph metadata, and per-feature metadata to match it exactly.

### P1-002 - Manual testing playbook still says the feature catalog does not exist

- **Severity:** P1
- **Why it matters:** The playbook’s feature-catalog cross-reference section currently instructs reviewers to treat the catalog as absent, which contradicts the shipped `feature_catalog/` package and makes cross-reference verification unreliable.
- **Evidence:**
  - The playbook explicitly says “Skill Advisor does not currently ship a dedicated `feature_catalog/` package” [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:241-245]
  - Every cross-reference row is still marked “No dedicated feature-catalog entry yet” [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:247-270]
  - The feature catalog package does exist and contains 19 markdown files [SOURCE: .opencode/skill/skill-advisor/feature_catalog:1-5]
- **Recommended fix:** Replace the stale “catalog gap” section with links to the actual `feature_catalog/` package and its root index.

### P2-001 - Packet status tracking is stale for already-created artifacts

- **Severity:** P2
- **Why it matters:** Several packet surfaces still list the root catalog and skill-level `graph-metadata.json` as pending/missing even though both are present, which reduces trust in the packet as the source of truth.
- **Evidence:**
  - Spec pending list still says “Add `graph-metadata.json` for skill-advisor skill folder” [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/spec.md:57-64]
  - Plan still leaves graph metadata undone [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/plan.md:52-58]
  - Tasks still leave T024 open [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/tasks.md:88-93]
  - The skill folder already contains `graph-metadata.json` [SOURCE: .opencode/skill/skill-advisor:1-6]
- **Recommended fix:** Reconcile packet status/checklist/task state with the artifacts that are already on disk.

### P1-003 - The packet is off-template and internally inconsistent under strict spec validation

- **Severity:** P1
- **Why it matters:** This packet does not currently satisfy the system-spec-kit Level 2/3 contract, so the review packet is not reliably retrievable or self-consistent for downstream tooling.
- **Evidence:**
  - `spec.md` declares Level 2 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/spec.md:22-25]
  - `checklist.md` declares Level 3 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/checklist.md:19-22]
  - Strict validation fails `ANCHORS_VALID`, `LEVEL_MATCH`, and `TEMPLATE_HEADERS` for the core packet docs
- **Recommended fix:** Normalize the packet to one declared level and add the required anchor/header structure expected by the active template contract.

### P1-004 - Packet cross-reference and metadata surfaces are still failing machine validation

- **Severity:** P1
- **Why it matters:** The packet’s machine-consumed surfaces are not clean: strict validation reports unresolved reference targets and a malformed packet `graph-metadata.json`, which weakens memory/indexing and traceability workflows.
- **Evidence:**
  - Strict validation reports `GRAPH_METADATA_PRESENT: graph-metadata.json is present but malformed`
  - Strict validation reports `SPEC_DOC_INTEGRITY` errors, including unresolved `FEATURE_CATALOG.md` and other packet reference targets
  - Packet graph metadata still advertises `.opencode/skill/skill-advisor/feature_catalog/FEATURE_CATALOG.md` as a key file even though the shipped file is lowercase [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging/graph-metadata.json:8-16]
- **Recommended fix:** Regenerate or repair packet metadata and make all packet file references resolve to the exact on-disk paths.

### P2-002 - Playbook evidence counts are stale relative to the current graph inventory

- **Severity:** P2
- **Why it matters:** The playbook preconditions encode an outdated inventory count, which weakens evidence quality for manual validation and makes future audits harder to trust.
- **Evidence:**
  - The playbook says “The 20 skill folders with `graph-metadata.json` are present” [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:67-72]
  - Current compiler validation reports `Discovered 21 skill graph-metadata.json files`
- **Recommended fix:** Update the playbook wording to reflect the current inventory or clarify that the `20` count refers only to routable skills while `skill-advisor` is an additional non-routed metadata-bearing package.

## 4. Non-Finding Notes

1. No P0 issues were found.
2. `CLAUDE.md` Gate 2 is correct and already points to `.opencode/skill/skill-advisor/scripts/skill_advisor.py` [SOURCE: CLAUDE.md:122-127].
3. No stale `skill-advisor/skill_advisor.py` or `skill-advisor/skill_graph_compiler.py` markdown references were found under the shipped `skill-advisor` docs.
4. The per-feature catalog files do satisfy the 4-section snippet rule; the root catalog is the only catalog file that does not, and it appears to be using a distinct root-document format rather than violating the snippet template.

## 5. Command Evidence

```text
$ python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health
status: ok
skills_found: 20
skill_graph_loaded: true

$ python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only
Discovered 21 skill graph-metadata.json files
VALIDATION PASSED: all metadata files are valid

$ section-count audit over .opencode/skill/skill-advisor/feature_catalog/
total_md=19
18 per-feature files => 4 H2 sections each
root feature_catalog.md => 6 H2 sections

$ bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging --strict
RESULT: FAILED
Key failures: ANCHORS_VALID, LEVEL_MATCH, SPEC_DOC_INTEGRITY, TEMPLATE_HEADERS
Warnings: GRAPH_METADATA_PRESENT (malformed), PRIORITY_TAGS, SECTION_COUNTS, SECTIONS_PRESENT
```

## 6. Recommended Next Actions

1. Normalize the root catalog filename contract (`FEATURE_CATALOG.md` vs `feature_catalog.md`) across the packet, packet metadata, and feature-catalog metadata.
2. Rewrite the playbook’s feature-catalog cross-reference index so it points to the shipped catalog instead of describing a missing package.
3. Refresh packet status/checklist/task text so open work reflects the actual remaining deltas, not already-completed artifacts.
