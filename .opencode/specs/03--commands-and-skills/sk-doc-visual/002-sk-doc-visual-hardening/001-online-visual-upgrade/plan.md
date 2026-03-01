---
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
title: "Implementation Plan: Online Visual Upgrade (Next Stage) [001-online-visual-upgrade/plan]"
description: "This workstream upgrades sk-doc-visual with parity-first routing documentation, assets/library_versions.json plus synchronized references, template modernization, and enfo..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "online"
  - "visual"
  - "upgrade"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Online Visual Upgrade (Next Stage)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Markdown, HTML/CSS |
| **Framework** | Skill-driven docs + validator scripts |
| **Storage** | None |
| **Testing** | Shell checks (`bash`, `rg`) and spec validator |

### Overview
This workstream upgrades `sk-doc-visual` with parity-first routing documentation, `assets/library_versions.json` plus synchronized references, template modernization, and enforceable drift checks. The plan keeps `sk-doc` impact intentionally small and scoped.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Validator + drift checks passing
- [ ] Docs updated in this child workstream and implementation files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-driven documentation and validation pipeline.

### Key Components
- **Router Parity Primitives**: Runtime-aware route behavior and references map in `SKILL.md`.
- **Library Version Source**: `assets/library_versions.json` as source of truth for pinned versions and compatibility.
- **Modernized Templates**: Shared schema for metadata and token conventions.
- **Validator + Drift Scripts**: Enforce parity, version/reference completeness, and template contract.
- **Minimal `sk-doc` Touchpoint**: One cross-reference for discoverability.

### Data Flow
1. Define parity and version contracts in `assets/library_versions.json` and synchronized reference docs.
2. Update templates to modernization schema.
3. Extend validator and add drift script checks.
4. Run contract checks and capture evidence.
5. Apply one targeted `sk-doc` linkage update.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract docs
- [ ] Create `assets/library_versions.json` with artifact and compatibility entries.
- [ ] Update `quick_reference.md`, `library_guide.md`, `quality_checklist.md`, `css_patterns.md`, and `navigation_patterns.md`.
- [ ] Align `sk-doc-visual/SKILL.md` router section.

### Phase 2: Template modernization
- [ ] Define modernization schema (metadata block + token contract).
- [ ] Apply schema to three reference templates.
- [ ] Verify no non-canonical token regressions.

### Phase 3: Validator and drift enforcement
- [ ] Add parity/version checks to `validate-html-output.sh`.
- [ ] Create `check-version-drift.sh` and wire required assertions.
- [ ] Verify fail/pass behavior using controlled fixtures.

### Phase 4: Minimal cross-skill touchpoint
- [ ] Apply one scoped pointer update in `sk-doc`.
- [ ] Confirm no unrelated `sk-doc` refactors.

### Phase 5: Verification and closure
- [ ] Run validator and drift checks on upgraded artifacts.
- [ ] Capture checklist evidence and finalize implementation summary.
- [ ] Re-run spec validation for this child folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit-like script checks | Validator/drift rule behavior | `bash` |
| Contract completeness checks | Matrix and parity doc coverage | `rg` |
| Manual verification | Touchpoint scope and template consistency | Review + terminal checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-doc-visual/` files | Internal | Green | Main implementation blocked |
| `.opencode/skill/sk-doc/assets/opencode/skill_md_template.md` and `.opencode/skill/sk-doc/references/skill_creation.md` | Internal | Green | Minimal cross-skill requirement blocked |
| Shell tools (`bash`, `rg`) | Internal | Green | Verification commands unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Drift checks produce unstable false failures or template modernization causes regressions.
- **Procedure**: Revert changed templates/scripts/docs for this upgrade, rerun baseline validator checks, and restore previous matrix state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contracts) -> Phase 2 (Templates) -> Phase 3 (Validator + Drift)
                                      \-> Phase 4 (Doc Touchpoint)
Phase 3 + Phase 4 -> Phase 5 (Verify + Close)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contracts | None | Templates, Validator |
| Templates | Contracts | Validator, Verify |
| Validator + Drift | Contracts, Templates | Verify |
| Doc Touchpoint | Contracts | Verify |
| Verify + Close | Templates, Validator + Drift, Doc Touchpoint | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract docs | Medium | 1-2 hours |
| Template modernization | Medium | 2-4 hours |
| Validator + drift checks | Medium | 2-4 hours |
| Minimal doc touchpoint | Low | 30-60 minutes |
| Verification and closure | Medium | 1-2 hours |
| **Total** | | **6.5-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline validator output captured
- [ ] Drift check baseline captured
- [ ] New docs reviewed for parity/version completeness

### Rollback Procedure
1. Revert modified templates, scripts, and reference docs.
2. Remove new drift script if contract cannot be stabilized.
3. Re-run baseline validator checks.
4. Record rollback notes in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
