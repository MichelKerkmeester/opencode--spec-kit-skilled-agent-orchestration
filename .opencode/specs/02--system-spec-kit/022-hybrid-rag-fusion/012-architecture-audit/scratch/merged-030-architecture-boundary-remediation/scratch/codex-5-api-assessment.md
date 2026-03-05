# Codex-5 API Surface Assessment (T033)

Date: 2026-03-05
Scope reviewed: `.opencode/skill/system-spec-kit/mcp_server/api/`

## Surface Inventory
- `index.ts`: barrel that re-exports `eval`, `search`, and `providers` modules.
- `eval.ts`: re-exports ablation/baseline runners, reporting helpers, eval DB bootstrap, and ground-truth loader from `lib/eval/*`.
- `search.ts`: re-exports hybrid search API, FTS helpers, and a full `vectorIndex` namespace from `lib/search/*`.
- `providers.ts`: re-exports `generateQueryEmbedding` from `lib/providers/embeddings`.
- `README.md`: documents boundary intent and import-policy expectations.

## Boundary Health Assessment
- Positive: API folder exists as an explicit boundary and keeps external callers off raw `lib/*` paths.
- Positive: Barrel pattern is clear and small, so consumer discovery is straightforward.
- Positive: Type exports are included for key search/eval paths, reducing redefinition drift.
- Risk: Most exports are direct passthroughs; internal signature changes still become external breaking changes immediately.
- Risk: `export * as vectorIndex` exposes a broad mutable internal namespace, increasing blast radius.
- Risk: No explicit compatibility contract tests/snapshots were found in `api/` itself.

## Architectural Notes
- The current design is a path-stability boundary, not a behavior-stability boundary.
- This is a useful intermediate state for remediation, but it does not yet enforce strict API contracts.
- `README.md` policy is strong, but technical enforcement depends on external tooling and reviewer discipline.

## Recommendations
1. Replace namespace export (`vectorIndex`) with a curated explicit export list to narrow public surface.
2. Add API contract tests that fail on removed/renamed exports.
3. Add versioned API changelog notes for `api/` to make boundary changes auditable.
4. Introduce thin adapter functions for high-risk exports where internal refactors are expected.

## Overall Verdict
- API boundary direction is correct and materially better than direct `lib/*` imports.
- Main remaining gap is contract hardening (explicit, tested, and versioned surface), especially around broad re-exports.
