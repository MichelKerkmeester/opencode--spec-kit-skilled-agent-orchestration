# Focus

Phase 1 implementation pre-flight and marker-count validation for backward compatibility.

This iteration closes Q5 enough to choose a compatibility strategy and makes Q10 executable. The "~800 spec folders" claim is directionally correct only if interpreted as unique marker-bearing folders: the exact current grep measurements are 3,696 files with `SPECKIT_TEMPLATE_SOURCE`, 645 files with `template_source:`, and 868 unique directories containing either marker.

# Actions Taken

1. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-005.md` first and preserved its four-phase ordering.
2. Ran the requested marker counts:
   - `grep -rln "SPECKIT_TEMPLATE_SOURCE" .opencode/specs/ | wc -l` -> `3696`
   - `grep -rln "template_source:" .opencode/specs/ | wc -l` -> `645`
3. Counted unique marker-bearing directories:
   - Uppercase marker: `868`
   - Lowercase `template_source:`: `203`
   - Either marker: `868`
4. Sampled marker-bearing files from `.opencode/specs/00--barter`, `.opencode/specs/system-spec-kit`, and `.opencode/specs/skilled-agent-orchestration`.
5. Copied `.opencode/skill/system-spec-kit/templates` and `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` into `/tmp/template-experiment/`, ran the composer there, and diffed generated `spec.md` outputs against committed `templates/level_N/spec.md` files.
6. Inspected `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`, `.opencode/skill/system-spec-kit/templates/core/spec-core.md`, `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/decision-record.md`, and `.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus-suffix.md` to locate exact repair sites.

# Marker Counts and Variance

The exact requested grep counts are:

| Command | Count |
| --- | ---: |
| `grep -rln "SPECKIT_TEMPLATE_SOURCE" .opencode/specs/ \| wc -l` | 3,696 files |
| `grep -rln "template_source:" .opencode/specs/ \| wc -l` | 645 files |

The folder-level count is the better interpretation of the research question:

| Marker surface | Unique directories |
| --- | ---: |
| Any file containing `SPECKIT_TEMPLATE_SOURCE` | 868 |
| Any file containing `template_source:` | 203 |
| Either marker | 868 |

Parent samples:

| Parent | Uppercase marker files | Lowercase `template_source:` files |
| --- | ---: | ---: |
| `.opencode/specs/00--barter` | 6 | 0 |
| `.opencode/specs/system-spec-kit` | 2,724 | 638 |
| `.opencode/specs/skilled-agent-orchestration` | 402 | 3 |

Concrete marker samples:

| File | Marker text |
| --- | --- |
| `.opencode/specs/00--barter/002-skill-doc-template-alignment/checklist.md` | `template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist \| v2.2 -->"` and `<!-- SPECKIT_TEMPLATE_SOURCE: checklist \| v2.2 -->` |
| `.opencode/specs/00--barter/resource-map.md` | `<!-- SPECKIT_TEMPLATE_SOURCE: resource-map \| v1.1 -->` |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/001-sprint-0-measurement-foundation/checklist.md` | `template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist \| v2.2 -->"` and `<!-- SPECKIT_TEMPLATE_SOURCE: checklist \| v2.2 -->` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/spec.md` | `template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch \| v2.2"` and `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch \| v2.2 -->` |
| `.opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/checklist.md` | `template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist \| v2.2 -->"` and `<!-- SPECKIT_TEMPLATE_SOURCE: checklist \| v2.2 -->` |
| `.opencode/specs/skilled-agent-orchestration/z_archive/resource-map.md` | `<!-- SPECKIT_TEMPLATE_SOURCE: resource-map \| v1.1 -->` |

Marker variance is real:

- Surface forms include HTML comments, `template_source:`, `template_source_hint:`, `template_source_marker:`, `speckit_template_source:`, and `# SPECKIT_TEMPLATE_SOURCE`.
- Version suffixes include `v2.2`, `v2.0`, `v1.1`, `v1.0`, `v1`, no suffix, and non-version payloads such as `test-fixture`.
- Addendum ordering is mostly canonical, but there are variants:
  - `spec-core + level2-verify | v2.2`
  - `spec-core + level2-verify + level3-arch | v2.2`
  - `spec-core + level2-verify + level3-arch + level3plus-govern | v2.2`
  - `spec-core + level2-verify + level3-arch + level3-plus-govern | v2.2`
  - `spec-core + level2-verify + level3-arch + level3plus-gov | v2.2`
  - `spec-core + level2-verify + phase-child-header | v2.2`
  - `spec-core + phase-child-header | v2.2`
  - `spec-core + level3-verify | v2.2`

