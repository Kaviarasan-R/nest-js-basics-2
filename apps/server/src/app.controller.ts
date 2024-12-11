import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthGuard } from "@nestjs/passport";
import {
  AuthService,
  GoogleOAuthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
} from "@turborepo/auth";
import { Request as ExpressRequest, Response } from "express";
import { MailsService } from "./mails/mails.service";
import { ClientAuthGuard } from "./client-auth.guard";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailsService: MailsService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello() {
    return "Hello World";
  }

  @Get("create-gmeet")
  async createGmeet() {
    return this.appService.startSpace();
  }

  // Not working
  @Get("send-mail-using-oauth2")
  async sendMailUsingOAuth2() {
    return this.mailsService.sendMailOAuth2();
  }

  @Get("send-mail-using-pwd")
  async sendMailUsingPwd() {
    return this.mailsService.sendMailWithTemplate();
  }

  @UseGuards(AuthGuard("local"))
  @Post("auth/local/v1")
  loginLocal(@Request() req: any) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post("auth/local/v2")
  loginLocalAuthGuard(@Request() req: any) {
    return req.user;
  }

  // This will automatically validateUser & return accessToken
  @UseGuards(LocalAuthGuard)
  @Post("auth/jwt")
  loginJwt(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("auth/jwt/profile")
  jwtGetProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post("auth/session")
  loginSession(
    @Req() req: ExpressRequest,
    @Session() session: Record<string, any>
  ): string {
    session.user = req.user;
    return this.appService.getHello();
  }

  @Get("auth/session/profile")
  sessionGetProfile(
    @Req() req: ExpressRequest,
    @Session() session: Record<string, any>
  ) {
    if (!session.user) {
      throw new UnauthorizedException();
    }
    return req.user;
  }

  @Get("google")
  @UseGuards(ClientAuthGuard, GoogleOAuthGuard)
  async googleAuth(@Request() req: any) {}

  @Get("auth/google/callback")
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(
    @Req() req: ExpressRequest,
    @Res() res: Response,
    @Session() session: Record<string, any>
  ) {
    session.user = req.user;
    this.appService.getHello();
    return res.redirect("http://localhost:5173/");
  }

  @Get("auth/google/profile")
  googleGetProfile(
    @Req() req: ExpressRequest,
    @Session() session: Record<string, any>
  ) {
    if (!session.user) {
      throw new UnauthorizedException();
    }
    return req.user;
  }
}
