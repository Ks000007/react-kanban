import React, { useState, useEffect, useRef } from 'react';
import { TaskStatus } from '../../types/types';
import { Modal } from '../common/Modal'; // Import Modal
import { TaskDetails } from '../kanban/TaskDetails'; // Import TaskDetails

export const CalendarView = ({ tasks, onOpenDetails }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dropdownDay, setDropdownDay] = useState(null); // New state to track which day's dropdown is open
  const dropdownRef = useRef(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = getMonthName(currentDate);

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setDropdownDay(null); // Close dropdown when changing months
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setDropdownDay(null); // Close dropdown when changing months
  };
  
  const getTaskForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === formattedDate);
  };
  
  const getStatusColor = (status) => {
    if (status === TaskStatus.TODO) return 'bg-yellow-500';
    if (status === TaskStatus.IN_PROGRESS) return 'bg-blue-500';
    if (status === TaskStatus.DONE) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
  
  const handleToggleDropdown = (day, event) => {
    event.stopPropagation(); // Prevents click from propagating to the day cell
    setDropdownDay(dropdownDay === day ? null : day);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownDay(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="text-white text-lg hover:text-blue-500 transition-colors">
          &lt;
        </button>
        <h2 className="text-xl font-bold text-white">{monthName}</h2>
        <button onClick={nextMonth} className="text-white text-lg hover:text-blue-500 transition-colors">
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 text-center text-gray-400 font-medium border-b border-gray-700 pb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2 text-white" ref={dropdownRef}>
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="p-2 h-24"></div>
        ))}
        {days.map(day => {
          const tasksForDay = getTaskForDay(day);
          // Changed to show only 1 task if there are more than 2
          const visibleTasks = tasksForDay.length > 2 ? tasksForDay.slice(0, 1) : tasksForDay;
          const hiddenTaskCount = tasksForDay.length - visibleTasks.length;

          return (
            <div 
              key={day} 
              className="p-2 h-24 border border-gray-700 rounded-md overflow-visible hover:bg-neutral-700 transition-colors cursor-pointer relative"
            >
              <div className="text-right text-gray-300 text-sm">{day}</div>
              <div className="mt-1 space-y-1">
                {visibleTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => onOpenDetails(task)}
                    className={`text-xs text-white p-1 rounded-sm cursor-pointer truncate ${getStatusColor(task.status)}`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                {hiddenTaskCount > 0 && (
                  <>
                    <div
                      onClick={(e) => handleToggleDropdown(day, e)}
                      className="text-xs text-center text-neutral-400 p-1 rounded-sm bg-neutral-600 hover:bg-neutral-500 transition-colors cursor-pointer"
                    >
                      +{hiddenTaskCount} more
                    </div>
                    {dropdownDay === day && (
                      <div className="absolute top-full left-0 w-full p-2 bg-neutral-700 rounded-md shadow-lg z-20 space-y-1">
                        {tasksForDay.map(task => (
                          <div
                            key={task.id}
                            onClick={() => {
                              onOpenDetails(task);
                              setDropdownDay(null); // Close dropdown after selection
                            }}
                            className={`text-sm text-neutral-100 p-2 rounded-md hover:bg-neutral-600 transition-colors cursor-pointer truncate ${getStatusColor(task.status)}`}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
