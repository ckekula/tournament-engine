import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1780408043886 implements MigrationInterface {
    name = 'Migrations1780408043886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_f60e7ec17d47c76eeba2df8772"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "isGroupStage"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "isGroupStage" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_f60e7ec17d47c76eeba2df8772" ON "stage" ("isGroupStage") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_f60e7ec17d47c76eeba2df8772"`);
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "isGroupStage"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "isGroupStage" boolean NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_f60e7ec17d47c76eeba2df8772" ON "stage" ("isGroupStage") `);
    }

}
