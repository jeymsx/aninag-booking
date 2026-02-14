import { NextResponse } from 'next/server';

export async function POST() {
  const GITHUB_PAT = process.env.GITHUB_PAT;
  const OWNER = "jeymsx"; // Your GitHub username
  const REPO = "aninag-booking"; // Your exact repository name
  const WORKFLOW_ID = "sync.yml"; // The filename from Step 3

  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_PAT}`,
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify({ ref: 'master' }), // Use 'master' if that's your branch name
      }
    );

    if (response.ok) {
      return NextResponse.json({ message: "Export started!" });
    }
    return NextResponse.json({ error: "GitHub rejected request" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}