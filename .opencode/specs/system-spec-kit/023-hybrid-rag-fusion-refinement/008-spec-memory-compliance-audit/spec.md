---
title: "Feature Specification: Spec & [system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/spec]"
description: "Comprehensive compliance audit of all 186 spec folders (131 top-level + 55 phase children) and memory files against CORE + ADDENDUM v2.2 templates, with memory quality review and full database re-index from zero."
trigger_phrases:
  - "spec compliance audit"
  - "memory quality review"
  - "template compliance"
  - "database reindex"
  - "spec validation sweep"
  - "memory cleanup"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Spec & Memory Compliance Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-hybrid-search-null-db-fix |
| **Successor** | 009-reindex-validator-false-positives |
| **Handoff Criteria** | All surviving docs in this assigned scope validate cleanly, surviving memories pass V-rule validation, and the rebuilt database reports healthy |

This is **Phase 8** of the ESM Module Compliance specification. It is the final cross-cutting documentation and database hygiene sweep after the runtime migration and search fixes completed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After completing 7 phases of ESM migration, the spec and memory ecosystem has accumulated document drift, template non-compliance, and memory quality degradation across 186 spec folders (66 active top-level + 65 archived + 55 phase children). An unknown fraction have missing or malformed YAML frontmatter, missing SPECKIT_LEVEL/SPECKIT_TEMPLATE_SOURCE comments, incomplete ANCHOR markers, unfilled template placeholders, missing required documents for their declared level, and memory files that violate the 14-rule V-rule quality framework.

### Purpose
Bring the entire spec and memory ecosystem to 100% template compliance, remove bad/useless memories, and rebuild the database from zero to ensure a clean, fully-indexed knowledge base with no dead or test entries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 186 spec folders (66 active + 65 archived + 55 phase children) against validate.sh --strict rules
- Fix non-compliant spec documents against CORE + ADDENDUM v2.2 templates
- Validate all memory files against V1-V14 quality rules
- Delete memories with hard-block violations (V1, V8, V9, V11, V13)
- Fix surviving memories with soft violations (V5, V6, V12)
- Normalize memory frontmatter via backfill-frontmatter.js
- Drop and rebuild the context-index.sqlite database from zero
- Remove all dead entries (paths that no longer exist) and test entries
- Verify database health and search functionality post-rebuild

### Out of Scope
- Changing runtime code (ESM, search pipeline, MCP server logic) — documentation only
- Creating new specs or memories — only fixing existing ones
- Modifying the validation rules or templates themselves — staying on v2.2
- Template version upgrades — compliance to current v2.2 standard

### Complete Folder Inventory

**186 total folders** = 66 active top-level + 65 archived + 55 phase children

---

#### 00--ai-systems-non-dev (6 active, 0 archived, 10 phase children = 16 total)

**Active:**
1. `001-global-shared`
2. `002-sales-communication-flows`
3. `003-sales-process-automation`
4. `004-prompt-improver`
5. `005-sales-direct-communication`
6. `006-product-owner`

**Phase children of 001-global-shared:**
1. `001-global-shared/001-hvr-refinement-repo-analysis`
2. `001-global-shared/002-brand-knowledge`
3. `001-global-shared/003-hvr-refinement-repo-analysis`
4. `001-global-shared/004-hvr-multi-lingual`
5. `001-global-shared/005-routing-review`

**Phase children of 002-sales-communication-flows:**
6. `002-sales-communication-flows/001-initial-creation`

**Phase children of 003-sales-process-automation:**
7. `003-sales-process-automation/001-initial-creation`

**Phase children of 004-prompt-improver:**
8. `004-prompt-improver/001-content-submission`

**Phase children of 005-sales-direct-communication:**
9. `005-sales-direct-communication/001-speed-of-execution`

**Phase children of 006-product-owner:**
10. `006-product-owner/001-variables-cg-p-2`

---

#### 00--anobel.com (7 active, 28 archived, 0 phase children = 35 total)

**Active:**
1. `029-anobel-performance-analysis`
2. `030-label-product-content-attr`
3. `031-fix-download-btn-transition-glitch`
4. `032-cloudflare-r2-migration`
5. `033-form-upload-issues`
6. `034-form-bot-problem`
7. `035-hero-contact-success`

