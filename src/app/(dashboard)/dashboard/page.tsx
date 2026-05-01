import { getGithubProfile, getRepoDetails, getRecentCommits, getWorkflowRuns, getRepoLanguages } from "@/lib/github"
import { DashboardClient } from "./client-page"
import { defaultSettings } from "@/data/seed-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Overview Dashboard",
}

export const revalidate = 60 // Revalidate this page every 60 seconds

// Default values from settings (can be overridden via localStorage on client)
const DEFAULT_USERNAME = defaultSettings.githubUsername || "phuocdm1702"
const DEFAULT_REPO = defaultSettings.githubRepo || "py-learn"

export default async function DashboardPage() {
  const username = DEFAULT_USERNAME
  const repoName = DEFAULT_REPO

  // Fetch all GitHub data in parallel to optimize loading speed
  const [profile, repo, commits, workflows, languages] = await Promise.all([
    getGithubProfile(username),
    getRepoDetails(username, repoName),
    getRecentCommits(username, repoName, 5),
    getWorkflowRuns(username, repoName, 5),
    getRepoLanguages(username, repoName),
  ])

  return (
    <DashboardClient 
      githubProfile={profile}
      githubRepo={repo}
      githubCommits={commits}
      githubWorkflows={workflows}
      githubLanguages={languages}
    />
  )
}
