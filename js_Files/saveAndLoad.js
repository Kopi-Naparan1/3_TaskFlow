// js_Files/saveAndLoad.js
import { getColumns } from "./dom.js";
import { createTask } from "./tasks.js";

export function saveTasks() {
  const data = {};
  getColumns().forEach((col) => {
    const id = col.parentElement && col.parentElement.id;
    if (!id) return;
    const tasks = Array.from(col.querySelectorAll(".task")).map((t) => {
      const span = t.querySelector("span");
      const text = span ? span.textContent.trim() : t.textContent.trim();
      const completed = t.classList.contains("completed");
      return { text, completed };
    });
    data[id] = tasks;
  });
  localStorage.setItem("tasks", JSON.stringify(data));
}

export function loadTasks() {
  getColumns().forEach((col) => (col.innerHTML = ""));
  let data;
  try {
    data = JSON.parse(localStorage.getItem("tasks"));
  } catch {
    localStorage.removeItem("tasks");
    data = null;
  }
  if (!data) return;

  for (const [columnId, tasks] of Object.entries(data)) {
    const container = document.querySelector(`#${columnId} .tasks-list`);
    if (!container) continue;
    tasks.forEach((item) => {
      const isString = typeof item === "string";
      const taskText = isString ? item : item.text;
      // Back-compat: if old storage (string), infer completed from column 'done'
      const completed = isString ? columnId === "done" : !!item.completed;

      const node = createTask(taskText);
      if (completed) node.classList.add("completed");
      container.appendChild(node); // append the created node
    });
  }
}