import React, { useState } from 'react';
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { Navbar } from "../components/layout/Navbar";
import { INITIAL_TASKS } from '../data/initialData';
import { ProjectAnalytics } from '../components/kanban/ProjectAnalytics';

export const DashboardPage = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      progress: 0,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleSaveTaskDetails = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar"> {/* Allow vertical scrolling */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Kanban Board
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your tasks with drag and drop
          </p>
        </header>

        {/* Kanban Board - Centered and takes full width for its content */}
        <div className="flex justify-center mb-12"> {/* Centering container, added mb-12 for space below */}
          <KanbanBoard
            tasks={tasks}
            onAddTask={handleAddTask}
            onSaveTaskDetails={handleSaveTaskDetails}
            onDeleteTask={handleDeleteTask}
            onDragEnd={handleDragEnd}
          />
        </div>

        {/* Project Analytics - Below the Kanban Board, centered and wider */}
        <div className="max-w-4xl mx-auto"> {/* Max width for analytics, auto margins for centering */}
          <ProjectAnalytics tasks={tasks} />
        </div>
      </div>
    </div>
  );
};