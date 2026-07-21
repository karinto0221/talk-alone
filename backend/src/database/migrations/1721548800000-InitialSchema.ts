import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1721548800000 implements MigrationInterface {
  name = 'InitialSchema1721548800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "categories" ("id" varchar(32) NOT NULL, "name" varchar(64) NOT NULL, "description" varchar(255) NOT NULL, "color" varchar(16) NOT NULL, "display_order" smallint NOT NULL, CONSTRAINT "PK_categories" PRIMARY KEY ("id"), CONSTRAINT "UQ_categories_name" UNIQUE ("name"))`);
    await queryRunner.query(`CREATE TABLE "speeches" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "topic" varchar(200) NOT NULL, "category_id" varchar(32) NOT NULL, "duration_seconds" smallint NOT NULL, "help_count" smallint NOT NULL DEFAULT 0, "completed_at" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "PK_speeches" PRIMARY KEY ("id"), CONSTRAINT "CHK_speeches_duration" CHECK ("duration_seconds" BETWEEN 1 AND 180), CONSTRAINT "CHK_speeches_help_count" CHECK ("help_count" >= 0), CONSTRAINT "FK_speeches_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT)`);
    await queryRunner.query('CREATE INDEX "IDX_speeches_completed_at" ON "speeches" ("completed_at" DESC)');
    await queryRunner.query('CREATE INDEX "IDX_speeches_category_completed" ON "speeches" ("category_id", "completed_at" DESC)');
    await queryRunner.query(`INSERT INTO "categories" ("id", "name", "description", "color", "display_order") VALUES ('daily', '日常・暮らし', '身近な習慣、食べ物、生活の話題', '#38bdf8', 1), ('favorites', '好きなもの', '趣味、動物、作品、こだわり', '#818cf8', 2), ('memories', '思い出・経験', '過去の体験、学び、印象的な出来事', '#2dd4bf', 3), ('imagination', 'もしも・想像', '自由な発想で考える仮定の話題', '#a78bfa', 4), ('values', '価値観・思考', '人生観、選択、考え方を深める話題', '#60a5fa', 5), ('society', '社会・未来', '世の中、技術、これからの暮らし', '#22d3ee', 6)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "speeches"');
    await queryRunner.query('DROP TABLE "categories"');
  }
}
