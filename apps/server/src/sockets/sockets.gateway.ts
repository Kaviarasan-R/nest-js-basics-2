import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketClientAuthGuard } from './sockets.guard';

@WebSocketGateway(5000, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
  namespace: 'counts',
  transports: ['websocket'],
})
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(SocketClientAuthGuard)
  @SubscribeMessage('events')
  getCount(
    @MessageBody() data: any,
    @MessageBody('count') count: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.request.user) {
      throw new UnauthorizedException();
    }
    console.log(data);
    client.emit('events', { acknowledge: true });
    return data;
  }
}