**Archived (z_archive/):**
1. `001-finsweet-performance`
2. `002-tab-menu-border-fix`
3. `003-btn-download-alignment`
4. `004-table-of-content`
5. `005-minify-javascript`
6. `006-video-play-pause-hover`
7. `007-notification-system`
8. `008-social-share-cms`
9. `009-security-remediation`
10. `010-css-performance-cv`
11. `011-form-input-upload-select`
12. `012-notification-time-scheduling`
13. `013-font-performance`
14. `014-notification-hero-spacing`
15. `015-performance-hacks`
16. `016-form-persistence`
17. `017-link-card-product-adv`
18. `018-blog-sort-fix`
19. `019-form-attribute-audit`
20. `020-attribute-cleanup`
21. `021-decoding-async-analysis`
22. `022-performance-optimization`
23. `023-performance-review`
24. `024-language-selector-hover`
25. `025-load-toggle`
26. `026-mobile-btn-link-feedback`
27. `027-download-btn-on-mobile`
28. `028-hero-flicker-debug`

---

#### system-spec-kit (5 active, 20 archived, 45 phase children = 70 total)

**Active:**
1. `021-spec-kit-phase-system`
2. `022-hybrid-rag-fusion`
3. `023-hybrid-rag-fusion-refinement`
4. `024-compact-code-graph`
5. `999-sqlite-to-turso`

**Phase children of 022-hybrid-rag-fusion (26):**
1. `022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic`
2. `022-hybrid-rag-fusion/002-indexing-normalization`
3. `022-hybrid-rag-fusion/003-constitutional-learn-refactor`
4. `022-hybrid-rag-fusion/004-ux-hooks-automation`
5. `022-hybrid-rag-fusion/005-architecture-audit`
6. `022-hybrid-rag-fusion/006-feature-catalog`
7. `022-hybrid-rag-fusion/007-code-audit-per-feature-catalog`
8. `022-hybrid-rag-fusion/008-hydra-db-based-features`
9. `022-hybrid-rag-fusion/009-perfect-session-capturing`
10. `022-hybrid-rag-fusion/010-template-compliance-enforcement`
11. `022-hybrid-rag-fusion/011-skill-alignment`
12. `022-hybrid-rag-fusion/012-command-alignment`
13. `022-hybrid-rag-fusion/013-agents-alignment`
14. `022-hybrid-rag-fusion/014-agents-md-alignment`
15. `022-hybrid-rag-fusion/015-manual-testing-per-playbook`
16. `022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme`
17. `022-hybrid-rag-fusion/017-update-install-guide`
18. `022-hybrid-rag-fusion/018-rewrite-system-speckit-readme`
19. `022-hybrid-rag-fusion/019-rewrite-repo-readme`
20. `022-hybrid-rag-fusion/020-post-release-fixes`
21. `022-hybrid-rag-fusion/021-ground-truth-id-remapping`
22. `022-hybrid-rag-fusion/022-spec-doc-indexing-bypass`
23. `022-hybrid-rag-fusion/023-ablation-benchmark-integrity`
24. `022-hybrid-rag-fusion/024-codex-memory-mcp-fix`
25. `022-hybrid-rag-fusion/025-mcp-runtime-hardening`
26. `022-hybrid-rag-fusion/026-memory-database-refinement`

**Phase children of 023-hybrid-rag-fusion-refinement (8):**
1. `023-hybrid-rag-fusion-refinement/001-shared-esm-migration`
2. `023-hybrid-rag-fusion-refinement/002-mcp-server-esm-migration`
3. `023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor`
4. `023-hybrid-rag-fusion-refinement/004-verification-and-standards`
5. `023-hybrid-rag-fusion-refinement/005-test-and-scenario-remediation`
6. `023-hybrid-rag-fusion-refinement/006-review-remediation`
7. `023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix`
8. `023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit`

**Phase children of 024-compact-code-graph (11):**
1. `024-compact-code-graph/001-precompact-hook`
2. `024-compact-code-graph/002-session-start-hook`
3. `024-compact-code-graph/003-stop-hook-tracking`
4. `024-compact-code-graph/004-cross-runtime-fallback`
5. `024-compact-code-graph/005-command-agent-alignment`
6. `024-compact-code-graph/006-documentation-alignment`
7. `024-compact-code-graph/007-testing-validation`
8. `024-compact-code-graph/008-structural-indexer`
9. `024-compact-code-graph/009-code-graph-storage-query`
10. `024-compact-code-graph/010-cocoindex-bridge-context`
11. `024-compact-code-graph/011-compaction-working-set`

