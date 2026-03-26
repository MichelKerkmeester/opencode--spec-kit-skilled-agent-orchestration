---
title: "Shared script libraries and utilities"
description: "Reusable `scripts/lib` and `scripts/utils` modules that provide shared semantic extraction, capture parsing, validation, path safety, frontmatter handling, and shell helper infrastructure across system-spec-kit tooling."
---

# Shared script libraries and utilities

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

`scripts/lib/` and `scripts/utils/` are the shared helper layers beneath the higher-level CLIs, validators, and memory workflows in system-spec-kit.

The current inventory is broad rather than single-purpose. `scripts/lib/` contains reusable TypeScript and shell helpers such as `anchor-generator.ts`, `ascii-boxes.ts`, `cli-capture-shared.ts`, `content-filter.ts`, `decision-tree-generator.ts`, `embeddings.ts`, `flowchart-generator.ts`, `frontmatter-migration.ts`, `git-branch.sh`, `memory-frontmatter.ts`, `phase-classifier.ts`, `semantic-signal-extractor.ts`, `semantic-summarizer.ts`, `session-activity-signal.ts`, `shell-common.sh`, `simulation-factory.ts`, `template-utils.sh`, `topic-keywords.ts`, `trigger-extractor.ts`, and `validate-memory-quality.ts`. `scripts/utils/` holds the normalization and safety utilities: `data-validator.ts`, `fact-coercion.ts`, `file-helpers.ts`, `index.ts`, `input-normalizer.ts`, `logger.ts`, `memory-frontmatter.ts`, `message-utils.ts`, `path-utils.ts`, `phase-classifier.ts`, `prompt-utils.ts`, `slug-utils.ts`, `source-capabilities.ts`, `spec-affinity.ts`, `task-enrichment.ts`, `template-structure.js`, `tool-detection.ts`, `tool-sanitizer.ts`, `validation-utils.ts`, and `workspace-identity.ts`.

---

## 2. CURRENT REALITY

The `lib/` directory is the reusable implementation layer for content shaping, semantic extraction, quality enforcement, and shell workflow helpers. `anchor-generator.ts` creates stable, semantic anchor IDs, categorizes markdown sections, and can wrap `##` sections with collision-safe anchor tags. `cli-capture-shared.ts` deduplicates transcript parsing helpers across the Claude Code, Codex CLI, Copilot CLI, and Gemini CLI capture loaders by centralizing timestamp parsing, JSONL reads, tool-name normalization, text extraction, session-title building, and tool-argument parsing.

Semantic extraction is centralized in a small cluster of `lib/` modules. `semantic-signal-extractor.ts` is the core script-side adapter over the shared trigger-extraction primitives, combining stopword profiles, n-gram scoring, topic filtering, placeholder detection, and ranked-term generation into one contract for topics, triggers, summaries, or all modes. `trigger-extractor.ts` is the backward-compatible wrapper that exposes the trigger-specific API on top of that extractor. `semantic-summarizer.ts` then uses those helpers plus file-description cleanup and workflow config to classify messages, detect file changes, extract decisions and outcomes, and build implementation-summary style outputs from captured conversation data.

The rest of `lib/` provides policy and compatibility helpers. `validate-memory-quality.ts` is the pure post-render quality gate with explicit validation-rule metadata, write-vs-index dispositions, contamination handling, YAML parsing, and source-aware blocking behavior. `memory-frontmatter.ts` strips markdown noise from titles, rejects legacy generic descriptions and trigger phrases, derives higher-quality descriptions, and regenerates trigger phrases from summary text plus spec-folder tokens. `phase-classifier.ts` groups exchanges into topic clusters and conversation phases such as Research, Planning, Implementation, Debugging, and Verification. The shell helpers keep the Bash workflows thin: `shell-common.sh` provides JSON escaping and repo-root detection, while `template-utils.sh` maps documentation levels to template directories and copies files with level-specific fallback behavior. `embeddings.ts` is intentionally only a re-export shim to the canonical shared embeddings module.

The `utils/` directory is the stable cross-script utility surface. `index.ts` is the barrel export that re-exports the most commonly used logging, path, workspace, affinity, normalization, file, validation, tool, slug, and source-capability helpers. `path-utils.ts` enforces CWE-22-style path safety by rejecting null-byte input and paths outside the allowed repository bases, while `workspace-identity.ts` normalizes equivalent workspace and `.opencode` roots so transcript-derived paths match across CLI runtimes and symlinked layouts.

