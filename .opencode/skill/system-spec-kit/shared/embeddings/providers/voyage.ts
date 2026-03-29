// ---------------------------------------------------------------
// MODULE: Voyage
// ---------------------------------------------------------------

import { EmbeddingProfile } from '../profile.js';
import { retryWithBackoff } from '../../utils/retry.js';
import type { IEmbeddingProvider, ModelDimensions, ProviderMetadata, UsageStats } from '../../types.js';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

const DEFAULT_MODEL: string = 'voyage-4';
const DEFAULT_DIM: number = 1024;
const DEFAULT_BASE_URL: string = 'https://api.voyageai.com/v1';
const REQUEST_TIMEOUT: number = 30000;

// Config: honor VOYAGE_BASE_URL for startup validation, not just runtime
export function resolveVoyageBaseUrl(baseUrl?: string): string {
  if (typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
    return baseUrl.trim();
  }

  if (typeof process.env.VOYAGE_BASE_URL === 'string' && process.env.VOYAGE_BASE_URL.trim().length > 0) {
    return process.env.VOYAGE_BASE_URL.trim();
  }

  return DEFAULT_BASE_URL;
}

/** Defines model dimensions. */
export const MODEL_DIMENSIONS: ModelDimensions = {
  // Voyage 4 family (Shared embedding space)
  'voyage-4-large': 1024, // Supports 256/512/1024/2048 - default to 1024 for compat
  'voyage-4': 1024,       // Supports 256/512/1024/2048
  'voyage-4-lite': 1024,  // Supports 256/512/1024/2048

  // Voyage 3 family
  'voyage-3.5': 1024,
  'voyage-3.5-lite': 1024,
  'voyage-3-large': 1024,
  'voyage-code-3': 1024,
  'voyage-code-2': 1536,
  'voyage-3': 1024,
  'voyage-finance-2': 1024,
  'voyage-law-2': 1024,
};

// ---------------------------------------------------------------
// 2. PROVIDER CLASS
// ---------------------------------------------------------------

interface VoyageOptions {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  dim?: number;
  timeout?: number;
}

interface VoyageEmbeddingResponse {
  data: Array<{ embedding: number[] }>;
  usage?: { total_tokens: number };
}

interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function hasTimeoutCode(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as { code?: unknown }).code === 'ETIMEDOUT';
}

interface VoyageErrorBody {
  detail?: string;
  error?: {
    message?: string;
  };
}

function parseVoyageErrorBody(payload: unknown): VoyageErrorBody {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const payloadRecord = payload as Record<string, unknown>;
  const detail = typeof payloadRecord.detail === 'string' ? payloadRecord.detail : undefined;

  let message: string | undefined;
  if (payloadRecord.error && typeof payloadRecord.error === 'object') {
    const errorRecord = payloadRecord.error as Record<string, unknown>;
    if (typeof errorRecord.message === 'string') {
      message = errorRecord.message;
    }
  }

  return {
    detail,
    error: message ? { message } : undefined,
  };
}

/** Provides voyage provider. */
export class VoyageProvider implements IEmbeddingProvider {
  private readonly apiKey: string;
  readonly baseUrl: string;
  readonly modelName: string;
  readonly dim: number;
  readonly timeout: number;
  isHealthy: boolean;
  requestCount: number;
  totalTokens: number;

  constructor(options: VoyageOptions = {}) {
    this.apiKey = options.apiKey || process.env.VOYAGE_API_KEY || '';
    this.baseUrl = resolveVoyageBaseUrl(options.baseUrl);
    this.modelName = options.model || process.env.VOYAGE_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = options.dim || MODEL_DIMENSIONS[this.modelName] || DEFAULT_DIM;
    this.timeout = options.timeout || REQUEST_TIMEOUT;
    this.isHealthy = true;
    this.requestCount = 0;
    this.totalTokens = 0;

    if (!this.apiKey) {
      throw new Error('Voyage API key is required. Set VOYAGE_API_KEY.');
    }
  }

