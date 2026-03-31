// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Feedback Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for ccc_feedback — accepts search result quality feedback.

import { appendFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

export interface FeedbackArgs {
  query: string;
  resultFile?: string;
  rating: 'helpful' | 'not_helpful' | 'partial';
  comment?: string;
}

/** Handle ccc_feedback tool call */
export async function handleCccFeedback(args: FeedbackArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.query || !args.rating) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: 'Missing required fields: query, rating',
          }),
        }],
      };
    }

    const projectRoot = process.cwd();
    const feedbackPath = resolve(projectRoot, '.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl');

    // Ensure feedback directory exists
    mkdirSync(dirname(feedbackPath), { recursive: true });

    const entry = {
      timestamp: new Date().toISOString(),
      query: args.query,
      resultFile: args.resultFile ?? null,
      rating: args.rating,
      comment: args.comment ?? null,
    };

    appendFileSync(feedbackPath, JSON.stringify(entry) + '\n', 'utf-8');

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            recorded: true,
            feedbackFile: feedbackPath,
            entry,
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `ccc_feedback failed: ${err instanceof Error ? err.message : String(err)}`,
        }),
      }],
    };
  }
}
