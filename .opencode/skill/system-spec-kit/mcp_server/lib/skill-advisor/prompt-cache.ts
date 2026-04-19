// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Exact Prompt Cache
// ───────────────────────────────────────────────────────────────

import { createHmac, createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';

export const ADVISOR_PROMPT_CACHE_TTL_MS = 5 * 60 * 1000;
export const ADVISOR_PROMPT_CACHE_DEFAULT_MAX_TOKENS = 80;
export const ADVISOR_PROMPT_CACHE_MAX_TOKENS = 120;
export const MAX_CACHE_ENTRIES = 1000;

export interface AdvisorThresholds {
  readonly confidenceThreshold?: number;
  readonly uncertaintyThreshold?: number;
  readonly confidenceOnly?: boolean;
  readonly showRejections?: boolean;
}

export interface AdvisorPromptCacheKeyParts {
  readonly canonicalPrompt: string;
  readonly sourceSignature: string;
  readonly runtime: string;
  readonly maxTokens?: number;
  readonly thresholdConfig?: AdvisorThresholds;
}

export interface AdvisorPromptCacheEntry<T> {
  readonly key: string;
  readonly sourceSignature: string;
  readonly value: T;
  readonly skillLabels: readonly string[];
  readonly createdAtMs: number;
  readonly expiresAtMs: number;
}

const SESSION_LAUNCH_TIME = performance.timeOrigin.toFixed(3);
const DEFAULT_SECRET = createHash('sha256')
  .update(`${process.pid}:${SESSION_LAUNCH_TIME}:${Math.random()}`)
  .digest();

function stableThresholdConfig(thresholdConfig: AdvisorThresholds | undefined): string {
  return JSON.stringify({
    confidenceThreshold: thresholdConfig?.confidenceThreshold ?? 0.8,
    uncertaintyThreshold: thresholdConfig?.uncertaintyThreshold ?? 0.35,
    confidenceOnly: thresholdConfig?.confidenceOnly ?? false,
    showRejections: thresholdConfig?.showRejections ?? false,
  });
}

function normalizeMaxTokens(maxTokens: number | undefined): number {
  if (typeof maxTokens !== 'number' || Number.isNaN(maxTokens)) {
    return ADVISOR_PROMPT_CACHE_DEFAULT_MAX_TOKENS;
  }
  return Math.min(
    Math.max(1, Math.floor(maxTokens)),
    ADVISOR_PROMPT_CACHE_MAX_TOKENS,
  );
}

/** Build an opaque HMAC key for exact prompt-cache lookups. */
export function createAdvisorPromptCacheKey(
  parts: AdvisorPromptCacheKeyParts,
  secret: Buffer = DEFAULT_SECRET,
): string {
  const payload = [
    parts.canonicalPrompt,
    parts.sourceSignature,
    parts.runtime,
    String(normalizeMaxTokens(parts.maxTokens)),
    stableThresholdConfig(parts.thresholdConfig),
  ].join('\u001f');
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/** In-memory exact cache for advisor briefs scoped to one host process. */
export class AdvisorPromptCache<T> {
  private readonly entries = new Map<string, AdvisorPromptCacheEntry<T>>();

  constructor(
    private readonly ttlMs: number = ADVISOR_PROMPT_CACHE_TTL_MS,
    private readonly secret: Buffer = DEFAULT_SECRET,
  ) {}

  /** Create an opaque cache key from normalized prompt/runtime/source inputs. */
  makeKey(parts: AdvisorPromptCacheKeyParts): string {
    return createAdvisorPromptCacheKey(parts, this.secret);
  }

  /** Return a live entry, evicting it first when its TTL has expired. */
  get(key: string, nowMs: number = performance.now()): AdvisorPromptCacheEntry<T> | null {
    const entry = this.entries.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expiresAtMs <= nowMs) {
      this.entries.delete(key);
      return null;
    }
    return entry;
  }

  /** Insert or replace an entry, sweeping expired rows and evicting oldest overflow. */
  set(args: {
    key: string;
    sourceSignature: string;
    value: T;
    skillLabels: readonly string[];
    nowMs?: number;
  }): AdvisorPromptCacheEntry<T> {
    const createdAtMs = args.nowMs ?? performance.now();
    this.sweepExpired(createdAtMs);
    if (!this.entries.has(args.key)) {
      this.evictOldestUntilBelowLimit();
    }
    const entry: AdvisorPromptCacheEntry<T> = {
      key: args.key,
      sourceSignature: args.sourceSignature,
      value: args.value,
      skillLabels: [...new Set(args.skillLabels)].sort(),
      createdAtMs,
      expiresAtMs: createdAtMs + this.ttlMs,
    };
    this.entries.set(args.key, entry);
    return entry;
  }

  /** Remove a single cache entry by key. */
  invalidate(key: string): void {
    this.entries.delete(key);
  }

  /** Drop entries produced from stale advisor source signatures. */
  invalidateSourceSignatureChange(currentSourceSignature: string): number {
    let dropped = 0;
    for (const [key, entry] of this.entries) {
      if (entry.sourceSignature !== currentSourceSignature) {
        this.entries.delete(key);
        dropped += 1;
      }
    }
    return dropped;
  }

  /** Clear all cache entries, primarily for tests and session teardown. */
  clear(): void {
    this.entries.clear();
  }

  /** Return the number of live and unswept entries currently retained. */
  size(): number {
    return this.entries.size;
  }

  private sweepExpired(nowMs: number): void {
    for (const [key, entry] of this.entries) {
      if (entry.expiresAtMs <= nowMs) {
        this.entries.delete(key);
      }
    }
  }

  private evictOldestUntilBelowLimit(): void {
    while (this.entries.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = this.entries.keys().next().value as string | undefined;
      if (oldestKey === undefined) {
        return;
      }
      this.entries.delete(oldestKey);
    }
  }
}

export const advisorPromptCache = new AdvisorPromptCache<unknown>();
