---
title: "Hooks"
description: "Runtime startup hooks, prompt-time skill-advisor hooks, and in-process helper modules for memory surfacing and UX feedback."
trigger_phrases:
  - "hooks"
  - "memory surfacing"
  - "context injection"
  - "startup hook"
  - "skill advisor hook"
---

# Hooks

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`hooks/` contains runtime hook scripts and in-process helper modules for startup context, prompt-time skill advice, compaction support, memory surfacing, mutation feedback, and response hints.

Current state:

- Runtime startup hooks transport compact startup context for Claude, Gemini, Copilot, and Codex.
- Prompt-time hooks call the native advisor and inject a brief through each runtime surface.
- `index.ts` exports helper modules used inside MCP responses and mutation flows.
- OpenCode prompt-time advice is delivered by the OpenCode plugin and bridge, not by a subfolder in this directory.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                              HOOKS                               │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Claude         │ ───▶ │ runtime hook files │ ───▶ │ startup or prompt  │
│ Gemini         │      │ per runtime        │      │ context transport  │
│ Copilot        │      └─────────┬──────────┘      └─────────┬──────────┘
│ Codex          │                │                           │
└────────────────┘                ▼                           ▼
                         ┌────────────────────┐      ┌────────────────────┐
                         │ native advisor     │      │ managed context    │
                         │ and startup brief  │      │ stdout, file, hook │
                         └─────────┬──────────┘      └─────────┬──────────┘
                                   │                           │
                                   ▼                           ▼
                         ┌────────────────────┐      ┌────────────────────┐
                         │ index.ts exports   │ ───▶ │ MCP envelope hints │
                         │ helper modules     │      │ and cache feedback │
                         └────────────────────┘      └────────────────────┘

Dependency direction: runtime folders ───▶ shared helpers ───▶ MCP response metadata.
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
mcp_server/hooks/
├── claude/                        # Claude session, prompt, compaction, and transcript hooks
├── gemini/                        # Gemini startup, prompt, compaction, and cache hooks
├── copilot/                       # Copilot startup, prompt, compaction, and instructions helpers
├── codex/                         # Codex session, prompt, pre-tool, and wrapper hooks
├── index.ts                       # Public helper exports
├── memory-surface.ts              # Context extraction and constitutional cache helpers
├── mutation-feedback.ts           # Post-mutation feedback payloads
├── response-hints.ts              # Auto-surface hints and token count sync
├── shared-provenance.ts           # Provenance-wrapped transport helpers
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `claude/` | Claude runtime hook scripts and README. |
| `gemini/` | Gemini runtime hook scripts and README. |
| `copilot/` | Copilot hook scripts and managed instructions handling. |
| `codex/` | Codex native hook scripts plus prompt-wrapper fallback. |
| `index.ts` | Public export barrel for in-process helper modules. |
| `memory-surface.ts` | Extracts context hints and surfaces constitutional or triggered memory. |
| `mutation-feedback.ts` | Maps mutation hook results into public response payloads. |
| `response-hints.ts` | Adds auto-surface hints and token counts to MCP JSON envelopes. |
| `shared-provenance.ts` | Wraps hook transport with provenance metadata. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Runtime scripts | Keep runtime registration details in each runtime subfolder and README. |
| In-process helpers | Export shared helper modules through `index.ts`. |
| Startup transport | Use startup hooks for compact context priming, not prompt-time advisor delivery. |
| Prompt advice | Use prompt-time hooks or the OpenCode plugin bridge for advisor briefs. |
| Mutation feedback | Read mutation results from `../handlers/mutation-hooks.ts` before building public payloads. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Runtime event starts or prompt submits   │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Runtime-specific hook script runs        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Startup brief or advisor brief is built  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Runtime transport injects compact output │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Agent receives context or advisor brief  │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `claude/session-prime.ts` | Hook script | Claude startup context injection. |
| `gemini/session-prime.ts` | Hook script | Gemini startup context injection. |
| `copilot/session-prime.ts` | Hook script | Copilot managed instructions refresh. |
| `codex/session-start.ts` | Hook script | Codex native session-start injection. |
| `*/user-prompt-submit.ts` | Hook script | Prompt-time skill advisor delivery for supported runtimes. |
| `index.ts` | Module | Public exports for in-process helper functions. |

Main helper exports include `extractContextHint`, `getConstitutionalMemories`, `clearConstitutionalCache`, `autoSurfaceMemories`, `autoSurfaceAtToolDispatch`, `autoSurfaceAtCompaction`, `MEMORY_AWARE_TOOLS`, `buildMutationHookFeedback`, `appendAutoSurfaceHints`, `syncEnvelopeTokenCount`, and `serializeEnvelopeWithTokenCount`.

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from `.opencode/skill/system-spec-kit/mcp_server` unless noted.

```bash
npx vitest run hooks
```

Expected result: hook helper and runtime hook tests exit with Vitest success.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../handlers/README.md`](../handlers/README.md)
- [`../core/README.md`](../core/README.md)
- [`../../references/hooks/skill-advisor-hook.md`](../../references/hooks/skill-advisor-hook.md)
- [`../../references/config/hook_system.md`](../../references/config/hook_system.md)

<!-- /ANCHOR:related -->
