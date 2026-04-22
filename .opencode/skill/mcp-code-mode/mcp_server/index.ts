#!/usr/bin/env node

// ---------------------------------------------------------------
// MODULE: MCP Code Mode Server Entry
// ---------------------------------------------------------------
// Entry point for the npx @utcp/mcp-bridge command.

import path, { dirname } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { format } from 'util';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import '@utcp/http';
import '@utcp/text';
import '@utcp/mcp';
import '@utcp/cli';
import '@utcp/dotenv-loader';
import '@utcp/file';

import {
    CallTemplateSchema,
    ensureCorePluginsInitialized,
    UtcpClientConfigSerializer
} from '@utcp/sdk';
import { CodeModeUtcpClient } from '@utcp/code-mode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function redirectConsoleStdoutToStderr(): void {
    const writeToStderr = (...args: unknown[]): void => {
        process.stderr.write(`${format(...args)}\n`);
    };

    // MCP stdio reserves stdout for JSON-RPC frames; library logs must not corrupt it.
    console.log = writeToStderr;
    console.info = writeToStderr;
    console.debug = writeToStderr;
}

redirectConsoleStdoutToStderr();

ensureCorePluginsInitialized();

let utcpClient: CodeModeUtcpClient | null = null;

type ToolResponse = { content: Array<{ type: "text"; text: string }> };
type CallTemplateInput = z.infer<typeof CallTemplateSchema>;

type ToolRegistrar = {
    registerTool: (
        name: string,
        config: {
            title: string;
            description: string;
            inputSchema: unknown;
        },
        handler: (input: Record<string, unknown>) => Promise<ToolResponse>
    ) => void;
};

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "object" && error !== null && "message" in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === "string") {
            return message;
        }
    }

    return String(error);
}

function getErrorCode(error: unknown): string | undefined {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code?: unknown }).code;
        if (typeof code === "string") {
            return code;
        }
    }

    return undefined;
}

async function main() {
    setupMcpTools();
    utcpClient = await initializeUtcpClient();
    const transport = new StdioServerTransport();
    await mcp.connect(transport);
}

const mcp = new McpServer({
    name: "CodeMode-MCP",
    version: "1.0.0",
});

