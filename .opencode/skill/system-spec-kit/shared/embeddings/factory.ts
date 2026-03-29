// ---------------------------------------------------------------
// MODULE: Factory
// ---------------------------------------------------------------

import { HfLocalProvider } from './providers/hf-local.js';
import { OpenAIProvider, MODEL_DIMENSIONS as OPENAI_MODEL_DIMENSIONS } from './providers/openai.js';
import { VoyageProvider, MODEL_DIMENSIONS as VOYAGE_MODEL_DIMENSIONS, resolveVoyageBaseUrl } from './providers/voyage.js';
import type {
  IEmbeddingProvider,
  ProviderResolution,
  ProviderInfo,
  CreateProviderOptions,
  ApiKeyValidationResult,
} from '../types.js';

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

type SupportedProviderName = 'voyage' | 'openai' | 'hf-local';
type ConfiguredProviderName = SupportedProviderName | 'auto';
type ProviderFactoryMetadata = {
  requestedProvider: string;
  effectiveProvider: string;
  fallbackReason?: string;
  dimensionChanged: boolean;
};

type ProviderInfoWithFallback = ProviderInfo & ProviderFactoryMetadata;

type StartupEmbeddingConfig = {
  resolution: ProviderResolution;
  info: ProviderInfoWithFallback;
  dimension: number;
  validation: ApiKeyValidationResult;
};