**Archived (z_archive/):**
1. `001-fix-command-dispatch`
2. `002-agent-routing-doc-update`
3. `003-node-modules-relocation`
4. `004-script-audit-comprehensive`
5. `005-upgrade-speckit-docs`
6. `006-generate-context-subfolder`
7. `007-upgrade-level-script`
8. `008-codex-system-wide-audit`
9. `009-full-spec-doc-indexing`
10. `010-documentation-alignment`
11. `011-upgrade-auto-populate`
12. `012-spec-doc-anchor-tags`
13. `013-memory-overhaul-and-agent-upgrade-release`
14. `014-memory-index-txt-support`
15. `015-anchor-enforcement-automation`
16. `016-index-workflows-code`
17. `017-command-adherence`
18. `018-mcp-issues-after-update`
19. `019-readme-and-summary-with-hvr`
20. `020-mcp-working-memory-hybrid-rag`

---

#### 03--commands-and-skills (38 active, 0 archived, 0 phase children = 38 total)

**Active:**
1. `001-cli-gemini-creation`
2. `002-sk-git-github-mcp-integration`
3. `003-sk-prompt-initial-creation`
4. `004-skill-advisor-refinement`
5. `005-cli-codex-creation`
6. `006-sk-git-superset-worktrees`
7. `007-cli-claude-code-creation`
8. `008-cli-copilot-creation`
9. `009-cli-self-invocation-guards`
10. `010-sk-doc-rename`
11. `011-sk-doc-template-folders`
12. `012-cmd-create-emoji-enforcement`
13. `013-cmd-create-codex-compatibility`
14. `014-cmd-memory-output`
15. `015-cmd-create-changelog`
16. `016-sk-code-review-creation`
17. `017-cmd-create-prompt`
18. `018-sk-code-opencode-refinement`
19. `019-cmd-create-skill-merger`
20. `020-cmd-create-readme-install-merger`
21. `021-sk-doc-feature-catalog-testing-playbook`
22. `022-mcp-coco-integration`
23. `023-sk-deep-research-creation`
24. `024-sk-deep-research-refinement`
25. `025-cmd-create-feature-catalog`
26. `026-cmd-create-manual-testing-playbook`
27. `027-cmd-create-yaml-refinement`
28. `028-sk-deep-research-testing-playbook`
29. `029-sk-deep-research-first-upgrade`
30. `030-sk-deep-research-review-mode`
31. `031-sk-coco-index-cmd-integration`
32. `032-sk-doc-readme-hvr-improvements`
33. `033-skill-command-readme-rewrite`
34. `034-sk-deep-research-review-folders`
35. `035-sk-deep-research-path-migration`
36. `036-sk-deep-research-review-split`
37. `037-cmd-merge-spec-kit-phase`
38. `038-cmd-create-changelog-and-releases`

---

#### 04--agent-orchestration (10 active, 17 archived, 0 phase children = 27 total)

**Active:**
1. `018-opencode-agent-path-only`
2. `019-incorrect-sub-agent-nesting`
3. `020-agent-sonnet-upgrade`
4. `021-codex-orchestrate`
5. `022-context-overload-prevention`
6. `023-gemini-cli-compatibility`
7. `024-agent-ultra-think`
8. `025-codex-cli-agents`
9. `026-review-debug-agent-improvement`
10. `027-copilot-gpt-5-4-agents`

