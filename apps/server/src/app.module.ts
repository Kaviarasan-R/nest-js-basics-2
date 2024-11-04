import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AuthModule } from "@turborepo/auth";
import { RedisModule } from "@turborepo/utils";
import { MailsModule } from "./mails/mails.module";
import { MailsService } from "./mails/mails.service";
import { SocketsModule } from "./sockets/sockets.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, "../../../../../", ".env"),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../../../", "client"),
    }),
    RedisModule.register(),
    AuthModule,
    MailsModule,
    SocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailsService],
})
export class AppModule {}