# Backward Compatibility Decision

Use tolerant pattern matching. Do not batch-rewrite existing spec folders in Phase 1-3.

Reasoning:

- Zero-migration is almost right because current validators mostly care that a marker exists and can expose a version, not that it maps to a physical `templates/level_N` source path.
- Pure zero-migration is too weak because the field surface is inconsistent: HTML comments, frontmatter strings, hint fields, and legacy `#` comments all appear in the tree.
- A batch rewrite would touch up to 868 directories and thousands of files for no runtime behavior gain. It also risks invalidating archived research packets and historical evidence.

The compatibility parser should accept any of these as provenance:

```text
SPECKIT_TEMPLATE_SOURCE:
template_source:
template_source_hint:
template_source_marker:
speckit_template_source:
# SPECKIT_TEMPLATE_SOURCE:
<!-- SPECKIT_TEMPLATE_SOURCE:
```

It should extract the first `v[0-9]+(\.[0-9]+)*` suffix when present, report `unknown` when absent, and treat the payload before `|` as descriptive provenance rather than a resolver key. A normalizer script can remain optional for future hygiene, but the resolver migration should not depend on it.

# Phase 1 Drift Categories

The `/tmp/template-experiment/` probe regenerated all levels with the current composer. All 21 runtime docs differed from checked-in rendered outputs. For `spec.md`, the drifts fall into four repair categories.

## Category A: `_memory.continuity` missing from generated frontmatter

Evidence:

- `.opencode/skill/system-spec-kit/templates/level_1/spec.md` contains a 22-line `_memory.continuity` block under frontmatter.
- `/tmp/template-experiment/templates/level_1/spec.md` omits it.
- The same class appears in Level 2, Level 3, Level 3+, and `decision-record.md`.

Repair:

- File: `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- Area: after `extract_frontmatter()` at lines 326-350 and before `write_file()` at lines 700-738.
- Change: add `inject_legacy_continuity "$rel_path" "$content"` and call it inside `write_file()` after `normalize_template_title_suffix`.
- Behavior: insert the committed level-specific `_memory.continuity` block before the closing `---` in frontmatter when the block is absent.

Estimated diff:

- `compose.sh`: +70 to +90 lines, 0 to -5 lines.
- Risk: semantic-low. It affects generated frontmatter, but only to match the committed contract.

Implementation sketch:

```sh
content=$(normalize_template_title_suffix "$filepath" "$content")
content=$(inject_legacy_continuity "$filepath" "$content")
```

## Category B: Metadata level replacement misses the current placeholder

Evidence:

- `.opencode/skill/system-spec-kit/templates/core/spec-core.md:25` uses `| **Level** | [1/2/3/3+] |`.
- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh:201-202` only replaces `[1/2/3]`.
- Generated Level 1, Level 3, and Level 3+ retain `[1/2/3/3+]`; committed outputs use `1`, `3`, and `3+`.
- Level 2 currently keeps `[1/2/3/3+]`, so a blanket replacement would create new drift.

Repair:

- File: `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- Area: `update_metadata_level()` at lines 194-203.
- Change: match `[1/2/3/3+]`, but preserve the Level 2 committed quirk.

Estimated diff:

- `compose.sh`: +8 to +12 lines, -2 lines.
- Risk: semantic-low. This is metadata rendering, but validators may read it, so parity tests should guard it.

Implementation sketch:

```sh
if [[ "$level" == "2" ]]; then
  echo "$content"
else
  echo "$content" | sed "s/| \*\*Level\*\* | \[1\/2\/3\/3+\] |/| **Level** | $level |/"
fi
```

## Category C: Anchor extraction strips committed Level 3 and Level 3+ anchors

Evidence:

- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh:403-407` extracts core body from `^## 1.` and open questions from `^## 7.`, which drops `<!-- ANCHOR:metadata -->` and `<!-- ANCHOR:questions -->`.
- `.opencode/skill/system-spec-kit/templates/level_3/spec.md` has `<!-- ANCHOR:metadata -->` at line 62 and `<!-- ANCHOR:questions -->` at line 147.
- `.opencode/skill/system-spec-kit/templates/level_3+/spec.md` has the same metadata anchor and a broad `questions` anchor spanning lines 147-274.

Repair:

- File: `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- Areas: Level 3 branch at lines 403-409 and Level 3+ branch at lines 463-469.
- Change:
  - Extract core body starting at `<!-- ANCHOR:metadata -->`, not `^## 1.`.
  - Extract Level 3 open questions starting at `<!-- ANCHOR:questions -->`.
  - For Level 3+, construct the broad committed `questions` anchor explicitly so it wraps sections 16, related documents, and the closing level comment.

