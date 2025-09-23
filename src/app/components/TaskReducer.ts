// taskReducer.ts
// --------------------------------------------------
// This file contains the reducer logic for managing
// tasks in TaskFlow (add, delete, toggle complete).
// We’re using useReducer in React so that all task-
// related actions flow through one predictable place.
//
// Think of it like a “control tower”: it receives
// actions (ADD_TASK, DELETE_TASK, TOGGLE_TASK), and
// decides how to update the state array of tasks.
// --------------------------------------------------

import { Task } from "../types/Task";

// Define the allowed "actions" that can happen to our tasks.
// Each action has a "type" and sometimes extra data (payload).
export type Action =
  | { type: "ADD_TASK"; payload: { text: string } } // when user adds a task
  | { type: "DELETE_TASK"; payload: { id: string } } // when user deletes by id
  | { type: "TOGGLE_TASK"; payload: { id: string } }; // when user checks/unchecks task

// Reducer function: receives current state (array of tasks)
// and an action, then returns a *new* state (immutably).
export function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "ADD_TASK": {
      // Create a new task object
      const newTask: Task = {
        id: crypto.randomUUID(), // generate unique ID
        text: action.payload.text, // take text from payload
        completed: false, // new tasks start incomplete
        createdAt: new Date(), // track creation time
      };

      // Return a new array with the existing tasks + the new one
      return [...state, newTask];
    }

    case "DELETE_TASK":
      // Filter out the task that matches the given id
      return state.filter((task) => task.id !== action.payload.id);

    case "TOGGLE_TASK":
      // Map over all tasks:
      // if task.id matches → flip its completed status
      // else → keep it unchanged
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      );

    default:
      // If the action type doesn’t match, just return the state as-is
      return state;
  }
}
