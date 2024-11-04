import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class ClientAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientToken = request.query.token;
    const referrer = request.get("referrer");
    console.log(clientToken, referrer);
    return referrer === "http://localhost:3000/" && clientToken === "test";
  }
}
