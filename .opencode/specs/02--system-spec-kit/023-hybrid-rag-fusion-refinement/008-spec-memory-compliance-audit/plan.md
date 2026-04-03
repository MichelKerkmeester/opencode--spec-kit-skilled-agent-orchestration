---
title: "Implementation Plan: Spec & [02--system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/plan]"
description: "4-phase execution plan: baseline discovery, spec document fixes across 186 folders (131 top-level + 55 phase children), memory quality review and cleanup, and full database rebuild from zero."
trigger_phrases:
  - "spec compliance plan"
  - "audit implementation"
  - "memory cleanup plan"
  - "database reindex plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Spec & Memory Compliance Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter, Shell scripts, TypeScript |
| **Framework** | Spec Kit v2.2 (CORE + ADDENDUM template architecture) |
| **Storage** | SQLite (context-index.sqlite), Voyage AI embeddings |
| **Testing** | validate.sh, validate-memory-quality.ts, memory_health() |

### Overview
This plan audits all 186 spec folders (66 active top-level + 65 archived + 55 phase children) for CORE + ADDENDUM v2.2 template compliance, reviews and cleans up all memory files against the 14-rule V-rule quality framework, then rebuilds the SQLite context-index database from zero to eliminate dead and test entries. Execution is strictly sequential across 4 phases: discovery, spec fixes, memory cleanup, database rebuild.

### Folder Inventory Summary

| Category | Active | Archived | Phase Children | Total |
|----------|--------|----------|----------------|-------|
| 00--ai-systems-non-dev | 6 | 0 | 10 | 16 |
| 01--anobel.com | 7 | 28 | 0 | 35 |
| 02--system-spec-kit | 5 | 20 | 45 | 70 |
| 03--commands-and-skills | 38 | 0 | 0 | 38 |
| 04--agent-orchestration | 10 | 17 | 0 | 27 |
| **Total** | **66** | **65** | **55** | **186** |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified — all scripts and tools exist
- [x] Predecessor phase 007 complete
- [x] Complete folder inventory verified against filesystem

### Definition of Done
- [ ] All 121 active folders (66 top-level + 55 phase children) pass validate.sh --strict (0 errors)
- [ ] All 65 archived folders pass validate.sh (0 errors, warnings tolerated)
- [ ] 0 hard-block V-rule violations in surviving memory files
- [ ] Database rebuilt from zero, memory_health() healthy
- [ ] Search regression passes (memory_search returns >0 results)
- [ ] Implementation summary written
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Batch audit and remediation — scan, fix, verify pattern applied to documentation artifacts.

### Key Components
- **validate.sh**: Primary spec document validation tool (--strict, --json, --recursive flags)
- **validate-memory-quality.ts**: 14-rule V-rule framework for memory file quality
- **backfill-frontmatter.js**: Bulk frontmatter normalization (--dry-run, --apply, --include-archive)
- **cleanup-orphaned-vectors.js**: Stale vector row cleanup
- **reindex-embeddings.js**: Full database rebuild with embedding regeneration
- **memory_health()**: MCP tool for database health verification
- **memory_bulk_delete()**: MCP tool for batch memory deletion by tier

