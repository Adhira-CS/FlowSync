# FlowSync

FlowSync is an AI-powered workflow automation platform that transforms meeting notes into actionable project workflows.

Using Gemini, FlowSync automatically extracts tasks, blockers, risks, milestones, priorities, and recommended next actions from unstructured meeting discussions. The platform also integrates with GitLab to create work items and help teams move directly from discussion to execution.

## Features

* AI-powered meeting note analysis
* Automatic task extraction
* Blocker and risk detection
* Milestone identification
* Recommended next actions
* Meeting history tracking
* Task Cards view
* Priority Matrix view
* GitLab work item creation
* Deployment on Google Cloud Run

## Built With

* TypeScript
* Next.js
* React
* Tailwind CSS
* Node.js
* Gemini
* Google Cloud Run
* Google Cloud Agent Platform
* GitLab API
* GitLab MCP
* Cursor

## How It Works

1. Paste or upload meeting notes.
2. Gemini analyzes the content.
3. FlowSync extracts tasks, blockers, risks, milestones, and priorities.
4. Results are displayed through task cards and a priority matrix.
5. Extracted actions can be converted into GitLab work items.

## Live Demo

Hosted Application:

https://flowsync-6996749565.me-central1.run.app

## Running Locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Google Cloud Integration

FlowSync uses Google Cloud Run for deployment and Gemini for intelligent meeting-note analysis.

A FlowSync Agent was also configured in Google Cloud Agent Platform with GitLab MCP integration as part of the GitLab partner-track implementation.

## License

MIT License
