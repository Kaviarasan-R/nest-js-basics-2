import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class SocketClientAuthGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const cookies = cookie.parse(client.handshake.headers.cookie || '');
    const sessionId = cookieParser.signedCookie(
      cookies['connect.sid'],
      process.env.SESSION_SECRET,
    );
    console.log('SESSION ID', sessionId);
    if (!sessionId) {
      throw new UnauthorizedException();
    }

    const user = await this.cacheManager.get(`session:${sessionId}`);

    if (!user) {
      throw new UnauthorizedException();
    }

    console.log('USER', user);
    client.request.user = user;
    return true;
  }
}
