// 👇 Task represents one single to-do item in TaskFlow
export type Task = {
  /**
   * A unique identifier for each task.
   * We use a string because IDs often come from libraries like uuid() or database-generated IDs.
   * Example: "a1b2c3d4"
   */
  id: string;

  /**
   * The actual content of the task that the user writes.
   * Example: "Buy groceries"
   */
  text: string;

  /**
   * Boolean flag that tells us if the task is finished or not.
   * true  = completed ✅
   * false = still pending ⏳
   */
  completed: boolean;

  /**
   * The date and time the task was created.
   * Useful for sorting tasks by newest/oldest.
   * Example: new Date("2025-09-23T12:34:56")
   */
  createdAt: Date;
};
