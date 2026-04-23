# Applied: .opencode/skill/system-spec-kit/mcp_server/README.md

## Source Flagging
- Sub-packets: 01
- Severity (from merged report): MED

## Changes Applied
- Added a short runtime hook surface summary to the `3.1.14 SKILL ADVISOR` section so the MCP server overview now names the shipped prompt-time adapters, distinguishes direct hook-output injection from Copilot's managed custom-instructions path, and points operators to the documented fallback paths.
  Before (`README.md` before edit, around line 562):
  `For package-local details, see [Skill Advisor Native Package README](skill-advisor/README.md) and [Skill Advisor Native Bootstrap](skill-advisor/INSTALL_GUIDE.md).`
  After ([README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:564)):
  `**Runtime hook surface:** prompt-time Skill Advisor adapters now ship for Claude, Gemini, Copilot, and Codex.`
  Flagged by: 01
- Added direct cross-links to the runtime hook README family and the canonical hook reference docs, and updated the existing `hooks/README.md` related-docs row so this README acts as a reliable operator entrypoint.
  Before (`README.md` before edit, around line 1664):
  `| [hooks/README.md](./hooks/README.md) | Lifecycle hook documentation for post-mutation wiring |`
  After ([README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1674)):
  `| [hooks/README.md](./hooks/README.md) | Runtime hook overview, lifecycle/helper boundaries, and links to per-runtime registration docs |`
  After ([README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1675)):
  `| [../references/hooks/skill-advisor-hook.md](../references/hooks/skill-advisor-hook.md) | Canonical cross-runtime Skill Advisor hook reference, capability matrix, and fallback contract |`
  Flagged by: 01

## Evidence Links
- Merged report row: [merged-impact-report.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/merged-impact-report.md:214)
- Per-sub-packet impact evidence: [01-impact.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/impact-analysis/01-impact.md:28)
- Supporting implementation evidence: [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/009-documentation-and-release-contract/implementation-summary.md:50)

## Verification
- Frontmatter parses: confirmed with `ruby` YAML parse against the README frontmatter (`frontmatter: ok`).
- Markdown still renders structurally: confirmed with `python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/README.md` (document parsed successfully; DQI output emitted).
- Anchors are still paired: confirmed `anchor_starts=11 anchor_ends=11`.
- No unrelated content was deleted: confirmed by `git diff -- .opencode/skill/system-spec-kit/mcp_server/README.md`, which shows only the new Skill Advisor hook-summary block and related-doc updates.

## Deferred / Unchanged
- None. The single merged-report suggestion for this file was fully applied.
