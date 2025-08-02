import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Column } from "./Column";
import { COLUMNS, INITIAL_TASKS } from "../../data/initialData";
import { Modal } from "../common/Modal";
import { TaskDetails } from "./TaskDetails";

export function KanbanBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    // After drag, if the task was the selected one, update it in the modal too
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prevSelected) => ({ ...prevSelected, status: newStatus }));
    }
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(), // Simple ID generation
      ...taskData,
      progress: 0, // Initialize progress for new tasks
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Function to open task details modal
  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
  };

  // Function to close task details modal
  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  // Function to save edited task details
  const handleSaveTaskDetails = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setSelectedTask(updatedTask); // Update the selected task in state to reflect changes in modal immediately
  };

  // Function to delete a task
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setSelectedTask(null); // Close the modal after deletion
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Kanban Board
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your tasks with drag and drop
        </p>
      </header>

      <div className="flex gap-8 overflow-x-auto max-w-full w-[calc(80rem)]">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onAddTask={handleAddTask}
              onOpenDetails={handleOpenTaskDetails}
            />
          ))}
        </DndContext>
      </div>

      {/* Task Details Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={handleCloseTaskDetails}
        title={selectedTask ? `Task: ${selectedTask.title}` : "Task Details"}
      >
        <TaskDetails
          task={selectedTask}
          onSave={handleSaveTaskDetails}
          onDelete={handleDeleteTask}
          onCancel={handleCloseTaskDetails} // Pass close handler for cancel button
        />
      </Modal>
    </div>
  );
}