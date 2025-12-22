import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766408645578 implements MigrationInterface {
    name = 'Migrations1766408645578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "displayName" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "displayName"`);
    }

}
