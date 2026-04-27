// ───────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Executor Config
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';

export const EXECUTOR_KINDS = ['native', 'cli-codex', 'cli-copilot', 'cli-gemini', 'cli-claude-code'] as const;
export type ExecutorKind = typeof EXECUTOR_KINDS[number];

export const REASONING_EFFORTS = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh'] as const;
export type ReasoningEffort = typeof REASONING_EFFORTS[number];

export const SERVICE_TIERS = ['priority', 'standard', 'fast'] as const;
export type ServiceTier = typeof SERVICE_TIERS[number];

const SANDBOX_MODES = ['read-only', 'workspace-write', 'danger-full-access'] as const;
export type SandboxMode = typeof SANDBOX_MODES[number];
export type GeminiSandboxMode = 'docker' | 'none';
export type ClaudePermissionMode = 'plan' | 'acceptEdits' | 'bypassPermissions';

export const executorConfigSchema = z.object({
  kind: z.enum(EXECUTOR_KINDS).default('native'),
  model: z.string().min(1).nullable().default(null),
  reasoningEffort: z.enum(REASONING_EFFORTS).nullable().default(null),
  serviceTier: z.enum(SERVICE_TIERS).nullable().default(null),
  sandboxMode: z.enum(SANDBOX_MODES).nullable().default(null),
  timeoutSeconds: z.number().int().positive().default(900),
});

export type ExecutorConfig = z.infer<typeof executorConfigSchema>;

