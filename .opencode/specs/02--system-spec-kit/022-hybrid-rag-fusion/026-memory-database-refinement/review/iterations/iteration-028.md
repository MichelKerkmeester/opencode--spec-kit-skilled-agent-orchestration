# Iteration 028: Embedding provider auto-detection

## Findings

### [P1] Auto-mode fallback can quietly downgrade from cloud embeddings to HF local while config introspection still reports the cloud provider
**File** `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts`, `.opencode/skill/system-spec-kit/shared/embeddings/README.md`

**Issue** `createEmbeddingsProvider()` automatically falls back from `voyage` or `openai` to `hf-local` whenever warmup fails or provider construction throws in auto mode, but that downgrade is only logged. The exported `getProviderInfo()` helper still reports the env-derived provider from `resolveProvider()`, not the provider actually returned after fallback. In practice that means operators can believe they are using Voyage or OpenAI while the runtime has already degraded to local 768-d embeddings with lower retrieval quality.

**Evidence** `factory.ts:322-356` falls back after warmup failure, and `factory.ts:364-395` falls back after creation/runtime setup errors. Both paths return the fallback provider instead of surfacing a structured downgrade result. `factory.ts:407-420` then reports `provider: resolution.name`, which is recomputed from environment variables and ignores any runtime fallback. The docs also frame this as a seamless behavior in `README.md:37-38` and `README.md:52-54`, increasing the chance that the downgrade is treated as normal rather than an operator-visible quality regression.

**Fix** Return structured fallback metadata from `createEmbeddingsProvider()` or persist the effective provider choice in a shared runtime state that `getProviderInfo()` reads. At minimum, expose `requestedProvider`, `effectiveProvider`, `fallbackReason`, and `dimensionChanged` so monitoring can distinguish “Voyage selected” from “Voyage key existed but runtime degraded to hf-local”.

### [P1] API key validation is optional and disconnected from provider/dimension resolution, so invalid cloud configs can progress into startup setup before validation runs
**File** `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts`

**Issue** The module exports a fail-fast `validateApiKey()` helper, but neither `getStartupEmbeddingDimension()` nor `createEmbeddingsProvider()` enforces that validation before provider selection and dimension resolution. Because of that separation, startup code can resolve a cloud provider and its embedding dimension, initialize downstream DB/profile state from that choice, and only later discover that the key is invalid or the provider is unreachable.

**Evidence** `factory.ts:167-181` resolves the startup embedding dimension directly from env/provider detection. `factory.ts:249-400` creates and optionally warms a provider, but it never calls `validateApiKey()`. The validation contract is only documented as “should be called during MCP server startup” in `factory.ts:436-441`, which means the preflight is advisory rather than enforced by the embedding factory itself. If callers use the startup-dimension helper before invoking validation, the cloud provider decision has already influenced initialization.

**Fix** Couple preflight validation to the first cloud-provider resolution path. A straightforward fix is to add a startup entrypoint that performs `resolveProvider()` plus `validateApiKey()` before exposing dimension/profile data, and make DB/profile initialization consume that validated result instead of re-deriving provider state independently.

### [P1] `dim` overrides are treated as authoritative profile/schema dimensions even though the providers never request matching output dimensions
**File** `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts`, `.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts`, `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts`, `.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts`, `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts`

**Issue** The factory accepts any positive `options.dim` and passes it into provider constructors, which then use that value as their expected embedding dimension and as part of the embedding profile/DB slug. But the actual provider requests never ask the remote model to emit that dimension, and the local model cannot change output width at all. That means non-default dimensions fail late at embedding time after the profile/database identity has already been built around an impossible schema.

**Evidence** `factory.ts:143-155` accepts any positive `dim` without validating that the chosen model can really produce it, and `factory.ts:269-305` forwards that `dim` to all providers. `openai.ts:98-99` and `voyage.ts:123-124` store the override as `this.dim`, but their request bodies only send `input`, `model`, and provider-specific metadata in `openai.ts:126-130` and `voyage.ts:144-152`; neither request includes an output-dimension parameter. `hf-local.ts:86-88` likewise accepts any override even though the model output is fixed. All three providers only discover the mismatch after generation in `openai.ts:217-220`, `voyage.ts:248-251`, and `hf-local.ts:219-220`. Meanwhile `profile.ts:55-70` encodes the chosen dimension into the profile slug and database filename.

**Fix** Fail fast unless the requested dimension is actually supported and actively requested from the provider. For OpenAI/Voyage, only accept override values that are sent in the API request and confirmed by the provider's supported-dimension map. For `hf-local`, reject any non-768 override up front. Profile/database construction should only use a validated effective dimension, never an unchecked caller override.

### [P2] Timeout handling is incomplete: HF local exposes a timeout knob that is never used, and cloud warmup has no overall budget beyond per-request retries
**File** `.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts`, `.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts`, `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts`

**Issue** The local provider advertises a per-embedding timeout, but inference never wraps model execution in any timeout logic, so a slow or hung local inference can block indefinitely. On the cloud side, each request has a 30s abort, but warmup is allowed to wait through the full retry chain because there is no end-to-end warmup deadline in the provider or factory layer.

**Evidence** `hf-local.ts:16-18` defines `EMBEDDING_TIMEOUT` and `MODEL_LOAD_TIMEOUT`, and `hf-local.ts:88` stores the embedding timeout on the instance, but `hf-local.ts:207-238` runs `await model(...)` without using `this.timeout`. For cloud providers, `openai.ts:16`, `openai.ts:99`, `openai.ts:116-117`, and `voyage.ts:16`, `voyage.ts:124`, `voyage.ts:141-142` only enforce per-request abort timers. Warmup then delegates to the retried request path in `openai.ts:256-270` and `voyage.ts:286-300`, so slow transient failures can consume the entire retry sequence before fallback or failure is decided.

**Fix** Add a real inference timeout wrapper around HF-local generation, not just model load. Separately, add a warmup-level deadline in the factory or provider layer so startup can cap total time spent on a slow cloud provider instead of waiting for every per-request retry window to elapse.

## Summary

The biggest problems are the hidden quality downgrade path and the late validation boundary: auto mode can degrade from Voyage/OpenAI to HF local without structured signaling, and the fail-fast API key check is not coupled to provider/dimension selection. I also found a concrete schema-safety bug where unchecked `dim` overrides become part of the profile/database identity even though the providers never request those dimensions, plus incomplete timeout enforcement for slow providers. I did not find a public batch-embedding surface in this directory, so I do not have a defensible per-item batch-loss finding from these files alone.
