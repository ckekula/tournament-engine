import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1780371006786 implements MigrationInterface {
    name = 'Migrations1780371006786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c8ad0730f9e7acef9724abcac6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2c20eb8d6fcbc5af15818a156"`);
        await queryRunner.query(`ALTER TABLE "round" RENAME COLUMN "groupType" TO "isGroupRound"`);
        await queryRunner.query(`ALTER TABLE "stage" RENAME COLUMN "type" TO "isGroupStage"`);
        await queryRunner.query(`CREATE INDEX "IDX_635120b2423cf27f156883dbc4" ON "round" ("isGroupRound") `);
        await queryRunner.query(`CREATE INDEX "IDX_f60e7ec17d47c76eeba2df8772" ON "stage" ("isGroupStage") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_f60e7ec17d47c76eeba2df8772"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_635120b2423cf27f156883dbc4"`);
        await queryRunner.query(`ALTER TABLE "stage" RENAME COLUMN "isGroupStage" TO "type"`);
        await queryRunner.query(`ALTER TABLE "round" RENAME COLUMN "isGroupRound" TO "groupType"`);
        await queryRunner.query(`CREATE INDEX "IDX_b2c20eb8d6fcbc5af15818a156" ON "stage" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_c8ad0730f9e7acef9724abcac6" ON "round" ("groupType") `);
    }

}