function setupMcpTools() {
    const mcpTools = mcp as unknown as ToolRegistrar;

    // Register MCP prompt for using the code mode server
    mcp.registerPrompt("utcp_codemode_usage", {
        title: "UTCP Code Mode Usage Guide",
        description: "Comprehensive guide on how to use the UTCP Code Mode MCP server for executing TypeScript code with tool access."
    }, async () => {
        const codeInstructions = `# UTCP Code Mode MCP Server Usage Guide

You have access to a powerful UTCP Code Mode MCP server that allows you to execute TypeScript code with direct access to registered tools.

## Workflow: Always Follow This Pattern

### 1. 🔍 DISCOVER TOOLS FIRST
**Always start by searching for relevant tools before writing code:**
- Use \`search_tools\` with a description of your task to find relevant tools
- This returns tools with their TypeScript interfaces - study these carefully
- Use \`tool_info\` to get detailed interface information for specific tools if needed

${CodeModeUtcpClient.AGENT_PROMPT_TEMPLATE}

- in the call_tool_chain code, return the result that you want to see, your code will be wrapped in an async function and executed

Remember: The power of this system comes from combining multiple tools in sophisticated TypeScript code execution workflows.`;

        return {
            messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: codeInstructions
                }
            }]
        };
    });

    mcpTools.registerTool("register_manual", {
        title: "Register a UTCP Manual",
        description: "Registers a new tool provider by providing its call template.",
        inputSchema: { manual_call_template: CallTemplateSchema.describe("The call template for the UTCP Manual endpoint.") },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const manualCallTemplate = input.manual_call_template;
        try {
            const result = await client.registerManual(manualCallTemplate as CallTemplateInput);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        } catch (e: unknown) {
            return { content: [{ type: "text", text: JSON.stringify({ success: false, error: getErrorMessage(e) }) }] };
        }
    });

    mcpTools.registerTool("deregister_manual", {
        title: "Deregister a UTCP Manual",
        description: "Deregisters a tool provider from the UTCP client.",
        inputSchema: { manual_name: z.string().describe("The name of the manual to deregister.") },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const manualName = typeof input.manual_name === "string" ? input.manual_name : "";
        try {
            const success = await client.deregisterManual(manualName);
            const message = success ? `Manual '${manualName}' deregistered.` : `Manual '${manualName}' not found.`;
            return { content: [{ type: "text", text: JSON.stringify({ success, message }) }] };
        } catch (e: unknown) {
            return { content: [{ type: "text", text: JSON.stringify({ success: false, error: getErrorMessage(e) }) }] };
        }
    });

    mcpTools.registerTool("search_tools", {
        title: "Search for UTCP Tools",
        description: "Searches for relevant tools based on a task description.",
        inputSchema: {
            task_description: z.string().describe("A natural language description of the task."),
            limit: z.number().optional().default(10),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const taskDescription = typeof input.task_description === "string" ? input.task_description : "";
        const limit = typeof input.limit === "number" ? input.limit : 10;
        try {
            const tools = await client.searchTools(taskDescription, limit);
            const toolsWithInterfaces = tools.map(t => ({
                name: t.name,
                description: t.description,
                typescript_interface: client.toolToTypeScriptInterface(t)
            }));
            return { content: [{ type: "text", text: JSON.stringify({ tools: toolsWithInterfaces }) }] };
        } catch (e: unknown) {
            return { content: [{ type: "text", text: JSON.stringify({ success: false, error: getErrorMessage(e) }) }] };
        }
    });

    mcpTools.registerTool("list_tools", {
        title: "List All Registered UTCP Tools",
        description: "Returns a list of all tool names currently registered.",
        inputSchema: {},
    }, async () => {
        const client = await initializeUtcpClient();
        try {
            const tools = await client.config.tool_repository.getTools();
            const toolNames = tools.map(t => t.name);
            return { content: [{ type: "text", text: JSON.stringify({ tools: toolNames }) }] };
        } catch (e: unknown) {
            return { content: [{ type: "text", text: JSON.stringify({ success: false, error: getErrorMessage(e) }) }] };
        }
    });

    mcpTools.registerTool("get_required_keys_for_tool", {
        title: "Get Required Variables for Tool",
        description: "Get required environment variables for a registered tool.",
        inputSchema: {
            tool_name: z.string().describe("Name of the tool to get required variables for."),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const toolName = typeof input.tool_name === "string" ? input.tool_name : "";
        try {
            const variables = await client.getRequiredVariablesForRegisteredTool(toolName);
            return { content: [{ type: "text", text: JSON.stringify({ success: true, tool_name: toolName, required_variables: variables }) }] };
        } catch (e: unknown) {
            return { content: [{ type: "text", text: JSON.stringify({ success: false, tool_name: toolName, error: getErrorMessage(e) }) }] };
        }
    });

    mcpTools.registerTool("tool_info", {
        title: "Get Tool Information with TypeScript Interface",
        description: "Get complete information about a specific tool including TypeScript interface definition.",
        inputSchema: {
            tool_name: z.string().describe("Name of the tool to get complete information for."),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const toolName = typeof input.tool_name === "string" ? input.tool_name : "";
        try {
            const tool = await client.config.tool_repository.getTool(toolName);
            if (!tool) {
                return { content: [{ type: "text", text: JSON.stringify({ success: false, error: `Tool '${toolName}' not found` }) }] };
            }
            const typescript_interface = client.toolToTypeScriptInterface(tool);
            return { content: [{ type: "text", text: typescript_interface }] };
        } catch (e: unknown) {
            return { content: [{ type: "text", text: JSON.stringify({ success: false, error: getErrorMessage(e) }) }] };
        }
    });

    // Code Mode specific tools
    mcpTools.registerTool("call_tool_chain", {
        title: "Execute TypeScript Code with Tool Access",
        description: "Execute TypeScript code with direct access to all registered tools as hierarchical functions (e.g., manual.tool()).",
        inputSchema: {
            code: z.string().describe("TypeScript code to execute with access to all registered tools."),
            timeout: z.number().optional().default(30000).describe("Optional timeout in milliseconds (default: 30000)."),
            max_output_size: z.number().optional().default(200000).describe("Optional maximum output size in characters (default: 200000)."),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const code = typeof input.code === "string" ? input.code : "";
        const timeout = typeof input.timeout === "number" ? input.timeout : 30000;
        const maxOutputSize = typeof input.max_output_size === "number" ? input.max_output_size : 200000;
        try {
            const { result, logs } = await client.callToolChain(code, timeout);
            const content = JSON.stringify({ success: true, result, logs })
            if (content.length > maxOutputSize) {
                return { content: [{ type: "text", text: content.slice(0, maxOutputSize) + "...\nmax_output_size exceeded" }] };
            }
            return { content: [{ type: "text", text: content }] };
        } catch (e: unknown) {
            return { content: [{ type: "text", text: JSON.stringify({ success: false, error: getErrorMessage(e) }) }] };
        }
    });

}

async function initializeUtcpClient(): Promise<CodeModeUtcpClient> {
    if (utcpClient) {
        return utcpClient;
    }

    // Look for config file: 1) Environment variable, 2) Current working directory, 3) Package directory
    const cwd = process.cwd();
    const packageDir = __dirname;
    
    let configPath: string;
    let scriptDir: string;
    
    // Check if UTCP_CONFIG_FILE environment variable is set
    if (process.env.UTCP_CONFIG_FILE) {
        configPath = path.resolve(process.env.UTCP_CONFIG_FILE);
        scriptDir = path.dirname(configPath);
        
        try {
            await fs.access(configPath);
        } catch {
            console.warn(`UTCP config file specified in UTCP_CONFIG_FILE not found: ${configPath}`);
        }
    } else {
        // Fall back to current working directory first, then package directory
        configPath = path.resolve(cwd, '.utcp_config.json');
        scriptDir = cwd;
        
        try {
            await fs.access(configPath);
        } catch {
            configPath = path.resolve(packageDir, '.utcp_config.json');
            scriptDir = packageDir;
        }
    }

    let rawConfig: unknown = {};
    try {
        const configFileContent = await fs.readFile(configPath, 'utf-8');
        rawConfig = JSON.parse(configFileContent);
    } catch (e: unknown) {
        if (getErrorCode(e) !== 'ENOENT') {
            console.warn(`Could not read or parse .utcp_config.json. Error: ${getErrorMessage(e)}`);
        }
    }

    const safeRawConfig = typeof rawConfig === "object" && rawConfig !== null
        ? rawConfig as Record<string, unknown>
        : {};

    const clientConfig = new UtcpClientConfigSerializer().validateDict(safeRawConfig);

    const newClient = await CodeModeUtcpClient.create(scriptDir, clientConfig);

    utcpClient = newClient;
    return utcpClient;
}

main().catch(err => {
    console.error("Failed to start UTCP-MCP Bridge:", err);
    process.exit(1);
});
