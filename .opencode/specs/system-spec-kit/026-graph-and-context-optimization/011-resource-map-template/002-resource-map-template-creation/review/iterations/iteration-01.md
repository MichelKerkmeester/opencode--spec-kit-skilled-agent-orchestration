# Iteration 01: Template design quality

## Dimension & scope

Deep-review of `.opencode/skill/system-spec-kit/templates/resource-map.md` as a reusable artifact. Compared against reference audit shape (`009-hook-package/path-references-audit.md`), peer cross-cutting templates (`handover.md`, `research.md`, `debug-delegation.md`), and the filled example at packet 012. Executor: `cli-copilot gpt-5.4 high` (exit 0, no retries).

## Findings

### P0 (blockers)
None. No issue prevents the template from being used immediately.

### P1 (required)
- **IT01-P1-001 — Category taxonomy overlaps.** `Specs` (§6) and `Config` (§9) both claim `description.json`/`graph-metadata.json`. `Meta` (§10) claims root `README.md` while `READMEs` (§1) claims all READMEs. `Skills` (§5) claims `.opencode/skill/**` subtrees while `Scripts`/`Tests`/`Config` claim by file extension — any skill-local `.sh`/`.ts`/`.json` fits in two places. The filled example at 012 already double-lists `description.json`/`graph-metadata.json` in both Specs and Config (lines 97-100 and 119-120), proving this is a template defect, not user error. Need explicit precedence rule.
- **IT01-P1-002 — Frontmatter/structure divergence from peers.** Peers expose a visible, ANCHOR-tagged `## WHEN TO USE THIS TEMPLATE` section (`handover.md:20-31`, `research.md:22-37`, `debug-delegation.md:21-32`). `resource-map.md` has no ANCHOR tags and buries guidance in prose (lines 18-22) plus a trailing HTML comment (lines 138-153). Breaks shape convention and hurts anchor-based discovery.
- **IT01-P1-003 — Placeholder convention mismatch.** Peers use `[YOUR_VALUE_HERE: ...]` uniformly; `resource-map.md` uses bare hints (`[count]`, `[n]`, `[path to README.md]`, `[note]`). Users won't recognize these as fill-in slots and placeholder scanners won't find them.
- **IT01-P1-004 — Renumbering after deletion is undocumented.** Line 145 says delete empty categories, but never says whether remaining sections renumber 1..N or retain original numbers. The 012 example silently renumbers 1→7 after dropping Commands/Agents/Tests. Ambiguity will produce inconsistent maps.

### P2 (nice to have)
- **IT01-P2-001 — Action-verb semantics ambiguous.** `Removed` = file deleted vs reference removed? `Validated` = existence-checked vs validator-run? The 009 reference drifted into compound verbs like `cited/consulted`. One-line gloss per verb would close this.
- **IT01-P2-002 — Scope-line convention is directional, not prescribed.** Fixed phrasing (e.g., `Scope: packet-local NNN-name | parent-aggregated (children: A, B, C)`) would make phase-child vs parent maps instantly distinguishable.
- **IT01-P2-003 — Glob guidance half-complete.** Line 142 states the glob rule but omits the default ("otherwise one row per file").
- **IT01-P2-004 — Level 1 feels heavy.** The Summary block asks for 10-category breakdown counts that are mostly zeros on a 2-file change. Consider a minimal Level 1 variant (Total + Scope only).

## Strengths
- The 10 categories cover the real surface area of the repo; no obviously missing top-level bucket (AGENTS.md folds cleanly into Meta — it does NOT need its own category).
- Status vocabulary `OK / MISSING / PLANNED` (line 35) is clear and minimal.
- `SPECKIT_TEMPLATE_SOURCE` marker and frontmatter core keys (`importance_tier`, `contextType`, `trigger_phrases`) are consistent with peers.
- 250-line ceiling (line 147) with explicit split/promote guidance is good scaling discipline.
- The paths-only / no-narrative rule (line 22) keeps the artifact from drifting into `implementation-summary.md` territory.

## Recommendation
Proceed with 4 P1 fixes before declaring the template reusable. None are blockers; all are tractable local edits. P2 items can batch into a v1.1 polish pass.
