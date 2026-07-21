import "reflect-metadata";
import { config } from "dotenv";
import { DataSource } from "typeorm";
import { CategoryEntity } from "../categories/category.entity";
import { SpeechEntity } from "../speeches/speech.entity";

config({ path: ["../.env", ".env"] });

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

export default new DataSource({
  type: "postgres",
  host: required("DB_HOST"),
  port: Number(required("DB_PORT")),
  username: required("DB_USER"),
  password: required("DB_PASSWORD"),
  database: required("DB_NAME"),
  entities: [CategoryEntity, SpeechEntity],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
});
