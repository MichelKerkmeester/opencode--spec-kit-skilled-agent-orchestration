# sk-doc Audit Target List

Packet: `037/004-sk-doc-template-alignment`

## Discovery

Requested broad discovery command:

```bash
git --no-pager diff --name-only $(git --no-pager log --grep '026/031\|026/032\|026/033\|026/034\|026/035\|026/036' --format='%H' | tail -1)~1 HEAD -- '*.md' '*.txt' | sort -u
```

The broad command returned 131 paths in this worktree because `HEAD` includes unrelated later docs. To honor the packet constraint, the active audit scope uses files changed by commits whose subjects match `026/031` through `026/036`.

## Active Scope

Files audited: 63

```text
.opencode/command/memory/manage.md
.opencode/skill/system-spec-kit/ARCHITECTURE.md
.opencode/skill/system-spec-kit/SKILL.md
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/skill/system-spec-kit/mcp_server/README.md
.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/README.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F1-spec-folder.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F10-deep-loop.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F11-hooks.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F12-validators.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F13-stress-cycle.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F14-search-w3-w13.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F2-skill-advisor.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F3-memory-search.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F4-memory-context.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F5-code-graph-query.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F6-code-graph-scan.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F7-causal-graph.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F8-cocoindex.md
.opencode/skill/system-spec-kit/mcp_server/matrix-runners/templates/F9-continuity.md
.opencode/skill/system-spec-kit/references/config/hook_system.md
.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/tasks.md
AGENTS.md
```
