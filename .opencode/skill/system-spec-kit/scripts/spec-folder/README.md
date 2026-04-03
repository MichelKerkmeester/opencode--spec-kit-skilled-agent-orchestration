---
title: "Spec Folder Utilities"
description: "TypeScript modules for spec folder detection and alignment validation."
trigger_phrases:
  - "spec folder detection"
  - "alignment validation"
  - "folder utilities"
---

# Spec Folder Utilities

> TypeScript modules for spec folder detection and alignment validation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. TROUBLESHOOTING](#4--troubleshooting)
- [5. RELATED DOCUMENTS](#5--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What are Spec Folder Utilities?

The `scripts/spec-folder/` directory contains TypeScript modules that handle intelligent spec folder detection, alignment validation, and packet-local changelog generation. These utilities ensure memory context is saved to the correct spec folder and that completion workflows can write consistent nested changelogs for root specs or phase children.

### Key Features

| Feature                     | Description                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **Smart Detection**         | Auto-detect appropriate spec folder when no explicit CLI target is supplied          |
| **Alignment Validation**    | Calculate alignment scores between conversation topics and spec folder names        |
| **Archive Filtering**       | Automatically exclude archived folders (z_, archive, old patterns)                  |
| **Multi-Directory Support** | Handle both `specs/` and `.opencode/specs/` locations                               |
| **Topic Extraction**        | Extract keywords from conversation context and observations                         |
| **CLI Authority**           | Respect explicit CLI spec-folder targets without rerouting to session-learning picks |
| **Phase Save Support**      | Preserve explicit phase-folder memory-save targets and write into the selected phase folder |
| **Description Generation** | Generate per-folder `description.json` with identity + memory tracking metadata |
| **Nested Changelog Output** | Generate canonical packet-local changelogs for root specs and phase child folders |

### Requirements

| Requirement | Minimum | Details                                                 |
| ----------- | ------- | ------------------------------------------------------- |
| Node.js     | 18+     | TypeScript support and async/await                      |
| npm         | 8+      | Package manager                                         |
| TypeScript  | 5.9+    | Source files are TypeScript, compiled output in `dist/` |

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

### Using in Memory Save Workflow

```typescript
// Within scripts workspace (relative import)
import { detectSpecFolder, validateContentAlignment } from '../spec-folder';

// Auto-detect spec folder from conversation context
const specFolder = await detectSpecFolder(collectedData);

// Explicit CLI targets stay authoritative when CONFIG.SPEC_FOLDER_ARG is set
// Session-learning and alignment may log alternatives, but they do not reroute the save
// Phase-folder targets are also preserved as explicit save destinations

// Validate alignment between conversation and folder
const alignment = await validateContentAlignment(
  collectedData,
  '042-feature-name',
  '/path/to/specs'
);

console.log(`Alignment score: ${alignment.score}%`);
```

### Standalone Usage

```typescript
// Within scripts workspace (relative import)
import {
  filterArchiveFolders,
  setupContextDirectory,
  buildNestedChangelogData,
} from '../spec-folder';

// Filter out archived folders
const activeFolders = filterArchiveFolders([
  '042-feature',
  'z_old-feature',
  '043-new-feature'
]);
// Returns: ['042-feature', '043-new-feature']

// Setup memory directory
await setupContextDirectory('specs/<###-feature-name>');
// Creates: specs/<###-feature-name>/memory/

const nestedChangelog = buildNestedChangelogData(
  '.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation',
  { mode: 'auto', outputPath: null }
);
// nestedChangelog.outputPath -> ".opencode/specs/.../024-compact-code-graph/changelog/changelog-024-029-review-remediation.md"
```

### Topic Extraction

```typescript
// Within scripts workspace (relative import)
import { extractConversationTopics } from '../spec-folder';

const topics = extractConversationTopics({
  recent_context: [{
    request: 'Fix authentication issues in login flow'
  }],
  observations: [
    { title: 'Auth token validation error' }
  ]
});
// Returns: ['authentication', 'login', 'flow', 'auth', 'token', 'validation', 'error']
```

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
scripts/spec-folder/
├── index.ts                     # Module exports and public API (source)
├── folder-detector.ts           # Spec folder detection logic (source)
├── alignment-validator.ts       # Topic alignment scoring (source)
├── directory-setup.ts           # Directory creation and validation (source)
├── generate-description.ts     # Per-folder description.json generator (source)
├── nested-changelog.ts         # Root/phase nested changelog generator + CLI (source)
└── README.md                    # This file

Compiled output (generated by tsc --build):
scripts/dist/spec-folder/
├── index.js                     # Compiled module
├── index.d.ts                   # TypeScript definitions
├── folder-detector.js
├── folder-detector.d.ts
├── alignment-validator.js
├── alignment-validator.d.ts
├── directory-setup.js
├── directory-setup.d.ts
├── generate-description.js
├── generate-description.d.ts
├── nested-changelog.js
└── nested-changelog.d.ts
```

### Key Files

| File                     | Purpose                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `index.ts`               | Central export point for all spec-folder utilities                                  |
| `folder-detector.ts`     | Detects appropriate spec folder from CLI args, prompts or context analysis          |
| `alignment-validator.ts` | Validates alignment between conversation topics and folder names. Calculates scores |
| `directory-setup.ts`     | Creates and validates `memory/` directory within spec folders                       |
| `generate-description.ts` | Generates per-folder `description.json` with specId, folderSlug, parentChain, and memory tracking fields |
| `nested-changelog.ts`    | Builds packet-local changelog payloads and can render or write root/phase changelog files |

<!-- /ANCHOR:structure -->

---

## 4. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Spec folder detection fails

**Symptom**: `Error: Spec folder not found: 042-feature`

**Cause**: Spec folder doesn't exist or path format is incorrect

**Solution**:
```bash
# Check available spec folders
ls -la specs/

# Use structured JSON for routine saves
node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
# Direct positional mode is no longer supported; use structured JSON instead
node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
```

#### Alignment score is low despite correct folder

**Symptom**: Script suggests alternative folder when current is correct

**Cause**: Conversation topics don't match folder name keywords

**Solution**: Manually confirm correct folder when prompted or use an explicit CLI argument:
```bash
# Explicit CLI target is authoritative and is not rerouted
node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/

# Non-phase nested child paths stay authoritative
node scripts/dist/memory/generate-context.js 003-parent/001-child

# Phase-folder paths stay authoritative and save into that selected phase folder
node scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
```

#### Multiple specs directories warning

**Symptom**: `Multiple specs directories found`

**Cause**: Both `specs/` and `.opencode/specs/` exist

**Solution**: This is informational. The script uses priority order (specs/ first):
```javascript
// Priority order:
// 1. specs/ (if exists)
// 2. .opencode/specs/ (fallback)
```

### Quick Fixes

| Problem                        | Quick Fix                                       |
| ------------------------------ | ----------------------------------------------- |
| Module not found               | `npm install` in project root                   |
| Permission denied on memory/   | `chmod 755 specs/<###-feature-name>`                   |
| Archive pattern false positive | Rename folder without z_, archive, old patterns |
| Wrong folder selected          | Pass the exact CLI target; explicit args are authoritative |
| Need phase-folder memory save  | Pass the exact phase-folder CLI target; memory writes stay in that selected phase folder |

### Diagnostic Commands

```bash
# Check available specs directories
ls -la specs/ .opencode/specs/

# Check compiled output
ls -la scripts/dist/spec-folder/

# Rebuild TypeScript files if needed
npx tsc -b .opencode/skill/system-spec-kit/scripts/tsconfig.json

# Generate a nested changelog preview
node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js .opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation

# Test with actual generate-context script (which uses these utilities)
node scripts/dist/memory/generate-context.js --help
```

<!-- /ANCHOR:troubleshooting -->

---

## 5. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document                                                                                   | Purpose                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| [system-spec-kit/SKILL.md](../../SKILL.md)                                                 | Parent skill documentation                        |
| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
| [references/memory/save_workflow.md](../../references/memory/save_workflow.md)             | Memory save workflow reference                    |
| [references/structure/folder_structure.md](../../references/structure/folder_structure.md) | Spec folder structure reference                   |

### External Resources

| Resource                                                          | Description                          |
| ----------------------------------------------------------------- | ------------------------------------ |
| [Node.js File System](https://nodejs.org/api/fs.html)             | Node.js fs/promises API              |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/)       | TypeScript documentation             |
| [Node.js ES Modules](https://nodejs.org/api/esm.html)             | ES modules system reference          |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.1 | Last updated: 2026-02-07 | Migrated to TypeScript with dist/ output*
