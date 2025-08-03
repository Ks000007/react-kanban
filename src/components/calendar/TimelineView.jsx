import React from 'react';
import { TaskStatus } from '../../types/types';

export const TimelineView = ({ tasks, onOpenDetails }) => {
  // Filter tasks that have a startDate and dueDate
  const timelineTasks = tasks.filter(task => task.startDate && task.dueDate);

  if (timelineTasks.length === 0) {
    return (
      <div className="text-center text-neutral-400 p-6">
        <p>No tasks with a defined start and due date to display on the timeline.</p>
      </div>
    );
  }

  // Find min and max dates to set the timeline scale
  const allDates = timelineTasks.flatMap(task => [task.startDate, task.dueDate]);
  const minDate = new Date(Math.min(...allDates.map(date => new Date(date))));
  const maxDate = new Date(Math.max(...allDates.map(date => new Date(date))));
  
  const minDateFormatted = minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const maxDateFormatted = maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const timelineDuration = maxDate.getTime() - minDate.getTime();
  const dayInMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.ceil(timelineDuration / dayInMs);

  const getStatusColor = (status) => {
    if (status === TaskStatus.TODO) return 'bg-yellow-500';
    if (status === TaskStatus.IN_PROGRESS) return 'bg-blue-500';
    if (status === TaskStatus.DONE) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="p-6 bg-neutral-800 rounded-lg shadow-md overflow-x-auto custom-scrollbar">
      {/* Project duration header */}
      <div className="flex justify-between items-center mb-6 text-neutral-300">
        <h3 className="text-lg font-semibold">Project Start: {minDateFormatted}</h3>
        <h3 className="text-lg font-semibold">Project End: {maxDateFormatted}</h3>
      </div>
      
      <div className="flex flex-col space-y-4 min-w-[1000px]">
        {timelineTasks.map(task => {
          const taskStartDate = new Date(task.startDate);
          const taskDueDate = new Date(task.dueDate);
          const taskDurationMs = taskDueDate.getTime() - taskStartDate.getTime();

          const startOffsetDays = (taskStartDate.getTime() - minDate.getTime()) / dayInMs;
          const taskDurationDays = taskDurationMs / dayInMs;

          const startOffsetPercent = (startOffsetDays / totalDays) * 100;
          const durationPercent = (taskDurationDays / totalDays) * 100;
          
          return (
            <div key={task.id} className="flex items-center space-x-4">
              <div className="w-48 text-neutral-200 truncate">{task.title}</div>
              <div className="flex-1 bg-neutral-700 rounded-full h-8 relative">
                <div 
                  className={`absolute top-0 h-full rounded-full transition-all duration-300 ease-in-out flex items-center p-2 ${getStatusColor(task.status)}`}
                  style={{ left: `${startOffsetPercent}%`, width: `${durationPercent}%` }}
                  onClick={() => onOpenDetails(task)}
                  title={task.title}
                >
                  <span className="text-xs font-semibold text-white truncate">{task.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
