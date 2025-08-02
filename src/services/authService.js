import Cookies from "js-cookie";

// Mock users database with more details
const MOCK_USERS = [{
        id: "1",
        email: "admin@kanban.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
        avatar: "https://placehold.co/150x150/ff69b4/ffffff?text=AU",
        color: "#ff69b4",
    },
    {
        id: "2",
        email: "user@kanban.com",
        password: "user123",
        name: "Regular User",
        role: "user",
        avatar: "https://placehold.co/150x150/87ceeb/ffffff?text=RU",
        color: "#87ceeb",
    },
    {
        id: "3",
        email: "jane.doe@kanban.com",
        password: "jane123",
        name: "Jane Doe",
        role: "user",
        avatar: "https://placehold.co/150x150/9370db/ffffff?text=JD",
        color: "#9370db",
    },
    {
        id: "4",
        email: "john.smith@kanban.com",
        password: "john123",
        name: "John Smith",
        role: "user",
        avatar: "https://placehold.co/150x150/ff4500/ffffff?text=JS",
        color: "#ff4500",
    },
];

// Re-export MOCK_USERS to be accessible by other components for assignment
export { MOCK_USERS };

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
    async login(email, password) {
        await delay(1000); // Simulate network delay

        const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (user) {
            const token = btoa(JSON.stringify({ id: user.id, email: user.email }));
            const userData = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                color: user.color,
            };

            // Store in cookies
            Cookies.set("auth-token", token, { expires: 7 });
            Cookies.set("user-data", JSON.stringify(userData), { expires: 7 });

            return { success: true, user: userData, token };
        }

        return { success: false, message: "Invalid email or password" };
    },

    async register(email, password, name) {
        await delay(1000);

        // Check if user already exists
        const existingUser = MOCK_USERS.find((u) => u.email === email);
        if (existingUser) {
            return { success: false, message: "User already exists" };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
            role: "user",
            avatar: `https://placehold.co/150x150/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${name.substring(0, 2).toUpperCase()}`,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        };

        MOCK_USERS.push(newUser);

        const token = btoa(
            JSON.stringify({ id: newUser.id, email: newUser.email })
        );
        const userData = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            avatar: newUser.avatar,
            color: newUser.color,
        };

        Cookies.set("auth-token", token, { expires: 7 });
        Cookies.set("user-data", JSON.stringify(userData), { expires: 7 });

        return { success: true, user: userData, token };
    },

    logout() {
        Cookies.remove("auth-token");
        Cookies.remove("user-data");
    },

    getCurrentUser() {
        const token = Cookies.get("auth-token");
        const userData = Cookies.get("user-data");

        if (token && userData) {
            return JSON.parse(userData);
        }

        return null;
    },

    isAuthenticated() {
        return !!Cookies.get("auth-token");
    },
};