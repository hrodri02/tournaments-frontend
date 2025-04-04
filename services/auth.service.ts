import {AuthResponse, MockUser} from "@/entities/auth";

const mockUsers: MockUser[] = [
    {id: 1, name: "Brayan Rodriguez", email: "brayan.rodriguez@example.com", password: "password1"},
    {id: 2, name: "One Punch Man", email: "one.punch@example.com", password: "password2"}
];

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                resolve({token: "fake-jwt-token", user: {id: user.id, name: user.name, email: user.email}});
            } else {
                reject(new Error("Invalid credentials"));
            }
        }, 1000);
    });
    
};

export const signup = async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userExists = mockUsers.some(u => u.email === email);
            if (userExists) {
                reject(new Error("User already exists"));
            } else {
                const newUser: MockUser = {id: mockUsers.length + 1, name: "", email, password};
                mockUsers.push(newUser);
                resolve({token: "fake-jwt-token", user: {id: newUser.id, name: newUser.name, email: newUser.email}});
            }
        }, 1000);
    });
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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({message: "Logout successful"})
        }, 1000)
    })
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
