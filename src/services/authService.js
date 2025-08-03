import Cookies from "js-cookie";

const API_BASE_URL = 'http://localhost:3001/api';

// Removed MOCK_USERS as it's no longer needed

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();

            if (result.success) {
                // Mock token for frontend, real apps would get a token from the backend
                const token = btoa(JSON.stringify({ id: result.user.id, email: result.user.email }));
                Cookies.set("auth-token", token, { expires: 7 });
                Cookies.set("user-data", JSON.stringify(result.user), { expires: 7 });
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login.' };
        }
    },

    async register(email, password, name, role) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });
            const result = await response.json();

            if (result.success) {
                const token = btoa(JSON.stringify({ id: result.user.id, email: result.user.email }));
                Cookies.set("auth-token", token, { expires: 7 });
                Cookies.set("user-data", JSON.stringify(result.user), { expires: 7 });
            }
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'An error occurred during registration.' };
        }
    },

    async updateUser(userId, updatedUser) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });
            const result = await response.json();

            if (result.success) {
                // Update the user data in cookies with the latest from the backend
                Cookies.set("user-data", JSON.stringify(result.user), { expires: 7 });
            }
            return result;
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, message: 'An error occurred during profile update.' };
        }
    },

    async getAllUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return await response.json();
        } catch (error) {
            console.error('Get all users error:', error);
            return [];
        }
    },

    logout() {
        Cookies.remove("auth-token");
        Cookies.remove("user-data");
    },

    getCurrentUser() {
        const userData = Cookies.get("user-data");
        return userData ? JSON.parse(userData) : null;
    },

    isAuthenticated() {
        return !!Cookies.get("auth-token");
    },
};