export class ProfileResponse {
    message: string;

    user: {
        id: number;
        email: string;
        fullName: string;
    };
}
