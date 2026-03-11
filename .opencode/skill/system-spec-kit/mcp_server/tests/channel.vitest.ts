// ---------------------------------------------------------------
// TEST: CHANNEL ATTRIBUTION
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import {
  attributeChannels,
  computeExclusiveContributionRate,
  getChannelAttribution,
  type AttributedResult,
} from '../lib/eval/channel-attribution';

describe('Channel Attribution (T511)', () => {
  it('T511-01: attributeChannels tags single-source results as exclusive', () => {
    const attributed = attributeChannels(
      [{ memoryId: 101, score: 0.99, rank: 1 }],
      { vector: [101] },
    );

    expect(attributed).toHaveLength(1);
    expect(attributed[0].channels).toEqual(new Set(['vector']));
    expect(attributed[0].isExclusive).toBe(true);
    expect(attributed[0].exclusiveChannel).toBe('vector');
  });

  it('T511-02: attributeChannels tags converged results with multiple channels', () => {
    const attributed = attributeChannels(
      [{ memoryId: 202, score: 0.88, rank: 1 }],
      { vector: [202], bm25: [202] },
    );

    expect(attributed).toHaveLength(1);
    expect(attributed[0].channels).toEqual(new Set(['vector', 'bm25']));
    expect(attributed[0].isExclusive).toBe(false);
    expect(attributed[0].exclusiveChannel).toBeUndefined();
  });

  it('T511-03: attributeChannels keeps unmatched results as unattributed', () => {
    const attributed = attributeChannels(
      [{ memoryId: 303, score: 0.75, rank: 1 }],
      { vector: [999] },
    );

    expect(attributed).toHaveLength(1);
    expect(attributed[0].channels.size).toBe(0);
    expect(attributed[0].isExclusive).toBe(false);
    expect(attributed[0].exclusiveChannel).toBeUndefined();
  });

  it('T511-04: computeExclusiveContributionRate computes ECR for mixed exclusives', () => {
    const attributed: AttributedResult[] = [
      { memoryId: 1, score: 0.99, rank: 1, channels: new Set(['vector']), isExclusive: true, exclusiveChannel: 'vector' },
      { memoryId: 2, score: 0.95, rank: 2, channels: new Set(['vector', 'bm25']), isExclusive: false },
      { memoryId: 3, score: 0.90, rank: 3, channels: new Set(['bm25']), isExclusive: true, exclusiveChannel: 'bm25' },
    ];

    const ecr = computeExclusiveContributionRate(attributed, 3);
    const vector = ecr.find(entry => entry.channel === 'vector');
    const bm25 = ecr.find(entry => entry.channel === 'bm25');

    expect(vector).toBeDefined();
    expect(bm25).toBeDefined();
    expect(vector!.exclusiveCount).toBe(1);
    expect(bm25!.exclusiveCount).toBe(1);
    expect(vector!.totalInTopK).toBe(3);
    expect(bm25!.totalInTopK).toBe(3);
    expect(vector!.ecr).toBeCloseTo(1 / 3, 6);
    expect(bm25!.ecr).toBeCloseTo(1 / 3, 6);
  });

  it('T511-05: computeExclusiveContributionRate respects top-K rank cutoff', () => {
    const attributed: AttributedResult[] = [
      { memoryId: 30, score: 0.70, rank: 3, channels: new Set(['graph']), isExclusive: true, exclusiveChannel: 'graph' },
      { memoryId: 10, score: 0.99, rank: 1, channels: new Set(['vector']), isExclusive: true, exclusiveChannel: 'vector' },
      { memoryId: 20, score: 0.85, rank: 2, channels: new Set(['bm25']), isExclusive: true, exclusiveChannel: 'bm25' },
    ];

    const ecr = computeExclusiveContributionRate(attributed, 2);
    const channels = ecr.map(entry => entry.channel).sort();

    expect(channels).toEqual(['bm25', 'vector']);
    expect(ecr.every(entry => entry.totalInTopK === 2)).toBe(true);
  });

  it('T511-06: computeExclusiveContributionRate returns [] for empty input', () => {
    expect(computeExclusiveContributionRate([], 10)).toEqual([]);
  });

  it('T511-07: getChannelAttribution aggregates counts and coverage for mixed results', () => {
    const report = getChannelAttribution(
      [
        { memoryId: 1, score: 0.99, rank: 1 },
        { memoryId: 2, score: 0.95, rank: 2 },
        { memoryId: 3, score: 0.90, rank: 3 },
        { memoryId: 4, score: 0.80, rank: 4 },
      ],
      {
        vector: [1, 2],
        bm25: [2, 3],
        graph: [4],
      },
      3,
    );

    expect(report.totalResults).toBe(3);
    expect(report.singleChannelCount).toBe(2);
    expect(report.multiChannelCount).toBe(1);
    expect(report.unattributedCount).toBe(0);
    expect(report.channelCoverage).toEqual({ vector: 2, bm25: 2 });
  });

  it('T511-08: getChannelAttribution handles single-channel edge case', () => {
    const report = getChannelAttribution(
      [
        { memoryId: 501, score: 0.90, rank: 2 },
        { memoryId: 500, score: 0.95, rank: 1 },
      ],
      { trigger: [500, 501, 502] },
      2,
    );

    expect(report.totalResults).toBe(2);
    expect(report.singleChannelCount).toBe(2);
    expect(report.multiChannelCount).toBe(0);
    expect(report.unattributedCount).toBe(0);
    expect(report.channelCoverage).toEqual({ trigger: 2 });
    expect(report.channelECRs).toHaveLength(1);
    expect(report.channelECRs[0]).toMatchObject({
      channel: 'trigger',
      exclusiveCount: 2,
      totalInTopK: 2,
      ecr: 1,
    });
  });
});