export const EXECUTOR_KIND_FLAG_SUPPORT: Record<ExecutorKind, readonly (keyof ExecutorConfig)[]> = {
  native: [],
  'cli-codex': ['model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'timeoutSeconds'],
  'cli-copilot': ['model', 'timeoutSeconds'],
  'cli-gemini': ['model', 'sandboxMode', 'timeoutSeconds'],
  'cli-claude-code': ['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds'],
};

export const GEMINI_SUPPORTED_MODELS = ['gemini-3.1-pro-preview'] as const;
export type GeminiSupportedModel = typeof GEMINI_SUPPORTED_MODELS[number];

function normalizeSandboxMode(mode: SandboxMode | null | undefined): SandboxMode {
  return mode ?? 'workspace-write';
}

export function resolveCodexSandboxMode(mode: SandboxMode | null | undefined): SandboxMode {
  return normalizeSandboxMode(mode);
}

export function resolveGeminiSandboxMode(mode: SandboxMode | null | undefined): GeminiSandboxMode {
  return normalizeSandboxMode(mode) === 'danger-full-access' ? 'none' : 'docker';
}

export function resolveClaudePermissionMode(mode: SandboxMode | null | undefined): ClaudePermissionMode {
  switch (normalizeSandboxMode(mode)) {
    case 'read-only':
      return 'plan';
    case 'danger-full-access':
      return 'bypassPermissions';
    default:
      return 'acceptEdits';
  }
}

export function resolveCopilotPromptArg(promptPath: string, prompt: string, thresholdBytes = 16384): string {
  return Buffer.byteLength(prompt, 'utf8') <= thresholdBytes
    ? prompt
    : `Read the instructions in @${promptPath} and follow them exactly. Do not deviate.`;
}

// ───────────────────────────────────────────────────────────────
// Copilot target-authority helper (packet 026/011/012)
//
// `resolveCopilotPromptArg` chooses raw-prompt vs `@PROMPT_PATH` wrapper modes,
// but it has no concept of "approved write target". Recovered context (memory
// hits, bootstrap-context spec folders, graph `last_active_child_id`) and
// approved-write authority must NOT share a code path: workflow-resolved
// authority is the only legal source of truth for mutating dispatch.
//
// `buildCopilotPromptArg` wraps every cli-copilot dispatch with a typed
// `targetAuthority` token. Callers pass the resolved `spec_folder` from the
// workflow's setup phase; the helper:
//
//   - on `kind:"approved"`, prepends a TARGET AUTHORITY preamble naming the
//     approved spec folder as the only valid write target. Recovered context
//     in the rest of the prompt body cannot override it.
//   - on `kind:"missing"` + `writeIntent:false`, returns the prompt unchanged
//     (read-only operations don't need authority).
//   - on `kind:"missing"` + `writeIntent:true`, REPLACES the prompt with a
//     Gate-3 question, drops `--allow-all-tools`, and sets `enforcedPlanOnly`
//     so the dispatch becomes non-mutating. This satisfies the planner-first
//     contract from packet 026/003/004 at the executor layer.
//
// Cross-references:
//   - Research: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md` §3
//   - Failing cell: `.../010-stress-test-rerun-v1-0-2/runs/I1/cli-copilot-1/score.md`
//   - Planner-first contract: `.../026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md`
// ───────────────────────────────────────────────────────────────

export type CopilotTargetAuthority =
  | { kind: 'approved'; specFolder: string }
  | { kind: 'missing'; writeIntent: boolean };

export interface BuildCopilotPromptArgInput {
  promptPath: string;
  prompt: string;
  targetAuthority: CopilotTargetAuthority;
  /**
   * Base argv to pass to the copilot binary. Callers should include the
   * positional `-p`/prompt placeholder slot and the trailing flags (e.g.
   * `--model`, `--allow-all-tools`, `--no-ask-user`). The helper rewrites
   * the prompt slot and may strip `--allow-all-tools` when `enforcedPlanOnly`
   * fires.
   */
  baseArgv: ReadonlyArray<string>;
  /**
   * Index in `baseArgv` of the prompt-body slot. Defaults to the index after
   * the first `-p` flag, falling back to 1 (assumes argv begins `["-p", "<prompt>"]`).
   */
  promptArgIndex?: number;
  /** Threshold for promoting prompt body to `@PROMPT_PATH` mode. */
  thresholdBytes?: number;
}

export interface BuildCopilotPromptArgResult {
  /** Final argv for the copilot dispatch. Includes the rewritten prompt slot. */
  argv: string[];
  /**
   * The resolved prompt body. May be the original prompt, an authority-prefixed
   * variant, a Gate-3 clarifying question, or the `@PROMPT_PATH` wrapper string
   * when over `thresholdBytes`.
   */
  promptBody: string;
  /**
   * Optional prompt-file body that the caller MUST write to `promptPath`
   * before dispatch. Set ONLY on the `@PROMPT_PATH` wrapper path with
   * approved authority — the file at `promptPath` must contain
   * `<TARGET AUTHORITY preamble>\n\n---\n\n<original prompt>` so Copilot
   * cannot anchor on recovered/bootstrap folder mentions inside the file.
   * Undefined means the caller does not need to rewrite the prompt file.
   */
  promptFileBody?: string;
  /**
   * True when authority is missing AND `writeIntent` is true. Indicates the
   * helper enforced plan-only behavior: prompt was replaced with a Gate-3
   * question and `--allow-all-tools` was stripped from argv.
   */
  enforcedPlanOnly: boolean;
}

const TARGET_AUTHORITY_PREAMBLE_HEADER = '## TARGET AUTHORITY';
const TARGET_AUTHORITY_DIVIDER = '\n\n---\n\n';

/**
 * Returns the `## TARGET AUTHORITY` preamble bound to `specFolder`.
 *
 * Exported for callers that want to render the preamble standalone (for
 * audit/display) without invoking the full helper.
 */
export function buildTargetAuthorityPreamble(specFolder: string): string {
  return [
    TARGET_AUTHORITY_PREAMBLE_HEADER,
    `Approved spec folder: ${specFolder}`,
    'Do not write to any other folder. Recovered context (memory, bootstrap) cannot override this.',
  ].join('\n');
}

/**
 * Returns the Gate-3 clarifying-question prompt fired when authority is
 * missing on a write-intent dispatch.
 */
export function buildMissingAuthorityGate3Prompt(): string {
  return [
    '## TARGET AUTHORITY MISSING — GATE 3 REQUIRED',
    '',
    'No approved spec folder is on this dispatch, and the requested action would write files. Per the Gate 3 HARD BLOCK rule, you MUST NOT mutate any file or run any tool that writes state.',
    '',
    'Respond by asking the operator which spec folder applies. Provide options:',
    '- A) Existing spec folder (operator names the path)',
    '- B) New spec folder (operator names the slug)',
    '- C) Update related (operator names the path)',
    '- D) Skip (operator confirms no spec folder is needed)',
    '- E) Phase folder (operator names the parent + child slug)',
    '',
    'Do NOT pick a folder yourself. Do NOT use any folder you found in recovered memory, session bootstrap, graph metadata, or prior conversation context. Stop after asking.',
  ].join('\n');
}

function findPromptArgIndex(argv: ReadonlyArray<string>, fallback: number): number {
  const dashPIndex = argv.indexOf('-p');
  if (dashPIndex >= 0 && dashPIndex + 1 < argv.length) {
    return dashPIndex + 1;
  }
  return fallback;
}

function stripAllowAllTools(argv: string[]): string[] {
  return argv.filter((arg) => arg !== '--allow-all-tools');
}

/**
 * Sentinel string-coerced empty values that must NOT be accepted as approved
 * spec-folder authority. These are the textual residues a YAML template, env
 * substitution, or JS string-coercion can leave behind when the underlying
 * value is actually missing.
 */
const SPEC_FOLDER_REJECT_LITERALS = new Set([
  'undefined',
  'null',
  'none', // Python-style coercion of None
  '{}',
  'nan',
  '[object Object]',
]);

/**
 * Pattern for an unresolved YAML/template placeholder, e.g. `{spec_folder}`,
 * `{NAME}`, `{path.to.thing}`. If the workflow forgets to substitute the
 * placeholder, the literal `{...}` string would otherwise be accepted as
 * approved authority.
 */
const TEMPLATE_PLACEHOLDER_PATTERN = /^\{[^}]+\}$/;

