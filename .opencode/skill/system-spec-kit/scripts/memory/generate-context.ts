// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow

// Node stdlib
import * as path from 'path';
import * as fsSync from 'fs';

// Internal modules
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import {
  CONFIG,
  findActiveSpecsDir,
  getSpecsDirectories,
  SPEC_FOLDER_PATTERN,
  SPEC_FOLDER_BASIC_PATTERN,
  CATEGORY_FOLDER_PATTERN,
  findChildFolderSync,
} from '../core';
import { runWorkflow } from '../core/workflow';
import { loadCollectedData } from '../loaders';
import { collectSessionData } from '../extractors/collect-session-data';

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES
// ───────────────────────────────────────────────────────────────
/** Result of validating a requested spec folder reference. */
export interface SpecFolderValidation {
  valid: boolean;
  reason?: string;
  warning?: string;
}

// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           Either a JSON data file path OR a spec folder path
                    - JSON mode: node generate-context.js data.json [spec-folder]
                    - Direct mode: node generate-context.js specs/001-feature/
                    - Direct mode: node generate-context.js .opencode/specs/001-feature/

Options:
  --help, -h        Show this help message

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  node generate-context.js specs/001-feature/
  node generate-context.js .opencode/specs/001-feature/

Subfolder examples:
  node generate-context.js 003-parent/121-child
  node generate-context.js 121-child          (auto-searches all parents)
  node generate-context.js specs/003-parent/121-child

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight support):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

// 2.1 SIGNAL HANDLERS
process.on('SIGTERM', () => {
  console.log('\nWarning: Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nWarning: Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
});

// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput: string): boolean {
  return validateFilePath(path.resolve(CONFIG.PROJECT_ROOT, normalizedInput), getSpecsDirectories()) !== null;
}

