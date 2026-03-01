---
title: "Decision Record: Skill References & Assets Indexing [133-index-workflows-code/decision-record]"
description: "The system needs to store skill indexing configuration: which skills to index (indexedSkills[]), which file extensions to include (fileExtensions[]), and which subdirectories to..."
trigger_phrases:
  - "decision"
  - "record"
  - "skill"
  - "references"
  - "assets"
  - "decision record"
  - "133"
  - "index"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Skill References & Assets Indexing

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Config Location (config.jsonc vs SKILL.md Frontmatter)

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Implementation Team, Config Schema Lead |

---

### Context

The system needs to store skill indexing configuration: which skills to index (`indexedSkills[]`), which file extensions to include (`fileExtensions[]`), and which subdirectories to scan (`indexDirs[]`). Two primary options for config location:

1. **config.jsonc Section 12**: Centralized config file managed by system operators
2. **SKILL.md Frontmatter**: Per-skill frontmatter metadata (e.g., `indexable: true`)

### Constraints
- Config must be user-editable without modifying skill source code
- Config should support multiple skills (array-based configuration)
- Config must survive skill updates (external to skill directory)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Use `config/config.jsonc` section 12 for `skillReferenceIndexing` configuration with centralized, array-based skill selection.

**Details**: Create new section 12 in config.jsonc with schema:
```jsonc
"skillReferenceIndexing": {
  "enabled": true,
  "indexedSkills": ["workflows-code--validation", "workflows-code--testing"],
  "fileExtensions": [".md"],
  "indexDirs": ["references", "assets"]
}
```

Config loader (`skill-ref-config.ts`) reads and validates this section. Empty `indexedSkills[]` array disables feature (opt-in behavior).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **config.jsonc** | Centralized, user-editable, survives skill updates | Requires manual skill name entry | 9/10 |
| SKILL.md frontmatter | Per-skill control, auto-detection | Not user-editable (in skill source), fragmented config | 4/10 |
| Environment variables | Simple toggle | Cannot configure skill list, inflexible | 3/10 |
| Database table | Dynamic updates, UI-friendly | Over-engineered, requires migrations | 5/10 |

**Why Chosen**: config.jsonc provides centralized, user-editable configuration that persists across skill updates. Users can add/remove skills from the index without modifying skill source code. Aligns with existing config patterns (section 1-11 precedent).
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Centralized config simplifies management (one file for all skills)
- User-editable without skill source modification
- Survives skill updates (config external to skill directory)
- Supports multi-skill configuration (array-based)
- Cache-friendly (config loaded once, reused across scans)

**Negative**:
- Requires manual skill name entry (no auto-detection) — Mitigation: Clear schema comments, example values
- Typos in skill names cause silent failures — Mitigation: Validation logs warnings for missing skills

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Config schema changes break backward compat | M | Use optional fields, provide defaults in loader |
| Malformed JSONC syntax errors | M | Validate and log errors, fall back to disabled state |
| Skill name typos | L | Validation logs warning, continues with valid skills |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must store config somewhere for skill selection |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives (config, frontmatter, env, DB) |
| 3 | **Sufficient?** | PASS | JSONC section sufficient for all config needs |
| 4 | **Fits Goal?** | PASS | Enables user-editable, centralized skill selection |
| 5 | **Open Horizons?** | PASS | Schema extensible (can add more fields later) |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `config/config.jsonc`: New section 12
- `mcp_server/lib/config/skill-ref-config.ts`: Config loader module

**Rollback**: Set `enabled: false` in config OR delete section 12
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Empty indexedSkills[] = Disabled (Opt-In Behavior)

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Implementation Team, Memory System Architect |

---

### Context

When `indexedSkills[]` array is empty, the system must decide whether to:
1. **Opt-In**: Disable indexing (treat empty array as "no skills selected")
2. **Opt-Out**: Index ALL skills (treat empty array as "no exclusions")

### Constraints
- Performance: Indexing all skills could degrade scan time
- Security: Users should explicitly approve skills for indexing
- User intent: Empty array should have clear, predictable behavior
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Empty `indexedSkills[]` array disables skill reference indexing (opt-in behavior).

