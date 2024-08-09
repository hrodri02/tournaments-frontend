import {AuthResponse, MockUser} from "@/entities/auth.types";

const mockUsers: MockUser[] = [
    {id: 1, name: "Brayan Rodriguez", email: "brayan.rodriguez@example.com", password: "password1"},
    {id: 2, name: "One Punch Man", email: "one.punch@example.com", password: "password2"}
];

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
        return {token: "fake-jwt-token", user: {id: user.id, name: user.name, email: user.email}};
    } else {
        throw new Error("Invalid credentials");
    }
};

export const signup = async (email: string, password: string): Promise<AuthResponse> => {
    const userExists = mockUsers.some(u => u.email === email);
    if (userExists) {
        throw new Error("User already exists");
    } else {
        const newUser: MockUser = {id: mockUsers.length + 1, name: "", email, password};
        mockUsers.push(newUser);
        return {token: "fake-jwt-token", user: {id: newUser.id, name: newUser.name, email: newUser.email}};
    }
};

export const resetPassword = async (email: string, newPassword: string): Promise<{ message: string }> => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
        user.password = newPassword;
        return {message: "Password reset successful"};
    } else {
        throw new Error("User not found");
    }
};

export const logout = async (): Promise<{ message: string }> => {
    return {message: "Logout successful"};
};

export const changePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<{
    message: string
}> => {
    const user = mockUsers.find(u => u.id === userId && u.password === oldPassword);
    if (user) {
        user.password = newPassword;
        return {message: "Password change successful"};
    } else {
        throw new Error("Invalid user");
    }
};
