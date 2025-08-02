import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TaskStatus } from '../../types/types'; // Make sure this path is correct
import { COLUMNS } from '../../data/initialData'; // Make sure this path is correct

export const ProjectAnalytics = ({ tasks }) => {
  // Calculate Overall Project Completion
  const totalTasks = tasks.length;
  const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
  const averageProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;

  // Data for Task Distribution Pie Chart
  // Ensure COLUMNS is correctly imported and available
  const statusData = COLUMNS.map(column => ({
    name: column.title,
    value: tasks.filter(task => task.status === column.id).length,
  }));

  // Define colors for the pie chart segments consistently
  const statusColors = {
    [TaskStatus.TODO]: '#FFBB28',      // Yellow for To Do
    [TaskStatus.IN_PROGRESS]: '#00C49F', // Green for In Progress
    [TaskStatus.DONE]: '#0088FE',       // Blue for Done
  };

  // Adjust statusData to use the consistent colors
  const coloredStatusData = statusData.map(item => ({
    ...item,
    // Safely access the color based on the original column ID
    color: statusColors[COLUMNS.find(col => col.title === item.name)?.id] || '#A0A0A0' // Fallback color
  }));

  // Filter out data entries with value 0 for the Pie Chart
  const filteredColoredStatusData = coloredStatusData.filter(entry => entry.value > 0);

  // Calculate the sum of all values in the filtered data for percentage calculation
  const totalValue = filteredColoredStatusData.reduce((sum, entry) => sum + entry.value, 0);

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
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={filteredColoredStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={false} // Removed the label from the pie slices to prevent overlap
                >
                  {filteredColoredStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend
                  align="right"
                  verticalAlign="middle"
                  layout="vertical"
                  wrapperStyle={{ paddingLeft: '20px' }}
                  // Manually calculate the percentage for a more robust display
                  formatter={(value, entry) => {
                    const percentage = totalValue > 0
                      ? ((entry.payload.value / totalValue) * 100).toFixed(0)
                      : 0;
                    return `${value}: ${percentage}%`;
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};