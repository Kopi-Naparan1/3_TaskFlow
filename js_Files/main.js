// ============================
// 🔹 SELECT IMPORTANT ELEMENTS
// ============================

// Input field where you type new tasks
const addTaskInput = document.querySelector(".add-task");

// All task columns (e.g., "To Do", "In Progress", "Done")
const columns = document.querySelectorAll(".tasks-list");

// ======================================
// 🔹 WHEN USER PRESSES ENTER TO ADD TASK
// ======================================

addTaskInput.addEventListener("keypress", (e) => {
  // If the key pressed is "Enter" and the input isn't empty
  if (e.key === "Enter" && addTaskInput.value.trim() !== "") {
    // Create the task using what the user typed
    createTask(addTaskInput.value.trim());
    // Clear the input after adding
    addTaskInput.value = "";
  }
});

// ===========================================
// 🔹 FUNCTION: CREATE A NEW TASK VISUALLY + SAVE
// ===========================================

function createTask(taskText, targetSelector = ".tasks-list.present") {
  const task = document.createElement("div");
  task.classList.add("task");
  task.draggable = true;

  // ✅ Create a container for icons
  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add("icon-wrapper");

  const circleIcon = document.createElement("i");
  circleIcon.classList.add("fa-regular", "fa-circle");

  const checkIcon = document.createElement("i");
  checkIcon.classList.add("fa-solid", "fa-check");

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash");

  // Put icons inside the wrapper
  iconWrapper.appendChild(circleIcon);
  iconWrapper.appendChild(checkIcon);
  // do NOT append trash into the icon wrapper
  // iconWrapper.appendChild(trashIcon);

  // ✅ Create a <span> for task text
  const text = document.createElement("span");
  text.textContent = taskText;

  // ✅ Append all to the task (wrapper first so clicks bubble to it)
  task.appendChild(iconWrapper);
  task.appendChild(text);

  // place trash at the far right of the task row
  task.appendChild(trashIcon);

  // make trash actionable even though it's outside iconWrapper
  trashIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // avoid bubbling to iconWrapper (which toggles completed)
    task.remove();
    saveTasks();
  });

  // ✅ Add drag behavior
  addDragEvents(task);

  // ✅ Append the task to the column (use targetSelector)
  const target = document.querySelector(targetSelector);
  if (target) target.appendChild(task);

  // ✅ Add icon behaviors
  iconWrapper.addEventListener("click", (e) => {
    const targetEl = e.target;

    // Trash is handled by its own listener (kept for safety)
    if (targetEl.classList && targetEl.classList.contains("fa-trash")) {
      task.remove();
      saveTasks();
      return;
    }

    // When user clicks the circle/check, move task to next column
    if (
      targetEl.classList &&
      (targetEl.classList.contains("fa-circle") ||
        targetEl.classList.contains("fa-check"))
    ) {
      // find current column id (parent of .tasks-list)
      const currentList = task.closest(".tasks-list");
      const currentColId =
        currentList &&
        currentList.parentElement &&
        currentList.parentElement.id;

      // decide destination
      let destSelector = null;
      if (currentColId === "todo") destSelector = "#doing .tasks-list";
      else if (currentColId === "doing") destSelector = "#done .tasks-list";
      else if (currentColId === "done") {
        // already in done — toggle completed state instead of moving
        task.classList.toggle("completed");
        saveTasks();
        return;
      }

      const dest = destSelector ? document.querySelector(destSelector) : null;
      if (dest) {
        // visual state: only tasks in "done" should be marked completed
        if (destSelector.includes("#done")) task.classList.add("completed");
        else task.classList.remove("completed");

        dest.appendChild(task);
        saveTasks();
      }
    }
  });

  // ✅ Save tasks after adding
  saveTasks();
  return task;
}

// ===========================
// 🔹 FUNCTION: SAVE ALL TASKS
// ===========================

function saveTasks() {
  const data = {}; // Temporary storage for all columns

  columns.forEach((col) => {
    const id = col.parentElement && col.parentElement.id;
    if (!id) return;

    const tasks = Array.from(col.querySelectorAll(".task")).map((t) => {
      const span = t.querySelector("span"); // <-- fixed: define span
      return span ? span.textContent.trim() : t.textContent.trim();
    });

    data[id] = tasks;
  });

  localStorage.setItem("tasks", JSON.stringify(data));
}

// ==========================
// 🔹 FUNCTION: LOAD OLD TASKS
// ==========================

function loadTasks() {
  columns.forEach((col) => (col.innerHTML = ""));

  let data;
  try {
    data = JSON.parse(localStorage.getItem("tasks"));
  } catch (e) {
    console.error("Invalid localStorage data:", e);
    localStorage.removeItem("tasks");
    data = null;
  }
  if (!data) return;

  for (const [columnId, tasks] of Object.entries(data)) {
    const selector = `#${columnId} .tasks-list`;
    tasks.forEach((taskText) => {
      createTask(taskText, selector); // <-- use createTask so icons are created
    });
  }
}

// =======================================
// 🔹 FUNCTION: ADD DRAGGING INTERACTIONS
// =======================================

function addDragEvents(task) {
  // When dragging starts (pick up task)
  task.addEventListener("dragstart", (e) => {
    try {
      e.dataTransfer.setData("text/plain", ""); // Needed for Firefox
      e.dataTransfer.effectAllowed = "move"; // Allow "move" effect
    } catch (err) {
      // Some browsers don't need this
    }
    task.classList.add("dragging"); // Visually mark it
  });

  // When dragging ends (drop task)
  task.addEventListener("dragend", () => {
    task.classList.remove("dragging"); // Remove highlight
    saveTasks(); // Save new position
  });
}

// ===================================================
// 🔹 FUNCTION: SETUP DRAG & DROP FOR EACH COLUMN
// ===================================================

function initDragAndDrop() {
  columns.forEach((column) => {
    // While dragging over a column
    column.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow dropping here
      const draggingTask = document.querySelector(".dragging");
      if (!draggingTask) return;

      // Figure out the exact position to insert the task
      const afterElement = getDragAfterElement(column, e.clientY);

      // Append or insert depending on position
      if (afterElement == null) {
        column.appendChild(draggingTask);
      } else {
        column.insertBefore(draggingTask, afterElement);
      }
    });

    // When the drop is finalized
    column.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      if (!draggingTask) return;

      const afterElement = getDragAfterElement(column, e.clientY);

      if (afterElement == null) {
        column.appendChild(draggingTask);
      } else {
        column.insertBefore(draggingTask, afterElement);
      }

      // Save the new state permanently
      saveTasks();
    });
  });
}

// =====================================================
// 🔹 HELPER: FIND WHERE TO PLACE TASK DURING DRAG
// =====================================================

function getDragAfterElement(container, y) {
  // Get all tasks that are NOT being dragged
  const draggableElements = [
    ...container.querySelectorAll(".task:not(.dragging)"),
  ];

  // Find which element the dragged one should go before
  return (
    draggableElements
      .map((child) => {
        const box = child.getBoundingClientRect();
        return { element: child, offset: y - box.top - box.height / 2 };
      })
      // Filter only elements above the cursor (offset < 0)
      .filter((item) => item.offset < 0)
      // Pick the one closest to the cursor
      .sort((a, b) => b.offset - a.offset)[0]?.element ?? null
  );
}

// ====================================================
// 🔹 INITIALIZE WHEN PAGE LOADS
// ====================================================

window.addEventListener("DOMContentLoaded", () => {
  loadTasks(); // Restore saved tasks
  initDragAndDrop(); // Enable drag & drop
});
