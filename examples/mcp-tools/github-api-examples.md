# GitHub API Tools Examples

This document provides examples of using the GitHub API tools available in the MCP server.

## Prerequisites

- MCP server running and configured
- Optional: GitHub personal access token for higher rate limits

## Getting Repository Information

Get detailed information about any GitHub repository:

```javascript
// Tool: github_repo_info
{
  "owner": "cbwinslow",
  "repo": "new_project_bundle",
  "token": "ghp_xxxxxxxxxxxx" // Optional
}
```

**Example Response:**
```
# cbwinslow/new_project_bundle

**Description:** A comprehensive bundle of DevOps project files
**URL:** https://github.com/cbwinslow/new_project_bundle
**Language:** TypeScript
**Stars:** ⭐ 42
**Forks:** 🍴 7
**Open Issues:** 📝 3
```

## Listing Repository Issues

List open, closed, or all issues from a repository:

```javascript
// Tool: github_list_issues
{
  "owner": "facebook",
  "repo": "react",
  "state": "open",
  "labels": "bug,help wanted",
  "per_page": 10,
  "token": "ghp_xxxxxxxxxxxx" // Optional
}
```

## Listing Pull Requests

Get all pull requests from a repository:

```javascript
// Tool: github_list_prs
{
  "owner": "microsoft",
  "repo": "vscode",
  "state": "open",
  "per_page": 20
}
```

## Getting User Information

Fetch information about any GitHub user or organization:

```javascript
// Tool: github_user_info
{
  "username": "octocat",
  "token": "ghp_xxxxxxxxxxxx" // Optional
}
```

**Example Response:**
```
# The Octocat (@octocat)

**Type:** User
**URL:** https://github.com/octocat
**Bio:** How people build software
**Location:** San Francisco
**Public Repositories:** 8
**Followers:** 3547
**Following:** 9
```

## Listing User Repositories

List all repositories for a user or organization:

```javascript
// Tool: github_user_repos
{
  "username": "cbwinslow",
  "type": "owner",  // or "all", "member"
  "sort": "updated", // or "created", "pushed", "full_name"
  "per_page": 30
}
```

## Getting File Contents

Fetch the contents of any file from a repository:

```javascript
// Tool: github_get_file
{
  "owner": "cbwinslow",
  "repo": "new_project_bundle",
  "path": "README.md",
  "ref": "main", // Optional: branch, tag, or commit SHA
  "token": "ghp_xxxxxxxxxxxx" // Optional
}
```

## Searching Repositories

Search for repositories using GitHub's query syntax:

```javascript
// Tool: github_search_repos
{
  "query": "language:typescript stars:>1000 topic:mcp",
  "sort": "stars",
  "per_page": 20
}
```

**Query Examples:**
- `"language:python machine learning"` - Python ML projects
- `"user:facebook"` - All repos from Facebook
- `"stars:>5000 forks:>1000"` - Popular projects
- `"topic:ai created:>2024-01-01"` - Recent AI projects
- `"org:microsoft language:typescript"` - Microsoft TypeScript projects

## Use Cases

### 1. Monitoring Your Repositories

Track your repositories' activity:

```javascript
// Get your repos
github_user_repos({ username: "yourname", sort: "updated" })

// Check specific repo
github_repo_info({ owner: "yourname", repo: "project" })

// List open issues
github_list_issues({ owner: "yourname", repo: "project", state: "open" })
```

### 2. Research and Discovery

Find interesting projects:

```javascript
// Find trending TypeScript projects
github_search_repos({
  query: "language:typescript stars:>1000 pushed:>2024-01-01",
  sort: "stars"
})

// Explore an organization
github_user_info({ username: "vercel" })
github_user_repos({ username: "vercel", per_page: 50 })
```

### 3. Pull Request Management

Stay on top of PRs:

```javascript
// List open PRs
github_list_prs({ owner: "owner", repo: "repo", state: "open" })

// Check PR status (combine with github_get_file for specific PR files)
```

### 4. Documentation Access

Read documentation directly:

```javascript
// Get README
github_get_file({ owner: "owner", repo: "repo", path: "README.md" })

// Get specific docs
github_get_file({ owner: "owner", repo: "repo", path: "docs/API.md" })

// Get configuration files
github_get_file({ owner: "owner", repo: "repo", path: "package.json" })
```

## Authentication

### Getting a GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `public_repo` - For public repository access
   - `repo` - For private repository access
   - `user` - For user information
   - `read:org` - For organization information
4. Generate and save the token securely

### Using the Token

Pass the token in the `token` parameter:

```javascript
{
  "owner": "owner",
  "repo": "repo",
  "token": "ghp_your_token_here"
}
```

## Rate Limits

- **Without authentication:** 60 requests per hour
- **With authentication:** 5,000 requests per hour

Use a token to avoid rate limit issues!

## Error Handling

The tools provide clear error messages:

```
Error: GitHub API error (404): Not Found
Error: GitHub API error (403): API rate limit exceeded
Error: GitHub API error (401): Bad credentials
```

## Tips

1. **Use tokens** - Always authenticate for better rate limits
2. **Cache results** - Use the memory tools to cache frequently accessed data
3. **Combine tools** - Chain multiple tools for complex workflows
4. **Check rate limits** - Monitor your usage if making many requests
5. **Use specific queries** - More specific searches return better results

## Related Tools

- `memory_set` / `memory_get` - Cache GitHub data
- `rules_list` - Manage development rules from this repo
- `git_*` - Work with local Git repositories
- `http_get` - Fetch from GitHub directly (alternative approach)
