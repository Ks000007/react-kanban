import { useDraggable } from "@dnd-kit/core";
import { TaskStatus } from '../../types/types';
import { MOCK_USERS } from '../../services/authService';

export function TaskCard({ task, onOpenDetails }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onOpenDetails(task);
  };
  
  const getProgressColorClass = (progress, status) => {
    if (status === TaskStatus.TODO) return 'bg-gray-500';
    if (status === TaskStatus.DONE) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const assignedUsers = MOCK_USERS.filter(user => task.assignedTo.includes(user.id));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md transition-shadow relative flex flex-col"
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab pb-2 mb-2 border-b border-neutral-600 flex-grow"
      >
        <h3 className="font-medium text-neutral-100">{task.title}</h3>
        <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
      </div>

      {/* Footer with Progress Bar and Details Button */}
      <div className="flex justify-between items-center mt-2">
        {/* Progress Bar with dynamic styling */}
        <div className="w-full bg-neutral-600 rounded-full h-2.5 mr-4 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-in-out ${getProgressColorClass(task.progress, task.status)}`}
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
        
        {/* User Avatars and Details Button container */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          {/* Display multiple avatars */}
          <div className="flex -space-x-2 overflow-hidden">
            {assignedUsers.slice(0, 3).map(assignedUser => ( // Show up to 3 avatars
              <img 
                key={assignedUser.id}
                src={assignedUser.avatar} 
                alt={assignedUser.name} 
                title={assignedUser.name}
                className="w-6 h-6 rounded-full border-2 border-neutral-500" 
              />
            ))}
            {assignedUsers.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center border-2 border-neutral-500 text-neutral-300 text-xs">
                +{assignedUsers.length - 3}
              </div>
            )}
          </div>
          {assignedUsers.length === 0 && (
            <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center border-2 border-dashed border-neutral-500 text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Details Button */}
          <button
            onClick={handleDetailsClick}
            className="p-1 px-3 text-xs text-neutral-400 hover:text-neutral-100 bg-neutral-600 hover:bg-neutral-500 rounded transition-colors"
            title="View Details"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
