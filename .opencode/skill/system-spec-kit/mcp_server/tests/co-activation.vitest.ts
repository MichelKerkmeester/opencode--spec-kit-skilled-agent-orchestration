// TEST: CO-ACTIVATION (vitest)
// Converted from: co-activation.test.ts (custom runner)
// Aligned with production co-activation.ts named exports
import { afterEach, describe, it, expect, vi } from 'vitest';
import * as coActivation from '../lib/cognitive/co-activation';

type CoActivationDb = Parameters<typeof coActivation.init>[0];
const coActivationExports = coActivation as unknown as Record<string, unknown>;
const CO_ACTIVATION_MODULE_PATHS = [
  '../lib/cognitive/co-activation',
  '../lib/cognitive/co-activation',
] as const;
const originalCoactivationStrength = process.env.SPECKIT_COACTIVATION_STRENGTH;

afterEach(() => {
  coActivation.init(null as unknown as CoActivationDb);
  if (originalCoactivationStrength === undefined) {
    delete process.env.SPECKIT_COACTIVATION_STRENGTH;
  } else {
    process.env.SPECKIT_COACTIVATION_STRENGTH = originalCoactivationStrength;
  }
  vi.resetModules();
});

describe('Co-Activation Module', () => {
  /* ───────────────────────────────────────────────────────────────
     Module Exports
  ──────────────────────────────────────────────────────────────── */

  describe('Module Exports', () => {
    // Production exports: CO_ACTIVATION_CONFIG (not CONFIG), init, isEnabled,
    // BoostScore, getRelatedMemories, populateRelatedMemories, spreadActivation
    const expectedExports = [
      'init',
      'isEnabled',
      'spreadActivation',
      'getRelatedMemories',
      'boostScore',
      'populateRelatedMemories',
      'CO_ACTIVATION_CONFIG',
    ];

    it.each(expectedExports)('Export "%s" exists', (exp) => {
      expect(coActivationExports[exp]).toBeDefined();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     CO_ACTIVATION_CONFIG values
  ──────────────────────────────────────────────────────────────── */

  describe('CO_ACTIVATION_CONFIG values', () => {
    it('boostFactor is 0.25 (configurable via SPECKIT_COACTIVATION_STRENGTH)', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.boostFactor).toBe(0.25);
    });

    it('maxRelated is 5', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.maxRelated).toBe(5);
    });

    it('minSimilarity is 70', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.minSimilarity).toBe(70);
    });

    it('enabled is a boolean', () => {
      expect(typeof coActivation.CO_ACTIVATION_CONFIG.enabled).toBe('boolean');
    });

    it('decayPerHop is 0.5', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.decayPerHop).toBe(0.5);
    });

    it('maxHops is 2', () => {
      expect(coActivation.CO_ACTIVATION_CONFIG.maxHops).toBe(2);
    });

    it('clamps SPECKIT_COACTIVATION_STRENGTH values consistently across live modules', async () => {
      process.env.SPECKIT_COACTIVATION_STRENGTH = '1.7';

      for (const modulePath of CO_ACTIVATION_MODULE_PATHS) {
        const mod = await import(modulePath);
        expect(mod.CO_ACTIVATION_CONFIG.boostFactor).toBe(1);
        vi.resetModules();
      }

      process.env.SPECKIT_COACTIVATION_STRENGTH = '-0.2';

      for (const modulePath of CO_ACTIVATION_MODULE_PATHS) {
        const mod = await import(modulePath);
        expect(mod.CO_ACTIVATION_CONFIG.boostFactor).toBe(0);
        vi.resetModules();
      }

      process.env.SPECKIT_COACTIVATION_STRENGTH = 'not-a-number';

      for (const modulePath of CO_ACTIVATION_MODULE_PATHS) {
        const mod = await import(modulePath);
        expect(mod.CO_ACTIVATION_CONFIG.boostFactor).toBe(0.25);
        vi.resetModules();
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     boostScore()
  ──────────────────────────────────────────────────────────────── */

  describe('boostScore()', () => {
    // Production signature: boostScore(baseScore, relatedCount, avgSimilarity)
    // R17 fan-effect divisor formula:
    // Raw_boost   = boostFactor * (relatedCount / maxRelated) * (avgSimilarity / 100)
    // Fan_divisor = sqrt(max(1, relatedCount))
    // Boost       = max(0, raw_boost / fan_divisor)
    // Result      = baseScore + boost

    it('No related memories returns base score', () => {
      expect(coActivation.boostScore(0.5, 0, 80)).toBe(0.5);
    });

    it('With related memories, score is boosted', () => {
      // PerNeighborBoost = 0.25 * (80/100) = 0.2
      // FanDivisor = sqrt(3) ≈ 1.732
      // Boost = 0.2 / 1.732 ≈ 0.11547
      // Result = 0.5 + 0.11547 ≈ 0.61547
      const boosted = coActivation.boostScore(0.5, 3, 80);
      const perNeighborBoost = 0.25 * (80 / 100);
      const expectedBoost = perNeighborBoost / Math.sqrt(3);
      expect(boosted).toBeCloseTo(0.5 + expectedBoost, 3);
    });

    it('Max related count and similarity', () => {
      // PerNeighborBoost = 0.25 * (100/100) = 0.25
      // FanDivisor = sqrt(5) ≈ 2.236
      // Boost = 0.25 / 2.236 ≈ 0.1118
      // Result = 0.5 + 0.1118 ≈ 0.6118
      const maxBoost = coActivation.boostScore(0.5, 5, 100);
      const expectedBoost = 0.25 / Math.sqrt(5);
      expect(maxBoost).toBeCloseTo(0.5 + expectedBoost, 3);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     init()
  ──────────────────────────────────────────────────────────────── */

  describe('init()', () => {
    // Production init(database) just sets db = database, does NOT throw on null
    // It accepts any Database.Database argument

    it('init(null) does not throw', () => {
      expect(() => coActivation.init(null as unknown as CoActivationDb)).not.toThrow();
    });

    it('isEnabled() returns boolean based on env var, not DB state', () => {
      expect(typeof coActivation.isEnabled()).toBe('boolean');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getRelatedMemories() without DB
  ──────────────────────────────────────────────────────────────── */

  describe('getRelatedMemories() without DB', () => {
    // Production returns [] when db is null (warns to console)

    it('Returns empty array without DB', () => {
      const result = coActivation.getRelatedMemories(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('Invalid memoryId returns empty array', () => {
      const result = coActivation.getRelatedMemories(-1);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('Filters malformed related_memories entries to only finite id/similarity pairs', () => {
      const fakeDb = {
        prepare: (sql: string) => {
          if (sql.includes('SELECT related_memories')) {
            return {
              get: () => ({
                related_memories: JSON.stringify([
                  { id: 2, similarity: 88.5 },
                  { id: '3', similarity: 91 },
                  { id: 4, similarity: Number.POSITIVE_INFINITY },
                  { id: 5, similarity: null },
                ]),
              }),
            };
          }

          return {
            all: (...ids: number[]) => ids.map((id) => ({
              id,
              title: `Memory ${id}`,
              spec_folder: 'specs/test',
              file_path: `specs/test/memory/${id}.md`,
              importance_tier: 'normal',
            })),
          };
        },
      };

      coActivation.init(fakeDb as unknown as CoActivationDb);
      const result = coActivation.getRelatedMemories(1);

      expect(result).toEqual([
        expect.objectContaining({ id: 2, similarity: 88.5 }),
      ]);
    });

    it('Batches related memory detail lookups with a single IN query', () => {
      const prepare = vi.fn((sql: string) => {
        if (sql.includes('SELECT related_memories')) {
          return {
            get: () => ({
              related_memories: JSON.stringify([
                { id: 2, similarity: 88.5 },
                { id: 3, similarity: 81.1 },
              ]),
            }),
          };
        }

        return {
          all: (...ids: number[]) => ids.map((id) => ({
            id,
            title: `Memory ${id}`,
            spec_folder: 'specs/test',
            file_path: `specs/test/memory/${id}.md`,
            importance_tier: 'normal',
          })),
        };
      });

      coActivation.init({ prepare } as unknown as CoActivationDb);
      const result = coActivation.getRelatedMemories(1, 2);

      expect(result.map((item) => item.id)).toEqual([2, 3]);
      expect(prepare).toHaveBeenCalledTimes(2);
      expect(prepare.mock.calls[1]?.[0]).toContain('WHERE id IN (?,?)');
    });

    it('Precomputes related memory counts with a single batched row fetch', () => {
      const prepare = vi.fn((sql: string) => ({
        all: (...ids: number[]) => ids.map((id) => ({
          id,
          related_memories: JSON.stringify([
            { id: id + 10, similarity: 90 },
            { id: id + 20, similarity: 85 },
          ]),
        })),
      }));

      coActivation.init({ prepare } as unknown as CoActivationDb);
      const counts = coActivation.getRelatedMemoryCounts([1, 2, 2]);

      expect(Array.from(counts.entries())).toEqual([
        [1, 2],
        [2, 2],
      ]);
      expect(prepare).toHaveBeenCalledTimes(1);
      expect(prepare.mock.calls[0]?.[0]).toContain('SELECT id, related_memories');
      expect(prepare.mock.calls[0]?.[0]).toContain('WHERE id IN (?,?)');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     spreadActivation() without DB
  ──────────────────────────────────────────────────────────────── */

  describe('spreadActivation() without DB', () => {
    // Production signature: spreadActivation(seedIds: number[], maxHops?, limit?)
    // Returns [] when db is null or seedIds is empty

    it('Returns empty array without DB', () => {
      const result = coActivation.spreadActivation([1]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('Empty seedIds returns empty array', () => {
      const result = coActivation.spreadActivation([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('getCausalNeighbors()', () => {
    it('hydrates causal neighbors with a single join query', () => {
      const prepare = vi.fn((_sql: string) => ({
        all: () => [
          {
            id: 9,
            title: 'Neighbor',
            spec_folder: 'specs/test',
            file_path: 'specs/test/memory/neighbor.md',
            importance_tier: 'important',
            similarity: 84,
          },
        ],
      }));

      coActivation.init({ prepare } as unknown as CoActivationDb);
      const result = coActivation.getCausalNeighbors(1);

      expect(result).toEqual([
        expect.objectContaining({ id: 9, similarity: 84 }),
      ]);
      expect(prepare).toHaveBeenCalledTimes(1);
      expect(prepare.mock.calls[0]?.[0]).toContain('JOIN memory_index');
      expect(prepare.mock.calls[0]?.[0]).toContain('WITH causal_neighbors');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     populateRelatedMemories() without DB
  ──────────────────────────────────────────────────────────────── */

  describe('populateRelatedMemories() without DB', () => {
    // Production signature: populateRelatedMemories(memoryId, vectorSearchFn): Promise<number>
    // Returns 0 when db is null

    it('Returns 0 without DB', async () => {
      const result = await coActivation.populateRelatedMemories(1, () => []);
      expect(result).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     C138: Pipeline Integration Tests
  ──────────────────────────────────────────────────────────────── */

  describe('C138: Post-RRF Pipeline Integration', () => {
    it('C138-T1: spreadActivation export is a function', () => {
      expect(typeof coActivation.spreadActivation).toBe('function');
    });

    it('C138-T2: CO_ACTIVATION_CONFIG has required pipeline fields', () => {
      const config = coActivation.CO_ACTIVATION_CONFIG;
      expect(config).toHaveProperty('boostFactor');
      expect(config).toHaveProperty('maxRelated');
      expect(config).toHaveProperty('decayPerHop');
      expect(config).toHaveProperty('maxHops');
      expect(config.maxHops).toBeGreaterThanOrEqual(1);
    });

    it('C138-T3: boostScore with max related and high similarity gives meaningful boost', () => {
      const base = 0.5;
      const boosted = coActivation.boostScore(base, 5, 95);
      expect(boosted).toBeGreaterThan(base);
      // RawBoost = 0.25 * (5/5) * (95/100) = 0.2375
      // FanDivisor = sqrt(5) ≈ 2.236
      // Boost = 0.2375 / 2.236 ≈ 0.10622
      // Result = 0.5 + 0.10622 ≈ 0.60622
      const rawBoost = 0.25 * (5 / 5) * (95 / 100);
      const expectedBoost = base + rawBoost / Math.sqrt(5);
      expect(boosted).toBeCloseTo(expectedBoost, 2);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T003: Fan-Effect Divisor (R17) Tests
  ──────────────────────────────────────────────────────────────── */

  describe('T003: Co-Activation Boost Behavior', () => {
    it('T003-1: boost scales sublinearly with relatedCount (R17 fan-effect divisor)', () => {
      const base = 0.5;
      const similarity = 90;
      // PerNeighborBoost = 0.25 * (90/100) = 0.225
      // Boost = perNeighborBoost / sqrt(relatedCount)
      const boosted1 = coActivation.boostScore(base, 1, similarity);
      const boosted5 = coActivation.boostScore(base, 5, similarity);
      // More related = LESS boost per neighbor (pure diminishing returns)
      expect(boosted5).toBeLessThan(boosted1);
      // Boost ratio should be 1/sqrt(5) ≈ 0.447 (purely diminishing)
      const boost1 = boosted1 - base;
      const boost5 = boosted5 - base;
      expect(boost5 / boost1).toBeCloseTo(1 / Math.sqrt(5), 1);
    });

    it('T003-2: no error when relatedCount=1', () => {
      expect(() => coActivation.boostScore(0.5, 1, 80)).not.toThrow();
      const result = coActivation.boostScore(0.5, 1, 80);
      expect(Number.isFinite(result)).toBe(true);
    });

    it('T003-3: relatedCount=0 returns base score unchanged', () => {
      expect(() => coActivation.boostScore(0.5, 0, 80)).not.toThrow();
      const result = coActivation.boostScore(0.5, 0, 80);
      expect(result).toBe(0.5);
    });

    it('T003-4: result is never negative', () => {
      const base = 0.5;
      for (const count of [1, 2, 3, 4, 5]) {
        const result = coActivation.boostScore(base, count, 100);
        expect(result).toBeGreaterThanOrEqual(base);
      }
    });

    it('T003-5: boost formula is correct for relatedCount=4', () => {
      // PerNeighborBoost = 0.25 * (80/100) = 0.2
      // FanDivisor = sqrt(4) = 2
      // Boost = 0.2 / 2 = 0.1
      // Result = 0.5 + 0.1 = 0.6
      const result = coActivation.boostScore(0.5, 4, 80);
      const perNeighborBoost = 0.25 * (80 / 100);
      const expected = 0.5 + perNeighborBoost / Math.sqrt(4);
      expect(result).toBeCloseTo(expected, 5);
    });

    it('T003-6: max boost with relatedCount=5 and similarity=100', () => {
      const base = 0.5;
      const result = coActivation.boostScore(base, 5, 100);
      // PerNeighborBoost = 0.25 * 1 = 0.25
      // FanDivisor = sqrt(5) ≈ 2.236
      // Boost = 0.25 / 2.236 ≈ 0.1118
      expect(result).toBeCloseTo(base + 0.25 / Math.sqrt(5), 5);
    });
  });
});
