## Packet 036: cli-matrix-adapter-runners — Tier B follow-on to 035

You are cli-codex (gpt-5.5 high fast) implementing remediation packet **036-cli-matrix-adapter-runners**.

### Goal

Closes the highest-leverage gap surfaced by packet 035's CONDITIONAL verdict: **42 RUNNER_MISSING cells** in the F1-F14 × CLI-executor matrix. Build per-CLI adapter runners that convert RUNNER_MISSING cells into executable cells (PASS / FAIL / TIMEOUT_CELL / NA / BLOCKED).

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design/spec.md` (matrix design source)
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design/plan.md` (Option C architecture: per-feature runners + meta-aggregator)
- `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md` (current pass/fail/blocked/runner_missing matrix; per-cell evidence)
- `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/results/` (per-cell JSONL evidence files)
- `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/logs/feature-runs/` (existing runner output examples)
- Existing CLI invocation patterns from packet 013 + this session — see how cli-codex / cli-copilot / cli-gemini / cli-claude-code / cli-opencode are invoked elsewhere in the repo

### Implementation

#### Phase 1: Discovery

1. Determine adapter target location. Recommended: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/` (parallel to existing `mcp_server/handlers/`, `mcp_server/lib/`).
2. Read 030's design completely. Confirm:
   - 14 features F1-F14
   - 5 CLI executors: cli-codex, cli-copilot, cli-gemini, cli-claude-code, cli-opencode
   - Plus native + inline (already covered by 035's existing runners)
   - 70 (F × CLI) cells; some N/A (e.g., F11 hooks NA on cli-gemini)

#### Phase 2: Adapter implementation

For each of the 5 CLI executors, create an adapter at `mcp_server/matrix_runners/adapter-cli-<name>.ts`:

**Adapter contract:**

```typescript
interface AdapterInput {
  featureId: string;          // F1-F14
  promptTemplate: string;     // markdown prompt
  expectedSignal: string;     // regex or substring to detect PASS
  timeoutSeconds: number;     // per-cell timeout (default 300)
  workingDir: string;         // working directory for the CLI
}

interface AdapterResult {
  status: 'PASS' | 'FAIL' | 'TIMEOUT_CELL' | 'NA' | 'BLOCKED';
  durationMs: number;
  evidence: { stdout: string; stderr: string; exitCode: number };
  reason?: string;
}

async function adapterCliCodex(input: AdapterInput): Promise<AdapterResult> { ... }
```

**Per-CLI adapter specifics:**

- **adapter-cli-codex.ts**: invokes `codex exec --model <m> -c model_reasoning_effort=<e> -c service_tier=<t> -c approval_policy=never --sandbox workspace-write -` with prompt via stdin
- **adapter-cli-copilot.ts**: invokes `copilot -p <prompt> --model <m> --allow-all-tools --no-ask-user`. Note: prompt is positional, no stdin
- **adapter-cli-gemini.ts**: invokes `gemini <prompt> -m gemini-3.1-pro-preview -y -o text`
- **adapter-cli-claude-code.ts**: invokes `claude -p <prompt> --model <m> --permission-mode acceptEdits`
- **adapter-cli-opencode.ts**: invokes the local `opencode` binary; check actual invocation pattern from session-touched `cli-opencode` skill docs

Each adapter:
- Catches `EAGAIN` / `ENOSPC` / spawn errors → returns BLOCKED with reason
- Honors timeout (returns TIMEOUT_CELL if exceeded)
- Captures stdout + stderr to evidence
- Validates expectedSignal in stdout → PASS; else FAIL

#### Phase 3: Manifest

Create `mcp_server/matrix_runners/matrix-manifest.json` enumerating all 70 cells:

```json
{
  "version": "1.0.0",
  "cells": [
    {
      "featureId": "F1",
      "featureName": "Spec-folder workflow",
      "executor": "cli-codex",
      "applicable": true,
      "promptTemplate": "templates/F1-spec-folder.md",
      "expectedSignal": "spec_folder created",
      "timeoutSeconds": 300
    },
    ...
  ],
  "executorApplicabilityRules": {
    "F11-hooks": ["cli-gemini-NA-no-hooks"]
  }
}
```

#### Phase 4: Smoke tests

Add ONE smoke test per adapter at `mcp_server/tests/matrix-adapter-<name>.vitest.ts`. Each test:
- Mocks the CLI binary (via spawn mock)
- Verifies adapter parses output → AdapterResult correctly
- Verifies timeout handling
- Does NOT actually invoke the CLI (would be flaky in CI)

#### Phase 5: Meta-runner

Add `mcp_server/matrix_runners/run-matrix.ts`:
- Loads manifest
- Iterates cells (with concurrency limit = 3 to avoid hammering CLI APIs; respect feedback memory: cli-copilot caps at 3 concurrent dispatches)
- Routes to correct adapter
- Writes per-cell JSONL to `<output-dir>/<feature>-<executor>.jsonl`
- Writes summary to `<output-dir>/summary.tsv`
- Emits aggregate matrix with pass rates by feature + by executor

CLI entry: `npx tsx mcp_server/matrix_runners/run-matrix.ts --output <dir> [--filter F1,F3,...] [--executors cli-codex,cli-copilot,...]`

#### Phase 6: TS build + test verification

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` — must succeed
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run matrix-adapter` — all 5 smoke tests must pass
- DO NOT run the full vitest suite

#### Phase 7: Docs

- `mcp_server/matrix_runners/README.md` — quickstart, manifest format, adding new cells, running the matrix
- Update `mcp_server/README.md` with a brief reference to matrix_runners/
- DO NOT update 035's findings.md (that's a separate verification packet's job)

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/`:
- spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation","system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"]`.

**Trigger phrases**: `["036-cli-matrix-adapter-runners","CLI matrix adapter","matrix runner adapters","cli-codex adapter","cli-copilot adapter","cli-gemini adapter"]`.

**Causal summary**: `"Builds per-CLI adapter runners (cli-codex/cli-copilot/cli-gemini/cli-claude-code/cli-opencode) for the F1-F14 × executor matrix. 5 adapters + manifest + meta-runner + 5 smoke tests. Converts 42 RUNNER_MISSING cells into executable cells. Closes the biggest gap surfaced by 035's CONDITIONAL verdict."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- This packet WRITES code. Be surgical.
- Strict validator MUST exit 0.
- 5 smoke tests MUST pass.
- TS build MUST succeed.
- DO NOT execute the full matrix (no actual CLI invocations during tests; use mocks).
- DO NOT commit; orchestrator will commit.
- Cite file:line evidence in packet docs.

When done, last action is strict validator + 5 smoke tests passing. No narration; just write files and exit.