**Archived (z_archive/):**
1. `001-agents-from-oh-my-opencode`
2. `002-write-agent-enforcement`
3. `003-agent-system-upgrade`
4. `004-multi-agent-dispatch`
5. `005-agent-system-improvements`
6. `006-orchestrate-context-window`
7. `007-explore-sub-agent`
8. `008-context-loader-enforcement`
9. `009-claude-code-subagents`
10. `010-explore-routing-fix`
11. `011-context-model-optimization`
12. `012-context-model-comparison`
13. `013-agent-haiku-compatibility`
14. `014-command-agent-utilization`
15. `015-review-agent-model-agnostic`
16. `016-handover-model-codex-compat`
17. `017-agent-provider-switch`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baseline scan of all 186 folders | JSON report in research/ showing per-folder pass/fail |
| REQ-002 | All 66 active top-level + 55 phase children pass validate.sh --strict | 0 errors across all active folders |
| REQ-003 | 0 hard-block V-rule violations in surviving memories | No V1, V8, V9, V11, V13 violations remain |
| REQ-004 | Database rebuilt from zero with memory_health() healthy | memory_health() returns healthy, vectorSearchAvailable: true |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | 65 archived spec folders pass validate.sh (0 errors) | Warnings tolerated, errors eliminated |
| REQ-006 | Memory frontmatter normalized | backfill-frontmatter.js --dry-run shows 0 remaining gaps |
| REQ-007 | 0 orphaned vectors after rebuild | cleanup-orphaned-vectors.js --dry-run shows 0 orphans |
| REQ-008 | Search regression passes | memory_search() returns >0 results for standard queries |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: validate.sh --strict returns 0 errors for all 121 active folders (66 top-level + 55 phase children)
- **SC-002**: validate-memory-quality shows 0 hard-block violations across all surviving memories
- **SC-003**: memory_health() reports healthy with vectorSearchAvailable: true after full reindex
- **SC-004**: memory_search() returns >0 results for standard queries (regression check)
- **SC-005**: validate.sh returns 0 errors for all 65 archived spec folders (warnings tolerated)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

### Acceptance Scenarios

**Given** the phase scope and requirements are loaded, **when** implementation starts, **then** only in-scope files and behaviors are changed.

**Given** the phase deliverables are implemented, **when** verification runs, **then** required checks complete without introducing regressions.

**Given** this phase depends on predecessor outputs, **when** those dependencies are present, **then** this phase behavior composes correctly with adjacent phases.

**Given** this phase modifies documented behavior, **when** packet docs are reviewed, **then** spec/plan/tasks/checklist remain internally consistent.

**Given** this phase is rerun in a clean environment, **when** the same commands are executed, **then** outcomes are reproducible.

**Given** completion is claimed, **when** evidence is inspected, **then** each required acceptance outcome is explicitly supported.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scale — 186 folders is a large manual sweep | High | Batch by category, prioritize automation via validate.sh for issue identification |
| Risk | Archived folders may have significant pre-v2.2 drift | Medium | Apply relaxed standards (0 errors, warnings tolerated) for archived folders |
| Risk | Memory deletion is irreversible | High | Always run --dry-run first; document deletions before executing |
| Risk | Database rebuild requires embedding generation (API cost + time) | Medium | Corpus is smaller after Phase 3 cleanup; run during off-hours |
| Dependency | validate.sh script | Green | Exists and working |
| Dependency | backfill-frontmatter.js script | Green | Exists with --dry-run mode |
| Dependency | Voyage AI embedding API | Yellow | Required for reindex; check quota before Phase 4 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full reindex should complete within 60 minutes
- **NFR-P02**: Post-rebuild search latency remains under 500ms

### Security
- **NFR-S01**: No memory files containing secrets or credentials survive cleanup
- **NFR-S02**: Database backup created before destructive operations

### Reliability
- **NFR-R01**: All dry-run operations executed before destructive changes
- **NFR-R02**: Rollback path documented for each workstream
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Spec folders with no memory/ directory: Skip memory validation, ensure directory exists
- Memory files with completely empty content: Delete (V13 violation)
- Archived folders with pre-v2.2 templates: Fix errors only, tolerate warnings

### Error Scenarios
- validate.sh fails on a folder: Capture error, continue to next folder
- Embedding API quota exceeded during reindex: Pause, resume after quota refresh
- Memory file references non-existent spec folder: Flag as orphaned, delete

### State Transitions
- Partial completion of Phase 2: Safe — each folder is independent; resume where left off
- Phase 3 interrupted: Memory deletions already applied; re-run validation to find remaining issues
- Phase 4 interrupted: Restore from backup, restart reindex
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 186 folders, 5 categories, 55 phase children, memory files, database |
| Risk | 12/25 | Irreversible deletions, but dry-run mitigates |
| Research | 8/20 | Baseline scan needed but tools exist |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — scope and approach are well-defined. All tools and scripts exist.
<!-- /ANCHOR:questions -->
