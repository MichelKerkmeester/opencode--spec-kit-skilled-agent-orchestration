// ---------------------------------------------------------------
// MODULE: Factory
// ---------------------------------------------------------------

import { HfLocalProvider } from './providers/hf-local';
import { OpenAIProvider } from './providers/openai';
import { VoyageProvider } from './providers/voyage';
import type {
  IEmbeddingProvider,
  ProviderResolution,
  ProviderInfo,
  CreateProviderOptions,
  ApiKeyValidationResult,
} from '../types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

interface ValidationErrorBody {
  detail?: string;
  error?: {
    message?: string;
  };
}

function parseValidationErrorBody(payload: unknown): ValidationErrorBody {
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

// ---------------------------------------------------------------
// 1. PROVIDER RESOLUTION
// ---------------------------------------------------------------

/**
 * Check if an API key appears to be a placeholder value.
 * Returns true if key contains placeholder indicators or is too short.
 */
function isPlaceholderKey(key: string): boolean {
  const upperKey = key.toUpperCase();
  return (
    upperKey.includes('YOUR_') ||
    upperKey.includes('PLACEHOLDER') ||
    upperKey.includes('HERE') ||
    key.length < 10
  );
}

/**
 * Resolve provider based on env vars.
 * Precedence: 1) EMBEDDINGS_PROVIDER, 2) VOYAGE_API_KEY, 3) OPENAI_API_KEY, 4) hf-local
 */
export function resolveProvider(): ProviderResolution {
  const explicitProvider = process.env.EMBEDDINGS_PROVIDER;
  if (explicitProvider && explicitProvider !== 'auto') {
    return {
      name: explicitProvider,
      reason: 'Explicit EMBEDDINGS_PROVIDER variable',
    };
  }

  const voyageKey = process.env.VOYAGE_API_KEY;
  if (voyageKey) {
    if (isPlaceholderKey(voyageKey)) {
      console.warn('[embeddings] VOYAGE_API_KEY appears to be a placeholder — skipping');
    } else {
      return {
        name: 'voyage',
        reason: 'VOYAGE_API_KEY detected (auto mode)',
      };
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    if (isPlaceholderKey(openaiKey)) {
      console.warn('[embeddings] OPENAI_API_KEY appears to be a placeholder — skipping');
    } else {
      return {
        name: 'openai',
        reason: 'OPENAI_API_KEY detected (auto mode)',
      };
    }
  }

  return {
    name: 'hf-local',
    reason: 'Default fallback (no API keys detected)',
  };
}

// ---------------------------------------------------------------
// 2. PROVIDER FACTORY
// ---------------------------------------------------------------

/** Create provider instance based on configuration */
export async function createEmbeddingsProvider(options: CreateProviderOptions = {}): Promise<IEmbeddingProvider> {
  const resolution = resolveProvider();
  const providerName = options.provider === 'auto' || !options.provider
    ? resolution.name
    : options.provider;

  console.error(`[factory] Using provider: ${providerName} (${resolution.reason})`);

  let provider: IEmbeddingProvider;

  try {
    switch (providerName) {
      case 'voyage':
        if (!process.env.VOYAGE_API_KEY && !options.apiKey) {
          throw new Error(
            'Voyage provider requires VOYAGE_API_KEY. ' +
            'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
          );
        }
        provider = new VoyageProvider({
          model: options.model,
          dim: options.dim,
          apiKey: options.apiKey,
          baseUrl: options.baseUrl,
          timeout: options.timeout,
        });
        if (options.maxTextLength) {
          console.warn('[factory] VoyageProvider does not support maxTextLength option — ignored');
        }
        break;

      case 'openai':
        if (!process.env.OPENAI_API_KEY && !options.apiKey) {
          throw new Error(
            'OpenAI provider requires OPENAI_API_KEY. ' +
            'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
          );
        }
        provider = new OpenAIProvider({
          model: options.model,
          dim: options.dim,
          apiKey: options.apiKey,
          baseUrl: options.baseUrl,
          timeout: options.timeout,
        });
        if (options.maxTextLength) {
          console.warn('[factory] OpenAIProvider does not support maxTextLength option — ignored');
        }
        break;

      case 'hf-local':
        provider = new HfLocalProvider({
          model: options.model,
          dim: options.dim,
          maxTextLength: options.maxTextLength,
          timeout: options.timeout,
        });
        if (options.baseUrl) {
          console.warn('[factory] HfLocalProvider does not support baseUrl option — ignored');
        }
        break;

      case 'ollama':
        throw new Error('Ollama provider not yet implemented. Use hf-local, voyage, or openai.');

      default:
        throw new Error(
          `Unknown provider: ${providerName}. ` +
          `Valid values: voyage, openai, hf-local, auto`
        );
    }

    if (options.warmup) {
      console.error(`[factory] Warming up ${providerName}...`);
      const success = await provider.warmup();
      if (!success) {
        console.warn(`[factory] Warmup failed for ${providerName}`);

        // Fallback to hf-local for cloud providers when auto-detected (not explicitly set)
        if ((providerName === 'openai' || providerName === 'voyage') && !options.provider) {
          const originalDim = provider.getMetadata().dim;
          console.warn(`[factory] Attempting fallback from ${providerName} to hf-local...`);
          provider = new HfLocalProvider({
            model: options.model,
            dim: options.dim,
          });
          const fallbackDim = provider.getMetadata().dim;
          if (originalDim !== fallbackDim) {
            console.error(
              `[factory] WARNING: Provider fallback changed embedding dimension from ${originalDim} to ${fallbackDim}. ` +
              `Vector index may need rebuilding. Existing ${originalDim}-dim vectors are incompatible with ${fallbackDim}-dim vectors.`
            );
          }
          try {
            await provider.warmup();
          } catch (fallbackWarmupError: unknown) {
            if (fallbackWarmupError instanceof Error) {
              void fallbackWarmupError.message;
            }
            console.warn(`[factory] Fallback warmup failed: ${getErrorMessage(fallbackWarmupError)}`);
            // Continue anyway - provider will attempt lazy initialization on first use
          }
        }
      }
    }

    return provider;

  } catch (error: unknown) {
    if (error instanceof Error) {
      void error.message;
    }
    console.error(`[factory] Error creating provider ${providerName}:`, getErrorMessage(error));

    // Fallback to hf-local for cloud providers when auto-detected (not explicitly set)
    if ((providerName === 'openai' || providerName === 'voyage') && !options.provider) {
      const failedProviderDim = providerName === 'openai' ? 1536 : 1024;
      console.warn(`[factory] Fallback to hf-local due to ${providerName} error`);
      provider = new HfLocalProvider({
        model: options.model,
        dim: options.dim,
      });
      const fallbackDim = provider.getMetadata().dim;
      if (failedProviderDim !== fallbackDim) {
        console.error(
          `[factory] WARNING: Provider fallback changed embedding dimension from ${failedProviderDim} to ${fallbackDim}. ` +
          `Vector index may need rebuilding. Existing ${failedProviderDim}-dim vectors are incompatible with ${fallbackDim}-dim vectors.`
        );
      }

      if (options.warmup) {
        try {
          await provider.warmup();
        } catch (fallbackWarmupError: unknown) {
          if (fallbackWarmupError instanceof Error) {
            void fallbackWarmupError.message;
          }
          console.warn(`[factory] Fallback warmup failed: ${getErrorMessage(fallbackWarmupError)}`);
          // Continue anyway - provider will attempt lazy initialization on first use
        }
      }

      return provider;
    }

    throw error;
  }
}

// ---------------------------------------------------------------
// 3. PROVIDER INFO
// ---------------------------------------------------------------

/** Get configuration information without creating the provider */
export function getProviderInfo(): ProviderInfo {
  const resolution = resolveProvider();

  return {
    provider: resolution.name,
    reason: resolution.reason,
    config: {
      EMBEDDINGS_PROVIDER: process.env.EMBEDDINGS_PROVIDER || 'auto',
      VOYAGE_API_KEY: process.env.VOYAGE_API_KEY ? '***set***' : 'not set',
      VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL || 'voyage-4',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***set***' : 'not set',
      OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small',
      HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || 'nomic-ai/nomic-embed-text-v1.5',
    },
  };
}

// ---------------------------------------------------------------
// 4. PRE-FLIGHT API KEY VALIDATION (REQ-029, T087-T090)
// ---------------------------------------------------------------

/**
 * Validation timeout in milliseconds.
 * REQ-029, CHK-170: Must complete within 5s
 */
export const VALIDATION_TIMEOUT_MS: number = 5000;

/**
 * Validate API key at startup before any tool usage.
 * REQ-029: Pre-Flight API Key Validation
 *
 * This function should be called during MCP server startup to fail fast
 * if the configured embedding provider has an invalid API key.
 */
export async function validateApiKey(options: { timeout?: number } = {}): Promise<ApiKeyValidationResult> {
  const timeoutMs = options.timeout || VALIDATION_TIMEOUT_MS;
  const resolution = resolveProvider();
  const providerName = resolution.name;

  // Local providers don't need API key validation
  if (providerName === 'hf-local') {
    return {
      valid: true,
      provider: providerName,
      reason: 'Local provider - no API key required',
    };
  }

  // Check that API key environment variable is set
  const apiKey = providerName === 'voyage'
    ? process.env.VOYAGE_API_KEY
    : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      valid: false,
      provider: providerName,
      error: `${providerName.toUpperCase()}_API_KEY environment variable not set`,
      errorCode: 'E050',
      actions: [
        `Set ${providerName.toUpperCase()}_API_KEY environment variable`,
        'Or use EMBEDDINGS_PROVIDER=hf-local to use local model',
        `Check provider dashboard: ${providerName === 'voyage' ? 'voyage.ai/dashboard' : 'platform.openai.com/api-keys'}`,
      ],
    };
  }

  // Attempt a lightweight API call with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const baseUrl = providerName === 'voyage'
      ? 'https://api.voyageai.com/v1'
      : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1');

    const model = providerName === 'voyage'
      ? (process.env.VOYAGE_EMBEDDINGS_MODEL || 'voyage-4')
      : (process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small');

    const body: Record<string, unknown> = {
      input: 'api key validation test',
      model: model,
    };

    // Voyage uses input_type for optimization
    if (providerName === 'voyage') {
      body.input_type = 'query';
    } else {
      body.encoding_format = 'float';
    }

    const response = await fetch(`${baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const errorBody = parseValidationErrorBody(errorPayload);
      const errorMessage = errorBody.detail
        || errorBody.error?.message
        || response.statusText;

      // Detect specific authentication errors
      const isAuthError = response.status === 401 || response.status === 403;
      const isRateLimit = response.status === 429;

      if (isAuthError) {
        return {
          valid: false,
          provider: providerName,
          error: `API key invalid or unauthorized: ${errorMessage}`,
          errorCode: 'E050',
          httpStatus: response.status,
          actions: [
            `Verify API key is correct in ${providerName.toUpperCase()}_API_KEY`,
            `Check key validity at ${providerName === 'voyage' ? 'voyage.ai/dashboard' : 'platform.openai.com/api-keys'}`,
            'Ensure key has embedding permissions enabled',
          ],
        };
      }

      if (isRateLimit) {
        // Rate limit during validation still means the key is valid
        return {
          valid: true,
          provider: providerName,
          warning: 'API key valid but rate limited - may affect operations',
          httpStatus: response.status,
        };
      }

      // Other errors (500, etc.) - key might be valid, service issue
      return {
        valid: true,
        provider: providerName,
        warning: `Service returned error (${response.status}): ${errorMessage}`,
        httpStatus: response.status,
      };
    }

    return {
      valid: true,
      provider: providerName,
      reason: 'API key validated successfully',
    };

  } catch (error: unknown) {
    if (error instanceof Error) {
      void error.message;
    }
    clearTimeout(timeoutId);

    if (isAbortError(error)) {
      return {
        valid: false,
        provider: providerName,
        error: `API key validation timed out after ${timeoutMs}ms`,
        errorCode: 'E053',
        actions: [
          'Check network connectivity',
          'Retry startup - may be transient',
          'Consider using local model: EMBEDDINGS_PROVIDER=hf-local',
        ],
      };
    }

    // Network errors - can't determine key validity
    return {
      valid: false,
      provider: providerName,
      error: `Network error during validation: ${getErrorMessage(error)}`,
      errorCode: 'E053',
      actions: [
        'Check internet connectivity',
        'Verify firewall allows outbound HTTPS',
        'Retry startup - may be transient',
      ],
    };
  }
}
