export class LoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
}

export class RegisterResponse {
    message: string;
    user: {
        id: number;
        email: string;
        fullName: string;
    };
}

export class ProfileResponse {
    message: string;
    user: {
        id: number;
        email: string;
        fullName: string;
    };
}