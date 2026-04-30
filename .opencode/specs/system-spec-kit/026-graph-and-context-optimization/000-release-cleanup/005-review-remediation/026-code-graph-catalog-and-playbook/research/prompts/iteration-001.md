## Packet 039: code-graph-catalog-and-playbook — Tier B doc creation

You are cli-codex (gpt-5.5 high fast) implementing **026-code-graph-catalog-and-playbook**.

### Goal

Per the operator's explicit directive: code_graph needs a feature catalog AND a manual testing playbook, located at the runtime package source-of-truth path:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/`

Mirror the pattern already used for `skill_advisor/`:
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/`

### Read these first

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md` (parent index — pattern reference)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/02-advisor-status.md` (per-feature file pattern)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/manual_testing_playbook.md` (parent index — pattern)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/01--native-mcp-tools/006-advisor-status-rebuild-separation.md` (per-test entry pattern)
- `.opencode/skill/sk-doc/SKILL.md` (template owner)
- `.opencode/skill/sk-doc/assets/` (feature-catalog + manual-testing-playbook templates)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` (current state of the runtime package)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/` (every handler — discover features)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/` (helpers like ensure-ready.ts)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/` (MCP tool definitions)
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/` (root skill catalog category — cross-link)
- 013 + 035 packet docs for code_graph reality classifications (auto/half/manual surface)

### Implementation phases

#### Phase 1: Feature discovery

Walk through `mcp_server/code_graph/`:

```bash
find .opencode/skill/system-spec-kit/mcp_server/code_graph -type f -name '*.ts' | head -30
ls .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/
ls .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/
ls .opencode/skill/system-spec-kit/mcp_server/code_graph/tools/
```

Identify code_graph features and group them. Reference grouping pattern from skill_advisor (8 groups). Suggested code_graph groups:

1. **Read-path freshness** (ensure-ready.ts, query handler self-heal)
2. **Manual scan / verify / status** (scan, verify, status handlers)
3. **Detect-changes preflight** (detect-changes handler)
4. **Context retrieval** (context.ts, code_graph_context handler)
5. **Coverage graph** (coverage-graph/* — query, status, upsert, convergence — these are the deep-loop graph tools shared with deep-research/review)
6. **MCP tool surface** (tool registrations, schemas)
7. **CCC integration** (ccc-reindex, ccc-feedback, ccc-status — if they live under code_graph/handlers/)
8. **Doctor-code-graph integration** (apply-mode contract, gold battery)

Adjust groups based on what you actually find — these are suggestions, not gospel. Use what reads cleanly.

#### Phase 2: Feature catalog at `mcp_server/code_graph/feature_catalog/`

Create:

```
mcp_server/code_graph/feature_catalog/
├── feature_catalog.md          (parent index)
├── 01--read-path-freshness/
│   ├── 01-ensure-code-graph-ready.md
│   └── 02-query-self-heal.md
├── 02--manual-scan-verify-status/
│   ├── 01-code-graph-scan.md
│   ├── 02-code-graph-verify.md
│   └── 03-code-graph-status.md
├── 03--detect-changes/
│   └── 01-detect-changes-preflight.md
├── 04--context-retrieval/
│   ├── 01-code-graph-context.md
│   └── 02-context-handler.md
├── 05--coverage-graph/
│   ├── 01-deep-loop-graph-query.md
│   ├── 02-deep-loop-graph-status.md
│   ├── 03-deep-loop-graph-upsert.md
│   └── 04-deep-loop-graph-convergence.md
├── 06--mcp-tool-surface/
│   └── 01-tool-registrations.md
├── 07--ccc-integration/
│   ├── 01-ccc-reindex.md
│   ├── 02-ccc-feedback.md
│   └── 03-ccc-status.md
└── 08--doctor-code-graph/
    └── 01-doctor-apply-mode.md
```

Each per-feature file follows the skill_advisor catalog format:
- frontmatter with title, description, trigger_phrases, importance_tier
- Overview
- Surface (file:line refs to handler/tool/schema)
- Trigger / auto-fire path (or "manual command via /spec_kit:..." if operator-only)
- Class: auto / half / manual / aspirational (from 013 reality map; reuse exact classifications)
- Caveats / fallback
- Cross-refs to related features

The parent `feature_catalog.md` is an index linking to the 8 groups + a brief overview.

#### Phase 3: Manual testing playbook at `mcp_server/code_graph/manual_testing_playbook/`

Create:

```
mcp_server/code_graph/manual_testing_playbook/
├── manual_testing_playbook.md  (parent index)
├── 01--read-path-freshness/
│   ├── 001-ensure-ready-selective-reindex.md
│   └── 002-query-self-heal-stale-file.md
├── 02--manual-scan-verify-status/
│   ├── 003-code-graph-scan-incremental.md
│   ├── 004-code-graph-scan-full.md
│   ├── 005-code-graph-verify-blocked-on-stale.md
│   └── 006-code-graph-status-readonly.md
├── 03--detect-changes/
│   └── 007-detect-changes-no-inline-index.md
├── 04--context-retrieval/
│   └── 008-code-graph-context-readiness-block.md
├── 05--coverage-graph/
│   ├── 009-deep-loop-graph-convergence-yaml-fire.md
│   └── 010-deep-loop-graph-upsert-conditional.md
├── 06--mcp-tool-surface/
│   └── 011-tool-call-shape-validation.md
├── 07--ccc-integration/
│   ├── 012-ccc-reindex-binary-shell-out.md
│   ├── 013-ccc-feedback-jsonl-append.md
│   └── 014-ccc-status-availability-probe.md
└── 08--doctor-code-graph/
    └── 015-doctor-apply-mode-policy.md
```

Each playbook entry follows skill_advisor playbook format:
- Title (e.g., "001-ensure-ready-selective-reindex")
- Goal
- Prerequisites (env, prior state)
- Reproducible step-by-step commands
- Expected output / verification
- Cleanup
- Variant scenarios (if applicable)

The parent `manual_testing_playbook.md` is an index linking to the 8 groups.

#### Phase 4: Cross-link the new artifacts

- Update `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` to reference the new feature_catalog/ and manual_testing_playbook/ subdirs
- Update `.opencode/skill/system-spec-kit/mcp_server/README.md` to mention code_graph's new catalog/playbook (one line each)
- Update root skill catalog at `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/` to cross-link the runtime catalog (mention "for runtime details, see mcp_server/code_graph/feature_catalog/")
- Update root skill playbook at `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/` to cross-link the runtime playbook similarly

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/026-code-graph-catalog-and-playbook/`.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/003-testing-playbook-trio"]`. (Picks up where the trio left off — code_graph runtime-package catalog/playbook were missing from those.)

**Trigger phrases**: `["026-code-graph-catalog-and-playbook","code_graph feature catalog","code_graph manual testing playbook","code_graph runtime catalog"]`.

**Causal summary**: `"Adds feature_catalog/ and manual_testing_playbook/ to mcp_server/code_graph/ — mirroring the skill_advisor pattern. 8 feature groups + ~15 playbook entries. Cross-linked from runtime + root skill catalogs/playbooks."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0 on this packet.
- Use existing skill_advisor catalog/playbook as format reference.
- Cite file:line evidence for every feature surface entry.
- DO NOT commit; orchestrator will commit.
- If a feature group has zero entries (nothing to catalog), omit it — don't fabricate.
- Be precise on classification (auto/half/manual/aspirational) — copy from 013's reality map; do not re-classify.

When done, last action is strict validator passing. No narration; just write files and exit.
