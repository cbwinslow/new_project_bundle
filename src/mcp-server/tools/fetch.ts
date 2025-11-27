/**
 * Fetch Tools for MCP Server
 *
 * Provides HTTP fetch capabilities for AI agents
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// List of blocked URL patterns for security
const BLOCKED_PATTERNS = [
  /^file:/i,
  /localhost/i,
  /127\.0\.0\.1/,
  /::1/,
  /0\.0\.0\.0/,
  /192\.168\./,
  /10\./,
  /172\.(1[6-9]|2[0-9]|3[01])\./,
];

/**
 * Check if a URL is safe to fetch
 */
function isUrlSafe(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return !BLOCKED_PATTERNS.some((pattern) => pattern.test(url.href));
  } catch {
    return false;
  }
}

/**
 * Register fetch tools with the MCP server
 */
export function registerFetchTools(server: McpServer): void {
  // HTTP GET request
  server.tool(
    "http_get",
    "Fetch content from a URL using HTTP GET",
    {
      url: z.string().url().describe("URL to fetch"),
      headers: z
        .record(z.string(), z.string())
        .optional()
        .describe("Optional headers to include in the request"),
      timeout: z
        .number()
        .optional()
        .default(30000)
        .describe("Request timeout in milliseconds"),
    },
    async ({ url, headers, timeout }) => {
      if (!isUrlSafe(url)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: URL is not allowed for security reasons",
            },
          ],
        };
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: "GET",
          headers: headers as Record<string, string> | undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type") ?? "";
        let body: string;

        if (contentType.includes("application/json")) {
          const json = await response.json();
          body = JSON.stringify(json, null, 2);
        } else {
          body = await response.text();
        }

        // Truncate very long responses
        const maxLength = 50000;
        if (body.length > maxLength) {
          body = body.substring(0, maxLength) + "\n... (truncated)";
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Status: ${response.status} ${response.statusText}\nContent-Type: ${contentType}\n\n${body}`,
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error fetching URL: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // HTTP POST request
  server.tool(
    "http_post",
    "Send data to a URL using HTTP POST",
    {
      url: z.string().url().describe("URL to send data to"),
      body: z.string().describe("Request body (JSON string or plain text)"),
      contentType: z
        .enum(["application/json", "text/plain", "application/x-www-form-urlencoded"])
        .optional()
        .default("application/json")
        .describe("Content type of the request body"),
      headers: z
        .record(z.string(), z.string())
        .optional()
        .describe("Optional headers to include in the request"),
      timeout: z
        .number()
        .optional()
        .default(30000)
        .describe("Request timeout in milliseconds"),
    },
    async ({ url, body, contentType, headers, timeout }) => {
      if (!isUrlSafe(url)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: URL is not allowed for security reasons",
            },
          ],
        };
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": contentType,
            ...headers,
          },
          body: body,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseContentType = response.headers.get("content-type") ?? "";
        let responseBody: string;

        if (responseContentType.includes("application/json")) {
          const json = await response.json();
          responseBody = JSON.stringify(json, null, 2);
        } else {
          responseBody = await response.text();
        }

        // Truncate very long responses
        const maxLength = 50000;
        if (responseBody.length > maxLength) {
          responseBody =
            responseBody.substring(0, maxLength) + "\n... (truncated)";
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Status: ${response.status} ${response.statusText}\nContent-Type: ${responseContentType}\n\n${responseBody}`,
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error posting to URL: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Check URL availability
  server.tool(
    "check_url",
    "Check if a URL is reachable (HTTP HEAD request)",
    {
      url: z.string().url().describe("URL to check"),
      timeout: z
        .number()
        .optional()
        .default(10000)
        .describe("Request timeout in milliseconds"),
    },
    async ({ url, timeout }) => {
      if (!isUrlSafe(url)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: URL is not allowed for security reasons",
            },
          ],
        };
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const startTime = Date.now();
        const response = await fetch(url, {
          method: "HEAD",
          signal: controller.signal,
        });
        const endTime = Date.now();

        clearTimeout(timeoutId);

        const headersObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headersObj[key] = value;
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `URL: ${url}
Status: ${response.status} ${response.statusText}
Response Time: ${endTime - startTime}ms
Headers:
${JSON.stringify(headersObj, null, 2)}`,
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `URL check failed: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Download and convert web content to markdown-friendly text
  server.tool(
    "fetch_webpage",
    "Fetch a webpage and extract its text content (removes HTML)",
    {
      url: z.string().url().describe("URL of the webpage to fetch"),
      maxLength: z
        .number()
        .optional()
        .default(10000)
        .describe("Maximum length of extracted content"),
    },
    async ({ url, maxLength }) => {
      if (!isUrlSafe(url)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: URL is not allowed for security reasons",
            },
          ],
        };
      }

      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; MCP-Server/1.0; +https://github.com/cbwinslow/new_project_bundle)",
          },
        });

        if (!response.ok) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: HTTP ${response.status} ${response.statusText}`,
              },
            ],
          };
        }

        const html = await response.text();

        // Simple HTML to text conversion
        let text = html
          // Remove script and style elements
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          // Replace common block elements with newlines
          .replace(/<(br|p|div|h[1-6]|li|tr)[^>]*>/gi, "\n")
          // Remove remaining HTML tags
          .replace(/<[^>]+>/g, "")
          // Decode common HTML entities
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          // Normalize whitespace
          .replace(/\s+/g, " ")
          .replace(/\n\s+/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        // Truncate if necessary
        if (text.length > maxLength) {
          text = text.substring(0, maxLength) + "\n... (truncated)";
        }

        return {
          content: [
            {
              type: "text" as const,
              text: text || "(No text content found)",
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error fetching webpage: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
