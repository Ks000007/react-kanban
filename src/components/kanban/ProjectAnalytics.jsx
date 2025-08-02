import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TaskStatus } from '../../types/types'; // Import TaskStatus

export const ProjectAnalytics = ({ tasks }) => {
  // Calculate Overall Project Completion
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE || task.progress === 100);
  const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
  const averageProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;

  // Data for Task Distribution Pie Chart
  const statusData = COLUMNS.map(column => ({
    name: column.title,
    value: tasks.filter(task => task.status === column.id).length,
  }));

  // Define colors for the pie chart segments
  const COLORS = ['#FFBB28', '#00C49F', '#0088FE']; // Yellow for TODO, Green for IN_PROGRESS, Blue for DONE (adjust as needed)

  // Use a map to assign colors consistently based on TaskStatus
  const statusColors = {
    [TaskStatus.TODO]: '#FFBB28',      // A warm color for tasks to do
    [TaskStatus.IN_PROGRESS]: '#00C49F', // A vibrant color for tasks in progress
    [TaskStatus.DONE]: '#0088FE',       // A cool color for completed tasks
  };

  // Adjust statusData to use the consistent colors
  const coloredStatusData = statusData.map(item => ({
    ...item,
    color: statusColors[COLUMNS.find(col => col.title === item.name)?.id] || '#A0A0A0' // Fallback color
  }));

  return (
    <div className="p-4 bg-neutral-800 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold text-neutral-100 mb-6 border-b border-neutral-700 pb-3">
        Project Analytics
      </h2>

      {totalTasks === 0 ? (
        <p className="text-neutral-400 text-center mt-8">No tasks to display analytics for. Add some tasks!</p>
      ) : (
        <div className="flex-grow flex flex-col space-y-8">
          {/* Overall Project Completion */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-200 mb-4">
              Overall Project Progress
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className="text-neutral-600 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  {/* Progress circle */}
                  <circle
                    className="text-blue-500 progress-ring__circle stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${averageProgress * 2.51}, 251`}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-neutral-100">{averageProgress}%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-neutral-400 text-sm mt-2">
              (Average progress of all tasks)
            </p>
          </div>

          {/* Task Distribution by Status */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-200 mb-4">
              Tasks by Status
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={coloredStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {coloredStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// Import COLUMNS for status data mapping, needs to be accessible
// Assuming COLUMNS is also available globally or passed via context/props
// For now, let's import it directly if it's not changing.
import { COLUMNS } from '../../data/initialData';