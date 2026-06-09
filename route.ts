export async function POST(request: Request) {
  try {
    const { tasks } = await request.json();

    const token = process.env.GITLAB_TOKEN;
    const projectId = process.env.GITLAB_PROJECT_ID;

    if (!token || !projectId) {
      return Response.json(
        { error: "Missing GitLab token or project ID" },
        { status: 500 }
      );
    }

    const createdIssues = [];

    for (const task of tasks) {
      const description = `
Issue Type: ${task.type}

Priority: ${task.priority}

Deadline: ${task.deadline}

Summary:
${task.reason}

Owner:
${task.owner}
      `;

      const response = await fetch(
        `https://gitlab.com/api/v4/projects/${projectId}/issues`,
        {
          method: "POST",
          headers: {
            "PRIVATE-TOKEN": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: task.title,
            description,
            labels: task.labels?.join(",") || "",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const issue = await response.json();
      createdIssues.push(issue);
    }

    return Response.json({
      success: true,
      createdIssues,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to create GitLab issues" },
      { status: 500 }
    );
  }
}