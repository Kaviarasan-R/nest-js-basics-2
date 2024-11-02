import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailsService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendMailOAuth2() {
    try {
      const CLIENT_ID = this.configService.get<string>(
        'GOOGLE_GMAIL_CLIENT_ID',
      );
      const CLIENT_SECRET = this.configService.get<string>(
        'GOOGLE_GMAIL_CLIENT_SECRET',
      );
      const REFRESH_TOKEN = this.configService.get<string>(
        'GOOGLE_GMAIL_REFRESH_TOKEN',
      );
      const REDIRECT_URI = this.configService.get<string>(
        'GOOGLE_GMAIL_REDIRECT_URI',
      );

      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
      );
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

      const { token: ACCESS_TOKEN } = await oAuth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get<string>('MAIL_FROM'),
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN,
        },
      });

      const result = await transporter.sendMail({
        from: 'Test' + this.configService.get<string>('MAIL_FROM'),
        to: this.configService.get<string>('MAIL_TO'),
        subject: 'Hello from gmail using API',
        text: 'I hope this message gets through!',
        html: '<h1>Hello World</h1>',
      });

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendMailWithTemplate(): Promise<string> {
    const emailSent = await this.mailerService.sendMail({
      to: this.configService.get<string>('MAIL_TO'),
      from: this.configService.get<string>('MAIL_FROM'),
      subject: 'Test email from NestJS!',
      template: 'index',
      context: {
        code: 'cf1a3f828287',
        username: 'john doe',
      },
    });
    return emailSent;
  }

  async sendMailWithoutTemplate(): Promise<string> {
    const emailSent = await this.mailerService.sendMail({
      to: this.configService.get<string>('MAIL_TO'),
      from: this.configService.get<string>('MAIL_FROM'),
      subject: 'Test email from NestJS!',
      text: 'welcome',
      html: '<b>welcome</b>',
    });
    return emailSent;
  }
}
