// --------------------------------------------------
// TaskSaver.tsx
// --------------------------------------------------
// This component is the "brain + glue" for TaskFlow.
//
// 🧠 What it does:
// - Loads tasks from localStorage (so they survive page refresh).
// - Uses useReducer with taskReducer to manage task state (add, toggle, delete).
// - Automatically saves tasks back to localStorage when they change.
// - Renders a task list UI with an input form (AddTaskForm).
//
// Think of this file as the "project manager": it doesn't do the actual work
// (like defining task shapes or reducer logic) — it just connects everything
// together and makes sure tasks stay alive between sessions.
// --------------------------------------------------

import { AddTaskForm } from "./AddTaskForm";
import { useReducer, useEffect } from "react";
import { taskReducer } from "./TaskReducer";

export default function TaskSaver() {
  // --------------------------------------------------
  // 1️⃣ useReducer for state management
  // Instead of useState, we use useReducer with taskReducer so
  // all updates flow through a single "control tower."
  // This makes logic predictable and testable.
  //
  // The third argument (initializer function) pulls tasks
  // out of localStorage on first load. This way, if you refresh
  // the page, your tasks don’t vanish.
  // --------------------------------------------------
  const [tasks, dispatch] = useReducer(taskReducer, [], () => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // --------------------------------------------------
  // 2️⃣ Sync state with localStorage
  // Whenever tasks change, we overwrite "tasks" in localStorage.
  // This acts like a mini-database, so tasks persist.
  // --------------------------------------------------
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // --------------------------------------------------
  // 3️⃣ Dispatching helper functions
  // These are small wrappers around dispatch() so our UI
  // doesn’t need to worry about constructing action objects.
  // Cleaner to call handleAdd("Learn React") instead of
  // dispatch({ type: "ADD_TASK", payload: { text: "Learn React" } }).
  // --------------------------------------------------
  const handleAdd = (text: string) => {
    dispatch({ type: "ADD_TASK", payload: { text } });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_TASK", payload: { id } });
  };

  const handleToggle = (id: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: { id } });
  };

  // --------------------------------------------------
  // 4️⃣ Render UI
  // - Shows a header
  // - Renders AddTaskForm (child component responsible for input box)
  // - Maps through all tasks and displays them as list items
  //   - Clicking on a task toggles its completion (strike-through)
  //   - Each task also has a delete button
  // --------------------------------------------------
  return (
    <div>
      <h1>TaskFlow</h1>

      {/* Add new tasks */}
      <AddTaskForm onAdd={handleAdd} />

      {/* Task list display */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => handleToggle(task.id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
