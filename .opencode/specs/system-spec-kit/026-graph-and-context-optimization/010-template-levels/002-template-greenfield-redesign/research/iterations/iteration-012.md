# Iteration 12: Ground-Truth Integration Probe

## Focus

GROUND-TRUTH INTEGRATION PROBE under the workflow-invariant lens. Read the current source files, map user-visible output channels, and verify that the revised iteration-007 diffs preserve level-only vocabulary without leaking public `preset`, `capability`, `kind`, or `manifest` workflow taxonomy.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-011.md` first.
- Loaded `.opencode/skill/sk-deep-research/SKILL.md` to preserve the LEAF iteration contract and state-output requirements.
- Read the current source files:
  - `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
  - `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`
  - `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
  - `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
  - `.opencode/skill/system-spec-kit/templates/level_1/spec.md`
  - `.opencode/skill/system-spec-kit/templates/level_2/spec.md`
  - `.opencode/skill/system-spec-kit/templates/level_3/spec.md`
  - `.opencode/skill/system-spec-kit/templates/level_3+/spec.md`
  - `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md`
- Executed `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --help` to capture the live help output exactly.
- Grepped generated template sources for `preset`, `capability`, `capabilities`, `kind`, `manifest`, and `manifestVersion`.

## Findings

### Surface Audit Tables (1-11)

#### 1. `create.sh --help` Text

Live help output today:

