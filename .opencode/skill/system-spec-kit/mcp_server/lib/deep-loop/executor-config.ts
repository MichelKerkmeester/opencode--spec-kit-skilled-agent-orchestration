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
type SandboxMode = typeof SANDBOX_MODES[number];

export const executorConfigSchema = z.object({
  kind: z.enum(EXECUTOR_KINDS).default('native'),
  model: z.string().min(1).nullable().default(null),
  reasoningEffort: z.enum(REASONING_EFFORTS).nullable().default(null),
  serviceTier: z.enum(SERVICE_TIERS).nullable().default(null),
  sandboxMode: z.enum(SANDBOX_MODES).nullable().default(null),
  timeoutSeconds: z.number().int().positive().default(900),
});

export type ExecutorConfig = z.infer<typeof executorConfigSchema>;

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

  if (config.kind === 'cli-copilot' || config.kind === 'cli-gemini' || config.kind === 'cli-claude-code') {
    throw new ExecutorNotWiredError(config.kind);
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
