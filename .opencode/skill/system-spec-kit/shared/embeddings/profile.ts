// ---------------------------------------------------------------
// MODULE: Profile
// ---------------------------------------------------------------

import type { ParsedProfileSlug, ProfileJson } from '../types.js';

// ---------------------------------------------------------------
// 1. UTILITY FUNCTIONS
// ---------------------------------------------------------------

/** Create safe slug for filenames (e.g., openai__text-embedding-3-small__1536) */
export function createProfileSlug(provider: string, model: string, dim: number): string {
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();

  return `${provider}__${safeModel}__${dim}`;
}

/** Parse profile slug back to components */
export function parseProfileSlug(slug: string): ParsedProfileSlug | null {
  const parts = slug.split('__');
  if (parts.length !== 3) return null;

  const dim = parseInt(parts[2], 10);
  if (isNaN(dim)) return null;

  return {
    provider: parts[0],
    model: parts[1],
    dim,
  };
}

// ---------------------------------------------------------------
// 2. EMBEDDING PROFILE CLASS
// ---------------------------------------------------------------

interface EmbeddingProfileOptions {
  provider: string;
  model: string;
  dim: number;
  baseUrl?: string | null;
}

/** Provides embedding profile. */
export class EmbeddingProfile {
  provider: string;
  model: string;
  dim: number;
  baseUrl: string | null;
  slug: string;

  constructor({ provider, model, dim, baseUrl = null }: EmbeddingProfileOptions) {
    this.provider = provider;
    this.model = model;
    this.dim = dim;
    this.baseUrl = baseUrl;
    this.slug = createProfileSlug(provider, model, dim);
  }

  /** Get database path (legacy profile uses context-index.sqlite, others use slug) */
  getDatabasePath(baseDir: string): string {
    if (this.provider === 'hf-local' &&
        this.model.includes('nomic-embed-text') &&
        this.dim === 768) {
      return `${baseDir}/context-index.sqlite`;
    }
    return `${baseDir}/context-index__${this.slug}.sqlite`;
  }

  toDisplayString(): string {
    return `${this.provider}:${this.model}:${this.dim}`;
  }

  toJson(): ProfileJson {
    return {
      provider: this.provider,
      model: this.model,
      dim: this.dim,
      baseUrl: this.baseUrl,
      slug: this.slug,
    };
  }
}
