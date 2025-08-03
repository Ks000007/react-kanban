import Cookies from "js-cookie";

// Helper function to generate a random hex color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Helper function to get initials from a name
const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    let initials = '';
    if (parts.length > 0 && parts[0].length > 0) {
        initials += parts[0][0];
    }
    if (parts.length > 1 && parts[1].length > 0) {
        initials += parts[1][0];
    }
    return initials.toUpperCase();
};

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
        role: "developer",
        avatar: "https://placehold.co/150x150/87ceeb/ffffff?text=RU",
        color: "#87ceeb",
    },
    {
        id: "3",
        email: "shreyashkars172@gmail.com",
        password: "password",
        name: "Kushagra Shreyashkar",
        role: "designer",
        avatar: "https://placehold.co/150x150/9370db/ffffff?text=KS",
        color: "#9370db",
    },
    {
        id: "4",
        email: "john.smith@kanban.com",
        password: "john123",
        name: "John Smith",
        role: "manager",
        avatar: "https://placehold.co/150x150/ff4500/ffffff?text=JS",
        color: "#ff4500",
    },
];

export { MOCK_USERS };

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
    async login(email, password) {
        await delay(1000);

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

            Cookies.set("auth-token", token, { expires: 7 });
            Cookies.set("user-data", JSON.stringify(userData), { expires: 7 });

            return { success: true, user: userData, token };
        }

        return { success: false, message: "Invalid email or password" };
    },

    async register(email, password, name, role = "developer") {
        await delay(1000);

        const existingUser = MOCK_USERS.find((u) => u.email === email);
        if (existingUser) {
            return { success: false, message: "User already exists" };
        }

        const randomColor = getRandomColor();
        const initials = getInitials(name);

        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
            role: role,
            avatar: `https://placehold.co/150x150/${randomColor}/ffffff?text=${initials}`,
            color: `#${randomColor}`,
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

    async updateUser(userId, updatedUser) {
        await delay(500);
        const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            MOCK_USERS[userIndex] = {
                ...MOCK_USERS[userIndex],
                ...updatedUser,
                password: updatedUser.password || MOCK_USERS[userIndex].password,
            };

            const userData = {
                id: MOCK_USERS[userIndex].id,
                email: MOCK_USERS[userIndex].email,
                name: MOCK_USERS[userIndex].name,
                role: MOCK_USERS[userIndex].role,
                avatar: MOCK_USERS[userIndex].avatar,
                color: MOCK_USERS[userIndex].color,
            };
            Cookies.set("user-data", JSON.stringify(userData), { expires: 7 });
            return { success: true, user: userData };
        }
        return { success: false, message: "User not found" };
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