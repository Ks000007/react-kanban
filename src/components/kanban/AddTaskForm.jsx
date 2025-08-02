import { useState } from "react";

export function AddTaskForm({ onAddTask, columnId, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        status: columnId,
      });
      setTitle("");
      setDescription("");
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg bg-neutral-700 p-4"
    >
      <input
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
        autoFocus
      />
      <textarea
        placeholder="Task description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
        rows={3}
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1">
          Add Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-grayscale-700 hover:bg-grayscale-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