`input-normalizer.ts` is the largest utility module and acts as the canonical bridge from raw save payloads or captured CLI sessions into the structured session format used downstream. It defines the normalized observation, file, prompt, decision, and capture types; supports multiple data sources; and combines spec-affinity helpers, decision transformation, capture adaptation, and provenance-aware shaping. Around it sit the smaller utility building blocks: `file-helpers.ts` normalizes relative paths and grades description quality, `slug-utils.ts` chooses content-aware memory names and uses atomic filename creation to avoid collisions, `spec-affinity.ts` evaluates whether captured content truly belongs to a target spec folder by matching spec IDs, phrases, keywords, frontmatter, and file paths, `validation-utils.ts` detects leaked placeholders and broken anchors, and `logger.ts` emits structured JSON logs with level-aware routing.

`template-structure.js` is the main direct-runtime JavaScript helper in `utils/`. It resolves level-specific template contracts, phase addendum fragments, anchored-section parsing, and dynamic decision-record structure without requiring TypeScript compilation. `memory-frontmatter.ts` and `phase-classifier.ts` in `utils/` are intentionally thin compatibility re-exports over their `lib/` counterparts, which keeps callers stable while consolidating the canonical implementation in one place.

---

## 3. SOURCE FILES

### Implementation

### Inventory And Structure Docs

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/lib/README.md` | Documentation | Documents the current `lib/` inventory, shell helpers, and compiled-output posture |
| `.opencode/skill/system-spec-kit/scripts/utils/README.md` | Documentation | Documents the `utils/` inventory, security posture, quick-start usage, and compiled/runtime split |
| `.opencode/skill/system-spec-kit/scripts/utils/index.ts` | Utility barrel | Re-exports the main logger, path, normalization, validation, tool, slug, and workspace helpers |

### Key `scripts/lib` Modules

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts` | Markdown helper | Builds semantic anchor IDs and auto-wraps markdown sections with collision-safe anchor tags |
| `.opencode/skill/system-spec-kit/scripts/lib/cli-capture-shared.ts` | Capture helper | Shares transcript parsing and normalization logic across multiple CLI capture loaders |
| `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts` | Semantic extraction core | Produces ranked topics, trigger phrases, and extraction breakdowns from free text |
| `.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts` | Summary helper | Classifies messages, extracts file changes and decisions, and builds implementation summaries |
| `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` | Quality gate | Applies explicit validation rules and disposition logic to rendered memory outputs |
| `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts` | Frontmatter helper | Derives memory descriptions and trigger phrases while removing legacy generic metadata |
| `.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts` | Analysis helper | Clusters exchanges into topic groups and canonical workflow phases |
| `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts` | Compatibility wrapper | Exposes trigger extraction through the semantic-signal core |
| `.opencode/skill/system-spec-kit/scripts/lib/embeddings.ts` | Compatibility wrapper | Re-exports the canonical shared embeddings surface |
| `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh` | Shell helper | Provides JSON escaping and repository-root discovery for Bash workflows |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` | Shell helper | Resolves template directories and copies template files with fallback behavior |

### Key `scripts/utils` Modules

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Normalization core | Converts raw save payloads and CLI captures into the canonical structured session format |
| `.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts` | Security helper | Sanitizes and resolves paths while enforcing allowed-base containment |
| `.opencode/skill/system-spec-kit/scripts/utils/workspace-identity.ts` | Identity helper | Normalizes equivalent workspace roots and `.opencode` anchors across runtime formats |
| `.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts` | Routing helper | Scores whether content actually belongs to a target spec folder |
| `.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts` | File metadata helper | Normalizes relative paths and grades file-description quality |
| `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts` | Naming helper | Produces content-aware memory slugs and guarantees collision-safe filenames |
| `.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts` | Validation helper | Detects leaked placeholders and anchor-structure problems in rendered output |
| `.opencode/skill/system-spec-kit/scripts/utils/logger.ts` | Logging helper | Emits structured JSON logs with level-based routing |
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` | Runtime helper | Resolves template contracts, phase addenda, and anchored section structure without TS build output |
| `.opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts` | Compatibility wrapper | Re-exports canonical memory-frontmatter helpers from `lib/` |
| `.opencode/skill/system-spec-kit/scripts/utils/phase-classifier.ts` | Compatibility wrapper | Re-exports canonical phase-classifier helpers from `lib/` |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Shared script libraries and utilities
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of the shared `scripts/lib/` and `scripts/utils/` inventories plus representative helper-module implementations
