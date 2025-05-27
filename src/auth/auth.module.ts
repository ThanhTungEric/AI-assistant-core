import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Session } from "./session";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), PassportModule.register({ session: true }),],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, Session],
})
export class AuthModule {}