import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export class SessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    console.log('SessionGuard activated');

    if (!req.session || !req.session.user) {
        throw new UnauthorizedException('Session expired or user not logged in');
    }

    return true;
    }
}
