import React from 'react';
import { TaskStatus } from '../../types/types'; // Import TaskStatus

export const UserTasks = ({ tasks, userId, onOpenDetails }) => {
  const userAssignedTasks = tasks.filter(task => task.assignedTo.includes(userId));

  if (userAssignedTasks.length === 0) {
    return (
      <div className="text-center text-neutral-400 p-6">
        <p>You are not currently assigned to any tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userAssignedTasks.map(task => (
        <div key={task.id} className="bg-neutral-800 rounded-lg p-4 shadow-lg flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-lg text-neutral-100">{task.title}</h4>
            <p className="text-sm text-neutral-400">{task.description}</p>
            {/* Displaying Status and Progress */}
            <div className="mt-2 text-xs font-medium flex items-center space-x-2">
              <span 
                className={`
                  rounded-full px-2 py-1 
                  ${task.status === TaskStatus.DONE ? 'bg-green-500 text-white' : 
                    task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-500 text-neutral-900' : 
                    'bg-gray-500 text-white'}
                `}
              >
                {task.status.replace('_', ' ')}
              </span>
              {task.status === TaskStatus.IN_PROGRESS && (
                <span className="text-yellow-500">
                  {task.progress}% complete
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onOpenDetails(task)}
            className="p-1 px-3 text-xs text-neutral-400 hover:text-neutral-100 bg-neutral-600 hover:bg-neutral-500 rounded transition-colors"
            title="View Details"
          >
            Details
          </button>
        </div>
      ))}
    </div>
  );
};
