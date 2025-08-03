import React, { useState, useEffect } from 'react';
import { TaskStatus } from '../../types/types';
import { CircularProgressMeter } from './CircularProgressMeter'; // Import CircularProgressMeter
import { UserAvatarPicker } from './UserAvatarPicker';

export const TaskDetails = ({ task, onSave, onDelete, onCancel, users }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedProgress, setEditedProgress] = useState(0);
  const [editedAssignedTo, setEditedAssignedTo] = useState([]);
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedStartDate, setEditedStartDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setEditedProgress(task.progress || 0);
      setEditedAssignedTo(task.assignedTo);
      setEditedDueDate(task.dueDate || '');
      setEditedStartDate(task.startDate || '');
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
      assignedTo: editedAssignedTo,
      dueDate: editedDueDate || null,
      startDate: editedStartDate || null,
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
    setEditedAssignedTo(task.assignedTo);
    setEditedDueDate(task.dueDate || '');
    setEditedStartDate(task.startDate || '');
    setIsEditing(false);
    onCancel();
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-500';
    if (progress > 0 && progress < 100) return 'bg-yellow-500';
    if (progress === 100) return 'bg-green-500';
    return 'bg-gray-500';
  };
  
  const getAssignedUserNames = () => {
    if (!task.assignedTo || task.assignedTo.length === 0) {
      return 'Unassigned';
    }
    const names = users.filter(user => task.assignedTo.includes(user.id)).map(user => user.name);
    return names.join(', ');
  };

  return (
    <div className="text-neutral-200">
      {isEditing ? (
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

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-300 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full p-2 rounded-md bg-neutral-700 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-neutral-300 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={editedStartDate}
              onChange={(e) => setEditedStartDate(e.target.value)}
              className="w-full p-2 rounded-md bg-neutral-700 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Assigned To
            </label>
            <UserAvatarPicker 
              assignedTo={editedAssignedTo}
              onAssign={setEditedAssignedTo}
              allUsers={users}
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold mb-3">{task.title}</h3>
          <p className="text-neutral-300 mb-4 whitespace-pre-wrap">{task.description}</p>
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              Status:{' '}
              <span className="capitalize font-normal">{task.status.toLowerCase().replace(/_/g, ' ')}</span>
            </p>

            {task.status === TaskStatus.IN_PROGRESS ? (
              <div className="flex flex-col items-center">
                <CircularProgressMeter progress={task.progress} />
                <p className="text-center text-neutral-400 text-sm mt-2">
                  This task is currently {task.progress}% complete.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-neutral-200">
                  Progress:{' '}
                  <span className="font-normal">{task.progress || 0}%</span>
                </p>
                <div className="w-full h-2.5 bg-neutral-600 rounded-full mt-2 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-in-out ${getProgressColor(task.progress)}`}
                    style={{ width: `${task.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <p className="text-lg font-semibold">
              Assigned To:
              <span className="capitalize font-normal ml-2">
                {getAssignedUserNames()}
              </span>
            </p>

            <p className="text-lg font-semibold">
              Due Date:
              <span className="capitalize font-normal ml-2">
                {task.dueDate ? task.dueDate : 'No due date'}
              </span>
            </p>
            <p className="text-lg font-semibold">
              Start Date:
              <span className="capitalize font-normal ml-2">
                {task.startDate ? task.startDate : 'No start date'}
              </span>
            </p>
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Delete Task
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Edit Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};