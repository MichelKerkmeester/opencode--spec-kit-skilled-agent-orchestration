# Recommendation

## Recommended Architecture

Move canonical session narrative into spec-kit docs and reduce memory to a thin continuity + metadata layer.

## Why

- The current narrative memory documents overlap heavily with `implementation-summary.md`, `decision-record.md`, `tasks.md`, and `handover.md`.
- Memory retrieval is genuinely helpful for session-shaped resume queries, but the main operational path is too brittle to justify the current heavyweight save model.
- The strongest unique value is machine metadata and continuity hints, not the full narrative document body.

## What Changes

- Stop treating full narrative memory files as the default save artifact.
- Route durable implementation narrative into `implementation-summary.md`.
- Route durable decisions into `decision-record.md`.
- Route session-end continuity into `handover.md`.
- Keep a smaller retrieval substrate only where it adds clear value.

## Phased Rollout

1. Redefine canonical authority and save-routing rules.
2. Replace default memory-save output with a thin continuity artifact or metadata-only record.
3. Rework `/spec_kit:resume` and related agents/commands around the new source-of-truth model.

## Decision Requested From User

Yes or no: should phase 018 implement the recommended architecture?

If yes, choose one:

- `C` = wiki-style spec updates plus thin continuity layer
- `B` = minimal memory only
- `F` = full deprecation after a transition phase

