import { TaskStatus } from "../types/types.js";

export const COLUMNS = [
    { id: TaskStatus.TODO, title: "To Do" },
    { id: TaskStatus.IN_PROGRESS, title: "In Progress" },
    { id: TaskStatus.DONE, title: "Done" },
];

export const INITIAL_TASKS = [{
        id: "1",
        title: "Research Project",
        description: "Gather requirements and create initial documentation",
        status: TaskStatus.TODO,
        progress: 0, // Added progress field
    },
    {
        id: "2",
        title: "Design System",
        description: "Create component library and design tokens",
        status: TaskStatus.TODO,
        progress: 0, // Added progress field
    },
    {
        id: "3",
        title: "API Integration",
        description: "Implement REST API endpoints",
        status: TaskStatus.IN_PROGRESS,
        progress: 50, // Added progress field
    },
    {
        id: "4",
        title: "Testing",
        description: "Write unit tests for core functionality",
        status: TaskStatus.DONE,
        progress: 100, // Added progress field
    },
];