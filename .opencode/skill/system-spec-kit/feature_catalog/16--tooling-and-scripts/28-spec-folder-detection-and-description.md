---
title: "Spec-Folder Detection and Description Metadata"
description: "Spec-folder detection, alignment validation, memory-directory setup, and description-metadata generation for the session-capturing and save workflow."
---

# Spec-Folder Detection and Description Metadata

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Spec-Folder Detection and Description Metadata is the script surface that decides which spec folder a session belongs to, validates that choice against conversation content, prepares the target memory directory, and maintains the per-folder description metadata used elsewhere in the system.

This audited slice combines interactive and deterministic folder selection, content-alignment safety checks, path-safety enforcement, and the CLI used to generate or refresh per-folder `description.json` metadata.

## 2. CURRENT REALITY

The shipped behavior in this slice currently works as follows:

1. `folder-detector.ts` resolves spec folders through a ranked priority chain rather than a single heuristic. It first honors an explicit CLI argument, then a structured-data `SPEC_FOLDER` value, then recent session-learning rows from SQLite, then git-status evidence, current-working-directory inference, session-activity signals, and finally a full auto-detect ranking across available spec folders.
2. Explicit paths are constrained to approved roots under `specs/` or `.opencode/specs/`, support nested parent/child references, and can recover from multi-segment or basename-only inputs via child-folder search. When an explicit folder is found, alignment is still checked so the workflow can warn about mismatches without overriding the caller's direct selection.
3. Candidate quality scoring downgrades archive, test-fixture, and scratch-like folders before ranking. Auto-detect ranking then layers multiple signals in order: folder quality, git-status count, session-activity boost, effective depth, recently active child count, numeric ID-vector ordering, modification time, and canonical path tiebreakers.
4. Session-learning candidates are read from the `session_learning` table with a 24-hour lookback and recency ranking. Low-confidence ties can trigger interactive confirmation in TTY mode, while non-interactive flows deliberately fall through to later detection priorities instead of making ambiguous guesses.
5. Git-status ranking counts changed files that fall under candidate spec paths, while session-activity ranking uses a structured signal builder that combines matching tool-call paths, git-changed files, and transcript mentions. Both signals are treated as confidence-checked hints rather than unconditional selectors.
6. `alignment-validator.ts` extracts conversation topics from recent requests and early observations, expands that with observation keywords from titles, narratives, and filenames, and then computes word-boundary alignment scores against spec-folder path segments instead of using weaker substring matching.
7. The same validator detects whether the session is primarily `.opencode/` infrastructure work. When enough touched files fall under OpenCode infrastructure paths, it applies a domain-aware bonus only for matching infrastructure-oriented folder names and emits explicit mismatch warnings when the selected folder does not fit the detected subpath.
8. Before content or folder alignment proceeds, telemetry schema/docs drift validation compares interface fields in `retrieval-telemetry.ts` and the telemetry `README.md`. Field-level drift becomes a hard error, which makes this module a gatekeeper for alignment safety and telemetry documentation consistency at the same time.
9. `validateContentAlignment()` is the stricter guard. It can recommend higher-scoring alternative folders, warn on moderate matches, and hard-block non-interactive execution when alignment is critically low or when a 0% infrastructure mismatch would otherwise silently route work into the wrong folder.
10. `validateFolderAlignment()` is the lighter check used when a structured `SPEC_FOLDER` is already present. It still scores alignment, offers better alternatives in interactive mode, and warns on mismatches, but it is more permissive than the content-level gate.
11. `directory-setup.ts` sanitizes the chosen path against configured specs directories, enforces an `NNN-name` leaf-folder format, refuses missing or non-directory targets, and then creates the `memory/` subdirectory with structured error reporting for permission and disk-space failures.
12. `generate-description.ts` is the CLI for per-folder `description.json` creation. It resolves real paths to prevent traversal and prefix-bypass attacks, accepts either an explicit `--description` string or a `spec.md`-derived description path, preserves `memorySequence` and `memoryNameHistory` from existing metadata, and writes the refreshed description through the MCP-server API helpers.
13. `spec-folder/index.ts` is the public barrel for this subsystem. It exports detection, archive filtering, alignment configuration, topic extraction, scoring, telemetry-drift validation, folder-alignment validation, and memory-directory setup as one reusable surface for the rest of the scripts layer.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | Detection/orchestration | Multi-priority spec-folder resolution, candidate ranking, low-confidence handling, and explicit-path recovery |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts` | Validation | Topic extraction, domain-aware alignment scoring, telemetry schema/docs drift checks, and interactive/non-interactive alignment gating |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts` | Filesystem setup | Path sanitization, `NNN-name` enforcement, existence validation, and `memory/` directory creation |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` | CLI | Generates or refreshes per-folder `description.json` metadata from explicit text or `spec.md` content |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/index.ts` | Barrel export | Re-exports the spec-folder detection, validation, and setup API surface |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Spec-Folder Detection and Description Metadata
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit of the spec-folder detection, validation, setup, and description-generation modules
