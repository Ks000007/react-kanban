import React from 'react';
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { Navbar } from "../components/layout/Navbar";
import { ProjectAnalytics } from '../components/kanban/ProjectAnalytics';
// Removed INITIAL_TASKS import
// TaskStatus is imported directly where needed, no change here
// import { TaskStatus } from '../types/types'; 

export const DashboardPage = ({ tasks, onAddTask, onSaveTaskDetails, onDeleteTask, onDragEnd, users }) => { // Added 'users' prop
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
            onAddTask={onAddTask}
            onSaveTaskDetails={onSaveTaskDetails}
            onDeleteTask={onDeleteTask}
            onDragEnd={onDragEnd}
            users={users} // Pass users to KanbanBoard for TaskCard and TaskDetails
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <ProjectAnalytics tasks={tasks} />
        </div>
      </div>
    </div>
  );
};