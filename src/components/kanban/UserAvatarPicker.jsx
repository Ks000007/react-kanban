import React, { useState } from 'react';
// Removed MOCK_USERS import
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to access the current user

export const UserAvatarPicker = ({ assignedTo, onAssign, allUsers }) => { // Added allUsers prop
  const [isOpen, setIsOpen] = useState(false);
  const { user: currentUser } = useAuth();
  // Filter assigned users from allUsers prop instead of MOCK_USERS
  const assignedUsers = allUsers.filter(user => assignedTo.includes(user.id));

  const handleToggleUser = (userId) => {
    // Check if the user is already assigned
    if (assignedTo.includes(userId)) {
      // If yes, remove them
      onAssign(assignedTo.filter(id => id !== userId));
    } else {
      // If no, add them
      onAssign([...assignedTo, userId]);
    }
  };
  
  // Close the dropdown when clicking outside
  const pickerRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pickerRef]);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
      >
        <div className="flex -space-x-2 overflow-hidden">
          {assignedUsers.slice(0, 3).map(assignedUser => ( // Show up to 3 avatars
            <img
              key={assignedUser.id}
              src={assignedUser.avatar}
              alt={assignedUser.name}
              title={assignedUser.name}
              className="w-8 h-8 rounded-full border-2 border-neutral-500"
            />
          ))}
          {assignedUsers.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center border-2 border-neutral-500 text-neutral-300 text-xs">
              +{assignedUsers.length - 3}
            </div>
          )}
          {assignedUsers.length === 0 && (
            <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center border-2 border-dashed border-neutral-500 text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-neutral-300">
          {assignedUsers.length > 0 ? `${assignedUsers.length} assigned` : 'Unassigned'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-56 bg-neutral-700 rounded-lg shadow-xl z-10 p-2">
          <h4 className="text-sm font-semibold text-neutral-300 px-2 pt-1 pb-2 border-b border-neutral-600">Assign to...</h4>
          {allUsers.map(user => ( // Use allUsers instead of MOCK_USERS
            <div
              key={user.id}
              onClick={() => handleToggleUser(user.id)}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-600 ${assignedTo.includes(user.id) ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className={`text-neutral-100 ${assignedTo.includes(user.id) ? 'font-bold' : ''}`}>{user.name}</span>
              {assignedTo.includes(user.id) && (
                <span className="ml-auto text-white">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};