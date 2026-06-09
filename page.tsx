"use client";

import { useState, useEffect } from "react";
type Task = {
  title: string;
  type: string;
  priority: string;
  owner: string;
  deadline: string;
  reason: string;
};
export default function Home() {
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [rawResult, setRawResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("cards");
  const [creatingIssues, setCreatingIssues] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [meetingHistory, setMeetingHistory] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem("flowsync-history") || "[]"
    );

    setMeetingHistory(history);
  }, []);

  async function analyzeNotes() {
    try {
      setLoading(true);
      setTasks([]);
      setRawResult("");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRawResult(data.error || "Server error.");
        return;
      }

      const parsedTasks = JSON.parse(data.result);
      setTasks(parsedTasks);

const history =
  JSON.parse(localStorage.getItem("flowsync-history") || "[]");

history.push({
  date: new Date().toLocaleString(),
  notes,
  tasks: parsedTasks,
});

localStorage.setItem(
  "flowsync-history",
  JSON.stringify(history)
);
setMeetingHistory(history);
    } catch (error) {
      console.error(error);
      setRawResult("Failed to parse AI response. Check console/terminal.");
    } finally {
      setLoading(false);
    }
    
  }
  async function createGitLabIssues() {
    try {
      if (tasks.length === 0) {
        setRawResult("No tasks to send to GitLab.");
        return;
      }
  
      setCreatingIssues(true);
      setRawResult("");
  
      const response = await fetch("/api/gitlab/create-issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setRawResult(data.error || "Failed to create GitLab issues.");
        return;
      }
  
      setRawResult(`Created ${data.createdIssues.length} GitLab issues successfully.`);
    } catch (error) {
      console.error(error);
      setRawResult("Failed to connect to GitLab.");
    } finally {
      setCreatingIssues(false);
    }
  }
  
  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
  
    if (!file) return;
  
    try {
      setUploading(true);
  
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("/api/extract-document", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setRawResult(data.error || "Failed to process file.");
        return;
      }
  
      setNotes(data.text);
    } catch (error) {
      console.error(error);
      setRawResult("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  }
  function toggleTask(index: number) {
    setCompletedTasks((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  }
  function isCompleted(index: number) {
    return completedTasks.includes(index);
  }
  function getRecurringBlockers() {
    const blockerCounts: Record<string, number> = {};

    meetingHistory.forEach((meeting) => {
      meeting.tasks.forEach((task: any) => {
        if (task.type === "Blocker") {
          let title = task.title.toLowerCase().trim();

          if (
            title.includes("finance") ||
            title.includes("approval") ||
            title.includes("payment integration")
          ) {
            title = "Finance approval blocking payment integration";
          }

          blockerCounts[title] = (blockerCounts[title] || 0) + 1;
        }
      });
    });

    return Object.entries(blockerCounts).filter(
      ([title, count]) => count >= 2
    );
  }

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-white">
      <section className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
      <h1 className="text-5xl font-bold">
  FlowSync
</h1>
  <button
    onClick={() => setShowHistory(true)}
    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-xl hover:bg-gray-800"
  >
    📜
  </button>
</div>
        <p className="mt-4 text-lg text-gray-300">AI Workflow Automation Agent</p>
        <section className="mt-6 rounded-xl border border-blue-700 bg-gray-900 p-5">
  <h2 className="text-2xl font-bold">☁️ Google Cloud Integration</h2>

  <div className="mt-4 grid gap-3 md:grid-cols-3">
    <div className="rounded-lg bg-black p-4">
      <p className="font-bold">Agent Platform</p>
      <p className="mt-1 text-sm text-gray-400">
        FlowSync Agent is configured in Google Cloud Agent Platform.
      </p>
    </div>

    <div className="rounded-lg bg-black p-4">
      <p className="font-bold">Gemini Analysis</p>
      <p className="mt-1 text-sm text-gray-400">
        Meeting notes are analyzed with Gemini to extract project actions.
      </p>
    </div>

    <div className="rounded-lg bg-black p-4">
      <p className="font-bold">GitLab MCP Ready</p>
      <p className="mt-1 text-sm text-gray-400">
        GitLab MCP is configured in the cloud agent for partner integration.
      </p>
    </div>
  </div>
</section>

        <textarea
          className="mt-8 h-64 w-full rounded-xl border border-gray-700 bg-black p-5 text-white outline-none"
          placeholder="Paste meeting notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-4">
  <input
    type="file"
    accept=".docx,.txt"
    onChange={handleFileUpload}
    className="text-white"
  />

  {uploading && (
    <p className="mt-2 text-gray-400">
      Extracting document...
    </p>
  )}
</div>

        <button
          onClick={analyzeNotes}
          disabled={loading || !notes.trim()}
          className="mt-5 rounded-xl bg-white px-7 py-3 font-bold text-black disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Notes"}
        </button>
        <button
  onClick={createGitLabIssues}
  disabled={tasks.length === 0 || creatingIssues}
  className="ml-4 mt-5 rounded-xl bg-green-500 px-7 py-3 font-bold text-black disabled:opacity-50"
>
  {creatingIssues ? "Creating Issues..." : "Create GitLab Issues"}
</button>
        <div className="mt-6 flex gap-4">
  <button
    onClick={() => setView("cards")}
    className="rounded-lg bg-gray-800 px-4 py-2"
  >
    Task Cards
  </button>

  <button
    onClick={() => setView("matrix")}
    className="rounded-lg bg-gray-800 px-4 py-2"
  >
    Priority Matrix
  </button>
</div>
{tasks.length > 0 && (
  <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

    <div className="rounded-xl border border-blue-700 bg-gray-900 p-4 text-center">
      <h3 className="text-sm text-gray-400">Tasks</h3>
      <p className="mt-2 text-3xl font-bold">
        {tasks.filter((task) => task.type === "Task").length}
      </p>
    </div>

    <div className="rounded-xl border border-red-700 bg-gray-900 p-4 text-center">
      <h3 className="text-sm text-gray-400">Blockers</h3>
      <p className="mt-2 text-3xl font-bold">
        {tasks.filter((task) => task.type === "Blocker").length}
      </p>
    </div>

    <div className="rounded-xl border border-yellow-700 bg-gray-900 p-4 text-center">
      <h3 className="text-sm text-gray-400">Risks</h3>
      <p className="mt-2 text-3xl font-bold">
        {tasks.filter((task) => task.type === "Risk").length}
      </p>
    </div>

    <div className="rounded-xl border border-green-700 bg-gray-900 p-4 text-center">
      <h3 className="text-sm text-gray-400">Milestones</h3>
      <p className="mt-2 text-3xl font-bold">
        {tasks.filter((task) => task.type === "Milestone").length}
      </p>
    </div>

  </section>
)}
{getRecurringBlockers().length > 0 && (
  <section className="mt-8 rounded-xl border border-orange-700 bg-orange-950 p-5">
    <h2 className="text-2xl font-bold">⚠️ Recurring Blockers</h2>

    <div className="mt-4 grid gap-3">
      {getRecurringBlockers().map(([title, count]) => (
        <div key={title} className="rounded-lg bg-black p-4">
          <p className="font-bold capitalize">{title}</p>
          <p className="mt-1 text-gray-300">
            Appeared in {count} meetings.
          </p>
        </div>
      ))}
    </div>
  </section>
)}

{tasks.length > 0 && (
  <section className="mt-8 rounded-xl border border-green-700 bg-gray-900 p-5">
    <h2 className="text-2xl font-bold">📈 Progress Tracking</h2>

    <div className="mt-4">
      <p className="text-lg font-bold">
        Progress:{" "}
        {tasks.length
          ? Math.round((completedTasks.length / tasks.length) * 100)
          : 0}
        %
      </p>

      <div className="mt-3 h-4 w-full rounded-full bg-black">
        <div
          className="h-4 rounded-full bg-green-500"
          style={{
            width: `${
              tasks.length
                ? (completedTasks.length / tasks.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </section>
)}
{tasks.length > 0 && (
  <section className="mt-8 rounded-xl border border-purple-700 bg-gray-900 p-5">
    <h2 className="text-2xl font-bold">Recommended Next Actions</h2>

    <div className="mt-4 grid gap-3">
      {tasks
        .filter(
          (task, index) =>
            !isCompleted(index) &&
            (
              task.priority === "Critical" ||
              task.type === "Blocker" ||
              task.type === "Risk"
            )
        )
        .slice(0, 3)
        .map((task, index) => (
          <div key={index} className="rounded-lg bg-black p-4">
            <p className="font-bold">
              {index + 1}. {task.title}
            </p>
            <p className="mt-1 text-sm text-gray-400">{task.reason}</p>
          </div>
        ))}
    </div>
  </section>
)}
{tasks.length > 0 && view === "cards" && (
  <section className="mt-8 grid gap-4">
    {tasks.map((task, index) => (
      <div
        key={index}
        className="rounded-xl border border-gray-700 bg-gray-900 p-5"
      >
        <div className="flex items-center gap-3">
  <input
    type="checkbox"
    checked={completedTasks.includes(index)}
    onChange={() => toggleTask(index)}
  />

  <h2 className="text-xl font-bold">{task.title}</h2>
</div>

        <div className="mt-3 grid gap-2 text-gray-300">
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Owner:</strong> {task.owner}
          </p>
          <p>
            <strong>Deadline:</strong> {task.deadline}
          </p>
          <p>
            <strong>Type:</strong> {task.type}
          </p>
          <p>
            <strong>Reason:</strong> {task.reason}
          </p>
        </div>
      </div>
    ))}
  </section>
)}

{tasks.length > 0 && view === "matrix" && (
  <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="rounded-xl border border-red-700 bg-gray-900 p-5">
      <h2 className="mb-4 text-xl font-bold">🚨 Do Now</h2>

      {tasks
        .filter(
          (task, index) =>
            !isCompleted(index) &&
            (
              task.priority === "Critical" ||
              task.type === "Blocker"
            )
        )
        .map((task, index) => (
          <div key={index} className="mb-3 rounded-lg bg-black p-3">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.reason}</p>
          </div>
        ))}
    </div>

    <div className="rounded-xl border border-blue-700 bg-gray-900 p-5">
      <h2 className="mb-4 text-xl font-bold">📈 Plan</h2>

      {tasks
        .filter(
          (task, index) =>
            !isCompleted(index) &&
            (
              task.type === "Milestone" ||
              (
                task.priority === "High" &&
                task.type !== "Blocker" &&
                task.type !== "Risk"
              )
            )
        )
        .map((task, index) => (
          <div key={index} className="mb-3 rounded-lg bg-black p-3">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.reason}</p>
          </div>
        ))}
    </div>

    <div className="rounded-xl border border-yellow-700 bg-gray-900 p-5">
      <h2 className="mb-4 text-xl font-bold">⚠️ Watch / Risks</h2>

      {tasks
        .filter(
          (task, index) =>
            !isCompleted(index) &&
            task.type === "Risk"
        )
        .map((task, index) => (
          <div key={index} className="mb-3 rounded-lg bg-black p-3">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.reason}</p>
          </div>
        ))}
    </div>

    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <h2 className="mb-4 text-xl font-bold">💤 Later</h2>

      {tasks
        .filter(
          (task, index) =>
            !isCompleted(index) &&
            (
              task.priority === "Low" ||
              task.priority === "Medium"
            )
        )
        .map((task, index) => (
          <div key={index} className="mb-3 rounded-lg bg-black p-3">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.reason}</p>
          </div>
        ))}
    </div>
  </section>
)}
        {showHistory && (
          <div className="fixed inset-0 z-50 bg-black/60">
            <div className="fixed right-0 top-0 h-full w-96 overflow-y-auto border-l border-blue-700 bg-gray-950 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Meeting History</h2>

                <button
                  onClick={() => {
                    setShowHistory(false);
                    setSelectedMeeting(null);
                  }}
                  className="rounded bg-gray-800 px-3 py-1"
                >
                  X
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                {meetingHistory.length === 0 ? (
                  <p className="text-gray-400">No meetings saved yet.</p>
                ) : (
                  meetingHistory.map((meeting, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedMeeting(meeting)}
                      className={`w-full cursor-pointer rounded-lg border p-4 text-left hover:border-blue-500 hover:bg-gray-900 ${
                        selectedMeeting === meeting
                          ? "border-blue-500 bg-gray-900"
                          : "border-gray-800 bg-black"
                      }`}
                    >
                      <p className="font-bold">Meeting {index + 1}</p>
                      <p className="text-sm text-gray-400">{meeting.date}</p>
                      <p className="mt-2 text-gray-300">
                        Items extracted: {meeting.tasks.length}
                      </p>
                    </button>
                  ))
                )}
                {selectedMeeting && (
  <div className="mt-6 rounded-lg border border-gray-700 bg-black p-4">
    <h3 className="text-lg font-bold">Meeting Details</h3>

    <p className="mt-2 text-sm text-gray-400">
      {selectedMeeting.date}
    </p>

    <h4 className="mt-4 font-bold">Original Notes</h4>

    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300">
      {selectedMeeting.notes}
    </p>

    <h4 className="mt-4 font-bold">Extracted Items</h4>

    <div className="mt-2 grid gap-2">
      {selectedMeeting.tasks.map((task: any, index: number) => (
        <div key={index} className="rounded bg-gray-900 p-3">
          <p className="font-bold">{task.title}</p>
          <p className="text-sm text-gray-400">
            {task.type} • {task.priority}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
              </div>
            </div>
          </div>
        )}

        {rawResult && (
          <div className="mt-8 rounded-xl border border-red-700 bg-red-950 p-5">
            {rawResult}
          </div>
        )}
      </section>
    </main>
  );
}