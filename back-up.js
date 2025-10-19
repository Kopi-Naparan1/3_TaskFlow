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

function createTask(taskText) {
  // Create a new <div> for the task
  const task = document.createElement("div");
  task.classList.add("task"); // Add a class for styling
  task.textContent = taskText; // Show the text the user typed
  task.draggable = true; // Make the task draggable (for drag & drop)

  // Give it drag behavior (like pick-up, drop, move)
  addDragEvents(task);

  // Add it to the "present" column (the default active list)
  document.querySelector(".tasks-list.present").appendChild(task);

  // Save everything to localStorage so it persists when refreshing
  saveTasks();
}

// ===========================
// 🔹 FUNCTION: SAVE ALL TASKS
// ===========================

function saveTasks() {
  const data = {}; // Temporary storage for all columns

  columns.forEach((col) => {
    // Get the column's ID (like 'todo', 'progress', etc.)
    const id = col.parentElement.id;

    // Collect all task texts in this column
    const tasks = Array.from(col.querySelectorAll(".task")).map(
      (t) => t.textContent
    );

    // Save it in the format { "todo": ["Task1", "Task2"], ... }
    data[id] = tasks;
  });

  // Convert it into a string and store it permanently
  localStorage.setItem("tasks", JSON.stringify(data));
}

// ==========================
// 🔹 FUNCTION: LOAD OLD TASKS
// ==========================

function loadTasks() {
  // First, clear all current tasks (for a clean slate)
  columns.forEach((col) => (col.innerHTML = ""));

  let data;
  try {
    // Try reading tasks from localStorage
    data = JSON.parse(localStorage.getItem("tasks"));
  } catch (e) {
    // If corrupted data is found, clear it
    console.error("Invalid localStorage data:", e);
    localStorage.removeItem("tasks");
    data = null;
  }

  // If nothing saved before, just stop
  if (!data) return;

  // Loop through each column and recreate its tasks
  for (const [columnId, tasks] of Object.entries(data)) {
    const col = document.querySelector(`#${columnId} .tasks-list`);

    tasks.forEach((taskText) => {
      const task = document.createElement("div");
      task.classList.add("task");
      task.textContent = taskText;
      task.draggable = true;
      addDragEvents(task);
      col.appendChild(task); // Add the recreated task
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
