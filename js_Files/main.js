// js_Files/main.js
// GOAL TO LEARN!!!

import { tasks_js } from "./tasks.js";
import { loadTasks } from "./saveAndLoad.js";
import { initDragAndDrop } from "./dragdrop.js";

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  tasks_js();
  initDragAndDrop();

  const heading = document.querySelector(".task-category h2[contenteditable]");
  if (heading) {
    // restore persisted title if available
    const savedTitle = localStorage.getItem("boardTitle");
    if (typeof savedTitle === "string" && savedTitle.length) {
      heading.textContent = savedTitle;
    }

    heading.addEventListener("click", (e) => {
      e.stopPropagation();
      heading.dataset.original = heading.textContent;
    });

    heading.addEventListener("focus", () => {
      heading.dataset.original = heading.textContent;
    });

    heading.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        heading.blur(); // commit current text
      } else if (e.key === "Escape") {
        heading.textContent = heading.dataset.original || heading.textContent;
        heading.blur(); // revert and exit edit mode
      }
    });

    heading.addEventListener("blur", () => {
      const value = (heading.textContent || "").trim();
      localStorage.setItem("boardTitle", value);
    });
  }
});