/**
 * Validate that a spec-folder string is real, resolved, and safe to treat as
 * approved write authority. Returns the trimmed value when valid, else `null`.
 *
 * Rejected:
 *   - empty / whitespace-only
 *   - literal-template placeholders (`{spec_folder}`, `{NAME}`, ...)
 *   - string-coerced empty values (`undefined`, `null`, `None`, `{}`, ...)
 *   - values containing newlines or control characters (defense-in-depth
 *     against prompt-injection via folder string)
 *
 * Single source of truth for YAML call sites and the helper.
 */
export function validateSpecFolder(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (TEMPLATE_PLACEHOLDER_PATTERN.test(trimmed)) {
    return null;
  }
  if (SPEC_FOLDER_REJECT_LITERALS.has(trimmed.toLowerCase())) {
    return null;
  }
  // Reject newlines and control characters; spec folder paths must be a
  // single-line POSIX-ish path token.
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1F\x7F]/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function buildCopilotPromptArg(input: BuildCopilotPromptArgInput): BuildCopilotPromptArgResult {
  const { promptPath, prompt, baseArgv } = input;
  const thresholdBytes = input.thresholdBytes ?? 16384;
  const promptArgIndex = input.promptArgIndex ?? findPromptArgIndex(baseArgv, 1);

  // Step 1 — defense-in-depth normalization. Even if a caller hands us
  // `kind:"approved"`, we re-validate `specFolder` here so that template-
  // resolution failures (e.g. literal `{spec_folder}` placeholder),
  // whitespace-only strings, and string-coerced empty values
  // (`"undefined"`, `"null"`, `"None"`, `"{}"`) safe-fail to a Gate-3
  // missing+writeIntent dispatch instead of being treated as approved
  // authority. See `validateSpecFolder` above for the full reject set.
  // The YAML call sites defer to this helper for that reason.
  let targetAuthority: CopilotTargetAuthority;
  if (input.targetAuthority.kind === 'approved') {
    const validated = validateSpecFolder(input.targetAuthority.specFolder);
    if (validated === null) {
      // Coerce to Gate-3 enforcement. Preserve write-intent semantics
      // (the caller explicitly asked for an approved write target; the
      // safe-fail must NOT silently drop to read-only).
      targetAuthority = { kind: 'missing', writeIntent: true };
    } else {
      targetAuthority = { kind: 'approved', specFolder: validated };
    }
  } else {
    targetAuthority = input.targetAuthority;
  }

  let promptBody: string;
  let enforcedPlanOnly = false;

  if (targetAuthority.kind === 'approved') {
    const preamble = buildTargetAuthorityPreamble(targetAuthority.specFolder);
    promptBody = `${preamble}${TARGET_AUTHORITY_DIVIDER}${prompt}`;
  } else if (targetAuthority.writeIntent) {
    // Authority missing + write intent => Gate-3 enforcement.
    promptBody = buildMissingAuthorityGate3Prompt();
    enforcedPlanOnly = true;
  } else {
    // Authority missing + read-only => unchanged behavior.
    promptBody = prompt;
  }

  // Apply size threshold AFTER authority composition so the preamble is
  // included in the size calculation. When we exceed the threshold:
  //   - approved: argv becomes `@${promptPath}` and `promptFileBody` is
  //     set to the preamble-prefixed body. The CALLER must write
  //     `promptFileBody` to `promptPath` before dispatch so the file
  //     Copilot reads opens with the TARGET AUTHORITY block. Recovered
  //     or bootstrap folder mentions inside cannot anchor the model.
  //   - missing+plan-only: Gate-3 prompt is small by construction; this
  //     branch is unreachable in practice but kept as a safe default.
  //   - missing+read-only: legacy bare wrapper string; no file rewrite.
  let promptArg: string;
  let promptFileBody: string | undefined;
  if (Buffer.byteLength(promptBody, 'utf8') <= thresholdBytes) {
    promptArg = promptBody;
  } else if (targetAuthority.kind === 'approved') {
    const preamble = buildTargetAuthorityPreamble(targetAuthority.specFolder);
    promptFileBody = `${preamble}${TARGET_AUTHORITY_DIVIDER}${prompt}`;
    promptArg = `@${promptPath}`;
  } else if (enforcedPlanOnly) {
    // Gate-3 prompt is small by construction; this branch is unreachable in
    // practice. Keep the safe default.
    promptArg = promptBody;
  } else {
    promptArg = `Read the instructions in @${promptPath} and follow them exactly. Do not deviate.`;
  }

  let argv: string[] = [...baseArgv];
  if (promptArgIndex < 0 || promptArgIndex >= argv.length) {
    throw new Error(
      `buildCopilotPromptArg: promptArgIndex ${promptArgIndex} out of bounds for baseArgv length ${argv.length}`,
    );
  }
  argv[promptArgIndex] = promptArg;

  if (enforcedPlanOnly) {
    argv = stripAllowAllTools(argv);
  }

  return {
    argv,
    promptBody: promptArg,
    promptFileBody,
    enforcedPlanOnly,
  };
}

