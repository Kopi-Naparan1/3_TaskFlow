// App.tsx
// -------------------------------------------------------
// This is the "main stage" of our TaskFlow app.
// Everything starts here.
//
// Think of it like a band:
// - App is the stage manager
// - TaskInput is the singer (brings new tasks in)
// - TaskList is the drummer (keeps rhythm, shows what we have)
// - taskReducer is the sound engineer (decides how things change)
//
// Added fix: We wait until the component is "mounted"
// on the client before rendering (to avoid hydration mismatch).
// -------------------------------------------------------

import { useReducer, useEffect, useState } from "react";
import { taskReducer } from "./app/components/TaskReducer";
import { Task } from "./app/types/Task";
import TaskInput from "./app/components/TaskInput";
import TaskList from "./app/components/TaskList";

export default function App() {
  // 🧠 The brain: manages task state
  const [tasks, dispatch] = useReducer(taskReducer, [] as Task[]);

  // ⏳ State to track if we’re mounted on client
  const [mounted, setMounted] = useState(false);

  // ✅ useEffect only runs on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚪 Don’t render anything until client-side is ready
  if (!mounted) return null;

  return (
    <>
      <h1>📝 TaskFlow</h1>

      {/* 🎤 Singer: Adds new tasks */}
      <TaskInput dispatch={dispatch} />

      {/* 🥁 Drummer: Shows tasks + lets you toggle/delete */}
      <TaskList tasks={tasks} dispatch={dispatch} />
    </>
  );
}
