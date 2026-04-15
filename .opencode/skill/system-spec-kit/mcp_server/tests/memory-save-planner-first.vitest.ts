import { describe, expect, it } from 'vitest';

import {
  buildPlannerResponse,
  serializePlannerAdvisory,
  serializePlannerBlocker,
  serializePlannerFollowUpAction,
  serializePlannerProposedEdit,
  serializePlannerRouteTarget,
} from '../handlers/save/response-builder';

describe('memory-save planner-first response contract', () => {
  it('builds a planner-mode MCP response with route targets, edits, advisories, and follow-up actions', () => {
    const response = buildPlannerResponse({
      planner: {
        filePath: '/tmp/source-memory.md',
        specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
        title: 'Save Flow Planner First',
        status: 'planned',
        message: 'Planner prepared a non-mutating canonical save plan.',
        plannerMode: 'plan-only',
        routeTarget: serializePlannerRouteTarget({
          routeCategory: 'narrative_progress',
          targetDocPath: '/tmp/implementation-summary.md',
          canonicalFilePath: '/tmp/implementation-summary.md',
          targetAnchorId: 'what-built',
          mergeMode: 'append-as-paragraph',
        }),
        proposedEdits: [
          serializePlannerProposedEdit({
            targetDocPath: '/tmp/implementation-summary.md',
            targetAnchorId: 'what-built',
            mergeMode: 'append-as-paragraph',
            routeCategory: 'narrative_progress',
            summary: 'Append the routed progress update to the canonical implementation summary.',
            contentPreview: 'Implemented planner-first save routing.',
          }),
        ],
        blockers: [],
        advisories: [
          serializePlannerAdvisory({
            code: 'QUALITY_LOOP_ADVISORY',
            message: 'Quality loop would apply 1 fix in full-auto mode.',
            routeCategory: 'narrative_progress',
            targetDocPath: '/tmp/implementation-summary.md',
            targetAnchorId: 'what-built',
          }),
        ],
        followUpActions: [
          serializePlannerFollowUpAction({
            action: 'apply',
            title: 'Apply canonical save',
            description: 'Run the canonical atomic writer in explicit full-auto mode.',
            args: {
              filePath: '/tmp/source-memory.md',
              plannerMode: 'full-auto',
              routeAs: 'narrative_progress',
            },
          }),
          serializePlannerFollowUpAction({
            action: 'refresh-graph',
            title: 'Refresh graph metadata',
            description: 'Refresh graph metadata after the canonical save is applied.',
            tool: 'refreshGraphMetadata',
            args: {
              specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
            },
          }),
          serializePlannerFollowUpAction({
            action: 'reindex',
            title: 'Reindex touched spec docs',
            description: 'Run incremental indexing after the canonical save is applied.',
            tool: 'reindexSpecDocs',
            args: {
              specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
            },
          }),
          serializePlannerFollowUpAction({
            action: 'enrich',
            title: 'Run enrichment backfill',
            description: 'Backfill deferred enrichment work after the canonical save is applied.',
            tool: 'runEnrichmentBackfill',
            args: {
              specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
            },
          }),
        ],
      },
    });

    const payload = JSON.parse(String(response.content?.[0]?.text ?? '{}'));

    expect(response.isError).toBe(false);
    expect(payload.data).toEqual(expect.objectContaining({
      status: 'planned',
      filePath: '/tmp/source-memory.md',
      specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
      title: 'Save Flow Planner First',
      plannerMode: 'plan-only',
      routeTarget: expect.objectContaining({
        routeCategory: 'narrative_progress',
        targetDocPath: '/tmp/implementation-summary.md',
        targetAnchorId: 'what-built',
        mergeMode: 'append-as-paragraph',
      }),
      proposedEdits: [
        expect.objectContaining({
          targetDocPath: '/tmp/implementation-summary.md',
          targetAnchorId: 'what-built',
          routeCategory: 'narrative_progress',
        }),
      ],
      blockers: [],
      advisories: [
        expect.objectContaining({
          code: 'QUALITY_LOOP_ADVISORY',
          routeCategory: 'narrative_progress',
        }),
      ],
      followUpActions: [
        expect.objectContaining({
          action: 'apply',
          args: expect.objectContaining({
            plannerMode: 'full-auto',
            routeAs: 'narrative_progress',
          }),
        }),
        expect.objectContaining({
          action: 'refresh-graph',
          tool: 'refreshGraphMetadata',
        }),
        expect.objectContaining({
          action: 'reindex',
          tool: 'reindexSpecDocs',
        }),
        expect.objectContaining({
          action: 'enrich',
          tool: 'runEnrichmentBackfill',
        }),
      ],
      message: 'Planner prepared a non-mutating canonical save plan.',
    }));
    expect(payload.hints).toEqual(expect.arrayContaining([
      'Planner prepared 1 proposed edit(s) for /tmp/implementation-summary.md',
      'Available follow-up actions: apply, refresh-graph, reindex, enrich',
      '1 advisory warning(s) remain after structural planning checks',
    ]));
  });

  it('preserves blocker-driven follow-up guidance in the planner response', () => {
    const response = buildPlannerResponse({
      planner: {
        filePath: '/tmp/source-memory.md',
        specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
        title: 'Save Flow Planner First',
        status: 'blocked',
        message: 'Planner found blocker(s) during canonical preparation.',
        plannerMode: 'plan-only',
        routeTarget: serializePlannerRouteTarget({
          routeCategory: 'task_update',
          targetDocPath: '/tmp/tasks.md',
          targetAnchorId: 'phase-1',
        }),
        proposedEdits: [],
        blockers: [
          serializePlannerBlocker({
            code: 'PLANNER_BLOCKER',
            message: 'No matching task line found for T999',
            routeCategory: 'task_update',
            targetDocPath: '/tmp/tasks.md',
            targetAnchorId: 'phase-1',
          }),
        ],
        advisories: [],
        followUpActions: [
          serializePlannerFollowUpAction({
            action: 'apply',
            title: 'Retry with full-auto after fixing blockers',
            description: 'Fix the blocker, then request explicit full-auto mode.',
            args: {
              filePath: '/tmp/source-memory.md',
              plannerMode: 'full-auto',
              routeAs: 'task_update',
              targetAnchorId: 'phase-1',
            },
          }),
        ],
      },
    });

    const payload = JSON.parse(String(response.content?.[0]?.text ?? '{}'));

    expect(payload.data.blockers).toEqual([
      expect.objectContaining({
        code: 'PLANNER_BLOCKER',
        message: 'No matching task line found for T999',
      }),
    ]);
    expect(payload.data.followUpActions).toEqual([
      expect.objectContaining({
        action: 'apply',
        args: expect.objectContaining({
          plannerMode: 'full-auto',
          routeAs: 'task_update',
          targetAnchorId: 'phase-1',
        }),
      }),
    ]);
    expect(payload.hints).toEqual(expect.arrayContaining([
      'Available follow-up actions: apply',
      'Resolve planner blockers before requesting full-auto apply mode',
    ]));
  });
});
