import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { UserTasks } from '../components/kanban/UserTasks';
import { Modal } from '../components/common/Modal';
import { TaskDetails } from '../components/kanban/TaskDetails';
import { authService, MOCK_USERS } from '../services/authService';

export const ProfilePage = ({ tasks, onSaveTaskDetails, onDeleteTask }) => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState("");

  const handleEditChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setError("");
    try {
      const profileImageFile = document.getElementById('profile-image').files[0];
      let newAvatar = user?.avatar;
      if (profileImageFile) {
        newAvatar = URL.createObjectURL(profileImageFile);
      }

      const updatedUser = {
        ...user,
        ...editedData,
        avatar: newAvatar,
      };
      
      await authService.updateUser(user.id, updatedUser);
      
      const reloadedUser = authService.getCurrentUser();
      login(reloadedUser.email, reloadedUser.password);
      
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save profile changes.");
      console.error(err);
    }
  };

  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    onSaveTaskDetails(updatedTask);
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center space-x-6 pb-6 border-b border-gray-700 mb-6">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{user?.name}</h3>
              <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {error && <div className="bg-red-500 p-3 rounded text-white">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Profile Picture
                </label>
                <input type="file" id="profile-image" className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={editedData.password}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Role
                </label>
                <select
                  name="role"
                  value={editedData.role}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
                <option value="tester">Tester</option>
                <option value="lead">Lead</option>
                </select>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <p className="mt-1 text-white">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Member Since
                </label>
                <p className="mt-1 text-white">January 2024</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-white mb-6 border-b border-gray-700 pb-3">
            Your Assigned Tasks
          </h3>
          <UserTasks 
            tasks={tasks}
            userId={user?.id}
            onOpenDetails={handleOpenTaskDetails}
          />
        </div>
      </div>
      
      <Modal
        isOpen={!!selectedTask}
        onClose={handleCloseTaskDetails}
        title={selectedTask ? `Task: ${selectedTask.title}` : "Task Details"}
      >
        <TaskDetails
          task={selectedTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onCancel={handleCloseTaskDetails}
        />
      </Modal>
    </div>
  );
};
