import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    @Inject(ConfigService)
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_GMAIL_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_GMAIL_CLIENT_SECRET"),
      callbackURL:
        configService.get<string>("APP_URL") +
        configService.get<string>("GOOGLE_PASSPORT_REDIRECT_URI"),
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/meetings.space.created",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