Estimated diff:

- `compose.sh`: +30 to +45 lines, -8 to -15 lines.
- Risk: semantic-medium. Anchor spans are consumed by template validators and memory/frontmatter tooling.

Implementation sketch:

```sh
core_body=$(echo "$core_without_frontmatter" | sed -n '/^<!-- ANCHOR:metadata -->/,/^<!-- ANCHOR:questions -->/{ /^<!-- ANCHOR:questions -->/d; p; }')
open_q=$(echo "$core_without_frontmatter" | sed -n '/^<!-- ANCHOR:questions -->/,/^<!-- \\/ANCHOR:questions -->/p')
```

## Category D: Level 3+ governance anchors are absent from the source fragment used by the composer

Evidence:

- `.opencode/skill/system-spec-kit/templates/level_3+/spec.md` has `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, and `change-log` anchors.
- `.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus-suffix.md:71-107` has the matching sections but no anchor comments.
- `.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus.md:17-82` has anchors, but with different names for three sections (`compliance`, `stakeholders`, `changelog`) and is not the suffix file used by `compose.sh`.

Repair:

- File: `.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus-suffix.md`
- Areas: lines 71-107.
- Change: wrap the four governance sections with the exact committed anchor names:
  - `approval-workflow`
  - `compliance-checkpoints`
  - `stakeholder-matrix`
  - `change-log`

Estimated diff:

- `spec-level3plus-suffix.md`: +8 lines, 0 removed.
- Risk: semantic-medium. Anchor names are part of the validator contract.

## Category E: Decision-record description drift is source-side

Evidence:

- `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/decision-record.md:3` currently says `description: "not \"A decision was required regarding the selection of an appropriate approach.\" -->"`.
- `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` expects `description: "Decision record template for documenting architectural choices, alternatives, consequences, and implementation notes."`

Repair:

- File: `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/decision-record.md`
- Area: line 3.
- Change the description to the committed rendered wording.

Estimated diff:

- `decision-record.md`: +1 line, -1 line.
- Risk: cosmetic-low.

## Category F: Composer cannot write to a temp output root

Evidence:

- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh:52-58` hardcodes `$TEMPLATES_DIR/level_1`, `$TEMPLATES_DIR/level_2`, `$TEMPLATES_DIR/level_3`, and `$TEMPLATES_DIR/level_3+`.
- Iteration 5's parity test requires temp output generation without mutating checked-in rendered goldens.

Repair:

