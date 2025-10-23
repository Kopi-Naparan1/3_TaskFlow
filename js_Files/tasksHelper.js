// js_Files/tasksHelper.js
import { saveTasks } from "./saveAndLoad.js";

export function wireTaskMover(task, iconWrapper) {
  iconWrapper.addEventListener("click", (e) => {
    const targetEl = e.target;

    if (targetEl.classList && targetEl.classList.contains("fa-trash")) {
      task.remove();
      saveTasks();
      return;
    }

    if (
      targetEl.classList &&
      (targetEl.classList.contains("fa-circle") ||
        targetEl.classList.contains("fa-check"))
    ) {
      const currentList = task.closest(".tasks-list");
      const currentColId =
        currentList && currentList.parentElement && currentList.parentElement.id;

      let destSelector = null;
      if (currentColId === "todo") destSelector = "#doing .tasks-list";
      else if (currentColId === "doing") destSelector = "#done .tasks-list";
      else if (currentColId === "done") {
        // Allow toggling while staying in 'done'; state will persist
        task.classList.toggle("completed");
        saveTasks();
        return;
      }

      const dest = destSelector ? document.querySelector(destSelector) : null;
      if (dest) {
        if (destSelector.includes("#done")) task.classList.add("completed");
        else task.classList.remove("completed");

        dest.appendChild(task);
        saveTasks();
      }
    }
  });
}