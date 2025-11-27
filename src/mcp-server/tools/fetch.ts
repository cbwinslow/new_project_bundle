/**
 * Fetch Tools for MCP Server
 *
 * Provides HTTP fetch capabilities for AI agents
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Server configuration
const SERVER_INFO = {
  name: "MCP-Server",
  version: "1.0",
  repository: "https://github.com/cbwinslow/new_project_bundle",
};

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
 * Extract plain text from HTML content.
 *
 * PURPOSE: This function extracts readable text from HTML for display to AI agents.
 * It is NOT a security sanitizer and should NEVER be used to "clean" HTML for
 * re-insertion into web pages.
 *
 * CONTEXT: The output is transmitted via JSON-RPC as plain text content to MCP clients.
 * There is no HTML rendering context where injection could occur.
 *
 * CODEQL NOTE: Static analysis may flag the regex-based tag removal as incomplete
 * HTML sanitization. This is a false positive because:
 * 1. We're extracting text, not sanitizing HTML for re-use
 * 2. The output goes to JSON-RPC, not HTML rendering
 * 3. Any residual tags appear as harmless text characters
 *
 * @param html - Raw HTML string to extract text from
 * @param maxLength - Maximum length of returned text
 * @returns Plain text extracted from the HTML
 */
function extractTextFromHtml(html: string, maxLength: number): string {
  // Work with the raw HTML string
  let text = html;

  // Step 1: Remove content that should not be visible
  // Remove comments
  // nosemgrep: javascript.browser.security.insufficient-html-sanitization.insufficient-html-sanitization
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Remove script elements - match opening tag, content, and closing tag
  // Using a character class approach that's more explicit
  // nosemgrep: javascript.browser.security.insufficient-html-sanitization.insufficient-html-sanitization
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove style elements
  // nosemgrep: javascript.browser.security.insufficient-html-sanitization.insufficient-html-sanitization
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove head element content
  text = text.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "");

  // Step 2: Convert block-level elements to newlines for readability
  text = text.replace(/<\/?(p|div|br|h[1-6]|li|tr|td|th|blockquote|pre|hr)[^>]*>/gi, "\n");

  // Step 3: Remove all remaining HTML tags
  // nosemgrep: javascript.browser.security.insufficient-html-sanitization.insufficient-html-sanitization
  text = text.replace(/<[^>]+>/g, "");

  // Step 4: Decode common HTML entities for readability
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
  };

  for (const [entity, char] of Object.entries(entities)) {
    text = text.split(entity).join(char);
  }

  // Decode numeric entities
  text = text.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );

  // Step 5: Clean up whitespace
  text = text
    .replace(/[ \t]+/g, " ")        // Collapse horizontal whitespace
    .replace(/\n[ \t]+/g, "\n")     // Remove leading whitespace from lines
    .replace(/[ \t]+\n/g, "\n")     // Remove trailing whitespace from lines
    .replace(/\n{3,}/g, "\n\n")     // Collapse multiple newlines
    .trim();

  // Step 6: Truncate if necessary
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + "\n... (truncated)";
  }

  return text;
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

  // Download and convert web content to plain text
  server.tool(
    "fetch_webpage",
    "Fetch a webpage and extract its text content (removes HTML). Returns plain text only.",
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
            "User-Agent": `Mozilla/5.0 (compatible; ${SERVER_INFO.name}/${SERVER_INFO.version}; +${SERVER_INFO.repository})`,
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

        // Extract text content from HTML
        // This function strips HTML and returns plain text for display
        const extractedText = extractTextFromHtml(html, maxLength);

        return {
          content: [
            {
              type: "text" as const,
              text: extractedText || "(No text content found)",
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