### Data Flow
```
Phase 1: Scan all 186 folders → capture baseline JSON reports
Phase 2: Fix spec docs per folder → re-validate → confirm 0 errors
Phase 3: Validate memories → delete bad → fix surviving → normalize frontmatter
Phase 4: Backup DB → delete → reindex all → verify health + search
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery & Baseline
- [ ] Run validate.sh --json --strict on all 121 active folders (66 top-level + 55 phase children)
- [ ] Run validate.sh --json --strict on all 65 archived folders
- [ ] Run backfill-frontmatter.js --dry-run --include-archive
- [ ] Run validate-memory-quality.ts on all memory files
- [ ] Run memory_health() and memory_index_scan() for current DB state
- [ ] Run cleanup-orphaned-vectors.js --dry-run
- [ ] Compile discovery summary with quantitative issue counts

**Output**: `research/discovery-summary.md` with per-folder pass/fail and per-rule violation counts.

### Phase 2: Spec Document Fixes

Fix each folder's spec documents for: YAML frontmatter, SPECKIT_LEVEL comment, SPECKIT_TEMPLATE_SOURCE comment, ANCHOR markers, template placeholders, missing required files per level, and phase-child headers.

#### 2A — 00--ai-systems-non-dev (16 folders)

**Active (6):**
- `001-global-shared`
- `002-sales-communication-flows`
- `003-sales-process-automation`
- `004-prompt-improver`
- `005-sales-direct-communication`
- `006-product-owner`

**Phase children (10):**
- `001-global-shared/001-hvr-refinement-repo-analysis`
- `001-global-shared/002-brand-knowledge`
- `001-global-shared/003-hvr-refinement-repo-analysis`
- `001-global-shared/004-hvr-multi-lingual`
- `001-global-shared/005-routing-review`
- `002-sales-communication-flows/001-initial-creation`
- `003-sales-process-automation/001-initial-creation`
- `004-prompt-improver/001-content-submission`
- `005-sales-direct-communication/001-speed-of-execution`
- `006-product-owner/001-variables-cg-p-2`

#### 2B — 01--anobel.com (35 folders)

**Active (7):**
- `029-anobel-performance-analysis`
- `030-label-product-content-attr`
- `031-fix-download-btn-transition-glitch`
- `032-cloudflare-r2-migration`
- `033-form-upload-issues`
- `034-form-bot-problem`
- `035-hero-contact-success`

**Archived (28):**
- `z_archive/001-finsweet-performance`
- `z_archive/002-tab-menu-border-fix`
- `z_archive/003-btn-download-alignment`
- `z_archive/004-table-of-content`
- `z_archive/005-minify-javascript`
- `z_archive/006-video-play-pause-hover`
- `z_archive/007-notification-system`
- `z_archive/008-social-share-cms`
- `z_archive/009-security-remediation`
- `z_archive/010-css-performance-cv`
- `z_archive/011-form-input-upload-select`
- `z_archive/012-notification-time-scheduling`
- `z_archive/013-font-performance`
- `z_archive/014-notification-hero-spacing`
- `z_archive/015-performance-hacks`
- `z_archive/016-form-persistence`
- `z_archive/017-link-card-product-adv`
- `z_archive/018-blog-sort-fix`
- `z_archive/019-form-attribute-audit`
- `z_archive/020-attribute-cleanup`
- `z_archive/021-decoding-async-analysis`
- `z_archive/022-performance-optimization`
- `z_archive/023-performance-review`
- `z_archive/024-language-selector-hover`
- `z_archive/025-load-toggle`
- `z_archive/026-mobile-btn-link-feedback`
- `z_archive/027-download-btn-on-mobile`
- `z_archive/028-hero-flicker-debug`

#### 2C — 02--system-spec-kit (70 folders)

**Active top-level (5):**
- `021-spec-kit-phase-system`
- `022-hybrid-rag-fusion`
- `023-hybrid-rag-fusion-refinement`
- `024-compact-code-graph`
- `999-sqlite-to-turso`

**Phase children of 022-hybrid-rag-fusion (26):**
- `001-hybrid-rag-fusion-epic`
- `002-indexing-normalization`
- `003-constitutional-learn-refactor`
- `004-ux-hooks-automation`
- `005-architecture-audit`
- `006-feature-catalog`
- `007-code-audit-per-feature-catalog`
- `008-hydra-db-based-features`
- `009-perfect-session-capturing`
- `010-template-compliance-enforcement`
- `011-skill-alignment`
- `012-command-alignment`
- `013-agents-alignment`
- `014-agents-md-alignment`
- `015-manual-testing-per-playbook`
- `016-rewrite-memory-mcp-readme`
- `017-update-install-guide`
- `018-rewrite-system-speckit-readme`
- `019-rewrite-repo-readme`
- `020-post-release-fixes`
- `021-ground-truth-id-remapping`
- `022-spec-doc-indexing-bypass`
- `023-ablation-benchmark-integrity`
- `024-codex-memory-mcp-fix`
- `025-mcp-runtime-hardening`
- `026-memory-database-refinement`

**Phase children of 023-hybrid-rag-fusion-refinement (8):**
- `001-shared-esm-migration`
- `002-mcp-server-esm-migration`
- `003-scripts-interop-refactor`
- `004-verification-and-standards`
- `005-test-and-scenario-remediation`
- `006-review-remediation`
- `007-hybrid-search-null-db-fix`
- `008-spec-memory-compliance-audit`

**Phase children of 024-compact-code-graph (11):**
- `001-precompact-hook`
- `002-session-start-hook`
- `003-stop-hook-tracking`
- `004-cross-runtime-fallback`
- `005-command-agent-alignment`
- `006-documentation-alignment`
- `007-testing-validation`
- `008-structural-indexer`
- `009-code-graph-storage-query`
- `010-cocoindex-bridge-context`
- `011-compaction-working-set`

**Archived (20):**
- `z_archive/001-fix-command-dispatch`
- `z_archive/002-agent-routing-doc-update`
- `z_archive/003-node-modules-relocation`
- `z_archive/004-script-audit-comprehensive`
- `z_archive/005-upgrade-speckit-docs`
- `z_archive/006-generate-context-subfolder`
- `z_archive/007-upgrade-level-script`
- `z_archive/008-codex-system-wide-audit`
- `z_archive/009-full-spec-doc-indexing`
- `z_archive/010-documentation-alignment`
- `z_archive/011-upgrade-auto-populate`
- `z_archive/012-spec-doc-anchor-tags`
- `z_archive/013-memory-overhaul-and-agent-upgrade-release`
- `z_archive/014-memory-index-txt-support`
- `z_archive/015-anchor-enforcement-automation`
- `z_archive/016-index-workflows-code`
- `z_archive/017-command-adherence`
- `z_archive/018-mcp-issues-after-update`
- `z_archive/019-readme-and-summary-with-hvr`
- `z_archive/020-mcp-working-memory-hybrid-rag`

#### 2D — 03--commands-and-skills (38 folders)

- `001-cli-gemini-creation`
- `002-sk-git-github-mcp-integration`
- `003-sk-prompt-initial-creation`
- `004-skill-advisor-refinement`
- `005-cli-codex-creation`
- `006-sk-git-superset-worktrees`
- `007-cli-claude-code-creation`
- `008-cli-copilot-creation`
- `009-cli-self-invocation-guards`
- `010-sk-doc-rename`
- `011-sk-doc-template-folders`
- `012-cmd-create-emoji-enforcement`
- `013-cmd-create-codex-compatibility`
- `014-cmd-memory-output`
- `015-cmd-create-changelog`
- `016-sk-code-review-creation`
- `017-cmd-create-prompt`
- `018-sk-code-opencode-refinement`
- `019-cmd-create-skill-merger`
- `020-cmd-create-readme-install-merger`
- `021-sk-doc-feature-catalog-testing-playbook`
- `022-mcp-coco-integration`
- `023-sk-deep-research-creation`
- `024-sk-deep-research-refinement`
- `025-cmd-create-feature-catalog`
- `026-cmd-create-manual-testing-playbook`
- `027-cmd-create-yaml-refinement`
- `028-sk-deep-research-testing-playbook`
- `029-sk-deep-research-first-upgrade`
- `030-sk-deep-research-review-mode`
- `031-sk-coco-index-cmd-integration`
- `032-sk-doc-readme-hvr-improvements`
- `033-skill-command-readme-rewrite`
- `034-sk-deep-research-review-folders`
- `035-sk-deep-research-path-migration`
- `036-sk-deep-research-review-split`
- `037-cmd-merge-spec-kit-phase`
- `038-cmd-create-changelog-and-releases`

#### 2E — 04--agent-orchestration (27 folders)

**Active (10):**
- `018-opencode-agent-path-only`
- `019-incorrect-sub-agent-nesting`
- `020-agent-sonnet-upgrade`
- `021-codex-orchestrate`
- `022-context-overload-prevention`
- `023-gemini-cli-compatibility`
- `024-agent-ultra-think`
- `025-codex-cli-agents`
- `026-review-debug-agent-improvement`
- `027-copilot-gpt-5-4-agents`

**Archived (17):**
- `z_archive/001-agents-from-oh-my-opencode`
- `z_archive/002-write-agent-enforcement`
- `z_archive/003-agent-system-upgrade`
- `z_archive/004-multi-agent-dispatch`
- `z_archive/005-agent-system-improvements`
- `z_archive/006-orchestrate-context-window`
- `z_archive/007-explore-sub-agent`
- `z_archive/008-context-loader-enforcement`
- `z_archive/009-claude-code-subagents`
- `z_archive/010-explore-routing-fix`
- `z_archive/011-context-model-optimization`
- `z_archive/012-context-model-comparison`
- `z_archive/013-agent-haiku-compatibility`
- `z_archive/014-command-agent-utilization`
- `z_archive/015-review-agent-model-agnostic`
- `z_archive/016-handover-model-codex-compat`
- `z_archive/017-agent-provider-switch`

#### 2F — Cross-Cutting Verification
- [ ] Verify all 55 phase child specs have correct parent-child headers
- [ ] Re-run validate.sh --strict on all 121 active folders — target: 0 errors
- [ ] Re-run validate.sh on all 65 archived folders — target: 0 errors (warnings tolerated)

### Phase 3: Memory Quality Review & Cleanup
- [ ] Run validate-memory-quality.ts against ALL memory files — compile results by V-rule
- [ ] Identify and list all hard-block violations (V1, V8, V9, V11, V13)
- [ ] Delete all hard-block memory files
- [ ] Run backfill-frontmatter.js --apply --include-archive
- [ ] Fix soft violations where practical (V5, V6, V12)
- [ ] Re-validate — target: 0 hard-block violations

### Phase 4: Database Rebuild & Verification
- [ ] Run cleanup-orphaned-vectors.js — remove all orphaned vectors
- [ ] Back up context-index.sqlite
- [ ] Delete context-index.sqlite
- [ ] Run reindex-embeddings.js — full reindex of all memories, constitutional rules, spec documents
- [ ] Verify memory_health() returns healthy
- [ ] Verify memory_search() returns >0 results (regression)
- [ ] Verify cleanup-orphaned-vectors.js --dry-run shows 0 orphans
- [ ] Document final DB state
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | All 186 spec folders | validate.sh --strict --json |
| Memory Quality | All memory files | validate-memory-quality.ts |
| Frontmatter | All memory files | backfill-frontmatter.js --dry-run |
| DB Health | SQLite database | memory_health() MCP tool |
| Search Regression | Search pipeline | memory_search() MCP tool |
| Orphan Check | Vector store | cleanup-orphaned-vectors.js --dry-run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| validate.sh | Internal | Green | Cannot validate spec documents |
| validate-memory-quality.ts | Internal | Green | Cannot assess memory quality |
| backfill-frontmatter.js | Internal | Green | Must normalize frontmatter manually |
| reindex-embeddings.js | Internal | Green | Cannot rebuild database |
| Voyage AI API | External | Yellow | Cannot generate embeddings; wait for quota |
| Phases 001-007 complete | Internal | Green | All predecessor phases done |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Spec fixes break validation, memory cleanup removes important data, or database rebuild fails
- **Procedure**:
  - Phase 2 rollback: `git checkout` to restore original spec documents
  - Phase 3 rollback: Restore deleted memories from git history
  - Phase 4 rollback: Restore `context-index.sqlite.bak` and restart MCP server
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Discovery) ──► Phase 2 (Spec Fixes) ──► Phase 3 (Memory Cleanup) ──► Phase 4 (DB Rebuild)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Discovery | None | Phase 2 (need baseline before fixing) |
| 2. Spec Fixes | Phase 1 | Phase 3 (spec fixes may affect memory paths) |
| 3. Memory Cleanup | Phase 2 | Phase 4 (cleanup before reindex) |
| 4. DB Rebuild | Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery & Baseline | Low-Medium | 2-3 hours |
| Spec Document Fixes (186 folders) | High | 10-20 hours |
| Memory Quality Review | Medium | 3-5 hours |
| Database Rebuild | Low | 1-2 hours |
| **Total** | **High** | **16-30 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Database backup created (context-index.sqlite.bak)
- [ ] All --dry-run outputs reviewed before destructive operations
- [ ] Git working tree clean (can revert spec doc changes)

### Rollback Procedure
1. Phase 2: `git checkout -- .opencode/specs/` to restore original spec documents
2. Phase 3: `git checkout -- .opencode/specs/**/memory/` to restore deleted memories
3. Phase 4: `cp context-index.sqlite.bak context-index.sqlite` and restart MCP server
4. Verify: Run memory_health() to confirm rollback succeeded

### Data Reversal
- **Has data migrations?** Yes (database rebuild)
- **Reversal procedure**: Restore from context-index.sqlite.bak backup
<!-- /ANCHOR:enhanced-rollback -->
