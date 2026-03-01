---
title: "Implementation Plan: Skill References & Assets Indexing [133-index-workflows-code/plan]"
description: "Extend the memory indexing subsystem to support a 6th source: skill references/ and assets/ directories. Implementation adds config-driven skill selection, three new document ty..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "skill"
  - "references"
  - "assets"
  - "133"
  - "index"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Skill References & Assets Indexing

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x, Node.js 18+ |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite (better-sqlite3), sqlite-vec for embeddings |
| **Testing** | Vitest |
| **Config** | JSONC (JSON with Comments) |

### Overview
Extend the memory indexing subsystem to support a 6th source: skill `references/` and `assets/` directories. Implementation adds config-driven skill selection, three new document types, extended spec folder attribution logic, and a new file discovery function. Changes are additive—all existing indexing sources remain unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-006)
- [x] Dependencies identified (config loader, parser extension, weight system)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-010)
- [x] Tests passing (4,197 tests, 0 failures)
- [x] TypeScript compilation clean (0 errors)
- [x] Docs updated (spec/plan/tasks/checklist/decision-record.md)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered Architecture: Config Layer → Parser Layer → Handler Layer → File Discovery → Indexing Logic

### Key Components
- **skill-ref-config.ts** (NEW): Config loader for section 12, exports `SkillRefConfig`, `loadSkillRefConfig()`, `clearSkillRefConfigCache()`
- **memory-parser.ts**: Extended `extractDocumentType()` with 3 new types, `extractSpecFolder()` with `skill:NAME` logic, `isMemoryFile()` with skill reference detection
- **memory-save.ts**: Weight assignments for new document types
- **memory-index.ts**: New `findSkillReferenceFiles()` function + integration into `handleMemoryIndexScan()`
- **tool-schemas.ts**: MCP tool param `includeSkillRefs` (boolean)

### Data Flow
1. `memory_index_scan({ includeSkillRefs: true })` invoked via MCP
2. Triple feature gate check: MCP param + env var + config enabled
3. Config loader reads `skillReferenceIndexing` section from config.jsonc
4. `findSkillReferenceFiles()` discovers `.md` files from `references/` and `assets/` for whitelisted skills
5. Parser extracts document type (skill_reference | skill_checklist | skill_asset) + spec folder (skill:NAME)
6. Weight assignment (0.35 / 0.35 / 0.30) applied during indexing
7. Embedding generated and stored with metadata
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Config Infrastructure
- [x] Create `mcp_server/lib/config/skill-ref-config.ts` module
- [x] Add section 12 to `config/config.jsonc` with schema comments
- [x] Implement config loader with JSONC parsing
- [x] Add cache invalidation function `clearSkillRefConfigCache()`

### Phase 2: Parser Extensions
- [x] Extend `extractDocumentType()` with 3 new types (skill_reference, skill_checklist, skill_asset)
- [x] Extend `extractSpecFolder()` to detect skill paths and return `skill:NAME`
- [x] Extend `isMemoryFile()` to accept skill reference paths as valid memory files

### Phase 3: Weight Assignment
- [x] Update `memory-save.ts` with weight mapping:
  - `skill_reference: 0.35`
  - `skill_checklist: 0.35`
  - `skill_asset: 0.30`

### Phase 4: File Discovery
- [x] Create `findSkillReferenceFiles()` in `memory-index.ts`
- [x] Integrate into `handleMemoryIndexScan()` with triple gate check
- [x] Add `includeSkillRefs` param to `tool-schemas.ts`