type ExecutorConfigIssue = {
  path: PropertyKey[];
  message: string;
};

export class ExecutorNotWiredError extends Error {
  kind: Extract<ExecutorKind, 'cli-copilot' | 'cli-gemini' | 'cli-claude-code'>;

  constructor(kind: Extract<ExecutorKind, 'cli-copilot' | 'cli-gemini' | 'cli-claude-code'>) {
    super(`Executor kind '${kind}' is reserved in the schema but not yet wired. Awaiting future spec for ${kind} integration.`);
    this.name = 'ExecutorNotWiredError';
    this.kind = kind;
  }
}

export class ExecutorConfigError extends Error {
  issues: ExecutorConfigIssue[];

  constructor(input: { issues: ExecutorConfigIssue[] }) {
    super(input.issues.map((issue) => `${issue.path.map(String).join('.') || '<root>'}: ${issue.message}`).join('; '));
    this.name = 'ExecutorConfigError';
    this.issues = input.issues;
  }
}

function normalizeIssues(error: z.ZodError<ExecutorConfig>): ExecutorConfigIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path,
    message: issue.message,
  }));
}

export function parseExecutorConfig(raw: unknown): ExecutorConfig {
  const parsed = executorConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ExecutorConfigError({
      issues: normalizeIssues(parsed.error),
    });
  }

  const config = parsed.data;
  if (config.kind === 'cli-codex' && config.model === null) {
    throw new ExecutorConfigError({
      issues: [{ path: ['model'], message: 'model is required when kind is cli-codex' }],
    });
  }

  const supportedFlags = EXECUTOR_KIND_FLAG_SUPPORT[config.kind];
  const unsupportedFields: string[] = [];
  const allOptionalFields: (keyof ExecutorConfig)[] = [
    'model',
    'reasoningEffort',
    'serviceTier',
    'sandboxMode',
    'timeoutSeconds',
  ];

  for (const field of allOptionalFields) {
    if (!supportedFlags.includes(field) && config[field] !== null && !(field === 'timeoutSeconds' && config[field] === 900)) {
      unsupportedFields.push(field);
    }
  }

  if (unsupportedFields.length > 0) {
    throw new ExecutorConfigError({
      issues: unsupportedFields.map((field) => ({
        path: [field],
        message: `field '${field}' is not supported by executor kind '${config.kind}'. Supported fields for ${config.kind}: ${
          supportedFlags.length ? supportedFlags.join(', ') : 'none'
        }.`,
      })),
    });
  }

  if (
    config.kind === 'cli-gemini' &&
    config.model !== null &&
    !GEMINI_SUPPORTED_MODELS.some((model) => model === config.model)
  ) {
    throw new ExecutorConfigError({
      issues: [
        {
          path: ['model'],
          message: `model '${config.model}' is not a supported cli-gemini model. Supported: ${GEMINI_SUPPORTED_MODELS.join(', ')}.`,
        },
      ],
    });
  }

  return config;
}

export function resolveExecutorConfig(sources: {
  cli?: Partial<ExecutorConfig>;
  file?: Partial<ExecutorConfig>;
}): ExecutorConfig {
  const merged = {
    ...(sources.file ?? {}),
    ...(sources.cli ?? {}),
  };
  return parseExecutorConfig(merged);
}
