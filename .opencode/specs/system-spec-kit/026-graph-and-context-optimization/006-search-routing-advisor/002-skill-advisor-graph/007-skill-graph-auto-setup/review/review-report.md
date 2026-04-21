# Deep Review Report: Skill Graph Auto-Setup

## 1. Executive Summary

Verdict: CONDITIONAL.

The review found no P0 issues and no direct security findings. It did find 5 P1 issues and 5 P2 advisories. The main risk is that the packet claims completion and validation success while pointing at stale implementation paths and currently failing strict validation.

## 2. Scope

Reviewed the spec packet at:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/007-skill-graph-auto-setup`

Files requested for review: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`. `decision-record.md` is absent.

Runtime files were read-only evidence only. Review writes were limited to `review/**`.

## 3. Method

Ran 10 iterations using the requested dimension rotation:

correctness -> security -> traceability -> maintainability -> correctness -> security -> traceability -> maintainability -> correctness -> security.

Evidence included direct file reads, `rg --files` path discovery, and strict packet validation:

`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`

The validator exited `2` with `SPEC_DOC_INTEGRITY` errors for missing setup-guide markdown references and a `CONTINUITY_FRESHNESS` warning.

## 4. Findings By Severity

### P0

| ID | Dimension | Finding | Status |
|----|-----------|---------|--------|
| None | - | No P0 findings. | - |

### P1

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-COR-001 | correctness | Packet points to stale skill-advisor implementation paths. | `spec.md:101-104`, `graph-metadata.json:44-47`; actual files are under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...`. |
| DR-COR-002 | correctness | Completion evidence claims validation passed, but strict validation fails. | `checklist.md:79`; validator exits `2`; `implementation-summary.md:111` says validation was pending. |
| DR-COR-003 | correctness | Checked P0 checklist evidence references nonexistent paths or stale line ranges. | `checklist.md:66-80`; actual fallback code is around `skill_advisor.py:721-758` at the new package path. |
| DR-TRC-001 | traceability | Graph metadata status contradicts the packet completion state. | `spec.md:54` says Complete; `graph-metadata.json:42` says `in_progress`. |
| DR-TRC-002 | traceability | `description.json` parent chain still names the old `011-skill-advisor-graph` phase. | `description.json:14-19` conflicts with `description.json:2`. |

### P2

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-TRC-003 | traceability | `decision-record.md` was requested for review but is absent. | No such file in the packet; decisions appear only in `implementation-summary.md:93-100`. |
| DR-TRC-004 | traceability | Graph metadata does not encode the documented predecessor dependency. | `spec.md:58`; `graph-metadata.json:7-10`. |
| DR-MNT-001 | maintainability | Continuity timestamps are stale relative to graph metadata. | Validator `CONTINUITY_FRESHNESS` warning. |
| DR-MNT-002 | maintainability | Canonical continuity regeneration remains deferred. | `checklist.md:110`. |
| DR-MNT-003 | maintainability | Verification summary is dated before the migrated metadata state. | `checklist.md:124` versus `description.json:11`. |

## 5. Findings By Dimension

Correctness: DR-COR-001, DR-COR-002, DR-COR-003.

Security: no findings.

Traceability: DR-TRC-001, DR-TRC-002, DR-TRC-003, DR-TRC-004.

Maintainability: DR-MNT-001, DR-MNT-002, DR-MNT-003.

## 6. Adversarial Self-Check For P0

No P0 was assigned because the reviewed packet is documentation/metadata, not executable production code. The strict validator failure is serious and blocks a clean completion claim, but it is scoped to packet integrity and traceability, so P1 is the right severity.

The security passes specifically looked for leaked secrets, unsafe command guidance, trust-boundary changes, and auth/permission drift. None were found.

## 7. Remediation Order

1. Fix all stale `.opencode/skill/skill-advisor/...` references to the actual `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...` paths.
2. Re-run strict validation and update `checklist.md` plus `implementation-summary.md` with the actual result.
3. Update `graph-metadata.json` status to match completion, and regenerate metadata if required by the packet workflow.
4. Correct `description.json` parentChain from the old `011-skill-advisor-graph` lineage to the current `002-skill-advisor-graph` lineage.
5. Either add a `decision-record.md` or remove it from review expectations for this Level 2 packet.
6. Refresh continuity via the canonical save flow so frontmatter and graph metadata agree.

## 8. Verification Suggestions

Run strict validation after path fixes:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/007-skill-graph-auto-setup --strict
```

Confirm runtime path evidence:

```bash
rg --files -g 'init-skill-graph.sh' -g 'skill_advisor.py' -g 'SET-UP_GUIDE.md' .opencode
```

Confirm the setup guide regression command still points at the current package path:

```bash
sed -n '140,160p' .opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md
```

## 9. Appendix

| Iteration | Dimension | New Findings | New Findings Ratio | Churn |
|-----------|-----------|--------------|--------------------|-------|
| 001 | correctness | DR-COR-001, DR-COR-002 | 1.00 | 1.00 |
| 002 | security | none | 0.00 | 0.00 |
| 003 | traceability | DR-TRC-001, DR-TRC-002, DR-TRC-003 | 0.50 | 0.43 |
| 004 | maintainability | DR-MNT-001, DR-MNT-002 | 0.29 | 0.25 |
| 005 | correctness | DR-COR-003 | 0.13 | 0.11 |
| 006 | security | none | 0.00 | 0.00 |
| 007 | traceability | DR-TRC-004 | 0.11 | 0.10 |
| 008 | maintainability | DR-MNT-003 | 0.10 | 0.09 |
| 009 | correctness | none | 0.00 | 0.00 |
| 010 | security | none | 0.00 | 0.00 |

Final stop reason: max iterations.
