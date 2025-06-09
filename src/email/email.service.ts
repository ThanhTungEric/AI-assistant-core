import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
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
                secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
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

    public async sendResetPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Generate dummy temporary password
        const generateRandomPassword = (length = 12): string => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
            let password = '';
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        };

        const dummyPassword = generateRandomPassword();

        const payload = { email };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET')
        });

        // Tracking expiry
        const expiresAt = new Date(Date.now() + 60 * 1000);

        // Update user with dummy password and token
        user.password = await bcrypt.hash(dummyPassword, 10);
        user.resetToken = token;
        user.resetTokenExpiresAt = expiresAt;

        await this.userRepository.save(user);

        // Compose the email
        const text = `Welcome,\n\nYour temporary password is: ${dummyPassword}\n\nThis password is valid until:  ${expiresAt.toISOString()}. Please log in and change your password as soon as possible.`;

        this.sendMail({
            to: email,
            subject: 'Your Temporary Password',
            text
        }).catch(err => {
            this.logger.error('Failed to send email:', err);
        });
    }

}