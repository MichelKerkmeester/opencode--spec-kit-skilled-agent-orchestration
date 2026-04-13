# Iteration 23: Safer `deriveStatus()` Conditional Logic

## Focus
Write the exact safer-patch pseudo-code for status derivation so implementation can preserve the existing checklist contract instead of over-claiming completion.

## Findings
1. `deriveStatus()` still does only two things today: honor an explicit override, then return the first non-empty frontmatter `status` from `implementation-summary.md`, `checklist.md`, `tasks.md`, `plan.md`, or `spec.md`; otherwise it falls back to `planned`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510]
2. The existing checklist authority already lives in `check-completion.sh`: only `COMPLETE` means the checklist passes; `P0_INCOMPLETE`, `P1_INCOMPLETE`, `P2_INCOMPLETE`, `PRIORITY_CONTEXT_MISSING`, and `EVIDENCE_MISSING` are all non-complete states. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:204-235]
3. The live corpus still splits the currently `planned` folders this way: `340` total `planned`, `282` with `implementation-summary.md`, `180` with a `COMPLETE` checklist, `39` with no checklist, and `63` with an incomplete or otherwise non-complete checklist. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. The exact safer conditional logic is:

```ts
function deriveStatus(docs: ParsedSpecDoc[], override?: string | null): string {
  if (override?.trim()) return override.trim();

  const frontmatterStatus = selectFirstValue([
    docs.find((doc) => doc.relativePath === 'implementation-summary.md')?.status,
    docs.find((doc) => doc.relativePath === 'checklist.md')?.status,
    docs.find((doc) => doc.relativePath === 'tasks.md')?.status,
    docs.find((doc) => doc.relativePath === 'plan.md')?.status,
    docs.find((doc) => doc.relativePath === 'spec.md')?.status,
  ], '');
  if (frontmatterStatus) return frontmatterStatus;

  const hasImplementationSummary = docs.some((doc) => doc.relativePath === 'implementation-summary.md');
  const checklistDoc = docs.find((doc) => doc.relativePath === 'checklist.md');
  const checklistState = checklistDoc ? evaluateChecklistCompletion(checklistDoc.content) : null;

  if (checklistState === 'COMPLETE') return 'complete';
  if (!checklistDoc && hasImplementationSummary) return 'complete';
  return 'planned';
}
```

5. The one thing this safer patch must not do is mark the `63` checklist-backed but not-complete folders as `complete` merely because `implementation-summary.md` exists beside them. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- An implementation-summary-only fallback with no checklist branch. It hides the exact folders the current completion script still considers not done.

## Dead Ends
- Re-inventing completion semantics with ad-hoc regexes instead of mirroring the current checklist contract.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510`
- `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:204-235`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.18`
- Questions addressed: `CQ-3`
- Questions answered: `CQ-3`

## Reflection
- What worked and why: writing the decision tree directly against the live 180 / 39 / 63 split made the safe branch boundaries obvious.
- What did not work and why: relying on the earlier one-line status fix would have hidden the checklist-backed false positives.
- What I would do differently: pair every “safer patch” conclusion with the exact population it protects before handing implementation off.

## Recommended Next Focus
Close the trigger-cap question by tracing every relevant path and confirming whether enforcement belongs in the parser, schema, or backfill.
