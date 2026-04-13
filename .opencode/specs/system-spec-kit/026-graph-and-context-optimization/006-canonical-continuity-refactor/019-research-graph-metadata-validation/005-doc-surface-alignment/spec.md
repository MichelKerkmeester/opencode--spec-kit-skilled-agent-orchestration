---
title: "Doc Surface Alignment: Graph Metadata Changes"
status: planned
level: 2
type: implementation
parent: 019-research-graph-metadata-validation
created: 2026-04-13
---

# Doc Surface Alignment: Graph Metadata Changes

Update all documentation surfaces affected by the 019 graph metadata implementation:
- Status derivation is now checklist-aware (implementation-summary.md presence + checklist completion)
- Key files are sanitized (shell commands, version tokens, titles filtered out)
- Entities are deduplicated (basename vs canonical-path preference)
- Trigger phrases capped at 12 (enforced in parser)
- Status values normalized to lowercase

## Surfaces to Check

### README.md / ARCHITECTURE.md
- Does ARCHITECTURE.md describe graph metadata? Update derivation rules.

### Commands
- `.opencode/command/memory/save.md` - mentions graph-metadata.json refresh. Verify accuracy.
- `.opencode/command/memory/manage.md` - mentions graph metadata as scan source. Verify.

### Agent definitions
- `AGENTS.md` - mandatory metadata rule added earlier. Verify it's still accurate with new derivation.
- `CLAUDE.md` - same mandatory metadata check.

### Skill files
- `.opencode/skill/system-spec-kit/SKILL.md` - describes graph-metadata.json. Must reflect:
  - Status now derives from checklist awareness, not just frontmatter
  - Key files are filtered (no shell commands, no version tokens)
  - Entities deduplicated with canonical-path preference
  - Trigger phrases enforced at 12
  - Status normalized to lowercase

### Skill references / assets
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md` - already updated, verify
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md` - already updated, verify

### Templates
- Do spec-kit templates reference graph-metadata.json fields or derivation behavior?
- Do the changelog templates mention metadata?

### Feature catalog / Manual testing playbook
- Graph metadata scenarios - do any test old derivation behavior that changed?
- Status-related scenarios need updated expectations

### Backfill documentation
- `scripts/graph/backfill-graph-metadata.ts` now has --active-only flag (opt-in)
- Default is inclusive (all folders including archives)
- Document this somewhere operators can find it

## Rules
- Only update docs that actually reference changed behavior
- The new derivation rules are more accurate, not more restrictive
- Don't change any limits that weren't changed in code
