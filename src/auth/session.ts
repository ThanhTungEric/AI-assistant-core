import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class Session extends PassportSerializer {
    serializeUser(user: any, done: (err: Error | null, user: any) => void): void {
        done(null, user);
    }

    deserializeUser(payload: string, done: (err: Error | null, payload: string) => void): void {
        done(null, payload);
    }
}