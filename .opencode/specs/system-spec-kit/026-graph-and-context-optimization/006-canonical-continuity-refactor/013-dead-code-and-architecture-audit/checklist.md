---
title: "Checklist — Phase 013"
status: "planned"
level: 3
parent: "006-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 013

---

## Code Quality

- [ ] CHK-001 [P0] Zero unused imports across both workspaces
- [ ] CHK-002 [P0] Zero dead concept branches in active code
- [ ] CHK-003 [P0] Zero `console.log` in production code
- [ ] CHK-004 [P1] Zero circular dependencies
- [ ] CHK-005 [P1] Zero orphaned files (or documented exceptions)
- [ ] CHK-006 [P1] Import ordering follows sk-code-opencode convention

## Architecture

- [ ] CHK-007 [P0] ARCHITECTURE.md matches actual module layout
- [ ] CHK-008 [P1] All Phase 006 new modules documented
- [ ] CHK-009 [P1] All deleted modules removed from docs
- [ ] CHK-010 [P1] Handler → lib → storage layering verified

## READMEs

- [ ] CHK-011 [P1] Every mcp_server/ directory with >3 files has README.md
- [ ] CHK-012 [P1] New Phase 006 directories have READMEs
- [ ] CHK-013 [P2] README content matches directory contents

## Resource Map

- [ ] CHK-014 [P1] Resource map has rows for all Phase 006 new files
- [ ] CHK-015 [P1] Resource map has no rows for deleted files

## Verification

- [ ] CHK-016 [P0] Both workspace typechecks pass
- [ ] CHK-017 [P0] Affected tests pass
- [ ] CHK-018 [P0] validate.sh --strict passes on phase 013 packet
