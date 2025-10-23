// tasks.js
import { saveTasks } from "./saveAndLoad.js";
import { getAddTaskInput, getPresentList } from "./dom.js";
import { dragdrop_js } from "./dragdrop.js";
import { wireTaskMover } from "./tasksHelper.js";

export function tasks_js() {
  taskText();
}

// ===== ADDING TASKS =====
// #region ADDING_TASKS
function taskText() {
  const input = getAddTaskInput();
  if (!input) {
    console.warn(".add-task input not found — new tasks cannot be added");
    return;
  }
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const node = createTask(input.value.trim());
      if (node) addTask(node);
      input.value = "";
    }
  });
}

export function createTask(taskText, selector = null) {
  // Accept text from taskText() and make the task. Return the taskWrapper to be
  // accepted by addTask()
  // ==== ICONS ====
  const circleIcon = document.createElement("i");
  const checkIcon = document.createElement("i");
  const trashIcon = document.createElement("i");

  circleIcon.classList.add("fa-regular", "fa-circle");
  checkIcon.classList.add("fa-solid", "fa-check");
  trashIcon.classList.add("fa-solid", "fa-trash");
  // ===============

  // ====== The idea is: (check, circle) (text) (trash)
  let taskWrapper = document.createElement("div");
  taskWrapper.classList.add("task");
  taskWrapper.draggable = true;

  let iconWrapper = document.createElement("div");
  iconWrapper.classList.add("icon-wrapper");
  iconWrapper.appendChild(circleIcon);
  iconWrapper.appendChild(checkIcon);

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text"); // avoid duplicate 'task' class
  textSpan.textContent = taskText;

  makeEditable(textSpan);

  taskWrapper.appendChild(iconWrapper); // This has the check and circle icon
  taskWrapper.appendChild(textSpan); // This has the text from the input
  taskWrapper.append(trashIcon); // This has the trash icon

  // wire icon clicks (circle/check to move across columns)
  wireTaskMover(taskWrapper, iconWrapper);

  dragdrop_js(taskWrapper);

  trashIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTask(taskWrapper);
    saveTasks();
  });

  return taskWrapper;
}

function addTask(node, target = getPresentList()) {
  if (!node || !target) {
    console.warn("addTask: missing node or target");
    saveTasks();
    return;
  }
  target.appendChild(node);
  saveTasks();
}
// #endregion
//  =======================

// ======= UPDATING TASKS ======
// #region UPDATING_TASKS
function makeEditable(span) {
  // Make the text element editable.
  span.addEventListener("click", (e) => {
    e.stopPropagation();
    span.dataset.original = span.textContent;
    span.contentEditable = "true";
    span.focus();
    placeCaretAtEnd(span);
  });

  span.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      span.blur();
    } else if (e.key === "Escape") {
      span.textContent = span.dataset.original || "";
      span.blur();
    }
  });
  span.addEventListener("blur", () => {
    updateTask(span);
  });
}

// validate/save or revert when editing finishes

function updateTask(span) {
  const text = (span.textContent || "").trim();
  if (!text) {
    span.textContent = span.dataset.original || "";
  } else {
    span.dataset.original = text;
    if (typeof saveTasks === "function") saveTasks();
  }
  span.removeAttribute("contenteditable");
}

function placeCaretAtEnd(el) {
  if (!el) return; // Guard: element not found
  el.focus();

  // Handle input or textarea elements
  if (el.setSelectionRange && typeof el.value === "string") {
    const length = el.value.length;
    el.setSelectionRange(length, length);
    return;
  }

  // Handle contenteditable or regular elements
  const range = document.createRange();
  range.selectNodeContents(el);

  // If the element is empty, insert a text node to make caret visible
  if (!el.childNodes.length) {
    el.appendChild(document.createTextNode(""));
  }

  range.collapse(false); // false = move to end
  const sel = window.getSelection();
  if (!sel) return; // Guard: safety for weird environments
  sel.removeAllRanges();
  sel.addRange(range);
}
// #endregion
// =============================

// ===== DELETE TASKS ======
// #region DELETE_TASKS
function deleteTask(taskNode) {
  if (!taskNode) return;
  taskNode.remove();
  if (typeof saveTasks === "function") saveTasks();
}
// #endregion
// =========================
