---
iteration: 5
dimension: "Skill docs + references coherence"
executor: "direct-read"
copilot_dispatched: false
copilot_dispatch_reason: "Scope was 14 focus files, all small-to-medium; 10 targeted grep + Read passes established full coverage. Dispatching gpt-5.4 high would add latency without new signal."
---

# Iteration 05 — Skill docs + references coherence

## Scope

Audited 14 system-spec-kit skill-doc surfaces for coherent handling of the
phase-012 `resource-map.md` addition. No packet-012 spec docs, commands,
YAML, MCP code, or AGENTS.md inspected (other iterations own those).

## Findings

### P1 — Anchor ID drift in `assets/template_mapping.md`

- Line 150 / 168: anchor IDs still read
  `<!-- ANCHOR:optional-templates-level-3-only -->` / its close tag, but
  the visible H2 at line 151 is `## 4. OPTIONAL TEMPLATES (Any Level)`.
- Identical drift exists in `references/templates/level_specifications.md`
  line 149/168 (same anchor ID retained around the renamed section).
- Impact: consumers that deep-link via anchor see a misleading slug; any
  ToC auto-generator re-deriving slugs from heading text would desync.
- Fix scope: rename anchor ID to `optional-templates-any-level` in both
  files (matching the now-canonical title).

### P2 — Level 2 folder tree omits optional `resource-map.md`

- `references/templates/level_specifications.md` §5 "Level 2" tree
  (lines ~193-200) and the parallel tree in `assets/template_mapping.md`
  (~line 199) do not show `resource-map.md` under Level 2, while Level 3
  tree (lines 211-221 / 217-221) does show it.
- Level 2's prose "Optional Files" subsection (line 193) correctly lists
  `resource-map.md`. The tree is therefore inconsistent with prose.
- Fix scope: add `└── resource-map.md  (OPTIONAL)` line to the Level 2
  and (for consistency) Level 1 trees in both files.

### P2 — `template_guide.md:1166` cross-level row omits `review-report.md`

- Table at 1160-1166 correctly adds `resource-map.md` to the root tier
  ("handover.md, debug-delegation.md, resource-map.md (cross-level)"),
  but never mentions `review-report.md` or `research/research.md` —
  scope of packet 012 only requires `resource-map.md`, so this is only
  an adjacent coherence gap, not a phase-012 blocker.

### INFO — canonical description wording variants (acceptable)

Across 13 surfaces, `resource-map.md` is described with four closely-
related phrasings:

1. "Optional lean path catalog (any level)" — README.md (3×),
   templates/README.md, quick_reference.md:749, level_specifications.md:858
2. "lean path catalog (cross-cutting, see §9)" — level_specifications.md
   Optional Files subsections (4×, consistent)
3. "lean, scannable catalog of every path analyzed, created, updated, or
   removed" — level_1/2/3/3+ READMEs (4×, consistent within the set)
4. "Lean path catalog of every file analyzed/created/updated/removed"
   — template_mapping.md:158 (1×)

All four phrasings are semantically aligned. No contradiction; per-surface
tone is appropriate (summary vs. operator-facing copy). Not a finding.

## Answers to review questions

1. **Consistency of description:** Yes at the concept level (4 phrasings,
   all compatible). No canonical one-liner enforced, but not required.
2. **Stale 8-doc tables:** None found. Every sentinel hit of
   `handover.md, debug-delegation.md` co-occurs with `resource-map.md`
   in the same row / list (`template_style_guide.md:36`,
   `template_guide.md:1166`, `folder_structure.md:37`).
3. **SKILL.md Rule 9 ToC-forbidden list:** Correctly includes
   `resource-map.md` (SKILL.md:842). Success-criteria checkbox (:872)
   and `template_guide.md:745` mirror the list. Coherent.
4. **`template_style_guide.md:36` Utility row:** Lists
   "handover.md, debug-delegation.md, resource-map.md" — matches
   `template_guide.md:1166` "(cross-level)" and `folder_structure.md:37`.
5. **`template_mapping.md:151` title change coherence:** Title renamed to
   "(Any Level)"; downstream table correctly lists `resource-map.md` at
   any level; prose notes align. **Exception:** stale anchor ID (see P1).
6. **`quick_reference.md:39` four-level coverage:** Table rows 41-44
   correctly list `resource-map.md` as optional at Levels 1, 2, 3, 3+.
7. **Older "canonical N" enumerations missed:** None. Searched for
   "canonical 8/9", "8-doc", "nine canonical" — no stale counts found.
   Packet 003 test assertion `CONFIGS.length=11` already reflects the
   new cardinality (verified in iteration 03).

## Blockers for packet 012

None. All P1/P2 findings are cosmetic coherence polish that does not
change runtime behavior, validation outcomes, or downstream indexing.

## Convergence signal

`low-severity-only` — one P1 (anchor slug cosmetic), two P2, no P0.
