GATE 3 PRE-ANSWERED: D (skip — documentation-only edits across three READMEs that don't have spec packets)

Skill routing: sk-doc is preselected; do not re-evaluate. Proceed directly to the task.

You may write to:
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md (if it exists)
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md (if it exists)
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/SKILL.md (if no README)
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/SKILL.md (if no README)

Do NOT modify any other file.

==========

# Task

Apply the same pattern fixes that were just landed in the root README (commit 6a3167e19) to three secondary READMEs:

1. `.opencode/skill/system-spec-kit/mcp_server/README.md` — the MCP server reference
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` (or `SKILL.md` if no README) — Code Graph subsystem
3. `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md` (or `SKILL.md` if no README) — Skill Advisor subsystem

# Pattern fixes

These READMEs currently read like incremental patch notes. Rewrite them to describe **current state** in plain present tense, as if the system has always worked this way.

## Pattern A — Drop update-flavored language

Replace:
- "X now does Y" → "X does Y"
- "X now ships with Y" → "X ships with Y" (or "X has Y")
- "Recently Y was added so..." → "Y is wired so..."
- "Phase NNN tightened/added/landed Z" → just describe Z directly
- "Was deferred; now landed" → just describe the current behavior
- "Updated to support Z" → "Supports Z"

Keep "now" only when it has a true temporal meaning (e.g. "the cache is now stale and must be rebuilt"). Drop it everywhere it just signals "this changed in a recent update."

## Pattern B — Strip internal spec/phase numbers

Remove or rephrase any of these that appear in narrative text:
- `Phase 012`, `Phase 017`, `Phase 027`, `Phase NNN` — drop the phase reference and just describe the behavior
- `packet-NNN`, `packet 024` — drop
- `012/005`, `012/004`, `012/003`, `012/002`, `010/007 T-A`, `010/007/T-X` — drop
- `ADR-012-NNN`, `ADR-NNN-NNN` — drop unless an ADR is genuinely a stable cross-reference target users should read; in that case keep the link but drop the parenthetical "(ADR-012-005)" tag
- `T-A`, `T-B`, `T-C` task IDs — drop unless inside a tasks.md style block
- `H-56-1`, `H-NNN` hotfix tags — drop
- `INV-FN`, `INV-NNN` invariant tags — keep ONLY if they're a stable referenced concept; otherwise drop

Spec folder paths (e.g. `.opencode/specs/.../026-graph-and-context-optimization/`) ARE allowed when the README is genuinely linking the user to a specific spec packet for further reading. Do not strip those — only strip the "Phase NNN landed this" *narrative* references.

## Pattern C — Keep technical content, change tone

Do NOT remove:
- Code examples
- Tool tables and signatures
- Field lists and schemas
- File paths and line numbers
- Architecture diagrams
- Threshold values
- Test counts and benchmarks

Only change the **prose** that surrounds these to read as current state.

# Procedure

1. For each target file, read it once end-to-end.
2. List every section that contains pattern A or pattern B language.
3. Apply the rewrites in place using Edit tool calls.
4. After all rewrites, do a final grep to confirm no remaining " now ", `Phase \d{3}`, `packet-\d`, `\d{3}/\d{3}`, `ADR-\d+-\d+`, or `H-\d+` in narrative paragraphs (allow these inside fenced code blocks if any).
5. If a target README does not exist, skip it silently (mention in the summary which files you modified vs skipped).

# Output

When done, print a single line summary listing files modified, total lines changed, and any patterns you couldn't strip cleanly without losing meaning. Do NOT commit; the operator will review and commit.
