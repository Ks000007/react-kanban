import React, { useState, useEffect } from 'react';
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
import { CalendarPage } from "./pages/CalendarPage";
import { TaskStatus } from './types/types';
import { authService } from './services/authService';
import { LoadingSpinner } from './components/common/LoadingSpinner';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from the backend
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [tasksResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:3001/api/tasks'),
          authService.getAllUsers()
        ]);
        const tasksData = await tasksResponse.json();
        
        setTasks(tasksData);
        setUsers(usersResponse);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleSaveTaskDetails = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      const savedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === savedTask.id ? savedTask : task))
      );
    } catch (error) {
      console.error('Failed to save task details:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:3001/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.id;

    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    let newProgress = taskToUpdate.progress;
    if (newStatus === TaskStatus.TODO) {
      newProgress = 0;
    } else if (newStatus === TaskStatus.DONE) {
      newProgress = 100;
    }
    const updatedTask = { ...taskToUpdate, status: newStatus, progress: newProgress };
    
    await handleSaveTaskDetails(updatedTask);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
                  users={users}
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
                  users={users}
                  onSaveTaskDetails={handleSaveTaskDetails}
                  onDeleteTask={handleDeleteTask}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage
                  tasks={tasks}
                  users={users}
                  onSaveTaskDetails={handleSaveTaskDetails}
                  onDeleteTask={handleDeleteTask}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <CalendarPage
                  tasks={tasks}
                  users={users}
                  onSaveTaskDetails={handleSaveTaskDetails}
                  onDeleteTask={handleDeleteTask}
                  showTimeline={true}
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
