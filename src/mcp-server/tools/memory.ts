/**
 * Memory Tools for MCP Server
 *
 * Provides in-memory storage for AI agents to maintain context
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// In-memory storage
interface MemoryEntry {
  value: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

const memory: Map<string, MemoryEntry> = new Map();

/**
 * Register memory tools with the MCP server
 */
export function registerMemoryTools(server: McpServer): void {
  // Store a value in memory
  server.tool(
    "memory_set",
    "Store a value in memory with an optional key and tags",
    {
      key: z.string().describe("Unique key to identify the stored value"),
      value: z.string().describe("Value to store"),
      tags: z
        .array(z.string())
        .optional()
        .default([])
        .describe("Tags for organizing and searching memory entries"),
    },
    async ({ key, value, tags }) => {
      const now = new Date();
      const existing = memory.get(key);

      memory.set(key, {
        value,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        tags: tags ?? [],
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Stored value with key '${key}'${tags?.length ? ` (tags: ${tags.join(", ")})` : ""}`,
          },
        ],
      };
    }
  );

  // Get a value from memory
  server.tool(
    "memory_get",
    "Retrieve a value from memory by key",
    {
      key: z.string().describe("Key of the value to retrieve"),
    },
    async ({ key }) => {
      const entry = memory.get(key);

      if (!entry) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No entry found for key '${key}'`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Key: ${key}
Value: ${entry.value}
Tags: ${entry.tags.length > 0 ? entry.tags.join(", ") : "(none)"}
Created: ${entry.createdAt.toISOString()}
Updated: ${entry.updatedAt.toISOString()}`,
          },
        ],
      };
    }
  );

  // Delete a value from memory
  server.tool(
    "memory_delete",
    "Delete a value from memory by key",
    {
      key: z.string().describe("Key of the value to delete"),
    },
    async ({ key }) => {
      const deleted = memory.delete(key);

      return {
        content: [
          {
            type: "text" as const,
            text: deleted
              ? `Deleted entry with key '${key}'`
              : `No entry found for key '${key}'`,
          },
        ],
      };
    }
  );

  // List all keys in memory
  server.tool(
    "memory_list",
    "List all keys stored in memory",
    {
      tag: z.string().optional().describe("Filter by tag"),
      limit: z
        .number()
        .optional()
        .default(50)
        .describe("Maximum number of entries to return"),
    },
    async ({ tag, limit }) => {
      let entries = Array.from(memory.entries());

      if (tag) {
        entries = entries.filter(([, entry]) => entry.tags.includes(tag));
      }

      entries = entries.slice(0, limit);

      if (entries.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: tag
                ? `No entries found with tag '${tag}'`
                : "Memory is empty",
            },
          ],
        };
      }

      const list = entries
        .map(([key, entry]) => {
          const tagsStr =
            entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
          return `- ${key}${tagsStr}`;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Memory entries (${entries.length}):\n${list}`,
          },
        ],
      };
    }
  );

  // Search memory by value content
  server.tool(
    "memory_search",
    "Search memory entries by value content or tags",
    {
      query: z.string().describe("Search query (searches in values and tags)"),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of results"),
    },
    async ({ query, limit }) => {
      const queryLower = query.toLowerCase();

      const results = Array.from(memory.entries())
        .filter(
          ([key, entry]) =>
            key.toLowerCase().includes(queryLower) ||
            entry.value.toLowerCase().includes(queryLower) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(queryLower))
        )
        .slice(0, limit);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No entries found matching '${query}'`,
            },
          ],
        };
      }

      const list = results
        .map(([key, entry]) => {
          const preview =
            entry.value.length > 100
              ? entry.value.substring(0, 100) + "..."
              : entry.value;
          return `Key: ${key}\nValue: ${preview}\nTags: ${entry.tags.join(", ") || "(none)"}\n`;
        })
        .join("\n---\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${results.length} matches:\n\n${list}`,
          },
        ],
      };
    }
  );

  // Clear all memory
  server.tool(
    "memory_clear",
    "Clear all entries from memory",
    {
      confirmClear: z
        .boolean()
        .describe("Must be true to confirm clearing all memory"),
    },
    async ({ confirmClear }) => {
      if (!confirmClear) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Clear operation cancelled. Set confirmClear to true to clear all memory.",
            },
          ],
        };
      }

      const count = memory.size;
      memory.clear();

      return {
        content: [
          {
            type: "text" as const,
            text: `Cleared ${count} entries from memory`,
          },
        ],
      };
    }
  );

  // Append to existing memory entry
  server.tool(
    "memory_append",
    "Append content to an existing memory entry",
    {
      key: z.string().describe("Key of the entry to append to"),
      value: z.string().describe("Value to append"),
      separator: z
        .string()
        .optional()
        .default("\n")
        .describe("Separator between existing and new value"),
    },
    async ({ key, value, separator }) => {
      const existing = memory.get(key);

      if (!existing) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No entry found for key '${key}'. Use memory_set to create a new entry.`,
            },
          ],
        };
      }

      const newValue = existing.value + separator + value;
      memory.set(key, {
        ...existing,
        value: newValue,
        updatedAt: new Date(),
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Appended content to key '${key}'`,
          },
        ],
      };
    }
  );

  // Get memory statistics
  server.tool(
    "memory_stats",
    "Get statistics about memory usage",
    {},
    async () => {
      const entries = Array.from(memory.values());
      const totalSize = entries.reduce((sum, e) => sum + e.value.length, 0);
      const allTags = new Set(entries.flatMap((e) => e.tags));

      return {
        content: [
          {
            type: "text" as const,
            text: `Memory Statistics:
- Total Entries: ${memory.size}
- Total Size: ${totalSize} characters
- Unique Tags: ${allTags.size}
- Tags: ${Array.from(allTags).join(", ") || "(none)"}`,
          },
        ],
      };
    }
  );
}
