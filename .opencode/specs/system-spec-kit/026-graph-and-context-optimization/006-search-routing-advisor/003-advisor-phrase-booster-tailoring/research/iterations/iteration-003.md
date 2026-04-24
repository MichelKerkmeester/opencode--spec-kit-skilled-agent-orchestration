# Iteration 3: Under-Covered Multi-Word Identifiers (PHRASE candidates)

## Research Actions Taken

1. Re-read the active loop state in `research/deep-research-strategy.md` plus `iteration-001.md` and `iteration-002.md` to carry forward the 24-key migration inventory, the 44/44 regression baseline, and the explicit Iteration 3 question about uncovered multi-word identifiers. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/deep-research-strategy.md:16-33] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/iterations/iteration-001.md:54-70] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/iterations/iteration-002.md:98-110]
2. Re-read the live advisor phrase tables and routing code to anchor the current PHRASE inventory and weight bands before proposing additions. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:788-948] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1660-1677]
3. Parsed `PHRASE_INTENT_BOOSTERS` programmatically, then compared the current phrase set against every Public skill's `graph-metadata.json` `derived.trigger_phrases` list and every `SKILL.md` `<!-- Keywords: ... -->` comment to find multi-word candidates that are documented but not currently routable as PHRASE entries.
4. Computed per-skill PHRASE coverage counts from the live advisor table, which exposed the main opportunity cluster: `sk-code-full-stack` (0), `mcp-code-mode` (0), `mcp-clickup` (0), `mcp-chrome-devtools` (1), `mcp-figma` (1), and `sk-code-opencode` (1), while `sk-code-review`, `sk-improve-agent`, and `mcp-coco-index` are already dense.
5. Verified each proposed phrase below is currently absent from `PHRASE_INTENT_BOOSTERS`, so these are true additions rather than duplicates. Baseline counts from that verification pass: current PHRASE count `167`, post-Iteration-1-migration baseline `173` (+6 missing same-weight migrations), and `188` if all 15 additions below are accepted.

## Current PHRASE_INTENT_BOOSTERS Coverage Analysis

- **Current entry count:** `167` PHRASE entries in `skill_advisor.py`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:788-948]
- **Planned post-migration baseline:** `173` after the six `migrate-with-same-weight` moves from Iteration 1 (`proposal only`, `5d scoring`, `integration scan`, `dynamic profile`, `vector search`, `concept search`). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/iterations/iteration-001.md:24-40] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/iterations/iteration-002.md:102-106]
- **If all candidates below ship:** `188` total PHRASE entries.

### Skills with strong phrase coverage (>5 entries)

- `sk-improve-agent` (27)
- `sk-code-review` (24)
- `mcp-coco-index` (19)
- `sk-improve-prompt` (16)
- `sk-deep-review` (15)
- `cli-gemini` (12)
- `cli-claude-code` (10)
- `cli-copilot` (10)
- `sk-deep-research` (10)
- `cli-codex` (9)
- `sk-code-web` (8)
- `system-spec-kit` (6)

### Skills with weak/no coverage (<2 entries)

- `mcp-clickup` (0)
- `mcp-code-mode` (0)
- `sk-code-full-stack` (0)
- `mcp-chrome-devtools` (1)
- `mcp-figma` (1)
- `sk-code-opencode` (1)

`skill-advisor` also shows `0`, but it is an internal analyzer package rather than a routed skill target, so it is not an opportunity target in the same way as the user-facing skills above.

The most important gap is the **overlay family**: `sk-code-full-stack` has zero PHRASE coverage, `sk-code-opencode` has only one PHRASE hit, and `sk-code-web`'s coverage is real but skewed toward CSS/implementation rather than verification/deployment. [SOURCE: .opencode/skill/sk-code-full-stack/graph-metadata.json:36-55] [SOURCE: .opencode/skill/sk-code-opencode/graph-metadata.json:38-58] [SOURCE: .opencode/skill/sk-code-web/graph-metadata.json:39-59] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:815-822] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:899-900]

## Proposed New PHRASE Entries

