---
title: "Feature Specification: Broader Default Excludes + Granular Per-Skill Selection for Code Graph"
description: "Extend code-graph default excludes from .opencode/skill/** to also cover .opencode/agent/**, .opencode/command/**, .opencode/specs/**, and .opencode/plugins/**. Add per-folder opt-in fields (includeAgents, includeCommands, includeSpecs, includePlugins) + env vars. Extend includeSkills from boolean to boolean | string[] for granular per-skill selection (e.g., ['sk-code-review', 'sk-doc'])."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "broader default excludes"
  - "granular skill selection"
  - "per skill code graph"
  - "exclude opencode subdirs"
  - "include skills list"
  - "code graph scope expansion"
spec_id: "026/007/011"
level: 2
spec_kind: implementation
status: in-progress
importance_tier: important
_memory:
  spec_id: 026/007/011
  level: 2
  spec_kind: implementation
  status: in-progress
  topic: "Broader default excludes + granular per-skill selection"
  importance_tier: important
  continuity:
    last_updated_at: "2026-05-02T19:30:00Z"
    completion_pct: 5
    recent_action: "Spec scaffolded for direct implementation"
    next_safe_action: "Dispatch single cli-codex implementation agent"
---

# Feature Specification: Broader Default Excludes + Granular Per-Skill Selection

<!-- ANCHOR:metadata -->
## METADATA

- **Spec ID:** 026/007/011
- **Level:** 2 (implementation extension; no separate research phase needed — well-trodden territory of 009)
- **Status:** in-progress
- **Created:** 2026-05-02
- **Builds on:** 026/007/009 (end-user scope default), 026/007/010 (process-improvement)

<!-- ANCHOR:problem -->
## 1. PROBLEM

009 shipped default exclude of `.opencode/skill/**` only. Two follow-on gaps:

1. **Other `.opencode/` subdirs still pollute end-user code searches.** `.opencode/agent/`, `.opencode/command/`, `.opencode/specs/`, `.opencode/plugins/` get indexed by default. Spec folders alone can be hundreds of files. End users querying their own repo code don't want spec-kit infrastructure in results.

2. **No granular per-skill selection.** `includeSkills` is binary (true=all, false=none). Maintainers debugging a specific skill (e.g., `sk-code-review`) want to index ONLY that skill, not all 30+.

<!-- ANCHOR:scope -->
## 2. SCOPE (FROZEN)

### IN scope

**Default excludes (5 subdirs):**
- `.opencode/skill/**` (existing, preserved)
- `.opencode/agent/**` (new)
- `.opencode/command/**` (new)
- `.opencode/specs/**` (new)
- `.opencode/plugins/**` (new)

**Per-folder opt-in fields (per-call):**
- `includeSkills?: boolean | string[]` (extended — boolean keeps existing semantics; `string[]` is new — list of skill names like `['sk-code-review']`)
- `includeAgents?: boolean` (new)
- `includeCommands?: boolean` (new)
- `includeSpecs?: boolean` (new)
- `includePlugins?: boolean` (new)

**Env vars (per-folder, mirror existing pattern):**
- `SPECKIT_CODE_GRAPH_INDEX_SKILLS` (existing — extend to accept `true|false|csv-of-names`)
- `SPECKIT_CODE_GRAPH_INDEX_AGENTS=true|false` (new)
- `SPECKIT_CODE_GRAPH_INDEX_COMMANDS=true|false` (new)
- `SPECKIT_CODE_GRAPH_INDEX_SPECS=true|false` (new)
- `SPECKIT_CODE_GRAPH_INDEX_PLUGINS=true|false` (new)

**Precedence (preserve 009 contract):** per-call boolean overrides env. For lists: per-call list overrides env list.

**Fingerprint v2 format** (bump from v1; existing v1 DBs trigger blocked-read migration):
```
v2: code-graph-scope:v2:skills=<all|none|list[a,b]>:agents=<all|none>:commands=<all|none>:specs=<all|none>:plugins=<all|none>:mcp-coco-index=excluded
```

