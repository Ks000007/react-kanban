import React, { useState } from 'react';
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { Navbar } from "../components/layout/Navbar";
import { INITIAL_TASKS } from '../data/initialData';
import { ProjectAnalytics } from '../components/kanban/ProjectAnalytics';
import { TaskStatus } from '../types/types';

export const DashboardPage = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      progress: 0,
      assignedTo: [], // New tasks are now unassigned by default with an empty array
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleSaveTaskDetails = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === updatedTask.id) {
          let newProgress = updatedTask.progress;
          if (updatedTask.status === TaskStatus.TODO) {
            newProgress = 0;
          } else if (updatedTask.status === TaskStatus.DONE) {
            newProgress = 100;
          }
          return { ...updatedTask, progress: newProgress };
        }
        return task;
      })
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
      prevTasks.map((task) => {
        if (task.id === taskId) {
          let newProgress = task.progress;
          if (newStatus === TaskStatus.TODO) {
            newProgress = 0;
          } else if (newStatus === TaskStatus.DONE) {
            newProgress = 100;
          }
          return { ...task, status: newStatus, progress: newProgress };
        }
        return task;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Kanban Board
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your tasks with drag and drop
          </p>
        </header>

        <div className="flex justify-center mb-12">
          <KanbanBoard
            tasks={tasks}
            onAddTask={handleAddTask}
            onSaveTaskDetails={handleSaveTaskDetails}
            onDeleteTask={handleDeleteTask}
            onDragEnd={handleDragEnd}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <ProjectAnalytics tasks={tasks} />
        </div>
      </div>
    </div>
  );
};
