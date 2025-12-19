import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766142707831 implements MigrationInterface {
    name = 'Migrations1766142707831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stage" ADD "isGroupStage" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "isGroupStage"`);
    }

}