```text
Usage: .opencode/skill/system-spec-kit/scripts/spec/create.sh [options] <feature_description>

Creates a new spec folder with templates based on documentation level.

Options:
  --json              Output in JSON format
  --level N           Documentation level: 1, 2, 3, or 3+ (extended)
                      1=baseline, 2=verification, 3=full, 3+=extended
                      Default: 1
  --sharded           Create sharded spec sections (Level 3 only)
                      Creates spec-sections/ with modular documentation
  --subfolder <path>  Create versioned sub-folder in existing spec folder
                      Auto-increments version (001, 002, etc.)
  --topic <name>      Topic name for sub-folder (used with --subfolder)
                      If not provided, uses feature_description
  --phase             Create phased spec (parent + child folders)
                      Mutually exclusive with --subfolder
  --phases <N>        Number of initial child phases (default: 3)
  --phase-names <list>  Comma-separated names for child phases
  --parent <path>     Add phases to existing parent spec folder (with --phase)
  --phase-parent <path>  Alias for --parent in phase mode (supports nested .opencode/specs/ paths)
                      Example: --phase-names "foundation,implementation,integration"
  --short-name <name> Provide a custom short name (2-4 words) for the branch
  --number N          Specify branch number manually (overrides auto-detection)
  --skip-branch       Create spec folder only, don't create git branch
  --help, -h          Show this help message

Documentation Levels (CORE + ADDENDUM architecture v2.0):

  Level 1 (Core ~270 LOC):     Essential what/why/how
    Files: spec.md, plan.md, tasks.md, implementation-summary.md

  Level 2 (Core + Verify):     +Quality gates, verification
    Adds: checklist.md, NFRs, edge cases, effort estimation

  Level 3 (Core + Verify + Arch): +Architecture decisions
    Adds: decision-record.md, executive summary, risk matrix, ADRs

  Level 3+ (All addendums):    +Enterprise governance
    Adds: approval workflow, compliance, stakeholder matrix, AI protocols

Template Composition:
  Core templates (~270 LOC) are shared across all levels.
  Higher levels ADD value, not just length.
  Templates located in: .opencode/skill/system-spec-kit/templates/

All levels include: scratch/ (git-ignored working files)

Examples:
  .opencode/skill/system-spec-kit/scripts/spec/create.sh 'Add user authentication system' --short-name 'user-auth'
  .opencode/skill/system-spec-kit/scripts/spec/create.sh 'Implement complex OAuth2 flow' --level 2
  .opencode/skill/system-spec-kit/scripts/spec/create.sh 'Major architecture redesign' --level 3 --number 50
  .opencode/skill/system-spec-kit/scripts/spec/create.sh 'Large platform migration' --level 3 --sharded

Sub-folder Versioning Examples:
  .opencode/skill/system-spec-kit/scripts/spec/create.sh --subfolder specs/005-context-capture 'Initial implementation'
  .opencode/skill/system-spec-kit/scripts/spec/create.sh --subfolder specs/005-context-capture --topic 'refactor' 'Phase 2 refactoring'

  Creates: specs/005-context-capture/001-initial-implementation/
           specs/005-context-capture/002-refactor/

Phase Mode Examples:
  .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase 'Large platform migration'
  .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase --phases 3 'OAuth2 implementation'
  .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase --phases 3 --phase-names 'foundation,implementation,integration' 'OAuth2 flow'
  .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase --parent specs/042-oauth2-flow --phases 2 --phase-names 'stabilization,rollout' 'OAuth2 flow'
  $0 --phase --phase-parent .opencode/specs/system-spec-kit/023-esm/011-fusion --phase-names "research,implementation" "Graph improvements"

  Creates: specs/042-oauth2-flow/
           specs/042-oauth2-flow/001-foundation/
           specs/042-oauth2-flow/002-implementation/
           specs/042-oauth2-flow/003-integration/
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `Creates a new spec folder with templates based on documentation level.` | Same. | LEVEL-ONLY |
| `--level N           Documentation level: 1, 2, 3, or 3+ (extended)` | Same. | LEVEL-ONLY |
| No public `--preset`, no `capability`, no `kind`, no `manifest` in help output. | Keep public help exactly level-shaped; do not add hidden/internal selectors to help. | LEVEL-ONLY |

#### 2. `create.sh` Normal Stdout

Current ordinary success template in `.opencode/skill/system-spec-kit/scripts/spec/create.sh`:

```text
SpecKit: Spec Folder Created Successfully
BRANCH_NAME:  $BRANCH_NAME
FEATURE_NUM:  $FEATURE_NUM
DOC_LEVEL:    Level $DOC_LEVEL
COMPLEXITY:   Level $DETECTED_LEVEL (score: $DETECTED_SCORE/100, confidence: $DETECTED_CONF%)
EXPANDED:     Yes (COMPLEXITY_GATE markers processed)
SPEC_FOLDER:  $FEATURE_DIR
Created Structure:
Level $DOC_LEVEL Documentation (CORE + ADDENDUM v2.0):
Next steps:
```

`generate-description.js` also writes `description.json created in ${folderPath}` to stdout during successful creation before the final success block.

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `DOC_LEVEL:    Level $DOC_LEVEL` | Same. | LEVEL-ONLY |
| `Level $DOC_LEVEL Documentation (CORE + ADDENDUM v2.0):` | Same. | LEVEL-ONLY |
| `description.json created in ${folderPath}` | Keep or quiet behind JSON mode later; no internal taxonomy terms. | LEVEL-ONLY |

#### 3. `create.sh` JSON Stdout

Current ordinary JSON shape:

```json
{
  "BRANCH_NAME": "...",
  "SPEC_FILE": "...",
  "FEATURE_NUM": "...",
  "DOC_LEVEL": "1",
  "SHARDED": false,
  "COMPLEXITY": {
    "detected": false
  },
  "EXPANDED": false,
  "HAS_DESCRIPTION": true,
  "CREATED_FILES": []
}
```

Subfolder JSON shape:

```json
{
  "SUBFOLDER_PATH": "...",
  "SUBFOLDER_NAME": "...",
  "BASE_FOLDER": "...",
  "DOC_LEVEL": "1",
  "CREATED_FILES": []
}
```

Phase JSON shape:

```json
{
  "BRANCH_NAME": "...",
  "SPEC_FILE": "...",
  "FEATURE_NUM": "...",
  "DOC_LEVEL": "1",
  "PHASE_MODE": true,
  "PHASE_COUNT": 3,
  "PARENT_FILES": [],
  "CHILDREN": [
    {
      "FOLDER": "...",
      "FILES": []
    }
  ]
}
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| Uses `DOC_LEVEL`, `SHARDED`, `COMPLEXITY`, `EXPANDED`, `HAS_DESCRIPTION`, `CREATED_FILES`. | Keep `DOC_LEVEL`; do not add `PRESET`, `CAPABILITY`, `CAPABILITIES`, `KIND`, or `MANIFEST_VERSION`. | LEVEL-ONLY |
| Subfolder JSON uses `DOC_LEVEL`, not `PRESET`. | Same. | LEVEL-ONLY |
| Phase JSON uses `PHASE_MODE`, `PHASE_COUNT`, and child folder/file arrays. | Same; level contract internals stay out of JSON. | LEVEL-ONLY |