interface ValidateApiKeyOptions {
  timeout?: number;
  provider?: SupportedProviderName;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

let lastProviderFactoryMetadata: ProviderFactoryMetadata | null = null;
let lastProviderFactoryFingerprint: string | null = null;

const providerValidationCache = new Map<string, Promise<ApiKeyValidationResult>>();

export const SUPPORTED_PROVIDERS = ['openai', 'voyage', 'hf-local', 'auto'] as const;
const SUPPORTED_PROVIDER_SET: ReadonlySet<string> = new Set(SUPPORTED_PROVIDERS);

const DEFAULT_PROVIDER_MODELS: Readonly<Record<SupportedProviderName, string>> = {
  voyage: 'voyage-4',
  openai: 'text-embedding-3-small',
  'hf-local': 'nomic-ai/nomic-embed-text-v1.5',
};

// Correctness: one canonical dimension map for startup and runtime
export const VALID_PROVIDER_DIMENSIONS = Object.freeze({
  voyage: Object.freeze({ ...VOYAGE_MODEL_DIMENSIONS }),
  openai: Object.freeze({ ...OPENAI_MODEL_DIMENSIONS }),
  'hf-local': Object.freeze({
    'nomic-ai/nomic-embed-text-v1.5': 768,
  }),
} satisfies Record<SupportedProviderName, Readonly<Record<string, number>>>);

function normalizeProviderName(value: string | undefined | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function getExplicitProviderOverride(): ConfiguredProviderName | null {
  const explicitProvider = normalizeProviderName(process.env.EMBEDDINGS_PROVIDER);
  if (!explicitProvider) {
    return null;
  }

  return validateConfiguredEmbeddingsProvider(explicitProvider);
}

function getValidDimensionsForProvider(provider: SupportedProviderName): number[] {
  return Array.from(new Set(Object.values(VALID_PROVIDER_DIMENSIONS[provider]))).sort((left, right) => left - right);
}

function resolveConfiguredModel(provider: SupportedProviderName, model?: string): string {
  if (typeof model === 'string' && model.trim().length > 0) {
    return model.trim();
  }

  switch (provider) {
    case 'voyage':
      return process.env.VOYAGE_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS.voyage;
    case 'openai':
      return process.env.OPENAI_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS.openai;
    case 'hf-local':
    default:
      return process.env.HF_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS['hf-local'];
  }
}

function isSupportedProviderName(value: string): value is ConfiguredProviderName {
  return SUPPORTED_PROVIDER_SET.has(value);
}

function toSupportedProviderName(provider: string): SupportedProviderName {
  const normalized = normalizeProviderName(provider);
  if (!normalized || normalized === 'auto' || !isSupportedProviderName(normalized)) {
    throw new Error(`Invalid EMBEDDINGS_PROVIDER "${provider}". Supported: ${SUPPORTED_PROVIDERS.join(', ')}`);
  }
  return normalized as SupportedProviderName;
}

function allowsAutomaticFallback(provider: string | undefined): boolean {
  const normalized = normalizeProviderName(provider);
  return normalized === null || normalized === 'auto';
}

function buildProviderConfigFingerprint(provider: string): string {
  return JSON.stringify({
    provider,
    EMBEDDINGS_PROVIDER: process.env.EMBEDDINGS_PROVIDER || '',
    VOYAGE_API_KEY: process.env.VOYAGE_API_KEY || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL || '',
    OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || '',
    HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || '',
  });
}

function setLastProviderFactoryMetadata(metadata: ProviderFactoryMetadata): void {
  lastProviderFactoryMetadata = metadata;
  lastProviderFactoryFingerprint = buildProviderConfigFingerprint(metadata.requestedProvider);
}

function getProviderFactoryMetadataForCurrentConfig(resolution: ProviderResolution): ProviderFactoryMetadata {
  const fingerprint = buildProviderConfigFingerprint(resolution.name);
  if (lastProviderFactoryMetadata && lastProviderFactoryFingerprint === fingerprint) {
    return lastProviderFactoryMetadata;
  }

  return {
    requestedProvider: resolution.name,
    effectiveProvider: resolution.name,
    dimensionChanged: false,
  };
}

function attachFactoryMetadata(provider: IEmbeddingProvider, metadata: ProviderFactoryMetadata): IEmbeddingProvider {
  Object.assign(provider as IEmbeddingProvider & { factoryMetadata?: ProviderFactoryMetadata }, {
    factoryMetadata: metadata,
  });
  setLastProviderFactoryMetadata(metadata);
  return provider;
}

function getProviderInfoForResolution(resolution: ProviderResolution): ProviderInfoWithFallback {
  const explicitProvider = validateConfiguredEmbeddingsProvider();
  const metadata = getProviderFactoryMetadataForCurrentConfig(resolution);
  const reason = metadata.fallbackReason
    ? `Fallback from ${metadata.requestedProvider} to ${metadata.effectiveProvider}: ${metadata.fallbackReason}`
    : resolution.reason;

  return {
    provider: metadata.effectiveProvider,
    requestedProvider: metadata.requestedProvider,
    effectiveProvider: metadata.effectiveProvider,
    fallbackReason: metadata.fallbackReason,
    dimensionChanged: metadata.dimensionChanged,
    reason,
    config: {
      EMBEDDINGS_PROVIDER: explicitProvider || 'auto',
      VOYAGE_API_KEY: process.env.VOYAGE_API_KEY ? '***set***' : 'not set',
      VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL || 'voyage-4',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***set***' : 'not set',
      OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small',
      HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || 'nomic-ai/nomic-embed-text-v1.5',
    },
  };
}

export function validateConfiguredEmbeddingsProvider(value: string | undefined = process.env.EMBEDDINGS_PROVIDER): ConfiguredProviderName | null {
  const normalized = normalizeProviderName(value);
  if (!normalized) {
    return null;
  }

  // Startup: fail-fast on unsupported provider names
  if (!isSupportedProviderName(normalized)) {
    throw new Error(`Invalid EMBEDDINGS_PROVIDER "${value}". Supported: ${SUPPORTED_PROVIDERS.join(', ')}`);
  }

  return normalized;
}

export function resolveProviderDimension(
  provider: string,
  options: Pick<CreateProviderOptions, 'model' | 'dim'> = {},
): number {
  const supportedProvider = toSupportedProviderName(provider);
  const dimensionsByModel: Readonly<Record<string, number>> = VALID_PROVIDER_DIMENSIONS[supportedProvider];
  const configuredDim = typeof options.dim === 'number' && Number.isFinite(options.dim) && options.dim > 0
    ? Math.trunc(options.dim)
    : null;

  if (configuredDim !== null) {
    return configuredDim;
  }

  const configuredModel = resolveConfiguredModel(supportedProvider, options.model);
  const modelDimension = dimensionsByModel[configuredModel];
  if (typeof modelDimension === 'number') {
    return modelDimension;
  }

  const [fallbackDimension] = getValidDimensionsForProvider(supportedProvider);
  return dimensionsByModel[DEFAULT_PROVIDER_MODELS[supportedProvider]] ?? fallbackDimension;
}

function resolveStartupEmbeddingDimension(resolution: ProviderResolution): number {
  if (process.env.EMBEDDING_DIM) {
    const explicitDimension = parseInt(process.env.EMBEDDING_DIM, 10);
    if (Number.isFinite(explicitDimension) && explicitDimension > 0) {
      return explicitDimension;
    }
  }

  return resolveProviderDimension(resolution.name);
}

export function getStartupEmbeddingDimension(): number {
  return resolveStartupEmbeddingDimension(resolveProvider());
}

export async function resolveStartupEmbeddingConfig(
  options: Pick<ValidateApiKeyOptions, 'timeout'> = {},
): Promise<StartupEmbeddingConfig> {
  const resolution = resolveProvider();
  const validation = await validateApiKey({
    timeout: options.timeout,
    provider: resolution.name as SupportedProviderName,
  });

  return {
    resolution,
    info: getProviderInfoForResolution(resolution),
    dimension: resolveStartupEmbeddingDimension(resolution),
    validation,
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
  const explicitProvider = getExplicitProviderOverride();
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

function createProviderInstance(
  providerName: SupportedProviderName,
  options: CreateProviderOptions,
): IEmbeddingProvider {
  switch (providerName) {
    case 'voyage':
      if (!process.env.VOYAGE_API_KEY && !options.apiKey) {
        throw new Error(
          'Voyage provider requires VOYAGE_API_KEY. ' +
          'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
        );
      }
      if (options.maxTextLength) {
        console.warn('[factory] VoyageProvider does not support maxTextLength option - ignored');
      }
      return new VoyageProvider({
        model: options.model,
        dim: options.dim,
        apiKey: options.apiKey,
        baseUrl: options.baseUrl,
        timeout: options.timeout,
      });

    case 'openai':
      if (!process.env.OPENAI_API_KEY && !options.apiKey) {
        throw new Error(
          'OpenAI provider requires OPENAI_API_KEY. ' +
          'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
        );
      }
      if (options.maxTextLength) {
        console.warn('[factory] OpenAIProvider does not support maxTextLength option - ignored');
      }
      return new OpenAIProvider({
        model: options.model,
        dim: options.dim,
        apiKey: options.apiKey,
        baseUrl: options.baseUrl,
        timeout: options.timeout,
      });

    case 'hf-local':
      if (options.baseUrl) {
        console.warn('[factory] HfLocalProvider does not support baseUrl option - ignored');
      }
      return new HfLocalProvider({
        model: options.model,
        dim: options.dim,
        maxTextLength: options.maxTextLength,
        timeout: options.timeout,
      });

    default:
      throw new Error(
        `Unknown provider: ${providerName}. ` +
        'Valid values: voyage, openai, hf-local, auto'
      );
  }
}

function buildProviderValidationCacheKey(options: ValidateApiKeyOptions): string {
  const provider = options.provider || 'hf-local';
  const apiKey = options.apiKey
    || (provider === 'voyage' ? process.env.VOYAGE_API_KEY : process.env.OPENAI_API_KEY)
    || '';
  const baseUrl = options.baseUrl
    || (provider === 'voyage' ? resolveVoyageBaseUrl() : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'));
  const model = resolveConfiguredModel(provider, options.model);

  return JSON.stringify({ provider, apiKey, baseUrl, model });
}

async function ensureCloudProviderValidated(options: ValidateApiKeyOptions): Promise<ApiKeyValidationResult> {
  const providerName = options.provider;
  if (!providerName || providerName === 'hf-local') {
    return {
      valid: true,
      provider: 'hf-local',
      reason: 'Local provider - no API key required',
    };
  }

  const cacheKey = buildProviderValidationCacheKey(options);
  let validationPromise = providerValidationCache.get(cacheKey);
  if (!validationPromise) {
    validationPromise = validateApiKey(options);
    providerValidationCache.set(cacheKey, validationPromise);
  }

  const validation = await validationPromise;
  if (!validation.valid && !validation.networkError) {
    throw new Error(validation.error || `${providerName} API key validation failed`);
  }

  if (validation.networkError && validation.error) {
    console.warn(`[factory] API key validation warning for ${providerName}: ${validation.error}`);
  }

  return validation;
}

async function createFallbackProvider(
  requestedProvider: SupportedProviderName,
  options: CreateProviderOptions,
  fallbackReason: string,
  requestedDim: number,
): Promise<IEmbeddingProvider> {
  console.warn(`[factory] Attempting fallback from ${requestedProvider} to hf-local...`);
  const provider = createProviderInstance('hf-local', options);
  const fallbackDim = provider.getMetadata().dim;
  const dimensionChanged = requestedDim !== fallbackDim;

  if (dimensionChanged) {
    console.error(
      `[factory] WARNING: Provider fallback changed embedding dimension from ${requestedDim} to ${fallbackDim}. ` +
      `Vector index may need rebuilding. Existing ${requestedDim}-dim vectors are incompatible with ${fallbackDim}-dim vectors.`
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

  return attachFactoryMetadata(provider, {
    requestedProvider,
    effectiveProvider: 'hf-local',
    fallbackReason,
    dimensionChanged,
  });
}

// ---------------------------------------------------------------
// 2. PROVIDER FACTORY
// ---------------------------------------------------------------

/** Create provider instance based on configuration */
export async function createEmbeddingsProvider(options: CreateProviderOptions = {}): Promise<IEmbeddingProvider> {
  const resolution = resolveProvider();
  const providerName: SupportedProviderName = options.provider === 'auto' || !options.provider
    ? (resolution.name as SupportedProviderName)
    : toSupportedProviderName(options.provider);
  const requestedDim = resolveProviderDimension(providerName, {
    model: options.model,
    dim: options.dim,
  });

  console.error(`[factory] Using provider: ${providerName} (${resolution.reason})`);

  try {
    await ensureCloudProviderValidated({
      provider: providerName,
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      model: options.model,
      timeout: options.timeout,
    });

    const provider = createProviderInstance(providerName, options);

    if (options.warmup) {
      console.error(`[factory] Warming up ${providerName}...`);
      const success = await provider.warmup();
      if (!success) {
        console.warn(`[factory] Warmup failed for ${providerName}`);

        if ((providerName === 'openai' || providerName === 'voyage') && allowsAutomaticFallback(options.provider)) {
          return createFallbackProvider(
            providerName,
            options,
            `warmup failed for ${providerName}`,
            requestedDim,
          );
        }
      }
    }

    return attachFactoryMetadata(provider, {
      requestedProvider: providerName,
      effectiveProvider: providerName,
      dimensionChanged: false,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      void error.message;
    }
    console.error(`[factory] Error creating provider ${providerName}:`, getErrorMessage(error));

    // Fallback to hf-local for cloud providers when auto-detected (not explicitly set)
    if ((providerName === 'openai' || providerName === 'voyage') && allowsAutomaticFallback(options.provider)) {
      return createFallbackProvider(
        providerName,
        options,
        getErrorMessage(error),
        requestedDim,
      );
    }

    throw error;
  }
}

// ---------------------------------------------------------------
// 3. PROVIDER INFO
// ---------------------------------------------------------------

/** Get configuration information without creating the provider */
export function getProviderInfo(): ProviderInfoWithFallback {
  return getProviderInfoForResolution(resolveProvider());
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
export async function validateApiKey(options: ValidateApiKeyOptions = {}): Promise<ApiKeyValidationResult> {
  const timeoutMs = options.timeout || VALIDATION_TIMEOUT_MS;
  const providerName: SupportedProviderName = options.provider || (resolveProvider().name as SupportedProviderName);

  // Local providers don't need API key validation
  if (providerName === 'hf-local') {
    return {
      valid: true,
      provider: providerName,
      reason: 'Local provider - no API key required',
    };
  }

  // Check that API key environment variable is set
  const apiKey = options.apiKey || (providerName === 'voyage'
    ? process.env.VOYAGE_API_KEY
    : process.env.OPENAI_API_KEY);

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
    const baseUrl = options.baseUrl || (providerName === 'voyage'
      ? resolveVoyageBaseUrl()
      : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'));

    const model = resolveConfiguredModel(providerName, options.model);

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
        networkError: true,
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
      networkError: true,
      actions: [
        'Check internet connectivity',
        'Verify firewall allows outbound HTTPS',
        'Retry startup - may be transient',
      ],
    };
  }
}