function isValidSpecFolder(folderPath: string): SpecFolderValidation {
  const folderName = path.basename(folderPath);

  // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
  const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
  // Extract the trailing portion that might be "parent/child"
  const trailingSegments = normalizedInput.split('/');
  // Check if the last two segments both match the spec folder pattern
  if (trailingSegments.length >= 2) {
    const lastTwo = trailingSegments.slice(-2);
    if (SPEC_FOLDER_PATTERN.test(lastTwo[0]) && SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
      // Both segments are valid spec folder names — valid nested spec folder
      const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

      if (!hasSpecsParent) {
        // Fallback: check if the path resolves to an existing directory under any specs root
        for (const specsDir of getSpecsDirectories()) {
          const candidate = path.join(specsDir, normalizedInput);
          if (
            !path.isAbsolute(normalizedInput) &&
            fsSync.existsSync(candidate) &&
            validateFilePath(candidate, getSpecsDirectories()) !== null
          ) {
            return { valid: true };
          }
        }
        return {
          valid: false,
          reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
      }
      return { valid: true };
    }
  }

  if (!SPEC_FOLDER_PATTERN.test(folderName)) {
    if (/^\d{3}-/.test(folderName)) {
      if (/[A-Z]/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should be lowercase' };
      }
      if (/_/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
      }
      if (!/^[a-z]/.test(folderName.slice(4))) {
        return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
      }
    }
    return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
  }

  const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

  if (!hasSpecsParent) {
    // Fallback: check if bare name can be resolved via recursive child search
    // (findChildFolderSync in validateArguments handles this, so just report the error here)
    return {
      valid: false,
      reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
    };
  }

  return { valid: true };
}

// ───────────────────────────────────────────────────────────────
// 5. CLI ARGUMENT PARSING
// ───────────────────────────────────────────────────────────────
function parseArguments(): void {
  const primaryArg: string | undefined = process.argv[2];
  const secondaryArg: string | undefined = process.argv[3];
  if (!primaryArg) return;

  const folderName = path.basename(primaryArg);
  const explicitProjectScopedPath = !primaryArg.endsWith('.json') && (
    primaryArg.startsWith('specs/') ||
    primaryArg.startsWith('.opencode/specs/')
  )
    ? path.join(CONFIG.PROJECT_ROOT, primaryArg)
    : null;

  // --- Subfolder support: detect nested parent/child spec paths ---
  // Check if arg1 is a nested spec path (e.g., "003-parent/121-child",
  // "specs/003-parent/121-child", ".opencode/specs/003-parent/121-child")
  let resolvedNestedPath: string | null = null;
  if (!primaryArg.endsWith('.json')) {
    if (path.isAbsolute(primaryArg)) {
      const absoluteSegments = primaryArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
      const lastSegment = absoluteSegments.at(-1);
      const parentSegment = absoluteSegments.at(-2);

      if (
        (lastSegment && SPEC_FOLDER_PATTERN.test(lastSegment)) ||
        (parentSegment && lastSegment && SPEC_FOLDER_PATTERN.test(parentSegment) && SPEC_FOLDER_PATTERN.test(lastSegment))
      ) {
        resolvedNestedPath = primaryArg;
      }
    }

    let cleaned = primaryArg;
    // Strip known prefixes to get the relative portion
    if (cleaned.startsWith('.opencode/specs/')) {
      cleaned = cleaned.slice('.opencode/specs/'.length);
    } else if (cleaned.startsWith('specs/')) {
      cleaned = cleaned.slice('specs/'.length);
    }
    // Remove trailing slashes
    cleaned = cleaned.replace(/\/+$/, '');

    if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
      resolvedNestedPath = explicitProjectScopedPath;
    }

    // Check if cleaned is a multi-segment path (e.g., "parent/child" or "category/parent/child")
    const segments = cleaned.split('/');
    if (!resolvedNestedPath && segments.length >= 2) {
      // Try to resolve the full segment path under known specs directories
      for (const specsDir of getSpecsDirectories()) {
        const candidate = path.join(specsDir, ...segments);
        if (fsSync.existsSync(candidate)) {
          resolvedNestedPath = candidate;
          break;
        }
      }
      // Even if path doesn't exist on disk yet, treat it as a spec folder reference
      // If the last segment looks like a spec folder
      if (!resolvedNestedPath && SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])) {
        const activeDir = findActiveSpecsDir();
        if (activeDir) {
          resolvedNestedPath = path.join(activeDir, ...segments);
        }
      }
    }
  }

  if (resolvedNestedPath) {
    CONFIG.SPEC_FOLDER_ARG = resolvedNestedPath;
    CONFIG.DATA_FILE = null;
    console.log('   Stateless mode: Nested spec folder provided directly');
    return;
  }

  const isSpecFolderPath: boolean = (
    primaryArg.startsWith('specs/') ||
    primaryArg.startsWith('.opencode/specs/') ||
    SPEC_FOLDER_BASIC_PATTERN.test(folderName)
  ) && !primaryArg.endsWith('.json');

  if (isSpecFolderPath) {
    CONFIG.SPEC_FOLDER_ARG = primaryArg;
    CONFIG.DATA_FILE = null;
    console.log('   Stateless mode: Spec folder provided directly');
  } else {
    CONFIG.DATA_FILE = primaryArg;
    CONFIG.SPEC_FOLDER_ARG = secondaryArg || null;
  }
}

