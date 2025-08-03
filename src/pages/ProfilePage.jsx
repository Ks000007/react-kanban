import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { UserTasks } from '../components/kanban/UserTasks';
import { Modal } from '../components/common/Modal';
import { TaskDetails } from '../components/kanban/TaskDetails';
import { authService } from '../services/authService'; // Removed MOCK_USERS import

export const ProfilePage = ({ tasks, onSaveTaskDetails, onDeleteTask, users }) => { // Added 'users' prop
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
      const profileImageInput = document.getElementById('profile-image');
      let newAvatar = user?.avatar;
      
      // If a new file is selected, handle it. Note: For a real app, you'd upload this to a server
      // and get back a URL. For this mock backend, we're just creating a client-side URL.
      if (profileImageInput && profileImageInput.files[0]) {
        const file = profileImageInput.files[0];
        // For simplicity with the mock backend, we'll create a temporary URL.
        // In a real application, you'd upload this image to a storage service (e.g., S3).
        newAvatar = URL.createObjectURL(file); 
      }

      const updatedUser = {
        ...user,
        ...editedData,
        // Only update password if it's not empty
        password: editedData.password || user.password,
        avatar: newAvatar, // Use the potentially new avatar URL
      };
      
      // Call the backend service to update the user
      const result = await authService.updateUser(user.id, updatedUser);
      
      if (result.success) {
        // Re-login the user to update the context and cookies with the new data
        // For password change, you'd typically ask for current password or have a separate flow.
        // Here, we're just forcing a re-login with potentially new password/email.
        // A more robust solution would be to update user in context directly if backend confirms success without needing a full re-login.
        await login(result.user.email, editedData.password || user.password); 
        setIsEditing(false);
      } else {
        setError(result.message || "Failed to update profile.");
      }
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
                {/* Note: In a real app, this would involve uploading to storage and getting a URL */}
                <input type="file" id="profile-image" className="mt-1 text-neutral-300" accept="image/*" />
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
                {/* Placeholder for member since date - you might want to store this on user registration */}
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
          users={users} // Pass users to TaskDetails here
        />
      </Modal>
    </div>
  );
};