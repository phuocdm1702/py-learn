import { getGithubProfile, getRepoDetails, getRecentCommits, getWorkflowRuns, getRepoLanguages } from "@/lib/github"
import { DashboardClient } from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Overview Dashboard",
}

export const revalidate = 60 // Revalidate this page every 60 seconds

export default async function DashboardPage() {
  const username = "phuocdm1702"
  const repoName = "py-learn"

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
