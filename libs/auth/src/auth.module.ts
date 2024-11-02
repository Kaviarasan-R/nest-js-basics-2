import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "./users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./passport-local/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./passport-jwt/jwt.strategy";
import { GoogleStrategy } from "./passport-google/google.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
