import { MigrationInterface, QueryRunner } from "typeorm";

export class PolymorphicGroupStage1758040534203 implements MigrationInterface {
    name = 'PolymorphicGroupStage1758040534203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "round" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "stageId" integer, CONSTRAINT "PK_34bd959f3f4a90eb86e4ae24d2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "groupStageId" integer, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "format"`);
        await queryRunner.query(`CREATE TYPE "public"."stage_format_enum" AS ENUM('Single Elimination', 'Double Elimination', 'Round Robin', 'Swiss System', 'Ladder System')`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "format" "public"."stage_format_enum" NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_b2c20eb8d6fcbc5af15818a156" ON "stage" ("type") `);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_60d74f65cc5611b2a646c1cfd28" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_83f58826830ee93ac0ff53a036c" FOREIGN KEY ("groupStageId") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_83f58826830ee93ac0ff53a036c"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_60d74f65cc5611b2a646c1cfd28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2c20eb8d6fcbc5af15818a156"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "format"`);
        await queryRunner.query(`DROP TYPE "public"."stage_format_enum"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "format" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "round"`);
    }

}
