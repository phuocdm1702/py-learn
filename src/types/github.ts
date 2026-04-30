export interface GithubProfile {
  login: string
  avatar_url: string
  followers: number
  public_repos: number
  total_private_repos?: number
}

export interface GithubRepo {
  name: string
  full_name: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  watchers_count: number
  language: string
  updated_at: string
}

export interface GithubCommit {
  sha: string
  commit: {
    author: {
      name: string
      date: string
    }
    message: string
  }
  html_url: string
}

export interface GithubWorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  html_url: string
}

export type GithubLanguages = Record<string, number>
