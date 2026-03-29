# Verification Checklist: Merge spec_kit:phase into plan and complete

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `:with-phases` flag correctly parsed in plan command frontmatter and execution protocol
- [ ] CHK-011 [P0] `:with-phases` flag correctly parsed in complete command frontmatter and execution protocol
- [ ] CHK-012 [P0] YAML syntax valid in all 4 modified asset files
- [ ] CHK-013 [P1] Phase decomposition workflow in YAML matches existing `:with-research` structure
- [ ] CHK-014 [P1] `--phases N` and `--phase-names "list"` flags documented and parsed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `/spec_kit:plan:auto "test" :with-phases --phases 2` creates parent + 2 child folders
- [ ] CHK-021 [P0] `/spec_kit:plan:auto "test"` (without `:with-phases`) works unchanged
- [ ] CHK-022 [P1] `/spec_kit:complete:auto "test" :with-phases --phases 2` creates folders and proceeds to complete
- [ ] CHK-023 [P1] Phase decomposition pre-workflow populates parent with Phase Documentation Map
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — N/A (markdown/YAML only)
- [ ] CHK-031 [P0] No command injection risk in create.sh invocation — uses existing tested paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `README.txt` phase command entry removed
- [ ] CHK-041 [P1] `README.txt` `:with-phases` flag documented
- [ ] CHK-042 [P1] `CLAUDE.md` quick reference table updated
- [ ] CHK-043 [P2] Command chain references updated in plan and complete commands
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Standalone phase command file deleted
- [ ] CHK-051 [P0] Phase auto YAML asset deleted
- [ ] CHK-052 [P0] Phase confirm YAML asset deleted
- [ ] CHK-053 [P1] No orphaned references to `spec_kit:phase` in primary docs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
