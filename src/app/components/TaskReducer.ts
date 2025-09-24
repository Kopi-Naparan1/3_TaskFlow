// taskReducer.ts
// --------------------------------------------------
// Reducer logic for managing TaskFlow tasks using useReducer in React.
// All task-related state changes flow through this single "control tower"
// to ensure predictable, centralized updates.
// --------------------------------------------------
"use client";

import { useReducer } from "react";
import { Task } from "../types/Task";

/**
 * Represents all possible actions that can affect the tasks state.
 *
 * - ADD_TASK: Adds a new task with a unique ID, incomplete status, and timestamp.
 * - DELETE_TASK: Removes a task by its ID.
 * - TOGGLE_TASK: Toggles the completion status of a task by its ID.
 */
export type Action =
  | { type: "ADD_TASK"; payload: { text: string } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "TOGGLE_TASK"; payload: { id: string } };

/**
 * The reducer function for TaskFlow tasks.
 *
 * @param {Task[]} state - The current array of tasks.
 * @param {Action} action - The action object describing the update.
 * @returns {Task[]} - The new, immutably updated array of tasks.
 *
 * Notes:
 * - Always returns a new array; never mutates the existing state.
 * - Acts as a single source of truth for all task-related state updates.
 *
 * Example usage in a React component:
 *
 * const [tasks, dispatch] = useReducer(taskReducer, []);
 *
 * // Add a task
 * dispatch({ type: "ADD_TASK", payload: { text: "Learn React" } });
 */
export function taskReducer(state: Task[], action: Action): Task[] {
  let newState: Task[];

  switch (action.type) {
    case "ADD_TASK": {
      // Create a new task object with unique ID and timestamp
      const newTask: Task = {
        id: crypto.randomUUID?.(),
        text: action.payload.text,
        completed: false,
        createdAt: new Date(),
      };

      // Return a new array including the new task
      return [...state, newTask];
    }

    case "DELETE_TASK":
      // Remove the task that matches the provided ID
      return state.filter((task) => task.id !== action.payload.id);

    case "TOGGLE_TASK":
      // Toggle the completed status of the matching task
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      );

    default:
      // If action type is unknown, return state unchanged
      return state;
  }

  // Debug logs for development
  console.log("Action Dispatched:", action);
  console.log("New State:", newState);
  return newState;
}
