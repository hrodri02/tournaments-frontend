export interface AuthResponse {
    token: string;
    user: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface MockUser extends User {
    password: string
}