import { useDraggable } from "@dnd-kit/core";
import { TaskStatus } from '../../types/types'; // Import TaskStatus

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
  
  // Helper function to determine progress bar color
  const getProgressColor = (progress) => {
    if (progress === 0 && task.status !== TaskStatus.TODO) return 'bg-gray-500';
    if (progress === 100 && task.status !== TaskStatus.DONE) return 'bg-gray-500';
    if (progress > 0 && progress < 100) return 'bg-yellow-500';
    if (progress === 100) return 'bg-green-500';
    if (progress === 0) return 'bg-gray-500';
    return 'bg-gray-500';
  };

  const getProgressColorClass = (progress, status) => {
    if (status === TaskStatus.TODO) return 'bg-gray-500';
    if (status === TaskStatus.DONE) return 'bg-green-500';
    return 'bg-yellow-500';
  };

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

        {/* Details Button */}
        <button
          onClick={handleDetailsClick}
          className="p-1 px-3 text-xs text-neutral-400 hover:text-neutral-100 bg-neutral-600 hover:bg-neutral-500 rounded transition-colors flex-shrink-0"
          title="View Details"
        >
          Details
        </button>
      </div>
    </div>
  );
}