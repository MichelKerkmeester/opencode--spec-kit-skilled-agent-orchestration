---
title: "Deep-Read of contamination-filter.ts and V8 Rule: Denylist Patterns and Foreign-Spec Detection"
iteration: 3
focus: "Contamination Detection — full denylist enumeration, severity model, and V8 foreign-spec rule trace"
findings_summary: "contamination-filter.ts contains 47 DenylistEntry patterns (not 99) across 3 severity levels. The V8 rule is NOT in contamination-filter.ts — it lives in validate-memory-quality.ts (lines 702-775) as a post-render validation rule. V8 detects foreign spec-folder IDs via SPEC_ID_REGEX, using an allowlist of self+ancestor+child+related_specs IDs. Cross-phase references (e.g., '015-runtime-contract') trigger V8 when the referenced spec ID is not in the allowlist. CONTAMINATION_GATE_ABORT is raised in workflow.ts:1567-1570 when V8 or V9 are in the failed rules list."
---

# Iteration 3: Deep-Read of contamination-filter.ts and V8 Rule

## Focus

Document all denylist patterns in `contamination-filter.ts`, the 3 severity levels, and specifically trace how the V8 rule causes `CONTAMINATION_GATE_ABORT`. Understand exactly how cross-phase references (e.g., "Phase 015") trigger V8 and what the allowlist mechanism permits.

## Findings

### 1. Denylist Is 47 Patterns, Not 99

The `DEFAULT_DENYLIST` array in `contamination-filter.ts` (lines 31-99) contains exactly **47 DenylistEntry objects**, not 99. The "99" in the line count refers to the closing `] as const;` on line 99, not the pattern count. Each entry is a `{ label, pattern, severity }` object.

[SOURCE: contamination-filter.ts:31-99]

### 2. Three Severity Levels with Numeric Ranking

The `ContaminationSeverity` type (line 17) defines exactly three levels: `'low' | 'medium' | 'high'`. The ranking map (line 143) assigns: `low: 0, medium: 1, high: 2`.

```typescript
const SEVERITY_RANK: Record<ContaminationSeverity, number> = { low: 0, medium: 1, high: 2 };
```

The `maxSeverityOf()` function (lines 145-148) tracks the worst severity seen across all matched patterns. The `FilterResult.maxSeverity` field reports this aggregate.

[SOURCE: contamination-filter.ts:17, 143-148]

### 3. Complete Denylist Pattern Catalog by Category

**Orchestration chatter (4 patterns, medium severity):**
- `step-by-step orchestration` — `/\bI'll execute this step by step\b/gi` (line 33)
- `analysis preamble` — `/\bLet me analyze (?:this|the|your)\b/gi` (line 34)
- `progress narration` — `/\bI'll now\b/gi` (line 35)
- `step narration` — `/^(?:\s*)Step\s+\d+:\s+(?:I'll|Let me|I need to|I will)\b/gim` (line 37, F-11 tightened)

**Preamble phrases (8 patterns, low severity):**
- `check preamble` — `/\bLet me check\b/gi` (line 39)
- `start-by preamble` — `/\bI'll start by\b/gi` (line 40)
- `start preamble` — `/\bLet me start\b/gi` (line 41)
- `read preamble` — `/\bLet me read\b/gi` (line 42)
- `look-into preamble` — `/\bLet me look (?:at|into) (?:this|the|that)\b/gi` (line 43)
- `begin preamble` — `/\bI'll begin\b/gi` (line 44)
- `proceed preamble` — `/\bI'll proceed\b/gi` (line 45)
- `handle preamble` — `/\bI'll handle\b/gi` (line 46)
- `will-now preamble` — `/\bI will now\b/gi` (line 47)

*(Note: 9 patterns in this group, though the 9th `will-now` is listed right after `handle`.)*

**Orchestration headings/transitions (5 patterns, mixed severity):**
- `analysis heading` — medium (line 49)
- `review heading` — medium (line 50)
- `transition phrase` — low (line 51)
- `close-reading transition` — medium (line 52)
- `first-step narration` — medium (line 53)
- `now-step narration` — medium (line 54)
- `next-step narration` — medium (line 55)

**AI self-referencing (3 patterns, high severity):**
- `ai self-reference` — `/\bAs an AI\b/gi` (line 57)
- `language-model self-reference` — `/\bAs a language model\b/gi` (line 58)
- `assistant self-reference` — `/\bAs your assistant\b/gi` (line 59)

**Filler phrases (3 patterns, low severity):**
- `generic affirmation` — `/\bOf course!\b/gi` (line 61)
- `sure filler` — `/\bSure!\s/gi` (line 62)
- `absolute filler` — `/\bAbsolutely!\s/gi` (line 63)

**Tool scaffolding (4 patterns, high severity):**
- `tool usage narration` — `/\bI'll use the \w+ tool\b/gi` (line 65)
- `tool usage narration active` — `/\bUsing the \w+ tool\b/gi` (line 66)
- `tool usage preamble` — `/\bLet me use the \w+ tool\b/gi` (line 67)
- `tool title with path` — `/\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+tool\s+(?:on\s+)?[\/\.][^\s]+/gi` (line 69, F-10)

