# Phase 6: Documentation Alignment

## Summary
Update all documentation to reflect the new hook system. This covers the feature catalog, manual testing playbook, SKILL.md, ARCHITECTURE.md, README files, and agent reference docs.

## What to Document

### 1. Feature Catalog Entries (`.opencode/skill/system-spec-kit/feature_catalog/`)

New feature entries needed:

| Feature | Category | Description |
|---------|----------|-------------|
| PreCompact Hook | Context Preservation | Precomputes critical context before compaction and caches to temp file |
| SessionStart Priming | Context Preservation | Injects relevant prior work at session startup/resume/compaction |
| Stop Token Tracking | Observability | Tracks token usage via transcript parsing and saves snapshots |
| Cross-Runtime Fallback | Compatibility | Tool-based context injection for runtimes without hook support |
| Runtime Detection | Infrastructure | Capability-based runtime identification with hook policy classification |
| CocoIndex Integration | Context Enrichment | CocoIndex provides semantic code search complementing structural code graph and memory context |

### 2. Manual Testing Playbook (`.opencode/skill/system-spec-kit/manual_testing_playbook/`)

New test scenarios:

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| PreCompact fires on compaction | Trigger auto-compact in Claude Code | Cache file written, context precomputed |
| SessionStart injects post-compact | Resume after compaction | Cached context injected into conversation |
| SessionStart primes on startup | Start new Claude Code session | Prior work context surfaced |
| Stop hook saves context | End Claude Code session | Token snapshot saved, session context preserved |
| Codex CLI recovery | Trigger compaction in Codex | Tool-based recovery fires via Gate 1 |
| Cross-runtime consistency | Compare recovery across runtimes | Same context surfaced regardless of runtime |

### 3. SKILL.md Updates (`.opencode/skill/system-spec-kit/SKILL.md`)

Add section covering:
- Hook system overview (PreCompact, SessionStart, Stop)
- Hook registration in `.claude/settings.local.json`
- Hook script locations and compilation
- Relationship between hooks and existing MCP tools
- Design principle: hooks are transport, not separate business logic

- Reference CocoIndex Code MCP as companion system for semantic code search
- Document the complementary architecture: CocoIndex (semantic) + Code Graph (structural) + Memory (session)

### 4. ARCHITECTURE.md Updates (`.opencode/skill/system-spec-kit/ARCHITECTURE.md`)

Add hook architecture:
- Hook lifecycle diagram (PreCompact -> cache -> SessionStart -> inject)
- Hook state management (temp files, session ID mapping)
- Runtime adapter pattern (hooks vs tool fallback)
- Token tracking data flow (transcript -> parse -> snapshot table)
- Three-system integration diagram showing CocoIndex, Code Graph, and Memory as parallel context sources
- Query-intent routing documentation

### 5. README Updates

- `.opencode/skill/system-spec-kit/README.md` — Hook capabilities in feature list
- `.opencode/skill/README.md` — Updated system-spec-kit description
- `README.md` (root) — New capabilities mentioned
- `AGENTS.md` — Updated if agent definitions changed in Phase 5
- `AGENTS_example_fs_enterprises.md` — Updated if relevant

### 6. Reference and Template Updates

- `.opencode/skill/system-spec-kit/references/` — Any reference docs mentioning compaction
- `.opencode/skill/system-spec-kit/assets/` — Templates referencing compaction recovery

## Acceptance Criteria
- [ ] Feature catalog entries created for all 5 hook-related features
- [ ] Manual testing playbook has scenarios for each hook and cross-runtime fallback
- [ ] SKILL.md documents hook system and registration
- [ ] ARCHITECTURE.md includes hook architecture diagram
- [ ] Root README mentions new context preservation capabilities
- [ ] AGENTS.md updated if agent definitions changed
- [ ] All docs pass sk-doc quality standards (DQI score)
- [ ] No stale references to pre-hook compaction approach remain

## Files Modified
- NEW: Feature catalog entries in `.opencode/skill/system-spec-kit/feature_catalog/`
- NEW: Testing playbook scenarios in `.opencode/skill/system-spec-kit/manual_testing_playbook/`
- EDIT: `.opencode/skill/system-spec-kit/SKILL.md`
- EDIT: `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- EDIT: `.opencode/skill/system-spec-kit/README.md`
- EDIT: `.opencode/skill/README.md`
- EDIT: `README.md` (root)
- EDIT: `AGENTS.md` (if needed)
- EDIT: `.opencode/skill/system-spec-kit/references/` (if needed)
- EDIT: `.opencode/skill/system-spec-kit/assets/` (if needed)

## LOC Estimate
~200-300 lines (feature catalog + playbook entries) + ~100-150 lines (SKILL.md/ARCHITECTURE.md updates) + ~50-80 lines (README updates)