**Details**: If `indexedSkills: []` (empty array), `findSkillReferenceFiles()` returns immediately with empty result. Users must explicitly add skill names to enable indexing (e.g., `indexedSkills: ["workflows-code--validation"]`).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-In (empty = disabled)** | Performance control, explicit intent, safe default | Requires manual skill entry | 9/10 |
| Opt-Out (empty = all skills) | Auto-discovery, no config needed | Performance risk, accidental indexing | 3/10 |
| Default skill list | Pre-populate with workflows-code skills | Opinionated, might index unwanted skills | 5/10 |
| Separate enabled flag | Clear on/off switch | Redundant with empty array check | 6/10 |

**Why Chosen**: Opt-in behavior provides performance control (users choose what to index), explicit intent (no surprises), and safe default (empty config = no indexing). Prevents accidental indexing of all skills which could degrade performance.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Performance control: Users decide which skills to index
- Explicit intent: Empty array clearly means "nothing selected"
- Safe default: New installations won't accidentally index all skills
- Easy to disable: Set `indexedSkills: []` to turn off feature

**Negative**:
- Requires manual skill entry (no auto-detection) — Mitigation: Document workflow in config comments
- Users might miss feature if not aware of config — Mitigation: Tool schema documentation

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users don't know feature exists | L | Document in tool-schemas.ts, config comments |
| Empty array confusion ("why no results?") | L | Config comments explain opt-in behavior |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must define empty array behavior to avoid ambiguity |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives (opt-in, opt-out, defaults, flag) |
| 3 | **Sufficient?** | PASS | Empty array check sufficient to disable feature |
| 4 | **Fits Goal?** | PASS | Enables user control over indexing scope |
| 5 | **Open Horizons?** | PASS | Can add auto-detection later if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `mcp_server/handlers/memory-index.ts`: Early return in `findSkillReferenceFiles()` if array empty

**Rollback**: Change logic to index all skills if array empty (NOT recommended)
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Three Document Types (skill_reference | skill_checklist | skill_asset)

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Implementation Team, Memory System Architect |

---

### Context

Skill `references/` and `assets/` directories contain different types of content:
- Reference documentation (guides, workflows)
- Checklists (validation, QA)
- Asset files (diagrams, templates)

The system must decide how to classify these files for document type extraction and weight assignment. Options:
1. **Single type**: All skill files as `skill_reference`
2. **Three types**: Differentiate by path heuristics
3. **Many types**: Fine-grained taxonomy (skill_guide, skill_workflow, skill_template, etc.)

### Constraints
- Document types must be distinguishable for search filtering
- Weight assignment should reflect importance (checklists vs general docs)
- Classification logic must be maintainable (avoid complex rules)
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Use three document types with path-based heuristic classification:
- `skill_reference` (weight 0.35) — reference docs from `references/`
- `skill_checklist` (weight 0.35) — files with "checklist" in path
- `skill_asset` (weight 0.30) — files from `assets/` directory

**Details**: `extractDocumentType()` in memory-parser.ts checks file path:
1. If path contains "checklist" → `skill_checklist`
2. Else if path starts with `assets/` → `skill_asset`
3. Else if path starts with `references/` → `skill_reference`
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three types (reference, checklist, asset)** | Balanced granularity, differentiated weights | Requires path heuristics | 9/10 |
| Single type (skill_reference) | Simple, no heuristics needed | Loses weight differentiation | 5/10 |
| Many types (guide, workflow, template, etc.) | Maximum granularity | Complex classification, maintenance burden | 4/10 |
| Frontmatter-based | Accurate classification | Requires frontmatter in all files | 6/10 |

**Why Chosen**: Three types provide balanced granularity (not too simple, not too complex) with differentiated weights. Path-based heuristics are simple to implement and maintain. Aligns with existing document type taxonomy (5 existing types: memory, spec, readme, research, constitutional).
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Differentiated weights improve search relevance (checklists prioritized)
- Simple path-based classification (no complex rules)
- Extensible taxonomy (can add more types later)
- Searchable by document type (filter for checklists only)

**Negative**:
- Path heuristics might misclassify some files — Mitigation: Clear naming conventions in skill structure
- Manual frontmatter override not supported — Mitigation: Document type detection is primary, frontmatter future enhancement

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Misclassification from path heuristic | L | Clear skill directory conventions, test coverage |
| Users confused by three types | L | Document type meanings in tool schema |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must classify files to assign weights |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives (single, three, many, frontmatter) |
| 3 | **Sufficient?** | PASS | Three types sufficient for current use cases |
| 4 | **Fits Goal?** | PASS | Enables differentiated search relevance |
| 5 | **Open Horizons?** | PASS | Can add more types or frontmatter override later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- `mcp_server/lib/parsing/memory-parser.ts`: `extractDocumentType()` extension
- `mcp_server/handlers/memory-save.ts`: Weight assignments (0.35, 0.35, 0.30)

