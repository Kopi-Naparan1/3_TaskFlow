// js_Files/dragdrop.js
import { getColumns } from "./dom.js";
import { saveTasks } from "./saveAndLoad.js";

export function dragdrop_js(task) {
  addDragEvents(task);
}

function addDragEvents(task) {
  task.addEventListener("dragstart", (e) => {
    try {
      e.dataTransfer.setData("text/plain", "");
      e.dataTransfer.effectAllowed = "move";
    } catch {}
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
  });
}

export function initDragAndDrop() {
  getColumns().forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      if (!draggingTask) return;

      const afterElement = getDragAfterElement(column, e.clientY);
      if (afterElement == null) {
        column.appendChild(draggingTask);
      } else {
        column.insertBefore(draggingTask, afterElement);
      }

      const destColId = column.parentElement && column.parentElement.id;
      if (destColId === "done") draggingTask.classList.add("completed");
      else draggingTask.classList.remove("completed");

      saveTasks();
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task:not(.dragging)"),
  ];
  return (
    draggableElements
      .map((child) => {
        const box = child.getBoundingClientRect();
        return { element: child, offset: y - box.top - box.height / 2 };
      })
      .filter((item) => item.offset < 0)
      .sort((a, b) => b.offset - a.offset)[0]?.element ?? null
  );
}