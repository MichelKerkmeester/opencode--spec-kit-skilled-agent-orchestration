# Mutation response UX payload exposure

## Current Reality

Mutation responses now expose UX payload data produced by post-mutation hooks, including `postMutationHooks` and hint strings. This makes UX guidance available directly in tool responses on successful mutation paths. The finalized follow-up pass also hardened duplicate-save no-op behavior so no false `postMutationHooks` or cache-clearing hints are emitted when caches remain unchanged.

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Mutation response UX payload exposure
- Current reality source: feature_catalog.md
