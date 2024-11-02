import { CacheModule, CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { DynamicModule, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      url: configService.get<string>("REDIS_URL"),
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

@Global()
export class RedisModule {
  static register(): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync(RedisOptions),
      ],
      global: true,
    };
  }
}