#### 4. Phase-Parent Logs

Current phase-mode stdout and stderr:

```text
[speckit] Warning: --phases $PHASE_COUNT overridden by --phase-names (${#PHASE_NAME_ARRAY[@]} names provided)
[speckit] Existing PHASE DOCUMENTATION MAP found; appending new phase rows and handoffs
SpecKit: Phase Spec Created Successfully
BRANCH_NAME:  $BRANCH_NAME
FEATURE_NUM:  $FEATURE_NUM
DOC_LEVEL:    Level $DOC_LEVEL (parent)
PHASE_COUNT:  $PHASE_COUNT (new, $TOTAL_PHASES total)
SPEC_FOLDER:  $FEATURE_DIR
MODE:         Append phases to existing parent
Phase Documentation Map injected into parent spec.md
Parent back-references injected into each child spec.md
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `DOC_LEVEL:    Level $DOC_LEVEL (parent)` | Same. | LEVEL-ONLY |
| `Phase Documentation Map injected into parent spec.md` | Same. | LEVEL-ONLY |
| `[speckit] Existing PHASE DOCUMENTATION MAP found...` | Same. | LEVEL-ONLY |

#### 5. Sharded-Spec Warnings

Current warning text:

```text
Warning: --sharded flag is only supported with --level 3 or 3+. Ignoring --sharded.
```

Other sharded warnings:

```text
[speckit] Warning: Sharded template not found: $SHARDED_TEMPLATES_DIR/spec-index.md
[speckit] Warning: Sharded template not found: $SHARDED_TEMPLATES_DIR/$shard
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `Warning: --sharded flag is only supported with --level 3 or 3+. Ignoring --sharded.` | Same. | LEVEL-ONLY |
| `[speckit] Warning: Sharded template not found: ...` | Same. | LEVEL-ONLY |
| No `preset` wording in the live sharded warning. | Do not reintroduce `preset` in remediation. | LEVEL-ONLY |

#### 6. `check-files.sh` Error Output

Current messages:

```text
Phase parent: spec.md present (lean trio policy)
Phase parent: missing 1 required file
Phase parents require only spec.md. Create it from templates/phase_parent/spec.md
All required files present for Level $level
Missing ${#missing[@]} required file(s)
Create missing files: $missing_list. Use templates from .opencode/skill/system-spec-kit/templates/
```

Current details are raw file names, for example:

