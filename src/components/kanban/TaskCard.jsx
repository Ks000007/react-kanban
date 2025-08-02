import { useDraggable } from "@dnd-kit/core";

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
        {/* Progress Bar */}
        <div className="w-full bg-neutral-600 rounded-full h-2.5 mr-4"> {/* Container for the bar */}
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${task.progress || 0}%` }} // Dynamic width based on progress
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