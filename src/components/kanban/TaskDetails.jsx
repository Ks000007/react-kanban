import React, { useState, useEffect } from 'react';
import { TaskStatus } from '../../types/types'; // Import TaskStatus

export const TaskDetails = ({ task, onSave, onDelete, onCancel }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedProgress, setEditedProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setEditedProgress(task.progress || 0);
    }
  }, [task]);

  if (!task) {
    return <p className="text-neutral-400">No task selected.</p>;
  }

  const handleSave = () => {
    onSave({
      ...task,
      title: editedTitle,
      description: editedDescription,
      progress: parseInt(editedProgress, 10),
    });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedProgress(task.progress || 0);
    setIsEditing(false);
    onCancel();
  };

  // Helper function to determine progress bar color
  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-500';
    if (progress > 0 && progress < 100) return 'bg-yellow-500';
    if (progress === 100) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="text-neutral-200">
      {isEditing ? (
        // Editing Mode
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 rounded-md bg-neutral-700 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
              className="w-full p-2 rounded-md bg-neutral-700 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Conditional rendering for the progress meter and slider */}
          {task.status === TaskStatus.IN_PROGRESS && (
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-neutral-300 mb-1">
                Progress (%)
              </label>
              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                step="1"
                value={editedProgress}
                onChange={(e) => setEditedProgress(e.target.value)}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-600 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full"
              />
              <span className="block text-center text-lg font-bold mt-2">{editedProgress}%</span>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Viewing Mode
        <div>
          <h3 className="text-2xl font-bold mb-3">{task.title}</h3>
          <p className="text-neutral-300 mb-4 whitespace-pre-wrap">{task.description}</p>
          <div className="space-y-2 mb-4">
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span className="capitalize">{task.status.toLowerCase().replace(/_/g, ' ')}</span>
            </p>
            <p>
              <span className="font-medium">Progress:</span> {task.progress || 0}%
            </p>
            {/* Progress Bar within details with dynamic styling */}
            <div className="w-full h-2.5 bg-neutral-600 rounded-full mt-2 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-in-out ${getProgressColor(task.progress)}`}
                style={{ width: `${task.progress || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Delete Task
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};