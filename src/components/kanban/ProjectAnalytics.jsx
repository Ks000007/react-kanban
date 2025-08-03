import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TaskStatus } from '../../types/types';
import { COLUMNS } from '../../data/initialData';

export const ProjectAnalytics = ({ tasks }) => {
  // Calculate Overall Project Completion
  const totalTasks = tasks.length;
  const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
  const averageProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;

  // Data for Task Distribution Pie Chart
  const statusData = COLUMNS.map(column => ({
    name: column.title,
    value: tasks.filter(task => task.status === column.id).length,
  }));
  const statusColors = {
    [TaskStatus.TODO]: '#FFBB28',
    [TaskStatus.IN_PROGRESS]: '#00C49F',
    [TaskStatus.DONE]: '#0088FE',
  };
  const coloredStatusData = statusData.map(item => ({
    ...item,
    color: statusColors[COLUMNS.find(col => col.title === item.name)?.id] || '#A0A0A0'
  }));
  const filteredColoredStatusData = coloredStatusData.filter(entry => entry.value > 0);
  const totalValue = filteredColoredStatusData.reduce((sum, entry) => sum + entry.value, 0);

  // Data for Burndown Chart
  const calculateBurndownData = () => {
    if (totalTasks === 0) return [];
    
    // Determine project start and end dates based on all tasks
    const allStartDates = tasks.map(task => new Date(task.startDate)).filter(Boolean);
    const allDueDates = tasks.map(task => new Date(task.dueDate)).filter(Boolean);
    
    if (allStartDates.length === 0 || allDueDates.length === 0) {
      return [];
    }

    const projectStartDate = new Date(Math.min(...allStartDates));
    const projectEndDate = new Date(Math.max(...allDueDates));
    
    projectStartDate.setHours(0, 0, 0, 0);
    projectEndDate.setHours(0, 0, 0, 0);

    const data = [];
    let currentDate = new Date(projectStartDate);
    const totalWork = tasks.length;
    let completedTasksCount = 0;

    // Sort tasks by due date to correctly calculate burndown
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    while (currentDate.getTime() <= projectEndDate.getTime()) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      
      // Count tasks that are done and whose due date has passed
      let tasksCompleted = sortedTasks.filter(task =>
        task.status === TaskStatus.DONE && new Date(task.dueDate).getTime() <= currentDate.getTime()
      ).length;
      
      data.push({
        date: formattedDate,
        ideal: totalWork - ((currentDate.getTime() - projectStartDate.getTime()) / (projectEndDate.getTime() - projectStartDate.getTime())) * totalWork,
        actual: totalWork - tasksCompleted,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Ensure the last data point shows 0 remaining tasks if all are done
    if (tasks.every(task => task.status === TaskStatus.DONE)) {
        data[data.length - 1].actual = 0;
    }
    
    return data;
  };
  
  const burndownData = calculateBurndownData();

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
                  <circle
                    className="text-neutral-600 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
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
                  label={false}
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
          
          {/* Burndown Chart */}
          {burndownData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-4">
                Project Burndown Chart
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={burndownData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="date" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#d1d5db', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="ideal" stroke="#9ca3af" strokeDasharray="5 5" name="Ideal Burndown" />
                  <Line type="monotone" dataKey="actual" stroke="#ef4444" name="Actual Burndown" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-neutral-400 mt-2">
                Shows remaining tasks over time. Based on start and due dates.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
