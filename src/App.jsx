import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";

import { INITIAL_TASKS } from './data/initialData';
import { TaskStatus } from './types/types';

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      progress: 0,
      assignedTo: [],
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleSaveTaskDetails = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === updatedTask.id) {
          let newProgress = updatedTask.progress;
          if (updatedTask.status === TaskStatus.TODO) {
            newProgress = 0;
          } else if (updatedTask.status === TaskStatus.DONE) {
            newProgress = 100;
          }
          return { ...updatedTask, progress: newProgress };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          let newProgress = task.progress;
          if (newStatus === TaskStatus.TODO) {
            newProgress = 0;
          } else if (newStatus === TaskStatus.DONE) {
            newProgress = 100;
          }
          return { ...task, status: newStatus, progress: newProgress };
        }
        return task;
      })
    );
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onSaveTaskDetails={handleSaveTaskDetails}
                  onDeleteTask={handleDeleteTask}
                  onDragEnd={handleDragEnd}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage
                  tasks={tasks}
                  onSaveTaskDetails={handleSaveTaskDetails}
                  onDeleteTask={handleDeleteTask}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