```text
spec.md
plan.md
tasks.md
checklist.md
decision-record.md
implementation-summary.md (required after implementation)
implementation-summary.md (required: tasks show completion)
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `All required files present for Level $level` | Same. | LEVEL-ONLY |
| `Missing ${#missing[@]} required file(s)` plus file-only details. | Prefer `Level $level packet missing required file: decision-record.md` for each detail. | FIXED |
| `Use templates from .opencode/skill/system-spec-kit/templates/` | `Use templates for Level $level from .opencode/skill/system-spec-kit/templates/`. | FIXED |

#### 7. `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh` Error Output

`check-sections.sh` current messages:

```text
All required sections found
Missing ${#missing[@]} recommended section(s)
Add missing sections to improve documentation completeness
```

Current details use `filename: section`, for example:

```text
spec.md: Problem Statement
plan.md: Technical Context
checklist.md: Verification Protocol
decision-record.md: Decision
```

`check-template-headers.sh` current messages:

```text
Phase parent: template-header enforcement skipped (lean trio policy)
No spec documents found to check (skipped)
${#errors[@]} structural template deviation(s) found in $files_checked file(s)
${#warnings[@]} non-blocking template header deviation(s) in $files_checked file(s)
All template headers match in $files_checked file(s)
```

Current details/remediation include:

```text
$display_name: Missing required section header matching '$value'
$display_name: Required section header out of order '$value'
$display_name: Mid-document extra header '$value' appears before the last required section (position $((extra_index + 1)) of ${#actual_raw[@]})
checklist.md: Uses **[P0]** format instead of CHK-NNN [P0] identifiers ($bare_priority_count items without CHK prefix)
checklist.md: $bare_priority_count item(s) use **[P0]** format instead of CHK-NNN [P0]
checklist.md: H1 should start with '# Verification Checklist:' (found: '${h1_line:0:60}')
1. Copy the exact H1/H2 structure from the active template in .opencode/skill/system-spec-kit/templates/
2. Restore missing or reordered required sections before custom sections
3. Use '# Verification Checklist:' and CHK-NNN [P0/P1/P2] format for checklist files
Move custom sections after the required template structure or document the deviation explicitly
```

`check-section-counts.sh` current messages:

```text
Phase parent: section-count enforcement skipped (lean trio policy)
spec.md has $spec_h2 sections, expected at least $min_spec_h2 for Level $declared_level
plan.md has $plan_h2 sections, expected at least $min_plan_h2 for Level $declared_level
Found $requirements requirements, expected at least $min_requirements for Level $declared_level
Found $scenarios acceptance scenarios, expected at least $min_scenarios for Level $declared_level
Level $declared_level requires checklist.md
Level $declared_level should include decision-record.md
Section count validation errors
Add missing required files or increase section depth
Section counts below expectations for Level $declared_level
Expand spec content or reduce declared level
Section counts appropriate for Level $declared_level
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `check-sections.sh` is taxonomy-neutral and file/section-only. | Keep file/section-only; resolver failures remap to `Internal template contract could not be resolved for Level $level`. | LEVEL-ONLY |
| `check-template-headers.sh` says `active template`, not internal taxonomy. | If helper command names change, use `compare-level-contract`, not `compare-manifest`. | LEVEL-ONLY |
| `Expand spec content or reduce declared level` | `Expand spec content or use the appropriate documentation level for this packet`. | FIXED |

#### 8. `validate.sh` Summary Output

Current normal summary:

```text
Summary: Errors: $ERRORS  Warnings: $WARNINGS
RESULT: FAILED
RESULT: FAILED (strict)
RESULT: PASSED WITH WARNINGS
RESULT: PASSED
```

Current quiet summary:

```text
RESULT: $status (errors=$ERRORS warnings=$WARNINGS)
```

Current JSON summary:

```json
{
  "summary": {
    "errors": 0,
    "warnings": 0,
    "info": 0
  }
}
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `Summary: Errors: $ERRORS  Warnings: $WARNINGS` | Same. | LEVEL-ONLY |
| Quiet `RESULT: $status (errors=$ERRORS warnings=$WARNINGS)` | Same. | LEVEL-AGNOSTIC |
| JSON `summary.errors`, `summary.warnings`, `summary.info` | Same. | LEVEL-AGNOSTIC |

#### 9. Generated `spec.md` Content

Current level markers:

```text
<!-- SPECKIT_LEVEL: 1 -->
| **Level** | 1 |

<!-- SPECKIT_LEVEL: 2 -->
| **Level** | [1/2/3/3+] |

<!-- SPECKIT_LEVEL: 3 -->
| **Level** | 3 |

<!-- SPECKIT_LEVEL: 3+ -->
| **Level** | 3+ |

<!-- SPECKIT_LEVEL: 2 -->
| **Level** | 2 |
```

Leak probe found:

```text
.opencode/skill/system-spec-kit/templates/phase_parent/spec.md:21:    - Sub-phase manifest: which child phase folders exist and what each one does
.opencode/skill/system-spec-kit/templates/level_3+/spec.md:198:**As a** [user type], **I want** [capability], **so that** [benefit].
.opencode/skill/system-spec-kit/templates/level_3/spec.md:199:**As a** [user type], **I want** [capability], **so that** [benefit].
.opencode/skill/system-spec-kit/templates/level_3/spec.md:208:**As a** [user type], **I want** [capability], **so that** [benefit].
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| `<!-- SPECKIT_LEVEL: N -->` and `| **Level** | N |` remain present. | Same. | LEVEL-ONLY |
| `[capability]` appears in generated Level 3/3+ user-story placeholders. | Replace with `[user outcome]`, `[action]`, or `[needed behavior]`. | LEAKS |
| `Sub-phase manifest` appears in generated phase-parent `spec.md`. | Replace with `Sub-phase map` or `Sub-phase list`. | LEAKS |

#### 10. Generated `description.json` Field Shape

Current explicit-description shape from `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js`:

```json
{
  "specFolder": "...",
  "description": "...",
  "keywords": [],
  "lastUpdated": "...",
  "specId": "...",
  "folderSlug": "...",
  "parentChain": [],
  "memorySequence": 0,
  "memoryNameHistory": []
}
```

Current generated-from-spec shape in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` has the same required/identity fields. It does not include `level`.

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| No `level` field today. | Do not add internal contract fields here; if a level is later needed, use only `level: N`. | LEVEL-ONLY |
| No `preset`, `capability`, `capabilities`, `kind`, or `manifestVersion` fields. | Keep them absent. | LEVEL-ONLY |
| `description.json created in ${folderPath}` stdout from generator. | Same or suppress in JSON mode; no taxonomy leak. | LEVEL-ONLY |

#### 11. Generated `graph-metadata.json` Field Shape

Current `create_graph_metadata_file` shape:

```json
{
  "schema_version": 1,
  "packet_id": "...",
  "spec_folder": "...",
  "parent_id": null,
  "children_ids": [],
  "manual": {
    "depends_on": [],
    "supersedes": [],
    "related_to": []
  },
  "derived": {
    "trigger_phrases": [],
    "key_topics": [],
    "importance_tier": "important",
    "status": "planned",
    "key_files": [],
    "entities": [],
    "causal_summary": "...",
    "created_at": "...",
    "last_save_at": "...",
    "last_accessed_at": null,
    "source_docs": []
  }
}
```

| Today's text | Proposed text | Vocabulary verdict |
| --- | --- | --- |
| No top-level `level` field and no `derived.level_contract` today. | Prefer runtime derivation from `SPECKIT_LEVEL`; if persisted, store only `derived.level_contract` with public fields. | LEVEL-ONLY |
| No `preset`, `capability`, `capabilities`, `kind`, or `manifestVersion` keys. | Keep those keys banned in packet metadata. | LEVEL-ONLY |
| `derived.importance_tier` is present and unrelated to documentation level. | Keep `importance_tier` as memory importance, not a documentation taxonomy field. | LEVEL-ONLY |

### 3 Open Questions Resolved

1. Internal schema rows should not be called `presets[]`.

   Recommendation: call them `levelContracts[]`. This is the least leak-prone name because it preserves the public taxonomy even if an internal data row name leaks through logs, stack traces, or future docs. `rows[]` is even more generic but loses intent; `levelContracts[]` says exactly what the internal table resolves.

2. `manifestVersion` should never appear in AI-readable packet metadata.

   Pick: (a) NEVER in packet metadata. If a private implementation cache is needed, it should live outside `description.json`, `graph-metadata.json`, frontmatter, and resume-read surfaces. The cleanest v1 path is runtime derivation from `SPECKIT_LEVEL`; a packet-local version stamp invites memory/resume leakage.

3. CI should fail on banned vocabulary in user-facing surfaces.

   Add `.opencode/skill/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts`. It should scan CLI help-producing script text, validator messages, generated templates, command/skill docs if included in the packet, and generated metadata writers. The current source would fail because generated `spec.md` templates contain `[capability]` and phase-parent content contains `Sub-phase manifest`.

### Workflow-Invariance Test Spec

Proposed test:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(__dirname, '../../../../..');
const banned = /\b(?:preset|capability|capabilities|kind|manifest|manifestVersion)\b/i;

const userFacingFiles = [
  '.opencode/skill/system-spec-kit/scripts/spec/create.sh',
  '.opencode/skill/system-spec-kit/scripts/rules/check-files.sh',
  '.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh',
  '.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh',
  '.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh',
  '.opencode/skill/system-spec-kit/scripts/spec/validate.sh',
  '.opencode/skill/system-spec-kit/templates/level_1/spec.md',
  '.opencode/skill/system-spec-kit/templates/level_2/spec.md',
  '.opencode/skill/system-spec-kit/templates/level_3/spec.md',
  '.opencode/skill/system-spec-kit/templates/level_3+/spec.md',
  '.opencode/skill/system-spec-kit/templates/phase_parent/spec.md',
];

function visibleLines(relativePath: string): string[] {
  const absolutePath = path.join(repoRoot, relativePath);
  return fs
    .readFileSync(absolutePath, 'utf8')
    .split(/\r?\n/)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter(({ line }) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (relativePath.endsWith('.sh')) {
        return /\becho\b|\bprintf\b|RULE_MESSAGE|RULE_DETAILS|RULE_REMEDIATION/.test(line);
      }
      return relativePath.includes('/templates/');
    })
    .map(({ line, index }) => `${relativePath}:${index}: ${line}`);
}