  /**
   * Execute a single HTTP request (internal, no retry).
   * @private
   */
  private async executeRequest(input: string | string[], inputType: string | null = null): Promise<VoyageEmbeddingResponse> {
    const url = `${this.baseUrl}/embeddings`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const body: Record<string, unknown> = {
      input: Array.isArray(input) ? input : [input],
      model: this.modelName,
    };

    // Voyage-specific: input_type optimizes retrieval ('document' or 'query')
    if (inputType) {
      body.input_type = inputType;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const errorBody = parseVoyageErrorBody(errorPayload);
        const error: ErrorWithStatus = new Error(
          `Voyage API error: ${errorBody.detail || errorBody.error?.message || response.statusText}`
        );
        // Attach status code for retry classification
        error.status = response.status;
        throw error;
      }

      const data = await response.json() as VoyageEmbeddingResponse;

      this.requestCount++;
      this.isHealthy = true;
      if (data.usage) {
        this.totalTokens += data.usage.total_tokens;
      }

      return data;

    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      clearTimeout(timeoutId);

      if (isAbortError(error)) {
        const timeoutError: ErrorWithStatus = new Error('Voyage request timeout');
        timeoutError.code = 'ETIMEDOUT';
        throw timeoutError;
      }

      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Make request with retry logic for transient errors.
   * REQ-032: 3 retries with backoff (1s, 2s, 4s), fail fast for 401/403.
   */
  async makeRequest(input: string | string[], inputType: string | null = null): Promise<VoyageEmbeddingResponse> {
    return retryWithBackoff<VoyageEmbeddingResponse>(
      () => this.executeRequest(input, inputType),
      {
        operationName: 'voyage-embedding',
        maxRetries: 3,
        baseDelayMs: 1000,
        onRetry: (attempt: number, error: Error, delay: number) => {
          console.warn(
            `[voyage] Retry ${attempt + 1}/3 after ${delay}ms: ${error.message}`
          );
        },
      }
    );
  }

  async generateEmbedding(text: string, inputType: string | null = null): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string') {
      console.warn('[voyage] Empty or invalid text provided');
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('[voyage] Empty text after trim');
      return null;
    }

    const start = Date.now();

    try {
      const response = await this.makeRequest(trimmedText, inputType);

      if (!response.data || response.data.length === 0) {
        throw new Error('Voyage did not return embeddings');
      }

      const embedding = new Float32Array(response.data[0].embedding);

      if (embedding.length !== this.dim) {
        throw new Error(
          `Embedding dimension mismatch: expected ${this.dim}, got ${embedding.length} from voyage. Cannot store mismatched embeddings.`
        );
      }

      const inferenceTime = Date.now() - start;

      if (inferenceTime > 2000) {
        console.warn(`[voyage] Slow request: ${inferenceTime}ms`);
      }

      return embedding;

    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      console.warn(`[voyage] Generation failed: ${getErrorMessage(error)}`);
      this.isHealthy = false;
      throw error;
    }
  }

  async embedDocument(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text, 'document');
  }

  async embedQuery(text: string): Promise<Float32Array | null> {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return null;
    }
    return await this.generateEmbedding(text, 'query');
  }

  async warmup(): Promise<boolean> {
    try {
      console.error('[voyage] Checking connectivity with Voyage API...');
      const result = await Promise.race([
        this.embedQuery('test warmup query'),
        new Promise<Float32Array | null>((_, reject) => {
          setTimeout(() => {
            const timeoutError: ErrorWithStatus = new Error(`Voyage warmup timed out after ${this.timeout}ms`);
            timeoutError.code = 'ETIMEDOUT';
            reject(timeoutError);
          }, this.timeout);
        }),
      ]);
      this.isHealthy = result !== null;
      console.error('[voyage] Connectivity verified successfully');
      return this.isHealthy;
    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      if (hasTimeoutCode(error)) {
        console.warn(`[voyage] Warmup timed out after ${this.timeout}ms; proceeding with cold provider state`);
        this.isHealthy = true;
        return true;
      }
      console.warn(`[voyage] Warmup failed: ${getErrorMessage(error)}`);
      this.isHealthy = false;
      return false;
    }
  }

  getMetadata(): ProviderMetadata {
    return {
      provider: 'voyage',
      model: this.modelName,
      dim: this.dim,
      baseUrl: this.baseUrl,
      healthy: this.isHealthy,
      requestCount: this.requestCount,
      totalTokens: this.totalTokens,
    };
  }

  getProfile(): EmbeddingProfile {
    return new EmbeddingProfile({
      provider: 'voyage',
      model: this.modelName,
      dim: this.dim,
      baseUrl: this.baseUrl,
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.embedQuery('health check');
      this.isHealthy = result !== null;
      return this.isHealthy;
    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      this.isHealthy = false;
      return false;
    }
  }

  getUsageStats(): UsageStats {
    return {
      requestCount: this.requestCount,
      totalTokens: this.totalTokens,
      // voyage-4 pricing: $0.06 per 1M tokens (same as 3.5)
      // voyage-4-lite: $0.03 per 1M tokens
      // voyage-4-large: $0.12 per 1M tokens
      estimatedCost: (this.totalTokens / 1_000_000) * 0.06,
    };
  }

  getProviderName(): string {
    return 'Voyage AI Embeddings';
  }
}
