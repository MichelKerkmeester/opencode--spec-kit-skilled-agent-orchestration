#!/usr/bin/env npx tsx
// ---------------------------------------------------------------
// MODULE: Smart Router Live Session Wrapper
// ---------------------------------------------------------------
// Observe-only helper for runtime wrappers. It records Read tool calls
// against .opencode/skill/* resources and never throws or blocks.

import * as path from 'node:path';
import * as fs from 'node:fs';

import { recordSmartRouterCompliance } from './smart-router-telemetry.js';
import { predictSmartRouterRoute } from './smart-router-measurement.js';

export interface SmartRouterSessionState {
  readonly promptId: string;
  readonly selectedSkill: string;
  readonly predictedRoute: readonly string[];
  readonly allowedResources: readonly string[];
  readonly workspaceRoot: string;
}

export interface ConfigureSmartRouterSessionInput {
  readonly promptId: string;
  readonly selectedSkill: string;
  readonly workspaceRoot?: string;
  readonly prompt?: string;
  readonly predictedRoute?: readonly string[];
  readonly allowedResources?: readonly string[];
}

export interface ToolCallLike {
  readonly tool?: string;
  readonly tool_name?: string;
  readonly toolName?: string;
  readonly name?: string;
}

type ToolArgs = Record<string, unknown> | undefined | null;

const UNKNOWN_RESOURCE = '__unknown_unparsed__';

function locateWorkspaceRoot(startDir = process.cwd()): string {
  let current = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(current, '.opencode', 'skill'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return path.resolve(startDir);
    }
    current = parent;
  }
}

function toolNameFor(tool: string | ToolCallLike): string {
  if (typeof tool === 'string') {
    return tool;
  }
  return tool.tool ?? tool.tool_name ?? tool.toolName ?? tool.name ?? '';
}

function stringArg(args: ToolArgs, keys: readonly string[]): string | null {
  if (!args) {
    return null;
  }
  for (const key of keys) {
    const value = args[key];
    if (typeof value === 'string') {
      return value;
    }
  }
  return null;
}

function normalizeReadPath(rawPath: string, workspaceRoot: string): {
  readonly selectedSkill: string;
  readonly resource: string;
} | null {
  const absolutePath = path.isAbsolute(rawPath)
    ? path.resolve(rawPath)
    : path.resolve(workspaceRoot, rawPath);
  const skillRoot = path.resolve(workspaceRoot, '.opencode', 'skill');
  const relative = path.relative(skillRoot, absolutePath).replace(/\\/g, '/');
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  const [selectedSkill, ...rest] = relative.split('/');
  if (!selectedSkill || rest.length === 0) {
    return null;
  }
  return {
    selectedSkill,
    resource: rest.join('/'),
  };
}

export function createLiveSessionWrapper(initialState?: SmartRouterSessionState) {
  let state = initialState ?? null;

  function configure(input: ConfigureSmartRouterSessionInput): SmartRouterSessionState {
    const workspaceRoot = path.resolve(input.workspaceRoot ?? locateWorkspaceRoot());
    const predicted = input.predictedRoute && input.allowedResources
      ? {
        predictedRoute: [...input.predictedRoute],
        allowedResources: [...input.allowedResources],
      }
      : predictSmartRouterRoute({
        workspaceRoot,
        skill: input.selectedSkill,
        prompt: input.prompt ?? '',
      });

    state = {
      promptId: input.promptId,
      selectedSkill: input.selectedSkill,
      predictedRoute: [...predicted.predictedRoute],
      allowedResources: [...predicted.allowedResources],
      workspaceRoot,
    };
    return state;
  }

  function getState(): SmartRouterSessionState | null {
    return state;
  }

  function onToolCall(tool: string | ToolCallLike, args?: ToolArgs): void {
    try {
      if (toolNameFor(tool) !== 'Read') {
        return;
      }
      const rawPath = stringArg(args, ['file_path', 'path', 'filePath']);
      if (!rawPath) {
        return;
      }
      const active = state;
      if (!active) {
        return;
      }
      const read = normalizeReadPath(rawPath, active.workspaceRoot);
      if (!read) {
        return;
      }

      recordSmartRouterCompliance({
        promptId: active.promptId,
        selectedSkill: active.selectedSkill,
        predictedRoute: [...active.predictedRoute],
        allowedResources: active.allowedResources.length > 0
          ? [...active.allowedResources]
          : [UNKNOWN_RESOURCE],
        actualReads: [read.resource],
      });
    } catch {
      // Observe-only: this wrapper must never alter runtime behavior.
    }
  }

  return {
    configure,
    getState,
    onToolCall,
  };
}

const defaultWrapper = createLiveSessionWrapper();

export function configureSmartRouterSession(input: ConfigureSmartRouterSessionInput): SmartRouterSessionState {
  return defaultWrapper.configure(input);
}

export function getSmartRouterSessionState(): SmartRouterSessionState | null {
  return defaultWrapper.getState();
}

export function onToolCall(tool: string | ToolCallLike, args?: ToolArgs): void {
  defaultWrapper.onToolCall(tool, args);
}
