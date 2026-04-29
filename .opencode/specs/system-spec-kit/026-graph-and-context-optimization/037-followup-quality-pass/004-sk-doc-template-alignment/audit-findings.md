# sk-doc Template Audit Findings

## Summary

- Active files audited: 63
- PASS: 40
- FIX_APPLIED: 7
- DEFERRED: 16
- Broad raw command result: 131 paths, narrowed to commit-specific 031 through 036 scope.
- sk-doc skill: read-only.
- Code changes: none.

## Validation Commands

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py <file> --json --no-exclude
python3 .opencode/skill/sk-doc/scripts/validate_document.py <file> --type reference --json --no-exclude
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```

Additional integrity checks covered balanced `<!-- ANCHOR:slug -->` markers and closed fenced code blocks.

## Applied Fixes

| File | Fix |
|------|-----|
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Fixed README TOC anchors and added `importance_tier` metadata |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Fixed README TOC anchors and added `importance_tier` metadata |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` | Added README TOC, balanced section anchors and `importance_tier` metadata |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` | Added README TOC, balanced section anchors and `importance_tier` metadata |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/README.md` | Added README TOC, numbered sections, anchors, trigger phrases and `importance_tier` metadata |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Added reference frontmatter, numbered H2 sections and balanced anchors |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Added `importance_tier` metadata |

## Deferred Findings

| File Pattern | Reason |
|--------------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F*.md` | These are raw prompt payloads. Adding README or asset overview sections would change the text sent to external CLI runners. |
| `AGENTS.md` | This is a governance template, not a README. Emoji and heading style existed before packets 031 through 036, so rewriting it would be out-of-scope drift cleanup. |

## Per-file Results

| File | Status | Notes |
|------|--------|-------|
| `.opencode/command/memory/manage.md` | PASS | No blocking sk-doc issue in applicable command checks |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | FIX_APPLIED | TOC anchor and frontmatter metadata aligned |
| `.opencode/skill/system-spec-kit/SKILL.md` | PASS | No blocking sk-doc issue in applicable skill checks |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | PASS | No blocking sk-doc issue in applicable reference checks |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | FIX_APPLIED | TOC anchor and frontmatter metadata aligned |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` | FIX_APPLIED | README TOC, anchors and frontmatter metadata added |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` | FIX_APPLIED | README TOC, anchors and frontmatter metadata added |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/README.md` | FIX_APPLIED | README structure, TOC, anchors and metadata aligned |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F1-spec-folder.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F10-deep-loop.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F11-hooks.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F12-validators.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F13-stress-cycle.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F14-search-w3-w13.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F2-skill-advisor.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F3-memory-search.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F4-memory-context.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F5-code-graph-query.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F6-code-graph-scan.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F7-causal-graph.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F8-cocoindex.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F9-continuity.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | FIX_APPLIED | Reference frontmatter, numbered sections and anchors added |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | FIX_APPLIED | `importance_tier` metadata added |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/research/iterations/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `AGENTS.md` | DEFERRED | Governance template, not README; emoji/header drift existed before packets 031 through 036 |

## Re-audit Results

| Check | Result |
|-------|--------|
| Edited READMEs | PASS |
| Edited reference docs | PASS |
| Active target anchor balance | PASS |
| Active target fenced code blocks | PASS |