| phrase | target_skill | proposed_weight | rationale | source |
| --- | --- | ---: | --- | --- |
| `spec folder workflow` | `system-spec-kit` | 1.8 | Exact derived trigger phrase for the system-spec-kit core concept; today there is no PHRASE entry even though spec-folder creation is the primary routing surface. | `.opencode/skill/system-spec-kit/graph-metadata.json:45-58` |
| `resume prior session context` | `system-spec-kit` | 1.8 | Exact derived trigger phrase for session recovery; fills a natural-language gap between `/spec_kit:resume` and the current generic save-context phrases. | `.opencode/skill/system-spec-kit/graph-metadata.json:45-58` |
| `validate spec packet` | `system-spec-kit` | 1.6 | Exact derived trigger phrase for spec validation asks; should route to spec governance instead of generic review. | `.opencode/skill/system-spec-kit/graph-metadata.json:45-58` |
| `save conversation context` | `system-spec-kit` | 1.0 | Natural contraction of the current save cluster (`save context`, `save this context`, `save conversation`, `save this conversation context`) and a likely user wording. | `.opencode/skill/system-spec-kit/graph-metadata.json:37-43`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:793-797` |
| `constitutional memory` | `system-spec-kit` | 1.7 | Distinct system-spec-kit memory subsystem name that is documented as user-facing lifecycle behavior but has no PHRASE route today. | `.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:1-25` |
| `mcp server code` | `sk-code-opencode` | 1.8 | Exact sk-code-opencode intent signal; routes implementation/standards work on OpenCode MCP servers away from generic MCP orchestration. | `.opencode/skill/sk-code-opencode/graph-metadata.json:38-58` |
| `system code style guidance` | `sk-code-opencode` | 1.7 | Exact derived trigger phrase for standards-oriented asks, not just raw language tokens like `python` or `bash`. | `.opencode/skill/sk-code-opencode/graph-metadata.json:45-58` |
| `python shell json standards` | `sk-code-opencode` | 1.9 | Exact derived trigger phrase and a strong bundled-language identifier for the OpenCode standards overlay. | `.opencode/skill/sk-code-opencode/graph-metadata.json:45-58` |
| `full stack development workflow` | `sk-code-full-stack` | 2.1 | Exact derived trigger phrase for the overlay with the biggest current gap: zero PHRASE entries. | `.opencode/skill/sk-code-full-stack/graph-metadata.json:42-55` |
| `implementation testing verification flow` | `sk-code-full-stack` | 1.8 | Exact derived trigger phrase that captures the skill's core three-phase contract. | `.opencode/skill/sk-code-full-stack/graph-metadata.json:42-49`, `.opencode/skill/sk-code-full-stack/SKILL.md:43-52` |
| `detect project stack automatically` | `sk-code-full-stack` | 1.6 | Exact derived trigger phrase for stack-detection asks, a current routing blind spot for this overlay. | `.opencode/skill/sk-code-full-stack/graph-metadata.json:42-49`, `.opencode/skill/sk-code-full-stack/SKILL.md:68-79` |
| `browser verification checklist` | `sk-code-web` | 1.6 | Exact derived trigger phrase for the web overlay's verification phase, which is underrepresented relative to implementation/CSS phrases. | `.opencode/skill/sk-code-web/graph-metadata.json:46-59`, `.opencode/skill/sk-code-web/SKILL.md:47-60` |
| `webflow deployment guidance` | `sk-code-web` | 1.8 | Exact derived trigger phrase for the Webflow deployment side of the skill; more precise than the bare `webflow` token. | `.opencode/skill/sk-code-web/graph-metadata.json:46-59` |
| `external tool integration via code mode` | `mcp-code-mode` | 2.0 | Exact derived trigger phrase for a skill that currently has zero PHRASE coverage despite being the mandatory MCP routing layer. | `.opencode/skill/mcp-code-mode/graph-metadata.json:41-54`, `.opencode/skill/mcp-code-mode/SKILL.md:17-24` |
| `quality gate validation` | `sk-code-review` | 1.8 | Natural 3-word expansion of the existing `quality gate` phrase; better disambiguates review-gate intent from spec/template validation language. | `.opencode/skill/sk-code-review/graph-metadata.json:43-63`, `.opencode/skill/sk-code-review/SKILL.md:19-27`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:803` |

## Weight Guidance

The live PHRASE table already shows three usable bands:

