// src/express.d.ts
import 'express-session';
import { User } from './user/user.entity';

declare module 'express-session' {
    interface Request {
        user: User;
    }
}

