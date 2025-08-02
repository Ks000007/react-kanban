import Cookies from "js-cookie";

// Mock users database
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@kanban.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@kanban.com",
    password: "user123",
    name: "Regular User",
    role: "user",
  },
];

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
