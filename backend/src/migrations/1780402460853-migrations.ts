import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1780402460853 implements MigrationInterface {
    name = 'Migrations1780402460853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "round_participant" ("id" SERIAL NOT NULL, "performance" integer NOT NULL, "stats" jsonb, "roundId" integer, "participantId" integer, CONSTRAINT "PK_29e7e0bd53cd2a71ce0c32f957f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stage" ALTER COLUMN "roundType" SET DEFAULT 'HEAD_TO_HEAD'`);
        await queryRunner.query(`ALTER TABLE "round_participant" ADD CONSTRAINT "FK_ebe74c6e1fa32506d4754f0aab8" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round_participant" ADD CONSTRAINT "FK_b83aa4e17474721687b90070604" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "round_participant" DROP CONSTRAINT "FK_b83aa4e17474721687b90070604"`);
        await queryRunner.query(`ALTER TABLE "round_participant" DROP CONSTRAINT "FK_ebe74c6e1fa32506d4754f0aab8"`);
        await queryRunner.query(`ALTER TABLE "stage" ALTER COLUMN "roundType" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "round_participant"`);
    }

}
