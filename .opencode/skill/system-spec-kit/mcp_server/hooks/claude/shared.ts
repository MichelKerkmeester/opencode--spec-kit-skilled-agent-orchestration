// ───────────────────────────────────────────────────────────────
// MODULE: Shared Hook Utilities
// ───────────────────────────────────────────────────────────────

/** Timeout for hook scripts — must stay under 2s hard cap */
export const HOOK_TIMEOUT_MS = 1800;
/** Token budget for compaction context injection */
export const COMPACTION_TOKEN_BUDGET = 4000;
/** Token budget for session priming (startup/resume) */
export const SESSION_PRIME_TOKEN_BUDGET = 2000;

/** Parsed JSON from Claude Code hook stdin */
export interface HookInput {
  session_id?: string;
  transcript_path?: string;
  trigger?: 'auto' | 'manual';
  source?: 'startup' | 'resume' | 'clear' | 'compact';
  custom_instructions?: string;
  stop_hook_active?: boolean;
  last_assistant_message?: string;
  [key: string]: unknown;
}

/** A titled section for hook stdout output */
export interface OutputSection {
  title: string;
  content: string;
}

/** Read and parse JSON from stdin. Returns null on failure. */
export async function parseHookStdin(): Promise<HookInput | null> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString('utf-8').trim();
    if (!raw) return null;
    return JSON.parse(raw) as HookInput;
  } catch (err: unknown) {
    hookLog('warn', 'stdin', `Failed to parse hook stdin: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/** Format sections into readable text block for stdout injection */
export function formatHookOutput(sections: OutputSection[]): string {
  return sections
    .filter(s => s.content.trim().length > 0)
    .map(s => `## ${s.title}\n${s.content}`)
    .join('\n\n');
}

/** Wrap a promise with a timeout. Returns fallback value on timeout. */
export async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      hookLog('warn', 'timeout', `Operation timed out after ${ms}ms`);
      resolve(fallback);
    }, ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/** Log to stderr (stdout is reserved for hook output injection) */
export function hookLog(level: 'info' | 'warn' | 'error', tag: string, msg: string): void {
  const prefix = `[speckit-hook:${tag}]`;
  const line = `${prefix} ${msg}`;
  if (level === 'error') {
    process.stderr.write(`ERROR ${line}\n`);
  } else if (level === 'warn') {
    process.stderr.write(`WARN ${line}\n`);
  } else {
    process.stderr.write(`INFO ${line}\n`);
  }
}

/** Estimate token count (rough: 1 token ≈ 4 chars) and truncate if over budget */
export function truncateToTokenBudget(text: string, maxTokens: number): string {
  const estimatedTokens = Math.ceil(text.length / 4);
  if (estimatedTokens <= maxTokens) return text;
  const maxChars = maxTokens * 4;
  return text.slice(0, maxChars) + '\n[...truncated to fit token budget]';
}

const RECOVERED_TRANSCRIPT_STRIP_PATTERNS = [
  /^\s*(?:system|developer|assistant|user)\s*:/i,
  /^\s*\[(?:system|developer|assistant|user)\]\s*:/i,
  /^\s*(?:you are\b|important:|follow(?: these)? instructions\b|ignore (?:all|previous)|system prompt\b|developer note\b|role:|policy:)/i,
  /^\s*#{1,6}\s*(?:system|developer|assistant|user|instructions?|prompt)\b/i,
  /^\s*<(?:\/)?(?:system|developer|assistant|user|instructions?)\b/i,
];

/** Remove obvious system-instruction lines from recovered transcript text */
export function sanitizeRecoveredPayload(payload: string): string {
  return payload
    .split(/\r?\n/)
    .filter((line) => !RECOVERED_TRANSCRIPT_STRIP_PATTERNS.some((pattern) => pattern.test(line)))
    .join('\n')
    .trim();
}

/** Add explicit provenance markers around recovered compact context */
export function wrapRecoveredCompactPayload(payload: string, cachedAt: string): string {
  const sanitizedPayload = sanitizeRecoveredPayload(payload);
  return [
    `[SOURCE: hook-cache, cachedAt: ${cachedAt}]`,
    sanitizedPayload,
    '[/SOURCE]',
  ].join('\n');
}

/** Calculate pressure-adjusted budget based on context window usage */
export function calculatePressureAdjustedBudget(
  currentTokens: number | undefined,
  maxTokens: number | undefined,
  baseBudget: number,
): number {
  if (!currentTokens || !maxTokens || maxTokens <= 0) return baseBudget;
  const ratio = currentTokens / maxTokens;
  if (ratio > 0.9) return Math.max(200, Math.floor(baseBudget * 0.2));
  if (ratio > 0.7) return Math.floor(baseBudget * (1 - ratio) * 2);
  return baseBudget;
}
