FlowSync
FlowSync is an AI-powered workflow automation platform that transforms meeting notes into actionable project workflows.
Using Gemini, FlowSync automatically extracts tasks, blockers, risks, milestones, priorities, and recommended next actions from unstructured meeting discussions. The platform also integrates with GitLab to create work items and help teams move directly from discussion to execution.
Features

AI-powered meeting note analysis
Automatic task extraction
Blocker and risk detection
Milestone identification
Recommended next actions
Meeting history tracking
Task Cards view
Priority Matrix view
GitLab work item creation
Cloud-hosted deployment on Google Cloud Run

Built With

TypeScript
Next.js
React
Tailwind CSS
Node.js
Gemini
Google Cloud Run
Google Cloud Agent Platform
GitLab API
GitLab MCP
Cursor

How It Works


Upload or paste meeting notes.


Gemini analyzes the content.


FlowSync extracts:

Tasks
Blockers
Risks
Milestones
Priorities



Results are displayed through task cards and a priority matrix.


Extracted actions can be converted into GitLab work items.


Deployment
FlowSync is deployed on Google Cloud Run and is accessible through a live hosted URL.
Running Locally
Install dependencies:
npm install
Start the development server:
npm run dev
Open:
http://localhost:3000
Google Cloud Integration
FlowSync uses:

Google Cloud Run for hosting and deployment
Gemini for intelligent meeting analysis
Google Cloud Agent Platform for agent configuration
GitLab MCP configuration for partner-track integration

GitLab Integration
FlowSync automatically converts extracted project actions into GitLab work items, helping teams move from planning to execution with minimal manual effort.
Future Improvements

Conversational project assistant
Advanced project analytics
Enhanced GitLab workflow automation
Cross-project insights
Expanded document support

License
MIT License
