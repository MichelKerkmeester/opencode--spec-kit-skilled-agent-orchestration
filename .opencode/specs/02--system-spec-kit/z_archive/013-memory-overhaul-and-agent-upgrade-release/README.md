# Spec 130 — Memory Overhaul & Agent Upgrade Release

<!-- SPECKIT_LEVEL: 3+ -->

> Umbrella specification for cross-system documentation alignment following 11 source specs across 3 tracks.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [PURPOSE](#purpose)
- [SOURCE SPECS](#source-specs)
- [DEPENDENCY GRAPH](#dependency-graph)
- [SUBTASKS](#subtasks)
- [RELATED DOCUMENTS](#related-documents)

---
<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This README documents the purpose and usage of this spec folder and links to the primary artifacts in this directory.

---
<!-- /ANCHOR:overview -->

## OVERVIEW

This specification-only umbrella produces audit and alignment specs for 11 source specs (014–016 agent system, 122–129 spec-kit system) that have been implemented but whose documentation artifacts have not been audited for cross-referential consistency. No code changes — only spec documents in this 130/ folder.

<!-- ANCHOR:purpose -->
## PURPOSE

This specification-only umbrella produces audit and alignment specs for 11 source specs (014–016 agent system, 122–129 spec-kit system) that have been implemented but whose documentation artifacts have not been audited for cross-referential consistency. No code changes — only spec documents in this 130/ folder.
<!-- /ANCHOR:purpose -->

<!-- ANCHOR:source-specs -->
## SOURCE SPECS

### Agent System Track (specs 014–016)

| Spec | Title | Changelog | Key Changes |
|------|-------|-----------|-------------|
| 014 | Command agent routing | v2.0.2.0 (03--agent-orchestration) | 18 files, @speckit/@context/@review routing |
| 015 | Review model-agnostic | v2.0.2.0 (03--agent-orchestration) | 1 file, model field removed |
| 016 | Handover Haiku + Codex conversion | v2.0.3.0 (03--agent-orchestration) | 11 files, Codex frontmatter, 4 profiles |

### Spec-Kit System Track (specs 122–129)

| Spec | Title | Changelog | Key Changes |
|------|-------|-----------|-------------|
| 122 | Documentation quality upgrade | v2.2.13.0 | ~85 files, superlatives removed, HVR |
| 123 | Generate-context subfolder fix | v2.2.14.0 | 3 files, path resolution |
| 124 | Upgrade-level script | v2.2.15.0 | 1 file, 1,490+ LOC |
| 125 | System-wide remediation | v2.2.16.0 | 10 defects fixed, 14-test suite |
| 126 | Full spec doc indexing | v2.2.17.0 | Schema v13, 5th source, 7 intents, MCP server hardening |
| 127 | Documentation alignment | v2.2.17.0 | 10 files, post-126 alignment |
| 128 | AI auto-populate workflow | v2.2.18.0 | 7 files, check-placeholders.sh |
| 129 | Anchor tags | (pending) | Templates + script |

### Environment Track

| Spec | Title | Changelog | Key Changes |
|------|-------|-----------|-------------|
| 013 | README anchor infrastructure | v2.0.3.0 (00--opencode-environment) | 70 files, 469 anchor pairs |
| 016 | Codex platform integration | v2.0.4.0 (00--opencode-environment) | 11 files, 4 profiles |
| 126+127 | 5th indexing source + 7 intents | v2.0.5.0 (00--opencode-environment) | 14 files |
<!-- /ANCHOR:source-specs -->

<!-- ANCHOR:dependency-graph -->
## DEPENDENCY GRAPH

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Task 01    │  │  Task 02    │  │  Task 03    │  │  Task 04    │
│ README Audit│  │ SKILL Audit │  │ Command Aud.│  │ Agent Audit │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │                │
       └────────┬───────┴────────┬───────┘                │
                │                │                        │
                ▼                ▼                        │
         ┌─────────────┐                                  │
         │  Task 05    │◄─────────────────────────────────┘
         │ Changelogs  │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │  Task 06    │
         │ Root README │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │  Task 07    │
         │   Release   │
         └─────────────┘
```

**Tasks 01–04**: Parallel (no dependencies)
**Task 05**: Blocked by Tasks 01–04
**Task 06**: Blocked by Task 05
**Task 07**: Blocked by Task 06
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:subtasks -->
## SUBTASKS

| # | Folder | Title | Summary | Depends On |
|---|--------|-------|---------|------------|
| 01 | `task-01-readme-alignment/` | README Audit & Alignment | Audit 60+ README files across .opencode/ for version numbers, feature descriptions, and cross-references reflecting 5-source pipeline, 7 intents, and specs 122-129 features | — |
| 02 | `task-02-skill-speckit-alignment/` | SKILL.md & References Audit | Verify system-spec-kit SKILL.md and 7 reference files document upgrade-level.sh, auto-populate workflow, check-placeholders.sh, and anchor tag conventions | — |
| 03 | `task-03-command-alignment/` | Command Configs Audit | Verify 9 command .md files and YAML assets reflect spec 014 agent routing, spec 128 script references, and 5-source memory pipeline | — |
| 04 | `task-04-agent-alignment/` | Agent Configs Audit | Ensure 24 agent configs across 3 platforms match spec 016 requirements (Handover=Haiku, Review=model-agnostic, Codex-native frontmatter) | — |
| 05 | `task-05-changelog-updates/` | Changelog Creation | Create 3 changelog entries (environment v2.1.0.0, spec-kit v2.2.19.0, agents v2.0.4.0) documenting alignment work from Tasks 01-04 | Tasks 01–04 |
| 06 | `task-06-global-readme-update/` | Root README Update | Update root README.md statistics table, Memory Engine description, Spec Kit features, and Agent System counts to reflect post-alignment state | Task 05 |
| 07 | `task-07-github-release/` | Tagged Release | Create git tag v2.1.0.0 and GitHub release with notes covering Agent Updates, Spec-Kit Updates, and Documentation Updates from all prior tasks | Task 06 |
<!-- /ANCHOR:subtasks -->

<!-- ANCHOR:related-documents -->
## RELATED DOCUMENTS

- **Specification**: [spec.md](spec.md) — Full Level 3+ umbrella specification
- **Changelog Reference**: [changelog-reference.md](changelog-reference.md) — Consolidated changelog from all 11 source specs
<!-- /ANCHOR:related-documents -->
