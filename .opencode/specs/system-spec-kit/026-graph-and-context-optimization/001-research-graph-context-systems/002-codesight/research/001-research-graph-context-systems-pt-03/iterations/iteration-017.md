# Iteration 17 — AI config generation write safety and profile coupling

## Summary
`ai-config.ts` remains one of Codesight's most transferable ideas: one shared context summary with per-tool overlays for Claude Code, Cursor, Codex, Copilot, and Windsurf. The risk is in how it writes those outputs. The generator touches root assistant files directly, uses inconsistent append/overwrite rules, and hardcodes Codesight-specific MCP tool names into profile guidance.

## Files Read
- `external/src/generators/ai-config.ts:14-69`
- `external/src/generators/ai-config.ts:71-158`
- `external/src/generators/ai-config.ts:164-264`

## Findings

### Finding 1 — Shared summary + profile overlay is a genuinely strong pattern
- Source: `external/src/generators/ai-config.ts:14-69`, `external/src/generators/ai-config.ts:171-203`
- What it does: `generateContext()` builds one generic project summary, then `generateProfileConfig()` layers tool-specific instructions over a compact always-load summary.
- Why it matters for Code_Environment/Public: This is one of the best ideas in the repo. It balances shared truth with tool-specific ergonomics instead of forcing one generic prompt format onto every assistant.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: assistant profile generation
- Risk/cost: low

### Finding 2 — `generateAIConfigs()` uses inconsistent create/append behavior across tools
- Source: `external/src/generators/ai-config.ts:78-155`
- What it does: existing `CLAUDE.md` may be appended if it lacks a codesight reference, `.cursorrules`/`codex.md`/`AGENTS.md` are only created when absent, and Copilot instructions are created only if `.github/` already exists.
- Why it matters for Code_Environment/Public: Different tools can drift from each other over time because only Claude gets append/update behavior in the default multi-file path.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: config lifecycle
- Risk/cost: medium

### Finding 3 — Profile mode overwrites some files directly and writes into risky root targets
- Source: `external/src/generators/ai-config.ts:214-256`
- What it does: profile mode rewrites `.cursorrules`, `codex.md`, `.github/copilot-instructions.md`, and `.windsurfrules` directly. It also writes `AGENTS.md` at repo root when absent in default generation mode.
- Why it matters for Code_Environment/Public: This is the sharpest write-safety issue in the whole repo. Root assistant files often already contain human-authored policy. Blind regeneration is too risky for a shared codebase.
- Evidence type: source-confirmed
- Recommendation: reject
- Affected area: assistant-file generation
- Risk/cost: high

### Finding 4 — Claude profile guidance is tightly coupled to Codesight's own MCP names
- Source: `external/src/generators/ai-config.ts:205-223`
- What it does: the Claude profile literally instructs the assistant to call `codesight_get_summary`, `codesight_get_routes`, `codesight_get_blast_radius`, and `codesight_get_schema`.
- Why it matters for Code_Environment/Public: Public should adopt the profile-overlay pattern, not these literal tool names. Hardcoding non-existent tools into a generated profile creates broken assistant guidance.
- Evidence type: source-confirmed
- Recommendation: reject
- Affected area: assistant instructions
- Risk/cost: high

### Finding 5 — Token-savings messaging regains false precision in assistant files
- Source: `external/src/generators/ai-config.ts:213`
- What it does: the Claude profile says "This saves ~N tokens per conversation" using the unrounded `result.tokenStats.saved.toLocaleString()`.
- Why it matters for Code_Environment/Public: It directly undermines the formatter's more careful rounded estimate. This is the clearest example of honesty drift between output surfaces.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: metric presentation discipline
- Risk/cost: low

## Recommended Next Focus
Inspect the HTML report as another late-bound projection. The question is not the CSS polish, but whether the report reveals a reusable projection/data-contract pattern.

## Metrics
- newInfoRatio: 0.81
- findingsCount: 5
- focus: "iteration 17: AI config generation write safety and profile coupling"
- status: insight