function validateArguments(): void {
  if (!CONFIG.SPEC_FOLDER_ARG) return;

  const validation = isValidSpecFolder(CONFIG.SPEC_FOLDER_ARG);

  if (validation.warning) {
    console.warn(`   Warning: ${validation.warning}`);
  }

  if (validation.valid) return;

  // --- Subfolder support: before failing, try to find the folder as a child ---
  const inputBaseName = path.basename(CONFIG.SPEC_FOLDER_ARG);
  if (SPEC_FOLDER_PATTERN.test(inputBaseName)) {
    // Input looks like a valid spec folder name but wasn't found at top level.
    // Try finding it as a child folder inside any parent.
    const resolved = findChildFolderSync(inputBaseName);
    if (resolved) {
      console.log(`   Resolved child folder "${inputBaseName}" → ${resolved}`);
      CONFIG.SPEC_FOLDER_ARG = resolved;
      return;
    }
    // FindChildFolder logs its own error for ambiguous matches
  }

  console.error(`\nError: Invalid spec folder format: ${CONFIG.SPEC_FOLDER_ARG}`);
  console.error(`   Reason: ${validation.reason}`);
  console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

  const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  if (fsSync.existsSync(specsDir)) {
    try {
      const available = fsSync.readdirSync(specsDir);
      const matches = available.filter((n) => n.includes(path.basename(CONFIG.SPEC_FOLDER_ARG!)) && SPEC_FOLDER_PATTERN.test(n));

      if (matches.length > 0) {
        console.error('Did you mean:');
        matches.forEach((m) => console.error(`  - ${m}`));
      } else {
        // --- Subfolder support: multi-level deep scan as fallback ---
        let deepMatches: string[] = [];
        const targetBase = path.basename(CONFIG.SPEC_FOLDER_ARG!);

        for (const topEntry of available) {
          const isSpec = SPEC_FOLDER_PATTERN.test(topEntry);
          const isCategory = CATEGORY_FOLDER_PATTERN.test(topEntry);
          if (!isSpec && !isCategory) continue;
          const topPath = path.join(specsDir, topEntry);
          try {
            if (!fsSync.statSync(topPath).isDirectory()) continue;
            const topChildren = fsSync.readdirSync(topPath);
            // Search direct children of spec/category folders
            const childMatches = topChildren.filter(
              (c) => c.includes(targetBase) && SPEC_FOLDER_PATTERN.test(c)
            );
            for (const child of childMatches) {
              deepMatches.push(`${topEntry}/${child}`);
            }
            // For category folders, also search grandchildren (category/parent/child)
            if (isCategory) {
              for (const midEntry of topChildren) {
                if (!SPEC_FOLDER_PATTERN.test(midEntry)) continue;
                const midPath = path.join(topPath, midEntry);
                try {
                  if (!fsSync.statSync(midPath).isDirectory()) continue;
                  const grandChildren = fsSync.readdirSync(midPath);
                  const gcMatches = grandChildren.filter(
                    (c) => c.includes(targetBase) && SPEC_FOLDER_PATTERN.test(c)
                  );
                  for (const gc of gcMatches) {
                    deepMatches.push(`${topEntry}/${midEntry}/${gc}`);
                  }
                } catch (_error: unknown) {
                  if (_error instanceof Error) {
                    /* skip unreadable dirs */
                  }
                }
              }
            }
          } catch (_error: unknown) {
            if (_error instanceof Error) {
              /* skip unreadable dirs */
            }
          }
        }

        if (deepMatches.length > 0) {
          console.error('Did you mean (in subfolders):');
          deepMatches.forEach((m) => console.error(`  - ${m}`));
        } else {
          const allSpecs = available.filter((n) => SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
                                    .sort().reverse().slice(0, 5);
          if (allSpecs.length) {
            console.error('Available spec folders:');
            allSpecs.forEach((f) => console.error(`  - ${f}`));
          }
        }
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('[generate-context] Failed to list spec folders:', errMsg);
    }
  }
  console.error('\nUsage: node generate-context.js <data-file> [spec-folder-name]\n');
  process.exit(1);
}

// ───────────────────────────────────────────────────────────────
// 6. MAIN ENTRY POINT
// ───────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('Starting memory skill...\n');

  try {
    parseArguments();
    validateArguments();

    await runWorkflow({
      dataFile: CONFIG.DATA_FILE ?? undefined,
      specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined,
      loadDataFn: loadCollectedData,
      collectSessionDataFn: collectSessionData,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected/.test(errMsg);

    if (isExpected) {
      console.error(`\nError: ${errMsg}`);
    } else {
      console.error('Unexpected Error:', errMsg);
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

// ───────────────────────────────────────────────────────────────
// 7. EXPORTS
// ───────────────────────────────────────────────────────────────
if (require.main === module) {
  main().catch((error: unknown) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Fatal error: ${errMsg}`);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  });
}

export {
  main,
  parseArguments,
  validateArguments,
  isValidSpecFolder,
};
