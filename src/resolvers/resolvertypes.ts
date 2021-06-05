import { User } from '@prisma/client';

export interface UserResponse {
    error: string | null;
    user: Omit<User, 'password'> | null;
}

export interface LoginInput {
    username: string;
    password: string;
}

export interface RegisterInput extends LoginInput {
    name: string;
}
