import { useState } from "react";

export function AddTaskForm({ onAddTask, columnId, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        status: columnId,
        dueDate: dueDate || null,
        startDate: startDate || null,
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setStartDate("");
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
        className="w-full rounded-md border-2 border-transparent bg-neutral-600 px-2 py-1 text-white shadow-lg outline-none focus:border-blue-500"
        autoFocus
      />
      <textarea
        placeholder="Task description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-md border-2 border-transparent bg-neutral-600 px-2 py-1 text-white shadow-lg outline-none focus:border-blue-500"
        rows={3}
      />
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-neutral-300 mb-1">
          Start Date
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-300 mb-1">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 rounded-md bg-neutral-600 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 transition-colors"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-neutral-600 hover:bg-neutral-500 text-neutral-200 font-medium rounded-md py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