### Phase 5: Testing & Verification
- [x] Add vitest test coverage for file discovery
- [x] Add vitest test coverage for document type extraction
- [x] Add vitest test coverage for config validation
- [x] Run full test suite to verify no regressions (4,197 tests passing)
- [x] TypeScript compilation verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Evidence |
|-----------|-------|-------|----------|
| Unit | Config loader, document type extraction | Vitest | Config validation tests |
| Integration | End-to-end indexing (scan → save → search) | Vitest | Memory index tests |
| Regression | All existing indexing sources work | Vitest | 4,197 tests passing |
| Manual | Config editing, search result quality | N/A | Verified during implementation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| JSONC parser | Internal | ✅ Green | Must parse config.jsonc (already available) |
| memory-parser.ts | Internal | ✅ Green | Must extend document type logic |
| memory-save.ts weights | Internal | ✅ Green | Must add weight mappings |
| File discovery infra | Internal | ✅ Green | Must integrate new function into scan |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: If skill indexing causes performance degradation or errors
- **Procedure**:
  1. Set `config.jsonc` section 12 `enabled: false` (immediate disable)
  2. OR revert commits to all 9 files
  3. Restart MCP server to reload handlers
  4. Run `memory_index_scan({ force: true })` to re-index without skill references
- **Data Reversal**: Delete skill-sourced entries from memories table: `DELETE FROM memories WHERE spec_folder LIKE 'skill:%'`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Config) ────────┐
                         ├──► Phase 4 (Discovery) ──► Phase 5 (Testing)
Phase 2 (Parser) ────────┤
                         ├──► Phase 5 (Testing)