- File: `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- Areas: output-dir config at lines 52-58, argument parser at lines 794-825, and help text at lines 17-24 and 101-109.
- Change: add `SPECKIT_TEMPLATE_OUT_ROOT` env support plus `--out-root <dir>`.

Estimated diff:

- `compose.sh`: +25 to +35 lines, -4 to -8 lines.
- Risk: infrastructure-low. Default behavior remains checked-in output.

Implementation sketch:

```sh
OUT_ROOT="${SPECKIT_TEMPLATE_OUT_ROOT:-$TEMPLATES_DIR}"
OUT_L1="$OUT_ROOT/level_1"
OUT_L2="$OUT_ROOT/level_2"
OUT_L3="$OUT_ROOT/level_3"
OUT_L3PLUS="$OUT_ROOT/level_3+"
```

# Phase 1 Ready-to-Implement Punch List

1. Add temp output support in `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`.
   - Edit lines 52-58, 794-825, and the help text.
   - Add `SPECKIT_TEMPLATE_OUT_ROOT` and `--out-root`.
   - Estimated diff: +30/-6.
   - Risk: infrastructure-low.

2. Add legacy continuity injection in `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`.
   - Edit after lines 326-350 and call from `write_file()` at lines 700-738.
   - Match committed `packet_pointer`, `recent_action`, and `next_safe_action` per level:
     - Level 1: `000-feature-name`, `Initialize continuity block`, `Replace template defaults on first save`
     - Level 2: `system-spec-kit/templates/level_2`, `Initialized Level 2 template`, `Replace continuity placeholders`
     - Level 3: `system-spec-kit/templates/level_3`, `Initialized Level 3 template`, `Replace continuity placeholders`
     - Level 3+: `system-spec-kit/templates/level_3+`, `Initialized Level 3 plus template`, `Replace continuity placeholders`
   - Estimated diff: +80/-2.
   - Risk: semantic-low.

3. Repair metadata level substitution in `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`.
   - Edit lines 194-203.
   - Replace `[1/2/3/3+]` for Level 1, Level 3, and Level 3+ only.
   - Leave Level 2 as `[1/2/3/3+]` until a later intentional normalization.
   - Estimated diff: +10/-2.
   - Risk: semantic-low.

4. Preserve Level 3 and Level 3+ anchor spans in `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`.
   - Edit Level 3 composition at lines 403-409.
   - Edit Level 3+ composition at lines 463-469 and 491-509.
   - Extract from anchor comments, not only headings.
   - Estimated diff: +40/-12.
   - Risk: semantic-medium.

5. Add Level 3+ governance anchors in `.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus-suffix.md`.
   - Edit lines 71-107.
   - Add eight anchor comment lines around sections 12-15.
   - Estimated diff: +8/-0.
   - Risk: semantic-medium.

6. Fix decision-record metadata in `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/decision-record.md`.
   - Edit line 3.
   - Estimated diff: +1/-1.
   - Risk: cosmetic-low.

7. Add the parity gate from iteration 5.
   - Add `.opencode/skill/system-spec-kit/scripts/tests/template-rendered-parity.vitest.ts`.
   - Update `.opencode/skill/system-spec-kit/scripts/package.json` with `test:template-parity`.
   - Wire it before `test:legacy`.
   - Estimated diff: +220 to +280 lines, +2 package lines.
   - Risk: test-only-medium because byte parity can initially expose all remaining drift.

Total Phase 1 estimated delta:

- Composer/source repair: about +169 to +215 lines, -23 to -29 lines.
- Test and package wiring: about +222 to +282 lines.
- Net Phase 1: about +391 to +497 lines, -23 to -29 lines.

# Findings

## f-iter006-001

The measured marker claim is 868 unique directories, not exactly 800 folders.

Evidence:

- `grep -rln "SPECKIT_TEMPLATE_SOURCE" .opencode/specs/ | wc -l` returned 3,696 files.
- `grep -rln "template_source:" .opencode/specs/ | wc -l` returned 645 files.
- Unique directories containing either marker: 868.

Implication: Q5 should phrase the compatibility surface as "868 marker-bearing directories and 3,696 marker-bearing files" rather than "~800 spec folders".

## f-iter006-002

Marker variance requires tolerant parsing, not a batch rewrite.

Evidence:

- Sampled forms include `template_source:`, `template_source_hint:`, HTML comments, resource-map `v1.1`, and Level 3 additive source strings.
- Version suffixes include `v2.2`, `v2.0`, `v1.1`, `v1.0`, `v1`, and absent or non-version payloads.

Implication: Treat markers as descriptive provenance. Resolver identity must come from level/file inputs, not historical marker strings.

## f-iter006-003

The current composer is not ready for byte-parity tests because every runtime doc differs after regeneration.

Evidence:

- The `/tmp/template-experiment/` probe found drift in all 21 runtime docs across Level 1, Level 2, Level 3, and Level 3+.
- `spec.md` diffs show missing continuity, metadata level drift, and missing anchors.

Implication: Phase 1 must repair the composer before resolver migration. A resolver on top of current output would change validation contracts.

## f-iter006-004

Most Phase 1 drift is composer-side; one drift is source-side.

Evidence:

- `compose.sh` strips continuity and fails the current metadata placeholder.
- `compose.sh` extracts L3/L3+ sections from headings, which drops anchor comments.
- `spec-level3plus-suffix.md` lacks committed governance anchors.
- `addendum/level3-arch/decision-record.md:3` already contains the malformed description seen in generated output.

Implication: The repair can be executed mechanically with small scoped edits.

## f-iter006-005

Phase 1 should add output-root support before adding the parity test.

Evidence:

- `compose.sh` currently hardcodes output dirs under `.opencode/skill/system-spec-kit/templates/level_N`.
- Iteration 5's golden test design needs a temp render target.

Implication: Add `SPECKIT_TEMPLATE_OUT_ROOT` or `--out-root` first, then write the Vitest parity test against the temp output.

# Questions Updated

Q5: Answered for this packet. Use tolerant pattern matching. Do not migrate existing markers as part of Phase 1-3. The concrete compatibility surface is 868 unique marker-bearing directories, 3,696 uppercase-marker files, and 645 lowercase-field files.

Q10: Ready for implementation. Phase 1 has a mechanical punch list with exact files, line areas, estimated diff sizes, and risk classes.

# Recommendation

PARTIAL remains the right recommendation.

Phase 1 is implementable now: add temp output support, repair continuity/metadata/anchor/decision-record drift, then add byte-parity tests. Phase 2 should not begin until generated output is byte-identical to the checked-in rendered goldens.
