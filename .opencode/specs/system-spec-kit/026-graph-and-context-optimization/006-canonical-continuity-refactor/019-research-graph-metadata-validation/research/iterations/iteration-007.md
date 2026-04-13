# Iteration 7: Status Derivation Versus Packet Reality

## Focus
Answer RQ-6 by comparing derived status values against packet docs and `implementation-summary.md` presence.

## Findings
1. The parser reads status only from frontmatter scalars on canonical docs, in the order `implementation-summary.md`, `checklist.md`, `tasks.md`, `plan.md`, `spec.md`, and falls back to `planned` if none are present. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:346-353] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510]
2. A representative mismatch is `00--ai-systems/001-global-shared`, where `spec.md` shows `In Progress` only inside a markdown table while `implementation-summary.md` exists without a frontmatter `status`; the derived metadata therefore remains `planned`. [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/spec.md:15-23] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/implementation-summary.md:1-20] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:43-50]
3. Status quality is broadly poor: 302 folders report `planned`, and 259 of those already have `implementation-summary.md` present beside the metadata. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. By contrast, a packet with explicit frontmatter `status: "complete"` in both spec and implementation-summary docs derives a matching `complete` value in metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/spec.md:1-10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/implementation-summary.md:1-10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:37-45]

## Ruled Out
- Treating markdown metadata tables as effective parser inputs.

## Dead Ends
- Assuming implementation-summary presence alone is already reflected by current derivation logic.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:346-353`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510`
- `.opencode/specs/00--ai-systems/001-global-shared/spec.md:15-23`
- `.opencode/specs/00--ai-systems/001-global-shared/implementation-summary.md:1-20`
- `.opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:43-50`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/spec.md:1-10`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/implementation-summary.md:1-10`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:37-45`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.6`
- Questions addressed: `RQ-6`
- Questions answered: none

## Reflection
- What worked and why: Comparing a mismatched folder and a healthy folder made the frontmatter dependency obvious.
- What did not work and why: Using packet tables as proxies for parser inputs hid the true derivation rule on the first pass.
- What I would do differently: Include a remediation option that treats implementation-summary presence as a fallback signal when frontmatter is silent.

## Recommended Next Focus
Check status normalization edge cases and compare them to backfill's current review-flag heuristics.
