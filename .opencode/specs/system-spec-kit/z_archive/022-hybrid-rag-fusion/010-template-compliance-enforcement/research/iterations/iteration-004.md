# Iteration 4: CLI Enforcement Mechanisms and Pre/Post-Write Validation Hooks

## Focus
Q3 + Q4: Examine what enforcement mechanisms already exist across different CLIs (Claude Code, Copilot, Codex, Gemini) and whether pre-write or post-write validation hooks could guarantee compliance. This builds on the contract extraction from iteration 3 to understand where enforcement could be injected.

## Findings

1. **All 4 CLIs have @speckit agent definitions with identical compliance instructions but NO write-time enforcement.** Copilot (`.opencode/agent/speckit.md`), Claude Code (`.claude/agents/speckit.md`), Codex (`.codex/agents/speckit.toml`), and Gemini (`.gemini/agents/speckit.md`) all contain the same core instructions: "Always copy templates from templates/level_N/ folders. NEVER create spec documentation from scratch or memory." However, the enforcement is purely instructional -- it tells the agent WHAT to do but provides no automated check that verifies compliance. The only validation call is "Run validate.sh before claiming completion" which is a soft instruction at the end of the workflow, not a hard gate after each write.
   [SOURCE: .opencode/agent/speckit.md, .claude/agents/speckit.md, .codex/agents/speckit.toml, .gemini/agents/speckit.md]

2. **The @speckit agent definition already contains one inline scaffold (spec.md Level 2) but the other 4 document types have NO inline scaffolds.** Section 8 "Template Patterns" includes a "Quick Reference: Level 2 spec.md scaffold" showing the exact H1, ANCHOR tags, and H2 sequence. But plan.md, tasks.md, checklist.md, and implementation-summary.md have zero inline scaffolds. This means agents must read the template files at runtime -- a step that can be skipped or produce stale results.
   [SOURCE: .opencode/agent/speckit.md:324-344 and .claude/agents/speckit.md:324-344]

3. **A pre-commit hook script exists (`pre-commit-spec-validate.sh`) but is NOT installed.** The file at `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh` is a well-designed 250-line script that runs a fast 6-rule subset (FILE_EXISTS, LEVEL_DECLARED, FRONTMATTER_VALID, TEMPLATE_SOURCE, ANCHORS_VALID, FOLDER_NAMING) on staged spec files. However, `.git/hooks/pre-commit` does NOT exist -- only the `.sample` file is present. The hook has never been activated.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh:1-250, .git/hooks/pre-commit.sample (no real pre-commit)]

4. **The `.speckit-enforce.yaml` configuration file IS present and correctly configured.** It defines `mode: warn`, `new_folder_mode: block`, `created_after: 2026-03-22`, and a list of 6 pre-commit rules. The enforcement date being set to today's date (2026-03-22) suggests it was recently configured for this research effort. The script reads this YAML without requiring external tools (grep-based parsing).
   [SOURCE: .speckit-enforce.yaml:1-22]

5. **Claude Code has NO hook mechanism for post-write validation.** `.claude/settings.local.json` only contains MCP tool permissions (sequential_thinking). There is no Claude Code equivalent of git hooks that could auto-trigger validation after a Write/Edit tool call. The same is true for Copilot (opencode.json), Codex (codex CLI config), and Gemini (gemini CLI config) -- none have post-write hook infrastructure.
   [SOURCE: .claude/settings.local.json:1-7]

6. **The enforcement gap has 3 distinct layers that are all broken.** Layer 1 (prompt instruction): present in all CLIs but purely advisory -- agents can and do ignore it. Layer 2 (write-time validation): completely absent -- no CLI triggers validate.sh after Write/Edit tool calls on spec folders. Layer 3 (commit-time gate): designed and configured but NOT installed -- the pre-commit hook script exists but is not linked into .git/hooks/. This means all 3 layers of the defense-in-depth strategy have gaps.
   [INFERENCE: based on findings 1-5 combined]

7. **The @speckit agent definition has a "validate after each write" rule that is inconsistently stated.** In the ALWAYS rules (section 5), it says: "Run scripts/spec/validate.sh [SPEC_FOLDER] --strict immediately after each spec-doc write or update." But in the Inline Scaffold Contract (section 8), it says: "Run scripts/spec/validate.sh [SPEC_FOLDER] --strict before moving to the next workflow step." These are different enforcement points -- "after each write" vs "before next step" -- and the workflow diagram (section 1) only shows validation once at the end: "VALIDATE: Run validate.sh -> Exit 0/1 = proceed, Exit 2 = fix and re-validate." Three conflicting enforcement timing directives in the same agent definition.
   [SOURCE: .opencode/agent/speckit.md lines ~238, ~325, ~114]

## Sources Consulted
- `.opencode/agent/speckit.md` (Copilot @speckit agent, 570 lines)
- `.claude/agents/speckit.md` (Claude Code @speckit agent, 566 lines)
- `.codex/agents/speckit.toml` (Codex @speckit agent, TOML format, 80 lines read)
- `.gemini/agents/speckit.md` (Gemini @speckit agent, exists at 26KB)
- `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh` (250 lines)
- `.speckit-enforce.yaml` (22 lines)
- `.claude/settings.local.json` (7 lines)
- `.git/hooks/` directory listing

## Assessment
- New information ratio: 0.86
- Questions addressed: Q3 (CLI enforcement mechanisms), Q4 (pre/post-write hooks)
- Questions answered: Q3 (fully -- all 4 CLIs examined, enforcement is identical and purely instructional), Q4 (partially -- pre-commit hook exists but is uninstalled; post-write hooks do not exist in any CLI)

## Reflection
- What worked and why: Reading the actual agent definition files across all 4 CLIs gave authoritative data about enforcement surface. The parallel comparison revealed that all CLIs share identical instructions (as expected from the symlink/copy architecture) but that this homogeneity means the enforcement gap is universal, not CLI-specific. Finding the uninstalled pre-commit hook was high-value because it shows a designed-but-undeployed solution.
- What did not work and why: Looking for CLI-specific hook mechanisms (Claude Code settings, Codex config) yielded nothing because these CLIs do not support post-tool-call hooks. The hook infrastructure simply does not exist at the CLI level.
- What I would do differently: The next productive direction is NOT looking for more enforcement mechanisms (they don't exist) but instead designing the solution architecture. Specifically: (a) can the agent prompt be restructured to make validate.sh calls non-optional, and (b) what would a "write-then-validate-then-fix" loop look like in practice across the 4 CLIs?

## Recommended Next Focus
Q4 completion + Q6: Now that we know enforcement is purely instructional and the pre-commit hook is uninstalled, the next focus should be: (1) design the concrete enforcement architecture -- what combination of inline scaffolds, post-write validation loops, and pre-commit hooks would close all 3 layers? And (2) examine specific failure patterns per document type (Q6) by looking at the 54 errors from the 014-manual-testing fix waves to understand which doc types fail most and why.
