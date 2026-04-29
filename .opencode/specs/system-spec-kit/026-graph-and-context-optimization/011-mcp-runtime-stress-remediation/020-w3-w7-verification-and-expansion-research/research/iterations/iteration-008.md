---
iteration: 8
focus: RQ8 - Empty/dead folder audit
newInfoRatio: 0.30
status: complete
---

# Iteration 008 - Empty Folder Audit

## Focus

Run the requested empty-folder audit against `.opencode/skill/system-spec-kit` and `.opencode/skill/system-spec-kit/mcp_server`, then identify directories that contain only placeholders.

## Commands Run

```bash
find .opencode/skill/system-spec-kit -type d -empty -not -path '*/node_modules/*' -not -path '*/dist/*' 2>/dev/null | sort
find .opencode/skill/system-spec-kit/mcp_server -type d -empty -not -path '*/node_modules/*' -not -path '*/dist/*' 2>/dev/null | sort
find .opencode/skill/system-spec-kit -type f \( -name '.gitkeep' -o -name 'index.ts' -o -name 'index.js' \) -not -path '*/node_modules/*' -not -path '*/dist/*' 2>/dev/null | sort
```

## Empty Directories Found

- `.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs`
- `.opencode/skill/system-spec-kit/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements`

## Placeholder-Only Directories Found

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/out` contains only `.gitkeep`.
- `.opencode/skill/system-spec-kit/scripts/test-fixtures/001-empty-folder` contains only `.gitkeep`.
- `.opencode/skill/system-spec-kit/scripts/test-fixtures/012-anchors-empty-memory/memory` contains only `.gitkeep`.

## Findings

### F-EMPTY-001 - P2 - Two empty directory deletion candidates

The concrete deletion candidates are:

1. `.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs`
2. `.opencode/skill/system-spec-kit/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements`

Rationale: both are empty after excluding dependency/build outputs and have no placeholder file that signals intentional retention.

### F-EMPTY-002 - P3 - Placeholder-only directories should be kept unless fixture intent changes

The `.gitkeep` directories are likely intentional. The two script test fixture directories encode empty-folder test cases, and `skill_advisor/scripts/out` likely reserves generated CLI output. Do not delete those without a test-owner decision.

## Audit Verdict

Concrete deletable candidates exist, but only two. The broader tree mostly contains intentional barrel files and placeholders.

## Next Focus

Iteration 009 should assess enterprise-readiness gaps: RBAC, tenant isolation, SLA, audit, observability, compliance, capacity, and alerting.