Phase 3 (Weights) ───────┘
```

| Phase | Depends On | Blocks | Estimated Effort |
|-------|------------|--------|------------------|
| Config Infrastructure | None | Discovery | 1 hour |
| Parser Extensions | None | Testing | 1 hour |
| Weight Assignment | None | Testing | 30 minutes |
| File Discovery | Config, Parser | Testing | 1.5 hours |
| Testing & Verification | All phases | None | 1 hour |

**Total Estimated Effort**: 5 hours
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | Actual Effort |
|-------|------------|------------------|---------------|
| Config Infrastructure | Medium | 1 hour | ~1 hour |
| Parser Extensions | Medium | 1 hour | ~1 hour |
| Weight Assignment | Low | 30 minutes | ~30 minutes |
| File Discovery | High | 1.5 hours | ~1.5 hours |
| Testing & Verification | Medium | 1 hour | ~1 hour |
| **Total** | | **5 hours** | **5 hours** ✅ |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup SQLite database (production data safe)
- [x] Feature can be disabled via config (no code rollback needed)
- [x] No schema migrations (additive only)

### Rollback Procedure
1. **Immediate Disable**: Set `config.jsonc` `skillReferenceIndexing.enabled: false`
2. **Config Reload**: Restart MCP server OR call `clearSkillRefConfigCache()`
3. **Verify**: Run `memory_index_scan({ includeSkillRefs: true })` → should return 0 skill files
4. **Data Cleanup** (optional): `DELETE FROM memories WHERE spec_folder LIKE 'skill:%'`

### Data Reversal
- **Has data migrations?** No (additive only)
- **Reversal procedure**: SQL delete query (see above) or re-index with feature disabled
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────────┐
│  Phase 1: Config     │────►│  Phase 4: Discovery  │
│  (skill-ref-config)  │     │  (findSkillRefFiles) │
└──────────────────────┘     └──────────────────────┘
                             ▲                    │
┌──────────────────────┐     │                    │
│  Phase 2: Parser     │─────┘                    │
│  (document types)    │                          │
└──────────────────────┘                          │
                                                  │
┌──────────────────────┐                          │
│  Phase 3: Weights    │                          │
│  (memory-save.ts)    │                          │
└──────────────────────┘                          │
                                                  ▼
                             ┌──────────────────────┐
                             │  Phase 5: Testing    │
                             │  (vitest + manual)   │
                             └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Config Loader | None | SkillRefConfig | File Discovery |
| Parser Extensions | None | Document type logic | Testing |
| Weight Assignment | None | Weight mappings | Testing |
| File Discovery | Config, Parser | File paths | Testing |
| Testing | All phases | Verification | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Config Infrastructure** - 1 hour - CRITICAL
2. **Parser Extensions** - 1 hour - CRITICAL
3. **File Discovery** - 1.5 hours - CRITICAL
4. **Testing** - 1 hour - CRITICAL

**Total Critical Path**: 4.5 hours

**Parallel Opportunities**:
- Phase 3 (Weights) can run parallel with Phase 1-2
- Test writing can start during implementation
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Config Infrastructure Complete | Config loads, validates, caches | ✅ Complete |
| M2 | Parser Extensions Complete | 3 new document types extracted correctly | ✅ Complete |
| M3 | File Discovery Complete | `findSkillReferenceFiles()` returns correct paths | ✅ Complete |
| M4 | Integration Complete | Full scan with `includeSkillRefs: true` works | ✅ Complete |
| M5 | Testing Green | All 4,197 tests pass, TypeScript clean | ✅ Complete |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:governance -->
## L3+: GOVERNANCE & COMPLIANCE

### Config Schema Governance
- **Owner**: Config Schema Team
- **Review Process**: Schema changes require approval before merge
- **Versioning**: Config schema documented in config.jsonc comments
- **Breaking Changes**: None (additive only)

### Document Type Taxonomy Governance
- **Owner**: Memory System Architect
- **New Types**: Require ADR documentation (see decision-record.md)
- **Weight Assignment**: Must align with existing precedents (READMEs = 0.3)

### Feature Gate Policy
- **Triple Gate Rationale**: Prevents accidental indexing of all skills
- **Gate 1**: MCP param (`includeSkillRefs`) - user opt-in per call
- **Gate 2**: Env var (future use) - deployment-level control
- **Gate 3**: Config enabled - admin-level control
<!-- /ANCHOR:governance -->

---

<!-- ANCHOR:monitoring -->
## L3+: MONITORING & OBSERVABILITY

### Key Metrics
- **Indexing Performance**: Scan time with/without skill references (target: <500ms overhead)
- **File Count**: Number of skill reference files indexed per scan
- **Error Rate**: Config validation failures, missing skill directories
- **Search Quality**: Skill reference file appearance in search results

### Logging
- Config validation errors logged at ERROR level
- Missing skill directory warnings logged at WARN level
- Skill indexing activity logged at INFO level
- File discovery count logged at DEBUG level

### Alerts
- Config validation errors → notify admin
- Scan time > 2x baseline → investigate performance
<!-- /ANCHOR:monitoring -->

---

<!-- ANCHOR:adr-summary -->
## ARCHITECTURE DECISION RECORD SUMMARY

### ADR-001: Config Location (config.jsonc vs SKILL.md)
**Status**: Accepted
**Decision**: Use `config.jsonc` section 12 for `skillReferenceIndexing` settings
**Rationale**: Centralized, user-editable, follows existing config patterns
**Alternatives Rejected**: SKILL.md frontmatter (not editable by users without skill modification)

---

### ADR-002: Empty indexedSkills[] = Disabled
**Status**: Accepted
**Decision**: Empty array disables feature (opt-in per skill)
**Rationale**: Performance control, explicit intent, avoids accidental indexing
**Alternatives Rejected**: Opt-out (could index unwanted skills by default)

---

### ADR-003: Three Document Types (skill_reference | skill_checklist | skill_asset)
**Status**: Accepted
**Decision**: Use path-based heuristic to classify skill files into 3 types
**Rationale**: Enables differentiated weighting, improves search relevance
**Alternatives Rejected**: Single type (loses granularity), many types (complexity)

---

### ADR-004: Triple Feature Gate (MCP + Env + Config)
**Status**: Accepted
**Decision**: Feature requires ALL three gates enabled
**Rationale**: Defense-in-depth, multiple control points, prevents accidents
**Alternatives Rejected**: Single gate (less control), two gates (insufficient granularity)

---

### ADR-005: .md Only (No .js/.ts)
**Status**: Accepted
**Decision**: Filter to `.md` files only via `fileExtensions[]` config
**Rationale**: Parser compatibility (frontmatter extraction), focused scope
**Alternatives Rejected**: All file types (parser errors), code-specific parser (complex)

---

See `decision-record.md` for full ADR documentation with Five Checks evaluation.
<!-- /ANCHOR:adr-summary -->

---

<!--
LEVEL 3+ PLAN (~430 lines)
- Core + L2 + L3 + L3+ addendums
- Dependency graphs, milestones, governance
- Architecture decision record summaries
- Monitoring & observability
-->
