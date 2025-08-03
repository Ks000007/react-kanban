import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Column } from "./Column";
import { COLUMNS } from "../../data/initialData";
import { Modal } from "../common/Modal";
import { TaskDetails } from "./TaskDetails";

export function KanbanBoard({ tasks, onAddTask, onSaveTaskDetails, onDeleteTask, onDragEnd, users }) { // Added 'users' prop
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDragEnd = (event) => {
    onDragEnd(event);
    if (selectedTask && selectedTask.id === event.active.id) {
      setSelectedTask((prevSelected) => ({ ...prevSelected, status: event.over.id }));
    }
  };

  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  const handleSave = (updatedTask) => {
    onSaveTaskDetails(updatedTask);
    setSelectedTask(updatedTask);
  };

  const handleDelete = (taskId) => {
    onDeleteTask(taskId);
    setSelectedTask(null);
  };

  return (
    <div className="p-2">
      <div className="flex gap-8 overflow-x-auto custom-scrollbar">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onAddTask={onAddTask}
              onOpenDetails={handleOpenTaskDetails}
              users={users} // Pass the users prop here to Column
            />
          ))}
        </DndContext>
      </div>

      <Modal
        isOpen={!!selectedTask}
        onClose={handleCloseTaskDetails}
        title={selectedTask ? `Task: ${selectedTask.title}` : "Task Details"}
      >
        <TaskDetails
          task={selectedTask}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCloseTaskDetails}
          users={users} // Pass users to TaskDetails directly from KanbanBoard
        />
      </Modal>
    </div>
  );
}