**API/service error leakage (3 patterns, high severity):**
- `api error prefix` — `/\bAPI\s+Error:\s*\d{3}\b/gi` (line 71)
- `json error payload` — matches `{"type":"error"...}` patterns (line 72)
- `request id leak` — matches `"request_id":"req_..."` patterns (line 73)

**Hedging phrases (5 patterns, low severity, T017):**
- `hedging i-think` — with negative lookahead for productive phrases (line 75)
- `hedging it-seems` (line 76)
- `hedging perhaps` — with lookahead for pronoun subjects (line 77)
- `hedging might-be` (line 78)
- `hedging could-be` (line 79)

**Conversational fillers (1 pattern, low severity, T018):**
- `certainly filler` — `/\bCertainly!\s/gi` (line 81)

**Meta-commentary (2 patterns, T019):**
- `ai should-note meta` — high severity (line 83)
- `ai worth-noting meta` — medium severity (line 84)

**Instruction echoing (1 pattern, medium severity, T020):**
- `instruction echo please` — matches `Please provide/list/explain...` lines ending with colon (line 86)

**Markdown artifacts (2 patterns, medium severity, T021):**
- `orphaned markdown header` — `/^#{1,6}\s*$/gm` (line 88)
- `stray backtick block` — `/^```\s*$/gm` (line 89)

**Safety disclaimers (3 patterns, high severity, T022):**
- `safety cannot disclaimer` — with negative lookahead for legitimate debugging verbs (line 91)
- `safety i-cannot disclaimer` — matches "I cannot provide/assist/help..." (line 92)
- `safety please-consult disclaimer` — `/\bPlease consult\b/gi` (line 93)

**Redundant certainty markers (4 patterns, low severity, T023):**
- `certainty important-note marker` (line 95)
- `certainty worth-mentioning marker` (line 96)
- `certainty keep-in-mind marker` (line 97)
- `certainty redundant-assurance marker` (line 98)

### 4. Severity Distribution Summary

| Severity | Count | Role |
|----------|-------|------|
| **high** | 14 patterns | Hard blockers: AI self-reference, tool scaffolding, API leaks, safety disclaimers, meta-commentary |
| **medium** | 12 patterns | Moderate noise: orchestration chatter, headings, instruction echoing, markdown artifacts |
| **low** | 21 patterns | Soft noise: preambles, hedging, fillers, certainty markers |

### 5. Dynamic Severity Downgrade (Source Capabilities)

`getDenylistSeverity()` (lines 130-141) contains a special case: when `sourceCapabilities.toolTitleWithPathExpected` is true, the `tool title with path` pattern is downgraded from `high` to `low`. This accounts for certain capture sources (like Codex CLI) that naturally include tool path references.

[SOURCE: contamination-filter.ts:130-141]

### 6. V8 Rule Is NOT in contamination-filter.ts — It Is in validate-memory-quality.ts

The V8 rule is a **post-render validation rule**, not a denylist pattern. It lives in `validate-memory-quality.ts` starting at line 101 with metadata:

```typescript
V8: {
  ruleId: 'V8',
  severity: 'high',
  blockOnWrite: true,
  blockOnIndex: true,
  appliesToSources: 'all',
  reason: 'Foreign-spec contamination would corrupt both the saved memory and the semantic index.',
}
```

[SOURCE: validate-memory-quality.ts:101-108]

The actual V8 check logic spans lines 702-775. It works by:

1. **Extract current spec ID** from frontmatter `spec_folder` field (line 702)
2. **Build allowlist** via `extractAllowedSpecIds()` (line 706), which includes:
   - All `\b\d{3}-[a-z0-9][a-z0-9-]*\b` matches from the spec folder path itself (self + ancestors)
   - Child directories that have a `spec.md` file (lines 534-554)
   - IDs from `related_specs` in the spec's `spec.md` (lines 710-734)
3. **Count foreign spec IDs** in the body content using `SPEC_ID_REGEX` (line 193: `/\b\d{3}-[a-z0-9][a-z0-9-]*\b/g`)
4. **Detect two failure modes:**
   - `dominatesForeignSpec`: A single foreign spec has >= 3 mentions AND >= (currentSpecMentions + 2) (line 760)
   - `scatteredForeignSpec`: Two or more distinct foreign specs each with <= 2 mentions AND total foreign >= 2 (line 761)
5. **Check frontmatter contamination**: Foreign spec IDs in trigger_phrases or key_topics (lines 738-741)

[SOURCE: validate-memory-quality.ts:702-775]

### 7. How Cross-Phase References Trigger V8

A reference like "Phase 015" does NOT itself trigger V8 — but a reference like `015-runtime-contract` (which matches `SPEC_ID_REGEX`) **does trigger V8** if `015-runtime-contract` is not in the allowlist.

The allowlist construction at `extractAllowedSpecIds()` (lines 524-555) only adds:
- Spec IDs extracted from the `specFolder` path string (e.g., `023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline` yields `{023-hybrid-rag-fusion-refinement, 012-memory-save-quality-pipeline}`)
- Child directories of the resolved spec folder that contain `spec.md`
- IDs from the `related_specs` field in the spec folder's `spec.md`

So if a memory for spec `012-memory-save-quality-pipeline` references `015-runtime-contract` in its body, and `015-runtime-contract` is:
- NOT a child folder of `012-memory-save-quality-pipeline`
- NOT listed in `related_specs` of `012-memory-save-quality-pipeline/spec.md`
- NOT an ancestor in the spec path

Then it IS a foreign spec and counts toward V8 failure.

If the content mentions `015-runtime-contract` 3+ times and the current spec's own ID appears fewer than (3-2)=1 times, the `dominatesForeignSpec` condition triggers. Alternatively, if both `015-runtime-contract` and `016-json-mode-hybrid-enrichment` are mentioned (each 1-2 times, total >= 2), `scatteredForeignSpec` triggers.

[SOURCE: validate-memory-quality.ts:524-555, 745-761]

### 8. CONTAMINATION_GATE_ABORT in workflow.ts

The CONTAMINATION_GATE_ABORT is raised in `workflow.ts` at lines 1567-1570:

```typescript
const failedContaminationRules = validationDisposition.blockingRuleIds.filter(
  (ruleId) => ruleId === 'V8' || ruleId === 'V9'
);
// if any V8 or V9 failures exist:
const contaminationAbortMsg = `CONTAMINATION_GATE_ABORT: Critical contamination rules failed: [${failedContaminationRules.join(', ')}]. ` +
  `Content contains cross-spec contamination that would corrupt the memory index. Aborting write.`;
