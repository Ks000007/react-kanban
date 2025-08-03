import React, { useState } from 'react';
import { Navbar } from "../components/layout/Navbar";
import { CalendarView } from '../components/calendar/CalendarView';
import { TimelineView } from '../components/calendar/TimelineView'; // Import TimelineView
import { Modal } from '../components/common/Modal';
import { TaskDetails } from '../components/kanban/TaskDetails';

export const CalendarPage = ({ tasks, onSaveTaskDetails, onDeleteTask, showTimeline = false }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    onSaveTaskDetails(updatedTask);
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {showTimeline ? "Project Timeline" : "Project Calendar"}
          </h1>
          <p className="text-gray-400 text-lg">
            {showTimeline ? "Visualize your project schedule" : "Visualize your tasks and deadlines"}
          </p>
        </header>

        {showTimeline ? (
          <TimelineView tasks={tasks} onOpenDetails={handleOpenTaskDetails} />
        ) : (
          <CalendarView tasks={tasks} onOpenDetails={handleOpenTaskDetails} />
        )}
      </div>

      <Modal
        isOpen={!!selectedTask}
        onClose={handleCloseTaskDetails}
        title={selectedTask ? `Task: ${selectedTask.title}` : "Task Details"}
      >
        <TaskDetails
          task={selectedTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onCancel={handleCloseTaskDetails}
        />
      </Modal>
    </div>
  );
};
