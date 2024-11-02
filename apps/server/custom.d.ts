import { IncomingMessage } from 'http';

declare module 'http' {
  interface IncomingMessage {
    user?: any;
  }
}
