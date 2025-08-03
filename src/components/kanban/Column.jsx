import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { AddTaskForm } from "./AddTaskForm";

export function Column({ column, tasks, onAddTask, onOpenDetails, users }) { // Accept 'users' prop
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleAddTask = (taskData) => {
    onAddTask(taskData);
    setIsAddingTask(false);
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-neutral-100">{column.title}</h2>
        <span className="rounded-full bg-neutral-700 px-2 py-1 text-xs text-neutral-400">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onOpenDetails={onOpenDetails}
            users={users} // Pass the users prop to TaskCard
          />
        ))}

        {isAddingTask ? (
          <AddTaskForm
            onAddTask={handleAddTask}
            columnId={column.id}
            onCancel={() => setIsAddingTask(false)}
          />
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="rounded-lg border-2 border-dashed border-neutral-600 bg-transparent p-4 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300 transition-colors"
          >
            + Add a task
          </button>
        )}
      </div>
    </div>
  );
}