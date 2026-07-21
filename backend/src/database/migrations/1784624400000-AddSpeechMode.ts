import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpeechMode1784624400000 implements MigrationInterface {
  name = 'AddSpeechMode1784624400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "speeches" ADD "mode" varchar(16) NOT NULL DEFAULT 'standard'`);
    await queryRunner.query(`ALTER TABLE "speeches" ADD CONSTRAINT "CHK_speeches_mode" CHECK ("mode" IN ('standard', 'word'))`);
    await queryRunner.query(`CREATE INDEX "IDX_speeches_mode_completed" ON "speeches" ("mode", "completed_at" DESC)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_speeches_mode_completed"`);
    await queryRunner.query(`ALTER TABLE "speeches" DROP CONSTRAINT "CHK_speeches_mode"`);
    await queryRunner.query(`ALTER TABLE "speeches" DROP COLUMN "mode"`);
  }
}
