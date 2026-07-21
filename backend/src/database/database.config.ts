import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import type { ConfigService } from "@nestjs/config";

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: "postgres",
  host: config.getOrThrow<string>("DB_HOST"),
  port: Number(config.getOrThrow<string>("DB_PORT")),
  username: config.getOrThrow<string>("DB_USER"),
  password: config.getOrThrow<string>("DB_PASSWORD"),
  database: config.getOrThrow<string>("DB_NAME"),
  autoLoadEntities: true,
  synchronize: false,
});
