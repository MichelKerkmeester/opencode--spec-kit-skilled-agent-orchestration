# Iteration 002 — Project-Global Memory Namespace

Date: 2026-04-09

## Research question
Should `system-spec-kit` adopt Xethryon's project-global memory namespace so session continuity is not tied primarily to spec-folder memory artifacts?

## Hypothesis
Xethryon's repo-scoped memory directory likely improves ambient orientation, but a direct port would cut across Spec Kit's spec-folder governance unless it stays optional and additive.

## Method
I traced how Xethryon resolves its memory root in `paths.ts` and how the docs describe that storage. I then compared that model against Spec Kit's spec-folder save workflow, indexed content sources, and session-bootstrap surfaces.

## Evidence
- XETHRYON_CONTEXT describes "Persistent cross-session memory" stored under `~/.xethryon/projects/<project>/memory/`, separate from any specific task packet. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:11-15] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:192-209]
- `getAutoMemPath()` derives a project-scoped path using the git worktree root, so all worktrees of the same repo share a single auto-memory directory. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/paths.ts:80-129]
- Xethryon's entrypoint is a top-level `MEMORY.md` inside that project memory root. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/paths.ts:130-146]
- Spec Kit frames continuity around two linked layers: spec folders for task-local documentation and a searchable SQLite memory system for cross-session retrieval. [SOURCE: .opencode/skill/system-spec-kit/README.md:50-57]
- Spec Kit Memory indexes three source classes: task memory files, constitutional rules, and spec documents. Its canonical persistence layer is the MCP server database, not a project-global markdown namespace. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:36-57]
- `generate-context.ts` treats the explicit spec-folder target as authoritative and writes memory artifacts into `<spec-folder>/memory/`, reinforcing task-scoped provenance rather than repo-global notes. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-84] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:164-231]

## Analysis
Xethryon's strongest memory idea is not its ranking algorithm but its namespace: every repo gets an always-on ambient memory root, independent of any one feature packet. Spec Kit already solves long-term recall through the MCP database, but its human-readable authored artifacts remain mostly spec-scoped. That means a new session can recover searchable context, yet there is no first-class, repo-level narrative surface equivalent to Xethryon's shared `MEMORY.md` root. The portability risk is governance: if Spec Kit makes repo-global memory authoritative, it weakens packet lineage and explicit save targets. The safer move is an optional orientation layer that summarizes cross-packet context without replacing spec-folder memory.

## Conclusion
confidence: medium

finding: Xethryon's repo-scoped memory directory is a useful orientation pattern, but only as an additive layer. `system-spec-kit` should not replace spec-folder memory with a global markdown tree; it could, however, benefit from an optional project-orientation surface that is derived from trusted packet artifacts and surfaced during bootstrap/resume.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** define a governance rule for when repo-level orientation can be written and how it cites source packets
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for an existing repo-global authored memory surface in Spec Kit beyond the SQLite index and spec-folder docs. I found persistence and retrieval, but not a human-readable project-level orientation artifact with Xethryon's shape.

## Follow-up questions for next iteration
- Does Xethryon's post-turn memory hook show a safe way to keep a lightweight repo-level orientation summary fresh?
- Could session bootstrap surface such a summary without undermining spec-folder authority?
- How does AutoDream decide when project-global memory should be reorganized?
