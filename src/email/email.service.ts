import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private nodemailerTransport: Mail;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
        ) {
        this.nodemailerTransport = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
            },
        });
    }

    private sendMail(options: Mail.Options) {
        this.logger.log('Email sent out to', options.to);
        return this.nodemailerTransport.sendMail(options);
    }

    public async decodeConfirmationToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET')
            });

            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email;
            }
            throw new BadRequestException();
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException(
                    'Email confirmation token expired'
                );
            }
            throw new BadRequestException('Bad confirmation token');
        }
    }

    public async sendResetPasswordLink(email: string): Promise<void> {
        const payload = { email };

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
        });

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        user.resetToken = token;

        const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;

        const text = `Hi, \nTo reset your password, click here: ${url}`;

        return this.sendMail({
            to: email,
            subject: 'Reset password',
            text
        });
    }
}