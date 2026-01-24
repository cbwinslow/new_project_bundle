/**
 * GitHub Tools for MCP Server
 *
 * Provides GitHub API integration for pulling repository information,
 * issues, pull requests, user data, and more.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Fetch data from GitHub API with proper headers
 */
async function githubFetch(
  endpoint: string,
  token?: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `https://api.github.com${endpoint}`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `GitHub API error (${response.status}): ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Register GitHub tools with the MCP server
 */
export function registerGitHubTools(server: McpServer): void {
  // Get repository information
  server.tool(
    "github_repo_info",
    "Get information about a GitHub repository including description, stars, forks, issues, etc.",
    {
      owner: z.string().describe("Repository owner (username or organization)"),
      repo: z.string().describe("Repository name"),
      token: z
        .string()
        .optional()
        .describe("GitHub personal access token (optional, for higher rate limits)"),
    },
    async ({ owner, repo, token }) => {
      const result = await githubFetch(`/repos/${owner}/${repo}`, token);

      if (!result.success) {
        return {
          content: [
            { type: "text", text: `Error: ${result.error}` },
          ],
        };
      }

      const repoData = result.data as {
        name: string;
        full_name: string;
        description: string;
        html_url: string;
        stargazers_count: number;
        forks_count: number;
        open_issues_count: number;
        language: string;
        created_at: string;
        updated_at: string;
        pushed_at: string;
        default_branch: string;
        topics: string[];
        visibility: string;
      };

      const info = `# ${repoData.full_name}

**Description:** ${repoData.description || "No description"}
**URL:** ${repoData.html_url}
**Language:** ${repoData.language || "Not specified"}
**Stars:** ⭐ ${repoData.stargazers_count}
**Forks:** 🍴 ${repoData.forks_count}
**Open Issues:** 📝 ${repoData.open_issues_count}
**Default Branch:** ${repoData.default_branch}
**Visibility:** ${repoData.visibility}
**Topics:** ${repoData.topics?.join(", ") || "None"}

**Created:** ${repoData.created_at}
**Updated:** ${repoData.updated_at}
**Last Push:** ${repoData.pushed_at}`;

      return {
        content: [{ type: "text", text: info }],
      };
    }
  );

  // List repository issues
  server.tool(
    "github_list_issues",
    "List issues from a GitHub repository with optional filtering",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      state: z
        .enum(["open", "closed", "all"])
        .optional()
        .describe("Issue state filter (default: open)"),
      labels: z
        .string()
        .optional()
        .describe("Comma-separated list of labels to filter by"),
      per_page: z
        .number()
        .optional()
        .describe("Number of issues per page (max 100, default 30)"),
      token: z.string().optional().describe("GitHub personal access token"),
    },
    async ({ owner, repo, state = "open", labels, per_page = 30, token }) => {
      const params = new URLSearchParams({
        state,
        per_page: String(per_page),
      });
      if (labels) params.append("labels", labels);

      const result = await githubFetch(
        `/repos/${owner}/${repo}/issues?${params}`,
        token
      );

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
        };
      }

      const issues = result.data as Array<{
        number: number;
        title: string;
        state: string;
        html_url: string;
        user: { login: string };
        labels: Array<{ name: string }>;
        created_at: string;
        updated_at: string;
      }>;

      const issueList = issues
        .map(
          (issue) =>
            `#${issue.number}: ${issue.title}
  State: ${issue.state} | Author: @${issue.user.login}
  Labels: ${issue.labels.map((l) => l.name).join(", ") || "None"}
  URL: ${issue.html_url}
  Created: ${issue.created_at}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `# Issues for ${owner}/${repo}\n\nTotal: ${issues.length}\n\n${issueList}`,
          },
        ],
      };
    }
  );

  // List repository pull requests
  server.tool(
    "github_list_prs",
    "List pull requests from a GitHub repository",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      state: z
        .enum(["open", "closed", "all"])
        .optional()
        .describe("PR state filter (default: open)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of PRs per page (max 100, default 30)"),
      token: z.string().optional().describe("GitHub personal access token"),
    },
    async ({ owner, repo, state = "open", per_page = 30, token }) => {
      const params = new URLSearchParams({
        state,
        per_page: String(per_page),
      });

      const result = await githubFetch(
        `/repos/${owner}/${repo}/pulls?${params}`,
        token
      );

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
        };
      }

      const prs = result.data as Array<{
        number: number;
        title: string;
        state: string;
        html_url: string;
        user: { login: string };
        head: { ref: string };
        base: { ref: string };
        created_at: string;
        updated_at: string;
      }>;

      const prList = prs
        .map(
          (pr) =>
            `#${pr.number}: ${pr.title}
  State: ${pr.state} | Author: @${pr.user.login}
  Branch: ${pr.head.ref} → ${pr.base.ref}
  URL: ${pr.html_url}
  Created: ${pr.created_at}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `# Pull Requests for ${owner}/${repo}\n\nTotal: ${prs.length}\n\n${prList}`,
          },
        ],
      };
    }
  );

  // Get user/organization information
  server.tool(
    "github_user_info",
    "Get information about a GitHub user or organization",
    {
      username: z.string().describe("GitHub username or organization name"),
      token: z.string().optional().describe("GitHub personal access token"),
    },
    async ({ username, token }) => {
      const result = await githubFetch(`/users/${username}`, token);

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
        };
      }

      const userData = result.data as {
        login: string;
        name: string;
        type: string;
        bio: string;
        company: string;
        location: string;
        email: string;
        blog: string;
        twitter_username: string;
        public_repos: number;
        public_gists: number;
        followers: number;
        following: number;
        created_at: string;
        updated_at: string;
        html_url: string;
      };

      const info = `# ${userData.name || userData.login} (@${userData.login})

**Type:** ${userData.type}
**URL:** ${userData.html_url}
${userData.bio ? `**Bio:** ${userData.bio}\n` : ""}
${userData.company ? `**Company:** ${userData.company}\n` : ""}
${userData.location ? `**Location:** ${userData.location}\n` : ""}
${userData.email ? `**Email:** ${userData.email}\n` : ""}
${userData.blog ? `**Blog:** ${userData.blog}\n` : ""}
${userData.twitter_username ? `**Twitter:** @${userData.twitter_username}\n` : ""}

**Public Repositories:** ${userData.public_repos}
**Public Gists:** ${userData.public_gists}
**Followers:** ${userData.followers}
**Following:** ${userData.following}

**Created:** ${userData.created_at}
**Updated:** ${userData.updated_at}`;

      return {
        content: [{ type: "text", text: info }],
      };
    }
  );

  // List user repositories
  server.tool(
    "github_user_repos",
    "List repositories for a GitHub user or organization",
    {
      username: z.string().describe("GitHub username or organization name"),
      type: z
        .enum(["all", "owner", "member"])
        .optional()
        .describe("Repository type filter (default: owner)"),
      sort: z
        .enum(["created", "updated", "pushed", "full_name"])
        .optional()
        .describe("Sort order (default: updated)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of repos per page (max 100, default 30)"),
      token: z.string().optional().describe("GitHub personal access token"),
    },
    async ({ username, type = "owner", sort = "updated", per_page = 30, token }) => {
      const params = new URLSearchParams({
        type,
        sort,
        per_page: String(per_page),
      });

      const result = await githubFetch(
        `/users/${username}/repos?${params}`,
        token
      );

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
        };
      }

      const repos = result.data as Array<{
        name: string;
        full_name: string;
        description: string;
        html_url: string;
        language: string;
        stargazers_count: number;
        forks_count: number;
        updated_at: string;
        visibility: string;
      }>;

      const repoList = repos
        .map(
          (repo) =>
            `📦 **${repo.full_name}**
  ${repo.description || "No description"}
  Language: ${repo.language || "N/A"} | ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}
  Visibility: ${repo.visibility}
  Updated: ${repo.updated_at}
  URL: ${repo.html_url}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `# Repositories for @${username}\n\nTotal: ${repos.length}\n\n${repoList}`,
          },
        ],
      };
    }
  );

  // Get repository file contents
  server.tool(
    "github_get_file",
    "Get the contents of a file from a GitHub repository",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      path: z.string().describe("Path to the file in the repository"),
      ref: z
        .string()
        .optional()
        .describe("Git reference (branch, tag, or commit SHA, default: default branch)"),
      token: z.string().optional().describe("GitHub personal access token"),
    },
    async ({ owner, repo, path, ref, token }) => {
      const params = ref ? `?ref=${ref}` : "";
      const result = await githubFetch(
        `/repos/${owner}/${repo}/contents/${path}${params}`,
        token
      );

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
        };
      }

      const fileData = result.data as {
        name: string;
        path: string;
        sha: string;
        size: number;
        type: string;
        content?: string;
        encoding?: string;
        download_url: string;
      };

      if (fileData.type !== "file") {
        return {
          content: [
            { type: "text", text: `Error: ${path} is not a file, it's a ${fileData.type}` },
          ],
        };
      }

      let content = "Unable to decode content";
      if (fileData.content && fileData.encoding === "base64") {
        content = Buffer.from(fileData.content, "base64").toString("utf-8");
      }

      return {
        content: [
          {
            type: "text",
            text: `# ${fileData.path}\n\nSize: ${fileData.size} bytes | SHA: ${fileData.sha}\nDownload: ${fileData.download_url}\n\n\`\`\`\n${content}\n\`\`\``,
          },
        ],
      };
    }
  );

  // Search repositories
  server.tool(
    "github_search_repos",
    "Search for repositories on GitHub using query syntax",
    {
      query: z
        .string()
        .describe(
          "Search query (e.g., 'language:javascript stars:>1000', 'user:username topic:ai')"
        ),
      sort: z
        .enum(["stars", "forks", "updated", "help-wanted-issues"])
        .optional()
        .describe("Sort order"),
      per_page: z
        .number()
        .optional()
        .describe("Number of results per page (max 100, default 30)"),
      token: z.string().optional().describe("GitHub personal access token"),
    },
    async ({ query, sort, per_page = 30, token }) => {
      const params = new URLSearchParams({
        q: query,
        per_page: String(per_page),
      });
      if (sort) params.append("sort", sort);

      const result = await githubFetch(`/search/repositories?${params}`, token);

      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
        };
      }

      const searchData = result.data as {
        total_count: number;
        items: Array<{
          full_name: string;
          description: string;
          html_url: string;
          language: string;
          stargazers_count: number;
          forks_count: number;
        }>;
      };

      const repoList = searchData.items
        .map(
          (repo) =>
            `📦 **${repo.full_name}** (⭐ ${repo.stargazers_count})
  ${repo.description || "No description"}
  Language: ${repo.language || "N/A"} | Forks: ${repo.forks_count}
  URL: ${repo.html_url}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `# Search Results: "${query}"\n\nTotal matches: ${searchData.total_count} | Showing: ${searchData.items.length}\n\n${repoList}`,
          },
        ],
      };
    }
  );
}
