import type { GithubProfile, GithubRepo, GithubCommit, GithubWorkflowRun, GithubLanguages } from "@/types/github"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const API_BASE = "https://api.github.com"

const headers = {
  Accept: "application/vnd.github.v3+json",
  ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
  "X-GitHub-Api-Version": "2022-11-28",
}

async function fetchFromGithub<T>(endpoint: string, revalidate: number = 3600): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers,
      next: { revalidate }, // Cache strategies
    })

    if (!res.ok) {
      console.error(`GitHub API Error: ${res.status} - ${res.statusText} on ${endpoint}`)
      return null
    }

    return res.json()
  } catch (error) {
    console.error(`Fetch Error on ${endpoint}:`, error)
    return null
  }
}

export async function getGithubProfile(username: string) {
  return fetchFromGithub<GithubProfile>(`/users/${username}`, 3600)
}

export async function getRepoDetails(owner: string, repo: string) {
  return fetchFromGithub<GithubRepo>(`/repos/${owner}/${repo}`, 3600)
}

export async function getRepoLanguages(owner: string, repo: string) {
  return fetchFromGithub<GithubLanguages>(`/repos/${owner}/${repo}/languages`, 3600)
}

export async function getRecentCommits(owner: string, repo: string, limit: number = 5) {
  const data = await fetchFromGithub<GithubCommit[]>(`/repos/${owner}/${repo}/commits?per_page=${limit}`, 60) // Revalidate 1 minute
  return data || []
}

export async function getWorkflowRuns(owner: string, repo: string, limit: number = 5) {
  const data = await fetchFromGithub<{ workflow_runs: GithubWorkflowRun[] }>(
    `/repos/${owner}/${repo}/actions/runs?per_page=${limit}`, 
    60
  )
  return data?.workflow_runs || []
}