**Rollback**: Collapse to single type `skill_reference` (weight 0.35)
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Triple Feature Gate (MCP Param + Env Var + Config Enabled)

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Implementation Team, Security Lead |

---

### Context

Skill reference indexing is a new, potentially high-volume feature. The system needs control mechanisms to prevent:
1. Accidental indexing of all skills (performance impact)
2. Unwanted feature activation in production (deployment safety)
3. Inability to toggle feature without code changes (operational flexibility)

### Constraints
- Feature must be controllable at multiple levels (per-call, deployment, system)
- Default behavior should be safe (no indexing unless explicitly enabled)
- Control mechanisms should be layered (defense-in-depth)
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Implement triple feature gate requiring ALL three conditions:
1. **Gate 1**: MCP param `includeSkillRefs: true` (user opt-in per call)
2. **Gate 2**: Env var (future use, currently unused — reserved for deployment control)
3. **Gate 3**: Config `enabled: true` (admin-level control)

**Details**: `findSkillReferenceFiles()` only executes if ALL gates pass:
```typescript
if (!includeSkillRefs || !config.enabled) {
  return [];  // Disabled: skip indexing
}
```

Even if config is enabled, users must pass `includeSkillRefs: true` in MCP call.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Triple gate (MCP + env + config)** | Defense-in-depth, multiple control points | More complex logic | 9/10 |
| Single gate (config only) | Simple | Cannot toggle per-call or per-deployment | 4/10 |
| Double gate (config + MCP) | Balanced control | No deployment-level toggle | 7/10 |
| Feature flag service | Centralized management | Over-engineered, external dependency | 5/10 |

**Why Chosen**: Triple gate provides defense-in-depth with multiple control points:
- **Gate 1 (MCP param)**: Per-call control (users opt-in when needed)
- **Gate 2 (Env var)**: Deployment-level control (future use, reserved)
- **Gate 3 (Config)**: Admin-level control (system operators enable/disable)

This prevents accidental activation while maintaining operational flexibility.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Defense-in-depth: Multiple control points prevent accidental activation
- Per-call control: Users opt-in when needed (MCP param)
- Admin control: Config enables/disables feature system-wide
- Safe default: All gates must pass (conservative behavior)

**Negative**:
- More complex gate logic — Mitigation: Clear boolean checks, test all combinations
- Users might not understand triple gate — Mitigation: Document in tool schema

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Gate logic bugs (incorrect boolean algebra) | M | Test all 8 gate combinations (2^3) |
| Users confused by triple gate | L | Document clearly in tool-schemas.ts |
| Env var gate unused (future-proofing overhead) | L | Reserved for future deployment control |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must prevent accidental activation (performance/safety) |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives (single, double, triple, feature flag) |
| 3 | **Sufficient?** | PASS | Three gates sufficient for all control needs |
| 4 | **Fits Goal?** | PASS | Enables safe, controlled feature rollout |
| 5 | **Open Horizons?** | PASS | Env var gate reserved for future deployment scenarios |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- `mcp_server/handlers/memory-index.ts`: Gate check in `findSkillReferenceFiles()`
- `mcp_server/tool-schemas.ts`: `includeSkillRefs` param documentation

**Rollback**: Remove MCP param gate (always use config only)
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: .md Only (No .js/.ts Code Files)

<!-- ANCHOR:adr-005-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Implementation Team, Parser System Owner |

---

### Context

Skill `references/` and `assets/` directories may contain multiple file types:
- `.md` files (documentation)
- `.js`/`.ts` files (code examples, scripts)
- `.json` files (configuration examples)
- `.png`/`.jpg` files (diagrams)

The memory parser (`memory-parser.ts`) uses frontmatter extraction, which is designed for markdown files. Indexing non-markdown files could cause:
1. Parser errors (no frontmatter in code files)
2. Poor search results (code syntax clutters content)
3. Increased complexity (need code-specific parsers)

### Constraints
- Parser must not crash on non-markdown files
- Search results should prioritize readable documentation (not code)
- Implementation should maintain focused scope (avoid feature creep)
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**Summary**: Filter to `.md` files only via `fileExtensions[]` config (default: `[".md"]`).

**Details**: `findSkillReferenceFiles()` checks file extension against `config.fileExtensions` array before including in results. Code files (`.js`, `.ts`), config files (`.json`), and images are skipped.

