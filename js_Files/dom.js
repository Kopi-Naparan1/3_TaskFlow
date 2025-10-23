export function ready(fn) {
  if (document.readyState !== "loading") return fn();
  document.addEventListener("DOMContentLoaded", fn);
}

// export functions that query when called (safer than module-level consts)
export const getColumns = () =>
  Array.from(document.querySelectorAll(".tasks-list"));

export const getAddTaskInput = () => document.querySelector(".add-task");

export const getPresentList = () =>
  document.querySelector(".tasks-list.present");

export const getCurrentList = () =>
  document.querySelector(".tasks-list.current");

export const getCompletedList = () =>
  document.querySelector(".tasks-list.completed");
