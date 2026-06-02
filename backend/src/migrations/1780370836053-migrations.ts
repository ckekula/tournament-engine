import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1780370836053 implements MigrationInterface {
    name = 'Migrations1780370836053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "round" ADD "groupType" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "round" ADD "groupId" integer`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "order" integer`);
        await queryRunner.query(`CREATE TYPE "public"."stage_roundtype_enum" AS ENUM('SOLO', 'HEAD_TO_HEAD', 'MULTI_COMPETITOR')`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "roundType" "public"."stage_roundtype_enum" NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2c20eb8d6fcbc5af15818a156"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "type" boolean NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c8ad0730f9e7acef9724abcac6" ON "round" ("groupType") `);
        await queryRunner.query(`CREATE INDEX "IDX_b2c20eb8d6fcbc5af15818a156" ON "stage" ("type") `);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_64e62384f9a316b594e9541c5ff" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_64e62384f9a316b594e9541c5ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2c20eb8d6fcbc5af15818a156"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8ad0730f9e7acef9724abcac6"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_b2c20eb8d6fcbc5af15818a156" ON "stage" ("type") `);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "roundType"`);
        await queryRunner.query(`DROP TYPE "public"."stage_roundtype_enum"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "round" DROP COLUMN "groupId"`);
        await queryRunner.query(`ALTER TABLE "round" DROP COLUMN "groupType"`);
    }

}
