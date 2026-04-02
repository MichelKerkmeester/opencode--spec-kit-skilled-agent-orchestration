# Iteration 018

## Scope
Feature catalog and manual testing playbook alignment.

## Verdict
findings

## Findings

### P1
1. `/spec_kit:resume` capability contract in catalog/playbook understates runtime tool surface.
- Evidence:
  - ../../../../skill/system-spec-kit/feature_catalog/feature_catalog.md:52
  - ../../../../skill/system-spec-kit/feature_catalog/feature_catalog.md:61
  - ../../../../skill/system-spec-kit/feature_catalog/feature_catalog.md:291
  - ../../../../skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:10
  - ../../../../skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:16
  - ../../../../command/spec_kit/resume.md:4
  - ../../../../command/spec_kit/resume.md:252

2. Broken cross-links for feature 126 roadmap snapshot.
- Evidence:
  - ../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2509
  - ../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3627
  - ../../../../skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/126-memory-roadmap-baseline-snapshot.md:36
  - ../../../../skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/17-memory-roadmap-baseline-snapshot.md:1

3. Manual test scenario 255 uses outdated `code_graph_query` schema.
- Evidence:
  - ../../../../skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:42
  - ../../../../skill/system-spec-kit/mcp_server/tool-schemas.ts:643
  - ../../../../skill/system-spec-kit/mcp_server/tool-schemas.ts:650

### P2
1. Root catalog index does not include shipped category 22.
- Evidence:
  - ../../../../skill/system-spec-kit/feature_catalog/feature_catalog.md:34
  - ../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:36
  - ../../../../skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:1

2. Playbook release-readiness text has stale feature count.
- Evidence:
  - ../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:152
  - ../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3750

3. Case-sensitive link drift between catalog/playbook references.
- Evidence:
  - ../../../../skill/system-spec-kit/feature_catalog/feature_catalog.md:261
  - ../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3658
