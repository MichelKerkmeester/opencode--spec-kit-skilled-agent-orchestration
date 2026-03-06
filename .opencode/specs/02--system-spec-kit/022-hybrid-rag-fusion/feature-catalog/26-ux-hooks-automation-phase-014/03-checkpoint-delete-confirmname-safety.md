# Checkpoint delete confirmName safety

## Current Reality

Checkpoint deletion now requires a matching `confirmName` safety parameter before destructive action proceeds. The finalized follow-up pass enforced that requirement across handler, schema, tool-schema, and tool-type layers so callers cannot bypass it through a looser boundary. Successful deletion responses also report the confirmation outcome through `safetyConfirmationUsed=true` plus deletion metadata.

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Checkpoint delete confirmName safety
- Current reality source: feature_catalog.md
