/**
 * Time Tools for MCP Server
 *
 * Provides time and timezone operations for AI agents
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Register time tools with the MCP server
 */
export function registerTimeTools(server: McpServer): void {
  // Get current time tool
  server.tool(
    "get_current_time",
    "Get the current date and time",
    {
      timezone: z
        .string()
        .optional()
        .describe(
          "Timezone to display time in (e.g., 'America/New_York', 'UTC'). Defaults to system timezone."
        ),
      format: z
        .enum(["iso", "locale", "unix"])
        .optional()
        .default("iso")
        .describe("Output format for the time"),
    },
    async ({ timezone, format }) => {
      try {
        const now = new Date();
        let result: string;

        switch (format) {
          case "unix":
            result = Math.floor(now.getTime() / 1000).toString();
            break;
          case "locale":
            result = timezone
              ? now.toLocaleString("en-US", { timeZone: timezone })
              : now.toLocaleString();
            break;
          case "iso":
          default:
            if (timezone) {
              result = now.toLocaleString("sv-SE", {
                timeZone: timezone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
            } else {
              result = now.toISOString();
            }
            break;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: result,
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
              text: `Error getting time: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Convert time between timezones
  server.tool(
    "convert_timezone",
    "Convert time from one timezone to another",
    {
      time: z
        .string()
        .describe("Time to convert (ISO format or 'now' for current time)"),
      fromTimezone: z.string().describe("Source timezone"),
      toTimezone: z.string().describe("Target timezone"),
    },
    async ({ time, fromTimezone, toTimezone }) => {
      try {
        let date: Date;
        if (time.toLowerCase() === "now") {
          date = new Date();
        } else {
          date = new Date(time);
        }

        if (isNaN(date.getTime())) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Invalid time format. Please use ISO format (e.g., '2024-01-15T10:30:00').",
              },
            ],
          };
        }

        const fromTime = date.toLocaleString("en-US", {
          timeZone: fromTimezone,
          dateStyle: "full",
          timeStyle: "long",
        });
        const toTime = date.toLocaleString("en-US", {
          timeZone: toTimezone,
          dateStyle: "full",
          timeStyle: "long",
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `From: ${fromTime} (${fromTimezone})\nTo: ${toTime} (${toTimezone})`,
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
              text: `Error converting timezone: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Calculate time difference
  server.tool(
    "time_difference",
    "Calculate the difference between two times",
    {
      startTime: z.string().describe("Start time (ISO format)"),
      endTime: z
        .string()
        .describe("End time (ISO format or 'now' for current time)"),
    },
    async ({ startTime, endTime }) => {
      try {
        const start = new Date(startTime);
        const end =
          endTime.toLowerCase() === "now" ? new Date() : new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Invalid time format. Please use ISO format.",
              },
            ],
          };
        }

        const diffMs = end.getTime() - start.getTime();
        const diffSeconds = Math.abs(Math.floor(diffMs / 1000));
        const diffMinutes = Math.abs(Math.floor(diffMs / (1000 * 60)));
        const diffHours = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)));
        const diffDays = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));

        const sign = diffMs >= 0 ? "" : "(negative) ";

        return {
          content: [
            {
              type: "text" as const,
              text: `Time Difference ${sign}:
- Days: ${diffDays}
- Hours: ${diffHours}
- Minutes: ${diffMinutes}
- Seconds: ${diffSeconds}
- Milliseconds: ${Math.abs(diffMs)}`,
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
              text: `Error calculating time difference: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Format time
  server.tool(
    "format_time",
    "Format a timestamp in various ways",
    {
      time: z
        .string()
        .describe(
          "Time to format (ISO format, Unix timestamp, or 'now' for current time)"
        ),
      format: z
        .enum(["iso", "rfc2822", "locale", "relative", "unix"])
        .describe("Output format"),
      timezone: z
        .string()
        .optional()
        .describe("Timezone to use for formatting"),
    },
    async ({ time, format, timezone }) => {
      try {
        let date: Date;
        if (time.toLowerCase() === "now") {
          date = new Date();
        } else if (/^\d+$/.test(time)) {
          // Unix timestamp
          date = new Date(parseInt(time) * 1000);
        } else {
          date = new Date(time);
        }

        if (isNaN(date.getTime())) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Invalid time format.",
              },
            ],
          };
        }

        let result: string;
        switch (format) {
          case "iso":
            result = date.toISOString();
            break;
          case "rfc2822":
            result = date.toUTCString();
            break;
          case "unix":
            result = Math.floor(date.getTime() / 1000).toString();
            break;
          case "locale":
            result = timezone
              ? date.toLocaleString("en-US", { timeZone: timezone })
              : date.toLocaleString();
            break;
          case "relative":
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            const direction = diffMs >= 0 ? "ago" : "in the future";

            if (diffDays > 0) {
              result = `${diffDays} day(s) ${direction}`;
            } else if (diffHours > 0) {
              result = `${diffHours} hour(s) ${direction}`;
            } else if (diffMinutes > 0) {
              result = `${diffMinutes} minute(s) ${direction}`;
            } else {
              result = `${diffSeconds} second(s) ${direction}`;
            }
            break;
          default:
            result = date.toISOString();
        }

        return {
          content: [
            {
              type: "text" as const,
              text: result,
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
              text: `Error formatting time: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // List common timezones
  server.tool(
    "list_timezones",
    "List common timezones",
    {
      region: z
        .enum(["america", "europe", "asia", "pacific", "all"])
        .optional()
        .default("all")
        .describe("Filter timezones by region"),
    },
    async ({ region }) => {
      const timezones: Record<string, string[]> = {
        america: [
          "America/New_York",
          "America/Chicago",
          "America/Denver",
          "America/Los_Angeles",
          "America/Toronto",
          "America/Vancouver",
          "America/Sao_Paulo",
          "America/Mexico_City",
        ],
        europe: [
          "Europe/London",
          "Europe/Paris",
          "Europe/Berlin",
          "Europe/Rome",
          "Europe/Madrid",
          "Europe/Amsterdam",
          "Europe/Moscow",
        ],
        asia: [
          "Asia/Tokyo",
          "Asia/Shanghai",
          "Asia/Hong_Kong",
          "Asia/Singapore",
          "Asia/Seoul",
          "Asia/Mumbai",
          "Asia/Dubai",
          "Asia/Bangkok",
        ],
        pacific: [
          "Pacific/Auckland",
          "Pacific/Sydney",
          "Pacific/Honolulu",
          "Pacific/Fiji",
        ],
      };

      let result: string[] = [];
      if (region === "all") {
        result = Object.values(timezones).flat();
      } else {
        result = timezones[region] ?? [];
      }

      // Add UTC
      result.unshift("UTC");

      return {
        content: [
          {
            type: "text" as const,
            text: result.join("\n"),
          },
        ],
      };
    }
  );
}
