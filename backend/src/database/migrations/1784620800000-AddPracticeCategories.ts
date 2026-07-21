import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPracticeCategories1784620800000 implements MigrationInterface {
  name = 'AddPracticeCategories1784620800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "categories" ("id", "name", "description", "color", "display_order") VALUES ('work_learning', '仕事・学び', '仕事、キャリア、勉強、成長に関する話題', '#4f8cff', 7), ('relationships', '人間関係', '家族、友人、対話、信頼に関する話題', '#67a3ff', 8), ('entertainment_culture', 'エンタメ・文化', '映画、音楽、本、ゲーム、芸術、文化に関する話題', '#7c8cff', 9), ('debate', '賛否・ディベート', '身近なテーマについて賛否と理由を考える話題', '#4cb7d8', 10)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "categories" WHERE "id" IN ('work_learning', 'relationships', 'entertainment_culture', 'debate')`);
  }
}
