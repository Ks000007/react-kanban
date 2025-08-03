import { TaskStatus } from "../types/types.js";

export const COLUMNS = [
    { id: TaskStatus.TODO, title: "To Do" },
    { id: TaskStatus.IN_PROGRESS, title: "In Progress" },
    { id: TaskStatus.DONE, title: "Done" },
];

// Removed INITIAL_TASKS as tasks will be fetched from the backend