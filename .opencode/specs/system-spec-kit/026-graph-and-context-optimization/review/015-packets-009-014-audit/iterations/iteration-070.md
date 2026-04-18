# Iteration 70 - maintainability - root-docs-completeness

## Dispatcher
- iteration: 70 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:21:54.108Z

## Files Reviewed
- ./AGENTS.md
- ./CLAUDE.md
- ./CODEX.md
- ./GEMINI.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Gate 3 carry-over rules drift across root runtime docs despite being presented as universal guidance.** `CLAUDE.md` says Gate 3 answers apply only within the current workflow phase and must be re-evaluated on plan->implement transitions (`CLAUDE.md:129-135`), but `AGENTS.md`, `CODEX.md`, and `GEMINI.md` all say the answer persists for the entire session and must not be re-asked on follow-up steps in the same task (`AGENTS.md:182-188`, `CODEX.md:182-188`, `GEMINI.md:182-188`). `CLAUDE.md` itself also frames the surrounding recovery rules as universal across runtimes (`CLAUDE.md:71-80`), so the divergence changes runtime behavior for the same spec-folder workflow instead of documenting an explicit runtime-only exception.

```json
{
  "claim": "CLAUDE.md retains a phase-scoped Gate 3 carry-over rule while AGENTS.md, CODEX.md, and GEMINI.md define Gate 3 answers as session-scoped, creating a cross-runtime contract split for the same spec-folder workflow.",
  "evidenceRefs": [
    "CLAUDE.md:71-80",
    "CLAUDE.md:129-135",
    "AGENTS.md:182-188",
    "CODEX.md:182-188",
    "GEMINI.md:182-188"
  ],
  "counterevidenceSought": "Looked for an explicit Claude-only exception in the reviewed root docs or a companion runtime note that would justify re-asking at phase boundaries.",
  "alternativeExplanation": "CLAUDE.md may have preserved an older phase-boundary rule while the other root docs were updated to the newer session-persistence contract.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the intended design is runtime-specific and Claude is deliberately supposed to re-ask Gate 3 at phase boundaries."
}
```

- **All four root docs point the save workflow at a non-existent JS entrypoint.** Each root doc instructs agents to run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for indexed memory saves (`AGENTS.md:201-211`, `CLAUDE.md:147-157`, `CODEX.md:201-211`, `GEMINI.md:201-211`), but the repo contains the TypeScript source at `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:1-8`) and a repo-wide lookup found no `generate-context.js` entrypoint. An agent following the root docs literally will miss the shipped script surface for a documented operational command.

```json
{
  "claim": "The root runtime docs document memory-save execution through scripts/dist/memory/generate-context.js even though that JS entrypoint is not present in the repository, breaking the documented command surface.",
  "evidenceRefs": [
    "AGENTS.md:201-211",
    "CLAUDE.md:147-157",
    "CODEX.md:201-211",
    "GEMINI.md:201-211",
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:1-8"
  ],
  "counterevidenceSought": "Checked for a committed generate-context.js under system-spec-kit and for another reviewed root-doc path that explained a generated build artifact requirement.",
  "alternativeExplanation": "The docs may have been copied from a built-artifact workflow where dist output exists locally, but that requirement is not documented in the root runtime entrypoints.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the runtime always materializes scripts/dist/memory/generate-context.js before any agent can consume these root docs."
}
```

### P2 Findings
- **`CLAUDE.md` points recovery readers at a runtime-doc path that is not present in this repo.** The recovery checklist says to re-read `.claude/CLAUDE.md` if runtime-specific instructions exist (`CLAUDE.md:80`), but this repository exposes the root `CLAUDE.md` and no `.claude/CLAUDE.md` mirror. Because the sentence is guarded with "if they exist," this is a stale breadcrumb rather than an immediate execution break.

## Traceability Checks
- **Cross-runtime consistency:** verified that all four docs expose the same runtime-agent directory table and same major section layout; only the Gate 3 carry-over rule diverges, and only in `CLAUDE.md`.
- **Skill↔code alignment:** verified that `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` and `.opencode/skill/system-spec-kit/templates/level_*` referenced by the root docs resolve in-repo; the documented `scripts/dist/memory/generate-context.js` path does not.
- **Command↔implementation alignment:** verified that `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` all exist and that live `context` agents are present in each runtime directory; the stale `.claude/CLAUDE.md` breadcrumb and missing `generate-context.js` entrypoint remain misaligned.

## Confirmed-Clean Surfaces
- `AGENTS.md`, `CODEX.md`, and `GEMINI.md` are structurally aligned and share the same runtime-agent directory and distributed-governance guidance.
- The runtime-agent directory references in all four files match existing repo surfaces: `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`.
- The distributed-governance references to `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` and `.opencode/skill/system-spec-kit/templates/level_*` are current.

## Next Focus
- No iteration 71 scheduled; fold root-doc findings into final operational-doc synthesis and dedupe against earlier save-workflow documentation drift.
