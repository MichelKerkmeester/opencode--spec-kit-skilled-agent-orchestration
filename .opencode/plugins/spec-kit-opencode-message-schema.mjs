// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Spec Kit OpenCode Message Schema Helper                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// 2. SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const metadataSchema = z.record(z.string(), z.unknown());

const textPartSchema = z.object({
  id: z.string().min(1),
  sessionID: z.string().min(1),
  messageID: z.string().min(1),
  type: z.literal('text'),
  text: z.string(),
  synthetic: z.boolean().optional(),
  ignored: z.boolean().optional(),
  time: z.object({
    start: z.number(),
    end: z.number().optional(),
  }).optional(),
  metadata: metadataSchema.optional(),
}).strict();

const messageAnchorSchema = z.object({
  info: z.object({
    id: z.string().min(1),
    sessionID: z.string().min(1),
  }).passthrough(),
  parts: z.array(z.unknown()),
}).passthrough();

const unsafeMessageTransformPartTypes = new Set([
  'tool',
  'step-start',
  'step-finish',
  'snapshot',
  'patch',
  'retry',
  'compaction',
  'subtask',
  'agent',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether a messages-transform anchor has the minimum OpenCode shape we need.
 *
 * @param {unknown} value - Candidate anchor payload from the OpenCode hook.
 * @returns {boolean} True when the anchor exposes `info` and `parts` in the expected shape.
 */
export function isMessageAnchorLike(value) {
  return messageAnchorSchema.safeParse(value).success;
}

/**
 * Build a synthetic text part that matches the SDK's `TextPart` contract.
 *
 * @param {{
 *   id: string,
 *   sessionID: string,
 *   messageID: string,
 *   text: string,
 *   metadata?: Record<string, unknown>,
 * }} input - Synthetic part fields sourced from the transport plan and anchor.
 * @returns {null | {
 *   id: string,
 *   sessionID: string,
 *   messageID: string,
 *   type: 'text',
 *   text: string,
 *   synthetic?: boolean,
 *   ignored?: boolean,
 *   time?: { start: number, end?: number },
 *   metadata?: Record<string, unknown>,
 * }} A validated synthetic text part, or `null` when validation fails.
 */
export function createSyntheticTextPart({ id, sessionID, messageID, text, metadata }) {
  const candidate = {
    id,
    sessionID,
    messageID,
    type: 'text',
    text,
    synthetic: true,
    ...(metadata ? { metadata } : {}),
  };

  const parsed = textPartSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

/**
 * Check whether a synthetic part with the same metadata marker already exists.
 *
 * @param {unknown[]} parts - Existing anchor parts.
 * @param {string} markerKey - Metadata key used by the plugin for dedupe markers.
 * @param {string} dedupeKey - Transport-level dedupe identifier.
 * @returns {boolean} True when an existing synthetic text part already carries the marker.
 */
export function hasSyntheticTextPartMarker(parts, markerKey, dedupeKey) {
  return parts.some((part) => {
    const parsed = textPartSchema.safeParse(part);
    if (!parsed.success) {
      return false;
    }
    return parsed.data.metadata?.[markerKey] === dedupeKey;
  });
}

/**
 * Skip message mutation when the anchor already contains structural/tool parts.
 *
 * These richer assistant/tool-turn transcripts appear to be more sensitive to
 * post-hoc part injection than plain text turns.
 *
 * @param {unknown[]} parts - Existing anchor parts.
 * @returns {boolean} True when message injection should be skipped for safety.
 */
export function hasUnsafeMessageTransformParts(parts) {
  return parts.some((part) => {
    if (!part || typeof part !== 'object') {
      return false;
    }
    const partType = Reflect.get(part, 'type');
    return typeof partType === 'string' && unsafeMessageTransformPartTypes.has(partType);
  });
}
