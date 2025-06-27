import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/email/email.module";
import { User } from "src/user/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Session } from "./session";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), PassportModule.register({ session: true }),
        EmailModule, JwtModule.register({
            secret: '1234',
            signOptions: { expiresIn: '1h' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, Session],
})
export class AuthModule {}