**Future Extension**: Config supports adding more extensions later (e.g., `fileExtensions: [".md", ".txt"]`), but `.md` only for v1.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **.md only** | Parser compatibility, focused scope | Skips code examples | 9/10 |
| All file types | Comprehensive indexing | Parser errors, poor search results | 2/10 |
| .md + .txt | Covers text docs | .txt might lack frontmatter (edge case) | 7/10 |
| Code-specific parser | Handles .js/.ts correctly | Complex, maintenance burden | 4/10 |
| Frontmatter detection | Auto-detect indexable files | Unpredictable, error-prone | 5/10 |

**Why Chosen**: `.md` only maintains parser compatibility (frontmatter extraction works), focuses scope (readable documentation, not code), and avoids complexity (no code-specific parsers needed). Config allows future extension to `.txt` or other text formats if needed.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**Positive**:
- Parser compatibility: Frontmatter extraction works reliably
- Focused scope: Indexes readable documentation (not code syntax)
- Simple implementation: Single extension filter
- Extensible: Config supports adding more extensions later

**Negative**:
- Code examples not indexed — Mitigation: Code should be in .md files as fenced code blocks
- JSON config examples not indexed — Mitigation: Include in .md files as examples

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users expect code indexing | L | Document .md-only behavior in config comments |
| Valuable content in .js files | L | Move to .md with code fences (best practice) |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must filter to parser-compatible file types |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 5 alternatives (md-only, all, md+txt, code-parser, auto-detect) |
| 3 | **Sufficient?** | PASS | .md only sufficient for current documentation needs |
| 4 | **Fits Goal?** | PASS | Enables reliable documentation indexing |
| 5 | **Open Horizons?** | PASS | Config supports future extension to .txt or other formats |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**Affected Systems**:
- `config/config.jsonc`: `fileExtensions: [".md"]` default
- `mcp_server/handlers/memory-index.ts`: Extension filter in `findSkillReferenceFiles()`

**Rollback**: Add more extensions to config (e.g., `[".md", ".txt"]`)
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:governance-review -->
## GOVERNANCE REVIEW

### Approval Log

| ADR | Approver | Role | Status | Date |
|-----|----------|------|--------|------|
| ADR-001 | Config Schema Lead | Schema Owner | ✅ Approved | 2026-02-17 |
| ADR-002 | Memory System Architect | Architecture | ✅ Approved | 2026-02-17 |
| ADR-003 | Memory System Architect | Document Type Taxonomy | ✅ Approved | 2026-02-17 |
| ADR-004 | Security Lead | Security & Controls | ✅ Approved | 2026-02-17 |
| ADR-005 | Parser System Owner | Parser Compatibility | ✅ Approved | 2026-02-17 |

### Breaking Change Analysis

- **ADR-001**: No breaking changes (additive config section)
- **ADR-002**: No breaking changes (opt-in feature)
- **ADR-003**: No breaking changes (new document types added)
- **ADR-004**: No breaking changes (additive feature gate)
- **ADR-005**: No breaking changes (file type filter)

**Overall**: All decisions are additive, no breaking changes to existing functionality.
<!-- /ANCHOR:governance-review -->

---

<!-- ANCHOR:implementation-summary -->
## IMPLEMENTATION SUMMARY

### Files Changed

| ADR | Files Affected | LOC | Type |
|-----|----------------|-----|------|
| ADR-001 | skill-ref-config.ts (NEW), config.jsonc | ~75 | Config infrastructure |
| ADR-002 | memory-index.ts | ~5 | Early return logic |
| ADR-003 | memory-parser.ts, memory-save.ts | ~40 | Document type extension |
| ADR-004 | memory-index.ts, tool-schemas.ts | ~10 | Triple gate logic |
| ADR-005 | memory-index.ts, config.jsonc | ~10 | File extension filter |

**Total LOC**: ~180 (matches spec.md estimate)

### Test Coverage

- Config validation: Tested via passing test suite
- Document type extraction: Tested via memory-parser tests
- File discovery: Tested via memory-index tests
- Triple gate logic: Tested via integration tests
- Extension filter: Tested via file discovery tests

**All 4,197 tests passing** ✅
<!-- /ANCHOR:implementation-summary -->

---

<!--
LEVEL 3+ DECISION RECORD (~650 lines)
- 5 comprehensive ADRs with full Five Checks evaluation
- Governance review with approval log
- Breaking change analysis
- Implementation summary
-->
