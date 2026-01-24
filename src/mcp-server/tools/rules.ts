/**
 * Rules Management Tools for MCP Server
 *
 * Provides tools for managing development rules, conventions,
 * and best practices that can be referenced by AI agents.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFile, readdir, stat } from "fs/promises";
import { join } from "path";

interface RuleMetadata {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  path: string;
}

/**
 * Scan the rules directory and extract metadata from rule files
 */
async function scanRulesDirectory(rulesDir: string): Promise<RuleMetadata[]> {
  const rules: RuleMetadata[] = [];

  try {
    const categories = await readdir(rulesDir);

    for (const category of categories) {
      const categoryPath = join(rulesDir, category);
      const categoryStat = await stat(categoryPath);

      if (!categoryStat.isDirectory()) continue;

      const files = await readdir(categoryPath);

      for (const file of files) {
        if (!file.endsWith(".md")) continue;

        const filePath = join(categoryPath, file);
        const content = await readFile(filePath, "utf-8");

        // Extract metadata from markdown
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace(".md", "");

        // Try to find a description (first paragraph after title)
        const descMatch = content.match(/^#\s+.+\n+(.+?)(\n\n|\n#)/s);
        const description = descMatch
          ? descMatch[1].trim().substring(0, 200)
          : "No description";

        // Extract tags from content
        const tags: string[] = [];
        const tagMatches = content.matchAll(/\*\*Tags?:\*\*\s*(.+)/gi);
        for (const match of tagMatches) {
          const tagList = match[1].split(/[,;]/).map((t) => t.trim());
          tags.push(...tagList);
        }

        rules.push({
          id: `${category}/${file.replace(".md", "")}`,
          category,
          title,
          description,
          tags,
          path: filePath,
        });
      }
    }
  } catch (error) {
    // Rules directory might not exist yet
    console.error("Error scanning rules directory:", error);
  }

  return rules;
}

/**
 * Register rules management tools with the MCP server
 */
export function registerRulesTools(server: McpServer): void {
  // List all available rules
  server.tool(
    "rules_list",
    "List all available development rules and conventions",
    {
      category: z
        .string()
        .optional()
        .describe("Filter by category (e.g., 'code-quality', 'git-workflow')"),
      rulesDir: z
        .string()
        .optional()
        .describe("Path to rules directory (defaults to ./rules)"),
    },
    async ({ category, rulesDir = "./rules" }) => {
      const rules = await scanRulesDirectory(rulesDir);

      const filteredRules = category
        ? rules.filter((r) => r.category === category)
        : rules;

      if (filteredRules.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: category
                ? `No rules found in category: ${category}`
                : "No rules found. Create rules in the ./rules directory.",
            },
          ],
        };
      }

      // Group by category
      const byCategory = filteredRules.reduce(
        (acc, rule) => {
          if (!acc[rule.category]) acc[rule.category] = [];
          acc[rule.category].push(rule);
          return acc;
        },
        {} as Record<string, RuleMetadata[]>
      );

      const output = Object.entries(byCategory)
        .map(([cat, catRules]) => {
          const rulesList = catRules
            .map(
              (rule) =>
                `  - **${rule.title}** (\`${rule.id}\`)
    ${rule.description}
    Tags: ${rule.tags.length > 0 ? rule.tags.join(", ") : "None"}`
            )
            .join("\n\n");
          return `## ${cat}\n\n${rulesList}`;
        })
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `# Development Rules\n\nTotal: ${filteredRules.length} rules\n\n${output}`,
          },
        ],
      };
    }
  );

  // Get a specific rule by ID
  server.tool(
    "rules_get",
    "Get the full content of a specific development rule",
    {
      ruleId: z
        .string()
        .describe(
          "Rule ID in format 'category/name' (e.g., 'code-quality/clean-code')"
        ),
      rulesDir: z
        .string()
        .optional()
        .describe("Path to rules directory (defaults to ./rules)"),
    },
    async ({ ruleId, rulesDir = "./rules" }) => {
      const rules = await scanRulesDirectory(rulesDir);
      const rule = rules.find((r) => r.id === ruleId);

      if (!rule) {
        return {
          content: [
            { type: "text", text: `Rule not found: ${ruleId}` },
          ],
        };
      }

      try {
        const content = await readFile(rule.path, "utf-8");
        return {
          content: [
            {
              type: "text",
              text: `# ${rule.title}\n\nCategory: ${rule.category}\nID: ${rule.id}\n\n---\n\n${content}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            { type: "text", text: `Error reading rule: ${errorMessage}` },
          ],
        };
      }
    }
  );

  // Search rules by keyword
  server.tool(
    "rules_search",
    "Search for rules by keyword in title, description, or tags",
    {
      query: z.string().describe("Search query"),
      rulesDir: z
        .string()
        .optional()
        .describe("Path to rules directory (defaults to ./rules)"),
    },
    async ({ query, rulesDir = "./rules" }) => {
      const rules = await scanRulesDirectory(rulesDir);
      const lowerQuery = query.toLowerCase();

      const matches = rules.filter(
        (rule) =>
          rule.title.toLowerCase().includes(lowerQuery) ||
          rule.description.toLowerCase().includes(lowerQuery) ||
          rule.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          rule.category.toLowerCase().includes(lowerQuery)
      );

      if (matches.length === 0) {
        return {
          content: [
            { type: "text", text: `No rules found matching: "${query}"` },
          ],
        };
      }

      const resultsList = matches
        .map(
          (rule) =>
            `### ${rule.title} (\`${rule.id}\`)
**Category:** ${rule.category}
**Description:** ${rule.description}
**Tags:** ${rule.tags.join(", ") || "None"}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `# Search Results: "${query}"\n\nFound ${matches.length} matching rules\n\n${resultsList}`,
          },
        ],
      };
    }
  );

  // Get rules by category
  server.tool(
    "rules_by_category",
    "Get all rules in a specific category",
    {
      category: z.string().describe("Category name (e.g., 'code-quality')"),
      rulesDir: z
        .string()
        .optional()
        .describe("Path to rules directory (defaults to ./rules)"),
    },
    async ({ category, rulesDir = "./rules" }) => {
      const rules = await scanRulesDirectory(rulesDir);
      const categoryRules = rules.filter((r) => r.category === category);

      if (categoryRules.length === 0) {
        return {
          content: [
            { type: "text", text: `No rules found in category: ${category}` },
          ],
        };
      }

      const rulesList = categoryRules
        .map(
          (rule) =>
            `## ${rule.title}\n**ID:** \`${rule.id}\`\n${rule.description}\n**Tags:** ${rule.tags.join(", ") || "None"}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `# ${category} Rules\n\nTotal: ${categoryRules.length}\n\n${rulesList}`,
          },
        ],
      };
    }
  );

  // List available categories
  server.tool(
    "rules_categories",
    "List all available rule categories",
    {
      rulesDir: z
        .string()
        .optional()
        .describe("Path to rules directory (defaults to ./rules)"),
    },
    async ({ rulesDir = "./rules" }) => {
      const rules = await scanRulesDirectory(rulesDir);
      const categories = [...new Set(rules.map((r) => r.category))].sort();

      const categoryCounts = categories.map((cat) => {
        const count = rules.filter((r) => r.category === cat).length;
        return `- **${cat}**: ${count} rules`;
      });

      return {
        content: [
          {
            type: "text",
            text: `# Rule Categories\n\nTotal: ${categories.length} categories\n\n${categoryCounts.join("\n")}`,
          },
        ],
      };
    }
  );
}