```

This fires AFTER the full `validateMemoryQualityContent()` check, inside the `determineValidationDisposition()` flow. Since V8 has `blockOnWrite: true`, any V8 failure produces `disposition: 'abort_write'`, and the workflow checks specifically for V8/V9 in the blocking rules to emit the CONTAMINATION_GATE_ABORT message.

[SOURCE: workflow.ts:1567-1570, validate-memory-quality.ts:588-599]

### 9. Pre-Render Alignment Block (Separate from V8)

There is also a PRE-render cross-spec check at workflow.ts lines 650-672. This `ALIGNMENT_BLOCK` checks whether captured file paths relate to the spec folder BEFORE rendering. It fires when < 15% of captured file paths match the spec folder's alignment targets. This is distinct from V8, which checks the RENDERED markdown content.

[SOURCE: workflow.ts:650-672]

### 10. V8 Allowlist Fallback for Missing spec_folder

When the memory file lacks a `spec_folder` frontmatter field, `validate-memory-quality.ts` (lines 627-638) falls back to extracting the spec folder from the file path. Without this fallback, V8 sees `currentSpec` as unknown and treats ALL cross-references as foreign contamination. This was a critical bug fix.

[SOURCE: validate-memory-quality.ts:627-638]

## Ruled Out

- Searching for "99 denylist patterns" — the actual count is 47 DenylistEntry objects across lines 31-99 of the file.
- Looking for V8 in contamination-filter.ts — V8 is a validation rule in validate-memory-quality.ts, not a denylist pattern.

## Dead Ends

None. The contamination system is well-documented in code and the architecture split between pre-render filtering (contamination-filter.ts) and post-render validation (V8 in validate-memory-quality.ts) is clear.

## Sources Consulted

- `contamination-filter.ts:1-225` — Full file read, all 47 denylist patterns
- `validate-memory-quality.ts:90-157` — V8 rule metadata and all 14 rule definitions
- `validate-memory-quality.ts:524-555` — `extractAllowedSpecIds()` function (allowlist builder)
- `validate-memory-quality.ts:624-775` — `validateMemoryQualityContent()` V8 check logic
- `workflow.ts:650-672` — Pre-render `ALIGNMENT_BLOCK` for cross-spec file paths
- `workflow.ts:1567-1570` — `CONTAMINATION_GATE_ABORT` emission point

## Assessment

- New information ratio: 1.0
- Questions addressed: ["How can V8 contamination filter distinguish same-parent phase refs from genuine cross-spec contamination?"]
- Questions answered: ["How can V8 contamination filter distinguish same-parent phase refs from genuine cross-spec contamination?"]

## Reflection

- What worked and why: Direct deep-read of both contamination-filter.ts and validate-memory-quality.ts revealed that V8 is architecturally separate from the denylist filter. Grep for V8 across the scripts directory was the critical first step — it immediately showed the split between the two modules.
- What did not work and why: Initial assumption that V8 was a denylist pattern in contamination-filter.ts was wrong. The "contamination" naming is shared across two different systems (text-level denylist filtering vs post-render spec-ID validation).
- What I would do differently: For cross-cutting concerns like "contamination," always grep the label first to find ALL code locations before deep-reading any single file.

## Recommended Next Focus

Deep-read `template-renderer.ts` and the Mustache template. Document how empty data produces boilerplate, where "Session focused on implementing and testing features" comes from, and how OBSERVATION blocks are populated.
