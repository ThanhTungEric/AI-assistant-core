import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

export function getSafeUser(req: Request): Pick<User, 'id' | 'email' | 'fullName'> {
    const user = req.user as User;
    if (!user) throw new NotFoundException('User not logged in');
    const { id, email, fullName } = user;
    return { id, email, fullName };
}