describe('workflow invariance public vocabulary', () => {
  it('keeps public scaffolder, validator, and generated docs level-only', () => {
    const leaks = userFacingFiles
      .flatMap(visibleLines)
      .filter((line) => banned.test(line));

    expect(leaks).toEqual([]);
  });
});
```

If the team wants the narrower wording requested in the prompt, drop `manifest|manifestVersion` from the regex. I recommend keeping both because iteration 11's carry-over facts explicitly banned `manifest` in public surfaces, and today's phase-parent template proves the value of catching it.

### Surface Leakage Risk Assessment

| Surface | Risk | Reason | Mitigation |
| --- | --- | --- | --- |
| Generated `spec.md` templates | H | Current generated Level 3/3+ docs contain `[capability]`; phase-parent generated docs contain `Sub-phase manifest`. These are AI-readable packet docs. | Replace with `needed behavior` and `Sub-phase map`; add CI grep. |
| `create.sh --help` | H | Help is public and often copied into command docs. Current text is clean. | Snapshot help output and grep for banned terms. |
| `create.sh` JSON stdout | H | Automation and AI commands consume it directly. Current fields are clean. | Keep `DOC_LEVEL`; reject `PRESET`, `KIND`, `CAPABILITIES`, `MANIFEST_VERSION`. |
| `description.json` | H | Memory parsers read it. Current shape is clean and has no level. | Do not add contract metadata; if needed, only `level`. |
| `graph-metadata.json` | H | Memory graph parsers read it and may surface derived metadata. Current shape is clean. | Derive at runtime or persist only public `derived.level_contract`. |
| Validator rule messages | M | Completion gates and humans read them. Current messages are mostly clean. | Remap resolver failures; use level-shaped remediation. |
| Phase-parent logs | M | Phase workflows are exposed to users. Current logs are clean. | Keep `Phase Documentation Map`; avoid `manifest`. |
| Sharded warnings | M | Warning path explicitly mentions level support. Current warning is clean. | Preserve exact level-shaped warning. |
| `validate.sh` summary | L | Summary is numeric and level-agnostic. | No change. |

## Questions Answered

1. Do the live `create.sh --help` and success outputs already satisfy the invariant?

   Yes. Help, normal stdout, JSON stdout, phase logs, and sharded warnings are already level-only. The revised iteration-007 proposal lands cleanly on these surfaces if it preserves the current names and messages.

2. Do validator outputs already satisfy the invariant?

   Mostly. `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`, and `validate.sh` do not leak `preset`, `capability`, or `kind`. Proposed changes should still improve `check-files.sh` details and `check-section-counts.sh` remediation so wording becomes explicitly level-shaped.

3. Do generated metadata files leak internal taxonomy?

   No. `description.json` and `graph-metadata.json` currently avoid `preset`, `capability`, `kind`, and `manifestVersion`. Keep it that way.

4. Does generated `spec.md` leak banned vocabulary?

   Yes. Level 3/3+ generated docs contain `[capability]` placeholders, and phase-parent `spec.md` contains `Sub-phase manifest`. These are public/AI-readable leaks under the strict invariant, even though the words are generic in context.

## Questions Remaining

1. Should the workflow-invariance CI test include command docs, agent docs, and skill docs in the same first test, or split them into a second public-docs test to reduce false positives?
2. Should existing generated fixtures under `.opencode/skill/system-spec-kit/scripts/tests/fixtures/` be rewritten immediately, or should the first CI pass focus on live templates and output-producing scripts only?

## Next Focus

Iteration 13 should re-dry-run the iteration-8 scenarios with explicit AI conversation transcripts: user says X, AI responds Y, AI invokes Z. Verify every word the AI emits stays level-only, especially around Gate 3, `/spec_kit:plan`, `/spec_kit:deep-research`, phase-parent creation, validator failure remediation, and JSON/stdout handoff parsing.
