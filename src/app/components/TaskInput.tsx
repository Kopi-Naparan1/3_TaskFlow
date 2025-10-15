// --------------------------------------------------
// TaskInput.tsx
// --------------------------------------------------
// This component is a simple input box + button that
// lets the user type a new task and add it to the list.
//
// It doesn’t hold the tasks itself — instead it *dispatches*
// an "ADD_TASK" action to our reducer (the “control tower”).
// Think of this like the “order form” at a restaurant.
// --------------------------------------------------
"use client";

import { useState } from "react";
import { Action } from "./TaskReducer";

export default function TaskInput({
  dispatch,
}: {
  dispatch: React.Dispatch<Action>; // Dispatch function "send" something to the reducer
}) {
  // Local state: just for holding what the user is typing
  const [title, setTitle] = useState("");

  // Called when user hits "Add" button
  const handleAdd = () => {
    if (!title.trim()) return; // prevent empty tasks

    // Tell the reducer: “hey, add this new task”
    dispatch({
      type: "ADD_TASK",
      payload: { text: title }, // reducer will build the rest (id, completed, etc.)
    });

    setTitle(""); // clear the box so user can type a new one
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={title}
        placeholder="Enter task..."
        onChange={(e) => setTitle(e.target.value)} // keep state in sync with input
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
