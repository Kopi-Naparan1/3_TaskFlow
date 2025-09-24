// --------------------------------------------------
// TaskList.tsx
// --------------------------------------------------
// Purpose:
// This component is responsible for *displaying* all tasks
// that exist in our app. It doesn’t create tasks — that’s
// TaskInput’s job — it just shows what’s already been added.
//
// Analogy:
// Imagine this like the "menu board" in a café. New orders
// appear here, and you can either mark them as "done"
// (toggle complete) or erase them from the board (delete).
//
// Data Flow:
// - It receives `tasks` (an array of Task objects) from App.tsx
// - It receives `dispatch`, which lets it send instructions
//   back to the reducer (e.g., TOGGLE_TASK, DELETE_TASK).
//
// User Interaction:
// - Clicking on a task text → toggles between complete/incomplete
// - Clicking ❌ → deletes the task
//
// Design Choice:
// We use `map()` to loop over tasks, so every task is rendered
// with the same structure: text + actions.
// --------------------------------------------------
"use client";

import { Task } from "../types/Task";
import { Action } from "./TaskReducer";

export default function TaskList({
  tasks,
  dispatch,
}: {
  tasks: Task[];
  dispatch: React.Dispatch<Action>;
}) {
  // If there are no tasks, don’t show an empty list —
  // just a friendly placeholder message.
  if (tasks.length === 0) return <p>No tasks yet.</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {/* Clicking the task text is like crossing it off on paper.
              We add a line-through style when it's completed. */}
          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: "pointer",
            }}
            onClick={() =>
              dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })
            }
          >
            {task.text}
          </span>

          {/* The ❌ button is like erasing a task from the whiteboard. */}
          <button
            onClick={() =>
              dispatch({ type: "DELETE_TASK", payload: { id: task.id } })
            }
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