**Status payload `activeScope` extends:**
- `includedSkills: 'all' | 'none' | string[]`
- `includedAgents: 'all' | 'none'`
- `includedCommands: 'all' | 'none'`
- `includedSpecs: 'all' | 'none'`
- `includedPlugins: 'all' | 'none'`

### OUT of scope

- Granular per-folder for agents/commands/specs/plugins (boolean only for now — user's stated need is granular for skills only)
- New review/research packets (009's research already covered the scope-policy class of decision)
- Touching mcp-coco-index/mcp_server (always excluded; preserved)

<!-- ANCHOR:requirements -->
## 3. REQUIREMENTS

### Functional Requirements

**F1.** `resolveIndexScopePolicy()` accepts the new fields + computes new fingerprint format. Per-call overrides env per existing precedence rules.

**F2.** Walker (`shouldIndexForCodeGraph()`) honors all 5 default excludes + the granular skill list. For `includeSkills: ['sk-x']`, only paths matching `.opencode/skill/sk-x/**` are allowed; other skills stay excluded.

**F3.** Status payload exposes `activeScope` with the 5 new fields + the granular skill list.

**F4.** Fingerprint mismatch (v1 stored vs v2 active) triggers existing blocked-read with `requiredAction:"code_graph_scan"` instruction.

**F5.** Schema validation accepts the new field types: `includeSkills: z.boolean().or(z.array(z.string().regex(/^sk-/)))`. Other includeX are `z.boolean().optional()`.

### Quality Requirements

- All 6 precedence cases × 5 folders covered in test matrix (or use describe.each pattern from R5)
- Strict packet validate: 0 errors / 0 warnings
- 009 packet still validates clean (regression)
- workflow-invariance vitest: pass
- code_graph + tool-input vitest: 100% pass

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

- All 5 default excludes apply at scan time (verified by counting indexed files in a sample workspace)
- Granular `includeSkills: ['sk-code-review']` indexes ONLY that skill (verified by file count + path inspection)
- 4 new env vars parsed correctly (verified by 4 × env-true tests)
- Fingerprint v2 stored after scan + v1→v2 mismatch detected (existing migration test extended)
- All 4 verification gates pass

<!-- ANCHOR:risks -->
## 5. RISKS

- **R1 [P1]** — `.opencode/specs/` is BIG (hundreds of files). End users might want to index THEIR specs but not the spec-kit's. Mitigation: default exclude is `.opencode/specs/**` (the FULL path including spec-kit's specs). End-user spec folders typically live elsewhere; if not, they can opt in via `includeSpecs:true`.
- **R2 [P1]** — Skill name validation: `string[]` items should be valid skill names (existing dirs under `.opencode/skill/`). Invalid name should fail schema validation OR silently no-op. Decide: schema regex `^sk-[a-z0-9-]+$` keeps it permissive but bounded; runtime validation against fs adds overhead. Pick schema-only.
- **R3 [P2]** — Fingerprint v2 length grows (5 fields vs 1). Could bloat status payload. Mitigation: still under 200 chars; acceptable.

<!-- ANCHOR:questions -->
## 6. RESEARCH QUESTIONS

(None — implementation extension of 009; design decisions resolved in this spec.)

<!-- ANCHOR:related-documents -->
## 7. RELATED DOCUMENTS

- `../009-end-user-scope-default/` (parent — defines the policy/walker/fingerprint architecture this extends)
- `../010-fix-iteration-quality-meta-research/` (sibling — defines the fix-completeness checklist this implementation should apply)
- `mcp_server/code_graph/lib/index-scope-policy.ts` (primary surface)
- `mcp_server/code_graph/lib/code-graph-db.ts` (fingerprint storage)
- `mcp_server/code_graph/handlers/scan.ts` + `status.ts` (consumers)
