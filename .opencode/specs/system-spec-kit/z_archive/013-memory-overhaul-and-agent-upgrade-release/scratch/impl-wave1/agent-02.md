# Agent 02 - Wave 1 Slice A02 (Spec 130 docs updates)

Date: 2026-02-16
Owner: Agent 02
Scope: README alignment for post-spec126/127 behavior

## Files Updated

1. `.opencode/skill/system-spec-kit/mcp_server/lib/README.md`
2. `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`
3. `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`

## What Changed

### 1) lib/README.md

- Updated key stats to explicitly reflect:
  - 7 intent set (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`).
  - 5-source indexing model (spec memories, constitutional files, skill READMEs, project READMEs, spec documents).
  - schema v13 milestone (`document_type`, `spec_level`) used for spec-doc indexing/scoring.
- Added feature-table coverage for:
  - document-type scoring.
  - spec document indexing via `includeSpecDocs` (default true).
- Added a short "Spec 126 Hardening References" subsection pointing to code/tests that enforce the behavior.

### 2) lib/search/README.md

- Updated schema language to align with post-spec126 reality:
  - replaced v1-v9/v12-only framing with v13-aware framing.
  - expanded schema table to include v13 (`document_type`, `spec_level`) and current follow-up schema (v14).
- Updated vector-index facade note to reference migrations that include v13.
- Updated migration example text to avoid stale "to v12" wording.
- Added spec126 hardening references section:
  - `tests/spec126-full-spec-doc-indexing.vitest.ts`
  - `handlers/memory-index.ts`

### 3) tests/README.md

- Added explicit feature coverage entry for post-spec126/127 topics:
  - 5-source indexing
  - 7 intents
  - schema v13 fields
  - document-type scoring
  - `includeSpecDocs`
- Added missing test files in the structure map:
  - `handler-memory-index-cooldown.vitest.ts`
  - `spec126-full-spec-doc-indexing.vitest.ts`
- Added those files to key-file and coverage tables with concise purpose statements.

## Factual Alignment Notes

- Source checks confirm `includeSpecDocs` exists and defaults to true in tool schema and handler args.
- Source checks confirm 7 intents include `find_spec` and `find_decision`.
- Source checks confirm schema v13 added `document_type` and `spec_level` migrations; docs now describe that explicitly.
- Current schema constant is higher than v13, but docs preserve v13 as the key milestone requested for this slice.

## Hardening References Included

- `handlers/memory-index.ts` safety invariants around incremental indexing and post-success mtime updates.
- `tests/spec126-full-spec-doc-indexing.vitest.ts` for document-type/scoring/intent verification.
- `tests/handler-memory-index-cooldown.vitest.ts` for rate-limit/cooldown behavior.

## Checks Run

1. Skill routing check:
   - `python3 .opencode/scripts/skill_advisor.py "Implement Spec 130 docs updates (wave 1, slice A02) for system-spec-kit MCP READMEs and tests README" --threshold 0.8`
2. Source verification (grep-based):
   - schema markers (`v13`, `SCHEMA_VERSION`)
   - `includeSpecDocs` and env override
   - 7-intent symbols (`find_spec`, `find_decision`)
   - document-type scoring and spec-doc references

No code execution tests were run; this slice is documentation-only.