1. **Utility / ambiguous workflow phrasing (`0.8-1.0`)**: `template level validation` is only `0.8`, and the system-spec-kit save cluster (`save context`, `save memory`, `save conversation`, `save this conversation context`) all sit at `1.0`. This is the right band for broad-but-useful phrases like `save conversation context`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:793-797] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:822]
2. **High-signal workflow phrases (`1.6-2.2`)**: `quality gate` is `2.0`, `responsive css layout fix` is `2.2`, and `review mode` is `2.0`. Most of the additions above belong here because they are explicit multi-word intent phrases without being literal command names. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:803] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:818] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:888]
3. **Branded / near-command invocations (`2.5-3.0+`)**: `deep research` is `2.5`, `autoresearch` is `3.0`, and explicit skill/path references reach `2.8-3.0`. None of the new candidates need that band; they are discoverability phrases, not literal invocations. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:824-830] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:879-903]

Practical rule: keep **overlay discovery phrases** in the `1.6-2.1` band, keep **save/resume support phrases** near `1.0-1.8`, and avoid any new entry above `2.2` unless it is effectively a branded alias or slash-command equivalent.

## Risk of False-Positive Matches

| phrase | risk | note |
| --- | --- | --- |
| `spec folder workflow` | low | Specific to system-spec-kit governance vocabulary. |
| `resume prior session context` | low | Strong continuity wording; unlikely to describe anything else. |
| `validate spec packet` | low | Exact spec-governance phrase, not normal review language. |
| `save conversation context` | medium | Generic words (`save`, `context`) make this broader than the current save cluster; keep weight near `1.0`. |
| `constitutional memory` | low | Highly project-specific subsystem name. |
| `mcp server code` | medium | Could appear in code-mode or generic MCP discussions; keep below explicit code-mode phrases. |
| `system code style guidance` | low | Standards-oriented and clearly aligned to sk-code-opencode. |
| `python shell json standards` | low | Very specific bundled-language phrase. |
| `full stack development workflow` | low | Distinct overlay identity phrase. |
| `implementation testing verification flow` | low | Exact phase-contract phrasing from sk-code-full-stack. |
| `detect project stack automatically` | medium | Could occur in generic toolchain discussions; moderate weight is safer than a high boost. |
| `browser verification checklist` | medium | May overlap with Chrome DevTools/browser-debug asks; keep it below direct DevTools terms. |
| `webflow deployment guidance` | low | Strong Webflow-specific guidance phrase. |
| `external tool integration via code mode` | low | Very specific to mcp-code-mode. |
| `quality gate validation` | medium | Could overlap with system-spec-kit/template validation language; keep below a direct `code review` weight. |

No proposal looks like a **high-risk** broad token trap. The main safety rule is to keep the few medium-risk additions in the middle band rather than giving them review-command or slash-command strength.

## Strategy Updates

### New Findings to Propagate

- The live advisor currently has **167** PHRASE entries; Iteration 1's baseline migration would raise that to **173**, and the 15 additions proposed here would raise it to **188**.
- Phrase density is concentrated in review/search/improve families, while several user-facing skills remain weakly covered: `sk-code-full-stack` (0), `mcp-code-mode` (0), `mcp-clickup` (0), `mcp-chrome-devtools` (1), `mcp-figma` (1), and `sk-code-opencode` (1).
- The overlay-skill gap is real, not hypothetical: `sk-code-full-stack` has **zero** PHRASE entries today even though its own graph metadata advertises multiple multi-word trigger phrases.
- `sk-code-opencode` and `system-spec-kit` both expose rich multi-word identifiers in graph metadata / skill docs that are currently routed only through token fallback or not at all.
- The most actionable candidate set is **conservative and long-form**: mostly 3+ word phrases in the `1.0-2.1` weight band, which should improve recall without introducing a new false-positive class.

### Updated Next Focus

Iteration 4: design the migration mechanics and finalize the new-entry set. Specifically:

1. Decide how to merge Iteration 1's six same-weight migrations with the 15 new candidates in one PHRASE update.
2. Resolve adjacency questions like `full stack typescript` (currently routed to `sk-code-opencode`) versus new `sk-code-full-stack` overlay phrases.
3. Define the exact patch shape and candidate ordering in `PHRASE_INTENT_BOOSTERS`.
4. Identify the minimum new P1 regression fixtures needed to guard the added phrases and the `code audit` alignment decision.

## Convergence Signal

- **newInfoRatio:** `0.57`
- **stuckIndicator:** `no` — this pass produced a concrete 15-entry proposal set, per-skill coverage counts, and a clear migration/fixture design target for Iteration 4.
- **proposalCount:** `15`
