// --------------------------------------------------
// AddTaskForm.tsx
// --------------------------------------------------
// This component is the "input box" for TaskFlow.
//
// 🧠 What it does:
// - Provides a text field + button for users to type a new task.
// - Keeps track of the text being typed using useState.
// - On submit, it passes the new task text up to the parent (TaskSaver)
//   through the `onAdd` callback.
//
// Think of this as the receptionist: it doesn't decide what to do
// with tasks (that's the reducer's job). It just collects the user's
// input and hands it off to the system.
// --------------------------------------------------

import { useState } from "react";

// The prop type is inline: we expect a single function `onAdd`
// that takes a string (the new task text).
export function AddTaskForm({ onAdd }: { onAdd: (text: string) => void }) {
  // --------------------------------------------------
  // 1️⃣ Local state for the input field
  // This only lives inside the form. Once submitted, the text
  // is sent upward and this state resets to "".
  // --------------------------------------------------
  const [text, setText] = useState("");

  // --------------------------------------------------
  // 2️⃣ Handle form submission
  // - Prevents the page from refreshing (default form behavior).
  // - Ignores empty or whitespace-only input.
  // - Calls the onAdd callback with the text.
  // - Clears the input field afterward.
  // --------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText(""); // reset input
  };

  // --------------------------------------------------
  // 3️⃣ Render
  // A simple form:
  // - Input box for typing the new task
  // - "Add" button to submit
  // --------------------------------------------------
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task"
      />
      <button type="submit">Add</button>
    </form>
  );
}
