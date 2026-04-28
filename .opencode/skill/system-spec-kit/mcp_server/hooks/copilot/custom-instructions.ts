// ───────────────────────────────────────────────────────────────
// MODULE: Copilot Custom Instructions Writer
// ───────────────────────────────────────────────────────────────
// GitHub Copilot CLI customer hook outputs are ignored for prompt
// mutation, so Spec Kit refreshes a managed block in Copilot's local
// custom-instructions file instead.

import { mkdir, open, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, join } from 'node:path';

export const SPEC_KIT_COPILOT_CONTEXT_BEGIN = '<!-- SPEC-KIT-COPILOT-CONTEXT:BEGIN -->';
export const SPEC_KIT_COPILOT_CONTEXT_END = '<!-- SPEC-KIT-COPILOT-CONTEXT:END -->';

export interface CopilotCustomInstructionsContext {
  readonly startupSurface?: string | null;
  readonly advisorBrief?: string | null;
  readonly generatedAt?: string;
  readonly source?: string;
  readonly workspaceRoot?: string | null;
}

export interface CopilotCustomInstructionsWriteOptions {
  readonly instructionsPath?: string;
  readonly env?: NodeJS.ProcessEnv;
}

export interface CopilotCustomInstructionsWriteResult {
  readonly path: string;
  readonly written: boolean;
  readonly changed: boolean;
  readonly errorMessage?: string;
}

const DEFAULT_SOURCE = 'system-spec-kit copilot custom-instructions writer';
const STARTUP_FALLBACK = 'Startup context unavailable. Call `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` if more context is needed.';
const ADVISOR_FALLBACK = 'No live advisor brief is available for the latest prompt. Use Gate 2 or `skill_advisor.py` if routing is unclear.';
const LOCK_RETRY_DELAY_MS = 25;
const LOCK_RETRY_ATTEMPTS = 40;

function trimManagedText(value: string | null | undefined, fallback: string): string {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (trimmed.length === 0) {
    return fallback;
  }
  return trimmed
    .replaceAll(SPEC_KIT_COPILOT_CONTEXT_BEGIN, '[managed block marker removed]')
    .replaceAll(SPEC_KIT_COPILOT_CONTEXT_END, '[managed block marker removed]');
}

function trimWorkspaceRoot(value: string | null | undefined): string {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : 'unknown';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withFileLock<T>(targetPath: string, action: () => Promise<T>): Promise<T> {
  const lockPath = `${targetPath}.speckit.lock`;
  let handle: Awaited<ReturnType<typeof open>> | null = null;

  for (let attempt = 0; attempt < LOCK_RETRY_ATTEMPTS; attempt += 1) {
    try {
      handle = await open(lockPath, 'wx');
      break;
    } catch (error: unknown) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code !== 'EEXIST') {
        throw error;
      }
      await sleep(LOCK_RETRY_DELAY_MS);
    }
  }

  if (!handle) {
    throw new Error(`Timed out acquiring Copilot custom-instructions lock: ${lockPath}`);
  }

  try {
    return await action();
  } finally {
    await handle.close();
    await unlink(lockPath).catch(() => undefined);
  }
}

async function atomicWriteFile(targetPath: string, content: string): Promise<void> {
  const directory = dirname(targetPath);
  const tempPath = join(
    directory,
    `.${basename(targetPath)}.${process.pid}.${Date.now()}.tmp`,
  );
  await writeFile(tempPath, content, 'utf8');
  await rename(tempPath, targetPath);
}

export function resolveCopilotCustomInstructionsPath(
  options: CopilotCustomInstructionsWriteOptions = {},
): string {
  if (options.instructionsPath) {
    return options.instructionsPath;
  }
  const env = options.env ?? process.env;
  if (env.SPECKIT_COPILOT_INSTRUCTIONS_PATH) {
    return env.SPECKIT_COPILOT_INSTRUCTIONS_PATH;
  }
  return join(env.HOME ?? homedir(), '.copilot', 'copilot-instructions.md');
}

export function renderSpecKitCopilotContextBlock(
  context: CopilotCustomInstructionsContext,
): string {
  const generatedAt = context.generatedAt ?? new Date().toISOString();
  const startupSurface = trimManagedText(context.startupSurface, STARTUP_FALLBACK);
  const advisorBrief = trimManagedText(context.advisorBrief, ADVISOR_FALLBACK);
  const workspaceRoot = trimWorkspaceRoot(context.workspaceRoot);

  return [
    SPEC_KIT_COPILOT_CONTEXT_BEGIN,
    '<!-- This block is managed by Spec Kit Memory. Keep human Copilot instructions outside these markers. -->',
    '# Spec Kit Memory Auto-Generated Context',
    '',
    `Refreshed: ${generatedAt}`,
    `Source: ${context.source ?? DEFAULT_SOURCE}`,
    `Workspace: ${workspaceRoot}`,
    '',
    '## Startup Context',
    startupSurface,
    '',
    '## Active Advisor Brief',
    advisorBrief,
    '',
    '## Freshness Contract',
    '- Copilot CLI reads custom instructions on the next submitted prompt after this file changes.',
    '- This is a file-based workaround; Copilot customer hooks do not currently support prompt mutation.',
    '- Treat this managed block as scoped to the Workspace above; ignore it when the active project differs.',
    SPEC_KIT_COPILOT_CONTEXT_END,
    '',
  ].join('\n');
}

export function mergeSpecKitCopilotContextBlock(
  existingContent: string,
  managedBlock: string,
): string {
  const start = existingContent.indexOf(SPEC_KIT_COPILOT_CONTEXT_BEGIN);
  const end = existingContent.indexOf(SPEC_KIT_COPILOT_CONTEXT_END);
  if (start >= 0 && end > start) {
    const afterEnd = end + SPEC_KIT_COPILOT_CONTEXT_END.length;
    return `${existingContent.slice(0, start)}${managedBlock}${existingContent.slice(afterEnd).replace(/^\s*\n?/, '')}`;
  }

  const prefix = existingContent.trimEnd();
  return prefix.length > 0 ? `${prefix}\n\n${managedBlock}` : managedBlock;
}

export async function writeCopilotCustomInstructions(
  context: CopilotCustomInstructionsContext,
  options: CopilotCustomInstructionsWriteOptions = {},
): Promise<CopilotCustomInstructionsWriteResult> {
  const path = resolveCopilotCustomInstructionsPath(options);
  if ((options.env ?? process.env).SPECKIT_COPILOT_INSTRUCTIONS_DISABLED === '1') {
    return {
      path,
      written: false,
      changed: false,
    };
  }

  try {
    await mkdir(dirname(path), { recursive: true });
    return await withFileLock(path, async () => {
      let existingContent = '';
      try {
        existingContent = await readFile(path, 'utf8');
      } catch (error: unknown) {
        const nodeError = error as NodeJS.ErrnoException;
        if (nodeError.code !== 'ENOENT') {
          throw error;
        }
      }

      const managedBlock = renderSpecKitCopilotContextBlock(context);
      const nextContent = mergeSpecKitCopilotContextBlock(existingContent, managedBlock);
      if (nextContent === existingContent) {
        return {
          path,
          written: true,
          changed: false,
        };
      }

      await atomicWriteFile(path, nextContent);
      return {
        path,
        written: true,
        changed: true,
      };
    });
  } catch (error: unknown) {
    return {
      path,
      written: false,
      changed: false,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}
